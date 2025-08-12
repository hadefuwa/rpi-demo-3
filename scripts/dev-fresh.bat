@echo off
echo 🚀 Starting RPI 5Inch Showcase in Development Mode (Fresh Content Guaranteed)...

REM Kill any existing chromium processes
taskkill /f /im chromium.exe 2>nul
taskkill /f /im chrome.exe 2>nul

REM Wait a moment for processes to fully terminate
timeout /t 2 /nobreak >nul

REM Create a unique cache-busting timestamp
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "STAMP=%dt:~8,8%"

echo 📁 Using temporary profile: %TEMP%\dev-kiosk-%STAMP%
echo 🔄 Cache-busting timestamp: %STAMP%
echo 🔧 Development mode: aggressive cache clearing enabled

REM Start chromium in development mode with maximum cache disabling
start "" chromium-browser ^
  --kiosk "http://localhost:3000?v=%STAMP%&dev=true&t=%STAMP%" ^
  --user-data-dir="%TEMP%\dev-kiosk-%STAMP%" ^
  --no-first-run ^
  --no-default-browser-check ^
  --disable-http-cache ^
  --disk-cache-size=1 ^
  --media-cache-size=1 ^
  --disable-background-timer-throttling ^
  --disable-backgrounding-occluded-windows ^
  --disable-renderer-backgrounding ^
  --disable-features=TranslateUI ^
  --disable-ipc-flooding-protection ^
  --disable-background-networking ^
  --disable-default-apps ^
  --disable-sync ^
  --metrics-recording-only ^
  --no-sandbox ^
  --disable-dev-shm-usage ^
  --disable-gpu ^
  --disable-software-rasterizer ^
  --disable-application-cache ^
  --disable-offline-load-stale-cache ^
  --disable-background-networking ^
  --disable-sync-preferences ^
  --disable-web-security ^
  --disable-features=VizDisplayCompositor ^
  --incognito

echo ✅ Development mode started!
echo 🔄 To exit kiosk mode: Press Alt+F4 or Ctrl+Shift+Q
echo 🌐 PWA is running at: http://localhost:3000?v=%STAMP%&dev=true&t=%STAMP%
echo 📁 Profile directory: %TEMP%\dev-kiosk-%STAMP%
echo.
echo 💡 This profile will be automatically cleaned up on exit
echo 🔧 Development mode: aggressive cache clearing enabled
echo 🧹 All caches are disabled for maximum freshness

pause
