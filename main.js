'use strict';
const electron = require('electron');
const app = electron.app;  // Module to control application life.
const globalShortcut = electron.globalShortcut; // Shortcut
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


function preserve_geometry(window) {
    var geom = window.getBounds();
    window['preserved'] = geom;
}

function popup_show(window) {
    // restore preserced position and dimension.
    var geom = window['preserved'];
    window.setBounds( {x: geom['x'], y: geom['y'], width: geom['width'], height: geom['height'] } );
}

function half_hide(window) {
    // preserve current position and dimension.
    preserve_geometry(window);
    // set position and dimension to minimize.
    var scr = electron.screen;
    var sg  = scr.getPrimaryDisplay().workAreaSize;
    window.setBounds( {x: 0, y: sg.height - 24, width: 256, height: 48}, false )
}

app.on('ready', function() {
  mainWindow = new BrowserWindow({width: 300, height: 200});
  mainWindow.setAlwaysOnTop(true);
  mainWindow.loadURL('file://' + __dirname + '/index.html');
  //mainWindow.webContents.openDevTools();
    app.dock.hide();
    preserve_geometry(mainWindow);
    globalShortcut.register('Cmd+Ctrl+f', function() {
	app.focus();
	popup_show(mainWindow);
    });
  mainWindow.on('blur', function() {
      half_hide(mainWindow);
  });
  mainWindow.on('closed', function() {
    mainWindow = null;
  });
  var menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
});
