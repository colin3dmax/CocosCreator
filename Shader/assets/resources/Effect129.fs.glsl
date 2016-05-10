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


// Compressing normals by using Spherical Fibonacci points, as described by this paper
// by Benjamin Keinert, Matthias Innmann, Michael Sanger and Marc Stamminger

// The digits indicate the number of bits used to encode the normal. At 16 bits the  normals 
// look pretty good for this model and view distance (I added some specular to the shading so
// that normal compression artifacts would be more obvious). That means that the compression
// ratio would be of 6x (for a regular vec3 normal). With 12 bits the quality is pretty decent,
// and the compression would be 8x.

// The lack of 2D coherency makes it less efficient for compression of normals for disk-storage 
// of meshes or normalmaps though, where the current normal could be predicted from the previous 
// or neighboring normals. But for bast indexing / constant bitrate kind of compression scenarios
// (compact vertex format for rendering) it's perfec!

// Can somebody investigate a 2D hilbert curve maybe? That would be killer.

// Check https://www.shadertoy.com/view/lllXz4 for a simpler version of the code below.


//=================================================================================================
// http://lgdv.cs.fau.de/uploads/publications/spherical_fibonacci_mapping_opt.pdf
//=================================================================================================

const float PI = 3.1415926535897932384626433832795;
const float PHI = 1.6180339887498948482045868343656;

float round( float x ) { return floor(x+0.5); }
float madfrac( float a,float b) { return a*b -floor(a*b); }
vec2  madfrac( vec2 a, float b) { return a*b -floor(a*b); }

float sf2id(vec3 p, float n) 
{
    float phi = min(atan(p.y, p.x), PI), cosTheta = p.z;
    
    float k  = max(2.0, floor( log(n * PI * sqrt(5.0) * (1.0 - cosTheta*cosTheta))/ log(PHI*PHI)));
    float Fk = pow(PHI, k)/sqrt(5.0);
    
    vec2 F = vec2( round(Fk), round(Fk * PHI) );

    vec2 ka = -2.0*F/n;
    vec2 kb = 2.0*PI*madfrac(F+1.0, PHI-1.0) - 2.0*PI*(PHI-1.0);    
    mat2 iB = mat2( ka.y, -ka.x, -kb.y, kb.x ) / (ka.y*kb.x - ka.x*kb.y);

    vec2 c = floor( iB * vec2(phi, cosTheta - (1.0-1.0/n)));
    float d = 8.0;
    float j = 0.0;
    for( int s=0; s<4; s++ ) 
    {
        vec2 uv = vec2( float(s-2*(s/2)), float(s/2) );
        
        float cosTheta = dot(ka, uv + c) + (1.0-1.0/n);
        
        cosTheta = clamp(cosTheta, -1.0, 1.0)*2.0 - cosTheta;
        float i = floor(n*0.5 - cosTheta*n*0.5);
        float phi = 2.0*PI*madfrac(i, PHI-1.0);
        cosTheta = 1.0 - (2.0*i + 1.0)/n;
        float sinTheta = sqrt(1.0 - cosTheta*cosTheta);
        
        vec3 q = vec3( cos(phi)*sinTheta, sin(phi)*sinTheta, cosTheta);
        float squaredDistance = dot(q-p, q-p);
        if (squaredDistance < d) 
        {
            d = squaredDistance;
            j = i;
        }
    }
    return j;
}

vec3 id2sf( float i, float n) 
{
    float phi = 2.0*PI*madfrac(i,PHI);
    float zi = 1.0 - (2.0*i+1.0)/n;
    float sinTheta = sqrt( 1.0 - zi*zi);
    return vec3( cos(phi)*sinTheta, sin(phi)*sinTheta, zi);
}


//=================================================================================================
// digit drawing function by P_Malin (https://www.shadertoy.com/view/4sf3RN)
//=================================================================================================
float SampleDigit(const in float n, const in vec2 vUV)
{		
	if(vUV.x  < 0.0) return 0.0;
	if(vUV.y  < 0.0) return 0.0;
	if(vUV.x >= 1.0) return 0.0;
	if(vUV.y >= 1.0) return 0.0;
	
	float data = 0.0;
	
	     if(n < 0.5) data = 7.0 + 5.0*16.0 + 5.0*256.0 + 5.0*4096.0 + 7.0*65536.0;
	else if(n < 1.5) data = 2.0 + 2.0*16.0 + 2.0*256.0 + 2.0*4096.0 + 2.0*65536.0;
	else if(n < 2.5) data = 7.0 + 1.0*16.0 + 7.0*256.0 + 4.0*4096.0 + 7.0*65536.0;
	else if(n < 3.5) data = 7.0 + 4.0*16.0 + 7.0*256.0 + 4.0*4096.0 + 7.0*65536.0;
	else if(n < 4.5) data = 4.0 + 7.0*16.0 + 5.0*256.0 + 1.0*4096.0 + 1.0*65536.0;
	else if(n < 5.5) data = 7.0 + 4.0*16.0 + 7.0*256.0 + 1.0*4096.0 + 7.0*65536.0;
	else if(n < 6.5) data = 7.0 + 5.0*16.0 + 7.0*256.0 + 1.0*4096.0 + 7.0*65536.0;
	else if(n < 7.5) data = 4.0 + 4.0*16.0 + 4.0*256.0 + 4.0*4096.0 + 7.0*65536.0;
	else if(n < 8.5) data = 7.0 + 5.0*16.0 + 7.0*256.0 + 5.0*4096.0 + 7.0*65536.0;
	else if(n < 9.5) data = 7.0 + 4.0*16.0 + 7.0*256.0 + 5.0*4096.0 + 7.0*65536.0;
	
	vec2 vPixel = floor(vUV * vec2(4.0, 5.0));
	float fIndex = vPixel.x + (vPixel.y * 4.0);
	
	return mod(floor(data / pow(2.0, fIndex)), 2.0);
}

float PrintInt( in vec2 uv, in float value )
{
	float res = 0.0;
	float maxDigits = 1.0+ceil(.01+log2(value)/log2(10.0));
	float digitID = floor(uv.x);
	if( digitID>0.0 && digitID<maxDigits )
	{
        float digitVa = mod( floor( value/pow(10.0,maxDigits-1.0-digitID) ), 10.0 );
        res = SampleDigit( digitVa, vec2(fract(uv.x), uv.y) );
	}

	return res;	
}

//=================================================================================================
// all iq code below
//=================================================================================================

float map( vec3 p )
{
    p.xz *= 0.8;
    p.xyz += 1.000*sin(  2.0*p.yzx );
    p.xyz -= 0.500*sin(  4.0*p.yzx );
    float d = length( p.xyz ) - 1.5;
	return d * 0.25;
}


float intersect( in vec3 ro, in vec3 rd )
{
	const float maxd = 7.0;

	float precis = 0.001;
    float h = 1.0;
    float t = 1.0;
    for( int i=0; i<256; i++ )
    {
        if( (h<precis) || (t>maxd) ) break;
	    h = map( ro+rd*t );
        t += h;
    }

    if( t>maxd ) t=-1.0;
	return t;
}

vec3 calcNormal( in vec3 pos )
{
    // from Paul Malin (4 samples only in a tetrahedron	
    vec2 e = vec2(1.0,-1.0)*0.002;
    return normalize( e.xyy*map( pos + e.xyy ) + 
					  e.yyx*map( pos + e.yyx ) + 
					  e.yxy*map( pos + e.yxy ) + 
					  e.xxx*map( pos + e.xxx ) );
}

float hash1( float n )
{
    return fract(sin(n)*43758.5453123);
}

float calcAO( in vec3 pos, in vec3 nor, in vec2 pix )
{
	float ao = 0.0;
    for( int i=0; i<128; i++ )
    {
        vec3 ap = id2sf( float(i), 128.0 );
		ap *= sign( dot(ap,nor) ) * hash1(float(i));
        ao += clamp( map( pos + nor*0.05 + ap*1.0 )*32.0, 0.0, 1.0 );
    }
	ao /= 128.0;
	
    return clamp( ao*ao, 0.0, 1.0 );
}

mat3 setCamera( in vec3 ro, in vec3 rt, in float cr )
{
	vec3 cw = normalize(rt-ro);
	vec3 cp = vec3(sin(cr), cos(cr),0.0);
	vec3 cu = normalize( cross(cw,cp) );
	vec3 cv = normalize( cross(cu,cw) );
    return mat3( cu, cv, -cw );
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 p = (-iResolution.xy+2.0*fragCoord.xy)/iResolution.y;
	vec2 q = fragCoord/iResolution.xy;
	
    //-----------------------------------------------------


    float ti = mod( 0.25*iGlobalTime, 8.0 );
    float am = clamp( ti/3.0, 0.0, 1.0 ) - clamp( (ti-4.0)/3.0, 0.0, 1.0 );
    float bits = 1.0 + floor(15.0*am);
    float precis = pow(2.0,bits);
    
    //-----------------------------------------------------
	
	float an = 4.0 + 0.1*iGlobalTime;
    
	vec3 ro = vec3(4.5*sin(an),2.0,4.5*cos(an));
    vec3 ta = vec3(0.0,0.0,0.0);
    mat3 ca = setCamera( ro, ta, 0.0 );
    vec3 rd = normalize( ca * vec3(p,-1.5) );

    //-----------------------------------------------------
    
	vec3 col = vec3(0.07)*clamp(1.0-length(q-0.5),0.0,1.0);

    float t = intersect(ro,rd);
    if( t>0.0 )
    {
        vec3 pos = ro + t*rd;
        vec3 nor = calcNormal(pos);
		vec3 ref = reflect( rd, nor );
        vec3 sor = nor;
        
        // compress normal
        float id = sf2id( nor, precis );
        
        // decompress normal
        nor = id2sf( id, precis);
        
        nor = (p.x>0.0) ? nor : sor;

        // material
		col = vec3(0.2);
        col *= 1.0 + 0.5*nor;

        
		// lighting
		float occ = calcAO( pos, nor, fragCoord ); occ = occ*occ;
        float sky = 0.5 + 0.5*nor.y;
        float fre = clamp( 1.0 + dot(nor,rd), 0.0, 1.0 );
        float spe = pow(max( dot(-rd,nor),0.0),32.0);
		// lights
		vec3 lin  = vec3(0.0);
		     lin += 3.0*vec3(0.7,0.80,1.00)*sky*occ;
        	 lin += 8.0*vec3(0.7,0.8,1.00)*smoothstep(0.0,0.2,ref.y)*(0.1+0.9*pow(fre,5.0))*sky*occ;
             lin += 1.0*fre*vec3(1.0,0.90,0.80)*(0.1+0.9*occ);
        col = col * lin;
        col += 0.50*spe*occ;
        col += 0.15*spe*spe*spe*occ;
	}

	
	col = sqrt(col);
    
    col += PrintInt( (q-vec2(0.7,0.75))*12.0*vec2(1.0,iResolution.y/iResolution.x), bits );

    col *= smoothstep( 0.003,0.004,abs(q.x-0.5) );

    fragColor = vec4( col, 1.0 );
}


//_______________________________________________________________________________________________________





void main( void)
{
	mainImage(gl_FragColor, gl_FragCoord.xy);
}