const { app, BrowserWindow, ipcMain, screen } = require('electron')
const path = require('path')
const gemini = require('./gemini/translator/gemini');

let pdfWin = null
let overlayWin = null

// function createOverlay () {
//   const { width, height } = screen.getPrimaryDisplay().bounds

//   win = new BrowserWindow({
//     x: 0,
//     y: 0,
//     width,
//     height,
//     frame: false,
//     transparent: true,
//     alwaysOnTop: true,
//     skipTaskbar: true,
//     resizable: false,
//     hasShadow: false,
//     focusable: false,
//     webPreferences: {
//       preload: path.join(__dirname, 'mvpreload.js'),
//       contextIsolation: true,
//       nodeIntegration: false
//     },
//   })

//   win.setIgnoreMouseEvents(true)
//   win.loadFile('render/overlay/index.html')
// }

function createPdfWindow() {
  pdfWin = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  // pdfWin.loadURL("http://localhost:5173")
  pdfWin.loadFile('render/pdf/index.html')
}

function createOverlayWindow() {
  const { width, height } = screen.getPrimaryDisplay().bounds

  overlayWin = new BrowserWindow({
    x: 0,
    y: 0,
    width,
    height,
    frame: false,
    transparent: true,
    backgroundColor: '#00000000',
    alwaysOnTop: true,
    fullscreen: false,
    skipTaskbar: true,
    resizable: false,
    hasShadow: false,
    focusable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
  })

  overlayWin.setIgnoreMouseEvents(true)

  overlayWin.loadFile('render/overlayWindow/index.html')

  overlayWin.on('closed', () => { overlayWin = null })
}

// app.whenReady().then(createOverlay)

ipcMain.handle('lens:toggle', () => {
  if (overlayWin) {
    overlayWin.close()
    overlayWin = null
    return { on: false }
  }
  createOverlayWindow()
  return { on: true }
})

ipcMain.handle('lens:isOn', () => {
  return { on: !!overlayWin }
})

ipcMain.handle('gemini:translate', async (_, text) => {
  return await gemini.translate(text);
});

app.whenReady().then(() => {
  createPdfWindow()
})

app.on('window-all-closed', () => app.quit())
