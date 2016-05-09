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
// Weather. By David Hoskins, May 2014.
// @ https://www.shadertoy.com/view/4dsXWn
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.

// Who needs mathematically correct simulations?! :)
// It ray-casts to the bottom layer then steps through to the top layer.
// It uses the same number of steps for all positions.
// The larger steps at the horizon don't cause problems as they are far away.
// So the detail is where it matters.
// Unfortunately this can't be used to go through the cloud layer,
// but it's fast and has a massive draw distance.

vec3 sunLight  = normalize( vec3(  0.35, 0.14,  0.3 ) );
const vec3 sunColour = vec3(1.0, .7, .55);
float gTime, cloudy;
vec3 flash;

#define CLOUD_LOWER 2000.0
#define CLOUD_UPPER 3800.0

#define TEXTURE_NOISE

// Shadows sort of work, but it's too slow and I don't see the point. :)
//#define REAL_SHADOW
#define MOD2 vec2(.16632,.17369)
#define MOD3 vec3(.16532,.17369,.15787)


//--------------------------------------------------------------------------

//--------------------------------------------------------------------------
float Hash( float p )
{
	vec2 p2 = fract(vec2(p) * MOD2);
    p2 += dot(p2.yx, p2.xy+19.19);
	return fract(p2.x * p2.y);
}
float Hash(vec3 p)
{
	p  = fract(p * MOD3);
    p += dot(p.xyz, p.yzx + 19.19);
    return fract(p.x * p.y * p.z);
}

//--------------------------------------------------------------------------
#ifdef TEXTURE_NOISE

//--------------------------------------------------------------------------
float Noise( in vec2 f )
{
    vec2 p = floor(f);
    f = fract(f);
    f = f*f*(3.0-2.0*f);
    float res = texture2D(iChannel0, (p+f+.5)/256.0).x;
    return res;
}
float Noise( in vec3 x )
{
    vec3 p = floor(x);
    vec3 f = fract(x);
	f = f*f*(3.0-2.0*f);
	
	vec2 uv = (p.xy+vec2(37.0,17.0)*p.z) + f.xy;
	vec2 rg = texture2D( iChannel0, (uv+ 0.5)/256.0, -100.0 ).yx;
	return mix( rg.x, rg.y, f.z );
}
#else

//--------------------------------------------------------------------------


float Noise( in vec2 x )
{
    vec2 p = floor(x);
    vec2 f = fract(x);
    f = f*f*(3.0-2.0*f);
    float n = p.x + p.y*57.0;
    float res = mix(mix( Hash(n+  0.0), Hash(n+  1.0),f.x),
                    mix( Hash(n+ 57.0), Hash(n+ 58.0),f.x),f.y);
    return res;
}
float Noise(in vec3 p)
{
    vec3 i = floor(p);
	vec3 f = fract(p); 
	f *= f * (3.0-2.0*f);

    return mix(
		mix(mix(Hash(i + vec3(0.,0.,0.)), Hash(i + vec3(1.,0.,0.)),f.x),
			mix(Hash(i + vec3(0.,1.,0.)), Hash(i + vec3(1.,1.,0.)),f.x),
			f.y),
		mix(mix(Hash(i + vec3(0.,0.,1.)), Hash(i + vec3(1.,0.,1.)),f.x),
			mix(Hash(i + vec3(0.,1.,1.)), Hash(i + vec3(1.,1.,1.)),f.x),
			f.y),
		f.z);
}
#endif

//--------------------------------------------------------------------------
float FBM( vec3 p )
{
	p *= .25;
    float f;
	
	f = 0.5000 * Noise(p); p = p * 3.02; //p.y -= gTime*.2;
	f += 0.2500 * Noise(p); p = p * 3.03; //p.y += gTime*.06;
	f += 0.1250 * Noise(p); p = p * 3.01;
	f += 0.0625   * Noise(p); p =  p * 3.03;
	f += 0.03125  * Noise(p); p =  p * 3.02;
	f += 0.015625 * Noise(p);
    return f;
}

//--------------------------------------------------------------------------
float SeaFBM( vec2 p )
{
    float f;
	f = (sin(sin(p.x *1.22+gTime) + cos(p.y *.14)+p.x*.15+p.y*1.33-gTime)) * 1.0;
    
	f += (sin(p.x *.9+gTime + p.y *.3-gTime)) * 1.0;
    f += (cos(p.x *.7-gTime - p.y *.4-gTime)) * .5;
    f += 1.5000 * (.5-abs(Noise(p)-.5)); p =  p * 2.05;
    f += .75000 * (.5-abs(Noise(p)-.5)); p =  p * 2.02;
    f += 0.2500 * Noise(p); p =  p * 2.07;
    f += 0.1250 * Noise(p); p =  p * 2.13;
    f += 0.0625 * Noise(p);

	return f;
}

//--------------------------------------------------------------------------
float Map(vec3 p)
{
	p *= .002;
	float h = FBM(p);
	return h-cloudy-.5;
}

//--------------------------------------------------------------------------
float SeaMap(in vec2 pos)
{
	pos *= .0025;
	return SeaFBM(pos) * (20.0 + cloudy*70.0);
}

//--------------------------------------------------------------------------
vec3 SeaNormal( in vec3 pos, in float d, out float height)
{
	float p = .005 * d * d / iResolution.x;
	vec3 nor  	= vec3(0.0,		    SeaMap(pos.xz), 0.0);
	vec3 v2		= nor-vec3(p,		SeaMap(pos.xz+vec2(p,0.0)), 0.0);
	vec3 v3		= nor-vec3(0.0,		SeaMap(pos.xz+vec2(0.0,-p)), -p);
    height = nor.y;
	nor = cross(v2, v3);
	return normalize(nor);
}

#ifdef REAL_SHADOW
// Real shadow...
float Shadow(vec3 pos, vec3 rd)
{
	pos += rd * 400.0;
	float s = .0;
	for (int i= 0; i < 5; i++)
	{
		s += max(Map(pos), 0.0)*5.0;
		//s = clamp(s, 0.0, 1.0);
		pos += rd * 400.0;
	}
	return clamp(s, 0.1, 1.0);
}
#endif

//--------------------------------------------------------------------------
// Grab all sky information for a given ray from camera
vec3 GetSky(in vec3 pos,in vec3 rd, out vec2 outPos)
{
	float sunAmount = max( dot( rd, sunLight), 0.0 );
	// Do the blue and sun...	
	vec3  sky = mix(vec3(.0, .1, .4), vec3(.3, .6, .8), 1.0-rd.y);
	sky = sky + sunColour * min(pow(sunAmount, 1500.0) * 5.0, 1.0);
	sky = sky + sunColour * min(pow(sunAmount, 10.0) * .6, 1.0);
	
	// Find the start and end of the cloud layer...
	float beg = ((CLOUD_LOWER-pos.y) / rd.y);
	float end = ((CLOUD_UPPER-pos.y) / rd.y);
	
	// Start position...
	vec3 p = vec3(pos.x + rd.x * beg, 0.0, pos.z + rd.z * beg);
	outPos = p.xz;
    beg +=  Hash(p)*150.0;

	// Trace clouds through that layer...
	float d = 0.0;
	vec3 add = rd * ((end-beg) / 45.0);
	vec2 shade;
	vec2 shadeSum = vec2(0.0, .0);
	float difference = CLOUD_UPPER-CLOUD_LOWER;
	shade.x = .01;
	// I think this is as small as the loop can be
	// for an reasonable cloud density illusion.
	for (int i = 0; i < 55; i++)
	{
		if (shadeSum.y >= 1.0) break;
		float h = Map(p);
		shade.y = max(-h, 0.0); 
#ifdef REAL_SHADOW
		shade.x = Shadow(p, sunLight);
#else
        //	shade.x = clamp(1.*(-Map(p-sunLight*.0)  -Map(p)) / .01, 0.0,1.0)*p.y/difference;
		shade.x = p.y / difference;  // Grade according to height
#endif
		shadeSum += shade * (1.0 - shadeSum.y);

		p += add;
	}
	shadeSum.x /= 10.0;
	shadeSum = min(shadeSum, 1.0);
	
	vec3 clouds = mix(vec3(pow(shadeSum.x, .4)), sunColour, (1.0-shadeSum.y)*.4);
	
	clouds += min((1.0-sqrt(shadeSum.y)) * pow(sunAmount, 4.0), 1.0) * 2.0;
   
    clouds += flash * (shadeSum.y+shadeSum.x+.2) * .5;

	sky = mix(sky, min(clouds, 1.0), shadeSum.y);
	
	return clamp(sky, 0.0, 1.0);
}

//--------------------------------------------------------------------------
vec3 GetSea(in vec3 pos,in vec3 rd, out vec2 outPos)
{
	vec3 sea;
	float d = -pos.y/rd.y;
	vec3 p = vec3(pos.x + rd.x * d, 0.0, pos.z + rd.z * d);
	outPos = p.xz;
	
	float dis = length(p-pos);
    float h = 0.0;
	vec3 nor = SeaNormal(p, dis, h);

	vec3 ref = reflect(rd, nor);
	ref.y = max(ref.y, 0.0015);
	sea = GetSky(p, ref, p.xz);
	h = h*.005 / (1.0+max(dis*.02-300.0, 0.0));
   	float fresnel = max(dot(nor, -rd),0.0);
    fresnel = pow(fresnel, .3)*1.1;
    
	sea = mix(sea*.6, (vec3(.3, .4, .45)+h*h) * max(dot(nor, sunLight), 0.0), min(fresnel, 1.0));
	
	float glit = max(dot(ref, sunLight), 0.0);
	sea += sunColour * pow(glit, 220.0) * max(-cloudy*100.0, 0.0);
	
	return sea;
}

//--------------------------------------------------------------------------
vec3 CameraPath( float t )
{
    return vec3(4000.0 * sin(.16*t)+12290.0, 0.0, 8800.0 * cos(.145*t+.3));
} 

//--------------------------------------------------------------------------
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	float m = (iMouse.x/iResolution.x)*30.0;
	gTime = iGlobalTime*.5 + m + 75.5;
	cloudy = cos(gTime * .25+.4) * .26;
    float lightning = 0.0;
    
    if (cloudy >= .2)
    {
        float f = mod(gTime+1.5, 2.5);
        if (f < .8)
        {
            f = smoothstep(.8, .0, f)* 1.5;
        	lightning = mod(-gTime*(1.5-Hash(gTime*.3)*.002), 1.0) * f;
        }
    }
    
    flash = clamp(vec3(1., 1.0, 1.2) * lightning, 0.0, 1.0);
       
	
    vec2 xy = fragCoord.xy / iResolution.xy;
	vec2 uv = (-1.0 + 2.0 * xy) * vec2(iResolution.x/iResolution.y,1.0);
	
	vec3 cameraPos = CameraPath(gTime - 2.0);
	vec3 camTar	   = CameraPath(gTime - .0);
	camTar.y = cameraPos.y = sin(gTime) * 200.0 + 300.0;
	camTar.y += 370.0;
	
	float roll = .1 * sin(gTime * .25);
	vec3 cw = normalize(camTar-cameraPos);
	vec3 cp = vec3(sin(roll), cos(roll),0.0);
	vec3 cu = cross(cw,cp);
	vec3 cv = cross(cu,cw);
	vec3 dir = normalize(uv.x*cu + uv.y*cv + 1.3*cw);
	mat3 camMat = mat3(cu, cv, cw);

	vec3 col;
	vec2 pos;
	if (dir.y > 0.0)
	{
		col = GetSky(cameraPos, dir, pos);
	}else
	{
		col = GetSea(cameraPos, dir, pos);
	}
	float l = exp(-length(pos) * .00002);
	col = mix(vec3(.6-cloudy*1.2)+flash*.3, col, max(l, .2));
	
	// Do the lens flares...
	float bri = dot(cw, sunLight) * 2.7 * clamp(-cloudy+.2, 0.0, .2);
	if (bri > 0.0)
	{
		vec2 sunPos = vec2( dot( sunLight, cu ), dot( sunLight, cv ) );
		vec2 uvT = uv-sunPos;
		uvT = uvT*(length(uvT));
		bri = pow(bri, 6.0)*.6;

		float glare1 = max(1.2-length(uvT+sunPos*2.)*2.0, 0.0);
		float glare2 = max(1.2-length(uvT+sunPos*.5)*4.0, 0.0);
		uvT = mix (uvT, uv, -2.3);
		float glare3 = max(1.2-length(uvT+sunPos*5.0)*1.2, 0.0);

		col += bri * sunColour * vec3(1.0, .5, .2)  * pow(glare1, 10.0)*25.0;
		col += bri * vec3(.8, .8, 1.0) * pow(glare2, 8.0)*9.0;
		col += bri * sunColour * pow(glare3, 4.0)*10.0;
	}
	
	vec2 st =  uv * vec2(.5+(xy.y+1.0)*.3, .02)+vec2(gTime*.5+xy.y*.2, gTime*.2);
	// Rain...
#ifdef TEXTURE_NOISE
 	float f = texture2D(iChannel0, st, -100.0).y * texture2D(iChannel0, st*.773, -100.0).x * 1.55;
#else
	float f = Noise( st*200.5 ) * Noise( st*120.5 ) * 1.3;
#endif
	float rain = clamp(cloudy-.15, 0.0, 1.0);
	f = clamp(pow(abs(f), 15.0) * 5.0 * (rain*rain*125.0), 0.0, (xy.y+.1)*.6);
	col = mix(col, vec3(0.15, .15, .15)+flash, f);
	col = clamp(col, 0.0,1.0);

	// Stretch RGB upwards... 
	//col = (1.0 - exp(-col * 2.0)) * 1.1565;
	//col = (1.0 - exp(-col * 3.0)) * 1.052;
	col = pow(col, vec3(.7));
	//col = (col*col*(3.0-2.0*col));

	// Vignette...
	col *= .55+0.45*pow(70.0*xy.x*xy.y*(1.0-xy.x)*(1.0-xy.y), 0.15 );	
	
	fragColor=vec4(col, 1.0);
}

//--------------------------------------------------------------------------


//_______________________________________________________________________________________________________





void main( void)
{
	mainImage(gl_FragColor, gl_FragCoord.xy);
}