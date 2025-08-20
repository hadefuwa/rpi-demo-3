#!/bin/bash

# Setup script for camera permissions on Raspberry Pi 5 touchscreen kiosk

echo "📷 Setting up camera permissions for Raspberry Pi 5 touchscreen kiosk"
echo "================================================================="

# Check if running on Raspberry Pi
if ! grep -q "Raspberry Pi" /proc/cpuinfo 2>/dev/null && ! grep -q "BCM" /proc/cpuinfo 2>/dev/null; then
    echo "⚠️  This script is designed for Raspberry Pi"
    exit 1
fi

echo "✓ Raspberry Pi detected"

# Create persistent profile directory
PROFILE_DIR="$HOME/.config/rpi-showcase-profile"
mkdir -p "$PROFILE_DIR"

echo "📁 Created persistent profile directory: $PROFILE_DIR"

# Create preferences file to auto-allow camera
PREFS_DIR="$PROFILE_DIR/Default"
mkdir -p "$PREFS_DIR"

# Create preferences that allow camera access for localhost
cat > "$PREFS_DIR/Preferences" << 'EOF'
{
   "profile": {
      "content_settings": {
         "exceptions": {
            "media_stream_camera": {
               "http://localhost:3000,*": {
                  "last_modified": "13000000000000000",
                  "setting": 1
               },
               "http://127.0.0.1:3000,*": {
                  "last_modified": "13000000000000000", 
                  "setting": 1
               }
            }
         }
      },
      "default_content_setting_values": {
         "media_stream_camera": 1
      }
   }
}
EOF

echo "✅ Camera permissions configured for localhost:3000"

# Check camera hardware
echo ""
echo "🔍 Checking camera hardware..."

if lsusb | grep -i camera >/dev/null 2>&1; then
    echo "✓ USB camera detected"
elif vcgencmd get_camera | grep -q "detected=1" >/dev/null 2>&1; then
    echo "✓ CSI camera detected"
elif ls /dev/video* >/dev/null 2>&1; then
    echo "✓ Video device found: $(ls /dev/video*)"
else
    echo "❌ No camera detected. Please check connections."
    echo ""
    echo "For CSI camera, try:"
    echo "  sudo raspi-config nonint do_camera 0"
    echo "  sudo reboot"
fi

# Check if libcamera is installed
echo ""
echo "📦 Checking libcamera installation..."

if command -v libcamera-still >/dev/null 2>&1; then
    echo "✓ libcamera tools are installed"
    
    # Test camera
    echo "🧪 Testing camera with libcamera..."
    if timeout 5 libcamera-still -o /tmp/test_camera.jpg --immediate >/dev/null 2>&1; then
        echo "✅ Camera test successful"
        rm -f /tmp/test_camera.jpg
    else
        echo "❌ Camera test failed"
        echo "Try: sudo usermod -a -G video $USER"
        echo "Then logout and login again"
    fi
else
    echo "❌ libcamera tools not found"
    echo "Installing libcamera tools..."
    sudo apt update
    sudo apt install -y libcamera-tools
fi

echo ""
echo "🚀 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Use the updated kiosk script: ./scripts/kiosk.sh"
echo "2. The camera should now work automatically in kiosk mode"
echo "3. If issues persist, check: ./scripts/setup-rpi-camera.sh"
echo ""
echo "For manual testing, open: http://localhost:3000/screens/camera.html"
