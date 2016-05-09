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

// Created by inigo quilez - iq/2014
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.

// { 2d cell id, distance to border, distnace to center )
vec4 hexagon( vec2 p ) 
{
	vec2 q = vec2( p.x*2.0*0.5773503, p.y + p.x*0.5773503 );
	
	vec2 pi = floor(q);
	vec2 pf = fract(q);

	float v = mod(pi.x + pi.y, 3.0);

	float ca = step(1.0,v);
	float cb = step(2.0,v);
	vec2  ma = step(pf.xy,pf.yx);
	
    // distance to borders
	float e = dot( ma, 1.0-pf.yx + ca*(pf.x+pf.y-1.0) + cb*(pf.yx-2.0*pf.xy) );

	// distance to center	
	p = vec2( q.x + floor(0.5+p.y/1.5), 4.0*p.y/3.0 )*0.5 + 0.5;
	float f = length( (fract(p) - 0.5)*vec2(1.0,0.85) );		
	
	return vec4( pi + ca - cb*ma, e, f );
}

float hash1( vec2  p ) { float n = dot(p,vec2(127.1,311.7) ); return fract(sin(n)*43758.5453); }

float noise( in vec3 x )
{
    vec3 p = floor(x);
    vec3 f = fract(x);
	f = f*f*(3.0-2.0*f);
	vec2 uv = (p.xy+vec2(37.0,17.0)*p.z) + f.xy;
	vec2 rg = texture2D( iChannel0, (uv+0.5)/256.0, -100.0 ).yx;
	return mix( rg.x, rg.y, f.z );
}


void mainImage( out vec4 fragColor, in vec2 fragCoord ) 
{
    vec2 uv = fragCoord.xy/iResolution.xy;
	vec2 pos = (-iResolution.xy + 2.0*fragCoord.xy)/iResolution.y;
	
    // distort
	pos *= 1.0 + 0.3*length(pos);
	
    // gray
	vec4 h = hexagon(8.0*pos + 0.5*iGlobalTime);
	float n = noise( vec3(0.3*h.xy+iGlobalTime*0.1,iGlobalTime) );
	vec3 col = 0.15 + 0.15*hash1(h.xy+1.2)*vec3(1.0);
	col *= smoothstep( 0.10, 0.11, h.z );
	col *= smoothstep( 0.10, 0.11, h.w );
	col *= 1.0 + 0.15*sin(40.0*h.z);
	col *= 0.75 + 0.5*h.z*n;
	

	// red
	h = hexagon(6.0*pos + 0.6*iGlobalTime);
	n = noise( vec3(0.3*h.xy+iGlobalTime*0.1,iGlobalTime) );
	vec3 colb = 0.9 + 0.8*sin( hash1(h.xy)*1.5 + 2.0 + vec3(0.0,1.0,1.0) );
	colb *= smoothstep( 0.10, 0.11, h.z );
	colb *= 1.0 + 0.15*sin(40.0*h.z);
	colb *= 0.75 + 0.5*h.z*n;

	h = hexagon(6.0*(pos+0.1*vec2(-1.3,1.0)) + 0.6*iGlobalTime);
    col *= 1.0-0.8*smoothstep(0.45,0.451,noise( vec3(0.3*h.xy+iGlobalTime*0.1,iGlobalTime) ));

	col = mix( col, colb, smoothstep(0.45,0.451,n) );

	
	col *= pow( 16.0*uv.x*(1.0-uv.x)*uv.y*(1.0-uv.y), 0.1 );
	
	fragColor = vec4( col, 1.0 );
}
//_______________________________________________________________________________________________________





void main( void)
{
	mainImage(gl_FragColor, gl_FragCoord.xy);
}