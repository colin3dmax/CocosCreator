/* 渐变黑白 */

module.exports =
`
#ifdef GL_ES
precision mediump float;
#endif
varying vec2 v_texCoord;
uniform float strength;
void main()
{
    vec3 v = texture2D(CC_Texture0, v_texCoord).rgb;
    float f = step(strength, (v.r + v.g + v.b) / 3.0 );
    gl_FragColor = vec4(f, f, f, 1.0);
}
`