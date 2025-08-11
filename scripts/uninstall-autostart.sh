#!/usr/bin/env bash
set -e

AUTOSTART_FILE="$HOME/.config/autostart/rpi-showcase.desktop"

if [ -f "$AUTOSTART_FILE" ]; then
  rm -f "$AUTOSTART_FILE"
  echo "Removed autostart file: $AUTOSTART_FILE"
else
  echo "Autostart file not found: $AUTOSTART_FILE"
fi

