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

vec2 uv;

vec2 hash2a(vec2 x,float anim)
{
	float r = 523.0*sin(dot(x, vec2(53.3158, 43.6143)));
    float xa1=fract(anim);
    float xb1=anim-xa1;
    anim+=0.5;
    float xa2=fract(anim);
    float xb2=anim-xa2;
    
    vec2 z1=vec2(fract(15.32354 * (r+xb1)), fract(17.25865 * (r+xb1)));
    r=r+1.0;
    vec2 z2=vec2(fract(15.32354 * (r+xb1)), fract(17.25865 * (r+xb1)));
    r=r+1.0;
    vec2 z3=vec2(fract(15.32354 * (r+xb2)), fract(17.25865 * (r+xb2)));
    r=r+1.0;
    vec2 z4=vec2(fract(15.32354 * (r+xb2)), fract(17.25865 * (r+xb2)));
	return (mix(z1,z2,xa1)+mix(z3,z4,xa2))*0.5;
}

float hashNull(vec2 x)
{
    float r = fract(523.0*sin(dot(x, vec2(53.3158, 43.6143))));
    return r;
}

vec4 NC0=vec4(0.0,157.0,113.0,270.0);
vec4 NC1=vec4(1.0,158.0,114.0,271.0);

vec4 hash4( vec4 n ) { return fract(sin(n)*753.5453123); }
vec2 hash2( vec2 n ) { return fract(sin(n)*753.5453123); }
float noise2( vec2 x )
{
    vec2 p = floor(x);
    vec2 f = fract(x);
    f = f*f*(3.0-2.0*f);
	
    float n = p.x + p.y*157.0;
    vec2 s1=mix(hash2(vec2(n)+NC0.xy),hash2(vec2(n)+NC1.xy),vec2(f.x));
    return mix(s1.x,s1.y,f.y);
}

float noise3( vec3 x )
{
    vec3 p = floor(x);
    vec3 f = fract(x);
    f = f*f*(3.0-2.0*f);
	
    float n = p.x + dot(p.yz,vec2(157.0,113.0));
    vec4 s1=mix(hash4(vec4(n)+NC0),hash4(vec4(n)+NC1),vec4(f.x));
    return mix(mix(s1.x,s1.y,f.y),mix(s1.z,s1.w,f.y),f.z);
}

vec4 booble(vec2 te,vec2 pos,float numCells)
{
    float d=dot(te, te);
    //if (d>=0.06) return vec4(0.0);

    vec2 te1=te+(pos-vec2(0.5,0.5))*0.4/numCells;
    vec2 te2=-te1;
    float zb1=max(pow(noise2(te2*1000.11*d),10.0),0.01);
    float zb2=noise2(te1*1000.11*d);
    float zb3=noise2(te1*200.11*d);
    float zb4=noise2(te1*200.11*d+vec2(20.0));
    
    vec4 colorb=vec4(1.0);
    colorb.xyz=colorb.xyz*(0.7+noise2(te1*1000.11*d)*0.3);
    
    zb2=max(pow(zb2,20.1),0.01);
    colorb.xyz=colorb.xyz*(zb2*1.9);
    
    vec4 color=vec4(noise2(te2*10.8),noise2(te2*9.5+vec2(15.0,15.0)),noise2(te2*11.2+vec2(12.0,12.0)),1.0);
    color=mix(color,vec4(1.0),noise2(te2*20.5+vec2(200.0,200.0)));
    color.xyz=color.xyz*(0.7+noise2(te2*1000.11*d)*0.3);
    color.xyz=color.xyz*(0.2+zb1*1.9);
    
    float r1=max(min((0.033-min(0.04,d))*100.0/sqrt(numCells),1.0),-1.6);
    float d2=(0.06-min(0.06,d))*10.0;
    d=(0.04-min(0.04,d))*10.0;
	color.xyz=color.xyz+colorb.xyz*d*1.5;
    
    float f1=min(d*10.0,0.5-d)*2.2;
    f1=pow(f1,4.0);
    float f2=min(min(d*4.1,0.9-d)*2.0*r1,1.0);

    float f3=min(d2*2.0,0.7-d2)*2.2;
    f3=pow(f3,4.0);
    
	return vec4(color*max(min(f1+f2,1.0),-0.5)+vec4(zb3)*f3-vec4(zb4)*(f2*0.5+f1)*0.5);
}

// base from https://www.shadertoy.com/view/4djGRh
vec4 Cells(vec2 p,vec2 move, in float numCells,in float count,float blur)
{
    vec2 inp=p+move;
	inp *= numCells;
	float d = 1.0;
    vec2 te;
    vec2 pos;
	for (int xo = -1; xo <= 1; xo++)
	{
		for (int yo = -1; yo <= 1; yo++)
		{
			vec2 tp = floor(inp) + vec2(xo, yo);
            vec2 rr=mod(tp, numCells);
            tp=tp + (hash2a(rr,iGlobalTime*0.1)+hash2a(rr,iGlobalTime*0.1+0.25))*0.5;
			vec2 l = inp - tp;
            float dr=dot(l, l);
            if (hashNull(rr)>count)
                if (d>dr) {
					d = dr;
                    pos=tp;
                }
		}
	}
    if (d>=0.06) return vec4(0.0);
    te=inp-pos;
    
    //te=te+(te*noise3(vec3(te*5.9,iGlobalTime*40.0))*0.02);
    //te=te+(te*(noise3(vec3(te*3.9+p,iGlobalTime*0.2))+noise3(vec3(te*3.9+p,iGlobalTime*0.2+0.25))+noise3(vec3(te*3.9+p,iGlobalTime*0.2+0.5))+noise3(vec3(te*3.9+p,iGlobalTime*0.2+0.75)))*0.05);
     
    if (d<0.04) uv=uv+te*(d)*2.0;
    if (blur>0.0001) {
        vec4 c=vec4(0.0);
        for (float x=-1.0;x<1.0;x+=0.5) {
            for (float y=-1.0;y<1.0;y+=0.5) {
                c+=booble(te+vec2(x,y)*blur,p,numCells);
            }
        }
        return c*0.05;
    }

    return booble(te,p,numCells);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	uv = (fragCoord.xy) / iResolution.y*0.5;
    
    vec2 l1=vec2(iGlobalTime*0.02,iGlobalTime*0.02);
    vec2 l2=vec2(-iGlobalTime*0.01,iGlobalTime*0.007);
    vec2 l3=vec2(0.0,iGlobalTime*0.01);
    
    //vec4 e=vec4(noise2(uv*2.0),noise2(uv*2.0+vec2(200.0)),noise2(uv*2.0+vec2(50.0)),0.0);
    vec4 e=vec4(noise3(vec3(uv*2.0,iGlobalTime*0.1)),noise3(vec3(uv*2.0+vec2(200.0),iGlobalTime*0.1)),noise3(vec3(uv*2.0+vec2(50.0),iGlobalTime*0.1)),0.0);
    
	vec4 cr1=Cells(uv,vec2(20.2449,93.78)+l1,2.0,0.5,0.005);
    vec4 cr2=Cells(uv,vec2(0.0,0.0),3.0,0.5,0.003);
    vec4 cr3=Cells(uv,vec2(230.79,193.2)+l2,4.0,0.5,0.0);
    vec4 cr4=Cells(uv,vec2(200.19,393.2)+l3,7.0,0.8,0.01);
    vec4 cr5=Cells(uv,vec2(10.3245,233.645)+l3,9.2,0.9,0.02);
    vec4 cr6=Cells(uv,vec2(10.3245,233.645)+l3,14.2,0.95,0.05);
    
    e=max(e-vec4(dot(cr6,cr6))*0.1,0.0)+cr6*1.6;
    e=max(e-vec4(dot(cr5,cr5))*0.1,0.0)+cr5*1.6;
    e=max(e-vec4(dot(cr4,cr4))*0.1,0.0)+cr4*1.3;
    e=max(e-vec4(dot(cr3,cr3))*0.1,0.0)+cr3*1.1;
    e=max(e-vec4(dot(cr2,cr2))*0.1,0.0)+cr2*1.4;
    
	e=max(e-vec4(dot(cr1,cr1))*0.1,0.0)+cr1*1.8;
    
    //e=e*(3.0+sin(iGlobalTime*10.0)*0.4+sin(iGlobalTime*5.0)*0.5+sin(iGlobalTime*100.0)*0.05 )*0.25;
    
	fragColor= e;
}

//_______________________________________________________________________________________________________





void main( void)
{
	mainImage(gl_FragColor, gl_FragCoord.xy);
}