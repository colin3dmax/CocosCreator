precision highp float;

#if defined(ORIGO_GLSL_VERTEX_SHADER)

attribute vec4 position;
attribute vec4 color0;
attribute vec4 color1;
attribute vec2 uv0;

uniform mat4 ViewProjMatrix;
uniform mat4 WorldMatrix;
uniform float CameraZPos;
uniform float fFocusFactor;
uniform float fFocusRatio;
uniform float fFogDensity;
uniform float fFogFalloff;
uniform float fFogTone; // GLES only

#endif

varying lowp vec4 v_mul;	// x:intensity mul, y:bloom mul, z:-, w:alpha mul
varying lowp vec4 v_add;	// x:intensity add, y:bloom add, z:lod, w:-
varying vec2 v_uv;			// xy:texcoords

const float packFactor = 2.0 / 5.0; // packs [0:5] into [0:2] for lowp
const float unpackFactor = 1.0 / packFactor;

#if defined(ORIGO_GLSL_FRAGMENT_SHADER)

uniform vec4 viewport;
uniform float fLodBias; // GLES only

uniform sampler2D texture0;
uniform sampler2D texture1;
uniform sampler2D texture2;

#endif

// --- RenderObjectVS
#if defined(RenderObjectVS)
void RenderObjectVS(void) {
	// color0 == (intensity, intensity, intensity, alpha)
	// color1 == (brightness, fog, blur, bloom)

	// output clip space position
	gl_Position = ViewProjMatrix * position;

	// compute fog (fog is 0 at z=0)
	float fog = pow(max(0.0, position.z) * fFogDensity, fFogFalloff) * color1.y;// color1.y holds the fog flag (0 or 1)
	fog = 1.0 - (1.0/exp(fog));

	// compute blur (focus depth is z=0)
	float blur_factor = 4.0*color1.z;// color1.z holds the blur factor (0.25 maps to one)
	float dist_factor = abs((position.z - CameraZPos + blur_factor - 1.0) / CameraZPos);// dist_factor examples: 1.0=the exact focus depth, 2.0=twice the focus depth, 0.5=half the focus depth
	float d = log2(dist_factor) * blur_factor;
	float blur = sqrt(abs(d)) * fFocusFactor * ((d < 0.0) ? fFocusRatio : 1.0);

	// compute brightness multiplier and bias
	float brightness = 2.0*color1.x;
	float median = brightness-1.0;
	vec2 mulAdd = (median >= 0.0) ? vec2(2.0-brightness, median) : vec2(brightness, 0.0);

	// output texel transform
	float oneMinusFog = 1.0-fog;
	v_mul.rg = vec2(color0.r, color1.w) * (mulAdd.x*oneMinusFog);
	v_mul.a = color0.a;
	v_add.rg = vec2(1.0, color1.w) * (mulAdd.y*oneMinusFog + fog*fFogTone);
	v_add.b = packFactor*clamp(blur, 0.0, 5.0);
	v_add.a = 0.0;

	// output texcoords
	v_uv = uv0;
}
#endif

// --- RenderObjectPS
#if defined(RenderObjectPS)
void RenderObjectPS(void) {
	float bias = v_add.z;

	// fetch intensity, alpha
	lowp vec4 ia = texture2D(texture0, v_uv, unpackFactor*bias + fLodBias);

	// apply brightness, fog and bloom
	ia = ia*v_mul + v_add;

	// output (intensity, intensity*bloom, 0, alpha)
	gl_FragColor = ia;
}
#endif

// --- RenderObjectNoBiasPS
#if defined(RenderObjectNoBiasPS)
void RenderObjectNoBiasPS(void) {
	// fetch intensity, alpha
	lowp vec4 ia = texture2D(texture0, v_uv);

	// apply brightness, fog and bloom
	ia = ia*v_mul + v_add;

	// output (intensity, intensity*bloom, 0, alpha)
	gl_FragColor = ia;
}
#endif

// --- RenderObjectFixedBiasPS
#if defined(RenderObjectFixedBiasPS)
void RenderObjectFixedBiasPS(void) {
	// fetch intensity, alpha
	lowp vec4 ia = texture2D(texture0, v_uv, fLodBias);

	// apply brightness, fog and bloom
	ia = ia*v_mul + v_add;

	// output (intensity, intensity*bloom, 0, alpha)
	gl_FragColor = ia;
}
#endif

// --- RenderObjectEffectPS
#if defined(RenderObjectEffectPS)
void RenderObjectEffectPS(void) {
	float bias = v_add.z;

	// fetch intensity, alpha
	lowp vec4 ia = texture2D(texture0, v_uv, unpackFactor*bias + fLodBias);

	// apply brightness, fog and bloom
	ia = ia*v_mul + v_add;

	// apply effect
	ia.rg *= texture2D(texture1, gl_FragCoord.xy * viewport.xy).r;

	// output (intensity, intensity*bloom, 0, alpha)
	gl_FragColor = ia;
}
#endif

// --- RenderObjectSolidVS
#if defined(RenderObjectSolidVS)
void RenderObjectSolidVS(void) {
	// color0 == (intensity, intensity, intensity, alpha)
	// color1 == (brightness, fog, blur, bloom)

	// output clip space position
	gl_Position = ViewProjMatrix * position;

	// compute fog (fog is 0 at z=0)
	float fog = pow(max(0.0, position.z) * fFogDensity, fFogFalloff) * color1.y;// color1.y holds the fog flag (0 or 1)
	fog = 1.0 - (1.0/exp(fog));

	// compute brightness multiplier and bias
	float brightness = 2.0*color1.x;
	float median = brightness-1.0;
	vec2 mulAdd = (median >= 0.0) ? vec2(2.0-brightness, median) : vec2(brightness, 0.0);

	// output texel transform
	float oneMinusFog = 1.0-fog;
	v_mul.a = color0.a;
	v_add.rg = vec2(1.0, color1.w) * (mulAdd.y*oneMinusFog + fog*fFogTone);
	v_add.a = 0.0;
}
#endif

// --- RenderObjectSolidPS
#if defined(RenderObjectSolidPS)
void RenderObjectSolidPS(void) {
	gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0)*v_mul + v_add;
}
#endif

// --- RefractionVS
#if defined(RefractionVS)
void RefractionVS(void) {
	// output clip space position
	gl_Position = ViewProjMatrix * position;

	// output texel transform
	v_mul.xy = color0.xw;

	// output texcoords
	v_uv = uv0;
}
#endif

// --- RefractionPS
#if defined(RefractionPS)
void RefractionPS(void) {
	lowp vec4 texel = texture2D(texture0, v_uv);

	mediump vec2 normal = (texel.zw*2.0 - 1.0) * v_mul.y;
	mediump vec2 uvViewport = gl_FragCoord.xy + normal * 100.0;
	mediump vec2 uvTexture = uvViewport * viewport.xy;

	gl_FragColor = texture2D(texture1, uvTexture) * v_mul.x + vec4(0.0, 0.0, 0.0, 1.0);
	gl_FragColor.a = min(1.0, gl_FragColor.a);
}
#endif
