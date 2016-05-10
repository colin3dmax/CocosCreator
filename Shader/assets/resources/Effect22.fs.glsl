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

//#define MOUSE_CURVE
#define MOUSE_MOVE

#define MAIN_BLOOM_ITERATIONS 10
#define MAIN_BLOOM_SIZE 0.01

#define REFLECTION_BLUR_ITERATIONS 10
#define REFLECTION_BLUR_SIZE 0.05

#define WIDTH 0.48
#define HEIGHT 0.3
#define CURVE 3.0

#define BEZEL_COL vec4(0.8, 0.8, 0.6, 0.0)
#define PHOSPHOR_COL vec4(0.2, 1.0, 0.2, 0.0)
#define AMBIENT 0.2

#define NO_OF_LINES iResolution.y*HEIGHT
#define SMOOTH 0.004


// using normal vectors of a sphere with radius r
vec2 crtCurve(vec2 uv, float r) 
{
        uv = (uv - 0.5) * 2.0;// uv is now -1 to 1
    	uv = r*uv/sqrt(r*r -dot(uv, uv));
        uv = (uv / 2.0) + 0.5;// back to 0-1 coords
        return uv;
}

float roundSquare(vec2 p, vec2 b, float r)
{
    return length(max(abs(p)-b,0.0))-r;
}

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

// Calculate normal to distance function and move along
// normal with distance to get point of reflection
vec2 borderReflect(vec2 p, float r)
{
    float eps = 0.0001;
    vec2 epsx = vec2(eps,0.0);
    vec2 epsy = vec2(0.0,eps);
    vec2 b = (1.+vec2(r,r))* 0.5;
    r /= 3.0;
    
    p -= 0.5;
    vec2 normal = vec2(roundSquare(p-epsx,b,r)-roundSquare(p+epsx,b,r),
                       roundSquare(p-epsy,b,r)-roundSquare(p+epsy,b,r))/eps;
    float d = roundSquare(p, b, r);
    p += 0.5;
    return p + d*normal;
}

// Some Plasma stolen from dogeshibu for testing
float somePlasma(vec2 uv)
{
    if(uv.x < 0.0 || uv.x > 1.0 ||  uv.y < 0.0 || uv.y > 1.0) return 0.0;
    
    float scln = 0.5 - 0.5*cos(uv.y*3.14*NO_OF_LINES); // scanlines
    uv *= vec2(80, 24); // 80 by 24 characters
    uv = ceil(uv);
    uv /= vec2(80, 24);
    
    float color = 0.0;
    color += 0.7*sin(0.5*uv.x + iGlobalTime/5.0);
    color += 3.0*sin(1.6*uv.y + iGlobalTime/5.0);
    color += 1.0*sin(10.0*(uv.y * sin(iGlobalTime/2.0) + uv.x * cos(iGlobalTime/5.0)) + iGlobalTime/2.0);
    float cx = uv.x + 0.5*sin(iGlobalTime/2.0);
    float cy = uv.y + 0.5*cos(iGlobalTime/4.0);
    color += 0.4*sin(sqrt(100.0*cx*cx + 100.0*cy*cy + 1.0) + iGlobalTime);
    color += 0.9*sin(sqrt(75.0*cx*cx + 25.0*cy*cy + 1.0) + iGlobalTime);
    color += -1.4*sin(sqrt(256.0*cx*cx + 25.0*cy*cy + 1.0) + iGlobalTime);
    color += 0.3 * sin(0.5*uv.y + uv.x + sin(iGlobalTime));
    return scln*floor(3.0*(0.5+0.499*sin(color)))/3.0; // vt220 has 2 intensitiy levels
}

void mainImage(out vec4 fragColor, in vec2 fragCoord )
{
    vec4 c = vec4(0.0, 0.0, 0.0, 0.0);
    
    vec2 uv = fragCoord.xy / iResolution.xy;
	// aspect-ratio correction
	vec2 aspect = vec2(1.,iResolution.y/iResolution.x);
	uv = 0.5 + (uv -0.5)/ aspect.yx;
    
#ifdef MOUSE_CURVE
    float r = 1.5*exp(1.0-iMouse.y/iResolution.y);
#else
    float r = CURVE;
#endif
        
    // Screen Layer
    vec2 uvS = crtCurve(uv, r);
#ifdef MOUSE_MOVE
    uvS.x -= iMouse.x/iResolution.x - 0.5;
#endif

    // Screen Content
    vec2 uvC = (uvS - 0.5)* 2.0; // screen content coordinate system
    uvC *= vec2(0.5/WIDTH, 0.5/HEIGHT);
    uvC = (uvC / 2.0) + 0.5;
    
    c += PHOSPHOR_COL * somePlasma(uvC);
    
    // Simple Bloom
    float B = float(MAIN_BLOOM_ITERATIONS*MAIN_BLOOM_ITERATIONS);
    for(int i=0; i<MAIN_BLOOM_ITERATIONS; i++)
    {
        float dx = float(i-MAIN_BLOOM_ITERATIONS/2)*MAIN_BLOOM_SIZE;
        for(int j=0; j<MAIN_BLOOM_ITERATIONS; j++)
        {
            float dy = float(j-MAIN_BLOOM_ITERATIONS/2)*MAIN_BLOOM_SIZE;
            c += PHOSPHOR_COL * somePlasma(uvC + vec2(dx, dy))/B;
        }
    }           
    
    // Ambient
    c += max(0.0, AMBIENT - 0.3*distance(uvS, vec2(0.5,0.5))) *
        smoothstep(SMOOTH, -SMOOTH, roundSquare(uvS-0.5, vec2(WIDTH, HEIGHT), 0.05));
  

    // Enclosure Layer
    vec2 uvE = crtCurve(uv, r+0.25);
#ifdef MOUSE_MOVE
    uvE.x -= iMouse.x/iResolution.x - 0.5;
#endif
    
    // Inner Border
    for( int i=0; i<REFLECTION_BLUR_ITERATIONS; i++)
    {
    	vec2 uvR = borderReflect(uvC + (vec2(rand(uvC+float(i)), rand(uvC+float(i)+0.1))-0.5)*REFLECTION_BLUR_SIZE, 0.05) ;
    	c += (PHOSPHOR_COL - BEZEL_COL*AMBIENT) * somePlasma(uvR) / float(REFLECTION_BLUR_ITERATIONS) * 
	        smoothstep(-SMOOTH, SMOOTH, roundSquare(uvS-vec2(0.5, 0.5), vec2(WIDTH, HEIGHT), 0.05)) * 
			smoothstep(SMOOTH, -SMOOTH, roundSquare(uvE-vec2(0.5, 0.5), vec2(WIDTH, HEIGHT) + 0.05, 0.05));
    }
               
  	c += BEZEL_COL * AMBIENT * 0.7 *
        smoothstep(-SMOOTH, SMOOTH, roundSquare(uvS-vec2(0.5, 0.5), vec2(WIDTH, HEIGHT), 0.05)) * 
        smoothstep(SMOOTH, -SMOOTH, roundSquare(uvE-vec2(0.5, 0.5), vec2(WIDTH, HEIGHT) + 0.05, 0.05));
    
    // Corner
  	c -= (BEZEL_COL )* 
        smoothstep(-SMOOTH*2.0, SMOOTH*10.0, roundSquare(uvE-vec2(0.5, 0.5), vec2(WIDTH, HEIGHT) + 0.05, 0.05)) * 
        smoothstep(SMOOTH*2.0, -SMOOTH*2.0, roundSquare(uvE-vec2(0.5, 0.5), vec2(WIDTH, HEIGHT) + 0.05, 0.05));

    // Outer Border
    c += BEZEL_COL * AMBIENT *
       	smoothstep(-SMOOTH, SMOOTH, roundSquare(uvE-vec2(0.5, 0.5), vec2(WIDTH, HEIGHT) + 0.05, 0.05)) * 
        smoothstep(SMOOTH, -SMOOTH, roundSquare(uvE-vec2(0.5, 0.5), vec2(WIDTH, HEIGHT) + 0.15, 0.05)); 


    fragColor = c;
}




//_______________________________________________________________________________________________________

//_______________________________________________________________________________________________________



void main( void)
{
	mainImage(gl_FragColor, gl_FragCoord.xy);
}