/* 灰度 */

module.exports =
`
#ifdef GL_ES
precision mediump float;
#endif
varying vec2 v_texCoord;
void main()
{
    vec3 v = texture2D(CC_Texture0, v_texCoord).rgb;
    float f = v.r * 0.299 + v.g * 0.587 + v.b * 0.114;
    gl_FragColor = vec4(f, f, f, 1.0);
}
`