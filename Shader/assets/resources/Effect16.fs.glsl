// not mine - see parent
// lots of changes by @xprogram
// even more tweaks done...

precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float ASPECT = resolution.y / resolution.x;

const float PI = 3.14159265359;
const float FOV = 32.5;
const int ITER = 45;
const float EPSILON = 0.001; // Set this to 0.1 for some interesting effects...
const float AO_SOFTNESS = 1.5; // Higher value for softer effects

float VFOV = 2.0 * atan(tan(FOV * 0.5) * ASPECT);

float SCREEN_WIDTH = 2.0 * tan(FOV * 0.5);
float SCREEN_HEIGHT = 2.0 * tan(VFOV * 0.5);

float sphere(vec3 pos, float radius) {
	return length(pos) - radius;
}

float spheres(vec3 pos, float radius) {
	pos = mod(pos, 2.0) - 1.0;
	return sphere(pos, radius);
}

float cube(vec3 pos, float l) {
	return distance(clamp(pos, vec3(-l), vec3(l)), pos);
}

float cubes(vec3 pos, float l){
	pos = mod(pos, 2.0) - 1.0;
	return cube(pos, l);
}

float map(vec3 p){
	float c = spheres(vec3(0) - p, 0.4);
	c = min(c, cubes(vec3(0.0, 0.5, 2.0) - p, 0.1));
	c = min(c, cubes(vec3(0.5, 0.0, 2.0) - p, 0.1));

	return c;
}

float trace(in vec3 pos, in vec3 ray){
	float c = 0.0;
	float dist = 0.0;

	for(int i = 0; i < ITER; i++){
		c = map(pos);
		
		dist += c;
		pos += ray * c;

		// Early loop break
		if(c < EPSILON){
			return dist;
		}
	}
	
	return 0.0;
}

vec3 surface(const in vec3 p){
	vec3 e = vec3(EPSILON, 0.0, 0.0);

	return normalize(vec3(
		map(vec3(p.x + e.x, p.y, p.z)) - map(vec3(p.x - e.x, p.y, p.z)),
		map(vec3(p.x, p.y + e.x, p.z)) - map(vec3(p.x, p.y - e.x, p.z)),
		map(vec3(p.x, p.y, p.z + e.x)) - map(vec3(p.x, p.y, p.z - e.x))
	));
}

void main(){
	vec2 uv = (gl_FragCoord.xy / resolution) * 2.0 - 1.0;
	vec3 ray = normalize(vec3(uv.x * SCREEN_WIDTH, uv.y * SCREEN_HEIGHT, 1.0));
	vec3 col = vec3(0);

	vec3 pos = vec3(0);
	pos.x += sin(time) * 2.0;
	pos.z += time * 3.0;
	float dist = trace(pos, ray);

	// Only if something got hit, we can color...
	if(dist > 0.0){
		float btn = 1.0 / (pow(dist, 1.3));
		vec3 hp = pos + ray * dist; // Hit point on surface
		vec3 sn = surface(hp); // Surface normal (vector pointing outwards defining surface orientation)
		float ori = dot(sn, normalize(vec3(cos(time) * 5.0, 4, sin(time) * 5.0))); // Angle between 2 vectors

		// Color tweaking
		col = vec3(0.7, 0.4, 0.1); // Basic color
		col *= smoothstep(0.0, AO_SOFTNESS, ori); // Says how much color to apply
		col *= btn; // Says to modify color based on brightness
	}

	col = pow(col, vec3(0.454545));
	gl_FragColor = vec4(col, 1);
}