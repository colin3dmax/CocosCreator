/* 平均值黑白 */

module.exports = "#ifdef GL_ES\n"
				+"precision mediump float;\n"
				+"#endif\n"
                + "varying vec2 v_texCoord;\n"
                + "void main()\n"
                + "{\n"
                + "    vec4 v = texture2D(CC_Texture0, v_texCoord).rgba;\n"
                + "    gl_FragColor = v;\n"
                + "}\n";