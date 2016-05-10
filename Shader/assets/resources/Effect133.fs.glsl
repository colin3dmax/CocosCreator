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

// adapted from the pyramide https://www.shadertoy.com/view/Md3XW8 
// and cube version : https://www.shadertoy.com/view/Xs33RH

                                              // draw segment [a,b]
#define L  *I; o-= 3e-3 / length( clamp( dot(u-a,v=b-a)/dot(v,v), 0.,1.) *v - u+a );
#define P  ; b=c= vec2(r.x,-1)/(4.+r.y) L b=a L  a=c;  a=c L a=c; r*= mat2(.5,.87,-.87,.5);


void mainImage(out vec4 o, vec2 v)
{
	vec2  I=vec2(1,-1), a, b,c=iResolution.xy, 
         u = (v+v-c)/c.y,
         r = sin(iDate.w-.8*I); r += I*r.yx  
    P  o-=o++        // just to initialize a
	P P P P P P          // 3*3 segments  
}
//_______________________________________________________________________________________________________





void main( void)
{
	mainImage(gl_FragColor, gl_FragCoord.xy);
}