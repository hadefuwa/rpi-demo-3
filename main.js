const { app, BrowserWindow } = require('electron');
const path = require('path');

// Enable Chromium touch events for better touchscreen behavior
app.commandLine.appendSwitch('touch-events', 'enabled');

function createMainWindow() {
  const mainWindow = new BrowserWindow({
    width: 1024, // Ignored when fullscreen/kiosk is true, but kept for dev
    height: 600,
    backgroundColor: '#0d0f14',
    show: true,
    autoHideMenuBar: true,
    fullscreen: true, // occupy entire screen
    kiosk: true,      // immersive, no OS chrome
    frame: false,     // hide window frame for a mobile feel
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));
}

app.whenReady().then(() => {
  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  app.quit();
});


