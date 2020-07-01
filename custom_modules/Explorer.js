'use strict';

// Required Node Modules
const fs = require('fs');
const { exec } = require('child_process');

// Custom Explorer Class
class Explorer{

    constructor(){
        this.explorerPath = "%SystemRoot%\\explorer.exe \"";
        this.rootPath = "C:\\Users\\Ansh Walia\\Desktop\\";
        this.pathEnd = "\"";
    }

    // Method to open directory in Explorer
    openDir(dirName){
        let stats = fs.statSync(this.rootPath+dirName);
        if(stats.isDirectory()){
            exec(this.explorerPath + this.rootPath + dirName + this.pathEnd);
            console.log('Open Directory',dirName);
        }
        else{
            console.log('Directory Path',dirName,'Invalid!');
        }
    }

    // Method to filter directories form files
    filterDirList(dirList){
        let fl = [];

        for(let i = 0; i < dirList.length; i++){
            let d = fs.statSync(this.rootPath + dirList[i]);
            if(d.isDirectory()){
                fl.push(dirList[i]);
            }
        }

        return fl;
    }

    // Method to list directory in the path
    listDir(){
        let list = fs.readdirSync(this.rootPath);
        list = this.filterDirList(list);
        return list;
    }

}

// Exporting Explorer Class
module.exports = Explorer;