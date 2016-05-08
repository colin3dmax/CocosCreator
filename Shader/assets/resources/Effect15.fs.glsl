// extra texture changes by @xprogram

#ifdef GL_ES
precision mediump float;
#endif


uniform float time;
uniform vec2 mouse;
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
	p = rotatey(p, p.z*0.15); 
	p.z += time * 0.5; 	
	return p; 
}
float scene(in vec3 p) {

	p = ts(p); 
	p.z = 0.1; 
	return length(p) - 0.5;  
}

vec3 get_tex(in vec3 p) 
{

	p = ts(p); 
	p *= 10.0; 
	p = mod(p, 1.0) - 0.5; 
	if (dot(p, vec3(0, 0, 1)) < 0.1 && dot(p, vec3(1, 0, 0)) < 0.1)
		return vec3(1, 1, 0);
	else if (dot(p, vec3(0, 1, 0)) < 0.1 && dot(p, vec3(0, 0, -1)) < 0.1)
		return vec3(0, 1, 1);

	return vec3(0, 1, 0);
}

void main(){

	vec2 p = 2.0*( gl_FragCoord.xy / resolution.xy ) - 1.0; 
	p.x *= resolution.x/resolution.y; 
	vec3 col = vec3(0); 
	

	vec3 ro = vec3(0,0,1); 
	vec3 rd = vec3(-p.x,p.y,-1.0); 
	
	
	vec3 pos = ro;
	float dist = 0.0; 
	float d; 
	for (int i = 0; i < 40; i++) {
		d = scene(pos); 
		pos += rd*d; 
		dist += d;
	}
	if (d < 0.001) {
		col = get_tex(pos);
		
		col *= (1.0-clamp(-0.25*dist, 0.0, 1.0));	
		col /= -dist;	
	}
	gl_FragColor = vec4(col, 1.0); 
}