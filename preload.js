const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('appInfo', {
  version: '0.1.0',
});

contextBridge.exposeInMainWorld('api', {
  saveImage: async (dataUrl) => ipcRenderer.invoke('save-image', dataUrl),
  getSystemInfo: async () => ipcRenderer.invoke('get-system-info'),
  readSettings: async () => ipcRenderer.invoke('read-settings'),
  writeSettings: async (settings) => ipcRenderer.invoke('write-settings', settings),
  readAssetText: async (name) => ipcRenderer.invoke('read-asset-text', name),
});


