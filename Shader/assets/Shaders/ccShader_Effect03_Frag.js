module.exports =
`
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse_touch;
uniform vec2 resolution;

float sphIntersect(vec3 ro, vec3 rd, vec4 sph)
{
    vec3 oc = ro - sph.xyz;
    float b = dot( oc, rd );
    float c = dot( oc, oc ) - sph.w*sph.w;
    float h = b*b - c;
    if( h<0.0 ) return -1.0;
    h = sqrt( h );
    return -b - h;
}

void main()
{
	vec2 mo = mouse_touch * 2.0 - 1.0;
	vec3 col = vec3(0.5, 1, 1);
	float aspect = resolution.x / resolution.y;

	vec2 uv = (gl_FragCoord.xy / resolution.xy) * 2.0 - 1.0;
	uv.x *= aspect;

	vec3 rdir = normalize(vec3(uv, 3.0));
	vec3 rpos = vec3(0, 0, -10);

	float dist = sphIntersect(rpos, rdir, vec4(0, 0, 0, 1.5));
	if(dist != -1.0){
		vec3 ldir = vec3(mo.x, mo.y, -1.0);
		vec3 snorm = normalize(rpos + rdir * dist);
		col = vec3(1, 0, 0) * max(dot(snorm, ldir), 0.0);
	}

	col = pow(col, vec3(0.454545));
	gl_FragColor = vec4(col, 1.0);
}


`
