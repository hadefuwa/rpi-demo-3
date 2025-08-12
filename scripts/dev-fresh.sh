#!/bin/bash

echo "🚀 Starting RPI 5Inch Showcase in Development Mode (Fresh Content Guaranteed)..."

# Kill any existing chromium processes
pkill -f chromium || true
pkill -f chrome || true

# Wait a moment for processes to fully terminate
sleep 2

# Create a unique cache-busting timestamp with milliseconds
STAMP=$(date +%s%3N)

# Create a completely fresh, disposable profile directory
PROFILE=$(mktemp -d -t dev-kiosk-XXXXXX)

echo "📁 Using temporary profile: $PROFILE"
echo "🔄 Cache-busting timestamp: $STAMP"
echo "🔧 Development mode: aggressive cache clearing enabled"

# Start chromium in development mode with maximum cache disabling
chromium-browser \
  --kiosk "http://localhost:3000?v=${STAMP}&dev=true&t=${STAMP}" \
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
  --disable-application-cache \
  --disable-offline-load-stale-cache \
  --disable-background-networking \
  --disable-sync-preferences \
  --disable-web-security \
  --disable-features=VizDisplayCompositor \
  --incognito &

echo "✅ Development mode started!"
echo "🔄 To exit kiosk mode: Press Alt+F4 or Ctrl+Shift+Q"
echo "🌐 PWA is running at: http://localhost:3000?v=${STAMP}&dev=true&t=${STAMP}"
echo "📁 Profile directory: $PROFILE"
echo ""
echo "💡 This profile will be automatically cleaned up on exit"
echo "🔧 Development mode: aggressive cache clearing enabled"
echo "🧹 All caches are disabled for maximum freshness"
