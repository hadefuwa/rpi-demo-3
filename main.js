const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { execSync } = require('child_process');

// Runtime flags for better compatibility on Raspberry Pi / mixed environments
// - Disable GPU to avoid GBM/dma_buf issues on some Pi configurations
// - Prefer software GL (SwiftShader) as a safe fallback
// - Hint Ozone/Chromium to use X11 when a DISPLAY is available
app.disableHardwareAcceleration();
app.commandLine.appendSwitch('use-gl', 'swiftshader');
app.commandLine.appendSwitch('ozone-platform-hint', 'x11');
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

// -----------------------
// Simple settings storage
// -----------------------
function getSettingsPath() {
  const dir = app.getPath('userData');
  return path.join(dir, 'settings.json');
}

function readSettings() {
  try {
    const p = getSettingsPath();
    if (!fs.existsSync(p)) return { theme: 'dark', sound: true };
    const raw = fs.readFileSync(p, 'utf8');
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return { theme: 'dark', sound: true };
    return { theme: parsed.theme === 'light' ? 'light' : 'dark', sound: !!parsed.sound };
  } catch {
    return { theme: 'dark', sound: true };
  }
}

function writeSettings(newSettings) {
  try {
    const p = getSettingsPath();
    const dir = path.dirname(p);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const merged = { theme: 'dark', sound: true, ...newSettings };
    fs.writeFileSync(p, JSON.stringify(merged, null, 2), 'utf8');
    return merged;
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

ipcMain.handle('read-settings', () => {
  return readSettings();
});

ipcMain.handle('write-settings', (_event, updated) => {
  return writeSettings(updated);
});

// -----------------------
// System info (memory, temp, CPU, network, storage)
// -----------------------
function readTemperatureC() {
  try {
    const sysPath = '/sys/class/thermal/thermal_zone0/temp';
    if (fs.existsSync(sysPath)) {
      const v = fs.readFileSync(sysPath, 'utf8').trim();
      const num = parseInt(v, 10);
      if (!Number.isNaN(num)) return Math.round(num / 100) / 10; // e.g. 55234 -> 55.2
    }
  } catch {}
  try {
    const out = execSync('vcgencmd measure_temp', { encoding: 'utf8' }).trim();
    // Example: temp=45.2'C
    const m = out.match(/temp=([0-9.]+)/);
    if (m) return parseFloat(m[1]);
  } catch {}
  return null;
}

function getCPUUsage() {
  try {
    // Read CPU stats from /proc/stat
    const statContent = fs.readFileSync('/proc/stat', 'utf8');
    const cpuLine = statContent.split('\n')[0];
    const cpuValues = cpuLine.split(' ').filter(val => val.trim() !== '');
    
    if (cpuValues.length >= 5) {
      const user = parseInt(cpuValues[1]);
      const nice = parseInt(cpuValues[2]);
      const system = parseInt(cpuValues[3]);
      const idle = parseInt(cpuValues[4]);
      
      const total = user + nice + system + idle;
      const used = total - idle;
      
      return total > 0 ? Math.round((used / total) * 100) : null;
    }
  } catch {}
  return null;
}

function getUptime() {
  try {
    const uptime = os.uptime();
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    
    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  } catch {}
  return null;
}

function getNetworkInfo() {
  try {
    // Get network interfaces
    const interfaces = os.networkInterfaces();
    let wifiStatus = 'Disconnected';
    let ipAddress = 'N/A';
    
    for (const [name, nets] of Object.entries(interfaces)) {
      if (name.startsWith('wlan') || name.startsWith('wifi')) {
        for (const net of nets) {
          if (net.family === 'IPv4' && !net.internal) {
            wifiStatus = 'Connected';
            ipAddress = net.address;
            break;
          }
        }
      }
    }
    
    return { wifiStatus, ipAddress };
  } catch {}
  return { wifiStatus: 'Unknown', ipAddress: 'N/A' };
}

function getStorageInfo() {
  try {
    // Get disk usage for root and home
    const rootStats = fs.statSync('/');
    const homeStats = fs.statSync(os.homedir());
    
    const formatBytes = (bytes) => {
      if (bytes === 0) return '0 B';
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };
    
    return {
      root: formatBytes(rootStats.size || 0),
      home: formatBytes(homeStats.size || 0)
    };
  } catch {}
  return { root: 'N/A', home: 'N/A' };
}

ipcMain.handle('get-system-info', () => {
  const total = os.totalmem();
  const free = os.freemem();
  const used = total - free;
  const memPercent = total > 0 ? Math.round((used / total) * 100) : null;
  const tempC = readTemperatureC();
  const cpuPercent = getCPUUsage();
  const uptime = getUptime();
  const network = getNetworkInfo();
  const storage = getStorageInfo();
  
  return { 
    memPercent, 
    tempC, 
    cpuPercent, 
    uptime, 
    network, 
    storage 
  };
});

// App version (renderer requests via preload)
ipcMain.handle('get-app-version', () => {
  try { return app.getVersion(); } catch { return '0.0.0'; }
});

// -----------------------
// Save drawing
// -----------------------
function getPicturesDir() {
  const home = os.homedir();
  const pictures = path.join(home, 'Pictures');
  if (fs.existsSync(pictures)) return pictures;
  return home; // fallback
}

ipcMain.handle('save-image', (_event, dataUrl) => {
  try {
    const base64 = String(dataUrl).split(',')[1];
    const buffer = Buffer.from(base64, 'base64');
    const folder = path.join(getPicturesDir(), 'Showcase');
    if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
    const now = new Date();
    const ts = now.toISOString().replace(/[:.]/g, '-');
    const file = path.join(folder, `drawing-${ts}.png`);
    fs.writeFileSync(file, buffer);
    return { ok: true, path: file };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
});

// -----------------------
// Read asset text (e.g., STL) safely from packaged app
// -----------------------
ipcMain.handle('read-asset-text', (_event, relativeName) => {
  try {
    // Assets live in app root 'assets' whether unpacked or asar
    const assetPath = path.join(__dirname, 'assets', String(relativeName));
    const content = fs.readFileSync(assetPath, 'utf8');
    return { ok: true, content };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
});

ipcMain.handle('read-asset-bytes', (_event, relativeName) => {
  try {
    const assetPath = path.join(__dirname, 'assets', String(relativeName));
    const buf = fs.readFileSync(assetPath);
    return { ok: true, data: buf.toString('base64') };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
});


