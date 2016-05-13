module.exports =
`
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse_touch;
uniform vec2 resolution;

void main( void ) {

	vec2 p = (2.0*gl_FragCoord.xy-resolution.xy)/resolution.y;
    float tau = 3.1415926535;
    float a = sin(time);
    float r = length(p)*0.75;
    vec2 uv = vec2(a/tau,r);
	
	//get the color
	float xCol = (uv.x - (time / 3.0)) * 3.0;
	xCol = mod(xCol, 3.0);
	vec3 horColour = vec3(sin(time*2.99)*1.25, sin(time*3.111)*0.25, sin(time*1.31)*0.25);
	
	if (xCol < .1) {
		
		horColour.r += 1.0 - xCol;
		horColour.g += xCol;
	}
	else if (xCol < 0.4) {
		
		xCol -= 1.0;
		horColour.g += 1.0 - xCol;
		horColour.b += xCol;
	}
	else {
		
		xCol -= 2.0;
		horColour.b += 1.0 - xCol;
		horColour.r += xCol;
	}

	// draw color beam
	uv = (3.0 * uv) - abs(sin(time));
	float beamWidth = .0+1.1*abs((sin(time)*0.2*2.0) / (3.0 * uv.x * uv.y));
	vec3 horBeam = vec3(beamWidth);
	gl_FragColor = vec4((( horBeam) * horColour), 1.0);
}

`