alert('main.js');
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
            		console.log(111);
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
