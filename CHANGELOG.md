Changelog
=========

All notable changes to this project will be documented here.

Unreleased
----------
- Planned: Add logo to Home, Save drawing to PNG, Real System Info (memory/temperature/CPU).

2025-08-11 – Touch Demo layout + resizing
----------------------------------------
- Touch Demo canvas now fills remaining height and resizes with the window.
- Canvas uses devicePixelRatio for crisp strokes.

2025-08-11 – Back button and navigation
--------------------------------------
- Added simple in‑app history stack.
- Back button disabled when no history.

2025-08-11 – Kiosk / fullscreen and touch UX
-------------------------------------------
- Enabled fullscreen, frameless, kiosk mode for native feel.
- Hid mouse cursor on UI to avoid pointer jumps during touch.

2025-08-11 – 7" screen and scrolling improvements
-----------------------------------------------
- Set window and viewport to 1024×600.
- Enabled Chromium touch events.
- Scroll Test screen added with touch panning and drag‑to‑scroll fallback.
- Drawing canvas switched to smooth line strokes.

2025-08-11 – Logo, Save PNG, System Info, Settings
--------------------------------------------------
- Added Matrix logo on Home.
- Touch Demo can save PNGs to `~/Pictures/Showcase`.
- System Info shows memory percent and temperature via IPC.
- Added Settings screen with theme (dark/light) and sound toggle, saved to app data.

2025-08-11 – Visuals screen
---------------------------
- New Visuals screen with three demos: Particles, Ripples, and Analog Clock.
- Interactive: touch/mouse influences particles and spawns ripples.

2025-08-11 – Raspberry Pi setup & autostart
-------------------------------------------
- Added `RPI_SETUP.md` with step‑by‑step Pi instructions.
- Added scripts: `scripts/install-autostart.sh`, `scripts/start-showcase.sh`, `scripts/uninstall-autostart.sh`.

2025-08-11 – Git quick reference
-------------------------------
- Added `GIT_QUICK_REFERENCE.md` with push/pull commands for PC and Pi.

2025-08-11 – Initial scaffold
-----------------------------
- Electron app scaffold with `main.js`, `preload.js`, `renderer/` UI, local assets folders, and basic styles.
- README and `.gitignore` added.

