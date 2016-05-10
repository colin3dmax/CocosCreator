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

//Will it blend by nmz (twitter: @stormoid)

/*
	Idea from: http://www.stuartdenman.com/improved-color-blending/

	Most people will tell you that blending in rgb space is a bad,
	but why is it so bad?

	Here's an unlisted shader to show and explain the issue: 
	https://www.shadertoy.com/view/XddGRN


	This shader is about different solutions to this problem:

	The left gradient is plain RGB Linear interpolation, showing nice
	behavior when the interploated colors are close to each other
	(especially when close in hue) but prone to large changes in color
	saturation along the gradient when the hues are further	apart.

	The second gradient from the left is HSV space blending, this
	completely solves the problem of avoiding low saturation colors
	when the two interpolated colors are of high saturation	but of
	different hues, but it creates other problems by not accounting
	for human perception of lightness, resulting in gradients with 
	potentially large changes in percieved color "brightness". This 
	method is also much costlier than plain rgb	interpolation (see 
	bottom of comment).

	The third gradient from the left is Lch space blending, it uses a 
	cylindrical space with circular hues, just like HSV space, but it
	takes into account human perception of color and results in	very
	natural and smooth gradients.  The main issue with this method is 
	that the complete computation is quite expensive.

	The fourth gradient is a method I developed to provide an alternative
	to the costly methods while improving the quality of the gradients
	compared to simple rgb linear interpolation. The idea comes from
	observation of the rgb colorspace's cube and where the low saturation
	area is located within it.  The result is a rgb blending function that
	provides decent quality gradients (you be the judge) at a very
	acceptable computational cost.  One thing that could be improved about
	the algortihm is the behavior when the hues are very close to opposite
	(180 degrees apart), ideally the path would make the gradient hue
	shifted towards its	side of the main diagonal, but I couldn't find a
	way to achieve this cheaply enough...
	

	Comparison of the relative costs:
	On Radeon HD 5670 (using GPU ShaderAnalyzer)
	
From Left to Right:
	1st method (Lerp): 3 Instructions,  1 cycle
	2nd Method (HSV) : 34 Instructions, 7 cycles
	3rd Method (Lch) : 57 Instructions, 11.60 cycles
	4th Method (Mine): 15 Instructions, 3.20 cycles
*/


//Allows to scale the saturation and Value/Lightness of the 2nd color
const float SAT2MUL = 1.0;
const float L2MUL = 1.0;


//const vec3 wref =  vec3(.950456, 1.0, 1.089058); 
const vec3 wref =  vec3(1.0, 1.0, 1.0); 

#define SMOOTH_HSV

#define ITR 50
#define FAR 8.
#define time iGlobalTime

const float fov = 1.5;
vec2 mo;
mat2 mm2(in float a){float c = cos(a), s = sin(a);return mat2(c,s,-s,c);}

//---------------------------------------------------------------------------------
//--------------------------------Color Functions----------------------------------
//---------------------------------------------------------------------------------

#define PI 3.14159365
#define TAU 6.28318531


float sRGB(float t){ return mix(1.055*pow(t, 1./2.4) - 0.055, 12.92*t, step(t, 0.0031308)); }
vec3 sRGB(in vec3 c) { return vec3 (sRGB(c.x), sRGB(c.y), sRGB(c.z)); }

//-----------------Lch-----------------

float xyzF(float t){ return mix(pow(t,1./3.), 7.787037*t + 0.139731, step(t,0.00885645)); }
float xyzR(float t){ return mix(t*t*t , 0.1284185*(t - 0.139731), step(t,0.20689655)); }
vec3 rgb2lch(in vec3 c)
{
	c  *= mat3( 0.4124, 0.3576, 0.1805,
          		0.2126, 0.7152, 0.0722,
                0.0193, 0.1192, 0.9505);
    c.x = xyzF(c.x/wref.x);
	c.y = xyzF(c.y/wref.y);
	c.z = xyzF(c.z/wref.z);
	vec3 lab = vec3(max(0.,116.0*c.y - 16.0), 500.0*(c.x - c.y), 200.0*(c.y - c.z)); 
    return vec3(lab.x, length(vec2(lab.y,lab.z)), atan(lab.z, lab.y));
}

vec3 lch2rgb(in vec3 c)
{
    c = vec3(c.x, cos(c.z) * c.y, sin(c.z) * c.y);
    
    float lg = 1./116.*(c.x + 16.);
    vec3 xyz = vec3(wref.x*xyzR(lg + 0.002*c.y),
    				wref.y*xyzR(lg),
    				wref.z*xyzR(lg - 0.005*c.z));
    
    vec3 rgb = xyz*mat3( 3.2406, -1.5372,-0.4986,
          		        -0.9689,  1.8758, 0.0415,
                	     0.0557,  -0.2040, 1.0570);
    
    return rgb;
}

//cheaply lerp around a circle
float lerpAng(in float a, in float b, in float x)
{
    float ang = mod(mod((a-b), TAU) + PI*3., TAU)-PI;
    return ang*x+b;
}

//Linear interpolation between two colors in Lch space
vec3 lerpLch(in vec3 a, in vec3 b, in float x)
{
    float hue = lerpAng(a.z, b.z, x);
    return vec3(mix(b.xy, a.xy, x), hue);
}

//-----------------HSV-----------------

//HSV functions from iq (https://www.shadertoy.com/view/MsS3Wc)
#ifdef SMOOTH_HSV
vec3 hsv2rgb( in vec3 c )
{
    vec3 rgb = clamp( abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );

	rgb = rgb*rgb*(3.0-2.0*rgb); // cubic smoothing	

	return c.z * mix( vec3(1.0), rgb, c.y);
}
#else
vec3 hsv2rgb( in vec3 c )
{
    vec3 rgb = clamp( abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );

	return c.z * mix( vec3(1.0), rgb, c.y);
}
#endif

//From Sam Hocevar: http://lolengine.net/blog/2013/07/27/rgb-to-hsv-in-glsl
vec3 rgb2hsv(vec3 c)
{
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

//Linear interpolation between two colors in normalized (0..1) HSV space
vec3 lerpHSV(in vec3 a, in vec3 b, in float x)
{
    float hue = (mod(mod((b.x-a.x), 1.) + 1.5, 1.)-0.5)*x + a.x;
    return vec3(hue, mix(a.yz, b.yz, x));
}

//---------------Improved RGB--------------

/*
	The idea behind this function is to avoid the low saturation area in the
	rgb color space. This is done by getting the direction to that diagonal
	and displacing the interpolated	color by it's inverse while scaling it
	by saturation error and desired lightness. 

	I find it behaves very well under most circumstances, the only instance
	where it doesn't behave ideally is when the hues are very close	to 180 
	degrees apart, since the method I am using to find the displacement vector
	does not compensate for non-curving motion. I tried a few things to 
	circumvent this problem but none were cheap and effective enough..
*/

//Changes the strength of the displacement
#define DSP_STR 1.5

//Optimizaton for getting the saturation (HSV Type) of a rgb color
#if 0
float getsat(vec3 c)
{
    c.gb = vec2(max(c.g, c.b), min(c.g, c.b));
	c.rg = vec2(max(c.r, c.g), min(c.r, c.g));   
	return (c.r - min(c.g, c.b)) / (c.r + 1e-7);
}
#else
//Further optimization for getting the saturation
float getsat(vec3 c)
{
    float mi = min(min(c.x, c.y), c.z);
    float ma = max(max(c.x, c.y), c.z);
    return (ma - mi)/(ma+ 1e-7);
}
#endif

//Improved rgb lerp
vec3 iLerp(in vec3 a, in vec3 b, in float x)
{
    //Interpolated base color (with singularity fix)
    vec3 ic = mix(a, b, x) + vec3(1e-6,0.,0.);
    
    //Saturation difference from ideal scenario
    float sd = abs(getsat(ic) - mix(getsat(a), getsat(b), x));
    
    //Displacement direction
    vec3 dir = normalize(vec3(2.*ic.x - ic.y - ic.z, 2.*ic.y - ic.x - ic.z, 2.*ic.z - ic.y - ic.x));
    //Simple Lighntess
    float lgt = dot(vec3(1.0), ic);
    
    //Extra scaling factor for the displacement
    float ff = dot(dir, normalize(ic));
    
    //Displace the color
    ic += DSP_STR*dir*sd*ff*lgt;
    return clamp(ic,0.,1.);
}


//---------------------------------------------------------------------------------
//---------------------------------------------------------------------------------
//---------------------------------------------------------------------------------
//---------------------------------------------------------------------------------

float sbox( vec3 p, vec3 b ){
  vec3 d = abs(p) - b;
  return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
}

float cyl( vec3 p, vec2 h ){
  vec2 d = abs(vec2(length(p.xz),p.y)) - h;
  return min(max(d.x,d.y),0.0) + length(max(d,0.0));
}

float map(vec3 p)
{
    vec3 p2 = p;
    p2.xz *= mm2(-time*0.4);
    float d = max(cyl(p, vec2(1.,1.)), -sbox(p2 - vec3(1,1.,0), vec3(1.1+mo.x*0.6, 0.8 - mo.y*2.2, 1.2)));
    return max(d, -cyl(p + vec3(0.,-2.2-mo.y*2.2,0), vec2(0.75+sin(time)*0.2,2.)));
}

vec3 shade(in vec3 pos, in vec3 rd)
{
    vec3 col = vec3(0);
    vec2 plr = vec2(length(pos.xz), atan(pos.z,pos.x));
    
    vec3 colLch = lch2rgb(vec3(pos.y*50.+50.,plr.x*100. , plr.y));
    vec3 colHsv = hsv2rgb(vec3(plr.y/6.2831853, plr.x, pos.y*0.5+0.5));
    
    col = mix(colLch, colHsv, smoothstep(0.5,0.5, sin(time*0.5+0.1)));
    
    return col;
}

//From eiffie: https://www.shadertoy.com/view/XsSXDt
vec3 marchAA(in vec3 ro, in vec3 rd, in vec3 bgc, in float px, in mat3 cam)
{
    float precis = px*.1;
    float prb = precis;
    float t=map(ro);
	vec3 col = vec3(0);
	float dm=100.0,tm=0.0,df=100.0,tf=0.0,od=1000.0,d=0.;
	for(int i=0;i<ITR;i++) {
		d=map(ro+rd*t);
		if(df==50.0) {
			if(d>od) {
				if(od<px*(t-od)) {
					df=od;tf=t-od;
				}
			}
			od=d;
		}
		if(d<dm){tm=t;dm=d;}
		t+=d;
		if(t>FAR || d<precis)break;
	}
	col=bgc;
    
	if(dm<px*tm)
        col=mix(shade((ro+rd*tm) - rd*(px*(tm-dm)) ,rd),col,clamp(dm/(px*tm),0.0,1.0));
    
	float qq=0.0;
	
    if((df==100.0 || tm==tf) && t < FAR) {
        ro+=cam*vec3(0.5,0.5,0.)*px*tm*1.;
        tf=tm;
        df=dm;
        qq=.01;
	}
    return mix(shade((ro+rd*tf) - rd*(px*tf-df),rd),col,clamp(qq+df/(px*tf),0.0,1.0));
}

mat3 rot_x(float a){float sa = sin(a); float ca = cos(a); return mat3(1.,.0,.0,    .0,ca,sa,   .0,-sa,ca);}
mat3 rot_y(float a){float sa = sin(a); float ca = cos(a); return mat3(ca,.0,sa,    .0,1.,.0,   -sa,.0,ca);}
mat3 rot_z(float a){float sa = sin(a); float ca = cos(a); return mat3(ca,sa,.0,    -sa,ca,.0,  .0,.0,1.);}

//2d Box
float box(in vec2 p, in vec2 b) 
{
    return length(max(abs(p)-b,0.));
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{	
    float px= 2./(iResolution.y*fov);
	vec2 q = fragCoord.xy / iResolution.xy;
    vec2 p = q - 0.5;
    vec2 pp = p;
	p.x*=iResolution.x/iResolution.y;
	mo = iMouse.xy / iResolution.xy-.5;
    mo = (mo==vec2(-.5))?mo=vec2(0.12,0.15):mo;
	mo.x *= iResolution.x/iResolution.y;
    
    vec3 ro = vec3(1.1,0.,5.);
    vec3 rd = normalize(vec3(p,-1.6)); 
    float rx = 0.45;
    float ry = time*0.4+1.1+cos(time)*0.1;
    
    mat3 cam = rot_x(rx)*rot_y(ry);
   	ro *= cam;
	rd *= cam;
    
    //vec3 col = mix(vec3(0.9,.9,.95),vec3(0.2,0.2,0.27),(-1.-rd.y)*1.0+.8);
    vec3 col = vec3(0.9);
    col = marchAA(ro, rd, col, px, cam);
    
    
    //-------------------------2D stuff------------------------------
    
    vec3 col1 = vec3(0.26-time*0.0638 + mo.x*0.1, .8 + sin(time)*0.2, clamp(mo.y+0.6,0.,1.));
    vec3 col2 = vec3(.75-time*0.0638 - mo.x*0.1, (.8 + sin(time)*0.2) * SAT2MUL, clamp(mo.y+0.6,0.,1.)*L2MUL);
    
    float gradient = clamp((p.y+0.42)*1.25,0.,1.);
    
    vec3 gradHSV = lerpHSV(col2, col1, gradient);
    
    col1 = hsv2rgb(col1);
    col2 = hsv2rgb(col2);
    gradHSV = hsv2rgb(gradHSV);
    
    vec3 col1Lch = rgb2lch(col1);
    vec3 col2Lch = rgb2lch(col2);
    
    vec3 gradLch = lerpLch(col1Lch, col2Lch, gradient);
    gradLch = lch2rgb(gradLch);
    vec3 gradRGB = mix(col2, col1, gradient);
    
    vec3 gradDSP = iLerp(col2, col1, gradient);
    
    float h = clamp(mo.y,-.45,.4);
    float h2 = clamp(mo.x,-.7,1.);
    float b1 = smoothstep(0.01, .0, box(p - vec2(-0.67-h*0.15 + sin(-h2*1.1-1.6)*0.12,h*0.8 + h2*0.13),
                                        vec2(0.02,0.02))-0.015);
    col = col*(1.-smoothstep(0.,.5,b1)) + vec3(col1)*b1;
    
    float b2 = smoothstep(0.01, .0, box(p - vec2(-0.16-h*0. + sin(h2*1.1+1.9)*0.2, 0.15 + h*0.55 + h2*0.13),
                                        vec2(0.02,0.02))-0.015);
    col = col*(1.-smoothstep(0.,.5,b2)) + vec3(col2)*b2;
    
    float b3 = smoothstep(0.01, 0., box(p - vec2(0.18,0.0), vec2(0.06,0.4)));
    col = col*(1.-smoothstep(0.,.5,b3)) + vec3(gradRGB)*b3;
    
    float b4 = smoothstep(0.01, 0., box(p - vec2(0.36,0.0), vec2(0.06,0.4)));
    col = col*(1.-smoothstep(0.,.5,b4)) + vec3(gradHSV)*b4;
    
    float b5 = smoothstep(0.01, 0., box(p - vec2(0.54,0.0), vec2(0.06,0.4)));
    col = col*(1.-smoothstep(0.,.5,b5)) + vec3(gradLch)*b5;
    
    float b6 = smoothstep(0.01, 0., box(p - vec2(0.73,0.0), vec2(0.06,0.4)));
    col = col*(1.-smoothstep(0.,.5,b6)) + vec3(gradDSP)*b6;
    
    
    //Light and sharp vignette so that the colors don't get influenced
    vec2 pp3 = pp*pp*pp;
    col *= pow(smoothstep(12., .05, dot(pp3*pp3,pp3*pp3)*1000.),1000.)*0.4+0.6;
    
    col = sRGB(col);
    
    
	fragColor = vec4( col, 1.0 );
}
//_______________________________________________________________________________________________________



void main( void)
{
	mainImage(gl_FragColor, gl_FragCoord.xy);
}