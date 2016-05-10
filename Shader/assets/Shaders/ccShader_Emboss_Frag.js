/* 浮雕 */

module.exports =  "#ifdef GL_ES\n"
                +"precision mediump float;\n"
                +"#endif\n"
                + "varying vec2 v_texCoord;\n"
                + "uniform float widthStep;\n"
                + "uniform float heightStep;\n"
                + "const float stride = 2.0;\n"
                + "void main()\n"
                + "{\n"
                + "    vec3 tmpColor = texture2D(CC_Texture0, v_texCoord + vec2(widthStep * stride, heightStep * stride)).rgb;\n"
                + "    tmpColor = texture2D(CC_Texture0, v_texCoord).rgb - tmpColor + 0.5;\n"
                + "    float f = (tmpColor.r + tmpColor.g + tmpColor.b) / 3.0;\n"
                + "    gl_FragColor = vec4(f, f, f, 1.0);\n"
                + "}\n";