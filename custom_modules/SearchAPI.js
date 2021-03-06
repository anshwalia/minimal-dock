'use strict';

// SearchAPI Class
class SearchAPI{

    // Class Constructor
    constructor(searchList){
        this.searchList = [];
        for(let i = 0; i < searchList.length; i++){
            this.searchList.push(searchList[i].toLowerCase());
        }
    }

    // Method to search keyword in search list
    searchKeyword(keyword){
        let match_list = [];

        for(let i = 0; i < this.searchList.length; i++){
            for(let j = 0; j < this.searchList[i].length; j++){
                let hits = 0;
                let k = j;
                let l = 0;

                while(l < keyword.length){
                    if(this.searchList[i][k] == keyword[l]){
                        hits += 1;
                    }
                    l++;
                    k++;
                }

                if(hits == keyword.length){
                    const match = {
                        index: i,
                        word: this.searchList[i]
                    }
                    match_list.push(match);
                    break;
                }
            }
        }

        return match_list;
    }

}

module.exports = SearchAPI;