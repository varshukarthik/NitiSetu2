# Reset and Re-seed NIDHISETU Demo Data
Write-Host "Resetting and Re-seeding NIDHISETU Synthetic Demo Database..." -ForegroundColor Cyan
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location -Path "$Root\backend"
$env:PYTHONPATH = "."
.\venv\Scripts\python -m app.seed --reset
Set-Location -Path $Root
