precision highp float;

varying vec2 v_uv0;
varying vec2 v_uv1;

uniform vec4 color;
uniform vec4 opacity;

uniform sampler2D texture0;
uniform sampler2D texture1;

#define g_samSrcColor texture0
#define g_samResource texture1

void PostProcessPS(void) {
    vec4 bg_color = texture2D(g_samSrcColor, v_uv0);
    vec4 tx_color = texture2D(g_samResource, v_uv1);
    gl_FragColor = vec4(bg_color.r, bg_color.g, bg_color.b, opacity.r*tx_color.a);
}
