#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 position = ((gl_FragCoord.xy / resolution.xy) * 2. - 1.) * vec2(resolution.x / resolution.y, 1.0);
	
	float a = atan(position.x, position.y);
	float d = abs(0.1 + length(position) - 0.5 * abs(sin(time - (6.+3.*cos(time*0.01))*length(position)))) * 5.0;
	float e = abs(0.1 + length(position) - 0.5 * abs(sin(time * 0.7654321+a*floor(time*mouse.y))*sin(a*floor(time*mouse.x)))) * 5.0;
	
	gl_FragColor += vec4(0.1/d, 0.1 / d, 0.2 / d, 1);
	gl_FragColor += vec4(0.2/e, 0.1 / e, 0.1 / e, 1);
}