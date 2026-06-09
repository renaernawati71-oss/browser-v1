@echo off
echo ==========================================
echo Multi Browser Workspace Platform
echo Starting application...
echo ==========================================
echo.

:: Check if node_modules exists
if not exist node_modules (
    echo ERROR: Dependencies not installed
    echo Please run setup.bat first to install dependencies
    pause
    exit /b 1
)

:: Check if .env exists
if not exist .env (
    echo WARNING: .env file not found
    echo Using default configuration
    echo.
)

:: Start the application
echo Starting development server...
echo.

call npm run dev

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Failed to start application
    pause
    exit /b 1
)

pause
