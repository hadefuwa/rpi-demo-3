#!/bin/bash

echo "🖥️  Starting RPI 5Inch Showcase in Kiosk Mode..."

# Kill any existing chromium processes
pkill -f chromium || true
pkill -f chrome || true

# Kill any existing http-server processes
pkill -f http-server || true

# Wait a moment for processes to fully terminate
sleep 3

# Start the HTTP server in the background
echo "🌐 Starting HTTP server..."
cd "$(dirname "$0")/.."
npx http-server public -p 3000 --config scripts/http-server-config.json &
SERVER_PID=$!

# Wait for server to start
echo "⏳ Waiting for server to start..."
sleep 5

# Check if server is running
if ! curl -s http://localhost:3000 > /dev/null; then
    echo "❌ Server failed to start. Retrying..."
    sleep 3
    if ! curl -s http://localhost:3000 > /dev/null; then
        echo "❌ Server still not responding. Check logs and try manual start:"
        echo "   cd $(pwd) && npm run serve"
        exit 1
    fi
fi

echo "✅ HTTP server is running on port 3000"

# Create a unique cache-busting timestamp
STAMP=$(date +%s)

# Create a persistent profile directory for better performance
PROFILE_DIR="$HOME/.config/rpi-showcase-profile"
mkdir -p "$PROFILE_DIR"

echo "📁 Using persistent profile: $PROFILE_DIR"
echo "🔄 Cache-busting timestamp: $STAMP"

# Start chromium in kiosk mode with optimized settings
# Key changes: persistent profile, removed incognito, optimized performance
chromium-browser \
  --kiosk "http://localhost:3000?v=${STAMP}" \
  --user-data-dir="$PROFILE_DIR" \
  --no-first-run \
  --no-default-browser-check \
  --disable-background-timer-throttling \
  --disable-backgrounding-occluded-windows \
  --disable-renderer-backgrounding \
  --disable-features=TranslateUI \
  --disable-default-apps \
  --disable-sync \
  --no-sandbox \
  --disable-dev-shm-usage \
  --disable-gpu \
  --disable-software-rasterizer \
  --allow-running-insecure-content \
  --unsafely-treat-insecure-origin-as-secure=http://localhost:3000 &

echo "✅ Kiosk mode started!"
echo "🔄 To exit kiosk mode: Press Alt+F4 or Ctrl+Shift+Q"
echo "🌐 PWA is running at: http://localhost:3000?v=${STAMP}"
echo "📁 Profile directory: $PROFILE_DIR"
echo "🔧 Server PID: $SERVER_PID"
echo ""
echo "🔧 For development, use: npm run dev"
echo "🛑 To stop everything: pkill -f http-server && pkill -f chromium"
