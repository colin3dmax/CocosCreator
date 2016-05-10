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

//another pinball by eiffie (i just wanted to play it)
//all credit to the original by public_int_i https://www.shadertoy.com/view/MdyGDz
//this isn't his code - i started from scratch thinking it would be easy ... wasn't

#define RADIUS 0.075
#define PI 3.14159

#define inside(a) (fragCoord.y-a.y == 0.5 && (fract(a.x) == 0.1 || fragCoord.x-a.x == 0.5))
#define load(a) texture2D(iChannel0,(vec2(a,0.0)+0.5)/iResolution.xy)
#define save(a,b) if(inside(vec2(a,0.0))){fragColor=b;return;}

float Paddle(vec2 pa, vec2 ba){
	float t=clamp(dot(pa,ba)/dot(ba,ba),0.0,1.0);
	return length(pa-ba*t)+t*0.01;
}
float Tube(vec2 pa, vec2 ba){return length(pa-ba*clamp(dot(pa,ba)/dot(ba,ba),0.0,1.0));}

vec2 pdl,pdr,bp;
float mld=100.0;
float DE2(in vec2 p){//2d version
	float y=p.y*0.12;
	float dP=min(Paddle(p-vec2(-0.5,-1.0),pdl),Paddle(p-vec2(0.5,-1.0),pdr));
	p.x=abs(p.x);
	float d=min(max(p.x-1.0,abs(p.y)-1.55),length(p-vec2(0.0,1.5))-1.0);
	p.y=abs(p.y);
	d=min(abs(d),Tube(p-vec2(0.47-y,0.95),vec2(0.32,-0.12)));
	p.y=abs(p.y-1.0);
	d=min(d,Tube(p-vec2(0.26,1.0),vec2(0.15,-0.14)));
	float dB=length(p-vec2(0.74-y,0.79));
	mld=min(mld,dB);
	d=min(min(d,dB),dP);
	d-=0.05;
	return d;
}
vec3 Color(in vec3 p0){
	vec2 p=p0.xz;
	float y=p.y*0.12;
	float dP=min(Paddle(p-vec2(-0.5,-1.0),pdl),Paddle(p-vec2(0.5,-1.0),pdr));
	p.x=abs(p.x);
    float r=length(p-vec2(0.0,1.5))-1.0;
	float d=min(max(p.x-1.0,abs(p.y)-1.55),r);
	p.y=abs(p.y);
	d=min(abs(d),Tube(p-vec2(0.47-y,0.95),vec2(0.32,-0.12)));
	p.y=abs(p.y-1.0);
	d=min(d,Tube(p-vec2(0.26,1.0),vec2(0.15,-0.14)));
	float dB=length(p-vec2(0.74-y,0.79));
	if(dP<d && dP<dB)return vec3(1.0,0.9,0.8);
	vec3 col=vec3(0.5);
	if(dB<d){
		col+=0.4*sin(p0.zxx*9.0)+sin(p0.y*150.0)*0.1;
	}else {
		if(p0.y>1.0)col=vec3(0.4,0.6,0.7);
		if(p0.y<-0.5)col=vec3(0.7,0.6,0.5);
		if(p0.y>0.4)col.b+=0.3;
        vec3 h=fract(p0*20.0)-0.5;
        col+=vec3((h.x*h.z+h.y)*0.1+p0.y*2.0)+smoothstep(0.05,0.04,abs(p0.y))*0.3;
        col=mix(col,vec3(1.0),smoothstep(0.0,0.005,max(p.x-0.95,min(p0.z-1.5,r+0.05))));
	}
	return col+sin(p0.xyy*3.0)*0.1;
}
float RoundedIntersection(float a, float b, float r) {//modified from Mercury SDF http://mercury.sexy/hg_sdf/
	return max(max(a,b),length(max(vec2(0.0),vec2(r+a,r+b)))-r);
}
float DE(in vec3 p){//another pinball
	return RoundedIntersection(DE2(p.xz),p.y-RADIUS,0.02);
}
float Sphere( in vec3 ro, in vec3 rd, in vec3 p, in float r)
{//intersect a sphere - based on iq's
	float t=100.0;
	p=ro-p;
	float b=dot(p,rd);
	float h=b*b-dot(p,p)+r*r;
	if(h>=0.0){
		float t=-b-sqrt(h);
		if(t>0.0)return t;
	}	
	return 10.0;
}

vec2 rotate(vec2 v, float angle) {return cos(angle)*v+sin(angle)*vec2(v.y,-v.x);}
vec3 faketexture2D(sampler2D s,vec2 p){
	p.x*=106.0;p.y*=150.0;
	return vec3(0.7,0.6,0.5)*(0.9+0.1*(sin(p.x+sin(p.y))+sin(p.y+sin(p.x))));
}
vec4 st2;
vec3 scene(vec3 ro, vec3 rd){
	float maxt=(-RADIUS+0.005-ro.y)/rd.y;
	float tball=Sphere(ro,rd,vec3(bp.x,0.0,bp.y),RADIUS);
	float t=(RADIUS+0.005-ro.y)/rd.y,d,od=1.0;
	for(int i=0;i<24;i++){
		t+=d=DE(ro+rd*t);
		if(d<0.001 || t>maxt)break;
		od=d;
	}
	vec3 col=vec3(0.0);
	vec2 p=ro.xz+rd.xz*maxt;
	float d2=min(max(abs(p.x)-1.0,abs(p.y)-1.55),length(p-vec2(0.0,1.5))-1.0);
	if(d2<0.0){
		vec3 P=ro+rd*maxt+vec3(-0.03,0.0,0.03);
		d2=DE(P);
		d2=min(d2,length(P-vec3(bp.x,-RADIUS+0.005,bp.y)));
		d2=smoothstep(0.0,0.1,d2);
		col=texture2D(iChannel1,p.yx).rgb*(0.7+0.3*d2)+abs(sin(floor(p.x*20.0)))*0.2*d2;
	}
	if(d<0.01){
		float dif=clamp(1.0-d/od,0.6,1.0);
		col=mix(Color(ro+rd*t)*dif,col,smoothstep(0.0,0.01,d));
	}
	if(tball<t){
		t=tball;
		vec3 N=normalize(ro+rd*tball-vec3(bp.x,0.0,bp.y));
		d=dot(N,-rd);
		float dif=max(0.0,d);
		col=mix(col,vec3(1.0,1.0,0.7)*dif,smoothstep(0.0,0.56,d));
	}
	if(st2.x>0.0){
		col+=st2.x*vec3(1.0)/(0.5+1000.0*mld*mld);
	}
	return col;
}

float segment(vec2 uv){//from Andre https://www.shadertoy.com/view/Xsy3zG
	uv = abs(uv);return (1.0-smoothstep(0.0,0.28,uv.x)) * (1.0-smoothstep(0.4-0.14,0.4+0.14,uv.y+uv.x));
}
float sevenSegment(vec2 uv,int num){
	uv=(uv-0.5)*vec2(1.5,2.2);
	float seg=0.0;if(num>=2 && num!=7 || num==-2)seg+=segment(uv.yx);
	if (num==0 || (uv.y<0.?((num==2)==(uv.x<0.) || num==6 || num==8):(uv.x>0.?(num!=5 && num!=6):(num>=4 && num!=7) )))seg += segment(abs(uv)-0.5); 
	if (num>=0 && num!=1 && num!=4 && (num!=7 || uv.y>0.))seg += segment(vec2(abs(uv.y)-1.0,uv.x)); 
	return seg;
}
//prints a "num" filling the "rect" with "spaces" # of digits including minus sign
float formatInt(vec2 uv, vec2 rect, float num, int spaces){//only good up to 6 spaces!
	uv/=rect;if(uv.x<0.0 || uv.y<0.0 || uv.x>1.0 || uv.y>1.0)return 0.0;
	uv.x*=float(spaces);
	float place=floor(uv.x);
	float decpnt=floor(max(log(num)/log(10.0),0.0));//how many digits before the decimal place
	uv.x=fract(uv.x);
	num+=0.000001*pow(10.,decpnt);
	num /= pow(10.,float(spaces)-place-1.0);
	num = mod(floor(num),10.0);
	return sevenSegment(uv,int(num));
}

mat3 lookat(vec3 fw){
	fw=normalize(fw);vec3 rt=normalize(cross(fw,vec3(0.0,1.0,0.0)));return mat3(rt,cross(rt,fw),fw);
}
void mainImage(out vec4 fragColor, in vec2 fragCoord){
	vec4 st0=load(0),st1=load(1);
	st2=load(2);
	bp=st1.xy;
	pdl=rotate(vec2(0.33,0.0),st0.x);pdr=rotate(vec2(-0.33,0.0),st0.y);
	vec3 ro=vec3(0.0,2.5,-2.5);
	vec3 rd=vec3((fragCoord-0.5*iResolution.xy)/iResolution.x,1.0);
	rd=lookat(vec3(st0.z*0.05,0.0,st0.w*0.2)-ro)*normalize(rd);
	fragColor=vec4(scene(ro,rd),1.0);
	vec2 uv=fragCoord/iResolution.xy;
	float d=formatInt(uv-vec2(0.1,0.9), vec2(0.1,0.05), floor(st2.y), 5);
	d+=formatInt(uv-vec2(0.85,0.9),vec2(0.02,0.05), floor(st2.z)+1.0, 1);
	fragColor=mix(fragColor,vec4(1.0,0.0,0.0,1.0),d);
}
//_______________________________________________________________________________________________________





void main( void)
{
	mainImage(gl_FragColor, gl_FragCoord.xy);
}