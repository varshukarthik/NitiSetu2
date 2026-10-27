"""Private object store facade.

The backend is chosen by configuration, not by call sites:
- `filesystem`: local encrypted disk store
- `database`: stores encrypted blobs inside relational DB
- `s3`: AWS S3, MinIO, LocalStack, or Cloudflare R2 with client-side AES-256-GCM encryption
"""

from __future__ import annotations

from sqlalchemy.orm import Session

from app.core.config import settings
from app.infrastructure.storage import db_store, local_store, s3_store

QUARANTINE_PREFIX = local_store.QUARANTINE_PREFIX
CLEAN_PREFIX = local_store.CLEAN_PREFIX
REJECTED_PREFIX = local_store.REJECTED_PREFIX


def _backend():
    if settings.storage_backend == "database":
        return db_store
    if settings.storage_backend == "s3":
        return s3_store
    return local_store


def backend_name() -> str:
    return settings.storage_backend


def build_quarantine_key(institution_id: str, extension: str = "pdf") -> str:
    return _backend().build_quarantine_key(institution_id, extension)


def put_object(key: str, payload: bytes, *, session: Session | None = None) -> int:
    backend = _backend()
    if backend is db_store:
        return db_store.put_object(key, payload, session=session)
    return backend.put_object(key, payload)


def read_object(key: str, *, session: Session | None = None) -> bytes:
    backend = _backend()
    if backend is db_store:
        return db_store.read_object(key, session=session)
    return backend.read_object(key)


def object_exists(key: str, *, session: Session | None = None) -> bool:
    backend = _backend()
    if backend is db_store:
        return db_store.object_exists(key, session=session)
    return backend.object_exists(key)


def object_size(key: str, *, session: Session | None = None) -> int:
    backend = _backend()
    if backend is db_store:
        return db_store.object_size(key, session=session)
    return backend.object_size(key)


def promote(key: str, *, to_prefix: str, session: Session | None = None) -> str:
    backend = _backend()
    if backend is db_store:
        return db_store.promote(key, to_prefix=to_prefix, session=session)
    return backend.promote(key, to_prefix=to_prefix)


def get_storage_health() -> dict:
    if settings.storage_backend == "s3":
        return s3_store.check_s3_connection()
    if settings.storage_backend == "database":
        return {
            "status": "HEALTHY",
            "backend": "database",
            "encryption": "AES-256-GCM",
        }
    return {
        "status": "HEALTHY",
        "backend": "filesystem",
        "storage_root": str(settings.storage_root),
        "encryption": "AES-256-GCM",
    }
