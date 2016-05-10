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
// Based on Sun Surface: https://www.shadertoy.com/view/XlSSzK#
// Based on Shanes' Fiery Spikeball https://www.shadertoy.com/view/4lBXzy (I think that his implementation is more understandable than the original :) ) 
// Relief come from Siggraph workshop by Beautypi/2015 https://www.shadertoy.com/view/MtsSRf
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0
// Audio based texture as seen in Cubescape: https://www.shadertoy.com/view/Msl3Rr
// Minor customisations by Quad Damage on 13/03/2016
// Dancing Sun tribute to Burning Man 2015
// Music by Paul Oakenfold - Souther Sun: https://soundcloud.com/pauloakenfold/02-paul-oakenfold-southern-sun

//#define ULTRAVIOLET
//#define DITHERING

#define pi 3.14159265
#define R(p, a) p=cos(a)*p+sin(a)*vec2(p.y, -p.x)

//
float freqs[4];

float hash( float n ) { return fract(sin(n)*13.5453123); }

// IQ's noise
float pn( in vec3 p )
{
    vec3 ip = floor(p);
    p = fract(p);
    p *= p*(3.0-2.0*p);
    vec2 uv = (ip.xy+vec2(37.0,17.0)*ip.z) + p.xy;
    uv = texture2D( iChannel0, (uv+ 0.5)/256.0, -100.0 ).yx;
    return mix( uv.x, uv.y, p.z );
}

// FBM
float fpn(vec3 p) {
    return pn(p*.06125)*.57 + pn(p*.125)*.28 + pn(p*.25)*.15;
}

float rand(vec2 co){// implementation found at: lumina.sourceforge.net/Tutorials/Noise.html
	return fract(sin(dot(co*0.123,vec2(12.9898,78.233))) * 43758.5453);
}

float cosNoise( in vec2 p )
{
    return 0.3*( sin(p.x) + sin(p.y) );
}

const mat2 m2 = mat2(1.6,-1.2,
                     1.2, 1.6);

float sdTorus( vec3 p, vec2 t )
{
  return length( vec2(length(p.xz)-t.x*1.2,p.y) )-t.y;
}

float smin( float a, float b, float k )
{
	float h = clamp( 1.0 + 0.5*(b-a)/k, 0.0, 1.0 );
	return mix( b, a, h ) - k*h*(1.0-h);
}

float SunSurface( in vec3 pos )
{
    float h = 0.0;
    vec2 q = pos.xz*0.5;
    
    float s = 0.5;
    
    float d2 = 0.0;
    vec3 ipos = floor( pos );
    float id = hash( ipos.x*1.0 + ipos.y*10.0 + ipos.z*20.0);
    
    for( int i=0; i<4; i++ )
    {
        h += s*cosNoise( q );      
        q = m2*q*1.05; 
        q += vec2(2.41,8.13);
        s *= 0.48 + 0.5*h;
    }
    	h += 0.4*(freqs[0] * clamp(1.0 - abs(id-0.20)/0.30, 0.0, 1.0 ));
 		h += 0.4*(freqs[1] * clamp(1.0 - abs(id-0.40)/0.30, 0.0, 1.0 ));
        h += 0.4*(freqs[2] * clamp(1.0 - abs(id-0.60)/0.30, 0.0, 1.0 ));
        h += 0.4*(freqs[3] * clamp(1.0 - abs(id-0.80)/0.30, 0.0, 1.0 ));
    h *= 3.0;
    
    float d1 = pos.y - h;
   
    // rings
    vec3 r1 = mod(2.3+pos+1.0,10.0)-5.0;
    r1.y = pos.y-0.1 - 0.7*h + 0.5*sin( 3.0*iGlobalTime+pos.x + 3.0*pos.z);
    float c = cos(pos.x); float s1 = 1.0;//sin(pos.x);
    r1.xz=c*r1.xz+s1*vec2(r1.z, -r1.x);
    d2 = sdTorus( r1.xzy, vec2(clamp(abs(pos.x/pos.z),0.7,5.0), 0.50) );

    
    return smin( d1, d2, 1.0 );
}

float map(vec3 p) {
   p.z += 1.;
   R(p.yz, -25.5);// -1.0+iMouse.y*0.003);
   R(p.xz, iMouse.x*0.008*pi+iGlobalTime*0.1);
   return SunSurface(p) +  fpn(p*10.+iGlobalTime*25.) * 0.45;
}

// See "Combustible Voronoi"
// https://www.shadertoy.com/view/4tlSzl
vec3 firePalette(float i){

    float T = 1400. + 1300.*i; // Temperature range (in Kelvin).
    vec3 L = vec3(7.4, 5.6, 4.4); // Red, green, blue wavelengths (in hundreds of nanometers).
    L = pow(L,vec3(5.0)) * (exp(1.43876719683e5/(T*L))-1.0);
    return 1.0-exp(-5e8/L); // Exposure level. Set to "50." For "70," change the "5" to a "7," etc.
}


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{  
    
    freqs[0] = texture2D( iChannel1, vec2( 0.01, 0.25 ) ).x;
	freqs[1] = texture2D( iChannel1, vec2( 0.07, 0.25 ) ).x;
	freqs[2] = texture2D( iChannel1, vec2( 0.15, 0.25 ) ).x;
	freqs[3] = texture2D( iChannel1, vec2( 0.30, 0.25 ) ).x;
   // p: position on the ray
   // rd: direction of the ray
   vec3 rd = normalize(vec3((gl_FragCoord.xy-0.5*iResolution.xy)/iResolution.y, 1.));
   vec3 ro = vec3(0., 0., -22.);
   
   // ld, td: local, total density 
   // w: weighting factor
   float ld=0.2, td=0.2, w=0.2;

   // t: length of the ray
   // d: distance function
   float d=1., t=1.;
   
   // Distance threshold.
   const float h = .2;
    
   // total color
   vec3 tc = vec3(0.);
   
   #ifdef DITHERING
   vec2 pos = ( fragCoord.xy / iResolution.xy );
   vec2 seed = pos + fract(iGlobalTime);
   //t=(1.+0.2*rand(seed));
   #endif
    
   // rm loop
   for (int i=0; i<56; i++) {

      // Loop break conditions. Seems to work, but let me
      // know if I've overlooked something.
      if(td>(1.-1./200.) || d<0.001*t || t>40.)break;
       
      // evaluate distance function
      d = map(ro+t*rd); 
      
      // check whether we are close enough (step)
      // compute local density and weighting factor 
      //const float h = .1;
      ld = (h - d) * step(d, h);
      w = (1. - td) * ld;   
     
      // accumulate color and density
      tc += w*w + 1./60.;  // Different weight distribution.
      td += w + 1./200.;

	  // dithering implementation come from Eiffies' https://www.shadertoy.com/view/MsBGRh
      #ifdef DITHERING  
      #ifdef ULTRAVIOLET
      // enforce minimum stepsize
      d = max(d, 0.04);
      // add in noise to reduce banding and create fuzz
      d=abs(d)*(1.+0.28*rand(seed*vec2(i)));
      #else
      // add in noise to reduce banding and create fuzz
      d=abs(d)*(.8+0.28*rand(seed*vec2(i)));
      // enforce minimum stepsize
      d = max(d, 0.04);
      #endif 
      #else
      // enforce minimum stepsize
      d = max(d, 0.04);        
      #endif

       
      // step forward
      t += d*0.5;
      
   }

   // Fire palette.
   tc = firePalette(tc.x);
    tc *= 1. /  1.1;
   #ifdef ULTRAVIOLET
   tc *= 1. / exp( ld * 2.82 ) * 1.05;
   #endif
    
   fragColor = vec4(tc, 1.0);
}

//_______________________________________________________________________________________________________





void main( void)
{
	mainImage(gl_FragColor, gl_FragCoord.xy);
}