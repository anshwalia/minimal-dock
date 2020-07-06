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
const configLoader = require('../../custom_modules/configLoader');

const cfg = new configLoader();
cfg.loadConfig();

// DOM Objects
const html = document.querySelector('html');
const body = document.querySelector('body');
const notifyBox = document.querySelector('#notificationBox');

// Main Drawer Object
const drawer = {

    // Properties
    drawer_states: {},
    explorer: {},
    dirList: {},
    dirObjects: {},
    config: {},

    // DOM Objects
    drawerObj: {},
    closeBtn: {},
    settingsObj: {},

    // Methods
    init: function(){
        this.drawer_states = {
            ready: false,
            visible: false
        }

        // this.explorer = new Explorer();
        // this.dirList = this.explorer.listDir();

        this.drawerObj = document.querySelector('#drawer');
        this.settingsObj = document.querySelector('#settings');
        this.closeBtn = document.querySelector('#close');
        return true;
    },

    // Method to display notification to user
    notify: function(title,content){
        const notification = `
            <div class="card col-12 m-0 p-0 bg-trans-full border-danger">
                <div class="card-header p-1 bg-trans-half d-flex justify-content-center">
                    <h4 class="heading text-custom-grey m-0">${title}</h4>
                </div>
                <div class="card-body p-1 bg-trans-half d-flex justify-content-center">
                    <p class="m-0 text-custom-grey">${content}</p>
                </div>
            </div>
        `;
        notifyBox.innerHTML += notification;
        notifyBox.style.display = "block";
    },

    // Method to add event listeners to dom objects
    addEvents: function(){
        this.settingsObj.addEventListener('click',() => {
            ipc.send('toggle-settings');
        });

        this.closeBtn.addEventListener('click',() => {
            ipc.send('toggle-drawer');
        });

        return true;
    },

    // Function to create drawer and get it ready
    drawerReady: function(){

        let promise_loadConfig = new Promise((res,rej) => {
            this.config = cfg.getConfig();

            if(this.config.transparentDock){
                body.style.background = 'rgba(0,0,0,0.5)';
            }

            if(this.config != null){
                if(fs.existsSync(this.config.desktopPath)){
                    let dst = fs.statSync(this.config.desktopPath);

                    if(dst.isDirectory()){
                        this.explorer = new Explorer(this.config.desktopPath);
                        this.dirList = this.explorer.listDir();
                        console.log('dirList',this.dirList);
                        console.log(this.drawerObj);

                        if(this.init()){
                            if(this.makeDrawer()){
                                if(this.addEvents()){
                                    if(this.addDirEvents()){
                                        res(true);
                                    }
                                }
                            }
                        }
                    }
                    else{
                        console.log('Desktop Path is not a directory!');
                        this.notify('Desktop Path Invalid!', 'Enter Valid Path and relaunch.');
                        ipc.send('toggle-drawer');
                        ipc.send('toggle-settings');
                        rej('Invalid Desktop Path!');
                    }
                }
                else{
                    console.log('Desktop Path Invalid!');
                    this.notify('Desktop Path Invalid!', 'Enter Valid Path and relaunch.');
                    ipc.send('toggle-drawer')
                    ipc.send('toggle-settings');
                    rej('Invalid Desktop Path!');
                }
            }
        });

        let all_done = new Promise((res,rej) => {
            promise_loadConfig.then((val) => {
                if(val){
                    res(true);
                }
            }).catch((err) => {
                rej(err);
            })
        });

        return all_done;
    },

    // Drawer Component Template Makers

    // Method to make long titles shorters
    titleShortener: function(title){
        if(title.length <= 9){
            return title;
        }
        else{
            let shortTitle = title.slice(0,7);
            shortTitle += '...';
            return shortTitle;
        }
    },

    // Method to create cell in the drawer grid that displays directory
    createCell: function(dirName,id){
        console.log(dirName,id);
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

    // Method to create row in the drawer grid that contains cell row
    createRow: function(){
        const row = document.createElement('DIV');
        row.className = "row m-0 p-1";
        return row;
    },

    // Drawer grid assembler method
    makeDrawer: function(){
        console.log('Making Drawer!');
        console.log('dirlist length',this.dirList.length);
        console.log('dirlist obj',this.dirList);
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

    // Method to add click event listeners to directory cells to open directory in explorer
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

// Start Point
drawer.drawerReady().then((status) => {
    if(status){    
        console.log('Complete');
        ipc.send('drawer-creation-complete');
    }
}).catch((err) => {
    console.error(err);
});

// IPC Events Renderer -> Main
// Drawer Slide-In
ipc.on('drawer-slide-in',(event) => {
    if(animations.slideIn(body) && animations.fadeIn(html)){
        drawer.drawer_states.visible = true;
        console.log('[Drawer Visible]');
    }
});
// Drawer Slide-Out
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