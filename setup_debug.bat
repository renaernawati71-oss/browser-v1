@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

:: Create logs directory
if not exist "logs" mkdir logs

:: Set log file with timestamp
set LOGFILE=logs\setup_debug_%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%%time:~6,2%.log
set LOGFILE=%LOGFILE: =0%

echo ============================================================
echo DEBUG MODE - Multi Browser Workspace Platform Setup
echo ============================================================
echo.
echo This script will capture ALL output including errors
echo Log file: %LOGFILE%
echo.
echo This window will NOT close automatically
echo Press Ctrl+C to stop if needed
echo.
echo ============================================================
echo Starting debug setup...
echo ============================================================
echo.

:: Write initial log info
echo =========================================== > "%LOGFILE%"
echo DEBUG SETUP SCRIPT STARTED >> "%LOGFILE%"
echo =========================================== >> "%LOGFILE%"
echo Date: %date% %time% >> "%LOGFILE%"
echo User: %USERNAME% >> "%LOGFILE%"
echo Computer: %COMPUTERNAME% >> "%LOGFILE%"
echo Current Directory: %CD% >> "%LOGFILE%"
echo PATH: %PATH% >> "%LOGFILE%"
echo =========================================== >> "%LOGFILE%"
echo. >> "%LOGFILE%"

:: Redirect ALL output to both console and log file
echo Checking current directory... | tee -a "%LOGFILE%"
if exist "package.json" (
    echo [OK] package.json found in current directory | tee -a "%LOGFILE%"
) else (
    echo [ERROR] package.json NOT found | tee -a "%LOGFILE%"
    echo Current directory: %CD% | tee -a "%LOGFILE%"
    echo. | tee -a "%LOGFILE%"
    echo Please navigate to the project directory first! | tee -a "%LOGFILE%"
    goto :end
)

echo. | tee -a "%LOGFILE%"
echo. | tee -a "%LOGFILE%"

:: Check Node.js
echo [1/5] Checking Node.js... | tee -a "%LOGFILE%"
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js NOT found in PATH | tee -a "%LOGFILE%"
    echo Please install Node.js from https://nodejs.org/ | tee -a "%LOGFILE%"
    echo Current PATH: | tee -a "%LOGFILE%"
    echo %PATH% | tee -a "%LOGFILE%"
    goto :end
)
echo [OK] Node.js found | tee -a "%LOGFILE%"
node --version | tee -a "%LOGFILE%"
echo. | tee -a "%LOGFILE%"

:: Check npm
echo [2/5] Checking npm... | tee -a "%LOGFILE%"
where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm NOT found in PATH | tee -a "%LOGFILE%"
    goto :end
)
echo [OK] npm found | tee -a "%LOGFILE%"
npm --version | tee -a "%LOGFILE%"
echo. | tee -a "%LOGFILE%"

:: Check for existing node_modules
echo [3/5] Checking node_modules... | tee -a "%LOGFILE%"
if exist "node_modules" (
    echo [WARN] node_modules already exists | tee -a "%LOGFILE%"
    echo Asking user to delete... | tee -a "%LOGFILE%"
    choice /C YN /M "Delete existing node_modules and reinstall"
    if errorlevel 2 (
        echo [INFO] Skipping npm install | tee -a "%LOGFILE%"
        goto :install_complete
    )
    echo Deleting node_modules... | tee -a "%LOGFILE%"
    rmdir /s /q node_modules 2>&1 | tee -a "%LOGFILE%"
    if exist "node_modules" (
        echo [WARN] Could not delete completely | tee -a "%LOGFILE%"
    ) else (
        echo [OK] node_modules deleted | tee -a "%LOGFILE%"
    )
) else (
    echo [OK] No existing node_modules | tee -a "%LOGFILE%"
)
echo. | tee -a "%LOGFILE%"

:: Create required directories
echo [4/5] Creating directories... | tee -a "%LOGFILE%"
if not exist "profiles" mkdir profiles | tee -a "%LOGFILE%"
if not exist "database" mkdir database | tee -a "%LOGFILE%"
if not exist "logs" mkdir logs | tee -a "%LOGFILE%"
if not exist "extensions" mkdir extensions | tee -a "%LOGFILE%"
if not exist "backups" mkdir backups | tee -a "%LOGFILE%"
echo [OK] Directories created | tee -a "%LOGFILE%"
echo. | tee -a "%LOGFILE%"

:: Install dependencies
echo [5/5] Installing dependencies (this may take several minutes)... | tee -a "%LOGFILE%"
echo This will be logged to: %LOGFILE% | tee -a "%LOGFILE%"
echo Starting npm install... | tee -a "%LOGFILE%"
echo. | tee -a "%LOGFILE%"

npm install 2>&1 | tee -a "%LOGFILE%"
set npm_result=%errorlevel%

echo. | tee -a "%LOGFILE%"
if %npm_result% neq 0 (
    echo [ERROR] npm install FAILED with exit code %npm_result% | tee -a "%LOGFILE%"
    echo. | tee -a "%LOGFILE%"
    echo Last 30 lines from log: | tee -a "%LOGFILE%"
    echo =========================================== | tee -a "%LOGFILE%"
    powershell -Command "Get-Content '%LOGFILE%' -Tail 30" | tee -a "%LOGFILE%"
    echo =========================================== | tee -a "%LOGFILE%"
    goto :end
)

:install_complete
echo [OK] Dependencies installed successfully | tee -a "%LOGFILE%"

:: Create .env if not exists
if not exist ".env" (
    echo Creating .env file... | tee -a "%LOGFILE%"
    if exist ".env.example" (
        copy ".env.example" ".env" | tee -a "%LOGFILE%"
    ) else (
        echo Creating basic .env... | tee -a "%LOGFILE%"
        (
            echo APP_NAME=Multi Browser Workspace Platform
            echo APP_ENV=development
            echo MAX_CONCURRENT_BROWSERS=50
        ) > .env
    )
    echo [OK] .env file created | tee -a "%LOGFILE%"
)

:end
echo. | tee -a "%LOGFILE%"
echo =========================================== | tee -a "%LOGFILE%"
echo DEBUG SETUP SCRIPT FINISHED | tee -a "%LOGFILE%"
echo =========================================== | tee -a "%LOGFILE%"
echo Final status: %npm_result% | tee -a "%LOGFILE%"
echo Log file: %LOGFILE% | tee -a "%LOGFILE%"
echo. | tee -a "%LOGFILE%"

echo.
echo ============================================================
echo DEBUG SETUP FINISHED
echo ============================================================
echo.
echo Log file saved to: %LOGFILE%
echo.
echo If there were errors, please check the log file
echo You can open it with Notepad or any text editor
echo.
echo To view the log file now, press Y
echo To exit, press any other key
echo.

choice /C YN /M "View log file now"
if errorlevel 1 (
    notepad "%LOGFILE%"
)

echo.
echo Press any key to close this window...
pause >nul