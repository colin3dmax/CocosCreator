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

#define MAX_STEPS 32
#define EPS .001

float time = iGlobalTime;
const int MAGIC_BOX_ITERS = 16;
const float MAGIC_BOX_MAGIC = 0.65;

//https://www.shadertoy.com/view/4ljGDd - dgreensp

float magicBox(vec3 p) {
    // The fractal lives in a 1x1x1 box with mirrors on all sides.
    // Take p anywhere in space and calculate the corresponding position
    // inside the box, 0<(x,y,z)<1
    p = 1.0 - abs(1.0 - mod(p, 2.0));
    
    float lastLength = length(p);
    float tot = 0.0;
    // This is the fractal.  More iterations gives a more detailed
    // fractal at the expense of more computation.
    for (int i=0; i < MAGIC_BOX_ITERS; i++) {
      // The number subtracted here is a "magic" paremeter that
      // produces rather different fractals for different values.
      p = abs(p)/(lastLength*lastLength) - MAGIC_BOX_MAGIC;
      float newLength = length(p);
      tot += abs(newLength-lastLength);
      lastLength = newLength;
    }

    return tot;
}

// Tri-Planar blending function. Based on an old Nvidia tutorial.
vec3 tex3D( sampler2D tex, in vec3 p, in vec3 n ){
  
    n = max((abs(n) - 0.2)*7., 0.001); // max(abs(n), 0.001), etc.
    n /= (n.x + n.y + n.z );  
    
	return (texture2D(tex, p.yz)*n.x + texture2D(tex, p.zx)*n.y + texture2D(tex, p.xy)*n.z).xyz;
}

// Texture bump mapping. Four tri-planar lookups, or 12 texture lookups in total. I tried to 
// make it as concise as possible. Whether that translates to speed, or not, I couldn't say.
vec3 doBumpMap( sampler2D tx, in vec3 p, in vec3 n, float bf){
   
    const vec2 e = vec2(0.001, 0);
    
    // Three gradient vectors rolled into a matrix, constructed with offset greyscale texture values.    
    mat3 m = mat3( tex3D(tx, p - e.xyy, n), tex3D(tx, p - e.yxy, n), tex3D(tx, p - e.yyx, n));
    
    vec3 g = vec3(0.299, 0.587, 0.114)*m; // Converting to greyscale.
    g = (g - dot(tex3D(tx,  p , n), vec3(0.299, 0.587, 0.114)) )/e.x; g -= n*dot(n, g);
                      
    return normalize( n + g*bf ); // Bumped normal. "bf" - bump factor.
	
}

// A random 3x3 unitary matrix, used to avoid artifacts from slicing the
// volume along the same axes as the fractal's bounding box.
const mat3 M = mat3(0.28862355854826727, 0.6997227302779844, 0.6535170557707412,
                    0.06997493955670424, 0.6653237235314099, -0.7432683571499161,
                    -0.9548821651308448, 0.26025457467376617, 0.14306504491456504);

// Rotation
mat2 rot2D(float a){
    return mat2(cos(a), -sin(a),
                sin(a),  cos(a));       
}

// Sphere or moon in this case
float map(vec3 p){
    return length(p) - 1.; //min(s, s2);
}

// Raymarching
float trace(vec3 o, vec3 r, inout vec3 hitPos){
    float hit = 0.0;
    for(int i = 0; i<MAX_STEPS; i++){
        vec3 p = o + r * hit;
        float dist = map(p);
        if(dist < EPS) break;
        hit += dist * 0.5;
    }
    hitPos = o + hit*r;
    
    return hit;
}

// Normal mapping
vec3 getNormal( in vec3 p ){

    vec2 e = vec2(0.5773,-0.5773)*EPS;   //0.001;
    return normalize( e.xyy*map(p+e.xyy ) + e.yyx*map(p+e.yyx ) + 
                      e.yxy*map(p+e.yxy ) + e.xxx*map(p+e.xxx ));
}

// Specular highlights from an article I was looking at
// https://machinesdontcare.wordpress.com/2008/10/29/subsurface-scatter-shader/
float blinnPhongSpe(vec3 norm, vec3 dLight, float shine){
    vec3 halfVecAngle = normalize(vec3(norm + dLight));
    return pow(clamp(dot(norm, halfVecAngle), 0.0, 1.0), shine);
}
// Main
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Directional Light
    vec3 dLight = normalize(vec3(0.25, 0.8, 0.5));
    
    // Adjust and set up uv Coordinates
	vec2 uv = fragCoord.xy / iResolution.xy;
    uv = uv * 2.0 - 1.0;
    uv.x *= iResolution.x/iResolution.y;
    
    // Initializing fragColor
    fragColor = vec4(0.0);
    
    // Rotate Light a bit
    dLight.xz *= rot2D(time*.5);
    dLight.xy *= rot2D(time);
    
    // Create the ray with a bit of wide angle/fish eye lens effect
    vec3 r = normalize(vec3(uv, 1.0- dot(uv,uv) * 0.333)); // 
    
    // Camera origin
    vec3 o = vec3(0.0, 0.0, -2.0);
    
    // Rotate the ray and camera a look at function may be better...
    r.xz*=rot2D(time/2.-iMouse.x/50.);
    o.xz*=rot2D(time/2.-iMouse.x/50.);
    
    r.zy*=rot2D(time/3.);
    o.zy*=rot2D(time/3.);
    
    // Hit position for normal mapping
    vec3 hitPos = vec3(0.0);
    float t = trace(o, r, hitPos);
    
    // Sphere or background for
    float sphOrBg = map(o + r*t);
    
    // Get the normal
    vec3 norm = getNormal(hitPos);
    // Reset the normal using the bump map function
    norm = doBumpMap(iChannel0, hitPos*(1.0/3.0), norm, 0.025);
    
    // Diffuse
    float diff = clamp(dot(norm, dLight), 0.015, 1.0);
    // Specular
    float spec = blinnPhongSpe(norm, dLight, 180.);
    
    vec4 bg = vec4(0.0); //vec4(.69, .79, 1.0 , 1.0);
    //bg *= dot(dLight, r)*.5 + .5;
    vec3 p = 0.26*M*r;
    vec3 p2 = 0.24*M*r;
    
    float mb = magicBox(p2+time*.015);
    mb *= .025;
    // level of detail.
    //vec3(uv*3., 0.0);
    
    float result = magicBox(p+time*.01);
    // Scale to taste.  Also consider non-linear mappings.
    result *= 0.018;
    // Background color
    bg = vec4(result*result*mb,result*result*result*mb,result*result*result*result*mb,1.0);
    
    float fog = 1.0 / (1.0 + t * t * 0.1);
    if(abs(sphOrBg) < 0.5){
        // mixing for fog not nessecary here...
        fragColor = vec4(diff+spec); //mix(vec4(vec3(diff+spec), 1.0), bg, smoothstep(.2, .4, t*.03));
    }else
        fragColor = bg;
}

//_______________________________________________________________________________________________________





void main( void)
{
	mainImage(gl_FragColor, gl_FragCoord.xy);
}