"use strict";
cc._RFpush(module, '703e1K3oelM04GGxclzJPPK', 'ccShader_Wave_VH_Frag');
// Shaders/ccShader_Wave_VH_Frag.js

/* 全局波浪 */

module.exports = "precision mediump float;\n" + "varying vec2 v_texCoord;\n" + "uniform float motion;\n" + "uniform float angle;\n" + "void main()\n" + "{\n" + "    vec2 tmp = v_texCoord;\n" + "    tmp.x = tmp.x + 0.01 * sin(motion +  tmp.x * angle);\n" + "    tmp.y = tmp.y + 0.01 * sin(motion +  tmp.y * angle);\n" + "    gl_FragColor = texture2D(CC_Texture0, tmp);\n" + "}\n";

cc._RFpop();