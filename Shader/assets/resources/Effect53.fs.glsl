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
	vec2 uv = (2.*fragCoord.xy - iResolution.xy) / iResolution.y;

    vec3 color = vec3(.8-sqrt(uv.y),0.,0.);
    float size = (-uv.y+.1)/1.5;
	float time = iGlobalTime*.5;
    float r = 0.6;

    //floor
    if (uv.y < .0){
    color = vec3(0.,0.,0.);
    color += vec3(mod(floor(uv.x/size+sin(time)) + floor(uv.y*20./size+time),2.)-.9-uv.y);
    }

	// Shadow
    vec2 sphe = uv;
    sphe.y += (uv.y)+1.1;
    sphe.x += (uv.y-uv.x/16.)+1.1;
	float radius = r-.1;
    float shadow = step(length(sphe),radius);
    if (shadow > radius){
        float shadow = .5;//(length(sphe+(r/3.))*.7/r);
        color *= shadow;
    }
    
    //Sphere
    vec2 pos = vec2 (.3,.1);
	radius = 1.-step(length(vec2(pos.x+uv.x,pos.y+uv.y)),r);
    if (radius < r){
        color = vec3(0.,0.,0.);
    	float light = 1.6-length(vec2(pos.x+uv.x-.2,(pos.y+uv.y-.2)))/.5;
    	float highlight = .05/length(vec2(pos.x+uv.x+uv.y/6.,pos.y+uv.y)-.2)-.2;

        
    	color.r = step(length(vec2(pos.x+uv.x,pos.y+uv.y)),r)*light;
    	color.gb += vec2(step(length(vec2(pos.x+uv.x,pos.y+uv.y)),r)*highlight);


        // reflection
        if (uv.y < -cos(pos.x+.1+uv.x*1.4)/6.){
			vec2 uvrf = vec2(uv.x+pos.x,uv.y);
            size = -cos(tan(tan(uvrf.x)*1.5)/.7)/10.+sin(-.01+pos.y-radius+uvrf.y-3.12)-uvrf.y/6.;
	    	color += vec3(mod(floor(cos(uvrf.y-1.5)+uvrf.x/size+sin(time)) + floor(-uvrf.y*2.+uvrf.y*4./size+time+1.1),2.)-1.-uvrf.y);
    	    color.r += step(length(vec2(pos.x+uv.x,pos.y+uv.y)),r)*light*1.2;

        }

	// Shadow reflection
    vec2 sphe = uv*2.;
    sphe.y += (uv.y*2.)+2.7;
    sphe.x += (uv.y-uv.x)+1.1;
	float radius = r-.1;
    float shadow = step(length(sphe),radius);
    if (shadow > radius){
        float shadow = .8;//(length(sphe+(r/3.))*.7/r);
        color *= shadow;
    }
    } 


    
	fragColor = vec4(vec3(color.rgb),1);
}




//_______________________________________________________________________________________________________



void main( void)
{
	mainImage(gl_FragColor, gl_FragCoord.xy);
}