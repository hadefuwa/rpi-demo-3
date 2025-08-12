#!/bin/bash

echo "🖥️  Starting RPI 5Inch Showcase in Kiosk Mode..."

# Kill any existing chromium processes
pkill -f chromium

# Wait a moment
sleep 2

# Start chromium in kiosk mode
chromium-browser --kiosk --disable-web-security --disable-features=VizDisplayCompositor --no-first-run --no-default-browser-check --disable-translate --disable-extensions --disable-plugins --disable-images --disable-javascript --disable-background-timer-throttling --disable-backgrounding-occluded-windows --disable-renderer-backgrounding --disable-features=TranslateUI --disable-ipc-flooding-protection --disable-background-networking --disable-default-apps --disable-sync --metrics-recording-only --no-sandbox --disable-dev-shm-usage --disable-gpu --disable-software-rasterizer --disable-background-timer-throttling --disable-backgrounding-occluded-windows --disable-renderer-backgrounding --disable-features=TranslateUI --disable-ipc-flooding-protection --disable-background-networking --disable-default-apps --disable-sync --metrics-recording-only --no-sandbox --disable-dev-shm-usage --disable-gpu --disable-software-rasterizer http://localhost:3000 &

echo "✅ Kiosk mode started!"
echo "🔄 To exit kiosk mode: Press Alt+F4 or Ctrl+Shift+Q"
