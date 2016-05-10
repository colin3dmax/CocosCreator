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
// srtuss, 2014
// visuals shader was originally made to be played with dave's "tropical beeper" track.
// i slightly altered it to acompany my sound experiment here.

vec2 rotate(vec2 p, float a)
{
	return vec2(p.x * cos(a) - p.y * sin(a), p.x * sin(a) + p.y * cos(a));
}

float box(vec2 p, vec2 b)
{
	vec2 d = abs(p) - b;
	return min(max(d.x, d.y), 0.0) + length(max(d, 0.0));
}

float aav = 4.0 / iResolution.y;

void button(out vec4 bcol, inout vec3 acol, vec2 uv, float i1)
{
	float v; vec3 col;
	v = box(uv, vec2(0.1)) - 0.05;
	float l = length(uv);
	float shd = exp(-40.0 * max(v, 0.0));
	col = vec3(exp(l * -4.0) * 0.3 + 0.2);
	col *= 1.0 - vec3(exp(-100.0 * abs(v))) * 0.4;
	v = smoothstep(aav, 0.0, v);
	bcol = mix(vec4(0.0, 0.0, 0.0, shd * 0.5), vec4(col, 1.0), v);
	col = vec3(0.3, 1.0, 0.2) * exp(-30.0 * l * l) * 0.8 * i1;
	acol += col;
}

float f0(vec2 uv)
{
	float l = length(uv);
	return l - 0.2;
}

float f1(vec2 uv, float a)
{
	float l = length(uv);
	return l - 0.14 + sin((a + atan(uv.y, uv.x)) * 13.0) * 0.005;
}

float f2(vec2 uv, float a)
{
	uv = rotate(uv, a);
	float l = length(uv);
	float w = max(abs(uv.x + 0.12) - 0.03, abs(uv.y) - 0.01);
	return min(l - 0.1, w);
}

vec3 n0(vec2 p)
{
	vec2 h = vec2(0.01, 0.0);
	float m = -0.01;
	return normalize(vec3(max(f0(p + h.xy), m) - max(f0(p - h.xy), m), max(f0(p + h.yx), m) - max(f0(p - h.yx), m), 2.0 * h.x));
}

vec3 n1(vec2 p, float a)
{
	vec2 h = vec2(0.01, 0.0);
	return normalize(vec3(f1(p + h.xy, a) - f1(p - h.xy, a), f1(p + h.yx, a) - f1(p - h.yx, a), 2.0 * h.x));
}

vec3 n2(vec2 p, float a)
{
	vec2 h = vec2(0.005, 0.0);
	float m = -0.005;
	return normalize(vec3(max(f2(p + h.xy, a), m) - max(f2(p - h.xy, a), m), max(f2(p + h.yx, a), m) - max(f2(p - h.yx, a), m), 2.0 * h.x));
}

vec3 sun = normalize(vec3(-0.2, 0.5, 0.5));

void knob(inout vec3 bcol, inout vec3 acol, vec2 uv, float a)
{
	float v; vec3 col;
	float diff;
	float l = length(uv);
	bcol = mix(bcol, vec3(0.0), exp(max(l - 0.2, 0.0) * -20.0) * 0.5);
	v = f0(uv);
	v = smoothstep(aav, 0.0, v);
	diff = max(dot(mix(n0(uv), vec3(0.0, 0.0, 1.0), smoothstep(0.02, 0.0, l - 0.115)), sun), 0.0);
	col = vec3(diff) * 0.2;
	bcol = mix(bcol, col, v);
	bcol = mix(bcol, vec3(0.0), exp(max(l - 0.14, 0.0) * -40.0) * 0.5);
	v = f1(uv, a);//l - 0.14 + sin(atan(uv.y, uv.x) * 13.0) * 0.005;
	v = smoothstep(aav, 0.0, v);
	diff = max(dot(mix(n1(uv, a), vec3(0.0, 0.0, 1.0), smoothstep(0.02, 0.0, l - 0.115)), sun), 0.0);
	col = vec3(diff) * 0.2;//vec3(0.05);
	bcol = mix(bcol, col, v);
	v = f2(uv, a);
	v = smoothstep(aav, 0.0, v);
	diff = max(dot(mix(n2(uv, a), vec3(0.0, 0.0, 1.0), 0.0), sun), 0.0);
	col = vec3(diff) * 0.1 + 0.2;
	bcol = mix(bcol, col, v);//*/
}

float hash1(float x)
{
	return fract(sin(x * 11.1753) * 192652.37862);
}

float nse1(float x)
{
	float fl = floor(x);
	return mix(hash1(fl), hash1(fl + 1.0), smoothstep(0.0, 1.0, fract(x)));
}

float bf(float t)
{
	float v = 0.04;
	return exp(t * -30.0) + smoothstep(0.25 + v, 0.25 - v, abs(t * 2.0 - 1.0));
}

#define ITS 7

vec2 circuit(vec3 p)
{
	p = mod(p, 2.0) - 1.0;
	float w = 1e38;
	vec3 cut = vec3(1.0, 0.0, 0.0);
	vec3 e1 = vec3(-1.0);
	vec3 e2 = vec3(1.0);
	float rnd = 0.23;
	float pos, plane, cur;
	float fact = 0.9;
	float j = 0.0;
	for(int i = 0; i < ITS; i ++)
	{
		pos = mix(dot(e1, cut), dot(e2, cut), (rnd - 0.5) * fact + 0.5);
		plane = dot(p, cut) - pos;
		if(plane > 0.0)
		{
			e1 = mix(e1, vec3(pos), cut);
			rnd = fract(rnd * 19827.5719);
			cut = cut.yzx;
		}
		else
		{
			e2 = mix(e2, vec3(pos), cut);
			rnd = fract(rnd * 5827.5719);
			cut = cut.zxy;
		}
		j += step(rnd, 0.2);
		w = min(w, abs(plane));
	}
	return vec2(j / float(ITS - 1), w);
}

vec3 pixel(vec2 p, float time, float ct)
{	
	float te = ct * 9.0 / 16.0;//0.25 + (ct + 0.25) / 2.0 * 128.0 / 60.0;
	float ll = dot(p, p);
	p *= 1.0 - cos((te + 0.75) * 6.283185307179586476925286766559) * 0.01;
	vec2 pp = p;
	p = rotate(p, sin(time * 0.1) * 0.1 + nse1(time * 0.2) * 0.0);
	float r = 1.5;
	p = mod(p - r, r * 2.0) - r;
	p.x += 0.6;
	float i1 = bf(fract(0.75 + te));
	float i2 = bf(fract(0.5 + te));
	float i3 = bf(fract(0.25 + te));
	float i4 = bf(fract(0.0 + te));
	float s = time * 50.0;
	vec2 shk = (vec2(nse1(s), nse1(s + 11.0)) * 2.0 - 1.0) * exp(-5.0 * fract(te * 4.0)) * 0.1;
	pp += shk;
	p += shk;
	vec3 col = vec3(0.1);
	s = 0.2;
	float c = smoothstep(aav, 0.0, circuit(vec3(p, 0.1) * s).y / s - 0.001);
	col += vec3(c) * 0.05;
	vec4 bcol; vec3 acol = vec3(0.0);
	button(bcol, acol, p, i1);
	col = mix(col, bcol.xyz, bcol.w);
	button(bcol, acol, p - vec2(0.4, 0.0), i2);
	col = mix(col, bcol.xyz, bcol.w);
	button(bcol, acol, p - vec2(0.8, 0.0), i3);
	col = mix(col, bcol.xyz, bcol.w);
	button(bcol, acol, p - vec2(1.2, 0.0), i4);
	col = mix(col, bcol.xyz, bcol.w);
	knob(col, acol, p - vec2(1.2, -0.6), 1.9);
	knob(col, acol, p - vec2(0.4, 0.6), 0.2);
	knob(col, acol, p - vec2(0.7, -0.6), -0.5);
	vec2 q = p - vec2(0.9, 0.6);
	vec2 qq = q - vec2(0.35, 0.0);
	float v = box(qq, vec2(0.4, 0.2)) - 0.01;
	col = mix(col, vec3(0.2) * 0.8, smoothstep(aav, 0.0, v));
	col += vec3(1.0) * exp(max(v, 0.0) * -30.0) * 0.14;
	col -= vec3(1.0) * exp(dot(qq, qq) * -20.0) * 0.1;
	vec2 fr = mod(q, 0.03) - 0.015;
	vec2 id = floor(q / 0.03);
	v = box(fr, vec2(0.003)) - 0.003;
	float amp = 2.0;
	float inte = abs(id.y + sin(id.x * 0.6 + time * 4.0) * amp) - 0.8;
	acol += exp(max(v, 0.0) * -400.0) * smoothstep(0.5, 0.0, inte) * step(id.x, 21.0) * step(0.0, id.x);
	//0.018
	col += acol;
	col *= exp((length(pp) - 0.5) * -1.0) * 0.5 + 0.5;
	col = pow(col, vec3(1.2, 1.1, 1.0) * 2.0) * 4.0;
	col = pow(col, vec3(1.0 / 2.2));
	return col;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 uv = fragCoord.xy / iResolution.xy;
	uv = 2.0 * uv - 1.0;
	uv.x *= iResolution.x / iResolution.y;
	vec3 col = vec3(0.0);
	float j = 0.008;
	col  = pixel(uv, iGlobalTime, iGlobalTime);
	/*col += pixel(uv, iGlobalTime + j * 1.0, iGlobalTime);
	col += pixel(uv, iGlobalTime - j * 1.0, iGlobalTime);
	col /= 3.0;//*/
	fragColor = vec4(col, 1.0);
}

//_______________________________________________________________________________________________________



void main( void)
{
	mainImage(gl_FragColor, gl_FragCoord.xy);
}