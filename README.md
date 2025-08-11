RPI 5-Inch Showcase (Electron)
================================

A touch-friendly Electron app designed for a 5" Raspberry Pi display with fun demos: touch paint, system info, games (Tic‑Tac‑Toe, Memory, Snake), visuals, 3D STL viewer, and a scroll test.

Features
--------

- Touch‑friendly UI, Back/Home navigation
- System Info panel (CPU/Memory bars, temperature, app version)
- Touch Paint canvas with color/brush controls
- Games: Tic‑Tac‑Toe, Memory Match (plain text tiles), Snake (Easy/Hard)
- Visuals: particles, ripples, analog clock, equalizer, starfield, fireworks
- 3D STL viewer with animated star background, rotation/zoom, model switching
- Scroll Test with 3D spin/roll list items reacting to scroll velocity
- Raspberry Pi autostart scripts

Getting Started (Windows/macOS/Linux)
-------------------------------------

1. Install Node.js (LTS) and Git
2. Clone and install deps
   ```bash
   git clone https://github.com/<your-user>/RPI-5Inch.git
   cd RPI-5Inch
   npm install
   ```
3. Run in development
   ```bash
   npx electron .
   # or
   npm start
   ```

Raspberry Pi Setup
------------------

1. Raspberry Pi OS with desktop (recommended)
2. Install Node.js and Git
3. Clone the repo in your home folder
   ```bash
   cd ~
   git clone https://github.com/<your-user>/RPI-5Inch.git
   cd RPI-5Inch
   npm install
   ```
4. Run once to verify
   ```bash
   DISPLAY=:0 npx electron .
   ```

Autostart on Login (LXDE)
-------------------------

Use the included scripts to install a desktop autostart entry that launches the app automatically:

```bash
cd ~/RPI-5Inch
chmod +x scripts/*.sh
./scripts/install-autostart.sh
```

- The desktop entry calls `scripts/start-showcase.sh`
- On boot/login it will:
  - Wait briefly for network
  - `git fetch` and `git pull --rebase` latest `main`
  - Install dependencies if `node_modules` is missing
  - Start the app
- Logs: `/tmp/rpi-showcase.log`

Updating the App on Pi
----------------------

Push to `main` on GitHub, then reboot or log out/in on the Pi. The autostart script pulls latest on next run. You can also update manually:

```bash
cd ~/RPI-5Inch
git pull --rebase origin main
npm install
DISPLAY=:0 npx electron .
```

Versioning
----------

- The app reads the version from `package.json` via the preload bridge
- Visible on both System Info and About screens
- To bump: edit `package.json` → `version`, commit, push

Troubleshooting
---------------

- Electron not found on Windows PowerShell: use `npx electron .` or `npm install --save-dev electron`
- Pi shows GBM/dma_buf or DISPLAY errors: the app now disables GPU and forces software GL, and hints X11 from `main.js`
- Memory Match shows blank tiles: switched to plain text food names for compatibility
- Home buttons look flat: the CSS includes fallback gradients/z‑index so effects appear even if mask composite isn’t supported

Structure
---------

- `main.js` – Electron main process (GPU disabled on Pi for stability)
- `preload.js` – safe bridge exposing `window.appInfo.version` and APIs
- `renderer/` – HTML, CSS, and JS UI
- `assets/` – images, STL models
- `scripts/` – autostart install/uninstall and boot launcher

License
-------

MIT

