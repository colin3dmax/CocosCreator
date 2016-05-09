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
const vec3 cLight 		= vec3( 1100.0,1100.0,1000.0 );
const vec4 cLightColour = vec4(1.0,1.0,1.0,1.0 ) ;
const float cScatter 	= 0.002;	// scatter prob
const float cAbsorb 	= 0.001;	// absorb prob
const float cG 			= -0.2;		// Heney-Greenstein "thick fog" phase fn param. sign forard/backward, mag particle size
const float cIntensity 	= 120.0;

const float cA 			= 0.0;
const float cB 			= 1.0;
const float cC 			= 0.0;

float sphere( vec3 spherepos, float r, vec3 raypos )
{
    return distance( spherepos, raypos ) - r;
}

float atten( float d, float A, float B, float C, float intensity )
{
    return intensity / ( A*d*d + B*d + C );
}


vec4 getlight( vec3 normal, vec3 position, vec3 lightpos, vec4 lightcolour  )
{
    vec3  tolight = lightpos - position;
    vec3 n = normalize( tolight );
    return max( dot( normal, n ), 0.0 ) * cLightColour  * atten( length( tolight ), cA, cB, cC, cIntensity ); //cIntensity /  length( tolight) ;//, tolight );
}


float sdf( vec3 raypos )
{ 
    vec3 rayposmod = mod( raypos,  vec3( 50.0,50.0,50.0 ));
    return max( sphere( vec3( 25.0,25.0, 25.0), 10.0, rayposmod ), sphere( vec3( 1000.0,1000.0,1000.0 ), 100.0, raypos )  );
}


vec3 grad( vec3 raypos, float delta )
{
    float dx =  sdf( raypos + vec3( delta, 0,0 ) ) - sdf( raypos - vec3( delta,0,0 ) );
    float dy =  sdf( raypos + vec3( 0, delta,0 ) ) - sdf( raypos - vec3( 0,delta,0 ) );
    float dz =  sdf( raypos + vec3( 0,0, delta ) ) - sdf( raypos - vec3( 0,0,delta ) );
    return vec3( -dx,-dy,-dz );
}

float hg( float costheta )
{
    const float g = cG; 
    float num =  1.0 - g*g ;
    float denom = 2.0 * pow( 1.0 + g*g - 2.0 * g * costheta, 3.0/2.0 );
    return cScatter * num / denom ;
}

float outsc( float d )
{
    const float ab = cAbsorb;
    const float sc = cScatter;
    const float ex = sc + ab;
    
    return exp(-ex*d );
}

vec4 inscray( vec3 ray, vec3 origin, float ep )
{
    vec3 p = origin;
    vec4 lighting = cLightColour  * atten( distance( origin, cLight  ), cA, cB, cC, cIntensity );
    for ( int i = 0; i < 100; i++ )
    {
        float dist =  distance( p , cLight ) ; 
        float step = sdf(p); 
   
        if ( step > dist )
        {
            return lighting;
        } 
        else if ( step  <  ep )
        {
           return vec4(0,0,0,0);
                 
        } 
        
        p += ray * step;
    } 
    
     return lighting;
}


vec4 march( vec3 ray, vec3 origin, float ep, vec3 axis  )
{
    vec3 p = origin;
    const float stepsize = 4.0;
    vec4 inscattered =vec4( 0,0,0,0 );
    for ( int i = 0; i < 256; i++ )
    {
        float d = length( p -origin );
        float step = min( sdf(p), stepsize );
        if ( step  <  ep || d > 1000.0 )
        {
            vec3 normal = normalize( grad( p, 0.1 ) );
            vec4 s = getlight( -normal, p,  cLight, vec4(1.0,1.0,1.0,1.0 )); 
            
            return s * vec4( 0.7,0.7,1.0,1.0) * outsc(d) + inscattered;
                 
        }
       
        vec3 isray = normalize ( cLight-p   );
        
       inscattered +=  inscray( isray, p, 1.0 ) * outsc(d) * hg( dot( -isray, normalize(ray) ) ) * step;
       
        
        p += ray * step;
    }
    
    return inscattered;
}

vec3 rotatevecY( vec3 vec, float angle )
{
    vec3 m0 = vec3( -cos( angle ), 0, sin( angle ));
    vec3 m1 = vec3( 0            , 1.0,   0      );
    vec3 m2 = vec3( sin( angle ), 0, cos( angle ) );
    
    return vec3(  dot( m0, vec ), dot( m1, vec ), dot( m2, vec )) ;
} 


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 uv = fragCoord.xy / iResolution.xy;
    
    float aspect = iResolution.y / iResolution.x;
    
    vec3 origin = vec3( 0.0, 0.0,  -250.0  );
    vec3 ray = vec3( uv.x - 0.5, (uv.y - 0.5) * aspect, 0.5 );
    float angle =  (iMouse.x / iResolution.x - 0.5 ) * 3.142 * 2.0;
    origin = rotatevecY( origin, iGlobalTime );
    ray = rotatevecY( ray, iGlobalTime );
	
   vec3  axis = rotatevecY( vec3(0,0,1),  angle );
    
	fragColor = march( ray, origin + vec3( 1000.0, 1000.0, 1000.0 ), 0.01, axis );
}

//_______________________________________________________________________________________________________





void main( void)
{
	mainImage(gl_FragColor, gl_FragCoord.xy);
}