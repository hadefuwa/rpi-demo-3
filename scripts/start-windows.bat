@echo off
REM RPI-5Inch Showcase App - Windows Startup Script
REM This script optimizes the app for Windows and starts it with proper settings

echo Starting RPI-5Inch Showcase App for Windows...
echo.

REM Set environment variables for better Windows compatibility
set ELECTRON_DISABLE_GPU_SANDBOX=1
set ELECTRON_DISABLE_GPU_PROCESS=1
set ELECTRON_DISABLE_ACCELERATED_2D_CANVAS=1
set ELECTRON_DISABLE_WEBGL=1
set ELECTRON_DISABLE_3D_APIS=1

REM Set Node.js options for better performance
set NODE_OPTIONS=--max-old-space-size=512

REM Change to the project directory
cd /d "%~dp0.."

echo Environment variables set:
echo   ELECTRON_DISABLE_GPU_SANDBOX=1
echo   ELECTRON_DISABLE_GPU_PROCESS=1
echo   ELECTRON_DISABLE_ACCELERATED_2D_CANVAS=1
echo   ELECTRON_DISABLE_WEBGL=1
echo   ELECTRON_DISABLE_3D_APIS=1
echo   NODE_OPTIONS=--max-old-space-size=512
echo.

echo Starting app with Windows-optimized settings...
echo.

REM Start the app with Windows-specific flags
npm run start:windows

REM If the app exits, wait for user input
echo.
echo App has exited. Press any key to close this window...
pause >nul
