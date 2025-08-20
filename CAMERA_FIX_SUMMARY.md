# Camera Permission Fix for Raspberry Pi 5 Touchscreen

## Problem
The camera used to work on RPi 3 and 4, but on RPi 5 it won't ask for permission on the touchscreen (though it works when accessed via web server from another device).

## Root Cause
The kiosk mode configuration was using browser flags that prevented camera permissions:
1. `--incognito` mode prevents permission persistence
2. Temporary profile directory means permissions can't be saved
3. Various security flags suppress permission dialogs
4. HTTPS enforcement was too strict for localhost

## Solutions Applied

### 1. Updated Kiosk Script (`scripts/kiosk.sh`)
- **Removed**: `--incognito` flag
- **Changed**: Temporary profile → Persistent profile directory
- **Added**: Camera-specific flags:
  - `--auto-accept-camera-and-microphone-capture`
  - `--unsafely-treat-insecure-origin-as-secure=http://localhost:3000`
  - `--allow-running-insecure-content`
- **Removed**: Excessive cache disabling and security flags

### 2. Updated Camera Code (`public/screens/camera.html`)
- **Relaxed**: HTTPS enforcement for localhost
- **Improved**: Pi 5 detection and error messages
- **Enhanced**: Permission handling for touchscreen kiosk mode

### 3. New Setup Script (`scripts/setup-camera-permissions.sh`)
- Creates persistent browser profile
- Pre-configures camera permissions for localhost
- Tests camera hardware
- Installs libcamera tools if needed

### 4. New Development Script (`scripts/test-camera-dev.sh`)
- For testing camera outside kiosk mode
- Provides debugging instructions

## How to Fix Your Pi 5

### Quick Fix (Run on your Pi 5):
```bash
# 1. Setup camera permissions
cd /path/to/your/rpi-demo-3
chmod +x scripts/*.sh
./scripts/setup-camera-permissions.sh

# 2. Start kiosk mode with new configuration
./scripts/kiosk.sh
```

### Manual Steps:
1. **Copy the updated files** from this workspace to your Pi 5
2. **Run the setup script**: `./scripts/setup-camera-permissions.sh`
3. **Use the updated kiosk script**: `./scripts/kiosk.sh`

### What Changed:
- **Kiosk mode** now uses a persistent profile that saves camera permissions
- **Browser flags** optimized for camera access while maintaining kiosk functionality
- **Error handling** improved for Pi 5 specific issues
- **Permission setup** automated through the setup script

### If Still Not Working:
1. Check camera hardware: `lsusb | grep -i camera`
2. Test camera directly: `libcamera-still -o test.jpg`
3. Enable camera in raspi-config: `sudo raspi-config`
4. Check browser console for specific errors
5. Try the development script: `./scripts/test-camera-dev.sh`

The key insight was that the incognito mode and temporary profile were preventing the browser from remembering camera permissions, which is essential for touchscreen kiosk operation where users can't easily interact with permission popups.
