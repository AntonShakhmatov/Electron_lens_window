const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
  toggleLens: () => ipcRenderer.invoke('lens:toggle'),
  isLensOn: () => ipcRenderer.invoke('lens:isOn'),
  savePdf: (payload) => ipcRenderer.invoke('save-pdf', payload),
})