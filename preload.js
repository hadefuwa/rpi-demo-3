const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('appInfo', {
  version: '0.1.0',
});

contextBridge.exposeInMainWorld('api', {
  saveImage: async (dataUrl) => ipcRenderer.invoke('save-image', dataUrl),
  getSystemInfo: async () => ipcRenderer.invoke('get-system-info'),
  onSystemInfo: (callback) => {
    ipcRenderer.on('system-info', (_event, payload) => callback(payload));
  },
});


