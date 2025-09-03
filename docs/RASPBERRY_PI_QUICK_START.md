# Raspberry Pi PWA Cache Fix - Quick Start

## 🍓 For Raspberry Pi Users Only

This guide is specifically for running your PWA on a Raspberry Pi with guaranteed fresh content every time.

## 🚀 Quick Commands

### Start Development Server (Fresh Content)
```bash
npm run dev-fresh
```

### Clear All Caches Manually
```bash
npm run clear-cache
```

### Standard Development Mode
```bash
npm run dev
```

### Kiosk Mode (Fresh Profile Every Time)
```bash
npm run kiosk
```

## 🔧 What These Scripts Do

### `npm run dev-fresh`
- Creates a temporary Chromium profile (deleted on exit)
- Disables ALL caching mechanisms
- Adds cache-busting timestamps to URLs
- Guarantees fresh content every time

### `npm run clear-cache`
- Kills any running Chromium processes
- Clears all Chromium user data directories
- Removes service worker caches
- Clears IndexedDB and LocalStorage
- Removes temporary profiles

### `npm run kiosk`
- Starts in kiosk mode with disposable profile
- Perfect for production testing
- Fresh profile every time

## 🎯 When to Use Each Command

| Use Case | Command | Why |
|----------|---------|-----|
| **Development** | `npm run dev-fresh` | Always fresh content, no caching |
| **Cache Issues** | `npm run clear-cache` | Nuclear option to clear everything |
| **Production Test** | `npm run kiosk` | Real-world testing with fresh profile |
| **Normal Dev** | `npm run dev` | Standard development with cache headers |

## 🐛 Troubleshooting on Pi

### Still seeing old content?
```bash
# Nuclear option - clear everything
npm run clear-cache

# Then start fresh
npm run dev-fresh
```

### Chromium not starting?
```bash
# Check if Chromium is installed
which chromium-browser

# If not installed:
sudo apt update
sudo apt install chromium-browser
```

### Permission issues?
```bash
# Make scripts executable
chmod +x scripts/*.sh

# Check script permissions
ls -la scripts/*.sh
```

## 🔍 Verify It's Working

1. **Check Console**: Look for "🚫 Service Worker disabled in development mode"
2. **Check Network Tab**: Verify no-cache headers are sent
3. **Check Cache Storage**: Should be empty in development mode
4. **Check Service Workers**: Should show "No service workers" in dev tools

## 📱 Pi-Specific Notes

- **Architecture**: ARM (not x86)
- **Browser**: Chromium (not Chrome)
- **OS**: Raspberry Pi OS (Debian-based)
- **Display**: 5-inch touch screen
- **Performance**: Optimized for Pi hardware

## 🎉 Expected Results

- ✅ **No more yesterday's files**
- ✅ **Always fresh content on startup**
- ✅ **No service worker interference in dev**
- ✅ **Clean profiles every time**
- ✅ **Maximum performance on Pi hardware**

## 🚨 Important Pi Commands

```bash
# Kill all Chromium processes
pkill -f chromium

# Check running processes
ps aux | grep chromium

# Monitor system resources
htop

# Check disk space
df -h

# Check memory usage
free -h
```

## 🔄 Update Your Pi

```bash
# Update system packages
sudo apt update && sudo apt upgrade

# Update Chromium specifically
sudo apt install --only-upgrade chromium-browser

# Reboot if needed
sudo reboot
```

Your PWA will now serve fresh content every time on your Raspberry Pi! 🎯
