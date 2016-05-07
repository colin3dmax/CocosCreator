var _default_vert = require("../Shaders/ccShader_Default_Vert.js");
var _blur_edge_detail_frag = require("../Shaders/ccShader_Blur_Edge_Detail_Frag.js");

cc.Class({
    "extends": cc.Component,

    properties: {},

    onLoad: function onLoad() {
        this._use();
    },

    _use: function _use() {
        this._program = new cc.GLProgram();
        this._program.initWithVertexShaderByteArray(_default_vert, _blur_edge_detail_frag);

        this._program.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);
        this._program.addAttribute(cc.ATTRIBUTE_NAME_COLOR, cc.VERTEX_ATTRIB_COLOR);
        this._program.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);
        this._program.link();
        this._program.updateUniforms();

        this._uniWidthStep = this._program.getUniformLocationForName("widthStep");
        this._uniHeightStep = this._program.getUniformLocationForName("heightStep");
        this._uniStrength = this._program.getUniformLocationForName("strength");

        this._program.setUniformLocationWith1f(this._uniWidthStep, 1.0 / this.node.getContentSize().width);
        this._program.setUniformLocationWith1f(this._uniHeightStep, 1.0 / this.node.getContentSize().height);

        /* 模糊 0.5     */
        /* 模糊 1.0     */
        /* 细节 -2.0    */
        /* 细节 -5.0    */
        /* 细节 -10.0   */
        /* 边缘 2.0     */
        /* 边缘 5.0     */
        /* 边缘 10.0    */
        this._program.setUniformLocationWith1f(this._uniStrength, 2.0);

        cc.setProgram(this.node._sgNode, this._program);
    }

});