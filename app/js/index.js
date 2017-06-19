'use strict';
var electron = require('electron');
var ipcRenderer = electron.ipcRenderer;
var remote = electron.remote;
var Tray = remote.Tray;
var Menu = remote.Menu;
var path = require('path');

var soundButtons = document.querySelectorAll('.button-sound');
var closeEl = document.querySelector('.close');
var settingsEl = document.querySelector('.settings');

var trayIcon = null;
var mainMenu = null;

for (var i = 0; i < soundButtons.length; i++) {
    var soundButton = soundButtons[i];
    var soundName = soundButton.attributes['data-sound'].value;

    prepareButton(soundButton, soundName);
}

function prepareButton(buttonEl, soundName) {
    buttonEl.querySelector('span').style.backgroundImage = 'url("img/icons/' + soundName + '.png")';
    //实例化一个Audio类
    var audio = new Audio(__dirname + '/wav/' + soundName + '.wav');
    buttonEl.addEventListener('click', function () {
        audio.currentTime = 0;
        audio.play();
    });
}

closeEl.addEventListener('click', function () {
    ipcRenderer.send('close-main-window');
});

settingsEl.addEventListener('click', function () {
    ipcRenderer.send('open-settings-window');
});

ipcRenderer.on('global-shortcut', function (event, arg) {
    //派发点击事件
    var event = new MouseEvent('click');
    soundButtons[arg].dispatchEvent(event);
});

// Menu、remote use
var trayMenuTemplate = [
    {
        label: 'Sound machine',
        submenu: [
            {
                label: 'Reload',
                accelerator: 'CmdOrCtrl+R',
                click (item, focusedWindow) {
                  if (focusedWindow){ focusedWindow.reload(); }
                }                
            },
            {
                label: 'Learn Electron',
                click () { require('electron').shell.openExternal('http://electron.atom.io/docs/'); }
            }
        ]
    },
    {
        label: 'Settings',
        click: function () {
            ipcRenderer.send('open-settings-window');
        }
    },
    {
        label: 'Quit',
        accelerator: process.platform === 'darwin' ? 'Alt+Command+Q' : 'Ctrl+Shift+Q',
        click: function () {
            ipcRenderer.send('close-main-window');
        }
    }
];
mainMenu = Menu.buildFromTemplate(trayMenuTemplate);
Menu.setApplicationMenu(mainMenu);

// Tray use
if (process.platform === 'darwin') {
    trayIcon = new Tray(path.join(__dirname, 'img/tray-iconTemplate.png'));
}
else {
    trayIcon = new Tray(path.join(__dirname, 'img/tray-icon-alt.png'));
}
var contextMenu = Menu.buildFromTemplate([
    {label: 'Item1', type: 'radio'},
    {label: 'Item2', type: 'radio'},
    {label: 'Item3', type: 'radio', checked: true},
    {label: 'Item4', type: 'radio'}
]);
trayIcon.setToolTip('This is my first application about electron.');
trayIcon.setContextMenu(contextMenu);