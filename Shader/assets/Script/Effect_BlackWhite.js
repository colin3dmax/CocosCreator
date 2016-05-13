var _default_vert = require("../Shaders/ccShader_Default_Vert.js");
var _default_vert_no_mvp = require("../Shaders/ccShader_Default_Vert_noMVP.js");
var _black_white_frag = require("../Shaders/ccShader_Avg_Black_White_Frag.js");
var _normal_frag = require("../Shaders/ccShader_Normal_Frag.js");

var EffectBlackWhite = cc.Class({
    extends: cc.Component,
    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.renderers/Effect/BlackWhite',
        help: 'https://github.com/colin3dmax/CocosCreator/blob/master/Shader_docs/Effect_BlackWhite.md',
        executeInEditMode: true,
    },

    properties: {
        isAllChildrenUser:false,
    },
    
    _createSgNode: function () {
        // this._clippingStencil = new cc.DrawNode();
        // this._clippingStencil.retain();
        // return new cc.ClippingNode(this._clippingStencil);
    },

    _initSgNode: function () {},


    onEnable: function () {
        this._use();
    },

    onDisable: function () {
        this._unUse();
    },

    onLoad: function () {
        //this._use();
    },
    _unUse: function()
    {
        this._program = new cc.GLProgram();
        if (cc.sys.isNative) {
            cc.log("use native GLProgram")
            this._program.initWithString(_default_vert_no_mvp, _normal_frag);
            this._program.link();
            this._program.updateUniforms();
        }else{
            this._program.initWithVertexShaderByteArray(_default_vert, _normal_frag);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);
            this._program.link();
            this._program.updateUniforms();
        }
        this.setProgram( this.node._sgNode, this._program );
        
    },

    _use: function()
    {
        this._program = new cc.GLProgram();
        if (cc.sys.isNative) {
            cc.log("use native GLProgram")
            this._program.initWithString(_default_vert_no_mvp, _black_white_frag);
            this._program.link();
            this._program.updateUniforms();
        }else{
            this._program.initWithVertexShaderByteArray(_default_vert, _black_white_frag);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);
            this._program.link();
            this._program.updateUniforms();
        }
        this.setProgram( this.node._sgNode, this._program );
        
    },
    setProgram:function (node, program) {

        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(program);
            node.setGLProgramState(glProgram_state);
        }else{
            node.setShaderProgram(program);    
        }
        
        var children = node.children;
        if (!children)
            return;
    
        for (var i = 0; i < children.length; i++)
        {
            this.setProgram(children[i], program);
        }
    },

    
});

cc.EffectBlackWhite = module.exports = EffectBlackWhite;



