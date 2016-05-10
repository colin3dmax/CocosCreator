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
//based on... (don't trust my math! go to the source)
//https://www.shadertoy.com/view/4sdXWX
//http://iquilezles.org/www/articles/mset_1bulb/mset1bulb.htm

//#define SHOW_RADII
float k,qk,rk;
float Rk(float k){return 1.0/pow(k,1./(k-1.))-1.0/pow(k,k/(k-1.));}
float Qk(float k){return pow(2.,1./(k-1.));}

vec3 mcol;
float DE(vec3 z0){//mandelBulb by twinbee
   vec4 c = vec4(z0,1.0),z = c;
   float r = length(z.xyz),zo,zi,r1=r;
   for (int n = 0; n < 7; n++) {
      if(r>qk+0.25)break;//experimenting with early bailout
      zo = asin(z.z / r) * k +iGlobalTime;
      zi = atan(z.y, z.x) * 7.0;//even messing with the rotations stays in bounds
      z=pow(r, k-1.0)*vec4(r*vec3(cos(zo)*vec2(cos(zi),sin(zi)),sin(zo)),z.w*k)+c;
      r = length(z.xyz);
   }
   mcol=10.0*z.xxz/z.w+clamp(r-rk,0.0,3.0)*0.15;
   return 0.5 * min(r1-rk,log(r) * r / z.w);
}
float rndStart(vec2 co){return 0.1+0.9*fract(sin(dot(co,vec2(123.42,117.853)))*412.453);}
float sphere( in vec3 ro, in vec3 rd, in float r){
   float b=dot(-ro,rd);
   float h=b*b-dot(ro,ro)+r*r;
   if(h<0.0)return -1.;
   return b-sqrt(h);
}
mat3 lookat(vec3 fw,vec3 up){
   fw=normalize(fw);vec3 rt=normalize(cross(fw,up));return mat3(rt,cross(rt,fw),fw);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ){
   float pxl=1.0/iResolution.x;//find the pixel size
   float tim=iGlobalTime*0.3;
   k=7.0+sin(tim)*3.0;
   qk=Qk(k);
   rk=Rk(k);
   //position camera
   vec3 ro=vec3(abs(cos(tim)),sin(tim*0.3),abs(sin(tim)))*(qk+0.5);
   vec3 rd=normalize(vec3((fragCoord-0.5*iResolution.xy)/iResolution.y,1.0));
   rd=lookat(-ro,vec3(0.0,1.0,0.0))*rd;
   vec3 LDir=normalize(vec3(0.4,0.75,0.4));//direction to light
   vec3 bcol=vec3(0.5+0.25*rd.y);
   vec4 col=vec4(0.0);//color accumulator
   //march
   float t=sphere(ro,rd,qk+0.01);
   
  if(t>0.0){
   t+=DE(ro+rd*t)*rndStart(fragCoord);
   float d,od=1.0;
   for(int i=0;i<99;i++){
      d=DE(ro+rd*t);
      float px=pxl*(1.+t);
      if(d<px){
         vec3 scol=mcol;
         float d2=DE(ro+rd*t+LDir*px);
         float shad=abs(d2/d),shad2=max(0.0,1.0-d/od);
         scol=scol*shad+vec3(0.2,0.0,-0.2)*(shad-0.5)+vec3(0.1,0.15,0.2)*shad2;
         scol*=3.0*max(0.2,shad2);
         scol/=(1.0+t);//*(0.2+10.0*dL*dL);
         
         float alpha=(1.0-col.w)*clamp(1.0-d/(px),0.0,1.0);
         col+=vec4(clamp(scol,0.0,1.0),1.0)*alpha;
         if(col.w>0.9)break;
      }
      od=d;
      t+=d;
      if(t>6.0)break;
   }
  }
   col.rgb+=bcol*(1.0-clamp(col.w,0.0,1.0));
#ifdef SHOW_RADII
   t=sphere(ro,rd,qk);
   if(t<0.0)col.g=0.0;
   t=sphere(ro,rd,rk);
   if(t>0.0)col.b=1.0;
#endif
   fragColor=vec4(col.rgb,1.0);
} 

//_______________________________________________________________________________________________________



void main( void)
{
	mainImage(gl_FragColor, gl_FragCoord.xy);
}