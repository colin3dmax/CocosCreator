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

// Created by inigo quilez - iq/2015
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.


//
// Computes the curvature of a parametric curve f(x) as 
//
// c(f) = |f'|^3 / | f' x f''|
//
// More info here: https://en.wikipedia.org/wiki/Curvature
//


//----------------------------------------

vec3 a = vec3(1.85,1.25,1.85) + 0.1*cos(5.0+0.7*iGlobalTime + vec3(0.5,1.0,2.0) );
vec3 b = vec3(0.60,0.60,0.60) + 0.1*cos(4.0+0.5*iGlobalTime + vec3(2.5,5.0,3.0) );
vec3 c = vec3(0.40,0.40,0.40) + 0.1*cos(1.0+0.3*iGlobalTime + vec3(6.0,2.0,4.2) );
vec3 m = cos( 0.11*iGlobalTime + vec3(2.0,0.0,5.0) );
vec3 n = cos( 0.17*iGlobalTime + vec3(3.0,1.0,4.0) );

// curve
vec3 mapD0(float t)
{
    return 0.25 + a*cos(t+m)*(b+c*cos(t*7.0+n));
}
// curve derivative (velocity)
vec3 mapD1(float t)
{
    return -7.0*a*c*cos(t+m)*sin(7.0*t+n) - a*sin(t+m)*(b+c*cos(7.0*t+n));
}
// curve second derivative (acceleration)
vec3 mapD2(float t)
{
    return 14.0*a*c*sin(t+m)*sin(7.0*t+n) - a*cos(t+m)*(b+c*cos(7.0*t+n)) - 49.0*a*c*cos(t+m)*cos(7.0*t+n);
}

//----------------------------------------

float curvature( float t )
{
    vec3 r1 = mapD1(t); // first derivative
    vec3 r2 = mapD2(t); // second derivative
    return pow(length(r1),3.0) / length(cross(r1,r2));
}

//-----------------------------------------

// unsigned squared distance between ray and segment
vec3 usqdLineSegment( vec3 a, vec3 b, vec3 o, vec3 d )
{
	vec3 ba = b - a;
	vec3 oa = o - a;
	
	float oad  = dot( oa,  d );
	float dba  = dot(  d, ba );
	float baba = dot( ba, ba );
	float oaba = dot( oa, ba );
	
	vec2 th = vec2( -oad*baba + dba*oaba, oaba - oad*dba ) / (baba - dba*dba);
	
	th.x = max(   th.x, 0.0 );
	th.y = clamp( th.y, 0.0, 1.0 );
	
	vec3 p = a + ba*th.y;
	vec3 q = o + d*th.x;
	
	return vec3( dot( p-q, p-q ), th );
}

vec2 usqdPointSegment( in vec3 p, in vec3 a, in vec3 b )
{
	vec3 pa = p - a;
	vec3 ba = b - a;
	float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
	vec3 q = pa - ba*h;
	return vec2( dot(q,q), h );
}


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 p = (-iResolution.xy+2.0*fragCoord.xy)/iResolution.y;
 
    vec3 ro = vec3( 0.0, 0.0, 4.0 );
    vec3 rd = normalize( vec3(p.xy, -2.0) );

    vec3 col = vec3(0.0);
    
    vec3  gp = vec3(0.0);
    float pt = (-1.0-ro.y)/rd.y;
    vec3 gc = vec3(0.0);
    if( pt>0.0 )
    {
        gp = ro + pt*rd;
        gc = vec3(1.0) * (0.2 + 0.1*smoothstep(-0.01,0.01,sin(4.0*gp.x)*sin(4.0*gp.z)));
        col = 0.3*gc*exp(-0.05*pt);
    }

    
    float dt = 6.2831/150.0;
	float t = 0.0;
    float mint = 1e10;
    vec3  xb = mapD0(t);
    
    t += dt;
    for( int i=0; i<150; i++ )
    {
        vec3 xc = mapD0(t);
        xc.y = max(-1.0,xc.y); // clip to ground
        vec3 ds = usqdLineSegment( xb, xc, ro, rd );

        // compute curvature
        float h = t - dt + dt*ds.z;
        float c = curvature( h );

        vec3  cc = clamp( 0.25 + 0.75*cos( -clamp(3.0*c,0.0,2.0) + 1.0 + vec3(0.0,1.5,2.0) ), 0.0, 1.0 );
        cc *= 5.5*exp( -0.5*ds.y );
        
        col += 1.0*cc*exp( -500.0*ds.x );
        col += 0.1*cc*exp( -25.0*ds.x );

        // light ground
        if( pt > 0.0 )
        {
            vec2 sd = usqdPointSegment( gp, xb, xc );
            col += gc*0.8*cc*exp(-2.0*sd.x)*exp( -0.05*pt );
        }
        
		t += dt;
        xb = xc;
	}
    

    
	fragColor = vec4( col, 1.0 );
}

//_______________________________________________________________________________________________________





void main( void)
{
	mainImage(gl_FragColor, gl_FragCoord.xy);
}