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
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 uv = fragCoord.xy / iResolution.y;
    
    // animation
    vec2 sunVec;
    if (iMouse.x<20.0)
    {
     	   sunVec = vec2((0.8+0.5 * sin(iGlobalTime)),( 0.44 + 0.4 * cos( 2.0 * iGlobalTime)));
    }else{
    	sunVec = iMouse.xy/iResolution.y;
    }
     	
   
    //Mie mask
    float sun = max(1.0 - (1.0 + 10.0 * sunVec.y + 1.0 * uv.y) * length(uv - sunVec),0.0)
        + 0.3 * pow(1.0-uv.y,12.0) * (1.6-sunVec.y);
	
    //the sauce
    fragColor = vec4(mix(vec3(0.3984,0.5117,0.7305), vec3(0.7031,0.4687,0.1055), sun)
              * ((0.5 + 1.0 * pow(sunVec.y,0.4)) * (1.5-uv.y) + pow(sun, 5.2)
              * sunVec.y * (5.0 + 15.0 * sunVec.y)),1.0);
    
    //fragColor = vec4(sun);
   
}

//_______________________________________________________________________________________________________



void main( void)
{
	mainImage(gl_FragColor, gl_FragCoord.xy);
}