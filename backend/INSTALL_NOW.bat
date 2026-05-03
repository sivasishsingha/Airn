@echo off
setlocal enabledelayedexpansion

REM AIRN Backend - Simple Installation Script
REM This script will install all dependencies

cls
echo.
echo ========================================
echo   AIRN Backend - Installation
echo ========================================
echo.

REM Navigate to backend directory
cd /d "c:\Users\Sivasish\OneDrive\Desktop\Airn2\backend"

REM Verify we're in the right place
if not exist package.json (
    echo ERROR: package.json not found!
    echo Please make sure this file is in the backend directory.
    pause
    exit /b 1
)

echo Checking Node.js...
where node >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js not found!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Checking npm...
where npm >nul 2>&1
if errorlevel 1 (
    echo ERROR: npm not found!
    echo Please reinstall Node.js.
    pause
    exit /b 1
)

echo.
echo ✓ Node.js found
echo ✓ npm found
echo.

REM Show versions
echo Node.js version:
node --version
echo npm version:
npm --version
echo.

echo ========================================
echo Installing dependencies...
echo This may take 3-5 minutes
echo ========================================
echo.

REM Install dependencies
call npm install

if errorlevel 1 (
    echo.
    echo ERROR: Installation failed!
    echo Try running: npm install --legacy-peer-deps
    pause
    exit /b 1
)

echo.
echo ========================================
echo ✓ Installation Complete!
echo ========================================
echo.
echo Next step: Run START_SERVER.bat to start the backend
echo.
pause
