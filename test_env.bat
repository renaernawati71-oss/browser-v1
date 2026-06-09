@echo off
echo ==========================================
echo ENVIRONMENT TEST
echo ==========================================
echo.
echo This will test if your system is ready
echo.
echo [1/5] Current Directory Test
echo Current directory: %CD%
if exist "package.json" (
    echo [OK] package.json found
) else (
    echo [FAIL] package.json NOT found
    echo Wrong directory!
)
echo.
pause

echo [2/5] Node.js Test
where node
if errorlevel 1 (
    echo [FAIL] Node.js NOT found in PATH
) else (
    echo [OK] Node.js found
    node --version
)
echo.
pause

echo [3/5] npm Test  
where npm
if errorlevel 1 (
    echo [FAIL] npm NOT found in PATH
) else (
    echo [OK] npm found
    npm --version
)
echo.
pause

echo [4/5] Directory Permissions Test
echo Testing write permission...
echo test > test_write.txt
if exist "test_write.txt" (
    echo [OK] Write permission OK
    del test_write.txt
) else (
    echo [FAIL] No write permission
)
echo.
pause

echo [5/5] Network Test
echo Testing internet connection...
ping -n 1 registry.npmjs.org
if errorlevel 1 (
    echo [FAIL] Cannot reach npm registry
) else (
    echo [OK] Network connection OK
)
echo.

echo ==========================================
echo TEST COMPLETE
echo ==========================================
echo.
echo If all tests passed [OK], your system is ready
echo If any test failed [FAIL], fix that issue first
echo.
pause