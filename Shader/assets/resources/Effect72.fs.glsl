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

const float EXPOSURE = 12.0;
const float OMNI_LIGHT = 0.1;
const float FLOOR_REFLECTION = 0.15;

const int NUM_LIGHTS = 10;

const float PI = 3.1415926535897932384626433832795;
const float TAU = 2.0 * PI;
const float BIG = 1e30;
const float EPSILON = 1e-10;
const float THETA = (1.0 + sqrt(5.0)) / 2.0;
const float INV_THETA = 1.0 / THETA;

struct Ray
{
    vec3 o;
    vec3 d;
};
    
struct Intersection
{
    float dist;
    vec3 normal;
};

struct Result
{
    Intersection start;
    Intersection end;
};
    
struct Range
{
	float start;
    float end;
};
    
struct Light
{
    vec3 d;
    vec3 c;
    float a;
};
    
Light lights[NUM_LIGHTS];
    
mat4 rotateX(float v)
{
    float c = cos(v);
    float s = sin(v);
    
    return mat4(
        1.0, 0.0, 0.0, 0.0,
        0.0,   c,   s, 0.0,
        0.0,  -s,   c, 0.0,
        0.0, 0.0, 0.0, 1.0
    );
}

mat4 rotateY(float v)
{
    float c = cos(v);
    float s = sin(v);
    
    return mat4(
          c, 0.0,  -s, 0.0,
        0.0, 1.0, 0.0, 0.0,
          s, 0.0,   c, 0.0,
        0.0, 0.0, 0.0, 1.0
    );
}

mat4 rotateZ(float v)
{
    float c = cos(v);
    float s = sin(v);
    
    return mat4(
          c,   s, 0.0, 0.0,
         -s,   c, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0
    );
}

float insideCone(vec3 direction, float angle, vec3 o)
{
    float oz = dot(o, direction);
    vec3 oxy = o - direction * oz;
    float c = dot(oxy, oxy) / (angle * angle) - (oz * oz);
    return smoothstep(20.0, -50.0, c);
}

Range cone(vec3 direction, float angle, Ray ray)
{
    float dz = dot(ray.d, direction);
    float oz = dot(ray.o, direction);
    vec3 dxy = ray.d - direction * dz;
    vec3 oxy = ray.o - direction * oz;
    
    float a = dot(dxy, dxy) - (dz * dz * angle * angle);
    float b = dot(dxy, oxy) - (dz * oz * angle * angle);
    float c = dot(oxy, oxy) - (oz * oz * angle * angle);
    
    float p = 2.0 * b / a;
    float q = c / a;
    
    float r = p * p / 4.0 - q;
    
    Range result;
    result.start = BIG;
    result.end = -BIG;
    
    if (r >= 0.0)
    {
        float m = -p / 2.0;
        float sr = sqrt(r);
            
        if (c < 0.0)
        {
			// Inside
            if (m + sr < 0.0)
            {
                // Both solutions behind us
                result.start = 0.0;
                result.end = BIG;
            }
            else if (m - sr < 0.0)
            {
                // One solution behind us
                result.start = 0.0;
                result.end = m + sr;
            }
            else
            {
                // Both solutions ahead
                result.start = 0.0;
            	result.end = m - sr;
            }
        }
        else
        {
            // Outside
            if (m + sr < 0.0)
            {
                // Both solutions behind us
                return result;
            }
            else if (m - sr < 0.0)
            {
                // One solution behind us
                result.start = m + sr;
                result.end = BIG;
            }
            else
            {
                // Both solutions ahead
                result.start = m - sr;
            	result.end = m + sr;
            }
        }
    }
    
    return result;
}

Result plane(vec3 pos, vec3 normal, Ray ray)
{
    ray.o -= pos;
    
    float rdn = dot(ray.d, normal);
    float ron = dot(ray.o, normal);
    
    Result result;
    result.start.normal = normal;
    result.end.normal = normal;
    
    if (ron > 0.0)
    {
        // Outside
        result.start.dist = BIG;
        result.end.dist = -BIG;
        
        if (abs(rdn) > EPSILON)
        {
            float d = -ron / rdn;
            
            if (d > 0.0)
            {
                result.start.dist = d;
                result.end.dist = BIG;
            }
            else
            {
                result.start.dist = -BIG;
                result.end.dist = d;
            }
        }
    }
    else
    {
        // Inside
        result.start.dist = -BIG;
        result.end.dist = BIG;
        
        if (abs(rdn) > EPSILON)
        {
            float d = -ron / rdn;
            
            if (d > 0.0)
            {
                result.start.dist = -BIG;
                result.end.dist = d;
            }
            else
            {
                result.start.dist = d;
                result.end.dist = BIG;
            }
        }
    }
    return result;
}

float inverseSquare(vec3 p)
{
    return 1.0 / dot(p, p);
}

float inverseSquareAntiderivative(Ray ray, float t)
{
    vec3 o = ray.o;
    vec3 d = ray.d;
    
    // Shoutout to Wolfram Alpha
    float a = t * dot(d, d) + dot(d, o);
    float b1 = d.x * d.x * dot(o.yz, o.yz);
    float b2 = 2.0 * d.x * o.x * dot(o.yz, d.yz);
    float b3 = o.x * o.x * dot(d.yz, d.yz);
    float b4 = (o.y * d.z - d.y * o.z) * (o.y * d.z - d.y * o.z);
    float b = sqrt(b1 - b2 + b3 + b4);
    return atan(a / b) / b;
}

float inverseSquareIntegral(Ray ray, float start, float end)
{
    return inverseSquareAntiderivative(ray, end) - inverseSquareAntiderivative(ray, start);
}

vec3 getLight(vec3 pos)
{
    vec3 color = vec3(inverseSquare(pos) * OMNI_LIGHT * 2.0);
    for (int i = 0; i < NUM_LIGHTS; i++)
    {
        color += lights[i].c * inverseSquare(pos) * insideCone(lights[i].d, lights[i].a, pos);
    }
    return color;
}

vec3 renderVolumetric(Ray ray, float maxDist)
{
    vec3 color = vec3(inverseSquareIntegral(ray, 0.0, maxDist) * OMNI_LIGHT);
    
    const int i = 6;
    for (int i = 0; i < NUM_LIGHTS; i++)
    {
        Range r = cone(lights[i].d, lights[i].a, ray);
        r.end = min(r.end, maxDist);
        
        if (r.end > r.start)
        {
            float boost = mix(1.0, 18.0, insideCone(lights[i].d, lights[i].a, ray.o));
            
            color += inverseSquareIntegral(ray, r.start, r.end) * lights[i].c * boost;
        }
    }
    
    return color;
}

vec3 floorTexture(vec3 pos)
{
    pos.z += pos.x * 0.25;
    return fract(pos.x * 0.1) > fract(pos.z * 0.1) ? vec3(1.0) : vec3(0.7);
}

float floorGloss(vec3 pos)
{
    pos.x += pos.z * 2.0;
    return texture2D(iChannel1, pos.xz * 0.2).x * 0.5 + 0.75;
}

vec3 renderScene(Ray ray)
{
    Result r = plane(vec3(0.0, -18.0, 0.0), vec3(0.0, 1.0, 0.0), ray);
    
    if (r.start.dist > 0.0 && r.start.dist < r.end.dist)
    {
        vec3 pos = ray.o + ray.d * r.start.dist;
        
        Ray reflectedRay;
        reflectedRay.o = pos;
        reflectedRay.d = ray.d * vec3(1, -1, 1);
        
        vec3 volumetric = renderVolumetric(ray, r.start.dist);
        vec3 reflectedVolumetric = renderVolumetric(reflectedRay, BIG);
        
        vec3 color = -normalize(pos).y * getLight(pos) * 30.0 * floorTexture(pos);
        float gloss = floorGloss(pos);
        
        return volumetric + mix(color, reflectedVolumetric, FLOOR_REFLECTION * gloss);
    }
    else
    {
    	return renderVolumetric(ray, BIG);
    }
}

vec3 toneMap(vec3 color)
{
    return 1.0 - exp(-color * EXPOSURE);
}

void setUpLights()
{
    mat4 m = rotateX(TAU * iGlobalTime * 0.05) * rotateY(TAU * iGlobalTime * 0.09);
    
    lights[0].d = normalize(m * vec4(1, 1, 1, 0)).xyz;
    lights[1].d = normalize(m * m * vec4(1, 1, -1, 0)).xyz;
    lights[2].d = normalize(m * vec4(1, -1, 1, 0)).xyz;
    lights[3].d = normalize(m * m * vec4(1, -1, -1, 0)).xyz;
    lights[4].d = normalize(m * vec4(0, INV_THETA, THETA, 0)).xyz;
    lights[5].d = normalize(m * m * vec4(0, INV_THETA, -THETA, 0)).xyz;
    lights[6].d = normalize(m * vec4(INV_THETA, THETA, 0, 0)).xyz;
    lights[7].d = normalize(m * m * vec4(INV_THETA, -THETA, 0, 0)).xyz;
    lights[8].d = normalize(m * vec4(THETA, 0, INV_THETA, 0)).xyz;
    lights[9].d = normalize(m * m * vec4(-THETA, 0, INV_THETA, 0)).xyz;
    
    lights[0].c = normalize(vec3(1, 1, 1) * 0.5 + 0.7);
    lights[1].c = normalize(vec3(1, 1, -1) * 0.5 + 0.7);
    lights[2].c = normalize(vec3(1, -1, 1) * 0.5 + 0.7);
    lights[3].c = normalize(vec3(1, -1, -1) * 0.5 + 0.7);
    lights[4].c = normalize(vec3(0, INV_THETA, THETA) * 0.5 + 0.7);
    lights[5].c = normalize(vec3(0, INV_THETA, -THETA) * 0.5 + 0.7);
    lights[6].c = normalize(vec3(INV_THETA, THETA, 0) * 0.5 + 0.7);
    lights[7].c = normalize(vec3(INV_THETA, -THETA, 0) * 0.5 + 0.7);
    lights[8].c = normalize(vec3(THETA, 0, INV_THETA) * 0.5 + 0.7);
    lights[9].c = normalize(vec3(-THETA, 0, INV_THETA) * 0.5 + 0.7);
    
    for (int i = 0; i < NUM_LIGHTS; i++)
    {
        lights[i].a = texture2D(iChannel0, vec2(float(i) * 0.18, 0.0)).x * 0.3 + 0.05;
    }
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{   
    setUpLights();
    
    Ray ray;
    ray.o = vec3(sin(iGlobalTime * 0.5) * 5.0, -12.5 + sin(iGlobalTime * 0.6) * 2.5, -25.0);
    ray.d = normalize(rotateX(-sin(iGlobalTime * 0.23) * 0.1) *
                      rotateZ(sin(iGlobalTime * 0.33) * 0.1) *
                      vec4((fragCoord.xy - iResolution.xy * 0.5) / iResolution.y, 0.7, 0.0)).xyz;
    
   	vec3 color = renderScene(ray);
    color = toneMap(color);
    fragColor = vec4(color, 1.0);
}
//_______________________________________________________________________________________________________





void main( void)
{
	mainImage(gl_FragColor, gl_FragCoord.xy);
}