precision highp float;

varying vec2 v_uv0;
varying vec2 v_uv1;

uniform float pixelWidth;
uniform float opacity;

uniform sampler2D texture0;

#define g_samSrcColor texture0

/*const float kernel[7] = {
	100.0,
	100.0,
	100.0,
	100.0,
	100.0,
	100.0,
	100.0
};*/

void PostProcessPS(void) {
	vec4 color = vec4(0.0);
	vec2 offset = vec2(0.0, -3.0 * pixelWidth);

	for (int i = 0; i < 7; i++) {
		color += texture2D(g_samSrcColor, v_uv0 + offset) * 100.0;//* kernel[i];
		offset.y += pixelWidth;
	}

	color /= 374.0;

	gl_FragColor = vec4(color.rgb, opacity);
}
