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
//*************** INSTRUCTIONS **********************
//
// Press and hold 'f' to use the usual first order approximation
//
// Press and hold 'p' to use an eigenvalue estimate instead of the frobenius norm
// (not really a noticeable effect...) 
// 
// Change the value of 'SCENE' just below to switch to different implicits
//
// Move the camera by dragging the mouse with left button held down
//
//***************************************************

// Scene from 0 to 6
// Strongest effects are seen in 1,4,5,6
// Scene 6 was originally a sphere. Same technique can be used to slightly rectify
// distorted distance fields. As an alternative to computing maximum jacobian derivatives
#define SCENE 4

//********************************************************************
//
// Global defines
// 
//********************************************************************

// Infinity
#define AUTO_INFINITY 3.402823e+38


const float eps = 0.00001;
const float pi = 3.14159265359;


// Maximum number of sphere trace steps
const int maxSteps = 150;


bool useFirstOrder = false;
bool usePowerMethod = false;

bool isPressed(int key)
{
    float val = texture2D( iChannel0, vec2( (float(key)+0.5)/256.0, 0.25 ) ).x;
	return val > 0.5;
}

bool isToggled(int key)
{
    float val = texture2D( iChannel0, vec2( (float(key)+0.5)/256.0, 0.75 ) ).x;
	return val > 0.5;
}


// My very simple (and probably not overly great) forward-autodiff code from:
// https://github.com/sibaku/glsl-autodiff

//********************************************************************
//
// General functions
// 
//********************************************************************

mat2 a_outerProduct(in vec2 a, in vec2 b)
{
	return mat2(a * b.x, a * b.y);
}

mat3 a_outerProduct(in vec3 a, in vec3 b)
{
	return mat3(a * b.x, a * b.y, a * b.z);
}

mat4 a_outerProduct(in vec4 a, in vec4 b)
{
	return mat4(a * b.x, a * b.y, a * b.z, a * b.w);
}

//********************************************************************
//
// Data structure for holding information for 3D Hessian calculation. Gradient is also included
// 
//********************************************************************


struct HessNum3
{
	float val;
	vec3 g;
	mat3 h;
};
    
    //********************************************************************
//
// 3D Hessian functions
// 
//********************************************************************


HessNum3 a_constH3(in float val)
{
	return HessNum3(val, vec3(0.), mat3(0.));
}

HessNum3 neg(in HessNum3 a)
{
	return HessNum3(-a.val,-a.g,-a.h);
}

HessNum3 add(in HessNum3 a, in HessNum3 b)
{
	return HessNum3(a.val + b.val, a.g + b.g, a.h + b.h);
}
HessNum3 add(in HessNum3 a, in float b)
{
	return HessNum3(a.val + b, a.g , a.h);
}

HessNum3 add(in float a, in HessNum3 b)
{
	return HessNum3(b.val + a, b.g , b.h);
}

HessNum3 sub(in HessNum3 a, in HessNum3 b)
{
	return HessNum3(a.val - b.val, a.g - b.g, a.h - b.h);
}
HessNum3 sub(in HessNum3 a, in float b)
{
	return HessNum3(a.val - b, a.g , a.h);
}

HessNum3 sub(in float a, in HessNum3 b)
{
	return HessNum3(a - b.val, -b.g , -b.h);
}

HessNum3 mult(in HessNum3 a, in HessNum3 b)
{
	return HessNum3(a.val * b.val, b.val*a.g + a.val*b.g, b.val*a.h + a.val*b.h + a_outerProduct(a.g,b.g) + a_outerProduct(b.g,a.g));
}

HessNum3 mult(in HessNum3 a, float b)
{
	return HessNum3(a.val*b, a.g*b, a.h*b);
}

HessNum3 mult(in float a, in HessNum3 b)
{
	return HessNum3(b.val*a, b.g*a, b.h*a);
}

HessNum3 div(in HessNum3 a, in HessNum3 b)
{
	HessNum3 r = HessNum3(a.val / b.val, a.g, a.h );
	r.g = r.g - r.val*b.g;
	r.g = r.g / b.val;
	
	r.h = r.h - r.val * b.h - a_outerProduct(r.g,b.g) - a_outerProduct(b.g,r.g);
	r.h = r.h / b.val;
	
	return r;
	
}
HessNum3 div(in HessNum3 a, float b)
{
	return HessNum3(a.val/b, a.g/b, a.h/b);
}

HessNum3 a_sin(in HessNum3 a)
{
	float c = cos(a.val);
	float s = sin(a.val);
	return HessNum3(s , c * a.g,  c * a.h - s * a_outerProduct(a.g,a.g));

}

HessNum3 a_cos(in HessNum3 a)
{
	float c = cos(a.val);
	float s = sin(a.val);
	return HessNum3(c , -s * a.g,  -s * a.h - c * a_outerProduct(a.g,a.g));

}

HessNum3 a_exp(in HessNum3 a)
{
	float e = exp(a.val);
	return HessNum3(e , e * a.g,  e * a.h + e * a_outerProduct(a.g,a.g));

}

HessNum3 a_log(in HessNum3 a)
{
	float ai = 1./a.val;
	return HessNum3(log(a.val) , ai * a.g,  ai * a.h  - ai * ai * a_outerProduct(a.g,a.g));

}

HessNum3 a_pow(in HessNum3 a, float k)
{
	float ap = k*pow(a.val,k-1.);
	return HessNum3(pow(a.val,k) , ap * a.g,  ap * a.h + (k-1.)*k*pow(a.val,k-2.) * a_outerProduct(a.g,a.g));

}

HessNum3 a_abs(in HessNum3 a)
{
	float l = abs(a.val);
	float lp = sign(a.val);
	// Probably better to always make this 0
	float lpp = a.val == 0. ? AUTO_INFINITY : 0.;
	return HessNum3(l , lp * a.g,  lp * a.h + lpp * a_outerProduct(a.g,a.g));

}

HessNum3 a_sqrt(in HessNum3 a)
{
	float as = sqrt(a.val);
	float asd = 1. / (2.*as);
	float asdd = -1./(4.*pow(a.val,3./2.));
	return HessNum3(as,a.g*asd, asd * a.h + asdd * a_outerProduct(a.g,a.g)); 
}

float frobenius(in mat3 m)
{
 	return sqrt(dot(m[0],m[0]) + dot(m[1],m[1]) + dot(m[2],m[2]));   
}

//********************************************************************
//
// Hessians
// 
//********************************************************************
#define HESSIAN3(f,u,v,w,result) { vec3 uGrad = vec3(1.,0.,0.); HessNum3 uHessian = HessNum3(u,uGrad,mat3(0.)); vec3 vGrad = vec3(0.,1.,0.); HessNum3 vHessian = HessNum3(v,vGrad,mat3(0.)); vec3 wGrad = vec3(0.,0.,1.); HessNum3 wHessian = HessNum3(w,wGrad,mat3(0.)); result = f(uHessian,vHessian,wHessian);}



//********************************************************************
//
// Non autodiff code
// 
//********************************************************************

// Simple power iteration to find the eigenvalue with largest absolute value
float powerNorm(in mat3 m)
{
    vec3 bk = vec3(1.);
    bk = normalize(m*bk);
    bk = normalize(m*bk);
    bk = normalize(m*bk);
    bk = normalize(m*bk);
    return length(m*bk);
}

float calcNorm(in mat3 m)
{
 	if(usePowerMethod)
        return powerNorm(m);
    else
        return frobenius(m);
}
// Different implicit functions f(x,y,z)
HessNum3 implicit(in HessNum3 x, in HessNum3 y, in HessNum3 z)
{
    
    #if SCENE == 0
 		return sub(a_sqrt(add(add(mult(x,x),mult(y,y)),mult(z,z))),a_constH3(1.));  
    #elif SCENE==1
    	return sub(y,a_sin(add(x,y)));
    #elif SCENE==1
    
    return 
        sub(
        	add(
                mult(x,x),mult(z,z)
            ),
        	mult(
                z,
                sub(
                    a_constH3(1.),mult(y,y)
                )
            )
        );
	
     #elif SCENE==2
    return sub(add(add(a_pow(x,4.),a_pow(y,4.)),a_pow(z,4.)),a_constH3(1.));
     #elif SCENE==3
    
    return 
        sub(
            sub(
                a_pow(
                    sub(
                        add(
                            add(
                            mult(2.,mult(x,x))
                            ,
                            mult(2.,mult(z,z))
                            ),
                            mult(y,y)
                        )
                        ,
                        a_constH3(1.)
                    )
                    ,
                    3.
                    )
                ,
                mult(0.1,mult(mult(x,x),a_pow(y,3.)))
                )
        	,
            mult(mult(z,z),a_pow(y,3.))
        );
	#elif SCENE==4
    	HessNum3 c2 = a_constH3(2.);
    	HessNum3 f1 = mult(a_pow(sub(x,c2),2.),a_pow(add(x,c2),2.));
    	HessNum3 f2 = mult(a_pow(sub(y,c2),2.),a_pow(add(y,c2),2.));
    	HessNum3 f3 = mult(a_pow(sub(z,c2),2.),a_pow(add(z,c2),2.));
    	HessNum3 f4 = mult(3., add(add(mult(mult(x,x),mult(y,y)),mult(mult(x,x),mult(z,z)))
                          ,mult(mult(y,y),mult(z,z))));
    
    	HessNum3 f5 = mult(mult(mult(6.,x),y),z);
    	HessNum3 f6 = mult(-10.,add(add(mult(x,x),mult(y,y)),mult(z,z)));
                           
		return add(add(add(add(add(add(f1,f2),f3),f4),f5),f6),a_constH3(22.));
     #elif SCENE==5
    return
        add(add(add(
        mult( mult(a_sin(x),a_sin(y)
            ), a_sin(z))
        ,
        mult( mult(a_sin(x),a_cos(y)
            ), a_cos(z)))
        ,
        
        mult( mult(a_cos(x),a_sin(y)
            ), a_cos(z)))
        ,
        
        mult( mult(a_cos(x),a_cos(y)
            ), a_sin(z))
        );
    #else
    	HessNum3 noise = mult(0.4*cos(iGlobalTime/10.),
                              mult(
                                  	mult(a_cos(mult(22.,y)),
                                   a_sin(mult(15.,y)))
                                  , a_sin(mult(14.,z))));
   
    	noise = add(noise,mult(0.4*sin(iGlobalTime/5.),a_cos(mult(2.,z))));
    	return add(noise,sub(a_sqrt(add(add(mult(x,x),mult(y,y)),mult(z,z))),a_constH3(1.)));
    #endif
}
void getEye(out vec3 eye, out vec3 center)
{
    
    #if SCENE == 4
    	eye = vec3(7.,4.,5.);
    	center = vec3(0.);
    #elif SCENE == 1
    	eye = vec3(7.,5.,3.);
    	center = vec3(0.);
    #else
    	eye = vec3(3.,1.,0.);
    	center = vec3(0.);
    #endif
    
}

float DE(vec3 p)
{
 	HessNum3 result;
    HESSIAN3(implicit,p.x,p.y,p.z,result);
    
    float g2 = dot(result.g,result.g);
    float g = sqrt(g2);
    float v= result.val;
    
    // First order distance estimation
    if(useFirstOrder)
    {
        if(g < eps)
        {
            return v;   
        }else
            return v/g;
	}
	else
    {
        
        // Second order uses any compatible matrix norm
        // Default here is frobenius ->  fast and simple
        // power method assumes the hessian to be symmetric to calculate spectral norm
        // (should be for functions with continuous second order partials)
    float m = calcNorm(result.h);
    
    // Special cases for zero values
    if(m < eps)
    {
       	if(g < eps)
            return v;
        
     	return v/g;
    }
    else if(g < eps)
    {
        
     	return sqrt(2.*abs(v)/m)*sign(v);   
    }
    
    return (sqrt(g2/m/m + 2.*abs(v)/m) - g/m)*sign(v);
    }
}


bool trace(in vec3 p, in vec3 dir, out float t, out float dist, out int steps,
           out vec3 pos)
{
   
    
    
    steps = 0;
    dist = 10000.0;
    t = 0.;
    
    float lastT = 0.;
    for(int i= 0; i < maxSteps;i++)
    {
        pos = p+t*dir;
     	float d = DE(pos);
        
        
        if(d < eps)
        {
            dist = 0.;
            t = lastT;
            return true;
        }
        
        lastT = t;
        t += d;
        steps++;
        if(t > 100.)
            return false;
    }
    
    return false;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 uv = fragCoord.xy / iResolution.xy;
	fragColor = vec4(uv,0.5+0.5*sin(iGlobalTime),1.0);

	vec2 camRes = vec2(2.,2.*iResolution.y/iResolution.x);
    float focal = 1.;
    
    useFirstOrder = isPressed(70);
    usePowerMethod = isPressed(80);
    vec3 eye;
    vec3 center;
    getEye(eye,center);
    //eye += vec3(sin(2.*pi/10.*iGlobalTime),0.,cos(2.*pi/10.*iGlobalTime))*0.5;
    // Camera thanks to stb
    vec2 relativeMouse = iMouse.z <= 0. ? vec2(.5/iResolution.xy) : iMouse.xy/iResolution.xy-.5;
	eye += vec3(0.,relativeMouse.yx)*12.;
    
    
    vec3 dir = normalize(center-eye);
    
    vec3 up = vec3(0.,1.,0.);
    
    vec3 right = cross(dir,up);
    
    vec3 p = eye + focal*dir - right*camRes.x/2.0 - up*camRes.y/2.0 + uv.x*camRes.x*right + uv.y*camRes.y*up;
    
    
    vec3 rayDir = normalize(p-eye);
    
    vec3 LPos = vec3(2.,5.,2.);
    LPos += vec3(0.,sin(2.*pi/10.*iGlobalTime),0.)*1.5;
   	vec3 col;
    float t;
    int steps;
    float d;
    vec3 P;
    
    if(trace(p,rayDir,t,d,steps,P))
    {
        //float stepv = float(steps)/float(maxSteps);
     	//col = vec3(min(1.,exp(-20.*stepv*stepv)));
        col = vec3(0.8);
    }
    else
    {
        col = vec3(0.);
    }
    
    HessNum3 result;
    HESSIAN3(implicit,P.x,P.y,P.z,result);
    
    vec3 L = normalize(LPos - P);
   	col *= max(dot(L,normalize(result.g)),0.) + 0.1;
    
    fragColor = vec4( col,1.);
    
    
   
}

//_______________________________________________________________________________________________________





void main( void)
{
	mainImage(gl_FragColor, gl_FragCoord.xy);
}