'use strict';

const animations = {

    slideIn: (window,start,end) => {
        window.show();

        let loop = setInterval(() => {
            if(start === end){
                console.log('Animation Complete!');
                clearInterval(loop);
            }
            else{
                start += 50;
                window.setBounds({
                    width: start
                });
            }
        },20);

        return true;
    },

    slideOut: (window,start,end) => {

        let loop = setInterval(() => {
            if(start === end){
                console.log('Animation Complete!');
                window.hide();
                clearInterval(loop);
            }
            else{
                start -= 50;
                window.setBounds({
                    width: start
                });
            }
        },20);

        return true;
    }
}

module.exports = animations;