# NIDHISETU Setup Script for Windows PowerShell
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " NIDHISETU — Security Deposit & FDR Management Portal" -ForegroundColor Green
Write-Host " SIH26265 | AICTE Regulation Bureau" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan

$Root = Split-Path -Parent $MyInvocation.MyCommand.Path

# 1. Setup Backend
Write-Host "`n[1/4] Setting up Python virtual environment..." -ForegroundColor Cyan
Set-Location -Path "$Root\backend"

if (-not (Test-Path "venv")) {
    python -m venv venv
}

Write-Host "[2/4] Installing backend dependencies..." -ForegroundColor Cyan
.\venv\Scripts\pip install -r requirements.txt cryptography pyhanko qrcode[pil] opencv-python-headless argon2-cffi pyotp

Write-Host "[3/4] Initializing database and loading synthetic demonstration data..." -ForegroundColor Cyan
$env:PYTHONPATH = "."
.\venv\Scripts\python -m app.seed --reset

# 2. Setup Frontend
Write-Host "`n[4/4] Setting up Frontend..." -ForegroundColor Cyan
Set-Location -Path "$Root\frontend"
npm install

Write-Host "`n==========================================================" -ForegroundColor Green
Write-Host " SETUP COMPLETE!" -ForegroundColor Green
Write-Host " Run .\run-backend.ps1 in one terminal window." -ForegroundColor Yellow
Write-Host " Run .\run-frontend.ps1 in another terminal window." -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Green
Set-Location -Path $Root
