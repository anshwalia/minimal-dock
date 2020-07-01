'use strict';

// Node Modules
const fs = require('fs');

// AngularJS
const angular = require('angular');

// Electon Modules
const electron = require('electron');
const ipc = electron.ipcRenderer;

// AnimeJS
const anime = require('animejs');

// Custom Animations
const animations = require('../../custom_modules/animations');
const { exec, config } = require('process');

// Config File Path
const configPath = '../../data/config.json';

// Function to create config file
function createConfigFile(){
    let config = {
        desktopPath: '',
        dockPosition: 0,
    }
    fs.writeFileSync(configPath, JSON.stringify(config,null,2));
    return config;
}

// Function to load config file data
function getConfigData(){
    let cfg = null;

    if(fs.existsSync(configPath)){
        cfg = fs.readFileSync(configPath);
        return JSON.parse(cfg);
    }
    else{
        console.log('Config file not present, creating new config file!');
        createConfigFile().then((config) => {
            cfg = config;
        });
        return cfg;
    }
}

// Code
let settingsView = false;
const body = document.querySelector('body');
const html = document.querySelector('html');

// Angular Module
const settings = angular.module('Settings',[]);

settings.controller('Settings-Ctrl',($scope) => {

    // $scope.config = getConfigData();
    // console.log(config);

    $scope.config = {
        desktopPath: '',
        dockPosition: 0
    }

    $scope.changeDockPosition = (pos) => {
        switch(pos){

            case 0:
                $scope.config.dockPosition = 0;
                $scope.config.dockPosName = 'Top Left';
            break;

            case 1:
                $scope.config.dockPosition = 1;
                $scope.config.dockPosName = 'Top Right';
            break;

            case 2:
                $scope.config.dockPosition = 2;
                $scope.config.dockPosName = 'Down Left';
            break;

            case 3:
                $scope.config.dockPosition = 3;
                $scope.config.dockPosName = 'Down Right';
            break;

            default:
                $scope.config.dockPosition = 0;
                $scope.config.dockPosName = 'Top Left'
        }
    }
    
    $scope.saveSettings = () => {
        console.log('Settings Saved!');
    }

    $scope.closeSettings = () => {
        ipc.send('toggle-settings');
    }
});


ipc.on('settings-slide-in',(event) => {
    if(animations.slideIn(body) && animations.fadeIn(html)){
        console.log('SSI');
        settingsView = true;
    } 
});

ipc.on('settings-slide-out',(event) => {
    if(animations.slideOut(body) && animations.fadeOut(html)){
        console.log('SSO');
        settingsView = false;
        setTimeout(() => {
            html.style.opacity = 0;
            body.style.left = '-300px';
            ipc.send('settings-hidden');
        },1000);
    }
});


