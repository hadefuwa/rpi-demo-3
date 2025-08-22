#!/bin/bash

echo "🔄 Syncing RPI 5Inch Showcase from PC..."

# Navigate to project directory
cd ~/rpi-demo-3

# Fetch latest changes
echo "📥 Fetching latest changes..."
git fetch origin

# Hard reset to match PC exactly
echo "🔄 Resetting to match PC..."
git reset --hard origin/main

# Clean any untracked files
echo "🧹 Cleaning untracked files..."
git clean -fd

# Install/update dependencies
echo "📦 Installing dependencies..."
npm install

# Make scripts executable
echo "🔧 Making scripts executable..."
chmod +x scripts/*.sh

# Clear any existing caches
echo "🧹 Clearing caches..."
npm run clear-cache

echo "✅ Sync complete! Starting kiosk mode..."
echo "🚀 Starting in 3 seconds..."

sleep 3

# Start kiosk mode
npm run kiosk
