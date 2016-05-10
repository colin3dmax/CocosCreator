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

// Created by inigo quilez - iq/2013
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.

#define NUM 9.0

float noise( in vec2 x )
{
    vec2 p = floor(x);
    vec2 f = fract(x);
	vec2 uv = p.xy + f.xy*f.xy*(3.0-2.0*f.xy);
	return texture2D( iChannel0, (uv+118.4)/256.0, -100.0 ).x;
}

float map( in vec2 x, float t )
{
    return noise( 2.5*x - 1.5*t*vec2(1.0,0.0) );
}


float shapes( in vec2 uv, in float r, in float e )
{
	float p = pow( 32.0, r - 0.5 );
	float l = pow( pow(abs(uv.x),p) + pow(abs(uv.y),p), 1.0/p );
	float d = l - pow(r,0.6) - e*0.2 + 0.05;
	// float fw = fwidth( d )*0.5;

	float fw = 0.01;
	fw *= 1.0 + 10.0*e;
	return (r)*smoothstep( fw, -fw, d ) * (1.0-0.2*e)*(0.4 + 0.6*smoothstep( -fw, fw, abs(l-r*0.8+0.05)-0.1 ));
}


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 qq = fragCoord.xy/iResolution.xy;
	vec2 uv = fragCoord.xy/iResolution.xx;
	
	float time = 11.0 + (iGlobalTime + 0.8*sin(iGlobalTime)) / 1.8;
	
	uv += 0.01*noise( 2.0*uv + 0.2*time );
	
    vec3 col = 0.0*vec3(1.0) * 0.15 * abs(qq.y-0.5);
	
	vec2 pq, st; float f; vec3 coo;
	
    // grey	
    pq = floor( uv*NUM ) / NUM;
	st = fract( uv*NUM )*2.0 - 1.0;
	coo = (vec3(0.5,0.7,0.7) + 0.3*sin(10.0*pq.x)*sin(13.0*pq.y))*0.6;
	col += 1.0*coo*shapes( st, map(pq, time), 0.0 );
	col += 0.6*coo*shapes( st, map(pq, time), 1.0 );

	// orange
    pq = floor( uv*NUM+0.5 ) / NUM;
	st = fract( uv*NUM+0.5 )*2.0 - 1.0;
    coo = (vec3(1.0,0.5,0.3) + 0.3*sin(10.0*pq.y)*cos(11.0*pq.x))*1.0;
	col += 1.0*coo*shapes( st, 1.0-map(pq, time), 0.0 );
	col += 0.4*coo*shapes( st, 1.0-map(pq, time), 1.0 );

	col *= pow( 16.0*qq.x*qq.y*(1.0-qq.x)*(1.0-qq.y), 0.05 );
	
	fragColor = vec4( col, 1.0 );
}
//_______________________________________________________________________________________________________





void main( void)
{
	mainImage(gl_FragColor, gl_FragCoord.xy);
}