'use strict';

// Node Modules
const url = require('url');
const path = require('path');

// Electron Modules
const { BrowserWindow } = require('electron');

const drawer = {

    createDrawer: () => {
        let window;

        window = new BrowserWindow({
            // Window Icon
            icon: path.join(__dirname,'/app-icon.png'),

            // Window Resolution
            width: 300,
            height: 600,

            // Window Position
            x: 5,
            y: 54,

            // Window Options
            show: false,
            
            frame: false,
            transparent: true,
            fullscreen:false,
            fullscreenable: false,
            maximizable:false,
            movable: false,
    
            webPreferences: {
                nodeIntegration: true,
                backgroundThrottling: false,
            }
        });
    
        window.loadURL(url.format({
            pathname: path.join(__dirname, '../components/drawer/drawer.html'),
            protocol: 'file',
            slashes: true
        }));

        return window;
    },

}

module.exports = drawer;