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
/*
"Animalted candle" by Emmanuel Keller aka Tambako - May 2016
License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
Contact: tamby@tambako.ch
*/

#define pi 3.14159265359

// Switches, you can play with them, but be careful, some options can crash your browser!
#define specular
//#define reflections
#define shadow
//#define test_shadow
#define ambocc
//#define test_ambocc
#define ss_scatering
#define show_table
#define show_candle
#define show_flame
#define flame_movement
#define burning_candle
#define show_plate
//#define antialias
//#define dev_mode

struct Lamp
{
  	vec3 position;
  	vec3 color;
  	float intensity;
  	float attenuation;
};

struct RenderData
{
  	vec3 col;
  	vec3 pos;
  	vec3 norm;
  	int objnr;
};
   
// Every object of the scene has its ID
#define SKY_OBJ        0
#define TABLE_OBJ      1
#define CANDLE_OBJ     2
#define WICK_OBJ       3
#define FLAME_OBJ      4
#define PLATE_OBJ      5

Lamp lamps[3];

// Campera options
vec3 campos = vec3(0., -0.4, 10.);
vec3 camtarget = vec3(0., 0.3, 0.);
vec3 camdir;
float fov = 11.;
float angle;
float angle2;

// Ambient light
const vec3 ambientColor = vec3(0.3);
const float ambientint = 0.;

// Color options
const vec3 candleColor_out = vec3(0.85, 0.3, 0.5);
const vec3 candleColor_in = vec3(1.05, 0.7, 0.85);
const vec3 wickColor1 = vec3(0.1, 0.1, 0.1);
const vec3 wickColor2 = vec3(1.9, 0.6, 0.1);
const vec3 flameColor1 = vec3(1.25, 0.9, 0.55);
const vec3 flameColor2 = vec3(0.12, 0.08, 0.94);
const vec3 plateColor = vec3(1.05, 1.09, 1.14);

// Shading options
const float specint_table = 0.22;
const float specshin_table  = 15.;
const float specint_candle = 0.1;
const float specshin_candle = 1.;
const float specint_plate = 0.35;
const float specshin_plate = 7.;
const float shi = 0.85;
const float shf = 0.11;
const float aoint = 0.65;
const float sssInt = 0.25;
const float ssstrmr = 1.8;

// Flame parameters
const float flameIntensity = 1.05;
const float flameStep = 0.005;
float flameBias = -0.002;
const float flameMovInt = 2.2;
const float flameMovSpeed = 0.37;
    
// Tracing options
const float normdelta = 0.001;
const float maxdist = 30.;
const int nbref = 1;

// Other perameters
const float woodSize = 0.4;
const float plateSize = 1.18;
const float plateThickness = 0.037;

#ifdef show_flame
#ifdef burning_candle
const float burningSpeed = 0.001;
#else
const float burningSpeed = 0.;
#endif
#else
const float burningSpeed = 0.;
#endif
float burnPos;

// Antialias. Change from 1 to 2 or more AT YOUR OWN RISK! It may CRASH your browser while compiling!
const float aawidth = 0.8;
const int aasamples = 1;

float aaindex;
bool traceFlame = true;

float SoftMaximum(float x, float y, float fact)
{
    x*= fact;
    y*= fact;
    
	float maximum = max(x, y);
	float minimum = min(x, y);
	return (maximum + log(1.0 + exp(minimum - maximum)))/fact;
}

// Union operation from iq
vec2 opU(vec2 d1, vec2 d2)
{
	return (d1.x<d2.x) ? d1 : d2;
}

vec2 rotateVec(vec2 vect, float angle)
{
    vec2 rv;
    rv.x = vect.x*cos(angle) - vect.y*sin(angle);
    rv.y = vect.x*sin(angle) + vect.y*cos(angle);
    return rv;
}

vec3 rotateVec2(vec3 posr)
{
    posr = vec3(posr.x, posr.y*cos(angle2) + posr.z*sin(angle2), posr.y*sin(angle2) - posr.z*cos(angle2));
    posr = vec3(posr.x*cos(angle) + posr.z*sin(angle), posr.y, posr.x*sin(angle) - posr.z*cos(angle)); 
    
    return posr;
}

// 1D hash function
float hash(float n)
{
    return fract(sin(n)*753.5453123);
}

// From https://www.shadertoy.com/view/4sfGzS
float noise(vec3 x)
{
    //x.x = mod(x.x, 0.4);
    vec3 p = floor(x);
    vec3 f = fract(x);
    f = f*f*(3.0-2.0*f);
	
    float n = p.x + p.y*157.0 + 113.0*p.z;
    return mix(mix(mix(hash(n+  0.0), hash(n+  1.0),f.x),
                   mix(hash(n+157.0), hash(n+158.0),f.x),f.y),
               mix(mix(hash(n+113.0), hash(n+114.0),f.x),
                   mix(hash(n+270.0), hash(n+271.0),f.x),f.y),f.z);
}

const mat3 m = mat3( 0.00,  0.80,  0.60,
                    -0.80,  0.36, -0.48,
                    -0.60, -0.48,  0.64 );

// From https://www.shadertoy.com/view/Xds3zN
float sdCylinder(vec3 p, vec2 h)
{
    vec2 d = abs(vec2(length(p.xz),p.y)) - h;
    return min(max(d.x,d.y),0.0) + length(max(d,0.0));
}

// From https://www.shadertoy.com/view/Xds3zN
float length2( vec2 p )
{
	return sqrt( p.x*p.x + p.y*p.y );
}
float length8( vec2 p )
{
	p = p*p; p = p*p; p = p*p;
	return pow( p.x + p.y, 1.0/8.0 );
}
float sdTorus82( vec3 p, vec2 t )
{
  vec2 q = vec2(length2(p.xz)-t.x,p.y);
  return length8(q)-t.y;
}

float map_plate(vec3 pos)
{
    #ifdef show_plate
    pos = rotateVec2(pos);
    pos.y+= 0.971 + plateThickness;
    
    float l = length(pos.xz)/plateSize;
    pos.y-= 0.13*smoothstep(0.58, 0.75, l);
    pos.y-= 0.05*smoothstep(0.7, 1.1, l);
    pos.y-= 0.06*smoothstep(-1., 0.6, cos(l*3.));
    pos.y/= (1. + 0.45*smoothstep(0.96, 1.02, l));
    float df = sdCylinder(pos, vec2(plateSize*1.1, plateThickness*1.03));
    df = SoftMaximum(df, sdCylinder(pos, vec2(plateSize, plateThickness*2.)), 55.);
    #ifdef dev_mode
    df = max(df, -pos.x);
    #endif   
    return df;
    #else
    return 10.;
    #endif
}

float map_candle(vec3 pos)
{
    #ifdef show_candle
    pos = rotateVec2(pos);
    pos.y+= 0.644;
    float rc = sdTorus82(pos, vec2(0.23, 0.27));
    float cs = length(pos*vec3(1. + burnPos*0.4, 1., 1. + burnPos*0.4) - vec3(0., 0.65 - burnPos, 0.)) - 0.45;
    float df = SoftMaximum(rc, -cs, 150.);
    
    df+= 0.011*noise(pos*6.);
    df+= 0.0004*noise(pos*70.)*smoothstep(0.25, 0.3, length(pos.xz));
    
    #ifdef dev_mode
    df = max(df, -pos.x);
    #endif
    return df;
    #else
    return 10.;
    #endif   
}

float map_wick(vec3 pos)
{
    #ifdef show_candle
    pos = rotateVec2(pos);
    pos.y+= 0.345 + burnPos;
    pos.z*= 1.6;
    float dy = pow(abs(pos.y + 0.1), 3.);
    pos.xz-= dy*vec2(5., 12.);
    
    float df = sdCylinder(pos, vec2(0.018, 0.1));

    #ifdef dev_mode
    df = max(df, -pos.x);
    #endif
    return df;
    #else
    return 10.;
    #endif
}

vec3 getFlameMovement(vec3 pos)
{
    #ifdef flame_movement
    float t = iGlobalTime*flameMovSpeed;
    vec3 nf = vec3(0.5*(noise(0.3*pos + vec3(0.4, 4.5, 0.5)*t) - 0.5),
                   0.4*(noise(0.1*pos + vec3(0.5, 2.8, 0.3)*(t + 100.)) - 0.5),
                   0.5*(noise(0.3*pos + vec3(0.6, 3.2, 0.4)*(t + 200.)) - 0.5));  
    nf = sign(nf)*smoothstep(0.07, 1., abs(nf));
    nf*= flameMovInt*smoothstep(-0.17, 0.25, pos.y);
    return nf;
    #else
    return vec3(0.);
    #endif
}

float map_flame(vec3 pos)
{
    #ifdef show_candle
    #ifdef show_flame
    if (!traceFlame)
        return 10.;
    pos = rotateVec2(pos);
    pos+= vec3(-0.01, 0.1 + burnPos, -0.035);
    pos*= 0.75 + 5.*smoothstep(0.44, 0.47, burningSpeed*iGlobalTime);
    vec3 fm = getFlameMovement(pos);
    vec3 pos2 = pos - fm; 
    
    float is = length(pos2*vec3(1., 0.5, 1.) + vec3(0., 0.04, 0.)) - 0.04;
    pos2.xz*= 1. + pos2.y*1.7;
    pos2.y/= 0.6 + 1.8/pow(abs(pos2.y), 0.2 + 1.3*pos2.y);
    
    float df = length(pos2) - 0.07;
    df = max(df, -is);

    #ifdef dev_mode
    df = max(df, -pos.x);
    #endif
    return df;
    #else
    return 10.;
    #endif
    #else
    return 10.;
    #endif
}

float map_table(vec3 pos, bool btext)
{
    #ifdef show_table
    pos = rotateVec2(pos);
    #ifdef show_plate
    pos.y+= 1.129 + plateThickness*2.;
    #else
    pos.y+= 1.115;
    #endif
    
    float df = sdCylinder(pos, vec2(5., 0.2));
    return df;
    #else
    return 10.;
    #endif
}

vec2 map(vec3 pos, bool btext)
{
    vec2 res;

    float candle = map_candle(pos);
    float wick = map_wick(pos);
    float flame = map_flame(pos);
    float table = map_table(pos, btext);
    float plate = map_plate(pos);

    res = vec2(candle, CANDLE_OBJ);
    res = opU(vec2(wick, WICK_OBJ), res);
    res = opU(vec2(flame, FLAME_OBJ), res);
    res = opU(res, vec2(table, TABLE_OBJ));
    res = opU(res, vec2(plate, PLATE_OBJ));

    return res;
}

// Main tracing function
vec2 trace(vec3 cam, vec3 ray, float maxdist) 
{
    float t = 0.02;
    float objnr = 0.;
    vec3 pos;
    float dist;
    float dist2;
    
  	for (int i = 0; i < 100; ++i)
    {
    	pos = ray*t + cam;
        vec2 res = map(pos, false);
        dist = res.x;
        if (dist>maxdist || abs(dist)<0.002)
            break;
        t+= dist*0.65;
        objnr = abs(res.y);
  	}
  	return vec2(t, objnr);
}

// From https://www.shadertoy.com/view/MstGDM
// Here the texture maping is only used for the normal, not the raymarching, so it's a kind of bump mapping. Much faster
vec3 getNormal(vec3 pos, float e)
{  
    vec2 q = vec2(0, e);
    return normalize(vec3(map(pos + q.yxx, true).x - map(pos - q.yxx, true).x,
                          map(pos + q.xyx, true).x - map(pos - q.xyx, true).x,
                          map(pos + q.xxy, true).x - map(pos - q.xxy, true).x));
}

// Gets the color of the sky
vec3 sky_color(vec3 ray)
{ 
    return clamp(vec3(0., 0.05*ray.y, 0.05 + 0.2*ray.y), 0., 0.3);
}

vec3 getCandleColor(vec3 pos)
{
    vec3 col = mix(candleColor_in, candleColor_out, pow(length(pos.xz)/0.45, 5.));
    return col;
}

vec3 getWickColor(vec3 pos)
{
    vec3 col;
    //col = mix(wickColor1, 1.6*candleColor_in*(0.3 + 0.8*lamps[1].color), smoothstep(-0.35, -0.42, pos.y));
    col = mix(wickColor1, candleColor_in*1.15, smoothstep(-0.35, -0.42, pos.y + burnPos));
    #ifdef show_flame
    col = mix(col, mix(wickColor2, wickColor1, smoothstep(0.46, 0.47, burningSpeed*iGlobalTime)), smoothstep(-0.28, -0.24, pos.y + burnPos));
    #endif
    return col;
}

vec3 getFlameColor(vec3 pos)
{
    return mix(flameColor2, flameColor1, smoothstep(-0.3, -0.10, pos.y + burnPos));
}

vec3 getTableColor(vec3 pos)
{
    return mix(1.1*vec3(0,0,0), vec3(0.65), 0.15);
}

vec3 getPlateColor(vec3 pos)
{
    float l = length(pos.xz)/plateSize;
    
    vec3 col = plateColor - 0.15 + 0.2*l;
    col-= 0.3*smoothstep(0.48, 0.57, l)*smoothstep(0.62, 0.57, l);
    col-= 0.1*smoothstep(0.63, 0.71, l)*smoothstep(0.78, 0.71, l);
    col-= 0.18*smoothstep(0.9, 1.01, l);
    
    col+= 0.12*noise(pos*5.3);
    col = pow(col, vec3(1, 0.9, 0.8));
    
    return col;
}

vec3 getFlameDensColor(vec3 pos, vec3 ray, float s, float fi)
{
    float d = 1.;
    float f;
    vec3 scol = vec3(0.);
    for (int i=0; i<30; i++)
    {
    	pos+= ray*s;
        f = -map_flame(pos);
        flameBias-= 0.005*smoothstep(0.45, 0.48, burningSpeed*iGlobalTime);
    	d = clamp(f + flameBias, 0., 10.);
        if (d<-0.1)
            break;
        scol+= d*getFlameColor(pos);
    }
    
    return scol*fi;
}
    
// Combines the colors
vec3 getColor(vec3 norm, vec3 pos, int objnr, vec3 ray)
{
   pos = rotateVec2(pos);
   return (objnr==CANDLE_OBJ?getCandleColor(pos):
          (objnr==WICK_OBJ?getWickColor(pos):
          (objnr==FLAME_OBJ?getFlameDensColor(pos, ray, flameStep, flameIntensity):
          (objnr==TABLE_OBJ?getTableColor(pos):getPlateColor(pos)))));
}

// Gets the flares of the lamps (kind of non-reflective specular...)
vec3 getFlares(vec3 ray)
{
	vec3 rc = vec3(0.);
    #ifdef show_candle
    #ifdef show_flame
    rc = 0.65*clamp(normalize(lamps[1].color)*lamps[1].intensity*pow(max(0.0, dot(ray, normalize(lamps[1].position - campos))), 250.), 0., 1.);
    #endif
    #endif
    return rc;
}

// From https://www.shadertoy.com/view/Xds3zN, but I changed the code
float softshadow(vec3 ro, vec3 rd, float mint, float tmax)
{
    traceFlame = false;
    float res = 1.0;
    float t = mint;
    for(int i=0; i<14; i++)
    {
    	float h = map(ro + rd*t, false).x;
        res = min(res, 7.0*h/t + 0.01*float(i));
        t += 0.3*clamp(h, 0.01, 0.25);
        if( h<0.001 || t>tmax ) break;
    }
    traceFlame = true;
    return clamp( res, 0.0, 1.0 );
}

// From https://www.shadertoy.com/view/Xds3zN
float calcAO(in vec3 pos, in vec3 nor)
{
	float occ = 0.0;
    float sca = 1.0;
    for(int i=0; i<6; i++)
    {
        float hr = 0.01 + 0.17*float(i)/9.0;
        vec3 aopos =  nor*hr + pos;
        float dd = map(aopos, false).x;
        occ+= -(dd - hr)*sca;
        sca*= 0.81;
    }
    occ = 2.*smoothstep(0.06, 0.5, occ);
    return clamp( 1.0 - 3.0*occ, 0.0, 1.0 );    
}

// Fresnel reflectance factor through Schlick's approximation: https://en.wikipedia.org/wiki/Schlick's_approximation
float fresnel(vec3 ray, vec3 norm, float n2)
{
   float n1 = 1.; // air
   float angle = acos(-dot(ray, norm));
   float r0 = dot((n1-n2)/(n1+n2), (n1-n2)/(n1+n2));
   float r = r0 + (1. - r0)*pow(1. - cos(angle), 5.);
   return r;
}

// Shading of the objects pro lamp
vec3 lampShading(Lamp lamp, vec3 norm, vec3 pos, vec3 ocol, int objnr, int lampnr)
{   
    vec3 pl = normalize(lamp.position - pos);
    float dlp = distance(lamp.position, pos);
    vec3 pli = pl/pow(1. + lamp.attenuation*dlp, 2.);
    float dnp = dot(norm, pli);
      
    // Diffuse shading
    vec3 col;
    if (objnr==FLAME_OBJ)
        col = ocol;
    else if (objnr==PLATE_OBJ)
        col = ocol*lamp.color*lamp.intensity*clamp(sign(dnp)*pow(abs(dnp), 1.8), 0., 1.);
    else
        col = ocol*lamp.color*lamp.intensity*clamp(dnp, 0., 1.);
    
    // Specular shading
    #ifdef specular
    float specint;
    float specshin;
    if (objnr==TABLE_OBJ)
    {
        specint = specint_table;
        specshin = specshin_table;       
    }
    if (objnr==CANDLE_OBJ)
    {
        float sc = pow(smoothstep(0.28 + burnPos*1.05, 0.05 + burnPos*1.15, length(pos.xz)), 2.);
        sc*= smoothstep(0.54, 0.47, burningSpeed*iGlobalTime);
        specint = specint_candle + 0.6*sc;
        specshin = specshin_candle + 280.*sc;       
    }
    if (objnr==WICK_OBJ)
    {
        specint = specint_candle;
        specshin = specshin_candle;       
    }
    if (objnr==FLAME_OBJ)
    {
        specint = 0.;
        specshin = 10.;       
    }
    if (objnr==PLATE_OBJ)
    {
        specint = specint_plate;
        specshin = specshin_plate;       
    }

    //if (dot(norm, lamp.position - pos) > 0.0)
        col+= lamp.color*lamp.intensity*specint*pow(max(0.0, dot(reflect(pl, norm), normalize(pos - campos))), specshin);
    #endif
    
    // Softshadow
    #ifdef shadow
    if (objnr!=CANDLE_OBJ && objnr!=FLAME_OBJ)
        #ifdef test_shadow
        col = vec3(1.)*softshadow(pos, normalize(lamp.position - pos), shf, 100.);
        #else
        col*= shi*softshadow(pos, normalize(lamp.position - pos), shf, 100.) + 1. - shi;
        #endif
    #endif
    
	// Sub surface scattering from https://www.shadertoy.com/view/MdXSzX
    #ifdef ss_scatering
    if (objnr==CANDLE_OBJ || objnr==WICK_OBJ)
    {
       vec3 sssColor = (objnr==CANDLE_OBJ?getCandleColor(pos):getWickColor(pos)*1.4);
	   float transmission = map_candle(pos + pl*ssstrmr)/ssstrmr;
	   vec3 sssLight = sssColor*lamp.color*smoothstep(0.0,1.0,transmission);
       //col = col*(1. - sssInt) + sssInt*sssLight;
       col = mix(col, sssLight, sssInt);
    }
    #endif
    
    return col;
}

// Shading of the objects over all lamps
vec3 lampsShading(vec3 norm, vec3 pos, vec3 ocol, int objnr)
{
    vec3 col = vec3(0.);
    for (int l=0; l<2; l++) // lamps.length()
        col+= lampShading(lamps[l], norm, pos, ocol, objnr, l);
    
    return col;
}

// From https://www.shadertoy.com/view/lsSXzD, modified
vec3 GetCameraRayDir(vec2 vWindow, vec3 vCameraDir, float fov)
{
	vec3 vForward = normalize(vCameraDir);
	vec3 vRight = normalize(cross(vec3(0.0, 1.0, 0.0), vForward));
	vec3 vUp = normalize(cross(vForward, vRight));
    
	vec3 vDir = normalize(vWindow.x * vRight + vWindow.y * vUp + vForward * fov);

	return vDir;
}

// Sets the position of the camera with the mouse and calculates its direction
void setCamera()
{
   vec2 iMouse2;
   if (iMouse.x==0. && iMouse.y==0.)
      iMouse2 = iResolution.xy*vec2(0.52, 0.65);
   else
      iMouse2 = iMouse.xy;
   
   campos = vec3(10.*cos(4.*iMouse2.x/iResolution.x)*(1. - 0.5*iMouse2.y/iResolution.y),
                 15.*(iMouse2.y/iResolution.y),
                 10.*sin(4.*iMouse2.x/iResolution.x)*(1. - 0.5*iMouse2.y/iResolution.y));
   camtarget = vec3(0., -1.2*iMouse2.y/iResolution.y - 0.3, 0.);
   camdir = camtarget - campos;   
}

// Tracing and rendering a ray
RenderData trace0(vec3 tpos, vec3 ray, float maxdist)
{
    vec2 tr = trace(tpos, ray, maxdist);
    float tx = tr.x;
    int objnr = int(tr.y);
    vec3 col;
    vec3 pos = tpos + tx*ray;
    vec3 norm;
    
    #ifdef show_flame
    //vec3 flamepos = vec3(0.); //vec3(0., 0.2 - burnPos, 0.);
    vec3 fm = getFlameMovement(vec3(0., 0.2 - burnPos, 0.));
    vec3 flamepos = vec3(0., 0.2 - burnPos, 0.) + 0.8*fm;
    float flameint = flameIntensity + 2.5*fm.y;
    flameint*= smoothstep(0.46, 0.45, burningSpeed*iGlobalTime);
    lamps[0] = Lamp(vec3(-2., 8., 10.), vec3(1., 1., 1.), 0.3, 0.01);
    lamps[1] = Lamp(flamepos, 0.9*flameColor1, flameint, 0.3); // Flame
    #else
    lamps[0] = Lamp(vec3(-2., 8., 10.), vec3(1., 1., 1.), 2.1, 0.01);
    lamps[1] = Lamp(vec3(0., 0, 0.), vec3(0., 0., .0), 0., 0.3); // Flame (off)
    #endif
    
    if (tx<maxdist*0.95)
    {
        norm = getNormal(pos, normdelta);
        col = getColor(norm, pos, objnr, ray);
      
        // Shading
        col = ambientColor*ambientint + lampsShading(norm, pos, col, objnr);
        
        // Ambient occlusion
        #ifdef ambocc
        #ifdef test_ambocc
        col = vec3(calcAO(pos, norm));
        #else
        col*= 1. - aoint + aoint*vec3(calcAO(pos, norm));
        #endif
        #endif
    }
    else
    {
        objnr = SKY_OBJ;
        col = vec3(0.);
    }
    return RenderData(col, pos, norm, objnr);
}

// Main render function with reflections and refractions
vec4 render(vec2 fragCoord)
{   
  	vec2 uv = fragCoord.xy / iResolution.xy; 
  	uv = uv*2.0 - 1.0;
  	uv.x*= iResolution.x / iResolution.y;

  	vec3 ray0 = GetCameraRayDir(uv, camdir, fov);
    vec3 ray = ray0;
  	RenderData traceinf0 = trace0(campos, ray, maxdist);
    RenderData traceinf = traceinf0;
  	vec3 col = traceinf.col;
    vec3 refray;
    
    #ifndef dev_mode
    #ifdef reflections
    if (traceinf.objnr==TABLE_OBJ)
    {	               
        refray = reflect(ray, traceinf.norm);

        RenderData traceinf_ref = trace0(traceinf.pos, refray, 20.);
        float rf = fresnel(ray, traceinf.norm, 3.);

        col+= mix(traceinf_ref.col, col, rf);
    }
    #endif
    if (traceinf.objnr==FLAME_OBJ)
    {
        traceFlame = false;
        traceinf = trace0(traceinf.pos, ray, maxdist);
        traceFlame = true;
        col = pow(pow(col, vec3(2.)) + pow(clamp(traceinf.col, 0., 1.), vec3(2.)), vec3(1./2.));
    }
    #endif

    col+= sky_color(ray);
    col+= getFlares(ray0);
  	return vec4(col, 1.0);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{   
    burnPos = 0.45*smoothstep(0., 0.45, burningSpeed*iGlobalTime) - 0.04;
    
    setCamera();
    
    // Antialiasing.
    #ifdef antialias
    vec4 vs = vec4(0.);
    for (int j=0;j<aasamples ;j++)
    {
       float oy = float(j)*aawidth/max(float(aasamples-1), 1.);
       for (int i=0;i<aasamples ;i++)
       {
          float ox = float(i)*aawidth/max(float(aasamples-1), 1.);
          vs+= render(fragCoord + vec2(ox, oy));
       }
    }
    vec2 uv = fragCoord.xy / iResolution.xy;
    fragColor = vs/vec4(aasamples*aasamples);
    #else
    fragColor = render(fragCoord);
    #endif
}  
//_______________________________________________________________________________________________________



void main( void)
{
	mainImage(gl_FragColor, gl_FragCoord.xy);
}