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

vec3 Strand(in vec2 fragCoord, in vec3 color, in float hoffset, in float hscale, in float vscale, in float timescale)
{
    float glow = 0.06 * iResolution.y;
    float twopi = 6.28318530718;
    float curve = 1.0 - abs(fragCoord.y - (sin(mod(fragCoord.x * hscale / 100.0 / iResolution.x * 1000.0 + iGlobalTime * timescale + hoffset, twopi)) * iResolution.y * 0.25 * vscale + iResolution.y / 2.0));
    float i = clamp(curve, 0.0, 1.0);
    i += clamp((glow + curve) / glow, 0.0, 1.0) * 0.4 ;
    return i * color;
}

vec3 Muzzle(in vec2 fragCoord, in float timescale)
{
    float theta = atan(iResolution.y / 2.0 - fragCoord.y, iResolution.x - fragCoord.x + 0.13 * iResolution.x);
	float len = iResolution.y * (10.0 + sin(theta * 20.0 + float(int(iGlobalTime * 20.0)) * -35.0)) / 11.0;
    float d = max(-0.6, 1.0 - (sqrt(pow(abs(iResolution.x - fragCoord.x), 2.0) + pow(abs(iResolution.y / 2.0 - ((fragCoord.y - iResolution.y / 2.0) * 4.0 + iResolution.y / 2.0)), 2.0)) / len));
    return vec3(d * (1.0 + sin(theta * 10.0 + floor(iGlobalTime * 20.0) * 10.77) * 0.5), d * (1.0 + -cos(theta * 8.0 - floor(iGlobalTime * 20.0) * 8.77) * 0.5), d * (1.0 + -sin(theta * 6.0 - floor(iGlobalTime * 20.0) * 134.77) * 0.5));
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    float timescale = 4.0;
	vec3 c = vec3(0, 0, 0);
    c += Strand(fragCoord, vec3(1.0, 0, 0), 0.7934 + 1.0 + sin(iGlobalTime) * 30.0, 1.0, 0.16, 10.0 * timescale);
    c += Strand(fragCoord, vec3(0.0, 1.0, 0.0), 0.645 + 1.0 + sin(iGlobalTime) * 30.0, 1.5, 0.2, 10.3 * timescale);
    c += Strand(fragCoord, vec3(0.0, 0.0, 1.0), 0.735 + 1.0 + sin(iGlobalTime) * 30.0, 1.3, 0.19, 8.0 * timescale);
    c += Strand(fragCoord, vec3(1.0, 1.0, 0.0), 0.9245 + 1.0 + sin(iGlobalTime) * 30.0, 1.6, 0.14, 12.0 * timescale);
    c += Strand(fragCoord, vec3(0.0, 1.0, 1.0), 0.7234 + 1.0 + sin(iGlobalTime) * 30.0, 1.9, 0.23, 14.0 * timescale);
    c += Strand(fragCoord, vec3(1.0, 0.0, 1.0), 0.84525 + 1.0 + sin(iGlobalTime) * 30.0, 1.2, 0.18, 9.0 * timescale);
    c += clamp(Muzzle(fragCoord, timescale), 0.0, 1.0);
	fragColor = vec4(c.r, c.g, c.b, 1.0);
}


//_______________________________________________________________________________________________________



void main( void)
{
	mainImage(gl_FragColor, gl_FragCoord.xy);
}