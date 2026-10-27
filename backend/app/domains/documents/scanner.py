"""Content validation standing in for an antivirus + document-safety worker.

The checks are the structural ones the brief requires before a file may be
parsed or rendered: declared type is never trusted, magic bytes and size are
checked, encrypted files and obvious active content are refused, and a file is
only ever promoted out of quarantine on a clean verdict.
"""

from __future__ import annotations

import io
from dataclasses import dataclass

from PIL import Image

from app.core.config import settings

PDF_MAGIC = b"%PDF-"
PNG_MAGIC = b"\x89PNG\r\n\x1a\n"
JPEG_MAGIC = b"\xff\xd8\xff"
SUSPICIOUS_MARKERS = (b"/JavaScript", b"/JS", b"/Launch", b"/EmbeddedFile", b"/OpenAction")
MAX_PAGES = 30


@dataclass(frozen=True)
class ScanResult:
    status: str  # CLEAN | REJECTED | RETRYABLE_FAILURE
    detail: str
    page_count: int | None = None


def scan(payload: bytes, *, declared_content_type: str) -> ScanResult:
    if len(payload) == 0:
        return ScanResult("REJECTED", "Empty file.")
    if len(payload) > settings.max_upload_bytes:
        return ScanResult("REJECTED", "File exceeds the allowed upload size.")
    if declared_content_type not in settings.allowed_content_types:
        return ScanResult("REJECTED", f"Content type {declared_content_type} is not accepted.")

    # Image validation (PNG, JPEG)
    if declared_content_type in {"image/png", "image/jpeg", "image/jpg"}:
        if not (payload.startswith(PNG_MAGIC) or payload.startswith(JPEG_MAGIC)):
            return ScanResult("REJECTED", "File content magic bytes do not match declared image type.")
        try:
            with Image.open(io.BytesIO(payload)) as img:
                img.verify()
            return ScanResult("CLEAN", "Clean image file verified.", page_count=1)
        except Exception as img_err:
            return ScanResult("REJECTED", f"Corrupt or unreadable image file: {img_err}")

    # PDF validation
    if not payload.startswith(PDF_MAGIC):
        return ScanResult("REJECTED", "File content is not a PDF regardless of its name or type.")

    found = [marker.decode() for marker in SUSPICIOUS_MARKERS if marker in payload]
    if found:
        return ScanResult("REJECTED", f"PDF contains active content: {', '.join(sorted(found))}.")

    try:
        from pypdf import PdfReader
        from pypdf.errors import PdfReadError
    except ImportError:  # pragma: no cover
        return ScanResult("RETRYABLE_FAILURE", "Document scanner unavailable.")

    try:
        reader = PdfReader(io.BytesIO(payload))
        if reader.is_encrypted:
            return ScanResult("REJECTED", "Password-protected PDFs cannot be processed.")
        page_count = len(reader.pages)
    except PdfReadError as exc:
        return ScanResult("REJECTED", f"PDF structure could not be parsed: {exc}")
    except Exception as exc:  # noqa: BLE001
        return ScanResult("RETRYABLE_FAILURE", f"Scanner error: {type(exc).__name__}")

    if page_count == 0:
        return ScanResult("REJECTED", "PDF reports zero pages.")
    if page_count > MAX_PAGES:
        return ScanResult("REJECTED", f"Page-count limit of {MAX_PAGES} exceeded.")

    return ScanResult("CLEAN", "No issues found by structural and content checks.", page_count)
