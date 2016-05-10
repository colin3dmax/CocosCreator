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
#define NUM_CELLS	8
#define SS			2

float tex( vec2 uv )
{
	return texture2D( iChannel0, uv ).r;
}

vec2 norm( vec2 uv )
{
    vec2 n = vec2( 0.0 );
    vec2 ir = 1.0 / iResolution.xy;
    vec2 eps = vec2( ir.x, 0.0 );    
  
    for ( int i = 0; i < SS; ++i )
    for ( int j = 0; j < SS; ++j )
    {
        vec2 o = ir * vec2( float( i ), float( j ) ) / float( SS );
        n += vec2(
            tex( uv - eps.xy + o ) - tex( uv + eps.xy + o ),
            tex( uv - eps.yx + o ) - tex( uv + eps.yx + o )
        );
    }
    
    return n / float( SS * SS );
}

float light( vec2 uv, vec2 lp )
{
    return 1.0 - pow( clamp( dot( norm( uv ), normalize( lp - uv ) ), 0.0, 1.0 ), 0.2 );
}

vec3 render( vec2 uv )
{
    float aspect = iResolution.x / iResolution.y;
    const float nc = float( NUM_CELLS );
    
    float d = 1.0 / nc;
    float t = iGlobalTime * 0.01;
    vec2 offset = iGlobalTime * 0.1 * vec2( 0.1, 0.13 ) + vec2( cos( t ), sin( t ) );
    vec2 p = mod( offset + vec2( uv.x * aspect, uv.y ), d ) / d;

    float lt = 1.0 * iGlobalTime * 0.5;
    vec2 lp = vec2( 0.5 * aspect*(0.5+0.5*cos( 0.5*lt )), 0.5+0.4*sin( lt ) );
    
    float s = pow( mix(	2.0, 2.4, smoothstep( 0.5, 0.0, length( uv - lp ) ) ), 2.0 );
    vec3 c = s * vec3( 0.6, 0.3, 0.25 );
    c *= 0.8;
    
    vec2 cell_dims = vec2( 1.0 / nc, 1.0 / nc );
    vec2 mod_offset = mod( offset, cell_dims );
    vec2 grid = vec2(
        floor( ( aspect * uv.x + mod_offset.x ) * nc ) / nc,
        floor( ( uv.y + mod_offset.y ) * float( NUM_CELLS ) ) / float( NUM_CELLS )
    );

    float dim = smoothstep( 0.0, cell_dims.x, mod_offset.x );
    float id = 10.0 * fract( 98743.32 * ( 0.5 + 0.5 * sin( dot( grid, vec2( 12.0, 987654.0 ) ) ) ) );
    vec3 clr = vec3( 1.0 );
    clr.r = clamp( uv.x * aspect, 0.0, 1.0 );
    float f = mix( 16.0, 0.1, ( 0.5 + 0.5 * sin( 3.14159 * dim ) ) * mod( id, 10.0 ) / 10.0 );
    clr *= c * sqrt( f * p.x * ( 1.0 - p.x ) * p.y * ( 1.0 - p.y ) );
    const float light_t = 0.015 * 2.5;
    vec2 offset_2 = vec2( offset.x / aspect, offset.y );
    float lv = light( uv + offset_2, lp + offset_2 );
    clr = ( 1.0 - light_t ) * clr + light_t * lv * clr;
    clr *= sqrt( 16.0 * uv.y * ( 1.0 - uv.y ) * uv.x * ( 1.0 - uv.x ) );
    clr += ( 12.0 / 255.0 ) * fract( 23423.0 * sin( iGlobalTime + uv.x * 952.2 + uv.y * 38.63 ) );
    clr *= 1.0 + 0.2 * dim;

    return clr;
}

void mainImage( out vec4 fc, in vec2 coord )
{
	vec2 uv = coord.xy / iResolution.xy;
    fc = vec4( render( uv ), 1.0 );
}

//_______________________________________________________________________________________________________





void main( void)
{
	mainImage(gl_FragColor, gl_FragCoord.xy);
}