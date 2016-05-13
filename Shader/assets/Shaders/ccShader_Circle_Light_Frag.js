module.exports =
`
#ifdef GL_ES
precision mediump float;
#endif
varying vec2 v_texCoord;
uniform float time;
uniform vec2 mouse_touch;
uniform vec2 resolution;

void main( void ) {
  float t=time;
  vec2 touch=mouse_touch;
  vec2 resolution2s=resolution;
  vec2 position = ((gl_FragCoord.xy / resolution.xy) * 2. - 1.) * vec2(resolution.x / resolution.y, 1.0);
  float d = abs(0.1 + length(position) - 0.5 * abs(sin(time))) * 5.0;
  vec3 sumColor = vec3(0.0, 0.0, 0.0);
	sumColor += texture2D(CC_Texture0, v_texCoord).rgb;
	gl_FragColor = vec4(sumColor.r/d, sumColor.g, sumColor.b, mouse_touch.x/800.0 );
}
`