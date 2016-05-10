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


#define ANTI_ALIAS

#define NUM_FACES 4
#define IN_RADIUS 0.25
#define OUT_RADIUS 0.70
#define SCROLL_SPEED -0.9

#define COLOR_1 0.50, 0.90, 0.95
#define COLOR_2 0.95, 0.60, 0.10

float tau = atan(1.0) * 8.0;
float pi = atan(1.0) * 4.0;
float aaSize = 2.0 / iResolution.y; //Scale anti aliasing with resolution

vec4 slice(float x0, float x1, vec2 uv)
{
    float u = (uv.x - x0)/(x1 - x0);
    float w = (x1 - x0);
    vec3 col = vec3(0);
    
    //Gradient
    col = mix(vec3(COLOR_1), vec3(COLOR_2), u);
    
    //Lighting 
    col *= w / sqrt(2.0 * IN_RADIUS*IN_RADIUS * (1.0 - cos(tau / float(NUM_FACES))));
    
    //Edges
    col *= smoothstep(0.05, 0.10, u) * smoothstep(0.95, 0.90, u) + 0.5;
    
    //Checker board
    uv.y += iGlobalTime * SCROLL_SPEED; //Scrolling
    
    #ifdef ANTI_ALIAS
    	col *= (-1.0 + 2.0 * smoothstep(-0.03, 0.03, sin(u*pi*4.0) * cos(uv.y*16.0))) * (1.0/16.0) + 0.7;
    #else
    	col *= sign(sin(u * pi * 4.0) * cos(uv.y * 16.0)) * (1.0/16.0) + 0.7;
    #endif
    
    float clip = 0.0;
    
    #ifdef ANTI_ALIAS
    	clip = (1.0-smoothstep(0.5 - aaSize/w, 0.5 + aaSize/w, abs(u - 0.5))) * step(x0, x1);
    #else
    	clip = float((u >= 0.0 && u <= 1.0) && (x0 < x1));
    #endif
    
    return vec4(col, clip);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 res = iResolution.xy / iResolution.y;
	vec2 uv = fragCoord.xy / iResolution.y;
    uv -= res / 2.0;
    uv *= 2.0;
    
    //Polar coordinates
    vec2 uvr = vec2(length(uv), atan(uv.y, uv.x) + pi);
    uvr.x -= OUT_RADIUS;
    
    vec3 col = vec3(0.05);
    
    //Twisting angle
    float angle = uvr.y + 2.0*iGlobalTime + sin(uvr.y) * sin(iGlobalTime) * pi;
    
    for(int i = 0;i < NUM_FACES;i++)
    {
        float x0 = IN_RADIUS * sin(angle + tau * (float(i) / float(NUM_FACES)));
        float x1 = IN_RADIUS * sin(angle + tau * (float(i + 1) / float(NUM_FACES)));
        
        vec4 face = slice(x0, x1, uvr);
        
        col = mix(col, face.rgb, face.a); 
    }
    
    //col = (abs(uv.x) > 1.0) ? vec3(1) : col;
    
	fragColor = vec4(col, 1.0);
}
//_______________________________________________________________________________________________________





void main( void)
{
	mainImage(gl_FragColor, gl_FragCoord.xy);
}