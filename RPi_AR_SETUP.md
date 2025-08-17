# 🥧 Raspberry Pi AR Setup Guide

This guide will help you set up the AR (Augmented Reality) demo on your Raspberry Pi.

## Quick Setup

### 1. Enable Camera
```bash
sudo raspi-config
# Navigate to: 3 Interface Options → I1 Camera → Yes
# Reboot when prompted
sudo reboot
```

### 2. Run Setup Script
```bash
# Make script executable
chmod +x scripts/setup-rpi-camera.sh

# Run the setup script
./scripts/setup-rpi-camera.sh
```

### 3. Start the Server
```bash
# Install dependencies (if not already done)
npm install

# Start the web server
npm start
```

### 4. Open in Browser
1. Open **Chromium** browser (recommended for RPi)
2. Navigate to `http://localhost:3000`
3. Click on **AR Demo**
4. Allow camera access when prompted

## Troubleshooting

### Camera Not Working?

**Check camera is enabled:**
```bash
vcgencmd get_camera
# Should show: supported=1 detected=1
```

**Test camera manually:**
```bash
raspistill -o test.jpg
# Should take a photo
```

**Check camera device:**
```bash
ls -la /dev/video*
# Should show /dev/video0
```

### Permission Issues?

**Add user to video group:**
```bash
sudo usermod -a -G video $USER
# Log out and back in, or reboot
```

**Check permissions:**
```bash
groups $USER
# Should include 'video'
```

### Performance Issues?

**Increase GPU memory:**
```bash
sudo raspi-config
# Navigate to: 7 Advanced Options → A3 Memory Split → 128
```

**Close other applications:**
```bash
# Check running processes
htop
# Close unnecessary applications
```

**Free up memory:**
```bash
# Clear cache
sudo sync && sudo sysctl vm.drop_caches=3
```

### Browser Issues?

**Use Chromium (recommended):**
```bash
# Install if missing
sudo apt update
sudo apt install chromium-browser
```

**Clear browser cache:**
- Open Chromium
- Press `Ctrl + Shift + Delete`
- Clear cache and cookies

### Network Issues?

**Check local server:**
```bash
# Test server is running
curl http://localhost:3000
```

**Check IP address:**
```bash
hostname -I
# Use this IP from other devices: http://192.168.x.x:3000
```

## Hardware Requirements

### Raspberry Pi Models
- **Pi 4**: Best performance, recommended
- **Pi 3B+**: Good performance with optimizations
- **Pi 3B**: Basic performance, may be slow
- **Pi Zero**: Not recommended for AR

### Camera Requirements
- **RPi Camera Module**: Recommended (V1, V2, or HQ)
- **USB Camera**: Supported, may need additional drivers
- **Connection**: Ensure camera cable is properly connected

### Memory Requirements
- **Minimum**: 1GB RAM
- **Recommended**: 2GB+ RAM
- **GPU Memory**: 128MB or higher

## AR Markers

### Hiro Marker (Default)
- Download: https://ar-js-org.github.io/AR.js/data/images/hiro.png
- Print on white paper
- Ensure good lighting for detection

### Custom Markers
- Use AR.js marker generator
- High contrast black and white patterns work best

## Performance Tips

### For Better AR Performance:
1. **Close unnecessary applications**
2. **Use a high-quality SD card (Class 10 or better)**
3. **Ensure good lighting for marker detection**
4. **Keep markers flat and unobstructed**
5. **Use a stable camera mount if possible**

### RPi-Specific Optimizations:
- Reduced video resolution (320x240) for better performance
- Lower frame rate (10 FPS) to reduce CPU load
- Simplified AR detection algorithms
- Disabled unnecessary visual effects

## Common Error Messages

### "Camera access denied"
→ Run the setup script and enable camera in raspi-config

### "No camera found"
→ Check camera connection and enable in raspi-config

### "Camera is busy"
→ Close other applications using the camera

### "AR initialization timeout"
→ Normal on slower Pi models, wait longer or reboot

### "Permission denied"
→ Add user to video group and reboot

## Advanced Configuration

### Manual Camera Configuration
Edit `/boot/config.txt`:
```bash
sudo nano /boot/config.txt

# Add these lines:
camera_auto_detect=1
start_x=1
gpu_mem=128
```

### Performance Tuning
```bash
# Increase swap (if needed)
sudo dphys-swapfile swapoff
sudo nano /etc/dphys-swapfile
# Set CONF_SWAPSIZE=1024
sudo dphys-swapfile setup
sudo dphys-swapfile swapon

# Optimize for camera
echo 'vm.vfs_cache_pressure=50' | sudo tee -a /etc/sysctl.conf
```

## Support

If you continue having issues:

1. **Check the browser console** for error messages
2. **Run the setup script** for automatic diagnosis
3. **Try different browsers** (Chromium, Firefox)
4. **Reboot the Pi** to clear any stuck processes
5. **Update the system**: `sudo apt update && sudo apt upgrade`

## File Locations

- **AR Page**: `public/screens/ar.html`
- **Setup Script**: `scripts/setup-rpi-camera.sh`
- **Config**: `/boot/config.txt`
- **Camera Device**: `/dev/video0`
