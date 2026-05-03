@echo off
setlocal enabledelayedexpansion

REM AIRN Backend - Start Server Script

cls
echo.
echo ========================================
echo   AIRN Backend - Starting Server
echo ========================================
echo.

REM Navigate to backend directory
cd /d "c:\Users\Sivasish\OneDrive\Desktop\Airn2\backend"

REM Check if node_modules exists
if not exist node_modules (
    echo ERROR: node_modules not found!
    echo Please run INSTALL_NOW.bat first to install dependencies.
    echo.
    pause
    exit /b 1
)

REM Check if we can run npm
where npm >nul 2>&1
if errorlevel 1 (
    echo ERROR: npm not found!
    echo Please check your Node.js installation.
    pause
    exit /b 1
)

echo.
echo Starting backend server...
echo.

REM Try to start with nodemon (better for development)
where nodemon >nul 2>&1
if not errorlevel 1 (
    echo Using nodemon for development mode...
    echo.
    call npm run dev
) else (
    echo Using node for production mode...
    echo.
    call npm start
)

REM If npm start fails, show error
if errorlevel 1 (
    echo.
    echo ERROR: Failed to start server!
    echo.
    pause
    exit /b 1
)

pause
