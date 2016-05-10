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

float r(vec2 _uv, float _t)
{
    return min(.30/length(_uv), mod(_t*length(_uv)*.001+.4*sin(_uv.x*8.)*cos(_uv.y*8.),.5)* abs(sin(_t-length(_uv))*5. ) );    
}

float rb(vec2 _uv, float _t)
{
    float v = .0;
    
    if (mod(_uv.y+_uv.x+_t*.1,.1) > abs(sin(_uv.x/_uv.y)*.05))
    for(float f = 1.; f > .0; f -= .05)
    {
        v += r(_uv*f,_t)*.05;
    }
    
    return v;
}


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	//vec2 uv = fragCoord.xy / iResolution.xy;
    vec2 uv = (fragCoord.xy - iResolution.xy * .5) / iResolution.y; 
    
    float c = 1.;
    float t = iGlobalTime + .64;
    
    c = r(uv,t);
   
    if (c > mod(-t*.1 + tan(t*.1+uv.y*.5/uv.x*.2),.2)*2. )
    	c -= .5*rb(uv,t);     
    
	fragColor = vec4(c,c*.9,c-uv.x,1.);
}
//_______________________________________________________________________________________________________



void main( void)
{
	mainImage(gl_FragColor, gl_FragCoord.xy);
}