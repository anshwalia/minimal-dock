'use strict';

// Electron Modules
const electron = require('electron');
const ipc = electron.ipcRenderer;

// AnimeJS
const anime = require('animejs');

// Custom Animations
const animations = require('../../custom_modules/animations');
const { fadeOut } = require('../../custom_modules/animations');

// NodeJS Modules
const fs = require('fs');
const { exec } = require('child_process');

// Custom Modules
const Explorer = require('../../custom_modules/Explorer');

// DOM Objects
const html = document.querySelector('html');
const body = document.querySelector('body');

// Main Drawer Object
const drawer = {

    // Properties
    drawer_states: {},
    explorer: {},
    dirList: {},
    dirObjects: {},

    // DOM Objects
    drawerObj: {},
    settingsObj: {},

    // Methods
    init: function(){
        this.drawer_states = {
            ready: false,
            visible: false
        }

        this.explorer = new Explorer();
        this.dirList = this.explorer.listDir();

        this.drawerObj = document.querySelector('#drawer');
        this.settingsObj = document.querySelector('#settings');
        return true;
    },

    addEvents: function(){
        this.settingsObj.addEventListener('click',() => {
            ipc.send('toggle-settings');
        });

        return true;
    },

    drawerReady: function(){
        if(this.init()){
            if(this.addEvents()){
                if(this.makeDrawer()){
                    if(this.addDirEvents()){
                        this.drawer_states.ready = true;
                        return true;
                    }
                }
            }
        }
    },

    // Drawer Component Template Makers

    titleShortener: function(title){
        if(title.length <= 9){
            return title;
        }
        else{
            let st = title.slice(0,7);
            st += '...';
            return st;
        }
    },

    createCell: function(dirName,id){
        return `
            <div class="col-4 click-able rounded m-0 p-1">
                <div id="dir${id}" title="${dirName}" class="card border-0 bg-trans-full col-12 m-0 p-0">
                    <div class="card-body border-0 bg-trans-full m-0 p-0 d-flex justify-content-center">
                        <img class="col-12 m-0" src="../../icons/folder.png" alt="Folder Icon">
                    </div>
                    <div class="card-footer border-0 bg-trans-full m-0 p-0 d-flex justify-content-center">
                        <p class="card-text text-light">${this.titleShortener(dirName)}</p>
                    </div>
                </div>
            </div>
        `;
    },

    createRow: function(){
        const row = document.createElement('DIV');
        row.className = "row m-0 p-1";
        return row;
    },

    makeDrawer: function(){

        for(let i = 0; i < this.dirList.length;){
            let r = this.createRow();
    
            for(let j = 0; j < 3; j++){
                console.log(this.dirList[i]);
                r.innerHTML += this.createCell(this.dirList[i],i);
                i++;
                if(i >= this.dirList.length){
                    break;
                }
            }
    
            this.drawerObj.append(r);
        }
    
        return true;
    },

    addDirEvents: function(){
        for(let i = 0; i < this.dirList.length; i++){
            this.dirObjects[i] = document.querySelector(`#dir${i}`);
            this.dirObjects[i].addEventListener('click',() => {
                this.explorer.openDir(this.dirList[i]);
            });
        }

        return true;
    }

}

// Code
// Start Point
drawer.drawerReady();

// IPC Events Renderer -> Main
ipc.on('drawer-slide-in',(event) => {
    if(animations.slideIn(body) && animations.fadeIn(html)){
        drawer.drawer_states.visible = true;
        console.log('[Drawer Visible]');
    }
});

ipc.on('drawer-slide-out',(event) => {
    if(animations.slideOut(body) && fadeOut(html)){
        drawer.drawer_states.visible = true;
        console.log('[Drawer Invisible]');
        setTimeout(() => {
            html.style.opacity = 0;
            body.style.left = '-300px';
            ipc.send('drawer-hidden');
        },1000);
    }
});