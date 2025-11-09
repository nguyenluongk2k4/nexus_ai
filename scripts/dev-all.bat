@echo off
REM Development script to run both Frontend and Backend
cd /d "%~dp0"

echo ========================================
echo   NexusAI Full Stack Development
echo ========================================
echo.
echo Starting both Frontend and Backend servers...
echo.

REM Start Backend in new window
echo [1/2] Starting Backend API Server...
start "NexusAI Backend" cmd /k "%~dp0dev-backend.bat"

REM Wait for backend to initialize
echo Waiting 5 seconds for backend to start...
timeout /t 5 >nul

REM Start Frontend in new window
echo [2/2] Starting Frontend UI...
start "NexusAI Frontend" cmd /k "%~dp0dev-frontend.bat"

echo.
echo ========================================
echo   Both servers are starting!
echo ========================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo.
echo Press any key to close this window...
echo (Backend and Frontend windows will stay open)
pause >nul
