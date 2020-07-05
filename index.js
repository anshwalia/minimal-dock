'use strict';

// Node Modules
const fs = require('fs');
const path = require('path');
const url = require('url');

// Electron Modules
const electron = require('electron');
const ipc = electron.ipcRenderer;

// AngularJS
const angular = require('angular');

// Custom Modules
const configLoader = require('./custom_modules/configLoader');
const Explorer = require('./custom_modules/Explorer');
const SearchAPI = require('./custom_modules/SearchAPI');

// Events
const dock = angular.module('Dock',[]);

dock.controller('Dock-Ctrl',($scope) => {

    // Config Loading
    $scope.cfg = new configLoader();
    $scope.cfg.loadConfig();
    $scope.config = $scope.cfg.getConfig();

    // Listing of Directories
    $scope.explr = new Explorer($scope.config.desktopPath);
    $scope.dirList = $scope.explr.listDir();

    // SearchAPI Object
    $scope.search = new SearchAPI($scope.dirList);

    // Search Variables
    $scope.keyword = '';
    $scope.searching = false;
    $scope.searchMatches = [];



    // // Search Events (Active/Inactive)
    // $scope.setSearching = (val) => {
    //     if((val) && ($scope.keyword.length != 0)){
    //         $scope.searching = true;
    //         ipc.send('expand-dock-searching');
    //     }
    //     else{
    //         $scope.searching = false;
    //         ipc.send('shrink-dock-not-searching');
    //     }
    // }

    // Method to search keyword using searchAPI
    $scope.searchKeyword = () => {
        if($scope.keyword.length != 0){
            $scope.searchMatches = $scope.search.searchKeyword($scope.keyword.toLowerCase());
            $scope.searching = true;
            ipc.send('expand-dock-searching');
            console.log($scope.searchMatches);
        }
        else{
            $scope.searching = false;
            ipc.send('shrink-dock-not-searching');
        }
    }

    // Method to open directory
    $scope.open = (index) => {
        $scope.explr.openDir($scope.dirList[index]);
        console.log('Opening',$scope.dirList[index]);
    }

    $scope.toggleDrawer = () => {
        console.log('[ Toggle Drawer ]');
        ipc.send('toggle-drawer');
    }

});

