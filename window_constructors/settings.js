'use strict';

// Node Modules
const url = require('url');
const path = require('path');

// Electron Modules
const { BrowserWindow } = require('electron');

const settings = {

    createSettings: () => {
        let window;

        window = new BrowserWindow({
            x: 315,
            y: 56,
            width: 300,
            height: 300,
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
            pathname: path.join(__dirname,'../components/settings/settings.html'),
            protocol: 'file',
            slashes: true
        }));

        return window;
    }
}

module.exports = settings;