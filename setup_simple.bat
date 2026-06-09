@echo off
echo ==========================================
echo SIMPLE SETUP - Browser Workspace Platform
echo ==========================================
echo.
echo Current directory: %CD%
echo.

:: Check package.json
if not exist "package.json" (
    echo ERROR: package.json not found
    echo Please run this from the project directory
    echo.
    pause
    exit /b 1
)

echo [OK] package.json found
echo.

:: Check Node.js
echo Checking Node.js...
node --version
if errorlevel 1 (
    echo ERROR: Node.js not found
    echo Install from: https://nodejs.org/
    pause
    exit /b 1
)
echo [OK] Node.js installed
echo.

:: Check npm
echo Checking npm...
npm --version
if errorlevel 1 (
    echo ERROR: npm not found
    pause
    exit /b 1
)
echo [OK] npm installed
echo.

:: Create directories
echo Creating directories...
if not exist "profiles" mkdir profiles
if not exist "database" mkdir database
if not exist "logs" mkdir logs
if not exist "extensions" mkdir extensions
if not exist "backups" mkdir backups
echo [OK] Directories created
echo.

:: Create .env
if not exist ".env" (
    echo Creating .env file...
    if exist ".env.example" (
        copy ".env.example" ".env"
    ) else (
        echo APP_NAME=Multi Browser Workspace Platform > .env
        echo APP_ENV=development >> .env
    )
    echo [OK] .env created
) else (
    echo [OK] .env already exists
)
echo.

:: Install dependencies
echo ==========================================
echo Installing dependencies...
echo ==========================================
echo This may take 2-5 minutes
echo Please wait...
echo.

npm install

if errorlevel 1 (
    echo.
    echo ==========================================
    echo ERROR: npm install failed
    echo ==========================================
    echo.
    echo Try these solutions:
    echo 1. Check internet connection
    echo 2. Run: npm cache clean --force
    echo 3. Delete node_modules folder and try again
    echo.
    pause
    exit /b 1
)

echo.
echo ==========================================
echo SETUP COMPLETED SUCCESSFULLY!
echo ==========================================
echo.
echo Next: Run run.bat to start the application
echo.
pause