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

//Fancy ties by nimitz (twitter: @stormoid)

/*
	Somewhat complex modelling in a fully procedural shader that runs decently fast.
	I kinda cheated on the wings, the real ones are less hexagonal than this.
	Not doing proper occlusion checking for the lens flares to keep it fast.
*/

#define ITR 100
#define FAR 155.
#define time iGlobalTime

const float fov = 1.5;

//Global material id (keeps code cleaner)
float matid = 0.;

//--------------------Utility, Domain folding and Primitives---------------------
float tri(in float x){return abs(fract(x)-.5);}
mat3 rot_x(float a){float sa = sin(a); float ca = cos(a); return mat3(1.,.0,.0,    .0,ca,sa,   .0,-sa,ca);}
mat3 rot_y(float a){float sa = sin(a); float ca = cos(a); return mat3(ca,.0,sa,    .0,1.,.0,   -sa,.0,ca);}
mat3 rot_z(float a){float sa = sin(a); float ca = cos(a); return mat3(ca,sa,.0,    -sa,ca,.0,  .0,.0,1.);}
vec3 rotz(vec3 p, float a){
    float s = sin(a), c = cos(a);
    return vec3(c*p.x - s*p.y, s*p.x + c*p.y, p.z);
}

//From Dave_Hoskins
vec2 hash22(vec2 p){
	p  = fract(p * vec2(5.3983, 5.4427));
    p += dot(p.yx, p.xy +  vec2(21.5351, 14.3137));
	return fract(vec2(p.x * p.y * 95.4337, p.x * p.y * 97.597));
}

vec3 hash33(vec3 p){
	p  = fract(p * vec3(5.3983, 5.4427, 6.9371));
    p += dot(p.yzx, p.xyz  + vec3(21.5351, 14.3137, 15.3219));
	return fract(vec3(p.x * p.z * 95.4337, p.x * p.y * 97.597, p.y * p.z * 93.8365));
}


//2dFoldings, inspired by Gaz/Knighty  see: https://www.shadertoy.com/view/4tX3DS
vec2 foldHex(in vec2 p)
{
    p.xy = abs(p.xy);
    const vec2 pl1 = vec2(-0.5, 0.8657);
    const vec2 pl2 = vec2(-0.8657, 0.5);
    p -= pl1*2.*min(0., dot(p, pl1));
    p -= pl2*2.*min(0., dot(p, pl2));
    return p;
}

vec2 foldOct(in vec2 p)
{
    p.xy = abs(p.xy);
    const vec2 pl1 = vec2(-0.7071, 0.7071);
    const vec2 pl2 = vec2(-0.9237, 0.3827);
    p -= pl1*2.*min(0., dot(p, pl1));
    p -= pl2*2.*min(0., dot(p, pl2));
    
    return p;
}

float sbox( vec3 p, vec3 b )
{
  vec3 d = abs(p) - b;
  return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
}

float cyl( vec3 p, vec2 h )
{
  vec2 d = abs(vec2(length(p.xz),p.y)) - h;
  return min(max(d.x,d.y),0.0) + length(max(d,0.0));
}

float torus( vec3 p, vec2 t ){
  return length( vec2(length(p.xz)-t.x,p.y) )-t.y;
}

//using floor() in a SDF causes degeneracy.
float smoothfloor(in float x, in float k)
{
    float xk = x+k*0.5;
    return floor(xk-1.) + smoothstep(0.,k,fract(xk));
}

float hexprism(vec3 p, vec2 h){
    vec3 q = abs(p);
    return max(q.z-h.y,max((q.y*0.866025+q.x*0.5),q.x)-h.x);
}

//------------------------------------------------------------------------

vec3 position(in vec3 p)
{
    float dst =7.;
    float id = floor(p.z/dst*.1);
    p.xy += sin(id*10.+time);
    p.z += sin(id*10.+time*0.9)*.5;
    p = rotz(p,sin(time*0.5)*0.5+id*0.1);
    p.z = (abs(p.z)-dst)*sign(p.z);
    return p;
}

float map(vec3 p)
{
    matid= 0.;
	vec3 bp =p; //keep original coords around
   
    float mn = length(bp)-.7; //main ball
    
    //Cockpit
    p.z -=0.8;
    vec3 q = p;
    q.xy *= mat2(0.9239, 0.3827, -0.3827, 0.9239); //pi/8
    q.xy = foldOct(q.xy);
    p.z += length(p.xy)*.46;
    p.xy = foldOct(p.xy);
    float g = sbox(p-vec3(0.32,0.2,0.),vec3(.3,0.3,0.04)); //Cockpit Spokes
   	float mg = min(mn,g);
    if (mn < -g)matid = 2.;
    mn = max(mn,-g);
    float g2 = sbox(q,vec3(.45,0.15,.17)); //Cockpit center
    if (mn < -g2)matid = 2.;
    mn = max(mn,-g2);
    mn = min(mn,torus(bp.yzx+vec3(0,-.545,0),vec2(0.4,0.035))); //Cockpit lip
    mn = max(mn,-torus(bp+vec3(0,-.585,0),vec2(0.41,0.03))); //Hatch
    
    //Engine (Polar coords)
    mn = max(mn,-(bp.z+0.6));
    vec3 pl = bp.xzy;
    pl = vec3(length(pl.xz)-0.33, pl.y, atan(pl.z,pl.x));
    pl.y += .55;
    mn =  min(mn,sbox(pl, vec3(.29+bp.z*0.35,.25,4.)));
    pl.z = fract(pl.z*1.7)-0.5;
    mn = min(mn, sbox(pl + vec3(0.03,0.09,0.), vec3(0.05, .1, .2)));
    
    p = bp;
    p.x = abs(p.x)-1.1; //Main symmetry
    
    mn = min(mn, cyl(p.xzy-vec3(-0.87,.43,-0.48),vec2(.038,0.1))); //Gunports
    
    const float wd = 0.61; //Main width
    const float wg = 1.25; //Wign size
    
    mn = min(mn, cyl(p.yxz,vec2(0.22+smoothfloor((abs(p.x+0.12)-0.15)*4.,0.1)*0.04,0.6))); //Main structure
    vec3 pp = p;
    pp.y *= 0.95;
    vec3 r = p;
    p.y *= 0.65;
    p.z= abs(p.z);
    p.z -= 0.16;
    q = p;
    r.y = abs(r.y)-.5;
    mn = min(mn, sbox(r-vec3(-.3,-0.37,0.),vec3(0.35,.12-smoothfloor(r.x*2.-.4,0.1)*0.1*(-r.x*1.7),0.015-r.x*0.15))); //Side Structure
    mn = min(mn, sbox(r-vec3(-.0,-0.5,0.),vec3(0.6, .038, 0.18+r.x*.5))); //Side Structure
    p.zy = foldHex(p.zy)-0.5;
    pp.zy = foldHex(pp.zy)-0.5;
    mn = min(mn, sbox(p-vec3(wd,wg,0),vec3(0.05,.01,.6))); //wing Outer edge
    q.yz = foldHex(q.yz)-0.5;
    
    
    mn = min(mn, sbox(q-vec3(wd,-0.495-abs(q.x-wd)*.07,0.),vec3(0.16-q.z*0.07,.015-q.z*0.005,wg+.27))); //wing spokes
    mn = min(mn, sbox(q-vec3(wd,-0.5,0.),vec3(0.12-q.z*0.05,.04,wg+.26))); //Spoke supports
    
    mn = min(mn, sbox(pp-vec3(wd,-0.35,0.),vec3(0.12,.35,.5))); //Wing centers
    mn = min(mn, sbox(pp-vec3(wd,-0.35,0.),vec3(0.15+tri(pp.y*pp.z*30.*tri(pp.y*2.5))*0.06,.25,.485))); //Wing centers
    
    float wgn = sbox(p-vec3(wd,0,0),vec3(0.04,wg,1.));//Actual wings (different material)
    if (mn > wgn)matid = 1.;
    mn = min(mn, wgn);
    
    //Engine port
    float ep = hexprism(bp+vec3(0,0,0.6),vec2(.15,0.02));
    if (mn > ep)matid = 2.;
    mn = min(mn, ep);

    
    return mn;
}

float march(in vec3 ro, in vec3 rd)
{
	float precis = 0.001;
    float h=precis*2.0;
    float d = 0.;
    for( int i=0; i<ITR; i++ )
    {
        if( abs(h)<precis || d>FAR ) break;
        d += h;
        float res = map(position(ro+rd*d))*0.93;
        h = res;
    }
	return d;
}

//greeble-ish texture
float tex(in vec3 q)
{
    q.zy = foldOct(q.zy);
    vec2 p = q.zx;
    float id = floor(p.x)+100.*floor(p.y);
    float rz= 1.0;
    for(int i = 0;i<3;i++)
    {
        vec2 h = (hash22(floor(p))-0.5)*.95;
        vec2 q = fract(p)-0.5;
        q += h;
        float d = max(abs(q.x),abs(q.y))+0.1;
        p += 0.5;
        rz += min(rz,smoothstep(0.5,.55,d))*1.;
        p*=1.4;
    }
    rz /= 7.;
    return rz;
}

vec3 wingtex(in vec2 p, in float ds, in float ind)
{
    p.y *= 0.65;
    p.x = abs(p.x)-0.14;
    p = foldHex(p);
    
    //Fighting aliasing with distance and incidence.
    float rz = smoothstep(0.07,.0,tri(p.x*7.5))*15.*(ind)/(ds*ds);
    return vec3(1,.9,.8)*rz*0.7;
}

float mapHD(in vec3 p)
{
    float d= map(p);
    d += tex(p*3.+vec3(4.,0.,0.))*0.03/(length(p)*.3+.9);
    return d;
}

vec3 normal(const in vec3 p)
{  
    vec2 e = vec2(-1., 1.)*0.008;
	return normalize(e.yxx*mapHD(p + e.yxx) + e.xxy*mapHD(p + e.xxy) + 
					 e.xyx*mapHD(p + e.xyx) + e.yyy*mapHD(p + e.yyy) );   
}

//form iq
float getAO( in vec3 pos, in vec3 nor )
{
	float occ = 0.0;
    float sca = 1.0;
    for( int i=0; i<5; i++ )
    {
        float hr = 0.01 + 0.13*float(i)/3.;
        vec3 aopos =  nor * hr + pos;
        float dd = map( aopos );
        occ += -(dd-hr)*sca;
        sca *= 0.95;
    }
    return clamp( 1. - 3.5*occ, 0.0, 1.0 );    
}

//smooth and cheap 3d starfield
vec3 stars(in vec3 p)
{
    vec3 c = vec3(0.);
    float res = iResolution.x*.85*fov;
    
    //Triangular deformation (used to break sphere intersection pattterns)
    p.x += (tri(p.z*50.)+tri(p.y*50.))*0.006;
    p.y += (tri(p.z*50.)+tri(p.x*50.))*0.006;
    p.z += (tri(p.x*50.)+tri(p.y*50.))*0.006;
    
	for (float i=0.;i<3.;i++)
    {
        vec3 q = fract(p*(.15*res))-0.5;
        vec3 id = floor(p*(.15*res));
        float rn = hash33(id).z;
        float c2 = 1.-smoothstep(-0.2,.4,length(q));
        c2 *= step(rn,0.005+i*0.014);
        c += c2*(mix(vec3(1.0,0.75,0.5),vec3(0.85,0.9,1.),rn*30.)*0.5 + 0.5);
        p *= 1.15;
    }
    return c*c*1.5;
}

vec3 flare(in vec2 p, in vec2 pos, in vec3 lcol, in float sz)
{
	vec2 q = p-pos;
    q *= sz;
	float a = atan(q.x,q.y);
    float r = length(q);
    
    float rz= 0.;
    rz += .07/(length((q)*vec2(7.,200.))); //horiz streaks
    rz += 0.3*(pow(abs(fract(a*.97+.52)-0.5),3.)*(sin(a*30.)*0.15+0.85)*exp2((-r*5.))); //Spokes
	
    vec3 col = vec3(rz)*lcol;   
    col += exp2((1.-length(q))*50.-50.)*lcol*vec3(3.);
    col += exp2((1.-length(q))*20.-20.)*lcol*vec3(1,0.95,0.8)*0.5;    
    return clamp(col,0.,1.);
}

mat3 transpose(in mat3 m)
{
    return mat3(m[0][0], m[1][0], m[2][0],
                m[0][1], m[1][1], m[2][1],
                m[0][2], m[1][2], m[2][2]);
}

//A weird looking small moon
float slength(in vec2 p){ return max(abs(p.x), abs(p.y)); }
float moontex(in vec3 p)
{
    float r = length(p);
    vec3 q = vec3(r, acos(p.y/r), atan(p.z,p.x));
    q *= 6.5;
    vec3 bq = q;
    q.y = q.y*0.44-0.42;
    vec2 id = floor(q.zy);
    vec2 s = fract(q.zy)-0.5;
    
    float rz = 1.;
    float z = 0.25;
    for(int i=0;i<=3;i++)
    {
        vec2 rn = hash22(id+vec2(i)+0.0019)*.6 + 0.4;
        s -= abs(s)-rn*0.45;
        rz -= smoothstep(0.5,0.45-float(i)*0.1,slength(s*rn*1.3))*z;
        q *= 3.5;
        z *= .85;
        id = floor(q.zy);
    	s = fract(q.zy)-0.5;
    }
    
    rz -= smoothstep(0.035,.03,abs(bq.y-10.15))*.3; //main trench
    return rz;
}

float sphr(in vec3 ro, in vec3 rd, in vec4 sph)
{
	vec3 oc = ro - sph.xyz;
	float b = dot(oc,rd);
	float c = dot(oc,oc) - sph.w*sph.w;
	float h = b*b - c;
	if (h < 0.) return -1.;
	else return -b - sqrt(h);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{	
	vec2 p = fragCoord.xy/iResolution.xy-0.5;
	p.x*=iResolution.x/iResolution.y;
	vec2 mo = iMouse.xy / iResolution.xy-.5;
    mo = (mo==vec2(-.5))?mo=vec2(-0.15,0.):mo;
	mo.x *= iResolution.x/iResolution.y;
    mo*=4.;
	mo.x += time*0.17+0.1;

    vec3 ro = vec3(0.,0.,17.);
    vec3 rd = normalize(vec3(vec2(-p.x,p.y),-fov));
    float cms = 1.-step(sin((time+0.0001)*0.5),0.);
    mat3 inv_cam = mat3(0);
    
    if (cms < 0.5)
    {
        mat3 cam = rot_x(-mo.y)*rot_y(-mo.x);
        inv_cam = rot_y(-mo.x)*rot_x(mo.y); 
        ro *= cam;rd *= cam;
    }
    else
    {
        float frct = fract(time*0.15915);
        float frct2 = fract(time*0.15915+0.50001);
        float cms = 1.-step(sin((time+0.0001)*0.5),0.);
        ro = vec3(-15.,1.-(step(frct2,0.5))*frct2*40.,140.-frct*280.);
        vec3 ta = vec3(0);
        vec3 fwd = normalize(ta - ro);
        vec3 rgt = normalize(cross(vec3(0., 1., 0.), fwd ));
        vec3 up = normalize(cross(fwd, rgt));
        mat3 cam = mat3(rgt,up,-fwd);
        rd = normalize(vec3(vec2(p.x,p.y),-fov))*cam;
        inv_cam = transpose(cam);
    }
    
	float rz = march(ro,rd);
	
    vec3 lgt = normalize( vec3(.2, 0.35, 0.7) );
    vec3 col = vec3(0.0);
    float sdt = max(dot(rd,lgt),0.); 
    
    vec3 lcol = vec3(1,.85,0.73);
    col += stars(rd);
    
    vec3 fp = (-lgt*inv_cam);
    col += clamp(flare(p,-fp.xy/fp.z*fov, lcol,1.)*fp.z*1.1,0.,1.);
    
    //Another nearby star
    vec3 lcol2 = vec3(0.25,.38,1);
    vec3 lgt2 = normalize(vec3(-0.2,-.1,-0.8));
    fp = (-lgt2*inv_cam);
    col += clamp(flare(p,-fp.xy/fp.z*fov, lcol2,2.)*fp.z*1.1,0.,1.);
    
    //A "moon"
    vec4 sph = vec4(2000,500,-700,1000);
    float mn = sphr(ro,rd,sph);
    
    if (mn > 0.)
    {
        vec3 pos = ro+rd*mn;
        vec3 nor = normalize(pos-sph.xyz);
        vec3 dif = clamp(dot( nor, lgt ), 0., 1.)*0.985*lcol;
        vec3 bac = clamp( dot( nor, lgt2), 0.0, 1.0 )*lcol2;
        col = moontex((pos-sph.xyz))*vec3(0.52,0.54,0.7)*0.3;
        col *= dif + bac*0.01 + 0.005;
    }
    
    
    if ( rz < FAR )
    {
        float mat = matid;
        vec3 pos = ro+rz*rd;
        pos = position(pos);
        vec3 nor= normal(pos);
        float dif = clamp( dot( nor, lgt ), 0.0, 1.0 );
        float bac = clamp( dot( nor, lgt2), 0.0, 1.0 );
        float spe = pow(clamp( dot( reflect(rd,nor), lgt ), 0.0, 1.0 ),7.);
        float fre = pow( clamp(1.0+dot(nor,rd),0.0,1.0), 3.0 );
        vec3 brdf = vec3(0.);
        brdf += bac*mix(lcol2,vec3(1),0.5)*0.06;
        brdf += 1.5*dif*lcol;
        col = vec3(0.54,0.56,0.65)*1.1;
        col *= col;
        if (mat == 1.) 
        {
            brdf *= 0.0;
            spe *= 0.05;
            fre *= 0.05;
            brdf += wingtex(pos.zy,rz, max(dot(-rd,nor),0.)*0.5+0.5)*0.6;
        }
        else if (mat == 2.)
        {
            col = vec3(0);
            spe *= 0.1;
        }
        
        col = col*brdf + spe*.23 +.03*fre;
        col *= getAO(pos,nor);
    }
    
    col = clamp(col, 0.,1.);
    col = pow(clamp(col,0.,1.), vec3(0.416667))*1.055 - 0.055; //sRGB
	
	fragColor = vec4( col, 1.0 );
}
//_______________________________________________________________________________________________________





void main( void)
{
	mainImage(gl_FragColor, gl_FragCoord.xy);
}