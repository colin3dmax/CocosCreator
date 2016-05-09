precision highp float;

attribute vec4 position;
attribute vec2 uv0;
attribute vec2 uv1;

varying vec2 v_uv0;
varying vec2 v_uv1;

void main(void) {
	// output normalized device coords
	gl_Position = position;

	// output texcoords
	v_uv0 = uv0;
	v_uv1 = uv1;
}
