precision mediump float;

#if defined(ORIGO_GLSL_VERTEX_SHADER)

attribute vec4 position;
attribute vec2 uv0;

uniform float pixelWidth;
uniform float pixelHeight;

uniform vec4 noiseUVMulAdd;

#endif

varying vec2 v_uv0;
varying vec2 v_uv1;
varying vec2 v_uv2;
varying vec2 v_uv3;
varying vec2 v_uv4;

#if defined(ORIGO_GLSL_FRAGMENT_SHADER)

uniform vec4 noiseMulAdd;
uniform float brightness;
//uniform float gamma;
uniform lowp float alphaBias;

uniform sampler2D texture0;
uniform sampler2D texture1;
uniform sampler2D texture2;

#if ORIGO_GL_EXT_shader_framebuffer_fetch
// lowp vec4 gl_LastFragData[1]; // redeclaration to specify correct precision // TODO:ANDROID this is a quick fix for a compiler error in Android TV (PowerVR Rogue G6430, OpenGL ES 3.1 build 1.4@3064661). Redeclaration IS explicitly allowed: https://www.khronos.org/registry/gles/extensions/EXT/EXT_shader_framebuffer_fetch.txt
#elif ORIGO_GL_NV_shader_framebuffer_fetch
// lowp vec4 gl_LastFragData[1]; // TODO:ANDROID gives error. Check if necessary.
#endif

#endif

// --- BlitVS
#if defined(BlitVS)
void BlitVS(void) {
	// output normalized device coords
	gl_Position = position;

	// output texcoords
	v_uv0 = uv0;
}
#endif

// --- BlitPS
#if defined(BlitPS)
void BlitPS(void) {
	gl_FragColor = texture2D(texture0, v_uv0);
}
#endif

// --- BlitComposeVS
#if defined(BlitComposeVS)
void BlitComposeVS(void) {
	vec2 offset = vec2(pixelWidth, pixelHeight);

	// output normalized device coords
	gl_Position = position;

	// output texcoords
	v_uv0 = uv0;
	v_uv1 = uv0 + offset*vec2(-0.5, -0.5);
	v_uv2 = uv0 + offset*vec2(0.5, -0.5);
	v_uv3 = uv0 + offset*vec2(-0.5, 0.5);
	v_uv4 = uv0 + offset*vec2(0.5, 0.5);
}
#endif

// --- BlitComposePS
#if defined(BlitComposePS)
void BlitComposePS(void) {
	lowp vec4 color0 = vec4(0.0);

	color0 += texture2D(texture0, v_uv1) * 0.25;
	color0 += texture2D(texture0, v_uv2) * 0.25;
	color0 += texture2D(texture0, v_uv3) * 0.25;
	color0 += texture2D(texture0, v_uv4) * 0.25;

	lowp vec4 color1 = texture2D(texture1, v_uv0);
	lowp float alpha = texture2D(texture2, v_uv0).a;

	// mix using mask
	gl_FragColor = color0 + alpha * (color1 - color0);
}
#endif

// --- BlitComposeBiasedPS
#if defined(BlitComposeBiasedPS)
void BlitComposeBiasedPS(void) {
	lowp vec4 color0 = vec4(0.0);

	color0 += texture2D(texture0, v_uv1) * 0.25;
	color0 += texture2D(texture0, v_uv2) * 0.25;
	color0 += texture2D(texture0, v_uv3) * 0.25;
	color0 += texture2D(texture0, v_uv4) * 0.25;

	lowp vec4 color1 = texture2D(texture1, v_uv0);
	lowp float alpha = texture2D(texture2, v_uv0).a;

	// mix using mask
	gl_FragColor = color0 + max(alpha, alphaBias) * (color1 - color0);
}
#endif

// --- BlitExpandRedVS
#if defined(BlitExpandRedVS)
void BlitExpandRedVS(void) {
	// output normalized device coords
	gl_Position = position;

	// output texcoords
	v_uv0 = uv0;

	// output secondary texcoords
	v_uv1 = uv0*noiseUVMulAdd.xy + noiseUVMulAdd.zw;
}
#endif

// --- BlitExpandRedPS
#if defined(BlitExpandRedPS)
void BlitExpandRedPS(void) {
#if ORIGO_GL_EXT_shader_framebuffer_fetch || ORIGO_GL_NV_shader_framebuffer_fetch
	lowp vec2 color = gl_LastFragData[0].rg;
#else
	lowp vec2 color = texture2D(texture0, v_uv0).rg;
#endif
	lowp float bloom = texture2D(texture1, v_uv0).g;
	lowp float noise = texture2D(texture2, v_uv1).r*2.0 - 1.0;
	//lowp vec2 noise = texture2D(texture2, v_uv1).r*vec2(0.10, 0.02) + vec2(0.95, -0.01);// uncomment to save a cycle :)

	// merge green into red, to add the bloom effect
	color.r += color.g + bloom;

	/*
	// apply gamma
	// f(x) = x - 0.5*gamma*(1-x)^3 * (x + 2*x - x^3)
	float r = clamp(color.r, 0.0, 1.0);
	float s = 1.0-r;
	color.r = r - 0.5*gamma*s*s*s*(r + 2.0*r + r*r*r);
	//color.r = color.r*1.21 - 0.21;// <- linear approx. for gamma 0.3
	*/
	
	// apply brightness
	color.r += brightness;

	// apply noise
	color.r += noise*(color.r*noiseMulAdd.x + noiseMulAdd.y);
	//color.r = color.r*noise.x + noise.y;// uncomment to save a cycle :)

	// expand red
	gl_FragColor = color.rrrr;

	//// expand red with offset in green and blue, to reduce banding
	//gl_FragColor = color.rrrr + lowp vec4(0.0, 0.0013, 0.0026, 1.0);
}
#endif
