cc.Class({
    extends: cc.Component,

    properties: {
        lastSceneName:"Shader",
        nextSceneName:"Effect01",
    },

    // use this for initialization
    onLoad: function () {

    },
    onClickNext:function(){
        cc.director.loadScene(this.nextSceneName);
    },
    onClickLast:function(){
         cc.director.loadScene(this.lastSceneName);
    }
});
