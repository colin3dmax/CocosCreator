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
const int MAX_STEPS = 200;

vec2 getHex(vec2 pos)
{
    return floor(pos + 0.5);
}

float getHexHeight(vec2 hex)
{
    return (mix(texture2D(iChannel0, hex / 256.0, -100.0).x * 10.0, 4.5, 
                1.5 * pow(sin(hex.x * 0.133 + hex.y * 0.7 - iGlobalTime * 0.1), 2.0)) - 9.0) * 0.35;
}

float getPlaneDist(vec3 point, vec3 normal, vec3 sample)
{
    return dot(sample - point, normal);
}

float getHexDist(vec2 hex, vec3 sample)
{
    float result = sample.y - getHexHeight(hex);
    
    result = max(result, getPlaneDist(vec3(hex.x + 0.48, 0.0, hex.y), vec3( 1.0, 0.0,  0.0), sample));
    result = max(result, getPlaneDist(vec3(hex.x - 0.48, 0.0, hex.y), vec3(-1.0, 0.0,  0.0), sample));
    result = max(result, getPlaneDist(vec3(hex.x, 0.0, hex.y + 0.48), vec3( 0.0, 0.0,  1.0), sample));
    result = max(result, getPlaneDist(vec3(hex.x, 0.0, hex.y - 0.48), vec3( 0.0, 0.0, -1.0), sample));
    
    return result;
}

float dfDist(vec3 sample)
{
    sample.xz *= mat2(sin(1.), cos(1.), -sin(1.), cos(1.));
    
    float result = 1000.0;
    
    vec2 centerHex = getHex(sample.xz);
    
    for (int x = -1; x <= 1; x++)
    {
        for (int y = -1; y <= 1; y++)
        {
            vec2 hex = centerHex + vec2(x, y);
            result = min(result, getHexDist(hex, sample));
            result = min(result, getHexDist(hex, sample * vec3(1.0, -1.0, 1.0)));
        }
    }
    
    
    return result;
}

vec3 dfNormal(vec3 sample)
{
    const float E = 0.02;
    
    float d0 = dfDist(sample);
    float dX = dfDist(sample + vec3(E, 0, 0));
    float dY = dfDist(sample + vec3(0, E, 0));
    float dZ = dfDist(sample + vec3(0, 0, E));
    
    return normalize(vec3(dX - d0, dY - d0, dZ - d0));
}

float dfOcclusion(vec3 sample, vec3 normal)
{
    float N = 0.3;
    return clamp(dfDist(sample + normal * N) / N, 0.0, 1.0);
}

float trace(inout vec3 pos, vec3 dir, out vec3 normal)
{
    int steps = 0;
    for (int i = 0; i < MAX_STEPS; i++)
    {
        steps++;
        float d = dfDist(pos);
        pos += d * dir * 0.75;
        
        if (d < 0.001)
        {
            break;
        }
    }
    
    normal = dfNormal(pos);
    return float(steps) / float(MAX_STEPS);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    vec3 origin = vec3(0.2, 0.0, iGlobalTime);
    vec3 pos = origin;
    vec3 dir = normalize(vec3((fragCoord.x - iResolution.x * 0.5) / iResolution.y,
                              fragCoord.y / iResolution.y - 0.7,
                              1.0));
	vec3 normal;
    
    float steps = trace(pos, dir, normal);
    float occ = dfOcclusion(pos, normal);
    float fogAmt = 1.0 - exp(-distance(origin, pos) * 0.01);
    vec3 fogCol = vec3(0.2, 0.14, 0.18);
    
    vec3 diffuse = vec3(0.4, 0.5, 0.6) * clamp(dot(normal, normalize(vec3(1.0, 1.3, -1.0))), 0.0, 1.0);
    vec3 ambient = vec3(0.4, 0.2, 0.1);
    vec3 color = (ambient * occ + diffuse) * 4.0 / abs(pos.y * pos.y * pos.y);
    
    color = mix(color, fogCol, fogAmt);
    color = (1.0 - exp(-color));
	fragColor = vec4(color, 1.0);}


//_______________________________________________________________________________________________________





void main( void)
{
	mainImage(gl_FragColor, gl_FragCoord.xy);
}