var _default_vert = require("../Shaders/ccShader_Default_Vert.js");
var _default_vert_no_mvp = require("../Shaders/ccShader_Default_Vert_noMVP.js");
var _wave_v_frag = require("../Shaders/ccShader_Wave_V_Frag.js");

cc.Class({
    extends: cc.Component,

    properties: {
            
    },

    onLoad: function () {
        this._angle = 15;
        this._motion = 0;
        
        this._use();
    },

    _use: function()
    {
        this._program = new cc.GLProgram();

        if (cc.sys.isNative) {
            cc.log("use native GLProgram")
            this._program.initWithString(_default_vert_no_mvp, _wave_v_frag);
            this._program.link();
            this._program.updateUniforms();
        }else{
            this._program.initWithVertexShaderByteArray(_default_vert, _wave_v_frag);

            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);
            this._program.link();
            this._program.updateUniforms();
        }
        
        this._uniMotion = this._program.getUniformLocationForName( "motion" );
        this._uniAngle = this._program.getUniformLocationForName( "angle" );

        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this._program);
            glProgram_state.setUniformFloat( this._uniAngle, this._angle );
        }else{
            this._program.setUniformLocationWith1f( this._uniAngle, this._angle );
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
            this.setProgram(children[i], program);
    },  
    
    
    update: function( dt )
    {
        if( this._program )
        {

            this._program.use();
            if(cc.sys.isNative){
                var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this._program);
                glProgram_state.setUniformFloat( this._uniMotion, ( this._motion += 0.05 ) );
            }else{
                this._program.setUniformLocationWith1f( this._uniMotion, ( this._motion += 0.05 ) );
                this._program.updateUniforms();
            }

            if( 1.0e20 < this._motion ){ this._motion = 0; }
        }
    }
});
