const { app, BrowserWindow } = require('electron')

function createWindow () {
  const win = new BrowserWindow({
    width: 1920,
    height: 1080,
  })

  win.loadURL('data:text/html,<h1>Hello Desktop</h1>')
}

app.whenReady().then(createWindow)
