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

// Created by inigo quilez - iq/2014
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.

// Analytical antialiasing of raytraced spheres. Only one ray/sample per pixel is casted. 
// However, spheres have simple analytical pixel coverage computation, so some degree of 
// edge antialiasing can be performed.
//
// For that, all intersections and near-intersections must be found and sorted back to front, 
// for proper composition.
//
// Try undefining the flag below to see the difference.
//
// Related info: http://iquilezles.org/www/articles/spherefunctions/spherefunctions.htm


//#define NO_ANTIALIAS

//-------------------------------------------------------------------------------------------

vec3 sphNormal( in vec3 pos, in vec4 sph )
{
    return normalize(pos-sph.xyz);
}

float sphIntersect( in vec3 ro, in vec3 rd, in vec4 sph )
{
	vec3 oc = ro - sph.xyz;
	float b = dot( oc, rd );
	float c = dot( oc, oc ) - sph.w*sph.w;
	float h = b*b - c;
	if( h<0.0 ) return -1.0;
	return -b - sqrt( h );
}

float sphShadow( in vec3 ro, in vec3 rd, in vec4 sph )
{
    vec3 oc = ro - sph.xyz;
    float b = dot( oc, rd );
    float c = dot( oc, oc ) - sph.w*sph.w;
    return step( min( -b, min( c, b*b - c ) ), 0.0 );
}
            
vec2 sphDistances( in vec3 ro, in vec3 rd, in vec4 sph )
{
	vec3 oc = ro - sph.xyz;
    float b = dot( oc, rd );
    float c = dot( oc, oc ) - sph.w*sph.w;
    float h = b*b - c;
    float d = sqrt( max(0.0,sph.w*sph.w-h)) - sph.w;
    return vec2( d, -b-sqrt(max(h,0.0)) );
}

float sphSoftShadow( in vec3 ro, in vec3 rd, in vec4 sph )
{
    float s = 1.0;
    vec2 r = sphDistances( ro, rd, sph );
    if( r.y>0.0 )
        s = max(r.x,0.0)/r.y;
    return s;
}    
            
float sphOcclusion( in vec3 pos, in vec3 nor, in vec4 sph )
{
    vec3  r = sph.xyz - pos;
    float l = length(r);
    float d = dot(nor,r);
    float res = d;

    if( d<sph.w ) res = pow(clamp((d+sph.w)/(2.0*sph.w),0.0,1.0),1.5)*sph.w;
    
    return clamp( res*(sph.w*sph.w)/(l*l*l), 0.0, 1.0 );

}

//-------------------------------------------------------------------------------------------
#define NUMSPHEREES 12

vec4 sphere[NUMSPHEREES];

float shadow( in vec3 ro, in vec3 rd )
{
	float res = 1.0;
	for( int i=0; i<NUMSPHEREES; i++ )
        res = min( res, 8.0*sphSoftShadow(ro,rd,sphere[i]) );
    return res;					  
}

float occlusion( in vec3 pos, in vec3 nor )
{
	float res = 1.0;
	for( int i=0; i<NUMSPHEREES; i++ )
	    res *= 1.0 - sphOcclusion( pos, nor, sphere[i] ); 
    return res;					  
}

//-------------------------------------------------------------------------------------------

vec3 hash3( float n ) { return fract(sin(vec3(n,n+1.0,n+2.0))*43758.5453123); }
vec3 textureBox( sampler2D sam, in vec3 pos, in vec3 nor )
{
    vec3 w = abs(nor);
    return (w.x*texture2D( sam, pos.yz ).xyz + 
            w.y*texture2D( sam, pos.zx ).xyz + 
            w.z*texture2D( sam, pos.xy ).xyz ) / (w.x+w.y+w.z);
}

vec3 shade( in vec3 rd, in vec3 pos, in vec3 nor, in float id, in vec3 uvw )
{
    vec3 ref = reflect(rd,nor);
    float occ = occlusion( pos, nor );
    float fre = clamp(1.0+dot(rd,nor),0.0,1.0);
    
    occ = occ*0.5 + 0.5*occ*occ;
    vec3 lig = vec3(occ)*vec3(0.9,0.95,1.0);
    lig *= 0.7 + 0.3*nor.y;
    lig += 0.7*vec3(0.3,0.2,0.1)*fre*occ;
    lig *= 0.9;

    
    lig += 0.7*smoothstep(-0.05,0.05,ref.y )*occ*shadow( pos, ref ) * (0.03+0.97*pow(fre,3.0));

    return lig;
}    


#define SWP(i,j) if(cols[j].w>cols[i].w){vec4 tm=cols[i];cols[i]=cols[j];cols[j]=tm;tm.x=alps[i];alps[i]=alps[j];alps[j]=tm.x;}


vec3 trace( in vec3 ro, in vec3 rd, vec3 col, in float px )
{
#ifdef NO_ANTIALIAS
	float t = 1e20;
	float id  = -1.0;
    vec4  obj = vec4(0.0);
	for( int i=0; i<NUMSPHEREES; i++ )
	{
		vec4 sph = sphere[i];
	    float h = sphIntersect( ro, rd, sph ); 
		if( h>0.0 && h<t ) 
		{
			t = h;
            obj = sph;
			id = float(i);
		}
	}
						  
    if( id>-0.5 )
    {
		vec3 pos = ro + t*rd;
		vec3 nor = sphNormal( pos, obj );
        col = shade( rd, pos, nor, id, pos-obj.xyz );
    }

#else

    vec4 cols[NUMSPHEREES]; float alps[NUMSPHEREES];

    // clear visible point list    
	for( int i=0; i<NUMSPHEREES; i++ ) { cols[i] = vec4(0.0,0.0,0.0,1e10); alps[i] = 0.0; }
    
    // intersect spheres
	for( int i=0; i<NUMSPHEREES; i++ )
	{
		vec4 sph = sphere[i];
        vec2 dt = sphDistances( ro, rd, sph );
        float d = dt.x;
	    float t = dt.y;
        //if( t<0.0 ) continue; // skip stuff behind camera. If I enable it, I loose mipmapping
        
        float s = max( 0.0, d/t );
        if( s < px ) // intersection, or close enough to an intersection
        {
            vec3 pos = ro + t*rd;
            vec3 nor = sphNormal( pos, sph );
            float id = float(i);
            cols[i].xyz = shade( rd, pos, nor, id, pos-sph.xyz );
            cols[i].w = t;
            alps[i] = 1.0 - clamp(s/px,0.0,1.0); // coverage
        }
	}

    // sort intersections, back to front
    
    // bubble sort unrolled for 12 spheres
    SWP( 0, 1); SWP(0, 2); SWP(0, 3); SWP(0, 4); SWP(0, 5); SWP(0, 6); SWP(0, 7); SWP(0, 8); SWP(0, 9); SWP(0,10); SWP(0,11);
    SWP( 1, 2); SWP(1, 3); SWP(1, 4); SWP(1, 5); SWP(1, 6); SWP(1, 7); SWP(1, 8); SWP(1, 9); SWP(1,10); SWP(1,11);
    SWP( 2, 3); SWP(2, 4); SWP(2, 5); SWP(2, 6); SWP(2, 7); SWP(2, 8); SWP(2, 9); SWP(2,10); SWP(2,11);
    SWP( 3, 4); SWP(3, 5); SWP(3, 6); SWP(3, 7); SWP(3, 8); SWP(3, 9); SWP(3,10); SWP(3,11);
    SWP( 4, 5); SWP(4, 6); SWP(4, 7); SWP(4, 8); SWP(4, 9); SWP(4,10); SWP(4,11);
    SWP( 5, 6); SWP(5, 7); SWP(5, 8); SWP(5, 9); SWP(5,10); SWP(5,11);
    SWP( 6, 7); SWP(6, 8); SWP(6, 9); SWP(6,10); SWP(6,11);
    SWP( 7, 8); SWP(7, 9); SWP(7,10); SWP(7,11);
    SWP( 8, 9); SWP(8,10); SWP(8,11);
    SWP( 9,10); SWP(9,11);
    SWP(10,11);
    /*
	for( int i=0; i<NUMSPHEREES-1; i++ )
    for( int j=0; j<NUMSPHEREES; j++ )
    {
        if( (j>i) && (cols[j].w>cols[i].w) )
        {
            vec4 tm = cols[i];
            cols[i] = cols[j];
            cols[j] = tm;
            tm.x = alps[i];
            alps[i] = alps[j];
            alps[j] = tm.x;
        }
	}*/
    
    // composite
    float ow = 1e20;
	for( int i=0; i<NUMSPHEREES; i++ )
    {
        float w = cols[i].w;
        float al = clamp( 0.5 + 0.5*(ow-w)/(px*4.0), 0.0, 1.0 );
        col = mix( col, cols[i].xyz, alps[i]*al );
        ow = w;
    }
    
#endif

    return col;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 q = fragCoord.xy / iResolution.xy;
    vec2 p = (2.0*fragCoord.xy-iResolution.xy)/iResolution.y;

    vec2 m = step(0.0001,iMouse.z) * iMouse.xy/iResolution.xy;
	
    //-----------------------------------------------------
    // animate
    //-----------------------------------------------------
	float time = iGlobalTime*0.5;
	
	float an = 0.3*time - 7.0*m.x;

	for( int i=0; i<NUMSPHEREES; i++ )
	{
		float id  = float(i);
        float ra = pow(id/float(NUMSPHEREES-1),3.0);
	    vec3  pos = 1.0*cos( 6.2831*hash3(id*14.0) + 0.5*(1.0-0.7*ra)*hash3(id*7.0)*time );
		sphere[i] = vec4( pos, (0.3+0.6*ra) );
    }
			
    //-----------------------------------------------------
    // camera
    //-----------------------------------------------------
    float le = 1.8;
	vec3 ro = vec3(2.5*sin(an),1.5*cos(0.5*an),2.5*cos(an));
    vec3 ta = vec3(0.0,0.0,0.0);
    vec3 ww = normalize( ta - ro );
    vec3 uu = normalize( cross(ww,vec3(0.0,1.0,0.0) ) );
    vec3 vv = normalize( cross(uu,ww));
	vec3 rd = normalize( p.x*uu + p.y*vv + le*ww );

    float px = 1.0*(2.0/iResolution.y)*(1.0/le);

    //-----------------------------------------------------
	// render
    //-----------------------------------------------------
	vec3 col = vec3(0.02) + 0.02*rd.y;
    
    col = trace( ro, rd, col, px );
    

    //-----------------------------------------------------
	// postpro
    //-----------------------------------------------------
    
    // gamme    
    col = pow( col, vec3(0.4545) );

    // vignetting    
    col *= 0.2 + 0.8*pow(16.0*q.x*q.y*(1.0-q.x)*(1.0-q.y),0.15);

    // dithering
    col += (1.0/255.0)*hash3(q.x+13.0*q.y);
    
	fragColor = vec4( col, 1.0 );
}

//_______________________________________________________________________________________________________





void main( void)
{
	mainImage(gl_FragColor, gl_FragCoord.xy);
}