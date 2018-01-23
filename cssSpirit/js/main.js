var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
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

                    var imgSrc = URL.createObjectURL(files[0]);

            		this.newImage(imgSrc,function(image){
                        var img = document.body.appendChild(image);
                        var canvas = document.getElementById('canvas');
                        var ctx = canvas.getContext('2d');
                        ctx.drawImage(img,0,0);
                    });
                    
            	},
                newImage:function(src,cb){
                    console.log(123);
                    var image = new Image();
                    image.onload = function(){
                        if(typeof cb == 'function')
                            cb(image);
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
    
    new CssSpirit();
});
