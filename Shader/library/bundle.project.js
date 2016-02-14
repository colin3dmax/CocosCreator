require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"Avg_Black_White":[function(require,module,exports){
cc._RFpush(module, '414458STphLF75+aFmYFzfh', 'Avg_Black_White');
// Script/Avg_Black_White.js

"use strict";

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
cc._RFpush(module, 'dd0cfUZNt1BMqcicmcIieWs', 'Blur_Edge_Detail');
// Script/Blur_Edge_Detail.js

"use strict";

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
cc._RFpush(module, '96880Mj0cdDB4XR7BWESnn1', 'Emboss');
// Script/Emboss.js

"use strict";

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
cc._RFpush(module, '4b2b93dv2tMPYO54MTCHTfp', 'Glass');
// Script/Glass.js

"use strict";

var _default_vert = require("../Shaders/ccShader_Default_Vert.js");
var _glass_frag = require("../Shaders/ccShader_Glass_Frag.js");

cc.Class({
    "extends": cc.Component,

    properties: {},

    onLoad: function onLoad() {
        this._use();
    },

    _use: function _use() {
        this._program = new cc.GLProgram();
        this._program.initWithVertexShaderByteArray(_default_vert, _glass_frag);

        this._program.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);
        this._program.addAttribute(cc.ATTRIBUTE_NAME_COLOR, cc.VERTEX_ATTRIB_COLOR);
        this._program.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);
        this._program.link();
        this._program.updateUniforms();

        this._uniWidthStep = this._program.getUniformLocationForName("widthStep");
        this._uniHeightStep = this._program.getUniformLocationForName("heightStep");
        this._uniBlurRadiusScale = this._program.getUniformLocationForName("blurRadiusScale");

        this._program.setUniformLocationWith1f(this._uniWidthStep, 1.0 / this.node.getContentSize().width);
        this._program.setUniformLocationWith1f(this._uniHeightStep, 1.0 / this.node.getContentSize().height);

        /* 磨砂玻璃 1.0 */
        /* 磨砂玻璃 3.0 */
        /* 磨砂玻璃 6.0 */
        this._program.setUniformLocationWith1f(this._uniBlurRadiusScale, 6.0);

        cc.setProgram(this.node._sgNode, this._program);
    }

});

cc._RFpop();
},{"../Shaders/ccShader_Default_Vert.js":"ccShader_Default_Vert","../Shaders/ccShader_Glass_Frag.js":"ccShader_Glass_Frag"}],"Gray":[function(require,module,exports){
cc._RFpush(module, 'beb6duloztFW7GMx6d9gIya', 'Gray');
// Script/Gray.js

"use strict";

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
cc._RFpush(module, '5898b9+Nz1Mtb9hpqGfj1ML', 'Negative_Black_White');
// Script/Negative_Black_White.js

"use strict";

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
cc._RFpush(module, '1223bWIWhFParPR7jg0vHan', 'Negative_Image');
// Script/Negative_Image.js

"use strict";

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
cc._RFpush(module, '7b15cFSchVHjaD3Jpz4tjaj', 'Shadow_Black_White');
// Script/Shadow_Black_White.js

"use strict";

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
cc._RFpush(module, 'bdf19y2pc1PVoqxb0sbsYvb', 'Wave_H');
// Script/Wave_H.js

"use strict";

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
cc._RFpush(module, 'b991cBdgAFF47TvkDiskWLs', 'Wave_VH');
// Script/Wave_VH.js

"use strict";

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
cc._RFpush(module, '63a8cDVi8RNc78rJD126ks9', 'Wave_V');
// Script/Wave_V.js

"use strict";

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
cc._RFpush(module, '1a2e0lgfLVJ2Z1JCdcFAr8X', 'ccShader_Avg_Black_White_Frag');
// Shaders/ccShader_Avg_Black_White_Frag.js

/* 平均值黑白 */

"use strict";

module.exports = "precision mediump float;\n" + "varying vec2 v_texCoord;\n" + "void main()\n" + "{\n" + "    vec3 v = texture2D(CC_Texture0, v_texCoord).rgb;\n" + "    float f = (v.r + v.g + v.b) / 3.0;\n" + "    gl_FragColor = vec4(f, f, f, 1.0);\n" + "}\n";

cc._RFpop();
},{}],"ccShader_Blur_Edge_Detail_Frag":[function(require,module,exports){
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

"use strict";

module.exports = "precision mediump float;\n" + "varying vec2 v_texCoord;\n" + "uniform float widthStep;\n" + "uniform float heightStep;\n" + "uniform float strength;\n" + "const float blurRadius = 2.0;\n" + "const float blurPixels = (blurRadius * 2.0 + 1.0) * (blurRadius * 2.0 + 1.0);\n" + "void main()\n" + "{\n" + "    vec3 sumColor = vec3(0.0, 0.0, 0.0);\n" + "    for(float fy = -blurRadius; fy <= blurRadius; ++fy)\n" + "    {\n" + "        for(float fx = -blurRadius; fx <= blurRadius; ++fx)\n" + "        {\n" + "            vec2 coord = vec2(fx * widthStep, fy * heightStep);\n" + "            sumColor += texture2D(CC_Texture0, v_texCoord + coord).rgb;\n" + "        }\n" + "    }\n" + "    gl_FragColor = vec4(mix(texture2D(CC_Texture0, v_texCoord).rgb, sumColor / blurPixels, strength), 1.0);\n" + "}\n";

cc._RFpop();
},{}],"ccShader_Default_Vert":[function(require,module,exports){
cc._RFpush(module, '440f5W7uvVNAaZx4ALzoZN8', 'ccShader_Default_Vert');
// Shaders/ccShader_Default_Vert.js

"use strict";

module.exports = "attribute vec4 a_position;\n" + " attribute vec2 a_texCoord;\n" + " attribute vec4 a_color;\n" + " varying vec2 v_texCoord;\n" + " varying vec4 v_fragmentColor;\n" + " void main()\n" + " {\n" + "     gl_Position = ( CC_PMatrix * CC_MVMatrix ) * a_position;\n" + "     v_fragmentColor = a_color;\n" + "     v_texCoord = a_texCoord;\n" + " } \n";

cc._RFpop();
},{}],"ccShader_Emboss_Frag":[function(require,module,exports){
cc._RFpush(module, 'ac442tsTRdFYpIFqGfHWzCV', 'ccShader_Emboss_Frag');
// Shaders/ccShader_Emboss_Frag.js

/* 浮雕 */

"use strict";

module.exports = "precision mediump float;\n" + "varying vec2 v_texCoord;\n" + "uniform float widthStep;\n" + "uniform float heightStep;\n" + "const float stride = 2.0;\n" + "void main()\n" + "{\n" + "    vec3 tmpColor = texture2D(CC_Texture0, v_texCoord + vec2(widthStep * stride, heightStep * stride)).rgb;\n" + "    tmpColor = texture2D(CC_Texture0, v_texCoord).rgb - tmpColor + 0.5;\n" + "    float f = (tmpColor.r + tmpColor.g + tmpColor.b) / 3.0;\n" + "    gl_FragColor = vec4(f, f, f, 1.0);\n" + "}\n";

cc._RFpop();
},{}],"ccShader_Glass_Frag":[function(require,module,exports){
cc._RFpush(module, 'd224fzmSIhPOo16XoV1xpYS', 'ccShader_Glass_Frag');
// Shaders/ccShader_Glass_Frag.js

/* 磨砂玻璃 1.0 */
/* 磨砂玻璃 3.0 */
/* 磨砂玻璃 6.0 */

"use strict";

module.exports = "precision mediump float;\n" + "varying vec2 v_texCoord;\n" + "uniform float widthStep;\n" + "uniform float heightStep;\n" + "uniform float blurRadiusScale;\n" + "const float blurRadius = 6.0;\n" + "const float blurPixels = (blurRadius * 2.0 + 1.0) * (blurRadius * 2.0 + 1.0);\n" + "float random(vec3 scale, float seed) {\n" + "    return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);\n" + "}\n" + "void main()\n" + "{\n" + "    vec3 sumColor = vec3(0.0, 0.0, 0.0);\n" + "    for(float fy = -blurRadius; fy <= blurRadius; ++fy)\n" + "    {\n" + "        float dir = random(vec3(12.9898, 78.233, 151.7182), 0.0);\n" + "        for(float fx = -blurRadius; fx <= blurRadius; ++fx)\n" + "        {\n" + "            float dis = distance(vec2(fx * widthStep, fy * heightStep), vec2(0.0, 0.0)) * blurRadiusScale;\n" + "            vec2 coord = vec2(dis * cos(dir), dis * sin(dir));\n" + "            sumColor += texture2D(CC_Texture0, v_texCoord + coord).rgb;\n" + "        }\n" + "    }\n" + "    gl_FragColor = vec4(sumColor / blurPixels, 1.0);\n" + "}\n";

cc._RFpop();
},{}],"ccShader_Gray_Frag":[function(require,module,exports){
cc._RFpush(module, '73888xoJwVIWrhZc5ygaWzE', 'ccShader_Gray_Frag');
// Shaders/ccShader_Gray_Frag.js

/* 灰度 */

"use strict";

module.exports = "precision mediump float;\n" + "varying vec2 v_texCoord;\n" + "void main()\n" + "{\n" + "    vec3 v = texture2D(CC_Texture0, v_texCoord).rgb;\n" + "    float f = v.r * 0.299 + v.g * 0.587 + v.b * 0.114;\n" + "    gl_FragColor = vec4(f, f, f, 1.0);\n" + "}\n";

cc._RFpop();
},{}],"ccShader_Negative_Black_White_Frag":[function(require,module,exports){
cc._RFpush(module, 'c783ciGjChFwIKrWgxxqcIf', 'ccShader_Negative_Black_White_Frag');
// Shaders/ccShader_Negative_Black_White_Frag.js

/* 底片黑白 */

"use strict";

module.exports = "precision mediump float;\n" + "varying vec2 v_texCoord;\n" + "void main()\n" + "{\n" + "    vec3 v = texture2D(CC_Texture0, v_texCoord).rgb;\n" + "    float f = 1.0 - (v.r * 0.3 + v.g * 0.59 + v.b * 0.11);\n" + "    gl_FragColor = vec4(f, f, f, 1.0);\n" + "}\n";

cc._RFpop();
},{}],"ccShader_Negative_Image_Frag":[function(require,module,exports){
cc._RFpush(module, '22b86QwDe9ALLPEMFzEr7/I', 'ccShader_Negative_Image_Frag');
// Shaders/ccShader_Negative_Image_Frag.js

/* 底片镜像 */

"use strict";

module.exports = "precision mediump float;\n" + "varying vec2 v_texCoord;\n" + "void main()\n" + "{\n" + "	gl_FragColor = vec4(1.0 - texture2D(CC_Texture0, v_texCoord).rgb, 1.0);\n" + "}\n";

cc._RFpop();
},{}],"ccShader_Shadow_Black_White_Frag":[function(require,module,exports){
cc._RFpush(module, 'c272evTobpLioVcZ8YURnWQ', 'ccShader_Shadow_Black_White_Frag');
// Shaders/ccShader_Shadow_Black_White_Frag.js

/* 渐变黑白 */

"use strict";

module.exports = "precision mediump float;\n" + "varying vec2 v_texCoord;\n" + "uniform float strength;\n" + "void main()\n" + "{\n" + "    vec3 v = texture2D(CC_Texture0, v_texCoord).rgb;\n" + "    float f = step(strength, (v.r + v.g + v.b) / 3.0 );\n" + "    gl_FragColor = vec4(f, f, f, 1.0);\n" + "}\n";

cc._RFpop();
},{}],"ccShader_Wave_H_Frag":[function(require,module,exports){
cc._RFpush(module, 'e6a51LGYIZEC7V61j5KigmH', 'ccShader_Wave_H_Frag');
// Shaders/ccShader_Wave_H_Frag.js

/* 水平波浪 */

"use strict";

module.exports = "precision mediump float;\n" + "varying vec2 v_texCoord;\n" + "uniform float motion;\n" + "uniform float angle;\n" + "void main()\n" + "{\n" + "    vec2 tmp = v_texCoord;\n" + "    tmp.x = tmp.x + 0.05 * sin(motion +  tmp.y * angle);\n" + "    gl_FragColor = texture2D(CC_Texture0, tmp);\n" + "}\n";

cc._RFpop();
},{}],"ccShader_Wave_VH_Frag":[function(require,module,exports){
cc._RFpush(module, '703e1K3oelM04GGxclzJPPK', 'ccShader_Wave_VH_Frag');
// Shaders/ccShader_Wave_VH_Frag.js

/* 全局波浪 */

"use strict";

module.exports = "precision mediump float;\n" + "varying vec2 v_texCoord;\n" + "uniform float motion;\n" + "uniform float angle;\n" + "void main()\n" + "{\n" + "    vec2 tmp = v_texCoord;\n" + "    tmp.x = tmp.x + 0.01 * sin(motion +  tmp.x * angle);\n" + "    tmp.y = tmp.y + 0.01 * sin(motion +  tmp.y * angle);\n" + "    gl_FragColor = texture2D(CC_Texture0, tmp);\n" + "}\n";

cc._RFpop();
},{}],"ccShader_Wave_V_Frag":[function(require,module,exports){
cc._RFpush(module, '035c51ilq5E5K0vR8gxJk63', 'ccShader_Wave_V_Frag');
// Shaders/ccShader_Wave_V_Frag.js

/* 垂直波浪 */

"use strict";

module.exports = "precision mediump float;\n" + "varying vec2 v_texCoord;\n" + "uniform float motion;\n" + "uniform float angle;\n" + "void main()\n" + "{\n" + "    vec2 tmp = v_texCoord;\n" + "    tmp.y = tmp.y + 0.05 * sin(motion +  tmp.x * angle);\n" + "    gl_FragColor = texture2D(CC_Texture0, tmp);\n" + "}\n";

cc._RFpop();
},{}]},{},["ccShader_Wave_V_Frag","Negative_Image","ccShader_Avg_Black_White_Frag","ccShader_Negative_Image_Frag","Avg_Black_White","ccShader_Default_Vert","Glass","Negative_Black_White","Wave_V","ccShader_Wave_VH_Frag","ccShader_Gray_Frag","Shadow_Black_White","ccShader_Blur_Edge_Detail_Frag","Emboss","ccShader_Emboss_Frag","Wave_VH","Wave_H","Gray","ccShader_Shadow_Black_White_Frag","ccShader_Negative_Black_White_Frag","ccShader_Glass_Frag","Blur_Edge_Detail","ccShader_Wave_H_Frag"])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL0FwcGxpY2F0aW9ucy9Db2Nvc0NyZWF0b3IuYXBwL0NvbnRlbnRzL1Jlc291cmNlcy9hcHAuYXNhci9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiYXNzZXRzL1NjcmlwdC9BdmdfQmxhY2tfV2hpdGUuanMiLCJhc3NldHMvU2NyaXB0L0JsdXJfRWRnZV9EZXRhaWwuanMiLCJhc3NldHMvU2NyaXB0L0VtYm9zcy5qcyIsImFzc2V0cy9TY3JpcHQvR2xhc3MuanMiLCJhc3NldHMvU2NyaXB0L0dyYXkuanMiLCJhc3NldHMvU2NyaXB0L05lZ2F0aXZlX0JsYWNrX1doaXRlLmpzIiwiYXNzZXRzL1NjcmlwdC9OZWdhdGl2ZV9JbWFnZS5qcyIsImFzc2V0cy9TY3JpcHQvU2hhZG93X0JsYWNrX1doaXRlLmpzIiwiYXNzZXRzL1NjcmlwdC9XYXZlX0guanMiLCJhc3NldHMvU2NyaXB0L1dhdmVfVkguanMiLCJhc3NldHMvU2NyaXB0L1dhdmVfVi5qcyIsImFzc2V0cy9TaGFkZXJzL2NjU2hhZGVyX0F2Z19CbGFja19XaGl0ZV9GcmFnLmpzIiwiYXNzZXRzL1NoYWRlcnMvY2NTaGFkZXJfQmx1cl9FZGdlX0RldGFpbF9GcmFnLmpzIiwiYXNzZXRzL1NoYWRlcnMvY2NTaGFkZXJfRGVmYXVsdF9WZXJ0LmpzIiwiYXNzZXRzL1NoYWRlcnMvY2NTaGFkZXJfRW1ib3NzX0ZyYWcuanMiLCJhc3NldHMvU2hhZGVycy9jY1NoYWRlcl9HbGFzc19GcmFnLmpzIiwiYXNzZXRzL1NoYWRlcnMvY2NTaGFkZXJfR3JheV9GcmFnLmpzIiwiYXNzZXRzL1NoYWRlcnMvY2NTaGFkZXJfTmVnYXRpdmVfQmxhY2tfV2hpdGVfRnJhZy5qcyIsImFzc2V0cy9TaGFkZXJzL2NjU2hhZGVyX05lZ2F0aXZlX0ltYWdlX0ZyYWcuanMiLCJhc3NldHMvU2hhZGVycy9jY1NoYWRlcl9TaGFkb3dfQmxhY2tfV2hpdGVfRnJhZy5qcyIsImFzc2V0cy9TaGFkZXJzL2NjU2hhZGVyX1dhdmVfSF9GcmFnLmpzIiwiYXNzZXRzL1NoYWRlcnMvY2NTaGFkZXJfV2F2ZV9WSF9GcmFnLmpzIiwiYXNzZXRzL1NoYWRlcnMvY2NTaGFkZXJfV2F2ZV9WX0ZyYWcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJjYy5fUkZwdXNoKG1vZHVsZSwgJzQxNDQ1OFNUcGhMRjc1K2FGbVlGemZoJywgJ0F2Z19CbGFja19XaGl0ZScpO1xuLy8gU2NyaXB0L0F2Z19CbGFja19XaGl0ZS5qc1xuXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIF9kZWZhdWx0X3ZlcnQgPSByZXF1aXJlKFwiLi4vU2hhZGVycy9jY1NoYWRlcl9EZWZhdWx0X1ZlcnQuanNcIik7XG52YXIgX2JsYWNrX3doaXRlX2ZyYWcgPSByZXF1aXJlKFwiLi4vU2hhZGVycy9jY1NoYWRlcl9BdmdfQmxhY2tfV2hpdGVfRnJhZy5qc1wiKTtcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7fSxcblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLl91c2UoKTtcbiAgICB9LFxuXG4gICAgX3VzZTogZnVuY3Rpb24gX3VzZSgpIHtcbiAgICAgICAgdGhpcy5fcHJvZ3JhbSA9IG5ldyBjYy5HTFByb2dyYW0oKTtcbiAgICAgICAgdGhpcy5fcHJvZ3JhbS5pbml0V2l0aFZlcnRleFNoYWRlckJ5dGVBcnJheShfZGVmYXVsdF92ZXJ0LCBfYmxhY2tfd2hpdGVfZnJhZyk7XG5cbiAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MuQVRUUklCVVRFX05BTUVfUE9TSVRJT04sIGNjLlZFUlRFWF9BVFRSSUJfUE9TSVRJT04pO1xuICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5BVFRSSUJVVEVfTkFNRV9DT0xPUiwgY2MuVkVSVEVYX0FUVFJJQl9DT0xPUik7XG4gICAgICAgIHRoaXMuX3Byb2dyYW0uYWRkQXR0cmlidXRlKGNjLkFUVFJJQlVURV9OQU1FX1RFWF9DT09SRCwgY2MuVkVSVEVYX0FUVFJJQl9URVhfQ09PUkRTKTtcbiAgICAgICAgdGhpcy5fcHJvZ3JhbS5saW5rKCk7XG4gICAgICAgIHRoaXMuX3Byb2dyYW0udXBkYXRlVW5pZm9ybXMoKTtcblxuICAgICAgICBjYy5zZXRQcm9ncmFtKHRoaXMubm9kZS5fc2dOb2RlLCB0aGlzLl9wcm9ncmFtKTtcbiAgICB9XG5cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJjYy5fUkZwdXNoKG1vZHVsZSwgJ2RkMGNmVVpOdDFCTXFjaWNtY0lpZVdzJywgJ0JsdXJfRWRnZV9EZXRhaWwnKTtcbi8vIFNjcmlwdC9CbHVyX0VkZ2VfRGV0YWlsLmpzXG5cblwidXNlIHN0cmljdFwiO1xuXG52YXIgX2RlZmF1bHRfdmVydCA9IHJlcXVpcmUoXCIuLi9TaGFkZXJzL2NjU2hhZGVyX0RlZmF1bHRfVmVydC5qc1wiKTtcbnZhciBfYmx1cl9lZGdlX2RldGFpbF9mcmFnID0gcmVxdWlyZShcIi4uL1NoYWRlcnMvY2NTaGFkZXJfQmx1cl9FZGdlX0RldGFpbF9GcmFnLmpzXCIpO1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHt9LFxuXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHRoaXMuX3VzZSgpO1xuICAgIH0sXG5cbiAgICBfdXNlOiBmdW5jdGlvbiBfdXNlKCkge1xuICAgICAgICB0aGlzLl9wcm9ncmFtID0gbmV3IGNjLkdMUHJvZ3JhbSgpO1xuICAgICAgICB0aGlzLl9wcm9ncmFtLmluaXRXaXRoVmVydGV4U2hhZGVyQnl0ZUFycmF5KF9kZWZhdWx0X3ZlcnQsIF9ibHVyX2VkZ2VfZGV0YWlsX2ZyYWcpO1xuXG4gICAgICAgIHRoaXMuX3Byb2dyYW0uYWRkQXR0cmlidXRlKGNjLkFUVFJJQlVURV9OQU1FX1BPU0lUSU9OLCBjYy5WRVJURVhfQVRUUklCX1BPU0lUSU9OKTtcbiAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MuQVRUUklCVVRFX05BTUVfQ09MT1IsIGNjLlZFUlRFWF9BVFRSSUJfQ09MT1IpO1xuICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5BVFRSSUJVVEVfTkFNRV9URVhfQ09PUkQsIGNjLlZFUlRFWF9BVFRSSUJfVEVYX0NPT1JEUyk7XG4gICAgICAgIHRoaXMuX3Byb2dyYW0ubGluaygpO1xuICAgICAgICB0aGlzLl9wcm9ncmFtLnVwZGF0ZVVuaWZvcm1zKCk7XG5cbiAgICAgICAgdGhpcy5fdW5pV2lkdGhTdGVwID0gdGhpcy5fcHJvZ3JhbS5nZXRVbmlmb3JtTG9jYXRpb25Gb3JOYW1lKFwid2lkdGhTdGVwXCIpO1xuICAgICAgICB0aGlzLl91bmlIZWlnaHRTdGVwID0gdGhpcy5fcHJvZ3JhbS5nZXRVbmlmb3JtTG9jYXRpb25Gb3JOYW1lKFwiaGVpZ2h0U3RlcFwiKTtcbiAgICAgICAgdGhpcy5fdW5pU3RyZW5ndGggPSB0aGlzLl9wcm9ncmFtLmdldFVuaWZvcm1Mb2NhdGlvbkZvck5hbWUoXCJzdHJlbmd0aFwiKTtcblxuICAgICAgICB0aGlzLl9wcm9ncmFtLnNldFVuaWZvcm1Mb2NhdGlvbldpdGgxZih0aGlzLl91bmlXaWR0aFN0ZXAsIDEuMCAvIHRoaXMubm9kZS5nZXRDb250ZW50U2l6ZSgpLndpZHRoKTtcbiAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMWYodGhpcy5fdW5pSGVpZ2h0U3RlcCwgMS4wIC8gdGhpcy5ub2RlLmdldENvbnRlbnRTaXplKCkuaGVpZ2h0KTtcblxuICAgICAgICAvKiDmqKHns4ogMC41ICAgICAqL1xuICAgICAgICAvKiDmqKHns4ogMS4wICAgICAqL1xuICAgICAgICAvKiDnu4boioIgLTIuMCAgICAqL1xuICAgICAgICAvKiDnu4boioIgLTUuMCAgICAqL1xuICAgICAgICAvKiDnu4boioIgLTEwLjAgICAqL1xuICAgICAgICAvKiDovrnnvJggMi4wICAgICAqL1xuICAgICAgICAvKiDovrnnvJggNS4wICAgICAqL1xuICAgICAgICAvKiDovrnnvJggMTAuMCAgICAqL1xuICAgICAgICB0aGlzLl9wcm9ncmFtLnNldFVuaWZvcm1Mb2NhdGlvbldpdGgxZih0aGlzLl91bmlTdHJlbmd0aCwgMi4wKTtcblxuICAgICAgICBjYy5zZXRQcm9ncmFtKHRoaXMubm9kZS5fc2dOb2RlLCB0aGlzLl9wcm9ncmFtKTtcbiAgICB9XG5cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJjYy5fUkZwdXNoKG1vZHVsZSwgJzk2ODgwTWowY2REQjRYUjdCV0VTbm4xJywgJ0VtYm9zcycpO1xuLy8gU2NyaXB0L0VtYm9zcy5qc1xuXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIF9kZWZhdWx0X3ZlcnQgPSByZXF1aXJlKFwiLi4vU2hhZGVycy9jY1NoYWRlcl9EZWZhdWx0X1ZlcnQuanNcIik7XG52YXIgX2VtYm9zc19mcmFnID0gcmVxdWlyZShcIi4uL1NoYWRlcnMvY2NTaGFkZXJfRW1ib3NzX0ZyYWcuanNcIik7XG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge30sXG5cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5fdXNlKCk7XG4gICAgfSxcblxuICAgIF91c2U6IGZ1bmN0aW9uIF91c2UoKSB7XG4gICAgICAgIHRoaXMuX3Byb2dyYW0gPSBuZXcgY2MuR0xQcm9ncmFtKCk7XG4gICAgICAgIHRoaXMuX3Byb2dyYW0uaW5pdFdpdGhWZXJ0ZXhTaGFkZXJCeXRlQXJyYXkoX2RlZmF1bHRfdmVydCwgX2VtYm9zc19mcmFnKTtcblxuICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5BVFRSSUJVVEVfTkFNRV9QT1NJVElPTiwgY2MuVkVSVEVYX0FUVFJJQl9QT1NJVElPTik7XG4gICAgICAgIHRoaXMuX3Byb2dyYW0uYWRkQXR0cmlidXRlKGNjLkFUVFJJQlVURV9OQU1FX0NPTE9SLCBjYy5WRVJURVhfQVRUUklCX0NPTE9SKTtcbiAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MuQVRUUklCVVRFX05BTUVfVEVYX0NPT1JELCBjYy5WRVJURVhfQVRUUklCX1RFWF9DT09SRFMpO1xuICAgICAgICB0aGlzLl9wcm9ncmFtLmxpbmsoKTtcbiAgICAgICAgdGhpcy5fcHJvZ3JhbS51cGRhdGVVbmlmb3JtcygpO1xuXG4gICAgICAgIHRoaXMuX3VuaVdpZHRoU3RlcCA9IHRoaXMuX3Byb2dyYW0uZ2V0VW5pZm9ybUxvY2F0aW9uRm9yTmFtZShcIndpZHRoU3RlcFwiKTtcbiAgICAgICAgdGhpcy5fdW5pSGVpZ2h0U3RlcCA9IHRoaXMuX3Byb2dyYW0uZ2V0VW5pZm9ybUxvY2F0aW9uRm9yTmFtZShcImhlaWdodFN0ZXBcIik7XG5cbiAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMWYodGhpcy5fdW5pV2lkdGhTdGVwLCAxLjAgLyB0aGlzLm5vZGUuZ2V0Q29udGVudFNpemUoKS53aWR0aCk7XG4gICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDFmKHRoaXMuX3VuaUhlaWdodFN0ZXAsIDEuMCAvIHRoaXMubm9kZS5nZXRDb250ZW50U2l6ZSgpLmhlaWdodCk7XG5cbiAgICAgICAgY2Muc2V0UHJvZ3JhbSh0aGlzLm5vZGUuX3NnTm9kZSwgdGhpcy5fcHJvZ3JhbSk7XG4gICAgfVxuXG59KTtcblxuY2MuX1JGcG9wKCk7IiwiY2MuX1JGcHVzaChtb2R1bGUsICc0YjJiOTNkdjJ0TVBZTzU0TVRDSFRmcCcsICdHbGFzcycpO1xuLy8gU2NyaXB0L0dsYXNzLmpzXG5cblwidXNlIHN0cmljdFwiO1xuXG52YXIgX2RlZmF1bHRfdmVydCA9IHJlcXVpcmUoXCIuLi9TaGFkZXJzL2NjU2hhZGVyX0RlZmF1bHRfVmVydC5qc1wiKTtcbnZhciBfZ2xhc3NfZnJhZyA9IHJlcXVpcmUoXCIuLi9TaGFkZXJzL2NjU2hhZGVyX0dsYXNzX0ZyYWcuanNcIik7XG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge30sXG5cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5fdXNlKCk7XG4gICAgfSxcblxuICAgIF91c2U6IGZ1bmN0aW9uIF91c2UoKSB7XG4gICAgICAgIHRoaXMuX3Byb2dyYW0gPSBuZXcgY2MuR0xQcm9ncmFtKCk7XG4gICAgICAgIHRoaXMuX3Byb2dyYW0uaW5pdFdpdGhWZXJ0ZXhTaGFkZXJCeXRlQXJyYXkoX2RlZmF1bHRfdmVydCwgX2dsYXNzX2ZyYWcpO1xuXG4gICAgICAgIHRoaXMuX3Byb2dyYW0uYWRkQXR0cmlidXRlKGNjLkFUVFJJQlVURV9OQU1FX1BPU0lUSU9OLCBjYy5WRVJURVhfQVRUUklCX1BPU0lUSU9OKTtcbiAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MuQVRUUklCVVRFX05BTUVfQ09MT1IsIGNjLlZFUlRFWF9BVFRSSUJfQ09MT1IpO1xuICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5BVFRSSUJVVEVfTkFNRV9URVhfQ09PUkQsIGNjLlZFUlRFWF9BVFRSSUJfVEVYX0NPT1JEUyk7XG4gICAgICAgIHRoaXMuX3Byb2dyYW0ubGluaygpO1xuICAgICAgICB0aGlzLl9wcm9ncmFtLnVwZGF0ZVVuaWZvcm1zKCk7XG5cbiAgICAgICAgdGhpcy5fdW5pV2lkdGhTdGVwID0gdGhpcy5fcHJvZ3JhbS5nZXRVbmlmb3JtTG9jYXRpb25Gb3JOYW1lKFwid2lkdGhTdGVwXCIpO1xuICAgICAgICB0aGlzLl91bmlIZWlnaHRTdGVwID0gdGhpcy5fcHJvZ3JhbS5nZXRVbmlmb3JtTG9jYXRpb25Gb3JOYW1lKFwiaGVpZ2h0U3RlcFwiKTtcbiAgICAgICAgdGhpcy5fdW5pQmx1clJhZGl1c1NjYWxlID0gdGhpcy5fcHJvZ3JhbS5nZXRVbmlmb3JtTG9jYXRpb25Gb3JOYW1lKFwiYmx1clJhZGl1c1NjYWxlXCIpO1xuXG4gICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDFmKHRoaXMuX3VuaVdpZHRoU3RlcCwgMS4wIC8gdGhpcy5ub2RlLmdldENvbnRlbnRTaXplKCkud2lkdGgpO1xuICAgICAgICB0aGlzLl9wcm9ncmFtLnNldFVuaWZvcm1Mb2NhdGlvbldpdGgxZih0aGlzLl91bmlIZWlnaHRTdGVwLCAxLjAgLyB0aGlzLm5vZGUuZ2V0Q29udGVudFNpemUoKS5oZWlnaHQpO1xuXG4gICAgICAgIC8qIOejqOeggueOu+eSgyAxLjAgKi9cbiAgICAgICAgLyog56Oo56CC546755KDIDMuMCAqL1xuICAgICAgICAvKiDno6jnoILnjrvnkoMgNi4wICovXG4gICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDFmKHRoaXMuX3VuaUJsdXJSYWRpdXNTY2FsZSwgNi4wKTtcblxuICAgICAgICBjYy5zZXRQcm9ncmFtKHRoaXMubm9kZS5fc2dOb2RlLCB0aGlzLl9wcm9ncmFtKTtcbiAgICB9XG5cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJjYy5fUkZwdXNoKG1vZHVsZSwgJ2JlYjZkdWxvenRGVzdHTXg2ZDlnSXlhJywgJ0dyYXknKTtcbi8vIFNjcmlwdC9HcmF5LmpzXG5cblwidXNlIHN0cmljdFwiO1xuXG52YXIgX2RlZmF1bHRfdmVydCA9IHJlcXVpcmUoXCIuLi9TaGFkZXJzL2NjU2hhZGVyX0RlZmF1bHRfVmVydC5qc1wiKTtcbnZhciBfZ3JheV9mcmFnID0gcmVxdWlyZShcIi4uL1NoYWRlcnMvY2NTaGFkZXJfR3JheV9GcmFnLmpzXCIpO1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHt9LFxuXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHRoaXMuX3VzZSgpO1xuICAgIH0sXG5cbiAgICBfdXNlOiBmdW5jdGlvbiBfdXNlKCkge1xuICAgICAgICB0aGlzLl9wcm9ncmFtID0gbmV3IGNjLkdMUHJvZ3JhbSgpO1xuICAgICAgICB0aGlzLl9wcm9ncmFtLmluaXRXaXRoVmVydGV4U2hhZGVyQnl0ZUFycmF5KF9kZWZhdWx0X3ZlcnQsIF9ncmF5X2ZyYWcpO1xuXG4gICAgICAgIHRoaXMuX3Byb2dyYW0uYWRkQXR0cmlidXRlKGNjLkFUVFJJQlVURV9OQU1FX1BPU0lUSU9OLCBjYy5WRVJURVhfQVRUUklCX1BPU0lUSU9OKTtcbiAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MuQVRUUklCVVRFX05BTUVfQ09MT1IsIGNjLlZFUlRFWF9BVFRSSUJfQ09MT1IpO1xuICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5BVFRSSUJVVEVfTkFNRV9URVhfQ09PUkQsIGNjLlZFUlRFWF9BVFRSSUJfVEVYX0NPT1JEUyk7XG4gICAgICAgIHRoaXMuX3Byb2dyYW0ubGluaygpO1xuICAgICAgICB0aGlzLl9wcm9ncmFtLnVwZGF0ZVVuaWZvcm1zKCk7XG5cbiAgICAgICAgY2Muc2V0UHJvZ3JhbSh0aGlzLm5vZGUuX3NnTm9kZSwgdGhpcy5fcHJvZ3JhbSk7XG4gICAgfVxuXG59KTtcblxuY2MuX1JGcG9wKCk7IiwiY2MuX1JGcHVzaChtb2R1bGUsICc1ODk4YjkrTnoxTXRiOWhwcUdmajFNTCcsICdOZWdhdGl2ZV9CbGFja19XaGl0ZScpO1xuLy8gU2NyaXB0L05lZ2F0aXZlX0JsYWNrX1doaXRlLmpzXG5cblwidXNlIHN0cmljdFwiO1xuXG52YXIgX2RlZmF1bHRfdmVydCA9IHJlcXVpcmUoXCIuLi9TaGFkZXJzL2NjU2hhZGVyX0RlZmF1bHRfVmVydC5qc1wiKTtcbnZhciBfbmVnYXRpdmVfYmxhY2tfd2hpdGVfZnJhZyA9IHJlcXVpcmUoXCIuLi9TaGFkZXJzL2NjU2hhZGVyX05lZ2F0aXZlX0JsYWNrX1doaXRlX0ZyYWcuanNcIik7XG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge30sXG5cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5fdXNlKCk7XG4gICAgfSxcblxuICAgIF91c2U6IGZ1bmN0aW9uIF91c2UoKSB7XG4gICAgICAgIHRoaXMuX3Byb2dyYW0gPSBuZXcgY2MuR0xQcm9ncmFtKCk7XG4gICAgICAgIHRoaXMuX3Byb2dyYW0uaW5pdFdpdGhWZXJ0ZXhTaGFkZXJCeXRlQXJyYXkoX2RlZmF1bHRfdmVydCwgX25lZ2F0aXZlX2JsYWNrX3doaXRlX2ZyYWcpO1xuXG4gICAgICAgIHRoaXMuX3Byb2dyYW0uYWRkQXR0cmlidXRlKGNjLkFUVFJJQlVURV9OQU1FX1BPU0lUSU9OLCBjYy5WRVJURVhfQVRUUklCX1BPU0lUSU9OKTtcbiAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MuQVRUUklCVVRFX05BTUVfQ09MT1IsIGNjLlZFUlRFWF9BVFRSSUJfQ09MT1IpO1xuICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5BVFRSSUJVVEVfTkFNRV9URVhfQ09PUkQsIGNjLlZFUlRFWF9BVFRSSUJfVEVYX0NPT1JEUyk7XG4gICAgICAgIHRoaXMuX3Byb2dyYW0ubGluaygpO1xuICAgICAgICB0aGlzLl9wcm9ncmFtLnVwZGF0ZVVuaWZvcm1zKCk7XG5cbiAgICAgICAgY2Muc2V0UHJvZ3JhbSh0aGlzLm5vZGUuX3NnTm9kZSwgdGhpcy5fcHJvZ3JhbSk7XG4gICAgfVxuXG59KTtcblxuY2MuX1JGcG9wKCk7IiwiY2MuX1JGcHVzaChtb2R1bGUsICcxMjIzYldJV2hGUGFyUFI3amcwdkhhbicsICdOZWdhdGl2ZV9JbWFnZScpO1xuLy8gU2NyaXB0L05lZ2F0aXZlX0ltYWdlLmpzXG5cblwidXNlIHN0cmljdFwiO1xuXG52YXIgX2RlZmF1bHRfdmVydCA9IHJlcXVpcmUoXCIuLi9TaGFkZXJzL2NjU2hhZGVyX0RlZmF1bHRfVmVydC5qc1wiKTtcbnZhciBfbmVnYXRpdmVfaW1hZ2VfZnJhZyA9IHJlcXVpcmUoXCIuLi9TaGFkZXJzL2NjU2hhZGVyX05lZ2F0aXZlX0ltYWdlX0ZyYWcuanNcIik7XG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge30sXG5cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5fdXNlKCk7XG4gICAgfSxcblxuICAgIF91c2U6IGZ1bmN0aW9uIF91c2UoKSB7XG4gICAgICAgIHRoaXMuX3Byb2dyYW0gPSBuZXcgY2MuR0xQcm9ncmFtKCk7XG4gICAgICAgIHRoaXMuX3Byb2dyYW0uaW5pdFdpdGhWZXJ0ZXhTaGFkZXJCeXRlQXJyYXkoX2RlZmF1bHRfdmVydCwgX25lZ2F0aXZlX2ltYWdlX2ZyYWcpO1xuXG4gICAgICAgIHRoaXMuX3Byb2dyYW0uYWRkQXR0cmlidXRlKGNjLkFUVFJJQlVURV9OQU1FX1BPU0lUSU9OLCBjYy5WRVJURVhfQVRUUklCX1BPU0lUSU9OKTtcbiAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MuQVRUUklCVVRFX05BTUVfQ09MT1IsIGNjLlZFUlRFWF9BVFRSSUJfQ09MT1IpO1xuICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5BVFRSSUJVVEVfTkFNRV9URVhfQ09PUkQsIGNjLlZFUlRFWF9BVFRSSUJfVEVYX0NPT1JEUyk7XG4gICAgICAgIHRoaXMuX3Byb2dyYW0ubGluaygpO1xuICAgICAgICB0aGlzLl9wcm9ncmFtLnVwZGF0ZVVuaWZvcm1zKCk7XG5cbiAgICAgICAgY2Muc2V0UHJvZ3JhbSh0aGlzLm5vZGUuX3NnTm9kZSwgdGhpcy5fcHJvZ3JhbSk7XG4gICAgfVxuXG59KTtcblxuY2MuX1JGcG9wKCk7IiwiY2MuX1JGcHVzaChtb2R1bGUsICc3YjE1Y0ZTY2hWSGphRDNKcHo0dGphaicsICdTaGFkb3dfQmxhY2tfV2hpdGUnKTtcbi8vIFNjcmlwdC9TaGFkb3dfQmxhY2tfV2hpdGUuanNcblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBfZGVmYXVsdF92ZXJ0ID0gcmVxdWlyZShcIi4uL1NoYWRlcnMvY2NTaGFkZXJfRGVmYXVsdF9WZXJ0LmpzXCIpO1xudmFyIF9zaGFkb3dfYmxhY2tfd2hpdGVfZnJhZyA9IHJlcXVpcmUoXCIuLi9TaGFkZXJzL2NjU2hhZGVyX1NoYWRvd19CbGFja19XaGl0ZV9GcmFnLmpzXCIpO1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHt9LFxuXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHRoaXMuX3N0cmVuZ3RoID0gMC4wMDE7XG4gICAgICAgIHRoaXMuX21vdGlvbiA9IDA7XG5cbiAgICAgICAgdGhpcy5fdXNlKCk7XG4gICAgfSxcblxuICAgIF91c2U6IGZ1bmN0aW9uIF91c2UoKSB7XG4gICAgICAgIHRoaXMuX3Byb2dyYW0gPSBuZXcgY2MuR0xQcm9ncmFtKCk7XG4gICAgICAgIHRoaXMuX3Byb2dyYW0uaW5pdFdpdGhWZXJ0ZXhTaGFkZXJCeXRlQXJyYXkoX2RlZmF1bHRfdmVydCwgX3NoYWRvd19ibGFja193aGl0ZV9mcmFnKTtcblxuICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5BVFRSSUJVVEVfTkFNRV9QT1NJVElPTiwgY2MuVkVSVEVYX0FUVFJJQl9QT1NJVElPTik7XG4gICAgICAgIHRoaXMuX3Byb2dyYW0uYWRkQXR0cmlidXRlKGNjLkFUVFJJQlVURV9OQU1FX0NPTE9SLCBjYy5WRVJURVhfQVRUUklCX0NPTE9SKTtcbiAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MuQVRUUklCVVRFX05BTUVfVEVYX0NPT1JELCBjYy5WRVJURVhfQVRUUklCX1RFWF9DT09SRFMpO1xuICAgICAgICB0aGlzLl9wcm9ncmFtLmxpbmsoKTtcbiAgICAgICAgdGhpcy5fcHJvZ3JhbS51cGRhdGVVbmlmb3JtcygpO1xuXG4gICAgICAgIHRoaXMuX3VuaVN0cmVuZ3RoID0gdGhpcy5fcHJvZ3JhbS5nZXRVbmlmb3JtTG9jYXRpb25Gb3JOYW1lKFwic3RyZW5ndGhcIik7XG5cbiAgICAgICAgY2Muc2V0UHJvZ3JhbSh0aGlzLm5vZGUuX3NnTm9kZSwgdGhpcy5fcHJvZ3JhbSk7XG4gICAgfSxcblxuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKGR0KSB7XG4gICAgICAgIGlmICh0aGlzLl9wcm9ncmFtKSB7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnNldFVuaWZvcm1Mb2NhdGlvbldpdGgxZih0aGlzLl91bmlTdHJlbmd0aCwgdGhpcy5fbW90aW9uICs9IHRoaXMuX3N0cmVuZ3RoKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0udXBkYXRlVW5pZm9ybXMoKTtcbiAgICAgICAgICAgIGlmICgxLjAgPCB0aGlzLl9tb3Rpb24gfHwgMC4wID4gdGhpcy5fbW90aW9uKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc3RyZW5ndGggKj0gLTE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiY2MuX1JGcHVzaChtb2R1bGUsICdiZGYxOXkycGMxUFZvcXhiMHNic1l2YicsICdXYXZlX0gnKTtcbi8vIFNjcmlwdC9XYXZlX0guanNcblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBfZGVmYXVsdF92ZXJ0ID0gcmVxdWlyZShcIi4uL1NoYWRlcnMvY2NTaGFkZXJfRGVmYXVsdF9WZXJ0LmpzXCIpO1xudmFyIF93YXZlX2hfZnJhZyA9IHJlcXVpcmUoXCIuLi9TaGFkZXJzL2NjU2hhZGVyX1dhdmVfSF9GcmFnLmpzXCIpO1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHt9LFxuXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHRoaXMuX2FuZ2xlID0gMTU7XG4gICAgICAgIHRoaXMuX21vdGlvbiA9IDA7XG5cbiAgICAgICAgdGhpcy5fdXNlKCk7XG4gICAgfSxcblxuICAgIF91c2U6IGZ1bmN0aW9uIF91c2UoKSB7XG4gICAgICAgIHRoaXMuX3Byb2dyYW0gPSBuZXcgY2MuR0xQcm9ncmFtKCk7XG4gICAgICAgIHRoaXMuX3Byb2dyYW0uaW5pdFdpdGhWZXJ0ZXhTaGFkZXJCeXRlQXJyYXkoX2RlZmF1bHRfdmVydCwgX3dhdmVfaF9mcmFnKTtcblxuICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5BVFRSSUJVVEVfTkFNRV9QT1NJVElPTiwgY2MuVkVSVEVYX0FUVFJJQl9QT1NJVElPTik7XG4gICAgICAgIHRoaXMuX3Byb2dyYW0uYWRkQXR0cmlidXRlKGNjLkFUVFJJQlVURV9OQU1FX0NPTE9SLCBjYy5WRVJURVhfQVRUUklCX0NPTE9SKTtcbiAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MuQVRUUklCVVRFX05BTUVfVEVYX0NPT1JELCBjYy5WRVJURVhfQVRUUklCX1RFWF9DT09SRFMpO1xuICAgICAgICB0aGlzLl9wcm9ncmFtLmxpbmsoKTtcbiAgICAgICAgdGhpcy5fcHJvZ3JhbS51cGRhdGVVbmlmb3JtcygpO1xuXG4gICAgICAgIHRoaXMuX3VuaU1vdGlvbiA9IHRoaXMuX3Byb2dyYW0uZ2V0VW5pZm9ybUxvY2F0aW9uRm9yTmFtZShcIm1vdGlvblwiKTtcbiAgICAgICAgdGhpcy5fdW5pQW5nbGUgPSB0aGlzLl9wcm9ncmFtLmdldFVuaWZvcm1Mb2NhdGlvbkZvck5hbWUoXCJhbmdsZVwiKTtcblxuICAgICAgICB0aGlzLl9wcm9ncmFtLnNldFVuaWZvcm1Mb2NhdGlvbldpdGgxZih0aGlzLl91bmlBbmdsZSwgdGhpcy5fYW5nbGUpO1xuXG4gICAgICAgIGNjLnNldFByb2dyYW0odGhpcy5ub2RlLl9zZ05vZGUsIHRoaXMuX3Byb2dyYW0pO1xuICAgIH0sXG5cbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShkdCkge1xuICAgICAgICBpZiAodGhpcy5fcHJvZ3JhbSkge1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMWYodGhpcy5fdW5pTW90aW9uLCB0aGlzLl9tb3Rpb24gKz0gMC4wNSk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnVwZGF0ZVVuaWZvcm1zKCk7XG4gICAgICAgICAgICBpZiAoMS4wZTIwIDwgdGhpcy5fbW90aW9uKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbW90aW9uID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJjYy5fUkZwdXNoKG1vZHVsZSwgJ2I5OTFjQmRnQUZGNDdUdmtEaXNrV0xzJywgJ1dhdmVfVkgnKTtcbi8vIFNjcmlwdC9XYXZlX1ZILmpzXG5cblwidXNlIHN0cmljdFwiO1xuXG52YXIgX2RlZmF1bHRfdmVydCA9IHJlcXVpcmUoXCIuLi9TaGFkZXJzL2NjU2hhZGVyX0RlZmF1bHRfVmVydC5qc1wiKTtcbnZhciBfd2F2ZV92aF9mcmFnID0gcmVxdWlyZShcIi4uL1NoYWRlcnMvY2NTaGFkZXJfV2F2ZV9WSF9GcmFnLmpzXCIpO1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHt9LFxuXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHRoaXMuX2FuZ2xlID0gMTU7XG4gICAgICAgIHRoaXMuX21vdGlvbiA9IDA7XG5cbiAgICAgICAgdGhpcy5fdXNlKCk7XG4gICAgfSxcblxuICAgIF91c2U6IGZ1bmN0aW9uIF91c2UoKSB7XG4gICAgICAgIHRoaXMuX3Byb2dyYW0gPSBuZXcgY2MuR0xQcm9ncmFtKCk7XG4gICAgICAgIHRoaXMuX3Byb2dyYW0uaW5pdFdpdGhWZXJ0ZXhTaGFkZXJCeXRlQXJyYXkoX2RlZmF1bHRfdmVydCwgX3dhdmVfdmhfZnJhZyk7XG5cbiAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MuQVRUUklCVVRFX05BTUVfUE9TSVRJT04sIGNjLlZFUlRFWF9BVFRSSUJfUE9TSVRJT04pO1xuICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5BVFRSSUJVVEVfTkFNRV9DT0xPUiwgY2MuVkVSVEVYX0FUVFJJQl9DT0xPUik7XG4gICAgICAgIHRoaXMuX3Byb2dyYW0uYWRkQXR0cmlidXRlKGNjLkFUVFJJQlVURV9OQU1FX1RFWF9DT09SRCwgY2MuVkVSVEVYX0FUVFJJQl9URVhfQ09PUkRTKTtcbiAgICAgICAgdGhpcy5fcHJvZ3JhbS5saW5rKCk7XG4gICAgICAgIHRoaXMuX3Byb2dyYW0udXBkYXRlVW5pZm9ybXMoKTtcblxuICAgICAgICB0aGlzLl91bmlNb3Rpb24gPSB0aGlzLl9wcm9ncmFtLmdldFVuaWZvcm1Mb2NhdGlvbkZvck5hbWUoXCJtb3Rpb25cIik7XG4gICAgICAgIHRoaXMuX3VuaUFuZ2xlID0gdGhpcy5fcHJvZ3JhbS5nZXRVbmlmb3JtTG9jYXRpb25Gb3JOYW1lKFwiYW5nbGVcIik7XG5cbiAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMWYodGhpcy5fdW5pQW5nbGUsIHRoaXMuX2FuZ2xlKTtcblxuICAgICAgICBjYy5zZXRQcm9ncmFtKHRoaXMubm9kZS5fc2dOb2RlLCB0aGlzLl9wcm9ncmFtKTtcbiAgICB9LFxuXG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoZHQpIHtcbiAgICAgICAgaWYgKHRoaXMuX3Byb2dyYW0pIHtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0uc2V0VW5pZm9ybUxvY2F0aW9uV2l0aDFmKHRoaXMuX3VuaU1vdGlvbiwgdGhpcy5fbW90aW9uICs9IDAuMDUpO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS51cGRhdGVVbmlmb3JtcygpO1xuICAgICAgICAgICAgaWYgKDEuMGUyMCA8IHRoaXMuX21vdGlvbikge1xuICAgICAgICAgICAgICAgIHRoaXMuX21vdGlvbiA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiY2MuX1JGcHVzaChtb2R1bGUsICc2M2E4Y0RWaThSTmM3OHJKRDEyNmtzOScsICdXYXZlX1YnKTtcbi8vIFNjcmlwdC9XYXZlX1YuanNcblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBfZGVmYXVsdF92ZXJ0ID0gcmVxdWlyZShcIi4uL1NoYWRlcnMvY2NTaGFkZXJfRGVmYXVsdF9WZXJ0LmpzXCIpO1xudmFyIF93YXZlX3ZfZnJhZyA9IHJlcXVpcmUoXCIuLi9TaGFkZXJzL2NjU2hhZGVyX1dhdmVfVl9GcmFnLmpzXCIpO1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHt9LFxuXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHRoaXMuX2FuZ2xlID0gMTU7XG4gICAgICAgIHRoaXMuX21vdGlvbiA9IDA7XG5cbiAgICAgICAgdGhpcy5fdXNlKCk7XG4gICAgfSxcblxuICAgIF91c2U6IGZ1bmN0aW9uIF91c2UoKSB7XG4gICAgICAgIHRoaXMuX3Byb2dyYW0gPSBuZXcgY2MuR0xQcm9ncmFtKCk7XG4gICAgICAgIHRoaXMuX3Byb2dyYW0uaW5pdFdpdGhWZXJ0ZXhTaGFkZXJCeXRlQXJyYXkoX2RlZmF1bHRfdmVydCwgX3dhdmVfdl9mcmFnKTtcblxuICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5BVFRSSUJVVEVfTkFNRV9QT1NJVElPTiwgY2MuVkVSVEVYX0FUVFJJQl9QT1NJVElPTik7XG4gICAgICAgIHRoaXMuX3Byb2dyYW0uYWRkQXR0cmlidXRlKGNjLkFUVFJJQlVURV9OQU1FX0NPTE9SLCBjYy5WRVJURVhfQVRUUklCX0NPTE9SKTtcbiAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MuQVRUUklCVVRFX05BTUVfVEVYX0NPT1JELCBjYy5WRVJURVhfQVRUUklCX1RFWF9DT09SRFMpO1xuICAgICAgICB0aGlzLl9wcm9ncmFtLmxpbmsoKTtcbiAgICAgICAgdGhpcy5fcHJvZ3JhbS51cGRhdGVVbmlmb3JtcygpO1xuXG4gICAgICAgIHRoaXMuX3VuaU1vdGlvbiA9IHRoaXMuX3Byb2dyYW0uZ2V0VW5pZm9ybUxvY2F0aW9uRm9yTmFtZShcIm1vdGlvblwiKTtcbiAgICAgICAgdGhpcy5fdW5pQW5nbGUgPSB0aGlzLl9wcm9ncmFtLmdldFVuaWZvcm1Mb2NhdGlvbkZvck5hbWUoXCJhbmdsZVwiKTtcblxuICAgICAgICB0aGlzLl9wcm9ncmFtLnNldFVuaWZvcm1Mb2NhdGlvbldpdGgxZih0aGlzLl91bmlBbmdsZSwgdGhpcy5fYW5nbGUpO1xuXG4gICAgICAgIGNjLnNldFByb2dyYW0odGhpcy5ub2RlLl9zZ05vZGUsIHRoaXMuX3Byb2dyYW0pO1xuICAgIH0sXG5cbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShkdCkge1xuICAgICAgICBpZiAodGhpcy5fcHJvZ3JhbSkge1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMWYodGhpcy5fdW5pTW90aW9uLCB0aGlzLl9tb3Rpb24gKz0gMC4wNSk7XG4gICAgICAgICAgICB0aGlzLl9wcm9ncmFtLnVwZGF0ZVVuaWZvcm1zKCk7XG4gICAgICAgICAgICBpZiAoMS4wZTIwIDwgdGhpcy5fbW90aW9uKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbW90aW9uID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJjYy5fUkZwdXNoKG1vZHVsZSwgJzFhMmUwbGdmTFZKMloxSkNkY0ZBcjhYJywgJ2NjU2hhZGVyX0F2Z19CbGFja19XaGl0ZV9GcmFnJyk7XG4vLyBTaGFkZXJzL2NjU2hhZGVyX0F2Z19CbGFja19XaGl0ZV9GcmFnLmpzXG5cbi8qIOW5s+Wdh+WAvOm7keeZvSAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBcInByZWNpc2lvbiBtZWRpdW1wIGZsb2F0O1xcblwiICsgXCJ2YXJ5aW5nIHZlYzIgdl90ZXhDb29yZDtcXG5cIiArIFwidm9pZCBtYWluKClcXG5cIiArIFwie1xcblwiICsgXCIgICAgdmVjMyB2ID0gdGV4dHVyZTJEKENDX1RleHR1cmUwLCB2X3RleENvb3JkKS5yZ2I7XFxuXCIgKyBcIiAgICBmbG9hdCBmID0gKHYuciArIHYuZyArIHYuYikgLyAzLjA7XFxuXCIgKyBcIiAgICBnbF9GcmFnQ29sb3IgPSB2ZWM0KGYsIGYsIGYsIDEuMCk7XFxuXCIgKyBcIn1cXG5cIjtcblxuY2MuX1JGcG9wKCk7IiwiY2MuX1JGcHVzaChtb2R1bGUsICc4ZDhlZkh4RCtOSkRKRGhqclFsQkhKcycsICdjY1NoYWRlcl9CbHVyX0VkZ2VfRGV0YWlsX0ZyYWcnKTtcbi8vIFNoYWRlcnMvY2NTaGFkZXJfQmx1cl9FZGdlX0RldGFpbF9GcmFnLmpzXG5cbi8qIOaooeeziiAwLjUgICAgICovXG4vKiDmqKHns4ogMS4wICAgICAqL1xuLyog57uG6IqCIC0yLjAgICAgKi9cbi8qIOe7huiKgiAtNS4wICAgICovXG4vKiDnu4boioIgLTEwLjAgICAqL1xuLyog6L6557yYIDIuMCAgICAgKi9cbi8qIOi+uee8mCA1LjAgICAgICovXG4vKiDovrnnvJggMTAuMCAgICAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBcInByZWNpc2lvbiBtZWRpdW1wIGZsb2F0O1xcblwiICsgXCJ2YXJ5aW5nIHZlYzIgdl90ZXhDb29yZDtcXG5cIiArIFwidW5pZm9ybSBmbG9hdCB3aWR0aFN0ZXA7XFxuXCIgKyBcInVuaWZvcm0gZmxvYXQgaGVpZ2h0U3RlcDtcXG5cIiArIFwidW5pZm9ybSBmbG9hdCBzdHJlbmd0aDtcXG5cIiArIFwiY29uc3QgZmxvYXQgYmx1clJhZGl1cyA9IDIuMDtcXG5cIiArIFwiY29uc3QgZmxvYXQgYmx1clBpeGVscyA9IChibHVyUmFkaXVzICogMi4wICsgMS4wKSAqIChibHVyUmFkaXVzICogMi4wICsgMS4wKTtcXG5cIiArIFwidm9pZCBtYWluKClcXG5cIiArIFwie1xcblwiICsgXCIgICAgdmVjMyBzdW1Db2xvciA9IHZlYzMoMC4wLCAwLjAsIDAuMCk7XFxuXCIgKyBcIiAgICBmb3IoZmxvYXQgZnkgPSAtYmx1clJhZGl1czsgZnkgPD0gYmx1clJhZGl1czsgKytmeSlcXG5cIiArIFwiICAgIHtcXG5cIiArIFwiICAgICAgICBmb3IoZmxvYXQgZnggPSAtYmx1clJhZGl1czsgZnggPD0gYmx1clJhZGl1czsgKytmeClcXG5cIiArIFwiICAgICAgICB7XFxuXCIgKyBcIiAgICAgICAgICAgIHZlYzIgY29vcmQgPSB2ZWMyKGZ4ICogd2lkdGhTdGVwLCBmeSAqIGhlaWdodFN0ZXApO1xcblwiICsgXCIgICAgICAgICAgICBzdW1Db2xvciArPSB0ZXh0dXJlMkQoQ0NfVGV4dHVyZTAsIHZfdGV4Q29vcmQgKyBjb29yZCkucmdiO1xcblwiICsgXCIgICAgICAgIH1cXG5cIiArIFwiICAgIH1cXG5cIiArIFwiICAgIGdsX0ZyYWdDb2xvciA9IHZlYzQobWl4KHRleHR1cmUyRChDQ19UZXh0dXJlMCwgdl90ZXhDb29yZCkucmdiLCBzdW1Db2xvciAvIGJsdXJQaXhlbHMsIHN0cmVuZ3RoKSwgMS4wKTtcXG5cIiArIFwifVxcblwiO1xuXG5jYy5fUkZwb3AoKTsiLCJjYy5fUkZwdXNoKG1vZHVsZSwgJzQ0MGY1Vzd1dlZOQWFaeDRBTHpvWk44JywgJ2NjU2hhZGVyX0RlZmF1bHRfVmVydCcpO1xuLy8gU2hhZGVycy9jY1NoYWRlcl9EZWZhdWx0X1ZlcnQuanNcblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gXCJhdHRyaWJ1dGUgdmVjNCBhX3Bvc2l0aW9uO1xcblwiICsgXCIgYXR0cmlidXRlIHZlYzIgYV90ZXhDb29yZDtcXG5cIiArIFwiIGF0dHJpYnV0ZSB2ZWM0IGFfY29sb3I7XFxuXCIgKyBcIiB2YXJ5aW5nIHZlYzIgdl90ZXhDb29yZDtcXG5cIiArIFwiIHZhcnlpbmcgdmVjNCB2X2ZyYWdtZW50Q29sb3I7XFxuXCIgKyBcIiB2b2lkIG1haW4oKVxcblwiICsgXCIge1xcblwiICsgXCIgICAgIGdsX1Bvc2l0aW9uID0gKCBDQ19QTWF0cml4ICogQ0NfTVZNYXRyaXggKSAqIGFfcG9zaXRpb247XFxuXCIgKyBcIiAgICAgdl9mcmFnbWVudENvbG9yID0gYV9jb2xvcjtcXG5cIiArIFwiICAgICB2X3RleENvb3JkID0gYV90ZXhDb29yZDtcXG5cIiArIFwiIH0gXFxuXCI7XG5cbmNjLl9SRnBvcCgpOyIsImNjLl9SRnB1c2gobW9kdWxlLCAnYWM0NDJ0c1RSZEZZcElGcUdmSFd6Q1YnLCAnY2NTaGFkZXJfRW1ib3NzX0ZyYWcnKTtcbi8vIFNoYWRlcnMvY2NTaGFkZXJfRW1ib3NzX0ZyYWcuanNcblxuLyog5rWu6ZuVICovXG5cblwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFwicHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7XFxuXCIgKyBcInZhcnlpbmcgdmVjMiB2X3RleENvb3JkO1xcblwiICsgXCJ1bmlmb3JtIGZsb2F0IHdpZHRoU3RlcDtcXG5cIiArIFwidW5pZm9ybSBmbG9hdCBoZWlnaHRTdGVwO1xcblwiICsgXCJjb25zdCBmbG9hdCBzdHJpZGUgPSAyLjA7XFxuXCIgKyBcInZvaWQgbWFpbigpXFxuXCIgKyBcIntcXG5cIiArIFwiICAgIHZlYzMgdG1wQ29sb3IgPSB0ZXh0dXJlMkQoQ0NfVGV4dHVyZTAsIHZfdGV4Q29vcmQgKyB2ZWMyKHdpZHRoU3RlcCAqIHN0cmlkZSwgaGVpZ2h0U3RlcCAqIHN0cmlkZSkpLnJnYjtcXG5cIiArIFwiICAgIHRtcENvbG9yID0gdGV4dHVyZTJEKENDX1RleHR1cmUwLCB2X3RleENvb3JkKS5yZ2IgLSB0bXBDb2xvciArIDAuNTtcXG5cIiArIFwiICAgIGZsb2F0IGYgPSAodG1wQ29sb3IuciArIHRtcENvbG9yLmcgKyB0bXBDb2xvci5iKSAvIDMuMDtcXG5cIiArIFwiICAgIGdsX0ZyYWdDb2xvciA9IHZlYzQoZiwgZiwgZiwgMS4wKTtcXG5cIiArIFwifVxcblwiO1xuXG5jYy5fUkZwb3AoKTsiLCJjYy5fUkZwdXNoKG1vZHVsZSwgJ2QyMjRmem1TSWhQT28xNlhvVjF4cFlTJywgJ2NjU2hhZGVyX0dsYXNzX0ZyYWcnKTtcbi8vIFNoYWRlcnMvY2NTaGFkZXJfR2xhc3NfRnJhZy5qc1xuXG4vKiDno6jnoILnjrvnkoMgMS4wICovXG4vKiDno6jnoILnjrvnkoMgMy4wICovXG4vKiDno6jnoILnjrvnkoMgNi4wICovXG5cblwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFwicHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7XFxuXCIgKyBcInZhcnlpbmcgdmVjMiB2X3RleENvb3JkO1xcblwiICsgXCJ1bmlmb3JtIGZsb2F0IHdpZHRoU3RlcDtcXG5cIiArIFwidW5pZm9ybSBmbG9hdCBoZWlnaHRTdGVwO1xcblwiICsgXCJ1bmlmb3JtIGZsb2F0IGJsdXJSYWRpdXNTY2FsZTtcXG5cIiArIFwiY29uc3QgZmxvYXQgYmx1clJhZGl1cyA9IDYuMDtcXG5cIiArIFwiY29uc3QgZmxvYXQgYmx1clBpeGVscyA9IChibHVyUmFkaXVzICogMi4wICsgMS4wKSAqIChibHVyUmFkaXVzICogMi4wICsgMS4wKTtcXG5cIiArIFwiZmxvYXQgcmFuZG9tKHZlYzMgc2NhbGUsIGZsb2F0IHNlZWQpIHtcXG5cIiArIFwiICAgIHJldHVybiBmcmFjdChzaW4oZG90KGdsX0ZyYWdDb29yZC54eXogKyBzZWVkLCBzY2FsZSkpICogNDM3NTguNTQ1MyArIHNlZWQpO1xcblwiICsgXCJ9XFxuXCIgKyBcInZvaWQgbWFpbigpXFxuXCIgKyBcIntcXG5cIiArIFwiICAgIHZlYzMgc3VtQ29sb3IgPSB2ZWMzKDAuMCwgMC4wLCAwLjApO1xcblwiICsgXCIgICAgZm9yKGZsb2F0IGZ5ID0gLWJsdXJSYWRpdXM7IGZ5IDw9IGJsdXJSYWRpdXM7ICsrZnkpXFxuXCIgKyBcIiAgICB7XFxuXCIgKyBcIiAgICAgICAgZmxvYXQgZGlyID0gcmFuZG9tKHZlYzMoMTIuOTg5OCwgNzguMjMzLCAxNTEuNzE4MiksIDAuMCk7XFxuXCIgKyBcIiAgICAgICAgZm9yKGZsb2F0IGZ4ID0gLWJsdXJSYWRpdXM7IGZ4IDw9IGJsdXJSYWRpdXM7ICsrZngpXFxuXCIgKyBcIiAgICAgICAge1xcblwiICsgXCIgICAgICAgICAgICBmbG9hdCBkaXMgPSBkaXN0YW5jZSh2ZWMyKGZ4ICogd2lkdGhTdGVwLCBmeSAqIGhlaWdodFN0ZXApLCB2ZWMyKDAuMCwgMC4wKSkgKiBibHVyUmFkaXVzU2NhbGU7XFxuXCIgKyBcIiAgICAgICAgICAgIHZlYzIgY29vcmQgPSB2ZWMyKGRpcyAqIGNvcyhkaXIpLCBkaXMgKiBzaW4oZGlyKSk7XFxuXCIgKyBcIiAgICAgICAgICAgIHN1bUNvbG9yICs9IHRleHR1cmUyRChDQ19UZXh0dXJlMCwgdl90ZXhDb29yZCArIGNvb3JkKS5yZ2I7XFxuXCIgKyBcIiAgICAgICAgfVxcblwiICsgXCIgICAgfVxcblwiICsgXCIgICAgZ2xfRnJhZ0NvbG9yID0gdmVjNChzdW1Db2xvciAvIGJsdXJQaXhlbHMsIDEuMCk7XFxuXCIgKyBcIn1cXG5cIjtcblxuY2MuX1JGcG9wKCk7IiwiY2MuX1JGcHVzaChtb2R1bGUsICc3Mzg4OHhvSndWSVdyaFpjNXlnYVd6RScsICdjY1NoYWRlcl9HcmF5X0ZyYWcnKTtcbi8vIFNoYWRlcnMvY2NTaGFkZXJfR3JheV9GcmFnLmpzXG5cbi8qIOeBsOW6piAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBcInByZWNpc2lvbiBtZWRpdW1wIGZsb2F0O1xcblwiICsgXCJ2YXJ5aW5nIHZlYzIgdl90ZXhDb29yZDtcXG5cIiArIFwidm9pZCBtYWluKClcXG5cIiArIFwie1xcblwiICsgXCIgICAgdmVjMyB2ID0gdGV4dHVyZTJEKENDX1RleHR1cmUwLCB2X3RleENvb3JkKS5yZ2I7XFxuXCIgKyBcIiAgICBmbG9hdCBmID0gdi5yICogMC4yOTkgKyB2LmcgKiAwLjU4NyArIHYuYiAqIDAuMTE0O1xcblwiICsgXCIgICAgZ2xfRnJhZ0NvbG9yID0gdmVjNChmLCBmLCBmLCAxLjApO1xcblwiICsgXCJ9XFxuXCI7XG5cbmNjLl9SRnBvcCgpOyIsImNjLl9SRnB1c2gobW9kdWxlLCAnYzc4M2NpR2pDaEZ3SUtyV2d4eHFjSWYnLCAnY2NTaGFkZXJfTmVnYXRpdmVfQmxhY2tfV2hpdGVfRnJhZycpO1xuLy8gU2hhZGVycy9jY1NoYWRlcl9OZWdhdGl2ZV9CbGFja19XaGl0ZV9GcmFnLmpzXG5cbi8qIOW6leeJh+m7keeZvSAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBcInByZWNpc2lvbiBtZWRpdW1wIGZsb2F0O1xcblwiICsgXCJ2YXJ5aW5nIHZlYzIgdl90ZXhDb29yZDtcXG5cIiArIFwidm9pZCBtYWluKClcXG5cIiArIFwie1xcblwiICsgXCIgICAgdmVjMyB2ID0gdGV4dHVyZTJEKENDX1RleHR1cmUwLCB2X3RleENvb3JkKS5yZ2I7XFxuXCIgKyBcIiAgICBmbG9hdCBmID0gMS4wIC0gKHYuciAqIDAuMyArIHYuZyAqIDAuNTkgKyB2LmIgKiAwLjExKTtcXG5cIiArIFwiICAgIGdsX0ZyYWdDb2xvciA9IHZlYzQoZiwgZiwgZiwgMS4wKTtcXG5cIiArIFwifVxcblwiO1xuXG5jYy5fUkZwb3AoKTsiLCJjYy5fUkZwdXNoKG1vZHVsZSwgJzIyYjg2UXdEZTlBTExQRU1GekVyNy9JJywgJ2NjU2hhZGVyX05lZ2F0aXZlX0ltYWdlX0ZyYWcnKTtcbi8vIFNoYWRlcnMvY2NTaGFkZXJfTmVnYXRpdmVfSW1hZ2VfRnJhZy5qc1xuXG4vKiDlupXniYfplZzlg48gKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gXCJwcmVjaXNpb24gbWVkaXVtcCBmbG9hdDtcXG5cIiArIFwidmFyeWluZyB2ZWMyIHZfdGV4Q29vcmQ7XFxuXCIgKyBcInZvaWQgbWFpbigpXFxuXCIgKyBcIntcXG5cIiArIFwiXHRnbF9GcmFnQ29sb3IgPSB2ZWM0KDEuMCAtIHRleHR1cmUyRChDQ19UZXh0dXJlMCwgdl90ZXhDb29yZCkucmdiLCAxLjApO1xcblwiICsgXCJ9XFxuXCI7XG5cbmNjLl9SRnBvcCgpOyIsImNjLl9SRnB1c2gobW9kdWxlLCAnYzI3MmV2VG9icExpb1ZjWjhZVVJuV1EnLCAnY2NTaGFkZXJfU2hhZG93X0JsYWNrX1doaXRlX0ZyYWcnKTtcbi8vIFNoYWRlcnMvY2NTaGFkZXJfU2hhZG93X0JsYWNrX1doaXRlX0ZyYWcuanNcblxuLyog5riQ5Y+Y6buR55m9ICovXG5cblwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFwicHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7XFxuXCIgKyBcInZhcnlpbmcgdmVjMiB2X3RleENvb3JkO1xcblwiICsgXCJ1bmlmb3JtIGZsb2F0IHN0cmVuZ3RoO1xcblwiICsgXCJ2b2lkIG1haW4oKVxcblwiICsgXCJ7XFxuXCIgKyBcIiAgICB2ZWMzIHYgPSB0ZXh0dXJlMkQoQ0NfVGV4dHVyZTAsIHZfdGV4Q29vcmQpLnJnYjtcXG5cIiArIFwiICAgIGZsb2F0IGYgPSBzdGVwKHN0cmVuZ3RoLCAodi5yICsgdi5nICsgdi5iKSAvIDMuMCApO1xcblwiICsgXCIgICAgZ2xfRnJhZ0NvbG9yID0gdmVjNChmLCBmLCBmLCAxLjApO1xcblwiICsgXCJ9XFxuXCI7XG5cbmNjLl9SRnBvcCgpOyIsImNjLl9SRnB1c2gobW9kdWxlLCAnZTZhNTFMR1lJWkVDN1Y2MWo1S2lnbUgnLCAnY2NTaGFkZXJfV2F2ZV9IX0ZyYWcnKTtcbi8vIFNoYWRlcnMvY2NTaGFkZXJfV2F2ZV9IX0ZyYWcuanNcblxuLyog5rC05bmz5rOi5rWqICovXG5cblwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFwicHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7XFxuXCIgKyBcInZhcnlpbmcgdmVjMiB2X3RleENvb3JkO1xcblwiICsgXCJ1bmlmb3JtIGZsb2F0IG1vdGlvbjtcXG5cIiArIFwidW5pZm9ybSBmbG9hdCBhbmdsZTtcXG5cIiArIFwidm9pZCBtYWluKClcXG5cIiArIFwie1xcblwiICsgXCIgICAgdmVjMiB0bXAgPSB2X3RleENvb3JkO1xcblwiICsgXCIgICAgdG1wLnggPSB0bXAueCArIDAuMDUgKiBzaW4obW90aW9uICsgIHRtcC55ICogYW5nbGUpO1xcblwiICsgXCIgICAgZ2xfRnJhZ0NvbG9yID0gdGV4dHVyZTJEKENDX1RleHR1cmUwLCB0bXApO1xcblwiICsgXCJ9XFxuXCI7XG5cbmNjLl9SRnBvcCgpOyIsImNjLl9SRnB1c2gobW9kdWxlLCAnNzAzZTFLM29lbE0wNEdHeGNsekpQUEsnLCAnY2NTaGFkZXJfV2F2ZV9WSF9GcmFnJyk7XG4vLyBTaGFkZXJzL2NjU2hhZGVyX1dhdmVfVkhfRnJhZy5qc1xuXG4vKiDlhajlsYDms6LmtaogKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gXCJwcmVjaXNpb24gbWVkaXVtcCBmbG9hdDtcXG5cIiArIFwidmFyeWluZyB2ZWMyIHZfdGV4Q29vcmQ7XFxuXCIgKyBcInVuaWZvcm0gZmxvYXQgbW90aW9uO1xcblwiICsgXCJ1bmlmb3JtIGZsb2F0IGFuZ2xlO1xcblwiICsgXCJ2b2lkIG1haW4oKVxcblwiICsgXCJ7XFxuXCIgKyBcIiAgICB2ZWMyIHRtcCA9IHZfdGV4Q29vcmQ7XFxuXCIgKyBcIiAgICB0bXAueCA9IHRtcC54ICsgMC4wMSAqIHNpbihtb3Rpb24gKyAgdG1wLnggKiBhbmdsZSk7XFxuXCIgKyBcIiAgICB0bXAueSA9IHRtcC55ICsgMC4wMSAqIHNpbihtb3Rpb24gKyAgdG1wLnkgKiBhbmdsZSk7XFxuXCIgKyBcIiAgICBnbF9GcmFnQ29sb3IgPSB0ZXh0dXJlMkQoQ0NfVGV4dHVyZTAsIHRtcCk7XFxuXCIgKyBcIn1cXG5cIjtcblxuY2MuX1JGcG9wKCk7IiwiY2MuX1JGcHVzaChtb2R1bGUsICcwMzVjNTFpbHE1RTVLMHZSOGd4Sms2MycsICdjY1NoYWRlcl9XYXZlX1ZfRnJhZycpO1xuLy8gU2hhZGVycy9jY1NoYWRlcl9XYXZlX1ZfRnJhZy5qc1xuXG4vKiDlnoLnm7Tms6LmtaogKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gXCJwcmVjaXNpb24gbWVkaXVtcCBmbG9hdDtcXG5cIiArIFwidmFyeWluZyB2ZWMyIHZfdGV4Q29vcmQ7XFxuXCIgKyBcInVuaWZvcm0gZmxvYXQgbW90aW9uO1xcblwiICsgXCJ1bmlmb3JtIGZsb2F0IGFuZ2xlO1xcblwiICsgXCJ2b2lkIG1haW4oKVxcblwiICsgXCJ7XFxuXCIgKyBcIiAgICB2ZWMyIHRtcCA9IHZfdGV4Q29vcmQ7XFxuXCIgKyBcIiAgICB0bXAueSA9IHRtcC55ICsgMC4wNSAqIHNpbihtb3Rpb24gKyAgdG1wLnggKiBhbmdsZSk7XFxuXCIgKyBcIiAgICBnbF9GcmFnQ29sb3IgPSB0ZXh0dXJlMkQoQ0NfVGV4dHVyZTAsIHRtcCk7XFxuXCIgKyBcIn1cXG5cIjtcblxuY2MuX1JGcG9wKCk7Il19
