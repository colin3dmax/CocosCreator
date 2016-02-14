/* 垂直波浪 */

module.exports = "precision mediump float;\n"
                + "varying vec2 v_texCoord;\n"
                + "uniform float motion;\n"
                + "uniform float angle;\n"
                + "void main()\n"
                + "{\n"
                + "    vec2 tmp = v_texCoord;\n"
                + "    tmp.y = tmp.y + 0.05 * sin(motion +  tmp.x * angle);\n"
                + "    gl_FragColor = texture2D(CC_Texture0, tmp);\n"
                + "}\n";