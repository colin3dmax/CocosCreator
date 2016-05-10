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
const int NUM_SPHERES = 12;

float sphere(vec3 pos, float radius, vec3 sample)
{
    return length(pos - sample) - radius;
}

float plane(vec3 dir, float offset, vec3 sample)
{
    return dot(dir, sample) + offset;
}

float dfDist(vec3 sample)
{
    float T1 = 10.0;
    float T2 = 2.0 * T1;
    
    float result = 10000.0;
    
    sample.y += sin(sample.z * 0.2 + iGlobalTime) * sin(iGlobalTime * 1.33)
              + sin(sample.x * 0.3 + iGlobalTime) * sin(iGlobalTime * 3.22)
              + sin(sample.x * 0.5 + sample.z * 0.22 + iGlobalTime) * sin(iGlobalTime * 2.22 + sample.z * 0.1);
    float o = floor((sample.z + T1) / T2);
    sample.x += o * 7.0;
    sample.xz = mod(sample.xz + T1, T2) - T1;
    
    for (int i = 0; i < NUM_SPHERES; i++)
    {
        float t = float(i) / float(NUM_SPHERES);
        float n = t + iGlobalTime * 0.25 + o * 0.5;
        vec3 pos = vec3(sin(n * 5.0) * 5.0, cos(n * 3.0) * 9.0, cos(n * 2.0) * 3.0 + 5.0);
        float radius = texture2D(iChannel0, vec2(t*t)).x * 2.0 + 1.4;
        result = min(result, sphere(pos, radius, sample));
    }
    
    result = min(result, plane(vec3(0, -1, 0), 10.0, sample));    
    result = min(result, plane(vec3(0, 1, 0), 10.0, sample));    
    
    return result;
}

vec3 dfNormal(vec3 sample)
{
    const float E = 0.04;
    
    float d0 = dfDist(sample);
    float dX = dfDist(sample + vec3(E, 0, 0));
    float dY = dfDist(sample + vec3(0, E, 0));
    float dZ = dfDist(sample + vec3(0, 0, E));
    
    return normalize(vec3(dX - d0, dY - d0, dZ - d0));
}

float dfOcclusion(vec3 sample, vec3 normal)
{
    float N = 1.0;
    return clamp(dfDist(sample + normal * N) / N, 0.0, 1.0);
}

float trace(inout vec3 pos, vec3 dir, out vec3 normal)
{
    int steps = 0;
    for (int i = 0; i < MAX_STEPS; i++)
    {
        steps++;
        float d = dfDist(pos);
        pos += d * dir * 1.0;
        
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
    vec3 opos = vec3(4.5,sin(iGlobalTime * 0.4) * 3.0 + 2.0,-7.0 + iGlobalTime * 3.0);
    vec3 pos = opos;
    vec3 dir = normalize(vec3((fragCoord.x - iResolution.x * 0.5) / iResolution.y, fragCoord.y / iResolution.y - 0.5, 1.0));
    vec3 normal;
    
    float steps = trace(pos, dir, normal);
    float occ = dfOcclusion(pos, normal);
    float fogAmt = 1.0 - exp(-distance(opos, pos) * 0.01);
    vec3 fogCol = vec3(0.2, 0.14, 0.18);
    
    vec3 diffuse = vec3(0.4, 0.5, 0.6) * dot(normal, normalize(vec3(1.0, 0.3, -1.0)));
    vec3 ambient = vec3(0.4, 0.2, 0.1);
    vec3 color = (ambient + diffuse) * vec3(1.0 - steps) + pow(1.0 - occ, 1.5) * vec3(1.0, 0.9, 0.8) * 0.8;
    
    
    color = mix(color, fogCol, fogAmt);
    color = (1.0 - exp(-color * 1.5)) * 1.3;
	fragColor = vec4(color, 1.0);
}

//_______________________________________________________________________________________________________





void main( void)
{
	mainImage(gl_FragColor, gl_FragCoord.xy);
}