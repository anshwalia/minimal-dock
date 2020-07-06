'use strict';

// Electron Modules
const electron = require('electron');
const ipc = electron.ipcRenderer;

// AngularJS
const angular = require('angular');

// Custom Modules
const configLoader = require('./custom_modules/configLoader');
const Explorer = require('./custom_modules/Explorer');
const SearchAPI = require('./custom_modules/SearchAPI');

// Angular Module
const dock = angular.module('Dock',[]);

// Angular Module Controller
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
    $scope.searchMatches = [];

    // View Selection
    $scope.searching_top = false;
    $scope.searching_bottom = false;

    // Method to select search result box
    $scope.showSearchResultBox = () => {
        console.log('Dock Pos :',$scope.config.dockPosition);
        if(($scope.config.dockPosition == 2) || ($scope.config.dockPosition == 3)){
            console.log('Box Top!');
            $scope.searching_top = true;
            $scope.searching_bottom = false;
        }
        else{
            console.log('Box Bottom!');
            $scope.searching_top = false;
            $scope.searching_bottom = true;
        }
    }

    // Method to search keyword using searchAPI
    $scope.searchKeyword = () => {
        if($scope.keyword.length != 0){
            $scope.searchMatches = $scope.search.searchKeyword($scope.keyword.toLowerCase());
            $scope.showSearchResultBox();
            ipc.send('expand-dock-searching');
        }
        else{
            $scope.searching_top = false;
            $scope.searching_bottom = false;
            ipc.send('shrink-dock-not-searching');
        }
    }

    // Method to open directory
    $scope.open = (index) => {
        $scope.explr.openDir($scope.dirList[index]);
        console.log('Opening',$scope.dirList[index]);
    }

    // Method to toggle drawer
    $scope.toggleDrawer = () => {
        console.log('[ Toggle Drawer ]');
        ipc.send('toggle-drawer');
    }
});

