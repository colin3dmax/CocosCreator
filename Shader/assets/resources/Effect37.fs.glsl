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
// Created by inigo quilez - iq/2013
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.

// A test on using ray differentials (only primary rays for now) to choose texture filtering
// footprint, and adaptively supersample/filter the procedural texture/patter (up to a rate
// of 10x10).

// This solves texture aliasing without resorting to full-screen 10x10 supersampling, which would
// involve doing raytracing and lighting 10x10 times (not realtime at all).
 
// The tecnique should be used to filter every texture independently. The ratio of the supersampling
// could be inveresely proportional to the screen/lighing supersampling rate such that the cost
// of texturing would be constant no matter the final image quality settings.


//===============================================================================================
//===============================================================================================

const int MaxSamples = 10;  // 10*10

//===============================================================================================
//===============================================================================================
// noise implementation
//===============================================================================================
//===============================================================================================

vec3 hash3( vec3 p )
{
	p = vec3( dot(p,vec3(127.1,311.7, 74.7)),
			  dot(p,vec3(269.5,183.3,246.1)),
			  dot(p,vec3(113.5,271.9,124.6)));

	return -1.0 + 2.0*fract(sin(p)*13.5453123);
}

float noise( in vec3 p )
{
    vec3 i = floor( p );
    vec3 f = fract( p );
	
	vec3 u = f*f*(3.0-2.0*f);

    return mix( mix( mix( dot( hash3( i + vec3(0.0,0.0,0.0) ), f - vec3(0.0,0.0,0.0) ), 
                          dot( hash3( i + vec3(1.0,0.0,0.0) ), f - vec3(1.0,0.0,0.0) ), u.x),
                     mix( dot( hash3( i + vec3(0.0,1.0,0.0) ), f - vec3(0.0,1.0,0.0) ), 
                          dot( hash3( i + vec3(1.0,1.0,0.0) ), f - vec3(1.0,1.0,0.0) ), u.x), u.y),
                mix( mix( dot( hash3( i + vec3(0.0,0.0,1.0) ), f - vec3(0.0,0.0,1.0) ), 
                          dot( hash3( i + vec3(1.0,0.0,1.0) ), f - vec3(1.0,0.0,1.0) ), u.x),
                     mix( dot( hash3( i + vec3(0.0,1.0,1.0) ), f - vec3(0.0,1.0,1.0) ), 
                          dot( hash3( i + vec3(1.0,1.0,1.0) ), f - vec3(1.0,1.0,1.0) ), u.x), u.y), u.z );
}

//===============================================================================================
//===============================================================================================
// sphere implementation
//===============================================================================================
//===============================================================================================

float softShadowSphere( in vec3 ro, in vec3 rd, in vec4 sph )
{
    vec3 oc = sph.xyz - ro;
    float b = dot( oc, rd );
	
    float res = 1.0;
    if( b>0.0 )
    {
        float h = dot(oc,oc) - b*b - sph.w*sph.w;
        res = smoothstep( 0.0, 1.0, 2.0*h/b );
    }
    return res;
}

float occSphere( in vec4 sph, in vec3 pos, in vec3 nor )
{
    vec3 di = sph.xyz - pos;
    float l = length(di);
    return 1.0 - dot(nor,di/l)*sph.w*sph.w/(l*l); 
}

float iSphere( in vec3 ro, in vec3 rd, in vec4 sph )
{
    float t = -1.0;
	vec3  ce = ro - sph.xyz;
	float b = dot( rd, ce );
	float c = dot( ce, ce ) - sph.w*sph.w;
	float h = b*b - c;
	if( h>0.0 )
	{
		t = -b - sqrt(h);
	}
	
	return t;
}

//===============================================================================================
//===============================================================================================
// scene
//===============================================================================================
//===============================================================================================


// spheres
const vec4 sc0 = vec4( 0.0,1.0, 0.0, 1.0 );
const vec4 sc1 = vec4( 0.0,1.0,14.0, 4.0 );
const vec4 sc2 = vec4(-11.0,1.0, 12.0, 4.0 );
const vec4 sc3 = vec4( 13.0,1.0,-10.0, 4.0 );

float intersect( vec3 ro, vec3 rd, out vec3 pos, out vec3 nor, out float occ, out float matid )
{
    // raytrace
	float tmin = 10000.0;
	nor = vec3(0.0);
	occ = 1.0;
	pos = vec3(0.0);
	
	// raytrace-plane
	float h = (0.0-ro.y)/rd.y;
	if( h>0.0 ) 
	{ 
		tmin = h; 
		nor = vec3(0.0,1.0,0.0); 
		pos = ro + h*rd;
		matid = 0.0;
		occ = occSphere( sc0, pos, nor ) * 
			  occSphere( sc1, pos, nor ) *
			  occSphere( sc2, pos, nor ) *
			  occSphere( sc3, pos, nor );
	}

	// raytrace-sphere
	h = iSphere( ro, rd, sc0 );
	if( h>0.0 && h<tmin ) 
	{ 
		tmin = h; 
        pos = ro + h*rd;
		nor = normalize(pos-sc0.xyz); 
		matid = 1.0;
		occ = 0.5 + 0.5*nor.y;
	}

	h = iSphere( ro, rd, sc1 );
	if( h>0.0 && h<tmin ) 
	{ 
		tmin = h; 
        pos = ro + tmin*rd;
		nor = normalize(ro+h*rd-sc1.xyz); 
		matid = 1.0;
		occ = 0.5 + 0.5*nor.y;
	}

	h = iSphere( ro, rd, sc2 );
	if( h>0.0 && h<tmin ) 
	{ 
		tmin = h; 
        pos = ro + tmin*rd;
		nor = normalize(ro+h*rd-sc2.xyz); 
		matid = 1.0;
		occ = 0.5 + 0.5*nor.y;
	}

	h = iSphere( ro, rd, sc3 );
	if( h>0.0 && h<tmin ) 
	{ 
		tmin = h; 
        pos = ro + tmin*rd;
		nor = normalize(ro+h*rd-sc3.xyz); 
		matid = 1.0;
		occ = 0.5 + 0.5*nor.y;
	}

	return tmin;	
}

vec3 texCoords( in vec3 p )
{
	return 64.0*p;
}

vec3 mytexture( vec3 p, vec3 n, float matid )
{
	p += 0.1;
	vec3 ip  = floor(p/20.0);
	vec3 fp  = fract(0.5+p/20.0);

	float id = fract(sin(dot(ip,vec3(127.1,311.7, 74.7)))*58.5453123);
	id = mix( id, 0.3, matid );
	
	float f = mod( ip.x + mod(ip.y + mod(ip.z, 2.0), 2.0), 2.0 );
	
	float g = 0.5 + 1.0*noise( p * mix( vec3(0.2+0.8*f,1.0,1.0-0.8*f), vec3(1.0), matid) );
	
	g *= mix( smoothstep( 0.03, 0.04, abs(fp.x-0.5)/0.5 )*
	          smoothstep( 0.03, 0.04, abs(fp.z-0.5)/0.5 ),
			  1.0,
			  matid );
	
	vec3 col = 0.5 + 0.5*sin( 1.0 + 2.0*id + vec3(0.0,1.0,2.0) );
	
	return col * g;
}

void calcCamera( out vec3 ro, out vec3 ta )
{
	float an = 0.1*iGlobalTime;
	ro = vec3( 5.5*cos(an), 1.0, 5.5*sin(an) );
    ta = vec3( 0.0, 1.0, 0.0 );

}

vec3 doLighting( in vec3 pos, in vec3 nor, in float occ, in vec3 rd )
{
    float sh = min( min( min( softShadowSphere( pos, vec3(0.57703), sc0 ),
				              softShadowSphere( pos, vec3(0.57703), sc1 )),
				              softShadowSphere( pos, vec3(0.57703), sc2 )),
                              softShadowSphere( pos, vec3(0.57703), sc3 ));
	float dif = clamp(dot(nor,vec3(0.57703)),0.0,1.0);
	float bac = clamp(dot(nor,vec3(-0.707,0.0,-0.707)),0.0,1.0);
    vec3 lin  = dif*vec3(1.50,1.40,1.30)*sh;
	     lin += occ*vec3(0.15,0.20,0.30);
	     lin += bac*vec3(0.20,0.20,0.20);
	     lin += sh*0.8*pow(clamp(dot(reflect(rd,nor),vec3(0.57703)),0.0,1.0),12.0);

    return lin;
}
//===============================================================================================
//===============================================================================================
// render
//===============================================================================================
//===============================================================================================

void calcRayForPixel( vec2 pix, out vec3 resRo, out vec3 resRd )
{
	vec2 p = (-iResolution.xy + 2.0*pix) / iResolution.y;
	
     // camera movement	
	vec3 ro, ta;
	calcCamera( ro, ta );
    // camera matrix
    vec3 ww = normalize( ta - ro );
    vec3 uu = normalize( cross(ww,vec3(0.0,1.0,0.0) ) );
    vec3 vv = normalize( cross(uu,ww));
	// create view ray
	vec3 rd = normalize( p.x*uu + p.y*vv + 1.5*ww );
	
	resRo = ro;
	resRd = rd;
}

// sample a procedural texture with filtering
vec3 sampleTextureWithFilter( in vec3 uvw, in vec3 ddx_uvw, in vec3 ddy_uvw, in vec3 nor, in float mid )
{
    int sx = 1 + int( clamp( 4.0*length(ddx_uvw-uvw), 0.0, float(MaxSamples-1) ) );
    int sy = 1 + int( clamp( 4.0*length(ddy_uvw-uvw), 0.0, float(MaxSamples-1) ) );

	vec3 no = vec3(0.0);

	#if 1
    for( int j=0; j<MaxSamples; j++ )
    for( int i=0; i<MaxSamples; i++ )
    {
        if( j<sy && i<sx )
        {
            vec2 st = vec2( float(i), float(j) ) / vec2( float(sx),float(sy) );
            no += mytexture( uvw + st.x*(ddx_uvw-uvw) + st.y*(ddy_uvw-uvw), nor, mid );
        }
    }
    #else
    for( int j=0; j<sy; j++ )
    for( int i=0; i<sx; i++ )
    {
        vec2 st = vec2( float(i), float(j) )/vec2(float(sx),float(sy));
        no += mytexture( uvw + st.x * (ddx_uvw-uvw) + st.y*(ddy_uvw-uvw), nor, mid );
    }
    #endif		

	return no / float(sx*sy);
}

vec3 sampleTexture( in vec3 uvw, in vec3 nor, in float mid )
{
    return mytexture( uvw, nor, mid );
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2  p  = (-iResolution.xy + 2.0*fragCoord.xy) / iResolution.y;
    float th = (-iResolution.x + 2.0*iMouse.x) / iResolution.y;
	
    if( iMouse.z<0.01) th = 0.5/ iResolution.y;
	
	vec3 ro, rd, ddx_ro, ddx_rd, ddy_ro, ddy_rd;
	calcRayForPixel( fragCoord.xy + vec2(0.0,0.0), ro, rd );
	calcRayForPixel( fragCoord.xy + vec2(1.0,0.0), ddx_ro, ddx_rd );
	calcRayForPixel( fragCoord.xy + vec2(0.0,1.0), ddy_ro, ddy_rd );
		
    // trace
	vec3 pos, nor;
	float occ, mid;
    float t = intersect( ro, rd, pos, nor, occ, mid );

	vec3 col = vec3(0.9);
	if( t<100.0 )
	{
#if 1
		// -----------------------------------------------------------------------
        // compute ray differentials by intersecting the tangent plane to the  
        // surface.		
		// -----------------------------------------------------------------------

		// computer ray differentials
		vec3 ddx_pos = ddx_ro - ddx_rd*dot(ddx_ro-pos,nor)/dot(ddx_rd,nor);
		vec3 ddy_pos = ddy_ro - ddy_rd*dot(ddy_ro-pos,nor)/dot(ddy_rd,nor);

		// calc texture sampling footprint		
		vec3     uvw = texCoords(     pos );
		vec3 ddx_uvw = texCoords( ddx_pos );
		vec3 ddy_uvw = texCoords( ddy_pos );
#else
		// -----------------------------------------------------------------------
        // Because we are in the GPU, we do have access to differentials directly
        // This wouldn't be the case in a regular raytrace.
		// It wouldn't work as well in shaders doing interleaved calculations in
		// pixels (such as some of the 3D/stereo shaders here in Shadertoy)
		// -----------------------------------------------------------------------
		vec3 uvw = texCoords( pos );

		// calc texture sampling footprint		
		vec3 ddx_uvw = uvw + dFdx( uvw ); 
        vec3 ddy_uvw = uvw + dFdy( uvw ); 
#endif
		// shading		
		vec3 mate = vec3(0.0);
		
		if( p.x>th ) 
            mate = sampleTexture( uvw, nor, mid );
        else
            mate = sampleTextureWithFilter( uvw, ddx_uvw, ddy_uvw, nor, mid );

        // lighting	
		vec3 lin = doLighting( pos, nor, occ, rd );

        // combine lighting with material		
		col = mate * lin;
		
        // fog		
        col = mix( col, vec3(0.9), 1.0-exp( -0.0002*t*t ) );
	}
	
    // gamma correction	
	col = pow( col, vec3(0.4545) );

	col *= smoothstep( 0.006, 0.008, abs(p.x-th) );
	
	fragColor = vec4( col, 1.0 );
}

//_______________________________________________________________________________________________________



void main( void)
{
	mainImage(gl_FragColor, gl_FragCoord.xy);
}