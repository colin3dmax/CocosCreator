precision highp float;

varying vec2 v_uv0;
varying vec2 v_uv1;

uniform float pixelWidth;
uniform float pixelWidthX;
uniform float pixelWidthY;

uniform sampler2D texture0;

#define TextureSampler texture0

void BlurMinimalX(void) {
	vec4 color = vec4(0.0);
	vec2 xOffset = vec2(pixelWidth, 0.0);

	// 3x3 kernel
	/*color += texture2D(TextureSampler, v_uv0 - xOffset)*0.25;
	color += texture2D(TextureSampler, v_uv0)*0.5;
	color += texture2D(TextureSampler, v_uv0 + xOffset)*0.25;*/

	// 4x4 kernel
	/*color += texture2D(TextureSampler, v_uv0 - xOffset*1.5)*0.125;
	color += texture2D(TextureSampler, v_uv0 - xOffset*0.5)*0.375;
	color += texture2D(TextureSampler, v_uv0 + xOffset*0.5)*0.375;
	color += texture2D(TextureSampler, v_uv0 + xOffset*1.5)*0.125;*/

	// 5x5 not-normalized kernel
	color += texture2D(TextureSampler, v_uv0 - xOffset*2.0)*0.04;
	color += texture2D(TextureSampler, v_uv0 - xOffset)*0.16;
	color += texture2D(TextureSampler, v_uv0)*0.6;
	color += texture2D(TextureSampler, v_uv0 + xOffset)*0.16;
	color += texture2D(TextureSampler, v_uv0 + xOffset*2.0)*0.04;

	gl_FragColor = color;
}

void BlurMinimalY(void) {
	vec4 color = vec4(0.0);
	vec2 yOffset = vec2(0.0, pixelWidth);

	// 3x3 kernel
	/*color += texture2D(TextureSampler, v_uv0 - yOffset)*0.25;
	color += texture2D(TextureSampler, v_uv0)*0.5;
	color += texture2D(TextureSampler, v_uv0 + yOffset)*0.25;*/

	// 4x4 kernel
	color += texture2D(TextureSampler, v_uv0 - yOffset*1.5)*0.125;
	color += texture2D(TextureSampler, v_uv0 - yOffset*0.5)*0.375;
	color += texture2D(TextureSampler, v_uv0 + yOffset*0.5)*0.375;
	color += texture2D(TextureSampler, v_uv0 + yOffset*1.5)*0.125;

	// 5x5 not-normalized kernel
	/*color += texture2D(TextureSampler, v_uv0 - yOffset*2.0)*0.04;
	color += texture2D(TextureSampler, v_uv0 - yOffset)*0.16;
	color += texture2D(TextureSampler, v_uv0)*0.6;
	color += texture2D(TextureSampler, v_uv0 + yOffset)*0.16;
	color += texture2D(TextureSampler, v_uv0 + yOffset*2.0)*0.04;*/

    gl_FragColor = color;
}

void BlurMinimalXY(void) {
	vec4 color = vec4(0.0);
	vec2 yOffset = vec2(0.0, pixelWidthY);
	vec2 xOffset;

	// 5x4 kernel
	xOffset = vec2(pixelWidthX, 0.0)*-2.0;
	color += texture2D(TextureSampler, v_uv0 - yOffset*1.5 + xOffset)*0.04*0.125;
	color += texture2D(TextureSampler, v_uv0 - yOffset*0.5 + xOffset)*0.04*0.375;
	color += texture2D(TextureSampler, v_uv0 + yOffset*0.5 + xOffset)*0.04*0.375;
	color += texture2D(TextureSampler, v_uv0 + yOffset*1.5 + xOffset)*0.04*0.125;

	xOffset = vec2(pixelWidthX, 0.0)*-1.0;
	color += texture2D(TextureSampler, v_uv0 - yOffset*1.5 + xOffset)*0.16*0.125;
	color += texture2D(TextureSampler, v_uv0 - yOffset*0.5 + xOffset)*0.16*0.375;
	color += texture2D(TextureSampler, v_uv0 + yOffset*0.5 + xOffset)*0.16*0.375;
	color += texture2D(TextureSampler, v_uv0 + yOffset*1.5 + xOffset)*0.16*0.125;

	xOffset = vec2(pixelWidthX, 0.0)*0.0;
	color += texture2D(TextureSampler, v_uv0 - yOffset*1.5 + xOffset)*0.6*0.125;
	color += texture2D(TextureSampler, v_uv0 - yOffset*0.5 + xOffset)*0.6*0.375;
	color += texture2D(TextureSampler, v_uv0 + yOffset*0.5 + xOffset)*0.6*0.375;
	color += texture2D(TextureSampler, v_uv0 + yOffset*1.5 + xOffset)*0.6*0.125;

	xOffset = vec2(pixelWidthX, 0.0)*1.0;
	color += texture2D(TextureSampler, v_uv0 - yOffset*1.5 + xOffset)*0.16*0.125;
	color += texture2D(TextureSampler, v_uv0 - yOffset*0.5 + xOffset)*0.16*0.375;
	color += texture2D(TextureSampler, v_uv0 + yOffset*0.5 + xOffset)*0.16*0.375;
	color += texture2D(TextureSampler, v_uv0 + yOffset*1.5 + xOffset)*0.16*0.125;

	xOffset = vec2(pixelWidthX, 0.0)*2.0;
	color += texture2D(TextureSampler, v_uv0 - yOffset*1.5 + xOffset)*0.04*0.125;
	color += texture2D(TextureSampler, v_uv0 - yOffset*0.5 + xOffset)*0.04*0.375;
	color += texture2D(TextureSampler, v_uv0 + yOffset*0.5 + xOffset)*0.04*0.375;
	color += texture2D(TextureSampler, v_uv0 + yOffset*1.5 + xOffset)*0.04*0.125;

    gl_FragColor = color;
}
