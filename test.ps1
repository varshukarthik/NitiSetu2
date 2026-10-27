# Run NIDHISETU Automated Test Suite
Write-Host "Running NIDHISETU Complete Automated Test Suite..." -ForegroundColor Cyan
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location -Path "$Root\backend"
$env:PYTHONPATH = "."
.\venv\Scripts\pytest -v
Set-Location -Path $Root
