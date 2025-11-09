@echo off
REM Development script for Frontend only
cd /d "%~dp0\..\frontend"

echo ========================================
echo   NexusAI Frontend Development Server
echo ========================================
echo.

echo Checking Node.js...
where node >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js not found!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node version:
node -v
echo NPM version:
npm -v
echo.

echo Installing dependencies...
npm install
if errorlevel 1 (
    echo ERROR: npm install failed!
    pause
    exit /b 1
)

echo.
echo Starting Vite dev server...
echo Frontend will be available at: http://localhost:3000
echo.
npm run dev

pause
