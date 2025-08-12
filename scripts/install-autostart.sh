#!/bin/bash

echo "🚀 Installing RPI 5Inch Showcase Auto-Start Service..."

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    echo "❌ Please don't run this script as root. Run as pi user instead."
    exit 1
fi

# Get the current directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo "📁 Project directory: $PROJECT_DIR"

# Copy the service file to systemd
echo "📋 Copying service file..."
sudo cp "$SCRIPT_DIR/rpi-showcase.service" /etc/systemd/system/

# Update the WorkingDirectory in the service file
echo "🔧 Updating service configuration..."
sudo sed -i "s|WorkingDirectory=/home/pi/rpi-demo-3|WorkingDirectory=$PROJECT_DIR|g" /etc/systemd/system/rpi-showcase.service

# Reload systemd
echo "🔄 Reloading systemd..."
sudo systemctl daemon-reload

# Enable the service
echo "✅ Enabling service..."
sudo systemctl enable rpi-showcase.service

# Start the service
echo "🚀 Starting service..."
sudo systemctl start rpi-showcase.service

# Check status
echo "📊 Service status:"
sudo systemctl status rpi-showcase.service --no-pager

echo ""
echo "🎉 Auto-start service installed successfully!"
echo "📱 Your PWA will now start automatically on boot"
echo ""
echo "🔧 Useful commands:"
echo "   sudo systemctl start rpi-showcase.service    # Start now"
echo "   sudo systemctl stop rpi-showcase.service     # Stop now"
echo "   sudo systemctl restart rpi-showcase.service  # Restart"
echo "   sudo systemctl status rpi-showcase.service   # Check status"
echo "   sudo journalctl -u rpi-showcase.service -f   # View logs"
echo ""
echo "🔄 To disable auto-start: sudo systemctl disable rpi-showcase.service"
