var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var GData = {

};
var vm;

function name(){
    return this.init();
}

name.prototype = {
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
            	
            }
        });
    },
    bindEvent:function(){
        
    },
};