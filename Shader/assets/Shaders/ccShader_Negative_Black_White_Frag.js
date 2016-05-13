/* 底片黑白 */

module.exports =
`
#ifdef GL_ES
precision mediump float;
#endif
varying vec2 v_texCoord;
void main()
{
    vec3 v = texture2D(CC_Texture0, v_texCoord).rgb;
    float f = 1.0 - (v.r * 0.3 + v.g * 0.59 + v.b * 0.11);
    gl_FragColor = vec4(f, f, f, 1.0);
}
`