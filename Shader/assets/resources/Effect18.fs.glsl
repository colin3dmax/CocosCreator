// bars - thygate@gmail.com
//  back to Amiga Days...lets see more Amiga stuff  idea : https://www.youtube.com/watch?v=cKy57re_6BY  ;-)  @Harley 
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 position;
vec3 color;

float barsize = 0.21+0.1*sin(time);
float barsangle = 1.4;


vec3 mixcol(float value, float r, float g, float b)
{
	return vec3(value * r, value * g, value * b);
}

void bar(float pos, float r, float g, float b)
{
	 if ((position.y <= pos + barsize) && (position.y >= pos - barsize))
		color = mixcol(1.0 - abs(pos - position.y) / barsize, r, g, b);
}

void main( void ) {
	
	position = ( gl_FragCoord.xy / resolution.xy );
	float st = sin(time+sin(position.y*3.14+6.28*cos(time*0.1)));
	position = position - (0.5+st*0.25);

	position.xy = position.yx * vec2(-2.0,8.0+4.0*st);
	
	color = vec3(0., 0., 0.);
	float xx = 64.0 + 32.0 * (1.0-st*2.0);
	position.x = floor(position.x*xx)/xx; 
	float t = time*1.1+(position.y*position.x*mouse.x+0.5+position.x);

	bar(cos(2.0+t+t)*0.4,  1.0, 0.0, 0.0);
	bar(cos(1.5+t+t)*0.4,  1.0, 1.0, 0.0);
	bar(cos(1.0+t+t)*0.4,  0.0, 1.0, 0.0);
	bar(cos(0.5+t+t)*0.4,  0.0, 1.0, 1.0);
	bar(cos(0.0+t+t)*0.4,  0.5, 0.0, 1.0);
	
	bar(cos(-0.5+t+t)*0.4,  1.0, 0.0, 1.0);
	bar(cos(-1.0+t+t)*0.4,  1.0, 1.0, 1.0);
	bar(cos(-1.5+t+t)*0.4,  1.0, 1.0, 0.5);
	bar(cos(-2.0+t+t)*0.4,  1.0, 0.5, 1.0);
	 
	
	gl_FragColor = vec4(color, 1.0);

}