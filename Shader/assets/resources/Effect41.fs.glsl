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
//
// Example showing sequencing of temporal drawing primitives to mimic hand printed text
//
// Font 'eidos' is more or less the same as previous examples with few ordering tweaks
// and addition of circle starting and direction meta information.
//

// use of temporal primitives refer https://www.shadertoy.com/view/lstXDj
#define TEMPORAL_TEXT
#define STAGGERED

// Use debug flag to colour primitives RGB
//#define DEBUG

#define INK ORG
//#define INK GRN
//#define LINE_WIDTH 1.1
#define LINE_WIDTH 5.1

// Select screen mode text res. size
//#define MODE vec2(14,7)
#define MODE vec2(26,9)
//#define MODE vec2(40,25)

// Advise full screen and/or resizing chars with mouse
//#define MODE vec2(80,30)
//#define MODE vec2(132,43)
//#define MODE vec2(132,60)

// For those with retina display and magnifying glass (it's there!)
//#define MODE vec2(264,128)

// Using point to line distances gives us an antialiasing pointcut we can exploit
void antialias(inout vec4 k, float d, float w, vec4 K) {
    // Standard filled antialiased lines
//    k += K*(w-d);

    // Neon glow
    k += K/d;
    
	// Partially stenciled lines 
//    k += K*sin(d-w);
    
    // Hollow lines (provides reasonable high res. legibility)
//    k += K*cos(1.5+d-w);
    
    // Center line plus outline
//  k += K*tan(.2+d-w);
    
    // Stripe filled (using screen x/y would give stable fill)
//    k += K*max(K*cos(d-w), cos(7.*(d-w)));
    
    // Temporally striped and outlined
//  k += K*max(K*cos(d-w), 1.+2.*cos(7.*(d-w)*(1.1+sin(iGlobalTime/2.))));
    
    // Flashing font (temporal)
//    k += K*max(K*cos(d-w), sin(5.*iGlobalTime));
}


#define BLK vec4(.0,.0,.0,1.)
#define GRY vec4(.5,.5,.5,1.)
#define WHT vec4(1.,1.,1.,1.)
#define RED vec4(1.,.0,.0,1.)
#define GRN vec4(.0,1.,.0,1.)
#define BLU vec4(.0,.0,1.,1.)
#define YEL vec4(1.,1.,.0,1.)
#define ORG vec4(1.,.5,.0,1.)
#define PNK vec4(1.,.0,.5,1.)
#define MAG vec4(1.,.0,1.,1.)
#define CYN vec4(0.,1.,1.,1.)
#define PRP vec4(.5,.0,.5,1.)

float dBezier1(vec2 p, vec4 ac, vec2 b);// exact  https://www.shadertoy.com/view/Mlj3zD
float dBezier2(vec2 p, vec4 ac, vec2 b);// approx https://www.shadertoy.com/view/XsX3zf

// Provides distance of p to quadratic bezier curve described by abc
#define dBezier dBezier1

//=============================================================================
// The primitives.

#define PI  3.14159265358979
#define PI2 6.28318530717858

vec2 rot2D(vec2 p, float a) 
{
    vec3 csa = vec3(cos(a),-sin(a),0);
               csa.z = -csa.y;
    return p * mat2( csa.xyzx);
}

           
vec2 polar(vec2 p)
{
    float x = p.x,  
          y = p.y,
          a = atan(abs(y/x)),
          r = sqrt(x*x+y*y);
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


vec2 linePos(vec2 a, vec2 b, float t)
{
	t = clamp(t,0.,1.);
    vec2 d = b - a;
    return a + t * d;
}

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

float dCircle(vec2 p, vec2 a, float r, float w, float t, float s)
{
    t *=PI2;
    vec2 pa = rot2D(p-a,abs(s)),
        pol = polar(pa);
    float l = length(pa),
         w2 = w/2.;
    
    bool bo = s<0. ? pol.y < PI2-t : pol.y > t;
        
    return (pol.x>r+w || bo) ? 1e9 : 
    		(l>r) ? abs((l-r)+w2) : abs((r-l)-w2);
}

vec2 bzPos(float t, vec2 a, vec2 b, vec2 c); 

float dBezierSegs(vec2 p, vec4 ac, vec2 b, float dt) {
    float d = 9999.;
    vec2 a = ac.xy, c = ac.zw, q = a, r;
    
    for(float t=0.; t<=1.; t+=.03) {
        r = bzPos(t,a,b,c);
        d = min(d, dLine(p,q,r));   //TODO make temporal
        q = r;
        if(t>dt) return d;
    }
    
    return d;
}














void bezier(inout vec4 k, vec2 p, vec4 ac, vec4 bw, vec4 K, float t) {
    if(t<.1) return;
#ifdef DEBUG 
    K = RED; 
#endif
    
#ifdef TEMPORAL_TEXT
    float d = dBezierSegs(p,ac,bw.xy,t);
#else
    float d = dBezier(p,ac,bw.xy);    
#endif
    if(d<bw.z) antialias(k,d,bw.z,K);
}

void circle(inout vec4 k, in vec2 p, vec4 a, vec4 K, float t, float s) 
{
    if(t<.1) return;
#ifdef DEBUG 
    K = GRN; 
#endif
    float r = a.z,
          w = a.w,
          w2 = w/2.,
          l = length(p-a.xy),							// distance from p to center
#ifdef TEMPORAL_TEXT
          d = dCircle(p,a.xy,r,w,t,s);
#else
          d = (l>r) ? abs((l-r)+w2): abs((r-l)-w2);		// distance to edge line width(w)
#endif
    if(d<w) antialias(k,d,w,K);
}

void line(inout vec4 k, vec2 p, vec4 l, float w, vec4 K, float t) 
{
    if(t<.1) return;
#ifdef DEBUG 
    K = BLU; 
#endif
    vec2 a = l.xy, 
         b = l.zw;
    
#ifdef TEMPORAL_TEXT
    float d = dLine(p,a,linePos(a,b,t));
#else
    float d = dLine(p,a,b);
#endif 

    if(d<w) antialias(k,d,w,K);
}

//=============================================================================
// We (micro)codify the control point data to drive the rendering process

// input params getting unwieldy start using context struct
struct glyphCtx {
    vec2 p; 		// fragCoord
    vec2 s; 		// scale XY
    float w; 		// line width
    vec4 K;			// colour
    mat4 gp; 		// glyph microcode
    int gw;			// glyph width
    float t;		// time
};

void procGlyph(inout vec4 k, inout vec4 c, 
               glyphCtx g)
{
    vec2 s = g.s;
    
    vec4 ss = vec4(s,s);
    bool skip = false;
    for(int i=0;i<4;i++) {
        if(skip) {skip = false; continue;}
        
        float t = g.t-float(i)/2.;
        vec4 u = ss*g.gp[i];
        if(u.x<0.)
            if(u.z<0.){ // second point x 
                vec4 v = ss*g.gp[i+1]; skip = true;
                bezier(k, g.p, vec4(-u.x,u.y,-u.z,u.w), vec4(v.xy,g.w,0.), g.K, t);
            }
        else
            circle(k, g.p, vec4(-u.x,u.yz,g.w), g.K, t, u.w);
        else
            if(u.z>0.)   // 0 is NOP
                line(k, g.p, u,g.w, g.K, t);
    }
    // advance cursor in font x direction (proportional font)
    c.x += s.x*float(g.gw);
}

// glyph functions ============================================================
// hanging macro (compile quicker less source noise)
//#define PROC procGlyph(k,c,p,s,w,K,mat4(
mat4 retMat(mat4 m, int w) { return m; }
#define PROC retMat(mat4(
#define Z4 0,0,0,0
#define Z8 Z4,Z4

//The 'eidos' of the font.....

//#define R 6.
#define R 8.
//#define R 10.
#define a_    PROC -6,-2,.8*R,-4, 	Z4,			 -2,8,-13,-8, 	16,15,0,0),		20)
#define b_    PROC 1,20,1,-7,   	Z4,          -8,0,R,-4,   	Z4),			20)
#define c_    PROC -13,5,-1,0,   	3,12,0,0, 	 -1,0,-14,-3,   -2,-12,0,0), 	22)
#define d_    PROC -5,0,R,0,  		Z4,          13,20,13,-7,   Z4), 			20)
#define e_    PROC  -1,-2,-6,6,   	25,2,0,0,	 -6,6,-15,-6,   -8,-10,0,0), 	22)
#define f_    PROC -9,18,-2,-8,  	1,25,0,0,    Z4,            1,4,9,5),	    14)
#define g_    PROC -7,0,R,0,   		Z4,          -15,8,-1,-16,  17,-28,0,0),    22)
#define h_    PROC 1,20,1,-8,   	Z4,          -1,4,-14,-8,   13,15,0,0),     18)
#define i_    PROC -2,7,-4,-6,  	-1,-16,0,0,  Z4,            -3,13,2,0), 	10)
#define j_    PROC -5,7,-1,-10, 	8,-25,0,0,   Z4,            -5,13,2,0), 	12)
#define k_    PROC 1,18,1,-8,   	13,6,1,-2,   Z4,            5,0,13,-8), 	18)
#define l_    PROC -1,19,-6,-5,  	0,-18,0,0,   Z8), 							12)
#define m_    PROC -1,-9,-8,-3,   	2,20,0,0,  	 -8,-3,-16,-9,  14,20,0,0),		24)
#define n_    PROC 1,7,1,-8,   		Z4,          -1,4,-14,-8,   15,15,0,0), 	20)
#define o_    PROC -7,0,R,-6, 		Z4, 		 Z8), 							20)
#define p_    PROC 1,7,1,-20,		Z8,          -9,0,R,-4),         			22)
#define q_    PROC -6,0,R,0,   		Z8,			 14,7,14,-20), 	     			20)
#define r_    PROC 1,8,1,-7,   		Z4,			 -2,3,-13,5,    11,12,0,0), 	20)
#define s_    PROC -8,7,-6,-1,   	-8,8,0,0,  	 -6,-1,-1,-6,   15,-11,0,0), 	14)
#define t_    PROC -4,15,-12,-5, 	1,-15,0,0,   1,8,8,8, 		Z4),         	16)
#define u_    PROC -1,8,-13,-4,  	0,-16,0,0,   Z4,			14,8,14,-8), 	20)
#define v_    PROC 1,8,6,-8,   		Z4,			 6,-8,11,8,   	Z4), 			16)
#define w_    PROC 1,8,4,-8,   		4,-8,9,4,    9,4,14,-8,   	14,-8,18,8), 	23)
#define x_    PROC 1,8,8,-8,   		Z8,			 8,8,1,-8), 					12)
#define y_    PROC -2,8,-13,-4,  	4,-11,0,0,   -14,8,-1,-18,  14,-28,0,0), 	22)
#define z_    PROC 1,8,8,8,   		8,8,1,-8,    1,-8,8,-8,   	Z4), 			14)

#define Sp_ c.x += s.x*16.;
#define Cr_ c.y -= s.x*35.; c.x = s.x*40.;

void mainImage(out vec4 k, in vec2 p )
{   
    k = vec4(0);
    
    vec2 ir = iResolution.xy,
         sc = MODE,
         cr = ir/sc,
          s,
        off = cr/vec2(4.,2.),
         mp = mod(p, ir/sc)-off;

     vec4 c = vec4(floor(p/cr),0,0),
          K = INK;
    
    s = (iMouse.x>0.) ? 
        3.*iMouse.xy/iResolution.xy :
    	vec2(.04,.02)*ir/sc;
    
    float ch = floor(p.x/cr.x);

    // need vectored jump?!
    mat4 gp = ch< 1. ? a_ :
       	      ch< 2. ? b_ :
       	      ch< 3. ? c_ :
              ch< 4. ? d_ :
      	      ch< 5. ? e_ :
      	      ch< 6. ? f_ :
       	      ch< 7. ? g_ :
       	      ch< 8. ? h_ :
       	      ch< 9. ? i_ :
       	      ch<10. ? j_ :
       	      ch<11. ? k_ :
       	      ch<12. ? l_ :
       	      ch<13. ? m_ :
       	      ch<14. ? n_ :
       	      ch<15. ? o_ :
       	      ch<16. ? p_ :
       	      ch<17. ? q_ :
       	      ch<18. ? r_ :
       	      ch<19. ? s_ :
       	      ch<20. ? t_ :
       	      ch<21. ? u_ :
       	      ch<22. ? v_ :
       	      ch<23. ? w_ :
       	      ch<24. ? x_ :
       	      ch<25. ? y_ :
    	      z_;
    
glyphCtx ctx;
    ctx.p = mp;
    ctx.s = s;
    ctx.w = LINE_WIDTH;
    ctx.K = K;
    ctx.gp = gp;
    ctx.gw = 0;					// fixed width for now....
    
#ifdef STAGGERED
    ctx.t = -48.+(-2.*ch)+2.*iGlobalTime*(.7*c.y) + 6.*c.y;
#else
    ctx.t = (-2.*ch)+2.*iGlobalTime;
#endif
    
    
    procGlyph(k, c, ctx);
}




















//Bezier line implementations follow
//=============================================================================
// derived from bezier code @ https://www.shadertoy.com/view/Mlj3zD
#define PI 3.14159265358979
int findRoots(vec4 abcd, out vec3 r)
{
    float a = abcd[0],
    b = abcd[1],
    c = abcd[2],
    d = abcd[3];
    vec3 vS = vec3(-1);
    if (abs(a) > 1e-9){
        
        float z = 1./a;
        abcd *= z;
        a = abcd[1];
        b = abcd[2];
        c = abcd[3];
        
        float d3 = 1./3.,
        aa = a*a,
        d27 = 1./27.,
        p = b-aa*d3,
        q = a*(2.*aa-9.*b)*d27+c,
        ppp = p*p*p,
        D = q*q+4.*ppp*d27,
        delta = -a*d3;
        
        if (D > 1e-9){
            z = sqrt(D);
            vec2 uv = .5*(vec2(z,-z)-q),
            s = sign(uv);
            uv = abs(uv);
            float u = s.x*pow(uv.x,d3),
            v = s.y*pow(uv.y,d3);
            r.x = u+v+delta;
            return 1;
        }
        else if (D < -1e-9){
            float u = sqrt(-p*d3)*2.,
            s = -sqrt(-27.0/ppp)*q*.5;
            if (abs(s) > 0.) {}
            r = u*cos(vec3(acos(s)*d3) + vec3(0,2,4)*PI*d3)+delta;
            return 3;
        }
        else {
            q = sign(q)*pow(abs(q)*.5,d3);
            r.xy = vec2(-q,q)+delta;
            r.x *= 2.;
            return 2;
        }
    }
    else {
        if (abs(b) <= 1e-9 && abs(c) > 1e-9) {
            r.x = -d/c;
            return 1;
        }
        else {
            float D = c*c-4.*b*d,
            z = 1./(2.*b);
            if (D > 1e-9) {
                D = sqrt(D);
                r.xy = (vec2(-D,D)-c)*z;
                return 2;
            }
            else if (D > -1e-9) {
                r.x = -c*z;
                return 1;
            }
        }
    }
    return 0;
}

vec2 bzPos(float t, vec2 a, vec2 b, vec2 c)
{
    float mT = 1.-t;
    vec2 pos = mT*mT*a+2.*t*mT*b+t*t*c;
    return pos;
}

float dBezier1(vec2 p, vec4 ac, vec2 b)
{
    vec2 a = ac.xy,
    c = ac.zw,
    dap = a-p,
    dba = b-a,
    sac = a+c-b*2.;
    vec3 r;
    float dist = 999.;
    int roots = findRoots(vec4(dot(sac,sac),
                               dot(dba,sac)*3.,
                               dot(dba,dba)*2.+dot(dap, sac),
                               dot(dap,dba)),r);
    float r1 = r.x,
    r2 = r.y,
    r3 = r.z;
    if (roots > 0 && r1 >= 0. && r1 <= 1.)
        dist = distance(p,bzPos(r1,a,b,c));
    if (roots > 1 && r2 >= 0. && r2 <= 1.)
        dist = min(dist, distance(p,bzPos(r[1],a,b,c)));
    if (roots > 2 && r3 >= 0. && r3 <= 1.)
        dist = min(dist, distance(p,bzPos(r[2],a,b,c)));
    return min(dist, min(distance(p, a), distance(p, c)));
}


//=============================================================================
// Alternative Bezier Implementation derived from https://www.shadertoy.com/view/XsX3zf
// approximation shows on thicker lines when endpoints are close
// may be useful for finer lines/small text higher speed (?)

float det(vec2 a, vec2 b) { return a.x*b.y-b.x*a.y; }

vec2 bzPtInSeg( vec2 a, vec2 b ){
    vec2 d = b - a;
    return a + d*clamp( -dot(a,d)/dot(d,d), 0., 1. );
}

vec2 bzVec(vec2 a, vec2 b, vec2 c) {
    float q = det(a,c),
    r = det(b,a),
    s = det(c,b),
    q2 = 2.*(q + r + s);
    if( abs(q2) < 1000. )
        return bzPtInSeg(a,c);
    vec2 dba = b - a,
    dca = c - a,
    gf = q*dca + 2.*(r*(c-b) + s*dba),
  		gs = 2.*vec2(gf.y,-gf.x),
    d = a + (4.*r*s - q*q)*gs/dot(gs,gs);
    
    float t = clamp((det(d,dca) + 2.*det(dba,d)) / q2, 0. ,1.);
    
    return mix(mix(a,b,t),mix(b,c,t),t);
}

float dBezier2(vec2 p, vec4 ac, vec2 b) {
    return length(bzVec(ac.xy-p, b-p, ac.zw-p));
}





//_______________________________________________________________________________________________________



void main( void)
{
	mainImage(gl_FragColor, gl_FragCoord.xy);
}