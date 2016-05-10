cc.Class({
    extends: cc.Component,

    properties: {
        btnGroupPrefab:{
            default:null,
            type:cc.Prefab,
        }
    },

    // use this for initialization
    onLoad: function () {
        var btnGroup = cc.instantiate(this.btnGroupPrefab);
        btnGroup.parent = this.node;
    },
});
