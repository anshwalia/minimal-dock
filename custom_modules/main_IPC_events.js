'use strict';

const electron = require('electron');
const ipc = electron.ipcMain;

// IPC Renderer -> Main
// Close App
ipc.on('close-app',() => {
    console.log('[ Exiting Application ]');
    app.quit();
});

// Toggles Drawer
ipc.on('toggle-drawer',(event) => {
    mainApp.toggleDrawer();
});

// Toggles Settings
ipc.on('toggle-settings',(event) => {
    console.log('Toggle Settings');
    mainApp.toggleSettings();
});

// Hides Drawer Window
ipc.on('drawer-hidden',(event) => {
    mainApp.hideWindow(mainApp.app_windows.drawerWindow).then((res) => {
        if(res){
            console.log('drawer hidden');
            mainApp.app_state.drawerView = false;
        }
    });
});

// Hides Settings Window
ipc.on('settings-hidden',(event) => {
    mainApp.hideWindow(mainApp.app_windows.settingsWindow).then((res) => {
        if(res){
            console.log('settings hidden');
            mainApp.app_state.settingsView = false;
        }
    });
});