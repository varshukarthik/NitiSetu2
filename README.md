# NIDHISETU

**Secure Deposits. Smarter Decisions. Complete Accountability.**  
*Streamline of Security Deposit / FDR Portal — SIH26265, AICTE Regulation Bureau*

---

## Quick Start (Windows PowerShell)

NIDHISETU is fully configured, seeded, and tested for local execution on Windows.

### Prerequisites
- Python 3.11+
- Node.js v20+ & npm

### Automated Setup
Open a PowerShell terminal in the repository root and run:
```powershell
.\setup.ps1
```
This automatically sets up the Python virtual environment, installs backend and frontend dependencies, creates the SQLite database, and populates the synthetic demonstration dataset.

### Starting the Application

1. **Terminal 1 (Backend API Service):**
   ```powershell
   .\run-backend.ps1
   ```
   *Runs FastAPI on `http://127.0.0.1:8000`. Interactive OpenAPI documentation is accessible at `http://127.0.0.1:8000/docs`.*

2. **Terminal 2 (Frontend Client):**
   ```powershell
   .\run-frontend.ps1
   ```
   *Runs Vite development server on `http://localhost:5173`.*

---

## Demo Credentials & Persona Walkthroughs

All accounts use the standard demo password: **`Demo@12345`**

| Role | Email | Description & Scenarios |
|---|---|---|
| **Scrutiny Officer** | `scrutiny@aicte.demo` | **Regulation Bureau (South & West)**: Reviews new submissions, inspects side-by-side explainable discrepancies, runs mock bank verification checks, executes digital signature & QR verification, and reviews the priority-ranked Smart Action Queue. |
| **Institution Submitter** | `submitter@coastal.demo` | **Coastal Institute of Technology**: Registers draft FDRs, uploads PDF certificates, tracks active deposits, and views responses to clarification requests. |
| **Institution Submitter** | `submitter@highland.demo` | **Highland School of Management**: Submits course withdrawal deposit release requests and monitors multi-bureau clearances. |
| **Approving Authority** | `supervisor@aicte.demo` | **Competent Authority**: Reviews eligible release requests after all bureau clearances are satisfied (enforces separation of duties). |
| **Clearance Officers** | `pgrc@aicte.demo`<br>`vigilance@aicte.demo`<br>`finance@aicte.demo` | Grants or records objections on institutional clearances (PGRC grievance, Vigilance observation, Finance Bureau dues). |
| **Auditor** | `auditor@aicte.demo` | Read-only inspection of the SHA-256 hash-chained audit ledger and CSV report generation. |
| **Security Admin** | `admin@aicte.demo` | Inspects system configuration, ruleset catalog version hashes, and runs audit hash-chain integrity verification. |

---

## Key Differentiating Features

1. **Explainable Document Discrepancy Engine:**
   - Instead of binary mismatch flags, highlights exact differences between declared values and certificate PDF extractions with human-readable rationales and recommended reviewer actions.

2. **Smart Action Queue:**
   - Prioritizes scrutiny tasks using transparent rules (+100 overdue maturity, +80 critical discrepancy, +45 pending release) rather than unprioritized tables.

3. **Cryptographic Forensic Verification:**
   - **pyHanko CMS Validation:** Verifies PDF structural integrity against certificate chains.
   - **Ed25519 Signed QR Envelope:** Verifies asymmetric digital signatures on machine-readable deposit certificates.
   - **Duplicate Radar:** Detects binary document SHA-256 and normalized reference collisions across institutions.

4. **AES-256-GCM Authenticated Encryption:**
   - Sensitive deposit identifiers and document payloads are encrypted with 12-byte random nonces and 16-byte authentication tags.

5. **Hash-Chained Audit Ledger with Tamper Divergence:**
   - Every state change is chained using SHA-256 (`current_hash = SHA256(canonical_payload + previous_hash)`). Includes a live tamper test API (`/api/v1/audit-events/simulate-tamper`) demonstrating real-time divergence detection.

---

## Running Automated Tests

Run the complete test suite (69 passing unit and end-to-end integration tests):
```powershell
.\test.ps1
```

To re-seed or reset the demonstration database at any time:
```powershell
.\run-demo.ps1
```


---

### Cloud S3 Vault & OCR Engine Integration

NIDHISETU includes built-in S3-compatible cloud storage and an advanced multi-layered OCR engine:

- **S3-Compatible Object Store:**
  - Configurable via `NIDHISETU_STORAGE_BACKEND=s3`, `NIDHISETU_S3_BUCKET_NAME`, `NIDHISETU_S3_ENDPOINT_URL`, and standard AWS credentials.
  - Zero plaintext in the cloud: All documents are encrypted client-side using **AES-256-GCM** before uploading to S3, and authenticated on retrieval.
  - Gracefully falls back to local encrypted disk if cloud credentials are not supplied.

- **Multi-Layer OCR & Scrutiny Engine:**
  - **Layer 1 (Native Digital Layout):** Uses `pdfplumber` and `pypdf` to extract exact text streams and character bounds.
  - **Layer 2 (Visual Optical Character Recognition):** Uses `pypdfium2` / `Pillow` page rasterization with `pytesseract` and OpenCV image filtering for scanned documents.
  - **Layer 3 (Indian Banking Regulatory Parser):** Extracts FDR Reference Numbers, Principal Amount in Indian numbering format (e.g. ₹25,00,000), Issue/Maturity dates, and AICTE Lien markings.
