@echo off
REM Navigate to backend directory
cd /d "c:\Users\Sivasish\OneDrive\Desktop\Airn2\backend"

REM Display current directory
echo Current directory: %cd%
echo.

REM Check if package.json exists
if exist package.json (
    echo ✓ Found package.json
    echo.
    echo Installing dependencies...
    echo.
    npm install
    echo.
    echo ✓ Installation complete!
    pause
) else (
    echo ✗ Error: package.json not found!
    echo Please make sure you're in the correct directory.
    pause
)
