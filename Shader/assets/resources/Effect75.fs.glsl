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

/*

------------MODIFIED!!!!!!!!!!-------------- 
wanted to add a movie to this nice cinema looking shader.
None of the shading techniques are created by me.


----------ORIGINAL HERE-----------------
Original version : https://www.shadertoy.com/view/lsfGDN




Copyright 2015 Valtteri "tsone" Heikkilä

This work is licensed under the Creative Commons Attribution 4.0 International License.
To view a copy of this license, visit http://creativecommons.org/licenses/by/4.0/

*/

#define PI			3.141592653589793
#define SQRT2		1.414213562373095
#define INVSQRT2	0.707106781186548

// Set 1 to treat intensity as power (varies by rectangle area).
#define VARY_LIGHT_INTENSITY 0
// Set 1 to detect HDR range overflow.
#define HDR_DETECTOR 0
// HDR range maximum. (0 is minimum.)
#define HDR_MAX 7.0


struct Material
{
    float roughness;
    float tailamount;
    float tailtheta;
    float F0;
    vec3 basecolor;
  	vec3 specularcolor;
};

struct RectLight
{
    vec3 position;
    mat3 basis;
    vec2 size;
    vec3 intensity;
    float attenuation;
};

const vec3 roomsize = vec3(15.0, 6.0, 15.0);
    
Material mat = Material(
    0.163, // Roughness.
    0.577, // Tail amount.
    PI/2.0/3.0, // Specular cone tail theta angle.
    0.0205, // Schlick Fresnel coefficient for zero viewing angle.
    vec3(1.00), // Base color.
   	vec3(0.45) // Specular color.
);

RectLight light = RectLight(
 	vec3(0.0, 6.0, -15.0), // Light position (center).
 	mat3( // Light basis.
    	1.0, 0.0, 0.0,
    	0.0, 1.0, 0.0,
    	0.0, 0.0, 1.0
	),
 	vec2(15.0, 0.6), // Light size.
    vec3(42.0), // Light intensity.
	2.13 // Constant attenuation at 0 distance.
);


float sqr(float x) { return x*x; }

// Approximate irradiance "weight" for a rectangular emitter.
// Uses distance function to rectangle and a Gaussian standard
// normal distribution (variance v^2 = 1/2) to approximate the
// illumination from the "cone". Result is weight in (0,1] in
// units 1/(m^2*sr). Parameter theta is the cone angle.
// NOTE: Intersection of cone and plane is a conic, but here
// distance to sphere is used. It's not accurate, particularly on
// glazing angles.
float RectLight_calcWeight(in vec3 P, in vec3 R, in RectLight light, float theta)
{
    // Intersect ray and light plane.
    float RoPlN = dot(R, light.basis[2]);
    float d = dot(light.basis[2], light.position - P) / RoPlN;
    if (d < 0.0 || RoPlN > 0.0) {
        // Intersection behind ray, or direction is away from plane.
    	return 0.0;
    }
    // PlC: Point on plane.
    vec3 PlC = P + d*R - light.position;
    // uvPl: UV coordinate on plane.
    vec2 PlUV = vec2(dot(PlC, light.basis[0]), dot(PlC, light.basis[1]));
    // r: Radius of cone at distance d.
    float r = d * tan(theta);
    // s: Rect size shifted by radius. This for weigth 1 inside the rect.
    vec2 s = max(light.size - 0.5*r, 0.0);
    // h: Distance from rect on plane.
    float h = length(max(abs(PlUV) - s, 0.0));
    // sr: Steradians from the sphere cap equation: sr = 2pi * (1-cos(a))
    float sr = 2.0*PI * (1.0 - cos(theta));
    // This distribution f(x) has variance v^2 = 1/2, hence
    // v = (1/2)^(1/2) = 2^(-1/2) = INVSQRT2. Using this we can
    // linearly map h = [0,2r] -> x = [0,3v]. Why 3v is to cover
    // approximately 100% of the distribution. 
    return exp(-sqr((3.0*INVSQRT2/2.0) * (h/r))) / (light.attenuation + sqr(d)*sr);
}

// TODO: No need to calculate Fresnel inside the function. Add as function param?
// TODO: Combine specular and tail calculation into one? Use other distribution?
vec3 RectLight_shade(in RectLight light, in Material material, in vec3 P, in vec3 N, in vec3 R, float NoR,vec3 test)
{
    // Schlick Fresnel.
    float Fr = material.F0 + (1.0-material.F0) * pow(1.2 - NoR, 4.);
    
    // Approximate specular/glossy.
    float theta = mix(PI*0.003, PI/2.0/3.0, material.roughness);
    float Cs = RectLight_calcWeight(P, R, light, theta);
    // Specular glossy tail. Using other than Gaussian could help. 
    float Cst = RectLight_calcWeight(P, R, light, material.tailtheta);
    
    // Crude hack for diffuse.
    // Average normal and inversed emitter direction to create
    // a vector W that points towards the light.
    vec3 W = normalize(N - light.basis[2]);
    float Cd = RectLight_calcWeight(P, W, light, PI/4.0);
	
    return light.intensity * mix(
        (Cd * max(dot(N, W), 0.0)) * material.basecolor,
        (mix(Cs, Cst, material.tailamount) * NoR) * material.specularcolor,
        Fr)*test*8.0;
}

// Simple tone mapping operation from Brian Karis.
// Output range hard-coded to 1. Reference:
// http://graphicrants.blogspot.ca/2013/12/tone-mapping.html
vec3 ToneMap(in vec3 c, float maxc)
{
#if HDR_DETECTOR
    if (c.r > maxc || c.g > maxc || c.b > maxc) {
    	return vec3(1.0, 0.0, 0.0);
    } else if (c.r < 0.0 || c.g < 0.0 || c.b < 0.0) {
    	return vec3(0.0, 1.0, 0.0);
    }
#endif
   	float v = max(c.r, max(c.g, c.b));
    return c / (1.0 + v / maxc);
}



vec3 Tex3D(in vec3 P, in vec3 N, float s)
{
    P *= s;
    mat3 tc = mat3(
        texture2D(iChannel0, P.yz).rgb,
        texture2D(iChannel0, P.xz).rgb,
        texture2D(iChannel0, P.xy).rgb
    );
    N = pow(abs(N), vec3(16.0));
    N = N / (N.x+N.y+N.z);
    return pow(tc*N, vec3(2.2)); // Gamma decode.
}

float Map(in vec3 P)
{
    // Room walls.
    vec3 t = roomsize - abs(vec3(P.x, P.y - roomsize.y, P.z));
    float d = min(t.x, min(t.y, t.z));
    
 
    // Repeated sphere.
    
    P.xz = mod(P.xz  + vec2(0., -0.75), 4.0);
   	P.y += 1.6;
    d = min(d, length(P - vec3(2.0, 3.25, 2.0)) - .7) ;
    
     P.xz = mod(P.xz  + vec2(0., -0.75), 4.0);
   	P.y += 1.6;
    float d2 = min(d, length(P - vec3(2.0, 3.5, 2.0)) - 1.2 ) ;
    
    d = min(d,d2);
    
       P.xz = mod(P.xz  + vec2(0., -0.75), 4.0);
   	P.y += 1.6;
    float d3 = min(d, length(P - vec3(2.0, 2.8, 1.0)) - 2.5) ;
   d = min(d,d3);
    
          P.xz = mod(P.xz  + vec2(0., -0.75), 4.0);
   	//P.y += 1.6;
    P.x-=0.1;
    float d4 = min(d, length(P - vec3(2.3, 3.5, 3.0)) - 1.6) ;
   d = min(d,d4);
    
    return d;
}

vec3 Gradient(in vec3 P)
{
    const vec3 d = vec3(0.05, 0.0, 0.0);
    return vec3(
        Map(P + d.xyy) - Map(P - d.xyy),
        Map(P + d.yxy) - Map(P - d.yxy),
        Map(P + d.yyx) - Map(P - d.yyx)
    );
}

float March(in vec3 P, in vec3 D)
{
    float t = 0.01;
    float m = 0.0;
    for (int i = 0; i < 72; ++i) {
        float d = Map(P + D*t);
        if (d <= 0.008) {
            break;
        }
        t += d + 0.004;
    }
    return t;
}

mat3 LookAt(in vec3 P, in vec3 focusP)
{
    vec3 up = vec3(0.0, 1.0, 0.0);
    vec3 dir = normalize(P - focusP);
    vec3 left = normalize(cross(up, dir));
    up = cross(dir, left);
    return mat3(left, up, dir);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
	vec2 uv = (2.0*fragCoord.xy - iResolution.xy) / iResolution.xx;
    float t = iGlobalTime;
    
    // Modify light.
    light.size.x = 0.1 + 14.6*(0.5+0.5);
    light.size.y = 0.1 + 5.6*(0.5+0.5);
    //light.position.z = -(0.5+0.5*sin(0.5*t))*roomsize.z;
    
#if VARY_LIGHT_INTENSITY
    // A bit hacky. Assume intensity is power, so it's adjust by area.
    light.intensity *= light.size.x*light.size.y / (13.0*4.0);
#endif

    // Camera position and basis.
    vec2 a = vec2(0.0, 0.0);

    a.x -= 0.1;
     a.y += .9;
    vec3 camP = vec3(14.0*sin(a.x), roomsize.y * (1.0 + 0.5*a.y), 24.0*sqr(cos(a.x)) - 11.0);
    mat3 camM = LookAt(camP, vec3(0.0, roomsize.y, 1.0-roomsize.z));
    
    // Cast ray and vignette.
    vec3 D = INVSQRT2*(uv.x*camM[0] + uv.y*camM[1]) - camM[2];
    vec3 P = camP + D;
    D = normalize(D);
    float vignette = 0.77 + 0.23*sqr(D.z);

    // March for surface point.
    float res = March(P, D);
    P = P + res * D;
    
    // Normal and reflection vectors.
    vec3 N = normalize(Gradient(P));
    float NoR = -dot(N, D);
    vec3 R = D + (2.0*NoR)*N;
    NoR = max(NoR, 0.0);
    R.x +=.44;
    R.y +=0.3;
    R.xy*=2.2;
    R.x*=0.48;
   
      vec3 test= texture2D(iChannel1,R.xy).xyz;
    // Modify material.
    vec3 texColor = Tex3D(P, N, 0.35);
    float maxv = max(texColor.r, max(texColor.g, texColor.b));
    mat.basecolor = min(0.33+maxv, 1.0) * vec3(1.0, 0.53, 0.32);
    //mat.roughness = res.y;
    
    vec3 C = vec3(0.0);
    if (P.z <= -roomsize.z+0.15) {
        if (abs(P.y-light.position.y) < light.size.y
            	&& abs(P.x-light.position.x) < light.size.x) {
    		C = vec3(HDR_MAX);
        } else {
            C = vec3(0.0);
        }
    } else {
    	C = RectLight_shade(light, mat, P, N, R, NoR,test);
    }
    
    C = C * vignette;
    C = ToneMap(C, HDR_MAX)*test;
    C = pow(C, vec3(0.5+test*0.1)); // Gamma encode.
	fragColor = vec4(C*0.25, 1.0);
}

//_______________________________________________________________________________________________________





void main( void)
{
	mainImage(gl_FragColor, gl_FragCoord.xy);
}