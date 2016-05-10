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

#define PI 3.14159265359
#define SIN_PERIOD 15.0 * PI
#define LONG_AIGUILLE 1.0
#define TIME_SCALE 1.0

#define CLOUDS_SCALE 2.0
#define CLOUDS_TIME_SCALE 0.2
#define ADDNOISE(n) k = pow(2.0, n); gray += noise(vec3((uv.x * CLOUDS_SCALE + shift * (n+1.0)*0.2) * k, uv.y * CLOUDS_SCALE * k, 0.0)) / k; total += 1.0/k;

// Noise function adapted from a shader found on ShaderToy.com
float hash(float n) { return fract(sin(n)*753.5453123); }
float noise(in vec3 x)
{
    // Perlin noise
    vec3 p = floor(x);
    vec3 f = fract(x);
    f = f*f*(3.0 - 2.0*f);

    float n = p.x + p.y*157.0 + 113.0*p.z;
    return mix(mix(mix(hash(n + 0.0),   hash(n + 1.0),   f.x),
                   mix(hash(n + 157.0), hash(n + 158.0), f.x), f.y),
               mix(mix(hash(n + 113.0), hash(n + 114.0), f.x),
                   mix(hash(n + 270.0), hash(n + 271.0), f.x), f.y), f.z);
}

vec4 clouds(in vec2 uv)
{
    float shift = iGlobalTime * CLOUDS_TIME_SCALE;
    
    float gray = 0.0;
    float total = 0.0;
    float k = 0.0;
    ADDNOISE(0.0);
    ADDNOISE(1.0);
    ADDNOISE(2.0);
    ADDNOISE(3.0);
    ADDNOISE(4.0);
    ADDNOISE(5.0);
    //ADDNOISE(64.0);
    gray /= total;
    
    gray = clamp((gray - 0.1) * 1.2, 0.0, 1.0);
    
    return vec4(vec3(gray), 1.0);
    //return gray;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 cFragCoord = fragCoord.xy - iResolution.xy * 0.5;
    
    vec2 pos = cFragCoord / iResolution.y;
    
    //vec2 pos = (uv - 0.5) * 2.0;
    float x = pos.x;
    float y = pos.y;

    float rho = sqrt(x*x + y*y);
    fragColor = vec4(0.0, 0.0, 0.0, 1.0);
    
    //=================
    float phi = atan(y, x);
    //float nPhi = phi / (2.0 * PI) + 0.5;
    vec2 circlePos = vec2(
        LONG_AIGUILLE * cos(phi),
        LONG_AIGUILLE * sin(phi)
    );

    //float seconds = iDate.w * TIME_SCALE;
    float seconds = iGlobalTime;
    float trotteuse = 1.0 - sin(SIN_PERIOD * fract(seconds)) / (SIN_PERIOD * fract(seconds));
    float nPhiSecSimul = (floor(seconds) - 1.0 + trotteuse) / 60.0;

    float phiSec = (1.25 - nPhiSecSimul) * 2.0 * PI;
    vec2 trottPos = vec2(
        LONG_AIGUILLE * cos(phiSec),
        LONG_AIGUILLE * sin(phiSec)
    );

    //float wave = (sin(iGlobalTime) * 0.5 + 0.5) * 0.75 + 0.25;
    float wave = sin(iGlobalTime) * 0.375 + 0.625;
    float light = wave * clamp(1.0 - length(circlePos - trottPos), 0.0, 1.0);

    vec4 lightCol = vec4(light, 0.0, 0.0, 1.0);
    //=================
    
    vec4 ocean = vec4(0.0, 0.1, 0.2, 1.0);
    ocean *= clamp(sign(rho - 0.03), 0.0, 1.0);
    
    
    fragColor = clamp(fragColor + clouds(pos), 0.0, 1.0);
    //fragColor = mix(fragColor, vec4(1.0), clouds(pos));
    
    
    fragColor *= (1.0 - rho * 1.5);
    
    fragColor += clamp(sign(rho - 0.01), 0.0, 1.0) * (ocean + lightCol);
}
//_______________________________________________________________________________________________________




void main( void)
{
	mainImage(gl_FragColor, gl_FragCoord.xy);
}