# Run NIDHISETU Backend API server
Write-Host "Starting NIDHISETU Backend Service on http://127.0.0.1:8000 ..." -ForegroundColor Cyan
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location -Path "$Root\backend"
$env:PYTHONPATH = "."
.\venv\Scripts\python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
