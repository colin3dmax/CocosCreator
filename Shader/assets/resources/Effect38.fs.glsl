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

float a(vec2 uv)
{
    uv.y = abs(uv.y);
    vec4 ss = vec4(uv.xy, .11, .79) - uv.yxyy + vec4(1.5,-1.2,0,0);
    return min(min(min(ss.x,ss.w),-uv.x),max(ss.y,ss.z));
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 uv = (fragCoord - iResolution.xy*0.5) * 3. / iResolution.y,
	     sup = vec2(-.5, .866),
         supo = vec2(.866, .5);
    
    float s = max(a(uv),max(a(vec2(dot(uv,sup), dot(uv,supo))),a(vec2(-dot(uv.yx,supo), dot(uv.yx,sup)))));
    
    vec4 col = vec4(.13,.17,.22,1.) + smoothstep(0.0*1.8,.0,s)*0.7;

    float i = smoothstep(.8,1.,sin(iGlobalTime*4.5+uv.x+uv.y));
    col += i*clamp(vec4(1)*s*.9+.1*i,.0,1.);
    
    fragColor = clamp(col,.0,1.);
}

//_______________________________________________________________________________________________________



void main( void)
{
	mainImage(gl_FragColor, gl_FragCoord.xy);
}