@echo off
title Osyra's Worksheets Launcher
echo ============================================
echo   Osyra's Worksheets - Environment Check
echo ============================================
echo.

:: Check that worksheet files exist
if not exist "%~dp0worksheets\index.html" (
    echo [FAIL] Worksheet files not found!
    echo        Expected folder: %~dp0worksheets\
    echo        Make sure you extracted the full zip.
    echo.
    pause
    exit /b 1
)
echo [OK] Worksheet files found.

:: Check for fonts
if exist "%~dp0worksheets\fonts\DancingScript-Regular.ttf" (
    echo [OK] Cursive fonts found.
) else (
    echo [WARN] Cursive fonts missing - cursive worksheet may not render correctly.
)

:: Check for internet (needed for Definitions worksheet)
ping -n 1 -w 2000 api.dictionaryapi.dev >nul 2>&1
if %errorlevel%==0 (
    echo [OK] Internet connection detected - all worksheets available.
) else (
    echo [WARN] No internet connection - Definitions worksheet requires internet.
)

:: Detect default browser
echo.
echo Launching in your default browser...
echo.

start "" "%~dp0worksheets\index.html"

if %errorlevel% neq 0 (
    echo [FAIL] Could not open browser. Please open this file manually:
    echo        %~dp0worksheets\index.html
    echo.
    pause
    exit /b 1
)

echo Worksheets launched successfully!
echo You can close this window.
echo.
timeout /t 5 >nul
