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
// Created by Stephane Cuillerdier - Aiekick/2015 (twitter:@aiekick)
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
// Tuned via XShade (http://www.funparadigm.com/xshade/)

/*
based on https://www.shadertoy.com/view/4stXR7
*/

const vec3 ld = vec3(0.,1., .5);
float dstepf = 1.0;
float t = 0.;

vec2 path(float z){return sin(z*.2 + vec2(1.6,0));}

mat3 getRotXMat(float a){return mat3(1.,0.,0.,0.,cos(a),-sin(a),0.,sin(a),cos(a));}
mat3 getRotYMat(float a){return mat3(cos(a),0.,sin(a),0.,1.,0.,-sin(a),0.,cos(a));}
mat3 getRotZMat(float a){return mat3(cos(a),-sin(a),0.,sin(a),cos(a),0.,0.,0.,1.);}

float fractus(vec3 p)
{
	
	vec2 z = p.xy;
    vec2 c = vec2(0.28,-0.56) * cos(p.z*0.1);
	float k = 1., h = 1.0;    
    for (float i=0.;i<8.;i++)
    {
		h *= 4.*k;
		k = dot(z,z);
        if(k > 4.) break;
		z = vec2(z.x * z.x - z.y * z.y, 2. * z.x * z.y) + c;
    }
	return sqrt(k/h)*log(k);   
}

float df(vec3 p)
{
	p *= getRotZMat(cos(p.z*0.2)*2.);
	p.xy = mod(p.xy, 3.5) - 3.5*0.5;
	p *= getRotZMat(cos(p.z*0.6)*2.);
	return fractus(p);
}

vec3 nor( vec3 p, float prec )
{
    vec2 e = vec2( prec, 0. );
    vec3 n = vec3(
		df(p+e.xyy) - df(p-e.xyy),
		df(p+e.yxy) - df(p-e.yxy),
		df(p+e.yyx) - df(p-e.yyx) );
    return normalize(n);
}

// from iq code
float softshadow( in vec3 ro, in vec3 rd, in float mint, in float tmax )
{
	float res = 1.0;
    float t = mint;
    for( int i=0; i<18; i++ )
    {
		float h = df( ro + rd*t );
        res = min( res, 8.0*h/t );
        t += h*.25;
        if( h<0.001 || t>tmax ) break;
    }
    return clamp( res, 0., 1. );
}

// from iq code
float calcAO( in vec3 pos, in vec3 nor )
{
	float occ = 0.0;
    float sca = 1.0;
    for( int i=0; i<10; i++ )
    {
        float hr = 0.01 + 0.12*float(i)/4.0;
        vec3 aopos =  nor * hr + pos;
        float dd = df( aopos );
        occ += -(dd-hr)*sca;
        sca *= 0.95;
    }
    return clamp( 1.0 - 3.0*occ, 0.0, 1.0 );    
}

vec3 lighting(vec3 p, vec3 lp, vec3 rd, float prec) 
{
    vec3 l = lp - p;
    float d = max(length(l), 0.01);
    float atten = 1.0-exp( -0.01*d*d );
    if (iMouse.z> 0.) atten = exp( -0.001*d*d )-0.5;
    l /= d;
    
    vec3 n = nor(p, prec);
   	vec3 r = reflect(-l, n);
    
    float dif = clamp(dot(l, n), 0.0, 1.0);
    float spe = pow(clamp(dot(r, -rd), 0.0, 1.0), 8.0);
    float fre = pow(clamp(1.0 + dot(n, rd), 0.0, 1.0), 2.0);
    float dom = smoothstep(-1.0, 1.0, r.y);
    
    dif *= softshadow(p, rd, 0.1, 1.);
    
    vec3 lin = vec3(0.08,0.32,0.47);
    lin += 1.0*dif*vec3(1,1,0.84);
    lin += 2.5*spe*dif*vec3(1,1,0.84);
    lin += 2.5*fre*vec3(1);
    lin += 0.5*dom*vec3(1);
    
    return lin * atten * calcAO(p, n);
}


float trace( in vec3 ro, in vec3 rd)
{
	float s = 1.;
	float d = 0.;
	vec3 p = ro;
	
	for (float i=0.; i<150.; i++)
	{
		if (s < 0.0025*log(d) || d>40.) break;
		s = df(p);
		d += s * (s>0.1?0.15:0.01);
		p = ro + rd * d;	
		dstepf += 0.005;
	}
	
    return d;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 si = iResolution.xy;
	vec2 uv = (2.*fragCoord-si)/min(si.x, si.y);

	t = iGlobalTime * 2.;

    vec3 cu = vec3(0,1,0);
    vec3 ro = vec3(0,0,t);
    vec3 co = ro + vec3(0, 0,.1);
	
	float fov = 0.8;
	vec3 axisZ = normalize(co - ro);
	vec3 axisX = normalize(cross(cu, axisZ));
	vec3 axisY = normalize(cross(axisZ, axisX));
	vec3 rd = normalize(axisZ + fov * uv.x * axisX + fov * uv.y * axisY);
	
	float d = trace(ro, rd);
	vec3 p = ro + rd * d;	
	
	fragColor.rgb = vec3(0.47,0.6,0.76) * lighting(p, ro, rd, 0.1); 
	fragColor.rgb = mix( fragColor.rgb, vec3(0.5,0.49,0.72), 1.0-exp( -0.01*d*d ) ); 
	fragColor.a=1.0;
}


//_______________________________________________________________________________________________________





void main( void)
{
	mainImage(gl_FragColor, gl_FragCoord.xy);
}