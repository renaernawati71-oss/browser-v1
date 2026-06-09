@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ==========================================
echo Diagnostic Tool - Browser Workspace Platform
echo ==========================================
echo.
echo This tool will check your system for common issues
echo.

echo [1] Checking current directory...
echo Current directory: %CD%
if exist "package.json" (
    echo ✓ package.json found
) else (
    echo ✗ package.json NOT found - wrong directory
)
echo.

echo [2] Checking Node.js installation...
where node >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Node.js is installed
    node --version
) else (
    echo ✗ Node.js NOT found in PATH
    echo   Please install from https://nodejs.org/
)
echo.

echo [3] Checking npm installation...
where npm >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ npm is installed
    npm --version
) else (
    echo ✗ npm NOT found in PATH
)
echo.

echo [4] Checking required files...
if exist "package.json" (
    echo ✓ package.json exists
) else (
    echo ✗ package.json missing
)

if exist "setup.bat" (
    echo ✓ setup.bat exists
) else (
    echo ✗ setup.bat missing
)

if exist "run.bat" (
    echo ✓ run.bat exists
) else (
    echo ✗ run.bat missing
)

if exist ".env.example" (
    echo ✓ .env.example exists
) else (
    echo ✗ .env.example missing
)

if exist ".env" (
    echo ✓ .env exists (configured)
) else (
    echo ⚠ .env missing (will use defaults)
)
echo.

echo [5] Checking node_modules...
if exist "node_modules" (
    echo ✓ node_modules directory exists
    dir node_modules | find "File(s)" >nul
    if %errorlevel% equ 0 (
        echo ✓ Dependencies appear to be installed
    ) else (
        echo ⚠ node_modules exists but appears empty
    )
) else (
    echo ⚠ node_modules NOT found - run setup.bat
)
echo.

echo [6] Checking required directories...
if exist "profiles" (
    echo ✓ profiles directory exists
) else (
    echo ⚠ profiles directory missing
)

if exist "database" (
    echo ✓ database directory exists
) else (
    echo ⚠ database directory missing
)

if exist "logs" (
    echo ✓ logs directory exists
) else (
    echo ⚠ logs directory missing
)

if exist "extensions" (
    echo ✓ extensions directory exists
) else (
    echo ⚠ extensions directory missing
)

if exist "backups" (
    echo ✓ backups directory exists
) else (
    echo ⚠ backups directory missing
)
echo.

echo [7] Checking network connectivity...
ping -n 1 registry.npmjs.org >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Network connectivity to npm registry OK
) else (
    echo ⚠ Cannot reach npm registry
    echo   This may affect npm install
)
echo.

echo [8] Checking disk space...
for /f "tokens=3" %%a in ('dir ^| find "bytes free"') do set freeSpace=%%a
echo Free disk space: %freeSpace% bytes
echo.

echo ==========================================
echo Diagnostic Complete
echo ==========================================
echo.
echo Summary:
echo If you see any ✗ marks, please address those issues
echo Common solutions:
echo   - Node.js/npm not found: Install Node.js from https://nodejs.org/
echo   - node_modules missing: Run setup.bat
echo   - Wrong directory: Navigate to project folder first
echo.
pause