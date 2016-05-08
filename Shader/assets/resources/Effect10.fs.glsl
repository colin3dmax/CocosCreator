// CATHODE RAY CHAOS

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

#define time time+sin(gl_FragCoord.x/100.+sin(time+gl_FragCoord.y/700.)*3.)+cos(gl_FragCoord.y/100.+cos(time*0.7+gl_FragCoord.x/900.)*3.)
void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy*8.0 )*10.0;

	float color = 0.0;
	color += sin( position.x * time  + sin(time)*8.*cos(time*3.5)) * cos( position.y * 6.0  + sqrt(time)*4.*cos(time*1.75) );
	gl_FragColor = vec4( floor(vec3( color * 0.2, color * 0.3, color * 0.6 ) *16. ) / 8., 1.0 );

}