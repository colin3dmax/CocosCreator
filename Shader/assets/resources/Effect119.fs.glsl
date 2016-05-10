#ifdef GL_ES
precision mediump float;
#endif


// Shader Inputs
// uniform vec3      iResolution;           // viewport resolution (in pixels)
// uniform float     iGlobalTime;           // shader playback time (in seconds)
// uniform float     iTimeDelta;            // render time (in seconds)
// uniform int       iFrame;                // shader playback frame
// uniform float     iChannelTime[4];       // channel playback time (in seconds)
// uniform vec3      iChannelResolution[4]; // channel resolution (in pixels)
// uniform vec4      iMouse;                // mouse pixel coords. xy: current (if MLB down), zw: click
// uniform samplerXX iChannel0..3;          // input channel. XX = 2D/Cube
// uniform vec4      iDate;                 // (year, month, day, time in seconds)
// uniform float     iSampleRate;           // sound sample rate (i.e., 44100)


uniform vec3      iResolution;           // viewport resolution (in pixels)
uniform float     iGlobalTime;           // shader playback time (in seconds)
//uniform float     iTimeDelta;            // render time (in seconds)
//uniform int       iFrame;                // shader playback frame
//uniform float     iChannelTime[4];       // channel playback time (in seconds)
//uniform vec3      iChannelResolution[4]; // channel resolution (in pixels)
uniform vec4      iMouse;                // mouse pixel coords. xy: current (if MLB down), zw: click
//uniform samplerXX iChannel0..3;          // input channel. XX = 2D/Cube
uniform vec4      iDate;                 // (year, month, day, time in seconds)
//uniform float     iSampleRate;           // sound sample rate (i.e., 44100)

#define iChannel0 CC_Texture0
#define iChannel1 CC_Texture0
#define iChannel2 CC_Texture0
#define iChannel3 CC_Texture0
#define iChannel4 CC_Texture0




//_______________________________________________________________________________________________________
//If you're new to GLSL or programming in general,
//I encourage you to play with these variables and values to see what they do! 

//Variable declarations

//Sets background colour(red, green, blue)
vec3 bgCol = vec3(0.6, 0.5, 0.6);

//Sets size of the sphere and brightness of the shine
float sphereScale = 0.7;
float sphereShine = 0.5;

//Sets diffuse colour(red, green, blue), specular colour(red, green, blue), 
//and initial specular point position(x, y)
vec3 sphereDiff = vec3(0.5, 0.0, 0.5);
vec3 sphereSpec = vec3(1.0, 1.0, 1.0);
vec2 specPoint = vec2(0.2, -0.1);

//Main method/function
void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
	//Creates shader pixel coordinates
	vec2 uv = fragCoord.xy / iResolution.xy;
	
	//Sets the position of the camera
	vec2 p = uv * 2.3 - 1.0;
	p.x *= iResolution.x / iResolution.y;
	
	//Rotates the sphere in a circle
	p.x += cos(-iGlobalTime) * 0.35;
	p.y += sin(-iGlobalTime) * 0.35;
	
	//Rotates the specular point with the sphere
	specPoint.x += cos(-iGlobalTime) * 0.35;
	specPoint.y += sin(-iGlobalTime) * 0.35;
	
	//Sets the radius of the sphere to the middle of the screen
	float radius = sqrt(dot(p, p));
	
	vec3 col = bgCol;
	
	//Sets the initial dark shadow around the edge of the sphere
	float f = smoothstep(sphereScale * 0.9, sphereScale, length(p + specPoint));
	col -= mix(col, vec3(0.0), f) * 0.2;
	
	//Only carries out the logic if the radius of the sphere is less than the scale
	if(radius < sphereScale) {
		vec3 bg = col;
		
		//Sets the diffuse colour of the sphere (solid colour)
		col = sphereDiff;
		
		//Adds smooth dark borders to help achieve 3D look
		f = smoothstep(sphereScale * 0.7, sphereScale, radius);
		col = mix(col, sphereDiff * 0.45, f);
		
		//Adds specular glow to help achive 3D look
		f = 1.0 - smoothstep(-0.2, 0.6, length(p - specPoint));
		col += f * sphereShine * sphereSpec;
		
		//Smoothes the edge of the sphere
		f = smoothstep(sphereScale - 0.01, sphereScale, radius);
		col = mix(col, bg, f);
	}	
	
	//The final output of the shader logic above
	//fragColor is a vector with 4 paramaters(red, green, blue, alpha)
	//Only 2 need to be used here, as "col" is a vector that already carries r, g, and b values
	fragColor = vec4(col, 1);
}

//_______________________________________________________________________________________________________





void main( void)
{
	mainImage(gl_FragColor, gl_FragCoord.xy);
}