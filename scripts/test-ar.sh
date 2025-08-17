#!/bin/bash

# AR Demo Test Script for Raspberry Pi
# Tests camera functionality and AR.js compatibility

echo "🎯 AR Demo Test Script"
echo "======================="

# Check if camera module is enabled
echo "📹 Checking camera module..."
if lsmod | grep -q bcm2835_v4l2; then
    echo "✅ Camera module is loaded"
else
    echo "❌ Camera module not found. Enable with 'sudo raspi-config'"
    echo "   Navigate to: Interfacing Options > Camera > Enable"
    exit 1
fi

# Test camera functionality
echo "📷 Testing camera functionality..."
if command -v raspistill >/dev/null 2>&1; then
    echo "✅ raspistill command available"
    
    # Take a test photo
    if raspistill -t 1 -o /tmp/ar_test.jpg 2>/dev/null; then
        echo "✅ Camera test successful"
        rm -f /tmp/ar_test.jpg
    else
        echo "❌ Camera test failed"
        echo "   Check camera connection and enable camera module"
        exit 1
    fi
else
    echo "❌ raspistill not found. Install with: sudo apt install raspistill"
fi

# Check browser compatibility
echo "🌐 Checking browser compatibility..."
if command -v chromium-browser >/dev/null 2>&1; then
    echo "✅ Chromium browser found (recommended)"
elif command -v firefox >/dev/null 2>&1; then
    echo "✅ Firefox browser found"
elif command -v google-chrome >/dev/null 2>&1; then
    echo "✅ Chrome browser found"
else
    echo "⚠️  No compatible browser found. Install Chromium:"
    echo "   sudo apt install chromium-browser"
fi

# Check WebRTC support (requires running browser)
echo "📡 WebRTC Support:"
echo "   ✅ Should work with Chromium/Chrome"
echo "   ✅ Should work with Firefox"
echo "   ⚠️  Limited support in Safari"

# Check hardware capabilities
echo "🔧 Hardware Information:"
echo "   CPU: $(nproc) cores"
echo "   Memory: $(free -m | awk 'NR==2{printf "%.1f GB", $2/1024}')"
echo "   GPU: $(vcgencmd get_mem gpu | cut -d= -f2)"

# Pi model detection
PI_MODEL=$(cat /proc/device-tree/model 2>/dev/null || echo "Unknown")
echo "   Model: $PI_MODEL"

# Quality recommendations
if echo "$PI_MODEL" | grep -q "Pi 3"; then
    echo "🎮 Recommended quality: LOW (Pi 3 detected)"
elif echo "$PI_MODEL" | grep -q "Pi 4"; then
    echo "🎮 Recommended quality: MEDIUM (Pi 4 detected)"
elif echo "$PI_MODEL" | grep -q "Pi 5"; then
    echo "🎮 Recommended quality: HIGH (Pi 5 detected)"
else
    echo "🎮 Recommended quality: MEDIUM (unknown model)"
fi

# Network check for CDN resources
echo "🌍 Checking network connectivity..."
if ping -c 1 aframe.io >/dev/null 2>&1; then
    echo "✅ A-Frame CDN accessible"
else
    echo "⚠️  A-Frame CDN not accessible - AR demo may not load"
fi

if ping -c 1 cdn.jsdelivr.net >/dev/null 2>&1; then
    echo "✅ AR.js CDN accessible"
else
    echo "⚠️  AR.js CDN not accessible - AR demo may not load"
fi

# Check for GPU acceleration
echo "🎮 GPU Acceleration:"
if [ -f "/opt/vc/bin/vcgencmd" ]; then
    GPU_MEM=$(vcgencmd get_mem gpu | cut -d= -f2 | sed 's/M//')
    if [ "$GPU_MEM" -ge 64 ]; then
        echo "✅ GPU memory: ${GPU_MEM}M (sufficient for AR)"
    else
        echo "⚠️  GPU memory: ${GPU_MEM}M (increase with raspi-config)"
        echo "   Recommended: 128M or higher for better AR performance"
    fi
else
    echo "⚠️  Cannot check GPU memory allocation"
fi

# AR Marker recommendations
echo "🎯 AR Marker Setup:"
echo "   📄 Print Hiro marker on white paper"
echo "   📏 Minimum size: 5cm x 5cm"
echo "   💡 Ensure good lighting"
echo "   📐 Keep marker flat and visible"
echo "   📏 Optimal distance: 20-50cm from camera"

# Browser permissions
echo "🔐 Browser Permissions:"
echo "   📹 Camera access must be allowed"
echo "   🔒 HTTPS may be required for camera access"
echo "   🌐 Use 'localhost' or HTTPS for best compatibility"

# Launch recommendations
echo "🚀 Launch Recommendations:"
echo "   1. Start demo from main menu (AR Demo button)"
echo "   2. Allow camera permissions when prompted"
echo "   3. Print and prepare Hiro marker"
echo "   4. Point camera at marker"
echo "   5. Use side panel to control AR objects"

echo ""
echo "✅ AR Demo test completed!"
echo "🎯 Ready to launch AR Demo"

# Optional: Launch the demo if in GUI environment
if [ -n "$DISPLAY" ] && command -v chromium-browser >/dev/null 2>&1; then
    echo ""
    read -p "Launch AR Demo now? (y/n): " -r
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🚀 Launching AR Demo..."
        chromium-browser --kiosk --start-fullscreen http://localhost:8080/public/screens/ar.html 2>/dev/null &
    fi
fi
