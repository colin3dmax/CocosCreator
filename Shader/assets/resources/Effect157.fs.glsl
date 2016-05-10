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

const float
    BASES  = 5.,
    FLOOR  = 12.,
    FRACT  = 12.,
    DIGITS = FLOOR + FRACT,
    WIDTH  = .5;

// base( i ) maps i = ( 0,1,2,3,4 ) => ( 2,3,8,10,16 )
float 
    base( float i ) {
    
    return
    	i < 4.
        	? i < 2.
        		? i < 1.
        			? 2.
        			: 3.
            	: i < 3.
                	? 8.
                	: 10.
			: 16.;
    }

// extracts a digit of a floating point number
// pos 0 is the one left to the dot     
// pos -1 is the one right to the dot

// number: 273.15
// digits:  2  7  3  1  5
// pos:    +3 +2 +1 -1 -2

float
    digitOfFloat( float num, float pos, float base ) {
        
        return mod( floor( num * pow( base, -pos ) ), base );
    }

void
    mainImage( out vec4 o, vec2 p ) {

        p /= iResolution.xy;
        
        vec2
            pdb = p * vec2( DIGITS, float( BASES ) ),	
            db  = floor( pdb ),
            xy  = fract( pdb );
        
        xy.y *= 1.5;
                
        float
            b   = base( pdb.y ),
            d   = b - 1.,
            pos = FLOOR - 1. - db.x;
        
        vec2
            grd   = vec2( xy.x - .5 * WIDTH, fract( d * xy.y ) - .5 );
        
        float
            a = 8. * ( .125 - dot( grd, grd ) );
        
		o = 
            xy.x < WIDTH && d * xy.y < digitOfFloat( iGlobalTime, pos, b ) 
            	? pos < 1.
            		? pos < 0.
            			? vec4( a * vec3( 1, .75, .6 ), 1 )
            			: vec4( a * vec3( 1, 0,    0 ), 1 )
            		: vec4( a * vec3( .6, .75, 1 ), 1 ) 
            	: xy.y < 1.
                    ? vec4( a * vec3( .1, .05, .05 ), 1 )
                    : vec4( vec3( .075, .05, .05 ), 1 );
}
//_______________________________________________________________________________________________________





void main( void)
{
	mainImage(gl_FragColor, gl_FragCoord.xy);
}