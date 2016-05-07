var _default_vert = require("../Shaders/ccShader_Default_Vert.js");
var _shadow_black_white_frag = require("../Shaders/ccShader_Shadow_Black_White_Frag.js");

cc.Class({
    "extends": cc.Component,

    properties: {},

    onLoad: function onLoad() {
        this._strength = 0.001;
        this._motion = 0;

        this._use();
    },

    _use: function _use() {
        this._program = new cc.GLProgram();
        this._program.initWithVertexShaderByteArray(_default_vert, _shadow_black_white_frag);

        this._program.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);
        this._program.addAttribute(cc.ATTRIBUTE_NAME_COLOR, cc.VERTEX_ATTRIB_COLOR);
        this._program.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);
        this._program.link();
        this._program.updateUniforms();

        this._uniStrength = this._program.getUniformLocationForName("strength");

        cc.setProgram(this.node._sgNode, this._program);
    },

    update: function update(dt) {
        if (this._program) {
            this._program.setUniformLocationWith1f(this._uniStrength, this._motion += this._strength);
            this._program.updateUniforms();
            if (1.0 < this._motion || 0.0 > this._motion) {
                this._strength *= -1;
            }
        }
    }
});