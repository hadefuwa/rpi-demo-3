# Raspberry Pi Kiosk Startup Procedure Documentation

## Overview
This Raspberry Pi is configured as an industrial training kiosk that automatically boots to display a web application. The system optimizes for fast boot times while maintaining automatic updates from GitHub.

## Startup Flow Diagram

```
Power On
    ↓
System Boot (~3-5 seconds)
    ↓
[rpidemo.service] → Starts web server
    ↓
[startx.service] → Starts X11 display server
    ↓
[.xinitrc] → Configures display & launches browser
    ↓
Chromium Kiosk Mode → Your app displays
```

## Service Architecture

### 1. rpidemo.service
**Location:** `/etc/systemd/system/rpidemo.service`
**Purpose:** Manages the web application server with smart GitHub updates

```ini
[Unit]
Description=RPI Demo 3 Server (fast boot)
After=network.target

[Service]
User=pi
WorkingDirectory=/home/pi/rpi-demo-3
ExecStartPre=-/bin/bash -c 'if timeout 3 ping -c1 8.8.8.8 >/dev/null 2>&1; then git fetch origin && git reset --hard origin/main && git clean -fd && npm install; else echo "No internet - using local version"; fi'
ExecStart=/usr/bin/npm start --prefix /home/pi/rpi-demo-3
Restart=always
RestartSec=5
Environment=PATH=/usr/bin:/usr/local/bin
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

**What it does:**
- **Boot dependency:** Waits only for basic network (not internet connectivity)
- **Smart update:** Checks internet with 3-second timeout
- **Online:** Updates from GitHub, installs dependencies, starts server
- **Offline:** Skips update, starts server with existing code
- **Serves app:** Makes your application available at `http://localhost:3000`

### 2. startx.service
**Location:** `/etc/systemd/system/startx.service`
**Purpose:** Starts the X11 display server for graphical interface

```ini
[Unit]
Description=Start X Server
After=multi-user.target

[Service]
Type=simple
User=pi
TTYPath=/dev/tty1
Environment=XDG_VTNR=1
ExecStart=/bin/bash -c "/usr/bin/startx > /dev/null 2>&1"
StandardInput=tty
StandardOutput=null
StandardError=null

[Install]
WantedBy=multi-user.target
```

**What it does:**
- **Starts X server:** Enables graphical display on HDMI output
- **Runs as pi user:** Proper permissions for display access
- **Executes .xinitrc:** Triggers the display configuration script

## Display Configuration Script

### .xinitrc
**Location:** `/home/pi/.xinitrc`
**Purpose:** Configures display settings and launches the kiosk browser

```bash
#!/bin/sh
# Display power management - prevent screen blanking
xset s off          # Disable screensaver
xset -dpms          # Disable display power management
xset s noblank      # Prevent screen blanking

# Hide mouse cursor when idle
unclutter -idle 1 &

# Start window manager in background
openbox-session &

# Wait for web server to be ready
until curl -s http://localhost:3000 > /dev/null; do
  sleep 2
done

# Launch Chromium in full-screen kiosk mode
chromium-browser \
  --kiosk "http://localhost:3000" \
  --noerrdialogs \
  --disable-session-crashed-bubble \
  --disable-infobars \
  --incognito \
  --no-sandbox \
  --check-for-update-interval=31536000
```

**What it does:**
- **Display setup:** Prevents screen blanking and hides cursor
- **Window manager:** Starts openbox for basic window management
- **Smart waiting:** Loops until web server responds (handles timing issues)
- **Kiosk launch:** Starts Chromium in full-screen mode pointing to your app

## Application Structure

### Package.json Configuration
**Location:** `/home/pi/rpi-demo-3/package.json`
**Key script:**
```json
{
  "scripts": {
    "start": "npx http-server public -p 3000 -o"
  }
}
```

### Application Files
```
/home/pi/rpi-demo-3/
├── public/              # Web application files
├── package.json         # Node.js configuration
├── node_modules/        # Dependencies
└── .git/               # Git repository for updates
```

## Boot Timeline

| Time | Component | Action |
|------|-----------|--------|
| 0-2s | System | Kernel boot, hardware init |
| 2-3s | rpidemo.service | Quick internet check, start web server |
| 3s | startx.service | Start X11 display server |
| 4s | .xinitrc | Configure display, wait for web server |
| 5s | Chromium | Launch browser, display application |

## Update Strategy

### Online Boot
1. **Internet check:** 3-second ping test to 8.8.8.8
2. **Git operations:** `fetch origin` → `reset --hard origin/main` → `clean -fd`
3. **Dependencies:** `npm install` (only if package.json changed)
4. **Start server:** Serve latest code

### Offline Boot
1. **Internet check:** Times out after 3 seconds
2. **Skip updates:** No git operations
3. **Start server:** Serve existing local code

## Service Management Commands

```bash
# Check service status
sudo systemctl status rpidemo.service
sudo systemctl status startx.service

# Enable/disable auto-start
sudo systemctl enable rpidemo.service
sudo systemctl disable rpidemo.service

# Manual start/stop
sudo systemctl start rpidemo.service
sudo systemctl stop rpidemo.service

# View logs
sudo journalctl -u rpidemo.service -f
sudo journalctl -u startx.service -n 20

# Restart entire display stack
sudo systemctl restart startx.service
```

## Troubleshooting Guide

### Common Issues

**Black screen with cursor:**
- Check if rpidemo.service is running: `sudo systemctl status rpidemo.service`
- Test web server: `curl http://localhost:3000`

**App not updating:**
- Check internet connectivity during boot
- View service logs: `sudo journalctl -u rpidemo.service -f`

**Chromium not starting:**
- Clear profile locks: `rm -rf ~/.config/chromium`
- Check .xinitrc execution: `sudo journalctl -u startx.service`

**Slow boot:**
- Check service timing: `systemd-analyze blame`
- Verify network configuration doesn't wait for connectivity

### Manual Testing

```bash
# Test web server manually
cd /home/pi/rpi-demo-3
npm start

# Test display manually
export DISPLAY=:0
chromium-browser --kiosk http://localhost:3000 &

# Test update process
cd /home/pi/rpi-demo-3
git fetch origin && git reset --hard origin/main
```

## Configuration Files Summary

| File | Purpose | Key Settings |
|------|---------|--------------|
| `/etc/systemd/system/rpidemo.service` | Web server management | Auto-update logic, restart policy |
| `/etc/systemd/system/startx.service` | Display server | X11 startup configuration |
| `/home/pi/.xinitrc` | Display setup | Screen settings, browser launch |
| `/home/pi/rpi-demo-3/package.json` | Application config | Start script, dependencies |

This documentation provides a complete reference for understanding and maintaining the kiosk startup system.