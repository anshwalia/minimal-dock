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
            // width: 0,
            width: 300,
            height: 600,
            x: 5,
            y: 54,
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
                // webSecurity: false,
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