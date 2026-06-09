@echo off
chcp 65001 >nul

echo ==========================================
echo Log File Viewer
echo ==========================================
echo.

if not exist "logs" (
    echo No logs directory found
    pause
    exit /b
)

echo Available log files:
echo.

dir /b /o-d logs\*.log 2>nul

if %errorlevel% neq 0 (
    echo No log files found
    pause
    exit /b
)

echo.
echo Most recent log file:
for /f "delims=" %%i in ('dir /b /o-d logs\*.log 2^>nul ^| findstr /n "^" ^| findstr "^1:"') do (
    set "latest=%%i"
)

set "latest=%latest:*:=%"
echo %latest%
echo.

echo What would you like to do?
echo 1. Open most recent log file
echo 2. List all log files with details
echo 3. Open specific log file
echo 4. Clear old log files (keep last 5)
echo 5. Exit
echo.

choice /C 12345 /M "Select option"

if errorlevel 5 goto :eof
if errorlevel 4 goto :clear_logs
if errorlevel 3 goto :open_specific
if errorlevel 2 goto :list_details
if errorlevel 1 goto :open_latest

:open_latest
if defined latest (
    notepad "logs\%latest%"
) else (
    echo No log file to open
)
goto :eof

:list_details
echo.
echo Detailed log file information:
echo.
forfiles /p logs /m *.log /c "cmd /c echo @fdate @ftime - @fname @fsize bytes" 2>nul
pause
goto :eof

:open_specific
echo.
set /p logfile="Enter log file name: "
if exist "logs\%logfile%" (
    notepad "logs\%logfile%"
) else (
    echo File not found: %logfile%
    pause
)
goto :eof

:clear_logs
echo.
echo This will delete all log files except the 5 most recent
echo Are you sure?
choice /C YN /M "Continue"
if errorlevel 2 goto :eof

for /f "skip=5 delims=" %%f in ('dir /b /o-d logs\*.log 2^>nul') do (
    echo Deleting: %%f
    del "logs\%%f"
)

echo.
echo Old log files cleared
pause
goto :eof