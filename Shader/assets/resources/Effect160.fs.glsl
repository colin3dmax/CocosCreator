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

float hash(float n) {
    return fract(sin(n)*4578.543123);
}

vec2 path(float z) {
    vec2 a = vec2(0);
    vec2 b = vec2(2.0*cos(z*.3), 0);
    
    if(iGlobalTime >= 0.0 && iGlobalTime <= 4.0){
        if(iGlobalTime <= 3.0) return a;
        return mix(a, b, mod(iGlobalTime, 1.0));
    } else return b;
}

float gTime() {
    float s;
    if(iGlobalTime <= 3.0) {
        s = 7.0;
    } else s = 15.;
    
    return s*iGlobalTime;
}

float dSegment(vec3 p, vec3 a, vec3 b, float r) {
    vec3 pa = p - a;
    vec3 ba = b - a;
    
    float h = clamp(dot(pa, ba)/dot(ba, ba), 0.0, 1.0);
    
    return length(pa - ba*h) - r;
}

float dObstacles(vec3 p, float diff) {
    p.xy -= path(p.z);
    float c = floor((p.z + diff)/(diff*2.0));
    float rnd = hash(c);
    p.z = mod(p.z + diff, diff*2.0) - diff;
    
    p.xy = p.yx;
    float o;
    if(iGlobalTime >= 0.0 && iGlobalTime <= 4.0) {
        if(iGlobalTime <= 3.0) o = 4.0;
        else o = mix(4.0, 0.0, mod(iGlobalTime, 1.0));
    } else o = 0.0;
    
    p.y += path(p.z).x - o - (rnd < .5 ? 0. : 2.0);
    return dSegment(p, vec3(5.5, 1., 0), vec3(-5.5, 1.0, 0), 0.25);   
}

vec2 opU(vec2 a, vec2 b) {
    return a.x < b.x ? a : b;
}

vec3 boxPos(vec3 p, float diff, float o) {
    vec3 bp = vec3(0., -1.0, gTime());
    float c = floor((p.z + diff)/diff*2.0);    
    float rnd = hash(c);
    
    bp.y = 1.8*cos(sin(iGlobalTime + o)*3. + iGlobalTime + o);
        
    return bp;
}

vec2 map(vec3 p) {
    // the tunnel distance estimate was taken from Shane's (https://www.shadertoy.com/view/MlXSWX)
    vec2 tun = abs(p.xy - path(p.z))*vec2(.4, .4);
    vec2 t = vec2(1. - max(tun.x, tun.y), 0.0);
    
    vec3 bp = boxPos(p, 2.5, 0.0);
    vec3 bp2 = boxPos(p, 2.5, 0.1);
    bp2.z += 0.5;
    
    bp.xy += path(bp.z);
    bp2.xy += path(bp2.z);
    
    vec2 s = vec2(min(length(p - bp2) - .25, dSegment(p, bp, bp2, .07)), 1.0);
    
    vec2 o = vec2(dObstacles(p, 2.5), 2.0);
    
    return opU(t, opU(s, o));
}

vec2 intersect(vec3 ro, vec3 rd) {
    float td = 0.;
    float mid = -1.;
    float tmax = 50.;
    
    for(int i = 0; i < 256; i++) {
        vec2 s = map(ro + rd*td);
        td += s.x;
        mid = s.y;
        if(abs(s.x) < 0.005 || td >= tmax) break;
    }
    
    if(td >= tmax) mid = -1.;
    return vec2(td, mid);
    
}

vec3 normal(vec3 p) {
    vec2 h = vec2(0.001, 0.0);
    vec3 n = vec3(
        map(p + h.xyy).x - map(p - h.xyy).x,
        map(p + h.yxy).x - map(p - h.yxy).x,
        map(p + h.yyx).x - map(p - h.yyx).x
	);
    
    return normalize(n);
}

// iq's ambient occlusion.
float ao(vec3 p, vec3 n) {
    float r = 0.0;
    float w = 1.0;
    float d;
    
    for(float i = 1.0; i < 6.6; i++) {
        d = i/6.0;
        r += w*(d - map(p + n*d).x);
        w *= .5;
    }
    
    return 1.0 - clamp(r, 0.0, 1.0);
}

vec3 lighting(vec3 p, vec3 lp, vec3 rd) {
    vec3 l = lp - p;
    float dist = max(length(l), 0.01);
    float atten = min(1./(1. + dist*0.5), 0.2);
    l /= dist;
    
    vec3 n = normal(p);
   	vec3 r = reflect(-l, n);
    
    float dif = clamp(dot(l, n), 0.0, 1.0);
    float spe = pow(clamp(dot(r, -rd), 0.0, 1.0), 8.0);
    float fre = pow(clamp(1.0 + dot(n, rd), 0.0, 1.0), 2.0);
    float dom = smoothstep(-1.0, 1.0, r.y);
    
    vec3 lin = vec3(0.2);
    lin += 1.0*dif*vec3(1, .97, .85);
    lin += 2.5*spe*vec3(1, .97, .85)*dif;
    lin += 2.5*fre*vec3(1);
    lin += 0.5*dom*vec3(1);
    
    return lin*atten*ao(p, n);
}

mat3 camera(vec3 e, vec3 l) {
    vec3 rl = vec3(sin(iGlobalTime), cos(iGlobalTime), 0);
    vec3 f = normalize(l - e);
    vec3 r = cross(rl, f);
    vec3 u = cross(f, r);
    
    return mat3(r, u, f);
}

vec4 render(vec3 ro, vec3 rd) {
    ro.z += gTime() - 2.0;
    vec3 la = ro + vec3(0, 0.0, 2.0);
    
    rd = camera(ro, la)*rd;
    
    vec3 lp1 = ro + vec3(0, 0, 1);
    vec3 lp2 = ro + vec3(0, 0, 5);
    
    la.xy += path(la.z);
    ro.xy += path(ro.z);
    
    vec3 col = vec3(.5);
    
    vec2 i = intersect(ro, rd);
    vec3 p = ro + rd*i.x;
    
	if (i.y == 0.0) { 
        vec2 guv = normal(p).y == 0.0 ? p.zy : p.xz - path(p.z);
        col = .45 + vec3(1)
            *smoothstep(-.05, .05,abs(fract(guv.x) - .5)*2.)
            *smoothstep(-.05, .05, abs(fract(guv.y) - .5)*2.);
    }
    if (i.y == 1.0) col = vec3(1, .1, 1)*.5;
    if (i.y == 2.0) col = vec3(0, .3, 1);
    
    if(i.y != -1.0) col *= lighting(p, lp1, rd)+lighting(p, lp2, rd);
    
    col = pow(col, vec3(.454545));
    
	return vec4(col, 1);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 uv = -1.0 + 2.0*(fragCoord.xy / iResolution.xy);
    uv.x *= iResolution.x/iResolution.y;
    
    vec3 ro = vec3(0, 0.0, -2);
    vec3 rd = normalize(vec3(uv, 2.0));
    
    
	fragColor = render(ro, rd);
}

void mainVR( out vec4 fragColor, in vec2 fragCoord, in vec3 fragRayOri, in vec3 fragRayDir )
{
    fragColor = render(fragRayOri, fragRayDir);
}
//_______________________________________________________________________________________________________





void main( void)
{
	mainImage(gl_FragColor, gl_FragCoord.xy);
}