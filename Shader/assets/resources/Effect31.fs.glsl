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

// Created by Andrew Wild - akohdr/2016
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.

// Examples of generation and traversal of primitive line segments in interval 0<=t<=1

// comment to hide output
#define SHOW_GRN_LINES
#define SHOW_BLU_LINES
#define SHOW_CURSORS
#define BLOOM

#define RED vec4(1.,.5,0,1)
#define GRN vec4(0,.5,0,1)
#define BLU vec4(0,0,1,1)
#define BLK vec4(0,0,0,1)

#define PI  3.14159265358979
#define PI2 6.28318530717858

vec2 rot2D(vec2 p, float a) 
{
    vec3 csa = vec3(cos(a),-sin(a),0);
               csa.z = -csa.y;
    return p * mat2( csa.xyzx);
}

           
// convert (x,y) to polar coordinate (r,a)
vec2 polar(vec2 p)
{
    float x = p.x,  
          y = p.y,
          a = atan(abs(y/x)),
          r = sqrt(x*x+y*y);
    
    // quadrant adjustment
    a = x>0. ? y>0. ?    a : PI2-a :
               y>0. ? PI-a :  PI+a;
                   
	return vec2(r, a);    
}


void antialias(inout vec4 k, float d, float w)
{
    float w1 = max(.2,.5*w),
          s  = w1/(d+2e-9);
    	  s += w1/(d-3e-9);
    
    k += vec4(1)*s;
}


float dLine(vec2 p, vec2 a, vec2 b) 
{
    b -= a;  
    p -= a;
    return length (p - clamp (dot (p, b) / dot (b, b), .0, 1.) * b);
}


vec2 linePos(vec2 a,vec2 b, float t)
{
    vec2 d = a - b,
         s = -d / d;
    float g = s.y / s.x,
          d1 = 1. - t;
    vec2 l = g * d1 * d;
    return b + l;
}

// temporal straight line t steps from a -> b
float dLine(vec2 p, vec2 a, vec2 b, float t) 
{
    return dLine(p, a, linePos(a,b,t));
}

// standard circle
float dCircle(vec2 p, vec2 a, float r, float w)
{
    float w2 = w/2.,
           l = length(p-a);
    return (l>r) ? abs((l-r)+w2): abs((r-l)-w2);
}


vec2 cirPos(vec2 a, float r, float t)
{
    return a+r*vec2(cos(PI2*t),sin(PI2*t));
}


// circular arc (anti clockwise) t steps from s toward full circle
float dCircle(vec2 p, vec2 a, float r, float w, float t, float s)
{
    vec2 pa = rot2D(p-a,PI2*s),
        pol = polar(pa);
    float l = length(pa),
         w2 = w/2.;
    
    return (pol.x>r+w || pol.y > PI2*t) ? 1e9 : 
    		(l>r) ? abs((l-r)+w2) : abs((r-l)-w2);
}


// optimized version of quadratic bezier curve position
vec2 bzPos(float t, vec2 a, vec2 b, vec2 c) 
{
    float mT = 1.-t;
//    vec2 pos = a * 1.      * mT*mT +
//               b * 2.* t   * mT    + 
//               c * 1.* t*t          ;
    return a *           mT*mT +
           b * 2.* t   * mT    + 
           c *     t*t          ;
}


// standard math version
vec2 bzPos_Math(float t, vec2 a, vec2 b, vec2 c) {  
    // b is control point a,c endpoints
    
    t = 1.-t;
//    vec3 tv = vec3(1, t, t*t);   // forgot to reverse tv
    vec3 tv = vec3(t*t, t, 1);
    
    const mat3 bz2D = mat3( 1, 0, 0,
                           -2, 2, 0,
                            1,-2, 1);

    // pad mat3 since no 2x3 matrices
    mat3 m_xy = mat3(a.x, b.x, c.x,
                     a.y, b.y, c.y,
                     0,   0,   0   );
   
	vec3 v3 = tv * (bz2D * m_xy);	// are padded mat3 op more efficient on GPU?
    return v3.xy;
}


// bezier curve abc built from segments dt steps from a -> c
float dBezierSegs(vec2 p, vec4 ac, vec2 b, float dt) {
    float d = 9999.;
    vec2 a = ac.xy, c = ac.zw, q = a, r;
    
    for(float t=0.; t<=1.; t+=.03) {
        r = bzPos(t,a,b,c);
        d = min(d, dLine(p,q,r));
        q = r;
        if(t>dt) return d;
    }
    
    return d;
}


void mainImage( out vec4 k, in vec2 p )
{
    float t = iGlobalTime,
         st = .5-.5*cos(t),
          w = 3.;
    
	vec2 ir = iResolution.xy,
          a = ir * vec2(.15),
          b = ir * vec2(.8),
          c = ir * vec2(.3,.8),
         dx = ir * vec2(.3,0),
//          q = iMouse.z>0. ? iMouse.xy : b;
          q = iMouse.x>0. ? iMouse.xy : b;
    float cs = q.x/ir.x;
        
    vec4 ka = BLK;
#ifdef SHOW_GRN_LINES
    // antialiases lines
    antialias(ka, dBezierSegs(p,vec4(a,c),q,1.), w);
    antialias(ka, dLine(p,a+dx,c+dx), w);
    antialias(ka, dCircle(p, a+vec2(2,.5)*dx.xx, a.x,w), w);
#endif 
    
#ifdef BLOOM
    w = max(2., 15.*st);
#else
    w = 2.;
#endif
    float w2 = w/2.;
    
    vec4 kt = BLK;
#ifdef SHOW_BLU_LINES
    // temporal lines
    antialias(kt, dBezierSegs(p,vec4(a,c),q,st), w);
    antialias(kt, dLine(p,a+dx,c+dx,st), w);
    antialias(kt, dCircle(p, a+vec2(2,.5)*dx.xx, a.x+w2, w, st, cs), w);
#endif 
    
    vec4 kc = BLK;
#ifdef SHOW_CURSORS
    // cursor points
    antialias(kc, dCircle(p, q, 2.,w), w);
    antialias(kc, dCircle(p, bzPos(st, a, q, c), 2., w), w);
    antialias(kc, dCircle(p, linePos(a+dx,c+dx, st), 2., w), w);
    antialias(kc, dCircle(p, cirPos(a+vec2(2,.5)*dx.xx, a.x, st-cs), 2., w), w);
#endif 
    
	// GRN line is fixed line primitive for interval 0<t<1
    // BLU line temporal section for interval 0<t
    k = mix(mix(GRN*ka,BLU*kt,.5),RED*kc,.5);
}






//_______________________________________________________________________________________________________



void main( void)
{
	mainImage(gl_FragColor, gl_FragCoord.xy);
}