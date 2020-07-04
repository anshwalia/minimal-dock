'use strict';

const fs = require('fs');

class configLoader{

    constructor(){
        this.configPath = 'config.json';
        this.config = null
    }

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

    getConfig(){
        return Object.assign({},this.config);
    }

    saveConfig(config){
        fs.writeFileSync(this.configPath,JSON.stringify(config,null,2));
        return true;
    }
}

module.exports = configLoader;