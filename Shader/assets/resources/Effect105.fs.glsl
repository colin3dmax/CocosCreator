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

// Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License

const int MAX_STEPS = 100;

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

struct Distance
{
	float value;
	vec3 color;
};

struct Hit
{
	bool is;
	vec3 pos;
	vec3 color;
};
    
mat4 rotateX(float angle)
{
	angle = -angle/180.0*3.1415926536;
    float c = cos(angle);
    float s = sin(angle);
	return mat4(1.0, 0.0, 0.0, 0.0, 0.0, c, -s, 0.0, 0.0, s, c, 0.0, 0.0, 0.0, 0.0, 1.0);
}
mat4 rotateY(float angle)
{
	angle = -angle/180.0*3.1415926536;
    float c = cos(angle);
    float s = sin(angle);
	return mat4(c, 0.0, s, 0.0, 0.0, 1.0, 0.0, 0.0, -s, 0.0, c, 0.0, 0.0, 0.0, 0.0, 1.0);
}
mat4 rotateZ(float angle)
{
	angle = -angle/180.0*3.1415926536;
    float c = cos(angle);
    float s = sin(angle);
	return mat4(c, -s, 0.0, 0.0, s, c, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0);
}
mat4 translate(vec3 t)
{
	return mat4(1.0, 0.0, 0.0, -t.x, 0.0, 1.0, 0.0, -t.y, 0.0, 0.0, 1.0, -t.z, 0.0, 0.0, 0.0, 1.0);
}

vec3 repeat(vec3 p, vec3 s)
{
	return mod(p, s) - s/2.0;
}
    
    
float sphere(vec3 p, float d)
{ 
    return length(p) - d/2.0;  
}

float box(vec3 p, vec3 s)
{ 
    vec3 w = abs(p) - s/2.0;
    return min(max(w.x,max(w.y,w.z)),0.0) + length(max(w,0.0));   
}

float capsule(vec3 p, float h, float d)
{
    float x = clamp(p.y/h, 0.0, 1.0);
    return length(p - vec3(0.0, h*x, 0.0)) - d*0.5;
}
    
Distance add(Distance d1, Distance d2)
{
    if (d2.value > d1.value)
        return d1;
    else
        return d2;
}

Distance smooth_add(Distance d1, Distance d2, float k)
{
    float a = d1.value;
    float b = d2.value;
    float h = clamp(0.5+0.5*(b-a)/k, 0.0, 1.0);
    return Distance(mix(b, a, h) - k*h*(1.0-h), mix(d2.color, d1.color, pow(h, 2.0)));
}

Distance intersection(Distance d1, Distance d2)
{
	if (d1.value > d2.value)
		return d1;
	else
		return d2;
}
    
Distance distance(vec3 p0)
{         
    vec4 p = vec4(p0, 1.0);
    mat4 m;   
    
        
    vec3 color = vec3(0.7, 0.52, 0.4) * 0.7;// * (sin(p.x*30.0)*sin(p.y*2.0)*sin(p.z*30.0)*0.1+0.7);    
    
    Distance d = Distance(sphere(p0 + vec3(0.0, 100.0, 0.0), 200.0) + sin(p.x/2.0)*cos(p.z/2.0)/2.0, vec3(0.2, 0.8, 0.5));
    
    
    d = smooth_add(d, Distance(capsule(p.xyz, 3.0, 0.6), color), 0.8);     
    
    p *= rotateY(sin(iGlobalTime)*2.0+sin(p.y)*2.0); 
    m = translate(vec3(0.0, 3.0, 0.0)) * rotateY(40.0) * rotateX(35.0);    
    p.x = abs(p.x) - 0.05;
    p.z = abs(p.z) - 0.05;    
    p = p * m;    
    d = smooth_add(d, Distance(capsule(p.xyz, 2.0, 0.4), color), 0.1); 
    
    p *= rotateY(10.0+sin(iGlobalTime+p.x)*5.0+sin(p.x)*5.0);    
    m = translate(vec3(0.0, 2.0, 0.0)) * rotateY(45.0) * rotateX(30.0);    
    p.x = abs(p.x) - 0.03;
    p.z = abs(p.z) - 0.03;
    p = p * m;    
    d = smooth_add(d, Distance(capsule(p.xyz, 1.5, 0.2), color), 0.1); 
    
    p *= rotateY(15.0+sin(iGlobalTime+p.z)*8.0+cos(p.z)*8.0);  
    m = translate(vec3(0.0, 1.5, 0.0)) * rotateY(55.0+sin(p.x)*10.0) * rotateX(35.0);    
    p.x = abs(p.x) - 0.01;
    p.z = abs(p.z) - 0.01;
    p = p * m;    
    d = smooth_add(d, Distance(capsule(p.xyz, 2.3, 0.08), color), 0.1); 
    
    
    float leafSize = min(sin(iGlobalTime / 3.0) * 0.06 + 0.11, 0.15);
    vec3 leafColor = hsv2rgb(vec3(cos((iGlobalTime) / 3.0 + sin((p.x+p.y+p.z)*5.0)/3.0) * 0.14 + 0.18, 0.7, 0.8));
    
    vec4 r = p;
    r.x = abs(r.x);
    r.z = abs(r.z);
    Distance leafs = Distance(max(sphere(repeat((r.xyz+vec3(0.0, 0.09, 0.1))/vec3(1.0, 2.0, 1.0)-vec3(0.05), vec3(0.19, 0.2, 0.19)), leafSize), box(p.xyz, vec3(0.03, 4.6, 0.2))), leafColor);
    d = add(d, leafs);
    
    p *= rotateY(10.0+sin(iGlobalTime+r.x)*10.0+sin(r.x)*10.0);  
    m = translate(vec3(0.0, 1.0, 0.0)) * rotateY(55.0) * rotateX(40.0);    
    p.x = abs(p.x) - 0.01;
    p.z = abs(p.z) - 0.01;
    p = p * m;    
    d = smooth_add(d, Distance(capsule(p.xyz, 1.2, 0.04), color), 0.1); 
    
    p.x = abs(p.x);
    p.z = abs(p.z);
    leafs = Distance(max(sphere(repeat((p.xyz+vec3(0.0, 0.0, 0.1))/vec3(1.0, 2.0, 1.0)-vec3(0.05), vec3(0.19, 0.2, 0.19)), leafSize), box(p.xyz, vec3(0.03, 2.5, 0.2))), leafColor);
    d = add(d, leafs); 
    
    
    return d;
}

Hit castRay(inout vec3 p, vec3 dir)
{	
	Hit hit;
	Distance dist = distance(p);
	float eps = 0.001;
	
	for (int i = 0; i < MAX_STEPS; i++)
	{
		Distance dist = distance(p);
		float d = dist.value;
                
		if (d <= eps)
		{
            hit.is = true;
            hit.pos = p;
            hit.color = dist.color * (1.0 - float(i) / float(MAX_STEPS));
            return hit;
		}
        
		p += dir*d*0.9;
	}	
	hit.is = false;
	hit.color = vec3(0);
	return hit;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    vec2 angle = vec2(-iMouse.x/200.0+2.2, radians(25.0));
    vec3 center = vec3(0.0, 4.0, 0.0);
    float zoom = 10.0;
    
    vec3 p = vec3(cos(angle.x)*cos(angle.y), sin(angle.y), sin(angle.x)*cos(angle.y));
	vec2 uv = (fragCoord.xy) / iResolution.yy - vec2(iResolution.x / iResolution.y / 2.0, 0.5);
    
    vec3 tx = vec3(-sin(angle.x), 0.0, cos(angle.x));
    vec3 ty = vec3(-cos(angle.x)*sin(angle.y), cos(angle.y), -sin(angle.x)*sin(angle.y));
    
    vec3 p2 = p * 0.8;
    p = p * zoom + center;
    
    vec3 dir = tx * uv.x + ty * uv.y - p2;
    
    vec3 color = vec3(0.0);
    vec3 light = normalize(vec3(-0.6, 0.8, -0.3));
    
    
	Hit hit = castRay(p, dir);
    
	if (hit.is)
    {        
        vec3 normal;
		float eps = 0.001;
        normal.x = distance(p + vec3(eps,0,0)).value - distance(p - vec3(eps,0,0)).value;
        normal.y = distance(p + vec3(0,eps,0)).value - distance(p - vec3(0,eps,0)).value;
        normal.z = distance(p + vec3(0,0,eps)).value - distance(p - vec3(0,0,eps)).value;
        normal = normalize(normal);
        vec3 c = mix(hit.color, vec3(0.8), normal.y * pow(1.0 - (cos(iGlobalTime / 3.0 - 1.5) / 2.0 + 0.5), 4.0) * (sign(hit.pos.y - 1.0) / 2.0 + 0.5));
		color = c * (max(dot(normal, light), 0.0) * 0.8 + 0.4) * min(5.0/length(p-vec3(0.0, 5.0, 0.0)), 2.0);
        
    }
	else
		color = vec3(0);
	
    
    fragColor = vec4(color, 1.0);
}

//_______________________________________________________________________________________________________





void main( void)
{
	mainImage(gl_FragColor, gl_FragCoord.xy);
}