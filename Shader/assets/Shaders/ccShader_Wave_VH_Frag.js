/* 全局波浪 */

module.exports =  
`
#ifdef GL_ES
precision mediump float;
#endif
varying vec2 v_texCoord;
uniform float motion;
uniform float angle;
void main()
{
    vec2 tmp = v_texCoord;
    tmp.x = tmp.x + 0.01 * sin(motion +  tmp.x * angle);
    tmp.y = tmp.y + 0.01 * sin(motion +  tmp.y * angle);
    gl_FragColor = texture2D(CC_Texture0, tmp);
}
`