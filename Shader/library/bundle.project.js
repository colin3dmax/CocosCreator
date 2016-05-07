require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"Avg_Black_White":[function(require,module,exports){
"use strict";
cc._RFpush(module, '414458STphLF75+aFmYFzfh', 'Avg_Black_White');
// Script/Avg_Black_White.js

var _default_vert = require("../Shaders/ccShader_Default_Vert.js");
var _black_white_frag = require("../Shaders/ccShader_Avg_Black_White_Frag.js");

cc.Class({
    "extends": cc.Component,

    properties: {},

    onLoad: function onLoad() {
        this._use();
    },

    _use: function _use() {
        this._program = new cc.GLProgram();
        this._program.initWithVertexShaderByteArray(_default_vert, _black_white_frag);

        this._program.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);
        this._program.addAttribute(cc.ATTRIBUTE_NAME_COLOR, cc.VERTEX_ATTRIB_COLOR);
        this._program.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);
        this._program.link();
        this._program.updateUniforms();

        cc.setProgram(this.node._sgNode, this._program);
    }

});

cc._RFpop();
},{"../Shaders/ccShader_Avg_Black_White_Frag.js":"ccShader_Avg_Black_White_Frag","../Shaders/ccShader_Default_Vert.js":"ccShader_Default_Vert"}],"Blur_Edge_Detail":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'dd0cfUZNt1BMqcicmcIieWs', 'Blur_Edge_Detail');
// Script/Blur_Edge_Detail.js

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

cc._RFpop();
},{"../Shaders/ccShader_Blur_Edge_Detail_Frag.js":"ccShader_Blur_Edge_Detail_Frag","../Shaders/ccShader_Default_Vert.js":"ccShader_Default_Vert"}],"Emboss":[function(require,module,exports){
"use strict";
cc._RFpush(module, '96880Mj0cdDB4XR7BWESnn1', 'Emboss');
// Script/Emboss.js

var _default_vert = require("../Shaders/ccShader_Default_Vert.js");
var _emboss_frag = require("../Shaders/ccShader_Emboss_Frag.js");

cc.Class({
    "extends": cc.Component,

    properties: {},

    onLoad: function onLoad() {
        this._use();
    },

    _use: function _use() {
        this._program = new cc.GLProgram();
        this._program.initWithVertexShaderByteArray(_default_vert, _emboss_frag);

        this._program.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);
        this._program.addAttribute(cc.ATTRIBUTE_NAME_COLOR, cc.VERTEX_ATTRIB_COLOR);
        this._program.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);
        this._program.link();
        this._program.updateUniforms();

        this._uniWidthStep = this._program.getUniformLocationForName("widthStep");
        this._uniHeightStep = this._program.getUniformLocationForName("heightStep");

        this._program.setUniformLocationWith1f(this._uniWidthStep, 1.0 / this.node.getContentSize().width);
        this._program.setUniformLocationWith1f(this._uniHeightStep, 1.0 / this.node.getContentSize().height);

        cc.setProgram(this.node._sgNode, this._program);
    }

});

cc._RFpop();
},{"../Shaders/ccShader_Default_Vert.js":"ccShader_Default_Vert","../Shaders/ccShader_Emboss_Frag.js":"ccShader_Emboss_Frag"}],"Glass":[function(require,module,exports){
"use strict";
cc._RFpush(module, '4b2b93dv2tMPYO54MTCHTfp', 'Glass');
// Script/Glass.js

var _default_vert = require("../Shaders/ccShader_Default_Vert.js");
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
        cc.log(this.glassFactor);

        if (this._program) {
            if (cc.sys.isNative) {
                var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this._program);
                glProgram_state.setUniformFloat(this._uniBlurRadiusScale, this.glassFactor);
            } else {
                this._program.setUniformLocationWith1f(this._uniBlurRadiusScale, this.glassFactor);
            }
        }
    },

    _use: function _use() {

        if (cc.sys.isNative) {
            cc.log("use native GLProgram");
            this._program = new cc.GLProgram();
            this._program.initWithString(_default_vert, _glass_frag);
            this._program.link();
            this._program.updateUniforms();
        } else {
            this._program = new cc.GLProgram();
            this._program.initWithVertexShaderByteArray(_default_vert, _glass_frag);

            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);
            this._program.link();
            this._program.updateUniforms();
        }

        this._uniWidthStep = this._program.getUniformLocationForName("widthStep");
        this._uniHeightStep = this._program.getUniformLocationForName("heightStep");
        this._uniBlurRadiusScale = this._program.getUniformLocationForName("blurRadiusScale");

        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this._program);
            glProgram_state.setUniformFloat(this._uniWidthStep, 1.0 / this.node.getContentSize().width);
            glProgram_state.setUniformFloat(this._uniHeightStep, 1.0 / this.node.getContentSize().height);
            glProgram_state.setUniformFloat(this._uniBlurRadiusScale, this.glassFactor);
        } else {
            this._program.setUniformLocationWith1f(this._uniWidthStep, 1.0 / this.node.getContentSize().width);
            this._program.setUniformLocationWith1f(this._uniHeightStep, 1.0 / this.node.getContentSize().height);
            this._program.setUniformLocationWith1f(this._uniBlurRadiusScale, this.glassFactor);
        }

        // cc.shaderCache.addProgram(this._program,"Glass");
        // var sharderProgram = cc.shaderCache.programForKey("Glass");

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
},{"../Shaders/ccShader_Default_Vert.js":"ccShader_Default_Vert","../Shaders/ccShader_Glass_Frag.js":"ccShader_Glass_Frag"}],"Gray":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'beb6duloztFW7GMx6d9gIya', 'Gray');
// Script/Gray.js

var _default_vert = require("../Shaders/ccShader_Default_Vert.js");
var _gray_frag = require("../Shaders/ccShader_Gray_Frag.js");

cc.Class({
    "extends": cc.Component,

    properties: {},

    onLoad: function onLoad() {
        this._use();
    },

    _use: function _use() {
        this._program = new cc.GLProgram();
        this._program.initWithVertexShaderByteArray(_default_vert, _gray_frag);

        this._program.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);
        this._program.addAttribute(cc.ATTRIBUTE_NAME_COLOR, cc.VERTEX_ATTRIB_COLOR);
        this._program.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);
        this._program.link();
        this._program.updateUniforms();

        cc.setProgram(this.node._sgNode, this._program);
    }

});

cc._RFpop();
},{"../Shaders/ccShader_Default_Vert.js":"ccShader_Default_Vert","../Shaders/ccShader_Gray_Frag.js":"ccShader_Gray_Frag"}],"Negative_Black_White":[function(require,module,exports){
"use strict";
cc._RFpush(module, '5898b9+Nz1Mtb9hpqGfj1ML', 'Negative_Black_White');
// Script/Negative_Black_White.js

var _default_vert = require("../Shaders/ccShader_Default_Vert.js");
var _negative_black_white_frag = require("../Shaders/ccShader_Negative_Black_White_Frag.js");

cc.Class({
    "extends": cc.Component,

    properties: {},

    onLoad: function onLoad() {
        this._use();
    },

    _use: function _use() {
        this._program = new cc.GLProgram();
        this._program.initWithVertexShaderByteArray(_default_vert, _negative_black_white_frag);

        this._program.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);
        this._program.addAttribute(cc.ATTRIBUTE_NAME_COLOR, cc.VERTEX_ATTRIB_COLOR);
        this._program.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);
        this._program.link();
        this._program.updateUniforms();

        cc.setProgram(this.node._sgNode, this._program);
    }

});

cc._RFpop();
},{"../Shaders/ccShader_Default_Vert.js":"ccShader_Default_Vert","../Shaders/ccShader_Negative_Black_White_Frag.js":"ccShader_Negative_Black_White_Frag"}],"Negative_Image":[function(require,module,exports){
"use strict";
cc._RFpush(module, '1223bWIWhFParPR7jg0vHan', 'Negative_Image');
// Script/Negative_Image.js

var _default_vert = require("../Shaders/ccShader_Default_Vert.js");
var _negative_image_frag = require("../Shaders/ccShader_Negative_Image_Frag.js");

cc.Class({
    "extends": cc.Component,

    properties: {},

    onLoad: function onLoad() {
        this._use();
    },

    _use: function _use() {
        this._program = new cc.GLProgram();
        this._program.initWithVertexShaderByteArray(_default_vert, _negative_image_frag);

        this._program.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);
        this._program.addAttribute(cc.ATTRIBUTE_NAME_COLOR, cc.VERTEX_ATTRIB_COLOR);
        this._program.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);
        this._program.link();
        this._program.updateUniforms();

        cc.setProgram(this.node._sgNode, this._program);
    }

});

cc._RFpop();
},{"../Shaders/ccShader_Default_Vert.js":"ccShader_Default_Vert","../Shaders/ccShader_Negative_Image_Frag.js":"ccShader_Negative_Image_Frag"}],"Shadow_Black_White":[function(require,module,exports){
"use strict";
cc._RFpush(module, '7b15cFSchVHjaD3Jpz4tjaj', 'Shadow_Black_White');
// Script/Shadow_Black_White.js

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

cc._RFpop();
},{"../Shaders/ccShader_Default_Vert.js":"ccShader_Default_Vert","../Shaders/ccShader_Shadow_Black_White_Frag.js":"ccShader_Shadow_Black_White_Frag"}],"Wave_H":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'bdf19y2pc1PVoqxb0sbsYvb', 'Wave_H');
// Script/Wave_H.js

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

cc._RFpop();
},{"../Shaders/ccShader_Default_Vert.js":"ccShader_Default_Vert","../Shaders/ccShader_Wave_H_Frag.js":"ccShader_Wave_H_Frag"}],"Wave_VH":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'b991cBdgAFF47TvkDiskWLs', 'Wave_VH');
// Script/Wave_VH.js

var _default_vert = require("../Shaders/ccShader_Default_Vert.js");
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
        this._program.initWithVertexShaderByteArray(_default_vert, _wave_vh_frag);

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

cc._RFpop();
},{"../Shaders/ccShader_Default_Vert.js":"ccShader_Default_Vert","../Shaders/ccShader_Wave_VH_Frag.js":"ccShader_Wave_VH_Frag"}],"Wave_V":[function(require,module,exports){
"use strict";
cc._RFpush(module, '63a8cDVi8RNc78rJD126ks9', 'Wave_V');
// Script/Wave_V.js

var _default_vert = require("../Shaders/ccShader_Default_Vert.js");
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
        this._program.initWithVertexShaderByteArray(_default_vert, _wave_v_frag);

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

cc._RFpop();
},{"../Shaders/ccShader_Default_Vert.js":"ccShader_Default_Vert","../Shaders/ccShader_Wave_V_Frag.js":"ccShader_Wave_V_Frag"}],"ccShader_Avg_Black_White_Frag":[function(require,module,exports){
"use strict";
cc._RFpush(module, '1a2e0lgfLVJ2Z1JCdcFAr8X', 'ccShader_Avg_Black_White_Frag');
// Shaders/ccShader_Avg_Black_White_Frag.js

/* 平均值黑白 */

module.exports = "precision mediump float;\n" + "varying vec2 v_texCoord;\n" + "void main()\n" + "{\n" + "    vec3 v = texture2D(CC_Texture0, v_texCoord).rgb;\n" + "    float f = (v.r + v.g + v.b) / 3.0;\n" + "    gl_FragColor = vec4(f, f, f, 1.0);\n" + "}\n";

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
},{}],"ccShader_Default_Vert":[function(require,module,exports){
"use strict";
cc._RFpush(module, '440f5W7uvVNAaZx4ALzoZN8', 'ccShader_Default_Vert');
// Shaders/ccShader_Default_Vert.js

module.exports = "attribute vec4 a_position;\n" + " attribute vec2 a_texCoord;\n" + " attribute vec4 a_color;\n" + " varying vec2 v_texCoord;\n" + " varying vec4 v_fragmentColor;\n" + " void main()\n" + " {\n" + "     gl_Position = ( CC_PMatrix * CC_MVMatrix ) * a_position;\n" + "     v_fragmentColor = a_color;\n" + "     v_texCoord = a_texCoord;\n" + " } \n";

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
},{}]},{},["ccShader_Wave_V_Frag","Negative_Image","ccShader_Avg_Black_White_Frag","ccShader_Negative_Image_Frag","Avg_Black_White","ccShader_Default_Vert","Glass","Negative_Black_White","Wave_V","ccShader_Wave_VH_Frag","ccShader_Gray_Frag","Shadow_Black_White","ccShader_Blur_Edge_Detail_Frag","Emboss","ccShader_Emboss_Frag","Wave_VH","Wave_H","Gray","ccShader_Shadow_Black_White_Frag","ccShader_Negative_Black_White_Frag","ccShader_Glass_Frag","Blur_Edge_Detail","ccShader_Wave_H_Frag"])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL0FwcGxpY2F0aW9ucy9Db2Nvc0NyZWF0b3IuYXBwL0NvbnRlbnRzL1Jlc291cmNlcy9hcHAuYXNhci9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiYXNzZXRzL1NjcmlwdC9BdmdfQmxhY2tfV2hpdGUuanMiLCJhc3NldHMvU2NyaXB0L0JsdXJfRWRnZV9EZXRhaWwuanMiLCJhc3NldHMvU2NyaXB0L0VtYm9zcy5qcyIsImFzc2V0cy9TY3JpcHQvR2xhc3MuanMiLCJhc3NldHMvU2NyaXB0L0dyYXkuanMiLCJhc3NldHMvU2NyaXB0L05lZ2F0aXZlX0JsYWNrX1doaXRlLmpzIiwiYXNzZXRzL1NjcmlwdC9OZWdhdGl2ZV9JbWFnZS5qcyIsImFzc2V0cy9TY3JpcHQvU2hhZG93X0JsYWNrX1doaXRlLmpzIiwiYXNzZXRzL1NjcmlwdC9XYXZlX0guanMiLCJhc3NldHMvU2NyaXB0L1dhdmVfVkguanMiLCJhc3NldHMvU2NyaXB0L1dhdmVfVi5qcyIsImFzc2V0cy9TaGFkZXJzL2NjU2hhZGVyX0F2Z19CbGFja19XaGl0ZV9GcmFnLmpzIiwiYXNzZXRzL1NoYWRlcnMvY2NTaGFkZXJfQmx1cl9FZGdlX0RldGFpbF9GcmFnLmpzIiwiYXNzZXRzL1NoYWRlcnMvY2NTaGFkZXJfRGVmYXVsdF9WZXJ0LmpzIiwiYXNzZXRzL1NoYWRlcnMvY2NTaGFkZXJfRW1ib3NzX0ZyYWcuanMiLCJhc3NldHMvU2hhZGVycy9jY1NoYWRlcl9HbGFzc19GcmFnLmpzIiwiYXNzZXRzL1NoYWRlcnMvY2NTaGFkZXJfR3JheV9GcmFnLmpzIiwiYXNzZXRzL1NoYWRlcnMvY2NTaGFkZXJfTmVnYXRpdmVfQmxhY2tfV2hpdGVfRnJhZy5qcyIsImFzc2V0cy9TaGFkZXJzL2NjU2hhZGVyX05lZ2F0aXZlX0ltYWdlX0ZyYWcuanMiLCJhc3NldHMvU2hhZGVycy9jY1NoYWRlcl9TaGFkb3dfQmxhY2tfV2hpdGVfRnJhZy5qcyIsImFzc2V0cy9TaGFkZXJzL2NjU2hhZGVyX1dhdmVfSF9GcmFnLmpzIiwiYXNzZXRzL1NoYWRlcnMvY2NTaGFkZXJfV2F2ZV9WSF9GcmFnLmpzIiwiYXNzZXRzL1NoYWRlcnMvY2NTaGFkZXJfV2F2ZV9WX0ZyYWcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc0MTQ0NThTVHBoTEY3NSthRm1ZRnpmaCcsICdBdmdfQmxhY2tfV2hpdGUnKTtcbi8vIFNjcmlwdC9BdmdfQmxhY2tfV2hpdGUuanNcblxudmFyIF9kZWZhdWx0X3ZlcnQgPSByZXF1aXJlKFwiLi4vU2hhZGVycy9jY1NoYWRlcl9EZWZhdWx0X1ZlcnQuanNcIik7XG52YXIgX2JsYWNrX3doaXRlX2ZyYWcgPSByZXF1aXJlKFwiLi4vU2hhZGVycy9jY1NoYWRlcl9BdmdfQmxhY2tfV2hpdGVfRnJhZy5qc1wiKTtcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7fSxcblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLl91c2UoKTtcbiAgICB9LFxuXG4gICAgX3VzZTogZnVuY3Rpb24gX3VzZSgpIHtcbiAgICAgICAgdGhpcy5fcHJvZ3JhbSA9IG5ldyBjYy5HTFByb2dyYW0oKTtcbiAgICAgICAgdGhpcy5fcHJvZ3JhbS5pbml0V2l0aFZlcnRleFNoYWRlckJ5dGVBcnJheShfZGVmYXVsdF92ZXJ0LCBfYmxhY2tfd2hpdGVfZnJhZyk7XG5cbiAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MuQVRUUklCVVRFX05BTUVfUE9TSVRJT04sIGNjLlZFUlRFWF9BVFRSSUJfUE9TSVRJT04pO1xuICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5BVFRSSUJVVEVfTkFNRV9DT0xPUiwgY2MuVkVSVEVYX0FUVFJJQl9DT0xPUik7XG4gICAgICAgIHRoaXMuX3Byb2dyYW0uYWRkQXR0cmlidXRlKGNjLkFUVFJJQlVURV9OQU1FX1RFWF9DT09SRCwgY2MuVkVSVEVYX0FUVFJJQl9URVhfQ09PUkRTKTtcbiAgICAgICAgdGhpcy5fcHJvZ3JhbS5saW5rKCk7XG4gICAgICAgIHRoaXMuX3Byb2dyYW0udXBkYXRlVW5pZm9ybXMoKTtcblxuICAgICAgICBjYy5zZXRQcm9ncmFtKHRoaXMubm9kZS5fc2dOb2RlLCB0aGlzLl9wcm9ncmFtKTtcbiAgICB9XG5cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnZGQwY2ZVWk50MUJNcWNpY21jSWllV3MnLCAnQmx1cl9FZGdlX0RldGFpbCcpO1xuLy8gU2NyaXB0L0JsdXJfRWRnZV9EZXRhaWwuanNcblxudmFyIF9kZWZhdWx0X3ZlcnQgPSByZXF1aXJlKFwiLi4vU2hhZGVycy9jY1NoYWRlcl9EZWZhdWx0X1ZlcnQuanNcIik7XG52YXIgX2JsdXJfZWRnZV9kZXRhaWxfZnJhZyA9IHJlcXVpcmUoXCIuLi9TaGFkZXJzL2NjU2hhZGVyX0JsdXJfRWRnZV9EZXRhaWxfRnJhZy5qc1wiKTtcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7fSxcblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLl91c2UoKTtcbiAgICB9LFxuXG4gICAgX3VzZTogZnVuY3Rpb24gX3VzZSgpIHtcbiAgICAgICAgdGhpcy5fcHJvZ3JhbSA9IG5ldyBjYy5HTFByb2dyYW0oKTtcbiAgICAgICAgdGhpcy5fcHJvZ3JhbS5pbml0V2l0aFZlcnRleFNoYWRlckJ5dGVBcnJheShfZGVmYXVsdF92ZXJ0LCBfYmx1cl9lZGdlX2RldGFpbF9mcmFnKTtcblxuICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5BVFRSSUJVVEVfTkFNRV9QT1NJVElPTiwgY2MuVkVSVEVYX0FUVFJJQl9QT1NJVElPTik7XG4gICAgICAgIHRoaXMuX3Byb2dyYW0uYWRkQXR0cmlidXRlKGNjLkFUVFJJQlVURV9OQU1FX0NPTE9SLCBjYy5WRVJURVhfQVRUUklCX0NPTE9SKTtcbiAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MuQVRUUklCVVRFX05BTUVfVEVYX0NPT1JELCBjYy5WRVJURVhfQVRUUklCX1RFWF9DT09SRFMpO1xuICAgICAgICB0aGlzLl9wcm9ncmFtLmxpbmsoKTtcbiAgICAgICAgdGhpcy5fcHJvZ3JhbS51cGRhdGVVbmlmb3JtcygpO1xuXG4gICAgICAgIHRoaXMuX3VuaVdpZHRoU3RlcCA9IHRoaXMuX3Byb2dyYW0uZ2V0VW5pZm9ybUxvY2F0aW9uRm9yTmFtZShcIndpZHRoU3RlcFwiKTtcbiAgICAgICAgdGhpcy5fdW5pSGVpZ2h0U3RlcCA9IHRoaXMuX3Byb2dyYW0uZ2V0VW5pZm9ybUxvY2F0aW9uRm9yTmFtZShcImhlaWdodFN0ZXBcIik7XG4gICAgICAgIHRoaXMuX3VuaVN0cmVuZ3RoID0gdGhpcy5fcHJvZ3JhbS5nZXRVbmlmb3JtTG9jYXRpb25Gb3JOYW1lKFwic3RyZW5ndGhcIik7XG5cbiAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMWYodGhpcy5fdW5pV2lkdGhTdGVwLCAxLjAgLyB0aGlzLm5vZGUuZ2V0Q29udGVudFNpemUoKS53aWR0aCk7XG4gICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDFmKHRoaXMuX3VuaUhlaWdodFN0ZXAsIDEuMCAvIHRoaXMubm9kZS5nZXRDb250ZW50U2l6ZSgpLmhlaWdodCk7XG5cbiAgICAgICAgLyog5qih57OKIDAuNSAgICAgKi9cbiAgICAgICAgLyog5qih57OKIDEuMCAgICAgKi9cbiAgICAgICAgLyog57uG6IqCIC0yLjAgICAgKi9cbiAgICAgICAgLyog57uG6IqCIC01LjAgICAgKi9cbiAgICAgICAgLyog57uG6IqCIC0xMC4wICAgKi9cbiAgICAgICAgLyog6L6557yYIDIuMCAgICAgKi9cbiAgICAgICAgLyog6L6557yYIDUuMCAgICAgKi9cbiAgICAgICAgLyog6L6557yYIDEwLjAgICAgKi9cbiAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMWYodGhpcy5fdW5pU3RyZW5ndGgsIDIuMCk7XG5cbiAgICAgICAgY2Muc2V0UHJvZ3JhbSh0aGlzLm5vZGUuX3NnTm9kZSwgdGhpcy5fcHJvZ3JhbSk7XG4gICAgfVxuXG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzk2ODgwTWowY2REQjRYUjdCV0VTbm4xJywgJ0VtYm9zcycpO1xuLy8gU2NyaXB0L0VtYm9zcy5qc1xuXG52YXIgX2RlZmF1bHRfdmVydCA9IHJlcXVpcmUoXCIuLi9TaGFkZXJzL2NjU2hhZGVyX0RlZmF1bHRfVmVydC5qc1wiKTtcbnZhciBfZW1ib3NzX2ZyYWcgPSByZXF1aXJlKFwiLi4vU2hhZGVycy9jY1NoYWRlcl9FbWJvc3NfRnJhZy5qc1wiKTtcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7fSxcblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLl91c2UoKTtcbiAgICB9LFxuXG4gICAgX3VzZTogZnVuY3Rpb24gX3VzZSgpIHtcbiAgICAgICAgdGhpcy5fcHJvZ3JhbSA9IG5ldyBjYy5HTFByb2dyYW0oKTtcbiAgICAgICAgdGhpcy5fcHJvZ3JhbS5pbml0V2l0aFZlcnRleFNoYWRlckJ5dGVBcnJheShfZGVmYXVsdF92ZXJ0LCBfZW1ib3NzX2ZyYWcpO1xuXG4gICAgICAgIHRoaXMuX3Byb2dyYW0uYWRkQXR0cmlidXRlKGNjLkFUVFJJQlVURV9OQU1FX1BPU0lUSU9OLCBjYy5WRVJURVhfQVRUUklCX1BPU0lUSU9OKTtcbiAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MuQVRUUklCVVRFX05BTUVfQ09MT1IsIGNjLlZFUlRFWF9BVFRSSUJfQ09MT1IpO1xuICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5BVFRSSUJVVEVfTkFNRV9URVhfQ09PUkQsIGNjLlZFUlRFWF9BVFRSSUJfVEVYX0NPT1JEUyk7XG4gICAgICAgIHRoaXMuX3Byb2dyYW0ubGluaygpO1xuICAgICAgICB0aGlzLl9wcm9ncmFtLnVwZGF0ZVVuaWZvcm1zKCk7XG5cbiAgICAgICAgdGhpcy5fdW5pV2lkdGhTdGVwID0gdGhpcy5fcHJvZ3JhbS5nZXRVbmlmb3JtTG9jYXRpb25Gb3JOYW1lKFwid2lkdGhTdGVwXCIpO1xuICAgICAgICB0aGlzLl91bmlIZWlnaHRTdGVwID0gdGhpcy5fcHJvZ3JhbS5nZXRVbmlmb3JtTG9jYXRpb25Gb3JOYW1lKFwiaGVpZ2h0U3RlcFwiKTtcblxuICAgICAgICB0aGlzLl9wcm9ncmFtLnNldFVuaWZvcm1Mb2NhdGlvbldpdGgxZih0aGlzLl91bmlXaWR0aFN0ZXAsIDEuMCAvIHRoaXMubm9kZS5nZXRDb250ZW50U2l6ZSgpLndpZHRoKTtcbiAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMWYodGhpcy5fdW5pSGVpZ2h0U3RlcCwgMS4wIC8gdGhpcy5ub2RlLmdldENvbnRlbnRTaXplKCkuaGVpZ2h0KTtcblxuICAgICAgICBjYy5zZXRQcm9ncmFtKHRoaXMubm9kZS5fc2dOb2RlLCB0aGlzLl9wcm9ncmFtKTtcbiAgICB9XG5cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnNGIyYjkzZHYydE1QWU81NE1UQ0hUZnAnLCAnR2xhc3MnKTtcbi8vIFNjcmlwdC9HbGFzcy5qc1xuXG52YXIgX2RlZmF1bHRfdmVydCA9IHJlcXVpcmUoXCIuLi9TaGFkZXJzL2NjU2hhZGVyX0RlZmF1bHRfVmVydC5qc1wiKTtcbnZhciBfZ2xhc3NfZnJhZyA9IHJlcXVpcmUoXCIuLi9TaGFkZXJzL2NjU2hhZGVyX0dsYXNzX0ZyYWcuanNcIik7XG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBnbGFzc0ZhY3RvcjogMS4wXG4gICAgfSxcblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLl91c2UoKTtcbiAgICB9LFxuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKGR0KSB7XG4gICAgICAgIGlmICh0aGlzLmdsYXNzRmFjdG9yID49IDQwKSB7XG4gICAgICAgICAgICB0aGlzLmdsYXNzRmFjdG9yID0gMDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmdsYXNzRmFjdG9yICs9IGR0ICogMztcbiAgICAgICAgY2MubG9nKHRoaXMuZ2xhc3NGYWN0b3IpO1xuXG4gICAgICAgIGlmICh0aGlzLl9wcm9ncmFtKSB7XG4gICAgICAgICAgICBpZiAoY2Muc3lzLmlzTmF0aXZlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGdsUHJvZ3JhbV9zdGF0ZSA9IGNjLkdMUHJvZ3JhbVN0YXRlLmdldE9yQ3JlYXRlV2l0aEdMUHJvZ3JhbSh0aGlzLl9wcm9ncmFtKTtcbiAgICAgICAgICAgICAgICBnbFByb2dyYW1fc3RhdGUuc2V0VW5pZm9ybUZsb2F0KHRoaXMuX3VuaUJsdXJSYWRpdXNTY2FsZSwgdGhpcy5nbGFzc0ZhY3Rvcik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDFmKHRoaXMuX3VuaUJsdXJSYWRpdXNTY2FsZSwgdGhpcy5nbGFzc0ZhY3Rvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX3VzZTogZnVuY3Rpb24gX3VzZSgpIHtcblxuICAgICAgICBpZiAoY2Muc3lzLmlzTmF0aXZlKSB7XG4gICAgICAgICAgICBjYy5sb2coXCJ1c2UgbmF0aXZlIEdMUHJvZ3JhbVwiKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0gPSBuZXcgY2MuR0xQcm9ncmFtKCk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmluaXRXaXRoU3RyaW5nKF9kZWZhdWx0X3ZlcnQsIF9nbGFzc19mcmFnKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0ubGluaygpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS51cGRhdGVVbmlmb3JtcygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbSA9IG5ldyBjYy5HTFByb2dyYW0oKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uaW5pdFdpdGhWZXJ0ZXhTaGFkZXJCeXRlQXJyYXkoX2RlZmF1bHRfdmVydCwgX2dsYXNzX2ZyYWcpO1xuXG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5tYWNyby5BVFRSSUJVVEVfTkFNRV9QT1NJVElPTiwgY2MubWFjcm8uVkVSVEVYX0FUVFJJQl9QT1NJVElPTik7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5tYWNyby5BVFRSSUJVVEVfTkFNRV9DT0xPUiwgY2MubWFjcm8uVkVSVEVYX0FUVFJJQl9DT0xPUik7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5tYWNyby5BVFRSSUJVVEVfTkFNRV9URVhfQ09PUkQsIGNjLm1hY3JvLlZFUlRFWF9BVFRSSUJfVEVYX0NPT1JEUyk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLmxpbmsoKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0udXBkYXRlVW5pZm9ybXMoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX3VuaVdpZHRoU3RlcCA9IHRoaXMuX3Byb2dyYW0uZ2V0VW5pZm9ybUxvY2F0aW9uRm9yTmFtZShcIndpZHRoU3RlcFwiKTtcbiAgICAgICAgdGhpcy5fdW5pSGVpZ2h0U3RlcCA9IHRoaXMuX3Byb2dyYW0uZ2V0VW5pZm9ybUxvY2F0aW9uRm9yTmFtZShcImhlaWdodFN0ZXBcIik7XG4gICAgICAgIHRoaXMuX3VuaUJsdXJSYWRpdXNTY2FsZSA9IHRoaXMuX3Byb2dyYW0uZ2V0VW5pZm9ybUxvY2F0aW9uRm9yTmFtZShcImJsdXJSYWRpdXNTY2FsZVwiKTtcblxuICAgICAgICBpZiAoY2Muc3lzLmlzTmF0aXZlKSB7XG4gICAgICAgICAgICB2YXIgZ2xQcm9ncmFtX3N0YXRlID0gY2MuR0xQcm9ncmFtU3RhdGUuZ2V0T3JDcmVhdGVXaXRoR0xQcm9ncmFtKHRoaXMuX3Byb2dyYW0pO1xuICAgICAgICAgICAgZ2xQcm9ncmFtX3N0YXRlLnNldFVuaWZvcm1GbG9hdCh0aGlzLl91bmlXaWR0aFN0ZXAsIDEuMCAvIHRoaXMubm9kZS5nZXRDb250ZW50U2l6ZSgpLndpZHRoKTtcbiAgICAgICAgICAgIGdsUHJvZ3JhbV9zdGF0ZS5zZXRVbmlmb3JtRmxvYXQodGhpcy5fdW5pSGVpZ2h0U3RlcCwgMS4wIC8gdGhpcy5ub2RlLmdldENvbnRlbnRTaXplKCkuaGVpZ2h0KTtcbiAgICAgICAgICAgIGdsUHJvZ3JhbV9zdGF0ZS5zZXRVbmlmb3JtRmxvYXQodGhpcy5fdW5pQmx1clJhZGl1c1NjYWxlLCB0aGlzLmdsYXNzRmFjdG9yKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDFmKHRoaXMuX3VuaVdpZHRoU3RlcCwgMS4wIC8gdGhpcy5ub2RlLmdldENvbnRlbnRTaXplKCkud2lkdGgpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMWYodGhpcy5fdW5pSGVpZ2h0U3RlcCwgMS4wIC8gdGhpcy5ub2RlLmdldENvbnRlbnRTaXplKCkuaGVpZ2h0KTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDFmKHRoaXMuX3VuaUJsdXJSYWRpdXNTY2FsZSwgdGhpcy5nbGFzc0ZhY3Rvcik7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBjYy5zaGFkZXJDYWNoZS5hZGRQcm9ncmFtKHRoaXMuX3Byb2dyYW0sXCJHbGFzc1wiKTtcbiAgICAgICAgLy8gdmFyIHNoYXJkZXJQcm9ncmFtID0gY2Muc2hhZGVyQ2FjaGUucHJvZ3JhbUZvcktleShcIkdsYXNzXCIpO1xuXG4gICAgICAgIHRoaXMuc2V0UHJvZ3JhbSh0aGlzLm5vZGUuX3NnTm9kZSwgdGhpcy5fcHJvZ3JhbSk7XG4gICAgfSxcblxuICAgIHNldFByb2dyYW06IGZ1bmN0aW9uIHNldFByb2dyYW0obm9kZSwgcHJvZ3JhbSkge1xuICAgICAgICBpZiAoY2Muc3lzLmlzTmF0aXZlKSB7XG4gICAgICAgICAgICB2YXIgZ2xQcm9ncmFtX3N0YXRlID0gY2MuR0xQcm9ncmFtU3RhdGUuZ2V0T3JDcmVhdGVXaXRoR0xQcm9ncmFtKHByb2dyYW0pO1xuICAgICAgICAgICAgbm9kZS5zZXRHTFByb2dyYW1TdGF0ZShnbFByb2dyYW1fc3RhdGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbm9kZS5zZXRTaGFkZXJQcm9ncmFtKHByb2dyYW0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGNoaWxkcmVuID0gbm9kZS5jaGlsZHJlbjtcbiAgICAgICAgaWYgKCFjaGlsZHJlbikgcmV0dXJuO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHRoaXMuc2V0UHJvZ3JhbShjaGlsZHJlbltpXSwgcHJvZ3JhbSk7XG4gICAgfVxuXG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2JlYjZkdWxvenRGVzdHTXg2ZDlnSXlhJywgJ0dyYXknKTtcbi8vIFNjcmlwdC9HcmF5LmpzXG5cbnZhciBfZGVmYXVsdF92ZXJ0ID0gcmVxdWlyZShcIi4uL1NoYWRlcnMvY2NTaGFkZXJfRGVmYXVsdF9WZXJ0LmpzXCIpO1xudmFyIF9ncmF5X2ZyYWcgPSByZXF1aXJlKFwiLi4vU2hhZGVycy9jY1NoYWRlcl9HcmF5X0ZyYWcuanNcIik7XG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge30sXG5cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5fdXNlKCk7XG4gICAgfSxcblxuICAgIF91c2U6IGZ1bmN0aW9uIF91c2UoKSB7XG4gICAgICAgIHRoaXMuX3Byb2dyYW0gPSBuZXcgY2MuR0xQcm9ncmFtKCk7XG4gICAgICAgIHRoaXMuX3Byb2dyYW0uaW5pdFdpdGhWZXJ0ZXhTaGFkZXJCeXRlQXJyYXkoX2RlZmF1bHRfdmVydCwgX2dyYXlfZnJhZyk7XG5cbiAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MuQVRUUklCVVRFX05BTUVfUE9TSVRJT04sIGNjLlZFUlRFWF9BVFRSSUJfUE9TSVRJT04pO1xuICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5BVFRSSUJVVEVfTkFNRV9DT0xPUiwgY2MuVkVSVEVYX0FUVFJJQl9DT0xPUik7XG4gICAgICAgIHRoaXMuX3Byb2dyYW0uYWRkQXR0cmlidXRlKGNjLkFUVFJJQlVURV9OQU1FX1RFWF9DT09SRCwgY2MuVkVSVEVYX0FUVFJJQl9URVhfQ09PUkRTKTtcbiAgICAgICAgdGhpcy5fcHJvZ3JhbS5saW5rKCk7XG4gICAgICAgIHRoaXMuX3Byb2dyYW0udXBkYXRlVW5pZm9ybXMoKTtcblxuICAgICAgICBjYy5zZXRQcm9ncmFtKHRoaXMubm9kZS5fc2dOb2RlLCB0aGlzLl9wcm9ncmFtKTtcbiAgICB9XG5cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnNTg5OGI5K056MU10YjlocHFHZmoxTUwnLCAnTmVnYXRpdmVfQmxhY2tfV2hpdGUnKTtcbi8vIFNjcmlwdC9OZWdhdGl2ZV9CbGFja19XaGl0ZS5qc1xuXG52YXIgX2RlZmF1bHRfdmVydCA9IHJlcXVpcmUoXCIuLi9TaGFkZXJzL2NjU2hhZGVyX0RlZmF1bHRfVmVydC5qc1wiKTtcbnZhciBfbmVnYXRpdmVfYmxhY2tfd2hpdGVfZnJhZyA9IHJlcXVpcmUoXCIuLi9TaGFkZXJzL2NjU2hhZGVyX05lZ2F0aXZlX0JsYWNrX1doaXRlX0ZyYWcuanNcIik7XG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge30sXG5cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5fdXNlKCk7XG4gICAgfSxcblxuICAgIF91c2U6IGZ1bmN0aW9uIF91c2UoKSB7XG4gICAgICAgIHRoaXMuX3Byb2dyYW0gPSBuZXcgY2MuR0xQcm9ncmFtKCk7XG4gICAgICAgIHRoaXMuX3Byb2dyYW0uaW5pdFdpdGhWZXJ0ZXhTaGFkZXJCeXRlQXJyYXkoX2RlZmF1bHRfdmVydCwgX25lZ2F0aXZlX2JsYWNrX3doaXRlX2ZyYWcpO1xuXG4gICAgICAgIHRoaXMuX3Byb2dyYW0uYWRkQXR0cmlidXRlKGNjLkFUVFJJQlVURV9OQU1FX1BPU0lUSU9OLCBjYy5WRVJURVhfQVRUUklCX1BPU0lUSU9OKTtcbiAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MuQVRUUklCVVRFX05BTUVfQ09MT1IsIGNjLlZFUlRFWF9BVFRSSUJfQ09MT1IpO1xuICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5BVFRSSUJVVEVfTkFNRV9URVhfQ09PUkQsIGNjLlZFUlRFWF9BVFRSSUJfVEVYX0NPT1JEUyk7XG4gICAgICAgIHRoaXMuX3Byb2dyYW0ubGluaygpO1xuICAgICAgICB0aGlzLl9wcm9ncmFtLnVwZGF0ZVVuaWZvcm1zKCk7XG5cbiAgICAgICAgY2Muc2V0UHJvZ3JhbSh0aGlzLm5vZGUuX3NnTm9kZSwgdGhpcy5fcHJvZ3JhbSk7XG4gICAgfVxuXG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzEyMjNiV0lXaEZQYXJQUjdqZzB2SGFuJywgJ05lZ2F0aXZlX0ltYWdlJyk7XG4vLyBTY3JpcHQvTmVnYXRpdmVfSW1hZ2UuanNcblxudmFyIF9kZWZhdWx0X3ZlcnQgPSByZXF1aXJlKFwiLi4vU2hhZGVycy9jY1NoYWRlcl9EZWZhdWx0X1ZlcnQuanNcIik7XG52YXIgX25lZ2F0aXZlX2ltYWdlX2ZyYWcgPSByZXF1aXJlKFwiLi4vU2hhZGVycy9jY1NoYWRlcl9OZWdhdGl2ZV9JbWFnZV9GcmFnLmpzXCIpO1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHt9LFxuXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHRoaXMuX3VzZSgpO1xuICAgIH0sXG5cbiAgICBfdXNlOiBmdW5jdGlvbiBfdXNlKCkge1xuICAgICAgICB0aGlzLl9wcm9ncmFtID0gbmV3IGNjLkdMUHJvZ3JhbSgpO1xuICAgICAgICB0aGlzLl9wcm9ncmFtLmluaXRXaXRoVmVydGV4U2hhZGVyQnl0ZUFycmF5KF9kZWZhdWx0X3ZlcnQsIF9uZWdhdGl2ZV9pbWFnZV9mcmFnKTtcblxuICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5BVFRSSUJVVEVfTkFNRV9QT1NJVElPTiwgY2MuVkVSVEVYX0FUVFJJQl9QT1NJVElPTik7XG4gICAgICAgIHRoaXMuX3Byb2dyYW0uYWRkQXR0cmlidXRlKGNjLkFUVFJJQlVURV9OQU1FX0NPTE9SLCBjYy5WRVJURVhfQVRUUklCX0NPTE9SKTtcbiAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MuQVRUUklCVVRFX05BTUVfVEVYX0NPT1JELCBjYy5WRVJURVhfQVRUUklCX1RFWF9DT09SRFMpO1xuICAgICAgICB0aGlzLl9wcm9ncmFtLmxpbmsoKTtcbiAgICAgICAgdGhpcy5fcHJvZ3JhbS51cGRhdGVVbmlmb3JtcygpO1xuXG4gICAgICAgIGNjLnNldFByb2dyYW0odGhpcy5ub2RlLl9zZ05vZGUsIHRoaXMuX3Byb2dyYW0pO1xuICAgIH1cblxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc3YjE1Y0ZTY2hWSGphRDNKcHo0dGphaicsICdTaGFkb3dfQmxhY2tfV2hpdGUnKTtcbi8vIFNjcmlwdC9TaGFkb3dfQmxhY2tfV2hpdGUuanNcblxudmFyIF9kZWZhdWx0X3ZlcnQgPSByZXF1aXJlKFwiLi4vU2hhZGVycy9jY1NoYWRlcl9EZWZhdWx0X1ZlcnQuanNcIik7XG52YXIgX3NoYWRvd19ibGFja193aGl0ZV9mcmFnID0gcmVxdWlyZShcIi4uL1NoYWRlcnMvY2NTaGFkZXJfU2hhZG93X0JsYWNrX1doaXRlX0ZyYWcuanNcIik7XG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge30sXG5cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5fc3RyZW5ndGggPSAwLjAwMTtcbiAgICAgICAgdGhpcy5fbW90aW9uID0gMDtcblxuICAgICAgICB0aGlzLl91c2UoKTtcbiAgICB9LFxuXG4gICAgX3VzZTogZnVuY3Rpb24gX3VzZSgpIHtcbiAgICAgICAgdGhpcy5fcHJvZ3JhbSA9IG5ldyBjYy5HTFByb2dyYW0oKTtcbiAgICAgICAgdGhpcy5fcHJvZ3JhbS5pbml0V2l0aFZlcnRleFNoYWRlckJ5dGVBcnJheShfZGVmYXVsdF92ZXJ0LCBfc2hhZG93X2JsYWNrX3doaXRlX2ZyYWcpO1xuXG4gICAgICAgIHRoaXMuX3Byb2dyYW0uYWRkQXR0cmlidXRlKGNjLkFUVFJJQlVURV9OQU1FX1BPU0lUSU9OLCBjYy5WRVJURVhfQVRUUklCX1BPU0lUSU9OKTtcbiAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MuQVRUUklCVVRFX05BTUVfQ09MT1IsIGNjLlZFUlRFWF9BVFRSSUJfQ09MT1IpO1xuICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5BVFRSSUJVVEVfTkFNRV9URVhfQ09PUkQsIGNjLlZFUlRFWF9BVFRSSUJfVEVYX0NPT1JEUyk7XG4gICAgICAgIHRoaXMuX3Byb2dyYW0ubGluaygpO1xuICAgICAgICB0aGlzLl9wcm9ncmFtLnVwZGF0ZVVuaWZvcm1zKCk7XG5cbiAgICAgICAgdGhpcy5fdW5pU3RyZW5ndGggPSB0aGlzLl9wcm9ncmFtLmdldFVuaWZvcm1Mb2NhdGlvbkZvck5hbWUoXCJzdHJlbmd0aFwiKTtcblxuICAgICAgICBjYy5zZXRQcm9ncmFtKHRoaXMubm9kZS5fc2dOb2RlLCB0aGlzLl9wcm9ncmFtKTtcbiAgICB9LFxuXG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoZHQpIHtcbiAgICAgICAgaWYgKHRoaXMuX3Byb2dyYW0pIHtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDFmKHRoaXMuX3VuaVN0cmVuZ3RoLCB0aGlzLl9tb3Rpb24gKz0gdGhpcy5fc3RyZW5ndGgpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS51cGRhdGVVbmlmb3JtcygpO1xuICAgICAgICAgICAgaWYgKDEuMCA8IHRoaXMuX21vdGlvbiB8fCAwLjAgPiB0aGlzLl9tb3Rpb24pIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zdHJlbmd0aCAqPSAtMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnYmRmMTl5MnBjMVBWb3F4YjBzYnNZdmInLCAnV2F2ZV9IJyk7XG4vLyBTY3JpcHQvV2F2ZV9ILmpzXG5cbnZhciBfZGVmYXVsdF92ZXJ0ID0gcmVxdWlyZShcIi4uL1NoYWRlcnMvY2NTaGFkZXJfRGVmYXVsdF9WZXJ0LmpzXCIpO1xudmFyIF93YXZlX2hfZnJhZyA9IHJlcXVpcmUoXCIuLi9TaGFkZXJzL2NjU2hhZGVyX1dhdmVfSF9GcmFnLmpzXCIpO1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHt9LFxuXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHRoaXMuX2FuZ2xlID0gMTU7XG4gICAgICAgIHRoaXMuX21vdGlvbiA9IDA7XG5cbiAgICAgICAgdGhpcy5fdXNlKCk7XG4gICAgfSxcblxuICAgIF91c2U6IGZ1bmN0aW9uIF91c2UoKSB7XG4gICAgICAgIHRoaXMuX3Byb2dyYW0gPSBuZXcgY2MuR0xQcm9ncmFtKCk7XG4gICAgICAgIHRoaXMuX3Byb2dyYW0uaW5pdFdpdGhWZXJ0ZXhTaGFkZXJCeXRlQXJyYXkoX2RlZmF1bHRfdmVydCwgX3dhdmVfaF9mcmFnKTtcblxuICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5BVFRSSUJVVEVfTkFNRV9QT1NJVElPTiwgY2MuVkVSVEVYX0FUVFJJQl9QT1NJVElPTik7XG4gICAgICAgIHRoaXMuX3Byb2dyYW0uYWRkQXR0cmlidXRlKGNjLkFUVFJJQlVURV9OQU1FX0NPTE9SLCBjYy5WRVJURVhfQVRUUklCX0NPTE9SKTtcbiAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MuQVRUUklCVVRFX05BTUVfVEVYX0NPT1JELCBjYy5WRVJURVhfQVRUUklCX1RFWF9DT09SRFMpO1xuICAgICAgICB0aGlzLl9wcm9ncmFtLmxpbmsoKTtcbiAgICAgICAgdGhpcy5fcHJvZ3JhbS51cGRhdGVVbmlmb3JtcygpO1xuXG4gICAgICAgIHRoaXMuX3VuaU1vdGlvbiA9IHRoaXMuX3Byb2dyYW0uZ2V0VW5pZm9ybUxvY2F0aW9uRm9yTmFtZShcIm1vdGlvblwiKTtcbiAgICAgICAgdGhpcy5fdW5pQW5nbGUgPSB0aGlzLl9wcm9ncmFtLmdldFVuaWZvcm1Mb2NhdGlvbkZvck5hbWUoXCJhbmdsZVwiKTtcblxuICAgICAgICB0aGlzLl9wcm9ncmFtLnNldFVuaWZvcm1Mb2NhdGlvbldpdGgxZih0aGlzLl91bmlBbmdsZSwgdGhpcy5fYW5nbGUpO1xuXG4gICAgICAgIGNjLnNldFByb2dyYW0odGhpcy5ub2RlLl9zZ05vZGUsIHRoaXMuX3Byb2dyYW0pO1xuICAgIH0sXG5cbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShkdCkge1xuICAgICAgICBpZiAodGhpcy5fcHJvZ3JhbSkge1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMWYodGhpcy5fdW5pTW90aW9uLCB0aGlzLl9tb3Rpb24gKz0gMC4wNSk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnVwZGF0ZVVuaWZvcm1zKCk7XG4gICAgICAgICAgICBpZiAoMS4wZTIwIDwgdGhpcy5fbW90aW9uKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbW90aW9uID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnYjk5MWNCZGdBRkY0N1R2a0Rpc2tXTHMnLCAnV2F2ZV9WSCcpO1xuLy8gU2NyaXB0L1dhdmVfVkguanNcblxudmFyIF9kZWZhdWx0X3ZlcnQgPSByZXF1aXJlKFwiLi4vU2hhZGVycy9jY1NoYWRlcl9EZWZhdWx0X1ZlcnQuanNcIik7XG52YXIgX3dhdmVfdmhfZnJhZyA9IHJlcXVpcmUoXCIuLi9TaGFkZXJzL2NjU2hhZGVyX1dhdmVfVkhfRnJhZy5qc1wiKTtcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7fSxcblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLl9hbmdsZSA9IDE1O1xuICAgICAgICB0aGlzLl9tb3Rpb24gPSAwO1xuXG4gICAgICAgIHRoaXMuX3VzZSgpO1xuICAgIH0sXG5cbiAgICBfdXNlOiBmdW5jdGlvbiBfdXNlKCkge1xuICAgICAgICB0aGlzLl9wcm9ncmFtID0gbmV3IGNjLkdMUHJvZ3JhbSgpO1xuICAgICAgICB0aGlzLl9wcm9ncmFtLmluaXRXaXRoVmVydGV4U2hhZGVyQnl0ZUFycmF5KF9kZWZhdWx0X3ZlcnQsIF93YXZlX3ZoX2ZyYWcpO1xuXG4gICAgICAgIHRoaXMuX3Byb2dyYW0uYWRkQXR0cmlidXRlKGNjLkFUVFJJQlVURV9OQU1FX1BPU0lUSU9OLCBjYy5WRVJURVhfQVRUUklCX1BPU0lUSU9OKTtcbiAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MuQVRUUklCVVRFX05BTUVfQ09MT1IsIGNjLlZFUlRFWF9BVFRSSUJfQ09MT1IpO1xuICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5BVFRSSUJVVEVfTkFNRV9URVhfQ09PUkQsIGNjLlZFUlRFWF9BVFRSSUJfVEVYX0NPT1JEUyk7XG4gICAgICAgIHRoaXMuX3Byb2dyYW0ubGluaygpO1xuICAgICAgICB0aGlzLl9wcm9ncmFtLnVwZGF0ZVVuaWZvcm1zKCk7XG5cbiAgICAgICAgdGhpcy5fdW5pTW90aW9uID0gdGhpcy5fcHJvZ3JhbS5nZXRVbmlmb3JtTG9jYXRpb25Gb3JOYW1lKFwibW90aW9uXCIpO1xuICAgICAgICB0aGlzLl91bmlBbmdsZSA9IHRoaXMuX3Byb2dyYW0uZ2V0VW5pZm9ybUxvY2F0aW9uRm9yTmFtZShcImFuZ2xlXCIpO1xuXG4gICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDFmKHRoaXMuX3VuaUFuZ2xlLCB0aGlzLl9hbmdsZSk7XG5cbiAgICAgICAgY2Muc2V0UHJvZ3JhbSh0aGlzLm5vZGUuX3NnTm9kZSwgdGhpcy5fcHJvZ3JhbSk7XG4gICAgfSxcblxuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKGR0KSB7XG4gICAgICAgIGlmICh0aGlzLl9wcm9ncmFtKSB7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnNldFVuaWZvcm1Mb2NhdGlvbldpdGgxZih0aGlzLl91bmlNb3Rpb24sIHRoaXMuX21vdGlvbiArPSAwLjA1KTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0udXBkYXRlVW5pZm9ybXMoKTtcbiAgICAgICAgICAgIGlmICgxLjBlMjAgPCB0aGlzLl9tb3Rpb24pIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9tb3Rpb24gPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc2M2E4Y0RWaThSTmM3OHJKRDEyNmtzOScsICdXYXZlX1YnKTtcbi8vIFNjcmlwdC9XYXZlX1YuanNcblxudmFyIF9kZWZhdWx0X3ZlcnQgPSByZXF1aXJlKFwiLi4vU2hhZGVycy9jY1NoYWRlcl9EZWZhdWx0X1ZlcnQuanNcIik7XG52YXIgX3dhdmVfdl9mcmFnID0gcmVxdWlyZShcIi4uL1NoYWRlcnMvY2NTaGFkZXJfV2F2ZV9WX0ZyYWcuanNcIik7XG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge30sXG5cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5fYW5nbGUgPSAxNTtcbiAgICAgICAgdGhpcy5fbW90aW9uID0gMDtcblxuICAgICAgICB0aGlzLl91c2UoKTtcbiAgICB9LFxuXG4gICAgX3VzZTogZnVuY3Rpb24gX3VzZSgpIHtcbiAgICAgICAgdGhpcy5fcHJvZ3JhbSA9IG5ldyBjYy5HTFByb2dyYW0oKTtcbiAgICAgICAgdGhpcy5fcHJvZ3JhbS5pbml0V2l0aFZlcnRleFNoYWRlckJ5dGVBcnJheShfZGVmYXVsdF92ZXJ0LCBfd2F2ZV92X2ZyYWcpO1xuXG4gICAgICAgIHRoaXMuX3Byb2dyYW0uYWRkQXR0cmlidXRlKGNjLkFUVFJJQlVURV9OQU1FX1BPU0lUSU9OLCBjYy5WRVJURVhfQVRUUklCX1BPU0lUSU9OKTtcbiAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MuQVRUUklCVVRFX05BTUVfQ09MT1IsIGNjLlZFUlRFWF9BVFRSSUJfQ09MT1IpO1xuICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5BVFRSSUJVVEVfTkFNRV9URVhfQ09PUkQsIGNjLlZFUlRFWF9BVFRSSUJfVEVYX0NPT1JEUyk7XG4gICAgICAgIHRoaXMuX3Byb2dyYW0ubGluaygpO1xuICAgICAgICB0aGlzLl9wcm9ncmFtLnVwZGF0ZVVuaWZvcm1zKCk7XG5cbiAgICAgICAgdGhpcy5fdW5pTW90aW9uID0gdGhpcy5fcHJvZ3JhbS5nZXRVbmlmb3JtTG9jYXRpb25Gb3JOYW1lKFwibW90aW9uXCIpO1xuICAgICAgICB0aGlzLl91bmlBbmdsZSA9IHRoaXMuX3Byb2dyYW0uZ2V0VW5pZm9ybUxvY2F0aW9uRm9yTmFtZShcImFuZ2xlXCIpO1xuXG4gICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDFmKHRoaXMuX3VuaUFuZ2xlLCB0aGlzLl9hbmdsZSk7XG5cbiAgICAgICAgY2Muc2V0UHJvZ3JhbSh0aGlzLm5vZGUuX3NnTm9kZSwgdGhpcy5fcHJvZ3JhbSk7XG4gICAgfSxcblxuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKGR0KSB7XG4gICAgICAgIGlmICh0aGlzLl9wcm9ncmFtKSB7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnNldFVuaWZvcm1Mb2NhdGlvbldpdGgxZih0aGlzLl91bmlNb3Rpb24sIHRoaXMuX21vdGlvbiArPSAwLjA1KTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0udXBkYXRlVW5pZm9ybXMoKTtcbiAgICAgICAgICAgIGlmICgxLjBlMjAgPCB0aGlzLl9tb3Rpb24pIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9tb3Rpb24gPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICcxYTJlMGxnZkxWSjJaMUpDZGNGQXI4WCcsICdjY1NoYWRlcl9BdmdfQmxhY2tfV2hpdGVfRnJhZycpO1xuLy8gU2hhZGVycy9jY1NoYWRlcl9BdmdfQmxhY2tfV2hpdGVfRnJhZy5qc1xuXG4vKiDlubPlnYflgLzpu5Hnmb0gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBcInByZWNpc2lvbiBtZWRpdW1wIGZsb2F0O1xcblwiICsgXCJ2YXJ5aW5nIHZlYzIgdl90ZXhDb29yZDtcXG5cIiArIFwidm9pZCBtYWluKClcXG5cIiArIFwie1xcblwiICsgXCIgICAgdmVjMyB2ID0gdGV4dHVyZTJEKENDX1RleHR1cmUwLCB2X3RleENvb3JkKS5yZ2I7XFxuXCIgKyBcIiAgICBmbG9hdCBmID0gKHYuciArIHYuZyArIHYuYikgLyAzLjA7XFxuXCIgKyBcIiAgICBnbF9GcmFnQ29sb3IgPSB2ZWM0KGYsIGYsIGYsIDEuMCk7XFxuXCIgKyBcIn1cXG5cIjtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzhkOGVmSHhEK05KREpEaGpyUWxCSEpzJywgJ2NjU2hhZGVyX0JsdXJfRWRnZV9EZXRhaWxfRnJhZycpO1xuLy8gU2hhZGVycy9jY1NoYWRlcl9CbHVyX0VkZ2VfRGV0YWlsX0ZyYWcuanNcblxuLyog5qih57OKIDAuNSAgICAgKi9cbi8qIOaooeeziiAxLjAgICAgICovXG4vKiDnu4boioIgLTIuMCAgICAqL1xuLyog57uG6IqCIC01LjAgICAgKi9cbi8qIOe7huiKgiAtMTAuMCAgICovXG4vKiDovrnnvJggMi4wICAgICAqL1xuLyog6L6557yYIDUuMCAgICAgKi9cbi8qIOi+uee8mCAxMC4wICAgICovXG5cbm1vZHVsZS5leHBvcnRzID0gXCJwcmVjaXNpb24gbWVkaXVtcCBmbG9hdDtcXG5cIiArIFwidmFyeWluZyB2ZWMyIHZfdGV4Q29vcmQ7XFxuXCIgKyBcInVuaWZvcm0gZmxvYXQgd2lkdGhTdGVwO1xcblwiICsgXCJ1bmlmb3JtIGZsb2F0IGhlaWdodFN0ZXA7XFxuXCIgKyBcInVuaWZvcm0gZmxvYXQgc3RyZW5ndGg7XFxuXCIgKyBcImNvbnN0IGZsb2F0IGJsdXJSYWRpdXMgPSAyLjA7XFxuXCIgKyBcImNvbnN0IGZsb2F0IGJsdXJQaXhlbHMgPSAoYmx1clJhZGl1cyAqIDIuMCArIDEuMCkgKiAoYmx1clJhZGl1cyAqIDIuMCArIDEuMCk7XFxuXCIgKyBcInZvaWQgbWFpbigpXFxuXCIgKyBcIntcXG5cIiArIFwiICAgIHZlYzMgc3VtQ29sb3IgPSB2ZWMzKDAuMCwgMC4wLCAwLjApO1xcblwiICsgXCIgICAgZm9yKGZsb2F0IGZ5ID0gLWJsdXJSYWRpdXM7IGZ5IDw9IGJsdXJSYWRpdXM7ICsrZnkpXFxuXCIgKyBcIiAgICB7XFxuXCIgKyBcIiAgICAgICAgZm9yKGZsb2F0IGZ4ID0gLWJsdXJSYWRpdXM7IGZ4IDw9IGJsdXJSYWRpdXM7ICsrZngpXFxuXCIgKyBcIiAgICAgICAge1xcblwiICsgXCIgICAgICAgICAgICB2ZWMyIGNvb3JkID0gdmVjMihmeCAqIHdpZHRoU3RlcCwgZnkgKiBoZWlnaHRTdGVwKTtcXG5cIiArIFwiICAgICAgICAgICAgc3VtQ29sb3IgKz0gdGV4dHVyZTJEKENDX1RleHR1cmUwLCB2X3RleENvb3JkICsgY29vcmQpLnJnYjtcXG5cIiArIFwiICAgICAgICB9XFxuXCIgKyBcIiAgICB9XFxuXCIgKyBcIiAgICBnbF9GcmFnQ29sb3IgPSB2ZWM0KG1peCh0ZXh0dXJlMkQoQ0NfVGV4dHVyZTAsIHZfdGV4Q29vcmQpLnJnYiwgc3VtQ29sb3IgLyBibHVyUGl4ZWxzLCBzdHJlbmd0aCksIDEuMCk7XFxuXCIgKyBcIn1cXG5cIjtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzQ0MGY1Vzd1dlZOQWFaeDRBTHpvWk44JywgJ2NjU2hhZGVyX0RlZmF1bHRfVmVydCcpO1xuLy8gU2hhZGVycy9jY1NoYWRlcl9EZWZhdWx0X1ZlcnQuanNcblxubW9kdWxlLmV4cG9ydHMgPSBcImF0dHJpYnV0ZSB2ZWM0IGFfcG9zaXRpb247XFxuXCIgKyBcIiBhdHRyaWJ1dGUgdmVjMiBhX3RleENvb3JkO1xcblwiICsgXCIgYXR0cmlidXRlIHZlYzQgYV9jb2xvcjtcXG5cIiArIFwiIHZhcnlpbmcgdmVjMiB2X3RleENvb3JkO1xcblwiICsgXCIgdmFyeWluZyB2ZWM0IHZfZnJhZ21lbnRDb2xvcjtcXG5cIiArIFwiIHZvaWQgbWFpbigpXFxuXCIgKyBcIiB7XFxuXCIgKyBcIiAgICAgZ2xfUG9zaXRpb24gPSAoIENDX1BNYXRyaXggKiBDQ19NVk1hdHJpeCApICogYV9wb3NpdGlvbjtcXG5cIiArIFwiICAgICB2X2ZyYWdtZW50Q29sb3IgPSBhX2NvbG9yO1xcblwiICsgXCIgICAgIHZfdGV4Q29vcmQgPSBhX3RleENvb3JkO1xcblwiICsgXCIgfSBcXG5cIjtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2FjNDQydHNUUmRGWXBJRnFHZkhXekNWJywgJ2NjU2hhZGVyX0VtYm9zc19GcmFnJyk7XG4vLyBTaGFkZXJzL2NjU2hhZGVyX0VtYm9zc19GcmFnLmpzXG5cbi8qIOa1rumblSAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IFwicHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7XFxuXCIgKyBcInZhcnlpbmcgdmVjMiB2X3RleENvb3JkO1xcblwiICsgXCJ1bmlmb3JtIGZsb2F0IHdpZHRoU3RlcDtcXG5cIiArIFwidW5pZm9ybSBmbG9hdCBoZWlnaHRTdGVwO1xcblwiICsgXCJjb25zdCBmbG9hdCBzdHJpZGUgPSAyLjA7XFxuXCIgKyBcInZvaWQgbWFpbigpXFxuXCIgKyBcIntcXG5cIiArIFwiICAgIHZlYzMgdG1wQ29sb3IgPSB0ZXh0dXJlMkQoQ0NfVGV4dHVyZTAsIHZfdGV4Q29vcmQgKyB2ZWMyKHdpZHRoU3RlcCAqIHN0cmlkZSwgaGVpZ2h0U3RlcCAqIHN0cmlkZSkpLnJnYjtcXG5cIiArIFwiICAgIHRtcENvbG9yID0gdGV4dHVyZTJEKENDX1RleHR1cmUwLCB2X3RleENvb3JkKS5yZ2IgLSB0bXBDb2xvciArIDAuNTtcXG5cIiArIFwiICAgIGZsb2F0IGYgPSAodG1wQ29sb3IuciArIHRtcENvbG9yLmcgKyB0bXBDb2xvci5iKSAvIDMuMDtcXG5cIiArIFwiICAgIGdsX0ZyYWdDb2xvciA9IHZlYzQoZiwgZiwgZiwgMS4wKTtcXG5cIiArIFwifVxcblwiO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnZDIyNGZ6bVNJaFBPbzE2WG9WMXhwWVMnLCAnY2NTaGFkZXJfR2xhc3NfRnJhZycpO1xuLy8gU2hhZGVycy9jY1NoYWRlcl9HbGFzc19GcmFnLmpzXG5cbi8qIOejqOeggueOu+eSgyAxLjAgKi9cbi8qIOejqOeggueOu+eSgyAzLjAgKi9cbi8qIOejqOeggueOu+eSgyA2LjAgKi9cblxubW9kdWxlLmV4cG9ydHMgPSBcInByZWNpc2lvbiBtZWRpdW1wIGZsb2F0O1xcblwiICsgXCJ2YXJ5aW5nIHZlYzIgdl90ZXhDb29yZDtcXG5cIiArIFwidW5pZm9ybSBmbG9hdCB3aWR0aFN0ZXA7XFxuXCIgKyBcInVuaWZvcm0gZmxvYXQgaGVpZ2h0U3RlcDtcXG5cIiArIFwidW5pZm9ybSBmbG9hdCBibHVyUmFkaXVzU2NhbGU7XFxuXCIgKyBcImNvbnN0IGZsb2F0IGJsdXJSYWRpdXMgPSA2LjA7XFxuXCIgKyBcImNvbnN0IGZsb2F0IGJsdXJQaXhlbHMgPSAoYmx1clJhZGl1cyAqIDIuMCArIDEuMCkgKiAoYmx1clJhZGl1cyAqIDIuMCArIDEuMCk7XFxuXCIgKyBcImZsb2F0IHJhbmRvbSh2ZWMzIHNjYWxlLCBmbG9hdCBzZWVkKSB7XFxuXCIgKyBcIiAgICByZXR1cm4gZnJhY3Qoc2luKGRvdChnbF9GcmFnQ29vcmQueHl6ICsgc2VlZCwgc2NhbGUpKSAqIDQzNzU4LjU0NTMgKyBzZWVkKTtcXG5cIiArIFwifVxcblwiICsgXCJ2b2lkIG1haW4oKVxcblwiICsgXCJ7XFxuXCIgKyBcIiAgICB2ZWMzIHN1bUNvbG9yID0gdmVjMygwLjAsIDAuMCwgMC4wKTtcXG5cIiArIFwiICAgIGZvcihmbG9hdCBmeSA9IC1ibHVyUmFkaXVzOyBmeSA8PSBibHVyUmFkaXVzOyArK2Z5KVxcblwiICsgXCIgICAge1xcblwiICsgXCIgICAgICAgIGZsb2F0IGRpciA9IHJhbmRvbSh2ZWMzKDEyLjk4OTgsIDc4LjIzMywgMTUxLjcxODIpLCAwLjApO1xcblwiICsgXCIgICAgICAgIGZvcihmbG9hdCBmeCA9IC1ibHVyUmFkaXVzOyBmeCA8PSBibHVyUmFkaXVzOyArK2Z4KVxcblwiICsgXCIgICAgICAgIHtcXG5cIiArIFwiICAgICAgICAgICAgZmxvYXQgZGlzID0gZGlzdGFuY2UodmVjMihmeCAqIHdpZHRoU3RlcCwgZnkgKiBoZWlnaHRTdGVwKSwgdmVjMigwLjAsIDAuMCkpICogYmx1clJhZGl1c1NjYWxlO1xcblwiICsgXCIgICAgICAgICAgICB2ZWMyIGNvb3JkID0gdmVjMihkaXMgKiBjb3MoZGlyKSwgZGlzICogc2luKGRpcikpO1xcblwiICsgXCIgICAgICAgICAgICBzdW1Db2xvciArPSB0ZXh0dXJlMkQoQ0NfVGV4dHVyZTAsIHZfdGV4Q29vcmQgKyBjb29yZCkucmdiO1xcblwiICsgXCIgICAgICAgIH1cXG5cIiArIFwiICAgIH1cXG5cIiArIFwiICAgIGdsX0ZyYWdDb2xvciA9IHZlYzQoc3VtQ29sb3IgLyBibHVyUGl4ZWxzLCAxLjApO1xcblwiICsgXCJ9XFxuXCI7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc3Mzg4OHhvSndWSVdyaFpjNXlnYVd6RScsICdjY1NoYWRlcl9HcmF5X0ZyYWcnKTtcbi8vIFNoYWRlcnMvY2NTaGFkZXJfR3JheV9GcmFnLmpzXG5cbi8qIOeBsOW6piAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IFwicHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7XFxuXCIgKyBcInZhcnlpbmcgdmVjMiB2X3RleENvb3JkO1xcblwiICsgXCJ2b2lkIG1haW4oKVxcblwiICsgXCJ7XFxuXCIgKyBcIiAgICB2ZWMzIHYgPSB0ZXh0dXJlMkQoQ0NfVGV4dHVyZTAsIHZfdGV4Q29vcmQpLnJnYjtcXG5cIiArIFwiICAgIGZsb2F0IGYgPSB2LnIgKiAwLjI5OSArIHYuZyAqIDAuNTg3ICsgdi5iICogMC4xMTQ7XFxuXCIgKyBcIiAgICBnbF9GcmFnQ29sb3IgPSB2ZWM0KGYsIGYsIGYsIDEuMCk7XFxuXCIgKyBcIn1cXG5cIjtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2M3ODNjaUdqQ2hGd0lLcldneHhxY0lmJywgJ2NjU2hhZGVyX05lZ2F0aXZlX0JsYWNrX1doaXRlX0ZyYWcnKTtcbi8vIFNoYWRlcnMvY2NTaGFkZXJfTmVnYXRpdmVfQmxhY2tfV2hpdGVfRnJhZy5qc1xuXG4vKiDlupXniYfpu5Hnmb0gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBcInByZWNpc2lvbiBtZWRpdW1wIGZsb2F0O1xcblwiICsgXCJ2YXJ5aW5nIHZlYzIgdl90ZXhDb29yZDtcXG5cIiArIFwidm9pZCBtYWluKClcXG5cIiArIFwie1xcblwiICsgXCIgICAgdmVjMyB2ID0gdGV4dHVyZTJEKENDX1RleHR1cmUwLCB2X3RleENvb3JkKS5yZ2I7XFxuXCIgKyBcIiAgICBmbG9hdCBmID0gMS4wIC0gKHYuciAqIDAuMyArIHYuZyAqIDAuNTkgKyB2LmIgKiAwLjExKTtcXG5cIiArIFwiICAgIGdsX0ZyYWdDb2xvciA9IHZlYzQoZiwgZiwgZiwgMS4wKTtcXG5cIiArIFwifVxcblwiO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnMjJiODZRd0RlOUFMTFBFTUZ6RXI3L0knLCAnY2NTaGFkZXJfTmVnYXRpdmVfSW1hZ2VfRnJhZycpO1xuLy8gU2hhZGVycy9jY1NoYWRlcl9OZWdhdGl2ZV9JbWFnZV9GcmFnLmpzXG5cbi8qIOW6leeJh+mVnOWDjyAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IFwicHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7XFxuXCIgKyBcInZhcnlpbmcgdmVjMiB2X3RleENvb3JkO1xcblwiICsgXCJ2b2lkIG1haW4oKVxcblwiICsgXCJ7XFxuXCIgKyBcIlx0Z2xfRnJhZ0NvbG9yID0gdmVjNCgxLjAgLSB0ZXh0dXJlMkQoQ0NfVGV4dHVyZTAsIHZfdGV4Q29vcmQpLnJnYiwgMS4wKTtcXG5cIiArIFwifVxcblwiO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnYzI3MmV2VG9icExpb1ZjWjhZVVJuV1EnLCAnY2NTaGFkZXJfU2hhZG93X0JsYWNrX1doaXRlX0ZyYWcnKTtcbi8vIFNoYWRlcnMvY2NTaGFkZXJfU2hhZG93X0JsYWNrX1doaXRlX0ZyYWcuanNcblxuLyog5riQ5Y+Y6buR55m9ICovXG5cbm1vZHVsZS5leHBvcnRzID0gXCJwcmVjaXNpb24gbWVkaXVtcCBmbG9hdDtcXG5cIiArIFwidmFyeWluZyB2ZWMyIHZfdGV4Q29vcmQ7XFxuXCIgKyBcInVuaWZvcm0gZmxvYXQgc3RyZW5ndGg7XFxuXCIgKyBcInZvaWQgbWFpbigpXFxuXCIgKyBcIntcXG5cIiArIFwiICAgIHZlYzMgdiA9IHRleHR1cmUyRChDQ19UZXh0dXJlMCwgdl90ZXhDb29yZCkucmdiO1xcblwiICsgXCIgICAgZmxvYXQgZiA9IHN0ZXAoc3RyZW5ndGgsICh2LnIgKyB2LmcgKyB2LmIpIC8gMy4wICk7XFxuXCIgKyBcIiAgICBnbF9GcmFnQ29sb3IgPSB2ZWM0KGYsIGYsIGYsIDEuMCk7XFxuXCIgKyBcIn1cXG5cIjtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2U2YTUxTEdZSVpFQzdWNjFqNUtpZ21IJywgJ2NjU2hhZGVyX1dhdmVfSF9GcmFnJyk7XG4vLyBTaGFkZXJzL2NjU2hhZGVyX1dhdmVfSF9GcmFnLmpzXG5cbi8qIOawtOW5s+azoua1qiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IFwicHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7XFxuXCIgKyBcInZhcnlpbmcgdmVjMiB2X3RleENvb3JkO1xcblwiICsgXCJ1bmlmb3JtIGZsb2F0IG1vdGlvbjtcXG5cIiArIFwidW5pZm9ybSBmbG9hdCBhbmdsZTtcXG5cIiArIFwidm9pZCBtYWluKClcXG5cIiArIFwie1xcblwiICsgXCIgICAgdmVjMiB0bXAgPSB2X3RleENvb3JkO1xcblwiICsgXCIgICAgdG1wLnggPSB0bXAueCArIDAuMDUgKiBzaW4obW90aW9uICsgIHRtcC55ICogYW5nbGUpO1xcblwiICsgXCIgICAgZ2xfRnJhZ0NvbG9yID0gdGV4dHVyZTJEKENDX1RleHR1cmUwLCB0bXApO1xcblwiICsgXCJ9XFxuXCI7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc3MDNlMUszb2VsTTA0R0d4Y2x6SlBQSycsICdjY1NoYWRlcl9XYXZlX1ZIX0ZyYWcnKTtcbi8vIFNoYWRlcnMvY2NTaGFkZXJfV2F2ZV9WSF9GcmFnLmpzXG5cbi8qIOWFqOWxgOazoua1qiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IFwicHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7XFxuXCIgKyBcInZhcnlpbmcgdmVjMiB2X3RleENvb3JkO1xcblwiICsgXCJ1bmlmb3JtIGZsb2F0IG1vdGlvbjtcXG5cIiArIFwidW5pZm9ybSBmbG9hdCBhbmdsZTtcXG5cIiArIFwidm9pZCBtYWluKClcXG5cIiArIFwie1xcblwiICsgXCIgICAgdmVjMiB0bXAgPSB2X3RleENvb3JkO1xcblwiICsgXCIgICAgdG1wLnggPSB0bXAueCArIDAuMDEgKiBzaW4obW90aW9uICsgIHRtcC54ICogYW5nbGUpO1xcblwiICsgXCIgICAgdG1wLnkgPSB0bXAueSArIDAuMDEgKiBzaW4obW90aW9uICsgIHRtcC55ICogYW5nbGUpO1xcblwiICsgXCIgICAgZ2xfRnJhZ0NvbG9yID0gdGV4dHVyZTJEKENDX1RleHR1cmUwLCB0bXApO1xcblwiICsgXCJ9XFxuXCI7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICcwMzVjNTFpbHE1RTVLMHZSOGd4Sms2MycsICdjY1NoYWRlcl9XYXZlX1ZfRnJhZycpO1xuLy8gU2hhZGVycy9jY1NoYWRlcl9XYXZlX1ZfRnJhZy5qc1xuXG4vKiDlnoLnm7Tms6LmtaogKi9cblxubW9kdWxlLmV4cG9ydHMgPSBcInByZWNpc2lvbiBtZWRpdW1wIGZsb2F0O1xcblwiICsgXCJ2YXJ5aW5nIHZlYzIgdl90ZXhDb29yZDtcXG5cIiArIFwidW5pZm9ybSBmbG9hdCBtb3Rpb247XFxuXCIgKyBcInVuaWZvcm0gZmxvYXQgYW5nbGU7XFxuXCIgKyBcInZvaWQgbWFpbigpXFxuXCIgKyBcIntcXG5cIiArIFwiICAgIHZlYzIgdG1wID0gdl90ZXhDb29yZDtcXG5cIiArIFwiICAgIHRtcC55ID0gdG1wLnkgKyAwLjA1ICogc2luKG1vdGlvbiArICB0bXAueCAqIGFuZ2xlKTtcXG5cIiArIFwiICAgIGdsX0ZyYWdDb2xvciA9IHRleHR1cmUyRChDQ19UZXh0dXJlMCwgdG1wKTtcXG5cIiArIFwifVxcblwiO1xuXG5jYy5fUkZwb3AoKTsiXX0=
