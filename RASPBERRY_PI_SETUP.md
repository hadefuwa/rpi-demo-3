# 🍓 Raspberry Pi Setup Guide

## **Quick Start (Recommended)**

```bash
# 1. Clone the repository
cd ~
git clone https://github.com/hadefuwa/rpi-5inch-2.git
cd rpi-5inch-2

# 2. Install dependencies
npm install

# 3. Install auto-start service
chmod +x scripts/*.sh
./scripts/install-autostart.sh

# 4. Reboot to test
sudo reboot
```

## **Manual Setup**

### **Install Dependencies**
```bash
# Install Node.js and npm (if not already installed)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Chromium for kiosk mode
sudo apt-get install -y chromium-browser
```

### **Start the PWA**
```bash
# Start the server
npm start

# In another terminal, start kiosk mode
./scripts/start-kiosk.sh
```

## **Auto-Start Service**

### **Install Auto-Start**
```bash
./scripts/install-autostart.sh
```

### **Manage the Service**
```bash
# Check status
sudo systemctl status rpi-showcase.service

# Start manually
sudo systemctl start rpi-showcase.service

# Stop manually
sudo systemctl stop rpi-showcase.service

# Restart
sudo systemctl restart rpi-showcase.service

# View logs
sudo journalctl -u rpi-showcase.service -f
```

### **Uninstall Auto-Start**
```bash
./scripts/uninstall-autostart.sh
```

## **Kiosk Mode**

### **Start Kiosk Mode**
```bash
npm run kiosk
```

### **Exit Kiosk Mode**
- Press `Alt+F4`
- Or press `Ctrl+Shift+Q`

## **Troubleshooting**

### **Service Won't Start**
```bash
# Check logs
sudo journalctl -u rpi-showcase.service -f

# Check if port 3000 is available
netstat -tlnp | grep :3000

# Restart the service
sudo systemctl restart rpi-showcase.service
```

### **Display Issues**
```bash
# Check if X11 is running
echo $DISPLAY

# Check if user is in video group
groups pi

# Add user to video group if needed
sudo usermod -a -G video pi
```

### **Port Already in Use**
```bash
# Find what's using port 3000
sudo lsof -i :3000

# Kill the process
sudo kill -9 <PID>
```

## **Configuration**

### **Change Port**
Edit `package.json` and change the port in the scripts section.

### **Change Display**
Edit `scripts/rpi-showcase.service` and change `DISPLAY=:0` to your display.

### **Auto-Hide Cursor**
Add to `/boot/config.txt`:
```
# Hide cursor
disable_overscan=1
```

## **Performance Tips**

1. **Overclock** (optional): Add to `/boot/config.txt`:
   ```
   arm_freq=1750
   gpu_freq=600
   ```

2. **Disable unnecessary services**:
   ```bash
   sudo systemctl disable bluetooth
   sudo systemctl disable avahi-daemon
   ```

3. **Use SSD** instead of SD card for better performance

## **Security Notes**

- The service runs as the `pi` user
- Kiosk mode disables some security features
- Consider using a dedicated user account for production
