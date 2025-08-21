#!/bin/bash

echo "🖥️  Starting RPI 5Inch Showcase in Kiosk Mode..."

# Kill any existing chromium processes
pkill -f chromium

# Wait a moment
sleep 2

# Start chromium in kiosk mode with optimized flags for PWA and camera support
chromium-browser \
  --kiosk \
  --disable-web-security \
  --no-first-run \
  --no-default-browser-check \
  --disable-translate \
  --disable-extensions \
  --disable-plugins \
  --disable-background-timer-throttling \
  --disable-backgrounding-occluded-windows \
  --disable-renderer-backgrounding \
  --disable-features=TranslateUI \
  --disable-ipc-flooding-protection \
  --disable-background-networking \
  --disable-default-apps \
  --disable-sync \
  --metrics-recording-only \
  --no-sandbox \
  --disable-dev-shm-usage \
  --use-fake-ui-for-media-stream \
  --use-fake-device-for-media-stream \
  --autoplay-policy=no-user-gesture-required \
  --allow-running-insecure-content \
  --enable-features=VaapiVideoDecoder \
  --use-gl=egl \
  --app=http://localhost:3000 &

echo "✅ Kiosk mode started!"
echo "🔄 To exit kiosk mode: Press Alt+F4 or Ctrl+Shift+Q"
echo "🌐 PWA is running at: http://localhost:3000"
