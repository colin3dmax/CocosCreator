cc.Class({
    extends: cc.Component,

    properties: {
        lastSceneName:"Shader",
        nextSceneName:"Effect01",
        
    },

    // use this for initialization
    onLoad: function () {
        if(!window.curLevelId){
            window.curLevelId=1;
        }
    },
    getCurLevelName:function(){
        var levelName = "Effect";
        levelName+=window.curLevelId<10?"0"+window.curLevelId:window.curLevelId;
        return levelName;
    },
    onClickNext:function(){
        window.curLevelId++;
        if(window.curLevelId>150){
            window.curLevelId=1;
        }
        cc.director.loadScene(this.getCurLevelName());
    },
    onClickLast:function(){
        window.curLevelId--;
        if(window.curLevelId<=1){
            window.curLevelId=0;
        }
        
        cc.director.loadScene(this.getCurLevelName());
    },
    onClickToGitHub:function(){
       window.open("http://forum.cocos.com/t/creator-shader/36388");
    }
});
