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

float fbm( vec3 p, vec3 n )
{
	p *= 0.15;

	// float x = texture2D( iChannel3, p.yz ).x;
	// float y = texture2D( iChannel3, p.zx ).x;
	// float z = texture2D( iChannel3, p.xy ).x;

	float x=1.0;
	float y=1.0;
	float z=1.0;

	return x*abs(n.x) + y*abs(n.y) + z*abs(n.z);
}

float hash( float n )
{
    return fract(sin(n)*13.5453);
}


vec3 hash3( float n )
{
    return fract(sin(vec3(n,n+1.0,n+2.0))*vec3(13.5453123,31.1459123,37.3490423));
}

float udRoundBox( vec3 p, vec3 b, vec3 r )
{
  return length(max(abs(p)-b,0.0))-r.x;
}

float sdBox( vec3 p, vec3 b )
{
  vec3 d = abs(p) - b;
  return min(max(d.x,max(d.y,d.z)),0.0) +
         length(max(d,0.0));
}


float obj1( in vec3 p )
{
	vec3 q = vec3( mod( p.x, 0.2 ), p.yz ) - 0.1;
	return udRoundBox( q, vec3(0.091,0.075,0.6)-0.005, vec3(0.01) );
}

float obj2( in vec3 p )
{
	vec3 q = vec3( mod( p.x + 0.1, 0.2 ), p.y-0.085, p.z - 0.2 ) - 0.1;
	float ix = floor( (p.x + 0.1)/0.2 );
	float k = mod( ix, 7.0 );

	if( ix<-21.0 || k==2.0 || k==6.0 ) return 10.0;

	return udRoundBox( q, vec3(0.06,0.075,0.4)-0.01, vec3(0.01,0.01,0.01) );
}

float sdCylinder( vec3 p, vec2 h )
{
  return max( length(p.xz)-h.x, abs(p.y)-h.y );
}


float obj3( in vec3 p )
{
	float d1 = udRoundBox( p - vec3(0.0, 0.0,1.7), vec3(5.4,0.6,1.0), vec3(0.05) );
	float d2 = udRoundBox( p - vec3(0.0,-0.3,0.1), vec3(5.4,0.3,0.6), vec3(0.05) );
	float d3 = udRoundBox( p - vec3(0.0,-1.0,2.5), vec3(5.4,3.0,1.0), vec3(0.05) );

	float d4 = sdCylinder( vec3(abs(p.x),p.y,p.z) - vec3(5.25,-2.2,-0.35), vec2(0.1,2.0) );
    d4 -= 0.03*smoothstep(-0.7,0.7,sin(18.0*p.y)) + 0.017*p.y + 0.025;

	float d5 = udRoundBox( vec3(abs(p.x),p.y,p.z) - vec3(5.05,0.0,0.3), vec3(0.35,0.2,0.8), vec3(0.05) );
	
	return min( min( min( min( d1, d2 ), d3 ), d4 ), d5 );
}


float obj4( in vec3 p )
{
    return 3.75+p.y;
}

float obj5( in vec3 p )
{
    return min( 3.5-p.z, p.x+6.5 );
}

float obj6( in vec3 p )
{
	vec3 q = p - vec3(0.0,1.3,1.1);
	float x = abs(q.x);
	q.z += 0.15*4.0*x*(1.0-x);
	q.yz = mat2(0.9,-0.43,0.43,0.9)*q.yz;
    return 0.5*udRoundBox( q, vec3(1.0,0.7,0.0), vec3(0.01) );
}


float obj8( in vec3 p )
{
	vec3 q = p - vec3(0.0,-1.8,-3.0);
	
	q.xz = mat2( 0.9,0.44,-0.44,0.9)*q.xz;
	
	float y = 0.5 + 0.5*sin(8.0*q.x)*sin(8.0*q.z);
	y = 0.1*pow(y,3.0) * smoothstep( 0.1,0.4,q.y );
    float d = udRoundBox( q, vec3(1.5,0.25,0.6), vec3(0.3) );
	d += y;
	
	vec3 s = vec3( abs(q.x), q.y, abs(q.z) );
	float d2 = sdCylinder( s - vec3(1.4,-1.5,0.6), vec2(0.15,1.5) );
	return min( d, d2 );
}


float obj7( in vec3 p )
{
	vec3 q = p - vec3(1.0,-3.6,1.2);
	vec3 r = vec3( mod( q.x-0.25, 0.5 ) - 0.25, q.yz );
    return max( 0.5*udRoundBox( r, vec3(0.05,0.0,0.38), vec3(0.08) ), sdBox( q, vec3(0.75,1.0,1.0) ) );
}

vec2 map( in vec3 p )
{
	// white keys
    vec2 res = vec2( obj1( p ), 0.0 );

	// black keys
    vec2 ob2 = vec2( obj2( p ), 1.0 );
	if( ob2.x<res.x ) res=ob2;
	res.x = max( res.x, sdBox( p, vec3(4.6,1.0,4.0) ) );

    // piano body
    vec2 ob3 = vec2( obj3( p ), 2.0 );
    if( ob3.x<res.x ) res=ob3;

    // floor
    vec2 ob4 = vec2( obj4( p ), 3.0 );
    if( ob4.x<res.x ) res=ob4;

    // wall
    vec2 ob5 = vec2( obj5( p ), 4.0 );
    if( ob5.x<res.x ) res=ob5;

	// paper
    vec2 ob6 = vec2( obj6( p ), 5.0 );
    if( ob6.x<res.x ) res=ob6;
	
	// pedals
    vec2 ob7 = vec2( obj7( p ), 6.0 );
    if( ob7.x<res.x ) res=ob7;

	// bench
    vec2 ob8 = vec2( obj8( p ), 7.0 );
    if( ob8.x<res.x ) res=ob8;

	return res;
}


float floorBump( vec2 pos, out vec2 id )
{
    pos *= 0.25;
    float w = 0.015;
    float y = mod( pos.x*8.0, 1.0 );
    float iy = floor(pos.x*8.0);
    float x = mod( pos.y*1.0 + sin(iy)*8.0, 1.0 );
    float f = smoothstep( 0.0, w,     y ) - smoothstep( 1.0-w,     1.0, y );
         f *= smoothstep( 0.0, w/8.0, x ) - smoothstep( 1.0-w/8.0, 1.0, x );
    id = vec2( iy, floor(pos.y*1.0 + sin(iy)*8.0) );
    return f;
}

vec4 floorColor( vec3 pos, out vec3 bnor )
{
	pos *= 0.75;
	bnor = vec3(0.0);

	vec2 id;
    vec2 e = vec2( 0.005, 0.0 );
    float er = floorBump( pos.xz, id );
    vec2 tmp;/*
    bnor = vec3( -(floorBump( pos.xz+e.xy, tmp ) - er),
                 150.0*e.x,
                 -(floorBump( pos.xz+e.yx, tmp ) - er) );
    bnor = 100.0*normalize(bnor);
*/
    vec3 col = vec3(0.6,0.35,0.25);
	// float f = 0.5+0.5*texture2D( iChannel3, 0.1*pos.xz*vec2(6.0,0.5)+0.5*id ).x;
	float f = 0.5;
    col = mix( col, vec3(0.4,0.15,0.05), f );
	
	col.x *= 0.8;

	// col *= 0.85 + 0.15*texture2D( iChannel3, 2.0*pos.xz ).x;
	col *= 0.85 ;

    // frekles
    // f = smoothstep( 0.4, 0.9, texture2D( iChannel3, pos.xz*0.2 - id*10.0).x );
    f = 0.4;

    col = mix( col, vec3(0.07), f*0.25 );

    col *= 1.0 + 0.2*sin(32.0*(id.x-id.y));
    col.x += 0.009*sin(0.0+32.0*(id.x+id.y));
    col.y += 0.009*sin(1.0+32.0*(id.x+id.y));
    col.z += 0.009*sin(2.0+32.0*(id.x+id.y));

	return vec4( col*0.5, 0.35 );

}

vec4 pianoColor( in vec3 pos, in vec3 nor )
{
    float o = fbm( 0.25*pos, nor );
    float f = smoothstep( -0.25, 0.5, fbm( 8.0*o + 1.0*pos*vec3(0.5,8.0,0.5), nor ) );
	float sp = f;
	vec3 col = 0.14*mix( 0.4*vec3(0.24,0.22,0.18), vec3(0.26,0.22,0.18), f );
						
	f = hash(floor(pos.y*4.0) + 13.0*floor(abs(nor.x*pos.z + nor.z*pos.x)*0.4) );						
	col *= 0.7 + 0.3*f;

	col += 0.0012*sin( f*6.2831 + vec3(0.0,1.0,2.0) );
    return vec4( col*0.5*1.2, 0.007*sp );
}


vec4 wallColor( in vec3 pos, in vec3 nor )
{
    vec3 col = 2.0*vec3(0.30,0.30,0.30);

	float f = 1.0-0.4*pow( fbm( 1.5*pos*vec3(1.0,0.25,1.0), nor ), 1.7 );
    col *= f;

    return vec4(col,0.01*f);
}

vec4 paperColor( in vec3 pos, in vec3 nor )
{
    vec3 col = 0.7*vec3(0.22,0.21,0.18);
	
	col = mix( col, col*vec3(1.0,0.9,0.8), clamp(0.5 + 0.5*abs(pos.x),0.0,1.0) );
	col *= clamp(0.75 + 0.25*abs(2.0*pos.x),0.0,1.0);
	
	float f = smoothstep( 0.5,1.0, sin(250.0*pos.y) );
	f *=      smoothstep(-0.1,0.1, sin(250.0*pos.y/10.0) );
	f *= smoothstep( 0.1,0.11, abs(pos.x) ) - smoothstep( 0.85,0.86, abs(pos.x) );
	col *= 1.0-f;

	f = smoothstep( -0.8,-0.2, sin(250.0*pos.y) );
	f *=      smoothstep(-0.1,0.1, sin(250.0*pos.y/10.0) );
	f *= smoothstep( 0.1,0.11, abs(pos.x) ) - smoothstep( 0.85,0.86, abs(pos.x) );

	
	float of = floor(0.5*250.0*pos.y/6.2831);
	// float g = 1.0-smoothstep( 0.2,0.3,texture2D( iChannel3, pos.xy*vec2(0.5,0.01) + 0.15*of).x);
	float g = 1.0;
	col *= mix( 1.0, 1.0-g, f );
	
	// col *= 0.5 + 0.7*texture2D( iChannel3, 0.02*pos.xy ).x;
	col *= 0.5;
	
	
    return vec4(col,0.0);
}

vec4 benchColor( in vec3 pos, in vec3 nor )
{
    vec3 col = vec3(0.01,0.01,0.01);
	
	float g = smoothstep( 0.0, 1.0, fbm( 1.0*pos*vec3(1.0,0.5,1.0), nor ) );
	col = mix( col, vec3(0.021,0.015,0.015), g );

	float f = smoothstep( 0.3, 1.0, fbm( 16.0*pos*vec3(1.0,1.0,1.0), nor ) );
	col = mix( col, vec3(0.04,0.03,0.02), f );

	return vec4( 0.15*col*vec3(1.3,0.9,1.0), 0.005*(1.0-g) );
}	
	
	
vec4 calcColor( in vec3 pos, in vec3 nor, float matID, out vec3 bnor )
{
    bnor = vec3(0.0);

	vec4 mate = vec4(0.0);
	
	     if( matID<0.5 ) mate = vec4(0.22,0.19,0.15,0.2); // white keys
	else if( matID<1.5 ) mate = vec4(0.00,0.00,0.00,0.1); // black keys
	else if( matID<2.5 ) mate = pianoColor(pos,nor);      // piano
	else if( matID<3.5 ) mate = floorColor(pos,bnor);     // floor
	else if( matID<4.5 ) mate = wallColor(pos,nor);       // wall
	else if( matID<5.5 ) mate = paperColor(pos,nor);      // paper
	else if( matID<6.5 ) mate = vec4(0.04,0.03,0.01,0.9); // pedals
	else                 mate = benchColor(pos,nor);      // bench

	return mate;
}

vec2 intersect( in vec3 ro, in vec3 rd )
{
	float maxd = 25.0;
	float precis = 0.001;
    float h=precis*2.0;
    float t = 0.0;
    float m = -1.0;
    for( int i=0; i<48; i++ )
    {
        if( h<precis||t>maxd ) break;
        t += h;
	    vec2 res = map( ro+rd*t );
        h = res.x;
	    m = res.y;
    }

    if( t>maxd ) m=-1.0;
    return vec2( t, m );
}

vec3 calcNormal( in vec3 pos )
{
    vec3 eps = vec3(0.0002,0.0,0.0);

	return normalize( vec3(
           map(pos+eps.xyy).x - map(pos-eps.xyy).x,
           map(pos+eps.yxy).x - map(pos-eps.yxy).x,
           map(pos+eps.yyx).x - map(pos-eps.yyx).x ) );
}



float softshadow( in vec3 ro, in vec3 rd, float mint, float k )
{
    float res = 1.0;
    float t = mint;
    for( int i=0; i<45; i++ )
    {
        float h = map(ro + rd*t).x;
        res = min( res, smoothstep(0.0,1.0,k*h/t) );
        t += clamp( h, 0.04, 0.1 );
		if( res<0.01 ) break;
    }
    return clamp(res,0.0,1.0);
}

float calcAO( in vec3 pos, in vec3 nor )
{
	float totao = 0.0;
    float sca = 1.0;
    for( int aoi=0; aoi<8; aoi++ )
    {
        float hr = 0.01 + 1.2*pow(float(aoi)/8.0,1.5);
        vec3 aopos =  nor * hr + pos;
        float dd = map( aopos ).x;
        totao += -(dd-hr)*sca;
        sca *= 0.85;
    }
    return clamp( 1.0 - 0.6*totao, 0.0, 1.0 );
}

float calcCurvature( in vec3 pos, in vec3 nor )
{
	float totao = 0.0;
    for( int aoi=0; aoi<4; aoi++ )
    {
		vec3 aopos = normalize(hash3(float(aoi)*213.47));
		aopos = aopos - dot(nor,aopos)*nor;
		aopos = pos + aopos*0.5;
        float dd = clamp( map( aopos ).x*10.0, 0.0, 1.0 );
        totao += dd;
    }
	totao /= 4.0;
	
    return smoothstep( 0.5, 1.0, totao );
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 q = fragCoord.xy / iResolution.xy;
    vec2 p = -1.0 + 2.0 * q;
    p.x *= iResolution.x/iResolution.y;
    vec2 m = iMouse.xy/iResolution.xy;
	
    // camera
    float r2 = p.x*p.x*0.32 + p.y*p.y;
    p *= 0.5 + 0.5*(7.0-sqrt(37.5-11.5*r2))/(r2+1.0);
	float an = 2.0 + 1.5*(0.5+0.5*sin(0.5*iGlobalTime - 6.2*m.x));
    vec3 ro = 8.0*normalize(vec3(sin(an),0.4-0.3*m.y, cos(an)));
    vec3 ta = vec3( -1.0, -1.7, 3.0 );
    vec3 ww = normalize( ta - ro );
    vec3 uu = normalize( cross(ww,vec3(0.0,1.0,0.0) ) );
    vec3 vv = normalize( cross(uu,ww));
    vec3 rd = normalize( p.x*uu + p.y*vv + 2.0*ww );

	// render
    vec3 col = vec3(0.0);
	float atten = 1.0;
	for( int k=0; k<2; k++ )
	{

	// raymarch
    vec2 tmat = intersect(ro,rd);
    if( tmat.y>-0.5 )
    {
        // geometry
        vec3 pos = ro + tmat.x*rd;
        vec3 nor = calcNormal(pos);
        vec3 ref = reflect(rd,nor);
		vec3 lig = normalize(vec3(-0.5,2.0,-1.0));
        float cur = calcCurvature(pos,nor);
		float occ = calcAO( pos, nor );

		
        // material
		vec3 bnor = vec3(0.0);
		vec4 mate = calcColor( pos, nor, tmat.y, bnor );
        nor = normalize( nor + bnor );

		if( tmat.y>1.5 && tmat.y<2.5 ) 
        {
        float ru = cur*smoothstep( 0.3, 0.6, 0.1-0.2*occ + fbm(pos,nor) );
        mate = mix( mate, 0.25*vec4(0.3,0.28,0.2,0.0), ru );
        }
		
		// lights
        float amb = 0.6 + 0.4*nor.y;
        float dif = max(dot(nor,lig),0.0);
        float spe = pow(clamp(dot(lig,ref),0.0,1.0),3.0);
		float sha = softshadow( pos, lig, 0.01, 10.0 );

		vec3 win = pos + lig* (-10.0-pos.y)/lig.y;
		win.xz -= vec2(.0,4.0);
        float wpa = pow( pow(abs(win.x),16.0) + pow(abs(win.z),16.0), 1.0/16.0 );
        float wbw = 1.0-smoothstep( 3.0, 6.2, wpa*0.8 );
        float wbg = 1.0-smoothstep( 3.5,14.0, wpa*0.8 );
        wpa *= 1.0-smoothstep( 2.5, 3.5, wpa*0.8 );
        wpa *= smoothstep( 0.1, 0.45, abs(win.x) );
        wpa *= smoothstep( 0.1, 0.45, abs(win.z) );
        sha *= wpa;

		vec3 lin = vec3(0.0);
        lin  = 2.50*dif*vec3(1.0,0.85,0.55)*(0.6+0.4*occ)*pow( vec3(sha), vec3(1.0,1.2,1.4) );
		lin += 0.50*wbg*wbw*vec3(1.2,0.6,0.3)*(0.5+0.5*clamp(0.5-0.5*nor.y,0.0,1.0))*pow(1.0-smoothstep(0.0,3.5,3.8+pos.y),2.0)*(0.2+0.8*occ);
		lin += 0.025*wbg*amb*vec3(0.75,0.85,0.9)*(0.1+0.9*occ);
		lin += (1.0-mate.xyz)*0.15*occ*vec3(1.0,0.5,0.1)*clamp(0.5+0.5*nor.x,0.0,1.0)*pow(clamp(0.5*(pos.x-1.5),0.0,1.0),2.0);

		//if( tmat.y>6.5 ) lin += sha*occ*vec3(5.0)*pow( clamp(1.0+dot(rd,nor),0.0,1.0), 3.0 );
		
		col += atten*mate.xyz*lin;
        col += atten*10.0*mate.w*mate.w*(0.5+0.5*mate.xyz)*spe*sha*occ*vec3(1.0,0.95,0.9);

		atten *= 2.0*mate.w;
		ro = pos + 0.001*nor;
		rd = ref;
    }
	}
	
	// desat
	col = mix( col, vec3(dot(col,vec3(0.33))), 0.3 );
	
    // gamma
	col = pow( col, vec3(0.45) );

	// tint
	col *= vec3(1.0,1.04,1.0);
	
	// vigneting
	col *= 0.5 + 0.5*pow( 16.0*q.x*q.y*(1.0-q.x)*(1.0-q.y), 0.1 );
	
    fragColor = vec4( col,1.0 );
}

//_______________________________________________________________________________________________________



void main( void)
{
	mainImage(gl_FragColor, gl_FragCoord.xy);
}