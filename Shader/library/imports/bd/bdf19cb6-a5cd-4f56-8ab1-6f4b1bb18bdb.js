var _default_vert = require("../Shaders/ccShader_Default_Vert.js");
var _wave_h_frag = require("../Shaders/ccShader_Wave_H_Frag.js");

cc.Class({
    "extends": cc.Component,

    properties: {},

    onLoad: function onLoad() {
        this._angle = 15;
        this._motion = 0;

        this._use();
    },

    _use: function _use() {
        this._program = new cc.GLProgram();
        this._program.initWithVertexShaderByteArray(_default_vert, _wave_h_frag);

        this._program.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);
        this._program.addAttribute(cc.ATTRIBUTE_NAME_COLOR, cc.VERTEX_ATTRIB_COLOR);
        this._program.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);
        this._program.link();
        this._program.updateUniforms();

        this._uniMotion = this._program.getUniformLocationForName("motion");
        this._uniAngle = this._program.getUniformLocationForName("angle");

        this._program.setUniformLocationWith1f(this._uniAngle, this._angle);

        cc.setProgram(this.node._sgNode, this._program);
    },

    update: function update(dt) {
        if (this._program) {
            this._program.setUniformLocationWith1f(this._uniMotion, this._motion += 0.05);
            this._program.updateUniforms();
            if (1.0e20 < this._motion) {
                this._motion = 0;
            }
        }
    }
});