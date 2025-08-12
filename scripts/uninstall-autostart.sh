#!/bin/bash

echo "🗑️  Uninstalling RPI 5Inch Showcase Auto-Start Service..."

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    echo "❌ Please don't run this script as root. Run as pi user instead."
    exit 1
fi

# Stop the service
echo "🛑 Stopping service..."
sudo systemctl stop rpi-showcase.service

# Disable the service
echo "❌ Disabling service..."
sudo systemctl disable rpi-showcase.service

# Remove the service file
echo "🗑️  Removing service file..."
sudo rm -f /etc/systemd/system/rpi-showcase.service

# Reload systemd
echo "🔄 Reloading systemd..."
sudo systemctl daemon-reload

echo ""
echo "✅ Auto-start service uninstalled successfully!"
echo "🔄 Your PWA will no longer start automatically on boot"
echo ""
echo "💡 To reinstall: run ./scripts/install-autostart.sh"
