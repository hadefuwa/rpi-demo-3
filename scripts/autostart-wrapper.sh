#!/bin/bash

echo "🚀 Starting RPI Demo 3 Autostart Wrapper..."

# Set proper environment variables
export DISPLAY=:0
export XAUTHORITY=/home/pi/.Xauthority
export HOME=/home/pi

# Change to project directory
cd /home/pi/rpi-demo-3

# Log startup attempt
echo "$(date): Autostart wrapper starting..." >> /home/pi/rpi-demo-3/autostart.log

# Wait for desktop environment to be fully ready
echo "⏳ Waiting for desktop environment..."
sleep 10

# Check if X server is running
if ! xset q &>/dev/null; then
    echo "❌ X server not available, waiting longer..."
    sleep 10
    if ! xset q &>/dev/null; then
        echo "❌ X server still not available after 20 seconds"
        echo "$(date): X server not available" >> /home/pi/rpi-demo-3/autostart.log
        exit 1
    fi
fi

echo "✅ X server is available"

# Kill any existing processes first
pkill -f chromium || true
pkill -f http-server || true
sleep 3

# Start the HTTP server in the background
echo "🌐 Starting HTTP server..."
npx http-server public -p 3000 --config scripts/http-server-config.json &
SERVER_PID=$!
echo "$(date): HTTP server started with PID $SERVER_PID" >> /home/pi/rpi-demo-3/autostart.log

# Wait for server to be ready
echo "⏳ Waiting for HTTP server to start..."
sleep 8

# Check if server is responding
for i in {1..5}; do
    if curl -s http://localhost:3000 > /dev/null; then
        echo "✅ HTTP server is responding"
        break
    else
        echo "⏳ Server not ready, attempt $i/5..."
        sleep 3
    fi
done

# Verify server is still responding
if ! curl -s http://localhost:3000 > /dev/null; then
    echo "❌ HTTP server failed to start properly"
    echo "$(date): HTTP server failed to start" >> /home/pi/rpi-demo-3/autostart.log
    exit 1
fi

# Create cache-busting timestamp
STAMP=$(date +%s)

# Create temporary profile directory
PROFILE=$(mktemp -d -t kiosk-autostart-XXXXXX)

echo "📁 Using profile: $PROFILE"
echo "🔄 Cache-busting: $STAMP"

# Start Chromium in kiosk mode
echo "🖥️  Launching Chromium in kiosk mode..."
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
  --disable-application-cache \
  --disable-offline-load-stale-cache \
  --disable-sync-preferences \
  --incognito &

BROWSER_PID=$!

echo "✅ Autostart completed successfully!"
echo "🌐 Server PID: $SERVER_PID"
echo "🖥️  Browser PID: $BROWSER_PID"
echo "📁 Profile: $PROFILE"
echo "$(date): Autostart completed - Server PID: $SERVER_PID, Browser PID: $BROWSER_PID" >> /home/pi/rpi-demo-3/autostart.log

# Keep the script running to maintain the service
wait $BROWSER_PID
