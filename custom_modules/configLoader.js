'use strict';

const fs = require('fs');

// ConfigLoader Class
class configLoader{

    // Class Constructor
    constructor(){
        this.configPath = 'config.json';
        this.config = null
    }

    // Method to create config file
    createConfig(){
        let config = {
            desktopPath: '',
            dockPosName: 'Top Left',
            dockPosition: 0,
            transparentDock: false,
        }
        console.log(config);
        fs.writeFileSync(this.configPath,JSON.stringify(config,null,2));
        return true;
    }

    // Method to read and load config file
    loadConfig(){
        if(fs.existsSync(this.configPath)){
            let config = fs.readFileSync(this.configPath);
            config = JSON.parse(config);
            this.config = config;
            console.log(this.config);
            console.log('Config File Loaded Successfully!');
        }
        else{
            let p_createConfig = new Promise((res,rej) => {
                if(this.createConfig()){
                    res(true);
                }
            });

            p_createConfig.then((val) => {
                if(val){
                    console.log('Config Created Successfully!');
                    this.loadConfig();
                }
            });
        }
    }

    // Method to get config object
    getConfig(){
        return Object.assign({},this.config);
    }

    // Method to save config to file
    saveConfig(config){
        fs.writeFileSync(this.configPath,JSON.stringify(config,null,2));
        return true;
    }
}

module.exports = configLoader;