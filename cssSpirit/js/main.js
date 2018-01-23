var canvas,ctx;
var GData = {

};
var vm;

function CssSpirit(){
    return this.init();
}

CssSpirit.prototype = {
    init:function(){
        this.bindEvent();
        this.vueInit();
    },
    vueInit:function(){
        $.extend(true, GData, initData);
        vm = new Vue({
            el: '.container',
            data: GData,
            mounted:function(){
                
            },
            methods: {
            	uploadFiles:function(e){
                    var files = e.target.files;
                    // if(files.length){
                    //     for(var i = 0;i < files.length; i++ ){
                            
                    //     }
                    // }

                    
                    console.log(files);
            		this.newImage('',function(){
                        ctx.drawImage()
                    });
                    
            	},
                newImage:function(src,cb){
                    var image = new Image();
                    image.onload = function(){
                        if(typeof cb == 'function')
                            cb();
                    }
                    image.src = src;
                    return image;
                }
            }
        });
    },
    bindEvent:function(){
        
    }
};

$(function() {
    ctx.fillRect(0,0,10,10);
    new CssSpirit();
});
