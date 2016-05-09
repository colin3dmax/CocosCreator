precision mediump float;

#if defined(ORIGO_GLSL_VERTEX_SHADER)

attribute vec4 position;
varying vec2 v_texCoord;

uniform float pixelWidth;
uniform float pixelHeight;

#endif

varying vec2 v_uv[5];


// unnormalized 11-tap kernel, originally used for 0.25 downsampled 1280x720
#define KERNEL5 0.0091
#define KERNEL4 0.0364
#define KERNEL3 0.1001
#define KERNEL2 0.2002
#define KERNEL1 0.3003
#define KERNEL0 0.3432

// 2*(KERNEL4+KERNEL3+KERNEL2+KERNEL1)+KERNEL0 = 1.2740 + 0.3432 = 1.6172
// normalized 9-tap kernel (omits KERNEL5)
#define WEI9TAP4 0.0225
#define WEI9TAP3 0.0619
#define WEI9TAP2 0.1238
#define WEI9TAP1 0.1857
#define WEI9TAP0 0.2122

#define POS9TAP4 4.0
#define POS9TAP3 3.0
#define POS9TAP2 2.0
#define POS9TAP1 1.0
#define POS9TAP0 0.0

// linearized 9-tap kernel (see http://rastergrid.com/blog/2010/09/efficient-gaussian-blur-with-linear-sampling/)
#define WEILIN9TAP2 0.0844//(WEI9TAP3+WEI9TAP4)
#define WEILIN9TAP1 0.3095//(WEI9TAP1+WEI9TAP2)
#define WEILIN9TAP0 0.2122//(WEI9TAP0)

#define POSLIN9TAP2 3.2666//((POS9TAP3*WEI9TAP3 + POS9TAP4*WEI9TAP4)/WEILIN9TAP2)
#define POSLIN9TAP1 1.4//((POS9TAP1*WEI9TAP1 + POS9TAP2*WEI9TAP2)/WEILIN9TAP1)
#define POSLIN9TAP0 0.0//POS9TAP0

// --- Blur9TapHVS
#if defined(Blur9TapHVS)
void Blur9TapHVS(void) {
	vec2 offset = vec2(pixelWidth, 0.0);

	// output normalized device coords
	gl_Position = position;

	// output texcoords
	v_uv[0] = v_texCoord - offset*POSLIN9TAP2;
	v_uv[1] = v_texCoord - offset*POSLIN9TAP1;
	v_uv[2] = v_texCoord;
	v_uv[3] = v_texCoord + offset*POSLIN9TAP1;
	v_uv[4] = v_texCoord + offset*POSLIN9TAP2;
}
#endif

// --- Blur9TapVVS
#if defined(Blur9TapVVS)
void Blur9TapVVS(void) {
	vec2 offset = vec2(0.0, pixelHeight);

	// output normalized device coords
	gl_Position = position;

	// output texcoords
	v_uv[0] = v_texCoord - offset*POSLIN9TAP2;
	v_uv[1] = v_texCoord - offset*POSLIN9TAP1;
	v_uv[2] = v_texCoord;
	v_uv[3] = v_texCoord + offset*POSLIN9TAP1;
	v_uv[4] = v_texCoord + offset*POSLIN9TAP2;
}
#endif

// --- Blur9TapPS
#if defined(Blur9TapPS)
void Blur9TapPS(void) {
	lowp vec4 color = vec4(0.0);

	color += texture2D(CC_Texture0, v_uv[0]) * WEILIN9TAP2;
	color += texture2D(CC_Texture0, v_uv[1]) * WEILIN9TAP1;
	color += texture2D(CC_Texture0, v_uv[2]) * WEILIN9TAP0;
	color += texture2D(CC_Texture0, v_uv[3]) * WEILIN9TAP1;
	color += texture2D(CC_Texture0, v_uv[4]) * WEILIN9TAP2;

	gl_FragColor = color;
}
#endif

// --- BlurBoxVS
#if defined(BlurBoxVS)
void BlurBoxVS(void) {
	vec2 offset = vec2(pixelWidth, pixelHeight);

	// output normalized device coords
	gl_Position = position;

	// output texcoords
	v_uv[0] = v_texCoord + offset*vec2(-1.0, -1.0);
	v_uv[1] = v_texCoord + offset*vec2(-1.0, 1.0);
	v_uv[2] = v_texCoord + offset*vec2(1.0, -1.0);
	v_uv[3] = v_texCoord + offset*vec2(1.0, 1.0);
}
#endif

// --- BlurBoxPS
#if defined(BlurBoxPS)
void BlurBoxPS(void) {
	lowp vec4 color = vec4(0.0);

	color += texture2D(CC_Texture0, v_uv[0]) * 0.25;
	color += texture2D(CC_Texture0, v_uv[1]) * 0.25;
	color += texture2D(CC_Texture0, v_uv[2]) * 0.25;
	color += texture2D(CC_Texture0, v_uv[3]) * 0.25;

	gl_FragColor = color;
}
#endif



void main(void) {
	lowp vec4 color = vec4(0.0);

	color += texture2D(CC_Texture0, v_uv[0]) * 0.25;
	color += texture2D(CC_Texture0, v_uv[1]) * 0.25;
	color += texture2D(CC_Texture0, v_uv[2]) * 0.25;
	color += texture2D(CC_Texture0, v_uv[3]) * 0.25;

	gl_FragColor = color;
}