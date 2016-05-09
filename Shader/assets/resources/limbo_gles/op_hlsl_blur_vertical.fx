precision highp float;

varying vec2 v_uv0;
varying vec2 v_uv1;

uniform float pixelWidth;
uniform float opacity;

uniform sampler2D texture0;

#define TextureSampler texture0

const float KERNEL0 = 0.0091;
const float KERNEL1 = 0.0364;
const float KERNEL2 = 0.1001;
const float KERNEL3 = 0.2002;
const float KERNEL4 = 0.3003;
const float KERNEL5 = 0.3432;

const float HALFKERNELSIZE = 5.0;

void PostProcessPS(void) {
	vec4 color = vec4(0.0);
	vec2 offset = vec2(0.0, -HALFKERNELSIZE * pixelWidth);

	color += texture2D(TextureSampler, v_uv0 + offset) * KERNEL0;
	offset.y += pixelWidth;
	color += texture2D(TextureSampler, v_uv0 + offset) * KERNEL1;
	offset.y += pixelWidth;
	color += texture2D(TextureSampler, v_uv0 + offset) * KERNEL2;
	offset.y += pixelWidth;
	color += texture2D(TextureSampler, v_uv0 + offset) * KERNEL3;
	offset.y += pixelWidth;
	color += texture2D(TextureSampler, v_uv0 + offset) * KERNEL4;
	offset.y += pixelWidth;
	color += texture2D(TextureSampler, v_uv0 + offset) * KERNEL5;
	offset.y += pixelWidth;
	color += texture2D(TextureSampler, v_uv0 + offset) * KERNEL4;
	offset.y += pixelWidth;
	color += texture2D(TextureSampler, v_uv0 + offset) * KERNEL3;
	offset.y += pixelWidth;
	color += texture2D(TextureSampler, v_uv0 + offset) * KERNEL2;
	offset.y += pixelWidth;
	color += texture2D(TextureSampler, v_uv0 + offset) * KERNEL1;
	offset.y += pixelWidth;
	color += texture2D(TextureSampler, v_uv0 + offset) * KERNEL0;

	color /= (2.0*(KERNEL0 + KERNEL1 + KERNEL2 + KERNEL3 + KERNEL4) + KERNEL5);

	gl_FragColor = vec4(color.xyz, opacity);
}
