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
	vec2 p = (fragCoord.xy-iResolution.xy*.5) / iResolution.y;
    
    float t = (iGlobalTime+1.3)*2.;
    float c = .0, d = .0, s = .0;
    
    for(float f = -5.; f < 1.; f += .6)
    {
        s = 20.;
        
        if (p.x > .0)
        	s = 20. + sin(  tan( (p.x+p.y)/(p.x/p.y))*10.  )*2.;
        	//s = 20. + sin(f+ sin(p.x/p.y)*5. )*10.;
        
        d = distance(
              vec3( tan(p.x*s+t), tan(p.y*s+t), f ),
              vec3( p.x*20., .0, -5. )
            );
        
    	c += d * sin(t + .5/p.x + cos(p.y)*5. ) * .01;
    }
    
	fragColor = vec4(.5-c, .6-c*.25,1.-c*.5, 1.);//vec4(1.-c);
}
//_______________________________________________________________________________________________________



void main( void)
{
	mainImage(gl_FragColor, gl_FragCoord.xy);
}