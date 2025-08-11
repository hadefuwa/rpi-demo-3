Project Checklist (RPI 7" Showcase)
===================================

Legend: [ ] todo, [x] done, [~] in progress/optional

Core setup
----------
- [x] Choose platform: Electron (simple + offline)
- [x] Set window to 1024×600 and enable touch events
- [x] Kiosk/fullscreen, frameless window
- [x] Hide mouse cursor for touch‑first UX
- [x] Initial scaffold (`main.js`, `preload.js`, `renderer/*`)
- [x] Add `RPI_SETUP.md` and autostart scripts (`scripts/*.sh`)
- [x] Add `GIT_QUICK_REFERENCE.md`
- [x] Add `CHANGELOG.md`

Visual/branding
---------------
- [ ] Place Matrix logo on Home (`assets/matrix.png`) and size nicely
- [x] Place Matrix logo on Home (`assets/matrix.png`) and size nicely
- [ ] Apply final brand color in CSS variables (`--brand`, `--accent`)
- [ ] Confirm fonts (local) and text sizes on device

Screens
-------
- [x] Home screen with large cards (navigation)
- [x] Touch Demo with color & brush size
- [x] Scroll Test screen for touch panning
- [x] Tic‑Tac‑Toe game
- [ ] System Info (real values)
- [ ] Settings (simple toggles)

Touch Demo (canvas)
-------------------
- [x] Smooth line strokes (no dotted gaps)
- [x] Canvas fills remaining height; resizes with window and DPR
- [ ] Add Save button → write PNG to `~/Pictures/Showcase`
- [x] Add Save button → write PNG to `~/Pictures/Showcase`
- [x] Add simple success toast after save

System Info
-----------
- [x] Memory percent: `os.totalmem()` and `os.freemem()` via IPC
- [x] Temperature: read `/sys/class/thermal/thermal_zone0/temp` (fallback `vcgencmd`)
- [x] Update UI every 1s; show "N/A" on failure
- [~] CPU usage (optional first pass)

Settings (simple)
-----------------
- [x] Theme toggle: Dark/Light
- [x] Sound toggle: Click sound on taps
- [x] Persist settings to JSON file in app data

Raspberry Pi integration
------------------------
- [x] Autostart scripts created
- [ ] Install autostart on the Pi (`./scripts/install-autostart.sh`) and verify
- [ ] Confirm screen blanking disabled in `raspi-config`

Polish & QA
-----------
- [x] Back button works with in‑app history stack
- [x] Scrolling works (touch panning + drag fallback)
- [ ] Confirm visuals on device: spacing, hit sizes, contrast
- [ ] Basic performance check (smooth at 30fps target)

Nice‑to‑have (later)
--------------------
- [ ] Add local sounds (`assets/sounds/click.mp3`) and play on button taps
- [ ] Simple splash/launch screen
- [ ] Package build steps if needed


