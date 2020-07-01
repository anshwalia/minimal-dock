'use strict';

// AnimeJS
const anime = require('animejs');

// Custom Animations Object
const animations = {

    // SLIDE IN
    slideIn: function(target){
        console.log('[Animations : Slide-In]');
        anime({
            targets: target,
            left: '0px',
            easing: 'easeInOutSine',
        });
        return true;
    },
    
    // SLIDE OUT
    slideOut: function(target){
        console.log('[Animations : Slide-Out]');
        anime({
            targets: target,
            left: '-300px',
            easing: 'easeInOutSine',
        });
        return  true;
    },
    
    // FADE IN
    fadeIn: function(target){
        console.log('[Animations : Fade-In]');
        anime({
            targets: target,
            opacity: 1,
            easing: 'easeInOutSine',
        });
        return true;
    },

    // FADE OUT
    fadeOut: function(target){
        console.log('[Animations : Fade-Out]');
        anime({
            targets: target,
            opacity: 0,
            easing: 'easeInOutSine',
        });
        return true;
    }
}

module.exports = animations;