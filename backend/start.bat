@echo off
REM Navigate to backend directory
cd /d "c:\Users\Sivasish\OneDrive\Desktop\Airn2\backend"

REM Display information
echo.
echo ================================
echo  AIRN Backend Server
echo ================================
echo.
echo Starting backend on port 5000...
echo URL: http://localhost:5000
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start the development server
npm run dev

pause
