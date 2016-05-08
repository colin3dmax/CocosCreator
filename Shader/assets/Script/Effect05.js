var _default_vert = require("../Shaders/ccShader_Default_Vert.js");
var _default_vert_no_mvp = require("../Shaders/ccShader_Default_Vert_noMVP.js");
var _glass_frag = require("../Shaders/ccShader_Effect05_Frag.js");

cc.Class({
    extends: cc.Component,

    properties: {
        glassFactor:1.0,
    }, 

    onLoad: function () {
        this.parameters={
            startTime:Date.now(),
            time:0.0,
            mouse:{
                x:0.0,
                y:0.0,
            },
            resolution:{
                x:0.0,
                y:0.0,
            }

        };
        this.node.on(cc.Node.EventType.MOUSE_MOVE, function (event) {
            this.parameters.mouse.x = this.node.getContentSize().width / event.getLocationX();
            this.parameters.mouse.y = this.node.getContentSize().height / event.getLocationY(); 
        }, this);


        this.node.on( cc.Node.EventType.TOUCH_MOVE, function (event) {
            this.parameters.mouse.x = this.node.getContentSize().width / event.getLocationX();
            this.parameters.mouse.y = this.node.getContentSize().height / event.getLocationY(); 
        }, this);

        this._use();
    },
    update:function(dt){
        if(this.glassFactor>=40){
            this.glassFactor=0;
        }
        this.glassFactor+=dt*3;

        if(this._program){

            this._program.use();
            this.updateGLParameters();
            if(cc.sys.isNative){
                var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this._program);
                glProgram_state.setUniformVec2( "resolution", this.parameters.resolution );
                glProgram_state.setUniformFloat( "time", this.parameters.time );    
                glProgram_state.setUniformVec2( "mouse" , this.parameters.mouse );
            }else{
                this._program.setUniformLocationWith2f( this._resolution, this.parameters.resolution.x,this.parameters.resolution.y );
                this._program.setUniformLocationWith1f( this._time, this.parameters.time );
                this._program.setUniformLocationWith2f( this._mouse, this.parameters.mouse.x,this.parameters.mouse.x );
            }
        }
    },
    updateGLParameters(){
        this.parameters.time = (Date.now() - this.parameters.startTime)/1000;
        this.parameters.resolution.x = ( this.node.getContentSize().width );
        this.parameters.resolution.y = ( this.node.getContentSize().height );


    },

    _use: function()
    {
        
        if (cc.sys.isNative) {
            cc.log("use native GLProgram");
            this._program = new cc.GLProgram();
            this._program.initWithString(_default_vert_no_mvp, _glass_frag);


            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);

            this._program.link();
            this._program.updateUniforms();
            this.updateGLParameters();


           
        }else{
            this._program = new cc.GLProgram();
            this._program.initWithVertexShaderByteArray(_default_vert, _glass_frag);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);

            this._program.link();
            this._program.updateUniforms();
            this._program.use();

            this.updateGLParameters();

            this._program.setUniformLocationWith1f( this._program.getUniformLocationForName('time'), this.parameters.time );
            this._program.setUniformLocationWith2f( this._program.getUniformLocationForName('mouse'), this.parameters.mouse.x,this.parameters.mouse.y );
            this._program.setUniformLocationWith2f(this._program.getUniformLocationForName('resolution'), this.parameters.resolution.x,this.parameters.resolution.y );

        }

        

        
        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this._program);
            glProgram_state.setUniformVec2( "resolution", this.parameters.resolution );
            glProgram_state.setUniformFloat( "time" , this.parameters.time );
            glProgram_state.setUniformVec2( "mouse" , this.parameters.mouse );
        }else{


            this._resolution = this._program.getUniformLocationForName( "resolution" );
            this._time = this._program.getUniformLocationForName( "time" );
            this._mouse = this._program.getUniformLocationForName( "mouse" );

            this._program.setUniformLocationWith2f( this._resolution, this.parameters.resolution.x,this.parameters.resolution.y );
            this._program.setUniformLocationWith1f( this._time, this.parameters.time );
            this._program.setUniformLocationWith2f( this._mouse, this.parameters.mouse.x,this.parameters.mouse.y );
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
