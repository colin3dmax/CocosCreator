var _default_vert = require("../Shaders/ccShader_Default_Vert.js");
var _default_vert_no_mvp = require("../Shaders/ccShader_Default_Vert_noMVP.js");
var _glass_frag = require("../Shaders/ccShader_Glass_Frag.js");

cc.Class({
    extends: cc.Component,

    properties: {
        glassFactor:1.0,
        frag_glsl:{
            default:"Effect10.fs.glsl",
            visible:false,
        },
    },

    onLoad: function () {
        var self = this;
        var now = new Date();
        this.parameters={
            startTime:Date.now(),
            time:0.0,
            mouse:{
                x:0.0,
                y:0.0,
                z:0.0,
                w:0.0,
            },
            resolution:{
                x:0.0,
                y:0.0,
                z:1.0,
            },
            date:{
                x:now.getYear(),//year
                y:now.getMonth(),//month
                z:now.getDate(),//day
                w:now.getTime()+now.getMilliseconds()/1000,//time seconds
            },
            isMouseDown:false,

        };

        cc.loader.loadRes(self.frag_glsl,function(err,txt){
            if(err){
                cc.log(err)
            }else{
                self.frag_glsl = txt;
                self._use();
            }
        });


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
                glProgram_state.setUniformFloat( "blurRadiusScale" ,this.glassFactor);
                glProgram_state.setUniformVec3( "iResolution", this.parameters.resolution );
                glProgram_state.setUniformFloat( "iGlobalTime", this.parameters.time );    
                glProgram_state.setUniformVec4( "iMouse" , this.parameters.mouse );
                glProgram_state.setUniformVec4( "iDate" , this.parameters.date );
            }else{
                this._program.setUniformLocationWith1f( this._uniBlurRadiusScale, this.glassFactor );
                this._program.setUniformLocationWith3f( this._resolution, this.parameters.resolution.x,this.parameters.resolution.y,this.parameters.resolution.z );
                this._program.setUniformLocationWith1f( this._time, this.parameters.time );
                this._program.setUniformLocationWith4f( this._mouse, this.parameters.mouse.x,this.parameters.mouse.y,this.parameters.mouse.z,this.parameters.mouse.w );
                this._program.setUniformLocationWith4f( this._date, this.parameters.date.x,this.parameters.date.y,this.parameters.date.z,this.parameters.date.w );
            }
        }
    },
    updateGLParameters(){
        this.parameters.time = (Date.now() - this.parameters.startTime)/1000;
        this.parameters.resolution.x = ( this.node.getContentSize().width );
        this.parameters.resolution.y = ( this.node.getContentSize().height );
        var now = new Date();

        this.parameters.date={
                x:now.getYear(),//year
                y:now.getMonth(),//month
                z:now.getDate(),//day
                w:now.getTime()+now.getMilliseconds()/1000,//time seconds
            };
    },


    _use: function()
    {
        
        this._program = new cc.GLProgram();
        if (cc.sys.isNative) {
            cc.log("use native GLProgram");
            this._program = new cc.GLProgram();
            this._program.initWithString(_default_vert_no_mvp, this.frag_glsl );


            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);

            this._program.link();
            this._program.updateUniforms();
            this.updateGLParameters();
            
        }else{
             this._program = new cc.GLProgram();
            this._program.initWithVertexShaderByteArray(_default_vert, this.frag_glsl );
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);

            this._program.link();
            this._program.updateUniforms();
            this._program.use();

            this.updateGLParameters();

            this._program.setUniformLocationWith3f(this._program.getUniformLocationForName('iResolution'), this.parameters.resolution.x,this.parameters.resolution.y,this.parameters.resolution.z );
            this._program.setUniformLocationWith1f( this._program.getUniformLocationForName('iGlobalTime'), this.parameters.time );
            this._program.setUniformLocationWith4f( this._program.getUniformLocationForName('iMouse'), this.parameters.mouse.x,this.parameters.mouse.y , this.parameters.mouse.z,this.parameters.mouse.w);
            this._program.setUniformLocationWith4f( this._program.getUniformLocationForName('iDate'), this.parameters.date.x,this.parameters.date.y,this.parameters.date.z,this.parameters.date.w );
        }
        
        
        
        
        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this._program);
            glProgram_state.setUniformFloat( "widthStep" , ( 1.0 / this.node.getContentSize().width ) );
            glProgram_state.setUniformFloat( "heightStep" , ( 1.0 / this.node.getContentSize().height ) );
            glProgram_state.setUniformFloat( "blurRadiusScale" ,this.glassFactor);
            glProgram_state.setUniformVec3( "iResolution", this.parameters.resolution );
            glProgram_state.setUniformFloat( "iGlobalTime" , this.parameters.time );
            glProgram_state.setUniformVec4( "iMouse" , this.parameters.mouse );
        }else{


            this._uniWidthStep = this._program.getUniformLocationForName( "widthStep" );
            this._uniHeightStep = this._program.getUniformLocationForName( "heightStep" );
            this._uniBlurRadiusScale = this._program.getUniformLocationForName( "blurRadiusScale" );

            this._program.setUniformLocationWith1f( this._uniWidthStep, ( 1.0 / this.node.getContentSize().width ) );
            this._program.setUniformLocationWith1f( this._uniHeightStep, ( 1.0 / this.node.getContentSize().height ) );
            this._program.setUniformLocationWith1f( this._uniBlurRadiusScale, this.glassFactor );

            this._resolution = this._program.getUniformLocationForName( "iResolution" );
            this._time = this._program.getUniformLocationForName( "iGlobalTime" );
            this._mouse = this._program.getUniformLocationForName( "iMouse" );

            this._program.setUniformLocationWith3f( this._resolution, this.parameters.resolution.x,this.parameters.resolution.y,this.parameters.resolution.z );
            this._program.setUniformLocationWith1f( this._time, this.parameters.time );
            this._program.setUniformLocationWith4f( this._mouse, this.parameters.mouse.x,this.parameters.mouse.y ,this.parameters.mouse.z,this.parameters.mouse.w);
            this._program.setUniformLocationWith4f( this._date, this.parameters.date.x,this.parameters.date.y,this.parameters.date.z,this.parameters.date.w );
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
