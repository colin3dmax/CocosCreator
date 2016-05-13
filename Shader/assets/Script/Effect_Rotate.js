var _default_vert = require("../Shaders/ccShader_Rotate_Vert.js");
var _default_vert_no_mvp = require("../Shaders/ccShader_Rotate_Vert_noMVP.js");


var _black_white_frag = require("../Shaders/ccShader_Rotation_Avg_Black_White_Frag.js");
var _normal_frag = require("../Shaders/ccShader_Normal_Frag.js");

var EffectBlackWhite = cc.Class({
    extends: cc.Component,
    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.renderers/Effect/Rotate',
        help: 'https://github.com/colin3dmax/CocosCreator/blob/master/Shader_docs/Effect_Rotate.md',
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

    updateGLParameters:function(){

        if(!this.parameters){
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
                rotation:{
                    x:1.0,
                    y:1.0,
                    z:1.0,
                    w:1.0,
                },
                isMouseDown:false,

            };

        }
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


    onEnable: function () {
        this._use();
    },

    onDisable: function () {
        this._unUse();
    },

    onLoad: function () {
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
            rotation:{
                x:0,
                y:0,
                z:0,
                w:0,
            },
            isMouseDown:false,

        };


        this.node.on(cc.Node.EventType.MOUSE_DOWN, function (event) {
            this.parameters.isMouseDown=true;
        }, this);


        this.node.on(cc.Node.EventType.MOUSE_UP, function (event) {
            this.parameters.isMouseDown=false;
        }, this);

        this.node.on(cc.Node.EventType.MOUSE_LEAVE, function (event) {
            this.parameters.isMouseDown=false;
        }, this);


        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            this.parameters.isMouseDown=true;
        }, this);


        this.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            this.parameters.isMouseDown=false;
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
            this.parameters.isMouseDown=false;
        }, this);



         this.node.on(cc.Node.EventType.MOUSE_MOVE, function (event) {
            if(this.parameters.isMouseDown){
                this.parameters.mouse.x = event.getLocationX();
                this.parameters.mouse.y = event.getLocationY(); 
            }
        }, this);


        this.node.on( cc.Node.EventType.TOUCH_MOVE, function (event) {
            if(this.parameters.isMouseDown){
                this.parameters.mouse.x = event.getLocationX();
                this.parameters.mouse.y = event.getLocationY(); 
            }
        }, this);
    },
    _unUse: function()
    {
        this.updateGLParameters();
        this._program = new cc.GLProgram();
        if (cc.sys.isNative) {
            cc.log("use native GLProgram")
            this._program.initWithString(_default_vert_no_mvp, _normal_frag);


            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);

            this._program.link();
            this._program.updateUniforms();
            this.updateGLParameters();
        }else{
            this._program.initWithVertexShaderByteArray(_default_vert, _normal_frag);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);
            this._program.link();
            this._program.updateUniforms();

            this.updateGLParameters();
            
            this._program.setUniformLocationWith4f(this._program.getUniformLocationForName('rotation'), this.parameters.rotation.x,this.parameters.rotation.y,this.parameters.rotation.z ,this.parameters.rotation.w );
            this._program.setUniformLocationWith3f(this._program.getUniformLocationForName('iResolution'), this.parameters.resolution.x,this.parameters.resolution.y,this.parameters.resolution.z );
            this._program.setUniformLocationWith1f( this._program.getUniformLocationForName('iGlobalTime'), this.parameters.time );
            this._program.setUniformLocationWith4f( this._program.getUniformLocationForName('iMouse'), this.parameters.mouse.x,this.parameters.mouse.y , this.parameters.mouse.z,this.parameters.mouse.w);
            this._program.setUniformLocationWith4f( this._program.getUniformLocationForName('iDate'), this.parameters.date.x,this.parameters.date.y,this.parameters.date.z,this.parameters.date.w );

        }


        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this._program);
            glProgram_state.setUniformVec3( "iResolution", this.parameters.resolution );
            glProgram_state.setUniformFloat( "iGlobalTime" , this.parameters.time );
            glProgram_state.setUniformVec4( "iMouse" , this.parameters.mouse );
            glProgram_state.setUniformVec4("rotation", this.parameters.rotation);
        }else{


            this._resolution = this._program.getUniformLocationForName( "iResolution" );
            this._time = this._program.getUniformLocationForName( "iGlobalTime" );
            this._mouse = this._program.getUniformLocationForName( "iMouse" );
            this._rotation = this._program.getUniformLocationForName( "rotation" );

            this._program.setUniformLocationWith4f(this._rotation, this.parameters.rotation.x,this.parameters.rotation.y,this.parameters.rotation.z ,this.parameters.rotation.w );
            this._program.setUniformLocationWith3f( this._resolution, this.parameters.resolution.x,this.parameters.resolution.y,this.parameters.resolution.z );
            this._program.setUniformLocationWith1f( this._time, this.parameters.time );
            this._program.setUniformLocationWith4f( this._mouse, this.parameters.mouse.x,this.parameters.mouse.y ,this.parameters.mouse.z,this.parameters.mouse.w);
            this._program.setUniformLocationWith4f( this._date, this.parameters.date.x,this.parameters.date.y,this.parameters.date.z,this.parameters.date.w );
        }


        this.setProgram( this.node._sgNode, this._program );
        
    },

     update:function(dt){


        if(this._program){
            this.parameters.rotation.x+=dt*0.2;
            this.parameters.rotation.z+=dt*0.4;
            if(this.parameters.rotation.x>1){
                this.parameters.rotation.x=0;
            }
            
            
            this.updateGLParameters();
            this._program.use();

            if(cc.sys.isNative){
                var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this._program);
                glProgram_state.setUniformVec3( "iResolution", this.parameters.resolution );
                glProgram_state.setUniformFloat( "iGlobalTime", this.parameters.time );    
                glProgram_state.setUniformVec4( "iMouse" , this.parameters.mouse );
                glProgram_state.setUniformVec4( "iDate" , this.parameters.date );
                glProgram_state.setUniformVec4("rotation", this.parameters.rotation);
            }else{
                this._program.setUniformLocationWith4f(this._rotation, this.parameters.rotation.x,this.parameters.rotation.y,this.parameters.rotation.z ,this.parameters.rotation.w );
                this._program.setUniformLocationWith3f( this._resolution, this.parameters.resolution.x,this.parameters.resolution.y,this.parameters.resolution.z );
                this._program.setUniformLocationWith1f( this._time, this.parameters.time );
                this._program.setUniformLocationWith4f( this._mouse, this.parameters.mouse.x,this.parameters.mouse.y,this.parameters.mouse.z,this.parameters.mouse.w );
                this._program.setUniformLocationWith4f( this._date, this.parameters.date.x,this.parameters.date.y,this.parameters.date.z,this.parameters.date.w );
            }
        }
    },

    _use: function()
    {
        this.updateGLParameters();
        this._program = new cc.GLProgram();
        if (cc.sys.isNative) {
            cc.log("use native GLProgram")
            this._program.initWithString(_default_vert_no_mvp, _black_white_frag);



            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);

            this._program.link();
            this._program.updateUniforms();

        }else{
            this._program.initWithVertexShaderByteArray(_default_vert, _black_white_frag);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);
            this._program.link();
            this._program.updateUniforms();




            this._program.setUniformLocationWith4f(this._program.getUniformLocationForName('rotation'), this.parameters.rotation.x,this.parameters.rotation.y,this.parameters.rotation.z ,this.parameters.rotation.w );
            this._program.setUniformLocationWith3f(this._program.getUniformLocationForName('iResolution'), this.parameters.resolution.x,this.parameters.resolution.y,this.parameters.resolution.z );
            this._program.setUniformLocationWith1f( this._program.getUniformLocationForName('iGlobalTime'), this.parameters.time );
            this._program.setUniformLocationWith4f( this._program.getUniformLocationForName('iMouse'), this.parameters.mouse.x,this.parameters.mouse.y , this.parameters.mouse.z,this.parameters.mouse.w);
            this._program.setUniformLocationWith4f( this._program.getUniformLocationForName('iDate'), this.parameters.date.x,this.parameters.date.y,this.parameters.date.z,this.parameters.date.w );

        }


        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this._program);
            glProgram_state.setUniformVec3( "iResolution", this.parameters.resolution );
            glProgram_state.setUniformFloat( "iGlobalTime" , this.parameters.time );
            glProgram_state.setUniformVec4( "iMouse" , this.parameters.mouse );
            glProgram_state.setUniformVec4("rotation", this.parameters.rotation);
        }else{


            this._resolution = this._program.getUniformLocationForName( "iResolution" );
            this._time = this._program.getUniformLocationForName( "iGlobalTime" );
            this._mouse = this._program.getUniformLocationForName( "iMouse" );
            this._rotation = this._program.getUniformLocationForName( "rotation" );

            this._program.setUniformLocationWith4f(this._rotation, this.parameters.rotation.x,this.parameters.rotation.y,this.parameters.rotation.z ,this.parameters.rotation.w );
            this._program.setUniformLocationWith3f( this._resolution, this.parameters.resolution.x,this.parameters.resolution.y,this.parameters.resolution.z );
            this._program.setUniformLocationWith1f( this._time, this.parameters.time );
            this._program.setUniformLocationWith4f( this._mouse, this.parameters.mouse.x,this.parameters.mouse.y ,this.parameters.mouse.z,this.parameters.mouse.w);
            this._program.setUniformLocationWith4f( this._date, this.parameters.date.x,this.parameters.date.y,this.parameters.date.z,this.parameters.date.w );
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



