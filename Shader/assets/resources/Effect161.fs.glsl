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

//#define USE_GRADIENTS

vec4 texCube( sampler2D sam, in vec3 p, in vec3 n, in float k )
{
	vec4 x = texture2D( sam, p.yz );
	vec4 y = texture2D( sam, p.zx );
	vec4 z = texture2D( sam, p.xy );
    vec3 w = pow( abs(n), vec3(k) );
	return (x*w.x + y*w.y + z*w.z) / (w.x+w.y+w.z);
}

vec4 map2( vec3 p )
{
    p.x += 0.5*sin( 3.0*p.y + iGlobalTime );
    p.y += 0.5*sin( 3.0*p.z + iGlobalTime );
    p.z += 0.5*sin( 3.0*p.x + iGlobalTime );
    p.x += 0.5*sin( 3.0*p.y + iGlobalTime );
    p.y += 0.5*sin( 3.0*p.z + iGlobalTime );
    p.z += 0.5*sin( 3.0*p.x + iGlobalTime );
    p.x += 0.5*sin( 3.0*p.y + iGlobalTime );
    p.y += 0.5*sin( 3.0*p.z + iGlobalTime );
    p.z += 0.5*sin( 3.0*p.x + iGlobalTime );
    p.x += 0.5*sin( 3.0*p.y + iGlobalTime );
    p.y += 0.5*sin( 3.0*p.z + iGlobalTime );
    p.z += 0.5*sin( 3.0*p.x + iGlobalTime );

    float d1 = length(p) - 1.0*smoothstep(0.0,2.0,iGlobalTime);;
    d1 *= 0.02;	

    return vec4( d1, p );
}

vec4 map( vec3 p )
{
    vec4 res = map2(p);
    
    float d2 = p.y + 1.0;
    if( d2<res.x ) res = vec4( d2, 0.0, 0.0, 0.0 );

	return res;
}

vec4 intersect( in vec3 ro, in vec3 rd, in float maxd )
{
    vec3 res = vec3(-1.0);
	float precis = 0.00005;
    float t = 1.0;
    for( int i=0; i<512; i++ )
    {
	    vec4 tmp = map( ro+rd*t );
        res = tmp.yzw;
        float h = tmp.x;
        if( h<precis||t>maxd ) break;
        t += h;
    }

    return vec4( t, res );
}

vec3 calcNormal( in vec3 pos )
{
#ifdef USE_GRADIENTS    
    return normalize( cross(dFdx(pos),dFdy(pos)) );
#else    
    vec2 e = vec2(1.0,-1.0)*0.001;
    return normalize( e.xyy*map( pos + e.xyy ).x + 
					  e.yyx*map( pos + e.yyx ).x + 
					  e.yxy*map( pos + e.yxy ).x + 
					  e.xxx*map( pos + e.xxx ).x );
#endif    
}

float softshadow( in vec3 ro, in vec3 rd, float mint, float k )
{
    float res = 1.0;
    float t = mint;
	float h = 1.0;
    for( int i=0; i<128; i++ )
    {
        h = map(ro + rd*t).x;
        res = min( res, k*h/t );
        if( res<0.0001 ) break;
        t += clamp( h, 0.01, 0.05 );
    }
    return clamp(res,0.0,1.0);
}

float calcOcc( in vec3 pos, in vec3 nor )
{
    const float h = 0.2;
	float ao = 0.0;
    for( int i=0; i<8; i++ )
    {
        vec3 dir = sin( float(i)*vec3(1.0,7.13,13.71)+vec3(0.0,2.0,4.0) );
        //dir = normalize(nor + dir);
        dir *= sign(dot(dir,nor));
        float d = map2( pos + h*dir ).x;
        ao += max(0.0,h-d*2.0);
    }
    return clamp( 4.0 - 2.5*ao, 0.0, 1.0 )*(0.5+0.5*nor.y);
}

vec3 lig = normalize(vec3(1.0,0.7,0.9));

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 q = fragCoord.xy / iResolution.xy;
    vec2 p = -1.0 + 2.0 * q;
    p.x *= iResolution.x/iResolution.y;
    vec2 m = vec2(0.5);
	if( iMouse.z>0.0 ) m = iMouse.xy/iResolution.xy;

	
    //-----------------------------------------------------
    // camera
    //-----------------------------------------------------
	
	float an = 0.3*iGlobalTime + 7.5 - 5.0*m.x;

	vec3 ro = vec3(4.5*sin(an),0.5,4.5*cos(an));
    vec3 ta = vec3(0.0,0.5,0.0);

    // camera matrix
    vec3 ww = normalize( ta - ro );
    vec3 uu = normalize( cross(ww,vec3(0.0,1.0,0.0) ) );
    vec3 vv = normalize( cross(uu,ww));

	// create view ray
	vec3 rd = normalize( p.x*uu + p.y*vv + 2.0*ww );

    //-----------------------------------------------------
	// render
    //-----------------------------------------------------

	vec3 col = vec3(0.0);
	// raymarch
    const float maxd = 9.0;
    vec4  inn = intersect(ro,rd,maxd);
    float t = inn.x;
    if( t<maxd )
    {
        vec3 tra = inn.yzw;

        // geometry
        vec3 pos = ro + t*rd;
        vec3 nor = calcNormal(pos);
		vec3 ref = reflect( rd, nor );

        // material
        col = vec3(0.3,0.3,0.3);
        if( pos.y>-0.99) col += 0.2*tra;
        vec3 pat = texCube( iChannel0, 0.5*pos, nor, 4.0 ).xyz;
        col *= pat;
        col *= 0.5;
        
		// lighting
		float occ = calcOcc( pos, nor );

        float amb = 0.5 + 0.5*nor.y;
		float dif = max(dot(nor,lig),0.0);
		float bou = max(0.0,-nor.y);
        float bac = max(0.2 + 0.8*dot(nor,-lig),0.0);
		float sha = 0.0; if( dif>0.01 ) sha=softshadow( pos+0.01*nor, lig, 0.0005, 128.0 );
        float fre = pow( clamp( 1.0 + dot(nor,rd), 0.0, 1.0 ), 3.0 );
        float spe = 15.0*pat.x*max( 0.0, pow( clamp( dot(lig,reflect(rd,nor)), 0.0, 1.0), 16.0 ) )*dif*sha*(0.04+0.96*fre);
		
		// lights
		vec3 lin = vec3(0.0);

        lin += 3.5*dif*vec3(6.00,4.00,3.00)*pow(vec3(sha),vec3(1.0,1.2,1.5));
		lin += 1.0*amb*vec3(0.30,0.30,0.30)*occ;
		lin += 1.0*bac*vec3(0.80,0.50,0.20)*occ;
		lin += 1.0*bou*vec3(1.00,0.30,0.20)*occ;
        lin += 4.0*fre*vec3(1.00,0.80,0.70)*(0.3+0.7*dif*sha)*occ;
        lin += spe*2.0;

        // surface-light interacion
		col = col*lin + spe;

        col *= min(200.0*exp(-1.5*t),1.0);
        col *= 1.0-smoothstep( 1.0,6.0,length(pos.xz) );
	}

    // gamma
	col = pow( clamp(col,0.0,1.0), vec3(0.4545) );

    // grading
    col = pow( col, vec3(0.6,1.0,1.0) );
    // vignetting
    col *= pow( 16.0*q.x*q.y*(1.0-q.x)*(1.0-q.y), 0.1 );
	   
    fragColor = vec4( col, 1.0 );
}

//_______________________________________________________________________________________________________





void main( void)
{
	mainImage(gl_FragColor, gl_FragCoord.xy);
}