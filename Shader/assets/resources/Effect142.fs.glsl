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

// Stockholms Ström
// by Peder Norrby / Trapcode in 2016
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0


mat3 rotationMatrix(vec3 axis, float angle)
{
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    
    return mat3(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c          );
                                          
}


//
// Description : Array and textureless GLSL 2D/3D/4D simplex 
//               noise functions.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : ijm
//     Lastmod : 20110822 (ijm)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//               https://github.com/ashima/webgl-noise
// 


vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
     return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

float noise(vec3 v)
  { 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

// First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

// Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  //   x0 = x0 - 0.0 + 0.0 * C.xxx;
  //   x1 = x0 - i1  + 1.0 * C.xxx;
  //   x2 = x0 - i2  + 2.0 * C.xxx;
  //   x3 = x0 - 1.0 + 3.0 * C.xxx;
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
  vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

// Permutations
  i = mod289(i); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

// Gradients: 7x7 points over a square, mapped onto an octahedron.
// The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
  float n_ = 0.142857142857; // 1.0/7.0
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
  //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

//Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

// Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
  }



/*
mat4 rotationMatrix(vec3 axis, float angle)
{
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    
    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
}*/



float fnoise( vec3 p)
{
    mat3 rot = rotationMatrix( normalize(vec3(0.0,0.0, 1.0)), 0.5*iGlobalTime);
    mat3 rot2 = rotationMatrix( normalize(vec3(0.0,0.0, 1.0)), 0.3*iGlobalTime);
    float sum = 0.0;
    
    vec3 r = rot*p;
    
    float add = noise(r);
    float msc = add+0.7;
   	msc = clamp(msc, 0.0, 1.0);
    sum += 0.6*add;
    
    p = p*2.0;
    r = rot*p;
    add = noise(r);
 
    add *= msc;
    sum += 0.5*add;
    msc *= add+0.7;
   	msc = clamp(msc, 0.0, 1.0);
    
    p.xy = p.xy*2.0;
    p = rot2 *p;
    add = noise(p);
    add *= msc;
    sum += 0.25*abs(add);
    msc *= add+0.7;
   	msc = clamp(msc, 0.0, 1.0);
 
    p = p*2.0;
  //  p = p*rot;
    add = noise(p);// + vec3(iGlobalTime*5.0, 0.0, 0.0));
    add *= msc;
    sum += 0.125*abs(add);
    msc *= add+0.2;
   	msc = clamp(msc, 0.0, 1.0);

    p = p*2.0;
  //  p = p*rot;
    add = noise(p);
    add *= msc;
    sum += 0.0625*abs(add);
    //msc *= add+0.7;
   	//msc = clamp(msc, 0.0, 1.0);

    
    return sum*0.516129; // return msc as detail measure?
}

float getHeight(vec3 p) // x,z,time
{
    
 	return 0.3-0.5*fnoise( vec3(0.5*(p.x + 0.0*iGlobalTime), 0.5*p.z,  0.4*iGlobalTime) );   
}

#define box_y 1.0
#define box_x 2.0
#define box_z 2.0
#define bg vec4(0.0, 0.0, 0.0, 1.0)
#define step 0.3
#define red vec4(1.0, 0.0, 0.0, 1.0)
#define PI_HALF 1.5707963267949

vec4 getSky(vec3 rd)
{
    if (rd.y > 0.3) return vec4(0.5, 0.8, 1.5, 1.0); // bright sky
    if (rd.y < 0.0) return vec4(0.0, 0.2, 0.4, 1.0); // no reflection from below
    
    if (rd.z > 0.9 && rd.x > 0.3) {
    	if (rd.y > 0.2) return 1.5*vec4(2.0, 1.0, 1.0, 1.0); // red houses
    	return 1.5*vec4(2.0, 1.0, 0.5, 1.0); // orange houses
    } else return vec4(0.5, 0.8, 1.5, 1.0 ); // bright sky
}


vec4 shadeBox(vec3 normal, vec3 pos, vec3 rd)
{
    float deep = 1.0+0.5*pos.y;
    
    vec4 col = deep*0.4*vec4(0.0, 0.3, 0.4, 1.0);
    
    return col;
 
}

vec4 shade(vec3 normal, vec3 pos, vec3 rd)
{
    float ReflectionFresnel = 0.99;
   	float fresnel = ReflectionFresnel*pow( 1.0-clamp(dot(-rd, normal), 0.0, 1.0), 5.0) + (1.0-ReflectionFresnel);
    vec3 refVec = reflect(rd, normal);
    vec4 reflection = getSky(refVec);
    
    //vec3 sunDir = normalize(vec3(-1.0, -1.0, 0.5));
    //float intens = 0.5 + 0.5*clamp( dot(normal, sunDir), 0.0, 1.0);
    
    float deep = 1.0+0.5*pos.y;
    
    vec4 col = fresnel*reflection;
    col += deep*0.4*vec4(0.0, 0.3, 0.4, 1.0);
    
    return clamp(col, 0.0, 1.0);
}

vec4 intersect_box(vec3 ro, vec3 rd) // no top and bottom, just sides!
{
    //vec3 normal;
    float t_min = 1000.0;
    vec3 t_normal;

    // x = -box_x plane
    float t = (-box_x -ro.x) / rd.x;
    vec3 p = ro + t*rd;

    if (p.y > -box_y && p.z < box_z && p.z > -box_z) {
        t_normal = vec3(-1.0, 0.0, 0.0);
        t_min = t;
        //if (dot(normal, rd) > PI_HALF ) return red;//shadeBox(normal, p, rd);
    }

    
    // x = +box_x plane
    //box_x = ro.x + t*rd.x
    //t*rd.x = box_x - ro.x
   // t = (box_x - ro.x)/rd.x
    
    t = (box_x -ro.x) / rd.x;
    p = ro + t*rd;

    if (p.y > -box_y && p.z < box_z && p.z > -box_z) {
        if (t < t_min) {
        	t_normal = vec3(1.0, 0.0, 0.0);
			t_min = t;
        }
    }

    // z = -box_z plane
	t = (-box_z -ro.z) / rd.z;
    p = ro + t*rd;
    
    if (p.y > -box_y && p.x < box_x && p.x > -box_x) {
        
        if (t < t_min) {
        	t_normal = vec3(0.0, 0.0, -1.0);
            t_min = t;
        }
    }
    
    // z = +box_z plane
	t = (box_z -ro.z) / rd.z;
    p = ro + t*rd;
    
    if (p.y > -box_y && p.x < box_x && p.x > -box_x) {
        
        if (t < t_min) {
        	t_normal = vec3(0.0, 0.0, 1.0);
            t_min = t;
        }
    }
    
    
    if (t_min < 1000.0) return shadeBox(t_normal, ro + t_min*rd, rd);
    
    
    return bg;
}



vec4 trace_heightfield( vec3 ro, vec3 rd)
{
    
    // intersect with max h plane, y=1
    
    //ro.y + t*rd.y = 1.0;
    //t*rd.y = 1.0 - ro.y;
    float t = (1.0 - ro.y) / rd.y;
    
    if (t<0.0) return red;
    
    vec3 p = ro + t*rd;
    
    if (p.x < -2.0 && rd.x <= 0.0) return bg;
    if (p.x >  2.0 && rd.x >= 0.0) return bg;
    if (p.z < -2.0 && rd.z <= 0.0) return bg;
    if (p.z >  2.0 && rd.z >= 0.0) return bg;
   
    
    //float h = getHeight(p);
    float h, last_h;
    bool not_found = true;
    vec3 last_p = p;
    
    for (int i=0; i<20; i++) {
        
        p += step*rd;
    
    	h = getHeight(p);
        
        if (p.y < h) {not_found = false; break;} // we stepped through
        last_h = h;
        last_p = p;
    }
    
    if (not_found) return bg;
 
 	// refine interection
    float dh2 = h - p.y;
    float dh1 = last_p.y - last_h;
 	p = last_p + rd*step/(dh2/dh1+1.0);
   
    // box shenanigans
    if (p.x < -2.0) {
        if (rd.x <= 0.0) return bg; 
        return intersect_box(ro, rd);
    }
    if (p.x >  2.0) {
        if (rd.x >= 0.0) return bg;
        return intersect_box(ro, rd);
    }
    if (p.z < -2.0) {
        if (rd.z <= 0.0) return bg; 
        return intersect_box(ro, rd);
    }
    if (p.z >  2.0) {
        if (rd.z >= 0.0) return bg;
        return intersect_box(ro, rd);
    }
    
    vec3 pdx = p + vec3( 0.01, 0.0,  0.00);
    vec3 pdz = p + vec3( 0.00, 0.0,  0.01);
    
    float hdx = getHeight( pdx );
    float hdz = getHeight( pdz );
   	h = getHeight( p );
    
    p.y = h;
    pdx.y = hdx;
    pdz.y = hdz;
    
    vec3 normal = normalize(cross( p-pdz, p-pdx)) ;
    
 	return shade(normal, p, rd);
}


// Shadertoy camera code by iq

mat3 setCamera( in vec3 ro, in vec3 ta, float cr ) 
{
	vec3 cw = normalize(ta-ro);
	vec3 cp = vec3(sin(cr), cos(cr),0.0);
	vec3 cu = normalize( cross(cw,cp) );
	vec3 cv = normalize( cross(cu,cw) );
    return mat3( cu, cv, cw );
}


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 p = (-iResolution.xy + 2.0*fragCoord.xy)/ iResolution.y;
    vec2 m = iMouse.xy/iResolution.xy;
    
    m.y += 0.3;
    m.x += 0.72;
    
    //m.y = clamp(m.y, 0.2, 2.0);
    //m.x = clamp(m.x, 1.15, 1.6);
    
    // camera
    vec3 ro = 9.0*normalize(vec3(sin(5.0*m.x), 1.0*m.y, cos(5.0*m.x))); // positon
	vec3 ta = vec3(0.0, -1.0, 0.0); // target
    mat3 ca = setCamera( ro, ta, 0.0 );
    // ray
    vec3 rd = ca * normalize( vec3(p.xy,4.0));
    
    
    fragColor = trace_heightfield( ro, rd );
}

// untested VR hook
void mainVR( out vec4 fragColor, in vec2 fragCoord, in vec3 fragRayOri, in vec3 fragRayDir )
{
    fragColor = trace_heightfield( fragRayOri, fragRayDir );
}

//_______________________________________________________________________________________________________





void main( void)
{
	mainImage(gl_FragColor, gl_FragCoord.xy);
}