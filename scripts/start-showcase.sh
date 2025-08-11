#!/usr/bin/env bash
set -e

# Launch the Electron app from the repo directory
APP_DIR="$HOME/RPI-5Inch"
LOG_FILE="/tmp/rpi-showcase.log"

{
  echo "== RPI Showcase boot $(date) =="
  echo "APP_DIR: $APP_DIR"

  # Give the desktop a moment to initialize
  sleep 2

  # Best-effort: wait briefly for network so git can pull
  for i in {1..10}; do
    if ping -c1 -W1 github.com >/dev/null 2>&1; then
      echo "Network detected (github.com reachable)"
      break
    fi
    echo "Waiting for network... ($i)"
    sleep 2
  done

  cd "$APP_DIR"

  # Update repo (non-fatal if it fails)
  CURR=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")
  echo "Current HEAD: $CURR"
  if git fetch origin >/dev/null 2>&1; then
    echo "Fetched from origin"
    if git rev-parse --abbrev-ref HEAD | grep -q "main"; then
      if git pull --rebase --autostash origin main; then
        echo "Pulled latest from origin/main"
      else
        echo "git pull failed (continuing with local copy)"
      fi
    else
      echo "Not on main branch; skipping auto-pull"
    fi
  else
    echo "git fetch failed (offline? continuing with local copy)"
  fi

  # Ensure dependencies are installed (non-fatal if it fails)
  if [ ! -d node_modules ]; then
    echo "Installing dependencies (node_modules missing)..."
    if ! npm ci --no-audit --no-fund; then
      echo "npm ci failed; trying npm install"
      npm install --no-audit --no-fund || true
    fi
  else
    echo "node_modules present; skipping full reinstall"
  fi

  # Start the app without blocking the session
  echo "Starting app..."
  npm start &
  echo "Showcase started. Logs: $LOG_FILE"
} >>"$LOG_FILE" 2>&1 &

