@echo off
echo ==========================================
echo NPM INSTALL ONLY
echo ==========================================
echo.
echo This script ONLY runs npm install
echo Use this if directories are already set up
echo.
echo Current directory: %CD%
echo.

if not exist "package.json" (
    echo ERROR: package.json not found
    echo Run from project directory
    pause
    exit /b 1
)

echo Checking npm...
npm --version
if errorlevel 1 (
    echo ERROR: npm not found
    pause
    exit /b 1
)

echo.
echo ==========================================
echo RUNNING: npm install
echo ==========================================
echo.
echo This will show all output including errors
echo.

call npm install

if errorlevel 1 (
    echo.
    echo ==========================================
    echo INSTALL FAILED
    echo ==========================================
    echo.
    echo Error code: %errorlevel%
    echo.
    echo Try: npm install --verbose
    echo Or: npm cache clean --force
    echo.
) else (
    echo.
    echo ==========================================
    echo INSTALL SUCCESS
    echo ==========================================
)
echo.
pause