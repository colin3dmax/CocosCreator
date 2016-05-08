// Career Day Programming Demo
// By: Ryan Harter

#ifdef GL_ES
precision mediump float;
#endif


uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
	uv.x *= resolution.x / resolution.y;

	vec3 finalColor = step(length( uv ), .5 + sin(time * 10.0) * .01) * vec3( 0.0, 0.0, 0.7 );
	finalColor += step( dot( finalColor, finalColor ), 0.1 );

	gl_FragColor = vec4( finalColor, 1.0 );
}