require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"Avg_Black_White":[function(require,module,exports){
"use strict";
cc._RFpush(module, '414458STphLF75+aFmYFzfh', 'Avg_Black_White');
// Script/Avg_Black_White.js

var _default_vert = require("../Shaders/ccShader_Default_Vert.js");
var _default_vert_no_mvp = require("../Shaders/ccShader_Default_Vert_noMVP.js");
var _black_white_frag = require("../Shaders/ccShader_Avg_Black_White_Frag.js");

cc.Class({
    "extends": cc.Component,

    properties: {},

    onLoad: function onLoad() {
        this._use();
    },

    _use: function _use() {
        this._program = new cc.GLProgram();
        if (cc.sys.isNative) {
            cc.log("use native GLProgram");
            this._program.initWithString(_default_vert_no_mvp, _black_white_frag);
            this._program.link();
            this._program.updateUniforms();
        } else {
            this._program.initWithVertexShaderByteArray(_default_vert, _black_white_frag);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);
            this._program.link();
            this._program.updateUniforms();
        }
        this.setProgram(this.node._sgNode, this._program);
    },
    setProgram: function setProgram(node, program) {
        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(program);
            node.setGLProgramState(glProgram_state);
        } else {
            node.setShaderProgram(program);
        }

        var children = node.children;
        if (!children) return;

        for (var i = 0; i < children.length; i++) this.setProgram(children[i], program);
    }

});

cc._RFpop();
},{"../Shaders/ccShader_Avg_Black_White_Frag.js":"ccShader_Avg_Black_White_Frag","../Shaders/ccShader_Default_Vert.js":"ccShader_Default_Vert","../Shaders/ccShader_Default_Vert_noMVP.js":"ccShader_Default_Vert_noMVP"}],"Blur_Edge_Detail":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'dd0cfUZNt1BMqcicmcIieWs', 'Blur_Edge_Detail');
// Script/Blur_Edge_Detail.js

var _default_vert = require("../Shaders/ccShader_Default_Vert.js");
var _default_vert_no_mvp = require("../Shaders/ccShader_Default_Vert_noMVP.js");
var _blur_edge_detail_frag = require("../Shaders/ccShader_Blur_Edge_Detail_Frag.js");

cc.Class({
    "extends": cc.Component,

    properties: {},

    onLoad: function onLoad() {
        this._use();
    },

    _use: function _use() {
        this._program = new cc.GLProgram();
        if (cc.sys.isNative) {
            cc.log("use native GLProgram");
            this._program.initWithString(_default_vert_no_mvp, _blur_edge_detail_frag);
            this._program.link();
            this._program.updateUniforms();
        } else {
            this._program.initWithVertexShaderByteArray(_default_vert, _blur_edge_detail_frag);

            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);
            this._program.link();
            this._program.updateUniforms();
        }

        this._uniWidthStep = this._program.getUniformLocationForName("widthStep");
        this._uniHeightStep = this._program.getUniformLocationForName("heightStep");
        this._uniStrength = this._program.getUniformLocationForName("strength");

        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this._program);
            glProgram_state.setUniformFloat(this._uniWidthStep, 1.0 / this.node.getContentSize().width);
            glProgram_state.setUniformFloat(this._uniHeightStep, 1.0 / this.node.getContentSize().height);
            glProgram_state.setUniformFloat(this._uniStrength, 1.0);
        } else {
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
            this._program.setUniformLocationWith1f(this._uniStrength, 1.0);
        }

        this.setProgram(this.node._sgNode, this._program);
    },
    setProgram: function setProgram(node, program) {
        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(program);
            node.setGLProgramState(glProgram_state);
        } else {
            node.setShaderProgram(program);
        }

        var children = node.children;
        if (!children) return;

        for (var i = 0; i < children.length; i++) this.setProgram(children[i], program);
    }

});

cc._RFpop();
},{"../Shaders/ccShader_Blur_Edge_Detail_Frag.js":"ccShader_Blur_Edge_Detail_Frag","../Shaders/ccShader_Default_Vert.js":"ccShader_Default_Vert","../Shaders/ccShader_Default_Vert_noMVP.js":"ccShader_Default_Vert_noMVP"}],"CircleEffect2":[function(require,module,exports){
"use strict";
cc._RFpush(module, '95896LIfk9KFJ+K/yhkXSK5', 'CircleEffect2');
// Script/CircleEffect2.js

var _default_vert = require("../Shaders/ccShader_Default_Vert.js");
var _default_vert_no_mvp = require("../Shaders/ccShader_Default_Vert_noMVP.js");
var _glass_frag = require("../Shaders/ccShader_Circle_Effect2_Frag.js");

cc.Class({
    "extends": cc.Component,

    properties: {
        glassFactor: 1.0
    },

    onLoad: function onLoad() {
        this.parameters = {
            startTime: Date.now(),
            time: 0.0,
            mouse: {
                x: 0.0,
                y: 0.0
            },
            resolution: {
                x: 0.0,
                y: 0.0
            }

        };
        this.node.on(cc.Node.EventType.MOUSE_MOVE, function (event) {
            this.parameters.mouse.x = this.node.getContentSize().width / event.getLocationX();
            this.parameters.mouse.y = this.node.getContentSize().height / event.getLocationY();
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            this.parameters.mouse.x = this.node.getContentSize().width / event.getLocationX();
            this.parameters.mouse.y = this.node.getContentSize().height / event.getLocationY();
        }, this);

        this._use();
    },
    update: function update(dt) {
        if (this.glassFactor >= 40) {
            this.glassFactor = 0;
        }
        this.glassFactor += dt * 3;

        if (this._program) {

            this._program.use();
            this.updateGLParameters();
            if (cc.sys.isNative) {
                var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this._program);
                glProgram_state.setUniformVec2("resolution", this.parameters.resolution);
                glProgram_state.setUniformFloat("time", this.parameters.time);
                glProgram_state.setUniformVec2("mouse_touch", this.parameters.mouse);
            } else {
                this._program.setUniformLocationWith2f(this._resolution, this.parameters.resolution.x, this.parameters.resolution.y);
                this._program.setUniformLocationWith1f(this._time, this.parameters.time);
                this._program.setUniformLocationWith2f(this._mouse, this.parameters.mouse.x, this.parameters.mouse.x);
            }
        }
    },
    updateGLParameters: function updateGLParameters() {
        this.parameters.time = (Date.now() - this.parameters.startTime) / 1000;
        this.parameters.resolution.x = this.node.getContentSize().width;
        this.parameters.resolution.y = this.node.getContentSize().height;
    },

    _use: function _use() {

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
        } else {
            this._program = new cc.GLProgram();
            this._program.initWithVertexShaderByteArray(_default_vert, _glass_frag);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);

            this._program.link();
            this._program.updateUniforms();
            this._program.use();

            this.updateGLParameters();

            this._program.setUniformLocationWith1f(this._program.getUniformLocationForName('time'), this.parameters.time);
            this._program.setUniformLocationWith2f(this._program.getUniformLocationForName('mouse_touch'), this.parameters.mouse.x, this.parameters.mouse.y);
            this._program.setUniformLocationWith2f(this._program.getUniformLocationForName('resolution'), this.parameters.resolution.x, this.parameters.resolution.y);
        }

        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this._program);
            glProgram_state.setUniformVec2("resolution", this.parameters.resolution);
            glProgram_state.setUniformFloat("time", this.parameters.time);
            glProgram_state.setUniformVec2("mouse_touch", this.parameters.mouse);
        } else {

            this._resolution = this._program.getUniformLocationForName("resolution");
            this._time = this._program.getUniformLocationForName("time");
            this._mouse = this._program.getUniformLocationForName("mouse_touch");

            this._program.setUniformLocationWith2f(this._resolution, this.parameters.resolution.x, this.parameters.resolution.y);
            this._program.setUniformLocationWith1f(this._time, this.parameters.time);
            this._program.setUniformLocationWith2f(this._mouse, this.parameters.mouse.x, this.parameters.mouse.y);
        }

        this.setProgram(this.node._sgNode, this._program);
    },

    setProgram: function setProgram(node, program) {
        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(program);
            node.setGLProgramState(glProgram_state);
        } else {
            node.setShaderProgram(program);
        }

        var children = node.children;
        if (!children) return;

        for (var i = 0; i < children.length; i++) this.setProgram(children[i], program);
    }

});

cc._RFpop();
},{"../Shaders/ccShader_Circle_Effect2_Frag.js":"ccShader_Circle_Effect2_Frag","../Shaders/ccShader_Default_Vert.js":"ccShader_Default_Vert","../Shaders/ccShader_Default_Vert_noMVP.js":"ccShader_Default_Vert_noMVP"}],"CircleLight":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'c535fik5e5HHI9MZ9PRxTVf', 'CircleLight');
// Script/CircleLight.js

var _default_vert = require("../Shaders/ccShader_Default_Vert.js");
var _default_vert_no_mvp = require("../Shaders/ccShader_Default_Vert_noMVP.js");
var _glass_frag = require("../Shaders/ccShader_Circle_Light_Frag.js");

cc.Class({
    "extends": cc.Component,

    properties: {
        glassFactor: 1.0
    },

    onLoad: function onLoad() {
        this.parameters = {
            startTime: Date.now(),
            time: 0.0,
            mouse: {
                x: 0.0,
                y: 0.0
            },
            resolution: {
                x: 0.0,
                y: 0.0
            }

        };
        this.node.on(cc.Node.EventType.MOUSE_MOVE, function (event) {
            this.parameters.mouse.x = event.getLocationX();
            this.parameters.mouse.y = event.getLocationY();
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            this.parameters.mouse.x = event.getLocationX();
            this.parameters.mouse.y = event.getLocationY();
        }, this);

        this._use();
    },
    update: function update(dt) {
        if (this.glassFactor >= 40) {
            this.glassFactor = 0;
        }
        this.glassFactor += dt * 3;

        if (this._program) {

            this._program.use();
            this.updateGLParameters();
            if (cc.sys.isNative) {
                var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this._program);
                glProgram_state.setUniformVec2("resolution", this.parameters.resolution);
                glProgram_state.setUniformFloat("time", this.parameters.time);
                glProgram_state.setUniformVec2("mouse_touch", this.parameters.mouse);
            } else {
                this._program.setUniformLocationWith2f(this._resolution, this.parameters.resolution.x, this.parameters.resolution.y);
                this._program.setUniformLocationWith1f(this._time, this.parameters.time);
                this._program.setUniformLocationWith2f(this._mouse, this.parameters.mouse.x, this.parameters.mouse.x);
            }
        }
    },
    updateGLParameters: function updateGLParameters() {
        this.parameters.time = (Date.now() - this.parameters.startTime) / 1000;
        this.parameters.resolution.x = 1.0 / this.node.getContentSize().width;
        this.parameters.resolution.y = 1.0 / this.node.getContentSize().height;
    },

    _use: function _use() {

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
        } else {
            this._program = new cc.GLProgram();
            this._program.initWithVertexShaderByteArray(_default_vert, _glass_frag);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);

            this._program.link();
            this._program.updateUniforms();
            this._program.use();

            this.updateGLParameters();

            this._program.setUniformLocationWith1f(this._program.getUniformLocationForName('time'), this.parameters.time);
            this._program.setUniformLocationWith2f(this._program.getUniformLocationForName('mouse_touch'), this.parameters.mouse.x, this.parameters.mouse.y);
            this._program.setUniformLocationWith2f(this._program.getUniformLocationForName('resolution'), this.parameters.resolution.x, this.parameters.resolution.y);
        }

        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this._program);
            glProgram_state.setUniformVec2("resolution", this.parameters.resolution);
            glProgram_state.setUniformFloat("time", this.parameters.time);
            glProgram_state.setUniformVec2("mouse_touch", this.parameters.mouse);
        } else {

            this._resolution = this._program.getUniformLocationForName("resolution");
            this._time = this._program.getUniformLocationForName("time");
            this._mouse = this._program.getUniformLocationForName("mouse_touch");

            this._program.setUniformLocationWith2f(this._resolution, this.parameters.resolution.x, this.parameters.resolution.y);
            this._program.setUniformLocationWith1f(this._time, this.parameters.time);
            this._program.setUniformLocationWith2f(this._mouse, this.parameters.mouse.x, this.parameters.mouse.y);
        }

        this.setProgram(this.node._sgNode, this._program);
    },

    setProgram: function setProgram(node, program) {
        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(program);
            node.setGLProgramState(glProgram_state);
        } else {
            node.setShaderProgram(program);
        }

        var children = node.children;
        if (!children) return;

        for (var i = 0; i < children.length; i++) this.setProgram(children[i], program);
    }

});

cc._RFpop();
},{"../Shaders/ccShader_Circle_Light_Frag.js":"ccShader_Circle_Light_Frag","../Shaders/ccShader_Default_Vert.js":"ccShader_Default_Vert","../Shaders/ccShader_Default_Vert_noMVP.js":"ccShader_Default_Vert_noMVP"}],"Effect03":[function(require,module,exports){
"use strict";
cc._RFpush(module, '825950NkS1J8YHSJYAi7QiR', 'Effect03');
// Script/Effect03.js

var _default_vert = require("../Shaders/ccShader_Default_Vert.js");
var _default_vert_no_mvp = require("../Shaders/ccShader_Default_Vert_noMVP.js");
var _glass_frag = require("../Shaders/ccShader_Effect03_Frag.js");

cc.Class({
    "extends": cc.Component,

    properties: {
        glassFactor: 1.0
    },

    onLoad: function onLoad() {
        this.parameters = {
            startTime: Date.now(),
            time: 0.0,
            mouse: {
                x: 0.0,
                y: 0.0
            },
            resolution: {
                x: 0.0,
                y: 0.0
            }

        };
        this.node.on(cc.Node.EventType.MOUSE_MOVE, function (event) {
            this.parameters.mouse.x = this.node.getContentSize().width / event.getLocationX();
            this.parameters.mouse.y = this.node.getContentSize().height / event.getLocationY();
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            this.parameters.mouse.x = this.node.getContentSize().width / event.getLocationX();
            this.parameters.mouse.y = this.node.getContentSize().height / event.getLocationY();
        }, this);

        this._use();
    },
    update: function update(dt) {
        if (this.glassFactor >= 40) {
            this.glassFactor = 0;
        }
        this.glassFactor += dt * 3;

        if (this._program) {

            this._program.use();
            this.updateGLParameters();
            if (cc.sys.isNative) {
                var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this._program);
                glProgram_state.setUniformVec2("resolution", this.parameters.resolution);
                glProgram_state.setUniformFloat("time", this.parameters.time);
                glProgram_state.setUniformVec2("mouse_touch", this.parameters.mouse);
            } else {
                this._program.setUniformLocationWith2f(this._resolution, this.parameters.resolution.x, this.parameters.resolution.y);
                this._program.setUniformLocationWith1f(this._time, this.parameters.time);
                this._program.setUniformLocationWith2f(this._mouse, this.parameters.mouse.x, this.parameters.mouse.x);
            }
        }
    },
    updateGLParameters: function updateGLParameters() {
        this.parameters.time = (Date.now() - this.parameters.startTime) / 1000;
        this.parameters.resolution.x = this.node.getContentSize().width;
        this.parameters.resolution.y = this.node.getContentSize().height;
    },

    _use: function _use() {

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
        } else {
            this._program = new cc.GLProgram();
            this._program.initWithVertexShaderByteArray(_default_vert, _glass_frag);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);

            this._program.link();
            this._program.updateUniforms();
            this._program.use();

            this.updateGLParameters();

            this._program.setUniformLocationWith1f(this._program.getUniformLocationForName('time'), this.parameters.time);
            this._program.setUniformLocationWith2f(this._program.getUniformLocationForName('mouse_touch'), this.parameters.mouse.x, this.parameters.mouse.y);
            this._program.setUniformLocationWith2f(this._program.getUniformLocationForName('resolution'), this.parameters.resolution.x, this.parameters.resolution.y);
        }

        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this._program);
            glProgram_state.setUniformVec2("resolution", this.parameters.resolution);
            glProgram_state.setUniformFloat("time", this.parameters.time);
            glProgram_state.setUniformVec2("mouse_touch", this.parameters.mouse);
        } else {

            this._resolution = this._program.getUniformLocationForName("resolution");
            this._time = this._program.getUniformLocationForName("time");
            this._mouse = this._program.getUniformLocationForName("mouse_touch");

            this._program.setUniformLocationWith2f(this._resolution, this.parameters.resolution.x, this.parameters.resolution.y);
            this._program.setUniformLocationWith1f(this._time, this.parameters.time);
            this._program.setUniformLocationWith2f(this._mouse, this.parameters.mouse.x, this.parameters.mouse.y);
        }

        this.setProgram(this.node._sgNode, this._program);
    },

    setProgram: function setProgram(node, program) {
        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(program);
            node.setGLProgramState(glProgram_state);
        } else {
            node.setShaderProgram(program);
        }

        var children = node.children;
        if (!children) return;

        for (var i = 0; i < children.length; i++) this.setProgram(children[i], program);
    }

});

cc._RFpop();
},{"../Shaders/ccShader_Default_Vert.js":"ccShader_Default_Vert","../Shaders/ccShader_Default_Vert_noMVP.js":"ccShader_Default_Vert_noMVP","../Shaders/ccShader_Effect03_Frag.js":"ccShader_Effect03_Frag"}],"Effect04":[function(require,module,exports){
"use strict";
cc._RFpush(module, '7e72aHZYNVN+oTuTk2AELVi', 'Effect04');
// Script/Effect04.js

var _default_vert = require("../Shaders/ccShader_Default_Vert.js");
var _default_vert_no_mvp = require("../Shaders/ccShader_Default_Vert_noMVP.js");
var _glass_frag = require("../Shaders/ccShader_Effect04_Frag.js");

cc.Class({
    "extends": cc.Component,

    properties: {
        glassFactor: 1.0
    },

    onLoad: function onLoad() {
        this.parameters = {
            startTime: Date.now(),
            time: 0.0,
            mouse: {
                x: 0.0,
                y: 0.0
            },
            resolution: {
                x: 0.0,
                y: 0.0
            }

        };
        this.node.on(cc.Node.EventType.MOUSE_MOVE, function (event) {
            this.parameters.mouse.x = this.node.getContentSize().width / event.getLocationX();
            this.parameters.mouse.y = this.node.getContentSize().height / event.getLocationY();
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            this.parameters.mouse.x = this.node.getContentSize().width / event.getLocationX();
            this.parameters.mouse.y = this.node.getContentSize().height / event.getLocationY();
        }, this);

        this._use();
    },
    update: function update(dt) {
        if (this.glassFactor >= 40) {
            this.glassFactor = 0;
        }
        this.glassFactor += dt * 3;

        if (this._program) {

            this._program.use();
            this.updateGLParameters();
            if (cc.sys.isNative) {
                var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this._program);
                glProgram_state.setUniformVec2("resolution", this.parameters.resolution);
                glProgram_state.setUniformFloat("time", this.parameters.time);
                glProgram_state.setUniformVec2("mouse_touch", this.parameters.mouse);
            } else {
                this._program.setUniformLocationWith2f(this._resolution, this.parameters.resolution.x, this.parameters.resolution.y);
                this._program.setUniformLocationWith1f(this._time, this.parameters.time);
                this._program.setUniformLocationWith2f(this._mouse, this.parameters.mouse.x, this.parameters.mouse.x);
            }
        }
    },
    updateGLParameters: function updateGLParameters() {
        this.parameters.time = (Date.now() - this.parameters.startTime) / 1000;
        this.parameters.resolution.x = this.node.getContentSize().width;
        this.parameters.resolution.y = this.node.getContentSize().height;
    },

    _use: function _use() {

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
        } else {
            this._program = new cc.GLProgram();
            this._program.initWithVertexShaderByteArray(_default_vert, _glass_frag);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);

            this._program.link();
            this._program.updateUniforms();
            this._program.use();

            this.updateGLParameters();

            this._program.setUniformLocationWith1f(this._program.getUniformLocationForName('time'), this.parameters.time);
            this._program.setUniformLocationWith2f(this._program.getUniformLocationForName('mouse_touch'), this.parameters.mouse.x, this.parameters.mouse.y);
            this._program.setUniformLocationWith2f(this._program.getUniformLocationForName('resolution'), this.parameters.resolution.x, this.parameters.resolution.y);
        }

        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this._program);
            glProgram_state.setUniformVec2("resolution", this.parameters.resolution);
            glProgram_state.setUniformFloat("time", this.parameters.time);
            glProgram_state.setUniformVec2("mouse_touch", this.parameters.mouse);
        } else {

            this._resolution = this._program.getUniformLocationForName("resolution");
            this._time = this._program.getUniformLocationForName("time");
            this._mouse = this._program.getUniformLocationForName("mouse_touch");

            this._program.setUniformLocationWith2f(this._resolution, this.parameters.resolution.x, this.parameters.resolution.y);
            this._program.setUniformLocationWith1f(this._time, this.parameters.time);
            this._program.setUniformLocationWith2f(this._mouse, this.parameters.mouse.x, this.parameters.mouse.y);
        }

        this.setProgram(this.node._sgNode, this._program);
    },

    setProgram: function setProgram(node, program) {
        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(program);
            node.setGLProgramState(glProgram_state);
        } else {
            node.setShaderProgram(program);
        }

        var children = node.children;
        if (!children) return;

        for (var i = 0; i < children.length; i++) this.setProgram(children[i], program);
    }

});

cc._RFpop();
},{"../Shaders/ccShader_Default_Vert.js":"ccShader_Default_Vert","../Shaders/ccShader_Default_Vert_noMVP.js":"ccShader_Default_Vert_noMVP","../Shaders/ccShader_Effect04_Frag.js":"ccShader_Effect04_Frag"}],"Effect05":[function(require,module,exports){
"use strict";
cc._RFpush(module, '87cfcc1sDhG8JNWiABvt1pA', 'Effect05');
// Script/Effect05.js

var _default_vert = require("../Shaders/ccShader_Default_Vert.js");
var _default_vert_no_mvp = require("../Shaders/ccShader_Default_Vert_noMVP.js");
var _glass_frag = require("../Shaders/ccShader_Effect05_Frag.js");

cc.Class({
    "extends": cc.Component,

    properties: {
        glassFactor: 1.0
    },

    onLoad: function onLoad() {
        this.parameters = {
            startTime: Date.now(),
            time: 0.0,
            mouse: {
                x: 0.0,
                y: 0.0
            },
            resolution: {
                x: 0.0,
                y: 0.0
            }

        };
        this.node.on(cc.Node.EventType.MOUSE_MOVE, function (event) {
            this.parameters.mouse.x = this.node.getContentSize().width / event.getLocationX();
            this.parameters.mouse.y = this.node.getContentSize().height / event.getLocationY();
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            this.parameters.mouse.x = this.node.getContentSize().width / event.getLocationX();
            this.parameters.mouse.y = this.node.getContentSize().height / event.getLocationY();
        }, this);

        this._use();
    },
    update: function update(dt) {
        if (this.glassFactor >= 40) {
            this.glassFactor = 0;
        }
        this.glassFactor += dt * 3;

        if (this._program) {

            this._program.use();
            this.updateGLParameters();
            if (cc.sys.isNative) {
                var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this._program);
                glProgram_state.setUniformVec2("resolution", this.parameters.resolution);
                glProgram_state.setUniformFloat("time", this.parameters.time);
                glProgram_state.setUniformVec2("mouse", this.parameters.mouse);
            } else {
                this._program.setUniformLocationWith2f(this._resolution, this.parameters.resolution.x, this.parameters.resolution.y);
                this._program.setUniformLocationWith1f(this._time, this.parameters.time);
                this._program.setUniformLocationWith2f(this._mouse, this.parameters.mouse.x, this.parameters.mouse.x);
            }
        }
    },
    updateGLParameters: function updateGLParameters() {
        this.parameters.time = (Date.now() - this.parameters.startTime) / 1000;
        this.parameters.resolution.x = this.node.getContentSize().width;
        this.parameters.resolution.y = this.node.getContentSize().height;
    },

    _use: function _use() {

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
        } else {
            this._program = new cc.GLProgram();
            this._program.initWithVertexShaderByteArray(_default_vert, _glass_frag);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);

            this._program.link();
            this._program.updateUniforms();
            this._program.use();

            this.updateGLParameters();

            this._program.setUniformLocationWith1f(this._program.getUniformLocationForName('time'), this.parameters.time);
            this._program.setUniformLocationWith2f(this._program.getUniformLocationForName('mouse'), this.parameters.mouse.x, this.parameters.mouse.y);
            this._program.setUniformLocationWith2f(this._program.getUniformLocationForName('resolution'), this.parameters.resolution.x, this.parameters.resolution.y);
        }

        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this._program);
            glProgram_state.setUniformVec2("resolution", this.parameters.resolution);
            glProgram_state.setUniformFloat("time", this.parameters.time);
            glProgram_state.setUniformVec2("mouse", this.parameters.mouse);
        } else {

            this._resolution = this._program.getUniformLocationForName("resolution");
            this._time = this._program.getUniformLocationForName("time");
            this._mouse = this._program.getUniformLocationForName("mouse");

            this._program.setUniformLocationWith2f(this._resolution, this.parameters.resolution.x, this.parameters.resolution.y);
            this._program.setUniformLocationWith1f(this._time, this.parameters.time);
            this._program.setUniformLocationWith2f(this._mouse, this.parameters.mouse.x, this.parameters.mouse.y);
        }

        this.setProgram(this.node._sgNode, this._program);
    },

    setProgram: function setProgram(node, program) {
        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(program);
            node.setGLProgramState(glProgram_state);
        } else {
            node.setShaderProgram(program);
        }

        var children = node.children;
        if (!children) return;

        for (var i = 0; i < children.length; i++) this.setProgram(children[i], program);
    }

});

cc._RFpop();
},{"../Shaders/ccShader_Default_Vert.js":"ccShader_Default_Vert","../Shaders/ccShader_Default_Vert_noMVP.js":"ccShader_Default_Vert_noMVP","../Shaders/ccShader_Effect05_Frag.js":"ccShader_Effect05_Frag"}],"Effect06":[function(require,module,exports){
"use strict";
cc._RFpush(module, '5e56b8BKmdKM7oODuKkTyWe', 'Effect06');
// Script/Effect06.js

var _default_vert = require("../Shaders/ccShader_Default_Vert.js");
var _default_vert_no_mvp = require("../Shaders/ccShader_Default_Vert_noMVP.js");
var _glass_frag = require("../Shaders/ccShader_Effect06_Frag.js");

cc.Class({
    "extends": cc.Component,

    properties: {
        glassFactor: 1.0
    },

    onLoad: function onLoad() {
        this.parameters = {
            startTime: Date.now(),
            time: 0.0,
            mouse: {
                x: 0.0,
                y: 0.0
            },
            resolution: {
                x: 0.0,
                y: 0.0
            }

        };
        this.node.on(cc.Node.EventType.MOUSE_MOVE, function (event) {
            this.parameters.mouse.x = this.node.getContentSize().width / event.getLocationX();
            this.parameters.mouse.y = this.node.getContentSize().height / event.getLocationY();
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            this.parameters.mouse.x = this.node.getContentSize().width / event.getLocationX();
            this.parameters.mouse.y = this.node.getContentSize().height / event.getLocationY();
        }, this);

        this._use();
    },
    update: function update(dt) {
        if (this.glassFactor >= 40) {
            this.glassFactor = 0;
        }
        this.glassFactor += dt * 3;

        if (this._program) {

            this._program.use();
            this.updateGLParameters();
            if (cc.sys.isNative) {
                var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this._program);
                glProgram_state.setUniformVec2("resolution", this.parameters.resolution);
                glProgram_state.setUniformFloat("time", this.parameters.time);
                glProgram_state.setUniformVec2("mouse", this.parameters.mouse);
            } else {
                this._program.setUniformLocationWith2f(this._resolution, this.parameters.resolution.x, this.parameters.resolution.y);
                this._program.setUniformLocationWith1f(this._time, this.parameters.time);
                this._program.setUniformLocationWith2f(this._mouse, this.parameters.mouse.x, this.parameters.mouse.x);
            }
        }
    },
    updateGLParameters: function updateGLParameters() {
        this.parameters.time = (Date.now() - this.parameters.startTime) / 1000;
        this.parameters.resolution.x = this.node.getContentSize().width;
        this.parameters.resolution.y = this.node.getContentSize().height;
    },

    _use: function _use() {

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
        } else {
            this._program = new cc.GLProgram();
            this._program.initWithVertexShaderByteArray(_default_vert, _glass_frag);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);

            this._program.link();
            this._program.updateUniforms();
            this._program.use();

            this.updateGLParameters();

            this._program.setUniformLocationWith1f(this._program.getUniformLocationForName('time'), this.parameters.time);
            this._program.setUniformLocationWith2f(this._program.getUniformLocationForName('mouse'), this.parameters.mouse.x, this.parameters.mouse.y);
            this._program.setUniformLocationWith2f(this._program.getUniformLocationForName('resolution'), this.parameters.resolution.x, this.parameters.resolution.y);
        }

        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this._program);
            glProgram_state.setUniformVec2("resolution", this.parameters.resolution);
            glProgram_state.setUniformFloat("time", this.parameters.time);
            glProgram_state.setUniformVec2("mouse", this.parameters.mouse);
        } else {

            this._resolution = this._program.getUniformLocationForName("resolution");
            this._time = this._program.getUniformLocationForName("time");
            this._mouse = this._program.getUniformLocationForName("mouse");

            this._program.setUniformLocationWith2f(this._resolution, this.parameters.resolution.x, this.parameters.resolution.y);
            this._program.setUniformLocationWith1f(this._time, this.parameters.time);
            this._program.setUniformLocationWith2f(this._mouse, this.parameters.mouse.x, this.parameters.mouse.y);
        }

        this.setProgram(this.node._sgNode, this._program);
    },

    setProgram: function setProgram(node, program) {
        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(program);
            node.setGLProgramState(glProgram_state);
        } else {
            node.setShaderProgram(program);
        }

        var children = node.children;
        if (!children) return;

        for (var i = 0; i < children.length; i++) this.setProgram(children[i], program);
    }

});

cc._RFpop();
},{"../Shaders/ccShader_Default_Vert.js":"ccShader_Default_Vert","../Shaders/ccShader_Default_Vert_noMVP.js":"ccShader_Default_Vert_noMVP","../Shaders/ccShader_Effect06_Frag.js":"ccShader_Effect06_Frag"}],"Effect07":[function(require,module,exports){
"use strict";
cc._RFpush(module, '7be053+GGBArIrzaFkYCT1g', 'Effect07');
// Script/Effect07.js

var _default_vert = require("../Shaders/ccShader_Default_Vert.js");
var _default_vert_no_mvp = require("../Shaders/ccShader_Default_Vert_noMVP.js");
var _glass_frag = require("../Shaders/ccShader_Effect04_Frag.js");

cc.Class({
    "extends": cc.Component,

    properties: {
        glassFactor: 1.0,
        flagShader: "precision mediump float; uniform float time; uniform vec2 mouse; uniform vec2 resolution; const int numBlobs = 128; void main( void ) {     vec2 p = (gl_FragCoord.xy / resolution.x) - vec2(0.5, 0.5 * (resolution.y / resolution.x));     vec3 c = vec3(0.0);     for (int i=0; i<numBlobs; i++)  {       float px = sin(float(i)*0.1 + 0.5) * 0.4;       float py = sin(float(i*i)*0.01 + 0.4*time) * 0.2;       float pz = sin(float(i*i*i)*0.001 + 0.3*time) * 0.3 + 0.4;      float radius = 0.005 / pz;      vec2 pos = p + vec2(px, py);        float z = radius - length(pos);         if (z < 0.0) z = 0.0;       float cc = z / radius;      c += vec3(cc * (sin(float(i*i*i)) * 0.5 + 0.5), cc * (sin(float(i*i*i*i*i)) * 0.5 + 0.5), cc * (sin(float(i*i*i*i)) * 0.5 + 0.5));  }   gl_FragColor = vec4(c.x+p.y, c.y+p.y, c.z+p.y, 1.0); }"
    },

    onLoad: function onLoad() {
        this.parameters = {
            startTime: Date.now(),
            time: 0.0,
            mouse: {
                x: 0.0,
                y: 0.0
            },
            resolution: {
                x: 0.0,
                y: 0.0
            }

        };
        this.node.on(cc.Node.EventType.MOUSE_MOVE, function (event) {
            this.parameters.mouse.x = this.node.getContentSize().width / event.getLocationX();
            this.parameters.mouse.y = this.node.getContentSize().height / event.getLocationY();
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            this.parameters.mouse.x = this.node.getContentSize().width / event.getLocationX();
            this.parameters.mouse.y = this.node.getContentSize().height / event.getLocationY();
        }, this);

        this._use();
    },
    update: function update(dt) {
        if (this.glassFactor >= 40) {
            this.glassFactor = 0;
        }
        this.glassFactor += dt * 3;

        if (this._program) {

            this._program.use();
            this.updateGLParameters();
            if (cc.sys.isNative) {
                var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this._program);
                glProgram_state.setUniformVec2("resolution", this.parameters.resolution);
                glProgram_state.setUniformFloat("time", this.parameters.time);
                glProgram_state.setUniformVec2("mouse_touch", this.parameters.mouse);
            } else {
                this._program.setUniformLocationWith2f(this._resolution, this.parameters.resolution.x, this.parameters.resolution.y);
                this._program.setUniformLocationWith1f(this._time, this.parameters.time);
                this._program.setUniformLocationWith2f(this._mouse, this.parameters.mouse.x, this.parameters.mouse.x);
            }
        }
    },
    updateGLParameters: function updateGLParameters() {
        this.parameters.time = (Date.now() - this.parameters.startTime) / 1000;
        this.parameters.resolution.x = this.node.getContentSize().width;
        this.parameters.resolution.y = this.node.getContentSize().height;
    },

    _use: function _use() {

        if (cc.sys.isNative) {
            cc.log("use native GLProgram");
            this._program = new cc.GLProgram();
            this._program.initWithString(_default_vert_no_mvp, this.flagShader);

            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);

            this._program.link();
            this._program.updateUniforms();
            this.updateGLParameters();
        } else {
            this._program = new cc.GLProgram();
            this._program.initWithVertexShaderByteArray(_default_vert, this.flagShader);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);

            this._program.link();
            this._program.updateUniforms();
            this._program.use();

            this.updateGLParameters();

            this._program.setUniformLocationWith1f(this._program.getUniformLocationForName('time'), this.parameters.time);
            this._program.setUniformLocationWith2f(this._program.getUniformLocationForName('mouse_touch'), this.parameters.mouse.x, this.parameters.mouse.y);
            this._program.setUniformLocationWith2f(this._program.getUniformLocationForName('resolution'), this.parameters.resolution.x, this.parameters.resolution.y);
        }

        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this._program);
            glProgram_state.setUniformVec2("resolution", this.parameters.resolution);
            glProgram_state.setUniformFloat("time", this.parameters.time);
            glProgram_state.setUniformVec2("mouse_touch", this.parameters.mouse);
        } else {

            this._resolution = this._program.getUniformLocationForName("resolution");
            this._time = this._program.getUniformLocationForName("time");
            this._mouse = this._program.getUniformLocationForName("mouse_touch");

            this._program.setUniformLocationWith2f(this._resolution, this.parameters.resolution.x, this.parameters.resolution.y);
            this._program.setUniformLocationWith1f(this._time, this.parameters.time);
            this._program.setUniformLocationWith2f(this._mouse, this.parameters.mouse.x, this.parameters.mouse.y);
        }

        this.setProgram(this.node._sgNode, this._program);
    },

    setProgram: function setProgram(node, program) {
        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(program);
            node.setGLProgramState(glProgram_state);
        } else {
            node.setShaderProgram(program);
        }

        var children = node.children;
        if (!children) return;

        for (var i = 0; i < children.length; i++) this.setProgram(children[i], program);
    }

});

cc._RFpop();
},{"../Shaders/ccShader_Default_Vert.js":"ccShader_Default_Vert","../Shaders/ccShader_Default_Vert_noMVP.js":"ccShader_Default_Vert_noMVP","../Shaders/ccShader_Effect04_Frag.js":"ccShader_Effect04_Frag"}],"Effect08":[function(require,module,exports){
"use strict";
cc._RFpush(module, '8566euEB59ICqF3+GJzO5U1', 'Effect08');
// Script/Effect08.js

var _default_vert = require("../Shaders/ccShader_Default_Vert.js");
var _default_vert_no_mvp = require("../Shaders/ccShader_Default_Vert_noMVP.js");
var _glass_frag = require("../Shaders/ccShader_Effect04_Frag.js");

cc.Class({
    "extends": cc.Component,

    properties: {
        glassFactor: 1.0
    },

    onLoad: function onLoad() {
        this.parameters = {
            startTime: Date.now(),
            time: 0.0,
            mouse: {
                x: 0.0,
                y: 0.0
            },
            resolution: {
                x: 0.0,
                y: 0.0
            }

        };
        this.node.on(cc.Node.EventType.MOUSE_MOVE, function (event) {
            this.parameters.mouse.x = this.node.getContentSize().width / event.getLocationX();
            this.parameters.mouse.y = this.node.getContentSize().height / event.getLocationY();
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            this.parameters.mouse.x = this.node.getContentSize().width / event.getLocationX();
            this.parameters.mouse.y = this.node.getContentSize().height / event.getLocationY();
        }, this);

        this._use();
    },
    update: function update(dt) {
        if (this.glassFactor >= 40) {
            this.glassFactor = 0;
        }
        this.glassFactor += dt * 3;

        if (this._program) {

            this._program.use();
            this.updateGLParameters();
            if (cc.sys.isNative) {
                var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this._program);
                glProgram_state.setUniformVec2("resolution", this.parameters.resolution);
                glProgram_state.setUniformFloat("time", this.parameters.time);
                glProgram_state.setUniformVec2("mouse_touch", this.parameters.mouse);
            } else {
                this._program.setUniformLocationWith2f(this._resolution, this.parameters.resolution.x, this.parameters.resolution.y);
                this._program.setUniformLocationWith1f(this._time, this.parameters.time);
                this._program.setUniformLocationWith2f(this._mouse, this.parameters.mouse.x, this.parameters.mouse.x);
            }
        }
    },
    updateGLParameters: function updateGLParameters() {
        this.parameters.time = (Date.now() - this.parameters.startTime) / 1000;
        this.parameters.resolution.x = this.node.getContentSize().width;
        this.parameters.resolution.y = this.node.getContentSize().height;
    },

    _use: function _use() {

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
        } else {
            this._program = new cc.GLProgram();
            this._program.initWithVertexShaderByteArray(_default_vert, _glass_frag);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);

            this._program.link();
            this._program.updateUniforms();
            this._program.use();

            this.updateGLParameters();

            this._program.setUniformLocationWith1f(this._program.getUniformLocationForName('time'), this.parameters.time);
            this._program.setUniformLocationWith2f(this._program.getUniformLocationForName('mouse_touch'), this.parameters.mouse.x, this.parameters.mouse.y);
            this._program.setUniformLocationWith2f(this._program.getUniformLocationForName('resolution'), this.parameters.resolution.x, this.parameters.resolution.y);
        }

        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this._program);
            glProgram_state.setUniformVec2("resolution", this.parameters.resolution);
            glProgram_state.setUniformFloat("time", this.parameters.time);
            glProgram_state.setUniformVec2("mouse_touch", this.parameters.mouse);
        } else {

            this._resolution = this._program.getUniformLocationForName("resolution");
            this._time = this._program.getUniformLocationForName("time");
            this._mouse = this._program.getUniformLocationForName("mouse_touch");

            this._program.setUniformLocationWith2f(this._resolution, this.parameters.resolution.x, this.parameters.resolution.y);
            this._program.setUniformLocationWith1f(this._time, this.parameters.time);
            this._program.setUniformLocationWith2f(this._mouse, this.parameters.mouse.x, this.parameters.mouse.y);
        }

        this.setProgram(this.node._sgNode, this._program);
    },

    setProgram: function setProgram(node, program) {
        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(program);
            node.setGLProgramState(glProgram_state);
        } else {
            node.setShaderProgram(program);
        }

        var children = node.children;
        if (!children) return;

        for (var i = 0; i < children.length; i++) this.setProgram(children[i], program);
    }

});

cc._RFpop();
},{"../Shaders/ccShader_Default_Vert.js":"ccShader_Default_Vert","../Shaders/ccShader_Default_Vert_noMVP.js":"ccShader_Default_Vert_noMVP","../Shaders/ccShader_Effect04_Frag.js":"ccShader_Effect04_Frag"}],"Effect09":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'f9799Hx7opAypy8/hkaFJBa', 'Effect09');
// Script/Effect09.js

var _default_vert = require("../Shaders/ccShader_Default_Vert.js");
var _default_vert_no_mvp = require("../Shaders/ccShader_Default_Vert_noMVP.js");
var _glass_frag = require("../Shaders/ccShader_Effect04_Frag.js");

cc.Class({
    "extends": cc.Component,

    properties: {
        glassFactor: 1.0
    },

    onLoad: function onLoad() {
        this.parameters = {
            startTime: Date.now(),
            time: 0.0,
            mouse: {
                x: 0.0,
                y: 0.0
            },
            resolution: {
                x: 0.0,
                y: 0.0
            }

        };
        this.node.on(cc.Node.EventType.MOUSE_MOVE, function (event) {
            this.parameters.mouse.x = this.node.getContentSize().width / event.getLocationX();
            this.parameters.mouse.y = this.node.getContentSize().height / event.getLocationY();
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            this.parameters.mouse.x = this.node.getContentSize().width / event.getLocationX();
            this.parameters.mouse.y = this.node.getContentSize().height / event.getLocationY();
        }, this);

        this._use();
    },
    update: function update(dt) {
        if (this.glassFactor >= 40) {
            this.glassFactor = 0;
        }
        this.glassFactor += dt * 3;

        if (this._program) {

            this._program.use();
            this.updateGLParameters();
            if (cc.sys.isNative) {
                var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this._program);
                glProgram_state.setUniformVec2("resolution", this.parameters.resolution);
                glProgram_state.setUniformFloat("time", this.parameters.time);
                glProgram_state.setUniformVec2("mouse_touch", this.parameters.mouse);
            } else {
                this._program.setUniformLocationWith2f(this._resolution, this.parameters.resolution.x, this.parameters.resolution.y);
                this._program.setUniformLocationWith1f(this._time, this.parameters.time);
                this._program.setUniformLocationWith2f(this._mouse, this.parameters.mouse.x, this.parameters.mouse.x);
            }
        }
    },
    updateGLParameters: function updateGLParameters() {
        this.parameters.time = (Date.now() - this.parameters.startTime) / 1000;
        this.parameters.resolution.x = this.node.getContentSize().width;
        this.parameters.resolution.y = this.node.getContentSize().height;
    },

    _use: function _use() {

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
        } else {
            this._program = new cc.GLProgram();
            this._program.initWithVertexShaderByteArray(_default_vert, _glass_frag);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);

            this._program.link();
            this._program.updateUniforms();
            this._program.use();

            this.updateGLParameters();

            this._program.setUniformLocationWith1f(this._program.getUniformLocationForName('time'), this.parameters.time);
            this._program.setUniformLocationWith2f(this._program.getUniformLocationForName('mouse_touch'), this.parameters.mouse.x, this.parameters.mouse.y);
            this._program.setUniformLocationWith2f(this._program.getUniformLocationForName('resolution'), this.parameters.resolution.x, this.parameters.resolution.y);
        }

        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this._program);
            glProgram_state.setUniformVec2("resolution", this.parameters.resolution);
            glProgram_state.setUniformFloat("time", this.parameters.time);
            glProgram_state.setUniformVec2("mouse_touch", this.parameters.mouse);
        } else {

            this._resolution = this._program.getUniformLocationForName("resolution");
            this._time = this._program.getUniformLocationForName("time");
            this._mouse = this._program.getUniformLocationForName("mouse_touch");

            this._program.setUniformLocationWith2f(this._resolution, this.parameters.resolution.x, this.parameters.resolution.y);
            this._program.setUniformLocationWith1f(this._time, this.parameters.time);
            this._program.setUniformLocationWith2f(this._mouse, this.parameters.mouse.x, this.parameters.mouse.y);
        }

        this.setProgram(this.node._sgNode, this._program);
    },

    setProgram: function setProgram(node, program) {
        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(program);
            node.setGLProgramState(glProgram_state);
        } else {
            node.setShaderProgram(program);
        }

        var children = node.children;
        if (!children) return;

        for (var i = 0; i < children.length; i++) this.setProgram(children[i], program);
    }

});

cc._RFpop();
},{"../Shaders/ccShader_Default_Vert.js":"ccShader_Default_Vert","../Shaders/ccShader_Default_Vert_noMVP.js":"ccShader_Default_Vert_noMVP","../Shaders/ccShader_Effect04_Frag.js":"ccShader_Effect04_Frag"}],"Effect10":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'c4418obREBFDISfSiPipC5Y', 'Effect10');
// Script/Effect10.js

var _default_vert = require("../Shaders/ccShader_Default_Vert.js");
var _default_vert_no_mvp = require("../Shaders/ccShader_Default_Vert_noMVP.js");
var _glass_frag = require("../Shaders/ccShader_Effect04_Frag.js");

cc.Class({
    "extends": cc.Component,

    properties: {
        glassFactor: 1.0
    },

    onLoad: function onLoad() {
        this.parameters = {
            startTime: Date.now(),
            time: 0.0,
            mouse: {
                x: 0.0,
                y: 0.0
            },
            resolution: {
                x: 0.0,
                y: 0.0
            }

        };
        this.node.on(cc.Node.EventType.MOUSE_MOVE, function (event) {
            this.parameters.mouse.x = this.node.getContentSize().width / event.getLocationX();
            this.parameters.mouse.y = this.node.getContentSize().height / event.getLocationY();
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            this.parameters.mouse.x = this.node.getContentSize().width / event.getLocationX();
            this.parameters.mouse.y = this.node.getContentSize().height / event.getLocationY();
        }, this);

        this._use();
    },
    update: function update(dt) {
        if (this.glassFactor >= 40) {
            this.glassFactor = 0;
        }
        this.glassFactor += dt * 3;

        if (this._program) {

            this._program.use();
            this.updateGLParameters();
            if (cc.sys.isNative) {
                var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this._program);
                glProgram_state.setUniformVec2("resolution", this.parameters.resolution);
                glProgram_state.setUniformFloat("time", this.parameters.time);
                glProgram_state.setUniformVec2("mouse_touch", this.parameters.mouse);
            } else {
                this._program.setUniformLocationWith2f(this._resolution, this.parameters.resolution.x, this.parameters.resolution.y);
                this._program.setUniformLocationWith1f(this._time, this.parameters.time);
                this._program.setUniformLocationWith2f(this._mouse, this.parameters.mouse.x, this.parameters.mouse.x);
            }
        }
    },
    updateGLParameters: function updateGLParameters() {
        this.parameters.time = (Date.now() - this.parameters.startTime) / 1000;
        this.parameters.resolution.x = this.node.getContentSize().width;
        this.parameters.resolution.y = this.node.getContentSize().height;
    },

    _use: function _use() {

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
        } else {
            this._program = new cc.GLProgram();
            this._program.initWithVertexShaderByteArray(_default_vert, _glass_frag);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);

            this._program.link();
            this._program.updateUniforms();
            this._program.use();

            this.updateGLParameters();

            this._program.setUniformLocationWith1f(this._program.getUniformLocationForName('time'), this.parameters.time);
            this._program.setUniformLocationWith2f(this._program.getUniformLocationForName('mouse_touch'), this.parameters.mouse.x, this.parameters.mouse.y);
            this._program.setUniformLocationWith2f(this._program.getUniformLocationForName('resolution'), this.parameters.resolution.x, this.parameters.resolution.y);
        }

        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this._program);
            glProgram_state.setUniformVec2("resolution", this.parameters.resolution);
            glProgram_state.setUniformFloat("time", this.parameters.time);
            glProgram_state.setUniformVec2("mouse_touch", this.parameters.mouse);
        } else {

            this._resolution = this._program.getUniformLocationForName("resolution");
            this._time = this._program.getUniformLocationForName("time");
            this._mouse = this._program.getUniformLocationForName("mouse_touch");

            this._program.setUniformLocationWith2f(this._resolution, this.parameters.resolution.x, this.parameters.resolution.y);
            this._program.setUniformLocationWith1f(this._time, this.parameters.time);
            this._program.setUniformLocationWith2f(this._mouse, this.parameters.mouse.x, this.parameters.mouse.y);
        }

        this.setProgram(this.node._sgNode, this._program);
    },

    setProgram: function setProgram(node, program) {
        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(program);
            node.setGLProgramState(glProgram_state);
        } else {
            node.setShaderProgram(program);
        }

        var children = node.children;
        if (!children) return;

        for (var i = 0; i < children.length; i++) this.setProgram(children[i], program);
    }

});

cc._RFpop();
},{"../Shaders/ccShader_Default_Vert.js":"ccShader_Default_Vert","../Shaders/ccShader_Default_Vert_noMVP.js":"ccShader_Default_Vert_noMVP","../Shaders/ccShader_Effect04_Frag.js":"ccShader_Effect04_Frag"}],"Effect11":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'bc2aeaH4SpA/Je4Z0UR3SNg', 'Effect11');
// Script/Effect11.js

var _default_vert = require("../Shaders/ccShader_Default_Vert.js");
var _default_vert_no_mvp = require("../Shaders/ccShader_Default_Vert_noMVP.js");
var _glass_frag = require("../Shaders/ccShader_Effect04_Frag.js");

cc.Class({
    "extends": cc.Component,

    properties: {
        glassFactor: 1.0
    },

    onLoad: function onLoad() {
        this.parameters = {
            startTime: Date.now(),
            time: 0.0,
            mouse: {
                x: 0.0,
                y: 0.0
            },
            resolution: {
                x: 0.0,
                y: 0.0
            }

        };
        this.node.on(cc.Node.EventType.MOUSE_MOVE, function (event) {
            this.parameters.mouse.x = this.node.getContentSize().width / event.getLocationX();
            this.parameters.mouse.y = this.node.getContentSize().height / event.getLocationY();
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            this.parameters.mouse.x = this.node.getContentSize().width / event.getLocationX();
            this.parameters.mouse.y = this.node.getContentSize().height / event.getLocationY();
        }, this);

        this._use();
    },
    update: function update(dt) {
        if (this.glassFactor >= 40) {
            this.glassFactor = 0;
        }
        this.glassFactor += dt * 3;

        if (this._program) {

            this._program.use();
            this.updateGLParameters();
            if (cc.sys.isNative) {
                var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this._program);
                glProgram_state.setUniformVec2("resolution", this.parameters.resolution);
                glProgram_state.setUniformFloat("time", this.parameters.time);
                glProgram_state.setUniformVec2("mouse_touch", this.parameters.mouse);
            } else {
                this._program.setUniformLocationWith2f(this._resolution, this.parameters.resolution.x, this.parameters.resolution.y);
                this._program.setUniformLocationWith1f(this._time, this.parameters.time);
                this._program.setUniformLocationWith2f(this._mouse, this.parameters.mouse.x, this.parameters.mouse.x);
            }
        }
    },
    updateGLParameters: function updateGLParameters() {
        this.parameters.time = (Date.now() - this.parameters.startTime) / 1000;
        this.parameters.resolution.x = this.node.getContentSize().width;
        this.parameters.resolution.y = this.node.getContentSize().height;
    },

    _use: function _use() {

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
        } else {
            this._program = new cc.GLProgram();
            this._program.initWithVertexShaderByteArray(_default_vert, _glass_frag);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);

            this._program.link();
            this._program.updateUniforms();
            this._program.use();

            this.updateGLParameters();

            this._program.setUniformLocationWith1f(this._program.getUniformLocationForName('time'), this.parameters.time);
            this._program.setUniformLocationWith2f(this._program.getUniformLocationForName('mouse_touch'), this.parameters.mouse.x, this.parameters.mouse.y);
            this._program.setUniformLocationWith2f(this._program.getUniformLocationForName('resolution'), this.parameters.resolution.x, this.parameters.resolution.y);
        }

        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this._program);
            glProgram_state.setUniformVec2("resolution", this.parameters.resolution);
            glProgram_state.setUniformFloat("time", this.parameters.time);
            glProgram_state.setUniformVec2("mouse_touch", this.parameters.mouse);
        } else {

            this._resolution = this._program.getUniformLocationForName("resolution");
            this._time = this._program.getUniformLocationForName("time");
            this._mouse = this._program.getUniformLocationForName("mouse_touch");

            this._program.setUniformLocationWith2f(this._resolution, this.parameters.resolution.x, this.parameters.resolution.y);
            this._program.setUniformLocationWith1f(this._time, this.parameters.time);
            this._program.setUniformLocationWith2f(this._mouse, this.parameters.mouse.x, this.parameters.mouse.y);
        }

        this.setProgram(this.node._sgNode, this._program);
    },

    setProgram: function setProgram(node, program) {
        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(program);
            node.setGLProgramState(glProgram_state);
        } else {
            node.setShaderProgram(program);
        }

        var children = node.children;
        if (!children) return;

        for (var i = 0; i < children.length; i++) this.setProgram(children[i], program);
    }

});

cc._RFpop();
},{"../Shaders/ccShader_Default_Vert.js":"ccShader_Default_Vert","../Shaders/ccShader_Default_Vert_noMVP.js":"ccShader_Default_Vert_noMVP","../Shaders/ccShader_Effect04_Frag.js":"ccShader_Effect04_Frag"}],"Effect12":[function(require,module,exports){
"use strict";
cc._RFpush(module, '2017elv6j9FoKPvaM2U2k73', 'Effect12');
// Script/Effect12.js

var _default_vert = require("../Shaders/ccShader_Default_Vert.js");
var _default_vert_no_mvp = require("../Shaders/ccShader_Default_Vert_noMVP.js");
var _glass_frag = require("../Shaders/ccShader_Effect04_Frag.js");

cc.Class({
    "extends": cc.Component,

    properties: {
        glassFactor: 1.0
    },

    onLoad: function onLoad() {
        this.parameters = {
            startTime: Date.now(),
            time: 0.0,
            mouse: {
                x: 0.0,
                y: 0.0
            },
            resolution: {
                x: 0.0,
                y: 0.0
            }

        };
        this.node.on(cc.Node.EventType.MOUSE_MOVE, function (event) {
            this.parameters.mouse.x = this.node.getContentSize().width / event.getLocationX();
            this.parameters.mouse.y = this.node.getContentSize().height / event.getLocationY();
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            this.parameters.mouse.x = this.node.getContentSize().width / event.getLocationX();
            this.parameters.mouse.y = this.node.getContentSize().height / event.getLocationY();
        }, this);

        this._use();
    },
    update: function update(dt) {
        if (this.glassFactor >= 40) {
            this.glassFactor = 0;
        }
        this.glassFactor += dt * 3;

        if (this._program) {

            this._program.use();
            this.updateGLParameters();
            if (cc.sys.isNative) {
                var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this._program);
                glProgram_state.setUniformVec2("resolution", this.parameters.resolution);
                glProgram_state.setUniformFloat("time", this.parameters.time);
                glProgram_state.setUniformVec2("mouse_touch", this.parameters.mouse);
            } else {
                this._program.setUniformLocationWith2f(this._resolution, this.parameters.resolution.x, this.parameters.resolution.y);
                this._program.setUniformLocationWith1f(this._time, this.parameters.time);
                this._program.setUniformLocationWith2f(this._mouse, this.parameters.mouse.x, this.parameters.mouse.x);
            }
        }
    },
    updateGLParameters: function updateGLParameters() {
        this.parameters.time = (Date.now() - this.parameters.startTime) / 1000;
        this.parameters.resolution.x = this.node.getContentSize().width;
        this.parameters.resolution.y = this.node.getContentSize().height;
    },

    _use: function _use() {

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
        } else {
            this._program = new cc.GLProgram();
            this._program.initWithVertexShaderByteArray(_default_vert, _glass_frag);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);

            this._program.link();
            this._program.updateUniforms();
            this._program.use();

            this.updateGLParameters();

            this._program.setUniformLocationWith1f(this._program.getUniformLocationForName('time'), this.parameters.time);
            this._program.setUniformLocationWith2f(this._program.getUniformLocationForName('mouse_touch'), this.parameters.mouse.x, this.parameters.mouse.y);
            this._program.setUniformLocationWith2f(this._program.getUniformLocationForName('resolution'), this.parameters.resolution.x, this.parameters.resolution.y);
        }

        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this._program);
            glProgram_state.setUniformVec2("resolution", this.parameters.resolution);
            glProgram_state.setUniformFloat("time", this.parameters.time);
            glProgram_state.setUniformVec2("mouse_touch", this.parameters.mouse);
        } else {

            this._resolution = this._program.getUniformLocationForName("resolution");
            this._time = this._program.getUniformLocationForName("time");
            this._mouse = this._program.getUniformLocationForName("mouse_touch");

            this._program.setUniformLocationWith2f(this._resolution, this.parameters.resolution.x, this.parameters.resolution.y);
            this._program.setUniformLocationWith1f(this._time, this.parameters.time);
            this._program.setUniformLocationWith2f(this._mouse, this.parameters.mouse.x, this.parameters.mouse.y);
        }

        this.setProgram(this.node._sgNode, this._program);
    },

    setProgram: function setProgram(node, program) {
        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(program);
            node.setGLProgramState(glProgram_state);
        } else {
            node.setShaderProgram(program);
        }

        var children = node.children;
        if (!children) return;

        for (var i = 0; i < children.length; i++) this.setProgram(children[i], program);
    }

});

cc._RFpop();
},{"../Shaders/ccShader_Default_Vert.js":"ccShader_Default_Vert","../Shaders/ccShader_Default_Vert_noMVP.js":"ccShader_Default_Vert_noMVP","../Shaders/ccShader_Effect04_Frag.js":"ccShader_Effect04_Frag"}],"Effect13":[function(require,module,exports){
"use strict";
cc._RFpush(module, '1a276nWh65E7YrOKIc8cWMG', 'Effect13');
// Script/Effect13.js

var _default_vert = require("../Shaders/ccShader_Default_Vert.js");
var _default_vert_no_mvp = require("../Shaders/ccShader_Default_Vert_noMVP.js");
var _glass_frag = require("../Shaders/ccShader_Effect04_Frag.js");

cc.Class({
    "extends": cc.Component,

    properties: {
        glassFactor: 1.0
    },

    onLoad: function onLoad() {
        this.parameters = {
            startTime: Date.now(),
            time: 0.0,
            mouse: {
                x: 0.0,
                y: 0.0
            },
            resolution: {
                x: 0.0,
                y: 0.0
            }

        };
        this.node.on(cc.Node.EventType.MOUSE_MOVE, function (event) {
            this.parameters.mouse.x = this.node.getContentSize().width / event.getLocationX();
            this.parameters.mouse.y = this.node.getContentSize().height / event.getLocationY();
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            this.parameters.mouse.x = this.node.getContentSize().width / event.getLocationX();
            this.parameters.mouse.y = this.node.getContentSize().height / event.getLocationY();
        }, this);

        this._use();
    },
    update: function update(dt) {
        if (this.glassFactor >= 40) {
            this.glassFactor = 0;
        }
        this.glassFactor += dt * 3;

        if (this._program) {

            this._program.use();
            this.updateGLParameters();
            if (cc.sys.isNative) {
                var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this._program);
                glProgram_state.setUniformVec2("resolution", this.parameters.resolution);
                glProgram_state.setUniformFloat("time", this.parameters.time);
                glProgram_state.setUniformVec2("mouse_touch", this.parameters.mouse);
            } else {
                this._program.setUniformLocationWith2f(this._resolution, this.parameters.resolution.x, this.parameters.resolution.y);
                this._program.setUniformLocationWith1f(this._time, this.parameters.time);
                this._program.setUniformLocationWith2f(this._mouse, this.parameters.mouse.x, this.parameters.mouse.x);
            }
        }
    },
    updateGLParameters: function updateGLParameters() {
        this.parameters.time = (Date.now() - this.parameters.startTime) / 1000;
        this.parameters.resolution.x = this.node.getContentSize().width;
        this.parameters.resolution.y = this.node.getContentSize().height;
    },

    _use: function _use() {

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
        } else {
            this._program = new cc.GLProgram();
            this._program.initWithVertexShaderByteArray(_default_vert, _glass_frag);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);

            this._program.link();
            this._program.updateUniforms();
            this._program.use();

            this.updateGLParameters();

            this._program.setUniformLocationWith1f(this._program.getUniformLocationForName('time'), this.parameters.time);
            this._program.setUniformLocationWith2f(this._program.getUniformLocationForName('mouse_touch'), this.parameters.mouse.x, this.parameters.mouse.y);
            this._program.setUniformLocationWith2f(this._program.getUniformLocationForName('resolution'), this.parameters.resolution.x, this.parameters.resolution.y);
        }

        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this._program);
            glProgram_state.setUniformVec2("resolution", this.parameters.resolution);
            glProgram_state.setUniformFloat("time", this.parameters.time);
            glProgram_state.setUniformVec2("mouse_touch", this.parameters.mouse);
        } else {

            this._resolution = this._program.getUniformLocationForName("resolution");
            this._time = this._program.getUniformLocationForName("time");
            this._mouse = this._program.getUniformLocationForName("mouse_touch");

            this._program.setUniformLocationWith2f(this._resolution, this.parameters.resolution.x, this.parameters.resolution.y);
            this._program.setUniformLocationWith1f(this._time, this.parameters.time);
            this._program.setUniformLocationWith2f(this._mouse, this.parameters.mouse.x, this.parameters.mouse.y);
        }

        this.setProgram(this.node._sgNode, this._program);
    },

    setProgram: function setProgram(node, program) {
        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(program);
            node.setGLProgramState(glProgram_state);
        } else {
            node.setShaderProgram(program);
        }

        var children = node.children;
        if (!children) return;

        for (var i = 0; i < children.length; i++) this.setProgram(children[i], program);
    }

});

cc._RFpop();
},{"../Shaders/ccShader_Default_Vert.js":"ccShader_Default_Vert","../Shaders/ccShader_Default_Vert_noMVP.js":"ccShader_Default_Vert_noMVP","../Shaders/ccShader_Effect04_Frag.js":"ccShader_Effect04_Frag"}],"Effect14":[function(require,module,exports){
"use strict";
cc._RFpush(module, '559ebbNwO1AGKpsesEO8r9x', 'Effect14');
// Script/Effect14.js

var _default_vert = require("../Shaders/ccShader_Default_Vert.js");
var _default_vert_no_mvp = require("../Shaders/ccShader_Default_Vert_noMVP.js");
var _glass_frag = require("../Shaders/ccShader_Effect04_Frag.js");

cc.Class({
    "extends": cc.Component,

    properties: {
        glassFactor: 1.0
    },

    onLoad: function onLoad() {
        this.parameters = {
            startTime: Date.now(),
            time: 0.0,
            mouse: {
                x: 0.0,
                y: 0.0
            },
            resolution: {
                x: 0.0,
                y: 0.0
            }

        };
        this.node.on(cc.Node.EventType.MOUSE_MOVE, function (event) {
            this.parameters.mouse.x = this.node.getContentSize().width / event.getLocationX();
            this.parameters.mouse.y = this.node.getContentSize().height / event.getLocationY();
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            this.parameters.mouse.x = this.node.getContentSize().width / event.getLocationX();
            this.parameters.mouse.y = this.node.getContentSize().height / event.getLocationY();
        }, this);

        this._use();
    },
    update: function update(dt) {
        if (this.glassFactor >= 40) {
            this.glassFactor = 0;
        }
        this.glassFactor += dt * 3;

        if (this._program) {

            this._program.use();
            this.updateGLParameters();
            if (cc.sys.isNative) {
                var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this._program);
                glProgram_state.setUniformVec2("resolution", this.parameters.resolution);
                glProgram_state.setUniformFloat("time", this.parameters.time);
                glProgram_state.setUniformVec2("mouse_touch", this.parameters.mouse);
            } else {
                this._program.setUniformLocationWith2f(this._resolution, this.parameters.resolution.x, this.parameters.resolution.y);
                this._program.setUniformLocationWith1f(this._time, this.parameters.time);
                this._program.setUniformLocationWith2f(this._mouse, this.parameters.mouse.x, this.parameters.mouse.x);
            }
        }
    },
    updateGLParameters: function updateGLParameters() {
        this.parameters.time = (Date.now() - this.parameters.startTime) / 1000;
        this.parameters.resolution.x = this.node.getContentSize().width;
        this.parameters.resolution.y = this.node.getContentSize().height;
    },

    _use: function _use() {

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
        } else {
            this._program = new cc.GLProgram();
            this._program.initWithVertexShaderByteArray(_default_vert, _glass_frag);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);

            this._program.link();
            this._program.updateUniforms();
            this._program.use();

            this.updateGLParameters();

            this._program.setUniformLocationWith1f(this._program.getUniformLocationForName('time'), this.parameters.time);
            this._program.setUniformLocationWith2f(this._program.getUniformLocationForName('mouse_touch'), this.parameters.mouse.x, this.parameters.mouse.y);
            this._program.setUniformLocationWith2f(this._program.getUniformLocationForName('resolution'), this.parameters.resolution.x, this.parameters.resolution.y);
        }

        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this._program);
            glProgram_state.setUniformVec2("resolution", this.parameters.resolution);
            glProgram_state.setUniformFloat("time", this.parameters.time);
            glProgram_state.setUniformVec2("mouse_touch", this.parameters.mouse);
        } else {

            this._resolution = this._program.getUniformLocationForName("resolution");
            this._time = this._program.getUniformLocationForName("time");
            this._mouse = this._program.getUniformLocationForName("mouse_touch");

            this._program.setUniformLocationWith2f(this._resolution, this.parameters.resolution.x, this.parameters.resolution.y);
            this._program.setUniformLocationWith1f(this._time, this.parameters.time);
            this._program.setUniformLocationWith2f(this._mouse, this.parameters.mouse.x, this.parameters.mouse.y);
        }

        this.setProgram(this.node._sgNode, this._program);
    },

    setProgram: function setProgram(node, program) {
        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(program);
            node.setGLProgramState(glProgram_state);
        } else {
            node.setShaderProgram(program);
        }

        var children = node.children;
        if (!children) return;

        for (var i = 0; i < children.length; i++) this.setProgram(children[i], program);
    }

});

cc._RFpop();
},{"../Shaders/ccShader_Default_Vert.js":"ccShader_Default_Vert","../Shaders/ccShader_Default_Vert_noMVP.js":"ccShader_Default_Vert_noMVP","../Shaders/ccShader_Effect04_Frag.js":"ccShader_Effect04_Frag"}],"Effect15":[function(require,module,exports){
"use strict";
cc._RFpush(module, '3080ckosRxFmrJOx9D9PE6X', 'Effect15');
// Script/Effect15.js

var _default_vert = require("../Shaders/ccShader_Default_Vert.js");
var _default_vert_no_mvp = require("../Shaders/ccShader_Default_Vert_noMVP.js");
var _glass_frag = require("../Shaders/ccShader_Effect04_Frag.js");

cc.Class({
    "extends": cc.Component,

    properties: {
        glassFactor: 1.0
    },

    onLoad: function onLoad() {
        this.parameters = {
            startTime: Date.now(),
            time: 0.0,
            mouse: {
                x: 0.0,
                y: 0.0
            },
            resolution: {
                x: 0.0,
                y: 0.0
            }

        };
        this.node.on(cc.Node.EventType.MOUSE_MOVE, function (event) {
            this.parameters.mouse.x = this.node.getContentSize().width / event.getLocationX();
            this.parameters.mouse.y = this.node.getContentSize().height / event.getLocationY();
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            this.parameters.mouse.x = this.node.getContentSize().width / event.getLocationX();
            this.parameters.mouse.y = this.node.getContentSize().height / event.getLocationY();
        }, this);

        this._use();
    },
    update: function update(dt) {
        if (this.glassFactor >= 40) {
            this.glassFactor = 0;
        }
        this.glassFactor += dt * 3;

        if (this._program) {

            this._program.use();
            this.updateGLParameters();
            if (cc.sys.isNative) {
                var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this._program);
                glProgram_state.setUniformVec2("resolution", this.parameters.resolution);
                glProgram_state.setUniformFloat("time", this.parameters.time);
                glProgram_state.setUniformVec2("mouse_touch", this.parameters.mouse);
            } else {
                this._program.setUniformLocationWith2f(this._resolution, this.parameters.resolution.x, this.parameters.resolution.y);
                this._program.setUniformLocationWith1f(this._time, this.parameters.time);
                this._program.setUniformLocationWith2f(this._mouse, this.parameters.mouse.x, this.parameters.mouse.x);
            }
        }
    },
    updateGLParameters: function updateGLParameters() {
        this.parameters.time = (Date.now() - this.parameters.startTime) / 1000;
        this.parameters.resolution.x = this.node.getContentSize().width;
        this.parameters.resolution.y = this.node.getContentSize().height;
    },

    _use: function _use() {

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
        } else {
            this._program = new cc.GLProgram();
            this._program.initWithVertexShaderByteArray(_default_vert, _glass_frag);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);

            this._program.link();
            this._program.updateUniforms();
            this._program.use();

            this.updateGLParameters();

            this._program.setUniformLocationWith1f(this._program.getUniformLocationForName('time'), this.parameters.time);
            this._program.setUniformLocationWith2f(this._program.getUniformLocationForName('mouse_touch'), this.parameters.mouse.x, this.parameters.mouse.y);
            this._program.setUniformLocationWith2f(this._program.getUniformLocationForName('resolution'), this.parameters.resolution.x, this.parameters.resolution.y);
        }

        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this._program);
            glProgram_state.setUniformVec2("resolution", this.parameters.resolution);
            glProgram_state.setUniformFloat("time", this.parameters.time);
            glProgram_state.setUniformVec2("mouse_touch", this.parameters.mouse);
        } else {

            this._resolution = this._program.getUniformLocationForName("resolution");
            this._time = this._program.getUniformLocationForName("time");
            this._mouse = this._program.getUniformLocationForName("mouse_touch");

            this._program.setUniformLocationWith2f(this._resolution, this.parameters.resolution.x, this.parameters.resolution.y);
            this._program.setUniformLocationWith1f(this._time, this.parameters.time);
            this._program.setUniformLocationWith2f(this._mouse, this.parameters.mouse.x, this.parameters.mouse.y);
        }

        this.setProgram(this.node._sgNode, this._program);
    },

    setProgram: function setProgram(node, program) {
        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(program);
            node.setGLProgramState(glProgram_state);
        } else {
            node.setShaderProgram(program);
        }

        var children = node.children;
        if (!children) return;

        for (var i = 0; i < children.length; i++) this.setProgram(children[i], program);
    }

});

cc._RFpop();
},{"../Shaders/ccShader_Default_Vert.js":"ccShader_Default_Vert","../Shaders/ccShader_Default_Vert_noMVP.js":"ccShader_Default_Vert_noMVP","../Shaders/ccShader_Effect04_Frag.js":"ccShader_Effect04_Frag"}],"Effect16":[function(require,module,exports){
"use strict";
cc._RFpush(module, '9d5996Mp9RCFJA91zRm9Br9', 'Effect16');
// Script/Effect16.js

var _default_vert = require("../Shaders/ccShader_Default_Vert.js");
var _default_vert_no_mvp = require("../Shaders/ccShader_Default_Vert_noMVP.js");
var _glass_frag = require("../Shaders/ccShader_Effect04_Frag.js");

cc.Class({
    "extends": cc.Component,

    properties: {
        glassFactor: 1.0
    },

    onLoad: function onLoad() {
        this.parameters = {
            startTime: Date.now(),
            time: 0.0,
            mouse: {
                x: 0.0,
                y: 0.0
            },
            resolution: {
                x: 0.0,
                y: 0.0
            }

        };
        this.node.on(cc.Node.EventType.MOUSE_MOVE, function (event) {
            this.parameters.mouse.x = this.node.getContentSize().width / event.getLocationX();
            this.parameters.mouse.y = this.node.getContentSize().height / event.getLocationY();
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            this.parameters.mouse.x = this.node.getContentSize().width / event.getLocationX();
            this.parameters.mouse.y = this.node.getContentSize().height / event.getLocationY();
        }, this);

        this._use();
    },
    update: function update(dt) {
        if (this.glassFactor >= 40) {
            this.glassFactor = 0;
        }
        this.glassFactor += dt * 3;

        if (this._program) {

            this._program.use();
            this.updateGLParameters();
            if (cc.sys.isNative) {
                var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this._program);
                glProgram_state.setUniformVec2("resolution", this.parameters.resolution);
                glProgram_state.setUniformFloat("time", this.parameters.time);
                glProgram_state.setUniformVec2("mouse_touch", this.parameters.mouse);
            } else {
                this._program.setUniformLocationWith2f(this._resolution, this.parameters.resolution.x, this.parameters.resolution.y);
                this._program.setUniformLocationWith1f(this._time, this.parameters.time);
                this._program.setUniformLocationWith2f(this._mouse, this.parameters.mouse.x, this.parameters.mouse.x);
            }
        }
    },
    updateGLParameters: function updateGLParameters() {
        this.parameters.time = (Date.now() - this.parameters.startTime) / 1000;
        this.parameters.resolution.x = this.node.getContentSize().width;
        this.parameters.resolution.y = this.node.getContentSize().height;
    },

    _use: function _use() {

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
        } else {
            this._program = new cc.GLProgram();
            this._program.initWithVertexShaderByteArray(_default_vert, _glass_frag);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);

            this._program.link();
            this._program.updateUniforms();
            this._program.use();

            this.updateGLParameters();

            this._program.setUniformLocationWith1f(this._program.getUniformLocationForName('time'), this.parameters.time);
            this._program.setUniformLocationWith2f(this._program.getUniformLocationForName('mouse_touch'), this.parameters.mouse.x, this.parameters.mouse.y);
            this._program.setUniformLocationWith2f(this._program.getUniformLocationForName('resolution'), this.parameters.resolution.x, this.parameters.resolution.y);
        }

        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this._program);
            glProgram_state.setUniformVec2("resolution", this.parameters.resolution);
            glProgram_state.setUniformFloat("time", this.parameters.time);
            glProgram_state.setUniformVec2("mouse_touch", this.parameters.mouse);
        } else {

            this._resolution = this._program.getUniformLocationForName("resolution");
            this._time = this._program.getUniformLocationForName("time");
            this._mouse = this._program.getUniformLocationForName("mouse_touch");

            this._program.setUniformLocationWith2f(this._resolution, this.parameters.resolution.x, this.parameters.resolution.y);
            this._program.setUniformLocationWith1f(this._time, this.parameters.time);
            this._program.setUniformLocationWith2f(this._mouse, this.parameters.mouse.x, this.parameters.mouse.y);
        }

        this.setProgram(this.node._sgNode, this._program);
    },

    setProgram: function setProgram(node, program) {
        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(program);
            node.setGLProgramState(glProgram_state);
        } else {
            node.setShaderProgram(program);
        }

        var children = node.children;
        if (!children) return;

        for (var i = 0; i < children.length; i++) this.setProgram(children[i], program);
    }

});

cc._RFpop();
},{"../Shaders/ccShader_Default_Vert.js":"ccShader_Default_Vert","../Shaders/ccShader_Default_Vert_noMVP.js":"ccShader_Default_Vert_noMVP","../Shaders/ccShader_Effect04_Frag.js":"ccShader_Effect04_Frag"}],"Effect17":[function(require,module,exports){
"use strict";
cc._RFpush(module, '860a8mY/kdMOLQv4R1WvnaP', 'Effect17');
// Script/Effect17.js

var _default_vert = require("../Shaders/ccShader_Default_Vert.js");
var _default_vert_no_mvp = require("../Shaders/ccShader_Default_Vert_noMVP.js");
var _glass_frag = require("../Shaders/ccShader_Effect04_Frag.js");

cc.Class({
    "extends": cc.Component,

    properties: {
        glassFactor: 1.0
    },

    onLoad: function onLoad() {
        this.parameters = {
            startTime: Date.now(),
            time: 0.0,
            mouse: {
                x: 0.0,
                y: 0.0
            },
            resolution: {
                x: 0.0,
                y: 0.0
            }

        };
        this.node.on(cc.Node.EventType.MOUSE_MOVE, function (event) {
            this.parameters.mouse.x = this.node.getContentSize().width / event.getLocationX();
            this.parameters.mouse.y = this.node.getContentSize().height / event.getLocationY();
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            this.parameters.mouse.x = this.node.getContentSize().width / event.getLocationX();
            this.parameters.mouse.y = this.node.getContentSize().height / event.getLocationY();
        }, this);

        this._use();
    },
    update: function update(dt) {
        if (this.glassFactor >= 40) {
            this.glassFactor = 0;
        }
        this.glassFactor += dt * 3;

        if (this._program) {

            this._program.use();
            this.updateGLParameters();
            if (cc.sys.isNative) {
                var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this._program);
                glProgram_state.setUniformVec2("resolution", this.parameters.resolution);
                glProgram_state.setUniformFloat("time", this.parameters.time);
                glProgram_state.setUniformVec2("mouse_touch", this.parameters.mouse);
            } else {
                this._program.setUniformLocationWith2f(this._resolution, this.parameters.resolution.x, this.parameters.resolution.y);
                this._program.setUniformLocationWith1f(this._time, this.parameters.time);
                this._program.setUniformLocationWith2f(this._mouse, this.parameters.mouse.x, this.parameters.mouse.x);
            }
        }
    },
    updateGLParameters: function updateGLParameters() {
        this.parameters.time = (Date.now() - this.parameters.startTime) / 1000;
        this.parameters.resolution.x = this.node.getContentSize().width;
        this.parameters.resolution.y = this.node.getContentSize().height;
    },

    _use: function _use() {

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
        } else {
            this._program = new cc.GLProgram();
            this._program.initWithVertexShaderByteArray(_default_vert, _glass_frag);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);

            this._program.link();
            this._program.updateUniforms();
            this._program.use();

            this.updateGLParameters();

            this._program.setUniformLocationWith1f(this._program.getUniformLocationForName('time'), this.parameters.time);
            this._program.setUniformLocationWith2f(this._program.getUniformLocationForName('mouse_touch'), this.parameters.mouse.x, this.parameters.mouse.y);
            this._program.setUniformLocationWith2f(this._program.getUniformLocationForName('resolution'), this.parameters.resolution.x, this.parameters.resolution.y);
        }

        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this._program);
            glProgram_state.setUniformVec2("resolution", this.parameters.resolution);
            glProgram_state.setUniformFloat("time", this.parameters.time);
            glProgram_state.setUniformVec2("mouse_touch", this.parameters.mouse);
        } else {

            this._resolution = this._program.getUniformLocationForName("resolution");
            this._time = this._program.getUniformLocationForName("time");
            this._mouse = this._program.getUniformLocationForName("mouse_touch");

            this._program.setUniformLocationWith2f(this._resolution, this.parameters.resolution.x, this.parameters.resolution.y);
            this._program.setUniformLocationWith1f(this._time, this.parameters.time);
            this._program.setUniformLocationWith2f(this._mouse, this.parameters.mouse.x, this.parameters.mouse.y);
        }

        this.setProgram(this.node._sgNode, this._program);
    },

    setProgram: function setProgram(node, program) {
        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(program);
            node.setGLProgramState(glProgram_state);
        } else {
            node.setShaderProgram(program);
        }

        var children = node.children;
        if (!children) return;

        for (var i = 0; i < children.length; i++) this.setProgram(children[i], program);
    }

});

cc._RFpop();
},{"../Shaders/ccShader_Default_Vert.js":"ccShader_Default_Vert","../Shaders/ccShader_Default_Vert_noMVP.js":"ccShader_Default_Vert_noMVP","../Shaders/ccShader_Effect04_Frag.js":"ccShader_Effect04_Frag"}],"Effect18":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'ffd61SQLDFP1rIgMHgEmF47', 'Effect18');
// Script/Effect18.js

var _default_vert = require("../Shaders/ccShader_Default_Vert.js");
var _default_vert_no_mvp = require("../Shaders/ccShader_Default_Vert_noMVP.js");
var _glass_frag = require("../Shaders/ccShader_Effect04_Frag.js");

cc.Class({
    "extends": cc.Component,

    properties: {
        glassFactor: 1.0
    },

    onLoad: function onLoad() {
        this.parameters = {
            startTime: Date.now(),
            time: 0.0,
            mouse: {
                x: 0.0,
                y: 0.0
            },
            resolution: {
                x: 0.0,
                y: 0.0
            }

        };
        this.node.on(cc.Node.EventType.MOUSE_MOVE, function (event) {
            this.parameters.mouse.x = this.node.getContentSize().width / event.getLocationX();
            this.parameters.mouse.y = this.node.getContentSize().height / event.getLocationY();
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            this.parameters.mouse.x = this.node.getContentSize().width / event.getLocationX();
            this.parameters.mouse.y = this.node.getContentSize().height / event.getLocationY();
        }, this);

        this._use();
    },
    update: function update(dt) {
        if (this.glassFactor >= 40) {
            this.glassFactor = 0;
        }
        this.glassFactor += dt * 3;

        if (this._program) {

            this._program.use();
            this.updateGLParameters();
            if (cc.sys.isNative) {
                var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this._program);
                glProgram_state.setUniformVec2("resolution", this.parameters.resolution);
                glProgram_state.setUniformFloat("time", this.parameters.time);
                glProgram_state.setUniformVec2("mouse_touch", this.parameters.mouse);
            } else {
                this._program.setUniformLocationWith2f(this._resolution, this.parameters.resolution.x, this.parameters.resolution.y);
                this._program.setUniformLocationWith1f(this._time, this.parameters.time);
                this._program.setUniformLocationWith2f(this._mouse, this.parameters.mouse.x, this.parameters.mouse.x);
            }
        }
    },
    updateGLParameters: function updateGLParameters() {
        this.parameters.time = (Date.now() - this.parameters.startTime) / 1000;
        this.parameters.resolution.x = this.node.getContentSize().width;
        this.parameters.resolution.y = this.node.getContentSize().height;
    },

    _use: function _use() {

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
        } else {
            this._program = new cc.GLProgram();
            this._program.initWithVertexShaderByteArray(_default_vert, _glass_frag);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);

            this._program.link();
            this._program.updateUniforms();
            this._program.use();

            this.updateGLParameters();

            this._program.setUniformLocationWith1f(this._program.getUniformLocationForName('time'), this.parameters.time);
            this._program.setUniformLocationWith2f(this._program.getUniformLocationForName('mouse_touch'), this.parameters.mouse.x, this.parameters.mouse.y);
            this._program.setUniformLocationWith2f(this._program.getUniformLocationForName('resolution'), this.parameters.resolution.x, this.parameters.resolution.y);
        }

        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this._program);
            glProgram_state.setUniformVec2("resolution", this.parameters.resolution);
            glProgram_state.setUniformFloat("time", this.parameters.time);
            glProgram_state.setUniformVec2("mouse_touch", this.parameters.mouse);
        } else {

            this._resolution = this._program.getUniformLocationForName("resolution");
            this._time = this._program.getUniformLocationForName("time");
            this._mouse = this._program.getUniformLocationForName("mouse_touch");

            this._program.setUniformLocationWith2f(this._resolution, this.parameters.resolution.x, this.parameters.resolution.y);
            this._program.setUniformLocationWith1f(this._time, this.parameters.time);
            this._program.setUniformLocationWith2f(this._mouse, this.parameters.mouse.x, this.parameters.mouse.y);
        }

        this.setProgram(this.node._sgNode, this._program);
    },

    setProgram: function setProgram(node, program) {
        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(program);
            node.setGLProgramState(glProgram_state);
        } else {
            node.setShaderProgram(program);
        }

        var children = node.children;
        if (!children) return;

        for (var i = 0; i < children.length; i++) this.setProgram(children[i], program);
    }

});

cc._RFpop();
},{"../Shaders/ccShader_Default_Vert.js":"ccShader_Default_Vert","../Shaders/ccShader_Default_Vert_noMVP.js":"ccShader_Default_Vert_noMVP","../Shaders/ccShader_Effect04_Frag.js":"ccShader_Effect04_Frag"}],"Effect19":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'bea455Vpn9KMIF5LMfKKJAF', 'Effect19');
// Script/Effect19.js

var _default_vert = require("../Shaders/ccShader_Default_Vert.js");
var _default_vert_no_mvp = require("../Shaders/ccShader_Default_Vert_noMVP.js");
var _glass_frag = require("../Shaders/ccShader_Effect04_Frag.js");

cc.Class({
    "extends": cc.Component,

    properties: {
        glassFactor: 1.0
    },

    onLoad: function onLoad() {
        this.parameters = {
            startTime: Date.now(),
            time: 0.0,
            mouse: {
                x: 0.0,
                y: 0.0
            },
            resolution: {
                x: 0.0,
                y: 0.0
            }

        };
        this.node.on(cc.Node.EventType.MOUSE_MOVE, function (event) {
            this.parameters.mouse.x = this.node.getContentSize().width / event.getLocationX();
            this.parameters.mouse.y = this.node.getContentSize().height / event.getLocationY();
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            this.parameters.mouse.x = this.node.getContentSize().width / event.getLocationX();
            this.parameters.mouse.y = this.node.getContentSize().height / event.getLocationY();
        }, this);

        this._use();
    },
    update: function update(dt) {
        if (this.glassFactor >= 40) {
            this.glassFactor = 0;
        }
        this.glassFactor += dt * 3;

        if (this._program) {

            this._program.use();
            this.updateGLParameters();
            if (cc.sys.isNative) {
                var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this._program);
                glProgram_state.setUniformVec2("resolution", this.parameters.resolution);
                glProgram_state.setUniformFloat("time", this.parameters.time);
                glProgram_state.setUniformVec2("mouse_touch", this.parameters.mouse);
            } else {
                this._program.setUniformLocationWith2f(this._resolution, this.parameters.resolution.x, this.parameters.resolution.y);
                this._program.setUniformLocationWith1f(this._time, this.parameters.time);
                this._program.setUniformLocationWith2f(this._mouse, this.parameters.mouse.x, this.parameters.mouse.x);
            }
        }
    },
    updateGLParameters: function updateGLParameters() {
        this.parameters.time = (Date.now() - this.parameters.startTime) / 1000;
        this.parameters.resolution.x = this.node.getContentSize().width;
        this.parameters.resolution.y = this.node.getContentSize().height;
    },

    _use: function _use() {

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
        } else {
            this._program = new cc.GLProgram();
            this._program.initWithVertexShaderByteArray(_default_vert, _glass_frag);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);

            this._program.link();
            this._program.updateUniforms();
            this._program.use();

            this.updateGLParameters();

            this._program.setUniformLocationWith1f(this._program.getUniformLocationForName('time'), this.parameters.time);
            this._program.setUniformLocationWith2f(this._program.getUniformLocationForName('mouse_touch'), this.parameters.mouse.x, this.parameters.mouse.y);
            this._program.setUniformLocationWith2f(this._program.getUniformLocationForName('resolution'), this.parameters.resolution.x, this.parameters.resolution.y);
        }

        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this._program);
            glProgram_state.setUniformVec2("resolution", this.parameters.resolution);
            glProgram_state.setUniformFloat("time", this.parameters.time);
            glProgram_state.setUniformVec2("mouse_touch", this.parameters.mouse);
        } else {

            this._resolution = this._program.getUniformLocationForName("resolution");
            this._time = this._program.getUniformLocationForName("time");
            this._mouse = this._program.getUniformLocationForName("mouse_touch");

            this._program.setUniformLocationWith2f(this._resolution, this.parameters.resolution.x, this.parameters.resolution.y);
            this._program.setUniformLocationWith1f(this._time, this.parameters.time);
            this._program.setUniformLocationWith2f(this._mouse, this.parameters.mouse.x, this.parameters.mouse.y);
        }

        this.setProgram(this.node._sgNode, this._program);
    },

    setProgram: function setProgram(node, program) {
        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(program);
            node.setGLProgramState(glProgram_state);
        } else {
            node.setShaderProgram(program);
        }

        var children = node.children;
        if (!children) return;

        for (var i = 0; i < children.length; i++) this.setProgram(children[i], program);
    }

});

cc._RFpop();
},{"../Shaders/ccShader_Default_Vert.js":"ccShader_Default_Vert","../Shaders/ccShader_Default_Vert_noMVP.js":"ccShader_Default_Vert_noMVP","../Shaders/ccShader_Effect04_Frag.js":"ccShader_Effect04_Frag"}],"Effect20":[function(require,module,exports){
"use strict";
cc._RFpush(module, '117cdt+K4VNq7vIgZW4zs9k', 'Effect20');
// Script/Effect20.js

var _default_vert = require("../Shaders/ccShader_Default_Vert.js");
var _default_vert_no_mvp = require("../Shaders/ccShader_Default_Vert_noMVP.js");
var _glass_frag = require("../Shaders/ccShader_Effect04_Frag.js");

cc.Class({
    "extends": cc.Component,

    properties: {
        glassFactor: 1.0
    },

    onLoad: function onLoad() {
        this.parameters = {
            startTime: Date.now(),
            time: 0.0,
            mouse: {
                x: 0.0,
                y: 0.0
            },
            resolution: {
                x: 0.0,
                y: 0.0
            }

        };
        this.node.on(cc.Node.EventType.MOUSE_MOVE, function (event) {
            this.parameters.mouse.x = this.node.getContentSize().width / event.getLocationX();
            this.parameters.mouse.y = this.node.getContentSize().height / event.getLocationY();
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            this.parameters.mouse.x = this.node.getContentSize().width / event.getLocationX();
            this.parameters.mouse.y = this.node.getContentSize().height / event.getLocationY();
        }, this);

        this._use();
    },
    update: function update(dt) {
        if (this.glassFactor >= 40) {
            this.glassFactor = 0;
        }
        this.glassFactor += dt * 3;

        if (this._program) {

            this._program.use();
            this.updateGLParameters();
            if (cc.sys.isNative) {
                var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this._program);
                glProgram_state.setUniformVec2("resolution", this.parameters.resolution);
                glProgram_state.setUniformFloat("time", this.parameters.time);
                glProgram_state.setUniformVec2("mouse_touch", this.parameters.mouse);
            } else {
                this._program.setUniformLocationWith2f(this._resolution, this.parameters.resolution.x, this.parameters.resolution.y);
                this._program.setUniformLocationWith1f(this._time, this.parameters.time);
                this._program.setUniformLocationWith2f(this._mouse, this.parameters.mouse.x, this.parameters.mouse.x);
            }
        }
    },
    updateGLParameters: function updateGLParameters() {
        this.parameters.time = (Date.now() - this.parameters.startTime) / 1000;
        this.parameters.resolution.x = this.node.getContentSize().width;
        this.parameters.resolution.y = this.node.getContentSize().height;
    },

    _use: function _use() {

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
        } else {
            this._program = new cc.GLProgram();
            this._program.initWithVertexShaderByteArray(_default_vert, _glass_frag);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);

            this._program.link();
            this._program.updateUniforms();
            this._program.use();

            this.updateGLParameters();

            this._program.setUniformLocationWith1f(this._program.getUniformLocationForName('time'), this.parameters.time);
            this._program.setUniformLocationWith2f(this._program.getUniformLocationForName('mouse_touch'), this.parameters.mouse.x, this.parameters.mouse.y);
            this._program.setUniformLocationWith2f(this._program.getUniformLocationForName('resolution'), this.parameters.resolution.x, this.parameters.resolution.y);
        }

        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this._program);
            glProgram_state.setUniformVec2("resolution", this.parameters.resolution);
            glProgram_state.setUniformFloat("time", this.parameters.time);
            glProgram_state.setUniformVec2("mouse_touch", this.parameters.mouse);
        } else {

            this._resolution = this._program.getUniformLocationForName("resolution");
            this._time = this._program.getUniformLocationForName("time");
            this._mouse = this._program.getUniformLocationForName("mouse_touch");

            this._program.setUniformLocationWith2f(this._resolution, this.parameters.resolution.x, this.parameters.resolution.y);
            this._program.setUniformLocationWith1f(this._time, this.parameters.time);
            this._program.setUniformLocationWith2f(this._mouse, this.parameters.mouse.x, this.parameters.mouse.y);
        }

        this.setProgram(this.node._sgNode, this._program);
    },

    setProgram: function setProgram(node, program) {
        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(program);
            node.setGLProgramState(glProgram_state);
        } else {
            node.setShaderProgram(program);
        }

        var children = node.children;
        if (!children) return;

        for (var i = 0; i < children.length; i++) this.setProgram(children[i], program);
    }

});

cc._RFpop();
},{"../Shaders/ccShader_Default_Vert.js":"ccShader_Default_Vert","../Shaders/ccShader_Default_Vert_noMVP.js":"ccShader_Default_Vert_noMVP","../Shaders/ccShader_Effect04_Frag.js":"ccShader_Effect04_Frag"}],"EffectCommon":[function(require,module,exports){
"use strict";
cc._RFpush(module, '4e579eseCxNcJ0ZlJMKwkmt', 'EffectCommon');
// Script/EffectCommon.js

var _default_vert = require("../Shaders/ccShader_Default_Vert.js");
var _default_vert_no_mvp = require("../Shaders/ccShader_Default_Vert_noMVP.js");

cc.Class({
    "extends": cc.Component,

    properties: {
        glassFactor: 1.0,
        flagShader: "",
        frag_glsl: {
            "default": "Effect10.fs.glsl",
            visible: false
        }
    },

    onLoad: function onLoad() {
        var self = this;
        this.parameters = {
            startTime: Date.now(),
            time: 0.0,
            mouse: {
                x: 0.0,
                y: 0.0
            },
            resolution: {
                x: 0.0,
                y: 0.0
            }

        };
        this.node.on(cc.Node.EventType.MOUSE_MOVE, function (event) {
            this.parameters.mouse.x = this.node.getContentSize().width / event.getLocationX();
            this.parameters.mouse.y = this.node.getContentSize().height / event.getLocationY();
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            this.parameters.mouse.x = this.node.getContentSize().width / event.getLocationX();
            this.parameters.mouse.y = this.node.getContentSize().height / event.getLocationY();
        }, this);

        cc.loader.loadRes(self.flagShader, function (err, txt) {
            if (err) {
                cc.log(err);
            } else {
                self.frag_glsl = txt;
                self._use();
            }
        });
    },
    update: function update(dt) {
        if (this.glassFactor >= 40) {
            this.glassFactor = 0;
        }
        this.glassFactor += dt * 3;

        if (this._program) {

            this._program.use();
            this.updateGLParameters();
            if (cc.sys.isNative) {
                var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this._program);
                glProgram_state.setUniformVec2("resolution", this.parameters.resolution);
                glProgram_state.setUniformFloat("time", this.parameters.time);
                glProgram_state.setUniformVec2("mouse", this.parameters.mouse);
            } else {
                this._program.setUniformLocationWith2f(this._resolution, this.parameters.resolution.x, this.parameters.resolution.y);
                this._program.setUniformLocationWith1f(this._time, this.parameters.time);
                this._program.setUniformLocationWith2f(this._mouse, this.parameters.mouse.x, this.parameters.mouse.x);
            }
        }
    },
    updateGLParameters: function updateGLParameters() {
        this.parameters.time = (Date.now() - this.parameters.startTime) / 1000;
        this.parameters.resolution.x = this.node.getContentSize().width;
        this.parameters.resolution.y = this.node.getContentSize().height;
    },

    _use: function _use() {

        if (cc.sys.isNative) {
            cc.log("use native GLProgram");
            this._program = new cc.GLProgram();
            this._program.initWithString(_default_vert_no_mvp, this.frag_glsl);

            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);

            this._program.link();
            this._program.updateUniforms();
            this.updateGLParameters();
        } else {
            this._program = new cc.GLProgram();
            this._program.initWithVertexShaderByteArray(_default_vert, this.frag_glsl);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);

            this._program.link();
            this._program.updateUniforms();
            this._program.use();

            this.updateGLParameters();

            this._program.setUniformLocationWith1f(this._program.getUniformLocationForName('time'), this.parameters.time);
            this._program.setUniformLocationWith2f(this._program.getUniformLocationForName('mouse'), this.parameters.mouse.x, this.parameters.mouse.y);
            this._program.setUniformLocationWith2f(this._program.getUniformLocationForName('resolution'), this.parameters.resolution.x, this.parameters.resolution.y);
        }

        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this._program);
            glProgram_state.setUniformVec2("resolution", this.parameters.resolution);
            glProgram_state.setUniformFloat("time", this.parameters.time);
            glProgram_state.setUniformVec2("mouse", this.parameters.mouse);
        } else {

            this._resolution = this._program.getUniformLocationForName("resolution");
            this._time = this._program.getUniformLocationForName("time");
            this._mouse = this._program.getUniformLocationForName("mouse");

            this._program.setUniformLocationWith2f(this._resolution, this.parameters.resolution.x, this.parameters.resolution.y);
            this._program.setUniformLocationWith1f(this._time, this.parameters.time);
            this._program.setUniformLocationWith2f(this._mouse, this.parameters.mouse.x, this.parameters.mouse.y);
        }

        this.setProgram(this.node._sgNode, this._program);
    },

    setProgram: function setProgram(node, program) {
        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(program);
            node.setGLProgramState(glProgram_state);
        } else {
            node.setShaderProgram(program);
        }

        var children = node.children;
        if (!children) return;

        for (var i = 0; i < children.length; i++) this.setProgram(children[i], program);
    }

});

cc._RFpop();
},{"../Shaders/ccShader_Default_Vert.js":"ccShader_Default_Vert","../Shaders/ccShader_Default_Vert_noMVP.js":"ccShader_Default_Vert_noMVP"}],"EffectForShaderToy":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'ec0bddz0EhL45aBJr4t9QLx', 'EffectForShaderToy');
// Script/EffectForShaderToy.js

var _default_vert = require("../Shaders/ccShader_Default_Vert.js");
var _default_vert_no_mvp = require("../Shaders/ccShader_Default_Vert_noMVP.js");

/*

Shader Inputs
uniform vec3      iResolution;           // viewport resolution (in pixels)
uniform float     iGlobalTime;           // shader playback time (in seconds)
uniform float     iTimeDelta;            // render time (in seconds)
uniform int       iFrame;                // shader playback frame
uniform float     iChannelTime[4];       // channel playback time (in seconds)
uniform vec3      iChannelResolution[4]; // channel resolution (in pixels)
uniform vec4      iMouse;                // mouse pixel coords. xy: current (if MLB down), zw: click
uniform samplerXX iChannel0..3;          // input channel. XX = 2D/Cube
uniform vec4      iDate;                 // (year, month, day, time in seconds)
uniform float     iSampleRate;           // sound sample rate (i.e., 44100)

*/

cc.Class({
    "extends": cc.Component,

    properties: {
        glassFactor: 1.0,
        flagShader: "",
        frag_glsl: {
            "default": "Effect10.fs.glsl",
            visible: false
        }
    },

    onLoad: function onLoad() {
        var self = this;
        var now = new Date();
        this.parameters = {
            startTime: Date.now(),
            time: 0.0,
            mouse: {
                x: 0.0,
                y: 0.0,
                z: 0.0,
                w: 0.0
            },
            resolution: {
                x: 0.0,
                y: 0.0,
                z: 1.0
            },
            date: {
                x: now.getYear(), //year
                y: now.getMonth(), //month
                z: now.getDate(), //day
                w: now.getTime() + now.getMilliseconds() / 1000 },
            //time seconds
            isMouseDown: false

        };
        this.node.on(cc.Node.EventType.MOUSE_DOWN, function (event) {
            this.parameters.isMouseDown = true;
        }, this);

        this.node.on(cc.Node.EventType.MOUSE_UP, function (event) {
            this.parameters.isMouseDown = false;
        }, this);

        this.node.on(cc.Node.EventType.MOUSE_LEAVE, function (event) {
            this.parameters.isMouseDown = false;
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            this.parameters.isMouseDown = true;
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            this.parameters.isMouseDown = false;
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
            this.parameters.isMouseDown = false;
        }, this);

        this.node.on(cc.Node.EventType.MOUSE_MOVE, function (event) {
            if (this.parameters.isMouseDown) {
                this.parameters.mouse.x = event.getLocationX();
                this.parameters.mouse.y = event.getLocationY();
            }
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            if (this.parameters.isMouseDown) {
                this.parameters.mouse.x = event.getLocationX();
                this.parameters.mouse.y = event.getLocationY();
            }
        }, this);

        cc.loader.loadRes(self.flagShader, function (err, txt) {
            if (err) {
                cc.log(err);
            } else {
                self.frag_glsl = txt;
                self._use();
            }
        });
    },
    update: function update(dt) {
        if (this.glassFactor >= 40) {
            this.glassFactor = 0;
        }
        this.glassFactor += dt * 3;

        if (this._program) {

            this._program.use();
            this.updateGLParameters();
            if (cc.sys.isNative) {
                var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this._program);
                glProgram_state.setUniformVec3("iResolution", this.parameters.resolution);
                glProgram_state.setUniformFloat("iGlobalTime", this.parameters.time);
                glProgram_state.setUniformVec4("iMouse", this.parameters.mouse);
                glProgram_state.setUniformVec4("iDate", this.parameters.date);
            } else {
                this._program.setUniformLocationWith3f(this._resolution, this.parameters.resolution.x, this.parameters.resolution.y, this.parameters.resolution.z);
                this._program.setUniformLocationWith1f(this._time, this.parameters.time);
                this._program.setUniformLocationWith4f(this._mouse, this.parameters.mouse.x, this.parameters.mouse.y, this.parameters.mouse.z, this.parameters.mouse.w);
                this._program.setUniformLocationWith4f(this._date, this.parameters.date.x, this.parameters.date.y, this.parameters.date.z, this.parameters.date.w);
            }
        }
    },
    updateGLParameters: function updateGLParameters() {
        this.parameters.time = (Date.now() - this.parameters.startTime) / 1000;
        this.parameters.resolution.x = this.node.getContentSize().width;
        this.parameters.resolution.y = this.node.getContentSize().height;
        var now = new Date();

        this.parameters.date = {
            x: now.getYear(), //year
            y: now.getMonth(), //month
            z: now.getDate(), //day
            w: now.getTime() + now.getMilliseconds() / 1000 };
    },

    //time seconds
    _use: function _use() {

        if (cc.sys.isNative) {
            cc.log("use native GLProgram");
            this._program = new cc.GLProgram();
            this._program.initWithString(_default_vert_no_mvp, this.frag_glsl);

            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);

            this._program.link();
            this._program.updateUniforms();
            this.updateGLParameters();
        } else {
            this._program = new cc.GLProgram();
            this._program.initWithVertexShaderByteArray(_default_vert, this.frag_glsl);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);

            this._program.link();
            this._program.updateUniforms();
            this._program.use();

            this.updateGLParameters();

            this._program.setUniformLocationWith3f(this._program.getUniformLocationForName('iResolution'), this.parameters.resolution.x, this.parameters.resolution.y, this.parameters.resolution.z);
            this._program.setUniformLocationWith1f(this._program.getUniformLocationForName('iGlobalTime'), this.parameters.time);
            this._program.setUniformLocationWith4f(this._program.getUniformLocationForName('iMouse'), this.parameters.mouse.x, this.parameters.mouse.y, this.parameters.mouse.z, this.parameters.mouse.w);
            this._program.setUniformLocationWith4f(this._program.getUniformLocationForName('iDate'), this.parameters.date.x, this.parameters.date.y, this.parameters.date.z, this.parameters.date.w);
        }

        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this._program);
            glProgram_state.setUniformVec3("iResolution", this.parameters.resolution);
            glProgram_state.setUniformFloat("iGlobalTime", this.parameters.time);
            glProgram_state.setUniformVec4("iMouse", this.parameters.mouse);
        } else {

            this._resolution = this._program.getUniformLocationForName("iResolution");
            this._time = this._program.getUniformLocationForName("iGlobalTime");
            this._mouse = this._program.getUniformLocationForName("iMouse");

            this._program.setUniformLocationWith3f(this._resolution, this.parameters.resolution.x, this.parameters.resolution.y, this.parameters.resolution.z);
            this._program.setUniformLocationWith1f(this._time, this.parameters.time);
            this._program.setUniformLocationWith4f(this._mouse, this.parameters.mouse.x, this.parameters.mouse.y, this.parameters.mouse.z, this.parameters.mouse.w);
            this._program.setUniformLocationWith4f(this._date, this.parameters.date.x, this.parameters.date.y, this.parameters.date.z, this.parameters.date.w);
        }

        this.setProgram(this.node._sgNode, this._program);
    },

    setProgram: function setProgram(node, program) {
        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(program);
            node.setGLProgramState(glProgram_state);
        } else {
            node.setShaderProgram(program);
        }

        var children = node.children;
        if (!children) return;

        for (var i = 0; i < children.length; i++) this.setProgram(children[i], program);
    }

});

cc._RFpop();
},{"../Shaders/ccShader_Default_Vert.js":"ccShader_Default_Vert","../Shaders/ccShader_Default_Vert_noMVP.js":"ccShader_Default_Vert_noMVP"}],"EffectManager":[function(require,module,exports){
"use strict";
cc._RFpush(module, '10b8cNnro5N0qUG75gHt193', 'EffectManager');
// Script/UI/EffectManager.js

cc.Class({
    "extends": cc.Component,

    properties: {
        lastSceneName: "Shader",
        nextSceneName: "Effect01"

    },

    // use this for initialization
    onLoad: function onLoad() {
        if (!window.curLevelId) {
            window.curLevelId = 1;
        }
    },
    getCurLevelName: function getCurLevelName() {
        var levelName = "Effect";
        levelName += window.curLevelId < 10 ? "0" + window.curLevelId : window.curLevelId;
        return levelName;
    },
    onClickNext: function onClickNext() {
        window.curLevelId++;
        if (window.curLevelId > 150) {
            window.curLevelId = 1;
        }
        cc.director.loadScene(this.getCurLevelName());
    },
    onClickLast: function onClickLast() {
        window.curLevelId--;
        if (window.curLevelId <= 1) {
            window.curLevelId = 0;
        }

        cc.director.loadScene(this.getCurLevelName());
    },
    onClickToGitHub: function onClickToGitHub() {
        window.open("http://forum.cocos.com/t/creator-shader/36388");
    }
});

cc._RFpop();
},{}],"Effect":[function(require,module,exports){
"use strict";
cc._RFpush(module, '95cf8nZ8PJKb7FY6WnuyTb/', 'Effect');
// Script/Effect.js

var _default_vert = require("../Shaders/ccShader_Default_Vert.js");
var _default_vert_no_mvp = require("../Shaders/ccShader_Default_Vert_noMVP.js");
var _glass_frag = require("../Shaders/ccShader_Effect04_Frag.js");

cc.Class({
    "extends": cc.Component,

    properties: {
        glassFactor: 1.0,
        flagShader: "precision mediump float; uniform float time; uniform vec2 mouse; uniform vec2 resolution; const int numBlobs = 128; void main( void ) {     vec2 p = (gl_FragCoord.xy / resolution.x) - vec2(0.5, 0.5 * (resolution.y / resolution.x));     vec3 c = vec3(0.0);     for (int i=0; i<numBlobs; i++)  {       float px = sin(float(i)*0.1 + 0.5) * 0.4;       float py = sin(float(i*i)*0.01 + 0.4*time) * 0.2;       float pz = sin(float(i*i*i)*0.001 + 0.3*time) * 0.3 + 0.4;      float radius = 0.005 / pz;      vec2 pos = p + vec2(px, py);        float z = radius - length(pos);         if (z < 0.0) z = 0.0;       float cc = z / radius;      c += vec3(cc * (sin(float(i*i*i)) * 0.5 + 0.5), cc * (sin(float(i*i*i*i*i)) * 0.5 + 0.5), cc * (sin(float(i*i*i*i)) * 0.5 + 0.5));  }   gl_FragColor = vec4(c.x+p.y, c.y+p.y, c.z+p.y, 1.0); }"
    },

    onLoad: function onLoad() {
        this.parameters = {
            startTime: Date.now(),
            time: 0.0,
            mouse: {
                x: 0.0,
                y: 0.0
            },
            resolution: {
                x: 0.0,
                y: 0.0
            }

        };
        this.node.on(cc.Node.EventType.MOUSE_MOVE, function (event) {
            this.parameters.mouse.x = this.node.getContentSize().width / event.getLocationX();
            this.parameters.mouse.y = this.node.getContentSize().height / event.getLocationY();
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            this.parameters.mouse.x = this.node.getContentSize().width / event.getLocationX();
            this.parameters.mouse.y = this.node.getContentSize().height / event.getLocationY();
        }, this);

        this._use();
    },
    update: function update(dt) {
        if (this.glassFactor >= 40) {
            this.glassFactor = 0;
        }
        this.glassFactor += dt * 3;

        if (this._program) {

            this._program.use();
            this.updateGLParameters();
            if (cc.sys.isNative) {
                var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this._program);
                glProgram_state.setUniformVec2("resolution", this.parameters.resolution);
                glProgram_state.setUniformFloat("time", this.parameters.time);
                glProgram_state.setUniformVec2("mouse_touch", this.parameters.mouse);
            } else {
                this._program.setUniformLocationWith2f(this._resolution, this.parameters.resolution.x, this.parameters.resolution.y);
                this._program.setUniformLocationWith1f(this._time, this.parameters.time);
                this._program.setUniformLocationWith2f(this._mouse, this.parameters.mouse.x, this.parameters.mouse.x);
            }
        }
    },
    updateGLParameters: function updateGLParameters() {
        this.parameters.time = (Date.now() - this.parameters.startTime) / 1000;
        this.parameters.resolution.x = this.node.getContentSize().width;
        this.parameters.resolution.y = this.node.getContentSize().height;
    },

    _use: function _use() {

        if (cc.sys.isNative) {
            cc.log("use native GLProgram");
            this._program = new cc.GLProgram();
            this._program.initWithString(_default_vert_no_mvp, this.flagShader);

            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);

            this._program.link();
            this._program.updateUniforms();
            this.updateGLParameters();
        } else {
            this._program = new cc.GLProgram();
            this._program.initWithVertexShaderByteArray(_default_vert, this.flagShader);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);

            this._program.link();
            this._program.updateUniforms();
            this._program.use();

            this.updateGLParameters();

            this._program.setUniformLocationWith1f(this._program.getUniformLocationForName('time'), this.parameters.time);
            this._program.setUniformLocationWith2f(this._program.getUniformLocationForName('mouse_touch'), this.parameters.mouse.x, this.parameters.mouse.y);
            this._program.setUniformLocationWith2f(this._program.getUniformLocationForName('resolution'), this.parameters.resolution.x, this.parameters.resolution.y);
        }

        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this._program);
            glProgram_state.setUniformVec2("resolution", this.parameters.resolution);
            glProgram_state.setUniformFloat("time", this.parameters.time);
            glProgram_state.setUniformVec2("mouse_touch", this.parameters.mouse);
        } else {

            this._resolution = this._program.getUniformLocationForName("resolution");
            this._time = this._program.getUniformLocationForName("time");
            this._mouse = this._program.getUniformLocationForName("mouse_touch");

            this._program.setUniformLocationWith2f(this._resolution, this.parameters.resolution.x, this.parameters.resolution.y);
            this._program.setUniformLocationWith1f(this._time, this.parameters.time);
            this._program.setUniformLocationWith2f(this._mouse, this.parameters.mouse.x, this.parameters.mouse.y);
        }

        this.setProgram(this.node._sgNode, this._program);
    },

    setProgram: function setProgram(node, program) {
        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(program);
            node.setGLProgramState(glProgram_state);
        } else {
            node.setShaderProgram(program);
        }

        var children = node.children;
        if (!children) return;

        for (var i = 0; i < children.length; i++) this.setProgram(children[i], program);
    }

});

cc._RFpop();
},{"../Shaders/ccShader_Default_Vert.js":"ccShader_Default_Vert","../Shaders/ccShader_Default_Vert_noMVP.js":"ccShader_Default_Vert_noMVP","../Shaders/ccShader_Effect04_Frag.js":"ccShader_Effect04_Frag"}],"Emboss":[function(require,module,exports){
"use strict";
cc._RFpush(module, '96880Mj0cdDB4XR7BWESnn1', 'Emboss');
// Script/Emboss.js

var _default_vert = require("../Shaders/ccShader_Default_Vert.js");
var _default_vert_no_mvp = require("../Shaders/ccShader_Default_Vert_noMVP.js");
var _emboss_frag = require("../Shaders/ccShader_Emboss_Frag.js");

cc.Class({
    "extends": cc.Component,

    properties: {},

    onLoad: function onLoad() {
        this._use();
    },

    _use: function _use() {
        this._program = new cc.GLProgram();
        if (cc.sys.isNative) {
            cc.log("use native GLProgram");
            this._program.initWithString(_default_vert_no_mvp, _emboss_frag);
            this._program.link();
            this._program.updateUniforms();
        } else {
            this._program.initWithVertexShaderByteArray(_default_vert, _emboss_frag);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);
            this._program.link();
            this._program.updateUniforms();
        }

        this._uniWidthStep = this._program.getUniformLocationForName("widthStep");
        this._uniHeightStep = this._program.getUniformLocationForName("heightStep");

        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this._program);
            glProgram_state.setUniformFloat(this._uniWidthStep, 1.0 / this.node.getContentSize().width);
            glProgram_state.setUniformFloat(this._uniHeightStep, 1.0 / this.node.getContentSize().height);
        } else {
            this._program.setUniformLocationWith1f(this._uniWidthStep, 1.0 / this.node.getContentSize().width);
            this._program.setUniformLocationWith1f(this._uniHeightStep, 1.0 / this.node.getContentSize().height);
        }

        this.setProgram(this.node._sgNode, this._program);
    },
    setProgram: function setProgram(node, program) {
        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(program);
            node.setGLProgramState(glProgram_state);
        } else {
            node.setShaderProgram(program);
        }

        var children = node.children;
        if (!children) return;

        for (var i = 0; i < children.length; i++) this.setProgram(children[i], program);
    }

});

cc._RFpop();
},{"../Shaders/ccShader_Default_Vert.js":"ccShader_Default_Vert","../Shaders/ccShader_Default_Vert_noMVP.js":"ccShader_Default_Vert_noMVP","../Shaders/ccShader_Emboss_Frag.js":"ccShader_Emboss_Frag"}],"Glass2":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'c5c21NQAiVNPpg1XNMoak8k', 'Glass2');
// Script/Glass2.js

var _default_vert = require("../Shaders/ccShader_Default_Vert.js");
var _default_vert_no_mvp = require("../Shaders/ccShader_Default_Vert_noMVP.js");
var _glass_frag = require("../Shaders/ccShader_Glass_Frag.js");

cc.Class({
    "extends": cc.Component,

    properties: {
        glassFactor: 1.0,
        frag_glsl: {
            "default": "Effect10.fs.glsl",
            visible: false
        }
    },

    onLoad: function onLoad() {
        var self = this;
        var now = new Date();
        this.parameters = {
            startTime: Date.now(),
            time: 0.0,
            mouse: {
                x: 0.0,
                y: 0.0,
                z: 0.0,
                w: 0.0
            },
            resolution: {
                x: 0.0,
                y: 0.0,
                z: 1.0
            },
            date: {
                x: now.getYear(), //year
                y: now.getMonth(), //month
                z: now.getDate(), //day
                w: now.getTime() + now.getMilliseconds() / 1000 },
            //time seconds
            isMouseDown: false

        };

        cc.loader.loadRes(self.frag_glsl, function (err, txt) {
            if (err) {
                cc.log(err);
            } else {
                self.frag_glsl = txt;
                self._use();
            }
        });
    },
    update: function update(dt) {
        if (this.glassFactor >= 40) {
            this.glassFactor = 0;
        }
        this.glassFactor += dt * 3;

        if (this._program) {

            this._program.use();
            this.updateGLParameters();
            if (cc.sys.isNative) {
                var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this._program);
                glProgram_state.setUniformFloat("blurRadiusScale", this.glassFactor);
                glProgram_state.setUniformVec3("iResolution", this.parameters.resolution);
                glProgram_state.setUniformFloat("iGlobalTime", this.parameters.time);
                glProgram_state.setUniformVec4("iMouse", this.parameters.mouse);
                glProgram_state.setUniformVec4("iDate", this.parameters.date);
            } else {
                this._program.setUniformLocationWith1f(this._uniBlurRadiusScale, this.glassFactor);
                this._program.setUniformLocationWith3f(this._resolution, this.parameters.resolution.x, this.parameters.resolution.y, this.parameters.resolution.z);
                this._program.setUniformLocationWith1f(this._time, this.parameters.time);
                this._program.setUniformLocationWith4f(this._mouse, this.parameters.mouse.x, this.parameters.mouse.y, this.parameters.mouse.z, this.parameters.mouse.w);
                this._program.setUniformLocationWith4f(this._date, this.parameters.date.x, this.parameters.date.y, this.parameters.date.z, this.parameters.date.w);
            }
        }
    },
    updateGLParameters: function updateGLParameters() {
        this.parameters.time = (Date.now() - this.parameters.startTime) / 1000;
        this.parameters.resolution.x = this.node.getContentSize().width;
        this.parameters.resolution.y = this.node.getContentSize().height;
        var now = new Date();

        this.parameters.date = {
            x: now.getYear(), //year
            y: now.getMonth(), //month
            z: now.getDate(), //day
            w: now.getTime() + now.getMilliseconds() / 1000 };
    },

    //time seconds
    _use: function _use() {

        this._program = new cc.GLProgram();
        if (cc.sys.isNative) {
            cc.log("use native GLProgram");
            this._program = new cc.GLProgram();
            this._program.initWithString(_default_vert_no_mvp, this.frag_glsl);

            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);

            this._program.link();
            this._program.updateUniforms();
            this.updateGLParameters();
        } else {
            this._program = new cc.GLProgram();
            this._program.initWithVertexShaderByteArray(_default_vert, this.frag_glsl);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);

            this._program.link();
            this._program.updateUniforms();
            this._program.use();

            this.updateGLParameters();

            this._program.setUniformLocationWith3f(this._program.getUniformLocationForName('iResolution'), this.parameters.resolution.x, this.parameters.resolution.y, this.parameters.resolution.z);
            this._program.setUniformLocationWith1f(this._program.getUniformLocationForName('iGlobalTime'), this.parameters.time);
            this._program.setUniformLocationWith4f(this._program.getUniformLocationForName('iMouse'), this.parameters.mouse.x, this.parameters.mouse.y, this.parameters.mouse.z, this.parameters.mouse.w);
            this._program.setUniformLocationWith4f(this._program.getUniformLocationForName('iDate'), this.parameters.date.x, this.parameters.date.y, this.parameters.date.z, this.parameters.date.w);
        }

        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this._program);
            glProgram_state.setUniformFloat("widthStep", 1.0 / this.node.getContentSize().width);
            glProgram_state.setUniformFloat("heightStep", 1.0 / this.node.getContentSize().height);
            glProgram_state.setUniformFloat("blurRadiusScale", this.glassFactor);
            glProgram_state.setUniformVec3("iResolution", this.parameters.resolution);
            glProgram_state.setUniformFloat("iGlobalTime", this.parameters.time);
            glProgram_state.setUniformVec4("iMouse", this.parameters.mouse);
        } else {

            this._uniWidthStep = this._program.getUniformLocationForName("widthStep");
            this._uniHeightStep = this._program.getUniformLocationForName("heightStep");
            this._uniBlurRadiusScale = this._program.getUniformLocationForName("blurRadiusScale");

            this._program.setUniformLocationWith1f(this._uniWidthStep, 1.0 / this.node.getContentSize().width);
            this._program.setUniformLocationWith1f(this._uniHeightStep, 1.0 / this.node.getContentSize().height);
            this._program.setUniformLocationWith1f(this._uniBlurRadiusScale, this.glassFactor);

            this._resolution = this._program.getUniformLocationForName("iResolution");
            this._time = this._program.getUniformLocationForName("iGlobalTime");
            this._mouse = this._program.getUniformLocationForName("iMouse");

            this._program.setUniformLocationWith3f(this._resolution, this.parameters.resolution.x, this.parameters.resolution.y, this.parameters.resolution.z);
            this._program.setUniformLocationWith1f(this._time, this.parameters.time);
            this._program.setUniformLocationWith4f(this._mouse, this.parameters.mouse.x, this.parameters.mouse.y, this.parameters.mouse.z, this.parameters.mouse.w);
            this._program.setUniformLocationWith4f(this._date, this.parameters.date.x, this.parameters.date.y, this.parameters.date.z, this.parameters.date.w);
        }

        this.setProgram(this.node._sgNode, this._program);
    },

    setProgram: function setProgram(node, program) {
        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(program);
            node.setGLProgramState(glProgram_state);
        } else {
            node.setShaderProgram(program);
        }

        var children = node.children;
        if (!children) return;

        for (var i = 0; i < children.length; i++) this.setProgram(children[i], program);
    }

});

cc._RFpop();
},{"../Shaders/ccShader_Default_Vert.js":"ccShader_Default_Vert","../Shaders/ccShader_Default_Vert_noMVP.js":"ccShader_Default_Vert_noMVP","../Shaders/ccShader_Glass_Frag.js":"ccShader_Glass_Frag"}],"Glass":[function(require,module,exports){
"use strict";
cc._RFpush(module, '4b2b93dv2tMPYO54MTCHTfp', 'Glass');
// Script/Glass.js

var _default_vert = require("../Shaders/ccShader_Default_Vert.js");
var _default_vert_no_mvp = require("../Shaders/ccShader_Default_Vert_noMVP.js");
var _glass_frag = require("../Shaders/ccShader_Glass_Frag.js");

cc.Class({
    "extends": cc.Component,

    properties: {
        glassFactor: 1.0
    },

    onLoad: function onLoad() {
        this._use();
    },
    update: function update(dt) {
        if (this.glassFactor >= 40) {
            this.glassFactor = 0;
        }
        this.glassFactor += dt * 3;

        if (this._program) {

            this._program.use();
            if (cc.sys.isNative) {
                var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this._program);
                glProgram_state.setUniformFloat("blurRadiusScale", this.glassFactor);
            } else {
                this._program.setUniformLocationWith1f(this._uniBlurRadiusScale, this.glassFactor);
            }
        }
    },

    _use: function _use() {

        this._program = new cc.GLProgram();
        if (cc.sys.isNative) {
            this._program.initWithString(_default_vert_no_mvp, _glass_frag);
            this._program.link();
            this._program.updateUniforms();
        } else {
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
            glProgram_state.setUniformFloat("widthStep", 1.0 / this.node.getContentSize().width);
            glProgram_state.setUniformFloat("heightStep", 1.0 / this.node.getContentSize().height);
            glProgram_state.setUniformFloat("blurRadiusScale", this.glassFactor);
        } else {

            this._uniWidthStep = this._program.getUniformLocationForName("widthStep");
            this._uniHeightStep = this._program.getUniformLocationForName("heightStep");
            this._uniBlurRadiusScale = this._program.getUniformLocationForName("blurRadiusScale");

            this._program.setUniformLocationWith1f(this._uniWidthStep, 1.0 / this.node.getContentSize().width);
            this._program.setUniformLocationWith1f(this._uniHeightStep, 1.0 / this.node.getContentSize().height);
            this._program.setUniformLocationWith1f(this._uniBlurRadiusScale, this.glassFactor);
        }

        this.setProgram(this.node._sgNode, this._program);
    },

    setProgram: function setProgram(node, program) {
        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(program);
            node.setGLProgramState(glProgram_state);
        } else {
            node.setShaderProgram(program);
        }

        var children = node.children;
        if (!children) return;

        for (var i = 0; i < children.length; i++) this.setProgram(children[i], program);
    }

});

cc._RFpop();
},{"../Shaders/ccShader_Default_Vert.js":"ccShader_Default_Vert","../Shaders/ccShader_Default_Vert_noMVP.js":"ccShader_Default_Vert_noMVP","../Shaders/ccShader_Glass_Frag.js":"ccShader_Glass_Frag"}],"Gray":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'beb6duloztFW7GMx6d9gIya', 'Gray');
// Script/Gray.js

var _default_vert = require("../Shaders/ccShader_Default_Vert.js");
var _default_vert_no_mvp = require("../Shaders/ccShader_Default_Vert_noMVP.js");
var _gray_frag = require("../Shaders/ccShader_Gray_Frag.js");

cc.Class({
    "extends": cc.Component,

    properties: {
        grayFactor: 1
    },

    onLoad: function onLoad() {
        this._use();
    },

    _use: function _use() {
        this._program = new cc.GLProgram();

        if (cc.sys.isNative) {
            cc.log("use native GLProgram");
            this._program.initWithString(_default_vert_no_mvp, _gray_frag);
            this._program.link();
            this._program.updateUniforms();
        } else {
            this._program.initWithVertexShaderByteArray(_default_vert, _gray_frag);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);
            this._program.link();
            this._program.updateUniforms();
        }
        this.setProgram(this.node._sgNode, this._program);
    },
    setProgram: function setProgram(node, program) {
        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(program);
            node.setGLProgramState(glProgram_state);
        } else {
            node.setShaderProgram(program);
        }

        var children = node.children;
        if (!children) return;
        for (var i = 0; i < children.length; i++) this.setProgram(children[i], program);
    }
});

cc._RFpop();
},{"../Shaders/ccShader_Default_Vert.js":"ccShader_Default_Vert","../Shaders/ccShader_Default_Vert_noMVP.js":"ccShader_Default_Vert_noMVP","../Shaders/ccShader_Gray_Frag.js":"ccShader_Gray_Frag"}],"LightEffet":[function(require,module,exports){
"use strict";
cc._RFpush(module, '60a3aeK0RZJGqMkSoAzoPXI', 'LightEffet');
// Script/LightEffet.js

var _default_vert = require("../Shaders/ccShader_Default_Vert.js");
var _default_vert_no_mvp = require("../Shaders/ccShader_Default_Vert_noMVP.js");
var _glass_frag = require("../Shaders/ccShader_LightEffect_Frag.js");

cc.Class({
    "extends": cc.Component,

    properties: {
        glassFactor: 1.0
    },

    onLoad: function onLoad() {
        this.parameters = {
            startTime: Date.now(),
            time: 0.0,
            mouse: {
                x: 0.0,
                y: 0.0
            },
            resolution: {
                x: 0.0,
                y: 0.0
            }

        };
        this.node.on(cc.Node.EventType.MOUSE_MOVE, function (event) {
            this.parameters.mouse.x = this.node.getContentSize().width / event.getLocationX();
            this.parameters.mouse.y = this.node.getContentSize().height / event.getLocationY();
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            this.parameters.mouse.x = this.node.getContentSize().width / event.getLocationX();
            this.parameters.mouse.y = this.node.getContentSize().height / event.getLocationY();
        }, this);

        this._use();
    },
    update: function update(dt) {
        if (this.glassFactor >= 40) {
            this.glassFactor = 0;
        }
        this.glassFactor += dt * 3;

        if (this._program) {

            this._program.use();
            this.updateGLParameters();
            if (cc.sys.isNative) {
                var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this._program);
                glProgram_state.setUniformVec2("resolution", this.parameters.resolution);
                glProgram_state.setUniformFloat("time", this.parameters.time);
                glProgram_state.setUniformVec2("mouse_touch", this.parameters.mouse);
            } else {
                this._program.setUniformLocationWith2f(this._resolution, this.parameters.resolution.x, this.parameters.resolution.y);
                this._program.setUniformLocationWith1f(this._time, this.parameters.time);
                this._program.setUniformLocationWith2f(this._mouse, this.parameters.mouse.x, this.parameters.mouse.x);
            }
        }
    },
    updateGLParameters: function updateGLParameters() {
        this.parameters.time = (Date.now() - this.parameters.startTime) / 1000;
        this.parameters.resolution.x = this.node.getContentSize().width;
        this.parameters.resolution.y = this.node.getContentSize().height;
    },

    _use: function _use() {

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
        } else {
            this._program = new cc.GLProgram();
            this._program.initWithVertexShaderByteArray(_default_vert, _glass_frag);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);

            this._program.link();
            this._program.updateUniforms();
            this._program.use();

            this.updateGLParameters();

            this._program.setUniformLocationWith1f(this._program.getUniformLocationForName('time'), this.parameters.time);
            this._program.setUniformLocationWith2f(this._program.getUniformLocationForName('mouse_touch'), this.parameters.mouse.x, this.parameters.mouse.y);
            this._program.setUniformLocationWith2f(this._program.getUniformLocationForName('resolution'), this.parameters.resolution.x, this.parameters.resolution.y);
        }

        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this._program);
            glProgram_state.setUniformVec2("resolution", this.parameters.resolution);
            glProgram_state.setUniformFloat("time", this.parameters.time);
            glProgram_state.setUniformVec2("mouse_touch", this.parameters.mouse);
        } else {

            this._resolution = this._program.getUniformLocationForName("resolution");
            this._time = this._program.getUniformLocationForName("time");
            this._mouse = this._program.getUniformLocationForName("mouse_touch");

            this._program.setUniformLocationWith2f(this._resolution, this.parameters.resolution.x, this.parameters.resolution.y);
            this._program.setUniformLocationWith1f(this._time, this.parameters.time);
            this._program.setUniformLocationWith2f(this._mouse, this.parameters.mouse.x, this.parameters.mouse.y);
        }

        this.setProgram(this.node._sgNode, this._program);
    },

    setProgram: function setProgram(node, program) {
        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(program);
            node.setGLProgramState(glProgram_state);
        } else {
            node.setShaderProgram(program);
        }

        var children = node.children;
        if (!children) return;

        for (var i = 0; i < children.length; i++) this.setProgram(children[i], program);
    }

});

cc._RFpop();
},{"../Shaders/ccShader_Default_Vert.js":"ccShader_Default_Vert","../Shaders/ccShader_Default_Vert_noMVP.js":"ccShader_Default_Vert_noMVP","../Shaders/ccShader_LightEffect_Frag.js":"ccShader_LightEffect_Frag"}],"LightningBolt":[function(require,module,exports){
"use strict";
cc._RFpush(module, '3345cIPKg9M5L+BmNFPyEYk', 'LightningBolt');
// Script/LightningBolt.js

var _default_vert = require("../Shaders/ccShader_lightningBolt_Vert.js");
var _default_vert_no_mvp = require("../Shaders/ccShader_Default_Vert_noMVP.js");
var _lightningBolt_frag = require("../Shaders/ccShader_lightningBolt_Frag.js");

cc.Class({
    "extends": cc.Component,

    properties: {
        glassFactor: 1.0
    },

    onLoad: function onLoad() {
        this._use();
    },
    update: function update(dt) {
        // if(this.glassFactor>=40){
        //     this.glassFactor=0;
        // }
        // this.glassFactor+=dt*3;

        // if(this._program){
        //     if(cc.sys.isNative){
        //         var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this._program);
        //         glProgram_state.setUniformFloat( this._uniBlurRadiusScale ,this.glassFactor);
        //     }else{
        //         this._program.setUniformLocationWith1f( this._uniBlurRadiusScale, this.glassFactor );   
        //     }
        // }
    },

    _use: function _use() {

        if (cc.sys.isNative) {
            cc.log("use native GLProgram");
            this._program = new cc.GLProgram();
            this._program.initWithString(_default_vert_no_mvp, _lightningBolt_frag);
            this._program.link();
            this._program.updateUniforms();
        } else {
            this._program = new cc.GLProgram();
            this._program.initWithVertexShaderByteArray(_default_vert, _lightningBolt_frag);

            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);
            this._program.link();
            this._program.updateUniforms();
        }

        this._u_opacity = this._program.getUniformLocationForName("u_opacity");

        cc.log(this._u_opacity);

        this._uniWidthStep = this._program.getUniformLocationForName("widthStep");
        this._uniHeightStep = this._program.getUniformLocationForName("heightStep");
        this._uniBlurRadiusScale = this._program.getUniformLocationForName("blurRadiusScale");

        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this._program);
            // glProgram_state.setUniformFloat( this._uniWidthStep , ( 1.0 / this.node.getContentSize().width ) );
            // glProgram_state.setUniformFloat( this._uniHeightStep , ( 1.0 / this.node.getContentSize().height ) );
            // glProgram_state.setUniformFloat( this._uniBlurRadiusScale ,this.glassFactor);
        } else {
                // this._program.setUniformLocationWith1f( this._uniWidthStep, ( 1.0 / this.node.getContentSize().width ) );
                // this._program.setUniformLocationWith1f( this._uniHeightStep, ( 1.0 / this.node.getContentSize().height ) );
                // this._program.setUniformLocationWith1f( this._uniBlurRadiusScale, this.glassFactor );
            }

        this.setProgram(this.node._sgNode, this._program);
    },

    setProgram: function setProgram(node, program) {
        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(program);
            node.setGLProgramState(glProgram_state);
        } else {
            node.setShaderProgram(program);
        }

        var children = node.children;
        if (!children) return;

        for (var i = 0; i < children.length; i++) this.setProgram(children[i], program);
    }

});

cc._RFpop();
},{"../Shaders/ccShader_Default_Vert_noMVP.js":"ccShader_Default_Vert_noMVP","../Shaders/ccShader_lightningBolt_Frag.js":"ccShader_lightningBolt_Frag","../Shaders/ccShader_lightningBolt_Vert.js":"ccShader_lightningBolt_Vert"}],"Negative_Black_White":[function(require,module,exports){
"use strict";
cc._RFpush(module, '5898b9+Nz1Mtb9hpqGfj1ML', 'Negative_Black_White');
// Script/Negative_Black_White.js

var _default_vert = require("../Shaders/ccShader_Default_Vert.js");
var _default_vert_no_mvp = require("../Shaders/ccShader_Default_Vert_noMVP.js");
var _negative_black_white_frag = require("../Shaders/ccShader_Negative_Black_White_Frag.js");

cc.Class({
    "extends": cc.Component,

    properties: {},

    onLoad: function onLoad() {
        this._use();
    },

    _use: function _use() {
        this._program = new cc.GLProgram();

        if (cc.sys.isNative) {
            cc.log("use native GLProgram");
            this._program.initWithString(_default_vert_no_mvp, _negative_black_white_frag);
            this._program.link();
            this._program.updateUniforms();
        } else {

            this._program.initWithVertexShaderByteArray(_default_vert, _negative_black_white_frag);

            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);
            this._program.link();
            this._program.updateUniforms();
        }

        this.setProgram(this.node._sgNode, this._program);
    },
    setProgram: function setProgram(node, program) {
        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(program);
            node.setGLProgramState(glProgram_state);
        } else {
            node.setShaderProgram(program);
        }

        var children = node.children;
        if (!children) return;

        for (var i = 0; i < children.length; i++) this.setProgram(children[i], program);
    }

});

cc._RFpop();
},{"../Shaders/ccShader_Default_Vert.js":"ccShader_Default_Vert","../Shaders/ccShader_Default_Vert_noMVP.js":"ccShader_Default_Vert_noMVP","../Shaders/ccShader_Negative_Black_White_Frag.js":"ccShader_Negative_Black_White_Frag"}],"Negative_Image":[function(require,module,exports){
"use strict";
cc._RFpush(module, '1223bWIWhFParPR7jg0vHan', 'Negative_Image');
// Script/Negative_Image.js

var _default_vert = require("../Shaders/ccShader_Default_Vert.js");
var _default_vert_no_mvp = require("../Shaders/ccShader_Default_Vert_noMVP.js");
var _negative_image_frag = require("../Shaders/ccShader_Negative_Image_Frag.js");

cc.Class({
    "extends": cc.Component,

    properties: {},

    onLoad: function onLoad() {
        this._use();
    },

    _use: function _use() {
        this._program = new cc.GLProgram();

        if (cc.sys.isNative) {
            cc.log("use native GLProgram");
            this._program.initWithString(_default_vert_no_mvp, _negative_image_frag);
            this._program.link();
            this._program.updateUniforms();
        } else {
            this._program.initWithVertexShaderByteArray(_default_vert, _negative_image_frag);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);
            this._program.link();
            this._program.updateUniforms();
        }

        this.setProgram(this.node._sgNode, this._program);
    },
    setProgram: function setProgram(node, program) {
        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(program);
            node.setGLProgramState(glProgram_state);
        } else {
            node.setShaderProgram(program);
        }

        var children = node.children;
        if (!children) return;

        for (var i = 0; i < children.length; i++) this.setProgram(children[i], program);
    }

});

cc._RFpop();
},{"../Shaders/ccShader_Default_Vert.js":"ccShader_Default_Vert","../Shaders/ccShader_Default_Vert_noMVP.js":"ccShader_Default_Vert_noMVP","../Shaders/ccShader_Negative_Image_Frag.js":"ccShader_Negative_Image_Frag"}],"Shadow_Black_White":[function(require,module,exports){
"use strict";
cc._RFpush(module, '7b15cFSchVHjaD3Jpz4tjaj', 'Shadow_Black_White');
// Script/Shadow_Black_White.js

var _default_vert = require("../Shaders/ccShader_Default_Vert.js");
var _default_vert_no_mvp = require("../Shaders/ccShader_Default_Vert_noMVP.js");
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
        if (cc.sys.isNative) {
            cc.log("use native GLProgram");
            this._program.initWithString(_default_vert_no_mvp, _negative_image_frag);
            this._program.link();
            this._program.updateUniforms();
        } else {
            this._program.initWithVertexShaderByteArray(_default_vert, _shadow_black_white_frag);

            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);
            this._program.link();
            this._program.updateUniforms();
        }

        this._uniStrength = this._program.getUniformLocationForName("strength");

        this.setProgram(this.node._sgNode, this._program);
    },
    setProgram: function setProgram(node, program) {
        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(program);
            node.setGLProgramState(glProgram_state);
        } else {
            node.setShaderProgram(program);
        }

        var children = node.children;
        if (!children) return;

        for (var i = 0; i < children.length; i++) this.setProgram(children[i], program);
    },

    update: function update(dt) {
        if (this._program) {

            this._program.use();
            if (cc.sys.isNative) {
                var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this._program);
                glProgram_state.setUniformFloat(this._uniStrength, this._motion += this._strength);
            } else {
                this._program.setUniformLocationWith1f(this._uniStrength, this._motion += this._strength);
                this._program.updateUniforms();
            }

            if (1.0 < this._motion || 0.0 > this._motion) {
                this._strength *= -1;
            }
        }
    }
});

cc._RFpop();
},{"../Shaders/ccShader_Default_Vert.js":"ccShader_Default_Vert","../Shaders/ccShader_Default_Vert_noMVP.js":"ccShader_Default_Vert_noMVP","../Shaders/ccShader_Shadow_Black_White_Frag.js":"ccShader_Shadow_Black_White_Frag"}],"UIManager":[function(require,module,exports){
"use strict";
cc._RFpush(module, '298137scYlJoreHV0uCyjdd', 'UIManager');
// Script/UIManager.js

cc.Class({
    "extends": cc.Component,

    properties: {
        btnGroupPrefab: {
            "default": null,
            type: cc.Prefab
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        var btnGroup = cc.instantiate(this.btnGroupPrefab);
        btnGroup.parent = this.node;
    }
});

cc._RFpop();
},{}],"Wave_H":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'bdf19y2pc1PVoqxb0sbsYvb', 'Wave_H');
// Script/Wave_H.js

var _default_vert = require("../Shaders/ccShader_Default_Vert.js");
var _default_vert_no_mvp = require("../Shaders/ccShader_Default_Vert_noMVP.js");
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
        if (cc.sys.isNative) {
            cc.log("use native GLProgram");
            this._program.initWithString(_default_vert_no_mvp, _wave_h_frag);
            this._program.link();
            this._program.updateUniforms();
        } else {
            this._program.initWithVertexShaderByteArray(_default_vert, _wave_h_frag);

            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);
            this._program.link();
            this._program.updateUniforms();
        }

        this._uniMotion = this._program.getUniformLocationForName("motion");
        this._uniAngle = this._program.getUniformLocationForName("angle");

        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this._program);
            glProgram_state.setUniformFloat(this._uniAngle, this._angle);
        } else {
            this._program.setUniformLocationWith1f(this._uniAngle, this._angle);
        }

        this.setProgram(this.node._sgNode, this._program);
    },
    setProgram: function setProgram(node, program) {
        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(program);
            node.setGLProgramState(glProgram_state);
        } else {
            node.setShaderProgram(program);
        }

        var children = node.children;
        if (!children) return;

        for (var i = 0; i < children.length; i++) this.setProgram(children[i], program);
    },
    update: function update(dt) {
        if (this._program) {

            this._program.use();
            if (cc.sys.isNative) {
                var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this._program);
                glProgram_state.setUniformFloat(this._uniMotion, this._motion += 0.05);
            } else {
                this._program.setUniformLocationWith1f(this._uniMotion, this._motion += 0.05);
                this._program.updateUniforms();
            }

            if (1.0e20 < this._motion) {
                this._motion = 0;
            }
        }
    }
});

cc._RFpop();
},{"../Shaders/ccShader_Default_Vert.js":"ccShader_Default_Vert","../Shaders/ccShader_Default_Vert_noMVP.js":"ccShader_Default_Vert_noMVP","../Shaders/ccShader_Wave_H_Frag.js":"ccShader_Wave_H_Frag"}],"Wave_VH":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'b991cBdgAFF47TvkDiskWLs', 'Wave_VH');
// Script/Wave_VH.js

var _default_vert = require("../Shaders/ccShader_Default_Vert.js");
var _default_vert_no_mvp = require("../Shaders/ccShader_Default_Vert_noMVP.js");
var _wave_vh_frag = require("../Shaders/ccShader_Wave_VH_Frag.js");

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
        if (cc.sys.isNative) {
            cc.log("use native GLProgram");
            this._program.initWithString(_default_vert_no_mvp, _wave_vh_frag);
            this._program.link();
            this._program.updateUniforms();
        } else {
            this._program.initWithVertexShaderByteArray(_default_vert, _wave_vh_frag);

            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);
            this._program.link();
            this._program.updateUniforms();
        }

        this._uniMotion = this._program.getUniformLocationForName("motion");
        this._uniAngle = this._program.getUniformLocationForName("angle");

        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this._program);
            glProgram_state.setUniformFloat(this._uniAngle, this._angle);
        } else {
            this._program.setUniformLocationWith1f(this._uniAngle, this._angle);
        }

        this.setProgram(this.node._sgNode, this._program);
    },
    setProgram: function setProgram(node, program) {
        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(program);
            node.setGLProgramState(glProgram_state);
        } else {
            node.setShaderProgram(program);
        }

        var children = node.children;
        if (!children) return;

        for (var i = 0; i < children.length; i++) this.setProgram(children[i], program);
    },

    update: function update(dt) {
        if (this._program) {

            this._program.use();
            if (cc.sys.isNative) {
                var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this._program);
                glProgram_state.setUniformFloat(this._uniMotion, this._motion += 0.05);
            } else {
                this._program.setUniformLocationWith1f(this._uniMotion, this._motion += 0.05);
                this._program.updateUniforms();
            }
            if (1.0e20 < this._motion) {
                this._motion = 0;
            }
        }
    }
});

cc._RFpop();
},{"../Shaders/ccShader_Default_Vert.js":"ccShader_Default_Vert","../Shaders/ccShader_Default_Vert_noMVP.js":"ccShader_Default_Vert_noMVP","../Shaders/ccShader_Wave_VH_Frag.js":"ccShader_Wave_VH_Frag"}],"Wave_V":[function(require,module,exports){
"use strict";
cc._RFpush(module, '63a8cDVi8RNc78rJD126ks9', 'Wave_V');
// Script/Wave_V.js

var _default_vert = require("../Shaders/ccShader_Default_Vert.js");
var _default_vert_no_mvp = require("../Shaders/ccShader_Default_Vert_noMVP.js");
var _wave_v_frag = require("../Shaders/ccShader_Wave_V_Frag.js");

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

        if (cc.sys.isNative) {
            cc.log("use native GLProgram");
            this._program.initWithString(_default_vert_no_mvp, _wave_v_frag);
            this._program.link();
            this._program.updateUniforms();
        } else {
            this._program.initWithVertexShaderByteArray(_default_vert, _wave_v_frag);

            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);
            this._program.link();
            this._program.updateUniforms();
        }

        this._uniMotion = this._program.getUniformLocationForName("motion");
        this._uniAngle = this._program.getUniformLocationForName("angle");

        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this._program);
            glProgram_state.setUniformFloat(this._uniAngle, this._angle);
        } else {
            this._program.setUniformLocationWith1f(this._uniAngle, this._angle);
        }

        this.setProgram(this.node._sgNode, this._program);
    },
    setProgram: function setProgram(node, program) {
        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(program);
            node.setGLProgramState(glProgram_state);
        } else {
            node.setShaderProgram(program);
        }

        var children = node.children;
        if (!children) return;

        for (var i = 0; i < children.length; i++) this.setProgram(children[i], program);
    },

    update: function update(dt) {
        if (this._program) {

            this._program.use();
            if (cc.sys.isNative) {
                var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this._program);
                glProgram_state.setUniformFloat(this._uniMotion, this._motion += 0.05);
            } else {
                this._program.setUniformLocationWith1f(this._uniMotion, this._motion += 0.05);
                this._program.updateUniforms();
            }

            if (1.0e20 < this._motion) {
                this._motion = 0;
            }
        }
    }
});

cc._RFpop();
},{"../Shaders/ccShader_Default_Vert.js":"ccShader_Default_Vert","../Shaders/ccShader_Default_Vert_noMVP.js":"ccShader_Default_Vert_noMVP","../Shaders/ccShader_Wave_V_Frag.js":"ccShader_Wave_V_Frag"}],"ccShader_Avg_Black_White_Frag":[function(require,module,exports){
"use strict";
cc._RFpush(module, '1a2e0lgfLVJ2Z1JCdcFAr8X', 'ccShader_Avg_Black_White_Frag');
// Shaders/ccShader_Avg_Black_White_Frag.js

/* 平均值黑白 */

module.exports = "#ifdef GL_ES\n" + "precision mediump float;\n" + "#endif\n" + "varying vec2 v_texCoord;\n" + "void main()\n" + "{\n" + "    vec4 v = texture2D(CC_Texture0, v_texCoord).rgba;\n" + "    float f = (v.r + v.g + v.b) / 3.0;\n" + "    gl_FragColor = vec4(f, f, f, v.a);\n" + "}\n";

cc._RFpop();
},{}],"ccShader_Blur_Edge_Detail_Frag":[function(require,module,exports){
"use strict";
cc._RFpush(module, '8d8efHxD+NJDJDhjrQlBHJs', 'ccShader_Blur_Edge_Detail_Frag');
// Shaders/ccShader_Blur_Edge_Detail_Frag.js

/* 模糊 0.5     */
/* 模糊 1.0     */
/* 细节 -2.0    */
/* 细节 -5.0    */
/* 细节 -10.0   */
/* 边缘 2.0     */
/* 边缘 5.0     */
/* 边缘 10.0    */

module.exports = "precision mediump float;\n" + "varying vec2 v_texCoord;\n" + "uniform float widthStep;\n" + "uniform float heightStep;\n" + "uniform float strength;\n" + "const float blurRadius = 2.0;\n" + "const float blurPixels = (blurRadius * 2.0 + 1.0) * (blurRadius * 2.0 + 1.0);\n" + "void main()\n" + "{\n" + "    vec3 sumColor = vec3(0.0, 0.0, 0.0);\n" + "    for(float fy = -blurRadius; fy <= blurRadius; ++fy)\n" + "    {\n" + "        for(float fx = -blurRadius; fx <= blurRadius; ++fx)\n" + "        {\n" + "            vec2 coord = vec2(fx * widthStep, fy * heightStep);\n" + "            sumColor += texture2D(CC_Texture0, v_texCoord + coord).rgb;\n" + "        }\n" + "    }\n" + "    gl_FragColor = vec4(mix(texture2D(CC_Texture0, v_texCoord).rgb, sumColor / blurPixels, strength), 1.0);\n" + "}\n";

cc._RFpop();
},{}],"ccShader_Circle_Effect2_Frag":[function(require,module,exports){
"use strict";
cc._RFpush(module, '17861m3GZBEGILbyvFOnYO1', 'ccShader_Circle_Effect2_Frag');
// Shaders/ccShader_Circle_Effect2_Frag.js

module.exports = "precision mediump float;\n" + "varying vec2 v_texCoord;\n" + "uniform float time;\n" + "uniform vec2 mouse_touch;\n" + "uniform vec2 resolution;\n" + "void main( void ) {\n" + "\n" + "	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse_touch / 4.0;\n" + "\n" + "	float color = 0.0;\n" + "	color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );\n" + "	color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );\n" + "	color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );\n" + "	color *= sin( time / 10.0 ) * 0.5;\n" + "\n" + "	gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 );\n" + "\n" + "}\n";

cc._RFpop();
},{}],"ccShader_Circle_Light_Frag":[function(require,module,exports){
"use strict";
cc._RFpush(module, '809c0F7ZPNA+orsMC9NHEF6', 'ccShader_Circle_Light_Frag');
// Shaders/ccShader_Circle_Light_Frag.js

module.exports = "precision mediump float;\n" + "varying vec2 v_texCoord;\n" + "uniform float time;\n" + "uniform vec2 mouse_touch;\n" + "uniform vec2 resolution;\n" + "\n" + "void main( void ) {\n" + "  float t=time;\n" + "  vec2 touch=mouse_touch;\n" + "  vec2 resolution2s=resolution;\n" + "  vec2 position = ((gl_FragCoord.xy / resolution.xy) * 2. - 1.) * vec2(resolution.x / resolution.y, 1.0);\n" + "  float d = abs(0.1 + length(position) - 0.5 * abs(sin(time))) * 5.0;\n" + "  vec3 sumColor = vec3(0.0, 0.0, 0.0);\n" + "	sumColor += texture2D(CC_Texture0, v_texCoord).rgb;\n" + "	gl_FragColor = vec4(sumColor.r/d, sumColor.g, sumColor.b, mouse_touch.x/800.0 );\n" + "\n" + "}\n";

cc._RFpop();
},{}],"ccShader_Default_Vert_noMVP":[function(require,module,exports){
"use strict";
cc._RFpush(module, '43902EEq9hDVIWH7OBEhbvT', 'ccShader_Default_Vert_noMVP');
// Shaders/ccShader_Default_Vert_noMVP.js

module.exports = "attribute vec4 a_position;\n" + " attribute vec2 a_texCoord;\n" + " attribute vec4 a_color;\n" + " varying vec2 v_texCoord;\n" + " varying vec4 v_fragmentColor;\n" + " void main()\n" + " {\n" + "     gl_Position = CC_PMatrix  * a_position;\n" + "     v_fragmentColor = a_color;\n" + "     v_texCoord = a_texCoord;\n" + " } \n";

cc._RFpop();
},{}],"ccShader_Default_Vert":[function(require,module,exports){
"use strict";
cc._RFpush(module, '440f5W7uvVNAaZx4ALzoZN8', 'ccShader_Default_Vert');
// Shaders/ccShader_Default_Vert.js

module.exports = "attribute vec4 a_position;\n" + " attribute vec2 a_texCoord;\n" + " attribute vec4 a_color;\n" + " varying vec2 v_texCoord;\n" + " varying vec4 v_fragmentColor;\n" + " void main()\n" + " {\n" + "     gl_Position = ( CC_PMatrix * CC_MVMatrix ) * a_position;\n" + "     v_fragmentColor = a_color;\n" + "     v_texCoord = a_texCoord;\n" + " } \n";

cc._RFpop();
},{}],"ccShader_Effect03_Frag":[function(require,module,exports){
"use strict";
cc._RFpush(module, '11f07p5MPxF6pKNkwuMvZHu', 'ccShader_Effect03_Frag');
// Shaders/ccShader_Effect03_Frag.js

module.exports = "precision mediump float;\n" + "\n" + "uniform float time;\n" + "uniform vec2 mouse_touch;\n" + "uniform vec2 resolution;\n" + "\n" + "float sphIntersect(vec3 ro, vec3 rd, vec4 sph)\n" + "{\n" + "    vec3 oc = ro - sph.xyz;\n" + "    float b = dot( oc, rd );\n" + "    float c = dot( oc, oc ) - sph.w*sph.w;\n" + "    float h = b*b - c;\n" + "    if( h<0.0 ) return -1.0;\n" + "    h = sqrt( h );\n" + "    return -b - h;\n" + "}\n" + "\n" + "void main()\n" + "{\n" + "	vec2 mo = mouse_touch * 2.0 - 1.0;\n" + "	vec3 col = vec3(0.5, 1, 1);\n" + "	float aspect = resolution.x / resolution.y;\n" + "\n" + "	vec2 uv = (gl_FragCoord.xy / resolution.xy) * 2.0 - 1.0;\n" + "	uv.x *= aspect;\n" + "\n" + "	vec3 rdir = normalize(vec3(uv, 3.0));\n" + "	vec3 rpos = vec3(0, 0, -10);\n" + "\n" + "	float dist = sphIntersect(rpos, rdir, vec4(0, 0, 0, 1.5));\n" + "	if(dist != -1.0){\n" + "		vec3 ldir = vec3(mo.x, mo.y, -1.0);\n" + "		vec3 snorm = normalize(rpos + rdir * dist);\n" + "		col = vec3(1, 0, 0) * max(dot(snorm, ldir), 0.0);\n" + "	}\n" + "\n" + "	col = pow(col, vec3(0.454545));\n" + "	gl_FragColor = vec4(col, 1.0);\n" + "}\n";

cc._RFpop();
},{}],"ccShader_Effect04_Frag":[function(require,module,exports){
"use strict";
cc._RFpush(module, '00676n8pVBFYJsX3Vb+nAeV', 'ccShader_Effect04_Frag');
// Shaders/ccShader_Effect04_Frag.js

module.exports = "#ifdef GL_ES\n" + "precision mediump float;\n" + "#endif\n" + "\n" + "uniform float time;\n" + "uniform vec2 mouse_touch;\n" + "uniform vec2 resolution;\n" + "\n" + "void main( void ) {\n" + "\n" + "	vec2 p = (2.0*gl_FragCoord.xy-resolution.xy)/resolution.y;\n" + "    float tau = 3.1415926535;\n" + "    float a = sin(time);\n" + "    float r = length(p)*0.75;\n" + "    vec2 uv = vec2(a/tau,r);\n" + "	\n" + "	//get the color\n" + "	float xCol = (uv.x - (time / 3.0)) * 3.0;\n" + "	xCol = mod(xCol, 3.0);\n" + "	vec3 horColour = vec3(sin(time*2.99)*1.25, sin(time*3.111)*0.25, sin(time*1.31)*0.25);\n" + "	\n" + "	if (xCol < .1) {\n" + "		\n" + "		horColour.r += 1.0 - xCol;\n" + "		horColour.g += xCol;\n" + "	}\n" + "	else if (xCol < 0.4) {\n" + "		\n" + "		xCol -= 1.0;\n" + "		horColour.g += 1.0 - xCol;\n" + "		horColour.b += xCol;\n" + "	}\n" + "	else {\n" + "		\n" + "		xCol -= 2.0;\n" + "		horColour.b += 1.0 - xCol;\n" + "		horColour.r += xCol;\n" + "	}\n" + "\n" + "	// draw color beam\n" + "	uv = (3.0 * uv) - abs(sin(time));\n" + "	float beamWidth = .0+1.1*abs((sin(time)*0.2*2.0) / (3.0 * uv.x * uv.y));\n" + "	vec3 horBeam = vec3(beamWidth);\n" + "	gl_FragColor = vec4((( horBeam) * horColour), 1.0);\n" + "}\n";

cc._RFpop();
},{}],"ccShader_Effect05_Frag":[function(require,module,exports){
"use strict";
cc._RFpush(module, '337ebBhO3FAIo6X9bI3so70', 'ccShader_Effect05_Frag');
// Shaders/ccShader_Effect05_Frag.js

module.exports = "#ifdef GL_ES\n" + "precision highp float;\n" + "#endif\n" + "\n" + "uniform float time;\n" + "uniform vec2 mouse;\n" + "uniform vec2 resolution;\n" + "\n" + "#define M_PI 3.1415926535897932384626433832795\n" + "\n" + "void main( void ) {\n" + "  float time2 = time;\n" + "  vec2 mouse2 = mouse;\n" + "	float radius = 0.75;\n" + "	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);\n" + "	// assign color only to the points that are inside of the circle\n" + "	gl_FragColor = vec4(smoothstep(0.0,1.0, pow(radius - length(p),0.05) ));	\n" + "}";

cc._RFpop();
},{}],"ccShader_Effect06_Frag":[function(require,module,exports){
"use strict";
cc._RFpush(module, '0d2e5NT3tFJZIbvGYWXEh0m', 'ccShader_Effect06_Frag');
// Shaders/ccShader_Effect06_Frag.js

module.exports = "#ifdef GL_ES\n" + "precision mediump float;\n" + "#endif\n" + "\n" + "// Pygolampis 2\n" + "\n" + "uniform float time;\n" + "uniform vec2 mouse;\n" + "uniform vec2 resolution;\n" + "\n" + "const int numBlobs = 128;\n" + "\n" + "void main( void ) {\n" + "\n" + "	vec2 p = (gl_FragCoord.xy / resolution.x) - vec2(0.5, 0.5 * (resolution.y / resolution.x));\n" + "\n" + "	vec3 c = vec3(0.0);\n" + "	for (int i=0; i<numBlobs; i++)\n" + "	{\n" + "		float px = sin(float(i)*0.1 + 0.5) * 0.4;\n" + "		float py = sin(float(i*i)*0.01 + 0.4*time) * 0.2;\n" + "		float pz = sin(float(i*i*i)*0.001 + 0.3*time) * 0.3 + 0.4;\n" + "		float radius = 0.005 / pz;\n" + "		vec2 pos = p + vec2(px, py);\n" + "		float z = radius - length(pos);\n" + "		if (z < 0.0) z = 0.0;\n" + "		float cc = z / radius;\n" + "		c += vec3(cc * (sin(float(i*i*i)) * 0.5 + 0.5), cc * (sin(float(i*i*i*i*i)) * 0.5 + 0.5), cc * (sin(float(i*i*i*i)) * 0.5 + 0.5));\n" + "	}\n" + "\n" + "	gl_FragColor = vec4(c.x+p.y, c.y+p.y, c.z+p.y, 1.0);\n" + "}\n";

cc._RFpop();
},{}],"ccShader_Effect07_Frag":[function(require,module,exports){
"use strict";
cc._RFpush(module, '8da6csz1XhGrrdGYT5SwwjV', 'ccShader_Effect07_Frag');
// Shaders/ccShader_Effect07_Frag.js

module.exports = "#ifdef GL_ES\n" + "precision mediump float;\n" + "#endif\n" + "\n" + "uniform float time;\n" + "uniform vec2 mouse_touch;\n" + "uniform vec2 resolution;\n" + "\n" + "void main( void ) {\n" + "\n" + "	vec2 p = (2.0*gl_FragCoord.xy-resolution.xy)/resolution.y;\n" + "    float tau = 3.1415926535;\n" + "    float a = sin(time);\n" + "    float r = length(p)*0.75;\n" + "    vec2 uv = vec2(a/tau,r);\n" + "	\n" + "	//get the color\n" + "	float xCol = (uv.x - (time / 3.0)) * 3.0;\n" + "	xCol = mod(xCol, 3.0);\n" + "	vec3 horColour = vec3(sin(time*2.99)*1.25, sin(time*3.111)*0.25, sin(time*1.31)*0.25);\n" + "	\n" + "	if (xCol < .1) {\n" + "		\n" + "		horColour.r += 1.0 - xCol;\n" + "		horColour.g += xCol;\n" + "	}\n" + "	else if (xCol < 0.4) {\n" + "		\n" + "		xCol -= 1.0;\n" + "		horColour.g += 1.0 - xCol;\n" + "		horColour.b += xCol;\n" + "	}\n" + "	else {\n" + "		\n" + "		xCol -= 2.0;\n" + "		horColour.b += 1.0 - xCol;\n" + "		horColour.r += xCol;\n" + "	}\n" + "\n" + "	// draw color beam\n" + "	uv = (3.0 * uv) - abs(sin(time));\n" + "	float beamWidth = .0+1.1*abs((sin(time)*0.2*2.0) / (3.0 * uv.x * uv.y));\n" + "	vec3 horBeam = vec3(beamWidth);\n" + "	gl_FragColor = vec4((( horBeam) * horColour), 1.0);\n" + "}\n";

cc._RFpop();
},{}],"ccShader_Effect08_Frag":[function(require,module,exports){
"use strict";
cc._RFpush(module, '2b3datjCepA6ZN3F5yW/yAT', 'ccShader_Effect08_Frag');
// Shaders/ccShader_Effect08_Frag.js

module.exports = "#ifdef GL_ES\n" + "precision mediump float;\n" + "#endif\n" + "\n" + "uniform float time;\n" + "uniform vec2 mouse_touch;\n" + "uniform vec2 resolution;\n" + "\n" + "void main( void ) {\n" + "\n" + "	vec2 p = (2.0*gl_FragCoord.xy-resolution.xy)/resolution.y;\n" + "    float tau = 3.1415926535;\n" + "    float a = sin(time);\n" + "    float r = length(p)*0.75;\n" + "    vec2 uv = vec2(a/tau,r);\n" + "	\n" + "	//get the color\n" + "	float xCol = (uv.x - (time / 3.0)) * 3.0;\n" + "	xCol = mod(xCol, 3.0);\n" + "	vec3 horColour = vec3(sin(time*2.99)*1.25, sin(time*3.111)*0.25, sin(time*1.31)*0.25);\n" + "	\n" + "	if (xCol < .1) {\n" + "		\n" + "		horColour.r += 1.0 - xCol;\n" + "		horColour.g += xCol;\n" + "	}\n" + "	else if (xCol < 0.4) {\n" + "		\n" + "		xCol -= 1.0;\n" + "		horColour.g += 1.0 - xCol;\n" + "		horColour.b += xCol;\n" + "	}\n" + "	else {\n" + "		\n" + "		xCol -= 2.0;\n" + "		horColour.b += 1.0 - xCol;\n" + "		horColour.r += xCol;\n" + "	}\n" + "\n" + "	// draw color beam\n" + "	uv = (3.0 * uv) - abs(sin(time));\n" + "	float beamWidth = .0+1.1*abs((sin(time)*0.2*2.0) / (3.0 * uv.x * uv.y));\n" + "	vec3 horBeam = vec3(beamWidth);\n" + "	gl_FragColor = vec4((( horBeam) * horColour), 1.0);\n" + "}\n";

cc._RFpop();
},{}],"ccShader_Effect09_Frag":[function(require,module,exports){
"use strict";
cc._RFpush(module, '94d18V5+opHMo8V1QjRMP3O', 'ccShader_Effect09_Frag');
// Shaders/ccShader_Effect09_Frag.js

module.exports = "#ifdef GL_ES\n" + "precision mediump float;\n" + "#endif\n" + "\n" + "uniform float time;\n" + "uniform vec2 mouse_touch;\n" + "uniform vec2 resolution;\n" + "\n" + "void main( void ) {\n" + "\n" + "	vec2 p = (2.0*gl_FragCoord.xy-resolution.xy)/resolution.y;\n" + "    float tau = 3.1415926535;\n" + "    float a = sin(time);\n" + "    float r = length(p)*0.75;\n" + "    vec2 uv = vec2(a/tau,r);\n" + "	\n" + "	//get the color\n" + "	float xCol = (uv.x - (time / 3.0)) * 3.0;\n" + "	xCol = mod(xCol, 3.0);\n" + "	vec3 horColour = vec3(sin(time*2.99)*1.25, sin(time*3.111)*0.25, sin(time*1.31)*0.25);\n" + "	\n" + "	if (xCol < .1) {\n" + "		\n" + "		horColour.r += 1.0 - xCol;\n" + "		horColour.g += xCol;\n" + "	}\n" + "	else if (xCol < 0.4) {\n" + "		\n" + "		xCol -= 1.0;\n" + "		horColour.g += 1.0 - xCol;\n" + "		horColour.b += xCol;\n" + "	}\n" + "	else {\n" + "		\n" + "		xCol -= 2.0;\n" + "		horColour.b += 1.0 - xCol;\n" + "		horColour.r += xCol;\n" + "	}\n" + "\n" + "	// draw color beam\n" + "	uv = (3.0 * uv) - abs(sin(time));\n" + "	float beamWidth = .0+1.1*abs((sin(time)*0.2*2.0) / (3.0 * uv.x * uv.y));\n" + "	vec3 horBeam = vec3(beamWidth);\n" + "	gl_FragColor = vec4((( horBeam) * horColour), 1.0);\n" + "}\n";

cc._RFpop();
},{}],"ccShader_Effect10_Frag":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'ff90dehIwJGjIiBFBuB50iF', 'ccShader_Effect10_Frag');
// Shaders/ccShader_Effect10_Frag.js

module.exports = "#ifdef GL_ES\n" + "precision mediump float;\n" + "#endif\n" + "\n" + "uniform float time;\n" + "uniform vec2 mouse_touch;\n" + "uniform vec2 resolution;\n" + "\n" + "void main( void ) {\n" + "\n" + "	vec2 p = (2.0*gl_FragCoord.xy-resolution.xy)/resolution.y;\n" + "    float tau = 3.1415926535;\n" + "    float a = sin(time);\n" + "    float r = length(p)*0.75;\n" + "    vec2 uv = vec2(a/tau,r);\n" + "	\n" + "	//get the color\n" + "	float xCol = (uv.x - (time / 3.0)) * 3.0;\n" + "	xCol = mod(xCol, 3.0);\n" + "	vec3 horColour = vec3(sin(time*2.99)*1.25, sin(time*3.111)*0.25, sin(time*1.31)*0.25);\n" + "	\n" + "	if (xCol < .1) {\n" + "		\n" + "		horColour.r += 1.0 - xCol;\n" + "		horColour.g += xCol;\n" + "	}\n" + "	else if (xCol < 0.4) {\n" + "		\n" + "		xCol -= 1.0;\n" + "		horColour.g += 1.0 - xCol;\n" + "		horColour.b += xCol;\n" + "	}\n" + "	else {\n" + "		\n" + "		xCol -= 2.0;\n" + "		horColour.b += 1.0 - xCol;\n" + "		horColour.r += xCol;\n" + "	}\n" + "\n" + "	// draw color beam\n" + "	uv = (3.0 * uv) - abs(sin(time));\n" + "	float beamWidth = .0+1.1*abs((sin(time)*0.2*2.0) / (3.0 * uv.x * uv.y));\n" + "	vec3 horBeam = vec3(beamWidth);\n" + "	gl_FragColor = vec4((( horBeam) * horColour), 1.0);\n" + "}\n";

cc._RFpop();
},{}],"ccShader_Effect11_Frag":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'e66d5uE/pFJ4q97gumlzsu7', 'ccShader_Effect11_Frag');
// Shaders/ccShader_Effect11_Frag.js

module.exports = "#ifdef GL_ES\n" + "precision mediump float;\n" + "#endif\n" + "\n" + "uniform float time;\n" + "uniform vec2 mouse_touch;\n" + "uniform vec2 resolution;\n" + "\n" + "void main( void ) {\n" + "\n" + "	vec2 p = (2.0*gl_FragCoord.xy-resolution.xy)/resolution.y;\n" + "    float tau = 3.1415926535;\n" + "    float a = sin(time);\n" + "    float r = length(p)*0.75;\n" + "    vec2 uv = vec2(a/tau,r);\n" + "	\n" + "	//get the color\n" + "	float xCol = (uv.x - (time / 3.0)) * 3.0;\n" + "	xCol = mod(xCol, 3.0);\n" + "	vec3 horColour = vec3(sin(time*2.99)*1.25, sin(time*3.111)*0.25, sin(time*1.31)*0.25);\n" + "	\n" + "	if (xCol < .1) {\n" + "		\n" + "		horColour.r += 1.0 - xCol;\n" + "		horColour.g += xCol;\n" + "	}\n" + "	else if (xCol < 0.4) {\n" + "		\n" + "		xCol -= 1.0;\n" + "		horColour.g += 1.0 - xCol;\n" + "		horColour.b += xCol;\n" + "	}\n" + "	else {\n" + "		\n" + "		xCol -= 2.0;\n" + "		horColour.b += 1.0 - xCol;\n" + "		horColour.r += xCol;\n" + "	}\n" + "\n" + "	// draw color beam\n" + "	uv = (3.0 * uv) - abs(sin(time));\n" + "	float beamWidth = .0+1.1*abs((sin(time)*0.2*2.0) / (3.0 * uv.x * uv.y));\n" + "	vec3 horBeam = vec3(beamWidth);\n" + "	gl_FragColor = vec4((( horBeam) * horColour), 1.0);\n" + "}\n";

cc._RFpop();
},{}],"ccShader_Effect12_Frag":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'fadcexmvH1OfLKNVWE2A9DX', 'ccShader_Effect12_Frag');
// Shaders/ccShader_Effect12_Frag.js

module.exports = "#ifdef GL_ES\n" + "precision mediump float;\n" + "#endif\n" + "\n" + "uniform float time;\n" + "uniform vec2 mouse_touch;\n" + "uniform vec2 resolution;\n" + "\n" + "void main( void ) {\n" + "\n" + "	vec2 p = (2.0*gl_FragCoord.xy-resolution.xy)/resolution.y;\n" + "    float tau = 3.1415926535;\n" + "    float a = sin(time);\n" + "    float r = length(p)*0.75;\n" + "    vec2 uv = vec2(a/tau,r);\n" + "	\n" + "	//get the color\n" + "	float xCol = (uv.x - (time / 3.0)) * 3.0;\n" + "	xCol = mod(xCol, 3.0);\n" + "	vec3 horColour = vec3(sin(time*2.99)*1.25, sin(time*3.111)*0.25, sin(time*1.31)*0.25);\n" + "	\n" + "	if (xCol < .1) {\n" + "		\n" + "		horColour.r += 1.0 - xCol;\n" + "		horColour.g += xCol;\n" + "	}\n" + "	else if (xCol < 0.4) {\n" + "		\n" + "		xCol -= 1.0;\n" + "		horColour.g += 1.0 - xCol;\n" + "		horColour.b += xCol;\n" + "	}\n" + "	else {\n" + "		\n" + "		xCol -= 2.0;\n" + "		horColour.b += 1.0 - xCol;\n" + "		horColour.r += xCol;\n" + "	}\n" + "\n" + "	// draw color beam\n" + "	uv = (3.0 * uv) - abs(sin(time));\n" + "	float beamWidth = .0+1.1*abs((sin(time)*0.2*2.0) / (3.0 * uv.x * uv.y));\n" + "	vec3 horBeam = vec3(beamWidth);\n" + "	gl_FragColor = vec4((( horBeam) * horColour), 1.0);\n" + "}\n";

cc._RFpop();
},{}],"ccShader_Effect13_Frag":[function(require,module,exports){
"use strict";
cc._RFpush(module, '41c0c2Bhu1K24U1ZVjrF37J', 'ccShader_Effect13_Frag');
// Shaders/ccShader_Effect13_Frag.js

module.exports = "#ifdef GL_ES\n" + "precision mediump float;\n" + "#endif\n" + "\n" + "uniform float time;\n" + "uniform vec2 mouse_touch;\n" + "uniform vec2 resolution;\n" + "\n" + "void main( void ) {\n" + "\n" + "	vec2 p = (2.0*gl_FragCoord.xy-resolution.xy)/resolution.y;\n" + "    float tau = 3.1415926535;\n" + "    float a = sin(time);\n" + "    float r = length(p)*0.75;\n" + "    vec2 uv = vec2(a/tau,r);\n" + "	\n" + "	//get the color\n" + "	float xCol = (uv.x - (time / 3.0)) * 3.0;\n" + "	xCol = mod(xCol, 3.0);\n" + "	vec3 horColour = vec3(sin(time*2.99)*1.25, sin(time*3.111)*0.25, sin(time*1.31)*0.25);\n" + "	\n" + "	if (xCol < .1) {\n" + "		\n" + "		horColour.r += 1.0 - xCol;\n" + "		horColour.g += xCol;\n" + "	}\n" + "	else if (xCol < 0.4) {\n" + "		\n" + "		xCol -= 1.0;\n" + "		horColour.g += 1.0 - xCol;\n" + "		horColour.b += xCol;\n" + "	}\n" + "	else {\n" + "		\n" + "		xCol -= 2.0;\n" + "		horColour.b += 1.0 - xCol;\n" + "		horColour.r += xCol;\n" + "	}\n" + "\n" + "	// draw color beam\n" + "	uv = (3.0 * uv) - abs(sin(time));\n" + "	float beamWidth = .0+1.1*abs((sin(time)*0.2*2.0) / (3.0 * uv.x * uv.y));\n" + "	vec3 horBeam = vec3(beamWidth);\n" + "	gl_FragColor = vec4((( horBeam) * horColour), 1.0);\n" + "}\n";

cc._RFpop();
},{}],"ccShader_Effect14_Frag":[function(require,module,exports){
"use strict";
cc._RFpush(module, '15af7srd3tLap9b9UrM5XVJ', 'ccShader_Effect14_Frag');
// Shaders/ccShader_Effect14_Frag.js

module.exports = "#ifdef GL_ES\n" + "precision mediump float;\n" + "#endif\n" + "\n" + "uniform float time;\n" + "uniform vec2 mouse_touch;\n" + "uniform vec2 resolution;\n" + "\n" + "void main( void ) {\n" + "\n" + "	vec2 p = (2.0*gl_FragCoord.xy-resolution.xy)/resolution.y;\n" + "    float tau = 3.1415926535;\n" + "    float a = sin(time);\n" + "    float r = length(p)*0.75;\n" + "    vec2 uv = vec2(a/tau,r);\n" + "	\n" + "	//get the color\n" + "	float xCol = (uv.x - (time / 3.0)) * 3.0;\n" + "	xCol = mod(xCol, 3.0);\n" + "	vec3 horColour = vec3(sin(time*2.99)*1.25, sin(time*3.111)*0.25, sin(time*1.31)*0.25);\n" + "	\n" + "	if (xCol < .1) {\n" + "		\n" + "		horColour.r += 1.0 - xCol;\n" + "		horColour.g += xCol;\n" + "	}\n" + "	else if (xCol < 0.4) {\n" + "		\n" + "		xCol -= 1.0;\n" + "		horColour.g += 1.0 - xCol;\n" + "		horColour.b += xCol;\n" + "	}\n" + "	else {\n" + "		\n" + "		xCol -= 2.0;\n" + "		horColour.b += 1.0 - xCol;\n" + "		horColour.r += xCol;\n" + "	}\n" + "\n" + "	// draw color beam\n" + "	uv = (3.0 * uv) - abs(sin(time));\n" + "	float beamWidth = .0+1.1*abs((sin(time)*0.2*2.0) / (3.0 * uv.x * uv.y));\n" + "	vec3 horBeam = vec3(beamWidth);\n" + "	gl_FragColor = vec4((( horBeam) * horColour), 1.0);\n" + "}\n";

cc._RFpop();
},{}],"ccShader_Effect15_Frag":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'dc9e6Nw2rdD8a3Wv6nm1qO/', 'ccShader_Effect15_Frag');
// Shaders/ccShader_Effect15_Frag.js

module.exports = "#ifdef GL_ES\n" + "precision mediump float;\n" + "#endif\n" + "\n" + "uniform float time;\n" + "uniform vec2 mouse_touch;\n" + "uniform vec2 resolution;\n" + "\n" + "void main( void ) {\n" + "\n" + "	vec2 p = (2.0*gl_FragCoord.xy-resolution.xy)/resolution.y;\n" + "    float tau = 3.1415926535;\n" + "    float a = sin(time);\n" + "    float r = length(p)*0.75;\n" + "    vec2 uv = vec2(a/tau,r);\n" + "	\n" + "	//get the color\n" + "	float xCol = (uv.x - (time / 3.0)) * 3.0;\n" + "	xCol = mod(xCol, 3.0);\n" + "	vec3 horColour = vec3(sin(time*2.99)*1.25, sin(time*3.111)*0.25, sin(time*1.31)*0.25);\n" + "	\n" + "	if (xCol < .1) {\n" + "		\n" + "		horColour.r += 1.0 - xCol;\n" + "		horColour.g += xCol;\n" + "	}\n" + "	else if (xCol < 0.4) {\n" + "		\n" + "		xCol -= 1.0;\n" + "		horColour.g += 1.0 - xCol;\n" + "		horColour.b += xCol;\n" + "	}\n" + "	else {\n" + "		\n" + "		xCol -= 2.0;\n" + "		horColour.b += 1.0 - xCol;\n" + "		horColour.r += xCol;\n" + "	}\n" + "\n" + "	// draw color beam\n" + "	uv = (3.0 * uv) - abs(sin(time));\n" + "	float beamWidth = .0+1.1*abs((sin(time)*0.2*2.0) / (3.0 * uv.x * uv.y));\n" + "	vec3 horBeam = vec3(beamWidth);\n" + "	gl_FragColor = vec4((( horBeam) * horColour), 1.0);\n" + "}\n";

cc._RFpop();
},{}],"ccShader_Effect16_Frag":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'f4aebLLFhdN557oA8Wg0n81', 'ccShader_Effect16_Frag');
// Shaders/ccShader_Effect16_Frag.js

module.exports = "#ifdef GL_ES\n" + "precision mediump float;\n" + "#endif\n" + "\n" + "uniform float time;\n" + "uniform vec2 mouse_touch;\n" + "uniform vec2 resolution;\n" + "\n" + "void main( void ) {\n" + "\n" + "	vec2 p = (2.0*gl_FragCoord.xy-resolution.xy)/resolution.y;\n" + "    float tau = 3.1415926535;\n" + "    float a = sin(time);\n" + "    float r = length(p)*0.75;\n" + "    vec2 uv = vec2(a/tau,r);\n" + "	\n" + "	//get the color\n" + "	float xCol = (uv.x - (time / 3.0)) * 3.0;\n" + "	xCol = mod(xCol, 3.0);\n" + "	vec3 horColour = vec3(sin(time*2.99)*1.25, sin(time*3.111)*0.25, sin(time*1.31)*0.25);\n" + "	\n" + "	if (xCol < .1) {\n" + "		\n" + "		horColour.r += 1.0 - xCol;\n" + "		horColour.g += xCol;\n" + "	}\n" + "	else if (xCol < 0.4) {\n" + "		\n" + "		xCol -= 1.0;\n" + "		horColour.g += 1.0 - xCol;\n" + "		horColour.b += xCol;\n" + "	}\n" + "	else {\n" + "		\n" + "		xCol -= 2.0;\n" + "		horColour.b += 1.0 - xCol;\n" + "		horColour.r += xCol;\n" + "	}\n" + "\n" + "	// draw color beam\n" + "	uv = (3.0 * uv) - abs(sin(time));\n" + "	float beamWidth = .0+1.1*abs((sin(time)*0.2*2.0) / (3.0 * uv.x * uv.y));\n" + "	vec3 horBeam = vec3(beamWidth);\n" + "	gl_FragColor = vec4((( horBeam) * horColour), 1.0);\n" + "}\n";

cc._RFpop();
},{}],"ccShader_Effect17_Frag":[function(require,module,exports){
"use strict";
cc._RFpush(module, '48e3eZYP9RNpZOS851K5qfu', 'ccShader_Effect17_Frag');
// Shaders/ccShader_Effect17_Frag.js

module.exports = "#ifdef GL_ES\n" + "precision mediump float;\n" + "#endif\n" + "\n" + "uniform float time;\n" + "uniform vec2 mouse_touch;\n" + "uniform vec2 resolution;\n" + "\n" + "void main( void ) {\n" + "\n" + "	vec2 p = (2.0*gl_FragCoord.xy-resolution.xy)/resolution.y;\n" + "    float tau = 3.1415926535;\n" + "    float a = sin(time);\n" + "    float r = length(p)*0.75;\n" + "    vec2 uv = vec2(a/tau,r);\n" + "	\n" + "	//get the color\n" + "	float xCol = (uv.x - (time / 3.0)) * 3.0;\n" + "	xCol = mod(xCol, 3.0);\n" + "	vec3 horColour = vec3(sin(time*2.99)*1.25, sin(time*3.111)*0.25, sin(time*1.31)*0.25);\n" + "	\n" + "	if (xCol < .1) {\n" + "		\n" + "		horColour.r += 1.0 - xCol;\n" + "		horColour.g += xCol;\n" + "	}\n" + "	else if (xCol < 0.4) {\n" + "		\n" + "		xCol -= 1.0;\n" + "		horColour.g += 1.0 - xCol;\n" + "		horColour.b += xCol;\n" + "	}\n" + "	else {\n" + "		\n" + "		xCol -= 2.0;\n" + "		horColour.b += 1.0 - xCol;\n" + "		horColour.r += xCol;\n" + "	}\n" + "\n" + "	// draw color beam\n" + "	uv = (3.0 * uv) - abs(sin(time));\n" + "	float beamWidth = .0+1.1*abs((sin(time)*0.2*2.0) / (3.0 * uv.x * uv.y));\n" + "	vec3 horBeam = vec3(beamWidth);\n" + "	gl_FragColor = vec4((( horBeam) * horColour), 1.0);\n" + "}\n";

cc._RFpop();
},{}],"ccShader_Effect18_Frag":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'aa0d2RVclNAmrUu49h43eaX', 'ccShader_Effect18_Frag');
// Shaders/ccShader_Effect18_Frag.js

module.exports = "#ifdef GL_ES\n" + "precision mediump float;\n" + "#endif\n" + "\n" + "uniform float time;\n" + "uniform vec2 mouse_touch;\n" + "uniform vec2 resolution;\n" + "\n" + "void main( void ) {\n" + "\n" + "	vec2 p = (2.0*gl_FragCoord.xy-resolution.xy)/resolution.y;\n" + "    float tau = 3.1415926535;\n" + "    float a = sin(time);\n" + "    float r = length(p)*0.75;\n" + "    vec2 uv = vec2(a/tau,r);\n" + "	\n" + "	//get the color\n" + "	float xCol = (uv.x - (time / 3.0)) * 3.0;\n" + "	xCol = mod(xCol, 3.0);\n" + "	vec3 horColour = vec3(sin(time*2.99)*1.25, sin(time*3.111)*0.25, sin(time*1.31)*0.25);\n" + "	\n" + "	if (xCol < .1) {\n" + "		\n" + "		horColour.r += 1.0 - xCol;\n" + "		horColour.g += xCol;\n" + "	}\n" + "	else if (xCol < 0.4) {\n" + "		\n" + "		xCol -= 1.0;\n" + "		horColour.g += 1.0 - xCol;\n" + "		horColour.b += xCol;\n" + "	}\n" + "	else {\n" + "		\n" + "		xCol -= 2.0;\n" + "		horColour.b += 1.0 - xCol;\n" + "		horColour.r += xCol;\n" + "	}\n" + "\n" + "	// draw color beam\n" + "	uv = (3.0 * uv) - abs(sin(time));\n" + "	float beamWidth = .0+1.1*abs((sin(time)*0.2*2.0) / (3.0 * uv.x * uv.y));\n" + "	vec3 horBeam = vec3(beamWidth);\n" + "	gl_FragColor = vec4((( horBeam) * horColour), 1.0);\n" + "}\n";

cc._RFpop();
},{}],"ccShader_Effect19_Frag":[function(require,module,exports){
"use strict";
cc._RFpush(module, '3f0caZJRIdK+qKLFdUFaXpm', 'ccShader_Effect19_Frag');
// Shaders/ccShader_Effect19_Frag.js

module.exports = "#ifdef GL_ES\n" + "precision mediump float;\n" + "#endif\n" + "\n" + "uniform float time;\n" + "uniform vec2 mouse_touch;\n" + "uniform vec2 resolution;\n" + "\n" + "void main( void ) {\n" + "\n" + "	vec2 p = (2.0*gl_FragCoord.xy-resolution.xy)/resolution.y;\n" + "    float tau = 3.1415926535;\n" + "    float a = sin(time);\n" + "    float r = length(p)*0.75;\n" + "    vec2 uv = vec2(a/tau,r);\n" + "	\n" + "	//get the color\n" + "	float xCol = (uv.x - (time / 3.0)) * 3.0;\n" + "	xCol = mod(xCol, 3.0);\n" + "	vec3 horColour = vec3(sin(time*2.99)*1.25, sin(time*3.111)*0.25, sin(time*1.31)*0.25);\n" + "	\n" + "	if (xCol < .1) {\n" + "		\n" + "		horColour.r += 1.0 - xCol;\n" + "		horColour.g += xCol;\n" + "	}\n" + "	else if (xCol < 0.4) {\n" + "		\n" + "		xCol -= 1.0;\n" + "		horColour.g += 1.0 - xCol;\n" + "		horColour.b += xCol;\n" + "	}\n" + "	else {\n" + "		\n" + "		xCol -= 2.0;\n" + "		horColour.b += 1.0 - xCol;\n" + "		horColour.r += xCol;\n" + "	}\n" + "\n" + "	// draw color beam\n" + "	uv = (3.0 * uv) - abs(sin(time));\n" + "	float beamWidth = .0+1.1*abs((sin(time)*0.2*2.0) / (3.0 * uv.x * uv.y));\n" + "	vec3 horBeam = vec3(beamWidth);\n" + "	gl_FragColor = vec4((( horBeam) * horColour), 1.0);\n" + "}\n";

cc._RFpop();
},{}],"ccShader_Effect20_Frag":[function(require,module,exports){
"use strict";
cc._RFpush(module, '93269ZgKcxB5YnfSg1kvLXo', 'ccShader_Effect20_Frag');
// Shaders/ccShader_Effect20_Frag.js

module.exports = "#ifdef GL_ES\n" + "precision mediump float;\n" + "#endif\n" + "\n" + "uniform float time;\n" + "uniform vec2 mouse_touch;\n" + "uniform vec2 resolution;\n" + "\n" + "void main( void ) {\n" + "\n" + "	vec2 p = (2.0*gl_FragCoord.xy-resolution.xy)/resolution.y;\n" + "    float tau = 3.1415926535;\n" + "    float a = sin(time);\n" + "    float r = length(p)*0.75;\n" + "    vec2 uv = vec2(a/tau,r);\n" + "	\n" + "	//get the color\n" + "	float xCol = (uv.x - (time / 3.0)) * 3.0;\n" + "	xCol = mod(xCol, 3.0);\n" + "	vec3 horColour = vec3(sin(time*2.99)*1.25, sin(time*3.111)*0.25, sin(time*1.31)*0.25);\n" + "	\n" + "	if (xCol < .1) {\n" + "		\n" + "		horColour.r += 1.0 - xCol;\n" + "		horColour.g += xCol;\n" + "	}\n" + "	else if (xCol < 0.4) {\n" + "		\n" + "		xCol -= 1.0;\n" + "		horColour.g += 1.0 - xCol;\n" + "		horColour.b += xCol;\n" + "	}\n" + "	else {\n" + "		\n" + "		xCol -= 2.0;\n" + "		horColour.b += 1.0 - xCol;\n" + "		horColour.r += xCol;\n" + "	}\n" + "\n" + "	// draw color beam\n" + "	uv = (3.0 * uv) - abs(sin(time));\n" + "	float beamWidth = .0+1.1*abs((sin(time)*0.2*2.0) / (3.0 * uv.x * uv.y));\n" + "	vec3 horBeam = vec3(beamWidth);\n" + "	gl_FragColor = vec4((( horBeam) * horColour), 1.0);\n" + "}\n";

cc._RFpop();
},{}],"ccShader_Effect21_Frag":[function(require,module,exports){
"use strict";
cc._RFpush(module, '7291cxHbBRKfrICceR2AM7l', 'ccShader_Effect21_Frag');
// Shaders/ccShader_Effect21_Frag.js

module.exports = "#ifdef GL_ES\n" + "precision mediump float;\n" + "#endif\n" + "\n" + "uniform float time;\n" + "uniform vec2 mouse_touch;\n" + "uniform vec2 resolution;\n" + "\n" + "void main( void ) {\n" + "\n" + "	vec2 p = (2.0*gl_FragCoord.xy-resolution.xy)/resolution.y;\n" + "    float tau = 3.1415926535;\n" + "    float a = sin(time);\n" + "    float r = length(p)*0.75;\n" + "    vec2 uv = vec2(a/tau,r);\n" + "	\n" + "	//get the color\n" + "	float xCol = (uv.x - (time / 3.0)) * 3.0;\n" + "	xCol = mod(xCol, 3.0);\n" + "	vec3 horColour = vec3(sin(time*2.99)*1.25, sin(time*3.111)*0.25, sin(time*1.31)*0.25);\n" + "	\n" + "	if (xCol < .1) {\n" + "		\n" + "		horColour.r += 1.0 - xCol;\n" + "		horColour.g += xCol;\n" + "	}\n" + "	else if (xCol < 0.4) {\n" + "		\n" + "		xCol -= 1.0;\n" + "		horColour.g += 1.0 - xCol;\n" + "		horColour.b += xCol;\n" + "	}\n" + "	else {\n" + "		\n" + "		xCol -= 2.0;\n" + "		horColour.b += 1.0 - xCol;\n" + "		horColour.r += xCol;\n" + "	}\n" + "\n" + "	// draw color beam\n" + "	uv = (3.0 * uv) - abs(sin(time));\n" + "	float beamWidth = .0+1.1*abs((sin(time)*0.2*2.0) / (3.0 * uv.x * uv.y));\n" + "	vec3 horBeam = vec3(beamWidth);\n" + "	gl_FragColor = vec4((( horBeam) * horColour), 1.0);\n" + "}\n";

cc._RFpop();
},{}],"ccShader_Effect22_Frag":[function(require,module,exports){
"use strict";
cc._RFpush(module, '6b6e7jjbSZPOrs9d/QW0pfz', 'ccShader_Effect22_Frag');
// Shaders/ccShader_Effect22_Frag.js

module.exports = "#ifdef GL_ES\n" + "precision mediump float;\n" + "#endif\n" + "\n" + "uniform float time;\n" + "uniform vec2 mouse_touch;\n" + "uniform vec2 resolution;\n" + "\n" + "void main( void ) {\n" + "\n" + "	vec2 p = (2.0*gl_FragCoord.xy-resolution.xy)/resolution.y;\n" + "    float tau = 3.1415926535;\n" + "    float a = sin(time);\n" + "    float r = length(p)*0.75;\n" + "    vec2 uv = vec2(a/tau,r);\n" + "	\n" + "	//get the color\n" + "	float xCol = (uv.x - (time / 3.0)) * 3.0;\n" + "	xCol = mod(xCol, 3.0);\n" + "	vec3 horColour = vec3(sin(time*2.99)*1.25, sin(time*3.111)*0.25, sin(time*1.31)*0.25);\n" + "	\n" + "	if (xCol < .1) {\n" + "		\n" + "		horColour.r += 1.0 - xCol;\n" + "		horColour.g += xCol;\n" + "	}\n" + "	else if (xCol < 0.4) {\n" + "		\n" + "		xCol -= 1.0;\n" + "		horColour.g += 1.0 - xCol;\n" + "		horColour.b += xCol;\n" + "	}\n" + "	else {\n" + "		\n" + "		xCol -= 2.0;\n" + "		horColour.b += 1.0 - xCol;\n" + "		horColour.r += xCol;\n" + "	}\n" + "\n" + "	// draw color beam\n" + "	uv = (3.0 * uv) - abs(sin(time));\n" + "	float beamWidth = .0+1.1*abs((sin(time)*0.2*2.0) / (3.0 * uv.x * uv.y));\n" + "	vec3 horBeam = vec3(beamWidth);\n" + "	gl_FragColor = vec4((( horBeam) * horColour), 1.0);\n" + "}\n";

cc._RFpop();
},{}],"ccShader_Effect23_Frag":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'c0ba1XrfdRMioGSF+yQ6WDZ', 'ccShader_Effect23_Frag');
// Shaders/ccShader_Effect23_Frag.js

module.exports = "#ifdef GL_ES\n" + "precision mediump float;\n" + "#endif\n" + "\n" + "uniform float time;\n" + "uniform vec2 mouse_touch;\n" + "uniform vec2 resolution;\n" + "\n" + "void main( void ) {\n" + "\n" + "	vec2 p = (2.0*gl_FragCoord.xy-resolution.xy)/resolution.y;\n" + "    float tau = 3.1415926535;\n" + "    float a = sin(time);\n" + "    float r = length(p)*0.75;\n" + "    vec2 uv = vec2(a/tau,r);\n" + "	\n" + "	//get the color\n" + "	float xCol = (uv.x - (time / 3.0)) * 3.0;\n" + "	xCol = mod(xCol, 3.0);\n" + "	vec3 horColour = vec3(sin(time*2.99)*1.25, sin(time*3.111)*0.25, sin(time*1.31)*0.25);\n" + "	\n" + "	if (xCol < .1) {\n" + "		\n" + "		horColour.r += 1.0 - xCol;\n" + "		horColour.g += xCol;\n" + "	}\n" + "	else if (xCol < 0.4) {\n" + "		\n" + "		xCol -= 1.0;\n" + "		horColour.g += 1.0 - xCol;\n" + "		horColour.b += xCol;\n" + "	}\n" + "	else {\n" + "		\n" + "		xCol -= 2.0;\n" + "		horColour.b += 1.0 - xCol;\n" + "		horColour.r += xCol;\n" + "	}\n" + "\n" + "	// draw color beam\n" + "	uv = (3.0 * uv) - abs(sin(time));\n" + "	float beamWidth = .0+1.1*abs((sin(time)*0.2*2.0) / (3.0 * uv.x * uv.y));\n" + "	vec3 horBeam = vec3(beamWidth);\n" + "	gl_FragColor = vec4((( horBeam) * horColour), 1.0);\n" + "}\n";

cc._RFpop();
},{}],"ccShader_Effect24_Frag":[function(require,module,exports){
"use strict";
cc._RFpush(module, '87a77ik1PBP2IUk/+6lBR5B', 'ccShader_Effect24_Frag');
// Shaders/ccShader_Effect24_Frag.js

module.exports = "#ifdef GL_ES\n" + "precision mediump float;\n" + "#endif\n" + "\n" + "uniform float time;\n" + "uniform vec2 mouse_touch;\n" + "uniform vec2 resolution;\n" + "\n" + "void main( void ) {\n" + "\n" + "	vec2 p = (2.0*gl_FragCoord.xy-resolution.xy)/resolution.y;\n" + "    float tau = 3.1415926535;\n" + "    float a = sin(time);\n" + "    float r = length(p)*0.75;\n" + "    vec2 uv = vec2(a/tau,r);\n" + "	\n" + "	//get the color\n" + "	float xCol = (uv.x - (time / 3.0)) * 3.0;\n" + "	xCol = mod(xCol, 3.0);\n" + "	vec3 horColour = vec3(sin(time*2.99)*1.25, sin(time*3.111)*0.25, sin(time*1.31)*0.25);\n" + "	\n" + "	if (xCol < .1) {\n" + "		\n" + "		horColour.r += 1.0 - xCol;\n" + "		horColour.g += xCol;\n" + "	}\n" + "	else if (xCol < 0.4) {\n" + "		\n" + "		xCol -= 1.0;\n" + "		horColour.g += 1.0 - xCol;\n" + "		horColour.b += xCol;\n" + "	}\n" + "	else {\n" + "		\n" + "		xCol -= 2.0;\n" + "		horColour.b += 1.0 - xCol;\n" + "		horColour.r += xCol;\n" + "	}\n" + "\n" + "	// draw color beam\n" + "	uv = (3.0 * uv) - abs(sin(time));\n" + "	float beamWidth = .0+1.1*abs((sin(time)*0.2*2.0) / (3.0 * uv.x * uv.y));\n" + "	vec3 horBeam = vec3(beamWidth);\n" + "	gl_FragColor = vec4((( horBeam) * horColour), 1.0);\n" + "}\n";

cc._RFpop();
},{}],"ccShader_Effect25_Frag":[function(require,module,exports){
"use strict";
cc._RFpush(module, '4ccd3bZL3NNYpm1Rtti0gXn', 'ccShader_Effect25_Frag');
// Shaders/ccShader_Effect25_Frag.js

module.exports = "#ifdef GL_ES\n" + "precision mediump float;\n" + "#endif\n" + "\n" + "uniform float time;\n" + "uniform vec2 mouse_touch;\n" + "uniform vec2 resolution;\n" + "\n" + "void main( void ) {\n" + "\n" + "	vec2 p = (2.0*gl_FragCoord.xy-resolution.xy)/resolution.y;\n" + "    float tau = 3.1415926535;\n" + "    float a = sin(time);\n" + "    float r = length(p)*0.75;\n" + "    vec2 uv = vec2(a/tau,r);\n" + "	\n" + "	//get the color\n" + "	float xCol = (uv.x - (time / 3.0)) * 3.0;\n" + "	xCol = mod(xCol, 3.0);\n" + "	vec3 horColour = vec3(sin(time*2.99)*1.25, sin(time*3.111)*0.25, sin(time*1.31)*0.25);\n" + "	\n" + "	if (xCol < .1) {\n" + "		\n" + "		horColour.r += 1.0 - xCol;\n" + "		horColour.g += xCol;\n" + "	}\n" + "	else if (xCol < 0.4) {\n" + "		\n" + "		xCol -= 1.0;\n" + "		horColour.g += 1.0 - xCol;\n" + "		horColour.b += xCol;\n" + "	}\n" + "	else {\n" + "		\n" + "		xCol -= 2.0;\n" + "		horColour.b += 1.0 - xCol;\n" + "		horColour.r += xCol;\n" + "	}\n" + "\n" + "	// draw color beam\n" + "	uv = (3.0 * uv) - abs(sin(time));\n" + "	float beamWidth = .0+1.1*abs((sin(time)*0.2*2.0) / (3.0 * uv.x * uv.y));\n" + "	vec3 horBeam = vec3(beamWidth);\n" + "	gl_FragColor = vec4((( horBeam) * horColour), 1.0);\n" + "}\n";

cc._RFpop();
},{}],"ccShader_Effect26_Frag":[function(require,module,exports){
"use strict";
cc._RFpush(module, '3c3aeSlArlMpob/rnv37DU6', 'ccShader_Effect26_Frag');
// Shaders/ccShader_Effect26_Frag.js

module.exports = "#ifdef GL_ES\n" + "precision mediump float;\n" + "#endif\n" + "\n" + "uniform float time;\n" + "uniform vec2 mouse_touch;\n" + "uniform vec2 resolution;\n" + "\n" + "void main( void ) {\n" + "\n" + "	vec2 p = (2.0*gl_FragCoord.xy-resolution.xy)/resolution.y;\n" + "    float tau = 3.1415926535;\n" + "    float a = sin(time);\n" + "    float r = length(p)*0.75;\n" + "    vec2 uv = vec2(a/tau,r);\n" + "	\n" + "	//get the color\n" + "	float xCol = (uv.x - (time / 3.0)) * 3.0;\n" + "	xCol = mod(xCol, 3.0);\n" + "	vec3 horColour = vec3(sin(time*2.99)*1.25, sin(time*3.111)*0.25, sin(time*1.31)*0.25);\n" + "	\n" + "	if (xCol < .1) {\n" + "		\n" + "		horColour.r += 1.0 - xCol;\n" + "		horColour.g += xCol;\n" + "	}\n" + "	else if (xCol < 0.4) {\n" + "		\n" + "		xCol -= 1.0;\n" + "		horColour.g += 1.0 - xCol;\n" + "		horColour.b += xCol;\n" + "	}\n" + "	else {\n" + "		\n" + "		xCol -= 2.0;\n" + "		horColour.b += 1.0 - xCol;\n" + "		horColour.r += xCol;\n" + "	}\n" + "\n" + "	// draw color beam\n" + "	uv = (3.0 * uv) - abs(sin(time));\n" + "	float beamWidth = .0+1.1*abs((sin(time)*0.2*2.0) / (3.0 * uv.x * uv.y));\n" + "	vec3 horBeam = vec3(beamWidth);\n" + "	gl_FragColor = vec4((( horBeam) * horColour), 1.0);\n" + "}\n";

cc._RFpop();
},{}],"ccShader_Emboss_Frag":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'ac442tsTRdFYpIFqGfHWzCV', 'ccShader_Emboss_Frag');
// Shaders/ccShader_Emboss_Frag.js

/* 浮雕 */

module.exports = "precision mediump float;\n" + "varying vec2 v_texCoord;\n" + "uniform float widthStep;\n" + "uniform float heightStep;\n" + "const float stride = 2.0;\n" + "void main()\n" + "{\n" + "    vec3 tmpColor = texture2D(CC_Texture0, v_texCoord + vec2(widthStep * stride, heightStep * stride)).rgb;\n" + "    tmpColor = texture2D(CC_Texture0, v_texCoord).rgb - tmpColor + 0.5;\n" + "    float f = (tmpColor.r + tmpColor.g + tmpColor.b) / 3.0;\n" + "    gl_FragColor = vec4(f, f, f, 1.0);\n" + "}\n";

cc._RFpop();
},{}],"ccShader_Glass_Frag":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'd224fzmSIhPOo16XoV1xpYS', 'ccShader_Glass_Frag');
// Shaders/ccShader_Glass_Frag.js

/* 磨砂玻璃 1.0 */
/* 磨砂玻璃 3.0 */
/* 磨砂玻璃 6.0 */

module.exports = "precision mediump float;\n" + "varying vec2 v_texCoord;\n" + "uniform float widthStep;\n" + "uniform float heightStep;\n" + "uniform float blurRadiusScale;\n" + "const float blurRadius = 6.0;\n" + "const float blurPixels = (blurRadius * 2.0 + 1.0) * (blurRadius * 2.0 + 1.0);\n" + "float random(vec3 scale, float seed) {\n" + "    return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);\n" + "}\n" + "void main()\n" + "{\n" + "    vec3 sumColor = vec3(0.0, 0.0, 0.0);\n" + "    for(float fy = -blurRadius; fy <= blurRadius; ++fy)\n" + "    {\n" + "        float dir = random(vec3(12.9898, 78.233, 151.7182), 0.0);\n" + "        for(float fx = -blurRadius; fx <= blurRadius; ++fx)\n" + "        {\n" + "            float dis = distance(vec2(fx * widthStep, fy * heightStep), vec2(0.0, 0.0)) * blurRadiusScale;\n" + "            vec2 coord = vec2(dis * cos(dir), dis * sin(dir));\n" + "            sumColor += texture2D(CC_Texture0, v_texCoord + coord).rgb;\n" + "        }\n" + "    }\n" + "    gl_FragColor = vec4(sumColor / blurPixels, 1.0);\n" + "}\n";

cc._RFpop();
},{}],"ccShader_Gray_Frag":[function(require,module,exports){
"use strict";
cc._RFpush(module, '73888xoJwVIWrhZc5ygaWzE', 'ccShader_Gray_Frag');
// Shaders/ccShader_Gray_Frag.js

/* 灰度 */

module.exports = "precision mediump float;\n" + "varying vec2 v_texCoord;\n" + "void main()\n" + "{\n" + "    vec3 v = texture2D(CC_Texture0, v_texCoord).rgb;\n" + "    float f = v.r * 0.299 + v.g * 0.587 + v.b * 0.114;\n" + "    gl_FragColor = vec4(f, f, f, 1.0);\n" + "}\n";

cc._RFpop();
},{}],"ccShader_LightEffect_Frag":[function(require,module,exports){
"use strict";
cc._RFpush(module, '96c33w025dFXoQ0Enyk0Zq4', 'ccShader_LightEffect_Frag');
// Shaders/ccShader_LightEffect_Frag.js

module.exports = "precision mediump float;\n" + "varying vec2 v_texCoord;\n" + "uniform float time;\n" + "uniform vec2 mouse_touch;\n" + "uniform vec2 resolution;\n" + "const float minRStart = -2.0;\n" + "const float maxRStart = 1.0;\n" + "const float minIStart = -1.0;\n" + "const float maxIStart = 1.0;\n" + "const int maxIterations = 50;\n" + "// Immaginary number: has a real and immaginary part\n" + "struct complexNumber\n" + "{\n" + "	float r;\n" + "	float i;\n" + "};\n" + "void main( void ) {\n" + "	float minR = minRStart; // change these in order to zoom\n" + "	float maxR = maxRStart;\n" + "	float minI = minIStart;\n" + "	float maxI = maxIStart;\n" + "	\n" + "	vec3 col = vec3(0,0,0);\n" + "	\n" + "	vec2 pos = gl_FragCoord.xy / resolution;\n" + "	\n" + "	// The complex number of the current pixel.\n" + "	complexNumber im;\n" + "	im.r = minR + (maxR-minR)*pos.x; // LERP within range\n" + "	im.i = minI + (maxI-minI)*pos.y;\n" + "	\n" + "	complexNumber z;\n" + "	z.r = im.r;\n" + "	z.i = im.i;\n" + "	\n" + "	bool def = true; // is the number (im) definite?\n" + "	int iterations = 0;\n" + "	for(int i = 0; i< maxIterations; i++)\n" + "	{\n" + "		if(sqrt(z.r*z.r + z.i*z.i) > 2.0) // abs(z) = distance from origo\n" + "		{\n" + "			def = false;\n" + "			iterations = i; \n" + "			break;\n" + "		}\n" + "		// Mandelbrot formula: zNew = zOld*zOld + im\n" + "		// z = (a+bi) => z*z = (a+bi)(a+bi) = a*a - b*b + 2abi\n" + "		complexNumber zSquared; \n" + "		zSquared.r = z.r*z.r - z.i*z.i; // real part: a*a - b*b\n" + "		zSquared.i = 2.0*z.r*z.i; // immaginary part: 2abi\n" + "		// add: rSquared + im -> simple: just add the real and immaginary parts\n" + "		z.r = zSquared.r + im.r; // add real parts\n" + "		z.i = zSquared.i + im.i; // add immaginary parts\n" + "	}\n" + "	if(def) // it is definite => colour it black\n" + "		col.rgb = vec3(0,0,0);\n" + "	else // the number grows to infinity => colour it by the number of iterations \n" + "	{\n" + "		float i = float(iterations)/float(maxIterations);\n" + "		col.r = smoothstep(0.0,0.5, i);\n" + "		col.g = smoothstep(0.0,1.0,i);\n" + "		col.b = smoothstep(0.3,1.0, i);\n" + "	}\n" + "	gl_FragColor.rgb = col;\n" + "}\n";

cc._RFpop();
},{}],"ccShader_Negative_Black_White_Frag":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'c783ciGjChFwIKrWgxxqcIf', 'ccShader_Negative_Black_White_Frag');
// Shaders/ccShader_Negative_Black_White_Frag.js

/* 底片黑白 */

module.exports = "precision mediump float;\n" + "varying vec2 v_texCoord;\n" + "void main()\n" + "{\n" + "    vec3 v = texture2D(CC_Texture0, v_texCoord).rgb;\n" + "    float f = 1.0 - (v.r * 0.3 + v.g * 0.59 + v.b * 0.11);\n" + "    gl_FragColor = vec4(f, f, f, 1.0);\n" + "}\n";

cc._RFpop();
},{}],"ccShader_Negative_Image_Frag":[function(require,module,exports){
"use strict";
cc._RFpush(module, '22b86QwDe9ALLPEMFzEr7/I', 'ccShader_Negative_Image_Frag');
// Shaders/ccShader_Negative_Image_Frag.js

/* 底片镜像 */

module.exports = "precision mediump float;\n" + "varying vec2 v_texCoord;\n" + "void main()\n" + "{\n" + "	gl_FragColor = vec4(1.0 - texture2D(CC_Texture0, v_texCoord).rgb, 1.0);\n" + "}\n";

cc._RFpop();
},{}],"ccShader_Shadow_Black_White_Frag":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'c272evTobpLioVcZ8YURnWQ', 'ccShader_Shadow_Black_White_Frag');
// Shaders/ccShader_Shadow_Black_White_Frag.js

/* 渐变黑白 */

module.exports = "precision mediump float;\n" + "varying vec2 v_texCoord;\n" + "uniform float strength;\n" + "void main()\n" + "{\n" + "    vec3 v = texture2D(CC_Texture0, v_texCoord).rgb;\n" + "    float f = step(strength, (v.r + v.g + v.b) / 3.0 );\n" + "    gl_FragColor = vec4(f, f, f, 1.0);\n" + "}\n";

cc._RFpop();
},{}],"ccShader_Wave_H_Frag":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'e6a51LGYIZEC7V61j5KigmH', 'ccShader_Wave_H_Frag');
// Shaders/ccShader_Wave_H_Frag.js

/* 水平波浪 */

module.exports = "precision mediump float;\n" + "varying vec2 v_texCoord;\n" + "uniform float motion;\n" + "uniform float angle;\n" + "void main()\n" + "{\n" + "    vec2 tmp = v_texCoord;\n" + "    tmp.x = tmp.x + 0.05 * sin(motion +  tmp.y * angle);\n" + "    gl_FragColor = texture2D(CC_Texture0, tmp);\n" + "}\n";

cc._RFpop();
},{}],"ccShader_Wave_VH_Frag":[function(require,module,exports){
"use strict";
cc._RFpush(module, '703e1K3oelM04GGxclzJPPK', 'ccShader_Wave_VH_Frag');
// Shaders/ccShader_Wave_VH_Frag.js

/* 全局波浪 */

module.exports = "precision mediump float;\n" + "varying vec2 v_texCoord;\n" + "uniform float motion;\n" + "uniform float angle;\n" + "void main()\n" + "{\n" + "    vec2 tmp = v_texCoord;\n" + "    tmp.x = tmp.x + 0.01 * sin(motion +  tmp.x * angle);\n" + "    tmp.y = tmp.y + 0.01 * sin(motion +  tmp.y * angle);\n" + "    gl_FragColor = texture2D(CC_Texture0, tmp);\n" + "}\n";

cc._RFpop();
},{}],"ccShader_Wave_V_Frag":[function(require,module,exports){
"use strict";
cc._RFpush(module, '035c51ilq5E5K0vR8gxJk63', 'ccShader_Wave_V_Frag');
// Shaders/ccShader_Wave_V_Frag.js

/* 垂直波浪 */

module.exports = "precision mediump float;\n" + "varying vec2 v_texCoord;\n" + "uniform float motion;\n" + "uniform float angle;\n" + "void main()\n" + "{\n" + "    vec2 tmp = v_texCoord;\n" + "    tmp.y = tmp.y + 0.05 * sin(motion +  tmp.x * angle);\n" + "    gl_FragColor = texture2D(CC_Texture0, tmp);\n" + "}\n";

cc._RFpop();
},{}],"ccShader_lightningBolt_Frag":[function(require,module,exports){
"use strict";
cc._RFpush(module, '294banLxhNOnZhlfOvlwtIA', 'ccShader_lightningBolt_Frag');
// Shaders/ccShader_lightningBolt_Frag.js

module.exports = "#ifdef GL_ES\n" + "precision mediump float;\n" + "#endif\n" + "\n" + "varying vec2 v_texCoord;\n" + "varying vec4 v_color;\n" + "//uniform sampler2D CC_Texture0;\n" + "uniform float u_opacity;\n" + "\n" + "void main() {\n" + "    vec4 texColor=texture2D(CC_Texture0, v_texCoord);\n" + "    gl_FragColor=texColor*v_color*u_opacity;\n" + "}\n";

cc._RFpop();
},{}],"ccShader_lightningBolt_Vert":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'd9877mSE59O4r/jBxSp0Kwo', 'ccShader_lightningBolt_Vert');
// Shaders/ccShader_lightningBolt_Vert.js

module.exports = "attribute vec4 a_position;\n" + "attribute vec2 a_texCoord;\n" + "attribute vec4 a_color;\n" + "varying vec2 v_texCoord;\n" + "varying vec4 v_color;\n" + "\n" + "\n" + "void main()\n" + "{\n" + "    vec4 pos=vec4(a_position.xy,0,1);\n" + "    gl_Position = CC_MVPMatrix * pos;\n" + "    v_texCoord = a_texCoord;\n" + "    v_color = a_color;\n" + "    \n" + "}\n";

cc._RFpop();
},{}]},{},["ccShader_Effect04_Frag","ccShader_Wave_V_Frag","ccShader_Effect06_Frag","EffectManager","Effect20","ccShader_Effect03_Frag","Negative_Image","ccShader_Effect14_Frag","ccShader_Circle_Effect2_Frag","Effect13","ccShader_Avg_Black_White_Frag","Effect12","ccShader_Negative_Image_Frag","ccShader_lightningBolt_Frag","UIManager","ccShader_Effect08_Frag","Effect15","LightningBolt","ccShader_Effect05_Frag","ccShader_Effect26_Frag","ccShader_Effect19_Frag","Avg_Black_White","ccShader_Effect13_Frag","ccShader_Default_Vert_noMVP","ccShader_Default_Vert","ccShader_Effect17_Frag","Glass","ccShader_Effect25_Frag","EffectCommon","Effect14","Negative_Black_White","Effect06","LightEffet","Wave_V","ccShader_Effect22_Frag","ccShader_Wave_VH_Frag","ccShader_Effect21_Frag","ccShader_Gray_Frag","Shadow_Black_White","Effect07","Effect04","ccShader_Circle_Light_Frag","Effect03","Effect08","Effect17","ccShader_Effect24_Frag","Effect05","ccShader_Blur_Edge_Detail_Frag","ccShader_Effect07_Frag","ccShader_Effect20_Frag","ccShader_Effect09_Frag","CircleEffect2","Effect","Emboss","ccShader_LightEffect_Frag","Effect16","ccShader_Effect18_Frag","ccShader_Emboss_Frag","Wave_VH","Effect11","Wave_H","Effect19","Gray","ccShader_Effect23_Frag","ccShader_Shadow_Black_White_Frag","Effect10","CircleLight","Glass2","ccShader_Negative_Black_White_Frag","ccShader_Glass_Frag","ccShader_lightningBolt_Vert","ccShader_Effect15_Frag","Blur_Edge_Detail","ccShader_Effect11_Frag","ccShader_Wave_H_Frag","EffectForShaderToy","ccShader_Effect16_Frag","Effect09","ccShader_Effect12_Frag","ccShader_Effect10_Frag","Effect18"])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL0FwcGxpY2F0aW9ucy9Db2Nvc0NyZWF0b3IuYXBwL0NvbnRlbnRzL1Jlc291cmNlcy9hcHAuYXNhci9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiYXNzZXRzL1NjcmlwdC9BdmdfQmxhY2tfV2hpdGUuanMiLCJhc3NldHMvU2NyaXB0L0JsdXJfRWRnZV9EZXRhaWwuanMiLCJhc3NldHMvU2NyaXB0L0NpcmNsZUVmZmVjdDIuanMiLCJhc3NldHMvU2NyaXB0L0NpcmNsZUxpZ2h0LmpzIiwiYXNzZXRzL1NjcmlwdC9FZmZlY3QwMy5qcyIsImFzc2V0cy9TY3JpcHQvRWZmZWN0MDQuanMiLCJhc3NldHMvU2NyaXB0L0VmZmVjdDA1LmpzIiwiYXNzZXRzL1NjcmlwdC9FZmZlY3QwNi5qcyIsImFzc2V0cy9TY3JpcHQvRWZmZWN0MDcuanMiLCJhc3NldHMvU2NyaXB0L0VmZmVjdDA4LmpzIiwiYXNzZXRzL1NjcmlwdC9FZmZlY3QwOS5qcyIsImFzc2V0cy9TY3JpcHQvRWZmZWN0MTAuanMiLCJhc3NldHMvU2NyaXB0L0VmZmVjdDExLmpzIiwiYXNzZXRzL1NjcmlwdC9FZmZlY3QxMi5qcyIsImFzc2V0cy9TY3JpcHQvRWZmZWN0MTMuanMiLCJhc3NldHMvU2NyaXB0L0VmZmVjdDE0LmpzIiwiYXNzZXRzL1NjcmlwdC9FZmZlY3QxNS5qcyIsImFzc2V0cy9TY3JpcHQvRWZmZWN0MTYuanMiLCJhc3NldHMvU2NyaXB0L0VmZmVjdDE3LmpzIiwiYXNzZXRzL1NjcmlwdC9FZmZlY3QxOC5qcyIsImFzc2V0cy9TY3JpcHQvRWZmZWN0MTkuanMiLCJhc3NldHMvU2NyaXB0L0VmZmVjdDIwLmpzIiwiYXNzZXRzL1NjcmlwdC9FZmZlY3RDb21tb24uanMiLCJhc3NldHMvU2NyaXB0L0VmZmVjdEZvclNoYWRlclRveS5qcyIsImFzc2V0cy9TY3JpcHQvVUkvRWZmZWN0TWFuYWdlci5qcyIsImFzc2V0cy9TY3JpcHQvRWZmZWN0LmpzIiwiYXNzZXRzL1NjcmlwdC9FbWJvc3MuanMiLCJhc3NldHMvU2NyaXB0L0dsYXNzMi5qcyIsImFzc2V0cy9TY3JpcHQvR2xhc3MuanMiLCJhc3NldHMvU2NyaXB0L0dyYXkuanMiLCJhc3NldHMvU2NyaXB0L0xpZ2h0RWZmZXQuanMiLCJhc3NldHMvU2NyaXB0L0xpZ2h0bmluZ0JvbHQuanMiLCJhc3NldHMvU2NyaXB0L05lZ2F0aXZlX0JsYWNrX1doaXRlLmpzIiwiYXNzZXRzL1NjcmlwdC9OZWdhdGl2ZV9JbWFnZS5qcyIsImFzc2V0cy9TY3JpcHQvU2hhZG93X0JsYWNrX1doaXRlLmpzIiwiYXNzZXRzL1NjcmlwdC9VSU1hbmFnZXIuanMiLCJhc3NldHMvU2NyaXB0L1dhdmVfSC5qcyIsImFzc2V0cy9TY3JpcHQvV2F2ZV9WSC5qcyIsImFzc2V0cy9TY3JpcHQvV2F2ZV9WLmpzIiwiYXNzZXRzL1NoYWRlcnMvY2NTaGFkZXJfQXZnX0JsYWNrX1doaXRlX0ZyYWcuanMiLCJhc3NldHMvU2hhZGVycy9jY1NoYWRlcl9CbHVyX0VkZ2VfRGV0YWlsX0ZyYWcuanMiLCJhc3NldHMvU2hhZGVycy9jY1NoYWRlcl9DaXJjbGVfRWZmZWN0Ml9GcmFnLmpzIiwiYXNzZXRzL1NoYWRlcnMvY2NTaGFkZXJfQ2lyY2xlX0xpZ2h0X0ZyYWcuanMiLCJhc3NldHMvU2hhZGVycy9jY1NoYWRlcl9EZWZhdWx0X1ZlcnRfbm9NVlAuanMiLCJhc3NldHMvU2hhZGVycy9jY1NoYWRlcl9EZWZhdWx0X1ZlcnQuanMiLCJhc3NldHMvU2hhZGVycy9jY1NoYWRlcl9FZmZlY3QwM19GcmFnLmpzIiwiYXNzZXRzL1NoYWRlcnMvY2NTaGFkZXJfRWZmZWN0MDRfRnJhZy5qcyIsImFzc2V0cy9TaGFkZXJzL2NjU2hhZGVyX0VmZmVjdDA1X0ZyYWcuanMiLCJhc3NldHMvU2hhZGVycy9jY1NoYWRlcl9FZmZlY3QwNl9GcmFnLmpzIiwiYXNzZXRzL1NoYWRlcnMvY2NTaGFkZXJfRWZmZWN0MDdfRnJhZy5qcyIsImFzc2V0cy9TaGFkZXJzL2NjU2hhZGVyX0VmZmVjdDA4X0ZyYWcuanMiLCJhc3NldHMvU2hhZGVycy9jY1NoYWRlcl9FZmZlY3QwOV9GcmFnLmpzIiwiYXNzZXRzL1NoYWRlcnMvY2NTaGFkZXJfRWZmZWN0MTBfRnJhZy5qcyIsImFzc2V0cy9TaGFkZXJzL2NjU2hhZGVyX0VmZmVjdDExX0ZyYWcuanMiLCJhc3NldHMvU2hhZGVycy9jY1NoYWRlcl9FZmZlY3QxMl9GcmFnLmpzIiwiYXNzZXRzL1NoYWRlcnMvY2NTaGFkZXJfRWZmZWN0MTNfRnJhZy5qcyIsImFzc2V0cy9TaGFkZXJzL2NjU2hhZGVyX0VmZmVjdDE0X0ZyYWcuanMiLCJhc3NldHMvU2hhZGVycy9jY1NoYWRlcl9FZmZlY3QxNV9GcmFnLmpzIiwiYXNzZXRzL1NoYWRlcnMvY2NTaGFkZXJfRWZmZWN0MTZfRnJhZy5qcyIsImFzc2V0cy9TaGFkZXJzL2NjU2hhZGVyX0VmZmVjdDE3X0ZyYWcuanMiLCJhc3NldHMvU2hhZGVycy9jY1NoYWRlcl9FZmZlY3QxOF9GcmFnLmpzIiwiYXNzZXRzL1NoYWRlcnMvY2NTaGFkZXJfRWZmZWN0MTlfRnJhZy5qcyIsImFzc2V0cy9TaGFkZXJzL2NjU2hhZGVyX0VmZmVjdDIwX0ZyYWcuanMiLCJhc3NldHMvU2hhZGVycy9jY1NoYWRlcl9FZmZlY3QyMV9GcmFnLmpzIiwiYXNzZXRzL1NoYWRlcnMvY2NTaGFkZXJfRWZmZWN0MjJfRnJhZy5qcyIsImFzc2V0cy9TaGFkZXJzL2NjU2hhZGVyX0VmZmVjdDIzX0ZyYWcuanMiLCJhc3NldHMvU2hhZGVycy9jY1NoYWRlcl9FZmZlY3QyNF9GcmFnLmpzIiwiYXNzZXRzL1NoYWRlcnMvY2NTaGFkZXJfRWZmZWN0MjVfRnJhZy5qcyIsImFzc2V0cy9TaGFkZXJzL2NjU2hhZGVyX0VmZmVjdDI2X0ZyYWcuanMiLCJhc3NldHMvU2hhZGVycy9jY1NoYWRlcl9FbWJvc3NfRnJhZy5qcyIsImFzc2V0cy9TaGFkZXJzL2NjU2hhZGVyX0dsYXNzX0ZyYWcuanMiLCJhc3NldHMvU2hhZGVycy9jY1NoYWRlcl9HcmF5X0ZyYWcuanMiLCJhc3NldHMvU2hhZGVycy9jY1NoYWRlcl9MaWdodEVmZmVjdF9GcmFnLmpzIiwiYXNzZXRzL1NoYWRlcnMvY2NTaGFkZXJfTmVnYXRpdmVfQmxhY2tfV2hpdGVfRnJhZy5qcyIsImFzc2V0cy9TaGFkZXJzL2NjU2hhZGVyX05lZ2F0aXZlX0ltYWdlX0ZyYWcuanMiLCJhc3NldHMvU2hhZGVycy9jY1NoYWRlcl9TaGFkb3dfQmxhY2tfV2hpdGVfRnJhZy5qcyIsImFzc2V0cy9TaGFkZXJzL2NjU2hhZGVyX1dhdmVfSF9GcmFnLmpzIiwiYXNzZXRzL1NoYWRlcnMvY2NTaGFkZXJfV2F2ZV9WSF9GcmFnLmpzIiwiYXNzZXRzL1NoYWRlcnMvY2NTaGFkZXJfV2F2ZV9WX0ZyYWcuanMiLCJhc3NldHMvU2hhZGVycy9jY1NoYWRlcl9saWdodG5pbmdCb2x0X0ZyYWcuanMiLCJhc3NldHMvU2hhZGVycy9jY1NoYWRlcl9saWdodG5pbmdCb2x0X1ZlcnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc0MTQ0NThTVHBoTEY3NSthRm1ZRnpmaCcsICdBdmdfQmxhY2tfV2hpdGUnKTtcbi8vIFNjcmlwdC9BdmdfQmxhY2tfV2hpdGUuanNcblxudmFyIF9kZWZhdWx0X3ZlcnQgPSByZXF1aXJlKFwiLi4vU2hhZGVycy9jY1NoYWRlcl9EZWZhdWx0X1ZlcnQuanNcIik7XG52YXIgX2RlZmF1bHRfdmVydF9ub19tdnAgPSByZXF1aXJlKFwiLi4vU2hhZGVycy9jY1NoYWRlcl9EZWZhdWx0X1ZlcnRfbm9NVlAuanNcIik7XG52YXIgX2JsYWNrX3doaXRlX2ZyYWcgPSByZXF1aXJlKFwiLi4vU2hhZGVycy9jY1NoYWRlcl9BdmdfQmxhY2tfV2hpdGVfRnJhZy5qc1wiKTtcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7fSxcblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLl91c2UoKTtcbiAgICB9LFxuXG4gICAgX3VzZTogZnVuY3Rpb24gX3VzZSgpIHtcbiAgICAgICAgdGhpcy5fcHJvZ3JhbSA9IG5ldyBjYy5HTFByb2dyYW0oKTtcbiAgICAgICAgaWYgKGNjLnN5cy5pc05hdGl2ZSkge1xuICAgICAgICAgICAgY2MubG9nKFwidXNlIG5hdGl2ZSBHTFByb2dyYW1cIik7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmluaXRXaXRoU3RyaW5nKF9kZWZhdWx0X3ZlcnRfbm9fbXZwLCBfYmxhY2tfd2hpdGVfZnJhZyk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmxpbmsoKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0udXBkYXRlVW5pZm9ybXMoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uaW5pdFdpdGhWZXJ0ZXhTaGFkZXJCeXRlQXJyYXkoX2RlZmF1bHRfdmVydCwgX2JsYWNrX3doaXRlX2ZyYWcpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MubWFjcm8uQVRUUklCVVRFX05BTUVfUE9TSVRJT04sIGNjLm1hY3JvLlZFUlRFWF9BVFRSSUJfUE9TSVRJT04pO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MubWFjcm8uQVRUUklCVVRFX05BTUVfQ09MT1IsIGNjLm1hY3JvLlZFUlRFWF9BVFRSSUJfQ09MT1IpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MubWFjcm8uQVRUUklCVVRFX05BTUVfVEVYX0NPT1JELCBjYy5tYWNyby5WRVJURVhfQVRUUklCX1RFWF9DT09SRFMpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5saW5rKCk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnVwZGF0ZVVuaWZvcm1zKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZXRQcm9ncmFtKHRoaXMubm9kZS5fc2dOb2RlLCB0aGlzLl9wcm9ncmFtKTtcbiAgICB9LFxuICAgIHNldFByb2dyYW06IGZ1bmN0aW9uIHNldFByb2dyYW0obm9kZSwgcHJvZ3JhbSkge1xuICAgICAgICBpZiAoY2Muc3lzLmlzTmF0aXZlKSB7XG4gICAgICAgICAgICB2YXIgZ2xQcm9ncmFtX3N0YXRlID0gY2MuR0xQcm9ncmFtU3RhdGUuZ2V0T3JDcmVhdGVXaXRoR0xQcm9ncmFtKHByb2dyYW0pO1xuICAgICAgICAgICAgbm9kZS5zZXRHTFByb2dyYW1TdGF0ZShnbFByb2dyYW1fc3RhdGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbm9kZS5zZXRTaGFkZXJQcm9ncmFtKHByb2dyYW0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGNoaWxkcmVuID0gbm9kZS5jaGlsZHJlbjtcbiAgICAgICAgaWYgKCFjaGlsZHJlbikgcmV0dXJuO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHRoaXMuc2V0UHJvZ3JhbShjaGlsZHJlbltpXSwgcHJvZ3JhbSk7XG4gICAgfVxuXG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2RkMGNmVVpOdDFCTXFjaWNtY0lpZVdzJywgJ0JsdXJfRWRnZV9EZXRhaWwnKTtcbi8vIFNjcmlwdC9CbHVyX0VkZ2VfRGV0YWlsLmpzXG5cbnZhciBfZGVmYXVsdF92ZXJ0ID0gcmVxdWlyZShcIi4uL1NoYWRlcnMvY2NTaGFkZXJfRGVmYXVsdF9WZXJ0LmpzXCIpO1xudmFyIF9kZWZhdWx0X3ZlcnRfbm9fbXZwID0gcmVxdWlyZShcIi4uL1NoYWRlcnMvY2NTaGFkZXJfRGVmYXVsdF9WZXJ0X25vTVZQLmpzXCIpO1xudmFyIF9ibHVyX2VkZ2VfZGV0YWlsX2ZyYWcgPSByZXF1aXJlKFwiLi4vU2hhZGVycy9jY1NoYWRlcl9CbHVyX0VkZ2VfRGV0YWlsX0ZyYWcuanNcIik7XG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge30sXG5cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5fdXNlKCk7XG4gICAgfSxcblxuICAgIF91c2U6IGZ1bmN0aW9uIF91c2UoKSB7XG4gICAgICAgIHRoaXMuX3Byb2dyYW0gPSBuZXcgY2MuR0xQcm9ncmFtKCk7XG4gICAgICAgIGlmIChjYy5zeXMuaXNOYXRpdmUpIHtcbiAgICAgICAgICAgIGNjLmxvZyhcInVzZSBuYXRpdmUgR0xQcm9ncmFtXCIpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5pbml0V2l0aFN0cmluZyhfZGVmYXVsdF92ZXJ0X25vX212cCwgX2JsdXJfZWRnZV9kZXRhaWxfZnJhZyk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmxpbmsoKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0udXBkYXRlVW5pZm9ybXMoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uaW5pdFdpdGhWZXJ0ZXhTaGFkZXJCeXRlQXJyYXkoX2RlZmF1bHRfdmVydCwgX2JsdXJfZWRnZV9kZXRhaWxfZnJhZyk7XG5cbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uYWRkQXR0cmlidXRlKGNjLm1hY3JvLkFUVFJJQlVURV9OQU1FX1BPU0lUSU9OLCBjYy5tYWNyby5WRVJURVhfQVRUUklCX1BPU0lUSU9OKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uYWRkQXR0cmlidXRlKGNjLm1hY3JvLkFUVFJJQlVURV9OQU1FX0NPTE9SLCBjYy5tYWNyby5WRVJURVhfQVRUUklCX0NPTE9SKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uYWRkQXR0cmlidXRlKGNjLm1hY3JvLkFUVFJJQlVURV9OQU1FX1RFWF9DT09SRCwgY2MubWFjcm8uVkVSVEVYX0FUVFJJQl9URVhfQ09PUkRTKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0ubGluaygpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS51cGRhdGVVbmlmb3JtcygpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fdW5pV2lkdGhTdGVwID0gdGhpcy5fcHJvZ3JhbS5nZXRVbmlmb3JtTG9jYXRpb25Gb3JOYW1lKFwid2lkdGhTdGVwXCIpO1xuICAgICAgICB0aGlzLl91bmlIZWlnaHRTdGVwID0gdGhpcy5fcHJvZ3JhbS5nZXRVbmlmb3JtTG9jYXRpb25Gb3JOYW1lKFwiaGVpZ2h0U3RlcFwiKTtcbiAgICAgICAgdGhpcy5fdW5pU3RyZW5ndGggPSB0aGlzLl9wcm9ncmFtLmdldFVuaWZvcm1Mb2NhdGlvbkZvck5hbWUoXCJzdHJlbmd0aFwiKTtcblxuICAgICAgICBpZiAoY2Muc3lzLmlzTmF0aXZlKSB7XG4gICAgICAgICAgICB2YXIgZ2xQcm9ncmFtX3N0YXRlID0gY2MuR0xQcm9ncmFtU3RhdGUuZ2V0T3JDcmVhdGVXaXRoR0xQcm9ncmFtKHRoaXMuX3Byb2dyYW0pO1xuICAgICAgICAgICAgZ2xQcm9ncmFtX3N0YXRlLnNldFVuaWZvcm1GbG9hdCh0aGlzLl91bmlXaWR0aFN0ZXAsIDEuMCAvIHRoaXMubm9kZS5nZXRDb250ZW50U2l6ZSgpLndpZHRoKTtcbiAgICAgICAgICAgIGdsUHJvZ3JhbV9zdGF0ZS5zZXRVbmlmb3JtRmxvYXQodGhpcy5fdW5pSGVpZ2h0U3RlcCwgMS4wIC8gdGhpcy5ub2RlLmdldENvbnRlbnRTaXplKCkuaGVpZ2h0KTtcbiAgICAgICAgICAgIGdsUHJvZ3JhbV9zdGF0ZS5zZXRVbmlmb3JtRmxvYXQodGhpcy5fdW5pU3RyZW5ndGgsIDEuMCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnNldFVuaWZvcm1Mb2NhdGlvbldpdGgxZih0aGlzLl91bmlXaWR0aFN0ZXAsIDEuMCAvIHRoaXMubm9kZS5nZXRDb250ZW50U2l6ZSgpLndpZHRoKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDFmKHRoaXMuX3VuaUhlaWdodFN0ZXAsIDEuMCAvIHRoaXMubm9kZS5nZXRDb250ZW50U2l6ZSgpLmhlaWdodCk7XG5cbiAgICAgICAgICAgIC8qIOaooeeziiAwLjUgICAgICovXG4gICAgICAgICAgICAvKiDmqKHns4ogMS4wICAgICAqL1xuICAgICAgICAgICAgLyog57uG6IqCIC0yLjAgICAgKi9cbiAgICAgICAgICAgIC8qIOe7huiKgiAtNS4wICAgICovXG4gICAgICAgICAgICAvKiDnu4boioIgLTEwLjAgICAqL1xuICAgICAgICAgICAgLyog6L6557yYIDIuMCAgICAgKi9cbiAgICAgICAgICAgIC8qIOi+uee8mCA1LjAgICAgICovXG4gICAgICAgICAgICAvKiDovrnnvJggMTAuMCAgICAqL1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMWYodGhpcy5fdW5pU3RyZW5ndGgsIDEuMCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNldFByb2dyYW0odGhpcy5ub2RlLl9zZ05vZGUsIHRoaXMuX3Byb2dyYW0pO1xuICAgIH0sXG4gICAgc2V0UHJvZ3JhbTogZnVuY3Rpb24gc2V0UHJvZ3JhbShub2RlLCBwcm9ncmFtKSB7XG4gICAgICAgIGlmIChjYy5zeXMuaXNOYXRpdmUpIHtcbiAgICAgICAgICAgIHZhciBnbFByb2dyYW1fc3RhdGUgPSBjYy5HTFByb2dyYW1TdGF0ZS5nZXRPckNyZWF0ZVdpdGhHTFByb2dyYW0ocHJvZ3JhbSk7XG4gICAgICAgICAgICBub2RlLnNldEdMUHJvZ3JhbVN0YXRlKGdsUHJvZ3JhbV9zdGF0ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBub2RlLnNldFNoYWRlclByb2dyYW0ocHJvZ3JhbSk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgY2hpbGRyZW4gPSBub2RlLmNoaWxkcmVuO1xuICAgICAgICBpZiAoIWNoaWxkcmVuKSByZXR1cm47XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykgdGhpcy5zZXRQcm9ncmFtKGNoaWxkcmVuW2ldLCBwcm9ncmFtKTtcbiAgICB9XG5cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnOTU4OTZMSWZrOUtGSitLL3loa1hTSzUnLCAnQ2lyY2xlRWZmZWN0MicpO1xuLy8gU2NyaXB0L0NpcmNsZUVmZmVjdDIuanNcblxudmFyIF9kZWZhdWx0X3ZlcnQgPSByZXF1aXJlKFwiLi4vU2hhZGVycy9jY1NoYWRlcl9EZWZhdWx0X1ZlcnQuanNcIik7XG52YXIgX2RlZmF1bHRfdmVydF9ub19tdnAgPSByZXF1aXJlKFwiLi4vU2hhZGVycy9jY1NoYWRlcl9EZWZhdWx0X1ZlcnRfbm9NVlAuanNcIik7XG52YXIgX2dsYXNzX2ZyYWcgPSByZXF1aXJlKFwiLi4vU2hhZGVycy9jY1NoYWRlcl9DaXJjbGVfRWZmZWN0Ml9GcmFnLmpzXCIpO1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgZ2xhc3NGYWN0b3I6IDEuMFxuICAgIH0sXG5cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5wYXJhbWV0ZXJzID0ge1xuICAgICAgICAgICAgc3RhcnRUaW1lOiBEYXRlLm5vdygpLFxuICAgICAgICAgICAgdGltZTogMC4wLFxuICAgICAgICAgICAgbW91c2U6IHtcbiAgICAgICAgICAgICAgICB4OiAwLjAsXG4gICAgICAgICAgICAgICAgeTogMC4wXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVzb2x1dGlvbjoge1xuICAgICAgICAgICAgICAgIHg6IDAuMCxcbiAgICAgICAgICAgICAgICB5OiAwLjBcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9O1xuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuTU9VU0VfTU9WRSwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICB0aGlzLnBhcmFtZXRlcnMubW91c2UueCA9IHRoaXMubm9kZS5nZXRDb250ZW50U2l6ZSgpLndpZHRoIC8gZXZlbnQuZ2V0TG9jYXRpb25YKCk7XG4gICAgICAgICAgICB0aGlzLnBhcmFtZXRlcnMubW91c2UueSA9IHRoaXMubm9kZS5nZXRDb250ZW50U2l6ZSgpLmhlaWdodCAvIGV2ZW50LmdldExvY2F0aW9uWSgpO1xuICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfTU9WRSwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICB0aGlzLnBhcmFtZXRlcnMubW91c2UueCA9IHRoaXMubm9kZS5nZXRDb250ZW50U2l6ZSgpLndpZHRoIC8gZXZlbnQuZ2V0TG9jYXRpb25YKCk7XG4gICAgICAgICAgICB0aGlzLnBhcmFtZXRlcnMubW91c2UueSA9IHRoaXMubm9kZS5nZXRDb250ZW50U2l6ZSgpLmhlaWdodCAvIGV2ZW50LmdldExvY2F0aW9uWSgpO1xuICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICB0aGlzLl91c2UoKTtcbiAgICB9LFxuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKGR0KSB7XG4gICAgICAgIGlmICh0aGlzLmdsYXNzRmFjdG9yID49IDQwKSB7XG4gICAgICAgICAgICB0aGlzLmdsYXNzRmFjdG9yID0gMDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmdsYXNzRmFjdG9yICs9IGR0ICogMztcblxuICAgICAgICBpZiAodGhpcy5fcHJvZ3JhbSkge1xuXG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnVzZSgpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVHTFBhcmFtZXRlcnMoKTtcbiAgICAgICAgICAgIGlmIChjYy5zeXMuaXNOYXRpdmUpIHtcbiAgICAgICAgICAgICAgICB2YXIgZ2xQcm9ncmFtX3N0YXRlID0gY2MuR0xQcm9ncmFtU3RhdGUuZ2V0T3JDcmVhdGVXaXRoR0xQcm9ncmFtKHRoaXMuX3Byb2dyYW0pO1xuICAgICAgICAgICAgICAgIGdsUHJvZ3JhbV9zdGF0ZS5zZXRVbmlmb3JtVmVjMihcInJlc29sdXRpb25cIiwgdGhpcy5wYXJhbWV0ZXJzLnJlc29sdXRpb24pO1xuICAgICAgICAgICAgICAgIGdsUHJvZ3JhbV9zdGF0ZS5zZXRVbmlmb3JtRmxvYXQoXCJ0aW1lXCIsIHRoaXMucGFyYW1ldGVycy50aW1lKTtcbiAgICAgICAgICAgICAgICBnbFByb2dyYW1fc3RhdGUuc2V0VW5pZm9ybVZlYzIoXCJtb3VzZV90b3VjaFwiLCB0aGlzLnBhcmFtZXRlcnMubW91c2UpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnNldFVuaWZvcm1Mb2NhdGlvbldpdGgyZih0aGlzLl9yZXNvbHV0aW9uLCB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbi54LCB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbi55KTtcbiAgICAgICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnNldFVuaWZvcm1Mb2NhdGlvbldpdGgxZih0aGlzLl90aW1lLCB0aGlzLnBhcmFtZXRlcnMudGltZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMmYodGhpcy5fbW91c2UsIHRoaXMucGFyYW1ldGVycy5tb3VzZS54LCB0aGlzLnBhcmFtZXRlcnMubW91c2UueCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHVwZGF0ZUdMUGFyYW1ldGVyczogZnVuY3Rpb24gdXBkYXRlR0xQYXJhbWV0ZXJzKCkge1xuICAgICAgICB0aGlzLnBhcmFtZXRlcnMudGltZSA9IChEYXRlLm5vdygpIC0gdGhpcy5wYXJhbWV0ZXJzLnN0YXJ0VGltZSkgLyAxMDAwO1xuICAgICAgICB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbi54ID0gdGhpcy5ub2RlLmdldENvbnRlbnRTaXplKCkud2lkdGg7XG4gICAgICAgIHRoaXMucGFyYW1ldGVycy5yZXNvbHV0aW9uLnkgPSB0aGlzLm5vZGUuZ2V0Q29udGVudFNpemUoKS5oZWlnaHQ7XG4gICAgfSxcblxuICAgIF91c2U6IGZ1bmN0aW9uIF91c2UoKSB7XG5cbiAgICAgICAgaWYgKGNjLnN5cy5pc05hdGl2ZSkge1xuICAgICAgICAgICAgY2MubG9nKFwidXNlIG5hdGl2ZSBHTFByb2dyYW1cIik7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtID0gbmV3IGNjLkdMUHJvZ3JhbSgpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5pbml0V2l0aFN0cmluZyhfZGVmYXVsdF92ZXJ0X25vX212cCwgX2dsYXNzX2ZyYWcpO1xuXG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5tYWNyby5BVFRSSUJVVEVfTkFNRV9QT1NJVElPTiwgY2MubWFjcm8uVkVSVEVYX0FUVFJJQl9QT1NJVElPTik7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5tYWNyby5BVFRSSUJVVEVfTkFNRV9DT0xPUiwgY2MubWFjcm8uVkVSVEVYX0FUVFJJQl9DT0xPUik7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5tYWNyby5BVFRSSUJVVEVfTkFNRV9URVhfQ09PUkQsIGNjLm1hY3JvLlZFUlRFWF9BVFRSSUJfVEVYX0NPT1JEUyk7XG5cbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0ubGluaygpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS51cGRhdGVVbmlmb3JtcygpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVHTFBhcmFtZXRlcnMoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0gPSBuZXcgY2MuR0xQcm9ncmFtKCk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmluaXRXaXRoVmVydGV4U2hhZGVyQnl0ZUFycmF5KF9kZWZhdWx0X3ZlcnQsIF9nbGFzc19mcmFnKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uYWRkQXR0cmlidXRlKGNjLm1hY3JvLkFUVFJJQlVURV9OQU1FX1BPU0lUSU9OLCBjYy5tYWNyby5WRVJURVhfQVRUUklCX1BPU0lUSU9OKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uYWRkQXR0cmlidXRlKGNjLm1hY3JvLkFUVFJJQlVURV9OQU1FX0NPTE9SLCBjYy5tYWNyby5WRVJURVhfQVRUUklCX0NPTE9SKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uYWRkQXR0cmlidXRlKGNjLm1hY3JvLkFUVFJJQlVURV9OQU1FX1RFWF9DT09SRCwgY2MubWFjcm8uVkVSVEVYX0FUVFJJQl9URVhfQ09PUkRTKTtcblxuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5saW5rKCk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnVwZGF0ZVVuaWZvcm1zKCk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnVzZSgpO1xuXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUdMUGFyYW1ldGVycygpO1xuXG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnNldFVuaWZvcm1Mb2NhdGlvbldpdGgxZih0aGlzLl9wcm9ncmFtLmdldFVuaWZvcm1Mb2NhdGlvbkZvck5hbWUoJ3RpbWUnKSwgdGhpcy5wYXJhbWV0ZXJzLnRpbWUpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMmYodGhpcy5fcHJvZ3JhbS5nZXRVbmlmb3JtTG9jYXRpb25Gb3JOYW1lKCdtb3VzZV90b3VjaCcpLCB0aGlzLnBhcmFtZXRlcnMubW91c2UueCwgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlLnkpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMmYodGhpcy5fcHJvZ3JhbS5nZXRVbmlmb3JtTG9jYXRpb25Gb3JOYW1lKCdyZXNvbHV0aW9uJyksIHRoaXMucGFyYW1ldGVycy5yZXNvbHV0aW9uLngsIHRoaXMucGFyYW1ldGVycy5yZXNvbHV0aW9uLnkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNjLnN5cy5pc05hdGl2ZSkge1xuICAgICAgICAgICAgdmFyIGdsUHJvZ3JhbV9zdGF0ZSA9IGNjLkdMUHJvZ3JhbVN0YXRlLmdldE9yQ3JlYXRlV2l0aEdMUHJvZ3JhbSh0aGlzLl9wcm9ncmFtKTtcbiAgICAgICAgICAgIGdsUHJvZ3JhbV9zdGF0ZS5zZXRVbmlmb3JtVmVjMihcInJlc29sdXRpb25cIiwgdGhpcy5wYXJhbWV0ZXJzLnJlc29sdXRpb24pO1xuICAgICAgICAgICAgZ2xQcm9ncmFtX3N0YXRlLnNldFVuaWZvcm1GbG9hdChcInRpbWVcIiwgdGhpcy5wYXJhbWV0ZXJzLnRpbWUpO1xuICAgICAgICAgICAgZ2xQcm9ncmFtX3N0YXRlLnNldFVuaWZvcm1WZWMyKFwibW91c2VfdG91Y2hcIiwgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlKTtcbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgdGhpcy5fcmVzb2x1dGlvbiA9IHRoaXMuX3Byb2dyYW0uZ2V0VW5pZm9ybUxvY2F0aW9uRm9yTmFtZShcInJlc29sdXRpb25cIik7XG4gICAgICAgICAgICB0aGlzLl90aW1lID0gdGhpcy5fcHJvZ3JhbS5nZXRVbmlmb3JtTG9jYXRpb25Gb3JOYW1lKFwidGltZVwiKTtcbiAgICAgICAgICAgIHRoaXMuX21vdXNlID0gdGhpcy5fcHJvZ3JhbS5nZXRVbmlmb3JtTG9jYXRpb25Gb3JOYW1lKFwibW91c2VfdG91Y2hcIik7XG5cbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDJmKHRoaXMuX3Jlc29sdXRpb24sIHRoaXMucGFyYW1ldGVycy5yZXNvbHV0aW9uLngsIHRoaXMucGFyYW1ldGVycy5yZXNvbHV0aW9uLnkpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMWYodGhpcy5fdGltZSwgdGhpcy5wYXJhbWV0ZXJzLnRpbWUpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMmYodGhpcy5fbW91c2UsIHRoaXMucGFyYW1ldGVycy5tb3VzZS54LCB0aGlzLnBhcmFtZXRlcnMubW91c2UueSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNldFByb2dyYW0odGhpcy5ub2RlLl9zZ05vZGUsIHRoaXMuX3Byb2dyYW0pO1xuICAgIH0sXG5cbiAgICBzZXRQcm9ncmFtOiBmdW5jdGlvbiBzZXRQcm9ncmFtKG5vZGUsIHByb2dyYW0pIHtcbiAgICAgICAgaWYgKGNjLnN5cy5pc05hdGl2ZSkge1xuICAgICAgICAgICAgdmFyIGdsUHJvZ3JhbV9zdGF0ZSA9IGNjLkdMUHJvZ3JhbVN0YXRlLmdldE9yQ3JlYXRlV2l0aEdMUHJvZ3JhbShwcm9ncmFtKTtcbiAgICAgICAgICAgIG5vZGUuc2V0R0xQcm9ncmFtU3RhdGUoZ2xQcm9ncmFtX3N0YXRlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5vZGUuc2V0U2hhZGVyUHJvZ3JhbShwcm9ncmFtKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBjaGlsZHJlbiA9IG5vZGUuY2hpbGRyZW47XG4gICAgICAgIGlmICghY2hpbGRyZW4pIHJldHVybjtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB0aGlzLnNldFByb2dyYW0oY2hpbGRyZW5baV0sIHByb2dyYW0pO1xuICAgIH1cblxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICdjNTM1ZmlrNWU1SEhJOU1aOVBSeFRWZicsICdDaXJjbGVMaWdodCcpO1xuLy8gU2NyaXB0L0NpcmNsZUxpZ2h0LmpzXG5cbnZhciBfZGVmYXVsdF92ZXJ0ID0gcmVxdWlyZShcIi4uL1NoYWRlcnMvY2NTaGFkZXJfRGVmYXVsdF9WZXJ0LmpzXCIpO1xudmFyIF9kZWZhdWx0X3ZlcnRfbm9fbXZwID0gcmVxdWlyZShcIi4uL1NoYWRlcnMvY2NTaGFkZXJfRGVmYXVsdF9WZXJ0X25vTVZQLmpzXCIpO1xudmFyIF9nbGFzc19mcmFnID0gcmVxdWlyZShcIi4uL1NoYWRlcnMvY2NTaGFkZXJfQ2lyY2xlX0xpZ2h0X0ZyYWcuanNcIik7XG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBnbGFzc0ZhY3RvcjogMS4wXG4gICAgfSxcblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLnBhcmFtZXRlcnMgPSB7XG4gICAgICAgICAgICBzdGFydFRpbWU6IERhdGUubm93KCksXG4gICAgICAgICAgICB0aW1lOiAwLjAsXG4gICAgICAgICAgICBtb3VzZToge1xuICAgICAgICAgICAgICAgIHg6IDAuMCxcbiAgICAgICAgICAgICAgICB5OiAwLjBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZXNvbHV0aW9uOiB7XG4gICAgICAgICAgICAgICAgeDogMC4wLFxuICAgICAgICAgICAgICAgIHk6IDAuMFxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5NT1VTRV9NT1ZFLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIHRoaXMucGFyYW1ldGVycy5tb3VzZS54ID0gZXZlbnQuZ2V0TG9jYXRpb25YKCk7XG4gICAgICAgICAgICB0aGlzLnBhcmFtZXRlcnMubW91c2UueSA9IGV2ZW50LmdldExvY2F0aW9uWSgpO1xuICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfTU9WRSwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICB0aGlzLnBhcmFtZXRlcnMubW91c2UueCA9IGV2ZW50LmdldExvY2F0aW9uWCgpO1xuICAgICAgICAgICAgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlLnkgPSBldmVudC5nZXRMb2NhdGlvblkoKTtcbiAgICAgICAgfSwgdGhpcyk7XG5cbiAgICAgICAgdGhpcy5fdXNlKCk7XG4gICAgfSxcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShkdCkge1xuICAgICAgICBpZiAodGhpcy5nbGFzc0ZhY3RvciA+PSA0MCkge1xuICAgICAgICAgICAgdGhpcy5nbGFzc0ZhY3RvciA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5nbGFzc0ZhY3RvciArPSBkdCAqIDM7XG5cbiAgICAgICAgaWYgKHRoaXMuX3Byb2dyYW0pIHtcblxuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS51c2UoKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlR0xQYXJhbWV0ZXJzKCk7XG4gICAgICAgICAgICBpZiAoY2Muc3lzLmlzTmF0aXZlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGdsUHJvZ3JhbV9zdGF0ZSA9IGNjLkdMUHJvZ3JhbVN0YXRlLmdldE9yQ3JlYXRlV2l0aEdMUHJvZ3JhbSh0aGlzLl9wcm9ncmFtKTtcbiAgICAgICAgICAgICAgICBnbFByb2dyYW1fc3RhdGUuc2V0VW5pZm9ybVZlYzIoXCJyZXNvbHV0aW9uXCIsIHRoaXMucGFyYW1ldGVycy5yZXNvbHV0aW9uKTtcbiAgICAgICAgICAgICAgICBnbFByb2dyYW1fc3RhdGUuc2V0VW5pZm9ybUZsb2F0KFwidGltZVwiLCB0aGlzLnBhcmFtZXRlcnMudGltZSk7XG4gICAgICAgICAgICAgICAgZ2xQcm9ncmFtX3N0YXRlLnNldFVuaWZvcm1WZWMyKFwibW91c2VfdG91Y2hcIiwgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMmYodGhpcy5fcmVzb2x1dGlvbiwgdGhpcy5wYXJhbWV0ZXJzLnJlc29sdXRpb24ueCwgdGhpcy5wYXJhbWV0ZXJzLnJlc29sdXRpb24ueSk7XG4gICAgICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMWYodGhpcy5fdGltZSwgdGhpcy5wYXJhbWV0ZXJzLnRpbWUpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDJmKHRoaXMuX21vdXNlLCB0aGlzLnBhcmFtZXRlcnMubW91c2UueCwgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlLngpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICB1cGRhdGVHTFBhcmFtZXRlcnM6IGZ1bmN0aW9uIHVwZGF0ZUdMUGFyYW1ldGVycygpIHtcbiAgICAgICAgdGhpcy5wYXJhbWV0ZXJzLnRpbWUgPSAoRGF0ZS5ub3coKSAtIHRoaXMucGFyYW1ldGVycy5zdGFydFRpbWUpIC8gMTAwMDtcbiAgICAgICAgdGhpcy5wYXJhbWV0ZXJzLnJlc29sdXRpb24ueCA9IDEuMCAvIHRoaXMubm9kZS5nZXRDb250ZW50U2l6ZSgpLndpZHRoO1xuICAgICAgICB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbi55ID0gMS4wIC8gdGhpcy5ub2RlLmdldENvbnRlbnRTaXplKCkuaGVpZ2h0O1xuICAgIH0sXG5cbiAgICBfdXNlOiBmdW5jdGlvbiBfdXNlKCkge1xuXG4gICAgICAgIGlmIChjYy5zeXMuaXNOYXRpdmUpIHtcbiAgICAgICAgICAgIGNjLmxvZyhcInVzZSBuYXRpdmUgR0xQcm9ncmFtXCIpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbSA9IG5ldyBjYy5HTFByb2dyYW0oKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uaW5pdFdpdGhTdHJpbmcoX2RlZmF1bHRfdmVydF9ub19tdnAsIF9nbGFzc19mcmFnKTtcblxuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MubWFjcm8uQVRUUklCVVRFX05BTUVfUE9TSVRJT04sIGNjLm1hY3JvLlZFUlRFWF9BVFRSSUJfUE9TSVRJT04pO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MubWFjcm8uQVRUUklCVVRFX05BTUVfQ09MT1IsIGNjLm1hY3JvLlZFUlRFWF9BVFRSSUJfQ09MT1IpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MubWFjcm8uQVRUUklCVVRFX05BTUVfVEVYX0NPT1JELCBjYy5tYWNyby5WRVJURVhfQVRUUklCX1RFWF9DT09SRFMpO1xuXG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmxpbmsoKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0udXBkYXRlVW5pZm9ybXMoKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlR0xQYXJhbWV0ZXJzKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtID0gbmV3IGNjLkdMUHJvZ3JhbSgpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5pbml0V2l0aFZlcnRleFNoYWRlckJ5dGVBcnJheShfZGVmYXVsdF92ZXJ0LCBfZ2xhc3NfZnJhZyk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5tYWNyby5BVFRSSUJVVEVfTkFNRV9QT1NJVElPTiwgY2MubWFjcm8uVkVSVEVYX0FUVFJJQl9QT1NJVElPTik7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5tYWNyby5BVFRSSUJVVEVfTkFNRV9DT0xPUiwgY2MubWFjcm8uVkVSVEVYX0FUVFJJQl9DT0xPUik7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5tYWNyby5BVFRSSUJVVEVfTkFNRV9URVhfQ09PUkQsIGNjLm1hY3JvLlZFUlRFWF9BVFRSSUJfVEVYX0NPT1JEUyk7XG5cbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0ubGluaygpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS51cGRhdGVVbmlmb3JtcygpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS51c2UoKTtcblxuICAgICAgICAgICAgdGhpcy51cGRhdGVHTFBhcmFtZXRlcnMoKTtcblxuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMWYodGhpcy5fcHJvZ3JhbS5nZXRVbmlmb3JtTG9jYXRpb25Gb3JOYW1lKCd0aW1lJyksIHRoaXMucGFyYW1ldGVycy50aW1lKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDJmKHRoaXMuX3Byb2dyYW0uZ2V0VW5pZm9ybUxvY2F0aW9uRm9yTmFtZSgnbW91c2VfdG91Y2gnKSwgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlLngsIHRoaXMucGFyYW1ldGVycy5tb3VzZS55KTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDJmKHRoaXMuX3Byb2dyYW0uZ2V0VW5pZm9ybUxvY2F0aW9uRm9yTmFtZSgncmVzb2x1dGlvbicpLCB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbi54LCB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbi55KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjYy5zeXMuaXNOYXRpdmUpIHtcbiAgICAgICAgICAgIHZhciBnbFByb2dyYW1fc3RhdGUgPSBjYy5HTFByb2dyYW1TdGF0ZS5nZXRPckNyZWF0ZVdpdGhHTFByb2dyYW0odGhpcy5fcHJvZ3JhbSk7XG4gICAgICAgICAgICBnbFByb2dyYW1fc3RhdGUuc2V0VW5pZm9ybVZlYzIoXCJyZXNvbHV0aW9uXCIsIHRoaXMucGFyYW1ldGVycy5yZXNvbHV0aW9uKTtcbiAgICAgICAgICAgIGdsUHJvZ3JhbV9zdGF0ZS5zZXRVbmlmb3JtRmxvYXQoXCJ0aW1lXCIsIHRoaXMucGFyYW1ldGVycy50aW1lKTtcbiAgICAgICAgICAgIGdsUHJvZ3JhbV9zdGF0ZS5zZXRVbmlmb3JtVmVjMihcIm1vdXNlX3RvdWNoXCIsIHRoaXMucGFyYW1ldGVycy5tb3VzZSk7XG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgIHRoaXMuX3Jlc29sdXRpb24gPSB0aGlzLl9wcm9ncmFtLmdldFVuaWZvcm1Mb2NhdGlvbkZvck5hbWUoXCJyZXNvbHV0aW9uXCIpO1xuICAgICAgICAgICAgdGhpcy5fdGltZSA9IHRoaXMuX3Byb2dyYW0uZ2V0VW5pZm9ybUxvY2F0aW9uRm9yTmFtZShcInRpbWVcIik7XG4gICAgICAgICAgICB0aGlzLl9tb3VzZSA9IHRoaXMuX3Byb2dyYW0uZ2V0VW5pZm9ybUxvY2F0aW9uRm9yTmFtZShcIm1vdXNlX3RvdWNoXCIpO1xuXG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnNldFVuaWZvcm1Mb2NhdGlvbldpdGgyZih0aGlzLl9yZXNvbHV0aW9uLCB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbi54LCB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbi55KTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDFmKHRoaXMuX3RpbWUsIHRoaXMucGFyYW1ldGVycy50aW1lKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDJmKHRoaXMuX21vdXNlLCB0aGlzLnBhcmFtZXRlcnMubW91c2UueCwgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlLnkpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZXRQcm9ncmFtKHRoaXMubm9kZS5fc2dOb2RlLCB0aGlzLl9wcm9ncmFtKTtcbiAgICB9LFxuXG4gICAgc2V0UHJvZ3JhbTogZnVuY3Rpb24gc2V0UHJvZ3JhbShub2RlLCBwcm9ncmFtKSB7XG4gICAgICAgIGlmIChjYy5zeXMuaXNOYXRpdmUpIHtcbiAgICAgICAgICAgIHZhciBnbFByb2dyYW1fc3RhdGUgPSBjYy5HTFByb2dyYW1TdGF0ZS5nZXRPckNyZWF0ZVdpdGhHTFByb2dyYW0ocHJvZ3JhbSk7XG4gICAgICAgICAgICBub2RlLnNldEdMUHJvZ3JhbVN0YXRlKGdsUHJvZ3JhbV9zdGF0ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBub2RlLnNldFNoYWRlclByb2dyYW0ocHJvZ3JhbSk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgY2hpbGRyZW4gPSBub2RlLmNoaWxkcmVuO1xuICAgICAgICBpZiAoIWNoaWxkcmVuKSByZXR1cm47XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykgdGhpcy5zZXRQcm9ncmFtKGNoaWxkcmVuW2ldLCBwcm9ncmFtKTtcbiAgICB9XG5cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnODI1OTUwTmtTMUo4WUhTSllBaTdRaVInLCAnRWZmZWN0MDMnKTtcbi8vIFNjcmlwdC9FZmZlY3QwMy5qc1xuXG52YXIgX2RlZmF1bHRfdmVydCA9IHJlcXVpcmUoXCIuLi9TaGFkZXJzL2NjU2hhZGVyX0RlZmF1bHRfVmVydC5qc1wiKTtcbnZhciBfZGVmYXVsdF92ZXJ0X25vX212cCA9IHJlcXVpcmUoXCIuLi9TaGFkZXJzL2NjU2hhZGVyX0RlZmF1bHRfVmVydF9ub01WUC5qc1wiKTtcbnZhciBfZ2xhc3NfZnJhZyA9IHJlcXVpcmUoXCIuLi9TaGFkZXJzL2NjU2hhZGVyX0VmZmVjdDAzX0ZyYWcuanNcIik7XG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBnbGFzc0ZhY3RvcjogMS4wXG4gICAgfSxcblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLnBhcmFtZXRlcnMgPSB7XG4gICAgICAgICAgICBzdGFydFRpbWU6IERhdGUubm93KCksXG4gICAgICAgICAgICB0aW1lOiAwLjAsXG4gICAgICAgICAgICBtb3VzZToge1xuICAgICAgICAgICAgICAgIHg6IDAuMCxcbiAgICAgICAgICAgICAgICB5OiAwLjBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZXNvbHV0aW9uOiB7XG4gICAgICAgICAgICAgICAgeDogMC4wLFxuICAgICAgICAgICAgICAgIHk6IDAuMFxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5NT1VTRV9NT1ZFLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIHRoaXMucGFyYW1ldGVycy5tb3VzZS54ID0gdGhpcy5ub2RlLmdldENvbnRlbnRTaXplKCkud2lkdGggLyBldmVudC5nZXRMb2NhdGlvblgoKTtcbiAgICAgICAgICAgIHRoaXMucGFyYW1ldGVycy5tb3VzZS55ID0gdGhpcy5ub2RlLmdldENvbnRlbnRTaXplKCkuaGVpZ2h0IC8gZXZlbnQuZ2V0TG9jYXRpb25ZKCk7XG4gICAgICAgIH0sIHRoaXMpO1xuXG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9NT1ZFLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIHRoaXMucGFyYW1ldGVycy5tb3VzZS54ID0gdGhpcy5ub2RlLmdldENvbnRlbnRTaXplKCkud2lkdGggLyBldmVudC5nZXRMb2NhdGlvblgoKTtcbiAgICAgICAgICAgIHRoaXMucGFyYW1ldGVycy5tb3VzZS55ID0gdGhpcy5ub2RlLmdldENvbnRlbnRTaXplKCkuaGVpZ2h0IC8gZXZlbnQuZ2V0TG9jYXRpb25ZKCk7XG4gICAgICAgIH0sIHRoaXMpO1xuXG4gICAgICAgIHRoaXMuX3VzZSgpO1xuICAgIH0sXG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoZHQpIHtcbiAgICAgICAgaWYgKHRoaXMuZ2xhc3NGYWN0b3IgPj0gNDApIHtcbiAgICAgICAgICAgIHRoaXMuZ2xhc3NGYWN0b3IgPSAwO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZ2xhc3NGYWN0b3IgKz0gZHQgKiAzO1xuXG4gICAgICAgIGlmICh0aGlzLl9wcm9ncmFtKSB7XG5cbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0udXNlKCk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUdMUGFyYW1ldGVycygpO1xuICAgICAgICAgICAgaWYgKGNjLnN5cy5pc05hdGl2ZSkge1xuICAgICAgICAgICAgICAgIHZhciBnbFByb2dyYW1fc3RhdGUgPSBjYy5HTFByb2dyYW1TdGF0ZS5nZXRPckNyZWF0ZVdpdGhHTFByb2dyYW0odGhpcy5fcHJvZ3JhbSk7XG4gICAgICAgICAgICAgICAgZ2xQcm9ncmFtX3N0YXRlLnNldFVuaWZvcm1WZWMyKFwicmVzb2x1dGlvblwiLCB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbik7XG4gICAgICAgICAgICAgICAgZ2xQcm9ncmFtX3N0YXRlLnNldFVuaWZvcm1GbG9hdChcInRpbWVcIiwgdGhpcy5wYXJhbWV0ZXJzLnRpbWUpO1xuICAgICAgICAgICAgICAgIGdsUHJvZ3JhbV9zdGF0ZS5zZXRVbmlmb3JtVmVjMihcIm1vdXNlX3RvdWNoXCIsIHRoaXMucGFyYW1ldGVycy5tb3VzZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDJmKHRoaXMuX3Jlc29sdXRpb24sIHRoaXMucGFyYW1ldGVycy5yZXNvbHV0aW9uLngsIHRoaXMucGFyYW1ldGVycy5yZXNvbHV0aW9uLnkpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDFmKHRoaXMuX3RpbWUsIHRoaXMucGFyYW1ldGVycy50aW1lKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnNldFVuaWZvcm1Mb2NhdGlvbldpdGgyZih0aGlzLl9tb3VzZSwgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlLngsIHRoaXMucGFyYW1ldGVycy5tb3VzZS54KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgdXBkYXRlR0xQYXJhbWV0ZXJzOiBmdW5jdGlvbiB1cGRhdGVHTFBhcmFtZXRlcnMoKSB7XG4gICAgICAgIHRoaXMucGFyYW1ldGVycy50aW1lID0gKERhdGUubm93KCkgLSB0aGlzLnBhcmFtZXRlcnMuc3RhcnRUaW1lKSAvIDEwMDA7XG4gICAgICAgIHRoaXMucGFyYW1ldGVycy5yZXNvbHV0aW9uLnggPSB0aGlzLm5vZGUuZ2V0Q29udGVudFNpemUoKS53aWR0aDtcbiAgICAgICAgdGhpcy5wYXJhbWV0ZXJzLnJlc29sdXRpb24ueSA9IHRoaXMubm9kZS5nZXRDb250ZW50U2l6ZSgpLmhlaWdodDtcbiAgICB9LFxuXG4gICAgX3VzZTogZnVuY3Rpb24gX3VzZSgpIHtcblxuICAgICAgICBpZiAoY2Muc3lzLmlzTmF0aXZlKSB7XG4gICAgICAgICAgICBjYy5sb2coXCJ1c2UgbmF0aXZlIEdMUHJvZ3JhbVwiKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0gPSBuZXcgY2MuR0xQcm9ncmFtKCk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmluaXRXaXRoU3RyaW5nKF9kZWZhdWx0X3ZlcnRfbm9fbXZwLCBfZ2xhc3NfZnJhZyk7XG5cbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uYWRkQXR0cmlidXRlKGNjLm1hY3JvLkFUVFJJQlVURV9OQU1FX1BPU0lUSU9OLCBjYy5tYWNyby5WRVJURVhfQVRUUklCX1BPU0lUSU9OKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uYWRkQXR0cmlidXRlKGNjLm1hY3JvLkFUVFJJQlVURV9OQU1FX0NPTE9SLCBjYy5tYWNyby5WRVJURVhfQVRUUklCX0NPTE9SKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uYWRkQXR0cmlidXRlKGNjLm1hY3JvLkFUVFJJQlVURV9OQU1FX1RFWF9DT09SRCwgY2MubWFjcm8uVkVSVEVYX0FUVFJJQl9URVhfQ09PUkRTKTtcblxuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5saW5rKCk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnVwZGF0ZVVuaWZvcm1zKCk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUdMUGFyYW1ldGVycygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbSA9IG5ldyBjYy5HTFByb2dyYW0oKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uaW5pdFdpdGhWZXJ0ZXhTaGFkZXJCeXRlQXJyYXkoX2RlZmF1bHRfdmVydCwgX2dsYXNzX2ZyYWcpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MubWFjcm8uQVRUUklCVVRFX05BTUVfUE9TSVRJT04sIGNjLm1hY3JvLlZFUlRFWF9BVFRSSUJfUE9TSVRJT04pO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MubWFjcm8uQVRUUklCVVRFX05BTUVfQ09MT1IsIGNjLm1hY3JvLlZFUlRFWF9BVFRSSUJfQ09MT1IpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MubWFjcm8uQVRUUklCVVRFX05BTUVfVEVYX0NPT1JELCBjYy5tYWNyby5WRVJURVhfQVRUUklCX1RFWF9DT09SRFMpO1xuXG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmxpbmsoKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0udXBkYXRlVW5pZm9ybXMoKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0udXNlKCk7XG5cbiAgICAgICAgICAgIHRoaXMudXBkYXRlR0xQYXJhbWV0ZXJzKCk7XG5cbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDFmKHRoaXMuX3Byb2dyYW0uZ2V0VW5pZm9ybUxvY2F0aW9uRm9yTmFtZSgndGltZScpLCB0aGlzLnBhcmFtZXRlcnMudGltZSk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnNldFVuaWZvcm1Mb2NhdGlvbldpdGgyZih0aGlzLl9wcm9ncmFtLmdldFVuaWZvcm1Mb2NhdGlvbkZvck5hbWUoJ21vdXNlX3RvdWNoJyksIHRoaXMucGFyYW1ldGVycy5tb3VzZS54LCB0aGlzLnBhcmFtZXRlcnMubW91c2UueSk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnNldFVuaWZvcm1Mb2NhdGlvbldpdGgyZih0aGlzLl9wcm9ncmFtLmdldFVuaWZvcm1Mb2NhdGlvbkZvck5hbWUoJ3Jlc29sdXRpb24nKSwgdGhpcy5wYXJhbWV0ZXJzLnJlc29sdXRpb24ueCwgdGhpcy5wYXJhbWV0ZXJzLnJlc29sdXRpb24ueSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY2Muc3lzLmlzTmF0aXZlKSB7XG4gICAgICAgICAgICB2YXIgZ2xQcm9ncmFtX3N0YXRlID0gY2MuR0xQcm9ncmFtU3RhdGUuZ2V0T3JDcmVhdGVXaXRoR0xQcm9ncmFtKHRoaXMuX3Byb2dyYW0pO1xuICAgICAgICAgICAgZ2xQcm9ncmFtX3N0YXRlLnNldFVuaWZvcm1WZWMyKFwicmVzb2x1dGlvblwiLCB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbik7XG4gICAgICAgICAgICBnbFByb2dyYW1fc3RhdGUuc2V0VW5pZm9ybUZsb2F0KFwidGltZVwiLCB0aGlzLnBhcmFtZXRlcnMudGltZSk7XG4gICAgICAgICAgICBnbFByb2dyYW1fc3RhdGUuc2V0VW5pZm9ybVZlYzIoXCJtb3VzZV90b3VjaFwiLCB0aGlzLnBhcmFtZXRlcnMubW91c2UpO1xuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICB0aGlzLl9yZXNvbHV0aW9uID0gdGhpcy5fcHJvZ3JhbS5nZXRVbmlmb3JtTG9jYXRpb25Gb3JOYW1lKFwicmVzb2x1dGlvblwiKTtcbiAgICAgICAgICAgIHRoaXMuX3RpbWUgPSB0aGlzLl9wcm9ncmFtLmdldFVuaWZvcm1Mb2NhdGlvbkZvck5hbWUoXCJ0aW1lXCIpO1xuICAgICAgICAgICAgdGhpcy5fbW91c2UgPSB0aGlzLl9wcm9ncmFtLmdldFVuaWZvcm1Mb2NhdGlvbkZvck5hbWUoXCJtb3VzZV90b3VjaFwiKTtcblxuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMmYodGhpcy5fcmVzb2x1dGlvbiwgdGhpcy5wYXJhbWV0ZXJzLnJlc29sdXRpb24ueCwgdGhpcy5wYXJhbWV0ZXJzLnJlc29sdXRpb24ueSk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnNldFVuaWZvcm1Mb2NhdGlvbldpdGgxZih0aGlzLl90aW1lLCB0aGlzLnBhcmFtZXRlcnMudGltZSk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnNldFVuaWZvcm1Mb2NhdGlvbldpdGgyZih0aGlzLl9tb3VzZSwgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlLngsIHRoaXMucGFyYW1ldGVycy5tb3VzZS55KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0UHJvZ3JhbSh0aGlzLm5vZGUuX3NnTm9kZSwgdGhpcy5fcHJvZ3JhbSk7XG4gICAgfSxcblxuICAgIHNldFByb2dyYW06IGZ1bmN0aW9uIHNldFByb2dyYW0obm9kZSwgcHJvZ3JhbSkge1xuICAgICAgICBpZiAoY2Muc3lzLmlzTmF0aXZlKSB7XG4gICAgICAgICAgICB2YXIgZ2xQcm9ncmFtX3N0YXRlID0gY2MuR0xQcm9ncmFtU3RhdGUuZ2V0T3JDcmVhdGVXaXRoR0xQcm9ncmFtKHByb2dyYW0pO1xuICAgICAgICAgICAgbm9kZS5zZXRHTFByb2dyYW1TdGF0ZShnbFByb2dyYW1fc3RhdGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbm9kZS5zZXRTaGFkZXJQcm9ncmFtKHByb2dyYW0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGNoaWxkcmVuID0gbm9kZS5jaGlsZHJlbjtcbiAgICAgICAgaWYgKCFjaGlsZHJlbikgcmV0dXJuO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHRoaXMuc2V0UHJvZ3JhbShjaGlsZHJlbltpXSwgcHJvZ3JhbSk7XG4gICAgfVxuXG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzdlNzJhSFpZTlZOK29UdVRrMkFFTFZpJywgJ0VmZmVjdDA0Jyk7XG4vLyBTY3JpcHQvRWZmZWN0MDQuanNcblxudmFyIF9kZWZhdWx0X3ZlcnQgPSByZXF1aXJlKFwiLi4vU2hhZGVycy9jY1NoYWRlcl9EZWZhdWx0X1ZlcnQuanNcIik7XG52YXIgX2RlZmF1bHRfdmVydF9ub19tdnAgPSByZXF1aXJlKFwiLi4vU2hhZGVycy9jY1NoYWRlcl9EZWZhdWx0X1ZlcnRfbm9NVlAuanNcIik7XG52YXIgX2dsYXNzX2ZyYWcgPSByZXF1aXJlKFwiLi4vU2hhZGVycy9jY1NoYWRlcl9FZmZlY3QwNF9GcmFnLmpzXCIpO1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgZ2xhc3NGYWN0b3I6IDEuMFxuICAgIH0sXG5cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5wYXJhbWV0ZXJzID0ge1xuICAgICAgICAgICAgc3RhcnRUaW1lOiBEYXRlLm5vdygpLFxuICAgICAgICAgICAgdGltZTogMC4wLFxuICAgICAgICAgICAgbW91c2U6IHtcbiAgICAgICAgICAgICAgICB4OiAwLjAsXG4gICAgICAgICAgICAgICAgeTogMC4wXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVzb2x1dGlvbjoge1xuICAgICAgICAgICAgICAgIHg6IDAuMCxcbiAgICAgICAgICAgICAgICB5OiAwLjBcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9O1xuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuTU9VU0VfTU9WRSwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICB0aGlzLnBhcmFtZXRlcnMubW91c2UueCA9IHRoaXMubm9kZS5nZXRDb250ZW50U2l6ZSgpLndpZHRoIC8gZXZlbnQuZ2V0TG9jYXRpb25YKCk7XG4gICAgICAgICAgICB0aGlzLnBhcmFtZXRlcnMubW91c2UueSA9IHRoaXMubm9kZS5nZXRDb250ZW50U2l6ZSgpLmhlaWdodCAvIGV2ZW50LmdldExvY2F0aW9uWSgpO1xuICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfTU9WRSwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICB0aGlzLnBhcmFtZXRlcnMubW91c2UueCA9IHRoaXMubm9kZS5nZXRDb250ZW50U2l6ZSgpLndpZHRoIC8gZXZlbnQuZ2V0TG9jYXRpb25YKCk7XG4gICAgICAgICAgICB0aGlzLnBhcmFtZXRlcnMubW91c2UueSA9IHRoaXMubm9kZS5nZXRDb250ZW50U2l6ZSgpLmhlaWdodCAvIGV2ZW50LmdldExvY2F0aW9uWSgpO1xuICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICB0aGlzLl91c2UoKTtcbiAgICB9LFxuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKGR0KSB7XG4gICAgICAgIGlmICh0aGlzLmdsYXNzRmFjdG9yID49IDQwKSB7XG4gICAgICAgICAgICB0aGlzLmdsYXNzRmFjdG9yID0gMDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmdsYXNzRmFjdG9yICs9IGR0ICogMztcblxuICAgICAgICBpZiAodGhpcy5fcHJvZ3JhbSkge1xuXG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnVzZSgpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVHTFBhcmFtZXRlcnMoKTtcbiAgICAgICAgICAgIGlmIChjYy5zeXMuaXNOYXRpdmUpIHtcbiAgICAgICAgICAgICAgICB2YXIgZ2xQcm9ncmFtX3N0YXRlID0gY2MuR0xQcm9ncmFtU3RhdGUuZ2V0T3JDcmVhdGVXaXRoR0xQcm9ncmFtKHRoaXMuX3Byb2dyYW0pO1xuICAgICAgICAgICAgICAgIGdsUHJvZ3JhbV9zdGF0ZS5zZXRVbmlmb3JtVmVjMihcInJlc29sdXRpb25cIiwgdGhpcy5wYXJhbWV0ZXJzLnJlc29sdXRpb24pO1xuICAgICAgICAgICAgICAgIGdsUHJvZ3JhbV9zdGF0ZS5zZXRVbmlmb3JtRmxvYXQoXCJ0aW1lXCIsIHRoaXMucGFyYW1ldGVycy50aW1lKTtcbiAgICAgICAgICAgICAgICBnbFByb2dyYW1fc3RhdGUuc2V0VW5pZm9ybVZlYzIoXCJtb3VzZV90b3VjaFwiLCB0aGlzLnBhcmFtZXRlcnMubW91c2UpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnNldFVuaWZvcm1Mb2NhdGlvbldpdGgyZih0aGlzLl9yZXNvbHV0aW9uLCB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbi54LCB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbi55KTtcbiAgICAgICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnNldFVuaWZvcm1Mb2NhdGlvbldpdGgxZih0aGlzLl90aW1lLCB0aGlzLnBhcmFtZXRlcnMudGltZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMmYodGhpcy5fbW91c2UsIHRoaXMucGFyYW1ldGVycy5tb3VzZS54LCB0aGlzLnBhcmFtZXRlcnMubW91c2UueCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHVwZGF0ZUdMUGFyYW1ldGVyczogZnVuY3Rpb24gdXBkYXRlR0xQYXJhbWV0ZXJzKCkge1xuICAgICAgICB0aGlzLnBhcmFtZXRlcnMudGltZSA9IChEYXRlLm5vdygpIC0gdGhpcy5wYXJhbWV0ZXJzLnN0YXJ0VGltZSkgLyAxMDAwO1xuICAgICAgICB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbi54ID0gdGhpcy5ub2RlLmdldENvbnRlbnRTaXplKCkud2lkdGg7XG4gICAgICAgIHRoaXMucGFyYW1ldGVycy5yZXNvbHV0aW9uLnkgPSB0aGlzLm5vZGUuZ2V0Q29udGVudFNpemUoKS5oZWlnaHQ7XG4gICAgfSxcblxuICAgIF91c2U6IGZ1bmN0aW9uIF91c2UoKSB7XG5cbiAgICAgICAgaWYgKGNjLnN5cy5pc05hdGl2ZSkge1xuICAgICAgICAgICAgY2MubG9nKFwidXNlIG5hdGl2ZSBHTFByb2dyYW1cIik7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtID0gbmV3IGNjLkdMUHJvZ3JhbSgpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5pbml0V2l0aFN0cmluZyhfZGVmYXVsdF92ZXJ0X25vX212cCwgX2dsYXNzX2ZyYWcpO1xuXG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5tYWNyby5BVFRSSUJVVEVfTkFNRV9QT1NJVElPTiwgY2MubWFjcm8uVkVSVEVYX0FUVFJJQl9QT1NJVElPTik7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5tYWNyby5BVFRSSUJVVEVfTkFNRV9DT0xPUiwgY2MubWFjcm8uVkVSVEVYX0FUVFJJQl9DT0xPUik7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5tYWNyby5BVFRSSUJVVEVfTkFNRV9URVhfQ09PUkQsIGNjLm1hY3JvLlZFUlRFWF9BVFRSSUJfVEVYX0NPT1JEUyk7XG5cbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0ubGluaygpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS51cGRhdGVVbmlmb3JtcygpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVHTFBhcmFtZXRlcnMoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0gPSBuZXcgY2MuR0xQcm9ncmFtKCk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmluaXRXaXRoVmVydGV4U2hhZGVyQnl0ZUFycmF5KF9kZWZhdWx0X3ZlcnQsIF9nbGFzc19mcmFnKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uYWRkQXR0cmlidXRlKGNjLm1hY3JvLkFUVFJJQlVURV9OQU1FX1BPU0lUSU9OLCBjYy5tYWNyby5WRVJURVhfQVRUUklCX1BPU0lUSU9OKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uYWRkQXR0cmlidXRlKGNjLm1hY3JvLkFUVFJJQlVURV9OQU1FX0NPTE9SLCBjYy5tYWNyby5WRVJURVhfQVRUUklCX0NPTE9SKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uYWRkQXR0cmlidXRlKGNjLm1hY3JvLkFUVFJJQlVURV9OQU1FX1RFWF9DT09SRCwgY2MubWFjcm8uVkVSVEVYX0FUVFJJQl9URVhfQ09PUkRTKTtcblxuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5saW5rKCk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnVwZGF0ZVVuaWZvcm1zKCk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnVzZSgpO1xuXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUdMUGFyYW1ldGVycygpO1xuXG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnNldFVuaWZvcm1Mb2NhdGlvbldpdGgxZih0aGlzLl9wcm9ncmFtLmdldFVuaWZvcm1Mb2NhdGlvbkZvck5hbWUoJ3RpbWUnKSwgdGhpcy5wYXJhbWV0ZXJzLnRpbWUpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMmYodGhpcy5fcHJvZ3JhbS5nZXRVbmlmb3JtTG9jYXRpb25Gb3JOYW1lKCdtb3VzZV90b3VjaCcpLCB0aGlzLnBhcmFtZXRlcnMubW91c2UueCwgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlLnkpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMmYodGhpcy5fcHJvZ3JhbS5nZXRVbmlmb3JtTG9jYXRpb25Gb3JOYW1lKCdyZXNvbHV0aW9uJyksIHRoaXMucGFyYW1ldGVycy5yZXNvbHV0aW9uLngsIHRoaXMucGFyYW1ldGVycy5yZXNvbHV0aW9uLnkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNjLnN5cy5pc05hdGl2ZSkge1xuICAgICAgICAgICAgdmFyIGdsUHJvZ3JhbV9zdGF0ZSA9IGNjLkdMUHJvZ3JhbVN0YXRlLmdldE9yQ3JlYXRlV2l0aEdMUHJvZ3JhbSh0aGlzLl9wcm9ncmFtKTtcbiAgICAgICAgICAgIGdsUHJvZ3JhbV9zdGF0ZS5zZXRVbmlmb3JtVmVjMihcInJlc29sdXRpb25cIiwgdGhpcy5wYXJhbWV0ZXJzLnJlc29sdXRpb24pO1xuICAgICAgICAgICAgZ2xQcm9ncmFtX3N0YXRlLnNldFVuaWZvcm1GbG9hdChcInRpbWVcIiwgdGhpcy5wYXJhbWV0ZXJzLnRpbWUpO1xuICAgICAgICAgICAgZ2xQcm9ncmFtX3N0YXRlLnNldFVuaWZvcm1WZWMyKFwibW91c2VfdG91Y2hcIiwgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlKTtcbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgdGhpcy5fcmVzb2x1dGlvbiA9IHRoaXMuX3Byb2dyYW0uZ2V0VW5pZm9ybUxvY2F0aW9uRm9yTmFtZShcInJlc29sdXRpb25cIik7XG4gICAgICAgICAgICB0aGlzLl90aW1lID0gdGhpcy5fcHJvZ3JhbS5nZXRVbmlmb3JtTG9jYXRpb25Gb3JOYW1lKFwidGltZVwiKTtcbiAgICAgICAgICAgIHRoaXMuX21vdXNlID0gdGhpcy5fcHJvZ3JhbS5nZXRVbmlmb3JtTG9jYXRpb25Gb3JOYW1lKFwibW91c2VfdG91Y2hcIik7XG5cbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDJmKHRoaXMuX3Jlc29sdXRpb24sIHRoaXMucGFyYW1ldGVycy5yZXNvbHV0aW9uLngsIHRoaXMucGFyYW1ldGVycy5yZXNvbHV0aW9uLnkpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMWYodGhpcy5fdGltZSwgdGhpcy5wYXJhbWV0ZXJzLnRpbWUpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMmYodGhpcy5fbW91c2UsIHRoaXMucGFyYW1ldGVycy5tb3VzZS54LCB0aGlzLnBhcmFtZXRlcnMubW91c2UueSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNldFByb2dyYW0odGhpcy5ub2RlLl9zZ05vZGUsIHRoaXMuX3Byb2dyYW0pO1xuICAgIH0sXG5cbiAgICBzZXRQcm9ncmFtOiBmdW5jdGlvbiBzZXRQcm9ncmFtKG5vZGUsIHByb2dyYW0pIHtcbiAgICAgICAgaWYgKGNjLnN5cy5pc05hdGl2ZSkge1xuICAgICAgICAgICAgdmFyIGdsUHJvZ3JhbV9zdGF0ZSA9IGNjLkdMUHJvZ3JhbVN0YXRlLmdldE9yQ3JlYXRlV2l0aEdMUHJvZ3JhbShwcm9ncmFtKTtcbiAgICAgICAgICAgIG5vZGUuc2V0R0xQcm9ncmFtU3RhdGUoZ2xQcm9ncmFtX3N0YXRlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5vZGUuc2V0U2hhZGVyUHJvZ3JhbShwcm9ncmFtKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBjaGlsZHJlbiA9IG5vZGUuY2hpbGRyZW47XG4gICAgICAgIGlmICghY2hpbGRyZW4pIHJldHVybjtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB0aGlzLnNldFByb2dyYW0oY2hpbGRyZW5baV0sIHByb2dyYW0pO1xuICAgIH1cblxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc4N2NmY2Mxc0RoRzhKTldpQUJ2dDFwQScsICdFZmZlY3QwNScpO1xuLy8gU2NyaXB0L0VmZmVjdDA1LmpzXG5cbnZhciBfZGVmYXVsdF92ZXJ0ID0gcmVxdWlyZShcIi4uL1NoYWRlcnMvY2NTaGFkZXJfRGVmYXVsdF9WZXJ0LmpzXCIpO1xudmFyIF9kZWZhdWx0X3ZlcnRfbm9fbXZwID0gcmVxdWlyZShcIi4uL1NoYWRlcnMvY2NTaGFkZXJfRGVmYXVsdF9WZXJ0X25vTVZQLmpzXCIpO1xudmFyIF9nbGFzc19mcmFnID0gcmVxdWlyZShcIi4uL1NoYWRlcnMvY2NTaGFkZXJfRWZmZWN0MDVfRnJhZy5qc1wiKTtcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGdsYXNzRmFjdG9yOiAxLjBcbiAgICB9LFxuXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHRoaXMucGFyYW1ldGVycyA9IHtcbiAgICAgICAgICAgIHN0YXJ0VGltZTogRGF0ZS5ub3coKSxcbiAgICAgICAgICAgIHRpbWU6IDAuMCxcbiAgICAgICAgICAgIG1vdXNlOiB7XG4gICAgICAgICAgICAgICAgeDogMC4wLFxuICAgICAgICAgICAgICAgIHk6IDAuMFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlc29sdXRpb246IHtcbiAgICAgICAgICAgICAgICB4OiAwLjAsXG4gICAgICAgICAgICAgICAgeTogMC4wXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLk1PVVNFX01PVkUsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlLnggPSB0aGlzLm5vZGUuZ2V0Q29udGVudFNpemUoKS53aWR0aCAvIGV2ZW50LmdldExvY2F0aW9uWCgpO1xuICAgICAgICAgICAgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlLnkgPSB0aGlzLm5vZGUuZ2V0Q29udGVudFNpemUoKS5oZWlnaHQgLyBldmVudC5nZXRMb2NhdGlvblkoKTtcbiAgICAgICAgfSwgdGhpcyk7XG5cbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX01PVkUsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlLnggPSB0aGlzLm5vZGUuZ2V0Q29udGVudFNpemUoKS53aWR0aCAvIGV2ZW50LmdldExvY2F0aW9uWCgpO1xuICAgICAgICAgICAgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlLnkgPSB0aGlzLm5vZGUuZ2V0Q29udGVudFNpemUoKS5oZWlnaHQgLyBldmVudC5nZXRMb2NhdGlvblkoKTtcbiAgICAgICAgfSwgdGhpcyk7XG5cbiAgICAgICAgdGhpcy5fdXNlKCk7XG4gICAgfSxcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShkdCkge1xuICAgICAgICBpZiAodGhpcy5nbGFzc0ZhY3RvciA+PSA0MCkge1xuICAgICAgICAgICAgdGhpcy5nbGFzc0ZhY3RvciA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5nbGFzc0ZhY3RvciArPSBkdCAqIDM7XG5cbiAgICAgICAgaWYgKHRoaXMuX3Byb2dyYW0pIHtcblxuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS51c2UoKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlR0xQYXJhbWV0ZXJzKCk7XG4gICAgICAgICAgICBpZiAoY2Muc3lzLmlzTmF0aXZlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGdsUHJvZ3JhbV9zdGF0ZSA9IGNjLkdMUHJvZ3JhbVN0YXRlLmdldE9yQ3JlYXRlV2l0aEdMUHJvZ3JhbSh0aGlzLl9wcm9ncmFtKTtcbiAgICAgICAgICAgICAgICBnbFByb2dyYW1fc3RhdGUuc2V0VW5pZm9ybVZlYzIoXCJyZXNvbHV0aW9uXCIsIHRoaXMucGFyYW1ldGVycy5yZXNvbHV0aW9uKTtcbiAgICAgICAgICAgICAgICBnbFByb2dyYW1fc3RhdGUuc2V0VW5pZm9ybUZsb2F0KFwidGltZVwiLCB0aGlzLnBhcmFtZXRlcnMudGltZSk7XG4gICAgICAgICAgICAgICAgZ2xQcm9ncmFtX3N0YXRlLnNldFVuaWZvcm1WZWMyKFwibW91c2VcIiwgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMmYodGhpcy5fcmVzb2x1dGlvbiwgdGhpcy5wYXJhbWV0ZXJzLnJlc29sdXRpb24ueCwgdGhpcy5wYXJhbWV0ZXJzLnJlc29sdXRpb24ueSk7XG4gICAgICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMWYodGhpcy5fdGltZSwgdGhpcy5wYXJhbWV0ZXJzLnRpbWUpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDJmKHRoaXMuX21vdXNlLCB0aGlzLnBhcmFtZXRlcnMubW91c2UueCwgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlLngpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICB1cGRhdGVHTFBhcmFtZXRlcnM6IGZ1bmN0aW9uIHVwZGF0ZUdMUGFyYW1ldGVycygpIHtcbiAgICAgICAgdGhpcy5wYXJhbWV0ZXJzLnRpbWUgPSAoRGF0ZS5ub3coKSAtIHRoaXMucGFyYW1ldGVycy5zdGFydFRpbWUpIC8gMTAwMDtcbiAgICAgICAgdGhpcy5wYXJhbWV0ZXJzLnJlc29sdXRpb24ueCA9IHRoaXMubm9kZS5nZXRDb250ZW50U2l6ZSgpLndpZHRoO1xuICAgICAgICB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbi55ID0gdGhpcy5ub2RlLmdldENvbnRlbnRTaXplKCkuaGVpZ2h0O1xuICAgIH0sXG5cbiAgICBfdXNlOiBmdW5jdGlvbiBfdXNlKCkge1xuXG4gICAgICAgIGlmIChjYy5zeXMuaXNOYXRpdmUpIHtcbiAgICAgICAgICAgIGNjLmxvZyhcInVzZSBuYXRpdmUgR0xQcm9ncmFtXCIpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbSA9IG5ldyBjYy5HTFByb2dyYW0oKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uaW5pdFdpdGhTdHJpbmcoX2RlZmF1bHRfdmVydF9ub19tdnAsIF9nbGFzc19mcmFnKTtcblxuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MubWFjcm8uQVRUUklCVVRFX05BTUVfUE9TSVRJT04sIGNjLm1hY3JvLlZFUlRFWF9BVFRSSUJfUE9TSVRJT04pO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MubWFjcm8uQVRUUklCVVRFX05BTUVfQ09MT1IsIGNjLm1hY3JvLlZFUlRFWF9BVFRSSUJfQ09MT1IpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MubWFjcm8uQVRUUklCVVRFX05BTUVfVEVYX0NPT1JELCBjYy5tYWNyby5WRVJURVhfQVRUUklCX1RFWF9DT09SRFMpO1xuXG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmxpbmsoKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0udXBkYXRlVW5pZm9ybXMoKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlR0xQYXJhbWV0ZXJzKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtID0gbmV3IGNjLkdMUHJvZ3JhbSgpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5pbml0V2l0aFZlcnRleFNoYWRlckJ5dGVBcnJheShfZGVmYXVsdF92ZXJ0LCBfZ2xhc3NfZnJhZyk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5tYWNyby5BVFRSSUJVVEVfTkFNRV9QT1NJVElPTiwgY2MubWFjcm8uVkVSVEVYX0FUVFJJQl9QT1NJVElPTik7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5tYWNyby5BVFRSSUJVVEVfTkFNRV9DT0xPUiwgY2MubWFjcm8uVkVSVEVYX0FUVFJJQl9DT0xPUik7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5tYWNyby5BVFRSSUJVVEVfTkFNRV9URVhfQ09PUkQsIGNjLm1hY3JvLlZFUlRFWF9BVFRSSUJfVEVYX0NPT1JEUyk7XG5cbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0ubGluaygpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS51cGRhdGVVbmlmb3JtcygpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS51c2UoKTtcblxuICAgICAgICAgICAgdGhpcy51cGRhdGVHTFBhcmFtZXRlcnMoKTtcblxuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMWYodGhpcy5fcHJvZ3JhbS5nZXRVbmlmb3JtTG9jYXRpb25Gb3JOYW1lKCd0aW1lJyksIHRoaXMucGFyYW1ldGVycy50aW1lKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDJmKHRoaXMuX3Byb2dyYW0uZ2V0VW5pZm9ybUxvY2F0aW9uRm9yTmFtZSgnbW91c2UnKSwgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlLngsIHRoaXMucGFyYW1ldGVycy5tb3VzZS55KTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDJmKHRoaXMuX3Byb2dyYW0uZ2V0VW5pZm9ybUxvY2F0aW9uRm9yTmFtZSgncmVzb2x1dGlvbicpLCB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbi54LCB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbi55KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjYy5zeXMuaXNOYXRpdmUpIHtcbiAgICAgICAgICAgIHZhciBnbFByb2dyYW1fc3RhdGUgPSBjYy5HTFByb2dyYW1TdGF0ZS5nZXRPckNyZWF0ZVdpdGhHTFByb2dyYW0odGhpcy5fcHJvZ3JhbSk7XG4gICAgICAgICAgICBnbFByb2dyYW1fc3RhdGUuc2V0VW5pZm9ybVZlYzIoXCJyZXNvbHV0aW9uXCIsIHRoaXMucGFyYW1ldGVycy5yZXNvbHV0aW9uKTtcbiAgICAgICAgICAgIGdsUHJvZ3JhbV9zdGF0ZS5zZXRVbmlmb3JtRmxvYXQoXCJ0aW1lXCIsIHRoaXMucGFyYW1ldGVycy50aW1lKTtcbiAgICAgICAgICAgIGdsUHJvZ3JhbV9zdGF0ZS5zZXRVbmlmb3JtVmVjMihcIm1vdXNlXCIsIHRoaXMucGFyYW1ldGVycy5tb3VzZSk7XG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgIHRoaXMuX3Jlc29sdXRpb24gPSB0aGlzLl9wcm9ncmFtLmdldFVuaWZvcm1Mb2NhdGlvbkZvck5hbWUoXCJyZXNvbHV0aW9uXCIpO1xuICAgICAgICAgICAgdGhpcy5fdGltZSA9IHRoaXMuX3Byb2dyYW0uZ2V0VW5pZm9ybUxvY2F0aW9uRm9yTmFtZShcInRpbWVcIik7XG4gICAgICAgICAgICB0aGlzLl9tb3VzZSA9IHRoaXMuX3Byb2dyYW0uZ2V0VW5pZm9ybUxvY2F0aW9uRm9yTmFtZShcIm1vdXNlXCIpO1xuXG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnNldFVuaWZvcm1Mb2NhdGlvbldpdGgyZih0aGlzLl9yZXNvbHV0aW9uLCB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbi54LCB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbi55KTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDFmKHRoaXMuX3RpbWUsIHRoaXMucGFyYW1ldGVycy50aW1lKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDJmKHRoaXMuX21vdXNlLCB0aGlzLnBhcmFtZXRlcnMubW91c2UueCwgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlLnkpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZXRQcm9ncmFtKHRoaXMubm9kZS5fc2dOb2RlLCB0aGlzLl9wcm9ncmFtKTtcbiAgICB9LFxuXG4gICAgc2V0UHJvZ3JhbTogZnVuY3Rpb24gc2V0UHJvZ3JhbShub2RlLCBwcm9ncmFtKSB7XG4gICAgICAgIGlmIChjYy5zeXMuaXNOYXRpdmUpIHtcbiAgICAgICAgICAgIHZhciBnbFByb2dyYW1fc3RhdGUgPSBjYy5HTFByb2dyYW1TdGF0ZS5nZXRPckNyZWF0ZVdpdGhHTFByb2dyYW0ocHJvZ3JhbSk7XG4gICAgICAgICAgICBub2RlLnNldEdMUHJvZ3JhbVN0YXRlKGdsUHJvZ3JhbV9zdGF0ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBub2RlLnNldFNoYWRlclByb2dyYW0ocHJvZ3JhbSk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgY2hpbGRyZW4gPSBub2RlLmNoaWxkcmVuO1xuICAgICAgICBpZiAoIWNoaWxkcmVuKSByZXR1cm47XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykgdGhpcy5zZXRQcm9ncmFtKGNoaWxkcmVuW2ldLCBwcm9ncmFtKTtcbiAgICB9XG5cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnNWU1NmI4QkttZEtNN29PRHVLa1R5V2UnLCAnRWZmZWN0MDYnKTtcbi8vIFNjcmlwdC9FZmZlY3QwNi5qc1xuXG52YXIgX2RlZmF1bHRfdmVydCA9IHJlcXVpcmUoXCIuLi9TaGFkZXJzL2NjU2hhZGVyX0RlZmF1bHRfVmVydC5qc1wiKTtcbnZhciBfZGVmYXVsdF92ZXJ0X25vX212cCA9IHJlcXVpcmUoXCIuLi9TaGFkZXJzL2NjU2hhZGVyX0RlZmF1bHRfVmVydF9ub01WUC5qc1wiKTtcbnZhciBfZ2xhc3NfZnJhZyA9IHJlcXVpcmUoXCIuLi9TaGFkZXJzL2NjU2hhZGVyX0VmZmVjdDA2X0ZyYWcuanNcIik7XG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBnbGFzc0ZhY3RvcjogMS4wXG4gICAgfSxcblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLnBhcmFtZXRlcnMgPSB7XG4gICAgICAgICAgICBzdGFydFRpbWU6IERhdGUubm93KCksXG4gICAgICAgICAgICB0aW1lOiAwLjAsXG4gICAgICAgICAgICBtb3VzZToge1xuICAgICAgICAgICAgICAgIHg6IDAuMCxcbiAgICAgICAgICAgICAgICB5OiAwLjBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZXNvbHV0aW9uOiB7XG4gICAgICAgICAgICAgICAgeDogMC4wLFxuICAgICAgICAgICAgICAgIHk6IDAuMFxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5NT1VTRV9NT1ZFLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIHRoaXMucGFyYW1ldGVycy5tb3VzZS54ID0gdGhpcy5ub2RlLmdldENvbnRlbnRTaXplKCkud2lkdGggLyBldmVudC5nZXRMb2NhdGlvblgoKTtcbiAgICAgICAgICAgIHRoaXMucGFyYW1ldGVycy5tb3VzZS55ID0gdGhpcy5ub2RlLmdldENvbnRlbnRTaXplKCkuaGVpZ2h0IC8gZXZlbnQuZ2V0TG9jYXRpb25ZKCk7XG4gICAgICAgIH0sIHRoaXMpO1xuXG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9NT1ZFLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIHRoaXMucGFyYW1ldGVycy5tb3VzZS54ID0gdGhpcy5ub2RlLmdldENvbnRlbnRTaXplKCkud2lkdGggLyBldmVudC5nZXRMb2NhdGlvblgoKTtcbiAgICAgICAgICAgIHRoaXMucGFyYW1ldGVycy5tb3VzZS55ID0gdGhpcy5ub2RlLmdldENvbnRlbnRTaXplKCkuaGVpZ2h0IC8gZXZlbnQuZ2V0TG9jYXRpb25ZKCk7XG4gICAgICAgIH0sIHRoaXMpO1xuXG4gICAgICAgIHRoaXMuX3VzZSgpO1xuICAgIH0sXG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoZHQpIHtcbiAgICAgICAgaWYgKHRoaXMuZ2xhc3NGYWN0b3IgPj0gNDApIHtcbiAgICAgICAgICAgIHRoaXMuZ2xhc3NGYWN0b3IgPSAwO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZ2xhc3NGYWN0b3IgKz0gZHQgKiAzO1xuXG4gICAgICAgIGlmICh0aGlzLl9wcm9ncmFtKSB7XG5cbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0udXNlKCk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUdMUGFyYW1ldGVycygpO1xuICAgICAgICAgICAgaWYgKGNjLnN5cy5pc05hdGl2ZSkge1xuICAgICAgICAgICAgICAgIHZhciBnbFByb2dyYW1fc3RhdGUgPSBjYy5HTFByb2dyYW1TdGF0ZS5nZXRPckNyZWF0ZVdpdGhHTFByb2dyYW0odGhpcy5fcHJvZ3JhbSk7XG4gICAgICAgICAgICAgICAgZ2xQcm9ncmFtX3N0YXRlLnNldFVuaWZvcm1WZWMyKFwicmVzb2x1dGlvblwiLCB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbik7XG4gICAgICAgICAgICAgICAgZ2xQcm9ncmFtX3N0YXRlLnNldFVuaWZvcm1GbG9hdChcInRpbWVcIiwgdGhpcy5wYXJhbWV0ZXJzLnRpbWUpO1xuICAgICAgICAgICAgICAgIGdsUHJvZ3JhbV9zdGF0ZS5zZXRVbmlmb3JtVmVjMihcIm1vdXNlXCIsIHRoaXMucGFyYW1ldGVycy5tb3VzZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDJmKHRoaXMuX3Jlc29sdXRpb24sIHRoaXMucGFyYW1ldGVycy5yZXNvbHV0aW9uLngsIHRoaXMucGFyYW1ldGVycy5yZXNvbHV0aW9uLnkpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDFmKHRoaXMuX3RpbWUsIHRoaXMucGFyYW1ldGVycy50aW1lKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnNldFVuaWZvcm1Mb2NhdGlvbldpdGgyZih0aGlzLl9tb3VzZSwgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlLngsIHRoaXMucGFyYW1ldGVycy5tb3VzZS54KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgdXBkYXRlR0xQYXJhbWV0ZXJzOiBmdW5jdGlvbiB1cGRhdGVHTFBhcmFtZXRlcnMoKSB7XG4gICAgICAgIHRoaXMucGFyYW1ldGVycy50aW1lID0gKERhdGUubm93KCkgLSB0aGlzLnBhcmFtZXRlcnMuc3RhcnRUaW1lKSAvIDEwMDA7XG4gICAgICAgIHRoaXMucGFyYW1ldGVycy5yZXNvbHV0aW9uLnggPSB0aGlzLm5vZGUuZ2V0Q29udGVudFNpemUoKS53aWR0aDtcbiAgICAgICAgdGhpcy5wYXJhbWV0ZXJzLnJlc29sdXRpb24ueSA9IHRoaXMubm9kZS5nZXRDb250ZW50U2l6ZSgpLmhlaWdodDtcbiAgICB9LFxuXG4gICAgX3VzZTogZnVuY3Rpb24gX3VzZSgpIHtcblxuICAgICAgICBpZiAoY2Muc3lzLmlzTmF0aXZlKSB7XG4gICAgICAgICAgICBjYy5sb2coXCJ1c2UgbmF0aXZlIEdMUHJvZ3JhbVwiKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0gPSBuZXcgY2MuR0xQcm9ncmFtKCk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmluaXRXaXRoU3RyaW5nKF9kZWZhdWx0X3ZlcnRfbm9fbXZwLCBfZ2xhc3NfZnJhZyk7XG5cbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uYWRkQXR0cmlidXRlKGNjLm1hY3JvLkFUVFJJQlVURV9OQU1FX1BPU0lUSU9OLCBjYy5tYWNyby5WRVJURVhfQVRUUklCX1BPU0lUSU9OKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uYWRkQXR0cmlidXRlKGNjLm1hY3JvLkFUVFJJQlVURV9OQU1FX0NPTE9SLCBjYy5tYWNyby5WRVJURVhfQVRUUklCX0NPTE9SKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uYWRkQXR0cmlidXRlKGNjLm1hY3JvLkFUVFJJQlVURV9OQU1FX1RFWF9DT09SRCwgY2MubWFjcm8uVkVSVEVYX0FUVFJJQl9URVhfQ09PUkRTKTtcblxuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5saW5rKCk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnVwZGF0ZVVuaWZvcm1zKCk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUdMUGFyYW1ldGVycygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbSA9IG5ldyBjYy5HTFByb2dyYW0oKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uaW5pdFdpdGhWZXJ0ZXhTaGFkZXJCeXRlQXJyYXkoX2RlZmF1bHRfdmVydCwgX2dsYXNzX2ZyYWcpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MubWFjcm8uQVRUUklCVVRFX05BTUVfUE9TSVRJT04sIGNjLm1hY3JvLlZFUlRFWF9BVFRSSUJfUE9TSVRJT04pO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MubWFjcm8uQVRUUklCVVRFX05BTUVfQ09MT1IsIGNjLm1hY3JvLlZFUlRFWF9BVFRSSUJfQ09MT1IpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MubWFjcm8uQVRUUklCVVRFX05BTUVfVEVYX0NPT1JELCBjYy5tYWNyby5WRVJURVhfQVRUUklCX1RFWF9DT09SRFMpO1xuXG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmxpbmsoKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0udXBkYXRlVW5pZm9ybXMoKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0udXNlKCk7XG5cbiAgICAgICAgICAgIHRoaXMudXBkYXRlR0xQYXJhbWV0ZXJzKCk7XG5cbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDFmKHRoaXMuX3Byb2dyYW0uZ2V0VW5pZm9ybUxvY2F0aW9uRm9yTmFtZSgndGltZScpLCB0aGlzLnBhcmFtZXRlcnMudGltZSk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnNldFVuaWZvcm1Mb2NhdGlvbldpdGgyZih0aGlzLl9wcm9ncmFtLmdldFVuaWZvcm1Mb2NhdGlvbkZvck5hbWUoJ21vdXNlJyksIHRoaXMucGFyYW1ldGVycy5tb3VzZS54LCB0aGlzLnBhcmFtZXRlcnMubW91c2UueSk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnNldFVuaWZvcm1Mb2NhdGlvbldpdGgyZih0aGlzLl9wcm9ncmFtLmdldFVuaWZvcm1Mb2NhdGlvbkZvck5hbWUoJ3Jlc29sdXRpb24nKSwgdGhpcy5wYXJhbWV0ZXJzLnJlc29sdXRpb24ueCwgdGhpcy5wYXJhbWV0ZXJzLnJlc29sdXRpb24ueSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY2Muc3lzLmlzTmF0aXZlKSB7XG4gICAgICAgICAgICB2YXIgZ2xQcm9ncmFtX3N0YXRlID0gY2MuR0xQcm9ncmFtU3RhdGUuZ2V0T3JDcmVhdGVXaXRoR0xQcm9ncmFtKHRoaXMuX3Byb2dyYW0pO1xuICAgICAgICAgICAgZ2xQcm9ncmFtX3N0YXRlLnNldFVuaWZvcm1WZWMyKFwicmVzb2x1dGlvblwiLCB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbik7XG4gICAgICAgICAgICBnbFByb2dyYW1fc3RhdGUuc2V0VW5pZm9ybUZsb2F0KFwidGltZVwiLCB0aGlzLnBhcmFtZXRlcnMudGltZSk7XG4gICAgICAgICAgICBnbFByb2dyYW1fc3RhdGUuc2V0VW5pZm9ybVZlYzIoXCJtb3VzZVwiLCB0aGlzLnBhcmFtZXRlcnMubW91c2UpO1xuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICB0aGlzLl9yZXNvbHV0aW9uID0gdGhpcy5fcHJvZ3JhbS5nZXRVbmlmb3JtTG9jYXRpb25Gb3JOYW1lKFwicmVzb2x1dGlvblwiKTtcbiAgICAgICAgICAgIHRoaXMuX3RpbWUgPSB0aGlzLl9wcm9ncmFtLmdldFVuaWZvcm1Mb2NhdGlvbkZvck5hbWUoXCJ0aW1lXCIpO1xuICAgICAgICAgICAgdGhpcy5fbW91c2UgPSB0aGlzLl9wcm9ncmFtLmdldFVuaWZvcm1Mb2NhdGlvbkZvck5hbWUoXCJtb3VzZVwiKTtcblxuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMmYodGhpcy5fcmVzb2x1dGlvbiwgdGhpcy5wYXJhbWV0ZXJzLnJlc29sdXRpb24ueCwgdGhpcy5wYXJhbWV0ZXJzLnJlc29sdXRpb24ueSk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnNldFVuaWZvcm1Mb2NhdGlvbldpdGgxZih0aGlzLl90aW1lLCB0aGlzLnBhcmFtZXRlcnMudGltZSk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnNldFVuaWZvcm1Mb2NhdGlvbldpdGgyZih0aGlzLl9tb3VzZSwgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlLngsIHRoaXMucGFyYW1ldGVycy5tb3VzZS55KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0UHJvZ3JhbSh0aGlzLm5vZGUuX3NnTm9kZSwgdGhpcy5fcHJvZ3JhbSk7XG4gICAgfSxcblxuICAgIHNldFByb2dyYW06IGZ1bmN0aW9uIHNldFByb2dyYW0obm9kZSwgcHJvZ3JhbSkge1xuICAgICAgICBpZiAoY2Muc3lzLmlzTmF0aXZlKSB7XG4gICAgICAgICAgICB2YXIgZ2xQcm9ncmFtX3N0YXRlID0gY2MuR0xQcm9ncmFtU3RhdGUuZ2V0T3JDcmVhdGVXaXRoR0xQcm9ncmFtKHByb2dyYW0pO1xuICAgICAgICAgICAgbm9kZS5zZXRHTFByb2dyYW1TdGF0ZShnbFByb2dyYW1fc3RhdGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbm9kZS5zZXRTaGFkZXJQcm9ncmFtKHByb2dyYW0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGNoaWxkcmVuID0gbm9kZS5jaGlsZHJlbjtcbiAgICAgICAgaWYgKCFjaGlsZHJlbikgcmV0dXJuO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHRoaXMuc2V0UHJvZ3JhbShjaGlsZHJlbltpXSwgcHJvZ3JhbSk7XG4gICAgfVxuXG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzdiZTA1MytHR0JBcklyemFGa1lDVDFnJywgJ0VmZmVjdDA3Jyk7XG4vLyBTY3JpcHQvRWZmZWN0MDcuanNcblxudmFyIF9kZWZhdWx0X3ZlcnQgPSByZXF1aXJlKFwiLi4vU2hhZGVycy9jY1NoYWRlcl9EZWZhdWx0X1ZlcnQuanNcIik7XG52YXIgX2RlZmF1bHRfdmVydF9ub19tdnAgPSByZXF1aXJlKFwiLi4vU2hhZGVycy9jY1NoYWRlcl9EZWZhdWx0X1ZlcnRfbm9NVlAuanNcIik7XG52YXIgX2dsYXNzX2ZyYWcgPSByZXF1aXJlKFwiLi4vU2hhZGVycy9jY1NoYWRlcl9FZmZlY3QwNF9GcmFnLmpzXCIpO1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgZ2xhc3NGYWN0b3I6IDEuMCxcbiAgICAgICAgZmxhZ1NoYWRlcjogXCJwcmVjaXNpb24gbWVkaXVtcCBmbG9hdDsgdW5pZm9ybSBmbG9hdCB0aW1lOyB1bmlmb3JtIHZlYzIgbW91c2U7IHVuaWZvcm0gdmVjMiByZXNvbHV0aW9uOyBjb25zdCBpbnQgbnVtQmxvYnMgPSAxMjg7IHZvaWQgbWFpbiggdm9pZCApIHsgICAgIHZlYzIgcCA9IChnbF9GcmFnQ29vcmQueHkgLyByZXNvbHV0aW9uLngpIC0gdmVjMigwLjUsIDAuNSAqIChyZXNvbHV0aW9uLnkgLyByZXNvbHV0aW9uLngpKTsgICAgIHZlYzMgYyA9IHZlYzMoMC4wKTsgICAgIGZvciAoaW50IGk9MDsgaTxudW1CbG9iczsgaSsrKSAgeyAgICAgICBmbG9hdCBweCA9IHNpbihmbG9hdChpKSowLjEgKyAwLjUpICogMC40OyAgICAgICBmbG9hdCBweSA9IHNpbihmbG9hdChpKmkpKjAuMDEgKyAwLjQqdGltZSkgKiAwLjI7ICAgICAgIGZsb2F0IHB6ID0gc2luKGZsb2F0KGkqaSppKSowLjAwMSArIDAuMyp0aW1lKSAqIDAuMyArIDAuNDsgICAgICBmbG9hdCByYWRpdXMgPSAwLjAwNSAvIHB6OyAgICAgIHZlYzIgcG9zID0gcCArIHZlYzIocHgsIHB5KTsgICAgICAgIGZsb2F0IHogPSByYWRpdXMgLSBsZW5ndGgocG9zKTsgICAgICAgICBpZiAoeiA8IDAuMCkgeiA9IDAuMDsgICAgICAgZmxvYXQgY2MgPSB6IC8gcmFkaXVzOyAgICAgIGMgKz0gdmVjMyhjYyAqIChzaW4oZmxvYXQoaSppKmkpKSAqIDAuNSArIDAuNSksIGNjICogKHNpbihmbG9hdChpKmkqaSppKmkpKSAqIDAuNSArIDAuNSksIGNjICogKHNpbihmbG9hdChpKmkqaSppKSkgKiAwLjUgKyAwLjUpKTsgIH0gICBnbF9GcmFnQ29sb3IgPSB2ZWM0KGMueCtwLnksIGMueStwLnksIGMueitwLnksIDEuMCk7IH1cIlxuICAgIH0sXG5cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5wYXJhbWV0ZXJzID0ge1xuICAgICAgICAgICAgc3RhcnRUaW1lOiBEYXRlLm5vdygpLFxuICAgICAgICAgICAgdGltZTogMC4wLFxuICAgICAgICAgICAgbW91c2U6IHtcbiAgICAgICAgICAgICAgICB4OiAwLjAsXG4gICAgICAgICAgICAgICAgeTogMC4wXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVzb2x1dGlvbjoge1xuICAgICAgICAgICAgICAgIHg6IDAuMCxcbiAgICAgICAgICAgICAgICB5OiAwLjBcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9O1xuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuTU9VU0VfTU9WRSwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICB0aGlzLnBhcmFtZXRlcnMubW91c2UueCA9IHRoaXMubm9kZS5nZXRDb250ZW50U2l6ZSgpLndpZHRoIC8gZXZlbnQuZ2V0TG9jYXRpb25YKCk7XG4gICAgICAgICAgICB0aGlzLnBhcmFtZXRlcnMubW91c2UueSA9IHRoaXMubm9kZS5nZXRDb250ZW50U2l6ZSgpLmhlaWdodCAvIGV2ZW50LmdldExvY2F0aW9uWSgpO1xuICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfTU9WRSwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICB0aGlzLnBhcmFtZXRlcnMubW91c2UueCA9IHRoaXMubm9kZS5nZXRDb250ZW50U2l6ZSgpLndpZHRoIC8gZXZlbnQuZ2V0TG9jYXRpb25YKCk7XG4gICAgICAgICAgICB0aGlzLnBhcmFtZXRlcnMubW91c2UueSA9IHRoaXMubm9kZS5nZXRDb250ZW50U2l6ZSgpLmhlaWdodCAvIGV2ZW50LmdldExvY2F0aW9uWSgpO1xuICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICB0aGlzLl91c2UoKTtcbiAgICB9LFxuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKGR0KSB7XG4gICAgICAgIGlmICh0aGlzLmdsYXNzRmFjdG9yID49IDQwKSB7XG4gICAgICAgICAgICB0aGlzLmdsYXNzRmFjdG9yID0gMDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmdsYXNzRmFjdG9yICs9IGR0ICogMztcblxuICAgICAgICBpZiAodGhpcy5fcHJvZ3JhbSkge1xuXG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnVzZSgpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVHTFBhcmFtZXRlcnMoKTtcbiAgICAgICAgICAgIGlmIChjYy5zeXMuaXNOYXRpdmUpIHtcbiAgICAgICAgICAgICAgICB2YXIgZ2xQcm9ncmFtX3N0YXRlID0gY2MuR0xQcm9ncmFtU3RhdGUuZ2V0T3JDcmVhdGVXaXRoR0xQcm9ncmFtKHRoaXMuX3Byb2dyYW0pO1xuICAgICAgICAgICAgICAgIGdsUHJvZ3JhbV9zdGF0ZS5zZXRVbmlmb3JtVmVjMihcInJlc29sdXRpb25cIiwgdGhpcy5wYXJhbWV0ZXJzLnJlc29sdXRpb24pO1xuICAgICAgICAgICAgICAgIGdsUHJvZ3JhbV9zdGF0ZS5zZXRVbmlmb3JtRmxvYXQoXCJ0aW1lXCIsIHRoaXMucGFyYW1ldGVycy50aW1lKTtcbiAgICAgICAgICAgICAgICBnbFByb2dyYW1fc3RhdGUuc2V0VW5pZm9ybVZlYzIoXCJtb3VzZV90b3VjaFwiLCB0aGlzLnBhcmFtZXRlcnMubW91c2UpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnNldFVuaWZvcm1Mb2NhdGlvbldpdGgyZih0aGlzLl9yZXNvbHV0aW9uLCB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbi54LCB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbi55KTtcbiAgICAgICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnNldFVuaWZvcm1Mb2NhdGlvbldpdGgxZih0aGlzLl90aW1lLCB0aGlzLnBhcmFtZXRlcnMudGltZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMmYodGhpcy5fbW91c2UsIHRoaXMucGFyYW1ldGVycy5tb3VzZS54LCB0aGlzLnBhcmFtZXRlcnMubW91c2UueCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHVwZGF0ZUdMUGFyYW1ldGVyczogZnVuY3Rpb24gdXBkYXRlR0xQYXJhbWV0ZXJzKCkge1xuICAgICAgICB0aGlzLnBhcmFtZXRlcnMudGltZSA9IChEYXRlLm5vdygpIC0gdGhpcy5wYXJhbWV0ZXJzLnN0YXJ0VGltZSkgLyAxMDAwO1xuICAgICAgICB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbi54ID0gdGhpcy5ub2RlLmdldENvbnRlbnRTaXplKCkud2lkdGg7XG4gICAgICAgIHRoaXMucGFyYW1ldGVycy5yZXNvbHV0aW9uLnkgPSB0aGlzLm5vZGUuZ2V0Q29udGVudFNpemUoKS5oZWlnaHQ7XG4gICAgfSxcblxuICAgIF91c2U6IGZ1bmN0aW9uIF91c2UoKSB7XG5cbiAgICAgICAgaWYgKGNjLnN5cy5pc05hdGl2ZSkge1xuICAgICAgICAgICAgY2MubG9nKFwidXNlIG5hdGl2ZSBHTFByb2dyYW1cIik7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtID0gbmV3IGNjLkdMUHJvZ3JhbSgpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5pbml0V2l0aFN0cmluZyhfZGVmYXVsdF92ZXJ0X25vX212cCwgdGhpcy5mbGFnU2hhZGVyKTtcblxuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MubWFjcm8uQVRUUklCVVRFX05BTUVfUE9TSVRJT04sIGNjLm1hY3JvLlZFUlRFWF9BVFRSSUJfUE9TSVRJT04pO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MubWFjcm8uQVRUUklCVVRFX05BTUVfQ09MT1IsIGNjLm1hY3JvLlZFUlRFWF9BVFRSSUJfQ09MT1IpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MubWFjcm8uQVRUUklCVVRFX05BTUVfVEVYX0NPT1JELCBjYy5tYWNyby5WRVJURVhfQVRUUklCX1RFWF9DT09SRFMpO1xuXG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmxpbmsoKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0udXBkYXRlVW5pZm9ybXMoKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlR0xQYXJhbWV0ZXJzKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtID0gbmV3IGNjLkdMUHJvZ3JhbSgpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5pbml0V2l0aFZlcnRleFNoYWRlckJ5dGVBcnJheShfZGVmYXVsdF92ZXJ0LCB0aGlzLmZsYWdTaGFkZXIpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MubWFjcm8uQVRUUklCVVRFX05BTUVfUE9TSVRJT04sIGNjLm1hY3JvLlZFUlRFWF9BVFRSSUJfUE9TSVRJT04pO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MubWFjcm8uQVRUUklCVVRFX05BTUVfQ09MT1IsIGNjLm1hY3JvLlZFUlRFWF9BVFRSSUJfQ09MT1IpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MubWFjcm8uQVRUUklCVVRFX05BTUVfVEVYX0NPT1JELCBjYy5tYWNyby5WRVJURVhfQVRUUklCX1RFWF9DT09SRFMpO1xuXG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmxpbmsoKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0udXBkYXRlVW5pZm9ybXMoKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0udXNlKCk7XG5cbiAgICAgICAgICAgIHRoaXMudXBkYXRlR0xQYXJhbWV0ZXJzKCk7XG5cbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDFmKHRoaXMuX3Byb2dyYW0uZ2V0VW5pZm9ybUxvY2F0aW9uRm9yTmFtZSgndGltZScpLCB0aGlzLnBhcmFtZXRlcnMudGltZSk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnNldFVuaWZvcm1Mb2NhdGlvbldpdGgyZih0aGlzLl9wcm9ncmFtLmdldFVuaWZvcm1Mb2NhdGlvbkZvck5hbWUoJ21vdXNlX3RvdWNoJyksIHRoaXMucGFyYW1ldGVycy5tb3VzZS54LCB0aGlzLnBhcmFtZXRlcnMubW91c2UueSk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnNldFVuaWZvcm1Mb2NhdGlvbldpdGgyZih0aGlzLl9wcm9ncmFtLmdldFVuaWZvcm1Mb2NhdGlvbkZvck5hbWUoJ3Jlc29sdXRpb24nKSwgdGhpcy5wYXJhbWV0ZXJzLnJlc29sdXRpb24ueCwgdGhpcy5wYXJhbWV0ZXJzLnJlc29sdXRpb24ueSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY2Muc3lzLmlzTmF0aXZlKSB7XG4gICAgICAgICAgICB2YXIgZ2xQcm9ncmFtX3N0YXRlID0gY2MuR0xQcm9ncmFtU3RhdGUuZ2V0T3JDcmVhdGVXaXRoR0xQcm9ncmFtKHRoaXMuX3Byb2dyYW0pO1xuICAgICAgICAgICAgZ2xQcm9ncmFtX3N0YXRlLnNldFVuaWZvcm1WZWMyKFwicmVzb2x1dGlvblwiLCB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbik7XG4gICAgICAgICAgICBnbFByb2dyYW1fc3RhdGUuc2V0VW5pZm9ybUZsb2F0KFwidGltZVwiLCB0aGlzLnBhcmFtZXRlcnMudGltZSk7XG4gICAgICAgICAgICBnbFByb2dyYW1fc3RhdGUuc2V0VW5pZm9ybVZlYzIoXCJtb3VzZV90b3VjaFwiLCB0aGlzLnBhcmFtZXRlcnMubW91c2UpO1xuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICB0aGlzLl9yZXNvbHV0aW9uID0gdGhpcy5fcHJvZ3JhbS5nZXRVbmlmb3JtTG9jYXRpb25Gb3JOYW1lKFwicmVzb2x1dGlvblwiKTtcbiAgICAgICAgICAgIHRoaXMuX3RpbWUgPSB0aGlzLl9wcm9ncmFtLmdldFVuaWZvcm1Mb2NhdGlvbkZvck5hbWUoXCJ0aW1lXCIpO1xuICAgICAgICAgICAgdGhpcy5fbW91c2UgPSB0aGlzLl9wcm9ncmFtLmdldFVuaWZvcm1Mb2NhdGlvbkZvck5hbWUoXCJtb3VzZV90b3VjaFwiKTtcblxuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMmYodGhpcy5fcmVzb2x1dGlvbiwgdGhpcy5wYXJhbWV0ZXJzLnJlc29sdXRpb24ueCwgdGhpcy5wYXJhbWV0ZXJzLnJlc29sdXRpb24ueSk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnNldFVuaWZvcm1Mb2NhdGlvbldpdGgxZih0aGlzLl90aW1lLCB0aGlzLnBhcmFtZXRlcnMudGltZSk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnNldFVuaWZvcm1Mb2NhdGlvbldpdGgyZih0aGlzLl9tb3VzZSwgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlLngsIHRoaXMucGFyYW1ldGVycy5tb3VzZS55KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0UHJvZ3JhbSh0aGlzLm5vZGUuX3NnTm9kZSwgdGhpcy5fcHJvZ3JhbSk7XG4gICAgfSxcblxuICAgIHNldFByb2dyYW06IGZ1bmN0aW9uIHNldFByb2dyYW0obm9kZSwgcHJvZ3JhbSkge1xuICAgICAgICBpZiAoY2Muc3lzLmlzTmF0aXZlKSB7XG4gICAgICAgICAgICB2YXIgZ2xQcm9ncmFtX3N0YXRlID0gY2MuR0xQcm9ncmFtU3RhdGUuZ2V0T3JDcmVhdGVXaXRoR0xQcm9ncmFtKHByb2dyYW0pO1xuICAgICAgICAgICAgbm9kZS5zZXRHTFByb2dyYW1TdGF0ZShnbFByb2dyYW1fc3RhdGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbm9kZS5zZXRTaGFkZXJQcm9ncmFtKHByb2dyYW0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGNoaWxkcmVuID0gbm9kZS5jaGlsZHJlbjtcbiAgICAgICAgaWYgKCFjaGlsZHJlbikgcmV0dXJuO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHRoaXMuc2V0UHJvZ3JhbShjaGlsZHJlbltpXSwgcHJvZ3JhbSk7XG4gICAgfVxuXG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzg1NjZldUVCNTlJQ3FGMytHSnpPNVUxJywgJ0VmZmVjdDA4Jyk7XG4vLyBTY3JpcHQvRWZmZWN0MDguanNcblxudmFyIF9kZWZhdWx0X3ZlcnQgPSByZXF1aXJlKFwiLi4vU2hhZGVycy9jY1NoYWRlcl9EZWZhdWx0X1ZlcnQuanNcIik7XG52YXIgX2RlZmF1bHRfdmVydF9ub19tdnAgPSByZXF1aXJlKFwiLi4vU2hhZGVycy9jY1NoYWRlcl9EZWZhdWx0X1ZlcnRfbm9NVlAuanNcIik7XG52YXIgX2dsYXNzX2ZyYWcgPSByZXF1aXJlKFwiLi4vU2hhZGVycy9jY1NoYWRlcl9FZmZlY3QwNF9GcmFnLmpzXCIpO1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgZ2xhc3NGYWN0b3I6IDEuMFxuICAgIH0sXG5cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5wYXJhbWV0ZXJzID0ge1xuICAgICAgICAgICAgc3RhcnRUaW1lOiBEYXRlLm5vdygpLFxuICAgICAgICAgICAgdGltZTogMC4wLFxuICAgICAgICAgICAgbW91c2U6IHtcbiAgICAgICAgICAgICAgICB4OiAwLjAsXG4gICAgICAgICAgICAgICAgeTogMC4wXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVzb2x1dGlvbjoge1xuICAgICAgICAgICAgICAgIHg6IDAuMCxcbiAgICAgICAgICAgICAgICB5OiAwLjBcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9O1xuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuTU9VU0VfTU9WRSwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICB0aGlzLnBhcmFtZXRlcnMubW91c2UueCA9IHRoaXMubm9kZS5nZXRDb250ZW50U2l6ZSgpLndpZHRoIC8gZXZlbnQuZ2V0TG9jYXRpb25YKCk7XG4gICAgICAgICAgICB0aGlzLnBhcmFtZXRlcnMubW91c2UueSA9IHRoaXMubm9kZS5nZXRDb250ZW50U2l6ZSgpLmhlaWdodCAvIGV2ZW50LmdldExvY2F0aW9uWSgpO1xuICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfTU9WRSwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICB0aGlzLnBhcmFtZXRlcnMubW91c2UueCA9IHRoaXMubm9kZS5nZXRDb250ZW50U2l6ZSgpLndpZHRoIC8gZXZlbnQuZ2V0TG9jYXRpb25YKCk7XG4gICAgICAgICAgICB0aGlzLnBhcmFtZXRlcnMubW91c2UueSA9IHRoaXMubm9kZS5nZXRDb250ZW50U2l6ZSgpLmhlaWdodCAvIGV2ZW50LmdldExvY2F0aW9uWSgpO1xuICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICB0aGlzLl91c2UoKTtcbiAgICB9LFxuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKGR0KSB7XG4gICAgICAgIGlmICh0aGlzLmdsYXNzRmFjdG9yID49IDQwKSB7XG4gICAgICAgICAgICB0aGlzLmdsYXNzRmFjdG9yID0gMDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmdsYXNzRmFjdG9yICs9IGR0ICogMztcblxuICAgICAgICBpZiAodGhpcy5fcHJvZ3JhbSkge1xuXG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnVzZSgpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVHTFBhcmFtZXRlcnMoKTtcbiAgICAgICAgICAgIGlmIChjYy5zeXMuaXNOYXRpdmUpIHtcbiAgICAgICAgICAgICAgICB2YXIgZ2xQcm9ncmFtX3N0YXRlID0gY2MuR0xQcm9ncmFtU3RhdGUuZ2V0T3JDcmVhdGVXaXRoR0xQcm9ncmFtKHRoaXMuX3Byb2dyYW0pO1xuICAgICAgICAgICAgICAgIGdsUHJvZ3JhbV9zdGF0ZS5zZXRVbmlmb3JtVmVjMihcInJlc29sdXRpb25cIiwgdGhpcy5wYXJhbWV0ZXJzLnJlc29sdXRpb24pO1xuICAgICAgICAgICAgICAgIGdsUHJvZ3JhbV9zdGF0ZS5zZXRVbmlmb3JtRmxvYXQoXCJ0aW1lXCIsIHRoaXMucGFyYW1ldGVycy50aW1lKTtcbiAgICAgICAgICAgICAgICBnbFByb2dyYW1fc3RhdGUuc2V0VW5pZm9ybVZlYzIoXCJtb3VzZV90b3VjaFwiLCB0aGlzLnBhcmFtZXRlcnMubW91c2UpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnNldFVuaWZvcm1Mb2NhdGlvbldpdGgyZih0aGlzLl9yZXNvbHV0aW9uLCB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbi54LCB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbi55KTtcbiAgICAgICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnNldFVuaWZvcm1Mb2NhdGlvbldpdGgxZih0aGlzLl90aW1lLCB0aGlzLnBhcmFtZXRlcnMudGltZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMmYodGhpcy5fbW91c2UsIHRoaXMucGFyYW1ldGVycy5tb3VzZS54LCB0aGlzLnBhcmFtZXRlcnMubW91c2UueCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHVwZGF0ZUdMUGFyYW1ldGVyczogZnVuY3Rpb24gdXBkYXRlR0xQYXJhbWV0ZXJzKCkge1xuICAgICAgICB0aGlzLnBhcmFtZXRlcnMudGltZSA9IChEYXRlLm5vdygpIC0gdGhpcy5wYXJhbWV0ZXJzLnN0YXJ0VGltZSkgLyAxMDAwO1xuICAgICAgICB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbi54ID0gdGhpcy5ub2RlLmdldENvbnRlbnRTaXplKCkud2lkdGg7XG4gICAgICAgIHRoaXMucGFyYW1ldGVycy5yZXNvbHV0aW9uLnkgPSB0aGlzLm5vZGUuZ2V0Q29udGVudFNpemUoKS5oZWlnaHQ7XG4gICAgfSxcblxuICAgIF91c2U6IGZ1bmN0aW9uIF91c2UoKSB7XG5cbiAgICAgICAgaWYgKGNjLnN5cy5pc05hdGl2ZSkge1xuICAgICAgICAgICAgY2MubG9nKFwidXNlIG5hdGl2ZSBHTFByb2dyYW1cIik7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtID0gbmV3IGNjLkdMUHJvZ3JhbSgpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5pbml0V2l0aFN0cmluZyhfZGVmYXVsdF92ZXJ0X25vX212cCwgX2dsYXNzX2ZyYWcpO1xuXG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5tYWNyby5BVFRSSUJVVEVfTkFNRV9QT1NJVElPTiwgY2MubWFjcm8uVkVSVEVYX0FUVFJJQl9QT1NJVElPTik7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5tYWNyby5BVFRSSUJVVEVfTkFNRV9DT0xPUiwgY2MubWFjcm8uVkVSVEVYX0FUVFJJQl9DT0xPUik7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5tYWNyby5BVFRSSUJVVEVfTkFNRV9URVhfQ09PUkQsIGNjLm1hY3JvLlZFUlRFWF9BVFRSSUJfVEVYX0NPT1JEUyk7XG5cbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0ubGluaygpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS51cGRhdGVVbmlmb3JtcygpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVHTFBhcmFtZXRlcnMoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0gPSBuZXcgY2MuR0xQcm9ncmFtKCk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmluaXRXaXRoVmVydGV4U2hhZGVyQnl0ZUFycmF5KF9kZWZhdWx0X3ZlcnQsIF9nbGFzc19mcmFnKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uYWRkQXR0cmlidXRlKGNjLm1hY3JvLkFUVFJJQlVURV9OQU1FX1BPU0lUSU9OLCBjYy5tYWNyby5WRVJURVhfQVRUUklCX1BPU0lUSU9OKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uYWRkQXR0cmlidXRlKGNjLm1hY3JvLkFUVFJJQlVURV9OQU1FX0NPTE9SLCBjYy5tYWNyby5WRVJURVhfQVRUUklCX0NPTE9SKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uYWRkQXR0cmlidXRlKGNjLm1hY3JvLkFUVFJJQlVURV9OQU1FX1RFWF9DT09SRCwgY2MubWFjcm8uVkVSVEVYX0FUVFJJQl9URVhfQ09PUkRTKTtcblxuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5saW5rKCk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnVwZGF0ZVVuaWZvcm1zKCk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnVzZSgpO1xuXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUdMUGFyYW1ldGVycygpO1xuXG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnNldFVuaWZvcm1Mb2NhdGlvbldpdGgxZih0aGlzLl9wcm9ncmFtLmdldFVuaWZvcm1Mb2NhdGlvbkZvck5hbWUoJ3RpbWUnKSwgdGhpcy5wYXJhbWV0ZXJzLnRpbWUpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMmYodGhpcy5fcHJvZ3JhbS5nZXRVbmlmb3JtTG9jYXRpb25Gb3JOYW1lKCdtb3VzZV90b3VjaCcpLCB0aGlzLnBhcmFtZXRlcnMubW91c2UueCwgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlLnkpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMmYodGhpcy5fcHJvZ3JhbS5nZXRVbmlmb3JtTG9jYXRpb25Gb3JOYW1lKCdyZXNvbHV0aW9uJyksIHRoaXMucGFyYW1ldGVycy5yZXNvbHV0aW9uLngsIHRoaXMucGFyYW1ldGVycy5yZXNvbHV0aW9uLnkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNjLnN5cy5pc05hdGl2ZSkge1xuICAgICAgICAgICAgdmFyIGdsUHJvZ3JhbV9zdGF0ZSA9IGNjLkdMUHJvZ3JhbVN0YXRlLmdldE9yQ3JlYXRlV2l0aEdMUHJvZ3JhbSh0aGlzLl9wcm9ncmFtKTtcbiAgICAgICAgICAgIGdsUHJvZ3JhbV9zdGF0ZS5zZXRVbmlmb3JtVmVjMihcInJlc29sdXRpb25cIiwgdGhpcy5wYXJhbWV0ZXJzLnJlc29sdXRpb24pO1xuICAgICAgICAgICAgZ2xQcm9ncmFtX3N0YXRlLnNldFVuaWZvcm1GbG9hdChcInRpbWVcIiwgdGhpcy5wYXJhbWV0ZXJzLnRpbWUpO1xuICAgICAgICAgICAgZ2xQcm9ncmFtX3N0YXRlLnNldFVuaWZvcm1WZWMyKFwibW91c2VfdG91Y2hcIiwgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlKTtcbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgdGhpcy5fcmVzb2x1dGlvbiA9IHRoaXMuX3Byb2dyYW0uZ2V0VW5pZm9ybUxvY2F0aW9uRm9yTmFtZShcInJlc29sdXRpb25cIik7XG4gICAgICAgICAgICB0aGlzLl90aW1lID0gdGhpcy5fcHJvZ3JhbS5nZXRVbmlmb3JtTG9jYXRpb25Gb3JOYW1lKFwidGltZVwiKTtcbiAgICAgICAgICAgIHRoaXMuX21vdXNlID0gdGhpcy5fcHJvZ3JhbS5nZXRVbmlmb3JtTG9jYXRpb25Gb3JOYW1lKFwibW91c2VfdG91Y2hcIik7XG5cbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDJmKHRoaXMuX3Jlc29sdXRpb24sIHRoaXMucGFyYW1ldGVycy5yZXNvbHV0aW9uLngsIHRoaXMucGFyYW1ldGVycy5yZXNvbHV0aW9uLnkpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMWYodGhpcy5fdGltZSwgdGhpcy5wYXJhbWV0ZXJzLnRpbWUpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMmYodGhpcy5fbW91c2UsIHRoaXMucGFyYW1ldGVycy5tb3VzZS54LCB0aGlzLnBhcmFtZXRlcnMubW91c2UueSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNldFByb2dyYW0odGhpcy5ub2RlLl9zZ05vZGUsIHRoaXMuX3Byb2dyYW0pO1xuICAgIH0sXG5cbiAgICBzZXRQcm9ncmFtOiBmdW5jdGlvbiBzZXRQcm9ncmFtKG5vZGUsIHByb2dyYW0pIHtcbiAgICAgICAgaWYgKGNjLnN5cy5pc05hdGl2ZSkge1xuICAgICAgICAgICAgdmFyIGdsUHJvZ3JhbV9zdGF0ZSA9IGNjLkdMUHJvZ3JhbVN0YXRlLmdldE9yQ3JlYXRlV2l0aEdMUHJvZ3JhbShwcm9ncmFtKTtcbiAgICAgICAgICAgIG5vZGUuc2V0R0xQcm9ncmFtU3RhdGUoZ2xQcm9ncmFtX3N0YXRlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5vZGUuc2V0U2hhZGVyUHJvZ3JhbShwcm9ncmFtKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBjaGlsZHJlbiA9IG5vZGUuY2hpbGRyZW47XG4gICAgICAgIGlmICghY2hpbGRyZW4pIHJldHVybjtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB0aGlzLnNldFByb2dyYW0oY2hpbGRyZW5baV0sIHByb2dyYW0pO1xuICAgIH1cblxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICdmOTc5OUh4N29wQXlweTgvaGthRkpCYScsICdFZmZlY3QwOScpO1xuLy8gU2NyaXB0L0VmZmVjdDA5LmpzXG5cbnZhciBfZGVmYXVsdF92ZXJ0ID0gcmVxdWlyZShcIi4uL1NoYWRlcnMvY2NTaGFkZXJfRGVmYXVsdF9WZXJ0LmpzXCIpO1xudmFyIF9kZWZhdWx0X3ZlcnRfbm9fbXZwID0gcmVxdWlyZShcIi4uL1NoYWRlcnMvY2NTaGFkZXJfRGVmYXVsdF9WZXJ0X25vTVZQLmpzXCIpO1xudmFyIF9nbGFzc19mcmFnID0gcmVxdWlyZShcIi4uL1NoYWRlcnMvY2NTaGFkZXJfRWZmZWN0MDRfRnJhZy5qc1wiKTtcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGdsYXNzRmFjdG9yOiAxLjBcbiAgICB9LFxuXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHRoaXMucGFyYW1ldGVycyA9IHtcbiAgICAgICAgICAgIHN0YXJ0VGltZTogRGF0ZS5ub3coKSxcbiAgICAgICAgICAgIHRpbWU6IDAuMCxcbiAgICAgICAgICAgIG1vdXNlOiB7XG4gICAgICAgICAgICAgICAgeDogMC4wLFxuICAgICAgICAgICAgICAgIHk6IDAuMFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlc29sdXRpb246IHtcbiAgICAgICAgICAgICAgICB4OiAwLjAsXG4gICAgICAgICAgICAgICAgeTogMC4wXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLk1PVVNFX01PVkUsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlLnggPSB0aGlzLm5vZGUuZ2V0Q29udGVudFNpemUoKS53aWR0aCAvIGV2ZW50LmdldExvY2F0aW9uWCgpO1xuICAgICAgICAgICAgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlLnkgPSB0aGlzLm5vZGUuZ2V0Q29udGVudFNpemUoKS5oZWlnaHQgLyBldmVudC5nZXRMb2NhdGlvblkoKTtcbiAgICAgICAgfSwgdGhpcyk7XG5cbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX01PVkUsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlLnggPSB0aGlzLm5vZGUuZ2V0Q29udGVudFNpemUoKS53aWR0aCAvIGV2ZW50LmdldExvY2F0aW9uWCgpO1xuICAgICAgICAgICAgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlLnkgPSB0aGlzLm5vZGUuZ2V0Q29udGVudFNpemUoKS5oZWlnaHQgLyBldmVudC5nZXRMb2NhdGlvblkoKTtcbiAgICAgICAgfSwgdGhpcyk7XG5cbiAgICAgICAgdGhpcy5fdXNlKCk7XG4gICAgfSxcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShkdCkge1xuICAgICAgICBpZiAodGhpcy5nbGFzc0ZhY3RvciA+PSA0MCkge1xuICAgICAgICAgICAgdGhpcy5nbGFzc0ZhY3RvciA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5nbGFzc0ZhY3RvciArPSBkdCAqIDM7XG5cbiAgICAgICAgaWYgKHRoaXMuX3Byb2dyYW0pIHtcblxuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS51c2UoKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlR0xQYXJhbWV0ZXJzKCk7XG4gICAgICAgICAgICBpZiAoY2Muc3lzLmlzTmF0aXZlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGdsUHJvZ3JhbV9zdGF0ZSA9IGNjLkdMUHJvZ3JhbVN0YXRlLmdldE9yQ3JlYXRlV2l0aEdMUHJvZ3JhbSh0aGlzLl9wcm9ncmFtKTtcbiAgICAgICAgICAgICAgICBnbFByb2dyYW1fc3RhdGUuc2V0VW5pZm9ybVZlYzIoXCJyZXNvbHV0aW9uXCIsIHRoaXMucGFyYW1ldGVycy5yZXNvbHV0aW9uKTtcbiAgICAgICAgICAgICAgICBnbFByb2dyYW1fc3RhdGUuc2V0VW5pZm9ybUZsb2F0KFwidGltZVwiLCB0aGlzLnBhcmFtZXRlcnMudGltZSk7XG4gICAgICAgICAgICAgICAgZ2xQcm9ncmFtX3N0YXRlLnNldFVuaWZvcm1WZWMyKFwibW91c2VfdG91Y2hcIiwgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMmYodGhpcy5fcmVzb2x1dGlvbiwgdGhpcy5wYXJhbWV0ZXJzLnJlc29sdXRpb24ueCwgdGhpcy5wYXJhbWV0ZXJzLnJlc29sdXRpb24ueSk7XG4gICAgICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMWYodGhpcy5fdGltZSwgdGhpcy5wYXJhbWV0ZXJzLnRpbWUpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDJmKHRoaXMuX21vdXNlLCB0aGlzLnBhcmFtZXRlcnMubW91c2UueCwgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlLngpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICB1cGRhdGVHTFBhcmFtZXRlcnM6IGZ1bmN0aW9uIHVwZGF0ZUdMUGFyYW1ldGVycygpIHtcbiAgICAgICAgdGhpcy5wYXJhbWV0ZXJzLnRpbWUgPSAoRGF0ZS5ub3coKSAtIHRoaXMucGFyYW1ldGVycy5zdGFydFRpbWUpIC8gMTAwMDtcbiAgICAgICAgdGhpcy5wYXJhbWV0ZXJzLnJlc29sdXRpb24ueCA9IHRoaXMubm9kZS5nZXRDb250ZW50U2l6ZSgpLndpZHRoO1xuICAgICAgICB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbi55ID0gdGhpcy5ub2RlLmdldENvbnRlbnRTaXplKCkuaGVpZ2h0O1xuICAgIH0sXG5cbiAgICBfdXNlOiBmdW5jdGlvbiBfdXNlKCkge1xuXG4gICAgICAgIGlmIChjYy5zeXMuaXNOYXRpdmUpIHtcbiAgICAgICAgICAgIGNjLmxvZyhcInVzZSBuYXRpdmUgR0xQcm9ncmFtXCIpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbSA9IG5ldyBjYy5HTFByb2dyYW0oKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uaW5pdFdpdGhTdHJpbmcoX2RlZmF1bHRfdmVydF9ub19tdnAsIF9nbGFzc19mcmFnKTtcblxuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MubWFjcm8uQVRUUklCVVRFX05BTUVfUE9TSVRJT04sIGNjLm1hY3JvLlZFUlRFWF9BVFRSSUJfUE9TSVRJT04pO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MubWFjcm8uQVRUUklCVVRFX05BTUVfQ09MT1IsIGNjLm1hY3JvLlZFUlRFWF9BVFRSSUJfQ09MT1IpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MubWFjcm8uQVRUUklCVVRFX05BTUVfVEVYX0NPT1JELCBjYy5tYWNyby5WRVJURVhfQVRUUklCX1RFWF9DT09SRFMpO1xuXG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmxpbmsoKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0udXBkYXRlVW5pZm9ybXMoKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlR0xQYXJhbWV0ZXJzKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtID0gbmV3IGNjLkdMUHJvZ3JhbSgpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5pbml0V2l0aFZlcnRleFNoYWRlckJ5dGVBcnJheShfZGVmYXVsdF92ZXJ0LCBfZ2xhc3NfZnJhZyk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5tYWNyby5BVFRSSUJVVEVfTkFNRV9QT1NJVElPTiwgY2MubWFjcm8uVkVSVEVYX0FUVFJJQl9QT1NJVElPTik7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5tYWNyby5BVFRSSUJVVEVfTkFNRV9DT0xPUiwgY2MubWFjcm8uVkVSVEVYX0FUVFJJQl9DT0xPUik7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5tYWNyby5BVFRSSUJVVEVfTkFNRV9URVhfQ09PUkQsIGNjLm1hY3JvLlZFUlRFWF9BVFRSSUJfVEVYX0NPT1JEUyk7XG5cbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0ubGluaygpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS51cGRhdGVVbmlmb3JtcygpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS51c2UoKTtcblxuICAgICAgICAgICAgdGhpcy51cGRhdGVHTFBhcmFtZXRlcnMoKTtcblxuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMWYodGhpcy5fcHJvZ3JhbS5nZXRVbmlmb3JtTG9jYXRpb25Gb3JOYW1lKCd0aW1lJyksIHRoaXMucGFyYW1ldGVycy50aW1lKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDJmKHRoaXMuX3Byb2dyYW0uZ2V0VW5pZm9ybUxvY2F0aW9uRm9yTmFtZSgnbW91c2VfdG91Y2gnKSwgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlLngsIHRoaXMucGFyYW1ldGVycy5tb3VzZS55KTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDJmKHRoaXMuX3Byb2dyYW0uZ2V0VW5pZm9ybUxvY2F0aW9uRm9yTmFtZSgncmVzb2x1dGlvbicpLCB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbi54LCB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbi55KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjYy5zeXMuaXNOYXRpdmUpIHtcbiAgICAgICAgICAgIHZhciBnbFByb2dyYW1fc3RhdGUgPSBjYy5HTFByb2dyYW1TdGF0ZS5nZXRPckNyZWF0ZVdpdGhHTFByb2dyYW0odGhpcy5fcHJvZ3JhbSk7XG4gICAgICAgICAgICBnbFByb2dyYW1fc3RhdGUuc2V0VW5pZm9ybVZlYzIoXCJyZXNvbHV0aW9uXCIsIHRoaXMucGFyYW1ldGVycy5yZXNvbHV0aW9uKTtcbiAgICAgICAgICAgIGdsUHJvZ3JhbV9zdGF0ZS5zZXRVbmlmb3JtRmxvYXQoXCJ0aW1lXCIsIHRoaXMucGFyYW1ldGVycy50aW1lKTtcbiAgICAgICAgICAgIGdsUHJvZ3JhbV9zdGF0ZS5zZXRVbmlmb3JtVmVjMihcIm1vdXNlX3RvdWNoXCIsIHRoaXMucGFyYW1ldGVycy5tb3VzZSk7XG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgIHRoaXMuX3Jlc29sdXRpb24gPSB0aGlzLl9wcm9ncmFtLmdldFVuaWZvcm1Mb2NhdGlvbkZvck5hbWUoXCJyZXNvbHV0aW9uXCIpO1xuICAgICAgICAgICAgdGhpcy5fdGltZSA9IHRoaXMuX3Byb2dyYW0uZ2V0VW5pZm9ybUxvY2F0aW9uRm9yTmFtZShcInRpbWVcIik7XG4gICAgICAgICAgICB0aGlzLl9tb3VzZSA9IHRoaXMuX3Byb2dyYW0uZ2V0VW5pZm9ybUxvY2F0aW9uRm9yTmFtZShcIm1vdXNlX3RvdWNoXCIpO1xuXG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnNldFVuaWZvcm1Mb2NhdGlvbldpdGgyZih0aGlzLl9yZXNvbHV0aW9uLCB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbi54LCB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbi55KTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDFmKHRoaXMuX3RpbWUsIHRoaXMucGFyYW1ldGVycy50aW1lKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDJmKHRoaXMuX21vdXNlLCB0aGlzLnBhcmFtZXRlcnMubW91c2UueCwgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlLnkpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZXRQcm9ncmFtKHRoaXMubm9kZS5fc2dOb2RlLCB0aGlzLl9wcm9ncmFtKTtcbiAgICB9LFxuXG4gICAgc2V0UHJvZ3JhbTogZnVuY3Rpb24gc2V0UHJvZ3JhbShub2RlLCBwcm9ncmFtKSB7XG4gICAgICAgIGlmIChjYy5zeXMuaXNOYXRpdmUpIHtcbiAgICAgICAgICAgIHZhciBnbFByb2dyYW1fc3RhdGUgPSBjYy5HTFByb2dyYW1TdGF0ZS5nZXRPckNyZWF0ZVdpdGhHTFByb2dyYW0ocHJvZ3JhbSk7XG4gICAgICAgICAgICBub2RlLnNldEdMUHJvZ3JhbVN0YXRlKGdsUHJvZ3JhbV9zdGF0ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBub2RlLnNldFNoYWRlclByb2dyYW0ocHJvZ3JhbSk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgY2hpbGRyZW4gPSBub2RlLmNoaWxkcmVuO1xuICAgICAgICBpZiAoIWNoaWxkcmVuKSByZXR1cm47XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykgdGhpcy5zZXRQcm9ncmFtKGNoaWxkcmVuW2ldLCBwcm9ncmFtKTtcbiAgICB9XG5cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnYzQ0MThvYlJFQkZESVNmU2lQaXBDNVknLCAnRWZmZWN0MTAnKTtcbi8vIFNjcmlwdC9FZmZlY3QxMC5qc1xuXG52YXIgX2RlZmF1bHRfdmVydCA9IHJlcXVpcmUoXCIuLi9TaGFkZXJzL2NjU2hhZGVyX0RlZmF1bHRfVmVydC5qc1wiKTtcbnZhciBfZGVmYXVsdF92ZXJ0X25vX212cCA9IHJlcXVpcmUoXCIuLi9TaGFkZXJzL2NjU2hhZGVyX0RlZmF1bHRfVmVydF9ub01WUC5qc1wiKTtcbnZhciBfZ2xhc3NfZnJhZyA9IHJlcXVpcmUoXCIuLi9TaGFkZXJzL2NjU2hhZGVyX0VmZmVjdDA0X0ZyYWcuanNcIik7XG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBnbGFzc0ZhY3RvcjogMS4wXG4gICAgfSxcblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLnBhcmFtZXRlcnMgPSB7XG4gICAgICAgICAgICBzdGFydFRpbWU6IERhdGUubm93KCksXG4gICAgICAgICAgICB0aW1lOiAwLjAsXG4gICAgICAgICAgICBtb3VzZToge1xuICAgICAgICAgICAgICAgIHg6IDAuMCxcbiAgICAgICAgICAgICAgICB5OiAwLjBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZXNvbHV0aW9uOiB7XG4gICAgICAgICAgICAgICAgeDogMC4wLFxuICAgICAgICAgICAgICAgIHk6IDAuMFxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5NT1VTRV9NT1ZFLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIHRoaXMucGFyYW1ldGVycy5tb3VzZS54ID0gdGhpcy5ub2RlLmdldENvbnRlbnRTaXplKCkud2lkdGggLyBldmVudC5nZXRMb2NhdGlvblgoKTtcbiAgICAgICAgICAgIHRoaXMucGFyYW1ldGVycy5tb3VzZS55ID0gdGhpcy5ub2RlLmdldENvbnRlbnRTaXplKCkuaGVpZ2h0IC8gZXZlbnQuZ2V0TG9jYXRpb25ZKCk7XG4gICAgICAgIH0sIHRoaXMpO1xuXG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9NT1ZFLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIHRoaXMucGFyYW1ldGVycy5tb3VzZS54ID0gdGhpcy5ub2RlLmdldENvbnRlbnRTaXplKCkud2lkdGggLyBldmVudC5nZXRMb2NhdGlvblgoKTtcbiAgICAgICAgICAgIHRoaXMucGFyYW1ldGVycy5tb3VzZS55ID0gdGhpcy5ub2RlLmdldENvbnRlbnRTaXplKCkuaGVpZ2h0IC8gZXZlbnQuZ2V0TG9jYXRpb25ZKCk7XG4gICAgICAgIH0sIHRoaXMpO1xuXG4gICAgICAgIHRoaXMuX3VzZSgpO1xuICAgIH0sXG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoZHQpIHtcbiAgICAgICAgaWYgKHRoaXMuZ2xhc3NGYWN0b3IgPj0gNDApIHtcbiAgICAgICAgICAgIHRoaXMuZ2xhc3NGYWN0b3IgPSAwO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZ2xhc3NGYWN0b3IgKz0gZHQgKiAzO1xuXG4gICAgICAgIGlmICh0aGlzLl9wcm9ncmFtKSB7XG5cbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0udXNlKCk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUdMUGFyYW1ldGVycygpO1xuICAgICAgICAgICAgaWYgKGNjLnN5cy5pc05hdGl2ZSkge1xuICAgICAgICAgICAgICAgIHZhciBnbFByb2dyYW1fc3RhdGUgPSBjYy5HTFByb2dyYW1TdGF0ZS5nZXRPckNyZWF0ZVdpdGhHTFByb2dyYW0odGhpcy5fcHJvZ3JhbSk7XG4gICAgICAgICAgICAgICAgZ2xQcm9ncmFtX3N0YXRlLnNldFVuaWZvcm1WZWMyKFwicmVzb2x1dGlvblwiLCB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbik7XG4gICAgICAgICAgICAgICAgZ2xQcm9ncmFtX3N0YXRlLnNldFVuaWZvcm1GbG9hdChcInRpbWVcIiwgdGhpcy5wYXJhbWV0ZXJzLnRpbWUpO1xuICAgICAgICAgICAgICAgIGdsUHJvZ3JhbV9zdGF0ZS5zZXRVbmlmb3JtVmVjMihcIm1vdXNlX3RvdWNoXCIsIHRoaXMucGFyYW1ldGVycy5tb3VzZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDJmKHRoaXMuX3Jlc29sdXRpb24sIHRoaXMucGFyYW1ldGVycy5yZXNvbHV0aW9uLngsIHRoaXMucGFyYW1ldGVycy5yZXNvbHV0aW9uLnkpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDFmKHRoaXMuX3RpbWUsIHRoaXMucGFyYW1ldGVycy50aW1lKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnNldFVuaWZvcm1Mb2NhdGlvbldpdGgyZih0aGlzLl9tb3VzZSwgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlLngsIHRoaXMucGFyYW1ldGVycy5tb3VzZS54KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgdXBkYXRlR0xQYXJhbWV0ZXJzOiBmdW5jdGlvbiB1cGRhdGVHTFBhcmFtZXRlcnMoKSB7XG4gICAgICAgIHRoaXMucGFyYW1ldGVycy50aW1lID0gKERhdGUubm93KCkgLSB0aGlzLnBhcmFtZXRlcnMuc3RhcnRUaW1lKSAvIDEwMDA7XG4gICAgICAgIHRoaXMucGFyYW1ldGVycy5yZXNvbHV0aW9uLnggPSB0aGlzLm5vZGUuZ2V0Q29udGVudFNpemUoKS53aWR0aDtcbiAgICAgICAgdGhpcy5wYXJhbWV0ZXJzLnJlc29sdXRpb24ueSA9IHRoaXMubm9kZS5nZXRDb250ZW50U2l6ZSgpLmhlaWdodDtcbiAgICB9LFxuXG4gICAgX3VzZTogZnVuY3Rpb24gX3VzZSgpIHtcblxuICAgICAgICBpZiAoY2Muc3lzLmlzTmF0aXZlKSB7XG4gICAgICAgICAgICBjYy5sb2coXCJ1c2UgbmF0aXZlIEdMUHJvZ3JhbVwiKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0gPSBuZXcgY2MuR0xQcm9ncmFtKCk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmluaXRXaXRoU3RyaW5nKF9kZWZhdWx0X3ZlcnRfbm9fbXZwLCBfZ2xhc3NfZnJhZyk7XG5cbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uYWRkQXR0cmlidXRlKGNjLm1hY3JvLkFUVFJJQlVURV9OQU1FX1BPU0lUSU9OLCBjYy5tYWNyby5WRVJURVhfQVRUUklCX1BPU0lUSU9OKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uYWRkQXR0cmlidXRlKGNjLm1hY3JvLkFUVFJJQlVURV9OQU1FX0NPTE9SLCBjYy5tYWNyby5WRVJURVhfQVRUUklCX0NPTE9SKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uYWRkQXR0cmlidXRlKGNjLm1hY3JvLkFUVFJJQlVURV9OQU1FX1RFWF9DT09SRCwgY2MubWFjcm8uVkVSVEVYX0FUVFJJQl9URVhfQ09PUkRTKTtcblxuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5saW5rKCk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnVwZGF0ZVVuaWZvcm1zKCk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUdMUGFyYW1ldGVycygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbSA9IG5ldyBjYy5HTFByb2dyYW0oKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uaW5pdFdpdGhWZXJ0ZXhTaGFkZXJCeXRlQXJyYXkoX2RlZmF1bHRfdmVydCwgX2dsYXNzX2ZyYWcpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MubWFjcm8uQVRUUklCVVRFX05BTUVfUE9TSVRJT04sIGNjLm1hY3JvLlZFUlRFWF9BVFRSSUJfUE9TSVRJT04pO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MubWFjcm8uQVRUUklCVVRFX05BTUVfQ09MT1IsIGNjLm1hY3JvLlZFUlRFWF9BVFRSSUJfQ09MT1IpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MubWFjcm8uQVRUUklCVVRFX05BTUVfVEVYX0NPT1JELCBjYy5tYWNyby5WRVJURVhfQVRUUklCX1RFWF9DT09SRFMpO1xuXG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmxpbmsoKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0udXBkYXRlVW5pZm9ybXMoKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0udXNlKCk7XG5cbiAgICAgICAgICAgIHRoaXMudXBkYXRlR0xQYXJhbWV0ZXJzKCk7XG5cbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDFmKHRoaXMuX3Byb2dyYW0uZ2V0VW5pZm9ybUxvY2F0aW9uRm9yTmFtZSgndGltZScpLCB0aGlzLnBhcmFtZXRlcnMudGltZSk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnNldFVuaWZvcm1Mb2NhdGlvbldpdGgyZih0aGlzLl9wcm9ncmFtLmdldFVuaWZvcm1Mb2NhdGlvbkZvck5hbWUoJ21vdXNlX3RvdWNoJyksIHRoaXMucGFyYW1ldGVycy5tb3VzZS54LCB0aGlzLnBhcmFtZXRlcnMubW91c2UueSk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnNldFVuaWZvcm1Mb2NhdGlvbldpdGgyZih0aGlzLl9wcm9ncmFtLmdldFVuaWZvcm1Mb2NhdGlvbkZvck5hbWUoJ3Jlc29sdXRpb24nKSwgdGhpcy5wYXJhbWV0ZXJzLnJlc29sdXRpb24ueCwgdGhpcy5wYXJhbWV0ZXJzLnJlc29sdXRpb24ueSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY2Muc3lzLmlzTmF0aXZlKSB7XG4gICAgICAgICAgICB2YXIgZ2xQcm9ncmFtX3N0YXRlID0gY2MuR0xQcm9ncmFtU3RhdGUuZ2V0T3JDcmVhdGVXaXRoR0xQcm9ncmFtKHRoaXMuX3Byb2dyYW0pO1xuICAgICAgICAgICAgZ2xQcm9ncmFtX3N0YXRlLnNldFVuaWZvcm1WZWMyKFwicmVzb2x1dGlvblwiLCB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbik7XG4gICAgICAgICAgICBnbFByb2dyYW1fc3RhdGUuc2V0VW5pZm9ybUZsb2F0KFwidGltZVwiLCB0aGlzLnBhcmFtZXRlcnMudGltZSk7XG4gICAgICAgICAgICBnbFByb2dyYW1fc3RhdGUuc2V0VW5pZm9ybVZlYzIoXCJtb3VzZV90b3VjaFwiLCB0aGlzLnBhcmFtZXRlcnMubW91c2UpO1xuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICB0aGlzLl9yZXNvbHV0aW9uID0gdGhpcy5fcHJvZ3JhbS5nZXRVbmlmb3JtTG9jYXRpb25Gb3JOYW1lKFwicmVzb2x1dGlvblwiKTtcbiAgICAgICAgICAgIHRoaXMuX3RpbWUgPSB0aGlzLl9wcm9ncmFtLmdldFVuaWZvcm1Mb2NhdGlvbkZvck5hbWUoXCJ0aW1lXCIpO1xuICAgICAgICAgICAgdGhpcy5fbW91c2UgPSB0aGlzLl9wcm9ncmFtLmdldFVuaWZvcm1Mb2NhdGlvbkZvck5hbWUoXCJtb3VzZV90b3VjaFwiKTtcblxuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMmYodGhpcy5fcmVzb2x1dGlvbiwgdGhpcy5wYXJhbWV0ZXJzLnJlc29sdXRpb24ueCwgdGhpcy5wYXJhbWV0ZXJzLnJlc29sdXRpb24ueSk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnNldFVuaWZvcm1Mb2NhdGlvbldpdGgxZih0aGlzLl90aW1lLCB0aGlzLnBhcmFtZXRlcnMudGltZSk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnNldFVuaWZvcm1Mb2NhdGlvbldpdGgyZih0aGlzLl9tb3VzZSwgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlLngsIHRoaXMucGFyYW1ldGVycy5tb3VzZS55KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0UHJvZ3JhbSh0aGlzLm5vZGUuX3NnTm9kZSwgdGhpcy5fcHJvZ3JhbSk7XG4gICAgfSxcblxuICAgIHNldFByb2dyYW06IGZ1bmN0aW9uIHNldFByb2dyYW0obm9kZSwgcHJvZ3JhbSkge1xuICAgICAgICBpZiAoY2Muc3lzLmlzTmF0aXZlKSB7XG4gICAgICAgICAgICB2YXIgZ2xQcm9ncmFtX3N0YXRlID0gY2MuR0xQcm9ncmFtU3RhdGUuZ2V0T3JDcmVhdGVXaXRoR0xQcm9ncmFtKHByb2dyYW0pO1xuICAgICAgICAgICAgbm9kZS5zZXRHTFByb2dyYW1TdGF0ZShnbFByb2dyYW1fc3RhdGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbm9kZS5zZXRTaGFkZXJQcm9ncmFtKHByb2dyYW0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGNoaWxkcmVuID0gbm9kZS5jaGlsZHJlbjtcbiAgICAgICAgaWYgKCFjaGlsZHJlbikgcmV0dXJuO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHRoaXMuc2V0UHJvZ3JhbShjaGlsZHJlbltpXSwgcHJvZ3JhbSk7XG4gICAgfVxuXG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2JjMmFlYUg0U3BBL0plNFowVVIzU05nJywgJ0VmZmVjdDExJyk7XG4vLyBTY3JpcHQvRWZmZWN0MTEuanNcblxudmFyIF9kZWZhdWx0X3ZlcnQgPSByZXF1aXJlKFwiLi4vU2hhZGVycy9jY1NoYWRlcl9EZWZhdWx0X1ZlcnQuanNcIik7XG52YXIgX2RlZmF1bHRfdmVydF9ub19tdnAgPSByZXF1aXJlKFwiLi4vU2hhZGVycy9jY1NoYWRlcl9EZWZhdWx0X1ZlcnRfbm9NVlAuanNcIik7XG52YXIgX2dsYXNzX2ZyYWcgPSByZXF1aXJlKFwiLi4vU2hhZGVycy9jY1NoYWRlcl9FZmZlY3QwNF9GcmFnLmpzXCIpO1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgZ2xhc3NGYWN0b3I6IDEuMFxuICAgIH0sXG5cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5wYXJhbWV0ZXJzID0ge1xuICAgICAgICAgICAgc3RhcnRUaW1lOiBEYXRlLm5vdygpLFxuICAgICAgICAgICAgdGltZTogMC4wLFxuICAgICAgICAgICAgbW91c2U6IHtcbiAgICAgICAgICAgICAgICB4OiAwLjAsXG4gICAgICAgICAgICAgICAgeTogMC4wXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVzb2x1dGlvbjoge1xuICAgICAgICAgICAgICAgIHg6IDAuMCxcbiAgICAgICAgICAgICAgICB5OiAwLjBcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9O1xuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuTU9VU0VfTU9WRSwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICB0aGlzLnBhcmFtZXRlcnMubW91c2UueCA9IHRoaXMubm9kZS5nZXRDb250ZW50U2l6ZSgpLndpZHRoIC8gZXZlbnQuZ2V0TG9jYXRpb25YKCk7XG4gICAgICAgICAgICB0aGlzLnBhcmFtZXRlcnMubW91c2UueSA9IHRoaXMubm9kZS5nZXRDb250ZW50U2l6ZSgpLmhlaWdodCAvIGV2ZW50LmdldExvY2F0aW9uWSgpO1xuICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfTU9WRSwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICB0aGlzLnBhcmFtZXRlcnMubW91c2UueCA9IHRoaXMubm9kZS5nZXRDb250ZW50U2l6ZSgpLndpZHRoIC8gZXZlbnQuZ2V0TG9jYXRpb25YKCk7XG4gICAgICAgICAgICB0aGlzLnBhcmFtZXRlcnMubW91c2UueSA9IHRoaXMubm9kZS5nZXRDb250ZW50U2l6ZSgpLmhlaWdodCAvIGV2ZW50LmdldExvY2F0aW9uWSgpO1xuICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICB0aGlzLl91c2UoKTtcbiAgICB9LFxuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKGR0KSB7XG4gICAgICAgIGlmICh0aGlzLmdsYXNzRmFjdG9yID49IDQwKSB7XG4gICAgICAgICAgICB0aGlzLmdsYXNzRmFjdG9yID0gMDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmdsYXNzRmFjdG9yICs9IGR0ICogMztcblxuICAgICAgICBpZiAodGhpcy5fcHJvZ3JhbSkge1xuXG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnVzZSgpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVHTFBhcmFtZXRlcnMoKTtcbiAgICAgICAgICAgIGlmIChjYy5zeXMuaXNOYXRpdmUpIHtcbiAgICAgICAgICAgICAgICB2YXIgZ2xQcm9ncmFtX3N0YXRlID0gY2MuR0xQcm9ncmFtU3RhdGUuZ2V0T3JDcmVhdGVXaXRoR0xQcm9ncmFtKHRoaXMuX3Byb2dyYW0pO1xuICAgICAgICAgICAgICAgIGdsUHJvZ3JhbV9zdGF0ZS5zZXRVbmlmb3JtVmVjMihcInJlc29sdXRpb25cIiwgdGhpcy5wYXJhbWV0ZXJzLnJlc29sdXRpb24pO1xuICAgICAgICAgICAgICAgIGdsUHJvZ3JhbV9zdGF0ZS5zZXRVbmlmb3JtRmxvYXQoXCJ0aW1lXCIsIHRoaXMucGFyYW1ldGVycy50aW1lKTtcbiAgICAgICAgICAgICAgICBnbFByb2dyYW1fc3RhdGUuc2V0VW5pZm9ybVZlYzIoXCJtb3VzZV90b3VjaFwiLCB0aGlzLnBhcmFtZXRlcnMubW91c2UpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnNldFVuaWZvcm1Mb2NhdGlvbldpdGgyZih0aGlzLl9yZXNvbHV0aW9uLCB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbi54LCB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbi55KTtcbiAgICAgICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnNldFVuaWZvcm1Mb2NhdGlvbldpdGgxZih0aGlzLl90aW1lLCB0aGlzLnBhcmFtZXRlcnMudGltZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMmYodGhpcy5fbW91c2UsIHRoaXMucGFyYW1ldGVycy5tb3VzZS54LCB0aGlzLnBhcmFtZXRlcnMubW91c2UueCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHVwZGF0ZUdMUGFyYW1ldGVyczogZnVuY3Rpb24gdXBkYXRlR0xQYXJhbWV0ZXJzKCkge1xuICAgICAgICB0aGlzLnBhcmFtZXRlcnMudGltZSA9IChEYXRlLm5vdygpIC0gdGhpcy5wYXJhbWV0ZXJzLnN0YXJ0VGltZSkgLyAxMDAwO1xuICAgICAgICB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbi54ID0gdGhpcy5ub2RlLmdldENvbnRlbnRTaXplKCkud2lkdGg7XG4gICAgICAgIHRoaXMucGFyYW1ldGVycy5yZXNvbHV0aW9uLnkgPSB0aGlzLm5vZGUuZ2V0Q29udGVudFNpemUoKS5oZWlnaHQ7XG4gICAgfSxcblxuICAgIF91c2U6IGZ1bmN0aW9uIF91c2UoKSB7XG5cbiAgICAgICAgaWYgKGNjLnN5cy5pc05hdGl2ZSkge1xuICAgICAgICAgICAgY2MubG9nKFwidXNlIG5hdGl2ZSBHTFByb2dyYW1cIik7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtID0gbmV3IGNjLkdMUHJvZ3JhbSgpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5pbml0V2l0aFN0cmluZyhfZGVmYXVsdF92ZXJ0X25vX212cCwgX2dsYXNzX2ZyYWcpO1xuXG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5tYWNyby5BVFRSSUJVVEVfTkFNRV9QT1NJVElPTiwgY2MubWFjcm8uVkVSVEVYX0FUVFJJQl9QT1NJVElPTik7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5tYWNyby5BVFRSSUJVVEVfTkFNRV9DT0xPUiwgY2MubWFjcm8uVkVSVEVYX0FUVFJJQl9DT0xPUik7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5tYWNyby5BVFRSSUJVVEVfTkFNRV9URVhfQ09PUkQsIGNjLm1hY3JvLlZFUlRFWF9BVFRSSUJfVEVYX0NPT1JEUyk7XG5cbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0ubGluaygpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS51cGRhdGVVbmlmb3JtcygpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVHTFBhcmFtZXRlcnMoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0gPSBuZXcgY2MuR0xQcm9ncmFtKCk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmluaXRXaXRoVmVydGV4U2hhZGVyQnl0ZUFycmF5KF9kZWZhdWx0X3ZlcnQsIF9nbGFzc19mcmFnKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uYWRkQXR0cmlidXRlKGNjLm1hY3JvLkFUVFJJQlVURV9OQU1FX1BPU0lUSU9OLCBjYy5tYWNyby5WRVJURVhfQVRUUklCX1BPU0lUSU9OKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uYWRkQXR0cmlidXRlKGNjLm1hY3JvLkFUVFJJQlVURV9OQU1FX0NPTE9SLCBjYy5tYWNyby5WRVJURVhfQVRUUklCX0NPTE9SKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uYWRkQXR0cmlidXRlKGNjLm1hY3JvLkFUVFJJQlVURV9OQU1FX1RFWF9DT09SRCwgY2MubWFjcm8uVkVSVEVYX0FUVFJJQl9URVhfQ09PUkRTKTtcblxuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5saW5rKCk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnVwZGF0ZVVuaWZvcm1zKCk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnVzZSgpO1xuXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUdMUGFyYW1ldGVycygpO1xuXG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnNldFVuaWZvcm1Mb2NhdGlvbldpdGgxZih0aGlzLl9wcm9ncmFtLmdldFVuaWZvcm1Mb2NhdGlvbkZvck5hbWUoJ3RpbWUnKSwgdGhpcy5wYXJhbWV0ZXJzLnRpbWUpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMmYodGhpcy5fcHJvZ3JhbS5nZXRVbmlmb3JtTG9jYXRpb25Gb3JOYW1lKCdtb3VzZV90b3VjaCcpLCB0aGlzLnBhcmFtZXRlcnMubW91c2UueCwgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlLnkpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMmYodGhpcy5fcHJvZ3JhbS5nZXRVbmlmb3JtTG9jYXRpb25Gb3JOYW1lKCdyZXNvbHV0aW9uJyksIHRoaXMucGFyYW1ldGVycy5yZXNvbHV0aW9uLngsIHRoaXMucGFyYW1ldGVycy5yZXNvbHV0aW9uLnkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNjLnN5cy5pc05hdGl2ZSkge1xuICAgICAgICAgICAgdmFyIGdsUHJvZ3JhbV9zdGF0ZSA9IGNjLkdMUHJvZ3JhbVN0YXRlLmdldE9yQ3JlYXRlV2l0aEdMUHJvZ3JhbSh0aGlzLl9wcm9ncmFtKTtcbiAgICAgICAgICAgIGdsUHJvZ3JhbV9zdGF0ZS5zZXRVbmlmb3JtVmVjMihcInJlc29sdXRpb25cIiwgdGhpcy5wYXJhbWV0ZXJzLnJlc29sdXRpb24pO1xuICAgICAgICAgICAgZ2xQcm9ncmFtX3N0YXRlLnNldFVuaWZvcm1GbG9hdChcInRpbWVcIiwgdGhpcy5wYXJhbWV0ZXJzLnRpbWUpO1xuICAgICAgICAgICAgZ2xQcm9ncmFtX3N0YXRlLnNldFVuaWZvcm1WZWMyKFwibW91c2VfdG91Y2hcIiwgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlKTtcbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgdGhpcy5fcmVzb2x1dGlvbiA9IHRoaXMuX3Byb2dyYW0uZ2V0VW5pZm9ybUxvY2F0aW9uRm9yTmFtZShcInJlc29sdXRpb25cIik7XG4gICAgICAgICAgICB0aGlzLl90aW1lID0gdGhpcy5fcHJvZ3JhbS5nZXRVbmlmb3JtTG9jYXRpb25Gb3JOYW1lKFwidGltZVwiKTtcbiAgICAgICAgICAgIHRoaXMuX21vdXNlID0gdGhpcy5fcHJvZ3JhbS5nZXRVbmlmb3JtTG9jYXRpb25Gb3JOYW1lKFwibW91c2VfdG91Y2hcIik7XG5cbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDJmKHRoaXMuX3Jlc29sdXRpb24sIHRoaXMucGFyYW1ldGVycy5yZXNvbHV0aW9uLngsIHRoaXMucGFyYW1ldGVycy5yZXNvbHV0aW9uLnkpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMWYodGhpcy5fdGltZSwgdGhpcy5wYXJhbWV0ZXJzLnRpbWUpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMmYodGhpcy5fbW91c2UsIHRoaXMucGFyYW1ldGVycy5tb3VzZS54LCB0aGlzLnBhcmFtZXRlcnMubW91c2UueSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNldFByb2dyYW0odGhpcy5ub2RlLl9zZ05vZGUsIHRoaXMuX3Byb2dyYW0pO1xuICAgIH0sXG5cbiAgICBzZXRQcm9ncmFtOiBmdW5jdGlvbiBzZXRQcm9ncmFtKG5vZGUsIHByb2dyYW0pIHtcbiAgICAgICAgaWYgKGNjLnN5cy5pc05hdGl2ZSkge1xuICAgICAgICAgICAgdmFyIGdsUHJvZ3JhbV9zdGF0ZSA9IGNjLkdMUHJvZ3JhbVN0YXRlLmdldE9yQ3JlYXRlV2l0aEdMUHJvZ3JhbShwcm9ncmFtKTtcbiAgICAgICAgICAgIG5vZGUuc2V0R0xQcm9ncmFtU3RhdGUoZ2xQcm9ncmFtX3N0YXRlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5vZGUuc2V0U2hhZGVyUHJvZ3JhbShwcm9ncmFtKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBjaGlsZHJlbiA9IG5vZGUuY2hpbGRyZW47XG4gICAgICAgIGlmICghY2hpbGRyZW4pIHJldHVybjtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB0aGlzLnNldFByb2dyYW0oY2hpbGRyZW5baV0sIHByb2dyYW0pO1xuICAgIH1cblxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICcyMDE3ZWx2Nmo5Rm9LUHZhTTJVMms3MycsICdFZmZlY3QxMicpO1xuLy8gU2NyaXB0L0VmZmVjdDEyLmpzXG5cbnZhciBfZGVmYXVsdF92ZXJ0ID0gcmVxdWlyZShcIi4uL1NoYWRlcnMvY2NTaGFkZXJfRGVmYXVsdF9WZXJ0LmpzXCIpO1xudmFyIF9kZWZhdWx0X3ZlcnRfbm9fbXZwID0gcmVxdWlyZShcIi4uL1NoYWRlcnMvY2NTaGFkZXJfRGVmYXVsdF9WZXJ0X25vTVZQLmpzXCIpO1xudmFyIF9nbGFzc19mcmFnID0gcmVxdWlyZShcIi4uL1NoYWRlcnMvY2NTaGFkZXJfRWZmZWN0MDRfRnJhZy5qc1wiKTtcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGdsYXNzRmFjdG9yOiAxLjBcbiAgICB9LFxuXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHRoaXMucGFyYW1ldGVycyA9IHtcbiAgICAgICAgICAgIHN0YXJ0VGltZTogRGF0ZS5ub3coKSxcbiAgICAgICAgICAgIHRpbWU6IDAuMCxcbiAgICAgICAgICAgIG1vdXNlOiB7XG4gICAgICAgICAgICAgICAgeDogMC4wLFxuICAgICAgICAgICAgICAgIHk6IDAuMFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlc29sdXRpb246IHtcbiAgICAgICAgICAgICAgICB4OiAwLjAsXG4gICAgICAgICAgICAgICAgeTogMC4wXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLk1PVVNFX01PVkUsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlLnggPSB0aGlzLm5vZGUuZ2V0Q29udGVudFNpemUoKS53aWR0aCAvIGV2ZW50LmdldExvY2F0aW9uWCgpO1xuICAgICAgICAgICAgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlLnkgPSB0aGlzLm5vZGUuZ2V0Q29udGVudFNpemUoKS5oZWlnaHQgLyBldmVudC5nZXRMb2NhdGlvblkoKTtcbiAgICAgICAgfSwgdGhpcyk7XG5cbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX01PVkUsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlLnggPSB0aGlzLm5vZGUuZ2V0Q29udGVudFNpemUoKS53aWR0aCAvIGV2ZW50LmdldExvY2F0aW9uWCgpO1xuICAgICAgICAgICAgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlLnkgPSB0aGlzLm5vZGUuZ2V0Q29udGVudFNpemUoKS5oZWlnaHQgLyBldmVudC5nZXRMb2NhdGlvblkoKTtcbiAgICAgICAgfSwgdGhpcyk7XG5cbiAgICAgICAgdGhpcy5fdXNlKCk7XG4gICAgfSxcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShkdCkge1xuICAgICAgICBpZiAodGhpcy5nbGFzc0ZhY3RvciA+PSA0MCkge1xuICAgICAgICAgICAgdGhpcy5nbGFzc0ZhY3RvciA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5nbGFzc0ZhY3RvciArPSBkdCAqIDM7XG5cbiAgICAgICAgaWYgKHRoaXMuX3Byb2dyYW0pIHtcblxuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS51c2UoKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlR0xQYXJhbWV0ZXJzKCk7XG4gICAgICAgICAgICBpZiAoY2Muc3lzLmlzTmF0aXZlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGdsUHJvZ3JhbV9zdGF0ZSA9IGNjLkdMUHJvZ3JhbVN0YXRlLmdldE9yQ3JlYXRlV2l0aEdMUHJvZ3JhbSh0aGlzLl9wcm9ncmFtKTtcbiAgICAgICAgICAgICAgICBnbFByb2dyYW1fc3RhdGUuc2V0VW5pZm9ybVZlYzIoXCJyZXNvbHV0aW9uXCIsIHRoaXMucGFyYW1ldGVycy5yZXNvbHV0aW9uKTtcbiAgICAgICAgICAgICAgICBnbFByb2dyYW1fc3RhdGUuc2V0VW5pZm9ybUZsb2F0KFwidGltZVwiLCB0aGlzLnBhcmFtZXRlcnMudGltZSk7XG4gICAgICAgICAgICAgICAgZ2xQcm9ncmFtX3N0YXRlLnNldFVuaWZvcm1WZWMyKFwibW91c2VfdG91Y2hcIiwgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMmYodGhpcy5fcmVzb2x1dGlvbiwgdGhpcy5wYXJhbWV0ZXJzLnJlc29sdXRpb24ueCwgdGhpcy5wYXJhbWV0ZXJzLnJlc29sdXRpb24ueSk7XG4gICAgICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMWYodGhpcy5fdGltZSwgdGhpcy5wYXJhbWV0ZXJzLnRpbWUpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDJmKHRoaXMuX21vdXNlLCB0aGlzLnBhcmFtZXRlcnMubW91c2UueCwgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlLngpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICB1cGRhdGVHTFBhcmFtZXRlcnM6IGZ1bmN0aW9uIHVwZGF0ZUdMUGFyYW1ldGVycygpIHtcbiAgICAgICAgdGhpcy5wYXJhbWV0ZXJzLnRpbWUgPSAoRGF0ZS5ub3coKSAtIHRoaXMucGFyYW1ldGVycy5zdGFydFRpbWUpIC8gMTAwMDtcbiAgICAgICAgdGhpcy5wYXJhbWV0ZXJzLnJlc29sdXRpb24ueCA9IHRoaXMubm9kZS5nZXRDb250ZW50U2l6ZSgpLndpZHRoO1xuICAgICAgICB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbi55ID0gdGhpcy5ub2RlLmdldENvbnRlbnRTaXplKCkuaGVpZ2h0O1xuICAgIH0sXG5cbiAgICBfdXNlOiBmdW5jdGlvbiBfdXNlKCkge1xuXG4gICAgICAgIGlmIChjYy5zeXMuaXNOYXRpdmUpIHtcbiAgICAgICAgICAgIGNjLmxvZyhcInVzZSBuYXRpdmUgR0xQcm9ncmFtXCIpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbSA9IG5ldyBjYy5HTFByb2dyYW0oKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uaW5pdFdpdGhTdHJpbmcoX2RlZmF1bHRfdmVydF9ub19tdnAsIF9nbGFzc19mcmFnKTtcblxuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MubWFjcm8uQVRUUklCVVRFX05BTUVfUE9TSVRJT04sIGNjLm1hY3JvLlZFUlRFWF9BVFRSSUJfUE9TSVRJT04pO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MubWFjcm8uQVRUUklCVVRFX05BTUVfQ09MT1IsIGNjLm1hY3JvLlZFUlRFWF9BVFRSSUJfQ09MT1IpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MubWFjcm8uQVRUUklCVVRFX05BTUVfVEVYX0NPT1JELCBjYy5tYWNyby5WRVJURVhfQVRUUklCX1RFWF9DT09SRFMpO1xuXG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmxpbmsoKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0udXBkYXRlVW5pZm9ybXMoKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlR0xQYXJhbWV0ZXJzKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtID0gbmV3IGNjLkdMUHJvZ3JhbSgpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5pbml0V2l0aFZlcnRleFNoYWRlckJ5dGVBcnJheShfZGVmYXVsdF92ZXJ0LCBfZ2xhc3NfZnJhZyk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5tYWNyby5BVFRSSUJVVEVfTkFNRV9QT1NJVElPTiwgY2MubWFjcm8uVkVSVEVYX0FUVFJJQl9QT1NJVElPTik7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5tYWNyby5BVFRSSUJVVEVfTkFNRV9DT0xPUiwgY2MubWFjcm8uVkVSVEVYX0FUVFJJQl9DT0xPUik7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5tYWNyby5BVFRSSUJVVEVfTkFNRV9URVhfQ09PUkQsIGNjLm1hY3JvLlZFUlRFWF9BVFRSSUJfVEVYX0NPT1JEUyk7XG5cbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0ubGluaygpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS51cGRhdGVVbmlmb3JtcygpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS51c2UoKTtcblxuICAgICAgICAgICAgdGhpcy51cGRhdGVHTFBhcmFtZXRlcnMoKTtcblxuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMWYodGhpcy5fcHJvZ3JhbS5nZXRVbmlmb3JtTG9jYXRpb25Gb3JOYW1lKCd0aW1lJyksIHRoaXMucGFyYW1ldGVycy50aW1lKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDJmKHRoaXMuX3Byb2dyYW0uZ2V0VW5pZm9ybUxvY2F0aW9uRm9yTmFtZSgnbW91c2VfdG91Y2gnKSwgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlLngsIHRoaXMucGFyYW1ldGVycy5tb3VzZS55KTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDJmKHRoaXMuX3Byb2dyYW0uZ2V0VW5pZm9ybUxvY2F0aW9uRm9yTmFtZSgncmVzb2x1dGlvbicpLCB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbi54LCB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbi55KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjYy5zeXMuaXNOYXRpdmUpIHtcbiAgICAgICAgICAgIHZhciBnbFByb2dyYW1fc3RhdGUgPSBjYy5HTFByb2dyYW1TdGF0ZS5nZXRPckNyZWF0ZVdpdGhHTFByb2dyYW0odGhpcy5fcHJvZ3JhbSk7XG4gICAgICAgICAgICBnbFByb2dyYW1fc3RhdGUuc2V0VW5pZm9ybVZlYzIoXCJyZXNvbHV0aW9uXCIsIHRoaXMucGFyYW1ldGVycy5yZXNvbHV0aW9uKTtcbiAgICAgICAgICAgIGdsUHJvZ3JhbV9zdGF0ZS5zZXRVbmlmb3JtRmxvYXQoXCJ0aW1lXCIsIHRoaXMucGFyYW1ldGVycy50aW1lKTtcbiAgICAgICAgICAgIGdsUHJvZ3JhbV9zdGF0ZS5zZXRVbmlmb3JtVmVjMihcIm1vdXNlX3RvdWNoXCIsIHRoaXMucGFyYW1ldGVycy5tb3VzZSk7XG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgIHRoaXMuX3Jlc29sdXRpb24gPSB0aGlzLl9wcm9ncmFtLmdldFVuaWZvcm1Mb2NhdGlvbkZvck5hbWUoXCJyZXNvbHV0aW9uXCIpO1xuICAgICAgICAgICAgdGhpcy5fdGltZSA9IHRoaXMuX3Byb2dyYW0uZ2V0VW5pZm9ybUxvY2F0aW9uRm9yTmFtZShcInRpbWVcIik7XG4gICAgICAgICAgICB0aGlzLl9tb3VzZSA9IHRoaXMuX3Byb2dyYW0uZ2V0VW5pZm9ybUxvY2F0aW9uRm9yTmFtZShcIm1vdXNlX3RvdWNoXCIpO1xuXG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnNldFVuaWZvcm1Mb2NhdGlvbldpdGgyZih0aGlzLl9yZXNvbHV0aW9uLCB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbi54LCB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbi55KTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDFmKHRoaXMuX3RpbWUsIHRoaXMucGFyYW1ldGVycy50aW1lKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDJmKHRoaXMuX21vdXNlLCB0aGlzLnBhcmFtZXRlcnMubW91c2UueCwgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlLnkpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZXRQcm9ncmFtKHRoaXMubm9kZS5fc2dOb2RlLCB0aGlzLl9wcm9ncmFtKTtcbiAgICB9LFxuXG4gICAgc2V0UHJvZ3JhbTogZnVuY3Rpb24gc2V0UHJvZ3JhbShub2RlLCBwcm9ncmFtKSB7XG4gICAgICAgIGlmIChjYy5zeXMuaXNOYXRpdmUpIHtcbiAgICAgICAgICAgIHZhciBnbFByb2dyYW1fc3RhdGUgPSBjYy5HTFByb2dyYW1TdGF0ZS5nZXRPckNyZWF0ZVdpdGhHTFByb2dyYW0ocHJvZ3JhbSk7XG4gICAgICAgICAgICBub2RlLnNldEdMUHJvZ3JhbVN0YXRlKGdsUHJvZ3JhbV9zdGF0ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBub2RlLnNldFNoYWRlclByb2dyYW0ocHJvZ3JhbSk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgY2hpbGRyZW4gPSBub2RlLmNoaWxkcmVuO1xuICAgICAgICBpZiAoIWNoaWxkcmVuKSByZXR1cm47XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykgdGhpcy5zZXRQcm9ncmFtKGNoaWxkcmVuW2ldLCBwcm9ncmFtKTtcbiAgICB9XG5cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnMWEyNzZuV2g2NUU3WXJPS0ljOGNXTUcnLCAnRWZmZWN0MTMnKTtcbi8vIFNjcmlwdC9FZmZlY3QxMy5qc1xuXG52YXIgX2RlZmF1bHRfdmVydCA9IHJlcXVpcmUoXCIuLi9TaGFkZXJzL2NjU2hhZGVyX0RlZmF1bHRfVmVydC5qc1wiKTtcbnZhciBfZGVmYXVsdF92ZXJ0X25vX212cCA9IHJlcXVpcmUoXCIuLi9TaGFkZXJzL2NjU2hhZGVyX0RlZmF1bHRfVmVydF9ub01WUC5qc1wiKTtcbnZhciBfZ2xhc3NfZnJhZyA9IHJlcXVpcmUoXCIuLi9TaGFkZXJzL2NjU2hhZGVyX0VmZmVjdDA0X0ZyYWcuanNcIik7XG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBnbGFzc0ZhY3RvcjogMS4wXG4gICAgfSxcblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLnBhcmFtZXRlcnMgPSB7XG4gICAgICAgICAgICBzdGFydFRpbWU6IERhdGUubm93KCksXG4gICAgICAgICAgICB0aW1lOiAwLjAsXG4gICAgICAgICAgICBtb3VzZToge1xuICAgICAgICAgICAgICAgIHg6IDAuMCxcbiAgICAgICAgICAgICAgICB5OiAwLjBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZXNvbHV0aW9uOiB7XG4gICAgICAgICAgICAgICAgeDogMC4wLFxuICAgICAgICAgICAgICAgIHk6IDAuMFxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5NT1VTRV9NT1ZFLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIHRoaXMucGFyYW1ldGVycy5tb3VzZS54ID0gdGhpcy5ub2RlLmdldENvbnRlbnRTaXplKCkud2lkdGggLyBldmVudC5nZXRMb2NhdGlvblgoKTtcbiAgICAgICAgICAgIHRoaXMucGFyYW1ldGVycy5tb3VzZS55ID0gdGhpcy5ub2RlLmdldENvbnRlbnRTaXplKCkuaGVpZ2h0IC8gZXZlbnQuZ2V0TG9jYXRpb25ZKCk7XG4gICAgICAgIH0sIHRoaXMpO1xuXG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9NT1ZFLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIHRoaXMucGFyYW1ldGVycy5tb3VzZS54ID0gdGhpcy5ub2RlLmdldENvbnRlbnRTaXplKCkud2lkdGggLyBldmVudC5nZXRMb2NhdGlvblgoKTtcbiAgICAgICAgICAgIHRoaXMucGFyYW1ldGVycy5tb3VzZS55ID0gdGhpcy5ub2RlLmdldENvbnRlbnRTaXplKCkuaGVpZ2h0IC8gZXZlbnQuZ2V0TG9jYXRpb25ZKCk7XG4gICAgICAgIH0sIHRoaXMpO1xuXG4gICAgICAgIHRoaXMuX3VzZSgpO1xuICAgIH0sXG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoZHQpIHtcbiAgICAgICAgaWYgKHRoaXMuZ2xhc3NGYWN0b3IgPj0gNDApIHtcbiAgICAgICAgICAgIHRoaXMuZ2xhc3NGYWN0b3IgPSAwO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZ2xhc3NGYWN0b3IgKz0gZHQgKiAzO1xuXG4gICAgICAgIGlmICh0aGlzLl9wcm9ncmFtKSB7XG5cbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0udXNlKCk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUdMUGFyYW1ldGVycygpO1xuICAgICAgICAgICAgaWYgKGNjLnN5cy5pc05hdGl2ZSkge1xuICAgICAgICAgICAgICAgIHZhciBnbFByb2dyYW1fc3RhdGUgPSBjYy5HTFByb2dyYW1TdGF0ZS5nZXRPckNyZWF0ZVdpdGhHTFByb2dyYW0odGhpcy5fcHJvZ3JhbSk7XG4gICAgICAgICAgICAgICAgZ2xQcm9ncmFtX3N0YXRlLnNldFVuaWZvcm1WZWMyKFwicmVzb2x1dGlvblwiLCB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbik7XG4gICAgICAgICAgICAgICAgZ2xQcm9ncmFtX3N0YXRlLnNldFVuaWZvcm1GbG9hdChcInRpbWVcIiwgdGhpcy5wYXJhbWV0ZXJzLnRpbWUpO1xuICAgICAgICAgICAgICAgIGdsUHJvZ3JhbV9zdGF0ZS5zZXRVbmlmb3JtVmVjMihcIm1vdXNlX3RvdWNoXCIsIHRoaXMucGFyYW1ldGVycy5tb3VzZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDJmKHRoaXMuX3Jlc29sdXRpb24sIHRoaXMucGFyYW1ldGVycy5yZXNvbHV0aW9uLngsIHRoaXMucGFyYW1ldGVycy5yZXNvbHV0aW9uLnkpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDFmKHRoaXMuX3RpbWUsIHRoaXMucGFyYW1ldGVycy50aW1lKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnNldFVuaWZvcm1Mb2NhdGlvbldpdGgyZih0aGlzLl9tb3VzZSwgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlLngsIHRoaXMucGFyYW1ldGVycy5tb3VzZS54KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgdXBkYXRlR0xQYXJhbWV0ZXJzOiBmdW5jdGlvbiB1cGRhdGVHTFBhcmFtZXRlcnMoKSB7XG4gICAgICAgIHRoaXMucGFyYW1ldGVycy50aW1lID0gKERhdGUubm93KCkgLSB0aGlzLnBhcmFtZXRlcnMuc3RhcnRUaW1lKSAvIDEwMDA7XG4gICAgICAgIHRoaXMucGFyYW1ldGVycy5yZXNvbHV0aW9uLnggPSB0aGlzLm5vZGUuZ2V0Q29udGVudFNpemUoKS53aWR0aDtcbiAgICAgICAgdGhpcy5wYXJhbWV0ZXJzLnJlc29sdXRpb24ueSA9IHRoaXMubm9kZS5nZXRDb250ZW50U2l6ZSgpLmhlaWdodDtcbiAgICB9LFxuXG4gICAgX3VzZTogZnVuY3Rpb24gX3VzZSgpIHtcblxuICAgICAgICBpZiAoY2Muc3lzLmlzTmF0aXZlKSB7XG4gICAgICAgICAgICBjYy5sb2coXCJ1c2UgbmF0aXZlIEdMUHJvZ3JhbVwiKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0gPSBuZXcgY2MuR0xQcm9ncmFtKCk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmluaXRXaXRoU3RyaW5nKF9kZWZhdWx0X3ZlcnRfbm9fbXZwLCBfZ2xhc3NfZnJhZyk7XG5cbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uYWRkQXR0cmlidXRlKGNjLm1hY3JvLkFUVFJJQlVURV9OQU1FX1BPU0lUSU9OLCBjYy5tYWNyby5WRVJURVhfQVRUUklCX1BPU0lUSU9OKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uYWRkQXR0cmlidXRlKGNjLm1hY3JvLkFUVFJJQlVURV9OQU1FX0NPTE9SLCBjYy5tYWNyby5WRVJURVhfQVRUUklCX0NPTE9SKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uYWRkQXR0cmlidXRlKGNjLm1hY3JvLkFUVFJJQlVURV9OQU1FX1RFWF9DT09SRCwgY2MubWFjcm8uVkVSVEVYX0FUVFJJQl9URVhfQ09PUkRTKTtcblxuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5saW5rKCk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnVwZGF0ZVVuaWZvcm1zKCk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUdMUGFyYW1ldGVycygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbSA9IG5ldyBjYy5HTFByb2dyYW0oKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uaW5pdFdpdGhWZXJ0ZXhTaGFkZXJCeXRlQXJyYXkoX2RlZmF1bHRfdmVydCwgX2dsYXNzX2ZyYWcpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MubWFjcm8uQVRUUklCVVRFX05BTUVfUE9TSVRJT04sIGNjLm1hY3JvLlZFUlRFWF9BVFRSSUJfUE9TSVRJT04pO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MubWFjcm8uQVRUUklCVVRFX05BTUVfQ09MT1IsIGNjLm1hY3JvLlZFUlRFWF9BVFRSSUJfQ09MT1IpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MubWFjcm8uQVRUUklCVVRFX05BTUVfVEVYX0NPT1JELCBjYy5tYWNyby5WRVJURVhfQVRUUklCX1RFWF9DT09SRFMpO1xuXG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmxpbmsoKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0udXBkYXRlVW5pZm9ybXMoKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0udXNlKCk7XG5cbiAgICAgICAgICAgIHRoaXMudXBkYXRlR0xQYXJhbWV0ZXJzKCk7XG5cbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDFmKHRoaXMuX3Byb2dyYW0uZ2V0VW5pZm9ybUxvY2F0aW9uRm9yTmFtZSgndGltZScpLCB0aGlzLnBhcmFtZXRlcnMudGltZSk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnNldFVuaWZvcm1Mb2NhdGlvbldpdGgyZih0aGlzLl9wcm9ncmFtLmdldFVuaWZvcm1Mb2NhdGlvbkZvck5hbWUoJ21vdXNlX3RvdWNoJyksIHRoaXMucGFyYW1ldGVycy5tb3VzZS54LCB0aGlzLnBhcmFtZXRlcnMubW91c2UueSk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnNldFVuaWZvcm1Mb2NhdGlvbldpdGgyZih0aGlzLl9wcm9ncmFtLmdldFVuaWZvcm1Mb2NhdGlvbkZvck5hbWUoJ3Jlc29sdXRpb24nKSwgdGhpcy5wYXJhbWV0ZXJzLnJlc29sdXRpb24ueCwgdGhpcy5wYXJhbWV0ZXJzLnJlc29sdXRpb24ueSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY2Muc3lzLmlzTmF0aXZlKSB7XG4gICAgICAgICAgICB2YXIgZ2xQcm9ncmFtX3N0YXRlID0gY2MuR0xQcm9ncmFtU3RhdGUuZ2V0T3JDcmVhdGVXaXRoR0xQcm9ncmFtKHRoaXMuX3Byb2dyYW0pO1xuICAgICAgICAgICAgZ2xQcm9ncmFtX3N0YXRlLnNldFVuaWZvcm1WZWMyKFwicmVzb2x1dGlvblwiLCB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbik7XG4gICAgICAgICAgICBnbFByb2dyYW1fc3RhdGUuc2V0VW5pZm9ybUZsb2F0KFwidGltZVwiLCB0aGlzLnBhcmFtZXRlcnMudGltZSk7XG4gICAgICAgICAgICBnbFByb2dyYW1fc3RhdGUuc2V0VW5pZm9ybVZlYzIoXCJtb3VzZV90b3VjaFwiLCB0aGlzLnBhcmFtZXRlcnMubW91c2UpO1xuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICB0aGlzLl9yZXNvbHV0aW9uID0gdGhpcy5fcHJvZ3JhbS5nZXRVbmlmb3JtTG9jYXRpb25Gb3JOYW1lKFwicmVzb2x1dGlvblwiKTtcbiAgICAgICAgICAgIHRoaXMuX3RpbWUgPSB0aGlzLl9wcm9ncmFtLmdldFVuaWZvcm1Mb2NhdGlvbkZvck5hbWUoXCJ0aW1lXCIpO1xuICAgICAgICAgICAgdGhpcy5fbW91c2UgPSB0aGlzLl9wcm9ncmFtLmdldFVuaWZvcm1Mb2NhdGlvbkZvck5hbWUoXCJtb3VzZV90b3VjaFwiKTtcblxuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMmYodGhpcy5fcmVzb2x1dGlvbiwgdGhpcy5wYXJhbWV0ZXJzLnJlc29sdXRpb24ueCwgdGhpcy5wYXJhbWV0ZXJzLnJlc29sdXRpb24ueSk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnNldFVuaWZvcm1Mb2NhdGlvbldpdGgxZih0aGlzLl90aW1lLCB0aGlzLnBhcmFtZXRlcnMudGltZSk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnNldFVuaWZvcm1Mb2NhdGlvbldpdGgyZih0aGlzLl9tb3VzZSwgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlLngsIHRoaXMucGFyYW1ldGVycy5tb3VzZS55KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0UHJvZ3JhbSh0aGlzLm5vZGUuX3NnTm9kZSwgdGhpcy5fcHJvZ3JhbSk7XG4gICAgfSxcblxuICAgIHNldFByb2dyYW06IGZ1bmN0aW9uIHNldFByb2dyYW0obm9kZSwgcHJvZ3JhbSkge1xuICAgICAgICBpZiAoY2Muc3lzLmlzTmF0aXZlKSB7XG4gICAgICAgICAgICB2YXIgZ2xQcm9ncmFtX3N0YXRlID0gY2MuR0xQcm9ncmFtU3RhdGUuZ2V0T3JDcmVhdGVXaXRoR0xQcm9ncmFtKHByb2dyYW0pO1xuICAgICAgICAgICAgbm9kZS5zZXRHTFByb2dyYW1TdGF0ZShnbFByb2dyYW1fc3RhdGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbm9kZS5zZXRTaGFkZXJQcm9ncmFtKHByb2dyYW0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGNoaWxkcmVuID0gbm9kZS5jaGlsZHJlbjtcbiAgICAgICAgaWYgKCFjaGlsZHJlbikgcmV0dXJuO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHRoaXMuc2V0UHJvZ3JhbShjaGlsZHJlbltpXSwgcHJvZ3JhbSk7XG4gICAgfVxuXG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzU1OWViYk53TzFBR0twc2VzRU84cjl4JywgJ0VmZmVjdDE0Jyk7XG4vLyBTY3JpcHQvRWZmZWN0MTQuanNcblxudmFyIF9kZWZhdWx0X3ZlcnQgPSByZXF1aXJlKFwiLi4vU2hhZGVycy9jY1NoYWRlcl9EZWZhdWx0X1ZlcnQuanNcIik7XG52YXIgX2RlZmF1bHRfdmVydF9ub19tdnAgPSByZXF1aXJlKFwiLi4vU2hhZGVycy9jY1NoYWRlcl9EZWZhdWx0X1ZlcnRfbm9NVlAuanNcIik7XG52YXIgX2dsYXNzX2ZyYWcgPSByZXF1aXJlKFwiLi4vU2hhZGVycy9jY1NoYWRlcl9FZmZlY3QwNF9GcmFnLmpzXCIpO1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgZ2xhc3NGYWN0b3I6IDEuMFxuICAgIH0sXG5cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5wYXJhbWV0ZXJzID0ge1xuICAgICAgICAgICAgc3RhcnRUaW1lOiBEYXRlLm5vdygpLFxuICAgICAgICAgICAgdGltZTogMC4wLFxuICAgICAgICAgICAgbW91c2U6IHtcbiAgICAgICAgICAgICAgICB4OiAwLjAsXG4gICAgICAgICAgICAgICAgeTogMC4wXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVzb2x1dGlvbjoge1xuICAgICAgICAgICAgICAgIHg6IDAuMCxcbiAgICAgICAgICAgICAgICB5OiAwLjBcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9O1xuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuTU9VU0VfTU9WRSwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICB0aGlzLnBhcmFtZXRlcnMubW91c2UueCA9IHRoaXMubm9kZS5nZXRDb250ZW50U2l6ZSgpLndpZHRoIC8gZXZlbnQuZ2V0TG9jYXRpb25YKCk7XG4gICAgICAgICAgICB0aGlzLnBhcmFtZXRlcnMubW91c2UueSA9IHRoaXMubm9kZS5nZXRDb250ZW50U2l6ZSgpLmhlaWdodCAvIGV2ZW50LmdldExvY2F0aW9uWSgpO1xuICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfTU9WRSwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICB0aGlzLnBhcmFtZXRlcnMubW91c2UueCA9IHRoaXMubm9kZS5nZXRDb250ZW50U2l6ZSgpLndpZHRoIC8gZXZlbnQuZ2V0TG9jYXRpb25YKCk7XG4gICAgICAgICAgICB0aGlzLnBhcmFtZXRlcnMubW91c2UueSA9IHRoaXMubm9kZS5nZXRDb250ZW50U2l6ZSgpLmhlaWdodCAvIGV2ZW50LmdldExvY2F0aW9uWSgpO1xuICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICB0aGlzLl91c2UoKTtcbiAgICB9LFxuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKGR0KSB7XG4gICAgICAgIGlmICh0aGlzLmdsYXNzRmFjdG9yID49IDQwKSB7XG4gICAgICAgICAgICB0aGlzLmdsYXNzRmFjdG9yID0gMDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmdsYXNzRmFjdG9yICs9IGR0ICogMztcblxuICAgICAgICBpZiAodGhpcy5fcHJvZ3JhbSkge1xuXG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnVzZSgpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVHTFBhcmFtZXRlcnMoKTtcbiAgICAgICAgICAgIGlmIChjYy5zeXMuaXNOYXRpdmUpIHtcbiAgICAgICAgICAgICAgICB2YXIgZ2xQcm9ncmFtX3N0YXRlID0gY2MuR0xQcm9ncmFtU3RhdGUuZ2V0T3JDcmVhdGVXaXRoR0xQcm9ncmFtKHRoaXMuX3Byb2dyYW0pO1xuICAgICAgICAgICAgICAgIGdsUHJvZ3JhbV9zdGF0ZS5zZXRVbmlmb3JtVmVjMihcInJlc29sdXRpb25cIiwgdGhpcy5wYXJhbWV0ZXJzLnJlc29sdXRpb24pO1xuICAgICAgICAgICAgICAgIGdsUHJvZ3JhbV9zdGF0ZS5zZXRVbmlmb3JtRmxvYXQoXCJ0aW1lXCIsIHRoaXMucGFyYW1ldGVycy50aW1lKTtcbiAgICAgICAgICAgICAgICBnbFByb2dyYW1fc3RhdGUuc2V0VW5pZm9ybVZlYzIoXCJtb3VzZV90b3VjaFwiLCB0aGlzLnBhcmFtZXRlcnMubW91c2UpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnNldFVuaWZvcm1Mb2NhdGlvbldpdGgyZih0aGlzLl9yZXNvbHV0aW9uLCB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbi54LCB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbi55KTtcbiAgICAgICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnNldFVuaWZvcm1Mb2NhdGlvbldpdGgxZih0aGlzLl90aW1lLCB0aGlzLnBhcmFtZXRlcnMudGltZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMmYodGhpcy5fbW91c2UsIHRoaXMucGFyYW1ldGVycy5tb3VzZS54LCB0aGlzLnBhcmFtZXRlcnMubW91c2UueCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHVwZGF0ZUdMUGFyYW1ldGVyczogZnVuY3Rpb24gdXBkYXRlR0xQYXJhbWV0ZXJzKCkge1xuICAgICAgICB0aGlzLnBhcmFtZXRlcnMudGltZSA9IChEYXRlLm5vdygpIC0gdGhpcy5wYXJhbWV0ZXJzLnN0YXJ0VGltZSkgLyAxMDAwO1xuICAgICAgICB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbi54ID0gdGhpcy5ub2RlLmdldENvbnRlbnRTaXplKCkud2lkdGg7XG4gICAgICAgIHRoaXMucGFyYW1ldGVycy5yZXNvbHV0aW9uLnkgPSB0aGlzLm5vZGUuZ2V0Q29udGVudFNpemUoKS5oZWlnaHQ7XG4gICAgfSxcblxuICAgIF91c2U6IGZ1bmN0aW9uIF91c2UoKSB7XG5cbiAgICAgICAgaWYgKGNjLnN5cy5pc05hdGl2ZSkge1xuICAgICAgICAgICAgY2MubG9nKFwidXNlIG5hdGl2ZSBHTFByb2dyYW1cIik7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtID0gbmV3IGNjLkdMUHJvZ3JhbSgpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5pbml0V2l0aFN0cmluZyhfZGVmYXVsdF92ZXJ0X25vX212cCwgX2dsYXNzX2ZyYWcpO1xuXG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5tYWNyby5BVFRSSUJVVEVfTkFNRV9QT1NJVElPTiwgY2MubWFjcm8uVkVSVEVYX0FUVFJJQl9QT1NJVElPTik7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5tYWNyby5BVFRSSUJVVEVfTkFNRV9DT0xPUiwgY2MubWFjcm8uVkVSVEVYX0FUVFJJQl9DT0xPUik7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5tYWNyby5BVFRSSUJVVEVfTkFNRV9URVhfQ09PUkQsIGNjLm1hY3JvLlZFUlRFWF9BVFRSSUJfVEVYX0NPT1JEUyk7XG5cbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0ubGluaygpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS51cGRhdGVVbmlmb3JtcygpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVHTFBhcmFtZXRlcnMoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0gPSBuZXcgY2MuR0xQcm9ncmFtKCk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmluaXRXaXRoVmVydGV4U2hhZGVyQnl0ZUFycmF5KF9kZWZhdWx0X3ZlcnQsIF9nbGFzc19mcmFnKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uYWRkQXR0cmlidXRlKGNjLm1hY3JvLkFUVFJJQlVURV9OQU1FX1BPU0lUSU9OLCBjYy5tYWNyby5WRVJURVhfQVRUUklCX1BPU0lUSU9OKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uYWRkQXR0cmlidXRlKGNjLm1hY3JvLkFUVFJJQlVURV9OQU1FX0NPTE9SLCBjYy5tYWNyby5WRVJURVhfQVRUUklCX0NPTE9SKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uYWRkQXR0cmlidXRlKGNjLm1hY3JvLkFUVFJJQlVURV9OQU1FX1RFWF9DT09SRCwgY2MubWFjcm8uVkVSVEVYX0FUVFJJQl9URVhfQ09PUkRTKTtcblxuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5saW5rKCk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnVwZGF0ZVVuaWZvcm1zKCk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnVzZSgpO1xuXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUdMUGFyYW1ldGVycygpO1xuXG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnNldFVuaWZvcm1Mb2NhdGlvbldpdGgxZih0aGlzLl9wcm9ncmFtLmdldFVuaWZvcm1Mb2NhdGlvbkZvck5hbWUoJ3RpbWUnKSwgdGhpcy5wYXJhbWV0ZXJzLnRpbWUpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMmYodGhpcy5fcHJvZ3JhbS5nZXRVbmlmb3JtTG9jYXRpb25Gb3JOYW1lKCdtb3VzZV90b3VjaCcpLCB0aGlzLnBhcmFtZXRlcnMubW91c2UueCwgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlLnkpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMmYodGhpcy5fcHJvZ3JhbS5nZXRVbmlmb3JtTG9jYXRpb25Gb3JOYW1lKCdyZXNvbHV0aW9uJyksIHRoaXMucGFyYW1ldGVycy5yZXNvbHV0aW9uLngsIHRoaXMucGFyYW1ldGVycy5yZXNvbHV0aW9uLnkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNjLnN5cy5pc05hdGl2ZSkge1xuICAgICAgICAgICAgdmFyIGdsUHJvZ3JhbV9zdGF0ZSA9IGNjLkdMUHJvZ3JhbVN0YXRlLmdldE9yQ3JlYXRlV2l0aEdMUHJvZ3JhbSh0aGlzLl9wcm9ncmFtKTtcbiAgICAgICAgICAgIGdsUHJvZ3JhbV9zdGF0ZS5zZXRVbmlmb3JtVmVjMihcInJlc29sdXRpb25cIiwgdGhpcy5wYXJhbWV0ZXJzLnJlc29sdXRpb24pO1xuICAgICAgICAgICAgZ2xQcm9ncmFtX3N0YXRlLnNldFVuaWZvcm1GbG9hdChcInRpbWVcIiwgdGhpcy5wYXJhbWV0ZXJzLnRpbWUpO1xuICAgICAgICAgICAgZ2xQcm9ncmFtX3N0YXRlLnNldFVuaWZvcm1WZWMyKFwibW91c2VfdG91Y2hcIiwgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlKTtcbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgdGhpcy5fcmVzb2x1dGlvbiA9IHRoaXMuX3Byb2dyYW0uZ2V0VW5pZm9ybUxvY2F0aW9uRm9yTmFtZShcInJlc29sdXRpb25cIik7XG4gICAgICAgICAgICB0aGlzLl90aW1lID0gdGhpcy5fcHJvZ3JhbS5nZXRVbmlmb3JtTG9jYXRpb25Gb3JOYW1lKFwidGltZVwiKTtcbiAgICAgICAgICAgIHRoaXMuX21vdXNlID0gdGhpcy5fcHJvZ3JhbS5nZXRVbmlmb3JtTG9jYXRpb25Gb3JOYW1lKFwibW91c2VfdG91Y2hcIik7XG5cbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDJmKHRoaXMuX3Jlc29sdXRpb24sIHRoaXMucGFyYW1ldGVycy5yZXNvbHV0aW9uLngsIHRoaXMucGFyYW1ldGVycy5yZXNvbHV0aW9uLnkpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMWYodGhpcy5fdGltZSwgdGhpcy5wYXJhbWV0ZXJzLnRpbWUpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMmYodGhpcy5fbW91c2UsIHRoaXMucGFyYW1ldGVycy5tb3VzZS54LCB0aGlzLnBhcmFtZXRlcnMubW91c2UueSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNldFByb2dyYW0odGhpcy5ub2RlLl9zZ05vZGUsIHRoaXMuX3Byb2dyYW0pO1xuICAgIH0sXG5cbiAgICBzZXRQcm9ncmFtOiBmdW5jdGlvbiBzZXRQcm9ncmFtKG5vZGUsIHByb2dyYW0pIHtcbiAgICAgICAgaWYgKGNjLnN5cy5pc05hdGl2ZSkge1xuICAgICAgICAgICAgdmFyIGdsUHJvZ3JhbV9zdGF0ZSA9IGNjLkdMUHJvZ3JhbVN0YXRlLmdldE9yQ3JlYXRlV2l0aEdMUHJvZ3JhbShwcm9ncmFtKTtcbiAgICAgICAgICAgIG5vZGUuc2V0R0xQcm9ncmFtU3RhdGUoZ2xQcm9ncmFtX3N0YXRlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5vZGUuc2V0U2hhZGVyUHJvZ3JhbShwcm9ncmFtKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBjaGlsZHJlbiA9IG5vZGUuY2hpbGRyZW47XG4gICAgICAgIGlmICghY2hpbGRyZW4pIHJldHVybjtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB0aGlzLnNldFByb2dyYW0oY2hpbGRyZW5baV0sIHByb2dyYW0pO1xuICAgIH1cblxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICczMDgwY2tvc1J4Rm1ySk94OUQ5UEU2WCcsICdFZmZlY3QxNScpO1xuLy8gU2NyaXB0L0VmZmVjdDE1LmpzXG5cbnZhciBfZGVmYXVsdF92ZXJ0ID0gcmVxdWlyZShcIi4uL1NoYWRlcnMvY2NTaGFkZXJfRGVmYXVsdF9WZXJ0LmpzXCIpO1xudmFyIF9kZWZhdWx0X3ZlcnRfbm9fbXZwID0gcmVxdWlyZShcIi4uL1NoYWRlcnMvY2NTaGFkZXJfRGVmYXVsdF9WZXJ0X25vTVZQLmpzXCIpO1xudmFyIF9nbGFzc19mcmFnID0gcmVxdWlyZShcIi4uL1NoYWRlcnMvY2NTaGFkZXJfRWZmZWN0MDRfRnJhZy5qc1wiKTtcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGdsYXNzRmFjdG9yOiAxLjBcbiAgICB9LFxuXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHRoaXMucGFyYW1ldGVycyA9IHtcbiAgICAgICAgICAgIHN0YXJ0VGltZTogRGF0ZS5ub3coKSxcbiAgICAgICAgICAgIHRpbWU6IDAuMCxcbiAgICAgICAgICAgIG1vdXNlOiB7XG4gICAgICAgICAgICAgICAgeDogMC4wLFxuICAgICAgICAgICAgICAgIHk6IDAuMFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlc29sdXRpb246IHtcbiAgICAgICAgICAgICAgICB4OiAwLjAsXG4gICAgICAgICAgICAgICAgeTogMC4wXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLk1PVVNFX01PVkUsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlLnggPSB0aGlzLm5vZGUuZ2V0Q29udGVudFNpemUoKS53aWR0aCAvIGV2ZW50LmdldExvY2F0aW9uWCgpO1xuICAgICAgICAgICAgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlLnkgPSB0aGlzLm5vZGUuZ2V0Q29udGVudFNpemUoKS5oZWlnaHQgLyBldmVudC5nZXRMb2NhdGlvblkoKTtcbiAgICAgICAgfSwgdGhpcyk7XG5cbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX01PVkUsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlLnggPSB0aGlzLm5vZGUuZ2V0Q29udGVudFNpemUoKS53aWR0aCAvIGV2ZW50LmdldExvY2F0aW9uWCgpO1xuICAgICAgICAgICAgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlLnkgPSB0aGlzLm5vZGUuZ2V0Q29udGVudFNpemUoKS5oZWlnaHQgLyBldmVudC5nZXRMb2NhdGlvblkoKTtcbiAgICAgICAgfSwgdGhpcyk7XG5cbiAgICAgICAgdGhpcy5fdXNlKCk7XG4gICAgfSxcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShkdCkge1xuICAgICAgICBpZiAodGhpcy5nbGFzc0ZhY3RvciA+PSA0MCkge1xuICAgICAgICAgICAgdGhpcy5nbGFzc0ZhY3RvciA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5nbGFzc0ZhY3RvciArPSBkdCAqIDM7XG5cbiAgICAgICAgaWYgKHRoaXMuX3Byb2dyYW0pIHtcblxuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS51c2UoKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlR0xQYXJhbWV0ZXJzKCk7XG4gICAgICAgICAgICBpZiAoY2Muc3lzLmlzTmF0aXZlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGdsUHJvZ3JhbV9zdGF0ZSA9IGNjLkdMUHJvZ3JhbVN0YXRlLmdldE9yQ3JlYXRlV2l0aEdMUHJvZ3JhbSh0aGlzLl9wcm9ncmFtKTtcbiAgICAgICAgICAgICAgICBnbFByb2dyYW1fc3RhdGUuc2V0VW5pZm9ybVZlYzIoXCJyZXNvbHV0aW9uXCIsIHRoaXMucGFyYW1ldGVycy5yZXNvbHV0aW9uKTtcbiAgICAgICAgICAgICAgICBnbFByb2dyYW1fc3RhdGUuc2V0VW5pZm9ybUZsb2F0KFwidGltZVwiLCB0aGlzLnBhcmFtZXRlcnMudGltZSk7XG4gICAgICAgICAgICAgICAgZ2xQcm9ncmFtX3N0YXRlLnNldFVuaWZvcm1WZWMyKFwibW91c2VfdG91Y2hcIiwgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMmYodGhpcy5fcmVzb2x1dGlvbiwgdGhpcy5wYXJhbWV0ZXJzLnJlc29sdXRpb24ueCwgdGhpcy5wYXJhbWV0ZXJzLnJlc29sdXRpb24ueSk7XG4gICAgICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMWYodGhpcy5fdGltZSwgdGhpcy5wYXJhbWV0ZXJzLnRpbWUpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDJmKHRoaXMuX21vdXNlLCB0aGlzLnBhcmFtZXRlcnMubW91c2UueCwgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlLngpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICB1cGRhdGVHTFBhcmFtZXRlcnM6IGZ1bmN0aW9uIHVwZGF0ZUdMUGFyYW1ldGVycygpIHtcbiAgICAgICAgdGhpcy5wYXJhbWV0ZXJzLnRpbWUgPSAoRGF0ZS5ub3coKSAtIHRoaXMucGFyYW1ldGVycy5zdGFydFRpbWUpIC8gMTAwMDtcbiAgICAgICAgdGhpcy5wYXJhbWV0ZXJzLnJlc29sdXRpb24ueCA9IHRoaXMubm9kZS5nZXRDb250ZW50U2l6ZSgpLndpZHRoO1xuICAgICAgICB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbi55ID0gdGhpcy5ub2RlLmdldENvbnRlbnRTaXplKCkuaGVpZ2h0O1xuICAgIH0sXG5cbiAgICBfdXNlOiBmdW5jdGlvbiBfdXNlKCkge1xuXG4gICAgICAgIGlmIChjYy5zeXMuaXNOYXRpdmUpIHtcbiAgICAgICAgICAgIGNjLmxvZyhcInVzZSBuYXRpdmUgR0xQcm9ncmFtXCIpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbSA9IG5ldyBjYy5HTFByb2dyYW0oKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uaW5pdFdpdGhTdHJpbmcoX2RlZmF1bHRfdmVydF9ub19tdnAsIF9nbGFzc19mcmFnKTtcblxuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MubWFjcm8uQVRUUklCVVRFX05BTUVfUE9TSVRJT04sIGNjLm1hY3JvLlZFUlRFWF9BVFRSSUJfUE9TSVRJT04pO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MubWFjcm8uQVRUUklCVVRFX05BTUVfQ09MT1IsIGNjLm1hY3JvLlZFUlRFWF9BVFRSSUJfQ09MT1IpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MubWFjcm8uQVRUUklCVVRFX05BTUVfVEVYX0NPT1JELCBjYy5tYWNyby5WRVJURVhfQVRUUklCX1RFWF9DT09SRFMpO1xuXG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmxpbmsoKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0udXBkYXRlVW5pZm9ybXMoKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlR0xQYXJhbWV0ZXJzKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtID0gbmV3IGNjLkdMUHJvZ3JhbSgpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5pbml0V2l0aFZlcnRleFNoYWRlckJ5dGVBcnJheShfZGVmYXVsdF92ZXJ0LCBfZ2xhc3NfZnJhZyk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5tYWNyby5BVFRSSUJVVEVfTkFNRV9QT1NJVElPTiwgY2MubWFjcm8uVkVSVEVYX0FUVFJJQl9QT1NJVElPTik7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5tYWNyby5BVFRSSUJVVEVfTkFNRV9DT0xPUiwgY2MubWFjcm8uVkVSVEVYX0FUVFJJQl9DT0xPUik7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5tYWNyby5BVFRSSUJVVEVfTkFNRV9URVhfQ09PUkQsIGNjLm1hY3JvLlZFUlRFWF9BVFRSSUJfVEVYX0NPT1JEUyk7XG5cbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0ubGluaygpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS51cGRhdGVVbmlmb3JtcygpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS51c2UoKTtcblxuICAgICAgICAgICAgdGhpcy51cGRhdGVHTFBhcmFtZXRlcnMoKTtcblxuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMWYodGhpcy5fcHJvZ3JhbS5nZXRVbmlmb3JtTG9jYXRpb25Gb3JOYW1lKCd0aW1lJyksIHRoaXMucGFyYW1ldGVycy50aW1lKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDJmKHRoaXMuX3Byb2dyYW0uZ2V0VW5pZm9ybUxvY2F0aW9uRm9yTmFtZSgnbW91c2VfdG91Y2gnKSwgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlLngsIHRoaXMucGFyYW1ldGVycy5tb3VzZS55KTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDJmKHRoaXMuX3Byb2dyYW0uZ2V0VW5pZm9ybUxvY2F0aW9uRm9yTmFtZSgncmVzb2x1dGlvbicpLCB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbi54LCB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbi55KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjYy5zeXMuaXNOYXRpdmUpIHtcbiAgICAgICAgICAgIHZhciBnbFByb2dyYW1fc3RhdGUgPSBjYy5HTFByb2dyYW1TdGF0ZS5nZXRPckNyZWF0ZVdpdGhHTFByb2dyYW0odGhpcy5fcHJvZ3JhbSk7XG4gICAgICAgICAgICBnbFByb2dyYW1fc3RhdGUuc2V0VW5pZm9ybVZlYzIoXCJyZXNvbHV0aW9uXCIsIHRoaXMucGFyYW1ldGVycy5yZXNvbHV0aW9uKTtcbiAgICAgICAgICAgIGdsUHJvZ3JhbV9zdGF0ZS5zZXRVbmlmb3JtRmxvYXQoXCJ0aW1lXCIsIHRoaXMucGFyYW1ldGVycy50aW1lKTtcbiAgICAgICAgICAgIGdsUHJvZ3JhbV9zdGF0ZS5zZXRVbmlmb3JtVmVjMihcIm1vdXNlX3RvdWNoXCIsIHRoaXMucGFyYW1ldGVycy5tb3VzZSk7XG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgIHRoaXMuX3Jlc29sdXRpb24gPSB0aGlzLl9wcm9ncmFtLmdldFVuaWZvcm1Mb2NhdGlvbkZvck5hbWUoXCJyZXNvbHV0aW9uXCIpO1xuICAgICAgICAgICAgdGhpcy5fdGltZSA9IHRoaXMuX3Byb2dyYW0uZ2V0VW5pZm9ybUxvY2F0aW9uRm9yTmFtZShcInRpbWVcIik7XG4gICAgICAgICAgICB0aGlzLl9tb3VzZSA9IHRoaXMuX3Byb2dyYW0uZ2V0VW5pZm9ybUxvY2F0aW9uRm9yTmFtZShcIm1vdXNlX3RvdWNoXCIpO1xuXG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnNldFVuaWZvcm1Mb2NhdGlvbldpdGgyZih0aGlzLl9yZXNvbHV0aW9uLCB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbi54LCB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbi55KTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDFmKHRoaXMuX3RpbWUsIHRoaXMucGFyYW1ldGVycy50aW1lKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDJmKHRoaXMuX21vdXNlLCB0aGlzLnBhcmFtZXRlcnMubW91c2UueCwgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlLnkpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZXRQcm9ncmFtKHRoaXMubm9kZS5fc2dOb2RlLCB0aGlzLl9wcm9ncmFtKTtcbiAgICB9LFxuXG4gICAgc2V0UHJvZ3JhbTogZnVuY3Rpb24gc2V0UHJvZ3JhbShub2RlLCBwcm9ncmFtKSB7XG4gICAgICAgIGlmIChjYy5zeXMuaXNOYXRpdmUpIHtcbiAgICAgICAgICAgIHZhciBnbFByb2dyYW1fc3RhdGUgPSBjYy5HTFByb2dyYW1TdGF0ZS5nZXRPckNyZWF0ZVdpdGhHTFByb2dyYW0ocHJvZ3JhbSk7XG4gICAgICAgICAgICBub2RlLnNldEdMUHJvZ3JhbVN0YXRlKGdsUHJvZ3JhbV9zdGF0ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBub2RlLnNldFNoYWRlclByb2dyYW0ocHJvZ3JhbSk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgY2hpbGRyZW4gPSBub2RlLmNoaWxkcmVuO1xuICAgICAgICBpZiAoIWNoaWxkcmVuKSByZXR1cm47XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykgdGhpcy5zZXRQcm9ncmFtKGNoaWxkcmVuW2ldLCBwcm9ncmFtKTtcbiAgICB9XG5cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnOWQ1OTk2TXA5UkNGSkE5MXpSbTlCcjknLCAnRWZmZWN0MTYnKTtcbi8vIFNjcmlwdC9FZmZlY3QxNi5qc1xuXG52YXIgX2RlZmF1bHRfdmVydCA9IHJlcXVpcmUoXCIuLi9TaGFkZXJzL2NjU2hhZGVyX0RlZmF1bHRfVmVydC5qc1wiKTtcbnZhciBfZGVmYXVsdF92ZXJ0X25vX212cCA9IHJlcXVpcmUoXCIuLi9TaGFkZXJzL2NjU2hhZGVyX0RlZmF1bHRfVmVydF9ub01WUC5qc1wiKTtcbnZhciBfZ2xhc3NfZnJhZyA9IHJlcXVpcmUoXCIuLi9TaGFkZXJzL2NjU2hhZGVyX0VmZmVjdDA0X0ZyYWcuanNcIik7XG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBnbGFzc0ZhY3RvcjogMS4wXG4gICAgfSxcblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLnBhcmFtZXRlcnMgPSB7XG4gICAgICAgICAgICBzdGFydFRpbWU6IERhdGUubm93KCksXG4gICAgICAgICAgICB0aW1lOiAwLjAsXG4gICAgICAgICAgICBtb3VzZToge1xuICAgICAgICAgICAgICAgIHg6IDAuMCxcbiAgICAgICAgICAgICAgICB5OiAwLjBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZXNvbHV0aW9uOiB7XG4gICAgICAgICAgICAgICAgeDogMC4wLFxuICAgICAgICAgICAgICAgIHk6IDAuMFxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5NT1VTRV9NT1ZFLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIHRoaXMucGFyYW1ldGVycy5tb3VzZS54ID0gdGhpcy5ub2RlLmdldENvbnRlbnRTaXplKCkud2lkdGggLyBldmVudC5nZXRMb2NhdGlvblgoKTtcbiAgICAgICAgICAgIHRoaXMucGFyYW1ldGVycy5tb3VzZS55ID0gdGhpcy5ub2RlLmdldENvbnRlbnRTaXplKCkuaGVpZ2h0IC8gZXZlbnQuZ2V0TG9jYXRpb25ZKCk7XG4gICAgICAgIH0sIHRoaXMpO1xuXG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9NT1ZFLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIHRoaXMucGFyYW1ldGVycy5tb3VzZS54ID0gdGhpcy5ub2RlLmdldENvbnRlbnRTaXplKCkud2lkdGggLyBldmVudC5nZXRMb2NhdGlvblgoKTtcbiAgICAgICAgICAgIHRoaXMucGFyYW1ldGVycy5tb3VzZS55ID0gdGhpcy5ub2RlLmdldENvbnRlbnRTaXplKCkuaGVpZ2h0IC8gZXZlbnQuZ2V0TG9jYXRpb25ZKCk7XG4gICAgICAgIH0sIHRoaXMpO1xuXG4gICAgICAgIHRoaXMuX3VzZSgpO1xuICAgIH0sXG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoZHQpIHtcbiAgICAgICAgaWYgKHRoaXMuZ2xhc3NGYWN0b3IgPj0gNDApIHtcbiAgICAgICAgICAgIHRoaXMuZ2xhc3NGYWN0b3IgPSAwO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZ2xhc3NGYWN0b3IgKz0gZHQgKiAzO1xuXG4gICAgICAgIGlmICh0aGlzLl9wcm9ncmFtKSB7XG5cbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0udXNlKCk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUdMUGFyYW1ldGVycygpO1xuICAgICAgICAgICAgaWYgKGNjLnN5cy5pc05hdGl2ZSkge1xuICAgICAgICAgICAgICAgIHZhciBnbFByb2dyYW1fc3RhdGUgPSBjYy5HTFByb2dyYW1TdGF0ZS5nZXRPckNyZWF0ZVdpdGhHTFByb2dyYW0odGhpcy5fcHJvZ3JhbSk7XG4gICAgICAgICAgICAgICAgZ2xQcm9ncmFtX3N0YXRlLnNldFVuaWZvcm1WZWMyKFwicmVzb2x1dGlvblwiLCB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbik7XG4gICAgICAgICAgICAgICAgZ2xQcm9ncmFtX3N0YXRlLnNldFVuaWZvcm1GbG9hdChcInRpbWVcIiwgdGhpcy5wYXJhbWV0ZXJzLnRpbWUpO1xuICAgICAgICAgICAgICAgIGdsUHJvZ3JhbV9zdGF0ZS5zZXRVbmlmb3JtVmVjMihcIm1vdXNlX3RvdWNoXCIsIHRoaXMucGFyYW1ldGVycy5tb3VzZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDJmKHRoaXMuX3Jlc29sdXRpb24sIHRoaXMucGFyYW1ldGVycy5yZXNvbHV0aW9uLngsIHRoaXMucGFyYW1ldGVycy5yZXNvbHV0aW9uLnkpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDFmKHRoaXMuX3RpbWUsIHRoaXMucGFyYW1ldGVycy50aW1lKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnNldFVuaWZvcm1Mb2NhdGlvbldpdGgyZih0aGlzLl9tb3VzZSwgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlLngsIHRoaXMucGFyYW1ldGVycy5tb3VzZS54KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgdXBkYXRlR0xQYXJhbWV0ZXJzOiBmdW5jdGlvbiB1cGRhdGVHTFBhcmFtZXRlcnMoKSB7XG4gICAgICAgIHRoaXMucGFyYW1ldGVycy50aW1lID0gKERhdGUubm93KCkgLSB0aGlzLnBhcmFtZXRlcnMuc3RhcnRUaW1lKSAvIDEwMDA7XG4gICAgICAgIHRoaXMucGFyYW1ldGVycy5yZXNvbHV0aW9uLnggPSB0aGlzLm5vZGUuZ2V0Q29udGVudFNpemUoKS53aWR0aDtcbiAgICAgICAgdGhpcy5wYXJhbWV0ZXJzLnJlc29sdXRpb24ueSA9IHRoaXMubm9kZS5nZXRDb250ZW50U2l6ZSgpLmhlaWdodDtcbiAgICB9LFxuXG4gICAgX3VzZTogZnVuY3Rpb24gX3VzZSgpIHtcblxuICAgICAgICBpZiAoY2Muc3lzLmlzTmF0aXZlKSB7XG4gICAgICAgICAgICBjYy5sb2coXCJ1c2UgbmF0aXZlIEdMUHJvZ3JhbVwiKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0gPSBuZXcgY2MuR0xQcm9ncmFtKCk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmluaXRXaXRoU3RyaW5nKF9kZWZhdWx0X3ZlcnRfbm9fbXZwLCBfZ2xhc3NfZnJhZyk7XG5cbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uYWRkQXR0cmlidXRlKGNjLm1hY3JvLkFUVFJJQlVURV9OQU1FX1BPU0lUSU9OLCBjYy5tYWNyby5WRVJURVhfQVRUUklCX1BPU0lUSU9OKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uYWRkQXR0cmlidXRlKGNjLm1hY3JvLkFUVFJJQlVURV9OQU1FX0NPTE9SLCBjYy5tYWNyby5WRVJURVhfQVRUUklCX0NPTE9SKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uYWRkQXR0cmlidXRlKGNjLm1hY3JvLkFUVFJJQlVURV9OQU1FX1RFWF9DT09SRCwgY2MubWFjcm8uVkVSVEVYX0FUVFJJQl9URVhfQ09PUkRTKTtcblxuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5saW5rKCk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnVwZGF0ZVVuaWZvcm1zKCk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUdMUGFyYW1ldGVycygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbSA9IG5ldyBjYy5HTFByb2dyYW0oKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uaW5pdFdpdGhWZXJ0ZXhTaGFkZXJCeXRlQXJyYXkoX2RlZmF1bHRfdmVydCwgX2dsYXNzX2ZyYWcpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MubWFjcm8uQVRUUklCVVRFX05BTUVfUE9TSVRJT04sIGNjLm1hY3JvLlZFUlRFWF9BVFRSSUJfUE9TSVRJT04pO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MubWFjcm8uQVRUUklCVVRFX05BTUVfQ09MT1IsIGNjLm1hY3JvLlZFUlRFWF9BVFRSSUJfQ09MT1IpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MubWFjcm8uQVRUUklCVVRFX05BTUVfVEVYX0NPT1JELCBjYy5tYWNyby5WRVJURVhfQVRUUklCX1RFWF9DT09SRFMpO1xuXG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmxpbmsoKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0udXBkYXRlVW5pZm9ybXMoKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0udXNlKCk7XG5cbiAgICAgICAgICAgIHRoaXMudXBkYXRlR0xQYXJhbWV0ZXJzKCk7XG5cbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDFmKHRoaXMuX3Byb2dyYW0uZ2V0VW5pZm9ybUxvY2F0aW9uRm9yTmFtZSgndGltZScpLCB0aGlzLnBhcmFtZXRlcnMudGltZSk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnNldFVuaWZvcm1Mb2NhdGlvbldpdGgyZih0aGlzLl9wcm9ncmFtLmdldFVuaWZvcm1Mb2NhdGlvbkZvck5hbWUoJ21vdXNlX3RvdWNoJyksIHRoaXMucGFyYW1ldGVycy5tb3VzZS54LCB0aGlzLnBhcmFtZXRlcnMubW91c2UueSk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnNldFVuaWZvcm1Mb2NhdGlvbldpdGgyZih0aGlzLl9wcm9ncmFtLmdldFVuaWZvcm1Mb2NhdGlvbkZvck5hbWUoJ3Jlc29sdXRpb24nKSwgdGhpcy5wYXJhbWV0ZXJzLnJlc29sdXRpb24ueCwgdGhpcy5wYXJhbWV0ZXJzLnJlc29sdXRpb24ueSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY2Muc3lzLmlzTmF0aXZlKSB7XG4gICAgICAgICAgICB2YXIgZ2xQcm9ncmFtX3N0YXRlID0gY2MuR0xQcm9ncmFtU3RhdGUuZ2V0T3JDcmVhdGVXaXRoR0xQcm9ncmFtKHRoaXMuX3Byb2dyYW0pO1xuICAgICAgICAgICAgZ2xQcm9ncmFtX3N0YXRlLnNldFVuaWZvcm1WZWMyKFwicmVzb2x1dGlvblwiLCB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbik7XG4gICAgICAgICAgICBnbFByb2dyYW1fc3RhdGUuc2V0VW5pZm9ybUZsb2F0KFwidGltZVwiLCB0aGlzLnBhcmFtZXRlcnMudGltZSk7XG4gICAgICAgICAgICBnbFByb2dyYW1fc3RhdGUuc2V0VW5pZm9ybVZlYzIoXCJtb3VzZV90b3VjaFwiLCB0aGlzLnBhcmFtZXRlcnMubW91c2UpO1xuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICB0aGlzLl9yZXNvbHV0aW9uID0gdGhpcy5fcHJvZ3JhbS5nZXRVbmlmb3JtTG9jYXRpb25Gb3JOYW1lKFwicmVzb2x1dGlvblwiKTtcbiAgICAgICAgICAgIHRoaXMuX3RpbWUgPSB0aGlzLl9wcm9ncmFtLmdldFVuaWZvcm1Mb2NhdGlvbkZvck5hbWUoXCJ0aW1lXCIpO1xuICAgICAgICAgICAgdGhpcy5fbW91c2UgPSB0aGlzLl9wcm9ncmFtLmdldFVuaWZvcm1Mb2NhdGlvbkZvck5hbWUoXCJtb3VzZV90b3VjaFwiKTtcblxuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMmYodGhpcy5fcmVzb2x1dGlvbiwgdGhpcy5wYXJhbWV0ZXJzLnJlc29sdXRpb24ueCwgdGhpcy5wYXJhbWV0ZXJzLnJlc29sdXRpb24ueSk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnNldFVuaWZvcm1Mb2NhdGlvbldpdGgxZih0aGlzLl90aW1lLCB0aGlzLnBhcmFtZXRlcnMudGltZSk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnNldFVuaWZvcm1Mb2NhdGlvbldpdGgyZih0aGlzLl9tb3VzZSwgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlLngsIHRoaXMucGFyYW1ldGVycy5tb3VzZS55KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0UHJvZ3JhbSh0aGlzLm5vZGUuX3NnTm9kZSwgdGhpcy5fcHJvZ3JhbSk7XG4gICAgfSxcblxuICAgIHNldFByb2dyYW06IGZ1bmN0aW9uIHNldFByb2dyYW0obm9kZSwgcHJvZ3JhbSkge1xuICAgICAgICBpZiAoY2Muc3lzLmlzTmF0aXZlKSB7XG4gICAgICAgICAgICB2YXIgZ2xQcm9ncmFtX3N0YXRlID0gY2MuR0xQcm9ncmFtU3RhdGUuZ2V0T3JDcmVhdGVXaXRoR0xQcm9ncmFtKHByb2dyYW0pO1xuICAgICAgICAgICAgbm9kZS5zZXRHTFByb2dyYW1TdGF0ZShnbFByb2dyYW1fc3RhdGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbm9kZS5zZXRTaGFkZXJQcm9ncmFtKHByb2dyYW0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGNoaWxkcmVuID0gbm9kZS5jaGlsZHJlbjtcbiAgICAgICAgaWYgKCFjaGlsZHJlbikgcmV0dXJuO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHRoaXMuc2V0UHJvZ3JhbShjaGlsZHJlbltpXSwgcHJvZ3JhbSk7XG4gICAgfVxuXG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzg2MGE4bVkva2RNT0xRdjRSMVd2bmFQJywgJ0VmZmVjdDE3Jyk7XG4vLyBTY3JpcHQvRWZmZWN0MTcuanNcblxudmFyIF9kZWZhdWx0X3ZlcnQgPSByZXF1aXJlKFwiLi4vU2hhZGVycy9jY1NoYWRlcl9EZWZhdWx0X1ZlcnQuanNcIik7XG52YXIgX2RlZmF1bHRfdmVydF9ub19tdnAgPSByZXF1aXJlKFwiLi4vU2hhZGVycy9jY1NoYWRlcl9EZWZhdWx0X1ZlcnRfbm9NVlAuanNcIik7XG52YXIgX2dsYXNzX2ZyYWcgPSByZXF1aXJlKFwiLi4vU2hhZGVycy9jY1NoYWRlcl9FZmZlY3QwNF9GcmFnLmpzXCIpO1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgZ2xhc3NGYWN0b3I6IDEuMFxuICAgIH0sXG5cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5wYXJhbWV0ZXJzID0ge1xuICAgICAgICAgICAgc3RhcnRUaW1lOiBEYXRlLm5vdygpLFxuICAgICAgICAgICAgdGltZTogMC4wLFxuICAgICAgICAgICAgbW91c2U6IHtcbiAgICAgICAgICAgICAgICB4OiAwLjAsXG4gICAgICAgICAgICAgICAgeTogMC4wXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVzb2x1dGlvbjoge1xuICAgICAgICAgICAgICAgIHg6IDAuMCxcbiAgICAgICAgICAgICAgICB5OiAwLjBcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9O1xuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuTU9VU0VfTU9WRSwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICB0aGlzLnBhcmFtZXRlcnMubW91c2UueCA9IHRoaXMubm9kZS5nZXRDb250ZW50U2l6ZSgpLndpZHRoIC8gZXZlbnQuZ2V0TG9jYXRpb25YKCk7XG4gICAgICAgICAgICB0aGlzLnBhcmFtZXRlcnMubW91c2UueSA9IHRoaXMubm9kZS5nZXRDb250ZW50U2l6ZSgpLmhlaWdodCAvIGV2ZW50LmdldExvY2F0aW9uWSgpO1xuICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfTU9WRSwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICB0aGlzLnBhcmFtZXRlcnMubW91c2UueCA9IHRoaXMubm9kZS5nZXRDb250ZW50U2l6ZSgpLndpZHRoIC8gZXZlbnQuZ2V0TG9jYXRpb25YKCk7XG4gICAgICAgICAgICB0aGlzLnBhcmFtZXRlcnMubW91c2UueSA9IHRoaXMubm9kZS5nZXRDb250ZW50U2l6ZSgpLmhlaWdodCAvIGV2ZW50LmdldExvY2F0aW9uWSgpO1xuICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICB0aGlzLl91c2UoKTtcbiAgICB9LFxuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKGR0KSB7XG4gICAgICAgIGlmICh0aGlzLmdsYXNzRmFjdG9yID49IDQwKSB7XG4gICAgICAgICAgICB0aGlzLmdsYXNzRmFjdG9yID0gMDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmdsYXNzRmFjdG9yICs9IGR0ICogMztcblxuICAgICAgICBpZiAodGhpcy5fcHJvZ3JhbSkge1xuXG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnVzZSgpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVHTFBhcmFtZXRlcnMoKTtcbiAgICAgICAgICAgIGlmIChjYy5zeXMuaXNOYXRpdmUpIHtcbiAgICAgICAgICAgICAgICB2YXIgZ2xQcm9ncmFtX3N0YXRlID0gY2MuR0xQcm9ncmFtU3RhdGUuZ2V0T3JDcmVhdGVXaXRoR0xQcm9ncmFtKHRoaXMuX3Byb2dyYW0pO1xuICAgICAgICAgICAgICAgIGdsUHJvZ3JhbV9zdGF0ZS5zZXRVbmlmb3JtVmVjMihcInJlc29sdXRpb25cIiwgdGhpcy5wYXJhbWV0ZXJzLnJlc29sdXRpb24pO1xuICAgICAgICAgICAgICAgIGdsUHJvZ3JhbV9zdGF0ZS5zZXRVbmlmb3JtRmxvYXQoXCJ0aW1lXCIsIHRoaXMucGFyYW1ldGVycy50aW1lKTtcbiAgICAgICAgICAgICAgICBnbFByb2dyYW1fc3RhdGUuc2V0VW5pZm9ybVZlYzIoXCJtb3VzZV90b3VjaFwiLCB0aGlzLnBhcmFtZXRlcnMubW91c2UpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnNldFVuaWZvcm1Mb2NhdGlvbldpdGgyZih0aGlzLl9yZXNvbHV0aW9uLCB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbi54LCB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbi55KTtcbiAgICAgICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnNldFVuaWZvcm1Mb2NhdGlvbldpdGgxZih0aGlzLl90aW1lLCB0aGlzLnBhcmFtZXRlcnMudGltZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMmYodGhpcy5fbW91c2UsIHRoaXMucGFyYW1ldGVycy5tb3VzZS54LCB0aGlzLnBhcmFtZXRlcnMubW91c2UueCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHVwZGF0ZUdMUGFyYW1ldGVyczogZnVuY3Rpb24gdXBkYXRlR0xQYXJhbWV0ZXJzKCkge1xuICAgICAgICB0aGlzLnBhcmFtZXRlcnMudGltZSA9IChEYXRlLm5vdygpIC0gdGhpcy5wYXJhbWV0ZXJzLnN0YXJ0VGltZSkgLyAxMDAwO1xuICAgICAgICB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbi54ID0gdGhpcy5ub2RlLmdldENvbnRlbnRTaXplKCkud2lkdGg7XG4gICAgICAgIHRoaXMucGFyYW1ldGVycy5yZXNvbHV0aW9uLnkgPSB0aGlzLm5vZGUuZ2V0Q29udGVudFNpemUoKS5oZWlnaHQ7XG4gICAgfSxcblxuICAgIF91c2U6IGZ1bmN0aW9uIF91c2UoKSB7XG5cbiAgICAgICAgaWYgKGNjLnN5cy5pc05hdGl2ZSkge1xuICAgICAgICAgICAgY2MubG9nKFwidXNlIG5hdGl2ZSBHTFByb2dyYW1cIik7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtID0gbmV3IGNjLkdMUHJvZ3JhbSgpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5pbml0V2l0aFN0cmluZyhfZGVmYXVsdF92ZXJ0X25vX212cCwgX2dsYXNzX2ZyYWcpO1xuXG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5tYWNyby5BVFRSSUJVVEVfTkFNRV9QT1NJVElPTiwgY2MubWFjcm8uVkVSVEVYX0FUVFJJQl9QT1NJVElPTik7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5tYWNyby5BVFRSSUJVVEVfTkFNRV9DT0xPUiwgY2MubWFjcm8uVkVSVEVYX0FUVFJJQl9DT0xPUik7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5tYWNyby5BVFRSSUJVVEVfTkFNRV9URVhfQ09PUkQsIGNjLm1hY3JvLlZFUlRFWF9BVFRSSUJfVEVYX0NPT1JEUyk7XG5cbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0ubGluaygpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS51cGRhdGVVbmlmb3JtcygpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVHTFBhcmFtZXRlcnMoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0gPSBuZXcgY2MuR0xQcm9ncmFtKCk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmluaXRXaXRoVmVydGV4U2hhZGVyQnl0ZUFycmF5KF9kZWZhdWx0X3ZlcnQsIF9nbGFzc19mcmFnKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uYWRkQXR0cmlidXRlKGNjLm1hY3JvLkFUVFJJQlVURV9OQU1FX1BPU0lUSU9OLCBjYy5tYWNyby5WRVJURVhfQVRUUklCX1BPU0lUSU9OKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uYWRkQXR0cmlidXRlKGNjLm1hY3JvLkFUVFJJQlVURV9OQU1FX0NPTE9SLCBjYy5tYWNyby5WRVJURVhfQVRUUklCX0NPTE9SKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uYWRkQXR0cmlidXRlKGNjLm1hY3JvLkFUVFJJQlVURV9OQU1FX1RFWF9DT09SRCwgY2MubWFjcm8uVkVSVEVYX0FUVFJJQl9URVhfQ09PUkRTKTtcblxuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5saW5rKCk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnVwZGF0ZVVuaWZvcm1zKCk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnVzZSgpO1xuXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUdMUGFyYW1ldGVycygpO1xuXG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnNldFVuaWZvcm1Mb2NhdGlvbldpdGgxZih0aGlzLl9wcm9ncmFtLmdldFVuaWZvcm1Mb2NhdGlvbkZvck5hbWUoJ3RpbWUnKSwgdGhpcy5wYXJhbWV0ZXJzLnRpbWUpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMmYodGhpcy5fcHJvZ3JhbS5nZXRVbmlmb3JtTG9jYXRpb25Gb3JOYW1lKCdtb3VzZV90b3VjaCcpLCB0aGlzLnBhcmFtZXRlcnMubW91c2UueCwgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlLnkpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMmYodGhpcy5fcHJvZ3JhbS5nZXRVbmlmb3JtTG9jYXRpb25Gb3JOYW1lKCdyZXNvbHV0aW9uJyksIHRoaXMucGFyYW1ldGVycy5yZXNvbHV0aW9uLngsIHRoaXMucGFyYW1ldGVycy5yZXNvbHV0aW9uLnkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNjLnN5cy5pc05hdGl2ZSkge1xuICAgICAgICAgICAgdmFyIGdsUHJvZ3JhbV9zdGF0ZSA9IGNjLkdMUHJvZ3JhbVN0YXRlLmdldE9yQ3JlYXRlV2l0aEdMUHJvZ3JhbSh0aGlzLl9wcm9ncmFtKTtcbiAgICAgICAgICAgIGdsUHJvZ3JhbV9zdGF0ZS5zZXRVbmlmb3JtVmVjMihcInJlc29sdXRpb25cIiwgdGhpcy5wYXJhbWV0ZXJzLnJlc29sdXRpb24pO1xuICAgICAgICAgICAgZ2xQcm9ncmFtX3N0YXRlLnNldFVuaWZvcm1GbG9hdChcInRpbWVcIiwgdGhpcy5wYXJhbWV0ZXJzLnRpbWUpO1xuICAgICAgICAgICAgZ2xQcm9ncmFtX3N0YXRlLnNldFVuaWZvcm1WZWMyKFwibW91c2VfdG91Y2hcIiwgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlKTtcbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgdGhpcy5fcmVzb2x1dGlvbiA9IHRoaXMuX3Byb2dyYW0uZ2V0VW5pZm9ybUxvY2F0aW9uRm9yTmFtZShcInJlc29sdXRpb25cIik7XG4gICAgICAgICAgICB0aGlzLl90aW1lID0gdGhpcy5fcHJvZ3JhbS5nZXRVbmlmb3JtTG9jYXRpb25Gb3JOYW1lKFwidGltZVwiKTtcbiAgICAgICAgICAgIHRoaXMuX21vdXNlID0gdGhpcy5fcHJvZ3JhbS5nZXRVbmlmb3JtTG9jYXRpb25Gb3JOYW1lKFwibW91c2VfdG91Y2hcIik7XG5cbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDJmKHRoaXMuX3Jlc29sdXRpb24sIHRoaXMucGFyYW1ldGVycy5yZXNvbHV0aW9uLngsIHRoaXMucGFyYW1ldGVycy5yZXNvbHV0aW9uLnkpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMWYodGhpcy5fdGltZSwgdGhpcy5wYXJhbWV0ZXJzLnRpbWUpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMmYodGhpcy5fbW91c2UsIHRoaXMucGFyYW1ldGVycy5tb3VzZS54LCB0aGlzLnBhcmFtZXRlcnMubW91c2UueSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNldFByb2dyYW0odGhpcy5ub2RlLl9zZ05vZGUsIHRoaXMuX3Byb2dyYW0pO1xuICAgIH0sXG5cbiAgICBzZXRQcm9ncmFtOiBmdW5jdGlvbiBzZXRQcm9ncmFtKG5vZGUsIHByb2dyYW0pIHtcbiAgICAgICAgaWYgKGNjLnN5cy5pc05hdGl2ZSkge1xuICAgICAgICAgICAgdmFyIGdsUHJvZ3JhbV9zdGF0ZSA9IGNjLkdMUHJvZ3JhbVN0YXRlLmdldE9yQ3JlYXRlV2l0aEdMUHJvZ3JhbShwcm9ncmFtKTtcbiAgICAgICAgICAgIG5vZGUuc2V0R0xQcm9ncmFtU3RhdGUoZ2xQcm9ncmFtX3N0YXRlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5vZGUuc2V0U2hhZGVyUHJvZ3JhbShwcm9ncmFtKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBjaGlsZHJlbiA9IG5vZGUuY2hpbGRyZW47XG4gICAgICAgIGlmICghY2hpbGRyZW4pIHJldHVybjtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB0aGlzLnNldFByb2dyYW0oY2hpbGRyZW5baV0sIHByb2dyYW0pO1xuICAgIH1cblxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICdmZmQ2MVNRTERGUDFySWdNSGdFbUY0NycsICdFZmZlY3QxOCcpO1xuLy8gU2NyaXB0L0VmZmVjdDE4LmpzXG5cbnZhciBfZGVmYXVsdF92ZXJ0ID0gcmVxdWlyZShcIi4uL1NoYWRlcnMvY2NTaGFkZXJfRGVmYXVsdF9WZXJ0LmpzXCIpO1xudmFyIF9kZWZhdWx0X3ZlcnRfbm9fbXZwID0gcmVxdWlyZShcIi4uL1NoYWRlcnMvY2NTaGFkZXJfRGVmYXVsdF9WZXJ0X25vTVZQLmpzXCIpO1xudmFyIF9nbGFzc19mcmFnID0gcmVxdWlyZShcIi4uL1NoYWRlcnMvY2NTaGFkZXJfRWZmZWN0MDRfRnJhZy5qc1wiKTtcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGdsYXNzRmFjdG9yOiAxLjBcbiAgICB9LFxuXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHRoaXMucGFyYW1ldGVycyA9IHtcbiAgICAgICAgICAgIHN0YXJ0VGltZTogRGF0ZS5ub3coKSxcbiAgICAgICAgICAgIHRpbWU6IDAuMCxcbiAgICAgICAgICAgIG1vdXNlOiB7XG4gICAgICAgICAgICAgICAgeDogMC4wLFxuICAgICAgICAgICAgICAgIHk6IDAuMFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlc29sdXRpb246IHtcbiAgICAgICAgICAgICAgICB4OiAwLjAsXG4gICAgICAgICAgICAgICAgeTogMC4wXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLk1PVVNFX01PVkUsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlLnggPSB0aGlzLm5vZGUuZ2V0Q29udGVudFNpemUoKS53aWR0aCAvIGV2ZW50LmdldExvY2F0aW9uWCgpO1xuICAgICAgICAgICAgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlLnkgPSB0aGlzLm5vZGUuZ2V0Q29udGVudFNpemUoKS5oZWlnaHQgLyBldmVudC5nZXRMb2NhdGlvblkoKTtcbiAgICAgICAgfSwgdGhpcyk7XG5cbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX01PVkUsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlLnggPSB0aGlzLm5vZGUuZ2V0Q29udGVudFNpemUoKS53aWR0aCAvIGV2ZW50LmdldExvY2F0aW9uWCgpO1xuICAgICAgICAgICAgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlLnkgPSB0aGlzLm5vZGUuZ2V0Q29udGVudFNpemUoKS5oZWlnaHQgLyBldmVudC5nZXRMb2NhdGlvblkoKTtcbiAgICAgICAgfSwgdGhpcyk7XG5cbiAgICAgICAgdGhpcy5fdXNlKCk7XG4gICAgfSxcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShkdCkge1xuICAgICAgICBpZiAodGhpcy5nbGFzc0ZhY3RvciA+PSA0MCkge1xuICAgICAgICAgICAgdGhpcy5nbGFzc0ZhY3RvciA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5nbGFzc0ZhY3RvciArPSBkdCAqIDM7XG5cbiAgICAgICAgaWYgKHRoaXMuX3Byb2dyYW0pIHtcblxuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS51c2UoKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlR0xQYXJhbWV0ZXJzKCk7XG4gICAgICAgICAgICBpZiAoY2Muc3lzLmlzTmF0aXZlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGdsUHJvZ3JhbV9zdGF0ZSA9IGNjLkdMUHJvZ3JhbVN0YXRlLmdldE9yQ3JlYXRlV2l0aEdMUHJvZ3JhbSh0aGlzLl9wcm9ncmFtKTtcbiAgICAgICAgICAgICAgICBnbFByb2dyYW1fc3RhdGUuc2V0VW5pZm9ybVZlYzIoXCJyZXNvbHV0aW9uXCIsIHRoaXMucGFyYW1ldGVycy5yZXNvbHV0aW9uKTtcbiAgICAgICAgICAgICAgICBnbFByb2dyYW1fc3RhdGUuc2V0VW5pZm9ybUZsb2F0KFwidGltZVwiLCB0aGlzLnBhcmFtZXRlcnMudGltZSk7XG4gICAgICAgICAgICAgICAgZ2xQcm9ncmFtX3N0YXRlLnNldFVuaWZvcm1WZWMyKFwibW91c2VfdG91Y2hcIiwgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMmYodGhpcy5fcmVzb2x1dGlvbiwgdGhpcy5wYXJhbWV0ZXJzLnJlc29sdXRpb24ueCwgdGhpcy5wYXJhbWV0ZXJzLnJlc29sdXRpb24ueSk7XG4gICAgICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMWYodGhpcy5fdGltZSwgdGhpcy5wYXJhbWV0ZXJzLnRpbWUpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDJmKHRoaXMuX21vdXNlLCB0aGlzLnBhcmFtZXRlcnMubW91c2UueCwgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlLngpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICB1cGRhdGVHTFBhcmFtZXRlcnM6IGZ1bmN0aW9uIHVwZGF0ZUdMUGFyYW1ldGVycygpIHtcbiAgICAgICAgdGhpcy5wYXJhbWV0ZXJzLnRpbWUgPSAoRGF0ZS5ub3coKSAtIHRoaXMucGFyYW1ldGVycy5zdGFydFRpbWUpIC8gMTAwMDtcbiAgICAgICAgdGhpcy5wYXJhbWV0ZXJzLnJlc29sdXRpb24ueCA9IHRoaXMubm9kZS5nZXRDb250ZW50U2l6ZSgpLndpZHRoO1xuICAgICAgICB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbi55ID0gdGhpcy5ub2RlLmdldENvbnRlbnRTaXplKCkuaGVpZ2h0O1xuICAgIH0sXG5cbiAgICBfdXNlOiBmdW5jdGlvbiBfdXNlKCkge1xuXG4gICAgICAgIGlmIChjYy5zeXMuaXNOYXRpdmUpIHtcbiAgICAgICAgICAgIGNjLmxvZyhcInVzZSBuYXRpdmUgR0xQcm9ncmFtXCIpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbSA9IG5ldyBjYy5HTFByb2dyYW0oKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uaW5pdFdpdGhTdHJpbmcoX2RlZmF1bHRfdmVydF9ub19tdnAsIF9nbGFzc19mcmFnKTtcblxuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MubWFjcm8uQVRUUklCVVRFX05BTUVfUE9TSVRJT04sIGNjLm1hY3JvLlZFUlRFWF9BVFRSSUJfUE9TSVRJT04pO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MubWFjcm8uQVRUUklCVVRFX05BTUVfQ09MT1IsIGNjLm1hY3JvLlZFUlRFWF9BVFRSSUJfQ09MT1IpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MubWFjcm8uQVRUUklCVVRFX05BTUVfVEVYX0NPT1JELCBjYy5tYWNyby5WRVJURVhfQVRUUklCX1RFWF9DT09SRFMpO1xuXG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmxpbmsoKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0udXBkYXRlVW5pZm9ybXMoKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlR0xQYXJhbWV0ZXJzKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtID0gbmV3IGNjLkdMUHJvZ3JhbSgpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5pbml0V2l0aFZlcnRleFNoYWRlckJ5dGVBcnJheShfZGVmYXVsdF92ZXJ0LCBfZ2xhc3NfZnJhZyk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5tYWNyby5BVFRSSUJVVEVfTkFNRV9QT1NJVElPTiwgY2MubWFjcm8uVkVSVEVYX0FUVFJJQl9QT1NJVElPTik7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5tYWNyby5BVFRSSUJVVEVfTkFNRV9DT0xPUiwgY2MubWFjcm8uVkVSVEVYX0FUVFJJQl9DT0xPUik7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5tYWNyby5BVFRSSUJVVEVfTkFNRV9URVhfQ09PUkQsIGNjLm1hY3JvLlZFUlRFWF9BVFRSSUJfVEVYX0NPT1JEUyk7XG5cbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0ubGluaygpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS51cGRhdGVVbmlmb3JtcygpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS51c2UoKTtcblxuICAgICAgICAgICAgdGhpcy51cGRhdGVHTFBhcmFtZXRlcnMoKTtcblxuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMWYodGhpcy5fcHJvZ3JhbS5nZXRVbmlmb3JtTG9jYXRpb25Gb3JOYW1lKCd0aW1lJyksIHRoaXMucGFyYW1ldGVycy50aW1lKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDJmKHRoaXMuX3Byb2dyYW0uZ2V0VW5pZm9ybUxvY2F0aW9uRm9yTmFtZSgnbW91c2VfdG91Y2gnKSwgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlLngsIHRoaXMucGFyYW1ldGVycy5tb3VzZS55KTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDJmKHRoaXMuX3Byb2dyYW0uZ2V0VW5pZm9ybUxvY2F0aW9uRm9yTmFtZSgncmVzb2x1dGlvbicpLCB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbi54LCB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbi55KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjYy5zeXMuaXNOYXRpdmUpIHtcbiAgICAgICAgICAgIHZhciBnbFByb2dyYW1fc3RhdGUgPSBjYy5HTFByb2dyYW1TdGF0ZS5nZXRPckNyZWF0ZVdpdGhHTFByb2dyYW0odGhpcy5fcHJvZ3JhbSk7XG4gICAgICAgICAgICBnbFByb2dyYW1fc3RhdGUuc2V0VW5pZm9ybVZlYzIoXCJyZXNvbHV0aW9uXCIsIHRoaXMucGFyYW1ldGVycy5yZXNvbHV0aW9uKTtcbiAgICAgICAgICAgIGdsUHJvZ3JhbV9zdGF0ZS5zZXRVbmlmb3JtRmxvYXQoXCJ0aW1lXCIsIHRoaXMucGFyYW1ldGVycy50aW1lKTtcbiAgICAgICAgICAgIGdsUHJvZ3JhbV9zdGF0ZS5zZXRVbmlmb3JtVmVjMihcIm1vdXNlX3RvdWNoXCIsIHRoaXMucGFyYW1ldGVycy5tb3VzZSk7XG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgIHRoaXMuX3Jlc29sdXRpb24gPSB0aGlzLl9wcm9ncmFtLmdldFVuaWZvcm1Mb2NhdGlvbkZvck5hbWUoXCJyZXNvbHV0aW9uXCIpO1xuICAgICAgICAgICAgdGhpcy5fdGltZSA9IHRoaXMuX3Byb2dyYW0uZ2V0VW5pZm9ybUxvY2F0aW9uRm9yTmFtZShcInRpbWVcIik7XG4gICAgICAgICAgICB0aGlzLl9tb3VzZSA9IHRoaXMuX3Byb2dyYW0uZ2V0VW5pZm9ybUxvY2F0aW9uRm9yTmFtZShcIm1vdXNlX3RvdWNoXCIpO1xuXG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnNldFVuaWZvcm1Mb2NhdGlvbldpdGgyZih0aGlzLl9yZXNvbHV0aW9uLCB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbi54LCB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbi55KTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDFmKHRoaXMuX3RpbWUsIHRoaXMucGFyYW1ldGVycy50aW1lKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDJmKHRoaXMuX21vdXNlLCB0aGlzLnBhcmFtZXRlcnMubW91c2UueCwgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlLnkpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZXRQcm9ncmFtKHRoaXMubm9kZS5fc2dOb2RlLCB0aGlzLl9wcm9ncmFtKTtcbiAgICB9LFxuXG4gICAgc2V0UHJvZ3JhbTogZnVuY3Rpb24gc2V0UHJvZ3JhbShub2RlLCBwcm9ncmFtKSB7XG4gICAgICAgIGlmIChjYy5zeXMuaXNOYXRpdmUpIHtcbiAgICAgICAgICAgIHZhciBnbFByb2dyYW1fc3RhdGUgPSBjYy5HTFByb2dyYW1TdGF0ZS5nZXRPckNyZWF0ZVdpdGhHTFByb2dyYW0ocHJvZ3JhbSk7XG4gICAgICAgICAgICBub2RlLnNldEdMUHJvZ3JhbVN0YXRlKGdsUHJvZ3JhbV9zdGF0ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBub2RlLnNldFNoYWRlclByb2dyYW0ocHJvZ3JhbSk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgY2hpbGRyZW4gPSBub2RlLmNoaWxkcmVuO1xuICAgICAgICBpZiAoIWNoaWxkcmVuKSByZXR1cm47XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykgdGhpcy5zZXRQcm9ncmFtKGNoaWxkcmVuW2ldLCBwcm9ncmFtKTtcbiAgICB9XG5cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnYmVhNDU1VnBuOUtNSUY1TE1mS0tKQUYnLCAnRWZmZWN0MTknKTtcbi8vIFNjcmlwdC9FZmZlY3QxOS5qc1xuXG52YXIgX2RlZmF1bHRfdmVydCA9IHJlcXVpcmUoXCIuLi9TaGFkZXJzL2NjU2hhZGVyX0RlZmF1bHRfVmVydC5qc1wiKTtcbnZhciBfZGVmYXVsdF92ZXJ0X25vX212cCA9IHJlcXVpcmUoXCIuLi9TaGFkZXJzL2NjU2hhZGVyX0RlZmF1bHRfVmVydF9ub01WUC5qc1wiKTtcbnZhciBfZ2xhc3NfZnJhZyA9IHJlcXVpcmUoXCIuLi9TaGFkZXJzL2NjU2hhZGVyX0VmZmVjdDA0X0ZyYWcuanNcIik7XG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBnbGFzc0ZhY3RvcjogMS4wXG4gICAgfSxcblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLnBhcmFtZXRlcnMgPSB7XG4gICAgICAgICAgICBzdGFydFRpbWU6IERhdGUubm93KCksXG4gICAgICAgICAgICB0aW1lOiAwLjAsXG4gICAgICAgICAgICBtb3VzZToge1xuICAgICAgICAgICAgICAgIHg6IDAuMCxcbiAgICAgICAgICAgICAgICB5OiAwLjBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZXNvbHV0aW9uOiB7XG4gICAgICAgICAgICAgICAgeDogMC4wLFxuICAgICAgICAgICAgICAgIHk6IDAuMFxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5NT1VTRV9NT1ZFLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIHRoaXMucGFyYW1ldGVycy5tb3VzZS54ID0gdGhpcy5ub2RlLmdldENvbnRlbnRTaXplKCkud2lkdGggLyBldmVudC5nZXRMb2NhdGlvblgoKTtcbiAgICAgICAgICAgIHRoaXMucGFyYW1ldGVycy5tb3VzZS55ID0gdGhpcy5ub2RlLmdldENvbnRlbnRTaXplKCkuaGVpZ2h0IC8gZXZlbnQuZ2V0TG9jYXRpb25ZKCk7XG4gICAgICAgIH0sIHRoaXMpO1xuXG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9NT1ZFLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIHRoaXMucGFyYW1ldGVycy5tb3VzZS54ID0gdGhpcy5ub2RlLmdldENvbnRlbnRTaXplKCkud2lkdGggLyBldmVudC5nZXRMb2NhdGlvblgoKTtcbiAgICAgICAgICAgIHRoaXMucGFyYW1ldGVycy5tb3VzZS55ID0gdGhpcy5ub2RlLmdldENvbnRlbnRTaXplKCkuaGVpZ2h0IC8gZXZlbnQuZ2V0TG9jYXRpb25ZKCk7XG4gICAgICAgIH0sIHRoaXMpO1xuXG4gICAgICAgIHRoaXMuX3VzZSgpO1xuICAgIH0sXG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoZHQpIHtcbiAgICAgICAgaWYgKHRoaXMuZ2xhc3NGYWN0b3IgPj0gNDApIHtcbiAgICAgICAgICAgIHRoaXMuZ2xhc3NGYWN0b3IgPSAwO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZ2xhc3NGYWN0b3IgKz0gZHQgKiAzO1xuXG4gICAgICAgIGlmICh0aGlzLl9wcm9ncmFtKSB7XG5cbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0udXNlKCk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUdMUGFyYW1ldGVycygpO1xuICAgICAgICAgICAgaWYgKGNjLnN5cy5pc05hdGl2ZSkge1xuICAgICAgICAgICAgICAgIHZhciBnbFByb2dyYW1fc3RhdGUgPSBjYy5HTFByb2dyYW1TdGF0ZS5nZXRPckNyZWF0ZVdpdGhHTFByb2dyYW0odGhpcy5fcHJvZ3JhbSk7XG4gICAgICAgICAgICAgICAgZ2xQcm9ncmFtX3N0YXRlLnNldFVuaWZvcm1WZWMyKFwicmVzb2x1dGlvblwiLCB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbik7XG4gICAgICAgICAgICAgICAgZ2xQcm9ncmFtX3N0YXRlLnNldFVuaWZvcm1GbG9hdChcInRpbWVcIiwgdGhpcy5wYXJhbWV0ZXJzLnRpbWUpO1xuICAgICAgICAgICAgICAgIGdsUHJvZ3JhbV9zdGF0ZS5zZXRVbmlmb3JtVmVjMihcIm1vdXNlX3RvdWNoXCIsIHRoaXMucGFyYW1ldGVycy5tb3VzZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDJmKHRoaXMuX3Jlc29sdXRpb24sIHRoaXMucGFyYW1ldGVycy5yZXNvbHV0aW9uLngsIHRoaXMucGFyYW1ldGVycy5yZXNvbHV0aW9uLnkpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDFmKHRoaXMuX3RpbWUsIHRoaXMucGFyYW1ldGVycy50aW1lKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnNldFVuaWZvcm1Mb2NhdGlvbldpdGgyZih0aGlzLl9tb3VzZSwgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlLngsIHRoaXMucGFyYW1ldGVycy5tb3VzZS54KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgdXBkYXRlR0xQYXJhbWV0ZXJzOiBmdW5jdGlvbiB1cGRhdGVHTFBhcmFtZXRlcnMoKSB7XG4gICAgICAgIHRoaXMucGFyYW1ldGVycy50aW1lID0gKERhdGUubm93KCkgLSB0aGlzLnBhcmFtZXRlcnMuc3RhcnRUaW1lKSAvIDEwMDA7XG4gICAgICAgIHRoaXMucGFyYW1ldGVycy5yZXNvbHV0aW9uLnggPSB0aGlzLm5vZGUuZ2V0Q29udGVudFNpemUoKS53aWR0aDtcbiAgICAgICAgdGhpcy5wYXJhbWV0ZXJzLnJlc29sdXRpb24ueSA9IHRoaXMubm9kZS5nZXRDb250ZW50U2l6ZSgpLmhlaWdodDtcbiAgICB9LFxuXG4gICAgX3VzZTogZnVuY3Rpb24gX3VzZSgpIHtcblxuICAgICAgICBpZiAoY2Muc3lzLmlzTmF0aXZlKSB7XG4gICAgICAgICAgICBjYy5sb2coXCJ1c2UgbmF0aXZlIEdMUHJvZ3JhbVwiKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0gPSBuZXcgY2MuR0xQcm9ncmFtKCk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmluaXRXaXRoU3RyaW5nKF9kZWZhdWx0X3ZlcnRfbm9fbXZwLCBfZ2xhc3NfZnJhZyk7XG5cbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uYWRkQXR0cmlidXRlKGNjLm1hY3JvLkFUVFJJQlVURV9OQU1FX1BPU0lUSU9OLCBjYy5tYWNyby5WRVJURVhfQVRUUklCX1BPU0lUSU9OKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uYWRkQXR0cmlidXRlKGNjLm1hY3JvLkFUVFJJQlVURV9OQU1FX0NPTE9SLCBjYy5tYWNyby5WRVJURVhfQVRUUklCX0NPTE9SKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uYWRkQXR0cmlidXRlKGNjLm1hY3JvLkFUVFJJQlVURV9OQU1FX1RFWF9DT09SRCwgY2MubWFjcm8uVkVSVEVYX0FUVFJJQl9URVhfQ09PUkRTKTtcblxuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5saW5rKCk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnVwZGF0ZVVuaWZvcm1zKCk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUdMUGFyYW1ldGVycygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbSA9IG5ldyBjYy5HTFByb2dyYW0oKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uaW5pdFdpdGhWZXJ0ZXhTaGFkZXJCeXRlQXJyYXkoX2RlZmF1bHRfdmVydCwgX2dsYXNzX2ZyYWcpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MubWFjcm8uQVRUUklCVVRFX05BTUVfUE9TSVRJT04sIGNjLm1hY3JvLlZFUlRFWF9BVFRSSUJfUE9TSVRJT04pO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MubWFjcm8uQVRUUklCVVRFX05BTUVfQ09MT1IsIGNjLm1hY3JvLlZFUlRFWF9BVFRSSUJfQ09MT1IpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MubWFjcm8uQVRUUklCVVRFX05BTUVfVEVYX0NPT1JELCBjYy5tYWNyby5WRVJURVhfQVRUUklCX1RFWF9DT09SRFMpO1xuXG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmxpbmsoKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0udXBkYXRlVW5pZm9ybXMoKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0udXNlKCk7XG5cbiAgICAgICAgICAgIHRoaXMudXBkYXRlR0xQYXJhbWV0ZXJzKCk7XG5cbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDFmKHRoaXMuX3Byb2dyYW0uZ2V0VW5pZm9ybUxvY2F0aW9uRm9yTmFtZSgndGltZScpLCB0aGlzLnBhcmFtZXRlcnMudGltZSk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnNldFVuaWZvcm1Mb2NhdGlvbldpdGgyZih0aGlzLl9wcm9ncmFtLmdldFVuaWZvcm1Mb2NhdGlvbkZvck5hbWUoJ21vdXNlX3RvdWNoJyksIHRoaXMucGFyYW1ldGVycy5tb3VzZS54LCB0aGlzLnBhcmFtZXRlcnMubW91c2UueSk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnNldFVuaWZvcm1Mb2NhdGlvbldpdGgyZih0aGlzLl9wcm9ncmFtLmdldFVuaWZvcm1Mb2NhdGlvbkZvck5hbWUoJ3Jlc29sdXRpb24nKSwgdGhpcy5wYXJhbWV0ZXJzLnJlc29sdXRpb24ueCwgdGhpcy5wYXJhbWV0ZXJzLnJlc29sdXRpb24ueSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY2Muc3lzLmlzTmF0aXZlKSB7XG4gICAgICAgICAgICB2YXIgZ2xQcm9ncmFtX3N0YXRlID0gY2MuR0xQcm9ncmFtU3RhdGUuZ2V0T3JDcmVhdGVXaXRoR0xQcm9ncmFtKHRoaXMuX3Byb2dyYW0pO1xuICAgICAgICAgICAgZ2xQcm9ncmFtX3N0YXRlLnNldFVuaWZvcm1WZWMyKFwicmVzb2x1dGlvblwiLCB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbik7XG4gICAgICAgICAgICBnbFByb2dyYW1fc3RhdGUuc2V0VW5pZm9ybUZsb2F0KFwidGltZVwiLCB0aGlzLnBhcmFtZXRlcnMudGltZSk7XG4gICAgICAgICAgICBnbFByb2dyYW1fc3RhdGUuc2V0VW5pZm9ybVZlYzIoXCJtb3VzZV90b3VjaFwiLCB0aGlzLnBhcmFtZXRlcnMubW91c2UpO1xuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICB0aGlzLl9yZXNvbHV0aW9uID0gdGhpcy5fcHJvZ3JhbS5nZXRVbmlmb3JtTG9jYXRpb25Gb3JOYW1lKFwicmVzb2x1dGlvblwiKTtcbiAgICAgICAgICAgIHRoaXMuX3RpbWUgPSB0aGlzLl9wcm9ncmFtLmdldFVuaWZvcm1Mb2NhdGlvbkZvck5hbWUoXCJ0aW1lXCIpO1xuICAgICAgICAgICAgdGhpcy5fbW91c2UgPSB0aGlzLl9wcm9ncmFtLmdldFVuaWZvcm1Mb2NhdGlvbkZvck5hbWUoXCJtb3VzZV90b3VjaFwiKTtcblxuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMmYodGhpcy5fcmVzb2x1dGlvbiwgdGhpcy5wYXJhbWV0ZXJzLnJlc29sdXRpb24ueCwgdGhpcy5wYXJhbWV0ZXJzLnJlc29sdXRpb24ueSk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnNldFVuaWZvcm1Mb2NhdGlvbldpdGgxZih0aGlzLl90aW1lLCB0aGlzLnBhcmFtZXRlcnMudGltZSk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnNldFVuaWZvcm1Mb2NhdGlvbldpdGgyZih0aGlzLl9tb3VzZSwgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlLngsIHRoaXMucGFyYW1ldGVycy5tb3VzZS55KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0UHJvZ3JhbSh0aGlzLm5vZGUuX3NnTm9kZSwgdGhpcy5fcHJvZ3JhbSk7XG4gICAgfSxcblxuICAgIHNldFByb2dyYW06IGZ1bmN0aW9uIHNldFByb2dyYW0obm9kZSwgcHJvZ3JhbSkge1xuICAgICAgICBpZiAoY2Muc3lzLmlzTmF0aXZlKSB7XG4gICAgICAgICAgICB2YXIgZ2xQcm9ncmFtX3N0YXRlID0gY2MuR0xQcm9ncmFtU3RhdGUuZ2V0T3JDcmVhdGVXaXRoR0xQcm9ncmFtKHByb2dyYW0pO1xuICAgICAgICAgICAgbm9kZS5zZXRHTFByb2dyYW1TdGF0ZShnbFByb2dyYW1fc3RhdGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbm9kZS5zZXRTaGFkZXJQcm9ncmFtKHByb2dyYW0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGNoaWxkcmVuID0gbm9kZS5jaGlsZHJlbjtcbiAgICAgICAgaWYgKCFjaGlsZHJlbikgcmV0dXJuO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHRoaXMuc2V0UHJvZ3JhbShjaGlsZHJlbltpXSwgcHJvZ3JhbSk7XG4gICAgfVxuXG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzExN2NkdCtLNFZOcTd2SWdaVzR6czlrJywgJ0VmZmVjdDIwJyk7XG4vLyBTY3JpcHQvRWZmZWN0MjAuanNcblxudmFyIF9kZWZhdWx0X3ZlcnQgPSByZXF1aXJlKFwiLi4vU2hhZGVycy9jY1NoYWRlcl9EZWZhdWx0X1ZlcnQuanNcIik7XG52YXIgX2RlZmF1bHRfdmVydF9ub19tdnAgPSByZXF1aXJlKFwiLi4vU2hhZGVycy9jY1NoYWRlcl9EZWZhdWx0X1ZlcnRfbm9NVlAuanNcIik7XG52YXIgX2dsYXNzX2ZyYWcgPSByZXF1aXJlKFwiLi4vU2hhZGVycy9jY1NoYWRlcl9FZmZlY3QwNF9GcmFnLmpzXCIpO1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgZ2xhc3NGYWN0b3I6IDEuMFxuICAgIH0sXG5cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5wYXJhbWV0ZXJzID0ge1xuICAgICAgICAgICAgc3RhcnRUaW1lOiBEYXRlLm5vdygpLFxuICAgICAgICAgICAgdGltZTogMC4wLFxuICAgICAgICAgICAgbW91c2U6IHtcbiAgICAgICAgICAgICAgICB4OiAwLjAsXG4gICAgICAgICAgICAgICAgeTogMC4wXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVzb2x1dGlvbjoge1xuICAgICAgICAgICAgICAgIHg6IDAuMCxcbiAgICAgICAgICAgICAgICB5OiAwLjBcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9O1xuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuTU9VU0VfTU9WRSwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICB0aGlzLnBhcmFtZXRlcnMubW91c2UueCA9IHRoaXMubm9kZS5nZXRDb250ZW50U2l6ZSgpLndpZHRoIC8gZXZlbnQuZ2V0TG9jYXRpb25YKCk7XG4gICAgICAgICAgICB0aGlzLnBhcmFtZXRlcnMubW91c2UueSA9IHRoaXMubm9kZS5nZXRDb250ZW50U2l6ZSgpLmhlaWdodCAvIGV2ZW50LmdldExvY2F0aW9uWSgpO1xuICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfTU9WRSwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICB0aGlzLnBhcmFtZXRlcnMubW91c2UueCA9IHRoaXMubm9kZS5nZXRDb250ZW50U2l6ZSgpLndpZHRoIC8gZXZlbnQuZ2V0TG9jYXRpb25YKCk7XG4gICAgICAgICAgICB0aGlzLnBhcmFtZXRlcnMubW91c2UueSA9IHRoaXMubm9kZS5nZXRDb250ZW50U2l6ZSgpLmhlaWdodCAvIGV2ZW50LmdldExvY2F0aW9uWSgpO1xuICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICB0aGlzLl91c2UoKTtcbiAgICB9LFxuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKGR0KSB7XG4gICAgICAgIGlmICh0aGlzLmdsYXNzRmFjdG9yID49IDQwKSB7XG4gICAgICAgICAgICB0aGlzLmdsYXNzRmFjdG9yID0gMDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmdsYXNzRmFjdG9yICs9IGR0ICogMztcblxuICAgICAgICBpZiAodGhpcy5fcHJvZ3JhbSkge1xuXG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnVzZSgpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVHTFBhcmFtZXRlcnMoKTtcbiAgICAgICAgICAgIGlmIChjYy5zeXMuaXNOYXRpdmUpIHtcbiAgICAgICAgICAgICAgICB2YXIgZ2xQcm9ncmFtX3N0YXRlID0gY2MuR0xQcm9ncmFtU3RhdGUuZ2V0T3JDcmVhdGVXaXRoR0xQcm9ncmFtKHRoaXMuX3Byb2dyYW0pO1xuICAgICAgICAgICAgICAgIGdsUHJvZ3JhbV9zdGF0ZS5zZXRVbmlmb3JtVmVjMihcInJlc29sdXRpb25cIiwgdGhpcy5wYXJhbWV0ZXJzLnJlc29sdXRpb24pO1xuICAgICAgICAgICAgICAgIGdsUHJvZ3JhbV9zdGF0ZS5zZXRVbmlmb3JtRmxvYXQoXCJ0aW1lXCIsIHRoaXMucGFyYW1ldGVycy50aW1lKTtcbiAgICAgICAgICAgICAgICBnbFByb2dyYW1fc3RhdGUuc2V0VW5pZm9ybVZlYzIoXCJtb3VzZV90b3VjaFwiLCB0aGlzLnBhcmFtZXRlcnMubW91c2UpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnNldFVuaWZvcm1Mb2NhdGlvbldpdGgyZih0aGlzLl9yZXNvbHV0aW9uLCB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbi54LCB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbi55KTtcbiAgICAgICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnNldFVuaWZvcm1Mb2NhdGlvbldpdGgxZih0aGlzLl90aW1lLCB0aGlzLnBhcmFtZXRlcnMudGltZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMmYodGhpcy5fbW91c2UsIHRoaXMucGFyYW1ldGVycy5tb3VzZS54LCB0aGlzLnBhcmFtZXRlcnMubW91c2UueCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHVwZGF0ZUdMUGFyYW1ldGVyczogZnVuY3Rpb24gdXBkYXRlR0xQYXJhbWV0ZXJzKCkge1xuICAgICAgICB0aGlzLnBhcmFtZXRlcnMudGltZSA9IChEYXRlLm5vdygpIC0gdGhpcy5wYXJhbWV0ZXJzLnN0YXJ0VGltZSkgLyAxMDAwO1xuICAgICAgICB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbi54ID0gdGhpcy5ub2RlLmdldENvbnRlbnRTaXplKCkud2lkdGg7XG4gICAgICAgIHRoaXMucGFyYW1ldGVycy5yZXNvbHV0aW9uLnkgPSB0aGlzLm5vZGUuZ2V0Q29udGVudFNpemUoKS5oZWlnaHQ7XG4gICAgfSxcblxuICAgIF91c2U6IGZ1bmN0aW9uIF91c2UoKSB7XG5cbiAgICAgICAgaWYgKGNjLnN5cy5pc05hdGl2ZSkge1xuICAgICAgICAgICAgY2MubG9nKFwidXNlIG5hdGl2ZSBHTFByb2dyYW1cIik7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtID0gbmV3IGNjLkdMUHJvZ3JhbSgpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5pbml0V2l0aFN0cmluZyhfZGVmYXVsdF92ZXJ0X25vX212cCwgX2dsYXNzX2ZyYWcpO1xuXG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5tYWNyby5BVFRSSUJVVEVfTkFNRV9QT1NJVElPTiwgY2MubWFjcm8uVkVSVEVYX0FUVFJJQl9QT1NJVElPTik7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5tYWNyby5BVFRSSUJVVEVfTkFNRV9DT0xPUiwgY2MubWFjcm8uVkVSVEVYX0FUVFJJQl9DT0xPUik7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5tYWNyby5BVFRSSUJVVEVfTkFNRV9URVhfQ09PUkQsIGNjLm1hY3JvLlZFUlRFWF9BVFRSSUJfVEVYX0NPT1JEUyk7XG5cbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0ubGluaygpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS51cGRhdGVVbmlmb3JtcygpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVHTFBhcmFtZXRlcnMoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0gPSBuZXcgY2MuR0xQcm9ncmFtKCk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmluaXRXaXRoVmVydGV4U2hhZGVyQnl0ZUFycmF5KF9kZWZhdWx0X3ZlcnQsIF9nbGFzc19mcmFnKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uYWRkQXR0cmlidXRlKGNjLm1hY3JvLkFUVFJJQlVURV9OQU1FX1BPU0lUSU9OLCBjYy5tYWNyby5WRVJURVhfQVRUUklCX1BPU0lUSU9OKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uYWRkQXR0cmlidXRlKGNjLm1hY3JvLkFUVFJJQlVURV9OQU1FX0NPTE9SLCBjYy5tYWNyby5WRVJURVhfQVRUUklCX0NPTE9SKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uYWRkQXR0cmlidXRlKGNjLm1hY3JvLkFUVFJJQlVURV9OQU1FX1RFWF9DT09SRCwgY2MubWFjcm8uVkVSVEVYX0FUVFJJQl9URVhfQ09PUkRTKTtcblxuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5saW5rKCk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnVwZGF0ZVVuaWZvcm1zKCk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnVzZSgpO1xuXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUdMUGFyYW1ldGVycygpO1xuXG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnNldFVuaWZvcm1Mb2NhdGlvbldpdGgxZih0aGlzLl9wcm9ncmFtLmdldFVuaWZvcm1Mb2NhdGlvbkZvck5hbWUoJ3RpbWUnKSwgdGhpcy5wYXJhbWV0ZXJzLnRpbWUpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMmYodGhpcy5fcHJvZ3JhbS5nZXRVbmlmb3JtTG9jYXRpb25Gb3JOYW1lKCdtb3VzZV90b3VjaCcpLCB0aGlzLnBhcmFtZXRlcnMubW91c2UueCwgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlLnkpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMmYodGhpcy5fcHJvZ3JhbS5nZXRVbmlmb3JtTG9jYXRpb25Gb3JOYW1lKCdyZXNvbHV0aW9uJyksIHRoaXMucGFyYW1ldGVycy5yZXNvbHV0aW9uLngsIHRoaXMucGFyYW1ldGVycy5yZXNvbHV0aW9uLnkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNjLnN5cy5pc05hdGl2ZSkge1xuICAgICAgICAgICAgdmFyIGdsUHJvZ3JhbV9zdGF0ZSA9IGNjLkdMUHJvZ3JhbVN0YXRlLmdldE9yQ3JlYXRlV2l0aEdMUHJvZ3JhbSh0aGlzLl9wcm9ncmFtKTtcbiAgICAgICAgICAgIGdsUHJvZ3JhbV9zdGF0ZS5zZXRVbmlmb3JtVmVjMihcInJlc29sdXRpb25cIiwgdGhpcy5wYXJhbWV0ZXJzLnJlc29sdXRpb24pO1xuICAgICAgICAgICAgZ2xQcm9ncmFtX3N0YXRlLnNldFVuaWZvcm1GbG9hdChcInRpbWVcIiwgdGhpcy5wYXJhbWV0ZXJzLnRpbWUpO1xuICAgICAgICAgICAgZ2xQcm9ncmFtX3N0YXRlLnNldFVuaWZvcm1WZWMyKFwibW91c2VfdG91Y2hcIiwgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlKTtcbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgdGhpcy5fcmVzb2x1dGlvbiA9IHRoaXMuX3Byb2dyYW0uZ2V0VW5pZm9ybUxvY2F0aW9uRm9yTmFtZShcInJlc29sdXRpb25cIik7XG4gICAgICAgICAgICB0aGlzLl90aW1lID0gdGhpcy5fcHJvZ3JhbS5nZXRVbmlmb3JtTG9jYXRpb25Gb3JOYW1lKFwidGltZVwiKTtcbiAgICAgICAgICAgIHRoaXMuX21vdXNlID0gdGhpcy5fcHJvZ3JhbS5nZXRVbmlmb3JtTG9jYXRpb25Gb3JOYW1lKFwibW91c2VfdG91Y2hcIik7XG5cbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDJmKHRoaXMuX3Jlc29sdXRpb24sIHRoaXMucGFyYW1ldGVycy5yZXNvbHV0aW9uLngsIHRoaXMucGFyYW1ldGVycy5yZXNvbHV0aW9uLnkpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMWYodGhpcy5fdGltZSwgdGhpcy5wYXJhbWV0ZXJzLnRpbWUpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMmYodGhpcy5fbW91c2UsIHRoaXMucGFyYW1ldGVycy5tb3VzZS54LCB0aGlzLnBhcmFtZXRlcnMubW91c2UueSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNldFByb2dyYW0odGhpcy5ub2RlLl9zZ05vZGUsIHRoaXMuX3Byb2dyYW0pO1xuICAgIH0sXG5cbiAgICBzZXRQcm9ncmFtOiBmdW5jdGlvbiBzZXRQcm9ncmFtKG5vZGUsIHByb2dyYW0pIHtcbiAgICAgICAgaWYgKGNjLnN5cy5pc05hdGl2ZSkge1xuICAgICAgICAgICAgdmFyIGdsUHJvZ3JhbV9zdGF0ZSA9IGNjLkdMUHJvZ3JhbVN0YXRlLmdldE9yQ3JlYXRlV2l0aEdMUHJvZ3JhbShwcm9ncmFtKTtcbiAgICAgICAgICAgIG5vZGUuc2V0R0xQcm9ncmFtU3RhdGUoZ2xQcm9ncmFtX3N0YXRlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5vZGUuc2V0U2hhZGVyUHJvZ3JhbShwcm9ncmFtKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBjaGlsZHJlbiA9IG5vZGUuY2hpbGRyZW47XG4gICAgICAgIGlmICghY2hpbGRyZW4pIHJldHVybjtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB0aGlzLnNldFByb2dyYW0oY2hpbGRyZW5baV0sIHByb2dyYW0pO1xuICAgIH1cblxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc0ZTU3OWVzZUN4TmNKMFpsSk1Ld2ttdCcsICdFZmZlY3RDb21tb24nKTtcbi8vIFNjcmlwdC9FZmZlY3RDb21tb24uanNcblxudmFyIF9kZWZhdWx0X3ZlcnQgPSByZXF1aXJlKFwiLi4vU2hhZGVycy9jY1NoYWRlcl9EZWZhdWx0X1ZlcnQuanNcIik7XG52YXIgX2RlZmF1bHRfdmVydF9ub19tdnAgPSByZXF1aXJlKFwiLi4vU2hhZGVycy9jY1NoYWRlcl9EZWZhdWx0X1ZlcnRfbm9NVlAuanNcIik7XG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBnbGFzc0ZhY3RvcjogMS4wLFxuICAgICAgICBmbGFnU2hhZGVyOiBcIlwiLFxuICAgICAgICBmcmFnX2dsc2w6IHtcbiAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBcIkVmZmVjdDEwLmZzLmdsc2xcIixcbiAgICAgICAgICAgIHZpc2libGU6IGZhbHNlXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdGhpcy5wYXJhbWV0ZXJzID0ge1xuICAgICAgICAgICAgc3RhcnRUaW1lOiBEYXRlLm5vdygpLFxuICAgICAgICAgICAgdGltZTogMC4wLFxuICAgICAgICAgICAgbW91c2U6IHtcbiAgICAgICAgICAgICAgICB4OiAwLjAsXG4gICAgICAgICAgICAgICAgeTogMC4wXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVzb2x1dGlvbjoge1xuICAgICAgICAgICAgICAgIHg6IDAuMCxcbiAgICAgICAgICAgICAgICB5OiAwLjBcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9O1xuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuTU9VU0VfTU9WRSwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICB0aGlzLnBhcmFtZXRlcnMubW91c2UueCA9IHRoaXMubm9kZS5nZXRDb250ZW50U2l6ZSgpLndpZHRoIC8gZXZlbnQuZ2V0TG9jYXRpb25YKCk7XG4gICAgICAgICAgICB0aGlzLnBhcmFtZXRlcnMubW91c2UueSA9IHRoaXMubm9kZS5nZXRDb250ZW50U2l6ZSgpLmhlaWdodCAvIGV2ZW50LmdldExvY2F0aW9uWSgpO1xuICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfTU9WRSwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICB0aGlzLnBhcmFtZXRlcnMubW91c2UueCA9IHRoaXMubm9kZS5nZXRDb250ZW50U2l6ZSgpLndpZHRoIC8gZXZlbnQuZ2V0TG9jYXRpb25YKCk7XG4gICAgICAgICAgICB0aGlzLnBhcmFtZXRlcnMubW91c2UueSA9IHRoaXMubm9kZS5nZXRDb250ZW50U2l6ZSgpLmhlaWdodCAvIGV2ZW50LmdldExvY2F0aW9uWSgpO1xuICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICBjYy5sb2FkZXIubG9hZFJlcyhzZWxmLmZsYWdTaGFkZXIsIGZ1bmN0aW9uIChlcnIsIHR4dCkge1xuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgIGNjLmxvZyhlcnIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZWxmLmZyYWdfZ2xzbCA9IHR4dDtcbiAgICAgICAgICAgICAgICBzZWxmLl91c2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShkdCkge1xuICAgICAgICBpZiAodGhpcy5nbGFzc0ZhY3RvciA+PSA0MCkge1xuICAgICAgICAgICAgdGhpcy5nbGFzc0ZhY3RvciA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5nbGFzc0ZhY3RvciArPSBkdCAqIDM7XG5cbiAgICAgICAgaWYgKHRoaXMuX3Byb2dyYW0pIHtcblxuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS51c2UoKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlR0xQYXJhbWV0ZXJzKCk7XG4gICAgICAgICAgICBpZiAoY2Muc3lzLmlzTmF0aXZlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGdsUHJvZ3JhbV9zdGF0ZSA9IGNjLkdMUHJvZ3JhbVN0YXRlLmdldE9yQ3JlYXRlV2l0aEdMUHJvZ3JhbSh0aGlzLl9wcm9ncmFtKTtcbiAgICAgICAgICAgICAgICBnbFByb2dyYW1fc3RhdGUuc2V0VW5pZm9ybVZlYzIoXCJyZXNvbHV0aW9uXCIsIHRoaXMucGFyYW1ldGVycy5yZXNvbHV0aW9uKTtcbiAgICAgICAgICAgICAgICBnbFByb2dyYW1fc3RhdGUuc2V0VW5pZm9ybUZsb2F0KFwidGltZVwiLCB0aGlzLnBhcmFtZXRlcnMudGltZSk7XG4gICAgICAgICAgICAgICAgZ2xQcm9ncmFtX3N0YXRlLnNldFVuaWZvcm1WZWMyKFwibW91c2VcIiwgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMmYodGhpcy5fcmVzb2x1dGlvbiwgdGhpcy5wYXJhbWV0ZXJzLnJlc29sdXRpb24ueCwgdGhpcy5wYXJhbWV0ZXJzLnJlc29sdXRpb24ueSk7XG4gICAgICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMWYodGhpcy5fdGltZSwgdGhpcy5wYXJhbWV0ZXJzLnRpbWUpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDJmKHRoaXMuX21vdXNlLCB0aGlzLnBhcmFtZXRlcnMubW91c2UueCwgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlLngpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICB1cGRhdGVHTFBhcmFtZXRlcnM6IGZ1bmN0aW9uIHVwZGF0ZUdMUGFyYW1ldGVycygpIHtcbiAgICAgICAgdGhpcy5wYXJhbWV0ZXJzLnRpbWUgPSAoRGF0ZS5ub3coKSAtIHRoaXMucGFyYW1ldGVycy5zdGFydFRpbWUpIC8gMTAwMDtcbiAgICAgICAgdGhpcy5wYXJhbWV0ZXJzLnJlc29sdXRpb24ueCA9IHRoaXMubm9kZS5nZXRDb250ZW50U2l6ZSgpLndpZHRoO1xuICAgICAgICB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbi55ID0gdGhpcy5ub2RlLmdldENvbnRlbnRTaXplKCkuaGVpZ2h0O1xuICAgIH0sXG5cbiAgICBfdXNlOiBmdW5jdGlvbiBfdXNlKCkge1xuXG4gICAgICAgIGlmIChjYy5zeXMuaXNOYXRpdmUpIHtcbiAgICAgICAgICAgIGNjLmxvZyhcInVzZSBuYXRpdmUgR0xQcm9ncmFtXCIpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbSA9IG5ldyBjYy5HTFByb2dyYW0oKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uaW5pdFdpdGhTdHJpbmcoX2RlZmF1bHRfdmVydF9ub19tdnAsIHRoaXMuZnJhZ19nbHNsKTtcblxuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MubWFjcm8uQVRUUklCVVRFX05BTUVfUE9TSVRJT04sIGNjLm1hY3JvLlZFUlRFWF9BVFRSSUJfUE9TSVRJT04pO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MubWFjcm8uQVRUUklCVVRFX05BTUVfQ09MT1IsIGNjLm1hY3JvLlZFUlRFWF9BVFRSSUJfQ09MT1IpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MubWFjcm8uQVRUUklCVVRFX05BTUVfVEVYX0NPT1JELCBjYy5tYWNyby5WRVJURVhfQVRUUklCX1RFWF9DT09SRFMpO1xuXG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmxpbmsoKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0udXBkYXRlVW5pZm9ybXMoKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlR0xQYXJhbWV0ZXJzKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtID0gbmV3IGNjLkdMUHJvZ3JhbSgpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5pbml0V2l0aFZlcnRleFNoYWRlckJ5dGVBcnJheShfZGVmYXVsdF92ZXJ0LCB0aGlzLmZyYWdfZ2xzbCk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5tYWNyby5BVFRSSUJVVEVfTkFNRV9QT1NJVElPTiwgY2MubWFjcm8uVkVSVEVYX0FUVFJJQl9QT1NJVElPTik7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5tYWNyby5BVFRSSUJVVEVfTkFNRV9DT0xPUiwgY2MubWFjcm8uVkVSVEVYX0FUVFJJQl9DT0xPUik7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5tYWNyby5BVFRSSUJVVEVfTkFNRV9URVhfQ09PUkQsIGNjLm1hY3JvLlZFUlRFWF9BVFRSSUJfVEVYX0NPT1JEUyk7XG5cbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0ubGluaygpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS51cGRhdGVVbmlmb3JtcygpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS51c2UoKTtcblxuICAgICAgICAgICAgdGhpcy51cGRhdGVHTFBhcmFtZXRlcnMoKTtcblxuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMWYodGhpcy5fcHJvZ3JhbS5nZXRVbmlmb3JtTG9jYXRpb25Gb3JOYW1lKCd0aW1lJyksIHRoaXMucGFyYW1ldGVycy50aW1lKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDJmKHRoaXMuX3Byb2dyYW0uZ2V0VW5pZm9ybUxvY2F0aW9uRm9yTmFtZSgnbW91c2UnKSwgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlLngsIHRoaXMucGFyYW1ldGVycy5tb3VzZS55KTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDJmKHRoaXMuX3Byb2dyYW0uZ2V0VW5pZm9ybUxvY2F0aW9uRm9yTmFtZSgncmVzb2x1dGlvbicpLCB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbi54LCB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbi55KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjYy5zeXMuaXNOYXRpdmUpIHtcbiAgICAgICAgICAgIHZhciBnbFByb2dyYW1fc3RhdGUgPSBjYy5HTFByb2dyYW1TdGF0ZS5nZXRPckNyZWF0ZVdpdGhHTFByb2dyYW0odGhpcy5fcHJvZ3JhbSk7XG4gICAgICAgICAgICBnbFByb2dyYW1fc3RhdGUuc2V0VW5pZm9ybVZlYzIoXCJyZXNvbHV0aW9uXCIsIHRoaXMucGFyYW1ldGVycy5yZXNvbHV0aW9uKTtcbiAgICAgICAgICAgIGdsUHJvZ3JhbV9zdGF0ZS5zZXRVbmlmb3JtRmxvYXQoXCJ0aW1lXCIsIHRoaXMucGFyYW1ldGVycy50aW1lKTtcbiAgICAgICAgICAgIGdsUHJvZ3JhbV9zdGF0ZS5zZXRVbmlmb3JtVmVjMihcIm1vdXNlXCIsIHRoaXMucGFyYW1ldGVycy5tb3VzZSk7XG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgIHRoaXMuX3Jlc29sdXRpb24gPSB0aGlzLl9wcm9ncmFtLmdldFVuaWZvcm1Mb2NhdGlvbkZvck5hbWUoXCJyZXNvbHV0aW9uXCIpO1xuICAgICAgICAgICAgdGhpcy5fdGltZSA9IHRoaXMuX3Byb2dyYW0uZ2V0VW5pZm9ybUxvY2F0aW9uRm9yTmFtZShcInRpbWVcIik7XG4gICAgICAgICAgICB0aGlzLl9tb3VzZSA9IHRoaXMuX3Byb2dyYW0uZ2V0VW5pZm9ybUxvY2F0aW9uRm9yTmFtZShcIm1vdXNlXCIpO1xuXG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnNldFVuaWZvcm1Mb2NhdGlvbldpdGgyZih0aGlzLl9yZXNvbHV0aW9uLCB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbi54LCB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbi55KTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDFmKHRoaXMuX3RpbWUsIHRoaXMucGFyYW1ldGVycy50aW1lKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDJmKHRoaXMuX21vdXNlLCB0aGlzLnBhcmFtZXRlcnMubW91c2UueCwgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlLnkpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZXRQcm9ncmFtKHRoaXMubm9kZS5fc2dOb2RlLCB0aGlzLl9wcm9ncmFtKTtcbiAgICB9LFxuXG4gICAgc2V0UHJvZ3JhbTogZnVuY3Rpb24gc2V0UHJvZ3JhbShub2RlLCBwcm9ncmFtKSB7XG4gICAgICAgIGlmIChjYy5zeXMuaXNOYXRpdmUpIHtcbiAgICAgICAgICAgIHZhciBnbFByb2dyYW1fc3RhdGUgPSBjYy5HTFByb2dyYW1TdGF0ZS5nZXRPckNyZWF0ZVdpdGhHTFByb2dyYW0ocHJvZ3JhbSk7XG4gICAgICAgICAgICBub2RlLnNldEdMUHJvZ3JhbVN0YXRlKGdsUHJvZ3JhbV9zdGF0ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBub2RlLnNldFNoYWRlclByb2dyYW0ocHJvZ3JhbSk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgY2hpbGRyZW4gPSBub2RlLmNoaWxkcmVuO1xuICAgICAgICBpZiAoIWNoaWxkcmVuKSByZXR1cm47XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykgdGhpcy5zZXRQcm9ncmFtKGNoaWxkcmVuW2ldLCBwcm9ncmFtKTtcbiAgICB9XG5cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnZWMwYmRkejBFaEw0NWFCSnI0dDlRTHgnLCAnRWZmZWN0Rm9yU2hhZGVyVG95Jyk7XG4vLyBTY3JpcHQvRWZmZWN0Rm9yU2hhZGVyVG95LmpzXG5cbnZhciBfZGVmYXVsdF92ZXJ0ID0gcmVxdWlyZShcIi4uL1NoYWRlcnMvY2NTaGFkZXJfRGVmYXVsdF9WZXJ0LmpzXCIpO1xudmFyIF9kZWZhdWx0X3ZlcnRfbm9fbXZwID0gcmVxdWlyZShcIi4uL1NoYWRlcnMvY2NTaGFkZXJfRGVmYXVsdF9WZXJ0X25vTVZQLmpzXCIpO1xuXG4vKlxuXG5TaGFkZXIgSW5wdXRzXG51bmlmb3JtIHZlYzMgICAgICBpUmVzb2x1dGlvbjsgICAgICAgICAgIC8vIHZpZXdwb3J0IHJlc29sdXRpb24gKGluIHBpeGVscylcbnVuaWZvcm0gZmxvYXQgICAgIGlHbG9iYWxUaW1lOyAgICAgICAgICAgLy8gc2hhZGVyIHBsYXliYWNrIHRpbWUgKGluIHNlY29uZHMpXG51bmlmb3JtIGZsb2F0ICAgICBpVGltZURlbHRhOyAgICAgICAgICAgIC8vIHJlbmRlciB0aW1lIChpbiBzZWNvbmRzKVxudW5pZm9ybSBpbnQgICAgICAgaUZyYW1lOyAgICAgICAgICAgICAgICAvLyBzaGFkZXIgcGxheWJhY2sgZnJhbWVcbnVuaWZvcm0gZmxvYXQgICAgIGlDaGFubmVsVGltZVs0XTsgICAgICAgLy8gY2hhbm5lbCBwbGF5YmFjayB0aW1lIChpbiBzZWNvbmRzKVxudW5pZm9ybSB2ZWMzICAgICAgaUNoYW5uZWxSZXNvbHV0aW9uWzRdOyAvLyBjaGFubmVsIHJlc29sdXRpb24gKGluIHBpeGVscylcbnVuaWZvcm0gdmVjNCAgICAgIGlNb3VzZTsgICAgICAgICAgICAgICAgLy8gbW91c2UgcGl4ZWwgY29vcmRzLiB4eTogY3VycmVudCAoaWYgTUxCIGRvd24pLCB6dzogY2xpY2tcbnVuaWZvcm0gc2FtcGxlclhYIGlDaGFubmVsMC4uMzsgICAgICAgICAgLy8gaW5wdXQgY2hhbm5lbC4gWFggPSAyRC9DdWJlXG51bmlmb3JtIHZlYzQgICAgICBpRGF0ZTsgICAgICAgICAgICAgICAgIC8vICh5ZWFyLCBtb250aCwgZGF5LCB0aW1lIGluIHNlY29uZHMpXG51bmlmb3JtIGZsb2F0ICAgICBpU2FtcGxlUmF0ZTsgICAgICAgICAgIC8vIHNvdW5kIHNhbXBsZSByYXRlIChpLmUuLCA0NDEwMClcblxuKi9cblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGdsYXNzRmFjdG9yOiAxLjAsXG4gICAgICAgIGZsYWdTaGFkZXI6IFwiXCIsXG4gICAgICAgIGZyYWdfZ2xzbDoge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IFwiRWZmZWN0MTAuZnMuZ2xzbFwiLFxuICAgICAgICAgICAgdmlzaWJsZTogZmFsc2VcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgbm93ID0gbmV3IERhdGUoKTtcbiAgICAgICAgdGhpcy5wYXJhbWV0ZXJzID0ge1xuICAgICAgICAgICAgc3RhcnRUaW1lOiBEYXRlLm5vdygpLFxuICAgICAgICAgICAgdGltZTogMC4wLFxuICAgICAgICAgICAgbW91c2U6IHtcbiAgICAgICAgICAgICAgICB4OiAwLjAsXG4gICAgICAgICAgICAgICAgeTogMC4wLFxuICAgICAgICAgICAgICAgIHo6IDAuMCxcbiAgICAgICAgICAgICAgICB3OiAwLjBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZXNvbHV0aW9uOiB7XG4gICAgICAgICAgICAgICAgeDogMC4wLFxuICAgICAgICAgICAgICAgIHk6IDAuMCxcbiAgICAgICAgICAgICAgICB6OiAxLjBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkYXRlOiB7XG4gICAgICAgICAgICAgICAgeDogbm93LmdldFllYXIoKSwgLy95ZWFyXG4gICAgICAgICAgICAgICAgeTogbm93LmdldE1vbnRoKCksIC8vbW9udGhcbiAgICAgICAgICAgICAgICB6OiBub3cuZ2V0RGF0ZSgpLCAvL2RheVxuICAgICAgICAgICAgICAgIHc6IG5vdy5nZXRUaW1lKCkgKyBub3cuZ2V0TWlsbGlzZWNvbmRzKCkgLyAxMDAwIH0sXG4gICAgICAgICAgICAvL3RpbWUgc2Vjb25kc1xuICAgICAgICAgICAgaXNNb3VzZURvd246IGZhbHNlXG5cbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLk1PVVNFX0RPV04sIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgdGhpcy5wYXJhbWV0ZXJzLmlzTW91c2VEb3duID0gdHJ1ZTtcbiAgICAgICAgfSwgdGhpcyk7XG5cbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLk1PVVNFX1VQLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIHRoaXMucGFyYW1ldGVycy5pc01vdXNlRG93biA9IGZhbHNlO1xuICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuTU9VU0VfTEVBVkUsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgdGhpcy5wYXJhbWV0ZXJzLmlzTW91c2VEb3duID0gZmFsc2U7XG4gICAgICAgIH0sIHRoaXMpO1xuXG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9TVEFSVCwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICB0aGlzLnBhcmFtZXRlcnMuaXNNb3VzZURvd24gPSB0cnVlO1xuICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfRU5ELCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIHRoaXMucGFyYW1ldGVycy5pc01vdXNlRG93biA9IGZhbHNlO1xuICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfQ0FOQ0VMLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIHRoaXMucGFyYW1ldGVycy5pc01vdXNlRG93biA9IGZhbHNlO1xuICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuTU9VU0VfTU9WRSwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wYXJhbWV0ZXJzLmlzTW91c2VEb3duKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlLnggPSBldmVudC5nZXRMb2NhdGlvblgoKTtcbiAgICAgICAgICAgICAgICB0aGlzLnBhcmFtZXRlcnMubW91c2UueSA9IGV2ZW50LmdldExvY2F0aW9uWSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfTU9WRSwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wYXJhbWV0ZXJzLmlzTW91c2VEb3duKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlLnggPSBldmVudC5nZXRMb2NhdGlvblgoKTtcbiAgICAgICAgICAgICAgICB0aGlzLnBhcmFtZXRlcnMubW91c2UueSA9IGV2ZW50LmdldExvY2F0aW9uWSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICBjYy5sb2FkZXIubG9hZFJlcyhzZWxmLmZsYWdTaGFkZXIsIGZ1bmN0aW9uIChlcnIsIHR4dCkge1xuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgIGNjLmxvZyhlcnIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZWxmLmZyYWdfZ2xzbCA9IHR4dDtcbiAgICAgICAgICAgICAgICBzZWxmLl91c2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShkdCkge1xuICAgICAgICBpZiAodGhpcy5nbGFzc0ZhY3RvciA+PSA0MCkge1xuICAgICAgICAgICAgdGhpcy5nbGFzc0ZhY3RvciA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5nbGFzc0ZhY3RvciArPSBkdCAqIDM7XG5cbiAgICAgICAgaWYgKHRoaXMuX3Byb2dyYW0pIHtcblxuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS51c2UoKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlR0xQYXJhbWV0ZXJzKCk7XG4gICAgICAgICAgICBpZiAoY2Muc3lzLmlzTmF0aXZlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGdsUHJvZ3JhbV9zdGF0ZSA9IGNjLkdMUHJvZ3JhbVN0YXRlLmdldE9yQ3JlYXRlV2l0aEdMUHJvZ3JhbSh0aGlzLl9wcm9ncmFtKTtcbiAgICAgICAgICAgICAgICBnbFByb2dyYW1fc3RhdGUuc2V0VW5pZm9ybVZlYzMoXCJpUmVzb2x1dGlvblwiLCB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbik7XG4gICAgICAgICAgICAgICAgZ2xQcm9ncmFtX3N0YXRlLnNldFVuaWZvcm1GbG9hdChcImlHbG9iYWxUaW1lXCIsIHRoaXMucGFyYW1ldGVycy50aW1lKTtcbiAgICAgICAgICAgICAgICBnbFByb2dyYW1fc3RhdGUuc2V0VW5pZm9ybVZlYzQoXCJpTW91c2VcIiwgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlKTtcbiAgICAgICAgICAgICAgICBnbFByb2dyYW1fc3RhdGUuc2V0VW5pZm9ybVZlYzQoXCJpRGF0ZVwiLCB0aGlzLnBhcmFtZXRlcnMuZGF0ZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDNmKHRoaXMuX3Jlc29sdXRpb24sIHRoaXMucGFyYW1ldGVycy5yZXNvbHV0aW9uLngsIHRoaXMucGFyYW1ldGVycy5yZXNvbHV0aW9uLnksIHRoaXMucGFyYW1ldGVycy5yZXNvbHV0aW9uLnopO1xuICAgICAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDFmKHRoaXMuX3RpbWUsIHRoaXMucGFyYW1ldGVycy50aW1lKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnNldFVuaWZvcm1Mb2NhdGlvbldpdGg0Zih0aGlzLl9tb3VzZSwgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlLngsIHRoaXMucGFyYW1ldGVycy5tb3VzZS55LCB0aGlzLnBhcmFtZXRlcnMubW91c2UueiwgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlLncpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDRmKHRoaXMuX2RhdGUsIHRoaXMucGFyYW1ldGVycy5kYXRlLngsIHRoaXMucGFyYW1ldGVycy5kYXRlLnksIHRoaXMucGFyYW1ldGVycy5kYXRlLnosIHRoaXMucGFyYW1ldGVycy5kYXRlLncpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICB1cGRhdGVHTFBhcmFtZXRlcnM6IGZ1bmN0aW9uIHVwZGF0ZUdMUGFyYW1ldGVycygpIHtcbiAgICAgICAgdGhpcy5wYXJhbWV0ZXJzLnRpbWUgPSAoRGF0ZS5ub3coKSAtIHRoaXMucGFyYW1ldGVycy5zdGFydFRpbWUpIC8gMTAwMDtcbiAgICAgICAgdGhpcy5wYXJhbWV0ZXJzLnJlc29sdXRpb24ueCA9IHRoaXMubm9kZS5nZXRDb250ZW50U2l6ZSgpLndpZHRoO1xuICAgICAgICB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbi55ID0gdGhpcy5ub2RlLmdldENvbnRlbnRTaXplKCkuaGVpZ2h0O1xuICAgICAgICB2YXIgbm93ID0gbmV3IERhdGUoKTtcblxuICAgICAgICB0aGlzLnBhcmFtZXRlcnMuZGF0ZSA9IHtcbiAgICAgICAgICAgIHg6IG5vdy5nZXRZZWFyKCksIC8veWVhclxuICAgICAgICAgICAgeTogbm93LmdldE1vbnRoKCksIC8vbW9udGhcbiAgICAgICAgICAgIHo6IG5vdy5nZXREYXRlKCksIC8vZGF5XG4gICAgICAgICAgICB3OiBub3cuZ2V0VGltZSgpICsgbm93LmdldE1pbGxpc2Vjb25kcygpIC8gMTAwMCB9O1xuICAgIH0sXG5cbiAgICAvL3RpbWUgc2Vjb25kc1xuICAgIF91c2U6IGZ1bmN0aW9uIF91c2UoKSB7XG5cbiAgICAgICAgaWYgKGNjLnN5cy5pc05hdGl2ZSkge1xuICAgICAgICAgICAgY2MubG9nKFwidXNlIG5hdGl2ZSBHTFByb2dyYW1cIik7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtID0gbmV3IGNjLkdMUHJvZ3JhbSgpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5pbml0V2l0aFN0cmluZyhfZGVmYXVsdF92ZXJ0X25vX212cCwgdGhpcy5mcmFnX2dsc2wpO1xuXG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5tYWNyby5BVFRSSUJVVEVfTkFNRV9QT1NJVElPTiwgY2MubWFjcm8uVkVSVEVYX0FUVFJJQl9QT1NJVElPTik7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5tYWNyby5BVFRSSUJVVEVfTkFNRV9DT0xPUiwgY2MubWFjcm8uVkVSVEVYX0FUVFJJQl9DT0xPUik7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5tYWNyby5BVFRSSUJVVEVfTkFNRV9URVhfQ09PUkQsIGNjLm1hY3JvLlZFUlRFWF9BVFRSSUJfVEVYX0NPT1JEUyk7XG5cbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0ubGluaygpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS51cGRhdGVVbmlmb3JtcygpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVHTFBhcmFtZXRlcnMoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0gPSBuZXcgY2MuR0xQcm9ncmFtKCk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmluaXRXaXRoVmVydGV4U2hhZGVyQnl0ZUFycmF5KF9kZWZhdWx0X3ZlcnQsIHRoaXMuZnJhZ19nbHNsKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uYWRkQXR0cmlidXRlKGNjLm1hY3JvLkFUVFJJQlVURV9OQU1FX1BPU0lUSU9OLCBjYy5tYWNyby5WRVJURVhfQVRUUklCX1BPU0lUSU9OKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uYWRkQXR0cmlidXRlKGNjLm1hY3JvLkFUVFJJQlVURV9OQU1FX0NPTE9SLCBjYy5tYWNyby5WRVJURVhfQVRUUklCX0NPTE9SKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uYWRkQXR0cmlidXRlKGNjLm1hY3JvLkFUVFJJQlVURV9OQU1FX1RFWF9DT09SRCwgY2MubWFjcm8uVkVSVEVYX0FUVFJJQl9URVhfQ09PUkRTKTtcblxuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5saW5rKCk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnVwZGF0ZVVuaWZvcm1zKCk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnVzZSgpO1xuXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUdMUGFyYW1ldGVycygpO1xuXG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnNldFVuaWZvcm1Mb2NhdGlvbldpdGgzZih0aGlzLl9wcm9ncmFtLmdldFVuaWZvcm1Mb2NhdGlvbkZvck5hbWUoJ2lSZXNvbHV0aW9uJyksIHRoaXMucGFyYW1ldGVycy5yZXNvbHV0aW9uLngsIHRoaXMucGFyYW1ldGVycy5yZXNvbHV0aW9uLnksIHRoaXMucGFyYW1ldGVycy5yZXNvbHV0aW9uLnopO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMWYodGhpcy5fcHJvZ3JhbS5nZXRVbmlmb3JtTG9jYXRpb25Gb3JOYW1lKCdpR2xvYmFsVGltZScpLCB0aGlzLnBhcmFtZXRlcnMudGltZSk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnNldFVuaWZvcm1Mb2NhdGlvbldpdGg0Zih0aGlzLl9wcm9ncmFtLmdldFVuaWZvcm1Mb2NhdGlvbkZvck5hbWUoJ2lNb3VzZScpLCB0aGlzLnBhcmFtZXRlcnMubW91c2UueCwgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlLnksIHRoaXMucGFyYW1ldGVycy5tb3VzZS56LCB0aGlzLnBhcmFtZXRlcnMubW91c2Uudyk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnNldFVuaWZvcm1Mb2NhdGlvbldpdGg0Zih0aGlzLl9wcm9ncmFtLmdldFVuaWZvcm1Mb2NhdGlvbkZvck5hbWUoJ2lEYXRlJyksIHRoaXMucGFyYW1ldGVycy5kYXRlLngsIHRoaXMucGFyYW1ldGVycy5kYXRlLnksIHRoaXMucGFyYW1ldGVycy5kYXRlLnosIHRoaXMucGFyYW1ldGVycy5kYXRlLncpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNjLnN5cy5pc05hdGl2ZSkge1xuICAgICAgICAgICAgdmFyIGdsUHJvZ3JhbV9zdGF0ZSA9IGNjLkdMUHJvZ3JhbVN0YXRlLmdldE9yQ3JlYXRlV2l0aEdMUHJvZ3JhbSh0aGlzLl9wcm9ncmFtKTtcbiAgICAgICAgICAgIGdsUHJvZ3JhbV9zdGF0ZS5zZXRVbmlmb3JtVmVjMyhcImlSZXNvbHV0aW9uXCIsIHRoaXMucGFyYW1ldGVycy5yZXNvbHV0aW9uKTtcbiAgICAgICAgICAgIGdsUHJvZ3JhbV9zdGF0ZS5zZXRVbmlmb3JtRmxvYXQoXCJpR2xvYmFsVGltZVwiLCB0aGlzLnBhcmFtZXRlcnMudGltZSk7XG4gICAgICAgICAgICBnbFByb2dyYW1fc3RhdGUuc2V0VW5pZm9ybVZlYzQoXCJpTW91c2VcIiwgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlKTtcbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgdGhpcy5fcmVzb2x1dGlvbiA9IHRoaXMuX3Byb2dyYW0uZ2V0VW5pZm9ybUxvY2F0aW9uRm9yTmFtZShcImlSZXNvbHV0aW9uXCIpO1xuICAgICAgICAgICAgdGhpcy5fdGltZSA9IHRoaXMuX3Byb2dyYW0uZ2V0VW5pZm9ybUxvY2F0aW9uRm9yTmFtZShcImlHbG9iYWxUaW1lXCIpO1xuICAgICAgICAgICAgdGhpcy5fbW91c2UgPSB0aGlzLl9wcm9ncmFtLmdldFVuaWZvcm1Mb2NhdGlvbkZvck5hbWUoXCJpTW91c2VcIik7XG5cbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDNmKHRoaXMuX3Jlc29sdXRpb24sIHRoaXMucGFyYW1ldGVycy5yZXNvbHV0aW9uLngsIHRoaXMucGFyYW1ldGVycy5yZXNvbHV0aW9uLnksIHRoaXMucGFyYW1ldGVycy5yZXNvbHV0aW9uLnopO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMWYodGhpcy5fdGltZSwgdGhpcy5wYXJhbWV0ZXJzLnRpbWUpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoNGYodGhpcy5fbW91c2UsIHRoaXMucGFyYW1ldGVycy5tb3VzZS54LCB0aGlzLnBhcmFtZXRlcnMubW91c2UueSwgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlLnosIHRoaXMucGFyYW1ldGVycy5tb3VzZS53KTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDRmKHRoaXMuX2RhdGUsIHRoaXMucGFyYW1ldGVycy5kYXRlLngsIHRoaXMucGFyYW1ldGVycy5kYXRlLnksIHRoaXMucGFyYW1ldGVycy5kYXRlLnosIHRoaXMucGFyYW1ldGVycy5kYXRlLncpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZXRQcm9ncmFtKHRoaXMubm9kZS5fc2dOb2RlLCB0aGlzLl9wcm9ncmFtKTtcbiAgICB9LFxuXG4gICAgc2V0UHJvZ3JhbTogZnVuY3Rpb24gc2V0UHJvZ3JhbShub2RlLCBwcm9ncmFtKSB7XG4gICAgICAgIGlmIChjYy5zeXMuaXNOYXRpdmUpIHtcbiAgICAgICAgICAgIHZhciBnbFByb2dyYW1fc3RhdGUgPSBjYy5HTFByb2dyYW1TdGF0ZS5nZXRPckNyZWF0ZVdpdGhHTFByb2dyYW0ocHJvZ3JhbSk7XG4gICAgICAgICAgICBub2RlLnNldEdMUHJvZ3JhbVN0YXRlKGdsUHJvZ3JhbV9zdGF0ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBub2RlLnNldFNoYWRlclByb2dyYW0ocHJvZ3JhbSk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgY2hpbGRyZW4gPSBub2RlLmNoaWxkcmVuO1xuICAgICAgICBpZiAoIWNoaWxkcmVuKSByZXR1cm47XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykgdGhpcy5zZXRQcm9ncmFtKGNoaWxkcmVuW2ldLCBwcm9ncmFtKTtcbiAgICB9XG5cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnMTBiOGNObnJvNU4wcVVHNzVnSHQxOTMnLCAnRWZmZWN0TWFuYWdlcicpO1xuLy8gU2NyaXB0L1VJL0VmZmVjdE1hbmFnZXIuanNcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGxhc3RTY2VuZU5hbWU6IFwiU2hhZGVyXCIsXG4gICAgICAgIG5leHRTY2VuZU5hbWU6IFwiRWZmZWN0MDFcIlxuXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICBpZiAoIXdpbmRvdy5jdXJMZXZlbElkKSB7XG4gICAgICAgICAgICB3aW5kb3cuY3VyTGV2ZWxJZCA9IDE7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGdldEN1ckxldmVsTmFtZTogZnVuY3Rpb24gZ2V0Q3VyTGV2ZWxOYW1lKCkge1xuICAgICAgICB2YXIgbGV2ZWxOYW1lID0gXCJFZmZlY3RcIjtcbiAgICAgICAgbGV2ZWxOYW1lICs9IHdpbmRvdy5jdXJMZXZlbElkIDwgMTAgPyBcIjBcIiArIHdpbmRvdy5jdXJMZXZlbElkIDogd2luZG93LmN1ckxldmVsSWQ7XG4gICAgICAgIHJldHVybiBsZXZlbE5hbWU7XG4gICAgfSxcbiAgICBvbkNsaWNrTmV4dDogZnVuY3Rpb24gb25DbGlja05leHQoKSB7XG4gICAgICAgIHdpbmRvdy5jdXJMZXZlbElkKys7XG4gICAgICAgIGlmICh3aW5kb3cuY3VyTGV2ZWxJZCA+IDE1MCkge1xuICAgICAgICAgICAgd2luZG93LmN1ckxldmVsSWQgPSAxO1xuICAgICAgICB9XG4gICAgICAgIGNjLmRpcmVjdG9yLmxvYWRTY2VuZSh0aGlzLmdldEN1ckxldmVsTmFtZSgpKTtcbiAgICB9LFxuICAgIG9uQ2xpY2tMYXN0OiBmdW5jdGlvbiBvbkNsaWNrTGFzdCgpIHtcbiAgICAgICAgd2luZG93LmN1ckxldmVsSWQtLTtcbiAgICAgICAgaWYgKHdpbmRvdy5jdXJMZXZlbElkIDw9IDEpIHtcbiAgICAgICAgICAgIHdpbmRvdy5jdXJMZXZlbElkID0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNjLmRpcmVjdG9yLmxvYWRTY2VuZSh0aGlzLmdldEN1ckxldmVsTmFtZSgpKTtcbiAgICB9LFxuICAgIG9uQ2xpY2tUb0dpdEh1YjogZnVuY3Rpb24gb25DbGlja1RvR2l0SHViKCkge1xuICAgICAgICB3aW5kb3cub3BlbihcImh0dHA6Ly9mb3J1bS5jb2Nvcy5jb20vdC9jcmVhdG9yLXNoYWRlci8zNjM4OFwiKTtcbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzk1Y2Y4blo4UEpLYjdGWTZXbnV5VGIvJywgJ0VmZmVjdCcpO1xuLy8gU2NyaXB0L0VmZmVjdC5qc1xuXG52YXIgX2RlZmF1bHRfdmVydCA9IHJlcXVpcmUoXCIuLi9TaGFkZXJzL2NjU2hhZGVyX0RlZmF1bHRfVmVydC5qc1wiKTtcbnZhciBfZGVmYXVsdF92ZXJ0X25vX212cCA9IHJlcXVpcmUoXCIuLi9TaGFkZXJzL2NjU2hhZGVyX0RlZmF1bHRfVmVydF9ub01WUC5qc1wiKTtcbnZhciBfZ2xhc3NfZnJhZyA9IHJlcXVpcmUoXCIuLi9TaGFkZXJzL2NjU2hhZGVyX0VmZmVjdDA0X0ZyYWcuanNcIik7XG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBnbGFzc0ZhY3RvcjogMS4wLFxuICAgICAgICBmbGFnU2hhZGVyOiBcInByZWNpc2lvbiBtZWRpdW1wIGZsb2F0OyB1bmlmb3JtIGZsb2F0IHRpbWU7IHVuaWZvcm0gdmVjMiBtb3VzZTsgdW5pZm9ybSB2ZWMyIHJlc29sdXRpb247IGNvbnN0IGludCBudW1CbG9icyA9IDEyODsgdm9pZCBtYWluKCB2b2lkICkgeyAgICAgdmVjMiBwID0gKGdsX0ZyYWdDb29yZC54eSAvIHJlc29sdXRpb24ueCkgLSB2ZWMyKDAuNSwgMC41ICogKHJlc29sdXRpb24ueSAvIHJlc29sdXRpb24ueCkpOyAgICAgdmVjMyBjID0gdmVjMygwLjApOyAgICAgZm9yIChpbnQgaT0wOyBpPG51bUJsb2JzOyBpKyspICB7ICAgICAgIGZsb2F0IHB4ID0gc2luKGZsb2F0KGkpKjAuMSArIDAuNSkgKiAwLjQ7ICAgICAgIGZsb2F0IHB5ID0gc2luKGZsb2F0KGkqaSkqMC4wMSArIDAuNCp0aW1lKSAqIDAuMjsgICAgICAgZmxvYXQgcHogPSBzaW4oZmxvYXQoaSppKmkpKjAuMDAxICsgMC4zKnRpbWUpICogMC4zICsgMC40OyAgICAgIGZsb2F0IHJhZGl1cyA9IDAuMDA1IC8gcHo7ICAgICAgdmVjMiBwb3MgPSBwICsgdmVjMihweCwgcHkpOyAgICAgICAgZmxvYXQgeiA9IHJhZGl1cyAtIGxlbmd0aChwb3MpOyAgICAgICAgIGlmICh6IDwgMC4wKSB6ID0gMC4wOyAgICAgICBmbG9hdCBjYyA9IHogLyByYWRpdXM7ICAgICAgYyArPSB2ZWMzKGNjICogKHNpbihmbG9hdChpKmkqaSkpICogMC41ICsgMC41KSwgY2MgKiAoc2luKGZsb2F0KGkqaSppKmkqaSkpICogMC41ICsgMC41KSwgY2MgKiAoc2luKGZsb2F0KGkqaSppKmkpKSAqIDAuNSArIDAuNSkpOyAgfSAgIGdsX0ZyYWdDb2xvciA9IHZlYzQoYy54K3AueSwgYy55K3AueSwgYy56K3AueSwgMS4wKTsgfVwiXG4gICAgfSxcblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLnBhcmFtZXRlcnMgPSB7XG4gICAgICAgICAgICBzdGFydFRpbWU6IERhdGUubm93KCksXG4gICAgICAgICAgICB0aW1lOiAwLjAsXG4gICAgICAgICAgICBtb3VzZToge1xuICAgICAgICAgICAgICAgIHg6IDAuMCxcbiAgICAgICAgICAgICAgICB5OiAwLjBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZXNvbHV0aW9uOiB7XG4gICAgICAgICAgICAgICAgeDogMC4wLFxuICAgICAgICAgICAgICAgIHk6IDAuMFxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5NT1VTRV9NT1ZFLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIHRoaXMucGFyYW1ldGVycy5tb3VzZS54ID0gdGhpcy5ub2RlLmdldENvbnRlbnRTaXplKCkud2lkdGggLyBldmVudC5nZXRMb2NhdGlvblgoKTtcbiAgICAgICAgICAgIHRoaXMucGFyYW1ldGVycy5tb3VzZS55ID0gdGhpcy5ub2RlLmdldENvbnRlbnRTaXplKCkuaGVpZ2h0IC8gZXZlbnQuZ2V0TG9jYXRpb25ZKCk7XG4gICAgICAgIH0sIHRoaXMpO1xuXG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9NT1ZFLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIHRoaXMucGFyYW1ldGVycy5tb3VzZS54ID0gdGhpcy5ub2RlLmdldENvbnRlbnRTaXplKCkud2lkdGggLyBldmVudC5nZXRMb2NhdGlvblgoKTtcbiAgICAgICAgICAgIHRoaXMucGFyYW1ldGVycy5tb3VzZS55ID0gdGhpcy5ub2RlLmdldENvbnRlbnRTaXplKCkuaGVpZ2h0IC8gZXZlbnQuZ2V0TG9jYXRpb25ZKCk7XG4gICAgICAgIH0sIHRoaXMpO1xuXG4gICAgICAgIHRoaXMuX3VzZSgpO1xuICAgIH0sXG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoZHQpIHtcbiAgICAgICAgaWYgKHRoaXMuZ2xhc3NGYWN0b3IgPj0gNDApIHtcbiAgICAgICAgICAgIHRoaXMuZ2xhc3NGYWN0b3IgPSAwO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZ2xhc3NGYWN0b3IgKz0gZHQgKiAzO1xuXG4gICAgICAgIGlmICh0aGlzLl9wcm9ncmFtKSB7XG5cbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0udXNlKCk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUdMUGFyYW1ldGVycygpO1xuICAgICAgICAgICAgaWYgKGNjLnN5cy5pc05hdGl2ZSkge1xuICAgICAgICAgICAgICAgIHZhciBnbFByb2dyYW1fc3RhdGUgPSBjYy5HTFByb2dyYW1TdGF0ZS5nZXRPckNyZWF0ZVdpdGhHTFByb2dyYW0odGhpcy5fcHJvZ3JhbSk7XG4gICAgICAgICAgICAgICAgZ2xQcm9ncmFtX3N0YXRlLnNldFVuaWZvcm1WZWMyKFwicmVzb2x1dGlvblwiLCB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbik7XG4gICAgICAgICAgICAgICAgZ2xQcm9ncmFtX3N0YXRlLnNldFVuaWZvcm1GbG9hdChcInRpbWVcIiwgdGhpcy5wYXJhbWV0ZXJzLnRpbWUpO1xuICAgICAgICAgICAgICAgIGdsUHJvZ3JhbV9zdGF0ZS5zZXRVbmlmb3JtVmVjMihcIm1vdXNlX3RvdWNoXCIsIHRoaXMucGFyYW1ldGVycy5tb3VzZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDJmKHRoaXMuX3Jlc29sdXRpb24sIHRoaXMucGFyYW1ldGVycy5yZXNvbHV0aW9uLngsIHRoaXMucGFyYW1ldGVycy5yZXNvbHV0aW9uLnkpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDFmKHRoaXMuX3RpbWUsIHRoaXMucGFyYW1ldGVycy50aW1lKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnNldFVuaWZvcm1Mb2NhdGlvbldpdGgyZih0aGlzLl9tb3VzZSwgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlLngsIHRoaXMucGFyYW1ldGVycy5tb3VzZS54KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgdXBkYXRlR0xQYXJhbWV0ZXJzOiBmdW5jdGlvbiB1cGRhdGVHTFBhcmFtZXRlcnMoKSB7XG4gICAgICAgIHRoaXMucGFyYW1ldGVycy50aW1lID0gKERhdGUubm93KCkgLSB0aGlzLnBhcmFtZXRlcnMuc3RhcnRUaW1lKSAvIDEwMDA7XG4gICAgICAgIHRoaXMucGFyYW1ldGVycy5yZXNvbHV0aW9uLnggPSB0aGlzLm5vZGUuZ2V0Q29udGVudFNpemUoKS53aWR0aDtcbiAgICAgICAgdGhpcy5wYXJhbWV0ZXJzLnJlc29sdXRpb24ueSA9IHRoaXMubm9kZS5nZXRDb250ZW50U2l6ZSgpLmhlaWdodDtcbiAgICB9LFxuXG4gICAgX3VzZTogZnVuY3Rpb24gX3VzZSgpIHtcblxuICAgICAgICBpZiAoY2Muc3lzLmlzTmF0aXZlKSB7XG4gICAgICAgICAgICBjYy5sb2coXCJ1c2UgbmF0aXZlIEdMUHJvZ3JhbVwiKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0gPSBuZXcgY2MuR0xQcm9ncmFtKCk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmluaXRXaXRoU3RyaW5nKF9kZWZhdWx0X3ZlcnRfbm9fbXZwLCB0aGlzLmZsYWdTaGFkZXIpO1xuXG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5tYWNyby5BVFRSSUJVVEVfTkFNRV9QT1NJVElPTiwgY2MubWFjcm8uVkVSVEVYX0FUVFJJQl9QT1NJVElPTik7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5tYWNyby5BVFRSSUJVVEVfTkFNRV9DT0xPUiwgY2MubWFjcm8uVkVSVEVYX0FUVFJJQl9DT0xPUik7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5tYWNyby5BVFRSSUJVVEVfTkFNRV9URVhfQ09PUkQsIGNjLm1hY3JvLlZFUlRFWF9BVFRSSUJfVEVYX0NPT1JEUyk7XG5cbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0ubGluaygpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS51cGRhdGVVbmlmb3JtcygpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVHTFBhcmFtZXRlcnMoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0gPSBuZXcgY2MuR0xQcm9ncmFtKCk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmluaXRXaXRoVmVydGV4U2hhZGVyQnl0ZUFycmF5KF9kZWZhdWx0X3ZlcnQsIHRoaXMuZmxhZ1NoYWRlcik7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5tYWNyby5BVFRSSUJVVEVfTkFNRV9QT1NJVElPTiwgY2MubWFjcm8uVkVSVEVYX0FUVFJJQl9QT1NJVElPTik7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5tYWNyby5BVFRSSUJVVEVfTkFNRV9DT0xPUiwgY2MubWFjcm8uVkVSVEVYX0FUVFJJQl9DT0xPUik7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5tYWNyby5BVFRSSUJVVEVfTkFNRV9URVhfQ09PUkQsIGNjLm1hY3JvLlZFUlRFWF9BVFRSSUJfVEVYX0NPT1JEUyk7XG5cbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0ubGluaygpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS51cGRhdGVVbmlmb3JtcygpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS51c2UoKTtcblxuICAgICAgICAgICAgdGhpcy51cGRhdGVHTFBhcmFtZXRlcnMoKTtcblxuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMWYodGhpcy5fcHJvZ3JhbS5nZXRVbmlmb3JtTG9jYXRpb25Gb3JOYW1lKCd0aW1lJyksIHRoaXMucGFyYW1ldGVycy50aW1lKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDJmKHRoaXMuX3Byb2dyYW0uZ2V0VW5pZm9ybUxvY2F0aW9uRm9yTmFtZSgnbW91c2VfdG91Y2gnKSwgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlLngsIHRoaXMucGFyYW1ldGVycy5tb3VzZS55KTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDJmKHRoaXMuX3Byb2dyYW0uZ2V0VW5pZm9ybUxvY2F0aW9uRm9yTmFtZSgncmVzb2x1dGlvbicpLCB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbi54LCB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbi55KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjYy5zeXMuaXNOYXRpdmUpIHtcbiAgICAgICAgICAgIHZhciBnbFByb2dyYW1fc3RhdGUgPSBjYy5HTFByb2dyYW1TdGF0ZS5nZXRPckNyZWF0ZVdpdGhHTFByb2dyYW0odGhpcy5fcHJvZ3JhbSk7XG4gICAgICAgICAgICBnbFByb2dyYW1fc3RhdGUuc2V0VW5pZm9ybVZlYzIoXCJyZXNvbHV0aW9uXCIsIHRoaXMucGFyYW1ldGVycy5yZXNvbHV0aW9uKTtcbiAgICAgICAgICAgIGdsUHJvZ3JhbV9zdGF0ZS5zZXRVbmlmb3JtRmxvYXQoXCJ0aW1lXCIsIHRoaXMucGFyYW1ldGVycy50aW1lKTtcbiAgICAgICAgICAgIGdsUHJvZ3JhbV9zdGF0ZS5zZXRVbmlmb3JtVmVjMihcIm1vdXNlX3RvdWNoXCIsIHRoaXMucGFyYW1ldGVycy5tb3VzZSk7XG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgIHRoaXMuX3Jlc29sdXRpb24gPSB0aGlzLl9wcm9ncmFtLmdldFVuaWZvcm1Mb2NhdGlvbkZvck5hbWUoXCJyZXNvbHV0aW9uXCIpO1xuICAgICAgICAgICAgdGhpcy5fdGltZSA9IHRoaXMuX3Byb2dyYW0uZ2V0VW5pZm9ybUxvY2F0aW9uRm9yTmFtZShcInRpbWVcIik7XG4gICAgICAgICAgICB0aGlzLl9tb3VzZSA9IHRoaXMuX3Byb2dyYW0uZ2V0VW5pZm9ybUxvY2F0aW9uRm9yTmFtZShcIm1vdXNlX3RvdWNoXCIpO1xuXG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnNldFVuaWZvcm1Mb2NhdGlvbldpdGgyZih0aGlzLl9yZXNvbHV0aW9uLCB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbi54LCB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbi55KTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDFmKHRoaXMuX3RpbWUsIHRoaXMucGFyYW1ldGVycy50aW1lKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDJmKHRoaXMuX21vdXNlLCB0aGlzLnBhcmFtZXRlcnMubW91c2UueCwgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlLnkpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZXRQcm9ncmFtKHRoaXMubm9kZS5fc2dOb2RlLCB0aGlzLl9wcm9ncmFtKTtcbiAgICB9LFxuXG4gICAgc2V0UHJvZ3JhbTogZnVuY3Rpb24gc2V0UHJvZ3JhbShub2RlLCBwcm9ncmFtKSB7XG4gICAgICAgIGlmIChjYy5zeXMuaXNOYXRpdmUpIHtcbiAgICAgICAgICAgIHZhciBnbFByb2dyYW1fc3RhdGUgPSBjYy5HTFByb2dyYW1TdGF0ZS5nZXRPckNyZWF0ZVdpdGhHTFByb2dyYW0ocHJvZ3JhbSk7XG4gICAgICAgICAgICBub2RlLnNldEdMUHJvZ3JhbVN0YXRlKGdsUHJvZ3JhbV9zdGF0ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBub2RlLnNldFNoYWRlclByb2dyYW0ocHJvZ3JhbSk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgY2hpbGRyZW4gPSBub2RlLmNoaWxkcmVuO1xuICAgICAgICBpZiAoIWNoaWxkcmVuKSByZXR1cm47XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykgdGhpcy5zZXRQcm9ncmFtKGNoaWxkcmVuW2ldLCBwcm9ncmFtKTtcbiAgICB9XG5cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnOTY4ODBNajBjZERCNFhSN0JXRVNubjEnLCAnRW1ib3NzJyk7XG4vLyBTY3JpcHQvRW1ib3NzLmpzXG5cbnZhciBfZGVmYXVsdF92ZXJ0ID0gcmVxdWlyZShcIi4uL1NoYWRlcnMvY2NTaGFkZXJfRGVmYXVsdF9WZXJ0LmpzXCIpO1xudmFyIF9kZWZhdWx0X3ZlcnRfbm9fbXZwID0gcmVxdWlyZShcIi4uL1NoYWRlcnMvY2NTaGFkZXJfRGVmYXVsdF9WZXJ0X25vTVZQLmpzXCIpO1xudmFyIF9lbWJvc3NfZnJhZyA9IHJlcXVpcmUoXCIuLi9TaGFkZXJzL2NjU2hhZGVyX0VtYm9zc19GcmFnLmpzXCIpO1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHt9LFxuXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHRoaXMuX3VzZSgpO1xuICAgIH0sXG5cbiAgICBfdXNlOiBmdW5jdGlvbiBfdXNlKCkge1xuICAgICAgICB0aGlzLl9wcm9ncmFtID0gbmV3IGNjLkdMUHJvZ3JhbSgpO1xuICAgICAgICBpZiAoY2Muc3lzLmlzTmF0aXZlKSB7XG4gICAgICAgICAgICBjYy5sb2coXCJ1c2UgbmF0aXZlIEdMUHJvZ3JhbVwiKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uaW5pdFdpdGhTdHJpbmcoX2RlZmF1bHRfdmVydF9ub19tdnAsIF9lbWJvc3NfZnJhZyk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmxpbmsoKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0udXBkYXRlVW5pZm9ybXMoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uaW5pdFdpdGhWZXJ0ZXhTaGFkZXJCeXRlQXJyYXkoX2RlZmF1bHRfdmVydCwgX2VtYm9zc19mcmFnKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uYWRkQXR0cmlidXRlKGNjLm1hY3JvLkFUVFJJQlVURV9OQU1FX1BPU0lUSU9OLCBjYy5tYWNyby5WRVJURVhfQVRUUklCX1BPU0lUSU9OKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uYWRkQXR0cmlidXRlKGNjLm1hY3JvLkFUVFJJQlVURV9OQU1FX0NPTE9SLCBjYy5tYWNyby5WRVJURVhfQVRUUklCX0NPTE9SKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uYWRkQXR0cmlidXRlKGNjLm1hY3JvLkFUVFJJQlVURV9OQU1FX1RFWF9DT09SRCwgY2MubWFjcm8uVkVSVEVYX0FUVFJJQl9URVhfQ09PUkRTKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0ubGluaygpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS51cGRhdGVVbmlmb3JtcygpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fdW5pV2lkdGhTdGVwID0gdGhpcy5fcHJvZ3JhbS5nZXRVbmlmb3JtTG9jYXRpb25Gb3JOYW1lKFwid2lkdGhTdGVwXCIpO1xuICAgICAgICB0aGlzLl91bmlIZWlnaHRTdGVwID0gdGhpcy5fcHJvZ3JhbS5nZXRVbmlmb3JtTG9jYXRpb25Gb3JOYW1lKFwiaGVpZ2h0U3RlcFwiKTtcblxuICAgICAgICBpZiAoY2Muc3lzLmlzTmF0aXZlKSB7XG4gICAgICAgICAgICB2YXIgZ2xQcm9ncmFtX3N0YXRlID0gY2MuR0xQcm9ncmFtU3RhdGUuZ2V0T3JDcmVhdGVXaXRoR0xQcm9ncmFtKHRoaXMuX3Byb2dyYW0pO1xuICAgICAgICAgICAgZ2xQcm9ncmFtX3N0YXRlLnNldFVuaWZvcm1GbG9hdCh0aGlzLl91bmlXaWR0aFN0ZXAsIDEuMCAvIHRoaXMubm9kZS5nZXRDb250ZW50U2l6ZSgpLndpZHRoKTtcbiAgICAgICAgICAgIGdsUHJvZ3JhbV9zdGF0ZS5zZXRVbmlmb3JtRmxvYXQodGhpcy5fdW5pSGVpZ2h0U3RlcCwgMS4wIC8gdGhpcy5ub2RlLmdldENvbnRlbnRTaXplKCkuaGVpZ2h0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDFmKHRoaXMuX3VuaVdpZHRoU3RlcCwgMS4wIC8gdGhpcy5ub2RlLmdldENvbnRlbnRTaXplKCkud2lkdGgpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMWYodGhpcy5fdW5pSGVpZ2h0U3RlcCwgMS4wIC8gdGhpcy5ub2RlLmdldENvbnRlbnRTaXplKCkuaGVpZ2h0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0UHJvZ3JhbSh0aGlzLm5vZGUuX3NnTm9kZSwgdGhpcy5fcHJvZ3JhbSk7XG4gICAgfSxcbiAgICBzZXRQcm9ncmFtOiBmdW5jdGlvbiBzZXRQcm9ncmFtKG5vZGUsIHByb2dyYW0pIHtcbiAgICAgICAgaWYgKGNjLnN5cy5pc05hdGl2ZSkge1xuICAgICAgICAgICAgdmFyIGdsUHJvZ3JhbV9zdGF0ZSA9IGNjLkdMUHJvZ3JhbVN0YXRlLmdldE9yQ3JlYXRlV2l0aEdMUHJvZ3JhbShwcm9ncmFtKTtcbiAgICAgICAgICAgIG5vZGUuc2V0R0xQcm9ncmFtU3RhdGUoZ2xQcm9ncmFtX3N0YXRlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5vZGUuc2V0U2hhZGVyUHJvZ3JhbShwcm9ncmFtKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBjaGlsZHJlbiA9IG5vZGUuY2hpbGRyZW47XG4gICAgICAgIGlmICghY2hpbGRyZW4pIHJldHVybjtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB0aGlzLnNldFByb2dyYW0oY2hpbGRyZW5baV0sIHByb2dyYW0pO1xuICAgIH1cblxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICdjNWMyMU5RQWlWTlBwZzFYTk1vYWs4aycsICdHbGFzczInKTtcbi8vIFNjcmlwdC9HbGFzczIuanNcblxudmFyIF9kZWZhdWx0X3ZlcnQgPSByZXF1aXJlKFwiLi4vU2hhZGVycy9jY1NoYWRlcl9EZWZhdWx0X1ZlcnQuanNcIik7XG52YXIgX2RlZmF1bHRfdmVydF9ub19tdnAgPSByZXF1aXJlKFwiLi4vU2hhZGVycy9jY1NoYWRlcl9EZWZhdWx0X1ZlcnRfbm9NVlAuanNcIik7XG52YXIgX2dsYXNzX2ZyYWcgPSByZXF1aXJlKFwiLi4vU2hhZGVycy9jY1NoYWRlcl9HbGFzc19GcmFnLmpzXCIpO1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgZ2xhc3NGYWN0b3I6IDEuMCxcbiAgICAgICAgZnJhZ19nbHNsOiB7XG4gICAgICAgICAgICBcImRlZmF1bHRcIjogXCJFZmZlY3QxMC5mcy5nbHNsXCIsXG4gICAgICAgICAgICB2aXNpYmxlOiBmYWxzZVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHZhciBub3cgPSBuZXcgRGF0ZSgpO1xuICAgICAgICB0aGlzLnBhcmFtZXRlcnMgPSB7XG4gICAgICAgICAgICBzdGFydFRpbWU6IERhdGUubm93KCksXG4gICAgICAgICAgICB0aW1lOiAwLjAsXG4gICAgICAgICAgICBtb3VzZToge1xuICAgICAgICAgICAgICAgIHg6IDAuMCxcbiAgICAgICAgICAgICAgICB5OiAwLjAsXG4gICAgICAgICAgICAgICAgejogMC4wLFxuICAgICAgICAgICAgICAgIHc6IDAuMFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlc29sdXRpb246IHtcbiAgICAgICAgICAgICAgICB4OiAwLjAsXG4gICAgICAgICAgICAgICAgeTogMC4wLFxuICAgICAgICAgICAgICAgIHo6IDEuMFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRhdGU6IHtcbiAgICAgICAgICAgICAgICB4OiBub3cuZ2V0WWVhcigpLCAvL3llYXJcbiAgICAgICAgICAgICAgICB5OiBub3cuZ2V0TW9udGgoKSwgLy9tb250aFxuICAgICAgICAgICAgICAgIHo6IG5vdy5nZXREYXRlKCksIC8vZGF5XG4gICAgICAgICAgICAgICAgdzogbm93LmdldFRpbWUoKSArIG5vdy5nZXRNaWxsaXNlY29uZHMoKSAvIDEwMDAgfSxcbiAgICAgICAgICAgIC8vdGltZSBzZWNvbmRzXG4gICAgICAgICAgICBpc01vdXNlRG93bjogZmFsc2VcblxuICAgICAgICB9O1xuXG4gICAgICAgIGNjLmxvYWRlci5sb2FkUmVzKHNlbGYuZnJhZ19nbHNsLCBmdW5jdGlvbiAoZXJyLCB0eHQpIHtcbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICBjYy5sb2coZXJyKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2VsZi5mcmFnX2dsc2wgPSB0eHQ7XG4gICAgICAgICAgICAgICAgc2VsZi5fdXNlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoZHQpIHtcbiAgICAgICAgaWYgKHRoaXMuZ2xhc3NGYWN0b3IgPj0gNDApIHtcbiAgICAgICAgICAgIHRoaXMuZ2xhc3NGYWN0b3IgPSAwO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZ2xhc3NGYWN0b3IgKz0gZHQgKiAzO1xuXG4gICAgICAgIGlmICh0aGlzLl9wcm9ncmFtKSB7XG5cbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0udXNlKCk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUdMUGFyYW1ldGVycygpO1xuICAgICAgICAgICAgaWYgKGNjLnN5cy5pc05hdGl2ZSkge1xuICAgICAgICAgICAgICAgIHZhciBnbFByb2dyYW1fc3RhdGUgPSBjYy5HTFByb2dyYW1TdGF0ZS5nZXRPckNyZWF0ZVdpdGhHTFByb2dyYW0odGhpcy5fcHJvZ3JhbSk7XG4gICAgICAgICAgICAgICAgZ2xQcm9ncmFtX3N0YXRlLnNldFVuaWZvcm1GbG9hdChcImJsdXJSYWRpdXNTY2FsZVwiLCB0aGlzLmdsYXNzRmFjdG9yKTtcbiAgICAgICAgICAgICAgICBnbFByb2dyYW1fc3RhdGUuc2V0VW5pZm9ybVZlYzMoXCJpUmVzb2x1dGlvblwiLCB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbik7XG4gICAgICAgICAgICAgICAgZ2xQcm9ncmFtX3N0YXRlLnNldFVuaWZvcm1GbG9hdChcImlHbG9iYWxUaW1lXCIsIHRoaXMucGFyYW1ldGVycy50aW1lKTtcbiAgICAgICAgICAgICAgICBnbFByb2dyYW1fc3RhdGUuc2V0VW5pZm9ybVZlYzQoXCJpTW91c2VcIiwgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlKTtcbiAgICAgICAgICAgICAgICBnbFByb2dyYW1fc3RhdGUuc2V0VW5pZm9ybVZlYzQoXCJpRGF0ZVwiLCB0aGlzLnBhcmFtZXRlcnMuZGF0ZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDFmKHRoaXMuX3VuaUJsdXJSYWRpdXNTY2FsZSwgdGhpcy5nbGFzc0ZhY3Rvcik7XG4gICAgICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoM2YodGhpcy5fcmVzb2x1dGlvbiwgdGhpcy5wYXJhbWV0ZXJzLnJlc29sdXRpb24ueCwgdGhpcy5wYXJhbWV0ZXJzLnJlc29sdXRpb24ueSwgdGhpcy5wYXJhbWV0ZXJzLnJlc29sdXRpb24ueik7XG4gICAgICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMWYodGhpcy5fdGltZSwgdGhpcy5wYXJhbWV0ZXJzLnRpbWUpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDRmKHRoaXMuX21vdXNlLCB0aGlzLnBhcmFtZXRlcnMubW91c2UueCwgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlLnksIHRoaXMucGFyYW1ldGVycy5tb3VzZS56LCB0aGlzLnBhcmFtZXRlcnMubW91c2Uudyk7XG4gICAgICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoNGYodGhpcy5fZGF0ZSwgdGhpcy5wYXJhbWV0ZXJzLmRhdGUueCwgdGhpcy5wYXJhbWV0ZXJzLmRhdGUueSwgdGhpcy5wYXJhbWV0ZXJzLmRhdGUueiwgdGhpcy5wYXJhbWV0ZXJzLmRhdGUudyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHVwZGF0ZUdMUGFyYW1ldGVyczogZnVuY3Rpb24gdXBkYXRlR0xQYXJhbWV0ZXJzKCkge1xuICAgICAgICB0aGlzLnBhcmFtZXRlcnMudGltZSA9IChEYXRlLm5vdygpIC0gdGhpcy5wYXJhbWV0ZXJzLnN0YXJ0VGltZSkgLyAxMDAwO1xuICAgICAgICB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbi54ID0gdGhpcy5ub2RlLmdldENvbnRlbnRTaXplKCkud2lkdGg7XG4gICAgICAgIHRoaXMucGFyYW1ldGVycy5yZXNvbHV0aW9uLnkgPSB0aGlzLm5vZGUuZ2V0Q29udGVudFNpemUoKS5oZWlnaHQ7XG4gICAgICAgIHZhciBub3cgPSBuZXcgRGF0ZSgpO1xuXG4gICAgICAgIHRoaXMucGFyYW1ldGVycy5kYXRlID0ge1xuICAgICAgICAgICAgeDogbm93LmdldFllYXIoKSwgLy95ZWFyXG4gICAgICAgICAgICB5OiBub3cuZ2V0TW9udGgoKSwgLy9tb250aFxuICAgICAgICAgICAgejogbm93LmdldERhdGUoKSwgLy9kYXlcbiAgICAgICAgICAgIHc6IG5vdy5nZXRUaW1lKCkgKyBub3cuZ2V0TWlsbGlzZWNvbmRzKCkgLyAxMDAwIH07XG4gICAgfSxcblxuICAgIC8vdGltZSBzZWNvbmRzXG4gICAgX3VzZTogZnVuY3Rpb24gX3VzZSgpIHtcblxuICAgICAgICB0aGlzLl9wcm9ncmFtID0gbmV3IGNjLkdMUHJvZ3JhbSgpO1xuICAgICAgICBpZiAoY2Muc3lzLmlzTmF0aXZlKSB7XG4gICAgICAgICAgICBjYy5sb2coXCJ1c2UgbmF0aXZlIEdMUHJvZ3JhbVwiKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0gPSBuZXcgY2MuR0xQcm9ncmFtKCk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmluaXRXaXRoU3RyaW5nKF9kZWZhdWx0X3ZlcnRfbm9fbXZwLCB0aGlzLmZyYWdfZ2xzbCk7XG5cbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uYWRkQXR0cmlidXRlKGNjLm1hY3JvLkFUVFJJQlVURV9OQU1FX1BPU0lUSU9OLCBjYy5tYWNyby5WRVJURVhfQVRUUklCX1BPU0lUSU9OKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uYWRkQXR0cmlidXRlKGNjLm1hY3JvLkFUVFJJQlVURV9OQU1FX0NPTE9SLCBjYy5tYWNyby5WRVJURVhfQVRUUklCX0NPTE9SKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uYWRkQXR0cmlidXRlKGNjLm1hY3JvLkFUVFJJQlVURV9OQU1FX1RFWF9DT09SRCwgY2MubWFjcm8uVkVSVEVYX0FUVFJJQl9URVhfQ09PUkRTKTtcblxuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5saW5rKCk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnVwZGF0ZVVuaWZvcm1zKCk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUdMUGFyYW1ldGVycygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbSA9IG5ldyBjYy5HTFByb2dyYW0oKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uaW5pdFdpdGhWZXJ0ZXhTaGFkZXJCeXRlQXJyYXkoX2RlZmF1bHRfdmVydCwgdGhpcy5mcmFnX2dsc2wpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MubWFjcm8uQVRUUklCVVRFX05BTUVfUE9TSVRJT04sIGNjLm1hY3JvLlZFUlRFWF9BVFRSSUJfUE9TSVRJT04pO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MubWFjcm8uQVRUUklCVVRFX05BTUVfQ09MT1IsIGNjLm1hY3JvLlZFUlRFWF9BVFRSSUJfQ09MT1IpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MubWFjcm8uQVRUUklCVVRFX05BTUVfVEVYX0NPT1JELCBjYy5tYWNyby5WRVJURVhfQVRUUklCX1RFWF9DT09SRFMpO1xuXG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmxpbmsoKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0udXBkYXRlVW5pZm9ybXMoKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0udXNlKCk7XG5cbiAgICAgICAgICAgIHRoaXMudXBkYXRlR0xQYXJhbWV0ZXJzKCk7XG5cbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDNmKHRoaXMuX3Byb2dyYW0uZ2V0VW5pZm9ybUxvY2F0aW9uRm9yTmFtZSgnaVJlc29sdXRpb24nKSwgdGhpcy5wYXJhbWV0ZXJzLnJlc29sdXRpb24ueCwgdGhpcy5wYXJhbWV0ZXJzLnJlc29sdXRpb24ueSwgdGhpcy5wYXJhbWV0ZXJzLnJlc29sdXRpb24ueik7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnNldFVuaWZvcm1Mb2NhdGlvbldpdGgxZih0aGlzLl9wcm9ncmFtLmdldFVuaWZvcm1Mb2NhdGlvbkZvck5hbWUoJ2lHbG9iYWxUaW1lJyksIHRoaXMucGFyYW1ldGVycy50aW1lKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDRmKHRoaXMuX3Byb2dyYW0uZ2V0VW5pZm9ybUxvY2F0aW9uRm9yTmFtZSgnaU1vdXNlJyksIHRoaXMucGFyYW1ldGVycy5tb3VzZS54LCB0aGlzLnBhcmFtZXRlcnMubW91c2UueSwgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlLnosIHRoaXMucGFyYW1ldGVycy5tb3VzZS53KTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDRmKHRoaXMuX3Byb2dyYW0uZ2V0VW5pZm9ybUxvY2F0aW9uRm9yTmFtZSgnaURhdGUnKSwgdGhpcy5wYXJhbWV0ZXJzLmRhdGUueCwgdGhpcy5wYXJhbWV0ZXJzLmRhdGUueSwgdGhpcy5wYXJhbWV0ZXJzLmRhdGUueiwgdGhpcy5wYXJhbWV0ZXJzLmRhdGUudyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY2Muc3lzLmlzTmF0aXZlKSB7XG4gICAgICAgICAgICB2YXIgZ2xQcm9ncmFtX3N0YXRlID0gY2MuR0xQcm9ncmFtU3RhdGUuZ2V0T3JDcmVhdGVXaXRoR0xQcm9ncmFtKHRoaXMuX3Byb2dyYW0pO1xuICAgICAgICAgICAgZ2xQcm9ncmFtX3N0YXRlLnNldFVuaWZvcm1GbG9hdChcIndpZHRoU3RlcFwiLCAxLjAgLyB0aGlzLm5vZGUuZ2V0Q29udGVudFNpemUoKS53aWR0aCk7XG4gICAgICAgICAgICBnbFByb2dyYW1fc3RhdGUuc2V0VW5pZm9ybUZsb2F0KFwiaGVpZ2h0U3RlcFwiLCAxLjAgLyB0aGlzLm5vZGUuZ2V0Q29udGVudFNpemUoKS5oZWlnaHQpO1xuICAgICAgICAgICAgZ2xQcm9ncmFtX3N0YXRlLnNldFVuaWZvcm1GbG9hdChcImJsdXJSYWRpdXNTY2FsZVwiLCB0aGlzLmdsYXNzRmFjdG9yKTtcbiAgICAgICAgICAgIGdsUHJvZ3JhbV9zdGF0ZS5zZXRVbmlmb3JtVmVjMyhcImlSZXNvbHV0aW9uXCIsIHRoaXMucGFyYW1ldGVycy5yZXNvbHV0aW9uKTtcbiAgICAgICAgICAgIGdsUHJvZ3JhbV9zdGF0ZS5zZXRVbmlmb3JtRmxvYXQoXCJpR2xvYmFsVGltZVwiLCB0aGlzLnBhcmFtZXRlcnMudGltZSk7XG4gICAgICAgICAgICBnbFByb2dyYW1fc3RhdGUuc2V0VW5pZm9ybVZlYzQoXCJpTW91c2VcIiwgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlKTtcbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgdGhpcy5fdW5pV2lkdGhTdGVwID0gdGhpcy5fcHJvZ3JhbS5nZXRVbmlmb3JtTG9jYXRpb25Gb3JOYW1lKFwid2lkdGhTdGVwXCIpO1xuICAgICAgICAgICAgdGhpcy5fdW5pSGVpZ2h0U3RlcCA9IHRoaXMuX3Byb2dyYW0uZ2V0VW5pZm9ybUxvY2F0aW9uRm9yTmFtZShcImhlaWdodFN0ZXBcIik7XG4gICAgICAgICAgICB0aGlzLl91bmlCbHVyUmFkaXVzU2NhbGUgPSB0aGlzLl9wcm9ncmFtLmdldFVuaWZvcm1Mb2NhdGlvbkZvck5hbWUoXCJibHVyUmFkaXVzU2NhbGVcIik7XG5cbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDFmKHRoaXMuX3VuaVdpZHRoU3RlcCwgMS4wIC8gdGhpcy5ub2RlLmdldENvbnRlbnRTaXplKCkud2lkdGgpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMWYodGhpcy5fdW5pSGVpZ2h0U3RlcCwgMS4wIC8gdGhpcy5ub2RlLmdldENvbnRlbnRTaXplKCkuaGVpZ2h0KTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDFmKHRoaXMuX3VuaUJsdXJSYWRpdXNTY2FsZSwgdGhpcy5nbGFzc0ZhY3Rvcik7XG5cbiAgICAgICAgICAgIHRoaXMuX3Jlc29sdXRpb24gPSB0aGlzLl9wcm9ncmFtLmdldFVuaWZvcm1Mb2NhdGlvbkZvck5hbWUoXCJpUmVzb2x1dGlvblwiKTtcbiAgICAgICAgICAgIHRoaXMuX3RpbWUgPSB0aGlzLl9wcm9ncmFtLmdldFVuaWZvcm1Mb2NhdGlvbkZvck5hbWUoXCJpR2xvYmFsVGltZVwiKTtcbiAgICAgICAgICAgIHRoaXMuX21vdXNlID0gdGhpcy5fcHJvZ3JhbS5nZXRVbmlmb3JtTG9jYXRpb25Gb3JOYW1lKFwiaU1vdXNlXCIpO1xuXG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnNldFVuaWZvcm1Mb2NhdGlvbldpdGgzZih0aGlzLl9yZXNvbHV0aW9uLCB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbi54LCB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbi55LCB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbi56KTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDFmKHRoaXMuX3RpbWUsIHRoaXMucGFyYW1ldGVycy50aW1lKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDRmKHRoaXMuX21vdXNlLCB0aGlzLnBhcmFtZXRlcnMubW91c2UueCwgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlLnksIHRoaXMucGFyYW1ldGVycy5tb3VzZS56LCB0aGlzLnBhcmFtZXRlcnMubW91c2Uudyk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnNldFVuaWZvcm1Mb2NhdGlvbldpdGg0Zih0aGlzLl9kYXRlLCB0aGlzLnBhcmFtZXRlcnMuZGF0ZS54LCB0aGlzLnBhcmFtZXRlcnMuZGF0ZS55LCB0aGlzLnBhcmFtZXRlcnMuZGF0ZS56LCB0aGlzLnBhcmFtZXRlcnMuZGF0ZS53KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0UHJvZ3JhbSh0aGlzLm5vZGUuX3NnTm9kZSwgdGhpcy5fcHJvZ3JhbSk7XG4gICAgfSxcblxuICAgIHNldFByb2dyYW06IGZ1bmN0aW9uIHNldFByb2dyYW0obm9kZSwgcHJvZ3JhbSkge1xuICAgICAgICBpZiAoY2Muc3lzLmlzTmF0aXZlKSB7XG4gICAgICAgICAgICB2YXIgZ2xQcm9ncmFtX3N0YXRlID0gY2MuR0xQcm9ncmFtU3RhdGUuZ2V0T3JDcmVhdGVXaXRoR0xQcm9ncmFtKHByb2dyYW0pO1xuICAgICAgICAgICAgbm9kZS5zZXRHTFByb2dyYW1TdGF0ZShnbFByb2dyYW1fc3RhdGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbm9kZS5zZXRTaGFkZXJQcm9ncmFtKHByb2dyYW0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGNoaWxkcmVuID0gbm9kZS5jaGlsZHJlbjtcbiAgICAgICAgaWYgKCFjaGlsZHJlbikgcmV0dXJuO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHRoaXMuc2V0UHJvZ3JhbShjaGlsZHJlbltpXSwgcHJvZ3JhbSk7XG4gICAgfVxuXG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzRiMmI5M2R2MnRNUFlPNTRNVENIVGZwJywgJ0dsYXNzJyk7XG4vLyBTY3JpcHQvR2xhc3MuanNcblxudmFyIF9kZWZhdWx0X3ZlcnQgPSByZXF1aXJlKFwiLi4vU2hhZGVycy9jY1NoYWRlcl9EZWZhdWx0X1ZlcnQuanNcIik7XG52YXIgX2RlZmF1bHRfdmVydF9ub19tdnAgPSByZXF1aXJlKFwiLi4vU2hhZGVycy9jY1NoYWRlcl9EZWZhdWx0X1ZlcnRfbm9NVlAuanNcIik7XG52YXIgX2dsYXNzX2ZyYWcgPSByZXF1aXJlKFwiLi4vU2hhZGVycy9jY1NoYWRlcl9HbGFzc19GcmFnLmpzXCIpO1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgZ2xhc3NGYWN0b3I6IDEuMFxuICAgIH0sXG5cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5fdXNlKCk7XG4gICAgfSxcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShkdCkge1xuICAgICAgICBpZiAodGhpcy5nbGFzc0ZhY3RvciA+PSA0MCkge1xuICAgICAgICAgICAgdGhpcy5nbGFzc0ZhY3RvciA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5nbGFzc0ZhY3RvciArPSBkdCAqIDM7XG5cbiAgICAgICAgaWYgKHRoaXMuX3Byb2dyYW0pIHtcblxuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS51c2UoKTtcbiAgICAgICAgICAgIGlmIChjYy5zeXMuaXNOYXRpdmUpIHtcbiAgICAgICAgICAgICAgICB2YXIgZ2xQcm9ncmFtX3N0YXRlID0gY2MuR0xQcm9ncmFtU3RhdGUuZ2V0T3JDcmVhdGVXaXRoR0xQcm9ncmFtKHRoaXMuX3Byb2dyYW0pO1xuICAgICAgICAgICAgICAgIGdsUHJvZ3JhbV9zdGF0ZS5zZXRVbmlmb3JtRmxvYXQoXCJibHVyUmFkaXVzU2NhbGVcIiwgdGhpcy5nbGFzc0ZhY3Rvcik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDFmKHRoaXMuX3VuaUJsdXJSYWRpdXNTY2FsZSwgdGhpcy5nbGFzc0ZhY3Rvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX3VzZTogZnVuY3Rpb24gX3VzZSgpIHtcblxuICAgICAgICB0aGlzLl9wcm9ncmFtID0gbmV3IGNjLkdMUHJvZ3JhbSgpO1xuICAgICAgICBpZiAoY2Muc3lzLmlzTmF0aXZlKSB7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmluaXRXaXRoU3RyaW5nKF9kZWZhdWx0X3ZlcnRfbm9fbXZwLCBfZ2xhc3NfZnJhZyk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmxpbmsoKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0udXBkYXRlVW5pZm9ybXMoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uaW5pdFdpdGhWZXJ0ZXhTaGFkZXJCeXRlQXJyYXkoX2RlZmF1bHRfdmVydCwgX2dsYXNzX2ZyYWcpO1xuXG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5tYWNyby5BVFRSSUJVVEVfTkFNRV9QT1NJVElPTiwgY2MubWFjcm8uVkVSVEVYX0FUVFJJQl9QT1NJVElPTik7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5tYWNyby5BVFRSSUJVVEVfTkFNRV9DT0xPUiwgY2MubWFjcm8uVkVSVEVYX0FUVFJJQl9DT0xPUik7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5tYWNyby5BVFRSSUJVVEVfTkFNRV9URVhfQ09PUkQsIGNjLm1hY3JvLlZFUlRFWF9BVFRSSUJfVEVYX0NPT1JEUyk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmxpbmsoKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0udXBkYXRlVW5pZm9ybXMoKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0udXNlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY2Muc3lzLmlzTmF0aXZlKSB7XG4gICAgICAgICAgICB2YXIgZ2xQcm9ncmFtX3N0YXRlID0gY2MuR0xQcm9ncmFtU3RhdGUuZ2V0T3JDcmVhdGVXaXRoR0xQcm9ncmFtKHRoaXMuX3Byb2dyYW0pO1xuICAgICAgICAgICAgZ2xQcm9ncmFtX3N0YXRlLnNldFVuaWZvcm1GbG9hdChcIndpZHRoU3RlcFwiLCAxLjAgLyB0aGlzLm5vZGUuZ2V0Q29udGVudFNpemUoKS53aWR0aCk7XG4gICAgICAgICAgICBnbFByb2dyYW1fc3RhdGUuc2V0VW5pZm9ybUZsb2F0KFwiaGVpZ2h0U3RlcFwiLCAxLjAgLyB0aGlzLm5vZGUuZ2V0Q29udGVudFNpemUoKS5oZWlnaHQpO1xuICAgICAgICAgICAgZ2xQcm9ncmFtX3N0YXRlLnNldFVuaWZvcm1GbG9hdChcImJsdXJSYWRpdXNTY2FsZVwiLCB0aGlzLmdsYXNzRmFjdG9yKTtcbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgdGhpcy5fdW5pV2lkdGhTdGVwID0gdGhpcy5fcHJvZ3JhbS5nZXRVbmlmb3JtTG9jYXRpb25Gb3JOYW1lKFwid2lkdGhTdGVwXCIpO1xuICAgICAgICAgICAgdGhpcy5fdW5pSGVpZ2h0U3RlcCA9IHRoaXMuX3Byb2dyYW0uZ2V0VW5pZm9ybUxvY2F0aW9uRm9yTmFtZShcImhlaWdodFN0ZXBcIik7XG4gICAgICAgICAgICB0aGlzLl91bmlCbHVyUmFkaXVzU2NhbGUgPSB0aGlzLl9wcm9ncmFtLmdldFVuaWZvcm1Mb2NhdGlvbkZvck5hbWUoXCJibHVyUmFkaXVzU2NhbGVcIik7XG5cbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDFmKHRoaXMuX3VuaVdpZHRoU3RlcCwgMS4wIC8gdGhpcy5ub2RlLmdldENvbnRlbnRTaXplKCkud2lkdGgpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMWYodGhpcy5fdW5pSGVpZ2h0U3RlcCwgMS4wIC8gdGhpcy5ub2RlLmdldENvbnRlbnRTaXplKCkuaGVpZ2h0KTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDFmKHRoaXMuX3VuaUJsdXJSYWRpdXNTY2FsZSwgdGhpcy5nbGFzc0ZhY3Rvcik7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNldFByb2dyYW0odGhpcy5ub2RlLl9zZ05vZGUsIHRoaXMuX3Byb2dyYW0pO1xuICAgIH0sXG5cbiAgICBzZXRQcm9ncmFtOiBmdW5jdGlvbiBzZXRQcm9ncmFtKG5vZGUsIHByb2dyYW0pIHtcbiAgICAgICAgaWYgKGNjLnN5cy5pc05hdGl2ZSkge1xuICAgICAgICAgICAgdmFyIGdsUHJvZ3JhbV9zdGF0ZSA9IGNjLkdMUHJvZ3JhbVN0YXRlLmdldE9yQ3JlYXRlV2l0aEdMUHJvZ3JhbShwcm9ncmFtKTtcbiAgICAgICAgICAgIG5vZGUuc2V0R0xQcm9ncmFtU3RhdGUoZ2xQcm9ncmFtX3N0YXRlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5vZGUuc2V0U2hhZGVyUHJvZ3JhbShwcm9ncmFtKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBjaGlsZHJlbiA9IG5vZGUuY2hpbGRyZW47XG4gICAgICAgIGlmICghY2hpbGRyZW4pIHJldHVybjtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB0aGlzLnNldFByb2dyYW0oY2hpbGRyZW5baV0sIHByb2dyYW0pO1xuICAgIH1cblxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICdiZWI2ZHVsb3p0Rlc3R014NmQ5Z0l5YScsICdHcmF5Jyk7XG4vLyBTY3JpcHQvR3JheS5qc1xuXG52YXIgX2RlZmF1bHRfdmVydCA9IHJlcXVpcmUoXCIuLi9TaGFkZXJzL2NjU2hhZGVyX0RlZmF1bHRfVmVydC5qc1wiKTtcbnZhciBfZGVmYXVsdF92ZXJ0X25vX212cCA9IHJlcXVpcmUoXCIuLi9TaGFkZXJzL2NjU2hhZGVyX0RlZmF1bHRfVmVydF9ub01WUC5qc1wiKTtcbnZhciBfZ3JheV9mcmFnID0gcmVxdWlyZShcIi4uL1NoYWRlcnMvY2NTaGFkZXJfR3JheV9GcmFnLmpzXCIpO1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgZ3JheUZhY3RvcjogMVxuICAgIH0sXG5cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5fdXNlKCk7XG4gICAgfSxcblxuICAgIF91c2U6IGZ1bmN0aW9uIF91c2UoKSB7XG4gICAgICAgIHRoaXMuX3Byb2dyYW0gPSBuZXcgY2MuR0xQcm9ncmFtKCk7XG5cbiAgICAgICAgaWYgKGNjLnN5cy5pc05hdGl2ZSkge1xuICAgICAgICAgICAgY2MubG9nKFwidXNlIG5hdGl2ZSBHTFByb2dyYW1cIik7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmluaXRXaXRoU3RyaW5nKF9kZWZhdWx0X3ZlcnRfbm9fbXZwLCBfZ3JheV9mcmFnKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0ubGluaygpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS51cGRhdGVVbmlmb3JtcygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5pbml0V2l0aFZlcnRleFNoYWRlckJ5dGVBcnJheShfZGVmYXVsdF92ZXJ0LCBfZ3JheV9mcmFnKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uYWRkQXR0cmlidXRlKGNjLm1hY3JvLkFUVFJJQlVURV9OQU1FX1BPU0lUSU9OLCBjYy5tYWNyby5WRVJURVhfQVRUUklCX1BPU0lUSU9OKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uYWRkQXR0cmlidXRlKGNjLm1hY3JvLkFUVFJJQlVURV9OQU1FX0NPTE9SLCBjYy5tYWNyby5WRVJURVhfQVRUUklCX0NPTE9SKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uYWRkQXR0cmlidXRlKGNjLm1hY3JvLkFUVFJJQlVURV9OQU1FX1RFWF9DT09SRCwgY2MubWFjcm8uVkVSVEVYX0FUVFJJQl9URVhfQ09PUkRTKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0ubGluaygpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS51cGRhdGVVbmlmb3JtcygpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2V0UHJvZ3JhbSh0aGlzLm5vZGUuX3NnTm9kZSwgdGhpcy5fcHJvZ3JhbSk7XG4gICAgfSxcbiAgICBzZXRQcm9ncmFtOiBmdW5jdGlvbiBzZXRQcm9ncmFtKG5vZGUsIHByb2dyYW0pIHtcbiAgICAgICAgaWYgKGNjLnN5cy5pc05hdGl2ZSkge1xuICAgICAgICAgICAgdmFyIGdsUHJvZ3JhbV9zdGF0ZSA9IGNjLkdMUHJvZ3JhbVN0YXRlLmdldE9yQ3JlYXRlV2l0aEdMUHJvZ3JhbShwcm9ncmFtKTtcbiAgICAgICAgICAgIG5vZGUuc2V0R0xQcm9ncmFtU3RhdGUoZ2xQcm9ncmFtX3N0YXRlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5vZGUuc2V0U2hhZGVyUHJvZ3JhbShwcm9ncmFtKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBjaGlsZHJlbiA9IG5vZGUuY2hpbGRyZW47XG4gICAgICAgIGlmICghY2hpbGRyZW4pIHJldHVybjtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykgdGhpcy5zZXRQcm9ncmFtKGNoaWxkcmVuW2ldLCBwcm9ncmFtKTtcbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzYwYTNhZUswUlpKR3FNa1NvQXpvUFhJJywgJ0xpZ2h0RWZmZXQnKTtcbi8vIFNjcmlwdC9MaWdodEVmZmV0LmpzXG5cbnZhciBfZGVmYXVsdF92ZXJ0ID0gcmVxdWlyZShcIi4uL1NoYWRlcnMvY2NTaGFkZXJfRGVmYXVsdF9WZXJ0LmpzXCIpO1xudmFyIF9kZWZhdWx0X3ZlcnRfbm9fbXZwID0gcmVxdWlyZShcIi4uL1NoYWRlcnMvY2NTaGFkZXJfRGVmYXVsdF9WZXJ0X25vTVZQLmpzXCIpO1xudmFyIF9nbGFzc19mcmFnID0gcmVxdWlyZShcIi4uL1NoYWRlcnMvY2NTaGFkZXJfTGlnaHRFZmZlY3RfRnJhZy5qc1wiKTtcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGdsYXNzRmFjdG9yOiAxLjBcbiAgICB9LFxuXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHRoaXMucGFyYW1ldGVycyA9IHtcbiAgICAgICAgICAgIHN0YXJ0VGltZTogRGF0ZS5ub3coKSxcbiAgICAgICAgICAgIHRpbWU6IDAuMCxcbiAgICAgICAgICAgIG1vdXNlOiB7XG4gICAgICAgICAgICAgICAgeDogMC4wLFxuICAgICAgICAgICAgICAgIHk6IDAuMFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlc29sdXRpb246IHtcbiAgICAgICAgICAgICAgICB4OiAwLjAsXG4gICAgICAgICAgICAgICAgeTogMC4wXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLk1PVVNFX01PVkUsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlLnggPSB0aGlzLm5vZGUuZ2V0Q29udGVudFNpemUoKS53aWR0aCAvIGV2ZW50LmdldExvY2F0aW9uWCgpO1xuICAgICAgICAgICAgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlLnkgPSB0aGlzLm5vZGUuZ2V0Q29udGVudFNpemUoKS5oZWlnaHQgLyBldmVudC5nZXRMb2NhdGlvblkoKTtcbiAgICAgICAgfSwgdGhpcyk7XG5cbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX01PVkUsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlLnggPSB0aGlzLm5vZGUuZ2V0Q29udGVudFNpemUoKS53aWR0aCAvIGV2ZW50LmdldExvY2F0aW9uWCgpO1xuICAgICAgICAgICAgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlLnkgPSB0aGlzLm5vZGUuZ2V0Q29udGVudFNpemUoKS5oZWlnaHQgLyBldmVudC5nZXRMb2NhdGlvblkoKTtcbiAgICAgICAgfSwgdGhpcyk7XG5cbiAgICAgICAgdGhpcy5fdXNlKCk7XG4gICAgfSxcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShkdCkge1xuICAgICAgICBpZiAodGhpcy5nbGFzc0ZhY3RvciA+PSA0MCkge1xuICAgICAgICAgICAgdGhpcy5nbGFzc0ZhY3RvciA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5nbGFzc0ZhY3RvciArPSBkdCAqIDM7XG5cbiAgICAgICAgaWYgKHRoaXMuX3Byb2dyYW0pIHtcblxuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS51c2UoKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlR0xQYXJhbWV0ZXJzKCk7XG4gICAgICAgICAgICBpZiAoY2Muc3lzLmlzTmF0aXZlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGdsUHJvZ3JhbV9zdGF0ZSA9IGNjLkdMUHJvZ3JhbVN0YXRlLmdldE9yQ3JlYXRlV2l0aEdMUHJvZ3JhbSh0aGlzLl9wcm9ncmFtKTtcbiAgICAgICAgICAgICAgICBnbFByb2dyYW1fc3RhdGUuc2V0VW5pZm9ybVZlYzIoXCJyZXNvbHV0aW9uXCIsIHRoaXMucGFyYW1ldGVycy5yZXNvbHV0aW9uKTtcbiAgICAgICAgICAgICAgICBnbFByb2dyYW1fc3RhdGUuc2V0VW5pZm9ybUZsb2F0KFwidGltZVwiLCB0aGlzLnBhcmFtZXRlcnMudGltZSk7XG4gICAgICAgICAgICAgICAgZ2xQcm9ncmFtX3N0YXRlLnNldFVuaWZvcm1WZWMyKFwibW91c2VfdG91Y2hcIiwgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMmYodGhpcy5fcmVzb2x1dGlvbiwgdGhpcy5wYXJhbWV0ZXJzLnJlc29sdXRpb24ueCwgdGhpcy5wYXJhbWV0ZXJzLnJlc29sdXRpb24ueSk7XG4gICAgICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMWYodGhpcy5fdGltZSwgdGhpcy5wYXJhbWV0ZXJzLnRpbWUpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDJmKHRoaXMuX21vdXNlLCB0aGlzLnBhcmFtZXRlcnMubW91c2UueCwgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlLngpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICB1cGRhdGVHTFBhcmFtZXRlcnM6IGZ1bmN0aW9uIHVwZGF0ZUdMUGFyYW1ldGVycygpIHtcbiAgICAgICAgdGhpcy5wYXJhbWV0ZXJzLnRpbWUgPSAoRGF0ZS5ub3coKSAtIHRoaXMucGFyYW1ldGVycy5zdGFydFRpbWUpIC8gMTAwMDtcbiAgICAgICAgdGhpcy5wYXJhbWV0ZXJzLnJlc29sdXRpb24ueCA9IHRoaXMubm9kZS5nZXRDb250ZW50U2l6ZSgpLndpZHRoO1xuICAgICAgICB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbi55ID0gdGhpcy5ub2RlLmdldENvbnRlbnRTaXplKCkuaGVpZ2h0O1xuICAgIH0sXG5cbiAgICBfdXNlOiBmdW5jdGlvbiBfdXNlKCkge1xuXG4gICAgICAgIGlmIChjYy5zeXMuaXNOYXRpdmUpIHtcbiAgICAgICAgICAgIGNjLmxvZyhcInVzZSBuYXRpdmUgR0xQcm9ncmFtXCIpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbSA9IG5ldyBjYy5HTFByb2dyYW0oKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uaW5pdFdpdGhTdHJpbmcoX2RlZmF1bHRfdmVydF9ub19tdnAsIF9nbGFzc19mcmFnKTtcblxuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MubWFjcm8uQVRUUklCVVRFX05BTUVfUE9TSVRJT04sIGNjLm1hY3JvLlZFUlRFWF9BVFRSSUJfUE9TSVRJT04pO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MubWFjcm8uQVRUUklCVVRFX05BTUVfQ09MT1IsIGNjLm1hY3JvLlZFUlRFWF9BVFRSSUJfQ09MT1IpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MubWFjcm8uQVRUUklCVVRFX05BTUVfVEVYX0NPT1JELCBjYy5tYWNyby5WRVJURVhfQVRUUklCX1RFWF9DT09SRFMpO1xuXG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmxpbmsoKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0udXBkYXRlVW5pZm9ybXMoKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlR0xQYXJhbWV0ZXJzKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtID0gbmV3IGNjLkdMUHJvZ3JhbSgpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5pbml0V2l0aFZlcnRleFNoYWRlckJ5dGVBcnJheShfZGVmYXVsdF92ZXJ0LCBfZ2xhc3NfZnJhZyk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5tYWNyby5BVFRSSUJVVEVfTkFNRV9QT1NJVElPTiwgY2MubWFjcm8uVkVSVEVYX0FUVFJJQl9QT1NJVElPTik7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5tYWNyby5BVFRSSUJVVEVfTkFNRV9DT0xPUiwgY2MubWFjcm8uVkVSVEVYX0FUVFJJQl9DT0xPUik7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5tYWNyby5BVFRSSUJVVEVfTkFNRV9URVhfQ09PUkQsIGNjLm1hY3JvLlZFUlRFWF9BVFRSSUJfVEVYX0NPT1JEUyk7XG5cbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0ubGluaygpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS51cGRhdGVVbmlmb3JtcygpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS51c2UoKTtcblxuICAgICAgICAgICAgdGhpcy51cGRhdGVHTFBhcmFtZXRlcnMoKTtcblxuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMWYodGhpcy5fcHJvZ3JhbS5nZXRVbmlmb3JtTG9jYXRpb25Gb3JOYW1lKCd0aW1lJyksIHRoaXMucGFyYW1ldGVycy50aW1lKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDJmKHRoaXMuX3Byb2dyYW0uZ2V0VW5pZm9ybUxvY2F0aW9uRm9yTmFtZSgnbW91c2VfdG91Y2gnKSwgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlLngsIHRoaXMucGFyYW1ldGVycy5tb3VzZS55KTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDJmKHRoaXMuX3Byb2dyYW0uZ2V0VW5pZm9ybUxvY2F0aW9uRm9yTmFtZSgncmVzb2x1dGlvbicpLCB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbi54LCB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbi55KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjYy5zeXMuaXNOYXRpdmUpIHtcbiAgICAgICAgICAgIHZhciBnbFByb2dyYW1fc3RhdGUgPSBjYy5HTFByb2dyYW1TdGF0ZS5nZXRPckNyZWF0ZVdpdGhHTFByb2dyYW0odGhpcy5fcHJvZ3JhbSk7XG4gICAgICAgICAgICBnbFByb2dyYW1fc3RhdGUuc2V0VW5pZm9ybVZlYzIoXCJyZXNvbHV0aW9uXCIsIHRoaXMucGFyYW1ldGVycy5yZXNvbHV0aW9uKTtcbiAgICAgICAgICAgIGdsUHJvZ3JhbV9zdGF0ZS5zZXRVbmlmb3JtRmxvYXQoXCJ0aW1lXCIsIHRoaXMucGFyYW1ldGVycy50aW1lKTtcbiAgICAgICAgICAgIGdsUHJvZ3JhbV9zdGF0ZS5zZXRVbmlmb3JtVmVjMihcIm1vdXNlX3RvdWNoXCIsIHRoaXMucGFyYW1ldGVycy5tb3VzZSk7XG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgIHRoaXMuX3Jlc29sdXRpb24gPSB0aGlzLl9wcm9ncmFtLmdldFVuaWZvcm1Mb2NhdGlvbkZvck5hbWUoXCJyZXNvbHV0aW9uXCIpO1xuICAgICAgICAgICAgdGhpcy5fdGltZSA9IHRoaXMuX3Byb2dyYW0uZ2V0VW5pZm9ybUxvY2F0aW9uRm9yTmFtZShcInRpbWVcIik7XG4gICAgICAgICAgICB0aGlzLl9tb3VzZSA9IHRoaXMuX3Byb2dyYW0uZ2V0VW5pZm9ybUxvY2F0aW9uRm9yTmFtZShcIm1vdXNlX3RvdWNoXCIpO1xuXG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnNldFVuaWZvcm1Mb2NhdGlvbldpdGgyZih0aGlzLl9yZXNvbHV0aW9uLCB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbi54LCB0aGlzLnBhcmFtZXRlcnMucmVzb2x1dGlvbi55KTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDFmKHRoaXMuX3RpbWUsIHRoaXMucGFyYW1ldGVycy50aW1lKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDJmKHRoaXMuX21vdXNlLCB0aGlzLnBhcmFtZXRlcnMubW91c2UueCwgdGhpcy5wYXJhbWV0ZXJzLm1vdXNlLnkpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZXRQcm9ncmFtKHRoaXMubm9kZS5fc2dOb2RlLCB0aGlzLl9wcm9ncmFtKTtcbiAgICB9LFxuXG4gICAgc2V0UHJvZ3JhbTogZnVuY3Rpb24gc2V0UHJvZ3JhbShub2RlLCBwcm9ncmFtKSB7XG4gICAgICAgIGlmIChjYy5zeXMuaXNOYXRpdmUpIHtcbiAgICAgICAgICAgIHZhciBnbFByb2dyYW1fc3RhdGUgPSBjYy5HTFByb2dyYW1TdGF0ZS5nZXRPckNyZWF0ZVdpdGhHTFByb2dyYW0ocHJvZ3JhbSk7XG4gICAgICAgICAgICBub2RlLnNldEdMUHJvZ3JhbVN0YXRlKGdsUHJvZ3JhbV9zdGF0ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBub2RlLnNldFNoYWRlclByb2dyYW0ocHJvZ3JhbSk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgY2hpbGRyZW4gPSBub2RlLmNoaWxkcmVuO1xuICAgICAgICBpZiAoIWNoaWxkcmVuKSByZXR1cm47XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykgdGhpcy5zZXRQcm9ncmFtKGNoaWxkcmVuW2ldLCBwcm9ncmFtKTtcbiAgICB9XG5cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnMzM0NWNJUEtnOU01TCtCbU5GUHlFWWsnLCAnTGlnaHRuaW5nQm9sdCcpO1xuLy8gU2NyaXB0L0xpZ2h0bmluZ0JvbHQuanNcblxudmFyIF9kZWZhdWx0X3ZlcnQgPSByZXF1aXJlKFwiLi4vU2hhZGVycy9jY1NoYWRlcl9saWdodG5pbmdCb2x0X1ZlcnQuanNcIik7XG52YXIgX2RlZmF1bHRfdmVydF9ub19tdnAgPSByZXF1aXJlKFwiLi4vU2hhZGVycy9jY1NoYWRlcl9EZWZhdWx0X1ZlcnRfbm9NVlAuanNcIik7XG52YXIgX2xpZ2h0bmluZ0JvbHRfZnJhZyA9IHJlcXVpcmUoXCIuLi9TaGFkZXJzL2NjU2hhZGVyX2xpZ2h0bmluZ0JvbHRfRnJhZy5qc1wiKTtcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGdsYXNzRmFjdG9yOiAxLjBcbiAgICB9LFxuXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHRoaXMuX3VzZSgpO1xuICAgIH0sXG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoZHQpIHtcbiAgICAgICAgLy8gaWYodGhpcy5nbGFzc0ZhY3Rvcj49NDApe1xuICAgICAgICAvLyAgICAgdGhpcy5nbGFzc0ZhY3Rvcj0wO1xuICAgICAgICAvLyB9XG4gICAgICAgIC8vIHRoaXMuZ2xhc3NGYWN0b3IrPWR0KjM7XG5cbiAgICAgICAgLy8gaWYodGhpcy5fcHJvZ3JhbSl7XG4gICAgICAgIC8vICAgICBpZihjYy5zeXMuaXNOYXRpdmUpe1xuICAgICAgICAvLyAgICAgICAgIHZhciBnbFByb2dyYW1fc3RhdGUgPSBjYy5HTFByb2dyYW1TdGF0ZS5nZXRPckNyZWF0ZVdpdGhHTFByb2dyYW0odGhpcy5fcHJvZ3JhbSk7XG4gICAgICAgIC8vICAgICAgICAgZ2xQcm9ncmFtX3N0YXRlLnNldFVuaWZvcm1GbG9hdCggdGhpcy5fdW5pQmx1clJhZGl1c1NjYWxlICx0aGlzLmdsYXNzRmFjdG9yKTtcbiAgICAgICAgLy8gICAgIH1lbHNle1xuICAgICAgICAvLyAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDFmKCB0aGlzLl91bmlCbHVyUmFkaXVzU2NhbGUsIHRoaXMuZ2xhc3NGYWN0b3IgKTsgICBcbiAgICAgICAgLy8gICAgIH1cbiAgICAgICAgLy8gfVxuICAgIH0sXG5cbiAgICBfdXNlOiBmdW5jdGlvbiBfdXNlKCkge1xuXG4gICAgICAgIGlmIChjYy5zeXMuaXNOYXRpdmUpIHtcbiAgICAgICAgICAgIGNjLmxvZyhcInVzZSBuYXRpdmUgR0xQcm9ncmFtXCIpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbSA9IG5ldyBjYy5HTFByb2dyYW0oKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uaW5pdFdpdGhTdHJpbmcoX2RlZmF1bHRfdmVydF9ub19tdnAsIF9saWdodG5pbmdCb2x0X2ZyYWcpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5saW5rKCk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnVwZGF0ZVVuaWZvcm1zKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtID0gbmV3IGNjLkdMUHJvZ3JhbSgpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5pbml0V2l0aFZlcnRleFNoYWRlckJ5dGVBcnJheShfZGVmYXVsdF92ZXJ0LCBfbGlnaHRuaW5nQm9sdF9mcmFnKTtcblxuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MubWFjcm8uQVRUUklCVVRFX05BTUVfUE9TSVRJT04sIGNjLm1hY3JvLlZFUlRFWF9BVFRSSUJfUE9TSVRJT04pO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MubWFjcm8uQVRUUklCVVRFX05BTUVfQ09MT1IsIGNjLm1hY3JvLlZFUlRFWF9BVFRSSUJfQ09MT1IpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MubWFjcm8uQVRUUklCVVRFX05BTUVfVEVYX0NPT1JELCBjYy5tYWNyby5WRVJURVhfQVRUUklCX1RFWF9DT09SRFMpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5saW5rKCk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnVwZGF0ZVVuaWZvcm1zKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl91X29wYWNpdHkgPSB0aGlzLl9wcm9ncmFtLmdldFVuaWZvcm1Mb2NhdGlvbkZvck5hbWUoXCJ1X29wYWNpdHlcIik7XG5cbiAgICAgICAgY2MubG9nKHRoaXMuX3Vfb3BhY2l0eSk7XG5cbiAgICAgICAgdGhpcy5fdW5pV2lkdGhTdGVwID0gdGhpcy5fcHJvZ3JhbS5nZXRVbmlmb3JtTG9jYXRpb25Gb3JOYW1lKFwid2lkdGhTdGVwXCIpO1xuICAgICAgICB0aGlzLl91bmlIZWlnaHRTdGVwID0gdGhpcy5fcHJvZ3JhbS5nZXRVbmlmb3JtTG9jYXRpb25Gb3JOYW1lKFwiaGVpZ2h0U3RlcFwiKTtcbiAgICAgICAgdGhpcy5fdW5pQmx1clJhZGl1c1NjYWxlID0gdGhpcy5fcHJvZ3JhbS5nZXRVbmlmb3JtTG9jYXRpb25Gb3JOYW1lKFwiYmx1clJhZGl1c1NjYWxlXCIpO1xuXG4gICAgICAgIGlmIChjYy5zeXMuaXNOYXRpdmUpIHtcbiAgICAgICAgICAgIHZhciBnbFByb2dyYW1fc3RhdGUgPSBjYy5HTFByb2dyYW1TdGF0ZS5nZXRPckNyZWF0ZVdpdGhHTFByb2dyYW0odGhpcy5fcHJvZ3JhbSk7XG4gICAgICAgICAgICAvLyBnbFByb2dyYW1fc3RhdGUuc2V0VW5pZm9ybUZsb2F0KCB0aGlzLl91bmlXaWR0aFN0ZXAgLCAoIDEuMCAvIHRoaXMubm9kZS5nZXRDb250ZW50U2l6ZSgpLndpZHRoICkgKTtcbiAgICAgICAgICAgIC8vIGdsUHJvZ3JhbV9zdGF0ZS5zZXRVbmlmb3JtRmxvYXQoIHRoaXMuX3VuaUhlaWdodFN0ZXAgLCAoIDEuMCAvIHRoaXMubm9kZS5nZXRDb250ZW50U2l6ZSgpLmhlaWdodCApICk7XG4gICAgICAgICAgICAvLyBnbFByb2dyYW1fc3RhdGUuc2V0VW5pZm9ybUZsb2F0KCB0aGlzLl91bmlCbHVyUmFkaXVzU2NhbGUgLHRoaXMuZ2xhc3NGYWN0b3IpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDFmKCB0aGlzLl91bmlXaWR0aFN0ZXAsICggMS4wIC8gdGhpcy5ub2RlLmdldENvbnRlbnRTaXplKCkud2lkdGggKSApO1xuICAgICAgICAgICAgICAgIC8vIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDFmKCB0aGlzLl91bmlIZWlnaHRTdGVwLCAoIDEuMCAvIHRoaXMubm9kZS5nZXRDb250ZW50U2l6ZSgpLmhlaWdodCApICk7XG4gICAgICAgICAgICAgICAgLy8gdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMWYoIHRoaXMuX3VuaUJsdXJSYWRpdXNTY2FsZSwgdGhpcy5nbGFzc0ZhY3RvciApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0UHJvZ3JhbSh0aGlzLm5vZGUuX3NnTm9kZSwgdGhpcy5fcHJvZ3JhbSk7XG4gICAgfSxcblxuICAgIHNldFByb2dyYW06IGZ1bmN0aW9uIHNldFByb2dyYW0obm9kZSwgcHJvZ3JhbSkge1xuICAgICAgICBpZiAoY2Muc3lzLmlzTmF0aXZlKSB7XG4gICAgICAgICAgICB2YXIgZ2xQcm9ncmFtX3N0YXRlID0gY2MuR0xQcm9ncmFtU3RhdGUuZ2V0T3JDcmVhdGVXaXRoR0xQcm9ncmFtKHByb2dyYW0pO1xuICAgICAgICAgICAgbm9kZS5zZXRHTFByb2dyYW1TdGF0ZShnbFByb2dyYW1fc3RhdGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbm9kZS5zZXRTaGFkZXJQcm9ncmFtKHByb2dyYW0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGNoaWxkcmVuID0gbm9kZS5jaGlsZHJlbjtcbiAgICAgICAgaWYgKCFjaGlsZHJlbikgcmV0dXJuO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHRoaXMuc2V0UHJvZ3JhbShjaGlsZHJlbltpXSwgcHJvZ3JhbSk7XG4gICAgfVxuXG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzU4OThiOStOejFNdGI5aHBxR2ZqMU1MJywgJ05lZ2F0aXZlX0JsYWNrX1doaXRlJyk7XG4vLyBTY3JpcHQvTmVnYXRpdmVfQmxhY2tfV2hpdGUuanNcblxudmFyIF9kZWZhdWx0X3ZlcnQgPSByZXF1aXJlKFwiLi4vU2hhZGVycy9jY1NoYWRlcl9EZWZhdWx0X1ZlcnQuanNcIik7XG52YXIgX2RlZmF1bHRfdmVydF9ub19tdnAgPSByZXF1aXJlKFwiLi4vU2hhZGVycy9jY1NoYWRlcl9EZWZhdWx0X1ZlcnRfbm9NVlAuanNcIik7XG52YXIgX25lZ2F0aXZlX2JsYWNrX3doaXRlX2ZyYWcgPSByZXF1aXJlKFwiLi4vU2hhZGVycy9jY1NoYWRlcl9OZWdhdGl2ZV9CbGFja19XaGl0ZV9GcmFnLmpzXCIpO1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHt9LFxuXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHRoaXMuX3VzZSgpO1xuICAgIH0sXG5cbiAgICBfdXNlOiBmdW5jdGlvbiBfdXNlKCkge1xuICAgICAgICB0aGlzLl9wcm9ncmFtID0gbmV3IGNjLkdMUHJvZ3JhbSgpO1xuXG4gICAgICAgIGlmIChjYy5zeXMuaXNOYXRpdmUpIHtcbiAgICAgICAgICAgIGNjLmxvZyhcInVzZSBuYXRpdmUgR0xQcm9ncmFtXCIpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5pbml0V2l0aFN0cmluZyhfZGVmYXVsdF92ZXJ0X25vX212cCwgX25lZ2F0aXZlX2JsYWNrX3doaXRlX2ZyYWcpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5saW5rKCk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnVwZGF0ZVVuaWZvcm1zKCk7XG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uaW5pdFdpdGhWZXJ0ZXhTaGFkZXJCeXRlQXJyYXkoX2RlZmF1bHRfdmVydCwgX25lZ2F0aXZlX2JsYWNrX3doaXRlX2ZyYWcpO1xuXG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5tYWNyby5BVFRSSUJVVEVfTkFNRV9QT1NJVElPTiwgY2MubWFjcm8uVkVSVEVYX0FUVFJJQl9QT1NJVElPTik7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5tYWNyby5BVFRSSUJVVEVfTkFNRV9DT0xPUiwgY2MubWFjcm8uVkVSVEVYX0FUVFJJQl9DT0xPUik7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5tYWNyby5BVFRSSUJVVEVfTkFNRV9URVhfQ09PUkQsIGNjLm1hY3JvLlZFUlRFWF9BVFRSSUJfVEVYX0NPT1JEUyk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmxpbmsoKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0udXBkYXRlVW5pZm9ybXMoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0UHJvZ3JhbSh0aGlzLm5vZGUuX3NnTm9kZSwgdGhpcy5fcHJvZ3JhbSk7XG4gICAgfSxcbiAgICBzZXRQcm9ncmFtOiBmdW5jdGlvbiBzZXRQcm9ncmFtKG5vZGUsIHByb2dyYW0pIHtcbiAgICAgICAgaWYgKGNjLnN5cy5pc05hdGl2ZSkge1xuICAgICAgICAgICAgdmFyIGdsUHJvZ3JhbV9zdGF0ZSA9IGNjLkdMUHJvZ3JhbVN0YXRlLmdldE9yQ3JlYXRlV2l0aEdMUHJvZ3JhbShwcm9ncmFtKTtcbiAgICAgICAgICAgIG5vZGUuc2V0R0xQcm9ncmFtU3RhdGUoZ2xQcm9ncmFtX3N0YXRlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5vZGUuc2V0U2hhZGVyUHJvZ3JhbShwcm9ncmFtKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBjaGlsZHJlbiA9IG5vZGUuY2hpbGRyZW47XG4gICAgICAgIGlmICghY2hpbGRyZW4pIHJldHVybjtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB0aGlzLnNldFByb2dyYW0oY2hpbGRyZW5baV0sIHByb2dyYW0pO1xuICAgIH1cblxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICcxMjIzYldJV2hGUGFyUFI3amcwdkhhbicsICdOZWdhdGl2ZV9JbWFnZScpO1xuLy8gU2NyaXB0L05lZ2F0aXZlX0ltYWdlLmpzXG5cbnZhciBfZGVmYXVsdF92ZXJ0ID0gcmVxdWlyZShcIi4uL1NoYWRlcnMvY2NTaGFkZXJfRGVmYXVsdF9WZXJ0LmpzXCIpO1xudmFyIF9kZWZhdWx0X3ZlcnRfbm9fbXZwID0gcmVxdWlyZShcIi4uL1NoYWRlcnMvY2NTaGFkZXJfRGVmYXVsdF9WZXJ0X25vTVZQLmpzXCIpO1xudmFyIF9uZWdhdGl2ZV9pbWFnZV9mcmFnID0gcmVxdWlyZShcIi4uL1NoYWRlcnMvY2NTaGFkZXJfTmVnYXRpdmVfSW1hZ2VfRnJhZy5qc1wiKTtcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7fSxcblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLl91c2UoKTtcbiAgICB9LFxuXG4gICAgX3VzZTogZnVuY3Rpb24gX3VzZSgpIHtcbiAgICAgICAgdGhpcy5fcHJvZ3JhbSA9IG5ldyBjYy5HTFByb2dyYW0oKTtcblxuICAgICAgICBpZiAoY2Muc3lzLmlzTmF0aXZlKSB7XG4gICAgICAgICAgICBjYy5sb2coXCJ1c2UgbmF0aXZlIEdMUHJvZ3JhbVwiKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uaW5pdFdpdGhTdHJpbmcoX2RlZmF1bHRfdmVydF9ub19tdnAsIF9uZWdhdGl2ZV9pbWFnZV9mcmFnKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0ubGluaygpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS51cGRhdGVVbmlmb3JtcygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5pbml0V2l0aFZlcnRleFNoYWRlckJ5dGVBcnJheShfZGVmYXVsdF92ZXJ0LCBfbmVnYXRpdmVfaW1hZ2VfZnJhZyk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5tYWNyby5BVFRSSUJVVEVfTkFNRV9QT1NJVElPTiwgY2MubWFjcm8uVkVSVEVYX0FUVFJJQl9QT1NJVElPTik7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5tYWNyby5BVFRSSUJVVEVfTkFNRV9DT0xPUiwgY2MubWFjcm8uVkVSVEVYX0FUVFJJQl9DT0xPUik7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5tYWNyby5BVFRSSUJVVEVfTkFNRV9URVhfQ09PUkQsIGNjLm1hY3JvLlZFUlRFWF9BVFRSSUJfVEVYX0NPT1JEUyk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmxpbmsoKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0udXBkYXRlVW5pZm9ybXMoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0UHJvZ3JhbSh0aGlzLm5vZGUuX3NnTm9kZSwgdGhpcy5fcHJvZ3JhbSk7XG4gICAgfSxcbiAgICBzZXRQcm9ncmFtOiBmdW5jdGlvbiBzZXRQcm9ncmFtKG5vZGUsIHByb2dyYW0pIHtcbiAgICAgICAgaWYgKGNjLnN5cy5pc05hdGl2ZSkge1xuICAgICAgICAgICAgdmFyIGdsUHJvZ3JhbV9zdGF0ZSA9IGNjLkdMUHJvZ3JhbVN0YXRlLmdldE9yQ3JlYXRlV2l0aEdMUHJvZ3JhbShwcm9ncmFtKTtcbiAgICAgICAgICAgIG5vZGUuc2V0R0xQcm9ncmFtU3RhdGUoZ2xQcm9ncmFtX3N0YXRlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5vZGUuc2V0U2hhZGVyUHJvZ3JhbShwcm9ncmFtKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBjaGlsZHJlbiA9IG5vZGUuY2hpbGRyZW47XG4gICAgICAgIGlmICghY2hpbGRyZW4pIHJldHVybjtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB0aGlzLnNldFByb2dyYW0oY2hpbGRyZW5baV0sIHByb2dyYW0pO1xuICAgIH1cblxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc3YjE1Y0ZTY2hWSGphRDNKcHo0dGphaicsICdTaGFkb3dfQmxhY2tfV2hpdGUnKTtcbi8vIFNjcmlwdC9TaGFkb3dfQmxhY2tfV2hpdGUuanNcblxudmFyIF9kZWZhdWx0X3ZlcnQgPSByZXF1aXJlKFwiLi4vU2hhZGVycy9jY1NoYWRlcl9EZWZhdWx0X1ZlcnQuanNcIik7XG52YXIgX2RlZmF1bHRfdmVydF9ub19tdnAgPSByZXF1aXJlKFwiLi4vU2hhZGVycy9jY1NoYWRlcl9EZWZhdWx0X1ZlcnRfbm9NVlAuanNcIik7XG52YXIgX3NoYWRvd19ibGFja193aGl0ZV9mcmFnID0gcmVxdWlyZShcIi4uL1NoYWRlcnMvY2NTaGFkZXJfU2hhZG93X0JsYWNrX1doaXRlX0ZyYWcuanNcIik7XG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge30sXG5cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5fc3RyZW5ndGggPSAwLjAwMTtcbiAgICAgICAgdGhpcy5fbW90aW9uID0gMDtcblxuICAgICAgICB0aGlzLl91c2UoKTtcbiAgICB9LFxuXG4gICAgX3VzZTogZnVuY3Rpb24gX3VzZSgpIHtcbiAgICAgICAgdGhpcy5fcHJvZ3JhbSA9IG5ldyBjYy5HTFByb2dyYW0oKTtcbiAgICAgICAgaWYgKGNjLnN5cy5pc05hdGl2ZSkge1xuICAgICAgICAgICAgY2MubG9nKFwidXNlIG5hdGl2ZSBHTFByb2dyYW1cIik7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmluaXRXaXRoU3RyaW5nKF9kZWZhdWx0X3ZlcnRfbm9fbXZwLCBfbmVnYXRpdmVfaW1hZ2VfZnJhZyk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmxpbmsoKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0udXBkYXRlVW5pZm9ybXMoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uaW5pdFdpdGhWZXJ0ZXhTaGFkZXJCeXRlQXJyYXkoX2RlZmF1bHRfdmVydCwgX3NoYWRvd19ibGFja193aGl0ZV9mcmFnKTtcblxuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MubWFjcm8uQVRUUklCVVRFX05BTUVfUE9TSVRJT04sIGNjLm1hY3JvLlZFUlRFWF9BVFRSSUJfUE9TSVRJT04pO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MubWFjcm8uQVRUUklCVVRFX05BTUVfQ09MT1IsIGNjLm1hY3JvLlZFUlRFWF9BVFRSSUJfQ09MT1IpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MubWFjcm8uQVRUUklCVVRFX05BTUVfVEVYX0NPT1JELCBjYy5tYWNyby5WRVJURVhfQVRUUklCX1RFWF9DT09SRFMpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5saW5rKCk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnVwZGF0ZVVuaWZvcm1zKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl91bmlTdHJlbmd0aCA9IHRoaXMuX3Byb2dyYW0uZ2V0VW5pZm9ybUxvY2F0aW9uRm9yTmFtZShcInN0cmVuZ3RoXCIpO1xuXG4gICAgICAgIHRoaXMuc2V0UHJvZ3JhbSh0aGlzLm5vZGUuX3NnTm9kZSwgdGhpcy5fcHJvZ3JhbSk7XG4gICAgfSxcbiAgICBzZXRQcm9ncmFtOiBmdW5jdGlvbiBzZXRQcm9ncmFtKG5vZGUsIHByb2dyYW0pIHtcbiAgICAgICAgaWYgKGNjLnN5cy5pc05hdGl2ZSkge1xuICAgICAgICAgICAgdmFyIGdsUHJvZ3JhbV9zdGF0ZSA9IGNjLkdMUHJvZ3JhbVN0YXRlLmdldE9yQ3JlYXRlV2l0aEdMUHJvZ3JhbShwcm9ncmFtKTtcbiAgICAgICAgICAgIG5vZGUuc2V0R0xQcm9ncmFtU3RhdGUoZ2xQcm9ncmFtX3N0YXRlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5vZGUuc2V0U2hhZGVyUHJvZ3JhbShwcm9ncmFtKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBjaGlsZHJlbiA9IG5vZGUuY2hpbGRyZW47XG4gICAgICAgIGlmICghY2hpbGRyZW4pIHJldHVybjtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB0aGlzLnNldFByb2dyYW0oY2hpbGRyZW5baV0sIHByb2dyYW0pO1xuICAgIH0sXG5cbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShkdCkge1xuICAgICAgICBpZiAodGhpcy5fcHJvZ3JhbSkge1xuXG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnVzZSgpO1xuICAgICAgICAgICAgaWYgKGNjLnN5cy5pc05hdGl2ZSkge1xuICAgICAgICAgICAgICAgIHZhciBnbFByb2dyYW1fc3RhdGUgPSBjYy5HTFByb2dyYW1TdGF0ZS5nZXRPckNyZWF0ZVdpdGhHTFByb2dyYW0odGhpcy5fcHJvZ3JhbSk7XG4gICAgICAgICAgICAgICAgZ2xQcm9ncmFtX3N0YXRlLnNldFVuaWZvcm1GbG9hdCh0aGlzLl91bmlTdHJlbmd0aCwgdGhpcy5fbW90aW9uICs9IHRoaXMuX3N0cmVuZ3RoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMWYodGhpcy5fdW5pU3RyZW5ndGgsIHRoaXMuX21vdGlvbiArPSB0aGlzLl9zdHJlbmd0aCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS51cGRhdGVVbmlmb3JtcygpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoMS4wIDwgdGhpcy5fbW90aW9uIHx8IDAuMCA+IHRoaXMuX21vdGlvbikge1xuICAgICAgICAgICAgICAgIHRoaXMuX3N0cmVuZ3RoICo9IC0xO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICcyOTgxMzdzY1lsSm9yZUhWMHVDeWpkZCcsICdVSU1hbmFnZXInKTtcbi8vIFNjcmlwdC9VSU1hbmFnZXIuanNcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGJ0bkdyb3VwUHJlZmFiOiB7XG4gICAgICAgICAgICBcImRlZmF1bHRcIjogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlByZWZhYlxuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB2YXIgYnRuR3JvdXAgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLmJ0bkdyb3VwUHJlZmFiKTtcbiAgICAgICAgYnRuR3JvdXAucGFyZW50ID0gdGhpcy5ub2RlO1xuICAgIH1cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnYmRmMTl5MnBjMVBWb3F4YjBzYnNZdmInLCAnV2F2ZV9IJyk7XG4vLyBTY3JpcHQvV2F2ZV9ILmpzXG5cbnZhciBfZGVmYXVsdF92ZXJ0ID0gcmVxdWlyZShcIi4uL1NoYWRlcnMvY2NTaGFkZXJfRGVmYXVsdF9WZXJ0LmpzXCIpO1xudmFyIF9kZWZhdWx0X3ZlcnRfbm9fbXZwID0gcmVxdWlyZShcIi4uL1NoYWRlcnMvY2NTaGFkZXJfRGVmYXVsdF9WZXJ0X25vTVZQLmpzXCIpO1xudmFyIF93YXZlX2hfZnJhZyA9IHJlcXVpcmUoXCIuLi9TaGFkZXJzL2NjU2hhZGVyX1dhdmVfSF9GcmFnLmpzXCIpO1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHt9LFxuXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHRoaXMuX2FuZ2xlID0gMTU7XG4gICAgICAgIHRoaXMuX21vdGlvbiA9IDA7XG5cbiAgICAgICAgdGhpcy5fdXNlKCk7XG4gICAgfSxcblxuICAgIF91c2U6IGZ1bmN0aW9uIF91c2UoKSB7XG4gICAgICAgIHRoaXMuX3Byb2dyYW0gPSBuZXcgY2MuR0xQcm9ncmFtKCk7XG4gICAgICAgIGlmIChjYy5zeXMuaXNOYXRpdmUpIHtcbiAgICAgICAgICAgIGNjLmxvZyhcInVzZSBuYXRpdmUgR0xQcm9ncmFtXCIpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5pbml0V2l0aFN0cmluZyhfZGVmYXVsdF92ZXJ0X25vX212cCwgX3dhdmVfaF9mcmFnKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0ubGluaygpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS51cGRhdGVVbmlmb3JtcygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5pbml0V2l0aFZlcnRleFNoYWRlckJ5dGVBcnJheShfZGVmYXVsdF92ZXJ0LCBfd2F2ZV9oX2ZyYWcpO1xuXG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5tYWNyby5BVFRSSUJVVEVfTkFNRV9QT1NJVElPTiwgY2MubWFjcm8uVkVSVEVYX0FUVFJJQl9QT1NJVElPTik7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5tYWNyby5BVFRSSUJVVEVfTkFNRV9DT0xPUiwgY2MubWFjcm8uVkVSVEVYX0FUVFJJQl9DT0xPUik7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5tYWNyby5BVFRSSUJVVEVfTkFNRV9URVhfQ09PUkQsIGNjLm1hY3JvLlZFUlRFWF9BVFRSSUJfVEVYX0NPT1JEUyk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmxpbmsoKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0udXBkYXRlVW5pZm9ybXMoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX3VuaU1vdGlvbiA9IHRoaXMuX3Byb2dyYW0uZ2V0VW5pZm9ybUxvY2F0aW9uRm9yTmFtZShcIm1vdGlvblwiKTtcbiAgICAgICAgdGhpcy5fdW5pQW5nbGUgPSB0aGlzLl9wcm9ncmFtLmdldFVuaWZvcm1Mb2NhdGlvbkZvck5hbWUoXCJhbmdsZVwiKTtcblxuICAgICAgICBpZiAoY2Muc3lzLmlzTmF0aXZlKSB7XG4gICAgICAgICAgICB2YXIgZ2xQcm9ncmFtX3N0YXRlID0gY2MuR0xQcm9ncmFtU3RhdGUuZ2V0T3JDcmVhdGVXaXRoR0xQcm9ncmFtKHRoaXMuX3Byb2dyYW0pO1xuICAgICAgICAgICAgZ2xQcm9ncmFtX3N0YXRlLnNldFVuaWZvcm1GbG9hdCh0aGlzLl91bmlBbmdsZSwgdGhpcy5fYW5nbGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMWYodGhpcy5fdW5pQW5nbGUsIHRoaXMuX2FuZ2xlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0UHJvZ3JhbSh0aGlzLm5vZGUuX3NnTm9kZSwgdGhpcy5fcHJvZ3JhbSk7XG4gICAgfSxcbiAgICBzZXRQcm9ncmFtOiBmdW5jdGlvbiBzZXRQcm9ncmFtKG5vZGUsIHByb2dyYW0pIHtcbiAgICAgICAgaWYgKGNjLnN5cy5pc05hdGl2ZSkge1xuICAgICAgICAgICAgdmFyIGdsUHJvZ3JhbV9zdGF0ZSA9IGNjLkdMUHJvZ3JhbVN0YXRlLmdldE9yQ3JlYXRlV2l0aEdMUHJvZ3JhbShwcm9ncmFtKTtcbiAgICAgICAgICAgIG5vZGUuc2V0R0xQcm9ncmFtU3RhdGUoZ2xQcm9ncmFtX3N0YXRlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5vZGUuc2V0U2hhZGVyUHJvZ3JhbShwcm9ncmFtKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBjaGlsZHJlbiA9IG5vZGUuY2hpbGRyZW47XG4gICAgICAgIGlmICghY2hpbGRyZW4pIHJldHVybjtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB0aGlzLnNldFByb2dyYW0oY2hpbGRyZW5baV0sIHByb2dyYW0pO1xuICAgIH0sXG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoZHQpIHtcbiAgICAgICAgaWYgKHRoaXMuX3Byb2dyYW0pIHtcblxuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS51c2UoKTtcbiAgICAgICAgICAgIGlmIChjYy5zeXMuaXNOYXRpdmUpIHtcbiAgICAgICAgICAgICAgICB2YXIgZ2xQcm9ncmFtX3N0YXRlID0gY2MuR0xQcm9ncmFtU3RhdGUuZ2V0T3JDcmVhdGVXaXRoR0xQcm9ncmFtKHRoaXMuX3Byb2dyYW0pO1xuICAgICAgICAgICAgICAgIGdsUHJvZ3JhbV9zdGF0ZS5zZXRVbmlmb3JtRmxvYXQodGhpcy5fdW5pTW90aW9uLCB0aGlzLl9tb3Rpb24gKz0gMC4wNSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDFmKHRoaXMuX3VuaU1vdGlvbiwgdGhpcy5fbW90aW9uICs9IDAuMDUpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0udXBkYXRlVW5pZm9ybXMoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKDEuMGUyMCA8IHRoaXMuX21vdGlvbikge1xuICAgICAgICAgICAgICAgIHRoaXMuX21vdGlvbiA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2I5OTFjQmRnQUZGNDdUdmtEaXNrV0xzJywgJ1dhdmVfVkgnKTtcbi8vIFNjcmlwdC9XYXZlX1ZILmpzXG5cbnZhciBfZGVmYXVsdF92ZXJ0ID0gcmVxdWlyZShcIi4uL1NoYWRlcnMvY2NTaGFkZXJfRGVmYXVsdF9WZXJ0LmpzXCIpO1xudmFyIF9kZWZhdWx0X3ZlcnRfbm9fbXZwID0gcmVxdWlyZShcIi4uL1NoYWRlcnMvY2NTaGFkZXJfRGVmYXVsdF9WZXJ0X25vTVZQLmpzXCIpO1xudmFyIF93YXZlX3ZoX2ZyYWcgPSByZXF1aXJlKFwiLi4vU2hhZGVycy9jY1NoYWRlcl9XYXZlX1ZIX0ZyYWcuanNcIik7XG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge30sXG5cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5fYW5nbGUgPSAxNTtcbiAgICAgICAgdGhpcy5fbW90aW9uID0gMDtcblxuICAgICAgICB0aGlzLl91c2UoKTtcbiAgICB9LFxuXG4gICAgX3VzZTogZnVuY3Rpb24gX3VzZSgpIHtcbiAgICAgICAgdGhpcy5fcHJvZ3JhbSA9IG5ldyBjYy5HTFByb2dyYW0oKTtcbiAgICAgICAgaWYgKGNjLnN5cy5pc05hdGl2ZSkge1xuICAgICAgICAgICAgY2MubG9nKFwidXNlIG5hdGl2ZSBHTFByb2dyYW1cIik7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmluaXRXaXRoU3RyaW5nKF9kZWZhdWx0X3ZlcnRfbm9fbXZwLCBfd2F2ZV92aF9mcmFnKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0ubGluaygpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS51cGRhdGVVbmlmb3JtcygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5pbml0V2l0aFZlcnRleFNoYWRlckJ5dGVBcnJheShfZGVmYXVsdF92ZXJ0LCBfd2F2ZV92aF9mcmFnKTtcblxuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MubWFjcm8uQVRUUklCVVRFX05BTUVfUE9TSVRJT04sIGNjLm1hY3JvLlZFUlRFWF9BVFRSSUJfUE9TSVRJT04pO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MubWFjcm8uQVRUUklCVVRFX05BTUVfQ09MT1IsIGNjLm1hY3JvLlZFUlRFWF9BVFRSSUJfQ09MT1IpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MubWFjcm8uQVRUUklCVVRFX05BTUVfVEVYX0NPT1JELCBjYy5tYWNyby5WRVJURVhfQVRUUklCX1RFWF9DT09SRFMpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5saW5rKCk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnVwZGF0ZVVuaWZvcm1zKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl91bmlNb3Rpb24gPSB0aGlzLl9wcm9ncmFtLmdldFVuaWZvcm1Mb2NhdGlvbkZvck5hbWUoXCJtb3Rpb25cIik7XG4gICAgICAgIHRoaXMuX3VuaUFuZ2xlID0gdGhpcy5fcHJvZ3JhbS5nZXRVbmlmb3JtTG9jYXRpb25Gb3JOYW1lKFwiYW5nbGVcIik7XG5cbiAgICAgICAgaWYgKGNjLnN5cy5pc05hdGl2ZSkge1xuICAgICAgICAgICAgdmFyIGdsUHJvZ3JhbV9zdGF0ZSA9IGNjLkdMUHJvZ3JhbVN0YXRlLmdldE9yQ3JlYXRlV2l0aEdMUHJvZ3JhbSh0aGlzLl9wcm9ncmFtKTtcbiAgICAgICAgICAgIGdsUHJvZ3JhbV9zdGF0ZS5zZXRVbmlmb3JtRmxvYXQodGhpcy5fdW5pQW5nbGUsIHRoaXMuX2FuZ2xlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDFmKHRoaXMuX3VuaUFuZ2xlLCB0aGlzLl9hbmdsZSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNldFByb2dyYW0odGhpcy5ub2RlLl9zZ05vZGUsIHRoaXMuX3Byb2dyYW0pO1xuICAgIH0sXG4gICAgc2V0UHJvZ3JhbTogZnVuY3Rpb24gc2V0UHJvZ3JhbShub2RlLCBwcm9ncmFtKSB7XG4gICAgICAgIGlmIChjYy5zeXMuaXNOYXRpdmUpIHtcbiAgICAgICAgICAgIHZhciBnbFByb2dyYW1fc3RhdGUgPSBjYy5HTFByb2dyYW1TdGF0ZS5nZXRPckNyZWF0ZVdpdGhHTFByb2dyYW0ocHJvZ3JhbSk7XG4gICAgICAgICAgICBub2RlLnNldEdMUHJvZ3JhbVN0YXRlKGdsUHJvZ3JhbV9zdGF0ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBub2RlLnNldFNoYWRlclByb2dyYW0ocHJvZ3JhbSk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgY2hpbGRyZW4gPSBub2RlLmNoaWxkcmVuO1xuICAgICAgICBpZiAoIWNoaWxkcmVuKSByZXR1cm47XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykgdGhpcy5zZXRQcm9ncmFtKGNoaWxkcmVuW2ldLCBwcm9ncmFtKTtcbiAgICB9LFxuXG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoZHQpIHtcbiAgICAgICAgaWYgKHRoaXMuX3Byb2dyYW0pIHtcblxuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS51c2UoKTtcbiAgICAgICAgICAgIGlmIChjYy5zeXMuaXNOYXRpdmUpIHtcbiAgICAgICAgICAgICAgICB2YXIgZ2xQcm9ncmFtX3N0YXRlID0gY2MuR0xQcm9ncmFtU3RhdGUuZ2V0T3JDcmVhdGVXaXRoR0xQcm9ncmFtKHRoaXMuX3Byb2dyYW0pO1xuICAgICAgICAgICAgICAgIGdsUHJvZ3JhbV9zdGF0ZS5zZXRVbmlmb3JtRmxvYXQodGhpcy5fdW5pTW90aW9uLCB0aGlzLl9tb3Rpb24gKz0gMC4wNSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDFmKHRoaXMuX3VuaU1vdGlvbiwgdGhpcy5fbW90aW9uICs9IDAuMDUpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0udXBkYXRlVW5pZm9ybXMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgxLjBlMjAgPCB0aGlzLl9tb3Rpb24pIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9tb3Rpb24gPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc2M2E4Y0RWaThSTmM3OHJKRDEyNmtzOScsICdXYXZlX1YnKTtcbi8vIFNjcmlwdC9XYXZlX1YuanNcblxudmFyIF9kZWZhdWx0X3ZlcnQgPSByZXF1aXJlKFwiLi4vU2hhZGVycy9jY1NoYWRlcl9EZWZhdWx0X1ZlcnQuanNcIik7XG52YXIgX2RlZmF1bHRfdmVydF9ub19tdnAgPSByZXF1aXJlKFwiLi4vU2hhZGVycy9jY1NoYWRlcl9EZWZhdWx0X1ZlcnRfbm9NVlAuanNcIik7XG52YXIgX3dhdmVfdl9mcmFnID0gcmVxdWlyZShcIi4uL1NoYWRlcnMvY2NTaGFkZXJfV2F2ZV9WX0ZyYWcuanNcIik7XG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge30sXG5cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5fYW5nbGUgPSAxNTtcbiAgICAgICAgdGhpcy5fbW90aW9uID0gMDtcblxuICAgICAgICB0aGlzLl91c2UoKTtcbiAgICB9LFxuXG4gICAgX3VzZTogZnVuY3Rpb24gX3VzZSgpIHtcbiAgICAgICAgdGhpcy5fcHJvZ3JhbSA9IG5ldyBjYy5HTFByb2dyYW0oKTtcblxuICAgICAgICBpZiAoY2Muc3lzLmlzTmF0aXZlKSB7XG4gICAgICAgICAgICBjYy5sb2coXCJ1c2UgbmF0aXZlIEdMUHJvZ3JhbVwiKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uaW5pdFdpdGhTdHJpbmcoX2RlZmF1bHRfdmVydF9ub19tdnAsIF93YXZlX3ZfZnJhZyk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmxpbmsoKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0udXBkYXRlVW5pZm9ybXMoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uaW5pdFdpdGhWZXJ0ZXhTaGFkZXJCeXRlQXJyYXkoX2RlZmF1bHRfdmVydCwgX3dhdmVfdl9mcmFnKTtcblxuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MubWFjcm8uQVRUUklCVVRFX05BTUVfUE9TSVRJT04sIGNjLm1hY3JvLlZFUlRFWF9BVFRSSUJfUE9TSVRJT04pO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MubWFjcm8uQVRUUklCVVRFX05BTUVfQ09MT1IsIGNjLm1hY3JvLlZFUlRFWF9BVFRSSUJfQ09MT1IpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MubWFjcm8uQVRUUklCVVRFX05BTUVfVEVYX0NPT1JELCBjYy5tYWNyby5WRVJURVhfQVRUUklCX1RFWF9DT09SRFMpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5saW5rKCk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnVwZGF0ZVVuaWZvcm1zKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl91bmlNb3Rpb24gPSB0aGlzLl9wcm9ncmFtLmdldFVuaWZvcm1Mb2NhdGlvbkZvck5hbWUoXCJtb3Rpb25cIik7XG4gICAgICAgIHRoaXMuX3VuaUFuZ2xlID0gdGhpcy5fcHJvZ3JhbS5nZXRVbmlmb3JtTG9jYXRpb25Gb3JOYW1lKFwiYW5nbGVcIik7XG5cbiAgICAgICAgaWYgKGNjLnN5cy5pc05hdGl2ZSkge1xuICAgICAgICAgICAgdmFyIGdsUHJvZ3JhbV9zdGF0ZSA9IGNjLkdMUHJvZ3JhbVN0YXRlLmdldE9yQ3JlYXRlV2l0aEdMUHJvZ3JhbSh0aGlzLl9wcm9ncmFtKTtcbiAgICAgICAgICAgIGdsUHJvZ3JhbV9zdGF0ZS5zZXRVbmlmb3JtRmxvYXQodGhpcy5fdW5pQW5nbGUsIHRoaXMuX2FuZ2xlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDFmKHRoaXMuX3VuaUFuZ2xlLCB0aGlzLl9hbmdsZSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNldFByb2dyYW0odGhpcy5ub2RlLl9zZ05vZGUsIHRoaXMuX3Byb2dyYW0pO1xuICAgIH0sXG4gICAgc2V0UHJvZ3JhbTogZnVuY3Rpb24gc2V0UHJvZ3JhbShub2RlLCBwcm9ncmFtKSB7XG4gICAgICAgIGlmIChjYy5zeXMuaXNOYXRpdmUpIHtcbiAgICAgICAgICAgIHZhciBnbFByb2dyYW1fc3RhdGUgPSBjYy5HTFByb2dyYW1TdGF0ZS5nZXRPckNyZWF0ZVdpdGhHTFByb2dyYW0ocHJvZ3JhbSk7XG4gICAgICAgICAgICBub2RlLnNldEdMUHJvZ3JhbVN0YXRlKGdsUHJvZ3JhbV9zdGF0ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBub2RlLnNldFNoYWRlclByb2dyYW0ocHJvZ3JhbSk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgY2hpbGRyZW4gPSBub2RlLmNoaWxkcmVuO1xuICAgICAgICBpZiAoIWNoaWxkcmVuKSByZXR1cm47XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykgdGhpcy5zZXRQcm9ncmFtKGNoaWxkcmVuW2ldLCBwcm9ncmFtKTtcbiAgICB9LFxuXG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoZHQpIHtcbiAgICAgICAgaWYgKHRoaXMuX3Byb2dyYW0pIHtcblxuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS51c2UoKTtcbiAgICAgICAgICAgIGlmIChjYy5zeXMuaXNOYXRpdmUpIHtcbiAgICAgICAgICAgICAgICB2YXIgZ2xQcm9ncmFtX3N0YXRlID0gY2MuR0xQcm9ncmFtU3RhdGUuZ2V0T3JDcmVhdGVXaXRoR0xQcm9ncmFtKHRoaXMuX3Byb2dyYW0pO1xuICAgICAgICAgICAgICAgIGdsUHJvZ3JhbV9zdGF0ZS5zZXRVbmlmb3JtRmxvYXQodGhpcy5fdW5pTW90aW9uLCB0aGlzLl9tb3Rpb24gKz0gMC4wNSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDFmKHRoaXMuX3VuaU1vdGlvbiwgdGhpcy5fbW90aW9uICs9IDAuMDUpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0udXBkYXRlVW5pZm9ybXMoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKDEuMGUyMCA8IHRoaXMuX21vdGlvbikge1xuICAgICAgICAgICAgICAgIHRoaXMuX21vdGlvbiA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzFhMmUwbGdmTFZKMloxSkNkY0ZBcjhYJywgJ2NjU2hhZGVyX0F2Z19CbGFja19XaGl0ZV9GcmFnJyk7XG4vLyBTaGFkZXJzL2NjU2hhZGVyX0F2Z19CbGFja19XaGl0ZV9GcmFnLmpzXG5cbi8qIOW5s+Wdh+WAvOm7keeZvSAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IFwiI2lmZGVmIEdMX0VTXFxuXCIgKyBcInByZWNpc2lvbiBtZWRpdW1wIGZsb2F0O1xcblwiICsgXCIjZW5kaWZcXG5cIiArIFwidmFyeWluZyB2ZWMyIHZfdGV4Q29vcmQ7XFxuXCIgKyBcInZvaWQgbWFpbigpXFxuXCIgKyBcIntcXG5cIiArIFwiICAgIHZlYzQgdiA9IHRleHR1cmUyRChDQ19UZXh0dXJlMCwgdl90ZXhDb29yZCkucmdiYTtcXG5cIiArIFwiICAgIGZsb2F0IGYgPSAodi5yICsgdi5nICsgdi5iKSAvIDMuMDtcXG5cIiArIFwiICAgIGdsX0ZyYWdDb2xvciA9IHZlYzQoZiwgZiwgZiwgdi5hKTtcXG5cIiArIFwifVxcblwiO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnOGQ4ZWZIeEQrTkpESkRoanJRbEJISnMnLCAnY2NTaGFkZXJfQmx1cl9FZGdlX0RldGFpbF9GcmFnJyk7XG4vLyBTaGFkZXJzL2NjU2hhZGVyX0JsdXJfRWRnZV9EZXRhaWxfRnJhZy5qc1xuXG4vKiDmqKHns4ogMC41ICAgICAqL1xuLyog5qih57OKIDEuMCAgICAgKi9cbi8qIOe7huiKgiAtMi4wICAgICovXG4vKiDnu4boioIgLTUuMCAgICAqL1xuLyog57uG6IqCIC0xMC4wICAgKi9cbi8qIOi+uee8mCAyLjAgICAgICovXG4vKiDovrnnvJggNS4wICAgICAqL1xuLyog6L6557yYIDEwLjAgICAgKi9cblxubW9kdWxlLmV4cG9ydHMgPSBcInByZWNpc2lvbiBtZWRpdW1wIGZsb2F0O1xcblwiICsgXCJ2YXJ5aW5nIHZlYzIgdl90ZXhDb29yZDtcXG5cIiArIFwidW5pZm9ybSBmbG9hdCB3aWR0aFN0ZXA7XFxuXCIgKyBcInVuaWZvcm0gZmxvYXQgaGVpZ2h0U3RlcDtcXG5cIiArIFwidW5pZm9ybSBmbG9hdCBzdHJlbmd0aDtcXG5cIiArIFwiY29uc3QgZmxvYXQgYmx1clJhZGl1cyA9IDIuMDtcXG5cIiArIFwiY29uc3QgZmxvYXQgYmx1clBpeGVscyA9IChibHVyUmFkaXVzICogMi4wICsgMS4wKSAqIChibHVyUmFkaXVzICogMi4wICsgMS4wKTtcXG5cIiArIFwidm9pZCBtYWluKClcXG5cIiArIFwie1xcblwiICsgXCIgICAgdmVjMyBzdW1Db2xvciA9IHZlYzMoMC4wLCAwLjAsIDAuMCk7XFxuXCIgKyBcIiAgICBmb3IoZmxvYXQgZnkgPSAtYmx1clJhZGl1czsgZnkgPD0gYmx1clJhZGl1czsgKytmeSlcXG5cIiArIFwiICAgIHtcXG5cIiArIFwiICAgICAgICBmb3IoZmxvYXQgZnggPSAtYmx1clJhZGl1czsgZnggPD0gYmx1clJhZGl1czsgKytmeClcXG5cIiArIFwiICAgICAgICB7XFxuXCIgKyBcIiAgICAgICAgICAgIHZlYzIgY29vcmQgPSB2ZWMyKGZ4ICogd2lkdGhTdGVwLCBmeSAqIGhlaWdodFN0ZXApO1xcblwiICsgXCIgICAgICAgICAgICBzdW1Db2xvciArPSB0ZXh0dXJlMkQoQ0NfVGV4dHVyZTAsIHZfdGV4Q29vcmQgKyBjb29yZCkucmdiO1xcblwiICsgXCIgICAgICAgIH1cXG5cIiArIFwiICAgIH1cXG5cIiArIFwiICAgIGdsX0ZyYWdDb2xvciA9IHZlYzQobWl4KHRleHR1cmUyRChDQ19UZXh0dXJlMCwgdl90ZXhDb29yZCkucmdiLCBzdW1Db2xvciAvIGJsdXJQaXhlbHMsIHN0cmVuZ3RoKSwgMS4wKTtcXG5cIiArIFwifVxcblwiO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnMTc4NjFtM0daQkVHSUxieXZGT25ZTzEnLCAnY2NTaGFkZXJfQ2lyY2xlX0VmZmVjdDJfRnJhZycpO1xuLy8gU2hhZGVycy9jY1NoYWRlcl9DaXJjbGVfRWZmZWN0Ml9GcmFnLmpzXG5cbm1vZHVsZS5leHBvcnRzID0gXCJwcmVjaXNpb24gbWVkaXVtcCBmbG9hdDtcXG5cIiArIFwidmFyeWluZyB2ZWMyIHZfdGV4Q29vcmQ7XFxuXCIgKyBcInVuaWZvcm0gZmxvYXQgdGltZTtcXG5cIiArIFwidW5pZm9ybSB2ZWMyIG1vdXNlX3RvdWNoO1xcblwiICsgXCJ1bmlmb3JtIHZlYzIgcmVzb2x1dGlvbjtcXG5cIiArIFwidm9pZCBtYWluKCB2b2lkICkge1xcblwiICsgXCJcXG5cIiArIFwiXHR2ZWMyIHBvc2l0aW9uID0gKCBnbF9GcmFnQ29vcmQueHkgLyByZXNvbHV0aW9uLnh5ICkgKyBtb3VzZV90b3VjaCAvIDQuMDtcXG5cIiArIFwiXFxuXCIgKyBcIlx0ZmxvYXQgY29sb3IgPSAwLjA7XFxuXCIgKyBcIlx0Y29sb3IgKz0gc2luKCBwb3NpdGlvbi54ICogY29zKCB0aW1lIC8gMTUuMCApICogODAuMCApICsgY29zKCBwb3NpdGlvbi55ICogY29zKCB0aW1lIC8gMTUuMCApICogMTAuMCApO1xcblwiICsgXCJcdGNvbG9yICs9IHNpbiggcG9zaXRpb24ueSAqIHNpbiggdGltZSAvIDEwLjAgKSAqIDQwLjAgKSArIGNvcyggcG9zaXRpb24ueCAqIHNpbiggdGltZSAvIDI1LjAgKSAqIDQwLjAgKTtcXG5cIiArIFwiXHRjb2xvciArPSBzaW4oIHBvc2l0aW9uLnggKiBzaW4oIHRpbWUgLyA1LjAgKSAqIDEwLjAgKSArIHNpbiggcG9zaXRpb24ueSAqIHNpbiggdGltZSAvIDM1LjAgKSAqIDgwLjAgKTtcXG5cIiArIFwiXHRjb2xvciAqPSBzaW4oIHRpbWUgLyAxMC4wICkgKiAwLjU7XFxuXCIgKyBcIlxcblwiICsgXCJcdGdsX0ZyYWdDb2xvciA9IHZlYzQoIHZlYzMoIGNvbG9yLCBjb2xvciAqIDAuNSwgc2luKCBjb2xvciArIHRpbWUgLyAzLjAgKSAqIDAuNzUgKSwgMS4wICk7XFxuXCIgKyBcIlxcblwiICsgXCJ9XFxuXCI7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc4MDljMEY3WlBOQStvcnNNQzlOSEVGNicsICdjY1NoYWRlcl9DaXJjbGVfTGlnaHRfRnJhZycpO1xuLy8gU2hhZGVycy9jY1NoYWRlcl9DaXJjbGVfTGlnaHRfRnJhZy5qc1xuXG5tb2R1bGUuZXhwb3J0cyA9IFwicHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7XFxuXCIgKyBcInZhcnlpbmcgdmVjMiB2X3RleENvb3JkO1xcblwiICsgXCJ1bmlmb3JtIGZsb2F0IHRpbWU7XFxuXCIgKyBcInVuaWZvcm0gdmVjMiBtb3VzZV90b3VjaDtcXG5cIiArIFwidW5pZm9ybSB2ZWMyIHJlc29sdXRpb247XFxuXCIgKyBcIlxcblwiICsgXCJ2b2lkIG1haW4oIHZvaWQgKSB7XFxuXCIgKyBcIiAgZmxvYXQgdD10aW1lO1xcblwiICsgXCIgIHZlYzIgdG91Y2g9bW91c2VfdG91Y2g7XFxuXCIgKyBcIiAgdmVjMiByZXNvbHV0aW9uMnM9cmVzb2x1dGlvbjtcXG5cIiArIFwiICB2ZWMyIHBvc2l0aW9uID0gKChnbF9GcmFnQ29vcmQueHkgLyByZXNvbHV0aW9uLnh5KSAqIDIuIC0gMS4pICogdmVjMihyZXNvbHV0aW9uLnggLyByZXNvbHV0aW9uLnksIDEuMCk7XFxuXCIgKyBcIiAgZmxvYXQgZCA9IGFicygwLjEgKyBsZW5ndGgocG9zaXRpb24pIC0gMC41ICogYWJzKHNpbih0aW1lKSkpICogNS4wO1xcblwiICsgXCIgIHZlYzMgc3VtQ29sb3IgPSB2ZWMzKDAuMCwgMC4wLCAwLjApO1xcblwiICsgXCJcdHN1bUNvbG9yICs9IHRleHR1cmUyRChDQ19UZXh0dXJlMCwgdl90ZXhDb29yZCkucmdiO1xcblwiICsgXCJcdGdsX0ZyYWdDb2xvciA9IHZlYzQoc3VtQ29sb3Iuci9kLCBzdW1Db2xvci5nLCBzdW1Db2xvci5iLCBtb3VzZV90b3VjaC54LzgwMC4wICk7XFxuXCIgKyBcIlxcblwiICsgXCJ9XFxuXCI7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc0MzkwMkVFcTloRFZJV0g3T0JFaGJ2VCcsICdjY1NoYWRlcl9EZWZhdWx0X1ZlcnRfbm9NVlAnKTtcbi8vIFNoYWRlcnMvY2NTaGFkZXJfRGVmYXVsdF9WZXJ0X25vTVZQLmpzXG5cbm1vZHVsZS5leHBvcnRzID0gXCJhdHRyaWJ1dGUgdmVjNCBhX3Bvc2l0aW9uO1xcblwiICsgXCIgYXR0cmlidXRlIHZlYzIgYV90ZXhDb29yZDtcXG5cIiArIFwiIGF0dHJpYnV0ZSB2ZWM0IGFfY29sb3I7XFxuXCIgKyBcIiB2YXJ5aW5nIHZlYzIgdl90ZXhDb29yZDtcXG5cIiArIFwiIHZhcnlpbmcgdmVjNCB2X2ZyYWdtZW50Q29sb3I7XFxuXCIgKyBcIiB2b2lkIG1haW4oKVxcblwiICsgXCIge1xcblwiICsgXCIgICAgIGdsX1Bvc2l0aW9uID0gQ0NfUE1hdHJpeCAgKiBhX3Bvc2l0aW9uO1xcblwiICsgXCIgICAgIHZfZnJhZ21lbnRDb2xvciA9IGFfY29sb3I7XFxuXCIgKyBcIiAgICAgdl90ZXhDb29yZCA9IGFfdGV4Q29vcmQ7XFxuXCIgKyBcIiB9IFxcblwiO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnNDQwZjVXN3V2Vk5BYVp4NEFMem9aTjgnLCAnY2NTaGFkZXJfRGVmYXVsdF9WZXJ0Jyk7XG4vLyBTaGFkZXJzL2NjU2hhZGVyX0RlZmF1bHRfVmVydC5qc1xuXG5tb2R1bGUuZXhwb3J0cyA9IFwiYXR0cmlidXRlIHZlYzQgYV9wb3NpdGlvbjtcXG5cIiArIFwiIGF0dHJpYnV0ZSB2ZWMyIGFfdGV4Q29vcmQ7XFxuXCIgKyBcIiBhdHRyaWJ1dGUgdmVjNCBhX2NvbG9yO1xcblwiICsgXCIgdmFyeWluZyB2ZWMyIHZfdGV4Q29vcmQ7XFxuXCIgKyBcIiB2YXJ5aW5nIHZlYzQgdl9mcmFnbWVudENvbG9yO1xcblwiICsgXCIgdm9pZCBtYWluKClcXG5cIiArIFwiIHtcXG5cIiArIFwiICAgICBnbF9Qb3NpdGlvbiA9ICggQ0NfUE1hdHJpeCAqIENDX01WTWF0cml4ICkgKiBhX3Bvc2l0aW9uO1xcblwiICsgXCIgICAgIHZfZnJhZ21lbnRDb2xvciA9IGFfY29sb3I7XFxuXCIgKyBcIiAgICAgdl90ZXhDb29yZCA9IGFfdGV4Q29vcmQ7XFxuXCIgKyBcIiB9IFxcblwiO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnMTFmMDdwNU1QeEY2cEtOa3d1TXZaSHUnLCAnY2NTaGFkZXJfRWZmZWN0MDNfRnJhZycpO1xuLy8gU2hhZGVycy9jY1NoYWRlcl9FZmZlY3QwM19GcmFnLmpzXG5cbm1vZHVsZS5leHBvcnRzID0gXCJwcmVjaXNpb24gbWVkaXVtcCBmbG9hdDtcXG5cIiArIFwiXFxuXCIgKyBcInVuaWZvcm0gZmxvYXQgdGltZTtcXG5cIiArIFwidW5pZm9ybSB2ZWMyIG1vdXNlX3RvdWNoO1xcblwiICsgXCJ1bmlmb3JtIHZlYzIgcmVzb2x1dGlvbjtcXG5cIiArIFwiXFxuXCIgKyBcImZsb2F0IHNwaEludGVyc2VjdCh2ZWMzIHJvLCB2ZWMzIHJkLCB2ZWM0IHNwaClcXG5cIiArIFwie1xcblwiICsgXCIgICAgdmVjMyBvYyA9IHJvIC0gc3BoLnh5ejtcXG5cIiArIFwiICAgIGZsb2F0IGIgPSBkb3QoIG9jLCByZCApO1xcblwiICsgXCIgICAgZmxvYXQgYyA9IGRvdCggb2MsIG9jICkgLSBzcGgudypzcGgudztcXG5cIiArIFwiICAgIGZsb2F0IGggPSBiKmIgLSBjO1xcblwiICsgXCIgICAgaWYoIGg8MC4wICkgcmV0dXJuIC0xLjA7XFxuXCIgKyBcIiAgICBoID0gc3FydCggaCApO1xcblwiICsgXCIgICAgcmV0dXJuIC1iIC0gaDtcXG5cIiArIFwifVxcblwiICsgXCJcXG5cIiArIFwidm9pZCBtYWluKClcXG5cIiArIFwie1xcblwiICsgXCJcdHZlYzIgbW8gPSBtb3VzZV90b3VjaCAqIDIuMCAtIDEuMDtcXG5cIiArIFwiXHR2ZWMzIGNvbCA9IHZlYzMoMC41LCAxLCAxKTtcXG5cIiArIFwiXHRmbG9hdCBhc3BlY3QgPSByZXNvbHV0aW9uLnggLyByZXNvbHV0aW9uLnk7XFxuXCIgKyBcIlxcblwiICsgXCJcdHZlYzIgdXYgPSAoZ2xfRnJhZ0Nvb3JkLnh5IC8gcmVzb2x1dGlvbi54eSkgKiAyLjAgLSAxLjA7XFxuXCIgKyBcIlx0dXYueCAqPSBhc3BlY3Q7XFxuXCIgKyBcIlxcblwiICsgXCJcdHZlYzMgcmRpciA9IG5vcm1hbGl6ZSh2ZWMzKHV2LCAzLjApKTtcXG5cIiArIFwiXHR2ZWMzIHJwb3MgPSB2ZWMzKDAsIDAsIC0xMCk7XFxuXCIgKyBcIlxcblwiICsgXCJcdGZsb2F0IGRpc3QgPSBzcGhJbnRlcnNlY3QocnBvcywgcmRpciwgdmVjNCgwLCAwLCAwLCAxLjUpKTtcXG5cIiArIFwiXHRpZihkaXN0ICE9IC0xLjApe1xcblwiICsgXCJcdFx0dmVjMyBsZGlyID0gdmVjMyhtby54LCBtby55LCAtMS4wKTtcXG5cIiArIFwiXHRcdHZlYzMgc25vcm0gPSBub3JtYWxpemUocnBvcyArIHJkaXIgKiBkaXN0KTtcXG5cIiArIFwiXHRcdGNvbCA9IHZlYzMoMSwgMCwgMCkgKiBtYXgoZG90KHNub3JtLCBsZGlyKSwgMC4wKTtcXG5cIiArIFwiXHR9XFxuXCIgKyBcIlxcblwiICsgXCJcdGNvbCA9IHBvdyhjb2wsIHZlYzMoMC40NTQ1NDUpKTtcXG5cIiArIFwiXHRnbF9GcmFnQ29sb3IgPSB2ZWM0KGNvbCwgMS4wKTtcXG5cIiArIFwifVxcblwiO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnMDA2NzZuOHBWQkZZSnNYM1ZiK25BZVYnLCAnY2NTaGFkZXJfRWZmZWN0MDRfRnJhZycpO1xuLy8gU2hhZGVycy9jY1NoYWRlcl9FZmZlY3QwNF9GcmFnLmpzXG5cbm1vZHVsZS5leHBvcnRzID0gXCIjaWZkZWYgR0xfRVNcXG5cIiArIFwicHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7XFxuXCIgKyBcIiNlbmRpZlxcblwiICsgXCJcXG5cIiArIFwidW5pZm9ybSBmbG9hdCB0aW1lO1xcblwiICsgXCJ1bmlmb3JtIHZlYzIgbW91c2VfdG91Y2g7XFxuXCIgKyBcInVuaWZvcm0gdmVjMiByZXNvbHV0aW9uO1xcblwiICsgXCJcXG5cIiArIFwidm9pZCBtYWluKCB2b2lkICkge1xcblwiICsgXCJcXG5cIiArIFwiXHR2ZWMyIHAgPSAoMi4wKmdsX0ZyYWdDb29yZC54eS1yZXNvbHV0aW9uLnh5KS9yZXNvbHV0aW9uLnk7XFxuXCIgKyBcIiAgICBmbG9hdCB0YXUgPSAzLjE0MTU5MjY1MzU7XFxuXCIgKyBcIiAgICBmbG9hdCBhID0gc2luKHRpbWUpO1xcblwiICsgXCIgICAgZmxvYXQgciA9IGxlbmd0aChwKSowLjc1O1xcblwiICsgXCIgICAgdmVjMiB1diA9IHZlYzIoYS90YXUscik7XFxuXCIgKyBcIlx0XFxuXCIgKyBcIlx0Ly9nZXQgdGhlIGNvbG9yXFxuXCIgKyBcIlx0ZmxvYXQgeENvbCA9ICh1di54IC0gKHRpbWUgLyAzLjApKSAqIDMuMDtcXG5cIiArIFwiXHR4Q29sID0gbW9kKHhDb2wsIDMuMCk7XFxuXCIgKyBcIlx0dmVjMyBob3JDb2xvdXIgPSB2ZWMzKHNpbih0aW1lKjIuOTkpKjEuMjUsIHNpbih0aW1lKjMuMTExKSowLjI1LCBzaW4odGltZSoxLjMxKSowLjI1KTtcXG5cIiArIFwiXHRcXG5cIiArIFwiXHRpZiAoeENvbCA8IC4xKSB7XFxuXCIgKyBcIlx0XHRcXG5cIiArIFwiXHRcdGhvckNvbG91ci5yICs9IDEuMCAtIHhDb2w7XFxuXCIgKyBcIlx0XHRob3JDb2xvdXIuZyArPSB4Q29sO1xcblwiICsgXCJcdH1cXG5cIiArIFwiXHRlbHNlIGlmICh4Q29sIDwgMC40KSB7XFxuXCIgKyBcIlx0XHRcXG5cIiArIFwiXHRcdHhDb2wgLT0gMS4wO1xcblwiICsgXCJcdFx0aG9yQ29sb3VyLmcgKz0gMS4wIC0geENvbDtcXG5cIiArIFwiXHRcdGhvckNvbG91ci5iICs9IHhDb2w7XFxuXCIgKyBcIlx0fVxcblwiICsgXCJcdGVsc2Uge1xcblwiICsgXCJcdFx0XFxuXCIgKyBcIlx0XHR4Q29sIC09IDIuMDtcXG5cIiArIFwiXHRcdGhvckNvbG91ci5iICs9IDEuMCAtIHhDb2w7XFxuXCIgKyBcIlx0XHRob3JDb2xvdXIuciArPSB4Q29sO1xcblwiICsgXCJcdH1cXG5cIiArIFwiXFxuXCIgKyBcIlx0Ly8gZHJhdyBjb2xvciBiZWFtXFxuXCIgKyBcIlx0dXYgPSAoMy4wICogdXYpIC0gYWJzKHNpbih0aW1lKSk7XFxuXCIgKyBcIlx0ZmxvYXQgYmVhbVdpZHRoID0gLjArMS4xKmFicygoc2luKHRpbWUpKjAuMioyLjApIC8gKDMuMCAqIHV2LnggKiB1di55KSk7XFxuXCIgKyBcIlx0dmVjMyBob3JCZWFtID0gdmVjMyhiZWFtV2lkdGgpO1xcblwiICsgXCJcdGdsX0ZyYWdDb2xvciA9IHZlYzQoKCggaG9yQmVhbSkgKiBob3JDb2xvdXIpLCAxLjApO1xcblwiICsgXCJ9XFxuXCI7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICczMzdlYkJoTzNGQUlvNlg5Ykkzc283MCcsICdjY1NoYWRlcl9FZmZlY3QwNV9GcmFnJyk7XG4vLyBTaGFkZXJzL2NjU2hhZGVyX0VmZmVjdDA1X0ZyYWcuanNcblxubW9kdWxlLmV4cG9ydHMgPSBcIiNpZmRlZiBHTF9FU1xcblwiICsgXCJwcmVjaXNpb24gaGlnaHAgZmxvYXQ7XFxuXCIgKyBcIiNlbmRpZlxcblwiICsgXCJcXG5cIiArIFwidW5pZm9ybSBmbG9hdCB0aW1lO1xcblwiICsgXCJ1bmlmb3JtIHZlYzIgbW91c2U7XFxuXCIgKyBcInVuaWZvcm0gdmVjMiByZXNvbHV0aW9uO1xcblwiICsgXCJcXG5cIiArIFwiI2RlZmluZSBNX1BJIDMuMTQxNTkyNjUzNTg5NzkzMjM4NDYyNjQzMzgzMjc5NVxcblwiICsgXCJcXG5cIiArIFwidm9pZCBtYWluKCB2b2lkICkge1xcblwiICsgXCIgIGZsb2F0IHRpbWUyID0gdGltZTtcXG5cIiArIFwiICB2ZWMyIG1vdXNlMiA9IG1vdXNlO1xcblwiICsgXCJcdGZsb2F0IHJhZGl1cyA9IDAuNzU7XFxuXCIgKyBcIlx0dmVjMiBwID0gKGdsX0ZyYWdDb29yZC54eSAqIDIuMCAtIHJlc29sdXRpb24pIC8gbWluKHJlc29sdXRpb24ueCwgcmVzb2x1dGlvbi55KTtcXG5cIiArIFwiXHQvLyBhc3NpZ24gY29sb3Igb25seSB0byB0aGUgcG9pbnRzIHRoYXQgYXJlIGluc2lkZSBvZiB0aGUgY2lyY2xlXFxuXCIgKyBcIlx0Z2xfRnJhZ0NvbG9yID0gdmVjNChzbW9vdGhzdGVwKDAuMCwxLjAsIHBvdyhyYWRpdXMgLSBsZW5ndGgocCksMC4wNSkgKSk7XHRcXG5cIiArIFwifVwiO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnMGQyZTVOVDN0RkpaSWJ2R1lXWEVoMG0nLCAnY2NTaGFkZXJfRWZmZWN0MDZfRnJhZycpO1xuLy8gU2hhZGVycy9jY1NoYWRlcl9FZmZlY3QwNl9GcmFnLmpzXG5cbm1vZHVsZS5leHBvcnRzID0gXCIjaWZkZWYgR0xfRVNcXG5cIiArIFwicHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7XFxuXCIgKyBcIiNlbmRpZlxcblwiICsgXCJcXG5cIiArIFwiLy8gUHlnb2xhbXBpcyAyXFxuXCIgKyBcIlxcblwiICsgXCJ1bmlmb3JtIGZsb2F0IHRpbWU7XFxuXCIgKyBcInVuaWZvcm0gdmVjMiBtb3VzZTtcXG5cIiArIFwidW5pZm9ybSB2ZWMyIHJlc29sdXRpb247XFxuXCIgKyBcIlxcblwiICsgXCJjb25zdCBpbnQgbnVtQmxvYnMgPSAxMjg7XFxuXCIgKyBcIlxcblwiICsgXCJ2b2lkIG1haW4oIHZvaWQgKSB7XFxuXCIgKyBcIlxcblwiICsgXCJcdHZlYzIgcCA9IChnbF9GcmFnQ29vcmQueHkgLyByZXNvbHV0aW9uLngpIC0gdmVjMigwLjUsIDAuNSAqIChyZXNvbHV0aW9uLnkgLyByZXNvbHV0aW9uLngpKTtcXG5cIiArIFwiXFxuXCIgKyBcIlx0dmVjMyBjID0gdmVjMygwLjApO1xcblwiICsgXCJcdGZvciAoaW50IGk9MDsgaTxudW1CbG9iczsgaSsrKVxcblwiICsgXCJcdHtcXG5cIiArIFwiXHRcdGZsb2F0IHB4ID0gc2luKGZsb2F0KGkpKjAuMSArIDAuNSkgKiAwLjQ7XFxuXCIgKyBcIlx0XHRmbG9hdCBweSA9IHNpbihmbG9hdChpKmkpKjAuMDEgKyAwLjQqdGltZSkgKiAwLjI7XFxuXCIgKyBcIlx0XHRmbG9hdCBweiA9IHNpbihmbG9hdChpKmkqaSkqMC4wMDEgKyAwLjMqdGltZSkgKiAwLjMgKyAwLjQ7XFxuXCIgKyBcIlx0XHRmbG9hdCByYWRpdXMgPSAwLjAwNSAvIHB6O1xcblwiICsgXCJcdFx0dmVjMiBwb3MgPSBwICsgdmVjMihweCwgcHkpO1xcblwiICsgXCJcdFx0ZmxvYXQgeiA9IHJhZGl1cyAtIGxlbmd0aChwb3MpO1xcblwiICsgXCJcdFx0aWYgKHogPCAwLjApIHogPSAwLjA7XFxuXCIgKyBcIlx0XHRmbG9hdCBjYyA9IHogLyByYWRpdXM7XFxuXCIgKyBcIlx0XHRjICs9IHZlYzMoY2MgKiAoc2luKGZsb2F0KGkqaSppKSkgKiAwLjUgKyAwLjUpLCBjYyAqIChzaW4oZmxvYXQoaSppKmkqaSppKSkgKiAwLjUgKyAwLjUpLCBjYyAqIChzaW4oZmxvYXQoaSppKmkqaSkpICogMC41ICsgMC41KSk7XFxuXCIgKyBcIlx0fVxcblwiICsgXCJcXG5cIiArIFwiXHRnbF9GcmFnQ29sb3IgPSB2ZWM0KGMueCtwLnksIGMueStwLnksIGMueitwLnksIDEuMCk7XFxuXCIgKyBcIn1cXG5cIjtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzhkYTZjc3oxWGhHcnJkR1lUNVN3d2pWJywgJ2NjU2hhZGVyX0VmZmVjdDA3X0ZyYWcnKTtcbi8vIFNoYWRlcnMvY2NTaGFkZXJfRWZmZWN0MDdfRnJhZy5qc1xuXG5tb2R1bGUuZXhwb3J0cyA9IFwiI2lmZGVmIEdMX0VTXFxuXCIgKyBcInByZWNpc2lvbiBtZWRpdW1wIGZsb2F0O1xcblwiICsgXCIjZW5kaWZcXG5cIiArIFwiXFxuXCIgKyBcInVuaWZvcm0gZmxvYXQgdGltZTtcXG5cIiArIFwidW5pZm9ybSB2ZWMyIG1vdXNlX3RvdWNoO1xcblwiICsgXCJ1bmlmb3JtIHZlYzIgcmVzb2x1dGlvbjtcXG5cIiArIFwiXFxuXCIgKyBcInZvaWQgbWFpbiggdm9pZCApIHtcXG5cIiArIFwiXFxuXCIgKyBcIlx0dmVjMiBwID0gKDIuMCpnbF9GcmFnQ29vcmQueHktcmVzb2x1dGlvbi54eSkvcmVzb2x1dGlvbi55O1xcblwiICsgXCIgICAgZmxvYXQgdGF1ID0gMy4xNDE1OTI2NTM1O1xcblwiICsgXCIgICAgZmxvYXQgYSA9IHNpbih0aW1lKTtcXG5cIiArIFwiICAgIGZsb2F0IHIgPSBsZW5ndGgocCkqMC43NTtcXG5cIiArIFwiICAgIHZlYzIgdXYgPSB2ZWMyKGEvdGF1LHIpO1xcblwiICsgXCJcdFxcblwiICsgXCJcdC8vZ2V0IHRoZSBjb2xvclxcblwiICsgXCJcdGZsb2F0IHhDb2wgPSAodXYueCAtICh0aW1lIC8gMy4wKSkgKiAzLjA7XFxuXCIgKyBcIlx0eENvbCA9IG1vZCh4Q29sLCAzLjApO1xcblwiICsgXCJcdHZlYzMgaG9yQ29sb3VyID0gdmVjMyhzaW4odGltZSoyLjk5KSoxLjI1LCBzaW4odGltZSozLjExMSkqMC4yNSwgc2luKHRpbWUqMS4zMSkqMC4yNSk7XFxuXCIgKyBcIlx0XFxuXCIgKyBcIlx0aWYgKHhDb2wgPCAuMSkge1xcblwiICsgXCJcdFx0XFxuXCIgKyBcIlx0XHRob3JDb2xvdXIuciArPSAxLjAgLSB4Q29sO1xcblwiICsgXCJcdFx0aG9yQ29sb3VyLmcgKz0geENvbDtcXG5cIiArIFwiXHR9XFxuXCIgKyBcIlx0ZWxzZSBpZiAoeENvbCA8IDAuNCkge1xcblwiICsgXCJcdFx0XFxuXCIgKyBcIlx0XHR4Q29sIC09IDEuMDtcXG5cIiArIFwiXHRcdGhvckNvbG91ci5nICs9IDEuMCAtIHhDb2w7XFxuXCIgKyBcIlx0XHRob3JDb2xvdXIuYiArPSB4Q29sO1xcblwiICsgXCJcdH1cXG5cIiArIFwiXHRlbHNlIHtcXG5cIiArIFwiXHRcdFxcblwiICsgXCJcdFx0eENvbCAtPSAyLjA7XFxuXCIgKyBcIlx0XHRob3JDb2xvdXIuYiArPSAxLjAgLSB4Q29sO1xcblwiICsgXCJcdFx0aG9yQ29sb3VyLnIgKz0geENvbDtcXG5cIiArIFwiXHR9XFxuXCIgKyBcIlxcblwiICsgXCJcdC8vIGRyYXcgY29sb3IgYmVhbVxcblwiICsgXCJcdHV2ID0gKDMuMCAqIHV2KSAtIGFicyhzaW4odGltZSkpO1xcblwiICsgXCJcdGZsb2F0IGJlYW1XaWR0aCA9IC4wKzEuMSphYnMoKHNpbih0aW1lKSowLjIqMi4wKSAvICgzLjAgKiB1di54ICogdXYueSkpO1xcblwiICsgXCJcdHZlYzMgaG9yQmVhbSA9IHZlYzMoYmVhbVdpZHRoKTtcXG5cIiArIFwiXHRnbF9GcmFnQ29sb3IgPSB2ZWM0KCgoIGhvckJlYW0pICogaG9yQ29sb3VyKSwgMS4wKTtcXG5cIiArIFwifVxcblwiO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnMmIzZGF0akNlcEE2Wk4zRjV5Vy95QVQnLCAnY2NTaGFkZXJfRWZmZWN0MDhfRnJhZycpO1xuLy8gU2hhZGVycy9jY1NoYWRlcl9FZmZlY3QwOF9GcmFnLmpzXG5cbm1vZHVsZS5leHBvcnRzID0gXCIjaWZkZWYgR0xfRVNcXG5cIiArIFwicHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7XFxuXCIgKyBcIiNlbmRpZlxcblwiICsgXCJcXG5cIiArIFwidW5pZm9ybSBmbG9hdCB0aW1lO1xcblwiICsgXCJ1bmlmb3JtIHZlYzIgbW91c2VfdG91Y2g7XFxuXCIgKyBcInVuaWZvcm0gdmVjMiByZXNvbHV0aW9uO1xcblwiICsgXCJcXG5cIiArIFwidm9pZCBtYWluKCB2b2lkICkge1xcblwiICsgXCJcXG5cIiArIFwiXHR2ZWMyIHAgPSAoMi4wKmdsX0ZyYWdDb29yZC54eS1yZXNvbHV0aW9uLnh5KS9yZXNvbHV0aW9uLnk7XFxuXCIgKyBcIiAgICBmbG9hdCB0YXUgPSAzLjE0MTU5MjY1MzU7XFxuXCIgKyBcIiAgICBmbG9hdCBhID0gc2luKHRpbWUpO1xcblwiICsgXCIgICAgZmxvYXQgciA9IGxlbmd0aChwKSowLjc1O1xcblwiICsgXCIgICAgdmVjMiB1diA9IHZlYzIoYS90YXUscik7XFxuXCIgKyBcIlx0XFxuXCIgKyBcIlx0Ly9nZXQgdGhlIGNvbG9yXFxuXCIgKyBcIlx0ZmxvYXQgeENvbCA9ICh1di54IC0gKHRpbWUgLyAzLjApKSAqIDMuMDtcXG5cIiArIFwiXHR4Q29sID0gbW9kKHhDb2wsIDMuMCk7XFxuXCIgKyBcIlx0dmVjMyBob3JDb2xvdXIgPSB2ZWMzKHNpbih0aW1lKjIuOTkpKjEuMjUsIHNpbih0aW1lKjMuMTExKSowLjI1LCBzaW4odGltZSoxLjMxKSowLjI1KTtcXG5cIiArIFwiXHRcXG5cIiArIFwiXHRpZiAoeENvbCA8IC4xKSB7XFxuXCIgKyBcIlx0XHRcXG5cIiArIFwiXHRcdGhvckNvbG91ci5yICs9IDEuMCAtIHhDb2w7XFxuXCIgKyBcIlx0XHRob3JDb2xvdXIuZyArPSB4Q29sO1xcblwiICsgXCJcdH1cXG5cIiArIFwiXHRlbHNlIGlmICh4Q29sIDwgMC40KSB7XFxuXCIgKyBcIlx0XHRcXG5cIiArIFwiXHRcdHhDb2wgLT0gMS4wO1xcblwiICsgXCJcdFx0aG9yQ29sb3VyLmcgKz0gMS4wIC0geENvbDtcXG5cIiArIFwiXHRcdGhvckNvbG91ci5iICs9IHhDb2w7XFxuXCIgKyBcIlx0fVxcblwiICsgXCJcdGVsc2Uge1xcblwiICsgXCJcdFx0XFxuXCIgKyBcIlx0XHR4Q29sIC09IDIuMDtcXG5cIiArIFwiXHRcdGhvckNvbG91ci5iICs9IDEuMCAtIHhDb2w7XFxuXCIgKyBcIlx0XHRob3JDb2xvdXIuciArPSB4Q29sO1xcblwiICsgXCJcdH1cXG5cIiArIFwiXFxuXCIgKyBcIlx0Ly8gZHJhdyBjb2xvciBiZWFtXFxuXCIgKyBcIlx0dXYgPSAoMy4wICogdXYpIC0gYWJzKHNpbih0aW1lKSk7XFxuXCIgKyBcIlx0ZmxvYXQgYmVhbVdpZHRoID0gLjArMS4xKmFicygoc2luKHRpbWUpKjAuMioyLjApIC8gKDMuMCAqIHV2LnggKiB1di55KSk7XFxuXCIgKyBcIlx0dmVjMyBob3JCZWFtID0gdmVjMyhiZWFtV2lkdGgpO1xcblwiICsgXCJcdGdsX0ZyYWdDb2xvciA9IHZlYzQoKCggaG9yQmVhbSkgKiBob3JDb2xvdXIpLCAxLjApO1xcblwiICsgXCJ9XFxuXCI7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc5NGQxOFY1K29wSE1vOFYxUWpSTVAzTycsICdjY1NoYWRlcl9FZmZlY3QwOV9GcmFnJyk7XG4vLyBTaGFkZXJzL2NjU2hhZGVyX0VmZmVjdDA5X0ZyYWcuanNcblxubW9kdWxlLmV4cG9ydHMgPSBcIiNpZmRlZiBHTF9FU1xcblwiICsgXCJwcmVjaXNpb24gbWVkaXVtcCBmbG9hdDtcXG5cIiArIFwiI2VuZGlmXFxuXCIgKyBcIlxcblwiICsgXCJ1bmlmb3JtIGZsb2F0IHRpbWU7XFxuXCIgKyBcInVuaWZvcm0gdmVjMiBtb3VzZV90b3VjaDtcXG5cIiArIFwidW5pZm9ybSB2ZWMyIHJlc29sdXRpb247XFxuXCIgKyBcIlxcblwiICsgXCJ2b2lkIG1haW4oIHZvaWQgKSB7XFxuXCIgKyBcIlxcblwiICsgXCJcdHZlYzIgcCA9ICgyLjAqZ2xfRnJhZ0Nvb3JkLnh5LXJlc29sdXRpb24ueHkpL3Jlc29sdXRpb24ueTtcXG5cIiArIFwiICAgIGZsb2F0IHRhdSA9IDMuMTQxNTkyNjUzNTtcXG5cIiArIFwiICAgIGZsb2F0IGEgPSBzaW4odGltZSk7XFxuXCIgKyBcIiAgICBmbG9hdCByID0gbGVuZ3RoKHApKjAuNzU7XFxuXCIgKyBcIiAgICB2ZWMyIHV2ID0gdmVjMihhL3RhdSxyKTtcXG5cIiArIFwiXHRcXG5cIiArIFwiXHQvL2dldCB0aGUgY29sb3JcXG5cIiArIFwiXHRmbG9hdCB4Q29sID0gKHV2LnggLSAodGltZSAvIDMuMCkpICogMy4wO1xcblwiICsgXCJcdHhDb2wgPSBtb2QoeENvbCwgMy4wKTtcXG5cIiArIFwiXHR2ZWMzIGhvckNvbG91ciA9IHZlYzMoc2luKHRpbWUqMi45OSkqMS4yNSwgc2luKHRpbWUqMy4xMTEpKjAuMjUsIHNpbih0aW1lKjEuMzEpKjAuMjUpO1xcblwiICsgXCJcdFxcblwiICsgXCJcdGlmICh4Q29sIDwgLjEpIHtcXG5cIiArIFwiXHRcdFxcblwiICsgXCJcdFx0aG9yQ29sb3VyLnIgKz0gMS4wIC0geENvbDtcXG5cIiArIFwiXHRcdGhvckNvbG91ci5nICs9IHhDb2w7XFxuXCIgKyBcIlx0fVxcblwiICsgXCJcdGVsc2UgaWYgKHhDb2wgPCAwLjQpIHtcXG5cIiArIFwiXHRcdFxcblwiICsgXCJcdFx0eENvbCAtPSAxLjA7XFxuXCIgKyBcIlx0XHRob3JDb2xvdXIuZyArPSAxLjAgLSB4Q29sO1xcblwiICsgXCJcdFx0aG9yQ29sb3VyLmIgKz0geENvbDtcXG5cIiArIFwiXHR9XFxuXCIgKyBcIlx0ZWxzZSB7XFxuXCIgKyBcIlx0XHRcXG5cIiArIFwiXHRcdHhDb2wgLT0gMi4wO1xcblwiICsgXCJcdFx0aG9yQ29sb3VyLmIgKz0gMS4wIC0geENvbDtcXG5cIiArIFwiXHRcdGhvckNvbG91ci5yICs9IHhDb2w7XFxuXCIgKyBcIlx0fVxcblwiICsgXCJcXG5cIiArIFwiXHQvLyBkcmF3IGNvbG9yIGJlYW1cXG5cIiArIFwiXHR1diA9ICgzLjAgKiB1dikgLSBhYnMoc2luKHRpbWUpKTtcXG5cIiArIFwiXHRmbG9hdCBiZWFtV2lkdGggPSAuMCsxLjEqYWJzKChzaW4odGltZSkqMC4yKjIuMCkgLyAoMy4wICogdXYueCAqIHV2LnkpKTtcXG5cIiArIFwiXHR2ZWMzIGhvckJlYW0gPSB2ZWMzKGJlYW1XaWR0aCk7XFxuXCIgKyBcIlx0Z2xfRnJhZ0NvbG9yID0gdmVjNCgoKCBob3JCZWFtKSAqIGhvckNvbG91ciksIDEuMCk7XFxuXCIgKyBcIn1cXG5cIjtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2ZmOTBkZWhJd0pHaklpQkZCdUI1MGlGJywgJ2NjU2hhZGVyX0VmZmVjdDEwX0ZyYWcnKTtcbi8vIFNoYWRlcnMvY2NTaGFkZXJfRWZmZWN0MTBfRnJhZy5qc1xuXG5tb2R1bGUuZXhwb3J0cyA9IFwiI2lmZGVmIEdMX0VTXFxuXCIgKyBcInByZWNpc2lvbiBtZWRpdW1wIGZsb2F0O1xcblwiICsgXCIjZW5kaWZcXG5cIiArIFwiXFxuXCIgKyBcInVuaWZvcm0gZmxvYXQgdGltZTtcXG5cIiArIFwidW5pZm9ybSB2ZWMyIG1vdXNlX3RvdWNoO1xcblwiICsgXCJ1bmlmb3JtIHZlYzIgcmVzb2x1dGlvbjtcXG5cIiArIFwiXFxuXCIgKyBcInZvaWQgbWFpbiggdm9pZCApIHtcXG5cIiArIFwiXFxuXCIgKyBcIlx0dmVjMiBwID0gKDIuMCpnbF9GcmFnQ29vcmQueHktcmVzb2x1dGlvbi54eSkvcmVzb2x1dGlvbi55O1xcblwiICsgXCIgICAgZmxvYXQgdGF1ID0gMy4xNDE1OTI2NTM1O1xcblwiICsgXCIgICAgZmxvYXQgYSA9IHNpbih0aW1lKTtcXG5cIiArIFwiICAgIGZsb2F0IHIgPSBsZW5ndGgocCkqMC43NTtcXG5cIiArIFwiICAgIHZlYzIgdXYgPSB2ZWMyKGEvdGF1LHIpO1xcblwiICsgXCJcdFxcblwiICsgXCJcdC8vZ2V0IHRoZSBjb2xvclxcblwiICsgXCJcdGZsb2F0IHhDb2wgPSAodXYueCAtICh0aW1lIC8gMy4wKSkgKiAzLjA7XFxuXCIgKyBcIlx0eENvbCA9IG1vZCh4Q29sLCAzLjApO1xcblwiICsgXCJcdHZlYzMgaG9yQ29sb3VyID0gdmVjMyhzaW4odGltZSoyLjk5KSoxLjI1LCBzaW4odGltZSozLjExMSkqMC4yNSwgc2luKHRpbWUqMS4zMSkqMC4yNSk7XFxuXCIgKyBcIlx0XFxuXCIgKyBcIlx0aWYgKHhDb2wgPCAuMSkge1xcblwiICsgXCJcdFx0XFxuXCIgKyBcIlx0XHRob3JDb2xvdXIuciArPSAxLjAgLSB4Q29sO1xcblwiICsgXCJcdFx0aG9yQ29sb3VyLmcgKz0geENvbDtcXG5cIiArIFwiXHR9XFxuXCIgKyBcIlx0ZWxzZSBpZiAoeENvbCA8IDAuNCkge1xcblwiICsgXCJcdFx0XFxuXCIgKyBcIlx0XHR4Q29sIC09IDEuMDtcXG5cIiArIFwiXHRcdGhvckNvbG91ci5nICs9IDEuMCAtIHhDb2w7XFxuXCIgKyBcIlx0XHRob3JDb2xvdXIuYiArPSB4Q29sO1xcblwiICsgXCJcdH1cXG5cIiArIFwiXHRlbHNlIHtcXG5cIiArIFwiXHRcdFxcblwiICsgXCJcdFx0eENvbCAtPSAyLjA7XFxuXCIgKyBcIlx0XHRob3JDb2xvdXIuYiArPSAxLjAgLSB4Q29sO1xcblwiICsgXCJcdFx0aG9yQ29sb3VyLnIgKz0geENvbDtcXG5cIiArIFwiXHR9XFxuXCIgKyBcIlxcblwiICsgXCJcdC8vIGRyYXcgY29sb3IgYmVhbVxcblwiICsgXCJcdHV2ID0gKDMuMCAqIHV2KSAtIGFicyhzaW4odGltZSkpO1xcblwiICsgXCJcdGZsb2F0IGJlYW1XaWR0aCA9IC4wKzEuMSphYnMoKHNpbih0aW1lKSowLjIqMi4wKSAvICgzLjAgKiB1di54ICogdXYueSkpO1xcblwiICsgXCJcdHZlYzMgaG9yQmVhbSA9IHZlYzMoYmVhbVdpZHRoKTtcXG5cIiArIFwiXHRnbF9GcmFnQ29sb3IgPSB2ZWM0KCgoIGhvckJlYW0pICogaG9yQ29sb3VyKSwgMS4wKTtcXG5cIiArIFwifVxcblwiO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnZTY2ZDV1RS9wRko0cTk3Z3VtbHpzdTcnLCAnY2NTaGFkZXJfRWZmZWN0MTFfRnJhZycpO1xuLy8gU2hhZGVycy9jY1NoYWRlcl9FZmZlY3QxMV9GcmFnLmpzXG5cbm1vZHVsZS5leHBvcnRzID0gXCIjaWZkZWYgR0xfRVNcXG5cIiArIFwicHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7XFxuXCIgKyBcIiNlbmRpZlxcblwiICsgXCJcXG5cIiArIFwidW5pZm9ybSBmbG9hdCB0aW1lO1xcblwiICsgXCJ1bmlmb3JtIHZlYzIgbW91c2VfdG91Y2g7XFxuXCIgKyBcInVuaWZvcm0gdmVjMiByZXNvbHV0aW9uO1xcblwiICsgXCJcXG5cIiArIFwidm9pZCBtYWluKCB2b2lkICkge1xcblwiICsgXCJcXG5cIiArIFwiXHR2ZWMyIHAgPSAoMi4wKmdsX0ZyYWdDb29yZC54eS1yZXNvbHV0aW9uLnh5KS9yZXNvbHV0aW9uLnk7XFxuXCIgKyBcIiAgICBmbG9hdCB0YXUgPSAzLjE0MTU5MjY1MzU7XFxuXCIgKyBcIiAgICBmbG9hdCBhID0gc2luKHRpbWUpO1xcblwiICsgXCIgICAgZmxvYXQgciA9IGxlbmd0aChwKSowLjc1O1xcblwiICsgXCIgICAgdmVjMiB1diA9IHZlYzIoYS90YXUscik7XFxuXCIgKyBcIlx0XFxuXCIgKyBcIlx0Ly9nZXQgdGhlIGNvbG9yXFxuXCIgKyBcIlx0ZmxvYXQgeENvbCA9ICh1di54IC0gKHRpbWUgLyAzLjApKSAqIDMuMDtcXG5cIiArIFwiXHR4Q29sID0gbW9kKHhDb2wsIDMuMCk7XFxuXCIgKyBcIlx0dmVjMyBob3JDb2xvdXIgPSB2ZWMzKHNpbih0aW1lKjIuOTkpKjEuMjUsIHNpbih0aW1lKjMuMTExKSowLjI1LCBzaW4odGltZSoxLjMxKSowLjI1KTtcXG5cIiArIFwiXHRcXG5cIiArIFwiXHRpZiAoeENvbCA8IC4xKSB7XFxuXCIgKyBcIlx0XHRcXG5cIiArIFwiXHRcdGhvckNvbG91ci5yICs9IDEuMCAtIHhDb2w7XFxuXCIgKyBcIlx0XHRob3JDb2xvdXIuZyArPSB4Q29sO1xcblwiICsgXCJcdH1cXG5cIiArIFwiXHRlbHNlIGlmICh4Q29sIDwgMC40KSB7XFxuXCIgKyBcIlx0XHRcXG5cIiArIFwiXHRcdHhDb2wgLT0gMS4wO1xcblwiICsgXCJcdFx0aG9yQ29sb3VyLmcgKz0gMS4wIC0geENvbDtcXG5cIiArIFwiXHRcdGhvckNvbG91ci5iICs9IHhDb2w7XFxuXCIgKyBcIlx0fVxcblwiICsgXCJcdGVsc2Uge1xcblwiICsgXCJcdFx0XFxuXCIgKyBcIlx0XHR4Q29sIC09IDIuMDtcXG5cIiArIFwiXHRcdGhvckNvbG91ci5iICs9IDEuMCAtIHhDb2w7XFxuXCIgKyBcIlx0XHRob3JDb2xvdXIuciArPSB4Q29sO1xcblwiICsgXCJcdH1cXG5cIiArIFwiXFxuXCIgKyBcIlx0Ly8gZHJhdyBjb2xvciBiZWFtXFxuXCIgKyBcIlx0dXYgPSAoMy4wICogdXYpIC0gYWJzKHNpbih0aW1lKSk7XFxuXCIgKyBcIlx0ZmxvYXQgYmVhbVdpZHRoID0gLjArMS4xKmFicygoc2luKHRpbWUpKjAuMioyLjApIC8gKDMuMCAqIHV2LnggKiB1di55KSk7XFxuXCIgKyBcIlx0dmVjMyBob3JCZWFtID0gdmVjMyhiZWFtV2lkdGgpO1xcblwiICsgXCJcdGdsX0ZyYWdDb2xvciA9IHZlYzQoKCggaG9yQmVhbSkgKiBob3JDb2xvdXIpLCAxLjApO1xcblwiICsgXCJ9XFxuXCI7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICdmYWRjZXhtdkgxT2ZMS05WV0UyQTlEWCcsICdjY1NoYWRlcl9FZmZlY3QxMl9GcmFnJyk7XG4vLyBTaGFkZXJzL2NjU2hhZGVyX0VmZmVjdDEyX0ZyYWcuanNcblxubW9kdWxlLmV4cG9ydHMgPSBcIiNpZmRlZiBHTF9FU1xcblwiICsgXCJwcmVjaXNpb24gbWVkaXVtcCBmbG9hdDtcXG5cIiArIFwiI2VuZGlmXFxuXCIgKyBcIlxcblwiICsgXCJ1bmlmb3JtIGZsb2F0IHRpbWU7XFxuXCIgKyBcInVuaWZvcm0gdmVjMiBtb3VzZV90b3VjaDtcXG5cIiArIFwidW5pZm9ybSB2ZWMyIHJlc29sdXRpb247XFxuXCIgKyBcIlxcblwiICsgXCJ2b2lkIG1haW4oIHZvaWQgKSB7XFxuXCIgKyBcIlxcblwiICsgXCJcdHZlYzIgcCA9ICgyLjAqZ2xfRnJhZ0Nvb3JkLnh5LXJlc29sdXRpb24ueHkpL3Jlc29sdXRpb24ueTtcXG5cIiArIFwiICAgIGZsb2F0IHRhdSA9IDMuMTQxNTkyNjUzNTtcXG5cIiArIFwiICAgIGZsb2F0IGEgPSBzaW4odGltZSk7XFxuXCIgKyBcIiAgICBmbG9hdCByID0gbGVuZ3RoKHApKjAuNzU7XFxuXCIgKyBcIiAgICB2ZWMyIHV2ID0gdmVjMihhL3RhdSxyKTtcXG5cIiArIFwiXHRcXG5cIiArIFwiXHQvL2dldCB0aGUgY29sb3JcXG5cIiArIFwiXHRmbG9hdCB4Q29sID0gKHV2LnggLSAodGltZSAvIDMuMCkpICogMy4wO1xcblwiICsgXCJcdHhDb2wgPSBtb2QoeENvbCwgMy4wKTtcXG5cIiArIFwiXHR2ZWMzIGhvckNvbG91ciA9IHZlYzMoc2luKHRpbWUqMi45OSkqMS4yNSwgc2luKHRpbWUqMy4xMTEpKjAuMjUsIHNpbih0aW1lKjEuMzEpKjAuMjUpO1xcblwiICsgXCJcdFxcblwiICsgXCJcdGlmICh4Q29sIDwgLjEpIHtcXG5cIiArIFwiXHRcdFxcblwiICsgXCJcdFx0aG9yQ29sb3VyLnIgKz0gMS4wIC0geENvbDtcXG5cIiArIFwiXHRcdGhvckNvbG91ci5nICs9IHhDb2w7XFxuXCIgKyBcIlx0fVxcblwiICsgXCJcdGVsc2UgaWYgKHhDb2wgPCAwLjQpIHtcXG5cIiArIFwiXHRcdFxcblwiICsgXCJcdFx0eENvbCAtPSAxLjA7XFxuXCIgKyBcIlx0XHRob3JDb2xvdXIuZyArPSAxLjAgLSB4Q29sO1xcblwiICsgXCJcdFx0aG9yQ29sb3VyLmIgKz0geENvbDtcXG5cIiArIFwiXHR9XFxuXCIgKyBcIlx0ZWxzZSB7XFxuXCIgKyBcIlx0XHRcXG5cIiArIFwiXHRcdHhDb2wgLT0gMi4wO1xcblwiICsgXCJcdFx0aG9yQ29sb3VyLmIgKz0gMS4wIC0geENvbDtcXG5cIiArIFwiXHRcdGhvckNvbG91ci5yICs9IHhDb2w7XFxuXCIgKyBcIlx0fVxcblwiICsgXCJcXG5cIiArIFwiXHQvLyBkcmF3IGNvbG9yIGJlYW1cXG5cIiArIFwiXHR1diA9ICgzLjAgKiB1dikgLSBhYnMoc2luKHRpbWUpKTtcXG5cIiArIFwiXHRmbG9hdCBiZWFtV2lkdGggPSAuMCsxLjEqYWJzKChzaW4odGltZSkqMC4yKjIuMCkgLyAoMy4wICogdXYueCAqIHV2LnkpKTtcXG5cIiArIFwiXHR2ZWMzIGhvckJlYW0gPSB2ZWMzKGJlYW1XaWR0aCk7XFxuXCIgKyBcIlx0Z2xfRnJhZ0NvbG9yID0gdmVjNCgoKCBob3JCZWFtKSAqIGhvckNvbG91ciksIDEuMCk7XFxuXCIgKyBcIn1cXG5cIjtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzQxYzBjMkJodTFLMjRVMVpWanJGMzdKJywgJ2NjU2hhZGVyX0VmZmVjdDEzX0ZyYWcnKTtcbi8vIFNoYWRlcnMvY2NTaGFkZXJfRWZmZWN0MTNfRnJhZy5qc1xuXG5tb2R1bGUuZXhwb3J0cyA9IFwiI2lmZGVmIEdMX0VTXFxuXCIgKyBcInByZWNpc2lvbiBtZWRpdW1wIGZsb2F0O1xcblwiICsgXCIjZW5kaWZcXG5cIiArIFwiXFxuXCIgKyBcInVuaWZvcm0gZmxvYXQgdGltZTtcXG5cIiArIFwidW5pZm9ybSB2ZWMyIG1vdXNlX3RvdWNoO1xcblwiICsgXCJ1bmlmb3JtIHZlYzIgcmVzb2x1dGlvbjtcXG5cIiArIFwiXFxuXCIgKyBcInZvaWQgbWFpbiggdm9pZCApIHtcXG5cIiArIFwiXFxuXCIgKyBcIlx0dmVjMiBwID0gKDIuMCpnbF9GcmFnQ29vcmQueHktcmVzb2x1dGlvbi54eSkvcmVzb2x1dGlvbi55O1xcblwiICsgXCIgICAgZmxvYXQgdGF1ID0gMy4xNDE1OTI2NTM1O1xcblwiICsgXCIgICAgZmxvYXQgYSA9IHNpbih0aW1lKTtcXG5cIiArIFwiICAgIGZsb2F0IHIgPSBsZW5ndGgocCkqMC43NTtcXG5cIiArIFwiICAgIHZlYzIgdXYgPSB2ZWMyKGEvdGF1LHIpO1xcblwiICsgXCJcdFxcblwiICsgXCJcdC8vZ2V0IHRoZSBjb2xvclxcblwiICsgXCJcdGZsb2F0IHhDb2wgPSAodXYueCAtICh0aW1lIC8gMy4wKSkgKiAzLjA7XFxuXCIgKyBcIlx0eENvbCA9IG1vZCh4Q29sLCAzLjApO1xcblwiICsgXCJcdHZlYzMgaG9yQ29sb3VyID0gdmVjMyhzaW4odGltZSoyLjk5KSoxLjI1LCBzaW4odGltZSozLjExMSkqMC4yNSwgc2luKHRpbWUqMS4zMSkqMC4yNSk7XFxuXCIgKyBcIlx0XFxuXCIgKyBcIlx0aWYgKHhDb2wgPCAuMSkge1xcblwiICsgXCJcdFx0XFxuXCIgKyBcIlx0XHRob3JDb2xvdXIuciArPSAxLjAgLSB4Q29sO1xcblwiICsgXCJcdFx0aG9yQ29sb3VyLmcgKz0geENvbDtcXG5cIiArIFwiXHR9XFxuXCIgKyBcIlx0ZWxzZSBpZiAoeENvbCA8IDAuNCkge1xcblwiICsgXCJcdFx0XFxuXCIgKyBcIlx0XHR4Q29sIC09IDEuMDtcXG5cIiArIFwiXHRcdGhvckNvbG91ci5nICs9IDEuMCAtIHhDb2w7XFxuXCIgKyBcIlx0XHRob3JDb2xvdXIuYiArPSB4Q29sO1xcblwiICsgXCJcdH1cXG5cIiArIFwiXHRlbHNlIHtcXG5cIiArIFwiXHRcdFxcblwiICsgXCJcdFx0eENvbCAtPSAyLjA7XFxuXCIgKyBcIlx0XHRob3JDb2xvdXIuYiArPSAxLjAgLSB4Q29sO1xcblwiICsgXCJcdFx0aG9yQ29sb3VyLnIgKz0geENvbDtcXG5cIiArIFwiXHR9XFxuXCIgKyBcIlxcblwiICsgXCJcdC8vIGRyYXcgY29sb3IgYmVhbVxcblwiICsgXCJcdHV2ID0gKDMuMCAqIHV2KSAtIGFicyhzaW4odGltZSkpO1xcblwiICsgXCJcdGZsb2F0IGJlYW1XaWR0aCA9IC4wKzEuMSphYnMoKHNpbih0aW1lKSowLjIqMi4wKSAvICgzLjAgKiB1di54ICogdXYueSkpO1xcblwiICsgXCJcdHZlYzMgaG9yQmVhbSA9IHZlYzMoYmVhbVdpZHRoKTtcXG5cIiArIFwiXHRnbF9GcmFnQ29sb3IgPSB2ZWM0KCgoIGhvckJlYW0pICogaG9yQ29sb3VyKSwgMS4wKTtcXG5cIiArIFwifVxcblwiO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnMTVhZjdzcmQzdExhcDliOVVyTTVYVkonLCAnY2NTaGFkZXJfRWZmZWN0MTRfRnJhZycpO1xuLy8gU2hhZGVycy9jY1NoYWRlcl9FZmZlY3QxNF9GcmFnLmpzXG5cbm1vZHVsZS5leHBvcnRzID0gXCIjaWZkZWYgR0xfRVNcXG5cIiArIFwicHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7XFxuXCIgKyBcIiNlbmRpZlxcblwiICsgXCJcXG5cIiArIFwidW5pZm9ybSBmbG9hdCB0aW1lO1xcblwiICsgXCJ1bmlmb3JtIHZlYzIgbW91c2VfdG91Y2g7XFxuXCIgKyBcInVuaWZvcm0gdmVjMiByZXNvbHV0aW9uO1xcblwiICsgXCJcXG5cIiArIFwidm9pZCBtYWluKCB2b2lkICkge1xcblwiICsgXCJcXG5cIiArIFwiXHR2ZWMyIHAgPSAoMi4wKmdsX0ZyYWdDb29yZC54eS1yZXNvbHV0aW9uLnh5KS9yZXNvbHV0aW9uLnk7XFxuXCIgKyBcIiAgICBmbG9hdCB0YXUgPSAzLjE0MTU5MjY1MzU7XFxuXCIgKyBcIiAgICBmbG9hdCBhID0gc2luKHRpbWUpO1xcblwiICsgXCIgICAgZmxvYXQgciA9IGxlbmd0aChwKSowLjc1O1xcblwiICsgXCIgICAgdmVjMiB1diA9IHZlYzIoYS90YXUscik7XFxuXCIgKyBcIlx0XFxuXCIgKyBcIlx0Ly9nZXQgdGhlIGNvbG9yXFxuXCIgKyBcIlx0ZmxvYXQgeENvbCA9ICh1di54IC0gKHRpbWUgLyAzLjApKSAqIDMuMDtcXG5cIiArIFwiXHR4Q29sID0gbW9kKHhDb2wsIDMuMCk7XFxuXCIgKyBcIlx0dmVjMyBob3JDb2xvdXIgPSB2ZWMzKHNpbih0aW1lKjIuOTkpKjEuMjUsIHNpbih0aW1lKjMuMTExKSowLjI1LCBzaW4odGltZSoxLjMxKSowLjI1KTtcXG5cIiArIFwiXHRcXG5cIiArIFwiXHRpZiAoeENvbCA8IC4xKSB7XFxuXCIgKyBcIlx0XHRcXG5cIiArIFwiXHRcdGhvckNvbG91ci5yICs9IDEuMCAtIHhDb2w7XFxuXCIgKyBcIlx0XHRob3JDb2xvdXIuZyArPSB4Q29sO1xcblwiICsgXCJcdH1cXG5cIiArIFwiXHRlbHNlIGlmICh4Q29sIDwgMC40KSB7XFxuXCIgKyBcIlx0XHRcXG5cIiArIFwiXHRcdHhDb2wgLT0gMS4wO1xcblwiICsgXCJcdFx0aG9yQ29sb3VyLmcgKz0gMS4wIC0geENvbDtcXG5cIiArIFwiXHRcdGhvckNvbG91ci5iICs9IHhDb2w7XFxuXCIgKyBcIlx0fVxcblwiICsgXCJcdGVsc2Uge1xcblwiICsgXCJcdFx0XFxuXCIgKyBcIlx0XHR4Q29sIC09IDIuMDtcXG5cIiArIFwiXHRcdGhvckNvbG91ci5iICs9IDEuMCAtIHhDb2w7XFxuXCIgKyBcIlx0XHRob3JDb2xvdXIuciArPSB4Q29sO1xcblwiICsgXCJcdH1cXG5cIiArIFwiXFxuXCIgKyBcIlx0Ly8gZHJhdyBjb2xvciBiZWFtXFxuXCIgKyBcIlx0dXYgPSAoMy4wICogdXYpIC0gYWJzKHNpbih0aW1lKSk7XFxuXCIgKyBcIlx0ZmxvYXQgYmVhbVdpZHRoID0gLjArMS4xKmFicygoc2luKHRpbWUpKjAuMioyLjApIC8gKDMuMCAqIHV2LnggKiB1di55KSk7XFxuXCIgKyBcIlx0dmVjMyBob3JCZWFtID0gdmVjMyhiZWFtV2lkdGgpO1xcblwiICsgXCJcdGdsX0ZyYWdDb2xvciA9IHZlYzQoKCggaG9yQmVhbSkgKiBob3JDb2xvdXIpLCAxLjApO1xcblwiICsgXCJ9XFxuXCI7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICdkYzllNk53MnJkRDhhM1d2Nm5tMXFPLycsICdjY1NoYWRlcl9FZmZlY3QxNV9GcmFnJyk7XG4vLyBTaGFkZXJzL2NjU2hhZGVyX0VmZmVjdDE1X0ZyYWcuanNcblxubW9kdWxlLmV4cG9ydHMgPSBcIiNpZmRlZiBHTF9FU1xcblwiICsgXCJwcmVjaXNpb24gbWVkaXVtcCBmbG9hdDtcXG5cIiArIFwiI2VuZGlmXFxuXCIgKyBcIlxcblwiICsgXCJ1bmlmb3JtIGZsb2F0IHRpbWU7XFxuXCIgKyBcInVuaWZvcm0gdmVjMiBtb3VzZV90b3VjaDtcXG5cIiArIFwidW5pZm9ybSB2ZWMyIHJlc29sdXRpb247XFxuXCIgKyBcIlxcblwiICsgXCJ2b2lkIG1haW4oIHZvaWQgKSB7XFxuXCIgKyBcIlxcblwiICsgXCJcdHZlYzIgcCA9ICgyLjAqZ2xfRnJhZ0Nvb3JkLnh5LXJlc29sdXRpb24ueHkpL3Jlc29sdXRpb24ueTtcXG5cIiArIFwiICAgIGZsb2F0IHRhdSA9IDMuMTQxNTkyNjUzNTtcXG5cIiArIFwiICAgIGZsb2F0IGEgPSBzaW4odGltZSk7XFxuXCIgKyBcIiAgICBmbG9hdCByID0gbGVuZ3RoKHApKjAuNzU7XFxuXCIgKyBcIiAgICB2ZWMyIHV2ID0gdmVjMihhL3RhdSxyKTtcXG5cIiArIFwiXHRcXG5cIiArIFwiXHQvL2dldCB0aGUgY29sb3JcXG5cIiArIFwiXHRmbG9hdCB4Q29sID0gKHV2LnggLSAodGltZSAvIDMuMCkpICogMy4wO1xcblwiICsgXCJcdHhDb2wgPSBtb2QoeENvbCwgMy4wKTtcXG5cIiArIFwiXHR2ZWMzIGhvckNvbG91ciA9IHZlYzMoc2luKHRpbWUqMi45OSkqMS4yNSwgc2luKHRpbWUqMy4xMTEpKjAuMjUsIHNpbih0aW1lKjEuMzEpKjAuMjUpO1xcblwiICsgXCJcdFxcblwiICsgXCJcdGlmICh4Q29sIDwgLjEpIHtcXG5cIiArIFwiXHRcdFxcblwiICsgXCJcdFx0aG9yQ29sb3VyLnIgKz0gMS4wIC0geENvbDtcXG5cIiArIFwiXHRcdGhvckNvbG91ci5nICs9IHhDb2w7XFxuXCIgKyBcIlx0fVxcblwiICsgXCJcdGVsc2UgaWYgKHhDb2wgPCAwLjQpIHtcXG5cIiArIFwiXHRcdFxcblwiICsgXCJcdFx0eENvbCAtPSAxLjA7XFxuXCIgKyBcIlx0XHRob3JDb2xvdXIuZyArPSAxLjAgLSB4Q29sO1xcblwiICsgXCJcdFx0aG9yQ29sb3VyLmIgKz0geENvbDtcXG5cIiArIFwiXHR9XFxuXCIgKyBcIlx0ZWxzZSB7XFxuXCIgKyBcIlx0XHRcXG5cIiArIFwiXHRcdHhDb2wgLT0gMi4wO1xcblwiICsgXCJcdFx0aG9yQ29sb3VyLmIgKz0gMS4wIC0geENvbDtcXG5cIiArIFwiXHRcdGhvckNvbG91ci5yICs9IHhDb2w7XFxuXCIgKyBcIlx0fVxcblwiICsgXCJcXG5cIiArIFwiXHQvLyBkcmF3IGNvbG9yIGJlYW1cXG5cIiArIFwiXHR1diA9ICgzLjAgKiB1dikgLSBhYnMoc2luKHRpbWUpKTtcXG5cIiArIFwiXHRmbG9hdCBiZWFtV2lkdGggPSAuMCsxLjEqYWJzKChzaW4odGltZSkqMC4yKjIuMCkgLyAoMy4wICogdXYueCAqIHV2LnkpKTtcXG5cIiArIFwiXHR2ZWMzIGhvckJlYW0gPSB2ZWMzKGJlYW1XaWR0aCk7XFxuXCIgKyBcIlx0Z2xfRnJhZ0NvbG9yID0gdmVjNCgoKCBob3JCZWFtKSAqIGhvckNvbG91ciksIDEuMCk7XFxuXCIgKyBcIn1cXG5cIjtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2Y0YWViTExGaGRONTU3b0E4V2cwbjgxJywgJ2NjU2hhZGVyX0VmZmVjdDE2X0ZyYWcnKTtcbi8vIFNoYWRlcnMvY2NTaGFkZXJfRWZmZWN0MTZfRnJhZy5qc1xuXG5tb2R1bGUuZXhwb3J0cyA9IFwiI2lmZGVmIEdMX0VTXFxuXCIgKyBcInByZWNpc2lvbiBtZWRpdW1wIGZsb2F0O1xcblwiICsgXCIjZW5kaWZcXG5cIiArIFwiXFxuXCIgKyBcInVuaWZvcm0gZmxvYXQgdGltZTtcXG5cIiArIFwidW5pZm9ybSB2ZWMyIG1vdXNlX3RvdWNoO1xcblwiICsgXCJ1bmlmb3JtIHZlYzIgcmVzb2x1dGlvbjtcXG5cIiArIFwiXFxuXCIgKyBcInZvaWQgbWFpbiggdm9pZCApIHtcXG5cIiArIFwiXFxuXCIgKyBcIlx0dmVjMiBwID0gKDIuMCpnbF9GcmFnQ29vcmQueHktcmVzb2x1dGlvbi54eSkvcmVzb2x1dGlvbi55O1xcblwiICsgXCIgICAgZmxvYXQgdGF1ID0gMy4xNDE1OTI2NTM1O1xcblwiICsgXCIgICAgZmxvYXQgYSA9IHNpbih0aW1lKTtcXG5cIiArIFwiICAgIGZsb2F0IHIgPSBsZW5ndGgocCkqMC43NTtcXG5cIiArIFwiICAgIHZlYzIgdXYgPSB2ZWMyKGEvdGF1LHIpO1xcblwiICsgXCJcdFxcblwiICsgXCJcdC8vZ2V0IHRoZSBjb2xvclxcblwiICsgXCJcdGZsb2F0IHhDb2wgPSAodXYueCAtICh0aW1lIC8gMy4wKSkgKiAzLjA7XFxuXCIgKyBcIlx0eENvbCA9IG1vZCh4Q29sLCAzLjApO1xcblwiICsgXCJcdHZlYzMgaG9yQ29sb3VyID0gdmVjMyhzaW4odGltZSoyLjk5KSoxLjI1LCBzaW4odGltZSozLjExMSkqMC4yNSwgc2luKHRpbWUqMS4zMSkqMC4yNSk7XFxuXCIgKyBcIlx0XFxuXCIgKyBcIlx0aWYgKHhDb2wgPCAuMSkge1xcblwiICsgXCJcdFx0XFxuXCIgKyBcIlx0XHRob3JDb2xvdXIuciArPSAxLjAgLSB4Q29sO1xcblwiICsgXCJcdFx0aG9yQ29sb3VyLmcgKz0geENvbDtcXG5cIiArIFwiXHR9XFxuXCIgKyBcIlx0ZWxzZSBpZiAoeENvbCA8IDAuNCkge1xcblwiICsgXCJcdFx0XFxuXCIgKyBcIlx0XHR4Q29sIC09IDEuMDtcXG5cIiArIFwiXHRcdGhvckNvbG91ci5nICs9IDEuMCAtIHhDb2w7XFxuXCIgKyBcIlx0XHRob3JDb2xvdXIuYiArPSB4Q29sO1xcblwiICsgXCJcdH1cXG5cIiArIFwiXHRlbHNlIHtcXG5cIiArIFwiXHRcdFxcblwiICsgXCJcdFx0eENvbCAtPSAyLjA7XFxuXCIgKyBcIlx0XHRob3JDb2xvdXIuYiArPSAxLjAgLSB4Q29sO1xcblwiICsgXCJcdFx0aG9yQ29sb3VyLnIgKz0geENvbDtcXG5cIiArIFwiXHR9XFxuXCIgKyBcIlxcblwiICsgXCJcdC8vIGRyYXcgY29sb3IgYmVhbVxcblwiICsgXCJcdHV2ID0gKDMuMCAqIHV2KSAtIGFicyhzaW4odGltZSkpO1xcblwiICsgXCJcdGZsb2F0IGJlYW1XaWR0aCA9IC4wKzEuMSphYnMoKHNpbih0aW1lKSowLjIqMi4wKSAvICgzLjAgKiB1di54ICogdXYueSkpO1xcblwiICsgXCJcdHZlYzMgaG9yQmVhbSA9IHZlYzMoYmVhbVdpZHRoKTtcXG5cIiArIFwiXHRnbF9GcmFnQ29sb3IgPSB2ZWM0KCgoIGhvckJlYW0pICogaG9yQ29sb3VyKSwgMS4wKTtcXG5cIiArIFwifVxcblwiO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnNDhlM2VaWVA5Uk5wWk9TODUxSzVxZnUnLCAnY2NTaGFkZXJfRWZmZWN0MTdfRnJhZycpO1xuLy8gU2hhZGVycy9jY1NoYWRlcl9FZmZlY3QxN19GcmFnLmpzXG5cbm1vZHVsZS5leHBvcnRzID0gXCIjaWZkZWYgR0xfRVNcXG5cIiArIFwicHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7XFxuXCIgKyBcIiNlbmRpZlxcblwiICsgXCJcXG5cIiArIFwidW5pZm9ybSBmbG9hdCB0aW1lO1xcblwiICsgXCJ1bmlmb3JtIHZlYzIgbW91c2VfdG91Y2g7XFxuXCIgKyBcInVuaWZvcm0gdmVjMiByZXNvbHV0aW9uO1xcblwiICsgXCJcXG5cIiArIFwidm9pZCBtYWluKCB2b2lkICkge1xcblwiICsgXCJcXG5cIiArIFwiXHR2ZWMyIHAgPSAoMi4wKmdsX0ZyYWdDb29yZC54eS1yZXNvbHV0aW9uLnh5KS9yZXNvbHV0aW9uLnk7XFxuXCIgKyBcIiAgICBmbG9hdCB0YXUgPSAzLjE0MTU5MjY1MzU7XFxuXCIgKyBcIiAgICBmbG9hdCBhID0gc2luKHRpbWUpO1xcblwiICsgXCIgICAgZmxvYXQgciA9IGxlbmd0aChwKSowLjc1O1xcblwiICsgXCIgICAgdmVjMiB1diA9IHZlYzIoYS90YXUscik7XFxuXCIgKyBcIlx0XFxuXCIgKyBcIlx0Ly9nZXQgdGhlIGNvbG9yXFxuXCIgKyBcIlx0ZmxvYXQgeENvbCA9ICh1di54IC0gKHRpbWUgLyAzLjApKSAqIDMuMDtcXG5cIiArIFwiXHR4Q29sID0gbW9kKHhDb2wsIDMuMCk7XFxuXCIgKyBcIlx0dmVjMyBob3JDb2xvdXIgPSB2ZWMzKHNpbih0aW1lKjIuOTkpKjEuMjUsIHNpbih0aW1lKjMuMTExKSowLjI1LCBzaW4odGltZSoxLjMxKSowLjI1KTtcXG5cIiArIFwiXHRcXG5cIiArIFwiXHRpZiAoeENvbCA8IC4xKSB7XFxuXCIgKyBcIlx0XHRcXG5cIiArIFwiXHRcdGhvckNvbG91ci5yICs9IDEuMCAtIHhDb2w7XFxuXCIgKyBcIlx0XHRob3JDb2xvdXIuZyArPSB4Q29sO1xcblwiICsgXCJcdH1cXG5cIiArIFwiXHRlbHNlIGlmICh4Q29sIDwgMC40KSB7XFxuXCIgKyBcIlx0XHRcXG5cIiArIFwiXHRcdHhDb2wgLT0gMS4wO1xcblwiICsgXCJcdFx0aG9yQ29sb3VyLmcgKz0gMS4wIC0geENvbDtcXG5cIiArIFwiXHRcdGhvckNvbG91ci5iICs9IHhDb2w7XFxuXCIgKyBcIlx0fVxcblwiICsgXCJcdGVsc2Uge1xcblwiICsgXCJcdFx0XFxuXCIgKyBcIlx0XHR4Q29sIC09IDIuMDtcXG5cIiArIFwiXHRcdGhvckNvbG91ci5iICs9IDEuMCAtIHhDb2w7XFxuXCIgKyBcIlx0XHRob3JDb2xvdXIuciArPSB4Q29sO1xcblwiICsgXCJcdH1cXG5cIiArIFwiXFxuXCIgKyBcIlx0Ly8gZHJhdyBjb2xvciBiZWFtXFxuXCIgKyBcIlx0dXYgPSAoMy4wICogdXYpIC0gYWJzKHNpbih0aW1lKSk7XFxuXCIgKyBcIlx0ZmxvYXQgYmVhbVdpZHRoID0gLjArMS4xKmFicygoc2luKHRpbWUpKjAuMioyLjApIC8gKDMuMCAqIHV2LnggKiB1di55KSk7XFxuXCIgKyBcIlx0dmVjMyBob3JCZWFtID0gdmVjMyhiZWFtV2lkdGgpO1xcblwiICsgXCJcdGdsX0ZyYWdDb2xvciA9IHZlYzQoKCggaG9yQmVhbSkgKiBob3JDb2xvdXIpLCAxLjApO1xcblwiICsgXCJ9XFxuXCI7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICdhYTBkMlJWY2xOQW1yVXU0OWg0M2VhWCcsICdjY1NoYWRlcl9FZmZlY3QxOF9GcmFnJyk7XG4vLyBTaGFkZXJzL2NjU2hhZGVyX0VmZmVjdDE4X0ZyYWcuanNcblxubW9kdWxlLmV4cG9ydHMgPSBcIiNpZmRlZiBHTF9FU1xcblwiICsgXCJwcmVjaXNpb24gbWVkaXVtcCBmbG9hdDtcXG5cIiArIFwiI2VuZGlmXFxuXCIgKyBcIlxcblwiICsgXCJ1bmlmb3JtIGZsb2F0IHRpbWU7XFxuXCIgKyBcInVuaWZvcm0gdmVjMiBtb3VzZV90b3VjaDtcXG5cIiArIFwidW5pZm9ybSB2ZWMyIHJlc29sdXRpb247XFxuXCIgKyBcIlxcblwiICsgXCJ2b2lkIG1haW4oIHZvaWQgKSB7XFxuXCIgKyBcIlxcblwiICsgXCJcdHZlYzIgcCA9ICgyLjAqZ2xfRnJhZ0Nvb3JkLnh5LXJlc29sdXRpb24ueHkpL3Jlc29sdXRpb24ueTtcXG5cIiArIFwiICAgIGZsb2F0IHRhdSA9IDMuMTQxNTkyNjUzNTtcXG5cIiArIFwiICAgIGZsb2F0IGEgPSBzaW4odGltZSk7XFxuXCIgKyBcIiAgICBmbG9hdCByID0gbGVuZ3RoKHApKjAuNzU7XFxuXCIgKyBcIiAgICB2ZWMyIHV2ID0gdmVjMihhL3RhdSxyKTtcXG5cIiArIFwiXHRcXG5cIiArIFwiXHQvL2dldCB0aGUgY29sb3JcXG5cIiArIFwiXHRmbG9hdCB4Q29sID0gKHV2LnggLSAodGltZSAvIDMuMCkpICogMy4wO1xcblwiICsgXCJcdHhDb2wgPSBtb2QoeENvbCwgMy4wKTtcXG5cIiArIFwiXHR2ZWMzIGhvckNvbG91ciA9IHZlYzMoc2luKHRpbWUqMi45OSkqMS4yNSwgc2luKHRpbWUqMy4xMTEpKjAuMjUsIHNpbih0aW1lKjEuMzEpKjAuMjUpO1xcblwiICsgXCJcdFxcblwiICsgXCJcdGlmICh4Q29sIDwgLjEpIHtcXG5cIiArIFwiXHRcdFxcblwiICsgXCJcdFx0aG9yQ29sb3VyLnIgKz0gMS4wIC0geENvbDtcXG5cIiArIFwiXHRcdGhvckNvbG91ci5nICs9IHhDb2w7XFxuXCIgKyBcIlx0fVxcblwiICsgXCJcdGVsc2UgaWYgKHhDb2wgPCAwLjQpIHtcXG5cIiArIFwiXHRcdFxcblwiICsgXCJcdFx0eENvbCAtPSAxLjA7XFxuXCIgKyBcIlx0XHRob3JDb2xvdXIuZyArPSAxLjAgLSB4Q29sO1xcblwiICsgXCJcdFx0aG9yQ29sb3VyLmIgKz0geENvbDtcXG5cIiArIFwiXHR9XFxuXCIgKyBcIlx0ZWxzZSB7XFxuXCIgKyBcIlx0XHRcXG5cIiArIFwiXHRcdHhDb2wgLT0gMi4wO1xcblwiICsgXCJcdFx0aG9yQ29sb3VyLmIgKz0gMS4wIC0geENvbDtcXG5cIiArIFwiXHRcdGhvckNvbG91ci5yICs9IHhDb2w7XFxuXCIgKyBcIlx0fVxcblwiICsgXCJcXG5cIiArIFwiXHQvLyBkcmF3IGNvbG9yIGJlYW1cXG5cIiArIFwiXHR1diA9ICgzLjAgKiB1dikgLSBhYnMoc2luKHRpbWUpKTtcXG5cIiArIFwiXHRmbG9hdCBiZWFtV2lkdGggPSAuMCsxLjEqYWJzKChzaW4odGltZSkqMC4yKjIuMCkgLyAoMy4wICogdXYueCAqIHV2LnkpKTtcXG5cIiArIFwiXHR2ZWMzIGhvckJlYW0gPSB2ZWMzKGJlYW1XaWR0aCk7XFxuXCIgKyBcIlx0Z2xfRnJhZ0NvbG9yID0gdmVjNCgoKCBob3JCZWFtKSAqIGhvckNvbG91ciksIDEuMCk7XFxuXCIgKyBcIn1cXG5cIjtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzNmMGNhWkpSSWRLK3FLTEZkVUZhWHBtJywgJ2NjU2hhZGVyX0VmZmVjdDE5X0ZyYWcnKTtcbi8vIFNoYWRlcnMvY2NTaGFkZXJfRWZmZWN0MTlfRnJhZy5qc1xuXG5tb2R1bGUuZXhwb3J0cyA9IFwiI2lmZGVmIEdMX0VTXFxuXCIgKyBcInByZWNpc2lvbiBtZWRpdW1wIGZsb2F0O1xcblwiICsgXCIjZW5kaWZcXG5cIiArIFwiXFxuXCIgKyBcInVuaWZvcm0gZmxvYXQgdGltZTtcXG5cIiArIFwidW5pZm9ybSB2ZWMyIG1vdXNlX3RvdWNoO1xcblwiICsgXCJ1bmlmb3JtIHZlYzIgcmVzb2x1dGlvbjtcXG5cIiArIFwiXFxuXCIgKyBcInZvaWQgbWFpbiggdm9pZCApIHtcXG5cIiArIFwiXFxuXCIgKyBcIlx0dmVjMiBwID0gKDIuMCpnbF9GcmFnQ29vcmQueHktcmVzb2x1dGlvbi54eSkvcmVzb2x1dGlvbi55O1xcblwiICsgXCIgICAgZmxvYXQgdGF1ID0gMy4xNDE1OTI2NTM1O1xcblwiICsgXCIgICAgZmxvYXQgYSA9IHNpbih0aW1lKTtcXG5cIiArIFwiICAgIGZsb2F0IHIgPSBsZW5ndGgocCkqMC43NTtcXG5cIiArIFwiICAgIHZlYzIgdXYgPSB2ZWMyKGEvdGF1LHIpO1xcblwiICsgXCJcdFxcblwiICsgXCJcdC8vZ2V0IHRoZSBjb2xvclxcblwiICsgXCJcdGZsb2F0IHhDb2wgPSAodXYueCAtICh0aW1lIC8gMy4wKSkgKiAzLjA7XFxuXCIgKyBcIlx0eENvbCA9IG1vZCh4Q29sLCAzLjApO1xcblwiICsgXCJcdHZlYzMgaG9yQ29sb3VyID0gdmVjMyhzaW4odGltZSoyLjk5KSoxLjI1LCBzaW4odGltZSozLjExMSkqMC4yNSwgc2luKHRpbWUqMS4zMSkqMC4yNSk7XFxuXCIgKyBcIlx0XFxuXCIgKyBcIlx0aWYgKHhDb2wgPCAuMSkge1xcblwiICsgXCJcdFx0XFxuXCIgKyBcIlx0XHRob3JDb2xvdXIuciArPSAxLjAgLSB4Q29sO1xcblwiICsgXCJcdFx0aG9yQ29sb3VyLmcgKz0geENvbDtcXG5cIiArIFwiXHR9XFxuXCIgKyBcIlx0ZWxzZSBpZiAoeENvbCA8IDAuNCkge1xcblwiICsgXCJcdFx0XFxuXCIgKyBcIlx0XHR4Q29sIC09IDEuMDtcXG5cIiArIFwiXHRcdGhvckNvbG91ci5nICs9IDEuMCAtIHhDb2w7XFxuXCIgKyBcIlx0XHRob3JDb2xvdXIuYiArPSB4Q29sO1xcblwiICsgXCJcdH1cXG5cIiArIFwiXHRlbHNlIHtcXG5cIiArIFwiXHRcdFxcblwiICsgXCJcdFx0eENvbCAtPSAyLjA7XFxuXCIgKyBcIlx0XHRob3JDb2xvdXIuYiArPSAxLjAgLSB4Q29sO1xcblwiICsgXCJcdFx0aG9yQ29sb3VyLnIgKz0geENvbDtcXG5cIiArIFwiXHR9XFxuXCIgKyBcIlxcblwiICsgXCJcdC8vIGRyYXcgY29sb3IgYmVhbVxcblwiICsgXCJcdHV2ID0gKDMuMCAqIHV2KSAtIGFicyhzaW4odGltZSkpO1xcblwiICsgXCJcdGZsb2F0IGJlYW1XaWR0aCA9IC4wKzEuMSphYnMoKHNpbih0aW1lKSowLjIqMi4wKSAvICgzLjAgKiB1di54ICogdXYueSkpO1xcblwiICsgXCJcdHZlYzMgaG9yQmVhbSA9IHZlYzMoYmVhbVdpZHRoKTtcXG5cIiArIFwiXHRnbF9GcmFnQ29sb3IgPSB2ZWM0KCgoIGhvckJlYW0pICogaG9yQ29sb3VyKSwgMS4wKTtcXG5cIiArIFwifVxcblwiO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnOTMyNjlaZ0tjeEI1WW5mU2cxa3ZMWG8nLCAnY2NTaGFkZXJfRWZmZWN0MjBfRnJhZycpO1xuLy8gU2hhZGVycy9jY1NoYWRlcl9FZmZlY3QyMF9GcmFnLmpzXG5cbm1vZHVsZS5leHBvcnRzID0gXCIjaWZkZWYgR0xfRVNcXG5cIiArIFwicHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7XFxuXCIgKyBcIiNlbmRpZlxcblwiICsgXCJcXG5cIiArIFwidW5pZm9ybSBmbG9hdCB0aW1lO1xcblwiICsgXCJ1bmlmb3JtIHZlYzIgbW91c2VfdG91Y2g7XFxuXCIgKyBcInVuaWZvcm0gdmVjMiByZXNvbHV0aW9uO1xcblwiICsgXCJcXG5cIiArIFwidm9pZCBtYWluKCB2b2lkICkge1xcblwiICsgXCJcXG5cIiArIFwiXHR2ZWMyIHAgPSAoMi4wKmdsX0ZyYWdDb29yZC54eS1yZXNvbHV0aW9uLnh5KS9yZXNvbHV0aW9uLnk7XFxuXCIgKyBcIiAgICBmbG9hdCB0YXUgPSAzLjE0MTU5MjY1MzU7XFxuXCIgKyBcIiAgICBmbG9hdCBhID0gc2luKHRpbWUpO1xcblwiICsgXCIgICAgZmxvYXQgciA9IGxlbmd0aChwKSowLjc1O1xcblwiICsgXCIgICAgdmVjMiB1diA9IHZlYzIoYS90YXUscik7XFxuXCIgKyBcIlx0XFxuXCIgKyBcIlx0Ly9nZXQgdGhlIGNvbG9yXFxuXCIgKyBcIlx0ZmxvYXQgeENvbCA9ICh1di54IC0gKHRpbWUgLyAzLjApKSAqIDMuMDtcXG5cIiArIFwiXHR4Q29sID0gbW9kKHhDb2wsIDMuMCk7XFxuXCIgKyBcIlx0dmVjMyBob3JDb2xvdXIgPSB2ZWMzKHNpbih0aW1lKjIuOTkpKjEuMjUsIHNpbih0aW1lKjMuMTExKSowLjI1LCBzaW4odGltZSoxLjMxKSowLjI1KTtcXG5cIiArIFwiXHRcXG5cIiArIFwiXHRpZiAoeENvbCA8IC4xKSB7XFxuXCIgKyBcIlx0XHRcXG5cIiArIFwiXHRcdGhvckNvbG91ci5yICs9IDEuMCAtIHhDb2w7XFxuXCIgKyBcIlx0XHRob3JDb2xvdXIuZyArPSB4Q29sO1xcblwiICsgXCJcdH1cXG5cIiArIFwiXHRlbHNlIGlmICh4Q29sIDwgMC40KSB7XFxuXCIgKyBcIlx0XHRcXG5cIiArIFwiXHRcdHhDb2wgLT0gMS4wO1xcblwiICsgXCJcdFx0aG9yQ29sb3VyLmcgKz0gMS4wIC0geENvbDtcXG5cIiArIFwiXHRcdGhvckNvbG91ci5iICs9IHhDb2w7XFxuXCIgKyBcIlx0fVxcblwiICsgXCJcdGVsc2Uge1xcblwiICsgXCJcdFx0XFxuXCIgKyBcIlx0XHR4Q29sIC09IDIuMDtcXG5cIiArIFwiXHRcdGhvckNvbG91ci5iICs9IDEuMCAtIHhDb2w7XFxuXCIgKyBcIlx0XHRob3JDb2xvdXIuciArPSB4Q29sO1xcblwiICsgXCJcdH1cXG5cIiArIFwiXFxuXCIgKyBcIlx0Ly8gZHJhdyBjb2xvciBiZWFtXFxuXCIgKyBcIlx0dXYgPSAoMy4wICogdXYpIC0gYWJzKHNpbih0aW1lKSk7XFxuXCIgKyBcIlx0ZmxvYXQgYmVhbVdpZHRoID0gLjArMS4xKmFicygoc2luKHRpbWUpKjAuMioyLjApIC8gKDMuMCAqIHV2LnggKiB1di55KSk7XFxuXCIgKyBcIlx0dmVjMyBob3JCZWFtID0gdmVjMyhiZWFtV2lkdGgpO1xcblwiICsgXCJcdGdsX0ZyYWdDb2xvciA9IHZlYzQoKCggaG9yQmVhbSkgKiBob3JDb2xvdXIpLCAxLjApO1xcblwiICsgXCJ9XFxuXCI7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc3MjkxY3hIYkJSS2ZySUNjZVIyQU03bCcsICdjY1NoYWRlcl9FZmZlY3QyMV9GcmFnJyk7XG4vLyBTaGFkZXJzL2NjU2hhZGVyX0VmZmVjdDIxX0ZyYWcuanNcblxubW9kdWxlLmV4cG9ydHMgPSBcIiNpZmRlZiBHTF9FU1xcblwiICsgXCJwcmVjaXNpb24gbWVkaXVtcCBmbG9hdDtcXG5cIiArIFwiI2VuZGlmXFxuXCIgKyBcIlxcblwiICsgXCJ1bmlmb3JtIGZsb2F0IHRpbWU7XFxuXCIgKyBcInVuaWZvcm0gdmVjMiBtb3VzZV90b3VjaDtcXG5cIiArIFwidW5pZm9ybSB2ZWMyIHJlc29sdXRpb247XFxuXCIgKyBcIlxcblwiICsgXCJ2b2lkIG1haW4oIHZvaWQgKSB7XFxuXCIgKyBcIlxcblwiICsgXCJcdHZlYzIgcCA9ICgyLjAqZ2xfRnJhZ0Nvb3JkLnh5LXJlc29sdXRpb24ueHkpL3Jlc29sdXRpb24ueTtcXG5cIiArIFwiICAgIGZsb2F0IHRhdSA9IDMuMTQxNTkyNjUzNTtcXG5cIiArIFwiICAgIGZsb2F0IGEgPSBzaW4odGltZSk7XFxuXCIgKyBcIiAgICBmbG9hdCByID0gbGVuZ3RoKHApKjAuNzU7XFxuXCIgKyBcIiAgICB2ZWMyIHV2ID0gdmVjMihhL3RhdSxyKTtcXG5cIiArIFwiXHRcXG5cIiArIFwiXHQvL2dldCB0aGUgY29sb3JcXG5cIiArIFwiXHRmbG9hdCB4Q29sID0gKHV2LnggLSAodGltZSAvIDMuMCkpICogMy4wO1xcblwiICsgXCJcdHhDb2wgPSBtb2QoeENvbCwgMy4wKTtcXG5cIiArIFwiXHR2ZWMzIGhvckNvbG91ciA9IHZlYzMoc2luKHRpbWUqMi45OSkqMS4yNSwgc2luKHRpbWUqMy4xMTEpKjAuMjUsIHNpbih0aW1lKjEuMzEpKjAuMjUpO1xcblwiICsgXCJcdFxcblwiICsgXCJcdGlmICh4Q29sIDwgLjEpIHtcXG5cIiArIFwiXHRcdFxcblwiICsgXCJcdFx0aG9yQ29sb3VyLnIgKz0gMS4wIC0geENvbDtcXG5cIiArIFwiXHRcdGhvckNvbG91ci5nICs9IHhDb2w7XFxuXCIgKyBcIlx0fVxcblwiICsgXCJcdGVsc2UgaWYgKHhDb2wgPCAwLjQpIHtcXG5cIiArIFwiXHRcdFxcblwiICsgXCJcdFx0eENvbCAtPSAxLjA7XFxuXCIgKyBcIlx0XHRob3JDb2xvdXIuZyArPSAxLjAgLSB4Q29sO1xcblwiICsgXCJcdFx0aG9yQ29sb3VyLmIgKz0geENvbDtcXG5cIiArIFwiXHR9XFxuXCIgKyBcIlx0ZWxzZSB7XFxuXCIgKyBcIlx0XHRcXG5cIiArIFwiXHRcdHhDb2wgLT0gMi4wO1xcblwiICsgXCJcdFx0aG9yQ29sb3VyLmIgKz0gMS4wIC0geENvbDtcXG5cIiArIFwiXHRcdGhvckNvbG91ci5yICs9IHhDb2w7XFxuXCIgKyBcIlx0fVxcblwiICsgXCJcXG5cIiArIFwiXHQvLyBkcmF3IGNvbG9yIGJlYW1cXG5cIiArIFwiXHR1diA9ICgzLjAgKiB1dikgLSBhYnMoc2luKHRpbWUpKTtcXG5cIiArIFwiXHRmbG9hdCBiZWFtV2lkdGggPSAuMCsxLjEqYWJzKChzaW4odGltZSkqMC4yKjIuMCkgLyAoMy4wICogdXYueCAqIHV2LnkpKTtcXG5cIiArIFwiXHR2ZWMzIGhvckJlYW0gPSB2ZWMzKGJlYW1XaWR0aCk7XFxuXCIgKyBcIlx0Z2xfRnJhZ0NvbG9yID0gdmVjNCgoKCBob3JCZWFtKSAqIGhvckNvbG91ciksIDEuMCk7XFxuXCIgKyBcIn1cXG5cIjtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzZiNmU3ampiU1pQT3JzOWQvUVcwcGZ6JywgJ2NjU2hhZGVyX0VmZmVjdDIyX0ZyYWcnKTtcbi8vIFNoYWRlcnMvY2NTaGFkZXJfRWZmZWN0MjJfRnJhZy5qc1xuXG5tb2R1bGUuZXhwb3J0cyA9IFwiI2lmZGVmIEdMX0VTXFxuXCIgKyBcInByZWNpc2lvbiBtZWRpdW1wIGZsb2F0O1xcblwiICsgXCIjZW5kaWZcXG5cIiArIFwiXFxuXCIgKyBcInVuaWZvcm0gZmxvYXQgdGltZTtcXG5cIiArIFwidW5pZm9ybSB2ZWMyIG1vdXNlX3RvdWNoO1xcblwiICsgXCJ1bmlmb3JtIHZlYzIgcmVzb2x1dGlvbjtcXG5cIiArIFwiXFxuXCIgKyBcInZvaWQgbWFpbiggdm9pZCApIHtcXG5cIiArIFwiXFxuXCIgKyBcIlx0dmVjMiBwID0gKDIuMCpnbF9GcmFnQ29vcmQueHktcmVzb2x1dGlvbi54eSkvcmVzb2x1dGlvbi55O1xcblwiICsgXCIgICAgZmxvYXQgdGF1ID0gMy4xNDE1OTI2NTM1O1xcblwiICsgXCIgICAgZmxvYXQgYSA9IHNpbih0aW1lKTtcXG5cIiArIFwiICAgIGZsb2F0IHIgPSBsZW5ndGgocCkqMC43NTtcXG5cIiArIFwiICAgIHZlYzIgdXYgPSB2ZWMyKGEvdGF1LHIpO1xcblwiICsgXCJcdFxcblwiICsgXCJcdC8vZ2V0IHRoZSBjb2xvclxcblwiICsgXCJcdGZsb2F0IHhDb2wgPSAodXYueCAtICh0aW1lIC8gMy4wKSkgKiAzLjA7XFxuXCIgKyBcIlx0eENvbCA9IG1vZCh4Q29sLCAzLjApO1xcblwiICsgXCJcdHZlYzMgaG9yQ29sb3VyID0gdmVjMyhzaW4odGltZSoyLjk5KSoxLjI1LCBzaW4odGltZSozLjExMSkqMC4yNSwgc2luKHRpbWUqMS4zMSkqMC4yNSk7XFxuXCIgKyBcIlx0XFxuXCIgKyBcIlx0aWYgKHhDb2wgPCAuMSkge1xcblwiICsgXCJcdFx0XFxuXCIgKyBcIlx0XHRob3JDb2xvdXIuciArPSAxLjAgLSB4Q29sO1xcblwiICsgXCJcdFx0aG9yQ29sb3VyLmcgKz0geENvbDtcXG5cIiArIFwiXHR9XFxuXCIgKyBcIlx0ZWxzZSBpZiAoeENvbCA8IDAuNCkge1xcblwiICsgXCJcdFx0XFxuXCIgKyBcIlx0XHR4Q29sIC09IDEuMDtcXG5cIiArIFwiXHRcdGhvckNvbG91ci5nICs9IDEuMCAtIHhDb2w7XFxuXCIgKyBcIlx0XHRob3JDb2xvdXIuYiArPSB4Q29sO1xcblwiICsgXCJcdH1cXG5cIiArIFwiXHRlbHNlIHtcXG5cIiArIFwiXHRcdFxcblwiICsgXCJcdFx0eENvbCAtPSAyLjA7XFxuXCIgKyBcIlx0XHRob3JDb2xvdXIuYiArPSAxLjAgLSB4Q29sO1xcblwiICsgXCJcdFx0aG9yQ29sb3VyLnIgKz0geENvbDtcXG5cIiArIFwiXHR9XFxuXCIgKyBcIlxcblwiICsgXCJcdC8vIGRyYXcgY29sb3IgYmVhbVxcblwiICsgXCJcdHV2ID0gKDMuMCAqIHV2KSAtIGFicyhzaW4odGltZSkpO1xcblwiICsgXCJcdGZsb2F0IGJlYW1XaWR0aCA9IC4wKzEuMSphYnMoKHNpbih0aW1lKSowLjIqMi4wKSAvICgzLjAgKiB1di54ICogdXYueSkpO1xcblwiICsgXCJcdHZlYzMgaG9yQmVhbSA9IHZlYzMoYmVhbVdpZHRoKTtcXG5cIiArIFwiXHRnbF9GcmFnQ29sb3IgPSB2ZWM0KCgoIGhvckJlYW0pICogaG9yQ29sb3VyKSwgMS4wKTtcXG5cIiArIFwifVxcblwiO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnYzBiYTFYcmZkUk1pb0dTRit5UTZXRFonLCAnY2NTaGFkZXJfRWZmZWN0MjNfRnJhZycpO1xuLy8gU2hhZGVycy9jY1NoYWRlcl9FZmZlY3QyM19GcmFnLmpzXG5cbm1vZHVsZS5leHBvcnRzID0gXCIjaWZkZWYgR0xfRVNcXG5cIiArIFwicHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7XFxuXCIgKyBcIiNlbmRpZlxcblwiICsgXCJcXG5cIiArIFwidW5pZm9ybSBmbG9hdCB0aW1lO1xcblwiICsgXCJ1bmlmb3JtIHZlYzIgbW91c2VfdG91Y2g7XFxuXCIgKyBcInVuaWZvcm0gdmVjMiByZXNvbHV0aW9uO1xcblwiICsgXCJcXG5cIiArIFwidm9pZCBtYWluKCB2b2lkICkge1xcblwiICsgXCJcXG5cIiArIFwiXHR2ZWMyIHAgPSAoMi4wKmdsX0ZyYWdDb29yZC54eS1yZXNvbHV0aW9uLnh5KS9yZXNvbHV0aW9uLnk7XFxuXCIgKyBcIiAgICBmbG9hdCB0YXUgPSAzLjE0MTU5MjY1MzU7XFxuXCIgKyBcIiAgICBmbG9hdCBhID0gc2luKHRpbWUpO1xcblwiICsgXCIgICAgZmxvYXQgciA9IGxlbmd0aChwKSowLjc1O1xcblwiICsgXCIgICAgdmVjMiB1diA9IHZlYzIoYS90YXUscik7XFxuXCIgKyBcIlx0XFxuXCIgKyBcIlx0Ly9nZXQgdGhlIGNvbG9yXFxuXCIgKyBcIlx0ZmxvYXQgeENvbCA9ICh1di54IC0gKHRpbWUgLyAzLjApKSAqIDMuMDtcXG5cIiArIFwiXHR4Q29sID0gbW9kKHhDb2wsIDMuMCk7XFxuXCIgKyBcIlx0dmVjMyBob3JDb2xvdXIgPSB2ZWMzKHNpbih0aW1lKjIuOTkpKjEuMjUsIHNpbih0aW1lKjMuMTExKSowLjI1LCBzaW4odGltZSoxLjMxKSowLjI1KTtcXG5cIiArIFwiXHRcXG5cIiArIFwiXHRpZiAoeENvbCA8IC4xKSB7XFxuXCIgKyBcIlx0XHRcXG5cIiArIFwiXHRcdGhvckNvbG91ci5yICs9IDEuMCAtIHhDb2w7XFxuXCIgKyBcIlx0XHRob3JDb2xvdXIuZyArPSB4Q29sO1xcblwiICsgXCJcdH1cXG5cIiArIFwiXHRlbHNlIGlmICh4Q29sIDwgMC40KSB7XFxuXCIgKyBcIlx0XHRcXG5cIiArIFwiXHRcdHhDb2wgLT0gMS4wO1xcblwiICsgXCJcdFx0aG9yQ29sb3VyLmcgKz0gMS4wIC0geENvbDtcXG5cIiArIFwiXHRcdGhvckNvbG91ci5iICs9IHhDb2w7XFxuXCIgKyBcIlx0fVxcblwiICsgXCJcdGVsc2Uge1xcblwiICsgXCJcdFx0XFxuXCIgKyBcIlx0XHR4Q29sIC09IDIuMDtcXG5cIiArIFwiXHRcdGhvckNvbG91ci5iICs9IDEuMCAtIHhDb2w7XFxuXCIgKyBcIlx0XHRob3JDb2xvdXIuciArPSB4Q29sO1xcblwiICsgXCJcdH1cXG5cIiArIFwiXFxuXCIgKyBcIlx0Ly8gZHJhdyBjb2xvciBiZWFtXFxuXCIgKyBcIlx0dXYgPSAoMy4wICogdXYpIC0gYWJzKHNpbih0aW1lKSk7XFxuXCIgKyBcIlx0ZmxvYXQgYmVhbVdpZHRoID0gLjArMS4xKmFicygoc2luKHRpbWUpKjAuMioyLjApIC8gKDMuMCAqIHV2LnggKiB1di55KSk7XFxuXCIgKyBcIlx0dmVjMyBob3JCZWFtID0gdmVjMyhiZWFtV2lkdGgpO1xcblwiICsgXCJcdGdsX0ZyYWdDb2xvciA9IHZlYzQoKCggaG9yQmVhbSkgKiBob3JDb2xvdXIpLCAxLjApO1xcblwiICsgXCJ9XFxuXCI7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc4N2E3N2lrMVBCUDJJVWsvKzZsQlI1QicsICdjY1NoYWRlcl9FZmZlY3QyNF9GcmFnJyk7XG4vLyBTaGFkZXJzL2NjU2hhZGVyX0VmZmVjdDI0X0ZyYWcuanNcblxubW9kdWxlLmV4cG9ydHMgPSBcIiNpZmRlZiBHTF9FU1xcblwiICsgXCJwcmVjaXNpb24gbWVkaXVtcCBmbG9hdDtcXG5cIiArIFwiI2VuZGlmXFxuXCIgKyBcIlxcblwiICsgXCJ1bmlmb3JtIGZsb2F0IHRpbWU7XFxuXCIgKyBcInVuaWZvcm0gdmVjMiBtb3VzZV90b3VjaDtcXG5cIiArIFwidW5pZm9ybSB2ZWMyIHJlc29sdXRpb247XFxuXCIgKyBcIlxcblwiICsgXCJ2b2lkIG1haW4oIHZvaWQgKSB7XFxuXCIgKyBcIlxcblwiICsgXCJcdHZlYzIgcCA9ICgyLjAqZ2xfRnJhZ0Nvb3JkLnh5LXJlc29sdXRpb24ueHkpL3Jlc29sdXRpb24ueTtcXG5cIiArIFwiICAgIGZsb2F0IHRhdSA9IDMuMTQxNTkyNjUzNTtcXG5cIiArIFwiICAgIGZsb2F0IGEgPSBzaW4odGltZSk7XFxuXCIgKyBcIiAgICBmbG9hdCByID0gbGVuZ3RoKHApKjAuNzU7XFxuXCIgKyBcIiAgICB2ZWMyIHV2ID0gdmVjMihhL3RhdSxyKTtcXG5cIiArIFwiXHRcXG5cIiArIFwiXHQvL2dldCB0aGUgY29sb3JcXG5cIiArIFwiXHRmbG9hdCB4Q29sID0gKHV2LnggLSAodGltZSAvIDMuMCkpICogMy4wO1xcblwiICsgXCJcdHhDb2wgPSBtb2QoeENvbCwgMy4wKTtcXG5cIiArIFwiXHR2ZWMzIGhvckNvbG91ciA9IHZlYzMoc2luKHRpbWUqMi45OSkqMS4yNSwgc2luKHRpbWUqMy4xMTEpKjAuMjUsIHNpbih0aW1lKjEuMzEpKjAuMjUpO1xcblwiICsgXCJcdFxcblwiICsgXCJcdGlmICh4Q29sIDwgLjEpIHtcXG5cIiArIFwiXHRcdFxcblwiICsgXCJcdFx0aG9yQ29sb3VyLnIgKz0gMS4wIC0geENvbDtcXG5cIiArIFwiXHRcdGhvckNvbG91ci5nICs9IHhDb2w7XFxuXCIgKyBcIlx0fVxcblwiICsgXCJcdGVsc2UgaWYgKHhDb2wgPCAwLjQpIHtcXG5cIiArIFwiXHRcdFxcblwiICsgXCJcdFx0eENvbCAtPSAxLjA7XFxuXCIgKyBcIlx0XHRob3JDb2xvdXIuZyArPSAxLjAgLSB4Q29sO1xcblwiICsgXCJcdFx0aG9yQ29sb3VyLmIgKz0geENvbDtcXG5cIiArIFwiXHR9XFxuXCIgKyBcIlx0ZWxzZSB7XFxuXCIgKyBcIlx0XHRcXG5cIiArIFwiXHRcdHhDb2wgLT0gMi4wO1xcblwiICsgXCJcdFx0aG9yQ29sb3VyLmIgKz0gMS4wIC0geENvbDtcXG5cIiArIFwiXHRcdGhvckNvbG91ci5yICs9IHhDb2w7XFxuXCIgKyBcIlx0fVxcblwiICsgXCJcXG5cIiArIFwiXHQvLyBkcmF3IGNvbG9yIGJlYW1cXG5cIiArIFwiXHR1diA9ICgzLjAgKiB1dikgLSBhYnMoc2luKHRpbWUpKTtcXG5cIiArIFwiXHRmbG9hdCBiZWFtV2lkdGggPSAuMCsxLjEqYWJzKChzaW4odGltZSkqMC4yKjIuMCkgLyAoMy4wICogdXYueCAqIHV2LnkpKTtcXG5cIiArIFwiXHR2ZWMzIGhvckJlYW0gPSB2ZWMzKGJlYW1XaWR0aCk7XFxuXCIgKyBcIlx0Z2xfRnJhZ0NvbG9yID0gdmVjNCgoKCBob3JCZWFtKSAqIGhvckNvbG91ciksIDEuMCk7XFxuXCIgKyBcIn1cXG5cIjtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzRjY2QzYlpMM05OWXBtMVJ0dGkwZ1huJywgJ2NjU2hhZGVyX0VmZmVjdDI1X0ZyYWcnKTtcbi8vIFNoYWRlcnMvY2NTaGFkZXJfRWZmZWN0MjVfRnJhZy5qc1xuXG5tb2R1bGUuZXhwb3J0cyA9IFwiI2lmZGVmIEdMX0VTXFxuXCIgKyBcInByZWNpc2lvbiBtZWRpdW1wIGZsb2F0O1xcblwiICsgXCIjZW5kaWZcXG5cIiArIFwiXFxuXCIgKyBcInVuaWZvcm0gZmxvYXQgdGltZTtcXG5cIiArIFwidW5pZm9ybSB2ZWMyIG1vdXNlX3RvdWNoO1xcblwiICsgXCJ1bmlmb3JtIHZlYzIgcmVzb2x1dGlvbjtcXG5cIiArIFwiXFxuXCIgKyBcInZvaWQgbWFpbiggdm9pZCApIHtcXG5cIiArIFwiXFxuXCIgKyBcIlx0dmVjMiBwID0gKDIuMCpnbF9GcmFnQ29vcmQueHktcmVzb2x1dGlvbi54eSkvcmVzb2x1dGlvbi55O1xcblwiICsgXCIgICAgZmxvYXQgdGF1ID0gMy4xNDE1OTI2NTM1O1xcblwiICsgXCIgICAgZmxvYXQgYSA9IHNpbih0aW1lKTtcXG5cIiArIFwiICAgIGZsb2F0IHIgPSBsZW5ndGgocCkqMC43NTtcXG5cIiArIFwiICAgIHZlYzIgdXYgPSB2ZWMyKGEvdGF1LHIpO1xcblwiICsgXCJcdFxcblwiICsgXCJcdC8vZ2V0IHRoZSBjb2xvclxcblwiICsgXCJcdGZsb2F0IHhDb2wgPSAodXYueCAtICh0aW1lIC8gMy4wKSkgKiAzLjA7XFxuXCIgKyBcIlx0eENvbCA9IG1vZCh4Q29sLCAzLjApO1xcblwiICsgXCJcdHZlYzMgaG9yQ29sb3VyID0gdmVjMyhzaW4odGltZSoyLjk5KSoxLjI1LCBzaW4odGltZSozLjExMSkqMC4yNSwgc2luKHRpbWUqMS4zMSkqMC4yNSk7XFxuXCIgKyBcIlx0XFxuXCIgKyBcIlx0aWYgKHhDb2wgPCAuMSkge1xcblwiICsgXCJcdFx0XFxuXCIgKyBcIlx0XHRob3JDb2xvdXIuciArPSAxLjAgLSB4Q29sO1xcblwiICsgXCJcdFx0aG9yQ29sb3VyLmcgKz0geENvbDtcXG5cIiArIFwiXHR9XFxuXCIgKyBcIlx0ZWxzZSBpZiAoeENvbCA8IDAuNCkge1xcblwiICsgXCJcdFx0XFxuXCIgKyBcIlx0XHR4Q29sIC09IDEuMDtcXG5cIiArIFwiXHRcdGhvckNvbG91ci5nICs9IDEuMCAtIHhDb2w7XFxuXCIgKyBcIlx0XHRob3JDb2xvdXIuYiArPSB4Q29sO1xcblwiICsgXCJcdH1cXG5cIiArIFwiXHRlbHNlIHtcXG5cIiArIFwiXHRcdFxcblwiICsgXCJcdFx0eENvbCAtPSAyLjA7XFxuXCIgKyBcIlx0XHRob3JDb2xvdXIuYiArPSAxLjAgLSB4Q29sO1xcblwiICsgXCJcdFx0aG9yQ29sb3VyLnIgKz0geENvbDtcXG5cIiArIFwiXHR9XFxuXCIgKyBcIlxcblwiICsgXCJcdC8vIGRyYXcgY29sb3IgYmVhbVxcblwiICsgXCJcdHV2ID0gKDMuMCAqIHV2KSAtIGFicyhzaW4odGltZSkpO1xcblwiICsgXCJcdGZsb2F0IGJlYW1XaWR0aCA9IC4wKzEuMSphYnMoKHNpbih0aW1lKSowLjIqMi4wKSAvICgzLjAgKiB1di54ICogdXYueSkpO1xcblwiICsgXCJcdHZlYzMgaG9yQmVhbSA9IHZlYzMoYmVhbVdpZHRoKTtcXG5cIiArIFwiXHRnbF9GcmFnQ29sb3IgPSB2ZWM0KCgoIGhvckJlYW0pICogaG9yQ29sb3VyKSwgMS4wKTtcXG5cIiArIFwifVxcblwiO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnM2MzYWVTbEFybE1wb2Ivcm52MzdEVTYnLCAnY2NTaGFkZXJfRWZmZWN0MjZfRnJhZycpO1xuLy8gU2hhZGVycy9jY1NoYWRlcl9FZmZlY3QyNl9GcmFnLmpzXG5cbm1vZHVsZS5leHBvcnRzID0gXCIjaWZkZWYgR0xfRVNcXG5cIiArIFwicHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7XFxuXCIgKyBcIiNlbmRpZlxcblwiICsgXCJcXG5cIiArIFwidW5pZm9ybSBmbG9hdCB0aW1lO1xcblwiICsgXCJ1bmlmb3JtIHZlYzIgbW91c2VfdG91Y2g7XFxuXCIgKyBcInVuaWZvcm0gdmVjMiByZXNvbHV0aW9uO1xcblwiICsgXCJcXG5cIiArIFwidm9pZCBtYWluKCB2b2lkICkge1xcblwiICsgXCJcXG5cIiArIFwiXHR2ZWMyIHAgPSAoMi4wKmdsX0ZyYWdDb29yZC54eS1yZXNvbHV0aW9uLnh5KS9yZXNvbHV0aW9uLnk7XFxuXCIgKyBcIiAgICBmbG9hdCB0YXUgPSAzLjE0MTU5MjY1MzU7XFxuXCIgKyBcIiAgICBmbG9hdCBhID0gc2luKHRpbWUpO1xcblwiICsgXCIgICAgZmxvYXQgciA9IGxlbmd0aChwKSowLjc1O1xcblwiICsgXCIgICAgdmVjMiB1diA9IHZlYzIoYS90YXUscik7XFxuXCIgKyBcIlx0XFxuXCIgKyBcIlx0Ly9nZXQgdGhlIGNvbG9yXFxuXCIgKyBcIlx0ZmxvYXQgeENvbCA9ICh1di54IC0gKHRpbWUgLyAzLjApKSAqIDMuMDtcXG5cIiArIFwiXHR4Q29sID0gbW9kKHhDb2wsIDMuMCk7XFxuXCIgKyBcIlx0dmVjMyBob3JDb2xvdXIgPSB2ZWMzKHNpbih0aW1lKjIuOTkpKjEuMjUsIHNpbih0aW1lKjMuMTExKSowLjI1LCBzaW4odGltZSoxLjMxKSowLjI1KTtcXG5cIiArIFwiXHRcXG5cIiArIFwiXHRpZiAoeENvbCA8IC4xKSB7XFxuXCIgKyBcIlx0XHRcXG5cIiArIFwiXHRcdGhvckNvbG91ci5yICs9IDEuMCAtIHhDb2w7XFxuXCIgKyBcIlx0XHRob3JDb2xvdXIuZyArPSB4Q29sO1xcblwiICsgXCJcdH1cXG5cIiArIFwiXHRlbHNlIGlmICh4Q29sIDwgMC40KSB7XFxuXCIgKyBcIlx0XHRcXG5cIiArIFwiXHRcdHhDb2wgLT0gMS4wO1xcblwiICsgXCJcdFx0aG9yQ29sb3VyLmcgKz0gMS4wIC0geENvbDtcXG5cIiArIFwiXHRcdGhvckNvbG91ci5iICs9IHhDb2w7XFxuXCIgKyBcIlx0fVxcblwiICsgXCJcdGVsc2Uge1xcblwiICsgXCJcdFx0XFxuXCIgKyBcIlx0XHR4Q29sIC09IDIuMDtcXG5cIiArIFwiXHRcdGhvckNvbG91ci5iICs9IDEuMCAtIHhDb2w7XFxuXCIgKyBcIlx0XHRob3JDb2xvdXIuciArPSB4Q29sO1xcblwiICsgXCJcdH1cXG5cIiArIFwiXFxuXCIgKyBcIlx0Ly8gZHJhdyBjb2xvciBiZWFtXFxuXCIgKyBcIlx0dXYgPSAoMy4wICogdXYpIC0gYWJzKHNpbih0aW1lKSk7XFxuXCIgKyBcIlx0ZmxvYXQgYmVhbVdpZHRoID0gLjArMS4xKmFicygoc2luKHRpbWUpKjAuMioyLjApIC8gKDMuMCAqIHV2LnggKiB1di55KSk7XFxuXCIgKyBcIlx0dmVjMyBob3JCZWFtID0gdmVjMyhiZWFtV2lkdGgpO1xcblwiICsgXCJcdGdsX0ZyYWdDb2xvciA9IHZlYzQoKCggaG9yQmVhbSkgKiBob3JDb2xvdXIpLCAxLjApO1xcblwiICsgXCJ9XFxuXCI7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICdhYzQ0MnRzVFJkRllwSUZxR2ZIV3pDVicsICdjY1NoYWRlcl9FbWJvc3NfRnJhZycpO1xuLy8gU2hhZGVycy9jY1NoYWRlcl9FbWJvc3NfRnJhZy5qc1xuXG4vKiDmta7pm5UgKi9cblxubW9kdWxlLmV4cG9ydHMgPSBcInByZWNpc2lvbiBtZWRpdW1wIGZsb2F0O1xcblwiICsgXCJ2YXJ5aW5nIHZlYzIgdl90ZXhDb29yZDtcXG5cIiArIFwidW5pZm9ybSBmbG9hdCB3aWR0aFN0ZXA7XFxuXCIgKyBcInVuaWZvcm0gZmxvYXQgaGVpZ2h0U3RlcDtcXG5cIiArIFwiY29uc3QgZmxvYXQgc3RyaWRlID0gMi4wO1xcblwiICsgXCJ2b2lkIG1haW4oKVxcblwiICsgXCJ7XFxuXCIgKyBcIiAgICB2ZWMzIHRtcENvbG9yID0gdGV4dHVyZTJEKENDX1RleHR1cmUwLCB2X3RleENvb3JkICsgdmVjMih3aWR0aFN0ZXAgKiBzdHJpZGUsIGhlaWdodFN0ZXAgKiBzdHJpZGUpKS5yZ2I7XFxuXCIgKyBcIiAgICB0bXBDb2xvciA9IHRleHR1cmUyRChDQ19UZXh0dXJlMCwgdl90ZXhDb29yZCkucmdiIC0gdG1wQ29sb3IgKyAwLjU7XFxuXCIgKyBcIiAgICBmbG9hdCBmID0gKHRtcENvbG9yLnIgKyB0bXBDb2xvci5nICsgdG1wQ29sb3IuYikgLyAzLjA7XFxuXCIgKyBcIiAgICBnbF9GcmFnQ29sb3IgPSB2ZWM0KGYsIGYsIGYsIDEuMCk7XFxuXCIgKyBcIn1cXG5cIjtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2QyMjRmem1TSWhQT28xNlhvVjF4cFlTJywgJ2NjU2hhZGVyX0dsYXNzX0ZyYWcnKTtcbi8vIFNoYWRlcnMvY2NTaGFkZXJfR2xhc3NfRnJhZy5qc1xuXG4vKiDno6jnoILnjrvnkoMgMS4wICovXG4vKiDno6jnoILnjrvnkoMgMy4wICovXG4vKiDno6jnoILnjrvnkoMgNi4wICovXG5cbm1vZHVsZS5leHBvcnRzID0gXCJwcmVjaXNpb24gbWVkaXVtcCBmbG9hdDtcXG5cIiArIFwidmFyeWluZyB2ZWMyIHZfdGV4Q29vcmQ7XFxuXCIgKyBcInVuaWZvcm0gZmxvYXQgd2lkdGhTdGVwO1xcblwiICsgXCJ1bmlmb3JtIGZsb2F0IGhlaWdodFN0ZXA7XFxuXCIgKyBcInVuaWZvcm0gZmxvYXQgYmx1clJhZGl1c1NjYWxlO1xcblwiICsgXCJjb25zdCBmbG9hdCBibHVyUmFkaXVzID0gNi4wO1xcblwiICsgXCJjb25zdCBmbG9hdCBibHVyUGl4ZWxzID0gKGJsdXJSYWRpdXMgKiAyLjAgKyAxLjApICogKGJsdXJSYWRpdXMgKiAyLjAgKyAxLjApO1xcblwiICsgXCJmbG9hdCByYW5kb20odmVjMyBzY2FsZSwgZmxvYXQgc2VlZCkge1xcblwiICsgXCIgICAgcmV0dXJuIGZyYWN0KHNpbihkb3QoZ2xfRnJhZ0Nvb3JkLnh5eiArIHNlZWQsIHNjYWxlKSkgKiA0Mzc1OC41NDUzICsgc2VlZCk7XFxuXCIgKyBcIn1cXG5cIiArIFwidm9pZCBtYWluKClcXG5cIiArIFwie1xcblwiICsgXCIgICAgdmVjMyBzdW1Db2xvciA9IHZlYzMoMC4wLCAwLjAsIDAuMCk7XFxuXCIgKyBcIiAgICBmb3IoZmxvYXQgZnkgPSAtYmx1clJhZGl1czsgZnkgPD0gYmx1clJhZGl1czsgKytmeSlcXG5cIiArIFwiICAgIHtcXG5cIiArIFwiICAgICAgICBmbG9hdCBkaXIgPSByYW5kb20odmVjMygxMi45ODk4LCA3OC4yMzMsIDE1MS43MTgyKSwgMC4wKTtcXG5cIiArIFwiICAgICAgICBmb3IoZmxvYXQgZnggPSAtYmx1clJhZGl1czsgZnggPD0gYmx1clJhZGl1czsgKytmeClcXG5cIiArIFwiICAgICAgICB7XFxuXCIgKyBcIiAgICAgICAgICAgIGZsb2F0IGRpcyA9IGRpc3RhbmNlKHZlYzIoZnggKiB3aWR0aFN0ZXAsIGZ5ICogaGVpZ2h0U3RlcCksIHZlYzIoMC4wLCAwLjApKSAqIGJsdXJSYWRpdXNTY2FsZTtcXG5cIiArIFwiICAgICAgICAgICAgdmVjMiBjb29yZCA9IHZlYzIoZGlzICogY29zKGRpciksIGRpcyAqIHNpbihkaXIpKTtcXG5cIiArIFwiICAgICAgICAgICAgc3VtQ29sb3IgKz0gdGV4dHVyZTJEKENDX1RleHR1cmUwLCB2X3RleENvb3JkICsgY29vcmQpLnJnYjtcXG5cIiArIFwiICAgICAgICB9XFxuXCIgKyBcIiAgICB9XFxuXCIgKyBcIiAgICBnbF9GcmFnQ29sb3IgPSB2ZWM0KHN1bUNvbG9yIC8gYmx1clBpeGVscywgMS4wKTtcXG5cIiArIFwifVxcblwiO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnNzM4ODh4b0p3VklXcmhaYzV5Z2FXekUnLCAnY2NTaGFkZXJfR3JheV9GcmFnJyk7XG4vLyBTaGFkZXJzL2NjU2hhZGVyX0dyYXlfRnJhZy5qc1xuXG4vKiDngbDluqYgKi9cblxubW9kdWxlLmV4cG9ydHMgPSBcInByZWNpc2lvbiBtZWRpdW1wIGZsb2F0O1xcblwiICsgXCJ2YXJ5aW5nIHZlYzIgdl90ZXhDb29yZDtcXG5cIiArIFwidm9pZCBtYWluKClcXG5cIiArIFwie1xcblwiICsgXCIgICAgdmVjMyB2ID0gdGV4dHVyZTJEKENDX1RleHR1cmUwLCB2X3RleENvb3JkKS5yZ2I7XFxuXCIgKyBcIiAgICBmbG9hdCBmID0gdi5yICogMC4yOTkgKyB2LmcgKiAwLjU4NyArIHYuYiAqIDAuMTE0O1xcblwiICsgXCIgICAgZ2xfRnJhZ0NvbG9yID0gdmVjNChmLCBmLCBmLCAxLjApO1xcblwiICsgXCJ9XFxuXCI7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc5NmMzM3cwMjVkRlhvUTBFbnlrMFpxNCcsICdjY1NoYWRlcl9MaWdodEVmZmVjdF9GcmFnJyk7XG4vLyBTaGFkZXJzL2NjU2hhZGVyX0xpZ2h0RWZmZWN0X0ZyYWcuanNcblxubW9kdWxlLmV4cG9ydHMgPSBcInByZWNpc2lvbiBtZWRpdW1wIGZsb2F0O1xcblwiICsgXCJ2YXJ5aW5nIHZlYzIgdl90ZXhDb29yZDtcXG5cIiArIFwidW5pZm9ybSBmbG9hdCB0aW1lO1xcblwiICsgXCJ1bmlmb3JtIHZlYzIgbW91c2VfdG91Y2g7XFxuXCIgKyBcInVuaWZvcm0gdmVjMiByZXNvbHV0aW9uO1xcblwiICsgXCJjb25zdCBmbG9hdCBtaW5SU3RhcnQgPSAtMi4wO1xcblwiICsgXCJjb25zdCBmbG9hdCBtYXhSU3RhcnQgPSAxLjA7XFxuXCIgKyBcImNvbnN0IGZsb2F0IG1pbklTdGFydCA9IC0xLjA7XFxuXCIgKyBcImNvbnN0IGZsb2F0IG1heElTdGFydCA9IDEuMDtcXG5cIiArIFwiY29uc3QgaW50IG1heEl0ZXJhdGlvbnMgPSA1MDtcXG5cIiArIFwiLy8gSW1tYWdpbmFyeSBudW1iZXI6IGhhcyBhIHJlYWwgYW5kIGltbWFnaW5hcnkgcGFydFxcblwiICsgXCJzdHJ1Y3QgY29tcGxleE51bWJlclxcblwiICsgXCJ7XFxuXCIgKyBcIlx0ZmxvYXQgcjtcXG5cIiArIFwiXHRmbG9hdCBpO1xcblwiICsgXCJ9O1xcblwiICsgXCJ2b2lkIG1haW4oIHZvaWQgKSB7XFxuXCIgKyBcIlx0ZmxvYXQgbWluUiA9IG1pblJTdGFydDsgLy8gY2hhbmdlIHRoZXNlIGluIG9yZGVyIHRvIHpvb21cXG5cIiArIFwiXHRmbG9hdCBtYXhSID0gbWF4UlN0YXJ0O1xcblwiICsgXCJcdGZsb2F0IG1pbkkgPSBtaW5JU3RhcnQ7XFxuXCIgKyBcIlx0ZmxvYXQgbWF4SSA9IG1heElTdGFydDtcXG5cIiArIFwiXHRcXG5cIiArIFwiXHR2ZWMzIGNvbCA9IHZlYzMoMCwwLDApO1xcblwiICsgXCJcdFxcblwiICsgXCJcdHZlYzIgcG9zID0gZ2xfRnJhZ0Nvb3JkLnh5IC8gcmVzb2x1dGlvbjtcXG5cIiArIFwiXHRcXG5cIiArIFwiXHQvLyBUaGUgY29tcGxleCBudW1iZXIgb2YgdGhlIGN1cnJlbnQgcGl4ZWwuXFxuXCIgKyBcIlx0Y29tcGxleE51bWJlciBpbTtcXG5cIiArIFwiXHRpbS5yID0gbWluUiArIChtYXhSLW1pblIpKnBvcy54OyAvLyBMRVJQIHdpdGhpbiByYW5nZVxcblwiICsgXCJcdGltLmkgPSBtaW5JICsgKG1heEktbWluSSkqcG9zLnk7XFxuXCIgKyBcIlx0XFxuXCIgKyBcIlx0Y29tcGxleE51bWJlciB6O1xcblwiICsgXCJcdHouciA9IGltLnI7XFxuXCIgKyBcIlx0ei5pID0gaW0uaTtcXG5cIiArIFwiXHRcXG5cIiArIFwiXHRib29sIGRlZiA9IHRydWU7IC8vIGlzIHRoZSBudW1iZXIgKGltKSBkZWZpbml0ZT9cXG5cIiArIFwiXHRpbnQgaXRlcmF0aW9ucyA9IDA7XFxuXCIgKyBcIlx0Zm9yKGludCBpID0gMDsgaTwgbWF4SXRlcmF0aW9uczsgaSsrKVxcblwiICsgXCJcdHtcXG5cIiArIFwiXHRcdGlmKHNxcnQoei5yKnouciArIHouaSp6LmkpID4gMi4wKSAvLyBhYnMoeikgPSBkaXN0YW5jZSBmcm9tIG9yaWdvXFxuXCIgKyBcIlx0XHR7XFxuXCIgKyBcIlx0XHRcdGRlZiA9IGZhbHNlO1xcblwiICsgXCJcdFx0XHRpdGVyYXRpb25zID0gaTsgXFxuXCIgKyBcIlx0XHRcdGJyZWFrO1xcblwiICsgXCJcdFx0fVxcblwiICsgXCJcdFx0Ly8gTWFuZGVsYnJvdCBmb3JtdWxhOiB6TmV3ID0gek9sZCp6T2xkICsgaW1cXG5cIiArIFwiXHRcdC8vIHogPSAoYStiaSkgPT4geip6ID0gKGErYmkpKGErYmkpID0gYSphIC0gYipiICsgMmFiaVxcblwiICsgXCJcdFx0Y29tcGxleE51bWJlciB6U3F1YXJlZDsgXFxuXCIgKyBcIlx0XHR6U3F1YXJlZC5yID0gei5yKnouciAtIHouaSp6Lmk7IC8vIHJlYWwgcGFydDogYSphIC0gYipiXFxuXCIgKyBcIlx0XHR6U3F1YXJlZC5pID0gMi4wKnoucip6Lmk7IC8vIGltbWFnaW5hcnkgcGFydDogMmFiaVxcblwiICsgXCJcdFx0Ly8gYWRkOiByU3F1YXJlZCArIGltIC0+IHNpbXBsZToganVzdCBhZGQgdGhlIHJlYWwgYW5kIGltbWFnaW5hcnkgcGFydHNcXG5cIiArIFwiXHRcdHouciA9IHpTcXVhcmVkLnIgKyBpbS5yOyAvLyBhZGQgcmVhbCBwYXJ0c1xcblwiICsgXCJcdFx0ei5pID0gelNxdWFyZWQuaSArIGltLmk7IC8vIGFkZCBpbW1hZ2luYXJ5IHBhcnRzXFxuXCIgKyBcIlx0fVxcblwiICsgXCJcdGlmKGRlZikgLy8gaXQgaXMgZGVmaW5pdGUgPT4gY29sb3VyIGl0IGJsYWNrXFxuXCIgKyBcIlx0XHRjb2wucmdiID0gdmVjMygwLDAsMCk7XFxuXCIgKyBcIlx0ZWxzZSAvLyB0aGUgbnVtYmVyIGdyb3dzIHRvIGluZmluaXR5ID0+IGNvbG91ciBpdCBieSB0aGUgbnVtYmVyIG9mIGl0ZXJhdGlvbnMgXFxuXCIgKyBcIlx0e1xcblwiICsgXCJcdFx0ZmxvYXQgaSA9IGZsb2F0KGl0ZXJhdGlvbnMpL2Zsb2F0KG1heEl0ZXJhdGlvbnMpO1xcblwiICsgXCJcdFx0Y29sLnIgPSBzbW9vdGhzdGVwKDAuMCwwLjUsIGkpO1xcblwiICsgXCJcdFx0Y29sLmcgPSBzbW9vdGhzdGVwKDAuMCwxLjAsaSk7XFxuXCIgKyBcIlx0XHRjb2wuYiA9IHNtb290aHN0ZXAoMC4zLDEuMCwgaSk7XFxuXCIgKyBcIlx0fVxcblwiICsgXCJcdGdsX0ZyYWdDb2xvci5yZ2IgPSBjb2w7XFxuXCIgKyBcIn1cXG5cIjtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2M3ODNjaUdqQ2hGd0lLcldneHhxY0lmJywgJ2NjU2hhZGVyX05lZ2F0aXZlX0JsYWNrX1doaXRlX0ZyYWcnKTtcbi8vIFNoYWRlcnMvY2NTaGFkZXJfTmVnYXRpdmVfQmxhY2tfV2hpdGVfRnJhZy5qc1xuXG4vKiDlupXniYfpu5Hnmb0gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBcInByZWNpc2lvbiBtZWRpdW1wIGZsb2F0O1xcblwiICsgXCJ2YXJ5aW5nIHZlYzIgdl90ZXhDb29yZDtcXG5cIiArIFwidm9pZCBtYWluKClcXG5cIiArIFwie1xcblwiICsgXCIgICAgdmVjMyB2ID0gdGV4dHVyZTJEKENDX1RleHR1cmUwLCB2X3RleENvb3JkKS5yZ2I7XFxuXCIgKyBcIiAgICBmbG9hdCBmID0gMS4wIC0gKHYuciAqIDAuMyArIHYuZyAqIDAuNTkgKyB2LmIgKiAwLjExKTtcXG5cIiArIFwiICAgIGdsX0ZyYWdDb2xvciA9IHZlYzQoZiwgZiwgZiwgMS4wKTtcXG5cIiArIFwifVxcblwiO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnMjJiODZRd0RlOUFMTFBFTUZ6RXI3L0knLCAnY2NTaGFkZXJfTmVnYXRpdmVfSW1hZ2VfRnJhZycpO1xuLy8gU2hhZGVycy9jY1NoYWRlcl9OZWdhdGl2ZV9JbWFnZV9GcmFnLmpzXG5cbi8qIOW6leeJh+mVnOWDjyAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IFwicHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7XFxuXCIgKyBcInZhcnlpbmcgdmVjMiB2X3RleENvb3JkO1xcblwiICsgXCJ2b2lkIG1haW4oKVxcblwiICsgXCJ7XFxuXCIgKyBcIlx0Z2xfRnJhZ0NvbG9yID0gdmVjNCgxLjAgLSB0ZXh0dXJlMkQoQ0NfVGV4dHVyZTAsIHZfdGV4Q29vcmQpLnJnYiwgMS4wKTtcXG5cIiArIFwifVxcblwiO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnYzI3MmV2VG9icExpb1ZjWjhZVVJuV1EnLCAnY2NTaGFkZXJfU2hhZG93X0JsYWNrX1doaXRlX0ZyYWcnKTtcbi8vIFNoYWRlcnMvY2NTaGFkZXJfU2hhZG93X0JsYWNrX1doaXRlX0ZyYWcuanNcblxuLyog5riQ5Y+Y6buR55m9ICovXG5cbm1vZHVsZS5leHBvcnRzID0gXCJwcmVjaXNpb24gbWVkaXVtcCBmbG9hdDtcXG5cIiArIFwidmFyeWluZyB2ZWMyIHZfdGV4Q29vcmQ7XFxuXCIgKyBcInVuaWZvcm0gZmxvYXQgc3RyZW5ndGg7XFxuXCIgKyBcInZvaWQgbWFpbigpXFxuXCIgKyBcIntcXG5cIiArIFwiICAgIHZlYzMgdiA9IHRleHR1cmUyRChDQ19UZXh0dXJlMCwgdl90ZXhDb29yZCkucmdiO1xcblwiICsgXCIgICAgZmxvYXQgZiA9IHN0ZXAoc3RyZW5ndGgsICh2LnIgKyB2LmcgKyB2LmIpIC8gMy4wICk7XFxuXCIgKyBcIiAgICBnbF9GcmFnQ29sb3IgPSB2ZWM0KGYsIGYsIGYsIDEuMCk7XFxuXCIgKyBcIn1cXG5cIjtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2U2YTUxTEdZSVpFQzdWNjFqNUtpZ21IJywgJ2NjU2hhZGVyX1dhdmVfSF9GcmFnJyk7XG4vLyBTaGFkZXJzL2NjU2hhZGVyX1dhdmVfSF9GcmFnLmpzXG5cbi8qIOawtOW5s+azoua1qiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IFwicHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7XFxuXCIgKyBcInZhcnlpbmcgdmVjMiB2X3RleENvb3JkO1xcblwiICsgXCJ1bmlmb3JtIGZsb2F0IG1vdGlvbjtcXG5cIiArIFwidW5pZm9ybSBmbG9hdCBhbmdsZTtcXG5cIiArIFwidm9pZCBtYWluKClcXG5cIiArIFwie1xcblwiICsgXCIgICAgdmVjMiB0bXAgPSB2X3RleENvb3JkO1xcblwiICsgXCIgICAgdG1wLnggPSB0bXAueCArIDAuMDUgKiBzaW4obW90aW9uICsgIHRtcC55ICogYW5nbGUpO1xcblwiICsgXCIgICAgZ2xfRnJhZ0NvbG9yID0gdGV4dHVyZTJEKENDX1RleHR1cmUwLCB0bXApO1xcblwiICsgXCJ9XFxuXCI7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc3MDNlMUszb2VsTTA0R0d4Y2x6SlBQSycsICdjY1NoYWRlcl9XYXZlX1ZIX0ZyYWcnKTtcbi8vIFNoYWRlcnMvY2NTaGFkZXJfV2F2ZV9WSF9GcmFnLmpzXG5cbi8qIOWFqOWxgOazoua1qiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IFwicHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7XFxuXCIgKyBcInZhcnlpbmcgdmVjMiB2X3RleENvb3JkO1xcblwiICsgXCJ1bmlmb3JtIGZsb2F0IG1vdGlvbjtcXG5cIiArIFwidW5pZm9ybSBmbG9hdCBhbmdsZTtcXG5cIiArIFwidm9pZCBtYWluKClcXG5cIiArIFwie1xcblwiICsgXCIgICAgdmVjMiB0bXAgPSB2X3RleENvb3JkO1xcblwiICsgXCIgICAgdG1wLnggPSB0bXAueCArIDAuMDEgKiBzaW4obW90aW9uICsgIHRtcC54ICogYW5nbGUpO1xcblwiICsgXCIgICAgdG1wLnkgPSB0bXAueSArIDAuMDEgKiBzaW4obW90aW9uICsgIHRtcC55ICogYW5nbGUpO1xcblwiICsgXCIgICAgZ2xfRnJhZ0NvbG9yID0gdGV4dHVyZTJEKENDX1RleHR1cmUwLCB0bXApO1xcblwiICsgXCJ9XFxuXCI7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICcwMzVjNTFpbHE1RTVLMHZSOGd4Sms2MycsICdjY1NoYWRlcl9XYXZlX1ZfRnJhZycpO1xuLy8gU2hhZGVycy9jY1NoYWRlcl9XYXZlX1ZfRnJhZy5qc1xuXG4vKiDlnoLnm7Tms6LmtaogKi9cblxubW9kdWxlLmV4cG9ydHMgPSBcInByZWNpc2lvbiBtZWRpdW1wIGZsb2F0O1xcblwiICsgXCJ2YXJ5aW5nIHZlYzIgdl90ZXhDb29yZDtcXG5cIiArIFwidW5pZm9ybSBmbG9hdCBtb3Rpb247XFxuXCIgKyBcInVuaWZvcm0gZmxvYXQgYW5nbGU7XFxuXCIgKyBcInZvaWQgbWFpbigpXFxuXCIgKyBcIntcXG5cIiArIFwiICAgIHZlYzIgdG1wID0gdl90ZXhDb29yZDtcXG5cIiArIFwiICAgIHRtcC55ID0gdG1wLnkgKyAwLjA1ICogc2luKG1vdGlvbiArICB0bXAueCAqIGFuZ2xlKTtcXG5cIiArIFwiICAgIGdsX0ZyYWdDb2xvciA9IHRleHR1cmUyRChDQ19UZXh0dXJlMCwgdG1wKTtcXG5cIiArIFwifVxcblwiO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnMjk0YmFuTHhoTk9uWmhsZk92bHd0SUEnLCAnY2NTaGFkZXJfbGlnaHRuaW5nQm9sdF9GcmFnJyk7XG4vLyBTaGFkZXJzL2NjU2hhZGVyX2xpZ2h0bmluZ0JvbHRfRnJhZy5qc1xuXG5tb2R1bGUuZXhwb3J0cyA9IFwiI2lmZGVmIEdMX0VTXFxuXCIgKyBcInByZWNpc2lvbiBtZWRpdW1wIGZsb2F0O1xcblwiICsgXCIjZW5kaWZcXG5cIiArIFwiXFxuXCIgKyBcInZhcnlpbmcgdmVjMiB2X3RleENvb3JkO1xcblwiICsgXCJ2YXJ5aW5nIHZlYzQgdl9jb2xvcjtcXG5cIiArIFwiLy91bmlmb3JtIHNhbXBsZXIyRCBDQ19UZXh0dXJlMDtcXG5cIiArIFwidW5pZm9ybSBmbG9hdCB1X29wYWNpdHk7XFxuXCIgKyBcIlxcblwiICsgXCJ2b2lkIG1haW4oKSB7XFxuXCIgKyBcIiAgICB2ZWM0IHRleENvbG9yPXRleHR1cmUyRChDQ19UZXh0dXJlMCwgdl90ZXhDb29yZCk7XFxuXCIgKyBcIiAgICBnbF9GcmFnQ29sb3I9dGV4Q29sb3Iqdl9jb2xvcip1X29wYWNpdHk7XFxuXCIgKyBcIn1cXG5cIjtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2Q5ODc3bVNFNTlPNHIvakJ4U3AwS3dvJywgJ2NjU2hhZGVyX2xpZ2h0bmluZ0JvbHRfVmVydCcpO1xuLy8gU2hhZGVycy9jY1NoYWRlcl9saWdodG5pbmdCb2x0X1ZlcnQuanNcblxubW9kdWxlLmV4cG9ydHMgPSBcImF0dHJpYnV0ZSB2ZWM0IGFfcG9zaXRpb247XFxuXCIgKyBcImF0dHJpYnV0ZSB2ZWMyIGFfdGV4Q29vcmQ7XFxuXCIgKyBcImF0dHJpYnV0ZSB2ZWM0IGFfY29sb3I7XFxuXCIgKyBcInZhcnlpbmcgdmVjMiB2X3RleENvb3JkO1xcblwiICsgXCJ2YXJ5aW5nIHZlYzQgdl9jb2xvcjtcXG5cIiArIFwiXFxuXCIgKyBcIlxcblwiICsgXCJ2b2lkIG1haW4oKVxcblwiICsgXCJ7XFxuXCIgKyBcIiAgICB2ZWM0IHBvcz12ZWM0KGFfcG9zaXRpb24ueHksMCwxKTtcXG5cIiArIFwiICAgIGdsX1Bvc2l0aW9uID0gQ0NfTVZQTWF0cml4ICogcG9zO1xcblwiICsgXCIgICAgdl90ZXhDb29yZCA9IGFfdGV4Q29vcmQ7XFxuXCIgKyBcIiAgICB2X2NvbG9yID0gYV9jb2xvcjtcXG5cIiArIFwiICAgIFxcblwiICsgXCJ9XFxuXCI7XG5cbmNjLl9SRnBvcCgpOyJdfQ==
