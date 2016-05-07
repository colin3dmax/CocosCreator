"use strict";
cc._RFpush(module, '1a2e0lgfLVJ2Z1JCdcFAr8X', 'ccShader_Avg_Black_White_Frag');
// Shaders/ccShader_Avg_Black_White_Frag.js

/* 平均值黑白 */

module.exports = "precision mediump float;\n" + "varying vec2 v_texCoord;\n" + "void main()\n" + "{\n" + "    vec3 v = texture2D(CC_Texture0, v_texCoord).rgb;\n" + "    float f = (v.r + v.g + v.b) / 3.0;\n" + "    gl_FragColor = vec4(f, f, f, 1.0);\n" + "}\n";

cc._RFpop();