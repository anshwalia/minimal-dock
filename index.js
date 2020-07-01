'use strict';

// Node Modules
const fs = require('fs');
const path = require('path');
const url = require('url');

// Electron Modules
const electron = require('electron');
const ipc = electron.ipcRenderer;

// DOM Object
const appWin = document.querySelector('#app');

// Events

appWin.addEventListener('click',() => {
    ipc.send('toggle-drawer');
});