#!/bin/bash

echo "🧹 Cleaning up old Chromium profiles and caches..."

# Kill any running Chromium processes
echo "🔄 Stopping Chromium processes..."
pkill -f chromium || true
pkill -f chrome || true

# Wait for processes to fully terminate
sleep 3

# Remove old persistent profiles and caches
echo "🗑️  Removing old profiles and caches..."

# Remove service worker directories
rm -rf ~/.config/chromium/Default/Service\ Worker 2>/dev/null || true
rm -rf ~/.config/chromium/Default/Service\ Worker\ ScriptCache 2>/dev/null || true

# Remove cache directories
rm -rf ~/.config/chromium/Default/Cache 2>/dev/null || true
rm -rf ~/.config/chromium/Default/Code\ Cache 2>/dev/null || true
rm -rf ~/.config/chromium/Default/GPUCache 2>/dev/null || true

# Remove storage directories
rm -rf ~/.config/chromium/Default/Storage 2>/dev/null || true
rm -rf ~/.config/chromium/Default/IndexedDB 2>/dev/null || true
rm -rf ~/.config/chromium/Default/Local\ Storage 2>/dev/null || true
rm -rf ~/.config/chromium/Default/Session\ Storage 2>/dev/null || true

# Remove other cache locations
rm -rf ~/.cache/chromium 2>/dev/null || true
rm -rf ~/.cache/google-chrome 2>/dev/null || true

# Remove temporary profiles
echo "🧹 Cleaning up temporary kiosk profiles..."
find /tmp -name "kiosk-*" -type d -exec rm -rf {} + 2>/dev/null || true

echo "✅ Cleanup complete!"
echo ""
echo "💡 Now you can run:"
echo "   npm run kiosk    # Start with fresh profile"
echo "   npm run fresh    # Start server with no caching"
echo ""
echo "🔧 For development: npm run dev"
