'use strict';

var electron = require('electron');
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;
var ipcMain = electron.ipcMain;
var globalShortcut = electron.globalShortcut;

var configuration = require('./configuration');

var mainWindow = null;
var settingsWindow = null;

app.on('ready', function() {
    if (!configuration.readSettings('shortcutKeys')) {
        configuration.saveSettings('shortcutKeys', ['ctrl', 'shift', 'alt']);
    }

    mainWindow = new BrowserWindow({
        // frame: false,
        height: 700,
        resizable: false,
        width: 368
    });

    // mainWindow.webContents.openDevTools();

    mainWindow.loadURL('file://' + __dirname + '/app/index.html');

    setGlobalShortcuts();
});

function setGlobalShortcuts() {

    var shortcutKeysSetting = configuration.readSettings('shortcutKeys');
    var shortcutPrefix = shortcutKeysSetting.length === 0 ? '' : shortcutKeysSetting.join('+') + '+';

    globalShortcut.register(shortcutPrefix + '1', function(){
        mainWindow.webContents.send('global-shortcut', 0);
    });
    globalShortcut.register(shortcutPrefix + '2', function(){
        mainWindow.webContents.send('global-shortcut', 1);
    });
}

ipcMain.on('close-main-window', function () {
    app.quit();
});

ipcMain.on('open-settings-window', function () {
    if (settingsWindow) {
        return;
    }

    settingsWindow = new BrowserWindow({
        frame: false,
        height: 200,
        resizable: false,
        width: 200
    });

    settingsWindow.loadURL('file://' + __dirname + '/app/settings.html');

    settingsWindow.on('closed', function () {
        settingsWindow = null;
    });
});

ipcMain.on('close-settings-window', function (event, arg) {
    if (settingsWindow) {
        settingsWindow.close();
        //return WebContents
        // event.sender.send('closed-settings-window');
    }
});

ipcMain.on('set-global-shortcuts', function () {
    setGlobalShortcuts();
});