#!/bin/bash

echo "🖥️  Starting RPI 5Inch Showcase in Kiosk Mode..."

# Kill any existing chromium processes
pkill -f chromium || true
pkill -f chrome || true

# Wait a moment for processes to fully terminate
sleep 2

# Create a unique cache-busting timestamp
STAMP=$(date +%s)

# Create a completely fresh, disposable profile directory
PROFILE=$(mktemp -d -t kiosk-XXXXXX)

echo "📁 Using temporary profile: $PROFILE"
echo "🔄 Cache-busting timestamp: $STAMP"

# Start chromium in kiosk mode with optimized flags for PWA
# Key fixes: disposable profile, cache-busting URL, disabled caching
chromium-browser \
  --kiosk "http://localhost:3000?v=${STAMP}" \
  --user-data-dir="$PROFILE" \
  --no-first-run \
  --no-default-browser-check \
  --disable-http-cache \
  --disk-cache-size=1 \
  --media-cache-size=1 \
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
  --disable-gpu \
  --disable-software-rasterizer \
  --incognito &

echo "✅ Kiosk mode started!"
echo "🔄 To exit kiosk mode: Press Alt+F4 or Ctrl+Shift+Q"
echo "🌐 PWA is running at: http://localhost:3000?v=${STAMP}"
echo "📁 Profile directory: $PROFILE"
echo ""
echo "💡 This profile will be automatically cleaned up on exit"
echo "🔧 For development, use: npm run dev"
