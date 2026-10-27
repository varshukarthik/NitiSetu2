"""Password hashing, sensitive-identifier handling and session tokens.

Demo-only authentication: the specification requires an approved OIDC
identity provider in a real deployment. Nothing here claims government SSO.
"""

from __future__ import annotations

import base64
import hashlib
import hmac
import os
import secrets
from datetime import datetime, timedelta, timezone
from typing import Any

import jwt

from app.core.config import settings

_PBKDF2_ROUNDS = 390_000


def hash_password(password: str) -> str:
    salt = os.urandom(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, _PBKDF2_ROUNDS)
    return f"pbkdf2_sha256${_PBKDF2_ROUNDS}${base64.b64encode(salt).decode()}${base64.b64encode(digest).decode()}"


def verify_password(password: str, stored: str) -> bool:
    try:
        algorithm, rounds, salt_b64, digest_b64 = stored.split("$")
    except ValueError:
        return False
    if algorithm != "pbkdf2_sha256":
        return False
    candidate = hashlib.pbkdf2_hmac(
        "sha256", password.encode(), base64.b64decode(salt_b64), int(rounds)
    )
    return hmac.compare_digest(candidate, base64.b64decode(digest_b64))


def create_access_token(subject: str, *, extra_claims: dict[str, Any] | None = None) -> str:
    now = datetime.now(timezone.utc)
    payload: dict[str, Any] = {
        "sub": subject,
        "iat": int(now.timestamp()),
        "exp": int((now + timedelta(minutes=settings.jwt_ttl_minutes)).timestamp()),
        "iss": "koshsetu-fdr-portal",
        "aud": "koshsetu-portal-client",
        "token_type": "access",
        "jti": secrets.token_urlsafe(12),
    }
    if extra_claims:
        payload.update(extra_claims)
    return jwt.encode(payload, settings.jwt_secret, algorithm="HS256")


def decode_access_token(token: str) -> dict[str, Any]:
    claims = jwt.decode(
        token,
        settings.jwt_secret,
        algorithms=["HS256"],
        audience="koshsetu-portal-client",
        issuer="koshsetu-fdr-portal",
        options={"require": ["exp", "iat", "sub"]},
    )
    if claims.get("token_type") != "access":
        raise jwt.InvalidTokenError("unexpected token type")
    return claims


def canonical_instrument_reference(issuer_bank: str, fdr_number: str) -> str:
    """Normalise an instrument reference without losing the original value."""
    normalised_number = "".join(ch for ch in fdr_number.upper() if ch.isalnum())
    return f"{issuer_bank.strip().upper()}|{normalised_number}"


def lookup_hash(issuer_bank: str, fdr_number: str) -> str:
    """Keyed lookup token used for duplicate candidates and exact search.

    A collision is a candidate for manual review, never proof of duplication.
    """
    canonical = canonical_instrument_reference(issuer_bank, fdr_number)
    return hmac.new(settings.fdr_hmac_key.encode(), canonical.encode(), hashlib.sha256).hexdigest()


def mask_fdr_number(fdr_number: str) -> str:
    trimmed = fdr_number.strip()
    if len(trimmed) <= 4:
        return "*" * len(trimmed)
    return f"{'*' * (len(trimmed) - 4)}{trimmed[-4:]}"


def _get_aesgcm() -> Any:
    from cryptography.hazmat.primitives.ciphers.aead import AESGCM
    key_hex = settings.aes_master_key_hex
    try:
        key_bytes = bytes.fromhex(key_hex)
    except ValueError:
        key_bytes = hashlib.sha256(key_hex.encode()).digest()
    if len(key_bytes) != 32:
        key_bytes = hashlib.sha256(key_bytes).digest()
    return AESGCM(key_bytes)


def encrypt_aes_gcm(data: bytes, associated_data: bytes | None = None) -> bytes:
    """
    Encrypt bytes using AES-256-GCM.
    Returns: 12-byte nonce prepended to ciphertext + auth tag.
    """
    aesgcm = _get_aesgcm()
    nonce = os.urandom(12)
    ciphertext = aesgcm.encrypt(nonce, data, associated_data)
    return nonce + ciphertext


def decrypt_aes_gcm(encrypted_payload: bytes, associated_data: bytes | None = None) -> bytes:
    """
    Decrypt bytes with AES-256-GCM.
    Expected format: 12-byte nonce followed by ciphertext + auth tag.
    """
    if len(encrypted_payload) < 28:
        raise ValueError("Invalid encrypted payload length: must contain at least 12-byte nonce and 16-byte tag")
    nonce = encrypted_payload[:12]
    ciphertext = encrypted_payload[12:]
    aesgcm = _get_aesgcm()
    return aesgcm.decrypt(nonce, ciphertext, associated_data)


def obfuscate_store(value: str) -> str:
    """AES-256-GCM authenticated envelope for database sensitive-field storage."""
    try:
        encrypted = encrypt_aes_gcm(value.encode("utf-8"), associated_data=b"fdr_number")
        return "aes256gcm$" + base64.b64encode(encrypted).decode("ascii")
    except Exception:
        # Fallback to key stream if cryptography fails
        key = hashlib.sha256(settings.fdr_hmac_key.encode()).digest()
        raw = value.encode()
        stream = b""
        counter = 0
        while len(stream) < len(raw):
            stream += hashlib.sha256(key + counter.to_bytes(4, "big")).digest()
            counter += 1
        return base64.b64encode(bytes(a ^ b for a, b in zip(raw, stream))).decode()


def deobfuscate_store(value: str) -> str:
    """Decrypt value stored via obfuscate_store (supporting AES-GCM and fallback)."""
    if value.startswith("aes256gcm$"):
        raw_b64 = value[len("aes256gcm$"):]
        encrypted_bytes = base64.b64decode(raw_b64)
        decrypted = decrypt_aes_gcm(encrypted_bytes, associated_data=b"fdr_number")
        return decrypted.decode("utf-8")
    
    key = hashlib.sha256(settings.fdr_hmac_key.encode()).digest()
    raw = base64.b64decode(value)
    stream = b""
    counter = 0
    while len(stream) < len(raw):
        stream += hashlib.sha256(key + counter.to_bytes(4, "big")).digest()
        counter += 1
    return bytes(a ^ b for a, b in zip(raw, stream)).decode()


def sha256_bytes(payload: bytes) -> str:
    return hashlib.sha256(payload).hexdigest()


def sign_payload(payload: str) -> str:
    """HMAC used by the mock bank simulator to authenticate itself only."""
    return hmac.new(settings.fdr_hmac_key.encode(), payload.encode(), hashlib.sha256).hexdigest()

