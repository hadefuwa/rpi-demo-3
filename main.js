const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { execSync } = require('child_process');

// Basic graphics flags for Raspberry Pi compatibility
app.disableHardwareAcceleration();
app.commandLine.appendSwitch('use-gl', 'swiftshader');

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
// System info (memory, temp, CPU, network, storage) - Cross-platform compatible
// -----------------------
function readTemperatureC() {
  try {
    // Only try Linux-specific paths if we're on Linux
    if (os.platform() === 'linux') {
      const sysPath = '/sys/class/thermal/thermal_zone0/temp';
      if (fs.existsSync(sysPath)) {
        const v = fs.readFileSync(sysPath, 'utf8').trim();
        const num = parseInt(v, 10);
        if (!Number.isNaN(num)) return Math.round(num / 100) / 10; // e.g. 55234 -> 55.2
      }
      
      try {
        const out = execSync('vcgencmd measure_temp', { encoding: 'utf8' }).trim();
        // Example: temp=45.2'C
        const m = out.match(/temp=([0-9.]+)/);
        if (m) return parseFloat(m[1]);
      } catch {}
    }
    
    // Fallback for development/demo on non-Linux systems
    if (os.platform() !== 'linux') {
      // Simulate a reasonable temperature value for demo purposes
      return 45 + Math.random() * 15; // 45-60°C range
    }
  } catch {}
  return null;
}

// Global variable to store previous CPU stats for accurate calculation
let previousCpuStats = null;

function getCPUUsage() {
  try {
    // Only try Linux-specific paths if we're on Linux
    if (os.platform() === 'linux') {
      // Read CPU stats from /proc/stat
      const statContent = fs.readFileSync('/proc/stat', 'utf8');
      const cpuLine = statContent.split('\n')[0];
      const cpuValues = cpuLine.split(' ').filter(val => val.trim() !== '');
      
      if (cpuValues.length >= 8) {
        const user = parseInt(cpuValues[1]);
        const nice = parseInt(cpuValues[2]);
        const system = parseInt(cpuValues[3]);
        const idle = parseInt(cpuValues[4]);
        const iowait = parseInt(cpuValues[5]);
        const irq = parseInt(cpuValues[6]);
        const softirq = parseInt(cpuValues[7]);
        
        const currentStats = {
          idle: idle + iowait,
          total: user + nice + system + idle + iowait + irq + softirq
        };
        
        if (previousCpuStats) {
          const idleDiff = currentStats.idle - previousCpuStats.idle;
          const totalDiff = currentStats.total - previousCpuStats.total;
          
          if (totalDiff > 0) {
            const cpuPercent = Math.round(((totalDiff - idleDiff) / totalDiff) * 100);
            previousCpuStats = currentStats;
            return Math.max(0, Math.min(100, cpuPercent));
          }
        }
        
        previousCpuStats = currentStats;
        return 0; // Return 0 for first reading
      }
    }
    
    // Fallback for development/demo on non-Linux systems
    if (os.platform() !== 'linux') {
      // Simulate a reasonable CPU usage value for demo purposes
      return Math.floor(Math.random() * 60) + 20; // 20-80% range
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
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  } catch {}
  return 'N/A';
}

function getNetworkInfo() {
  try {
    const interfaces = os.networkInterfaces();
    let foundIP = null;
    
    for (const [name, nets] of Object.entries(interfaces)) {
      for (const net of nets) {
        if (net.family === 'IPv4' && !net.internal) {
          foundIP = net.address;
          break;
        }
      }
      if (foundIP) break;
    }
    
    return {
      wifiStatus: foundIP ? 'Connected' : 'Disconnected',
      ipAddress: foundIP || 'N/A'
    };
  } catch {}
  return { wifiStatus: 'Unknown', ipAddress: 'N/A' };
}

function getStorageInfo() {
  try {
    const formatBytes = (bytes) => {
      if (bytes === 0) return '0 B';
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    // Cross-platform storage info using disk usage commands
    let rootInfo = 'N/A';
    let homeInfo = 'N/A';
    
    if (os.platform() === 'linux') {
      try {
        // Use df command to get disk usage
        const rootOutput = execSync('df -h / | tail -1', { encoding: 'utf8' }).trim();
        const rootParts = rootOutput.split(/\s+/);
        if (rootParts.length >= 5) {
          rootInfo = `${rootParts[2]} / ${rootParts[1]} (${rootParts[4]} used)`;
        }
        
        const homeOutput = execSync('df -h $HOME | tail -1', { encoding: 'utf8' }).trim();
        const homeParts = homeOutput.split(/\s+/);
        if (homeParts.length >= 5) {
          homeInfo = `${homeParts[2]} / ${homeParts[1]} (${homeParts[4]} used)`;
        }
      } catch {}
    } else if (os.platform() === 'win32') {
      try {
        // Use wmic command for Windows
        const rootOutput = execSync('wmic logicaldisk where caption="C:" get size,freespace /value', { encoding: 'utf8' });
        const sizeMatch = rootOutput.match(/Size=(\d+)/);
        const freeMatch = rootOutput.match(/FreeSpace=(\d+)/);
        
        if (sizeMatch && freeMatch) {
          const total = parseInt(sizeMatch[1]);
          const free = parseInt(freeMatch[1]);
          const used = total - free;
          const usedPercent = Math.round((used / total) * 100);
          rootInfo = `${formatBytes(used)} / ${formatBytes(total)} (${usedPercent}% used)`;
        }
        
        homeInfo = rootInfo; // On Windows, home is usually on C: drive
      } catch {}
    } else {
      try {
        // macOS and other Unix-like systems
        const rootOutput = execSync('df -h / | tail -1', { encoding: 'utf8' }).trim();
        const rootParts = rootOutput.split(/\s+/);
        if (rootParts.length >= 5) {
          rootInfo = `${rootParts[2]} / ${rootParts[1]} (${rootParts[4]} used)`;
        }
        
        homeInfo = rootInfo; // Usually same filesystem
      } catch {}
    }
    
    return {
      root: rootInfo,
      home: homeInfo
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


