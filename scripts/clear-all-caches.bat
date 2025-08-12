@echo off
echo 🧹 Clearing ALL caches and forcing fresh content...

REM Kill any existing chromium processes
echo 🔄 Stopping Chromium processes...
taskkill /f /im chromium.exe 2>nul
taskkill /f /im chrome.exe 2>nul

REM Wait for processes to fully terminate
timeout /t 3 /nobreak >nul

REM Clear Chromium user data directories
echo 🗑️  Clearing Chromium user data...
rmdir /s /q "%LOCALAPPDATA%\Google\Chrome\User Data\Default\Service Worker" 2>nul
rmdir /s /q "%LOCALAPPDATA%\Google\Chrome\User Data\Default\Cache" 2>nul
rmdir /s /q "%LOCALAPPDATA%\Google\Chrome\User Data\Default\Code Cache" 2>nul
rmdir /s /q "%LOCALAPPDATA%\Google\Chrome\User Data\Default\Storage" 2>nul
rmdir /s /q "%LOCALAPPDATA%\Google\Chrome\User Data\Default\IndexedDB" 2>nul

REM Clear any temporary profiles
echo 🗑️  Clearing temporary profiles...
rmdir /s /q "%TEMP%\kiosk-*" 2>nul
rmdir /s /q "%TEMP%\dev-kiosk-*" 2>nul

REM Clear browser caches in memory
echo 🗑️  Clearing memory caches...
ipconfig /flushdns >nul 2>&1

echo ✅ All caches cleared!
echo.
echo 🚀 To start fresh, run:
echo    npm run dev-fresh-win
echo.
echo 💡 This will start with a completely clean profile and no cached content

pause
