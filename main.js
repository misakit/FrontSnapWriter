'use strict';
const electron = require('electron');
const app = electron.app;  // Module to control application life.
const BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.

const Menu = electron.Menu;

let mainWindow;

var template = [
  {
    label: 'Edit',
    submenu: [
      {
        label: 'Undo',
        accelerator: 'CmdOrCtrl+Z',
        role: 'undo'
      },
      {
        label: 'Paste',
        accelerator: 'CmdOrCtrl+V',
        role: 'paste'
      },
      {
        label: 'Send',
        accelerator: 'CmdOrCtrl+Enter',
        click: function() {
          var temp_dir = app.getPath('temp')
          mainWindow.webContents.send('Send', temp_dir);
        }
      }
    ]
  }
];

if (process.platform == 'darwin') {
  var name = require('electron').app.getName();
  template.unshift({
    label: name,
    submenu: [
      {
        label: 'About ' + name,
        role: 'about'
      },
      {
        type: 'separator'
      },
      {
        label: 'Quit',
        accelerator: 'Command+Q',
        click: function() { app.quit(); }
      }
    ]
  });
};

app.on('window-all-closed', function() {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

app.on('ready', function() {
  mainWindow = new BrowserWindow({width: 300, height: 200});
  mainWindow.setAlwaysOnTop(true);
  mainWindow.loadURL('file://' + __dirname + '/index.html');
  //mainWindow.webContents.openDevTools();
  mainWindow.on('closed', function() {
    mainWindow = null;
  });
  var menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
});
