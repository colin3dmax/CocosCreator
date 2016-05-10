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
/*--------------------------------------------------------------------------------------
License CC0 - http://creativecommons.org/publicdomain/zero/1.0/
To the extent possible under law, the author(s) have dedicated all copyright and related and neighboring rights to this software to the public domain worldwide. This software is distributed without any warranty.
----------------------------------------------------------------------------------------
^This means do anything you want with this code. Because we are programmers, not lawyers.

-Otavio Good
*/

// Number of times the fractal repeats
#define RECURSION_LEVELS 4
// Animation splits the sphere in different directions
// This ended up running a significantly slower fps and not looking very different. :(
//#define SPLIT_ANIM

float localTime = 0.0;
float marchCount;

float PI=3.14159265;

vec3 saturate(vec3 a) { return clamp(a, 0.0, 1.0); }
vec2 saturate(vec2 a) { return clamp(a, 0.0, 1.0); }
float saturate(float a) { return clamp(a, 0.0, 1.0); }

vec3 RotateX(vec3 v, float rad)
{
  float cos = cos(rad);
  float sin = sin(rad);
  return vec3(v.x, cos * v.y + sin * v.z, -sin * v.y + cos * v.z);
}
vec3 RotateY(vec3 v, float rad)
{
  float cos = cos(rad);
  float sin = sin(rad);
  return vec3(cos * v.x - sin * v.z, v.y, sin * v.x + cos * v.z);
}
vec3 RotateZ(vec3 v, float rad)
{
  float cos = cos(rad);
  float sin = sin(rad);
  return vec3(cos * v.x + sin * v.y, -sin * v.x + cos * v.y, v.z);
}


/*vec3 GetEnvColor(vec3 rayDir, vec3 sunDir)
{
	vec3 tex = textureCube(iChannel0, rayDir).xyz;
	tex = tex * tex;	// gamma correct
    return tex;
}*/

// This is a procedural environment map with a giant overhead softbox,
// 4 lights in a horizontal circle, and a bottom-to-top fade.
vec3 GetEnvColor2(vec3 rayDir, vec3 sunDir)
{
    // fade bottom to top so it looks like the softbox is casting light on a floor
    // and it's bouncing back
    vec3 final = vec3(1.0) * dot(-rayDir, sunDir) * 0.5 + 0.5;
    final *= 0.125;
    // overhead softbox, stretched to a rectangle
    if ((rayDir.y > abs(rayDir.x)*1.0) && (rayDir.y > abs(rayDir.z*0.25))) final = vec3(2.0)*rayDir.y;
    // fade the softbox at the edges with a rounded rectangle.
    float roundBox = length(max(abs(rayDir.xz/max(0.0,rayDir.y))-vec2(0.9, 4.0),0.0))-0.1;
    final += vec3(0.8)* pow(saturate(1.0 - roundBox*0.5), 6.0);
    // purple lights from side
    final += vec3(8.0,6.0,7.0) * saturate(0.001/(1.0 - abs(rayDir.x)));
    // yellow lights from side
    final += vec3(8.0,7.0,6.0) * saturate(0.001/(1.0 - abs(rayDir.z)));
    return vec3(final);
}

/*vec3 GetEnvColorReflection(vec3 rayDir, vec3 sunDir, float ambient)
{
	vec3 tex = textureCube(iChannel0, rayDir).xyz;
	tex = tex * tex;
    vec3 texBack = textureCube(iChannel0, rayDir).xyz;
    vec3 texDark = pow(texBack, vec3(50.0)).zzz;	// fake hdr texture
    texBack += texDark*0.5 * ambient;
    return texBack*texBack*texBack;
}*/

vec3 camPos = vec3(0.0), camFacing;
vec3 camLookat=vec3(0,0.0,0);

// polynomial smooth min (k = 0.1);
float smin( float a, float b, float k )
{
    float h = clamp( 0.5+0.5*(b-a)/k, 0.0, 1.0 );
    return mix( b, a, h ) - k*h*(1.0-h);
}

vec2 matMin(vec2 a, vec2 b)
{
	if (a.x < b.x) return a;
	else return b;
}

float spinTime;
vec3 diagN = normalize(vec3(-1.0));
float cut = 0.77;
float inner = 0.333;
float outness = 1.414;
float finWidth;
float teeth;
float globalTeeth;

vec2 sphereIter(vec3 p, float radius, float subA)
{
    finWidth = 0.1;
    teeth = globalTeeth;
    float blender = 0.25;
    vec2 final = vec2(1000000.0, 0.0);
    for (int i = 0; i < RECURSION_LEVELS; i++)
    {
#ifdef SPLIT_ANIM
        // rotate top and bottom of sphere opposite directions
        p = RotateY(p, spinTime*sign(p.y)*0.05/blender);
#endif
        // main sphere
        float d = length(p) - radius*outness;
#ifdef SPLIT_ANIM
        // subtract out disc at the place where rotation happens so we don't have artifacts
        d = max(d, -(max(length(p) - radius*outness + 0.1, abs(p.y) - finWidth*0.25)));
#endif

        // calc new position at 8 vertices of cube, scaled
        vec3 corners = abs(p) + diagN * radius;
        float lenCorners = length(corners);
        // subtract out main sphere hole, mirrored on all axises
        float subtracter = lenCorners - radius * subA;
        // make mirrored fins that go through all vertices of the cube
        vec3 ap = abs(-p) * 0.7071;	// 1/sqrt(2) to keep distance field normalized
        subtracter = max(subtracter, -(abs(ap.x-ap.y) - finWidth));
        subtracter = max(subtracter, -(abs(ap.y-ap.z) - finWidth));
        subtracter = max(subtracter, -(abs(ap.z-ap.x) - finWidth));
        // subtract sphere from fins so they don't intersect the inner spheres.
        // also animate them so they are like teeth
        subtracter = min(subtracter, lenCorners - radius * subA + teeth);
        // smoothly subtract out that whole complex shape
        d = -smin(-d, subtracter, blender);
        //vec2 sphereDist = sphereB(abs(p) + diagN * radius, radius * inner, cut);	// recurse
        // do a material-min with the last iteration
        final = matMin(final, vec2(d, float(i)));

#ifndef SPLIT_ANIM
        corners = RotateY(corners, spinTime*0.25/blender);
#endif
        // Simple rotate 90 degrees on X axis to keep things fresh
        p = vec3(corners.x, corners.z, -corners.y);
        // Scale things for the next iteration / recursion-like-thing
        radius *= inner;
        teeth *= inner;
        finWidth *= inner;
        blender *= inner;
    }
    // Bring in the final smallest-sized sphere
    float d = length(p) - radius*outness;
    final = matMin(final, vec2(d, 6.0));
    return final;
}

vec2 DistanceToObject(vec3 p)
{
    vec2 distMat = sphereIter(p, 5.2 / outness, cut);
    return distMat;
}

// dirVec MUST BE NORMALIZED FIRST!!!!
float SphereIntersect(vec3 pos, vec3 dirVecPLZNormalizeMeFirst, vec3 spherePos, float rad)
{
    vec3 radialVec = pos - spherePos;
    float b = dot(radialVec, dirVecPLZNormalizeMeFirst);
    float c = dot(radialVec, radialVec) - rad * rad;
    float h = b * b - c;
    if (h < 0.0) return -1.0;
    return -b - sqrt(h);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    localTime = iGlobalTime - 0.0;
	// ---------------- First, set up the camera rays for ray marching ----------------
	vec2 uv = fragCoord.xy/iResolution.xy * 2.0 - 1.0;
    float zoom = 1.7;
    uv /= zoom;

	// Camera up vector.
	vec3 camUp=vec3(0,1,0);

	// Camera lookat.
	camLookat=vec3(0,0.0,0);

    // debugging camera
    float mx=iMouse.x/iResolution.x*PI*2.0-0.7 + localTime*3.1415 * 0.0625*0.666;
	float my=-iMouse.y/iResolution.y*10.0 - sin(localTime * 0.31)*0.5;//*PI/2.01;
	camPos += vec3(cos(my)*cos(mx),sin(my),cos(my)*sin(mx))*(12.2);

	// Camera setup.
	vec3 camVec=normalize(camLookat - camPos);
	vec3 sideNorm=normalize(cross(camUp, camVec));
	vec3 upNorm=cross(camVec, sideNorm);
	vec3 worldFacing=(camPos + camVec);
	vec3 worldPix = worldFacing + uv.x * sideNorm * (iResolution.x/iResolution.y) + uv.y * upNorm;
	vec3 rayVec = normalize(worldPix - camPos);

	// ----------------------------------- Animate ------------------------------------
    localTime = iGlobalTime*0.5;
    // This is a wave function like a triangle wave, but with flat tops and bottoms.
    // period is 1.0
    float rampStep = min(3.0,max(1.0, abs((fract(localTime)-0.5)*1.0)*8.0))*0.5-0.5;
    rampStep = smoothstep(0.0, 1.0, rampStep);
    // lopsided triangle wave - goes up for 3 time units, down for 1.
    float step31 = (max(0.0, (fract(localTime+0.125)-0.25)) - min(0.0,(fract(localTime+0.125)-0.25))*3.0)*0.333;

    spinTime = step31 + localTime;
    //globalTeeth = 0.0 + max(0.0, sin(localTime*3.0))*0.9;
    globalTeeth = rampStep*0.99;
    cut = max(0.48, min(0.77, localTime));
	// --------------------------------------------------------------------------------
	vec2 distAndMat = vec2(0.5, 0.0);
	float t = 0.0;
	//float inc = 0.02;
	float maxDepth = 24.0;
	vec3 pos = vec3(0,0,0);
    marchCount = 0.0;
    // intersect with sphere first as optimization so we don't ray march more than is needed.
    float hit = SphereIntersect(camPos, rayVec, vec3(0.0), 5.6);
    if (hit >= 0.0)
    {
        t = hit;
        // ray marching time
        for (int i = 0; i < 290; i++)	// This is the count of the max times the ray actually marches.
        {
            pos = camPos + rayVec * t;
            // *******************************************************
            // This is _the_ function that defines the "distance field".
            // It's really what makes the scene geometry.
            // *******************************************************
            distAndMat = DistanceToObject(pos);
            // adjust by constant because deformations mess up distance function.
            t += distAndMat.x * 0.7;
            //if (t > maxDepth) break;
            if ((t > maxDepth) || (abs(distAndMat.x) < 0.0025)) break;
            marchCount+= 1.0;
        }
    }
    else
    {
        t = maxDepth + 1.0;
        distAndMat.x = 1000000.0;
    }
    // --------------------------------------------------------------------------------
	// Now that we have done our ray marching, let's put some color on this geometry.

	vec3 sunDir = normalize(vec3(3.93, 10.82, -1.5));
	vec3 finalColor = vec3(0.0);

	// If a ray actually hit the object, let's light it.
	//if (abs(distAndMat.x) < 0.75)
    if (t <= maxDepth)
	{
        // calculate the normal from the distance field. The distance field is a volume, so if you
        // sample the current point and neighboring points, you can use the difference to get
        // the normal.
        vec3 smallVec = vec3(0.005, 0, 0);
        vec3 normalU = vec3(distAndMat.x - DistanceToObject(pos - smallVec.xyy).x,
                           distAndMat.x - DistanceToObject(pos - smallVec.yxy).x,
                           distAndMat.x - DistanceToObject(pos - smallVec.yyx).x);

        vec3 normal = normalize(normalU);

        // calculate 2 ambient occlusion values. One for global stuff and one
        // for local stuff
        float ambientS = 1.0;
        ambientS *= saturate(DistanceToObject(pos + normal * 0.1).x*10.0);
        ambientS *= saturate(DistanceToObject(pos + normal * 0.2).x*5.0);
        ambientS *= saturate(DistanceToObject(pos + normal * 0.4).x*2.5);
        ambientS *= saturate(DistanceToObject(pos + normal * 0.8).x*1.25);
        float ambient = ambientS * saturate(DistanceToObject(pos + normal * 1.6).x*1.25*0.5);
        ambient *= saturate(DistanceToObject(pos + normal * 3.2).x*1.25*0.25);
        ambient *= saturate(DistanceToObject(pos + normal * 6.4).x*1.25*0.125);
        ambient = max(0.035, pow(ambient, 0.3));	// tone down ambient with a pow and min clamp it.
        ambient = saturate(ambient);

        // calculate the reflection vector for highlights
        vec3 ref = reflect(rayVec, normal);
        ref = normalize(ref);

        // Trace a ray for the reflection
        float sunShadow = 1.0;
        float iter = 0.1;
        vec3 nudgePos = pos + normal*0.02;	// don't start tracing too close or inside the object
		for (int i = 0; i < 40; i++)
        {
            float tempDist = DistanceToObject(nudgePos + ref * iter).x;
	        sunShadow *= saturate(tempDist*50.0);
            if (tempDist <= 0.0) break;
            //iter *= 1.5;	// constant is more reliable than distance-based
            iter += max(0.00, tempDist)*1.0;
            if (iter > 4.2) break;
        }
        sunShadow = saturate(sunShadow);

        // ------ Calculate texture color ------
        vec3 texColor;
        texColor = vec3(1.0);// vec3(0.65, 0.5, 0.4)*0.1;
        texColor = vec3(0.85, 0.945 - distAndMat.y * 0.15, 0.93 + distAndMat.y * 0.35)*0.951;
        if (distAndMat.y == 6.0) texColor = vec3(0.91, 0.1, 0.41)*10.5;
        //texColor *= mix(vec3(0.3), vec3(1.0), tex3d(pos*0.5, normal).xxx);
        texColor = max(texColor, vec3(0.0));
        texColor *= 0.25;

        // ------ Calculate lighting color ------
        // Start with sun color, standard lighting equation, and shadow
        vec3 lightColor = vec3(0.0);// sunCol * saturate(dot(sunDir, normal)) * sunShadow*14.0;
        // sky color, hemisphere light equation approximation, ambient occlusion
        lightColor += vec3(0.1,0.35,0.95) * (normal.y * 0.5 + 0.5) * ambient * 0.2;
        // ground color - another hemisphere light
        lightColor += vec3(1.0) * ((-normal.y) * 0.5 + 0.5) * ambient * 0.2;


        // finally, apply the light to the texture.
        finalColor = texColor * lightColor;
        //if (distAndMat.y == ceil(mod(localTime, 4.0))) finalColor += vec3(0.0, 0.41, 0.72)*0.925;

        // reflection environment map - this is most of the light
        vec3 refColor = GetEnvColor2(ref, sunDir)*sunShadow;
        finalColor += refColor * 0.35 * ambient;// * sunCol * sunShadow * 9.0 * texColor.g;

        // fog
		finalColor = mix(vec3(1.0, 0.41, 0.41) + vec3(1.0), finalColor, exp(-t*0.0007));
        // visualize length of gradient of distance field to check distance field correctness
        //finalColor = vec3(0.5) * (length(normalU) / smallVec.x);
	}
    else
    {
	    finalColor = GetEnvColor2(rayVec, sunDir);// + vec3(0.1, 0.1, 0.1);
    }
    //finalColor += marchCount * vec3(1.0, 0.3, 0.91) * 0.001;

    // vignette?
    //finalColor *= vec3(1.0) * saturate(1.0 - length(uv/2.5));
    //finalColor *= 1.95;

	// output the final color with sqrt for "gamma correction"
	fragColor = vec4(sqrt(clamp(finalColor, 0.0, 1.0)),1.0);
}




//_______________________________________________________________________________________________________





void main( void)
{
	mainImage(gl_FragColor, gl_FragCoord.xy);
}