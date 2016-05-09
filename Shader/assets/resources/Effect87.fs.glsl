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

// Companion Cube Remix - @christinacoffin
//	- heart shape mapping doesnt completely play nice with the parallax mapping, something to improve upon.
// 	
// modified version of Parallax mapping demo by nimitz (twitter: @stormoid)  : https://www.shadertoy.com/view/4lSGRh
// modified procedural heartshape by Iq : https://www.shadertoy.com/view/XsfGRn

//Show only the raymarched geometry (for comparison)
//#define RAYMARCHED_ONLY

//The amount of parallax
#define PARALLAX_SCALE .2

//Scale the texture offset as a function of incidence (much better results)
#define USE_OFFSET_SCALING
#define OFFSET_SCALE 4.

//Bump mapping intensity
#define BUMP_STRENGTH .21
#define BUMP_WIDTH 0.004

//Main texture scale
const float texscl = 2.5;

#define ITR 70
#define FAR 15.
#define time iGlobalTime

mat2 mm2(in float a){float c = cos(a), s = sin(a);return mat2(c,-s,s,c);}
float hash(vec2 x){	return fract(cos(dot(x.xy,vec2(2.31,53.21))*124.123)*412.0); }

float sdfsw = 0.; //Global mouse control

float length4(in vec3 p ){
	p = p*p; p = p*p;
	return pow( p.x + p.y + p.z, 1.0/4.0 );
}

float map(vec3 p)
{
    float d = mix(length(p)-1.1,length4(p)-1.,sdfsw-0.3);
    d = min(d, -(length4(p)-4.));
    return d*.95;
}

float march(in vec3 ro, in vec3 rd)
{
	float precis = 0.001;
    float h=precis*2.0;
    float d = 0.;
    for( int i=0; i<ITR; i++ )
    {
        if( abs(h)<precis || d>FAR ) break;
        d += h;
	    float res = map(ro+rd*d);
        h = res;
    }
	return d;
}

vec3 normal(in vec3 p)
{  
    vec2 e = vec2(-1., 1.)*0.005;   
	return normalize(e.yxx*map(p + e.yxx) + e.xxy*map(p + e.xxy) + 
					 e.xyx*map(p + e.xyx) + e.yyy*map(p + e.yyy) );   
}

//From TekF (https://www.shadertoy.com/view/ltXGWS)
float cells(in vec3 p)
{
    p = fract(p/2.0)*2.0;
    p = min(p, 2.0-p);
    return 1.-min(length(p),length(p-1.0));
}

vec4 heartMapping( in vec2 p )
{	
	p.y -= 0.25;

    // background color
    // make this black for now since we use the heart shape to displace things and dont want the other parts affected (keep it black colored)
    vec3 bcol = vec3(0,0,0);//1.0,0.8,0.7-0.07*p.y)*(1.0-0.25*length(p));

    float tt = mod(iGlobalTime,1.5)/1.5;
    float ss = pow(tt,.2)*0.5 + 0.5;
    ss = 1.0 + ss*0.5*sin(tt*6.2831*3.0 + p.y*0.5)*exp(-tt*4.0);
    p *= vec2(0.5,1.5) + ss*vec2(0.5,-0.5);

    // shape
    float a = atan(p.x,p.y)/3.141593;
    float r = length(p);
    float h = abs(a);
    float d = (13.0*h - 22.0*h*h + 10.0*h*h*h)/(6.0-5.0*h);

	// color
	float s = d;//1.0-0.5*clamp(r/d,0.0,1.0);
    
	s = 0.5;// + 0.5*p.x;
	s *= 1.0;//-0.25*r;
	s = 0.5 + 0.6*s;

	s *= 0.5+0.5*pow( 1.0-clamp(r/d, 0.0, 1.0 ), 0.1 );

	vec3 hcol = vec3(1.0,0.0,0.3)*s;
	
    vec3 col = mix( bcol, hcol, smoothstep( -0.01, 0.01, d-r) );

    col.x *= ss;//fluctate color based on the beating animation
    col.y = ss;//

    //todo: we could encode other shapes in other color channels and mix them in tex() differently
    
    return vec4(col,1.0);
}

float tex( vec3 p )
{
    p *= texscl;
    float rz= 0.0;//-0.5;
    float z= 1.;
    
    // do the Heart shape mapping before the parallax loop warps the position data
    // triplanar map it so we get it on all 6 sides
    float heartScaleFactor = 1.1;
    vec4 heart0 = heartMapping( p.xy * heartScaleFactor );
    vec4 heart1 = heartMapping( p.zy * heartScaleFactor );
    vec4 heart2 = heartMapping( p.xz * heartScaleFactor );
    
    heart0 = max( heart0, heart1 );
    heart0 = max( heart0, heart2 );
    float heartMask = (heart0.x + heart1.x + heart2.x *0.333);
    heartMask = clamp(heartMask, 0.0, 1.0);
    
    for ( int i=0; i<2; i++ )
    { 
        #ifndef RAYMARCHED_ONLY
        rz += cells(p)/z;
        #endif
        
        p *= 2.5*0.15;
        z *= -1.1*0.15;
    }
 
    return clamp(heartMask+(rz*rz)*4.95,0.,1.)*2.73 - 1.0-heartMask;
}

/*
	The idea is to displace the shaded position along the surface normal towards
	the viewer,	the tgt vector is the displacement vector, then	I apply a scaling
	factor to the displacement and also have an incidence based	offset scaling set up.
*/
vec3 prlpos(in vec3 p, in vec3 n, in vec3 rd)
{
    //vec3 tgt = cross(cross(rd,n), n); //Naive method (easier to grasp?)
    vec3 tgt = n*dot(rd, n) - rd; //Optimized

#ifdef USE_OFFSET_SCALING
    tgt /= (abs(dot(tgt,rd)))+OFFSET_SCALE;
    
#endif
    
    p += tgt*tex(p)*PARALLAX_SCALE;
    return p;
}

float btex(in vec3 p)
{
    float rz=  tex(p);
    rz += tex(p*20.)*0.01; //Extra (non-parallaxed) bump mapping can be added
    
 //   rz += tex(p);
    
    return rz;
}

vec3 bump(in vec3 p, in vec3 n, in float ds)
{
    vec2 e = vec2(BUMP_WIDTH*sqrt(ds)*0.5, 0);
    float n0 = btex(p);
    vec3 d = vec3(btex(p+e.xyy)-n0, btex(p+e.yxy)-n0, btex(p+e.yyx)-n0)/e.x;
    vec3 tgd = d - n*dot(n ,d);
    n = normalize(n-tgd*BUMP_STRENGTH*2./(ds));
    return n;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{	
	vec2 bp = fragCoord.xy/iResolution.xy*2.-1.; 
    vec2 p = bp;
	p.x*=iResolution.x/iResolution.y;
	vec2 mo = iMouse.xy / iResolution.xy-.5;
    mo = (mo==vec2(-.5))?mo=vec2(0.4,-0.25):mo;
	mo.x *= iResolution.x/iResolution.y;
	
    
    mo.y = 0.425;// lock the shape to be 'companion cube-ish in appearance
    mo.y += (0.5 * abs(sin(iGlobalTime)))-0.15; 
    
    p.x += mo.x*1.;
    sdfsw = mo.y*4.;
    
	vec3 ro = vec3(0.,0.,4.);
    vec3 rd = normalize(vec3(p,-3.+sin(time*0.9+sin(time))));
    mat2 mx = mm2(time*.1+sin(time*0.4)-0.2);
    mat2 my = mm2(time*0.07+cos(time*0.33)-0.1);
    ro.xz *= mx;rd.xz *= mx;
    ro.xy *= my;rd.xy *= my;
	
	float rz = march(ro,rd);
	
    vec3 col = vec3(0);
    
    if ( rz < FAR )
    {
        vec3 pos = ro+rz*rd;
        vec3 nor= normal( pos );
        pos = prlpos(pos,nor,rd);
        float d = distance(ro,pos);
        nor = bump(pos, nor, d);

        vec3 ligt = normalize( vec3(-.5, 0.5, -0.3) );
        float dif = clamp( dot( nor, ligt ), 0.0, 1.0 );
        float bac = clamp( dot( nor, normalize(vec3(-ligt))), 0.0, 1.0 );
        float spe = pow(clamp( dot( reflect(rd,nor), ligt ), 0.0, 1.0 ),10.);
        float fre = pow( clamp(1.0+dot(nor,rd),0.0,1.0), 2.0 );
        vec3 brdf = vec3(0.3);
        brdf += bac*vec3(0.3);
        brdf += dif*0.5;
        
        float tx=  tex(pos);
        col = sin(vec3(1.5+mo.x*0.4,2.2+mo.x*0.25,2.7)+tx*1.2+4.2)*0.6+0.55;
        col = col*brdf + spe*.5/sqrt(rz) +.25*fre;
        
        col = mix(col,vec3(.0),clamp(exp(rz*0.43-4.),0.,1.));
    }
 
    col.x *= col.z;//colorize
    col.xyz = col.zxy;//color channel flip!   
    
    
    col = clamp(col*1.05,0.,1.);
    col *= pow(smoothstep(0.,.2,(bp.x + 1.)*(bp.y + 1.)*(bp.x - 1.)*(bp.y - 1.)),.3);
    col *= smoothstep(3.9,.5,sin(p.y*.5*iResolution.y+time*10.))+0.1;
    col -= hash(col.xy+p.xy)*.025;
	

    
	fragColor = vec4( col, 1.0 );
}
//_______________________________________________________________________________________________________





void main( void)
{
	mainImage(gl_FragColor, gl_FragCoord.xy);
}