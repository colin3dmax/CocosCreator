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
//#define spin
#define wavy

const float PI = 3.14159;

mat2 rot2D(float a){
    return mat2(cos(a), -sin(a),
                sin(a),  cos(a));
}

float circle(vec2 p){
    return length(p);
}

vec2 hash( vec2 p ) {                       
    p = vec2( dot(p,vec2(127.1,311.7)),
              dot(p,vec2(269.5,183.3)) );
    return -1. + 2.*fract(sin(p+20.)*53758.5453123);
}
float noise( in vec2 p ) {
    vec2 i = floor((p)), f = fract((p));
    vec2 u = f*f*(3.-2.*f);
    return mix( mix( dot( hash( i + vec2(0.,0.) ), f - vec2(0.,0.) ), 
                     dot( hash( i + vec2(1.,0.) ), f - vec2(1.,0.) ), u.x),
                mix( dot( hash( i + vec2(0.,1.) ), f - vec2(0.,1.) ), 
                     dot( hash( i + vec2(1.,1.) ), f - vec2(1.,1.) ), u.x), u.y);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	float t=iGlobalTime;
	vec2 uv = fragCoord.xy / iResolution.xy;
    uv = uv * 2.0 - 1.0;
    uv.x *= iResolution.x / iResolution.y;
    
    fragColor = vec4(0.0);
#ifdef wavy
    uv.y+=noise((uv*.5) + t)*.5;
    uv.x+=noise((uv*.3) + t)*.4;
#endif
	//vec3 col = vec3(sin(uv.y*22.), 0.0, .0);
    vec3 col = vec3(1.0, 0.0, 0.0)-sin(uv.y*21.)+vec3(1.0, 0.0 ,0.0);
    if(uv.y > -0.15 && uv.x < .25){
        uv.y-=.11;
        //uv.x-=iGlobalTime;
        uv = mod(uv, 0.3) - 0.15;
        col = vec3(0.0, 0.0, 1.0);
    }
   
    col = smoothstep(.1, .2, col);
    float c = 0.0;
#ifdef spin
    uv*=rot2D(iGlobalTime);
#endif
    float s = circle(uv);
    float angle = atan(uv.x, -uv.y);
    //s += cos(angle * 5.0 + PI);
    s *= 1.750 + (0.2 + 0.5 * cos (angle * 5.0));
    s += smoothstep(.1, .14, s);
    float display = smoothstep (0.5, 0.4, s);
          
	fragColor = mix(vec4(col, 1.0), vec4(1.0, 1.0, 1.0, 1.0), display);      //sin(uv.y*12.);
}

// 2016 - Passion
// Reference for the star shape
//https://www.shadertoy.com/view/XlsSR4 'Psycho dots' - nrx


/*
float star(vec2 p){
    return circle(p)*atan(p.y, p.x);
}
*/


//_______________________________________________________________________________________________________



void main( void)
{
	mainImage(gl_FragColor, gl_FragCoord.xy);
}