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

#define NUM_STEPS 50
#define CAMDIST 20.0
#define CAMROTSPEED 0.4
#define FAR 200.0
#define NEAR 1.0
#define DAYNNIGHTSPEED 1.01
#define DEPTH 1.0
#define OCTAVES_PERLIN 8
#define ASTRESIZE 1.8
#define ANIMATE

#define CAMPOS vec3(0.0, 10.0, 100.0)
#define FORCEFIELDPOS vec3(0.0, 0.0, 80.0)
#define CREEPSCALE 2.0

struct Light {
    vec3 o;
    vec3 d;
    vec4 diffuseColor;
    float shininess;
	float power;
};

Light sun = Light(
    vec3(0.0, 0.0, 0.0),
    vec3(0.0, 0.0, 0.0),
    vec4(1.0, 1.0, 0.3, 1.0),
    2.0,
    2.0);
Light moon = Light(
    vec3(0.0, 0.0, 0.0),
    vec3(0.0, 0.0, 0.0),
    vec4(0.9, 0.9, 1.0, 1.0),
    2.0,
    0.3);

vec3 dirtColor = vec3(1.0, 0.9, 0.9);
vec3 grassColor = vec3(0.05, 0.4, 0.09);
vec3 skyDayColor = vec3(0.4, 0.4, 1.0);
vec3 skyNightColor = vec3(0.2, 0.2, 0.4);
vec3 creepColor = vec3(0.6, 0.3, 0.7);

float forcefieldRadius = 10.0;
float forcefieldOpacity = 0.6;
float forcefieldIntersectionSize = 0.15;
float forcefieldDiffuseFactor = 1.4;
float forcefieldSpecularFactor = 1.7;
vec3 forcefieldColor = vec3(0.0, 0.3, 1.0);
vec3 forcefieldVeinsColor = vec3(0.0, 0.5, 0.7);

float hash(vec2 x) {
    float h = dot(x, vec2(42.69, 51.42));
	return fract(sin(h)*50403.43434);   
}

float noise(vec2 p) {
    return mix(hash(p), hash(p+vec2(0.001, 0.001)), fract(p.x));
}

float voronoi(vec2 uv) {
    vec2 fl = floor(uv);
    vec2 fr = fract(uv);
    float res = 1.0;
    for( int j=-1; j<=1; j++ ) {
        for( int i=-1; i<=1; i++ ) {
            vec2 p = vec2(i, j);
            float h = hash(fl+p);
            vec2 vp = p-fr+h;
            float d = dot(vp, vp);
            
            res +=1.0/pow(d, 8.0);
        }
    }
    return pow( 1.0/res, 1.0/16.0 );
}

vec2 hash2( vec2 p )
{
	// texture based white noise
	return texture2D( iChannel0, (p+0.5)/256.0, -100.0 ).xy;
	
    // procedural white noise	
	//return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
}

vec3 voronoi3( in vec2 x )
{
    vec2 n = floor(x);
    vec2 f = fract(x);

    //----------------------------------
    // first pass: regular voronoi
    //----------------------------------
	vec2 mg, mr;

    float md = 8.0;
    for( int j=-1; j<=1; j++ )
    for( int i=-1; i<=1; i++ )
    {
        vec2 g = vec2(float(i),float(j));
		vec2 o = hash2( n+g );
		#ifdef ANIMATE
        o = 0.5 + 0.5*sin( iGlobalTime + 6.2831*o );
        #endif	
        vec2 r = g + o - f;
        float d = dot(r,r);

        if( d<md )
        {
            md = d;
            mr = r;
            mg = g;
        }
    }

    //----------------------------------
    // second pass: distance to borders
    //----------------------------------
    md = 8.0;
    for( int j=-2; j<=2; j++ )
    for( int i=-2; i<=2; i++ )
    {
        vec2 g = mg + vec2(float(i),float(j));
		vec2 o = hash2( n+g );
		#ifdef ANIMATE
        o = 0.5 + 0.5*sin( iGlobalTime + 6.2831*o );
        #endif	
        vec2 r = g + o - f;

        if( dot(mr-r,mr-r)>1.5 )
        md = min( md, dot( 0.5*(mr+r), normalize(r-mr) ) );
    }

    return vec3( md, mr );
}

float tiles(vec2 uv) {
	return smoothstep(
        0.4,
        0.5,
        max(
 			abs(
                fract(8.0*uv.x - 0.5*mod(floor(8.0*uv.y), 2.0) ) - 0.5),
 			abs(fract(8.0*uv.y) - 0.5)
        )
    );
}

/***************************************
 * Hexagonal tiles thanks to klk from https://www.shadertoy.com/view/lt2SzG
 ***************************************/

#define pi 3.14159


float vlx(vec2 uv, out float a)
{
    float v=0.0;
    vec2 lp=uv-vec2(-0.5,0.5*tan(pi/6.0));
    v=length(lp);a=atan(lp.y, lp.x);

    vec2 lp1=uv-vec2(0.5,0.5*tan(pi/6.0));
    float v1=length(lp1);
    if(v1<v){v=v1;a=atan(lp1.y, lp1.x);}

    vec2 lp2=uv-vec2( 0.0,-0.5/cos(pi/6.0));
    float v2=length(lp2);
    if(v2<v){v=v2;a=atan(lp2.y, lp2.x);}
    
    a=(a/pi*0.5+0.5);
    
    return v;
}

vec4 hex(vec2 uv, out float ang1, out float ang2)
{
    float x=uv.x;
    float y=uv.y;
    float h=1.0/cos(pi/6.0);
    
	x+=(fract(y*h/2.0)>0.5?0.0:0.5);
    x=fract(x)-0.5;
    y=fract(y*h)/h-0.5/h;
    float n=6.0;
    float a=atan(x,y)/pi/2.0;
    float v=length(vec2(x,y));
    vec2 p=vec2(0,0);
    vec2 p0=vec2(sin(pi/6.0),cos(pi/6.0));
    if(y<0.0)p0.y=-p0.y;
    if(x<0.0)p0.x=-p0.x;
	float v0=length(vec2(x,y)-p0);
    if(v0<v)
    {
        v=v0;p=p0;
	    x=x-p.x;
	    y=y-p.y;
    }

    a=atan(x,y);
    v=length(vec2(x,y))*2.0;
    v=(v*5.0+a*pi/32.0)*10.0;
	float v1=0.0;
    float v2=0.0;

    v1=vlx(vec2(x,y), ang1);
    v2=vlx(vec2(x,-y), ang2);
    return vec4(x,y,v1,v2);
}

// Simplex 2D noise
// sources: Ian McEwan - https://github.com/ashima/webgl-noise/blob/master/src/noise2D.glsl
// sources: Patricio Gonzalez Vivo - https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                        -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
                     + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
                            dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}

float perlin(vec3 V) {
    float total = 0.0;
    for(int i=2;i<OCTAVES_PERLIN+2;i++) {
        total += (1.0/float(i))*snoise(V.xz);
        V*=2.0+(float(i)/100.0);
    }
    return total;
}

float sdSphere(vec3 pos, float radius)
{
    return length(pos) - radius;
}

float sdGaussianRadialBlob(vec3 pos, vec3 originalPos, float radius)
{
    return (snoise((pos-FORCEFIELDPOS).xz+iGlobalTime))*0.2;
}

float sdBox( vec3 p, vec3 b )
{
  vec3 d = abs(p) - b;
  return min(max(d.x,max(d.y,d.z)),0.0) +
         length(max(d,0.0));
}

float IntersectSphere(vec3 ro, vec3 rd, vec3 sc, float sr, out float d2) {
    vec3 Z = ro-sc;
    float B = 2.0 * dot(rd, Z);
    float C = Z.x*Z.x+Z.y*Z.y+Z.z*Z.z-sr*sr;
    float D = B*B - 4.0*C;
    float t = -1.0;
    float d = -1.0;
   	d2 = -1.0;
    if(D>=0.0) {
        if(C>0.0) {
            d = (-B-sqrt(D))/2.0;
            d2 = (-B+sqrt(D))/2.0;
        }else{
            d = (-B+sqrt(D))/2.0;
            d2 = (-B-sqrt(D))/2.0;
        }
    }
    return d;
}

float sdTerrain(vec3 p) {
    float h = 0.0;
    float f = 0.09;
    float amp = 3.0;
    for(int i = 0;i<7;i++) {
        h+=snoise(p.xz*f)*amp;
        f *= 1.9;
        amp *= 0.22;
    }
	return DEPTH+h;//snoise(p.xz);//cos(p.x)+sin(p.z);
}

vec2 map(vec3 p) {
    vec2 ret = vec2(-1.0, -1.0);
    float t = sdTerrain(p);
    float rb = sdGaussianRadialBlob(p,FORCEFIELDPOS/*vec3(0.0, 0.0, 60.0)*/, 1.0);
    if(t<rb)
  		ret.xy = vec2(t, 0.0);
    else{
        float s = sdSphere(FORCEFIELDPOS-p, forcefieldRadius);
        if(min(rb, -s)==-s) {
        	ret = vec2((t+rb)*CREEPSCALE, 1.0);
        }else{
            ret = vec2(t, 0.0);
        }
    }
    //ret.x = max(ret.x, -s);
    return ret;
    /*return max(-sdSphere(p, vec3(0.0, 0.0, 80.0), forcefieldRadius),
               min(sdTerrain(p),
                   sdGaussianRadialBlob(p, vec3(0.0, 0.0, 60.0), 30.0)
                   )
               );*/
}

vec3 mapNormal(vec3 pt, float e) {
    vec3 normal;
    normal.y = map(pt).x;    
    normal.x = map(vec3(pt.x+e,pt.y,pt.z)).x - normal.y;
    normal.z = map(vec3(pt.x,pt.y,pt.z+e)).x - normal.y;
    normal.y = e;
    return normalize(normal);
}

vec2 raymarch(vec3 ro, vec3 rd, in float tmin, in float tmax) {
    float t = tmin;
    vec2 m;
	for( int i=0; i<NUM_STEPS; i++ )
	{
        vec3 pos = ro + t*rd;
        m = map(pos);
		float h = pos.y - m.x;
		if( h<(0.002*t) || t>tmax ) break;
		t += 0.5*h;
	}

	return vec2(t, m.y);
}

vec3 TerrainColorMap(vec3 rd, vec3 p, vec3 n, vec3 l, float depth) {
    float _noise = snoise(p.xz*0.2);
    float _hash = perlin(p.xyz);
    
    float Lambert = max(0.0, dot(n, -l));
    
    float depthFactor = (FAR-depth)/(FAR-NEAR);
    
    return mix(
        depthFactor*mix(dirtColor, grassColor, _noise)*(_hash+1.5)*0.2+Lambert*0.3,
        mix(skyDayColor, skyNightColor, max(0.0, dot(rd, l)))*(1.0-depthFactor),
        1.0-depthFactor);
}

vec3 CreepColorMap(vec3 rd, vec3 p, vec3 n, vec3 l, float depth) {
    float _noise = snoise(p.xz*0.2);
    float _hash = perlin((p-FORCEFIELDPOS).xyz+vec3(iGlobalTime*1.0, iGlobalTime, iGlobalTime*-1.0));
    
    float Lambert = max(0.0, dot(n, -l));
    
    float depthFactor = (FAR-depth)/(FAR-NEAR);
    
    return mix(
        depthFactor*creepColor*(_hash+0.8)*0.7+Lambert*0.3,
        mix(skyDayColor, skyNightColor, max(0.0, dot(rd, l)))*(1.0-depthFactor),
        1.0-depthFactor);
}

vec3 SkyColorMap(vec2 pixel, vec3 ro, vec3 rd, vec3 p, vec3 n, vec3 l, float depth) {
    float _noise = snoise(p.xz*0.000001);
    float _hash = perlin(vec3(0.0, pixel.x, pixel.y)+p.xyz*0.000001);
    
    vec3 color = mix(skyDayColor, skyDayColor*0.8, pixel.y);
    color = mix(skyDayColor, skyNightColor, max(0.0, dot(rd, l))); 
    // sun
    float t3 = -1.0;
    float t2 = IntersectSphere(ro, rd, sun.o, ASTRESIZE, t3);
    if(t2>0.0) {
        vec3 intersectP = ro+rd*t2;
        vec3 normal = normalize(intersectP-sun.o);
        float gradient = dot(-rd, normal);
        color = mix(color, sun.diffuseColor.rgb, pow(gradient, sun.shininess)*sun.power);
    }
    // moon
    t2 = IntersectSphere(ro, rd, -sun.o, ASTRESIZE, t3);
    if(t2>0.0) {
        vec3 intersectP = ro+rd*t2;
        vec3 normal = normalize(intersectP+moon.o);
        float gradient = dot(-rd, normal);
        color = mix(color, moon.diffuseColor.rgb, pow(gradient, moon.shininess)*moon.power);
    }
    
    
    return mix(color, vec3(1.0), (1.0+snoise(p.yz*0.01))*0.5*(pixel.y*0.2));
}

vec3 ForceFieldColorMap(vec2 pixel, vec3 ro, vec3 rd, vec3 p, vec3 n, vec3 l, float depthFF, float depthTerrain) {
    return vec3(0.0);
}

// the camera construction method is inspired by the one from IQ
mat3 setCamera( in vec3 origin, in vec3 target, vec3 viewUp )
{
	vec3 cw = normalize(target-origin);
	vec3 cu = normalize( cross(cw,viewUp) );
	vec3 cv = normalize( cross(cu,cw) );
    return mat3( cu, cv, cw );
}

void camPos(float t, in vec3 rdi, in vec3 roi, out vec3 ro, out vec3 rd) {
    mat3 rotX = mat3(
        1.0, 0.0, 0.0,
        0.0, cos(t), -sin(t),
        0.0, sin(t), cos(t));
    mat3 rotY = mat3(
        cos(t), 0.0, sin(t),
        0.0, 1.0, 0.0,
        -sin(t), 0.0, cos(t));
    mat3 rotZ = mat3(
        cos(t), sin(t), 0.0,
        -sin(t), cos(t), 0.0,
    	0.0, 0.0, 1.0);
    
    ro = roi;/*+vec3(
        cos(t)*CAMDIST,
        0.0,
        sin(t)*CAMDIST);*///vec3(cos(t), 4.0, sin(t))*CAMDIST;
	rd = normalize(rdi*rotY);
}

void lightPos(float t, out vec3 lPos) {
    mat3 rotX = mat3(
        1.0, 0.0, 0.0,
        0.0, cos(t), -sin(t),
        0.0, sin(t), cos(t));
    lPos = lPos*rotX;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 pixel = -1.0 + 2.0*fragCoord.xy/iResolution.xy;
    vec2 mv = -1.0 + 2.0*iMouse.xy/iResolution.xy+vec2(1.0, 0.0);
    float Time = mod(iGlobalTime*CAMROTSPEED, 360.0);

    vec3 forcefieldPos = FORCEFIELDPOS;
    
    vec3 ro = CAMPOS;
    vec3 rd = vec3(pixel, 1.0);
	vec3 lPos = vec3(0.0, 100.0, 100.0);
    #ifdef oldsys
    camPos(Time*CAMROTSPEED,
           rd, vec3(0.0, 4.0, 100.0),
           ro, rd);
    //lightPos(Time, forcefieldPos);
    
    mat3 ca = setCamera(ro, rd, vec3(0.0, 1.0, 0.0));
    rd = ca*rd;
    #else
    	ro.x = forcefieldPos.x+cos(Time*CAMROTSPEED)*CAMDIST;
    	ro.z = forcefieldPos.z+sin(Time*CAMROTSPEED)*CAMDIST;
    	rd = normalize(rd);
        mat3 ca = setCamera(ro, forcefieldPos, vec3(0.0, 1.0, 0.0));
        rd = ca*rd;
    #endif
    lightPos(Time*DAYNNIGHTSPEED, lPos);
    
    vec2 rm = raymarch(ro, rd, 0.0, FAR);
    float t = rm.x;
    vec3 p = ro+rd*t;
    vec3 n = normalize(mapNormal(p, 0.001));
    vec3 l = normalize(p - lPos);
    
    sun.o = lPos;
    sun.d = l;
    
    
    vec3 color = vec3(0.0, 0.0, 0.0);
    if(t>0.0 && t<FAR && rm.y==0.0) {
    	//color = vec3(1.0/t);
        color = TerrainColorMap(rd, p, n, l, t);
    }else if(t>0.0 && t<FAR && rm.y==1.0) {
        color = CreepColorMap(rd, p, n, l, t);
    }else{
    	color = SkyColorMap(pixel, ro, rd, p, n, l, t);
    }
    float t3;
    float t2 = IntersectSphere(ro, rd, forcefieldPos, forcefieldRadius, t3);
    if(abs(t2-t)<forcefieldIntersectionSize || (t3>=0.0 && abs(t2-t)<forcefieldIntersectionSize)) {
        color = mix(color, forcefieldColor*(1.0-(abs(t2-t)/forcefieldIntersectionSize)), forcefieldOpacity);
    }
    if(t2>0.0 && t2<t) {
        vec3 p = ro+rd*t2;
        float v = voronoi3(p.xz).x;
        vec2 tilesUV = p.xz;
        tilesUV.y += sin((tilesUV.x+iGlobalTime)*10.0)*0.01;
        float a;
        vec3 ffn = normalize(p-forcefieldPos)*
            hex(tilesUV*0.5, a, a).xyz
            //mix(1.0, 1.0-tiles(tilesUV*0.5)*1.0, max(0.0, dot(rd, l)))
            ;//smoothstep( 0.01, 0.02, v );//((pow(1.0-v, 0.3)*1.5));
        vec3 ffc = forcefieldColor;
    
        float diffuseTerm = max(0.0, dot(-l, ffn));
        float specularTerm = max(0.0, dot(-l, reflect(rd, ffn)));
        ffc += diffuseTerm*forcefieldDiffuseFactor;
        ffc += specularTerm*forcefieldSpecularFactor*pow(2.0, specularTerm);
    
    	float edge = 1.0-(abs(t3-t2))/(forcefieldRadius*2.0);
        color = mix(color, ffc, forcefieldOpacity*edge);
        if(t3>=0.0 && t3<t) {
            vec3 p = ro+rd*t3;
            float v = voronoi3(p.xz).x;
        	tilesUV = p.xz;
        	tilesUV.y += sin((tilesUV.x+iGlobalTime)*10.0)*0.01;

            ffn = normalize(p-forcefieldPos)*
            	hex(tilesUV*0.5, a, a).xyz
                //mix(1.0, tiles(tilesUV*0.5)*1.0, max(0.0, dot(rd, l)))
                ;//*smoothstep( 0.01, 0.05, v );//((pow(1.0-v, 0.3)*1.5));
            diffuseTerm = max(0.0, dot(-l, ffn));
            specularTerm = max(0.0, dot(-l, reflect(rd, ffn)));
            
            ffc += diffuseTerm*forcefieldDiffuseFactor;
        	ffc += specularTerm*forcefieldSpecularFactor*pow(2.0, specularTerm);
            color = mix(color, ffc, forcefieldOpacity*edge);
        }
        color = mix(color, forcefieldVeinsColor, (1.0-smoothstep(0.02, 0.1, v))*forcefieldOpacity);
    	color = mix(color, vec3(1.0), edge*0.5);
        //color = mix(color, forcefieldColor, 1.0-max(0.0, 1.0-dot(normalize(ffn), normalize(rd)))); 
    }
    fragColor = vec4(color, 1.0);
}
//_______________________________________________________________________________________________________





void main( void)
{
	mainImage(gl_FragColor, gl_FragCoord.xy);
}