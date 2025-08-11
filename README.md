RPI 5-Inch Showcase (Electron)
================================

A simple, beautiful Electron app optimized for a 5" Raspberry Pi display. It focuses on clear visuals and touch-friendly UI.

Scripts
-------

- npm start – run the Electron app

Structure
---------

- main.js – Electron main process
- preload.js – safe bridge (minimal for v1)
- renderer/ – HTML, CSS, and JS UI
- assets/ – fonts, icons (add your files here)

Install and Run
---------------

```
npm install
npm start
```

Notes
-----

- Adjust BrowserWindow size in main.js to match your actual display resolution.
- All assets are local so it works offline.

