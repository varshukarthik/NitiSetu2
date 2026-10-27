# Run NIDHISETU Frontend Vite server
Write-Host "Starting NIDHISETU Frontend Client on http://localhost:5173 ..." -ForegroundColor Cyan
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location -Path "$Root\frontend"
npm run dev
