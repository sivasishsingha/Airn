# AIRN Backend - Start Server Script
# Run this file to start your backend server

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host " AIRN Backend Server" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Get script directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Write-Host "Backend folder: $scriptDir" -ForegroundColor Green
Write-Host ""

# Check if node_modules exists
if (-Not (Test-Path "$scriptDir\node_modules")) {
    Write-Host "✗ Error: node_modules not found!" -ForegroundColor Red
    Write-Host "Please run install.bat or install.ps1 first" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Press any key to exit..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit
}

Write-Host "✓ Dependencies found" -ForegroundColor Green
Write-Host ""
Write-Host "Starting backend server..." -ForegroundColor Yellow
Write-Host ""
Write-Host "🚀 Server Information:" -ForegroundColor Cyan
Write-Host "   URL: http://localhost:5000" -ForegroundColor White
Write-Host "   Port: 5000" -ForegroundColor White
Write-Host "   Health Check: http://localhost:5000/health" -ForegroundColor White
Write-Host ""
Write-Host "API Endpoints:" -ForegroundColor Cyan
Write-Host "   /api/auth/* - Authentication" -ForegroundColor White
Write-Host "   /api/users/* - User profiles" -ForegroundColor White
Write-Host "   /api/inventions/* - Marketplace" -ForegroundColor White
Write-Host "   /api/community/* - Community" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

# Start the server
Set-Location $scriptDir
npm run dev
