precision highp float;

varying vec2 v_uv0;
varying vec2 v_uv1;

uniform vec4 opacity;

uniform sampler2D texture0;

#define g_samSrcColor texture0

void PostProcessPS(void) {
   gl_FragColor = vec4(texture2D(g_samSrcColor, v_uv0).rgb, opacity.a);
}
