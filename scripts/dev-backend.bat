@echo off
REM Development script for Backend only
cd /d "%~dp0\..\backend"

echo ========================================
echo   NexusAI Backend API Server
echo ========================================
echo.

echo Checking Python...
where python >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python not found!
    echo Please install Python 3.8+ from https://python.org/
    pause
    exit /b 1
)

echo Python version:
python --version
echo.

echo Installing dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo ERROR: pip install failed!
    pause
    exit /b 1
)

echo.
echo Starting FastAPI server with uvicorn...
echo Backend API will be available at: http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo.
python -m uvicorn app.server:app --reload --host 0.0.0.0 --port 8000

pause
