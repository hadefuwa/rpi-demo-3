#!/bin/bash

# Pi 5 Camera Test Script
# Tests camera functionality and provides diagnostic information

echo "🔬 Raspberry Pi 5 Camera Diagnostic Script"
echo "=========================================="
echo

# Check if running on Pi 5
echo "📋 System Information:"
echo "Architecture: $(uname -m)"
echo "Kernel: $(uname -r)"
echo "OS: $(cat /etc/os-release | grep PRETTY_NAME | cut -d'"' -f2)"
echo

# Check camera hardware
echo "📷 Camera Hardware Check:"
if command -v libcamera-still &> /dev/null; then
    echo "✅ libcamera-tools installed"
else
    echo "❌ libcamera-tools not installed"
    echo "   Install with: sudo apt update && sudo apt install libcamera-tools"
fi

# Check camera interface
echo
echo "🔌 Camera Interface:"
if grep -q "^camera_auto_detect=1" /boot/config.txt; then
    echo "✅ Camera auto-detect enabled"
elif grep -q "^start_x=1" /boot/config.txt; then
    echo "✅ Camera enabled (legacy)"
else
    echo "❌ Camera not enabled"
    echo "   Enable with: sudo raspi-config nonint do_camera 0"
fi

# Test camera hardware
echo
echo "🧪 Hardware Camera Test:"
if command -v libcamera-still &> /dev/null; then
    echo "Testing camera with libcamera-still..."
    if timeout 10s libcamera-still -t 1000 -o /tmp/test_camera.jpg &> /dev/null; then
        echo "✅ Hardware camera test PASSED"
        ls -la /tmp/test_camera.jpg 2>/dev/null && echo "   Test image created: /tmp/test_camera.jpg"
    else
        echo "❌ Hardware camera test FAILED"
        echo "   Try: sudo systemctl restart camera-service"
    fi
else
    echo "⚠️  Cannot test hardware camera (libcamera-tools not installed)"
fi

# Check for conflicting processes
echo
echo "🔍 Process Check:"
CAMERA_PROCESSES=$(ps aux | grep -E "(camera|libcamera|rpicam)" | grep -v grep | wc -l)
if [ $CAMERA_PROCESSES -gt 0 ]; then
    echo "⚠️  Camera processes running: $CAMERA_PROCESSES"
    ps aux | grep -E "(camera|libcamera|rpicam)" | grep -v grep
else
    echo "✅ No conflicting camera processes"
fi

# Check permissions
echo
echo "🔐 Permission Check:"
if groups | grep -q video; then
    echo "✅ User in video group"
else
    echo "❌ User not in video group"
    echo "   Add with: sudo usermod -a -G video $USER"
fi

# Browser compatibility
echo
echo "🌐 Browser Test:"
if command -v chromium-browser &> /dev/null; then
    echo "✅ Chromium browser available"
    CHROMIUM_VERSION=$(chromium-browser --version 2>/dev/null | head -1)
    echo "   Version: $CHROMIUM_VERSION"
else
    echo "❌ Chromium browser not found"
    echo "   Install with: sudo apt install chromium-browser"
fi

# Network test
echo
echo "🌍 Network Configuration:"
IP_ADDRESS=$(hostname -I | awk '{print $1}')
echo "IP Address: $IP_ADDRESS"
echo "Hostname: $(hostname)"

if [[ $IP_ADDRESS == 192.168.* ]] || [[ $IP_ADDRESS == 10.* ]] || [[ $IP_ADDRESS == 172.* ]]; then
    echo "✅ Local network - HTTP should work for camera"
else
    echo "⚠️  Public network - HTTPS may be required for camera"
fi

echo
echo "🔧 Recommended Next Steps:"
echo "1. Open your Pi showcase in browser"
echo "2. Navigate to Camera Showcase page"
echo "3. Open browser developer tools (F12)"
echo "4. Check console for error messages"
echo "5. Run: Pi5CameraDiagnostics.generateReport()"
echo
echo "📄 For detailed browser diagnostics, run the camera page and check browser console"
echo "   Look for messages starting with 🔬 or 📊"
echo
echo "✅ Diagnostic complete!"
