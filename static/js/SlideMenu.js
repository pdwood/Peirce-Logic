var slide = $(function(){
   $('.slideMenu').tabSlideOut({
        tabHandle: '.handle',                     //class of the element that will become your tab
        pathToTabImage: 'static/images/out_small.gif', //path to the image for the tab //Optionally can be set using css
        imageHeight: '100px',                     //height of tab image           //Optionally can be set using css
        imageWidth: '35px',                       //width of tab image            //Optionally can be set using css
        tabLocation: 'left',                      //side of screen where tab lives, top, right, bottom, or left
        speed: 300,                               //speed of animation
        action: 'click',                          //options: 'click' or 'hover', action to trigger animation
        topPos: '15px',                          //position from the top/ use if tabLocation is left or right
        leftPos: '20px',                          //position from left/ use if tabLocation is bottom or top
        fixedPosition: true                      //options: true makes it stick(fixed position) on scroll

    });

});