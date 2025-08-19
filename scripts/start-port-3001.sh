#!/bin/bash

echo "🖥️  Starting RPI 5Inch Showcase on Port 3001..."

# Kill any existing processes
pkill -f http-server || true
pkill -f chromium || true

# Wait a moment
sleep 3

# Set display
export DISPLAY=:0

# Start server on port 3001
echo "🌐 Starting HTTP server on port 3001..."
cd "$(dirname "$0")/.."
npx http-server public -p 3001 --config scripts/http-server-config.json &

# Wait for server
sleep 5

# Check if server is running
if curl -s http://localhost:3001 > /dev/null; then
    echo "✅ Server is running on port 3001"
    echo "🌐 Open in browser: http://localhost:3001"
    echo "🛑 To stop: pkill -f http-server"
else
    echo "❌ Server failed to start on port 3001"
fi
