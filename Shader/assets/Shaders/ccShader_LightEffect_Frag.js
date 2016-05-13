module.exports =
`
#ifdef GL_ES
precision mediump float;
#endif
varying vec2 v_texCoord;
uniform float time;
uniform vec2 mouse_touch;
uniform vec2 resolution;
const float minRStart = -2.0;
const float maxRStart = 1.0;
const float minIStart = -1.0;
const float maxIStart = 1.0;
const int maxIterations = 50;
// Immaginary number: has a real and immaginary part
struct complexNumber
{
	float r;
	float i;
};
void main( void ) {
	float minR = minRStart; // change these in order to zoom
	float maxR = maxRStart;
	float minI = minIStart;
	float maxI = maxIStart;
	
	vec3 col = vec3(0,0,0);
	
	vec2 pos = gl_FragCoord.xy / resolution;
	
	// The complex number of the current pixel.
	complexNumber im;
	im.r = minR + (maxR-minR)*pos.x; // LERP within range
	im.i = minI + (maxI-minI)*pos.y;
	
	complexNumber z;
	z.r = im.r;
	z.i = im.i;
	
	bool def = true; // is the number (im) definite?
	int iterations = 0;
	for(int i = 0; i< maxIterations; i++)
	{
		if(sqrt(z.r*z.r + z.i*z.i) > 2.0) // abs(z) = distance from origo
		{
			def = false;
			iterations = i; 
			break;
		}
		// Mandelbrot formula: zNew = zOld*zOld + im
		// z = (a+bi) => z*z = (a+bi)(a+bi) = a*a - b*b + 2abi
		complexNumber zSquared; 
		zSquared.r = z.r*z.r - z.i*z.i; // real part: a*a - b*b
		zSquared.i = 2.0*z.r*z.i; // immaginary part: 2abi
		// add: rSquared + im -> simple: just add the real and immaginary parts
		z.r = zSquared.r + im.r; // add real parts
		z.i = zSquared.i + im.i; // add immaginary parts
	}
	if(def) // it is definite => colour it black
		col.rgb = vec3(0,0,0);
	else // the number grows to infinity => colour it by the number of iterations 
	{
		float i = float(iterations)/float(maxIterations);
		col.r = smoothstep(0.0,0.5, i);
		col.g = smoothstep(0.0,1.0,i);
		col.b = smoothstep(0.3,1.0, i);
	}
	gl_FragColor.rgb = col;
}

`