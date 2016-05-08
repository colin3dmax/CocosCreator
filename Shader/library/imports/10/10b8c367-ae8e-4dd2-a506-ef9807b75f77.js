cc.Class({
    "extends": cc.Component,

    properties: {
        lastSceneName: "Shader",
        nextSceneName: "Effect01"
    },

    // use this for initialization
    onLoad: function onLoad() {},
    onClickNext: function onClickNext() {
        cc.director.loadScene(this.nextSceneName);
    },
    onClickLast: function onClickLast() {
        cc.director.loadScene(this.lastSceneName);
    }
});