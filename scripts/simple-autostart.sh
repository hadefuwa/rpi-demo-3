#!/bin/bash

echo "🚀 Starting RPI Demo 3 Simple Autostart..."

# Set environment variables
export DISPLAY=:0
export XAUTHORITY=/home/pi/.Xauthority
export HOME=/home/pi

# Change to project directory
cd /home/pi/rpi-demo-3

# Create log file
LOG_FILE="/home/pi/rpi-demo-3/simple-autostart.log"
echo "$(date): Simple autostart starting..." >> "$LOG_FILE"

# Kill any existing processes
echo "🧹 Cleaning up existing processes..."
pkill -f chromium &>/dev/null || true
pkill -f http-server &>/dev/null || true
sleep 3

# Start HTTP server
echo "🌐 Starting HTTP server..."
nohup npx http-server public -p 3000 --config scripts/http-server-config.json > /tmp/http-server.log 2>&1 &
SERVER_PID=$!
echo "$(date): HTTP server started with PID $SERVER_PID" >> "$LOG_FILE"

# Wait for server
echo "⏳ Waiting for HTTP server..."
sleep 10

# Test if server is responding
for i in {1..10}; do
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        echo "✅ HTTP server is responding"
        echo "$(date): HTTP server responding on attempt $i" >> "$LOG_FILE"
        break
    else
        echo "⏳ Server check $i/10..."
        sleep 2
    fi
done

# Start browser (try different approaches)
echo "🖥️  Starting browser..."

# Try method 1: Direct chromium
DISPLAY=:0 chromium-browser \
  --kiosk \
  --no-first-run \
  --no-default-browser-check \
  --disable-translate \
  --disable-extensions \
  --disable-background-timer-throttling \
  --no-sandbox \
  --disable-dev-shm-usage \
  --disable-gpu \
  "http://localhost:3000?autostart=$(date +%s)" \
  > /tmp/chromium.log 2>&1 &

BROWSER_PID=$!
echo "$(date): Browser started with PID $BROWSER_PID" >> "$LOG_FILE"

echo "✅ Simple autostart completed"
echo "📊 Server PID: $SERVER_PID"
echo "🖥️  Browser PID: $BROWSER_PID"
echo "📋 Check logs: tail -f $LOG_FILE"

# Keep running
sleep infinity
