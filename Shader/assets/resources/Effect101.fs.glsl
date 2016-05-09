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

// in the taste of http://9gag.com/gag/am9peXo
// generalisation of https://www.shadertoy.com/view/ls3XWM


/**/  // 252 chars  (-9 tomkh, -8 Fabrice )


#define d  O+=.1*(1.+cos(A=2.33*a+iGlobalTime)) / length(vec2( fract(a*k*7.96)-.5, 16.*length(U)-1.6*k*sin(A)-8.*k)); a+=6.3;
//#define d  O+= (1.+cos(A=2.33*a+iGlobalTime)) * smoothstep(.5,0., length(vec2( fract(a*k*7.96)-.5, 16.*length(U)-1.6*k*sin(A)-8.*k))); a+=6.3;
#define c  d d d  k+=k;

void mainImage(out vec4 O,vec2 U)
{
    U = (U+U-(O.xy=iResolution.xy)) / O.y;
    float a = atan(U.y,U.x), k=.5, A;
    O -= O;
    c c c c
}
/**/




/** // 269 chars

#define A  7./3.*a + iGlobalTime
#define d  O += .1*(1.+cos(A)) / length(vec2( fract(a*k*50./6.283)-.5, 16.*(length(U)-.1*k*sin(A)-.5*k))); a += 6.283;
#define c  d d d k+=k;

void mainImage( out vec4 O, vec2 U )
{

    U = (U+U-(O.xy=iResolution.xy))/O.y;
    float a = atan(U.y,U.x), k=.5;
    
	O -= O;  
    c c c c
    //  O += .2*vec4(0,1,2,0);
}
/**/
//_______________________________________________________________________________________________________





void main( void)
{
	mainImage(gl_FragColor, gl_FragCoord.xy);
}