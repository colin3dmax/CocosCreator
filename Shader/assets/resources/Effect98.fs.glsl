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


/**/ // 215 chars   - with tomkh's help

#define d  O += .1*(1.+cos(A= 2.33*a + iGlobalTime)) / length(vec2( fract(a*8.)-.5, 16.*length(U)-3.2*sin(A)-8.)); a += 6.3;


void mainImage( out vec4 O, vec2 U )
{

    U = (U+U-(O.xy=iResolution.xy)) / O.y;
    float a = atan(U.y,U.x), A;
    
	O -= O;  
    d d d
}
/**/




/**   // 230 chars - short B&W version of Shane's variant (see forum)
#define d  O = max(O,O-O+.55*(1.+.5*cos(A= 1.667*a + iGlobalTime)) *smoothstep(1., 0.9, 8.*abs(r-.2*sin(A)-.5))); a += 6.28;

void mainImage( out vec4 O, vec2 U ){

	vec2 R = iResolution.xy;
    U = (U+U-R)/R.y;
    float a = atan(U.y,U.x), r=length(U), A;   
    O -= O;  
    d d d 
  //O *= vec4(.8,1,.3,1); O.g = sqrt(O.g);
}
/**/



/**  // 234 chars

#define A  7./3.*a + iGlobalTime
#define d  O += .1*(1.+cos(A)) / length(vec2( fract(a*50./6.283)-.5, 16.*(length(U)-.2*sin(A)-.5))); a += 6.283;


void mainImage( out vec4 O, vec2 U )
{

    U = (U+U-(O.xy=iResolution.xy))/O.y;
    float a = atan(U.y,U.x);
    
	O -= O;  
    d d d
}
/**/



/**  // expanded version 


void mainImage( out vec4 O, vec2 U )
{
	vec2 R = iResolution.xy;
    U = (U+U-R)/R.y;
    float a = atan(U.y,U.x), r=length(U), A, d;
    
	O -= O;  
   
    for (int i=0; i<3; i++ ) { 
        A = 7./3.*a + iGlobalTime;       // param of 1 nested curve. Fractional -> 3*(7/3) to complete a loop
        R = vec2( fract(a*50./6.283)-.5, 16.*(r-.2*sin(A)-.5)); // texture param along ribbon
        d = smoothstep(.5,0.,length(R)); // small disks
        O += (1.+cos(A)) * d;            // modulates and cumulates
        a += 6.283;                      // next nested curve
    }
}
/**/
//_______________________________________________________________________________________________________





void main( void)
{
	mainImage(gl_FragColor, gl_FragCoord.xy);
}