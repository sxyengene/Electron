var canvas,ctx,mask,yStart;
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
                this.varInit();
            },
            methods: {
                varInit:function(){
                    canvas = document.getElementById('canvas');
                    ctx = canvas.getContext('2d');
                    mask = document.getElementById('mask');
                    yStart = 0;
                },
            	uploadFiles:function(e){
                    var files = e.target.files;
                    if(files.length){
                        for(var i = 0;i < files.length; i++ ){
                            let nowFile = files[i];
                            var imgSrc = URL.createObjectURL(nowFile);

                    		this.newImage(imgSrc,function(img){
                                if(img.clientHeight){
                                    ctx.drawImage(img,0,yStart);
                                    yStart += img.clientHeight;
                                }else{
                                    alert(`${nowFile.name} 插入出错`)
                                }
                            });
                        }
                    }
                    
            	},
                newImage:function(src,cb){
                    var image = new Image();
                    image.onload = function(){
                        var img = mask.appendChild(image);
                        if(typeof cb == 'function')
                            cb(img);
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

/*promise 顺序执行*/
function(){
    
}

$(function() {
    
    new CssSpirit();
});
