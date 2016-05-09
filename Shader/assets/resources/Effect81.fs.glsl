#ifdef GL_ES
precision mediump float;
#endif


// Shader Inputs
// uniform vec3      iResolution;           // viewport resolution (in pixels)
// uniform float     iGlobalTime;           // shader playback time (in seconds)
// uniform float     iTimeDelta;            // render time (in seconds)
// uniform int       iFrame;                // shader playback frame
// uniform float     iChannelTime[4];       // channel playback time (in seconds)
// uniform vec3      iChannelResolution[4]; // channel resolution (in pixels)
// uniform vec4      iMouse;                // mouse pixel coords. xy: current (if MLB down), zw: click
// uniform samplerXX iChannel0..3;          // input channel. XX = 2D/Cube
// uniform vec4      iDate;                 // (year, month, day, time in seconds)
// uniform float     iSampleRate;           // sound sample rate (i.e., 44100)


uniform vec3      iResolution;           // viewport resolution (in pixels)
uniform float     iGlobalTime;           // shader playback time (in seconds)
//uniform float     iTimeDelta;            // render time (in seconds)
//uniform int       iFrame;                // shader playback frame
//uniform float     iChannelTime[4];       // channel playback time (in seconds)
//uniform vec3      iChannelResolution[4]; // channel resolution (in pixels)
uniform vec4      iMouse;                // mouse pixel coords. xy: current (if MLB down), zw: click
//uniform samplerXX iChannel0..3;          // input channel. XX = 2D/Cube
uniform vec4      iDate;                 // (year, month, day, time in seconds)
//uniform float     iSampleRate;           // sound sample rate (i.e., 44100)

#define iChannel0 CC_Texture0
#define iChannel1 CC_Texture0
#define iChannel2 CC_Texture0
#define iChannel3 CC_Texture0
#define iChannel4 CC_Texture0




//_______________________________________________________________________________________________________
float sphere
	(vec3 ray, vec3 dir, vec3 center, float radius, vec3 color, inout vec3 nml, inout vec3 mat, float closestHit)
{
	vec3 rc = ray-center;
	float c = dot(rc, rc) - (radius*radius);
	float b = dot(dir, rc);
	float d = b*b - c;
	float t = -b - sqrt(abs(d));
	float st = step(0.0, min(t,d)) * step(t, closestHit);
	closestHit = mix(closestHit, t, st);
	nml = mix(nml, (center-(ray+dir*t)) / radius, st);
	mat = mix(mat, color, st);
	return closestHit;
}

float scene(float t, vec3 ro, vec3 rd, inout vec3 nml, inout vec3 mat, float dist)
{
	dist = sphere(ro, rd, vec3(0.0), 1.0, vec3(0.5, 0.8, 1.0), nml, mat, dist);
	dist = sphere(ro, rd, 
				  vec3(sin(t*3.0)*3.0, cos(t*3.0)*3.0, cos(t)*8.0), 
				  1.5, vec3(1.0, 0.8, 1.0), 
				  nml, mat, dist);
	dist = sphere(ro, rd, 
				  vec3(sin(t*3.0)*-3.0, cos(t*3.0)*-3.0, sin(t)*8.0), 
				  1.5, vec3(0.5, 0.8, 0.5), 
				  nml, mat, dist);
	return dist;
}

vec3 background(float t, vec3 rd)
{
	vec3 sunColor = vec3(2.0, 1.6, 1.0);
	vec3 skyColor = vec3(0.5, 0.6, 0.7);
	vec3 sunDir = normalize(vec3(sin(t), sin(t*1.2), cos(t)));
	return
		pow(max(0.0, dot(sunDir, rd)), 128.0)*sunColor + 
		0.2*pow(max(0.0, dot(sunDir, rd)), 2.0)*sunColor + 
		pow(max(0.0, -dot(vec3(0.0, 1.0, 0.0), rd)), 1.0)*(1.0-skyColor) +
		pow(max(0.0, dot(vec3(0.0, 1.0, 0.0), rd)), 1.0)*skyColor;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 uv = 
		(-1.0 + 2.0*fragCoord.xy / iResolution.xy) * 
		vec2(iResolution.x/iResolution.y, 1.0);
	vec3 light = vec3(0.0); // How much light hits the eye through the ray.
	
	float epsilon = 0.001;
	float maxDist = 1e5;
	
	const int mblur_count = 3;  // How many motion blur rays we trace.
	const int bounce_count = 3; // How many scene rays we trace.
	
	float exposureTime = 1.0/15.0;
	vec2 tuv = vec2(float(mblur_count), 1.0)*(fragCoord.xy / 256.0);
	
	for (int j=0; j<mblur_count; j++) {
		float rand = texture2D(iChannel0, tuv+vec2(float(j)/256.0, 0.0), -100.0).r;
		float t = iGlobalTime + exposureTime*((float(j)+2.0*(0.5-rand))/float(mblur_count));
		vec3 ro = vec3(0.0, 0.0, -6.0);     // Ray origin.
		vec3 rd = normalize(vec3(uv, 1.0)); // Ray direction.
		vec3 transmit = vec3(1.0);          // How much light the ray lets through.
		
		for (int i=0; i<bounce_count; i++) {
			vec3 mat, nml;
			float dist = scene(t, ro, rd, nml, mat, maxDist);
			if (dist < maxDist) { // Object hit.
				transmit *= mat;       // Make the ray more opaque.
				ro += rd*dist;         // Move the ray to the hit point.
				rd = reflect(rd, nml); // Reflect the ray.
				// Move the ray off the surface to avoid hitting the same point twice.
				ro += rd*epsilon;
			} else { // Background hit.
				// Put the background light through the ray 
				// and add it to the light seen by the eye.
				light += transmit * background(t,rd);
				break; // Don't bounce off the background.
			}
		}
	}
	light /= float(mblur_count);
	fragColor = vec4(light, 1.0);
}

//_______________________________________________________________________________________________________





void main( void)
{
	mainImage(gl_FragColor, gl_FragCoord.xy);
}