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


#define PI 3.14159265359
#define E 2.7182818284
#define GR 1.61803398875
#define EPS .001

#define time ((saw(float(__LINE__))+1.0)*iGlobalTime/PI/E/GR)
#define saw(x) (acos(cos(x))/PI)

vec2 SinCos( const in float x )
{
	return vec2(sin(x), cos(x));
}

vec2 rotatez( const in vec2 vPos, const in vec2 vSinCos )
{
	return vPos.xy * mat2(vSinCos.yx, -vSinCos.x, vSinCos.y);
}

vec2 rotatez( const in vec2 vPos, const in float fAngle )
{
	return rotatez( vPos, SinCos(fAngle) );
}

vec2 mobius(vec2 uv)
{
    float turns = 4.0;//saw(time)*3.0+3.0;
    uv = rotatez(uv.xy, PI/(1.0*turns)).xy;
    float theta = atan(uv.y, uv.x);
    float rot = float(int((theta/PI*.5+.5)*turns))/turns;
    vec2 xy = rotatez(uv.xy, PI*2.0*(rot)+PI/turns).xy;
    xy = sign(xy)*log(abs(xy));
    return vec2(saw(theta*turns), saw(xy.x*PI*1.0));
}

vec3 phase(float map)
{
    return vec3(saw(map),
                saw(4.0*PI/3.0+map),
                saw(2.0*PI/3.0+map));
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = fragCoord.xy / iResolution.xy;
    float scale = exp(-saw(time)*2.0);
    uv = uv*scale-scale/2.0;
    
    uv.x *= iResolution.x/iResolution.y;
    float r = length(uv);
    uv = normalize(uv)/log(r+1.0);
    uv += sin(vec2(time, time/PI*E*GR))*scale*4.0*PI;
    uv = mobius(uv); 
    
    const int max_iterations =1;
    
    
    float dist = clamp(1.0-length(uv*2.0-1.0), 0.0, 1.0);
    float map = sqrt(dist)*PI;
    
    for(int i = 0; i < max_iterations; i++)
    {
        float iteration = float(i)/float(max_iterations);
        
     	uv = uv*2.0-1.0;
        scale = exp(-saw(time+float(i))*2.0);
        uv *= scale;
        r = length(uv);
        uv = normalize(uv)/log(r+1.0);
        //uv += sin(vec2(time+iteration*2.0*PI, time/PI*E*GR+iteration*2.0*PI))*scale*2.0*PI;
        uv = mobius(uv);
        
        dist = clamp(1.0-length(uv*2.0-1.0), 0.0, 1.0);
        map += sqrt(dist)*PI;
    }

    
    fragColor = smoothstep(0.0, .75, map)*vec4(phase(map*2.0+time), 1.0);
    fragColor = vec4(uv, 0.0, 1.0);
    fragColor = texture2D(iChannel0, uv);
}

//_______________________________________________________________________________________________________





void main( void)
{
	mainImage(gl_FragColor, gl_FragCoord.xy);
}