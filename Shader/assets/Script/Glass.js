var _default_vert = require("../Shaders/ccShader_Default_Vert.js");
var _default_vert_no_mvp = require("../Shaders/ccShader_Default_Vert_noMVP.js");
var _glass_frag = require("../Shaders/ccShader_Glass_Frag.js");

cc.Class({
    extends: cc.Component,

    properties: {
        glassFactor:1.0,
    },

    onLoad: function () {
        this._use();
    },
    update:function(dt){
        if(this.glassFactor>=40){
            this.glassFactor=0;
        }
        this.glassFactor+=dt*3;

        if(this._program){

            this._program.use();
            if(cc.sys.isNative){
                var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this._program);
                glProgram_state.setUniformFloat( "blurRadiusScale" ,this.glassFactor);
            }else{
                this._program.setUniformLocationWith1f( this._uniBlurRadiusScale, this.glassFactor );
            }
        }
    },

    _use: function()
    {
        
        this._program = new cc.GLProgram();
        if (cc.sys.isNative) {
            this._program.initWithString(_default_vert_no_mvp, _glass_frag);
            this._program.link();
            this._program.updateUniforms();
            
        }else{
            this._program.initWithVertexShaderByteArray(_default_vert, _glass_frag);
            
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);
            this._program.link();
            this._program.updateUniforms();
            this._program.use();
        }
        
        
        
        
        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this._program);
            glProgram_state.setUniformFloat( "widthStep" , ( 1.0 / this.node.getContentSize().width ) );
            glProgram_state.setUniformFloat( "heightStep" , ( 1.0 / this.node.getContentSize().height ) );
            glProgram_state.setUniformFloat( "blurRadiusScale" ,this.glassFactor);
        }else{


            this._uniWidthStep = this._program.getUniformLocationForName( "widthStep" );
            this._uniHeightStep = this._program.getUniformLocationForName( "heightStep" );
            this._uniBlurRadiusScale = this._program.getUniformLocationForName( "blurRadiusScale" );

            this._program.setUniformLocationWith1f( this._uniWidthStep, ( 1.0 / this.node.getContentSize().width ) );
            this._program.setUniformLocationWith1f( this._uniHeightStep, ( 1.0 / this.node.getContentSize().height ) );
            this._program.setUniformLocationWith1f( this._uniBlurRadiusScale, this.glassFactor );
        }

        this.setProgram( this.node._sgNode ,this._program );
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
            this.setProgram(children[i], program);
    }

});
