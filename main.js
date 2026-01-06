const { app, BrowserWindow, screen, ipcMain } = require('electron')
const path = require('path')

ipcMain.handle('get-cursor-position', () => {
  return screen.getCursorScreenPoint()
})

function createOverlay () {
  const { width, height } = screen.getPrimaryDisplay().bounds

  const win = new BrowserWindow({
    x: 0,
    y: 0,
    width,
    height,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    hasShadow: false,
    focusable: false,
    webPreferences: {
      preload: path.join(__dirname, 'mvpreload.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
  })

  win.setIgnoreMouseEvents(true)
  win.loadFile('render/index.html')
}

app.whenReady().then(createOverlay)
