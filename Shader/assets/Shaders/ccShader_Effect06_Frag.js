module.exports =
`
#ifdef GL_ES
precision mediump float;
#endif

// Pygolampis 2

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const int numBlobs = 128;

void main( void ) {

	vec2 p = (gl_FragCoord.xy / resolution.x) - vec2(0.5, 0.5 * (resolution.y / resolution.x));

	vec3 c = vec3(0.0);
	for (int i=0; i<numBlobs; i++)
	{
		float px = sin(float(i)*0.1 + 0.5) * 0.4;
		float py = sin(float(i*i)*0.01 + 0.4*time) * 0.2;
		float pz = sin(float(i*i*i)*0.001 + 0.3*time) * 0.3 + 0.4;
		float radius = 0.005 / pz;
		vec2 pos = p + vec2(px, py);
		float z = radius - length(pos);
		if (z < 0.0) z = 0.0;
		float cc = z / radius;
		c += vec3(cc * (sin(float(i*i*i)) * 0.5 + 0.5), cc * (sin(float(i*i*i*i*i)) * 0.5 + 0.5), cc * (sin(float(i*i*i*i)) * 0.5 + 0.5));
	}

	gl_FragColor = vec4(c.x+p.y, c.y+p.y, c.z+p.y, 1.0);
}


`