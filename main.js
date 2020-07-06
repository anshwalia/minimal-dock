'use strict';

// Node Modules
const url = require('url');
const path = require('path');

// Electron Modules
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const screen = electron.screen;
const ipc = electron.ipcMain;

// Importing Custom Modules
const { drawer, settings } = require('./window_constructors/module_loader');
const configLoader = require('./custom_modules/configLoader');

// Configuration Object
const cfg = new configLoader();
cfg.loadConfig();

const mainApp = {
    // Properties

    app_state: {},
    app_res: {},
    app_pos: {},
    app_windows: {},
    screen_res: {},
    app_config: {},

    // Methods

    // Method to initialize app
    init: function(){
        this.app_state = {
            position: 0,
            drawerView: false,
            settingsView: false,
        }

        this.app_res = {
            // Default Values

            // App Window
            width: 200,
            height: 40,

            // Drawer Window
            drawer_width: 300,
            drawer_height: 600,

            // Settings Window
            settings_width: 300,
            settings_height: 300,

            // Default Padding
            padding: 5,

            // Debugging Values
            debug_width: 800,
            debug_height: 600,
        }

        this.app_windows = {
            mainWindow: {},
            drawerWindow: {},
            settingsWindow: {},
        }

        this.app_config = cfg.getConfig();

        return true;
    },

    setAppPos: function(){

        this.app_pos = {
            topLeft: { 
                // Main Window
                x: (0 + this.app_res.padding), 
                y: (0 + this.app_res.padding),
                
                // Drawer Window
                drawer_x: (0 + this.app_res.padding),
                drawer_y: (0 + (2 * this.app_res.padding) + this.app_res.height),

                // Settings Window
                settings_x: (0 + (3 * this.app_res.padding) + this.app_res.drawer_width),
                settings_y: (0 + (2 * this.app_res.padding) + this.app_res.height),
            },
            topRight: { 
                // Main Window
                x: (this.screen_res.width - (this.app_res.width + this.app_res.padding)),
                y: (0 + this.app_res.padding),

                // Drawer Window
                drawer_x: (this.screen_res.width - ( this.app_res.drawer_width + this.app_res.padding )),
                drawer_y: (0 + (2 * this.app_res.padding) + this.app_res.height),

                // Settings Window
                settings_x: (this.screen_res.width - ((this.app_res.settings_width + this.app_res.drawer_width)  + (2 * this.app_res.padding))),
                settings_y: (0 + (2 * this.app_res.padding) + this.app_res.height)
            },
            downLeft: {
                // Main Window
                x: (0 + this.app_res.padding),
                y: (this.screen_res.height - (this.app_res.height + this.app_res.padding)),

                // Drawer Window
                drawer_x: (0 + this.app_res.padding),
                drawer_y: (this.screen_res.height - ((this.app_res.height + this.app_res.drawer_height) + (2 * this.app_res.padding))),


                // Settings Window
                settings_x: (0 + (2 * this.app_res.padding) + this.app_res.drawer_width),
                settings_y: (this.screen_res.height - ((this.app_res.height + this.app_res.settings_height) + (2 * this.app_res.padding))),
            },
            downRight: {
                // Main Window
                x: (this.screen_res.width - (this.app_res.width + this.app_res.padding)),
                y: (this.screen_res.height - (this.app_res.height + this.app_res.padding)),

                // Drawer Window
                drawer_x: (this.screen_res.width - ( this.app_res.drawer_width + this.app_res.padding)),
                drawer_y: (this.screen_res.height - ((this.app_res.height + this.app_res.drawer_height) + (2 * this.app_res.padding))),

                // Settings Window
                settings_x: (this.screen_res.width - ((this.app_res.settings_width + this.app_res.drawer_width)  + (2 * this.app_res.padding))),
                settings_y: (this.screen_res.height - ((this.app_res.height + this.app_res.settings_height)+ (2 * this.app_res.padding))),
            }
        }
    },

    // App Starter Method
    startApp: async function(){
        // Promise to initialize mainApp properties
        const p_init = new Promise((res,rej) => {
            if(this.init()){
                res(true);
            }
            else{
                rej('Init Failed!');
            }
        });

        await p_init.then((val) => {
            if(val){
                this.app_windows.mainWindow = this.createWindow();
                mainApp.app_windows.drawerWindow = drawer.createDrawer();
                mainApp.app_windows.settingsWindow = settings.createSettings();
                console.log('[ Application Started ]');
            }
        }).catch((err) => {
            console.log(err);
        });

        return true;
    },

    // Method to create main app window
    createWindow: function(){
        let window;

        const { width, height } = screen.getPrimaryDisplay().workAreaSize;

        // Primary Display Resolution
        this.screen_res = { width: width, height: height }
        console.log('Display Resolution :',this.screen_res);

        // Settings App Screen Positioning
        this.setAppPos();

        window = new BrowserWindow({
            icon: path.join(__dirname,'/icons/app-icon.png'),

            width: this.app_res.width,
            height: this.app_res.height,

            x: this.app_pos.topLeft.x,
            y: this.app_pos.topLeft.y,

            show: false,

            frame: false,
            transparent: true,
            fullscreen:false,
            fullscreenable: false,
            maximizable:false,
            movable: false,
            resizable: false,

            webPreferences: {
                nodeIntegration: true,
                backgroundThrottling: false,
            }
        });

        window.loadURL(url.format({
            pathname: path.join(__dirname, 'index.html'),
            protocol: 'file',
            slashes: true
        }));

        window.on('closed',() => {
            mainApp.app_windows.window = null;
        });

        window.on('ready-to-show',() => {
            mainApp.app_windows.mainWindow.show();
        });

        window.on('window-all-closed',() => {
            if(process.platform !== 'darwin'){
                console.log('Closing App!');
                app.quit();
            }
        });

        return window;
    },

    // Refreshes the resoluiton of app windows
    appWindowsResRefresh: function(){
        // Main Window
        this.app_windows.mainWindow.setBounds({
            width: 200,
            height: 40
        });

        // Drawer Window
        this.app_windows.drawerWindow.setBounds({
            width: 300,
            height: 600
        });

        // Settings Window
        this.app_windows.settingsWindow.setBounds({
            width: 300,
            height: 300
        });

    },

    // Function to change dock position 
    changeDockPosition: function(pos){
        switch(pos){

            case 0:
                // Top Left
                // Main Window
                this.app_windows.mainWindow.setBounds({
                    x: this.app_pos.topLeft.x,
                    y: this.app_pos.topLeft.y
                });
                // Drawer Window
                this.app_windows.drawerWindow.setBounds({
                    x: this.app_pos.topLeft.drawer_x,
                    y: this.app_pos.topLeft.drawer_y
                });
                // Settings Window
                this.app_windows.settingsWindow.setBounds({
                    x: this.app_pos.topLeft.settings_x,
                    y: this.app_pos.topLeft.settings_y
                });
            break;

            case 1:
                // Top Right
                // Main Window
                this.app_windows.mainWindow.setBounds({
                    x: this.app_pos.topRight.x,
                    y: this.app_pos.topRight.y
                });
                // Drawer Window
                this.app_windows.drawerWindow.setBounds({
                    x: this.app_pos.topRight.drawer_x,
                    y: this.app_pos.topRight.drawer_y
                });
                // Settings Window
                this.app_windows.settingsWindow.setBounds({
                    x: this.app_pos.topRight.settings_x,
                    y: this.app_pos.topRight.settings_y
                });
            break;

            case 2:
                // Bottom Left
                // Main Window
                this.app_windows.mainWindow.setBounds({
                    x: this.app_pos.downLeft.x,
                    y: this.app_pos.downLeft.y
                });
                // Drawer Window
                this.app_windows.drawerWindow.setBounds({
                    x: this.app_pos.downLeft.drawer_x,
                    y: this.app_pos.downLeft.drawer_y
                });
                // Settings Window
                this.app_windows.settingsWindow.setBounds({
                    x: this.app_pos.downLeft.settings_x,
                    y: this.app_pos.downLeft.settings_y
                });
            break;

            case 3:
                // Bottom Right
                // Main Window
                this.app_windows.mainWindow.setBounds({
                    x: this.app_pos.downRight.x,
                    y: this.app_pos.downRight.y
                });
                // Drawer Window
                this.app_windows.drawerWindow.setBounds({
                    x: this.app_pos.downRight.drawer_x,
                    y: this.app_pos.downRight.drawer_y
                });
                // Settings Window
                this.app_windows.settingsWindow.setBounds({
                    x: this.app_pos.downRight.settings_x,
                    y: this.app_pos.downRight.settings_y
                });
            break;

            default:
                // Default (Top Left)
                this.app_windows.mainWindow.setBounds({
                    x: this.app_pos.topLeft.x,
                    y: this.app_pos.topLeft.y
                });
                // Drawer Window
                this.app_windows.drawerWindow.setBounds({
                    x: this.app_pos.topLeft.drawer_x,
                    y: this.app_pos.topLeft.drawer_y
                });
                // Settings Window
                this.app_windows.settingsWindow.setBounds({
                    x: this.app_pos.topLeft.settings_x,
                    y: this.app_pos.topLeft.settings_y
                });
                
        }
        // Resets app windows resolution
        this.appWindowsResRefresh();
    },

    // Method to show given window
    showWindow: async function(win){
        win.setOpacity(0)
        win.show()
        setTimeout(() => {
            win.setOpacity(1);
        }, 1000/60);
        return true;
    },

    // Mathod to hide given window
    hideWindow: async function(win){
        setTimeout(() => {
            win.setOpacity(0);
            win.hide();
        },1000/60);
        return true;
    },

    // Function to toggle settings
    toggleSettings: function(){
        if(this.app_state.settingsView){
            console.log('SSO');
            // IPC Main -> Renderer
            this.app_windows.settingsWindow.webContents.send('settings-slide-out');
        }
        else{
            console.log('SSI');
            this.showWindow(this.app_windows.settingsWindow).then((res) => {
                if(res){
                    // IPC Main -> Renderer
                    this.app_windows.settingsWindow.webContents.send('settings-slide-in');
                    this.app_state.settingsView = true;
                }
            });
        }
    },

    // Function to toggle drawer
    toggleDrawer: function(){
        if(this.app_state.drawerView){
            console.log('DSO');
            if(this.app_state.settingsView){
                this.toggleSettings();
            }
            // IPC Main -> Renderer
            this.app_windows.drawerWindow.webContents.send('drawer-slide-out');
        }
        else{
            console.log('DSI');
            this.showWindow(this.app_windows.drawerWindow).then((res) => {
                if(res){
                    // IPC Main -> Renderer
                    this.app_windows.drawerWindow.webContents.send('drawer-slide-in');
                    this.app_state.drawerView = true;
                }
            });
        }
    }
}



// App Controls
app.on('ready',() => {
    mainApp.startApp().then((val) => {
        if(val){
            console.log('App Started!');
            mainApp.changeDockPosition(mainApp.app_config.dockPosition);
        }
    });
});

app.on('window-all-closed',() => {
    if(process.platform !== 'darwin'){
        app.quit();
    }
});

app.on('activate',() => {
    if(app === null){
        mainApp.app_windows.mainWindow = mainApp.createWindow();
    }
});

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

// SEARCH BOX IPC
// To expand dock size
ipc.on('expand-dock-searching',(event) => {
    console.log('[ Expanding for Search ]');
    mainApp.app_windows.mainWindow.setBounds({
        width: 200,
        height: 500
    });
});

// To shrink dock size
ipc.on('shrink-dock-not-searching',(event) => {
    console.log('[ Shrinking Dock]');
    mainApp.app_windows.mainWindow.setBounds({
        width: 200,
        height: 40
    });
})