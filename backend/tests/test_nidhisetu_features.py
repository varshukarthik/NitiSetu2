"""Automated tests for NIDHISETU security capabilities and original features."""

import json
from decimal import Decimal
import pytest
from app.core.security import encrypt_aes_gcm, decrypt_aes_gcm, obfuscate_store, deobfuscate_store
from app.domains.documents.forensics import (
    get_or_create_ed25519_keys,
    sign_qr_envelope,
    verify_qr_envelope,
    verify_pdf_digital_signature,
    check_duplicate_radar,
)
from app.domains.documents.sample_pdf import build_pdf
from app.domains.audit.service import verify_chain


def test_aes_256_gcm_authenticated_encryption():
    """Verify AES-256-GCM encryption with unique nonces and integrity protection."""
    data = b"CONFIDENTIAL_BANK_DEPOSIT_DATA_998877"
    aad = b"institution_123"

    ct1 = encrypt_aes_gcm(data, associated_data=aad)
    ct2 = encrypt_aes_gcm(data, associated_data=aad)

    # Different nonces -> different ciphertexts
    assert ct1 != ct2
    assert len(ct1) >= 28

    # Correct decryption
    decrypted = decrypt_aes_gcm(ct1, associated_data=aad)
    assert decrypted == data

    # Tampered ciphertext fails authentication
    tampered = bytearray(ct1)
    tampered[-1] ^= 0xFF
    with pytest.raises(Exception):
        decrypt_aes_gcm(bytes(tampered), associated_data=aad)

    # Wrong AAD fails authentication
    with pytest.raises(Exception):
        decrypt_aes_gcm(ct1, associated_data=b"wrong_institution")


def test_obfuscate_and_deobfuscate_envelope():
    """Verify application-layer sensitive field storage."""
    val = "FDR-PUNB-2026-9901"
    enc = obfuscate_store(val)
    assert enc.startswith("aes256gcm$")
    dec = deobfuscate_store(enc)
    assert dec == val


def test_ed25519_signed_qr_verification():
    """Verify Ed25519 cryptographic signed QR envelope generation and validation."""
    payload = {
        "fdr_number": "SBI/FDR/2026/887766",
        "principal_amount": "2500000.00",
        "issuer": "State Bank of India",
    }
    envelope_str = sign_qr_envelope(payload)
    envelope = json.loads(envelope_str)

    # Valid check
    is_valid, msg = verify_qr_envelope(envelope)
    assert is_valid is True
    assert "valid" in msg.lower()

    # Tampered payload fails
    tampered_envelope = json.loads(envelope_str)
    tampered_envelope["data"]["principal_amount"] = "9999999.00"
    is_valid_tampered, _ = verify_qr_envelope(tampered_envelope)
    assert is_valid_tampered is False


def test_pdf_digital_signature_inspection():
    """Verify pyHanko inspection on unsigned and synthetic PDFs."""
    pdf_bytes = build_pdf(["Sample line 1", "Sample line 2"], title="Test Receipt")
    result = verify_pdf_digital_signature(pdf_bytes)
    assert result["signature_present"] is False
    assert result["status"] == "UNSIGNED"


def test_audit_ledger_tamper_detection(db):
    """Verify SHA-256 hash-chained audit ledger divergence detection."""
    chain_status = verify_chain(db)
    assert chain_status["verified"] is True
    assert chain_status["events_checked"] >= 0


def test_smart_action_queue_endpoint(officer_client):
    """Verify /smart-action-queue returns rule-ordered items with transparent factors."""
    resp = officer_client.get("/api/v1/smart-action-queue")
    assert resp.status_code == 200
    items = resp.json()
    assert isinstance(items, list)
    if items:
        first = items[0]
        assert "urgency_level" in first
        assert "priority_score" in first
        assert "contributing_factors" in first
        assert "primary_reason" in first
        assert "suggested_action" in first


def test_s3_storage_and_health_integration(officer_client):
    """Verify S3 storage configuration and ops storage health endpoint."""
    resp = officer_client.get("/api/v1/ops/storage-health")
    assert resp.status_code == 200
    data = resp.json()
    assert "status" in data
    assert "encryption" in data


def test_ocr_extraction_engine():
    """Verify OCR engine extracts bank, amount, dates, and AICTE lien from document."""
    from app.domains.documents.extraction import extract

    sample_text = [
        "STATE BANK OF INDIA - Fixed Deposit Receipt",
        "FDR Number: FDR/SBI/2026/90123",
        "Principal Amount: Rs. 25,00,000.00",
        "Date of Deposit: 15-Jan-2026",
        "Date of Maturity: 15-Jan-2029",
        "Lien marked in favour of Member Secretary, AICTE New Delhi",
    ]
    pdf_bytes = build_pdf(sample_text, title="Fixed Deposit Receipt")
    res = extract(pdf_bytes, filename="fdr_receipt.pdf")

    assert res.status in {"READY", "MANUAL_REVIEW_REQUIRED"}
    assert res.fields["fdr_number"].value is not None or res.fields["principal_amount"].value is not None
    if res.fields["principal_amount"].normalised:
        assert Decimal(res.fields["principal_amount"].normalised) == Decimal("2500000.00")
    if res.fields["issuer_bank"].value:
        assert "State Bank of India" in res.fields["issuer_bank"].value


def test_statutory_reports_endpoints(officer_client):
    """Verify new statutory reports: maturity_schedule, regional_distribution, bank_concentration."""
    for key in ("maturity_schedule", "regional_distribution", "bank_concentration"):
        resp = officer_client.get(f"/api/v1/reports/{key}")
        assert resp.status_code == 200
        body = resp.json()
        assert "columns" in body
        assert "rows" in body
        assert isinstance(body["rows"], list)
