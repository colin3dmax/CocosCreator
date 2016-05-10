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
#define EPS 0.01
#define MAX_ITR 100
#define MAX_DIS 10.0

#define rgb(r, g, b) vec3(float(r)/255., float(g)/255., float(b)/255.)

//Distance Functions
float sd_sph(vec3 p, float r) { return length(p) - r; }

//Distance Map
float map(vec3 p)
{
    vec2 u = p.xy*0.2;
    vec2 um = u*0.3;
    um.x += iGlobalTime*0.1;
    um.y += -iGlobalTime*0.025;
    float h   = texture2D(iChannel0, um).x;		//Non twisted height
    um.x += (um.y)*2.0;
    
    float hlg = texture2D(iChannel0, um).x;		//Large details
    float hfn = texture2D(iChannel0, u).x;		//Fine details
   
    float disp = hlg*0.4 + hfn*0.1*(1.0-hlg);	//Accumulative displacement
    
    return sd_sph(p, 1.5) + disp;
}

//Lighting Utils
float fresnel(float bias, float scale, float power, vec3 I, vec3 N)
{
    return bias + scale * pow(1.0 + dot(I, N), power);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 uv = fragCoord.xy / iResolution.xy;
    float t = iGlobalTime;
    vec3 col = vec3(1.-length(uv-vec2(0.5))*.5);
    
    //Marching Setup
    vec2 d = 1.-2.*uv;
    d.x *= iResolution.x / iResolution.y;
 	   
    float tdist = 0.;
    float dist  = EPS;
    
    vec3 campos = vec3(0.0, 0.0, -2.9);
    vec3 pos = campos;
    vec3 raydir = vec3(d.x, -d.y, 1.0);
    
    //Raymarching
    for(int i = 0; i < MAX_ITR; i++)
    {
        if(dist < EPS || dist > MAX_DIS)
			break;
        dist = map(pos);
        tdist += dist;
        pos += dist * raydir;
    }
    //Shading
    if(dist < EPS)
    {
     	vec3  lig = normalize( vec3(0., 0.7, -2.) );
    	vec2 eps = vec2(0.0, EPS);
        vec3 normal = normalize(vec3(
            map(pos + eps.yxx) - map(pos - eps.yxx),
            map(pos + eps.xyx) - map(pos - eps.xyx),
            map(pos + eps.xxy) - map(pos - eps.xxy)
       	));
        float diffuse = max(0.0, dot(lig, normal)) / 1.0;
        float specular = pow(diffuse, 256.);   

        vec3 I = normalize(pos - campos);
        float R = fresnel(0.2, 1.4, 2.0, I, normal);
        
        vec3 r = textureCube(iChannel1, reflect(raydir, normal)).rgb;
        //Good Colors: rgb(284, 111, 1)
        col = vec3(diffuse * rgb(84, 118, 145) + specular*0.1 + r*0.1 + R*0.5);
    }
    
	fragColor = vec4(col,1.0);
}

//_______________________________________________________________________________________________________





void main( void)
{
	mainImage(gl_FragColor, gl_FragCoord.xy);
}