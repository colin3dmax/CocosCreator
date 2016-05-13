/* 底片黑白 */

module.exports = "\n#ifdef GL_ES\nprecision mediump float;\n#endif\nvarying vec2 v_texCoord;\nvoid main()\n{\n    vec3 v = texture2D(CC_Texture0, v_texCoord).rgb;\n    float f = 1.0 - (v.r * 0.3 + v.g * 0.59 + v.b * 0.11);\n    gl_FragColor = vec4(f, f, f, 1.0);\n}\n";