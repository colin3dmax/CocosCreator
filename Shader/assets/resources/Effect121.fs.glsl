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

// linear white point
const float W = 11.2;

// exposure bias for tonemapping
const float exp_bias = 1.6;

// Toed Reinhard

// T = 0: no toe, pure Reinhard
const float T = 0.15;

float toed_reinhard_curve (float x) {
    float c = pow(x, 1.0+T);
	return c / (1.0 + c);
}

vec3 toed_reinhard(vec3 x) {
    float w = toed_reinhard_curve(W);
    return vec3(
        toed_reinhard_curve(x.r),
        toed_reinhard_curve(x.g),
        toed_reinhard_curve(x.b)) / w;
}

// Filmic Reinhard

const float T2 = 0.1;

float filmic_reinhard_curve (float x) {
    float q = (T2*T2 + 1.0)*x*x;    
	return q / (q + x + T2*T2);
}

vec3 filmic_reinhard(vec3 x) {
    float w = filmic_reinhard_curve(W);
    return vec3(
        filmic_reinhard_curve(x.r),
        filmic_reinhard_curve(x.g),
        filmic_reinhard_curve(x.b)) / w;
}

// filmic (John Hable)

// shoulder strength
const float A = 0.22;
// linear strength
const float B = 0.3;
// linear angle
const float C = 0.1;
// toe strength
const float D = 0.20;
// toe numerator
const float E = 0.01;
// toe denominator
const float F = 0.30;
float filmic_curve(float x) {
	return ((x*(A*x+C*B)+D*E)/(x*(A*x+B)+D*F))-E/F;
}

float inverse_filmic_curve(float x) {
    float q = B*(F*(C-x) - E);
    float d = A*(F*(x - 1.0) + E);
    return (q -sqrt(q*q - 4.0*D*F*F*x*d)) / (2.0*d);
}
vec3 filmic(vec3 x) {
    float w = filmic_curve(W);
    return vec3(
        filmic_curve(x.r),
        filmic_curve(x.g),
        filmic_curve(x.b)) / w;
}
vec3 inverse_filmic(vec3 x) {
    x *= filmic_curve(W);
    return vec3(
        inverse_filmic_curve(x.r),
        inverse_filmic_curve(x.g),
        inverse_filmic_curve(x.b));
}

//---------------------------------------------------------------------------------

float linear_srgb(float x) {
    return mix(1.055*pow(x, 1./2.4) - 0.055, 12.92*x, step(x,0.0031308));
}
vec3 linear_srgb(vec3 x) {
    return mix(1.055*pow(x, vec3(1./2.4)) - 0.055, 12.92*x, step(x,vec3(0.0031308)));
}

float srgb_linear(float x) {
    return mix(pow((x + 0.055)/1.055,2.4), x / 12.92, step(x,0.04045));
}
vec3 srgb_linear(vec3 x) {
    return mix(pow((x + 0.055)/1.055,vec3(2.4)), x / 12.92, step(x,vec3(0.04045)));
}

//---------------------------------------------------------------------------------

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 uv = fragCoord.xy / iResolution.xy;

    // exposure goes from -8 to +8
    float S = 8.0;
    // exposure gradient over picture
    float exposure = exp2((uv.y - 0.5)*2.0*S);
    
    vec3 color;
    color = texture2D(iChannel0, 
		uv*3.0 - iGlobalTime * 0.1).rgb;
    color = srgb_linear(color);
    // add small bias to erase fringes
    color += 0.001;
    color *= exposure;
    if (uv.x > 0.66667) {
        //color *= exp_bias;
        color = filmic_reinhard(color);
    } else if (uv.x < 0.33333) {
        color *= exp_bias;
        color = filmic(color);
    }
    // sRGB mixdown    
    color = clamp(linear_srgb(color), 0.0, 1.0);
    color *= min(1.0, abs((uv.x+0.33333*0.5)- 0.5)*400.0);
    color *= min(1.0, abs((uv.x-0.33333*0.5)- 0.5)*400.0);
    
	fragColor = vec4(color,1.0);
}
//_______________________________________________________________________________________________________





void main( void)
{
	mainImage(gl_FragColor, gl_FragCoord.xy);
}