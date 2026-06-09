@echo off
echo ==========================================
echo Multi Browser Workspace Platform - Build
echo ==========================================
echo.

:: Check if node_modules exists
if not exist node_modules (
    echo ERROR: Dependencies not installed
    echo Please run setup.bat first to install dependencies
    pause
    exit /b 1
)

:: Build renderer
echo Building renderer...
echo.
call npm run build:renderer

if %errorlevel% neq 0 (
    echo ERROR: Failed to build renderer
    pause
    exit /b 1
)

echo.
echo ==========================================
echo Renderer built successfully!
echo ==========================================
echo.

:: Build Electron app
echo Building Electron application...
echo.
call npm run build:electron

if %errorlevel% neq 0 (
    echo ERROR: Failed to build Electron application
    pause
    exit /b 1
)

echo.
echo ==========================================
echo Build completed successfully!
echo ==========================================
echo.
echo Output files are in the dist folder
echo.
pause
