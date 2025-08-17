#!/bin/bash

# Raspberry Pi Camera Setup Script for AR Demo
# This script helps configure the camera for the AR showcase

echo "🥧 Raspberry Pi AR Camera Setup"
echo "================================"

# Check if running on Raspberry Pi
if ! grep -q "Raspberry Pi" /proc/cpuinfo 2>/dev/null && ! grep -q "BCM" /proc/cpuinfo 2>/dev/null; then
    echo "⚠️  This script is designed for Raspberry Pi"
    echo "If you're on a different system, the AR should work with standard camera setup"
    exit 1
fi

echo "✓ Raspberry Pi detected"

# Check if camera is enabled
echo ""
echo "📹 Checking camera configuration..."

# Check for camera in config
if ! grep -q "camera_auto_detect=1" /boot/config.txt 2>/dev/null && ! grep -q "start_x=1" /boot/config.txt 2>/dev/null; then
    echo "❌ Camera may not be enabled in config"
    echo ""
    echo "To enable the camera:"
    echo "1. Run: sudo raspi-config"
    echo "2. Go to: 3 Interface Options"
    echo "3. Select: I1 Camera"
    echo "4. Choose: Yes"
    echo "5. Reboot when prompted"
    echo ""
    read -p "Would you like me to try enabling the camera automatically? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🔧 Attempting to enable camera..."
        
        # Add camera configuration
        sudo bash -c 'echo "# Camera configuration for AR" >> /boot/config.txt'
        sudo bash -c 'echo "camera_auto_detect=1" >> /boot/config.txt'
        sudo bash -c 'echo "start_x=1" >> /boot/config.txt'
        sudo bash -c 'echo "gpu_mem=128" >> /boot/config.txt'
        
        echo "✓ Camera configuration added"
        echo "⚠️  Please reboot your Pi for changes to take effect: sudo reboot"
        exit 0
    fi
else
    echo "✓ Camera appears to be enabled in config"
fi

# Check if camera device exists
if [ ! -e /dev/video0 ]; then
    echo "❌ Camera device not found at /dev/video0"
    echo "   Make sure your camera is properly connected"
    echo "   Try rebooting: sudo reboot"
    exit 1
else
    echo "✓ Camera device found at /dev/video0"
fi

# Check camera permissions
echo ""
echo "🔐 Checking camera permissions..."

# Check if user is in video group
if groups $USER | grep -q "video"; then
    echo "✓ User $USER is in video group"
else
    echo "❌ User $USER is NOT in video group"
    echo "Adding user to video group..."
    sudo usermod -a -G video $USER
    echo "✓ Added $USER to video group"
    echo "⚠️  Please log out and log back in, or reboot for changes to take effect"
fi

# Test camera access
echo ""
echo "📸 Testing camera access..."

# Try to access camera with v4l2
if command -v v4l2-ctl &> /dev/null; then
    if v4l2-ctl --device=/dev/video0 --info &> /dev/null; then
        echo "✓ Camera is accessible via v4l2"
        
        # Show camera capabilities
        echo ""
        echo "📊 Camera information:"
        v4l2-ctl --device=/dev/video0 --info | grep -E "(Driver|Card|Bus)"
        v4l2-ctl --device=/dev/video0 --list-formats-ext | head -10
    else
        echo "❌ Camera not accessible via v4l2"
    fi
else
    echo "⚠️  v4l2-ctl not found, installing..."
    sudo apt update && sudo apt install -y v4l-utils
fi

# Check if other processes are using camera
echo ""
echo "🔍 Checking for processes using camera..."

if lsof /dev/video0 2>/dev/null; then
    echo "❌ Another process is using the camera:"
    lsof /dev/video0
    echo ""
    echo "Please close the application using the camera and try again"
else
    echo "✓ No other processes using camera"
fi

# Check browser compatibility
echo ""
echo "🌐 Checking browser setup..."

if command -v chromium-browser &> /dev/null; then
    echo "✓ Chromium browser found (recommended for RPi)"
else
    echo "⚠️  Chromium browser not found"
    echo "   Installing Chromium (recommended for camera support)..."
    sudo apt update && sudo apt install -y chromium-browser
fi

# Memory check
echo ""
echo "💾 Checking system resources..."

# Check available memory
MEM_AVAILABLE=$(free -m | awk 'NR==2{printf "%.0f", $7}')
if [ "$MEM_AVAILABLE" -lt 200 ]; then
    echo "⚠️  Low memory available: ${MEM_AVAILABLE}MB"
    echo "   Consider closing other applications for better AR performance"
else
    echo "✓ Sufficient memory available: ${MEM_AVAILABLE}MB"
fi

# Check GPU memory
GPU_MEM=$(vcgencmd get_mem gpu | cut -d'=' -f2 | cut -d'M' -f1)
if [ "$GPU_MEM" -lt 64 ]; then
    echo "⚠️  Low GPU memory: ${GPU_MEM}MB"
    echo "   Consider increasing GPU memory split to 128MB in raspi-config"
else
    echo "✓ GPU memory: ${GPU_MEM}MB"
fi

echo ""
echo "🎯 AR Setup Summary"
echo "==================="

# Final setup verification
SETUP_OK=true

if [ ! -e /dev/video0 ]; then
    echo "❌ Camera device not available"
    SETUP_OK=false
fi

if ! groups $USER | grep -q "video"; then
    echo "❌ User not in video group"
    SETUP_OK=false
fi

if [ "$MEM_AVAILABLE" -lt 100 ]; then
    echo "⚠️  Very low memory - AR may not work well"
fi

if $SETUP_OK; then
    echo "✅ Camera setup looks good!"
    echo ""
    echo "Next steps:"
    echo "1. Start your web server: npm start"
    echo "2. Open Chromium browser"
    echo "3. Navigate to your AR page"
    echo "4. Allow camera permissions when prompted"
    echo "5. Point camera at a Hiro AR marker"
    echo ""
    echo "📖 You can download Hiro markers from:"
    echo "   https://ar-js-org.github.io/AR.js/data/images/hiro.png"
else
    echo "❌ Setup issues detected - please fix the above problems"
    echo ""
    echo "Common solutions:"
    echo "• Run: sudo raspi-config → Interface Options → Camera → Enable"
    echo "• Reboot: sudo reboot"
    echo "• Check camera cable connection"
    echo "• Close other camera applications"
fi

echo ""
echo "🔧 Advanced debugging:"
echo "• Check camera: vcgencmd get_camera"
echo "• Test camera: raspistill -o test.jpg"
echo "• Monitor resources: htop"
echo "• Check logs: dmesg | grep camera"
