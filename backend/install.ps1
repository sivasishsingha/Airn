# AIRN Backend - Installation Script
# Run this file to install all dependencies

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host " AIRN Backend - npm Install" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Get script directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Write-Host "Backend folder: $scriptDir" -ForegroundColor Green
Write-Host ""

# Check if package.json exists
if (Test-Path "$scriptDir\package.json") {
    Write-Host "✓ Found package.json" -ForegroundColor Green
    Write-Host ""
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    Write-Host "(This may take 2-5 minutes)" -ForegroundColor Gray
    Write-Host ""
    
    # Run npm install
    Set-Location $scriptDir
    npm install
    
    Write-Host ""
    Write-Host "✓ Installation complete!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Run: npm run dev" -ForegroundColor White
    Write-Host "2. Open: http://localhost:5000/health" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "✗ Error: package.json not found!" -ForegroundColor Red
    Write-Host "Make sure you're in the correct directory." -ForegroundColor Red
}

Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
