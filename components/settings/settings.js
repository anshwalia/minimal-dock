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

// Custom modules
const configLoader = require('../../custom_modules/configLoader');
const { config } = require('process');

// Code
let settingsView = false;
const body = document.querySelector('body');
const html = document.querySelector('html');

const cfg = new configLoader();
cfg.loadConfig();

// Angular Module
const settings = angular.module('Settings',[]);

settings.controller('Settings-Ctrl',($scope) => {

    $scope.config = cfg.getConfig();

    if($scope.config.transparentDock){
        body.style.background = 'rgba(0,0,0,0.5)';
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
                $scope.config.dockPosName = 'Top Left';
        }
    }
    
    $scope.saveSettings = () => {
        console.log('Settings',$scope.config);
        cfg.saveConfig($scope.config);
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


