const { contextBridge, ipcRenderer } = require('electron');

// Expose version via IPC from main (avoids Node APIs in preload on sandboxed builds)
contextBridge.exposeInMainWorld('appInfo', {
  getVersion: () => ipcRenderer.invoke('get-app-version'),
});

contextBridge.exposeInMainWorld('api', {
  saveImage: async (dataUrl) => ipcRenderer.invoke('save-image', dataUrl),
  getSystemInfo: async () => ipcRenderer.invoke('get-system-info'),
  readSettings: async () => ipcRenderer.invoke('read-settings'),
  writeSettings: async (settings) => ipcRenderer.invoke('write-settings', settings),
  readAssetText: async (name) => ipcRenderer.invoke('read-asset-text', name),
  readAssetBytes: async (name) => ipcRenderer.invoke('read-asset-bytes', name),
});


