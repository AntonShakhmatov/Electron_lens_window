const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
  isTranslateOn: () => ipcRenderer.invoke('translate:isOn'),

  toggleTranslate: () => ipcRenderer.invoke('translate:toggle'),

  translatePdf(text) {
    return ipcRenderer.invoke('gemini:translate', text);
  },

  translateEnPdf(text) {
    return ipcRenderer.invoke('gemini:translateEn', text);
  },

  translateCzPdf(text) {
    return ipcRenderer.invoke('gemini:translateCz', text);
  }
})