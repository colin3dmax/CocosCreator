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






//_______________________________________________________________________________________________________

// inspired from Shane's ribbon variant of https://www.shadertoy.com/view/ls3XWM 



void mainImage( out vec4 O, vec2 U )
{
    float h = iResolution.y;  U = 4.*(U+iMouse.xy)/h;                    // normalized coordinates
    vec2 K = ceil(U); U = 2.*fract(U)-1.;  // or K = 1.+2.*floor(U) to avoid non-fractionals
    float a = atan(U.y,U.x), r=length(U), v=0., A;                       // polar coordinates
    
    for(int i=0; i<7; i++)
        // if fractional, there is K.y turns to close the loop via K.x wings.
        v = max(v,   ( 1. + .8* cos(A= K.x/K.y*a + iGlobalTime) ) / 1.8  // 1+cos(A) = depth-shading
                   * smoothstep(1., 1.-120./h, 8.*abs(r-.2*sin(A)-.5))), // ribbon (antialiased)
        a += 6.28;                                                       // next turn

 
    O = v*vec4(.8,1,.3,1); O.g = sqrt(O.g);                              // greenify
  //O = v*(.5+.5*sin(K.x+17.*K.y+iDate.w+vec4(0,2.1,-2.1,0)));           // random colors
}













/**  // 318
#define d  O = max(O,O-O+(1.+.8*cos(A= K.x/K.y*a + iGlobalTime))/1.8 * smoothstep(1., 1.-120./R, 8.*abs(r-.2*sin(A)-.5))); a += 6.28;


void mainImage( out vec4 O, vec2 U )
{
    float R = iResolution.y;
    U = 4.*(U+iMouse.xy)/R;
    vec2 K = ceil(U); U = 2.*fract(U)-1.;  // or K = 1.+2.*floor(U) to avoid non-fractionals
    float a = atan(U.y,U.x), r=length(U), A;
    
	O -= O;  
    d d d d d d d
        
    O *= vec4(.8,1,.3,1); O.g = sqrt(O.g);  
}
/**/
//_______________________________________________________________________________________________________



void main( void)
{
	mainImage(gl_FragColor, gl_FragCoord.xy);
}