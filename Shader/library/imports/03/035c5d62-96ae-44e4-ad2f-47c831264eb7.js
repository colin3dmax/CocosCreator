/* 垂直波浪 */

module.exports = "\n#ifdef GL_ES\nprecision mediump float;\n#endif\nvarying vec2 v_texCoord;\nuniform float motion;\nuniform float angle;\nvoid main()\n{\n    vec2 tmp = v_texCoord;\n    tmp.y = tmp.y + 0.05 * sin(motion +  tmp.x * angle);\n    gl_FragColor = texture2D(CC_Texture0, tmp);\n}\n";