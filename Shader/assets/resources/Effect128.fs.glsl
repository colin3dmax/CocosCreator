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
#define TRACE_STEPS 20
#define TRACE_RAY

// 0 = Distance Field Display
// 1 = Raymarched Edges
// 2 = Resulting Solid
// 3 = Distance Field Polarity
#define DISPLAY 0

// 0 = Sine Wave
// 1 = Circle
// 2 = Offset Circle
// 3 = Circle Join
// 4 = Smooth Circle Join
#define SCENE 3

#if SCENE == 0
  #define SAMPLER(p) shape_sine(p)
#endif
#if SCENE == 1
  #define SAMPLER(p) shape_circle(p)
#endif
#if SCENE == 2
  #define SAMPLER(p) shape_circle(p + vec2(0.7, 0))
#endif
#if SCENE == 3
  #define SAMPLER(p) min(shape_circle(p - vec2(cos(iGlobalTime))), shape_circle(p + vec2(sin(iGlobalTime), 0)))
#endif
#if SCENE == 4
  #define SAMPLER(p) shape_circles_smin(p, iGlobalTime * 0.5)
#endif

float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

vec2 squareFrame(vec2 screenSize, vec2 coord) {
  vec2 position = 2.0 * (coord.xy / screenSize.xy) - 1.0;
  position.x *= screenSize.x / screenSize.y;
  return position;
}

const float PI = 3.14159265359;

float time = iGlobalTime;

vec3 palette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
  return a + b * cos(6.28318 * (c * t + d));
}

// r^2 = x^2 + y^2
// r = sqrt(x^2 + y^2)
// r = length([x y])
// 0 = length([x y]) - r
float shape_circle(vec2 p) {
  return length(p) - 0.5;
}

// y = sin(5x + t) / 5
// 0 = sin(5x + t) / 5 - y
float shape_sine(vec2 p) {
  return p.y - sin(p.x * 5.0 + time) * 0.2;
}

float shape_box2d(vec2 p, vec2 b) {
  vec2 d = abs(p) - b;
  return min(max(d.x, d.y), 0.0) + length(max(d, 0.0));
}

float shape_line(vec2 p, vec2 a, vec2 b) {
  vec2 dir = b - a;
  return abs(dot(normalize(vec2(dir.y, -dir.x)), a - p));
}

float shape_segment(vec2 p, vec2 a, vec2 b) {
  float d = shape_line(p, a, b);
  float d0 = dot(p - b, b - a);
  float d1 = dot(p - a, b - a);
  return d1 < 0.0 ? length(a - p) : d0 > 0.0 ? length(b - p) : d;
}

float shape_circles_smin(vec2 p, float t) {
  return smin(shape_circle(p - vec2(cos(t))), shape_circle(p + vec2(sin(t), 0)), 0.8);
}

vec3 draw_line(float d, float thickness) {
  const float aa = 3.0;
  return vec3(smoothstep(0.0, aa / iResolution.y, max(0.0, abs(d) - thickness)));
}

vec3 draw_line(float d) {
  return draw_line(d, 0.0025);
}

float draw_solid(float d) {
  return smoothstep(0.0, 3.0 / iResolution.y, max(0.0, d));
}

vec3 draw_polarity(float d, vec2 p) {
  p += iGlobalTime * -0.1 * sign(d) * vec2(0, 1);
  p = mod(p + 0.06125, 0.125) - 0.06125;
  float s = sign(d) * 0.5 + 0.5;
  float base = draw_solid(d);
  float neg = shape_box2d(p, vec2(0.045, 0.0085) * 0.5);
  float pos = shape_box2d(p, vec2(0.0085, 0.045) * 0.5);
  pos = min(pos, neg);
  float pol = mix(neg, pos, s);

  float amp = abs(base - draw_solid(pol)) - 0.9 * s;

  return vec3(1.0 - amp);
}

vec3 draw_distance(float d, vec2 p) {
  float t = clamp(d * 0.85, 0.0, 1.0);
  vec3 grad = mix(vec3(1, 0.8, 0.5), vec3(0.3, 0.8, 1), t);

  float d0 = abs(1.0 - draw_line(mod(d + 0.1, 0.2) - 0.1).x);
  float d1 = abs(1.0 - draw_line(mod(d + 0.025, 0.05) - 0.025).x);
  float d2 = abs(1.0 - draw_line(d).x);
  vec3 rim = vec3(max(d2 * 0.85, max(d0 * 0.25, d1 * 0.06125)));

  grad -= rim;
  grad -= mix(vec3(0.05, 0.35, 0.35), vec3(0.0), draw_solid(d));

  return grad;
}

vec3 draw_trace(float d, vec2 p, vec2 ro, vec2 rd) {
  vec3 col = vec3(0);
  vec3 line = vec3(1, 1, 1);
  vec2 _ro = ro;

  for (int i = 0; i < TRACE_STEPS; i++) {
    float t = SAMPLER(ro);
    col += 0.8 * line * (1.0 - draw_line(length(p.xy - ro) - abs(t), 0.));
    col += 0.2 * line * (1.0 - draw_solid(length(p.xy - ro) - abs(t) + 0.02));
    col += line * (1.0 - draw_solid(length(p.xy - ro) - 0.015));
    ro += rd * t;
    if (t < 0.01) break;
  }

  #ifdef TRACE_RAY
    col += 1.0 - line * draw_line(shape_segment(p, _ro, ro), 0.);
  #endif

  return col;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  float t = iGlobalTime * 0.5;
  vec2 uv = squareFrame(iResolution.xy, fragCoord);
  float d;
  vec3 col;
  vec2 ro = vec2(iMouse.xy / iResolution.xy) * 2.0 - 1.0;
  ro.x *= squareFrame(iResolution.xy, iResolution.xy).x;

  vec2 rd = normalize(-ro);

  d = SAMPLER(uv);

  #if DISPLAY == 0
    col = vec3(draw_distance(d, uv.xy));
    col -= (iMouse.z > 0.0 ? 1.0 : 0.0) * vec3(draw_trace(d, uv.xy, ro, rd));
  #endif
  #if DISPLAY == 1
    col += 1.0 - vec3(draw_line(d));
    col += (iMouse.z > 0.0 ? 1.0 : 0.0) * vec3(1, 0.25, 0) * vec3(draw_trace(d, uv.xy, ro, rd));
    col = 1. - col;
  #endif
  #if DISPLAY == 2
    col = vec3(draw_solid(d));
  #endif
  #if DISPLAY == 3
    col = vec3(draw_polarity(d, uv.xy));
  #endif

  fragColor.rgb = col;
  fragColor.a   = 1.0;
}

//_______________________________________________________________________________________________________





void main( void)
{
	mainImage(gl_FragColor, gl_FragCoord.xy);
}