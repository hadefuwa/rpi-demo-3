# RPI-5Inch Showcase App - Troubleshooting Guide

## 🚨 Common Errors and Solutions

### 1. GBM Wrapper and DMA Buffer Errors (Raspberry Pi)

**Error Messages:**
```
[ERROR:gbm_wrapper.cc(72)] Failed to get fd for plane.: No such file or directory (2)
[ERROR:gbm_wrapper.cc(255)] Failed to export buffer to dma_buf: No such file or directory (2)
```

**What These Errors Mean:**
These are graphics buffer management errors that occur when the Raspberry Pi's graphics drivers can't properly handle hardware-accelerated rendering. They're common on Pi systems and usually don't affect app functionality.

**Solutions:**

#### Option A: Quick Fix (Recommended)
Run the optimization script:
```bash
cd ~/RPI-5Inch
chmod +x scripts/raspberry-pi-optimization.sh
./scripts/raspberry-pi-optimization.sh
sudo reboot
```

#### Option B: Manual Fix
1. Edit `/boot/config.txt`:
   ```bash
   sudo nano /boot/config.txt
   ```
2. Add these lines:
   ```
   gpu_mem=256
   dtoverlay=vc4-fkms-v3d
   gpu_mem_256=1
   ```
3. Reboot:
   ```bash
   sudo reboot
   ```

#### Option C: Environment Variables
Create `~/.rpi-5inch-env`:
```bash
export LIBGL_ALWAYS_SOFTWARE=1
export LIBGL_ALWAYS_INDIRECT=1
export MESA_GL_VERSION_OVERRIDE=3.3
```

### 2. App Crashes on Startup

**Symptoms:**
- App starts then immediately exits
- No error messages displayed
- Terminal returns to prompt

**Solutions:**

#### Windows:
```cmd
npm run start:windows
```
Or use the batch file:
```cmd
scripts\start-windows.bat
```

#### Raspberry Pi:
```bash
npm run start:raspberry-pi
```

#### Debug Mode:
```bash
npm run start:debug
```

### 3. Graphics Rendering Issues

**Symptoms:**
- Black screen
- Missing elements
- Poor performance
- Visual artifacts

**Solutions:**

#### Force Software Rendering:
```bash
export LIBGL_ALWAYS_SOFTWARE=1
npm start
```

#### Disable Hardware Acceleration:
The app already includes these flags, but you can add more:
```bash
export ELECTRON_DISABLE_GPU_SANDBOX=1
export ELECTRON_DISABLE_GPU_PROCESS=1
npm start
```

### 4. Touch Screen Issues

**Symptoms:**
- Touch events not working
- Incorrect touch coordinates
- Touch lag

**Solutions:**

#### Check Touch Device:
```bash
ls -la /dev/input/event*
xinput list
```

#### Test Touch:
```bash
evtest /dev/input/event0
```

#### Force Touch Events:
The app already enables touch events, but verify in `main.js`:
```javascript
app.commandLine.appendSwitch('touch-events', 'enabled');
```

## 🔧 Platform-Specific Solutions

### Raspberry Pi

#### Performance Optimization:
```bash
# Set CPU governor to performance
echo performance | sudo tee /sys/devices/system/cpu/cpu*/cpufreq/scaling_governor

# Increase GPU memory
echo "gpu_mem=256" | sudo tee -a /boot/config.txt

# Disable unnecessary services
sudo systemctl disable hciuart.service
sudo systemctl disable bluetooth.service
```

#### Auto-start Setup:
```bash
# Enable auto-start service
sudo systemctl enable rpi-5inch-showcase.service

# Check service status
sudo systemctl status rpi-5inch-showcase.service

# View logs
journalctl -u rpi-5inch-showcase.service -f
```

### Windows

#### Graphics Driver Issues:
1. Update graphics drivers
2. Disable hardware acceleration in Windows
3. Use Windows Defender exclusion for the project folder

#### Performance Issues:
```cmd
# Use Windows-optimized startup
npm run start:windows

# Or use the batch file
scripts\start-windows.bat
```

### macOS

#### Security Issues:
1. Allow Electron in Security & Privacy settings
2. Grant accessibility permissions if needed

#### Performance Issues:
```bash
# Use macOS-optimized settings
export ELECTRON_DISABLE_GPU_SANDBOX=1
npm start
```

## 📊 Performance Monitoring

### System Resources:
```bash
# CPU and Memory
htop

# GPU Memory
vcgencmd get_mem gpu

# Temperature
vcgencmd measure_temp

# Disk Usage
df -h

# Network
ip addr show
```

### App Performance:
```bash
# Monitor app performance
~/RPI-5Inch/scripts/monitor-performance.sh

# Check app logs
journalctl -u rpi-5inch-showcase.service -f
```

## 🐛 Debugging

### Enable Verbose Logging:
```bash
npm run start:debug
```

### Check Console Output:
1. Open Developer Tools (F12 or Ctrl+Shift+I)
2. Check Console tab for JavaScript errors
3. Check Network tab for failed requests

### Common JavaScript Errors:
- Missing files: Check file paths in `renderer/` directory
- Canvas issues: Verify canvas elements exist in HTML
- Touch events: Check touch event handlers

## 🔄 Recovery Procedures

### If App Won't Start:
1. Check Node.js version: `node --version` (should be ≥16)
2. Reinstall dependencies: `rm -rf node_modules && npm install`
3. Clear Electron cache: `rm -rf ~/.config/electron`
4. Check file permissions: `ls -la`

### If Graphics Are Broken:
1. Force software rendering
2. Disable hardware acceleration
3. Update system packages: `sudo apt update && sudo apt upgrade`
4. Check display settings: `xrandr`

### If Touch Doesn't Work:
1. Verify touch device: `ls -la /dev/input/event*`
2. Check touch permissions: `sudo usermod -a -G input $USER`
3. Test touch manually: `evtest /dev/input/event0`
4. Reboot system

## 📞 Getting Help

### Before Asking for Help:
1. Check this troubleshooting guide
2. Run the optimization script
3. Check system logs
4. Verify your setup matches requirements

### Information to Provide:
- Operating system and version
- Raspberry Pi model (if applicable)
- Node.js version: `node --version`
- npm version: `npm --version`
- Exact error messages
- Steps to reproduce the issue
- What you've already tried

### Useful Commands for Diagnostics:
```bash
# System info
uname -a
cat /etc/os-release
vcgencmd get_config str

# Graphics info
glxinfo | grep "OpenGL version"
xrandr --listproviders

# Process info
ps aux | grep electron
ps aux | grep node

# Memory info
free -h
cat /proc/meminfo | grep MemTotal
```

## 🎯 Quick Fix Checklist

For most issues, try this sequence:

1. ✅ Run optimization script: `./scripts/raspberry-pi-optimization.sh`
2. ✅ Reboot system: `sudo reboot`
3. ✅ Use platform-specific start command
4. ✅ Check for error messages in console
5. ✅ Verify all dependencies are installed
6. ✅ Check file permissions and paths

## 💡 Pro Tips

- **Always reboot after changing `/boot/config.txt`**
- **Use `npm run start:debug` for troubleshooting**
- **Monitor system resources while running the app**
- **Keep system packages updated**
- **Use the provided optimization scripts**
- **Check logs regularly for early warning signs**

---

*This troubleshooting guide covers the most common issues. If your problem persists, please provide detailed information about your setup and the specific errors you're seeing.*
