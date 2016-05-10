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
// Signed Distance to a Quadratic Bezier Curve
// - Adam Simmons (@adamjsimmons) 2015
//
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License
//
// Inspired by http://www.pouet.net/topic.php?which=9119
// and various shaders by iq, T21, and demofox
// 
// I needed the -signed- distance to a quadratic bezier
// curve but couldn't find any examples online that
// were both fast and precise. This is my solution.
//
// v1 - Initial release
// v2 - Faster and more robust sign computation
//

// Test if point p crosses line (a, b), returns sign of result
float testCross(vec2 a, vec2 b, vec2 p) {
    return sign((b.y-a.y) * (p.x-a.x) - (b.x-a.x) * (p.y-a.y));
}

// Determine which side we're on (using barycentric parameterization)
float signBezier(vec2 A, vec2 B, vec2 C, vec2 p)
{ 
    vec2 a = C - A, b = B - A, c = p - A;
    vec2 bary = vec2(c.x*b.y-b.x*c.y,a.x*c.y-c.x*a.y) / (a.x*b.y-b.x*a.y);
    vec2 d = vec2(bary.y * 0.5, 0.0) + 1.0 - bary.x - bary.y;
    return mix(sign(d.x * d.x - d.y), mix(-1.0, 1.0, 
        step(testCross(A, B, p) * testCross(B, C, p), 0.0)),
        step((d.x - d.y), 0.0)) * testCross(A, C, B);
}

// Solve cubic equation for roots
vec3 solveCubic(float a, float b, float c)
{
    float p = b - a*a / 3.0, p3 = p*p*p;
    float q = a * (2.0*a*a - 9.0*b) / 27.0 + c;
    float d = q*q + 4.0*p3 / 27.0;
    float offset = -a / 3.0;
    if(d >= 0.0) { 
        float z = sqrt(d);
        vec2 x = (vec2(z, -z) - q) / 2.0;
        vec2 uv = sign(x)*pow(abs(x), vec2(1.0/3.0));
        return vec3(offset + uv.x + uv.y);
    }
    float v = acos(-sqrt(-27.0 / p3) * q / 2.0) / 3.0;
    float m = cos(v), n = sin(v)*1.732050808;
    return vec3(m + m, -n - m, n - m) * sqrt(-p / 3.0) + offset;
}

// Find the signed distance from a point to a bezier curve
float sdBezier(vec2 A, vec2 B, vec2 C, vec2 p)
{    
    B = mix(B + vec2(1e-4), B, abs(sign(B * 2.0 - A - C)));
    vec2 a = B - A, b = A - B * 2.0 + C, c = a * 2.0, d = A - p;
    vec3 k = vec3(3.*dot(a,b),2.*dot(a,a)+dot(d,b),dot(d,a)) / dot(b,b);      
    vec3 t = clamp(solveCubic(k.x, k.y, k.z), 0.0, 1.0);
    vec2 pos = A + (c + b*t.x)*t.x;
    float dis = length(pos - p);
    pos = A + (c + b*t.y)*t.y;
    dis = min(dis, length(pos - p));
    pos = A + (c + b*t.z)*t.z;
    dis = min(dis, length(pos - p));
    return dis * signBezier(A, B, C, p);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 p = (2.0*fragCoord.xy-iResolution.xy)/iResolution.y;
    vec2 m = mix((2.0*iMouse.xy-iResolution.xy)/iResolution.y,
        vec2(cos(iGlobalTime * 1.2) * 0.8, 0.0), step(iMouse.z, 0.0));
    
    // Define the control points of our curve
    vec2 A = vec2(0.0, -0.6), C = vec2(0.0, +0.6), B = (4.0 * m - A - C) / 2.0;
    
    // Render the control points
    float d = min(distance(p, A),(min(distance(p, m),distance(p, C))));
    if (d < 0.04) { fragColor = vec4(1.0 - smoothstep(0.025, 0.034, d)); return; }
    
    // Get the signed distance to bezier curve
    d = sdBezier(A, B, C, p);
    
    // Visualize the distance field using iq's orange/blue scheme
    fragColor = vec4(1.0) - sign(d)*vec4(0.1,0.4,0.7,1.0);
    fragColor *= (1.0 - exp(-4.0*abs(d))) * (0.8 + 0.2*cos(140.*d));
    fragColor = mix(fragColor, vec4(1.0), 1.0-smoothstep(0.0,0.02,abs(d)) );
}

//_______________________________________________________________________________________________________





void main( void)
{
	mainImage(gl_FragColor, gl_FragCoord.xy);
}