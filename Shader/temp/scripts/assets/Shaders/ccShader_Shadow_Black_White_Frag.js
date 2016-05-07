"use strict";
cc._RFpush(module, 'c272evTobpLioVcZ8YURnWQ', 'ccShader_Shadow_Black_White_Frag');
// Shaders/ccShader_Shadow_Black_White_Frag.js

/* 渐变黑白 */

module.exports = "precision mediump float;\n" + "varying vec2 v_texCoord;\n" + "uniform float strength;\n" + "void main()\n" + "{\n" + "    vec3 v = texture2D(CC_Texture0, v_texCoord).rgb;\n" + "    float f = step(strength, (v.r + v.g + v.b) / 3.0 );\n" + "    gl_FragColor = vec4(f, f, f, 1.0);\n" + "}\n";

cc._RFpop();