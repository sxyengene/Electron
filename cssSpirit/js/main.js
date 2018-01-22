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
                    if(files.length){
                        for(var i = 0;i < files.length; i++ ){
                            
                        }
                    }
            		
                    ctx.drawImage()
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
