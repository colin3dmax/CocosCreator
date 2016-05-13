module.exports =
`
#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define M_PI 3.1415926535897932384626433832795

void main( void ) {
  float time2 = time;
  vec2 mouse2 = mouse;
	float radius = 0.75;
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	// assign color only to the points that are inside of the circle
	gl_FragColor = vec4(smoothstep(0.0,1.0, pow(radius - length(p),0.05) ));	
}


`
