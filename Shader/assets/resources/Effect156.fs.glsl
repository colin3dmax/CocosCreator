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

// what a pile.... just aimlessly messing around...
// 
// [Edit] Wow. Thanks for fixing my shader, FabriceNeyret2!! Most suggestions was added
// below, but see comments for Fabrice's even more slim version
// 
// Btw, this was inspired by Victor Vasarely's art that I was lucky to see a few pieces of
// at the great exhibition "Eye Attack" https://en.louisiana.dk/exhibition/eye-attack
// If you go to Denmark this spring, you need to go see it :)
//

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    float c = 12.0;
	vec2 uv = fragCoord.xy / iResolution.y - vec2(.37,0);
    
    if(uv.x>1.0 || uv.x < 0.0) {
        fragColor = vec4(0);
        return;
    }
    
    vec2 uvl = abs(uv-0.5)*c,
         uvi = floor(uvl)/c*2.0;

    uvl = fract(uvl);
    uv = fract(uv*c);
    
    float t = iGlobalTime,
          l = length(uv-0.5);
    
    vec2 cu = 0.3+0.05*sin(length(uvi+sin(t*0.1))*10.0+t*vec2(0.3,1.9));
    
    vec2 rr = 1.0-smoothstep(cu,cu+30.0/iResolution.x,vec2(l, 0.5-l));
    
    float  r = rr.x * rr.y * 0.8,
          cc = 0.45+0.1*sin(t*(0.9-0.6*length(uvi)));
    
	fragColor = vec4(cc+cc*r*1.2,cc*cc*1.2+r*0.2,0.3-cc+r*0.5,1.0);

    uvl = max(uvl, 1.0 - uvl);
    fragColor.g *= max(uvl.x, uvl.y);
}


//_______________________________________________________________________________________________________





void main( void)
{
	mainImage(gl_FragColor, gl_FragCoord.xy);
}