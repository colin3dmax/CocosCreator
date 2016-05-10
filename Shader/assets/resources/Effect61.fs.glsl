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






//_______________________________________________________________________________________________________
/**

	Hi all,

	This is just my playground for a bunch of 2D stuff:

	Some distance functions and blend functions
	Cone marched 2D Soft shadows
	Use the mouse to control the 3rd light

*/



//////////////////////////////////////
// Combine distance field functions //
//////////////////////////////////////


float smoothMerge(float d1, float d2, float k)
{
    float h = clamp(0.5 + 0.5*(d2 - d1)/k, 0.0, 1.0);
    return mix(d2, d1, h) - k * h * (1.0-h);
}


float merge(float d1, float d2)
{
	return min(d1, d2);
}


float mergeExclude(float d1, float d2)
{
    float a = min(d1 * sign(d2), d2 * sign(d1));
    float b = max(d1 * sign(d2), d2 * sign(d1));
    
    if (sign(d1) == sign(d2))
    	return a;
    else
    	return b;
}


float substract(float d1, float d2)
{
	return max(-d1, d2);
}


float intersect(float d1, float d2)
{
	return max(d1, d2);
}


//////////////////////////////
// Rotation and translation //
//////////////////////////////


vec2 rotateCCW(vec2 p, float a)
{
	mat2 m = mat2(cos(a), sin(a), -sin(a), cos(a));
	return p * m;	
}


vec2 rotateCW(vec2 p, float a)
{
	mat2 m = mat2(cos(a), -sin(a), sin(a), cos(a));
	return p * m;
}


vec2 translate(vec2 p, vec2 t)
{
	return p - t;
}


//////////////////////////////
// Distance field functions //
//////////////////////////////


float pie(vec2 p, float angle)
{
	angle = radians(angle) / 2.0;
	vec2 n = vec2(cos(angle), sin(angle));
	return abs(p).x * n.x + p.y*n.y;
}


float circleDist(vec2 p, float radius)
{
	return length(p) - radius;
}


float triangleDist(vec2 p, float radius)
{
	return max(	abs(p).x * 0.866025 + 
			   	p.y * 0.5, -p.y) 
				-radius * 0.5;
}


float triangleDist(vec2 p, float width, float height)
{
	vec2 n = normalize(vec2(height, width / 2.0));
	return max(	abs(p).x*n.x + p.y*n.y - (height*n.y), -p.y);
}


float semiCircleDist(vec2 p, float radius, float angle, float width)
{
	width /= 2.0;
	radius -= width;
	return substract(pie(p, angle), 
					 abs(circleDist(p, radius)) - width);
}


float boxDist(vec2 p, vec2 size, float radius)
{
	size -= vec2(radius);
	vec2 d = abs(p) - size;
  	return min(max(d.x, d.y), 0.0) + length(max(d, 0.0)) - radius;
}


float lineDist(vec2 p, vec2 start, vec2 end, float width)
{
	vec2 dir = start - end;
	float lngth = length(dir);
	dir /= lngth;
	vec2 proj = max(0.0, min(lngth, dot((start - p), dir))) * dir;
	return length( (start - p) - proj ) - (width / 2.0);
}


///////////////////////
// Masks for drawing //
///////////////////////


float fillMask(float dist)
{
	return clamp(-dist, 0.0, 1.0);
}


float innerBorderMask(float dist, float width)
{
	//dist += 1.0;
	float alpha1 = clamp(dist + width, 0.0, 1.0);
	float alpha2 = clamp(dist, 0.0, 1.0);
	return alpha1 - alpha2;
}


float outerBorderMask(float dist, float width)
{
	//dist += 1.0;
	float alpha1 = clamp(dist, 0.0, 1.0);
	float alpha2 = clamp(dist - width, 0.0, 1.0);
	return alpha1 - alpha2;
}


///////////////
// The scene //
///////////////


float sceneDist(vec2 p)
{
	float c = circleDist(		translate(p, vec2(100, 250)), 40.0);
	float b1 =  boxDist(		translate(p, vec2(200, 250)), vec2(40, 40), 	0.0);
	float b2 =  boxDist(		translate(p, vec2(300, 250)), vec2(40, 40), 	10.0);
	float l = lineDist(			p, 			 vec2(370, 220),  vec2(430, 280),	10.0);
	float t1 = triangleDist(	translate(p, vec2(500, 210)), 80.0, 			80.0);
	float t2 = triangleDist(	rotateCW(translate(p, vec2(600, 250)), iGlobalTime), 40.0);
	
	float m = 	merge(c, b1);
	m = 		merge(m, b2);
	m = 		merge(m, l);
	m = 		merge(m, t1);
	m = 		merge(m, t2);
	
	float b3 = boxDist(		translate(p, vec2(100, sin(iGlobalTime * 3.0 + 1.0) * 40.0 + 100.0)), 
					   		vec2(40, 15), 	0.0);
	float c2 = circleDist(	translate(p, vec2(100, 100)),	30.0);
	float s = substract(b3, c2);
	
	float b4 = boxDist(		translate(p, vec2(200, sin(iGlobalTime * 3.0 + 2.0) * 40.0 + 100.0)), 
					   		vec2(40, 15), 	0.0);
	float c3 = circleDist(	translate(p, vec2(200, 100)), 	30.0);
	float i = intersect(b4, c3);
	
	float b5 = boxDist(		translate(p, vec2(300, sin(iGlobalTime * 3.0 + 3.0) * 40.0 + 100.0)), 
					   		vec2(40, 15), 	0.0);
	float c4 = circleDist(	translate(p, vec2(300, 100)), 	30.0);
	float a = merge(b5, c4);
	
	float b6 = boxDist(		translate(p, vec2(400, 100)),	vec2(40, 15), 	0.0);
	float c5 = circleDist(	translate(p, vec2(400, 100)), 	30.0);
	float sm = smoothMerge(b6, c5, 10.0);
	
	float sc = semiCircleDist(translate(p, vec2(500,100)), 40.0, 90.0, 10.0);
    
    float b7 = boxDist(		translate(p, vec2(600, sin(iGlobalTime * 3.0 + 3.0) * 40.0 + 100.0)), 
					   		vec2(40, 15), 	0.0);
	float c6 = circleDist(	translate(p, vec2(600, 100)), 	30.0);
	float e = mergeExclude(b7, c6);
    
	m = merge(m, s);
	m = merge(m, i);
	m = merge(m, a);
	m = merge(m, sm);
	m = merge(m, sc);
    m = merge(m, e);
	
	return m;
}


float sceneSmooth(vec2 p, float r)
{
	float accum = sceneDist(p);
	accum += sceneDist(p + vec2(0.0, r));
	accum += sceneDist(p + vec2(0.0, -r));
	accum += sceneDist(p + vec2(r, 0.0));
	accum += sceneDist(p + vec2(-r, 0.0));
	return accum / 5.0;
}


//////////////////////
// Shadow and light //
//////////////////////


float shadow(vec2 p, vec2 pos, float radius)
{
	vec2 dir = normalize(pos - p);
	float dl = length(p - pos);
	
	// fraction of light visible, starts at one radius (second half added in the end);
	float lf = radius * dl;
	
	// distance traveled
	float dt = 0.01;

	for (int i = 0; i < 64; ++i)
	{				
		// distance to scene at current position
		float sd = sceneDist(p + dir * dt);

        // early out when this ray is guaranteed to be full shadow
        if (sd < -radius) 
            return 0.0;
        
		// width of cone-overlap at light
		// 0 in center, so 50% overlap: add one radius outside of loop to get total coverage
		// should be '(sd / dt) * dl', but '*dl' outside of loop
		lf = min(lf, sd / dt);
		
		// move ahead
		dt += max(1.0, abs(sd));
		if (dt > dl) break;
	}

	// multiply by dl to get the real projected overlap (moved out of loop)
	// add one radius, before between -radius and + radius
	// normalize to 1 ( / 2*radius)
	lf = clamp((lf*dl + radius) / (2.0 * radius), 0.0, 1.0);
	lf = smoothstep(0.0, 1.0, lf);
	return lf;
}



vec4 drawLight(vec2 p, vec2 pos, vec4 color, float dist, float range, float radius)
{
	// distance to light
	float ld = length(p - pos);
	
	// out of range
	if (ld > range) return vec4(0.0);
	
	// shadow and falloff
	float shad = shadow(p, pos, radius);
	float fall = (range - ld)/range;
	fall *= fall;
	float source = fillMask(circleDist(p - pos, radius));
	return (shad * fall + source) * color;
}


float luminance(vec4 col)
{
	return 0.2126 * col.r + 0.7152 * col.g + 0.0722 * col.b;
}


void setLuminance(inout vec4 col, float lum)
{
	lum /= luminance(col);
	col *= lum;
}


float AO(vec2 p, float dist, float radius, float intensity)
{
	float a = clamp(dist / radius, 0.0, 1.0) - 1.0;
	return 1.0 - (pow(abs(a), 5.0) + 1.0) * intensity + (1.0 - intensity);
	return smoothstep(0.0, 1.0, dist / radius);
}


/////////////////
// The program //
/////////////////


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 p = fragCoord.xy + vec2(0.5);
	vec2 c = iResolution.xy / 2.0;
	
	//float dist = sceneSmooth(p, 5.0);
	float dist = sceneDist(p);
	
	vec2 light1Pos = iMouse.xy;
	vec4 light1Col = vec4(0.75, 1.0, 0.5, 1.0);
	setLuminance(light1Col, 0.4);
	
	vec2 light2Pos = vec2(iResolution.x * (sin(iGlobalTime + 3.1415) + 1.2) / 2.4, 175.0);
	vec4 light2Col = vec4(1.0, 0.75, 0.5, 1.0);
	setLuminance(light2Col, 0.5);
	
	vec2 light3Pos = vec2(iResolution.x * (sin(iGlobalTime) + 1.2) / 2.4, 340.0);
	vec4 light3Col = vec4(0.5, 0.75, 1.0, 1.0);
	setLuminance(light3Col, 0.6);
	
	// gradient
	vec4 col = vec4(0.5, 0.5, 0.5, 1.0) * (1.0 - length(c - p)/iResolution.x);
	// grid
	col *= clamp(min(mod(p.y, 10.0), mod(p.x, 10.0)), 0.9, 1.0);
	// ambient occlusion
	col *= AO(p, sceneSmooth(p, 10.0), 40.0, 0.4);
	//col *= 1.0-AO(p, sceneDist(p), 40.0, 1.0);
	// light
	col += drawLight(p, light1Pos, light1Col, dist, 150.0, 6.0);
	col += drawLight(p, light2Pos, light2Col, dist, 200.0, 8.0);
	col += drawLight(p, light3Pos, light3Col, dist, 300.0, 12.0);
	// shape fill
	col = mix(col, vec4(1.0, 0.4, 0.0, 1.0), fillMask(dist));
	// shape outline
	col = mix(col, vec4(0.1, 0.1, 0.1, 1.0), innerBorderMask(dist, 1.5));

	fragColor = clamp(col, 0.0, 1.0);
}


//_______________________________________________________________________________________________________





void main( void)
{
	mainImage(gl_FragColor, gl_FragCoord.xy);
}