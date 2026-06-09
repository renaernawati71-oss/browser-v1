@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ==========================================
echo Multi Browser Workspace Platform
echo Starting application...
echo ==========================================
echo.
echo Current directory: %CD%
echo.

:: Check if we're in the correct directory
if not exist "package.json" (
    echo ERROR: package.json not found in current directory
    echo Please run this script from the project root directory
    echo.
    echo Current directory: %CD%
    echo.
    pause
    exit /b 1
)

:: Check if node_modules exists
if not exist "node_modules" (
    echo ERROR: Dependencies not installed
    echo Please run setup.bat first to install dependencies
    echo.
    echo To install dependencies:
    echo   - Double-click setup.bat
    echo   - Or run: npm install
    echo.
    pause
    exit /b 1
)

:: Check if .env exists
if not exist ".env" (
    echo WARNING: .env file not found
    echo Using default configuration
    echo.
    echo To create .env file:
    echo   - Copy .env.example to .env
    echo   - Or run setup.bat again
    echo.
    choice /C YN /M "Continue without .env file"
    if errorlevel 2 (
        echo Setup cancelled
        pause
        exit /b 1
    )
)

:: Check if Node.js is still available
echo Checking Node.js...
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found in PATH
    echo Please reinstall Node.js
    echo.
    pause
    exit /b 1
)

echo Node.js version:
node --version
echo npm version:
npm --version
echo.

:: Start the application
echo ==========================================
echo Starting development server...
echo ==========================================
echo.
echo The application window will open shortly
echo Close this window to stop the application
echo.

npm run dev

if %errorlevel% neq 0 (
    echo.
    echo ==========================================
    echo ERROR: Failed to start application
    echo ==========================================
    echo.
    echo Possible causes:
    echo 1. Port 3000 already in use
    echo 2. Dependencies corrupted
    echo 3. Node.js version incompatible
    echo.
    echo Solutions:
    echo 1. Close other applications using port 3000
    echo 2. Run setup.bat to reinstall dependencies
    echo 3. Check Node.js version (should be 18+)
    echo.
    pause
    exit /b 1
)
