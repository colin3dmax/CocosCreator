/* 平均值黑白 */

module.exports = "#ifdef GL_ES\n"
				+"precision mediump float;\n"
				+"#endif\n"
                + "varying vec2 v_texCoord;\n"
                + "void main()\n"
                + "{\n"
                + "    vec4 v = texture2D(CC_Texture0, v_texCoord).rgba;\n"
                + "    float f = (v.r + v.g + v.b) / 3.0;\n"
                + "    gl_FragColor = vec4(f, f, f, v.a);\n"
                + "}\n";