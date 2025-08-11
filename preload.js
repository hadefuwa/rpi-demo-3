const { contextBridge, ipcRenderer } = require('electron');
const path = require('path');
const fs = require('fs');

function readPackageVersion() {
  try {
    const pkgPath = path.join(__dirname, 'package.json');
    const raw = fs.readFileSync(pkgPath, 'utf8');
    const pkg = JSON.parse(raw);
    return String(pkg.version || '0.0.0');
  } catch {
    return '0.0.0';
  }
}

contextBridge.exposeInMainWorld('appInfo', {
  version: readPackageVersion(),
});

contextBridge.exposeInMainWorld('api', {
  saveImage: async (dataUrl) => ipcRenderer.invoke('save-image', dataUrl),
  getSystemInfo: async () => ipcRenderer.invoke('get-system-info'),
  readSettings: async () => ipcRenderer.invoke('read-settings'),
  writeSettings: async (settings) => ipcRenderer.invoke('write-settings', settings),
  readAssetText: async (name) => ipcRenderer.invoke('read-asset-text', name),
  readAssetBytes: async (name) => ipcRenderer.invoke('read-asset-bytes', name),
});


