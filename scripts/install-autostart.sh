#!/usr/bin/env bash
set -e

APP_DIR="$HOME/RPI-5Inch"
AUTOSTART_DIR="$HOME/.config/autostart"
DESKTOP_FILE="$AUTOSTART_DIR/rpi-showcase.desktop"

mkdir -p "$AUTOSTART_DIR"

cat > "$DESKTOP_FILE" <<EOF
[Desktop Entry]
Type=Application
Name=RPI Showcase
Comment=Auto-start Electron Showcase App
Exec=$APP_DIR/scripts/start-showcase.sh
X-GNOME-Autostart-enabled=true
Terminal=false
EOF

chmod +x "$APP_DIR/scripts/start-showcase.sh"

echo "Installed autostart: $DESKTOP_FILE"

