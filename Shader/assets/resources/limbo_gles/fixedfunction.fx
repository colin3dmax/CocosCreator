precision mediump float;

#if defined(ORIGO_GLSL_VERTEX_SHADER)

attribute vec4 position;
attribute vec3 normal;
attribute vec4 color0;
attribute vec4 color1;
attribute vec2 uv0;
attribute vec2 uv1;

uniform mat4 ViewProjMatrix;
uniform mat4 WorldMatrix;
uniform float CameraZPos;
uniform float fFocusFactor;
uniform float fFocusRatio;
uniform float bias;
uniform vec4 viewport;
uniform bool doBlur;

#endif

varying lowp vec4 v_diffuse;	// xy:diffuse(r,g,b,a)
varying vec2 v_uv0;				// xy:uv0
varying vec2 v_uv1;				// xy:uv1

#if defined(ORIGO_GLSL_FRAGMENT_SHADER)

uniform vec4 randomInfo;
uniform vec4 textureFactor;
uniform float brightness;
uniform float contrast;
uniform float gamma;
uniform bool doBlur;
uniform float fBlackWarning;
uniform vec4 lBase;// = vec4(1.0, 1.0, 0.0, 0.0);
uniform vec4 rBase;// = vec4(0.0, 0.0, 1.0, 0.0);

uniform sampler2D texture0;
uniform sampler2D texture1;
uniform sampler2D texture2;

#if ORIGO_GL_EXT_shader_framebuffer_fetch
// lowp vec4 gl_LastFragData[1]; // redeclaration to specify correct precision // TODO:ANDROID this is a quick fix for a compiler error in Android TV (PowerVR Rogue G6430, OpenGL ES 3.1 build 1.4@3064661). Redeclaration IS explicitly allowed: https://www.khronos.org/registry/gles/extensions/EXT/EXT_shader_framebuffer_fetch.txt
#elif ORIGO_GL_NV_shader_framebuffer_fetch
// lowp vec4 gl_LastFragData[1]; // TODO:ANDROID gives error. Check if necessary.
#endif

#define TextureSampler texture0
#define BloomSampler texture1
#define NoiseSampler texture2
#define LeftEyeSampler texture0
#define RightEyeSampler texture1
#define ColorCodeSampler texture2

#endif

// --- FixedFunction2DUVVS
#if defined(FixedFunction2DUVVS)
void FixedFunction2DUVVS(void) {
	// output normalized device coords
	//gl_Position.xy = (position.xy/viewport.zw)*vec2(2.0, 2.0) + vec2(-1.0, -1.0);
	gl_Position.xy = (position.xy/viewport.zw)*vec2(2.0, -2.0) + vec2(-1.0, 1.0);
	gl_Position.zw = position.zw;

	// output texcoords
	v_uv0 = uv0;
}
#endif

// --- FixedFunction2DUVPS
#if defined(FixedFunction2DUVPS)
void FixedFunction2DUVPS(void) {
	gl_FragColor = texture2D(TextureSampler, v_uv0) * textureFactor + vec4(brightness, brightness, brightness, 0.0);
}
#endif

// --- FixedFunction2DUVExpandRedPS
#if defined(FixedFunction2DUVExpandRedPS)
void FixedFunction2DUVExpandRedPS(void) {
#if ORIGO_GL_EXT_shader_framebuffer_fetch || ORIGO_GL_NV_shader_framebuffer_fetch
	lowp vec4 color = gl_LastFragData[0];
#else
	lowp vec4 color = texture2D(TextureSampler, v_uv);// not actually used
#endif

	// merge green into red, to add the bloom effect
	color.r += color.g;

	// output with offset in green and blue, to reduce banding
	gl_FragColor = color.rrra + lowp vec4(0.0, 0.0013, 0.0026, 0.0);
}
#endif

// --- FixedFunction2DUVBrightnessContrastPS
#if defined(FixedFunction2DUVBrightnessContrastPS)
void FixedFunction2DUVBrightnessContrastPS(void) {
	vec4 texel = texture2D(TextureSampler, v_uv0);
	vec4 fullscaleval = texel*(2.0-texel*texel); // = texel + (texel-texel*texel*texel);
	texel = texel*(1.0-gamma) + fullscaleval*gamma + brightness;
	gl_FragColor = (texel - 0.5) * (1.0 + (contrast - 1.0) * 0.5) + 0.5;
}
#endif

// --- FixedFunction2DColorUVVS
#if defined(FixedFunction2DColorUVVS)
void FixedFunction2DColorUVVS(void) {
	// output normalized device coords
	//gl_Position.xy = (position.xy/viewport.zw)*vec2(2.0, 2.0) + vec2(-1.0, -1.0);
	gl_Position.xy = (position.xy/viewport.zw)*vec2(2.0, -2.0) + vec2(-1.0, 1.0);
	gl_Position.zw = position.zw;

	// output color
	v_diffuse = color0;

	// output texcoords
	v_uv0 = uv0;
}
#endif

// --- FixedFunction2DColorUVPS
#if defined(FixedFunction2DColorUVPS)
void FixedFunction2DColorUVPS(void) {
	gl_FragColor = texture2D(TextureSampler, v_uv0) * v_diffuse * textureFactor + vec4(brightness, brightness, brightness, 0.0);
}
#endif

// --- FixedFunction2DColorUV2PostVS
#if defined(FixedFunction2DColorUV2PostVS)
void FixedFunction2DColorUV2PostVS(void) {
	// output normalized device coords
	//gl_Position.xy = (position.xy/viewport.zw)*vec2(2.0, 2.0) + vec2(-1.0, -1.0);
	gl_Position.xy = (position.xy/viewport.zw)*vec2(2.0, -2.0) + vec2(-1.0, 1.0);
	gl_Position.zw = position.zw;

	// output texcoords
	v_uv0 = uv0;

	// output secondary texcoords
	v_uv1 = uv1;
}
#endif

// --- FixedFunction2DColorUV2PostPS
#if defined(FixedFunction2DColorUV2PostPS)
void FixedFunction2DColorUV2PostPS(void) {
	// 1280/256 = 5.0, 720/256 = 2.81
	float noise = texture2D(NoiseSampler, v_uv0*vec2(5.0,2.81)+randomInfo.xy).r*2.0-1.0;
	// Merge blue into red, to add the bloom effect
	vec4 color = texture2D(TextureSampler, v_uv0);
	// DANIELSUGLYHACKTOREMOVESTRETCHEDEYESBUG
	vec4 bloom = texture2D(BloomSampler, v_uv1);
	float tex = color.r + color.g + bloom.g;
	//float tex = color.r + color.g;
	tex = clamp(tex,0.0,1.0);

	float fullscaleval = tex*(2.0-tex*tex); // = tex + (tex-tex*tex*tex);
	float gammaScale = (1.0-tex);
	gammaScale *= gammaScale*gammaScale*2.0*gamma;
	tex = tex*(1.0-gammaScale)+ fullscaleval*gammaScale + brightness;
	tex = (tex - 0.5) * (1.0 + (contrast - 1.0) * 0.5) + 0.5;

	// test:
	tex = tex*(noise*randomInfo.w+1.0) + (noise*randomInfo.z); // apply grain multiply
	tex = clamp(tex,0.0,1.0);

	color.r = tex;
	color.g = tex+0.0013;
	color.b = tex+0.0026;
	color.a = 1.0;

	gl_FragColor = color;
}
#endif

// --- FixedFunction2DColorUV2PostPS_BlackWarning
#if defined(FixedFunction2DColorUV2PostPS_BlackWarning)
void FixedFunction2DColorUV2PostPS_BlackWarning(void) {
	// Merge blue into red, to add the bloom effect
	vec4 color = texture2D(TextureSampler, v_uv0);
	vec4 bloom = texture2D(BloomSampler, v_uv1);
	float tex = color.r + color.g + bloom.g;
	float fullscaleval = tex*(2.0-tex*tex); // = tex + (tex-tex*tex*tex);
	float gammaScale = (1.0-tex);
	gammaScale *= gammaScale*gammaScale*2.0*gamma;
	tex = tex*(1.0-gammaScale)+ fullscaleval*gammaScale + brightness;
	tex = (tex - 0.5) * (1.0 + (contrast - 1.0) * 0.5) + 0.5;

	color.r = (tex < fBlackWarning) ? 1.0 : tex;
	color.g = tex+0.0013;
	color.b = tex+0.0026;
	color.a = 1.0;

	gl_FragColor = color;
}
#endif

// --- FixedFunction2DColorVS
#if defined(FixedFunction2DColorVS)
void FixedFunction2DColorVS(void) {
	// output normalized device coords
	//gl_Position.xy = (position.xy/viewport.zw)*vec2(2.0, 2.0) + vec2(-1.0, -1.0);
	gl_Position.xy = (position.xy/viewport.zw)*vec2(2.0, -2.0) + vec2(-1.0, 1.0);
	gl_Position.zw = position.zw;

	// output color
	v_diffuse = color0;
}
#endif

// --- FixedFunction2DColorPS
#if defined(FixedFunction2DColorPS)
void FixedFunction2DColorPS(void) {
	gl_FragColor = v_diffuse * textureFactor + vec4(brightness, brightness, brightness, 0.0);
}
#endif

// --- FixedFunction3DColorVS
#if defined(FixedFunction3DColorVS)
void FixedFunction3DColorVS(void) {
	// output clip space position
	gl_Position = (ViewProjMatrix * WorldMatrix) * position;
	gl_Position.z -= bias * 0.001;

	// output color
	v_diffuse = color0;
}
#endif

// --- FixedFunction3DColorPS
#if defined(FixedFunction3DColorPS)
void FixedFunction3DColorPS(void) {
	gl_FragColor = v_diffuse * textureFactor + vec4(brightness, brightness, brightness, 0.0);
}
#endif

// --- FixedFunction3DVS
#if defined(FixedFunction3DVS)
void FixedFunction3DVS(void) {
	// output clip space position
	gl_Position = (ViewProjMatrix * WorldMatrix) * position;
	gl_Position.z -= bias * 0.001;

	// output constant color
	v_diffuse = vec4(1.0);
}
#endif

// --- FixedFunction3DPS
#if defined(FixedFunction3DPS)
void FixedFunction3DPS(void) {
	gl_FragColor = textureFactor + vec4(brightness, brightness, brightness, 0.0);
}
#endif

// --- FixedFunction3DColorUVVS
#if defined(FixedFunction3DColorUVVS)
void FixedFunction3DColorUVVS(void) {
	// output clip space position
	gl_Position = (ViewProjMatrix * WorldMatrix) * position;
	gl_Position.z -= bias * 0.001;

	// output color
	v_diffuse = color0;

	// output texcoords
	v_uv0 = uv0;
}
#endif

// --- FixedFunction3DColorUVPS
#if defined(FixedFunction3DColorUVPS)
void FixedFunction3DColorUVPS(void) {
	vec4 texel = texture2D(TextureSampler, v_uv0);
	gl_FragColor = v_diffuse;
	gl_FragColor.a *= texel.a;
}
#endif

// --- FixedFunction3DColorSpecularUVVS
#if defined(FixedFunction3DColorSpecularUVVS)
void FixedFunction3DColorSpecularUVVS(void) {
	// output clip space position
	gl_Position = (ViewProjMatrix * WorldMatrix) * position;
	gl_Position.z -= bias * 0.001;

	// output color
	v_diffuse = color0;

	// output texcoords
	v_uv0 = uv0;
}
#endif

// --- FixedFunction3DColorSpecularUVPS
#if defined(FixedFunction3DColorSpecularUVPS)
void FixedFunction3DColorSpecularUVPS(void) {
	vec4 texel = texture2D(TextureSampler, v_uv0);
	gl_FragColor = v_diffuse;
	gl_FragColor.a *= texel.a;
}
#endif

// --- FixedFunctionOverDrawPS
#if defined(FixedFunctionOverDrawPS)
void FixedFunctionOverDrawPS(void) {
	vec4 texel = texture2D(TextureSampler, v_uv0);
	gl_FragColor = vec4(16.0/255.0, 0.0, 0.0, texel.a);
}
#endif

// --- FixedFunction3DNUVVS
#if defined(FixedFunction3DNUVVS)
void FixedFunction3DNUVVS(void) {
	vec4 world_pos = WorldMatrix * position;

	// output clip space position
	gl_Position = ViewProjMatrix * world_pos;
	gl_Position.z -= bias * 0.001;

	// output constant color
	v_diffuse = vec4(1.0);

	// output texcoords
	v_uv0 = uv0;

	if (doBlur) {
		// compute blur (blur focus depth is z=0):
		float dist_factor = abs((world_pos.z - CameraZPos) / CameraZPos);
		// dist_factor examples: 1.0=the exact focus depth, 2.0=twice the focus depth, 0.5=half the focus depth
		float d = log2(dist_factor); //specular.b holds the blur flag (0 or 1) and effectivly disables blur on the sprite.
		float blur = sqrt(abs(d)) * fFocusFactor * (d < 0.0 ? fFocusRatio : 1.0);
		v_uv1.y = clamp(blur, 0.0, 5.0);
	}
}
#endif

// --- FixedFunction3DNUVPS
#if defined(FixedFunction3DNUVPS)
void FixedFunction3DNUVPS(void) {
	vec4 texel;

	if (doBlur) {
		texel = texture2D(TextureSampler, v_uv0, v_uv1.y);
	} else {
		texel = texture2D(TextureSampler, v_uv0);
	}

	float alpha = texel.a * textureFactor.a;
	vec3 current = texel.rgb * textureFactor.rgb;
	gl_FragColor = vec4(current, alpha);
}
#endif

// --- FixedFunction3DAnaglyphVS
#if defined(FixedFunction3DAnaglyphVS)
void FixedFunction3DAnaglyphVS(void) {
	// output normalized device coords
	//gl_Position.xy = (position.xy/viewport.zw)*vec2(2.0, 2.0) + vec2(-1.0, -1.0);
	gl_Position.xy = (position.xy/viewport.zw)*vec2(2.0, -2.0) + vec2(-1.0, 1.0);
	gl_Position.zw = position.zw;

	// output constant color
	v_diffuse = vec4(1.0);

	// output texcoords
	v_uv0 = uv0;
}
#endif

// --- FixedFunction3DAnaglyphPS
#if defined(FixedFunction3DAnaglyphPS)
void FixedFunction3DAnaglyphPS(void) {
	// read left and right texture samples
	vec4 rcolor = texture2D(RightEyeSampler, v_uv0);
	vec4 lcolor = texture2D(LeftEyeSampler, v_uv0);

	// use this line to use a colorcode translation texture
//	return texture2D(ColorCodeSampler, vec2(lcolor.r, rcolor.r));

	// find max value of colour for use as value
	float r_max = max( max(rcolor.x, rcolor.y), rcolor.z );
	float l_max = max( max(lcolor.x, lcolor.y), lcolor.z );

	// generate greyscale image
	vec4 rgray = vec4(r_max, r_max, r_max, r_max);
	vec4 lgray = vec4(l_max, l_max, l_max, l_max);

	float rcyan = dot( rcolor, rBase );
	float rred  = dot( rcolor, lBase );
	float lcyan = dot( lcolor, rBase );
	float lred  = dot( lcolor, lBase );

	float r_ratio = pow( 1.0 - clamp(abs( rcyan-rred ), 0.0, 1.0), 1.0 );
	float l_ratio = pow( 1.0 - clamp(abs( lcyan-lred ), 0.0, 1.0), 1.0 );

	rcolor = r_ratio * rcolor + (1.0-r_ratio)*rgray;
	lcolor = l_ratio * lcolor + (1.0-l_ratio)*lgray;

	gl_FragColor = rcolor*rBase + lcolor*lBase;
}
#endif
