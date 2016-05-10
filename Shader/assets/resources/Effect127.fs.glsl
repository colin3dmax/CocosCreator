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


// more info: 
//
// http://iquilezles.org/www/articles/smin/smin.htm
// http://iquilezles.org/www/articles/distance/distance.htm

float smin( float a, float b, float k )
{
	float h = clamp( 0.5 + 0.5*(b-a)/k, 0.0, 1.0 );
	return mix( b, a, h ) - k*h*(1.0-h);
}

float ya( float x ) { return 0.8*sin(5.0*x); }
float yb( float x ) { return exp(-5.0*x*x); }
float yc( float x ) { return 0.5 + 0.5*x; }

float func1( float x ) { return  min( min(ya(x),yb(x)),    yc(x));}
float func2( float x ) { return smin(smin(ya(x),yb(x),0.7),yc(x),0.7);}
float func3( float x ) { return smin(ya(x),smin(yb(x),yc(x),0.7),0.7);}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{	
    vec3 tot = vec3(0.0);
    
    float t = 3.0/iResolution.y;
    float eps = 0.0001;
    
    for( int i=0; i<8; i++ )
    {
        vec2  p = (-iResolution.xy + 2.0*(fragCoord+vec2(float(i)/8.0,0.0)))/iResolution.y;
        
        vec3 col = vec3( 0.15 );

        {
        float y = func1( p.x );
        float dy = (y - func1( p.x+eps ))/eps;
        float d = abs(p.y-y) / sqrt(1.0+dy*dy);
        col = mix( col, vec3(0.5,0.5,0.5), 1.0-smoothstep( 0.0, t, d ) );
        }
        {
        float y = func2( p.x );
        float dy = (y - func2( p.x+eps ))/eps;
        float d = abs(p.y-y) / sqrt(1.0+dy*dy);
        col = mix( col, vec3(1.0,1.0,0.0), 1.0-smoothstep( 0.0, t, d ) );
        }
        {
        float y = func3( p.x );
        float dy = (y - func3( p.x+eps ))/eps;
        float d = abs(p.y-y) / sqrt(1.0+dy*dy);
        col = mix( col, vec3(0.0,0.5,1.0), 1.0-smoothstep( 0.0, t, d ) );
        }
        
        tot += col;
    }
    
    tot /= 8.0;
    
    fragColor = vec4( tot, 1.0 );
}

//_______________________________________________________________________________________________________





void main( void)
{
	mainImage(gl_FragColor, gl_FragCoord.xy);
}