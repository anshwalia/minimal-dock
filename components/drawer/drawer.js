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
// const fs = require('fs');

// DOM Objects
const html = document.querySelector('html');
const body = document.querySelector('body');

// Main Drawer Object
const drawer = {

    // Properties
    drawer_states: {},

    // DOM Objects
    drawerObj: {},
    settingsObj: {},

    // Methods
    init: function(){
        this.drawer_states = {
            ready: false,
            visible: false
        }

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
                if(this.makeDrawer(50)){
                    this.drawer_states.ready = true;
                    return true;
                }
            }
        }
    },

    // Drawer Component Template Makers

    createCell: function(title){
        return `
            <div class="col-4 click-able rounded m-0 p-1">
                <div class="card border-0 bg-trans-full col-12 m-0 p-0">
                    <div class="card-body border-0 bg-trans-full m-0 p-0 d-flex justify-content-center">
                        <img class="col-12 m-0" src="../../icons/folder.png" alt="Folder Icon">
                    </div>
                    <div class="card-footer border-0 bg-trans-full m-0 p-0 d-flex justify-content-center">
                        <p class="card-text text-light">${title}</p>
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

    makeDrawer: function(num){

        for(let i = 0; i < num;){
            let r = this.createRow();
    
            for(let j = 0; j < 3; j++){
                console.log(i);
                r.innerHTML += this.createCell(i);
                i++;
                if(i >= num){
                    break;
                }
            }
    
            this.drawerObj.append(r);
        }
    
        return true;
    },

}

// Code
drawer.drawerReady();

// Events

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