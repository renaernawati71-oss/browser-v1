@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

:: Create logs directory
if not exist "logs" mkdir logs

:: Set log file with timestamp
set LOGFILE=logs\setup_%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%%time:~6,2%.log
set LOGFILE=%LOGFILE: =0%

:: Function to write to log file
:log
echo %date% %time% - %* >> "%LOGFILE%"
goto :eof

:: Start logging
call :log "=========================================="
call :log "Setup Script Started"
call :log "=========================================="
call :log "Current directory: %CD%"
call :log "User: %USERNAME%"
call :log "Computer: %COMPUTERNAME%"

echo ==========================================
echo Multi Browser Workspace Platform - Setup
echo ==========================================
echo.
echo Current directory: %CD%
echo.
echo Log file: %LOGFILE%
echo.

:: Check if we're in the correct directory
if not exist "package.json" (
    call :log "ERROR: package.json not found"
    call :log "Current directory: %CD%"
    echo ERROR: package.json not found in current directory
    echo Please run this script from the project root directory
    echo.
    echo Current directory: %CD%
    echo.
    echo Check log file for details: %LOGFILE%
    echo.
    pause
    exit /b 1
)

call :log "package.json found"
echo Found package.json in current directory
echo.

:: Check if Node.js is installed
call :log "Checking Node.js installation..."
echo Checking Node.js installation...

where node >nul 2>&1
if %errorlevel% neq 0 (
    call :log "ERROR: Node.js not found"
    call :log "PATH: %PATH%"
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    echo.
    echo Installation instructions:
    echo 1. Download Node.js from https://nodejs.org/
    echo 2. Install with default settings
    echo 3. Restart your command prompt/terminal
    echo.
    echo Current PATH: %PATH%
    echo.
    echo Check log file for details: %LOGFILE%
    echo.
    pause
    exit /b 1
)

call :log "Node.js found"
echo Node.js is installed:
node --version >> "%LOGFILE%" 2>&1
node --version
echo.
call :log "Node.js version: %errorlevel%"

:: Check if npm is installed
call :log "Checking npm installation..."
echo Checking npm installation...

where npm >nul 2>&1
if %errorlevel% neq 0 (
    call :log "ERROR: npm not found"
    echo ERROR: npm is not installed or not in PATH
    echo This is unusual if Node.js is installed
    echo Please try reinstalling Node.js
    echo.
    echo Check log file for details: %LOGFILE%
    echo.
    pause
    exit /b 1
)

call :log "npm found"
echo npm is installed:
npm --version >> "%LOGFILE%" 2>&1
npm --version
echo.
call :log "npm version: %errorlevel%"

:: Check if node_modules already exists
if exist "node_modules" (
    call :log "node_modules already exists"
    echo WARNING: node_modules directory already exists
    echo This might cause conflicts
    echo.
    choice /C YN /M "Do you want to delete existing node_modules and reinstall"
    call :log "User choice: errorlevel %errorlevel%"
    if errorlevel 2 (
        call :log "Skipping npm install"
        echo Skipping npm install, using existing modules
        goto create_env
    )
    if errorlevel 1 (
        call :log "Deleting node_modules"
        echo Deleting existing node_modules...
        rmdir /s /q node_modules 2>> "%LOGFILE%"
        if exist "node_modules" (
            call :log "WARNING: Could not delete node_modules completely"
            echo WARNING: Could not delete node_modules completely
            echo Some files may be in use
            echo.
        ) else (
            call :log "node_modules deleted successfully"
        )
    )
)

:: Install dependencies
call :log "Starting npm install..."
echo ==========================================
echo Installing dependencies...
echo ==========================================
echo This may take a few minutes...
echo.
echo Progress is being logged to: %LOGFILE%
echo.

npm install >> "%LOGFILE%" 2>&1
set npm_result=%errorlevel%
call :log "npm install completed with exit code: %npm_result%"

if %npm_result% neq 0 (
    call :log "ERROR: npm install failed with exit code %npm_result%"
    echo.
    echo ==========================================
    echo ERROR: Failed to install dependencies
    echo ==========================================
    echo.
    echo Exit code: %npm_result%
    echo.
    echo Possible solutions:
    echo 1. Check your internet connection
    echo 2. Try running: npm install --verbose
    echo 3. Clear npm cache: npm cache clean --force
    echo 4. Delete node_modules and try again
    echo.
    echo Check log file for details: %LOGFILE%
    echo.
    echo Last 20 lines from log:
    echo.
    powershell -Command "Get-Content '%LOGFILE%' -Tail 20"
    echo.
    pause
    exit /b 1
)

call :log "Dependencies installed successfully"
echo.
echo ==========================================
echo Dependencies installed successfully!
echo ==========================================
echo.

:create_env
:: Create .env file if it doesn't exist
if not exist ".env" (
    call :log "Creating .env file"
    echo Creating .env file from .env.example...
    if exist ".env.example" (
        copy ".env.example" ".env" >> "%LOGFILE%" 2>&1
        echo .env file created successfully
        echo Please configure your environment variables in .env
        call :log ".env file created successfully"
    ) else (
        call :log "WARNING: .env.example not found, creating basic .env"
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
    call :log ".env file already exists"
    echo .env file already exists
)

:: Create required directories
call :log "Creating required directories"
echo.
echo Creating required directories...
if not exist "profiles" (
    mkdir profiles
    call :log "Created profiles directory"
)
if not exist "database" (
    mkdir database
    call :log "Created database directory"
)
if not exist "logs" (
    mkdir logs
    call :log "Created logs directory"
)
if not exist "extensions" (
    mkdir extensions
    call :log "Created extensions directory"
)
if not exist "backups" (
    mkdir backups
    call :log "Created backups directory"
)
echo Directories created successfully

:: Create log summary
call :log "=========================================="
call :log "Setup completed successfully"
call :log "=========================================="
call :log "Final status: SUCCESS"

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
echo Log file saved to: %LOGFILE%
echo.
echo Press any key to exit...
pause >nul
