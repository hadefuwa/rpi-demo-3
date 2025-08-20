#!/bin/bash

# Development script to test camera permissions outside kiosk mode

echo "🔧 Starting development server with camera permission testing"
echo "============================================================"

# Kill any existing processes
pkill -f http-server || true
pkill -f chromium || true

# Start HTTP server
echo "🌐 Starting HTTP server on port 3000..."
cd "$(dirname "$0")/.."
npx http-server public -p 3000 &
SERVER_PID=$!

# Wait for server to start
sleep 3

echo "✅ Server started (PID: $SERVER_PID)"
echo ""
echo "🌐 Open one of these URLs to test camera:"
echo "   http://localhost:3000/screens/camera.html"
echo "   http://127.0.0.1:3000/screens/camera.html"
echo ""
echo "📱 For testing on Pi touchscreen:"
echo "   chromium-browser http://localhost:3000/screens/camera.html"
echo ""
echo "🛑 To stop: pkill -f http-server"
echo ""
echo "💡 If camera permissions don't work:"
echo "   1. Run: ./scripts/setup-camera-permissions.sh"
echo "   2. Try kiosk mode: ./scripts/kiosk.sh"
echo "   3. Check browser settings for camera permissions"
