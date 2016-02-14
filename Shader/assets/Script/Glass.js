var _default_vert = require("../Shaders/ccShader_Default_Vert.js");
var _glass_frag = require("../Shaders/ccShader_Glass_Frag.js");

cc.Class({
    extends: cc.Component,

    properties: {
            
    },

    onLoad: function () {
        this._use();
    },

    _use: function()
    {
        this._program = new cc.GLProgram();
        this._program.initWithVertexShaderByteArray(_default_vert, _glass_frag);

        this._program.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);
        this._program.addAttribute(cc.ATTRIBUTE_NAME_COLOR, cc.VERTEX_ATTRIB_COLOR);
        this._program.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);
        this._program.link();
        this._program.updateUniforms();
        
        this._uniWidthStep = this._program.getUniformLocationForName( "widthStep" );
        this._uniHeightStep = this._program.getUniformLocationForName( "heightStep" );
        this._uniBlurRadiusScale = this._program.getUniformLocationForName( "blurRadiusScale" );

        this._program.setUniformLocationWith1f( this._uniWidthStep, ( 1.0 / this.node.getContentSize().width ) );
        this._program.setUniformLocationWith1f( this._uniHeightStep, ( 1.0 / this.node.getContentSize().height ) );
        
        /* 磨砂玻璃 1.0 */
        /* 磨砂玻璃 3.0 */
        /* 磨砂玻璃 6.0 */
        this._program.setUniformLocationWith1f( this._uniBlurRadiusScale, 6.0 );

        cc.setProgram( this.node._sgNode, this._program );
    },

});
