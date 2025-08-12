#!/bin/bash

# Install emoji fonts for Raspberry Pi
echo "📦 Installing emoji fonts for Raspberry Pi..."

# Update package list
echo "🔄 Updating package list..."
sudo apt update

# Install Noto Color Emoji font - primary emoji font for Linux
echo "📱 Installing Noto Color Emoji font..."
sudo apt install -y fonts-noto-color-emoji

# Install additional emoji fonts for better coverage
echo "🎨 Installing additional emoji fonts..."
sudo apt install -y fonts-emojione

# Install font configuration utilities if not present
echo "🔧 Installing font utilities..."
sudo apt install -y fontconfig

# Update font cache
echo "💾 Updating font cache..."
sudo fc-cache -f -v

# Create custom font configuration for emoji support
echo "⚙️ Configuring emoji fonts..."
sudo mkdir -p /etc/fonts/conf.d

# Create emoji font configuration file
sudo tee /etc/fonts/conf.d/60-emoji.conf > /dev/null <<EOF
<?xml version="1.0"?>
<!DOCTYPE fontconfig SYSTEM "fonts.dtd">
<fontconfig>
  <!-- Enable emoji rendering -->
  <alias binding="strong">
    <family>emoji</family>
    <prefer>
      <family>Noto Color Emoji</family>
      <family>EmojiOne</family>
      <family>Apple Color Emoji</family>
      <family>Segoe UI Emoji</family>
    </prefer>
  </alias>
  
  <!-- Fallback for sans-serif fonts -->
  <alias binding="weak">
    <family>sans-serif</family>
    <prefer>
      <family>DejaVu Sans</family>
      <family>Liberation Sans</family>
      <family>Noto Color Emoji</family>
      <family>EmojiOne</family>
    </prefer>
  </alias>
  
  <!-- Ensure emojis display in color -->
  <match target="font">
    <test name="family">
      <string>Noto Color Emoji</string>
    </test>
    <edit name="scalable" mode="assign">
      <bool>true</bool>
    </edit>
  </match>
</fontconfig>
EOF

# Refresh font cache again after configuration
echo "🔄 Final font cache refresh..."
sudo fc-cache -f -v

# Verify installation
echo "✅ Verifying emoji font installation..."
echo "📋 Available emoji fonts:"
fc-list | grep -i emoji | head -5

# Test emoji support
echo ""
echo "🧪 Testing emoji display (if you see boxes or question marks, there may be an issue):"
echo "👆 📊 🎮 📜 🎨 🧊 🖨️ ⚙️ ℹ️"
echo ""

echo "🎉 Emoji font installation complete!"
echo ""
echo "📝 IMPORTANT NOTES:"
echo "   - You may need to restart your desktop session for changes to take full effect"
echo "   - If using Chromium browser, restart it completely"
echo "   - Some applications may need to be restarted to pick up new fonts"
echo ""
echo "🔄 To apply changes immediately, you can:"
echo "   1. Restart your desktop session: sudo systemctl restart lightdm"
echo "   2. Or reboot your Raspberry Pi: sudo reboot"
echo ""
echo "✨ Your RPI showcase should now display emojis correctly!"
