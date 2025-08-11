// In v1 we do not expose any special APIs.
// This file is kept to allow safe expansion later.
const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('appInfo', {
  version: '0.1.0',
});


