@echo off
REM 🚀 AUTOMATED LOCAL TESTING SCRIPT (Windows)
REM Run this to test your app locally before deploying to production

echo ================================
echo 🍕 Food Services - Local Setup
echo ================================
echo.

REM Check if Node is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js not installed. Install from nodejs.org
    pause
    exit /b 1
)

echo ✅ Node.js version:
node --version
echo.

REM Install dependencies
echo 📦 Installing dependencies...
call npm run install:all
if errorlevel 1 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies installed
echo.

REM Check .env file
if not exist "Backend\.env" (
    echo ⚠️  Backend\.env not found
    echo Creating from template...
    copy Backend\.env.example Backend\.env
    echo ❌ Please edit Backend\.env with your MongoDB URL and JWT secret
    echo 📝 Edit: Backend\.env
    pause
    exit /b 1
)

echo ✅ Backend\.env exists
echo.

REM Start development servers
echo 🚀 Starting servers...
echo.
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:4000
echo.
echo Press CTRL+C to stop
echo.

call npm run dev
pause
