#!/usr/bin/env bash
set -e

# Launch the Electron app from the repo directory
APP_DIR="$HOME/RPI-5Inch"

cd "$APP_DIR"

# Optional: give the desktop a moment to initialize
sleep 2

# Start the app without blocking the session
npm start >/tmp/rpi-showcase.log 2>&1 &

echo "Showcase started. Logs: /tmp/rpi-showcase.log"

