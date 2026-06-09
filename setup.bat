@echo off
echo ==========================================
echo Multi Browser Workspace Platform - Setup
echo ==========================================
echo.

:: Check if Node.js is installed
echo Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js is installed: 
node --version
echo.

:: Check if npm is installed
echo Checking npm installation...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: npm is not installed or not in PATH
    pause
    exit /b 1
)

echo npm is installed:
npm --version
echo.

:: Install dependencies
echo ==========================================
echo Installing dependencies...
echo ==========================================
echo This may take a few minutes...
echo.

call npm install

if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo ==========================================
echo Dependencies installed successfully!
echo ==========================================
echo.

:: Create .env file if it doesn't exist
if not exist .env (
    echo Creating .env file from .env.example...
    copy .env.example .env
    echo .env file created successfully
    echo Please configure your environment variables in .env
) else (
    echo .env file already exists
)

echo.
echo ==========================================
echo Setup completed successfully!
echo ==========================================
echo.
echo To run the application:
echo   - Windows: Run run.bat
echo   - Or use: npm run dev
echo.
pause
