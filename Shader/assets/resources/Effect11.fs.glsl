#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;
vec3 rotatey(in vec3 p, float ang)
{

	return vec3(p.x*cos(ang)-p.z*sin(ang), p.y, p.x*sin(ang)+p.z*cos(ang)); 
}
vec3 rotatez(in vec3 p, float ang)
{

	return vec3(p.x*cos(ang)-p.y*sin(ang), p.x*sin(ang)+p.y*cos(ang),p.z); 
}
vec3 ts(in vec3 p)
{
	p = rotatez(p, -time*0.1); 
	p = rotatey(p, p.z*0.2); 
	p.z += time*0.5; 	
	return p; 
}
float scene(in vec3 p) {

	p = ts(p); 
	p.z = 0.0; 
	return length(p) - 0.5;  
}

vec3 get_tex(in vec3 p) 
{

	p = ts(p); 
	p *= 10.0; 
	p = mod(p+0.5, 0.7)-0.5; 

	if (length(p.xz) < 0.05)
		return vec3(1.0); 
	
	return vec3(0);
}

void main( void ) {

	vec2 p = 2.0*( gl_FragCoord.xy / resolution.xy ) -1.0; 
	p.x *= resolution.x/resolution.y; 
	vec3 col = vec3(0); 
	

	vec3 ro = vec3(0,0.1,.10); 
	vec3 rd = vec3(-p.x,-p.y,-0.9); 
	
	
	vec3 pos = ro;
	float dist = 0.0; 
	float d; 
	for (int i = 0; i < 20; i++) {
		d = scene(pos); 
		pos += rd*d; 
		dist += d; 
	}
	if (d < 0.1 && dist < 100.0) {
		col = get_tex(pos);
		
		col *= (10.0-clamp(-0.3*dist, 0.0, 1.0));	
		col /= -dist;	
	}
	gl_FragColor = vec4(col, 1.0); 
}