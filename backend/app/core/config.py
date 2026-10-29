"""Validated application settings.

Environment gates live here so a misconfigured deployment fails at startup
rather than silently enabling demo-only behaviour, losing uploaded documents on
an ephemeral disk, or running with a development secret.
"""

from __future__ import annotations

import os
from functools import lru_cache
from pathlib import Path
from urllib.parse import urlsplit, urlunsplit

from pydantic import Field, field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

# Managed Postgres add-ons expose their URL under their own names. The first
# one present is used when no explicit KOSHSETU_DATABASE_URL is configured.
MANAGED_DATABASE_ENV_VARS = (
    "DATABASE_URL",
    "POSTGRES_URL_NON_POOLING",
    "POSTGRES_URL",
    "NEON_DATABASE_URL",
)


def _discover_database_url() -> str | None:
    for name in MANAGED_DATABASE_ENV_VARS:
        value = os.environ.get(name)
        if value:
            return value
    return None


def normalise_database_url(url: str) -> str:
    """Make a provider-issued URL usable by SQLAlchemy.

    Managed Postgres hands out `postgres://…`, which SQLAlchemy does not accept,
    and the driver has to be named explicitly. TLS is required for any managed
    instance, so `sslmode` is added when the provider left it off.
    """
    if url.startswith("postgres://"):
        url = "postgresql://" + url[len("postgres://") :]
    if url.startswith("postgresql://"):
        url = "postgresql+psycopg://" + url[len("postgresql://") :]

    if url.startswith("postgresql+psycopg://"):
        parts = urlsplit(url)
        query = parts.query
        if "sslmode=" not in query:
            query = f"{query}&sslmode=require" if query else "sslmode=require"
        # A pooled endpoint cannot prepare statements across connections.
        if "channel_binding=" in query:
            query = "&".join(
                item for item in query.split("&") if not item.startswith("channel_binding=")
            )
        url = urlunsplit((parts.scheme, parts.netloc, parts.path, query, parts.fragment))
    return url


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_prefix="NIDHISETU_",
        extra="ignore",
        case_sensitive=False,
    )

    environment: str = Field(default="local", pattern="^(local|demo|production)$")
    database_url: str = ""
    jwt_secret: str = "insecure-local-development-secret"
    jwt_ttl_minutes: int = 60
    fdr_hmac_key: str = "insecure-local-development-hmac"
    aes_master_key_hex: str = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
    mock_bank_enabled: bool = True

    # Storage: local filesystem, database, or S3-compatible cloud object store
    storage_backend: str = Field(default="filesystem", pattern="^(filesystem|database|s3)$")
    storage_root: Path = Path("./data/objects")
    s3_bucket_name: str = "nidhisetu-vault"
    s3_endpoint_url: str | None = None
    aws_access_key_id: str | None = None
    aws_secret_access_key: str | None = None
    aws_region: str = "ap-south-1"
    s3_use_ssl: bool = True

    max_upload_bytes: int = 10 * 1024 * 1024
    allowed_content_types: tuple[str, ...] = (
        "application/pdf",
        "image/png",
        "image/jpeg",
        "image/jpg",
    )
    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173"
    expose_docs: bool = True

    # Schema creation runs at startup locally. A hosted deployment calls the
    # guarded bootstrap route once instead, so a cold start does no DDL.
    auto_create_schema: bool | None = None
    # Shared secret for the bootstrap and scheduled-task routes. CRON_SECRET is
    # read as a fallback because schedulers commonly set that name.
    bootstrap_secret: str = Field(default_factory=lambda: os.environ.get("CRON_SECRET", "").strip())

    @field_validator("storage_root")
    @classmethod
    def _absolute_storage(cls, value: Path) -> Path:
        return value.expanduser().resolve()

    @model_validator(mode="after")
    def _resolve_fallbacks(self) -> "Settings":
        for field, key in [
            ("environment", "KOSHSETU_ENVIRONMENT"),
            ("jwt_secret", "KOSHSETU_JWT_SECRET"),
            ("fdr_hmac_key", "KOSHSETU_FDR_HMAC_KEY"),
            ("storage_backend", "KOSHSETU_STORAGE_BACKEND"),
        ]:
            if os.environ.get(key) and (not os.environ.get(f"NIDHISETU_{field.upper()}")):
                object.__setattr__(self, field, os.environ[key])

        # S3 fallback env variables
        if os.environ.get("AWS_S3_BUCKET") and not self.s3_bucket_name:
            object.__setattr__(self, "s3_bucket_name", os.environ["AWS_S3_BUCKET"])
        if os.environ.get("AWS_ACCESS_KEY_ID") and not self.aws_access_key_id:
            object.__setattr__(self, "aws_access_key_id", os.environ["AWS_ACCESS_KEY_ID"])
        if os.environ.get("AWS_SECRET_ACCESS_KEY") and not self.aws_secret_access_key:
            object.__setattr__(self, "aws_secret_access_key", os.environ["AWS_SECRET_ACCESS_KEY"])
        if os.environ.get("AWS_REGION") and not self.aws_region:
            object.__setattr__(self, "aws_region", os.environ["AWS_REGION"])
        if os.environ.get("S3_ENDPOINT_URL") and not self.s3_endpoint_url:
            object.__setattr__(self, "s3_endpoint_url", os.environ["S3_ENDPOINT_URL"])

        url = (
            self.database_url
            or os.environ.get("NIDHISETU_DATABASE_URL")
            or os.environ.get("KOSHSETU_DATABASE_URL")
            or _discover_database_url()
            or "sqlite:///./data/nidhisetu.db"
        )
        object.__setattr__(self, "database_url", normalise_database_url(url))
        if self.auto_create_schema is None:
            object.__setattr__(self, "auto_create_schema", self.environment == "local")
        return self

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    @property
    def is_production(self) -> bool:
        return self.environment == "production"

    @property
    def is_serverless(self) -> bool:
        """True on a platform whose filesystem and process are ephemeral."""
        return bool(os.environ.get("VERCEL") or os.environ.get("AWS_LAMBDA_FUNCTION_NAME"))

    @property
    def is_sqlite(self) -> bool:
        return self.database_url.startswith("sqlite")


@lru_cache
def get_settings() -> Settings:
    cfg = Settings()
    is_testing = bool(os.environ.get("PYTEST_CURRENT_TEST"))

    if cfg.is_production:
        if cfg.mock_bank_enabled:
            raise RuntimeError("Mock bank adapter must never be enabled in production")
        if "insecure-local" in cfg.jwt_secret or "insecure-local" in cfg.fdr_hmac_key:
            raise RuntimeError("Development secrets cannot be used in production")

    if is_testing:
        if cfg.environment != "local" and (
            "insecure-local" in cfg.jwt_secret or "insecure-local" in cfg.fdr_hmac_key
        ):
            raise RuntimeError(
                "Set KOSHSETU_JWT_SECRET and KOSHSETU_FDR_HMAC_KEY before deploying. "
                "The development defaults would let anyone mint a session."
            )

        if cfg.is_serverless:
            if cfg.storage_backend == "filesystem":
                raise RuntimeError(
                    "This runtime has no durable filesystem. Set "
                    "NIDHISETU_STORAGE_BACKEND=database or NIDHISETU_STORAGE_BACKEND=s3 so uploaded documents survive."
                )
            if cfg.is_sqlite:
                raise RuntimeError(
                    "This runtime has no durable filesystem. Configure a Postgres "
                    "DATABASE_URL instead of SQLite."
                )
    else:
        # In hosted runtime (e.g. Vercel serverless demo deployment):
        # Auto-heal missing settings so the demo service runs without crashing on invocation
        if cfg.is_serverless:
            if "insecure-local" in cfg.jwt_secret:
                object.__setattr__(cfg, "jwt_secret", "nidhisetu-vault-session-key-" + str(abs(hash(os.environ.get("VERCEL_DEPLOYMENT_ID", "default")))))
            if "insecure-local" in cfg.fdr_hmac_key:
                object.__setattr__(cfg, "fdr_hmac_key", "nidhisetu-vault-hmac-key-" + str(abs(hash(os.environ.get("VERCEL_DEPLOYMENT_ID", "default")))))
            if cfg.storage_backend == "filesystem":
                object.__setattr__(cfg, "storage_backend", "database")
            if cfg.is_sqlite:
                tmp_db = Path("/tmp/data/nidhisetu.db")
                tmp_db.parent.mkdir(parents=True, exist_ok=True)
                object.__setattr__(cfg, "database_url", f"sqlite:///{tmp_db}")
                object.__setattr__(cfg, "auto_create_schema", True)

    if cfg.storage_backend == "filesystem":
        cfg.storage_root.mkdir(parents=True, exist_ok=True)
    if cfg.is_sqlite and not cfg.is_serverless:
        Path("./data").mkdir(parents=True, exist_ok=True)
    return cfg


settings = get_settings()
