const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 400, x: 0, y: 0});
  playerWindow = new BrowserWindow({width: 800, height: 400, x: 0, y: 430});
  player2Window = new BrowserWindow({width: 800, height: 400, x: 400, y: 430});

  const urlObj = (endpoint = '') => ({
    pathname: `localhost:8080${endpoint}`,
    protocol: `http:`,
    slashes: true
  });

  // and load the index.html of the app.
  mainWindow.loadURL(url.format(urlObj()));
  setTimeout(() => {
    playerWindow.loadURL(url.format(urlObj('/player')));
    player2Window.loadURL(url.format(urlObj('/player')));
  }, 500);

  // Open the DevTools.
  mainWindow.webContents.openDevTools()
  playerWindow.webContents.openDevTools()
  player2Window.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
    playerWindow = null;
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

function sparkUpServer() {
    const { spawn } = require('child_process');
    const child = spawn('node', ['./src/server/server.js'], {
        // detached: true,
        stdio: 'ignore'
    });
    // child.unref();
}

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
