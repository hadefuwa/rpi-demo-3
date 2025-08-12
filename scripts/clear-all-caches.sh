#!/bin/bash

echo "🧹 Clearing ALL caches and forcing fresh content..."

# Kill any existing chromium processes
echo "🔄 Stopping Chromium processes..."
pkill -f chromium || true
pkill -f chrome || true

# Wait for processes to fully terminate
sleep 3

# Clear Chromium user data directories
echo "🗑️  Clearing Chromium user data..."
rm -rf ~/.config/chromium/Default/Service\ Worker 2>/dev/null || true
rm -rf ~/.config/chromium/Default/Cache 2>/dev/null || true
rm -rf ~/.config/chromium/Default/Code\ Cache 2>/dev/null || true
rm -rf ~/.config/chromium/Default/Storage 2>/dev/null || true
rm -rf ~/.config/chromium/Default/IndexedDB 2>/dev/null || true
rm -rf ~/.cache/chromium 2>/dev/null || true

# Clear any temporary profiles
echo "🗑️  Clearing temporary profiles..."
rm -rf /tmp/kiosk-* 2>/dev/null || true
rm -rf /tmp/dev-kiosk-* 2>/dev/null || true

# Clear system caches
echo "🗑️  Clearing system caches..."
sudo sh -c 'echo 3 > /proc/sys/vm/drop_caches' 2>/dev/null || true

# Clear browser caches in memory
echo "🗑️  Clearing memory caches..."
sudo sync 2>/dev/null || true

echo "✅ All caches cleared!"
echo ""
echo "🚀 To start fresh, run:"
echo "   npm run dev-fresh    # For Linux/Mac"
echo "   npm run dev-fresh-win # For Windows"
echo ""
echo "💡 This will start with a completely clean profile and no cached content"
