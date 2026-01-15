const { app, BrowserWindow, ipcMain, screen } = require('electron')
const path = require('path')
const gemini = require('./gemini/translator/gemini');

let pdfWin = null

function createPdfWindow() {
  pdfWin = new BrowserWindow({
    width: 1366,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  pdfWin.loadFile('render/pdf/index.html')
}

let translateMode = false;

ipcMain.handle('translate:toggle', () => {
  translateMode = !translateMode;
  return { on: translateMode };
});

ipcMain.handle('translate:isOn', () => {
  return { on: translateMode };
});

ipcMain.handle('gemini:translate', async (_, text) => {
  return await gemini.translate(text);
});

ipcMain.handle('gemini:translateEn', async (_, text) => {
  return await gemini.translateEn(text);
});

ipcMain.handle('gemini:translateCz', async (_, text) => {
  return await gemini.translateCz(text);
});


app.whenReady().then(() => {
  createPdfWindow()
})

app.on('window-all-closed', () => app.quit())
