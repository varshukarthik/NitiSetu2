"""S3-compatible object store backend for NIDHISETU.

Supports AWS S3, MinIO, LocalStack, and Cloudflare R2.
Documents are encrypted client-side using AES-256-GCM before transmission
to the S3 bucket, ensuring zero plaintext exposure even at rest in cloud storage.
"""

from __future__ import annotations

import io
import logging
from uuid import uuid4

import boto3
from botocore.config import Config
from botocore.exceptions import ClientError

from app.core.config import settings
from app.core.security import decrypt_aes_gcm, encrypt_aes_gcm

logger = logging.getLogger(__name__)

QUARANTINE_PREFIX = "quarantine"
CLEAN_PREFIX = "clean"
REJECTED_PREFIX = "rejected"


def _get_s3_client():
    client_kwargs = {
        "region_name": settings.aws_region or "ap-south-1",
        "config": Config(signature_version="s3v4", s3={"addressing_style": "virtual"}),
    }
    if settings.aws_access_key_id and settings.aws_secret_access_key:
        client_kwargs["aws_access_key_id"] = settings.aws_access_key_id
        client_kwargs["aws_secret_access_key"] = settings.aws_secret_access_key
    if settings.s3_endpoint_url:
        client_kwargs["endpoint_url"] = settings.s3_endpoint_url
        client_kwargs["config"] = Config(
            signature_version="s3v4", s3={"addressing_style": "path"}
        )

    return boto3.client("s3", **client_kwargs)


def _ensure_bucket(s3_client) -> None:
    bucket = settings.s3_bucket_name
    try:
        s3_client.head_bucket(Bucket=bucket)
    except ClientError as e:
        error_code = e.response.get("Error", {}).get("Code")
        if error_code in {"404", "NoSuchBucket"}:
            try:
                region = settings.aws_region or "ap-south-1"
                if region == "us-east-1":
                    s3_client.create_bucket(Bucket=bucket)
                else:
                    s3_client.create_bucket(
                        Bucket=bucket,
                        CreateBucketConfiguration={"LocationConstraint": region},
                    )
                logger.info("Created S3 bucket: %s", bucket)
            except Exception as create_err:
                logger.warning("Could not auto-create S3 bucket %s: %s", bucket, create_err)
        else:
            logger.warning("Error checking S3 bucket %s: %s", bucket, e)


def build_quarantine_key(institution_id: str, extension: str = "pdf") -> str:
    return f"{QUARANTINE_PREFIX}/{settings.environment}/{institution_id}/{uuid4()}.{extension}"


def put_object(key: str, payload: bytes) -> int:
    """Encrypts payload with AES-256-GCM and stores in S3 bucket."""
    s3 = _get_s3_client()
    master_key = (
        bytes.fromhex(settings.aes_master_key_hex)
        if getattr(settings, "aes_master_key_hex", None)
        else None
    )
    encrypted_blob = encrypt_aes_gcm(payload, master_key)

    s3.put_object(
        Bucket=settings.s3_bucket_name,
        Key=key,
        Body=encrypted_blob,
        ContentType="application/octet-stream",
        Metadata={
            "nidhisetu-encrypted": "aes-256-gcm",
            "plaintext-bytes": str(len(payload)),
        },
    )
    return len(payload)


def read_object(key: str) -> bytes:
    """Reads object from S3 and decrypts with AES-256-GCM."""
    s3 = _get_s3_client()
    response = s3.get_object(Bucket=settings.s3_bucket_name, Key=key)
    raw_encrypted = response["Body"].read()

    master_key = (
        bytes.fromhex(settings.aes_master_key_hex)
        if getattr(settings, "aes_master_key_hex", None)
        else None
    )
    return decrypt_aes_gcm(raw_encrypted, master_key)


def object_exists(key: str) -> bool:
    s3 = _get_s3_client()
    try:
        s3.head_object(Bucket=settings.s3_bucket_name, Key=key)
        return True
    except ClientError:
        return False


def object_size(key: str) -> int:
    s3 = _get_s3_client()
    try:
        response = s3.head_object(Bucket=settings.s3_bucket_name, Key=key)
        metadata = response.get("Metadata", {})
        if "plaintext-bytes" in metadata:
            return int(metadata["plaintext-bytes"])
        return response.get("ContentLength", 0)
    except ClientError:
        return 0


def promote(key: str, *, to_prefix: str) -> str:
    """Promotes an object between S3 namespaces (e.g. quarantine -> clean)."""
    s3 = _get_s3_client()
    parts = key.split("/", 1)
    new_key = f"{to_prefix}/{parts[1]}" if len(parts) == 2 else f"{to_prefix}/{key}"

    bucket = settings.s3_bucket_name
    s3.copy_object(
        Bucket=bucket,
        CopySource={"Bucket": bucket, "Key": key},
        Key=new_key,
    )
    s3.delete_object(Bucket=bucket, Key=key)
    return new_key


def generate_presigned_url(key: str, expires_in: int = 300) -> str:
    """Generates short-lived presigned download URL."""
    s3 = _get_s3_client()
    return s3.generate_presigned_url(
        ClientMethod="get_object",
        Params={"Bucket": settings.s3_bucket_name, "Key": key},
        ExpiresIn=expires_in,
    )


def check_s3_connection() -> dict:
    """Verifies S3 connectivity and bucket status."""
    try:
        s3 = _get_s3_client()
        s3.head_bucket(Bucket=settings.s3_bucket_name)
        return {
            "status": "HEALTHY",
            "bucket": settings.s3_bucket_name,
            "region": settings.aws_region or "ap-south-1",
            "endpoint": settings.s3_endpoint_url or "AWS Standard S3",
            "encryption": "AES-256-GCM (client-side authenticated)",
        }
    except Exception as e:
        return {
            "status": "UNAVAILABLE",
            "bucket": settings.s3_bucket_name,
            "error": str(e),
            "fallback": "local_store (AES-256-GCM encrypted disk)",
        }
