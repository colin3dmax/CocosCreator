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
/*

"Electric Whiskers"
by Dean Alex 2016, dean[at]neuroid co uk

Messing around with (unclamped) sphere normal vectors.

edit. changed the sqrt.

*/


float sq( in float f ){
    return sqrt( abs( f )) * sign(f);
}
vec3 sq3( in vec3 v ){
    return vec3(
        sq(v.x),
        sq(v.y),
        sq(v.z)
    );
}
         
vec3 sh( in vec3 pos, in vec2 uv )
{
    vec2 xy = (uv.xy - pos.xy) / pos.z;
    float len = dot(xy,xy);
    return vec3( xy, sq( 1.0 - len ));
}
float tsin( in float mf ){
    return sin( iGlobalTime * mf);
}
float tcos( in float mf ){
    return cos( iGlobalTime * mf);
}


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    
    vec3 norm;
    float w = iResolution.x;
    float h = iResolution.y;
    float m = min(w,h);
    
    vec3 s1 = sh(
        vec3( w * 0.5, h * 0.5, m * 0.5 ),
        vec2( fragCoord.x, fragCoord.y )
    );
    vec3 s2 = sh(
        vec3( (tsin(1.7)*0.4 + 0.5)*w, (tcos(1.3)*0.4 + 0.5)*h, m * 0.1 ),
        vec2( fragCoord.x, fragCoord.y )
    );
    vec3 s3 = sh(
        vec3( (tsin(0.5)*0.3 + 0.5)*w, (tcos(-2.0)*0.4 + 0.5)*h, m * 0.5 ),
        vec2( fragCoord.x, fragCoord.y )
    );
    vec3 s4 = sh(
        vec3( (tcos(-0.31)*0.6 + 0.5)*w, (tsin(-0.4)*0.2 + 0.5)*h, m * 3.3 ),
        vec2( fragCoord.x, fragCoord.y )
    );
    
    //
    norm = sq3( cross( s2.yzx, s1.zxy ));
    norm = sq3( cross( norm, s3.zxy ));
    norm = sq3( cross( -norm, s4.xyz ));
    
    
    //
    
    float mag = length( norm );
    float a = pow( smoothstep( 1.0, 5.0, mag ), 0.5 );
    float s = atan( norm.z, norm.x ) / 6.283185307179586;
    float t = asin( norm.y ) / 3.14159265358979;
    fragColor = texture2D( iChannel0, vec2( s*5.1 + iGlobalTime*0.2, t * s ));
    fragColor.g = min( fragColor.g, fragColor.b );
    vec3 lightDir = normalize( vec3( tcos(1.5) * -1.6, -0.3, tsin(1.5) * 5.0 ));
    float mflight = max(dot( norm, lightDir), 0.0);
    float dis1 = 1.0 - length( norm - lightDir ) / 2.0;
    mflight += pow( dis1, 10.0) * 2.5;
    fragColor.rgb *= mflight;
    vec3 l1p = vec3( tsin(1.7) * 0.6, tcos(2.5) * 0.5, -tsin(0.5) * 0.6 );
    vec3 l1c = vec3( 1.0, 2.0, 3.0 );
    float dis = 1.0 - length( norm - l1p ) / 2.0;
    fragColor.rgb += l1c * pow( dis, 0.8 );
    fragColor = mix( fragColor, vec4(1.0,0.0,0.0,1.0), a );
}


//_______________________________________________________________________________________________________





void main( void)
{
	mainImage(gl_FragColor, gl_FragCoord.xy);
}