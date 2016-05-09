precision highp float;

varying vec2 v_uv0;
varying vec2 v_uv1;

uniform vec4 opacity;

uniform sampler2D texture0;

#define g_samSrcColor texture0

const float threshold = 0.5;

void PostProcessPS(void) {
	float r;
	r = texture2D(g_samSrcColor, v_uv0).r;
	r = (r < threshold ? 0.0 : r);
	gl_FragColor = vec4(r, r, r, 1.0);
}
