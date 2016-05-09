precision highp float;

attribute vec4 position;
attribute vec4 color0;
attribute vec2 uv0;

uniform mat4 ViewProjMatrix;

varying lowp vec4 v_color;
varying mediump vec2 v_uv;

void main(void) {
	// output clip space position
	gl_Position = ViewProjMatrix * position;
	gl_Position.z += 0.001;

	// output intensity, intensity, intensity, alpha
	v_color = color0;

	// output texcoords
	v_uv = uv0;
}
