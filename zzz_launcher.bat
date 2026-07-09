@echo off

REM === Variables ===
set "TITLE=Coffee Byte Dev - Local Server"
set "PORT=1337"

REM === Requirements ===
where python >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Python is required to run the local server.
    echo Install Python 3 from python.org or the Microsoft Store, then try again.
    pause
    exit /b 1
)

REM === Script ===
title %TITLE%
cd /d "%~dp0"
echo.
echo Serving site at http://localhost:%PORT%/
echo Press Ctrl+C to stop the server.
echo.
python -m http.server %PORT%

REM === Execution ===
pause
