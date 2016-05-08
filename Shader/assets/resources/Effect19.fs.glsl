// SimpleGrid

#ifdef GL_ES
precision mediump float;
#endif

#define CELL_SIZE 30.0
#define LINE_WIDTH 1.0

uniform float time;
uniform vec2 mouse;

void main( void ) 
{
	// simple
	float x = gl_FragCoord.x - gl_FragCoord.y;
	float y = gl_FragCoord.y + gl_FragCoord.x;

	// rotation
	//x = gl_FragCoord.x - gl_FragCoord.y * (sin(time));
	//y = gl_FragCoord.y + gl_FragCoord.x * (sin(time));
	
	// mouse
	//x = gl_FragCoord.x - gl_FragCoord.y * (sin(mouse.x) * 2.0 - 1.0);
	//y = gl_FragCoord.y + gl_FragCoord.x * (sin(-mouse.y) * 2.0 + 1.0);
	
	bool grid = mod(x, CELL_SIZE) < LINE_WIDTH || mod(y, CELL_SIZE) < LINE_WIDTH;
	
	float color = grid ? 0.0 : 0.5;

	gl_FragColor = vec4( vec3( color ), 1.0 );
}