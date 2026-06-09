@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ==========================================
echo Multi Browser Workspace Platform - Setup
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

echo Found package.json in current directory
echo.

:: Check if Node.js is installed
echo Checking Node.js installation...
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    echo.
    echo Installation instructions:
    echo 1. Download Node.js from https://nodejs.org/
    echo 2. Install with default settings
    echo 3. Restart your command prompt/terminal
    echo.
    pause
    exit /b 1
)

echo Node.js is installed: 
node --version
echo.

:: Check if npm is installed
echo Checking npm installation...
where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: npm is not installed or not in PATH
    echo This is unusual if Node.js is installed
    echo Please try reinstalling Node.js
    echo.
    pause
    exit /b 1
)

echo npm is installed:
npm --version
echo.

:: Check if node_modules already exists
if exist "node_modules" (
    echo WARNING: node_modules directory already exists
    echo This might cause conflicts
    echo.
    choice /C YN /M "Do you want to delete existing node_modules and reinstall"
    if errorlevel 2 (
        echo Skipping npm install, using existing modules
        goto create_env
    )
    if errorlevel 1 (
        echo Deleting existing node_modules...
        rmdir /s /q node_modules 2>nul
        if exist "node_modules" (
            echo WARNING: Could not delete node_modules completely
            echo Some files may be in use
            echo.
        )
    )
)

:: Install dependencies
echo ==========================================
echo Installing dependencies...
echo ==========================================
echo This may take a few minutes...
echo.

npm install

if %errorlevel% neq 0 (
    echo.
    echo ==========================================
    echo ERROR: Failed to install dependencies
    echo ==========================================
    echo.
    echo Possible solutions:
    echo 1. Check your internet connection
    echo 2. Try running: npm install --verbose
    echo 3. Clear npm cache: npm cache clean --force
    echo 4. Delete node_modules and try again
    echo.
    pause
    exit /b 1
)

echo.
echo ==========================================
echo Dependencies installed successfully!
echo ==========================================
echo.

:create_env
:: Create .env file if it doesn't exist
if not exist ".env" (
    echo Creating .env file from .env.example...
    if exist ".env.example" (
        copy ".env.example" ".env" >nul
        echo .env file created successfully
        echo Please configure your environment variables in .env
    ) else (
        echo WARNING: .env.example not found, creating basic .env file
        (
            echo APP_NAME=Multi Browser Workspace Platform
            echo APP_ENV=development
            echo MAX_CONCURRENT_BROWSERS=50
            echo MAX_RAM_USAGE_GB=16
            echo MAX_CPU_USAGE_PERCENT=80
        ) > .env
        echo Basic .env file created
    )
) else (
    echo .env file already exists
)

:: Create required directories
echo.
echo Creating required directories...
if not exist "profiles" mkdir profiles
if not exist "database" mkdir database
if not exist "logs" mkdir logs
if not exist "extensions" mkdir extensions
if not exist "backups" mkdir backups
echo Directories created successfully

echo.
echo ==========================================
echo Setup completed successfully!
echo ==========================================
echo.
echo Next steps:
echo   1. Configure .env file if needed (optional)
echo   2. Run run.bat to start the application
echo   3. Or use: npm run dev
echo.
echo Press any key to exit...
pause >nul
