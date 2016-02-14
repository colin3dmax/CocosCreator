/* 模糊 0.5     */
/* 模糊 1.0     */
/* 细节 -2.0    */
/* 细节 -5.0    */
/* 细节 -10.0   */
/* 边缘 2.0     */
/* 边缘 5.0     */
/* 边缘 10.0    */

module.exports = "precision mediump float;\n"
                + "varying vec2 v_texCoord;\n"
                + "uniform float widthStep;\n"
                + "uniform float heightStep;\n"
                + "uniform float strength;\n"
                + "const float blurRadius = 2.0;\n"
                + "const float blurPixels = (blurRadius * 2.0 + 1.0) * (blurRadius * 2.0 + 1.0);\n"
                + "void main()\n"
                + "{\n"
                + "    vec3 sumColor = vec3(0.0, 0.0, 0.0);\n"
                + "    for(float fy = -blurRadius; fy <= blurRadius; ++fy)\n"
                + "    {\n"
                + "        for(float fx = -blurRadius; fx <= blurRadius; ++fx)\n"
                + "        {\n"
                + "            vec2 coord = vec2(fx * widthStep, fy * heightStep);\n"
                + "            sumColor += texture2D(CC_Texture0, v_texCoord + coord).rgb;\n"
                + "        }\n"
                + "    }\n"
                + "    gl_FragColor = vec4(mix(texture2D(CC_Texture0, v_texCoord).rgb, sumColor / blurPixels, strength), 1.0);\n"
                + "}\n";