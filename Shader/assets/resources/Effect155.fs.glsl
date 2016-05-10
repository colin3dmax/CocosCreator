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
^ This means do ANYTHING YOU WANT with this code. Because we are programmers, not lawyers.
-Otavio Good
*/

// ---------------- Config ----------------
// This is an option that lets you render high quality frames for screenshots. It enables
// stochastic antialiasing and motion blur automatically for any shader.
//#define NON_REALTIME_HQ_RENDER
const float frameToRenderHQ = 15.1; // Time in seconds of frame to render
const float antialiasingSamples = 16.0; // 16x antialiasing - too much might make the shader compiler angry.

//#define MANUAL_CAMERA


// --------------------------------------------------------
// These variables are for the non-realtime block renderer.
float localTime = 0.0;
float seed = 1.0;

// Animation variables
float fade = 1.0;
float exposure = 1.0;

// other
float marchCount = 0.0;

// ---- noise functions ----
float v31(vec3 a)
{
    return a.x + a.y * 37.0 + a.z * 521.0;
}
float v21(vec2 a)
{
    return a.x + a.y * 37.0;
}
float Hash11(float a)
{
    return fract(sin(a)*10403.9);
}
float Hash21(vec2 uv)
{
    float f = uv.x + uv.y * 37.0;
    return fract(sin(f)*104003.9);
}
vec2 Hash22(vec2 uv)
{
    float f = uv.x + uv.y * 37.0;
    return fract(cos(f)*vec2(10003.579, 37049.7));
}
vec2 Hash12(float f)
{
    return fract(cos(f)*vec2(10003.579, 37049.7));
}

const float PI=3.14159265;

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

// Make a procedural environment map with a giant softbox light.
vec3 GetEnvColor2(vec3 rayDir)
{
    // fade bottom to top so it looks like the softbox is casting light on a floor
    // and it's bouncing back
    vec3 final = vec3(1.0) * dot(rayDir, /*sunDir*/ vec3(0.0, 1.0, 0.0)) * 0.5 + 0.5;
    final *= 0.25;
    // overhead softbox, stretched to a rectangle
    if ((rayDir.y > abs(rayDir.x)*1.0) && (rayDir.y > abs(rayDir.z*0.25))) final = vec3(2.0)*rayDir.y;
    // fade the softbox at the edges with a rounded rectangle.
    float roundBox = length(max(abs(rayDir.xz/max(0.0,rayDir.y))-vec2(0.9, 4.0),0.0))-0.1;
    final += vec3(0.8)* pow(saturate(1.0 - roundBox*0.5), 6.0);
    // purple lights from side
    //final += vec3(8.0,6.0,7.0) * saturate(0.001/(1.0 - abs(rayDir.x)));
    // yellow lights from side
    //final += vec3(8.0,7.0,6.0) * saturate(0.001/(1.0 - abs(rayDir.z)));
    return vec3(final);
}

// min function that supports materials in the y component
vec2 matmin(vec2 a, vec2 b)
{
    if (a.x < b.x) return a;
    else return b;
}

// ---- shapes defined by distance fields ----
// See this site for a reference to more distance functions...
// http://iquilezles.org/www/articles/distfunctions/distfunctions.htm

// signed box distance field
float sdBox(vec3 p, vec3 radius)
{
  vec3 dist = abs(p) - radius;
  return min(max(dist.x, max(dist.y, dist.z)), 0.0) + length(max(dist, 0.0));
}

// capped cylinder distance field
float cylCap(vec3 p, float r, float lenRad)
{
    float a = length(p.xy) - r;
    a = max(a, abs(p.z) - lenRad);
    return a;
}

float cyl(vec3 p, float rad)
{
    return length(p.xy) - rad;
}

float sdTorus(vec3 p, vec2 radOuterInner)
{
  vec2 cylAndHeight = vec2(length(p.xz) - radOuterInner.x, p.y);
  return length(cylAndHeight) - radOuterInner.y;
}

float sSphere(vec3 p, float rad)
{
    return length(p) - rad;
}

// k should be negative. -4.0 works nicely.
// smooth blending function
float smin(float a, float b, float k)
{
	return log2(exp2(k*a)+exp2(k*b))/k;
}

float Repeat(float a, float len)
{
    return mod(a, len) - 0.5 * len;
}

vec3 RadialRepeat(vec3 p, float ang)
{
    float len = length(p.xz);
    float a = atan(p.z, p.x);// / PI;
    a = Repeat(a, PI/ang);
    return vec3(cos(a)*len, p.y, sin(a)*len);
}

float MakeGear(vec3 p, float rad, float side)
{
    p = RotateZ(p, -localTime + PI * 0.2 + (side-1.0)*0.39);
    p.xzy = RadialRepeat(p.xzy, 2.0);
    float gear = sdTorus((p - vec3(1.5, 0.0, 0.0)).xzy, vec2(rad-0.3, 0.1));
    return gear;
}

// This is the distance function that defines all the scene's geometry.
// The input is a position in space.
// The output is the distance to the nearest surface and a material index.
vec2 DistanceToObject(vec3 p)
{
    // make a box where the space is subdivided around in a circle.
    // Then subtract out a few cylinders to get the dynamic ball-roller.
    vec3 orig = p;
    p += vec3(0.0, 0.0, 0.0);
    float wobble = -localTime * 4.0 - PI*0.5;
    vec3 wobble2 = vec3(cos(wobble), 0.0, sin(wobble))*0.5;
    p += wobble2;
    vec2 distAndMat = vec2(0.0);
    float a = atan(p.z, p.x);// / PI;
    vec3 rep = RadialRepeat(p, 4096.0);
    distAndMat.x = length(rep- vec3(3.5, 0.0, 0.0)) - 0.4;
    a = (a+0.5);
    rep = RotateZ(rep - vec3(3.5, 0.0, 0.0), localTime+a*0.25) + vec3(3.5, 0.0, 0.0);
    distAndMat.x = sdBox(rep - vec3(3.5, 0.0, 0.0), vec3(0.95,0.95,2.9));
    distAndMat.x = max(distAndMat.x, -cyl(rep - vec3(3.5, 0.0, 0.0), 0.9));

    float crad = 1.38;
    float disp = 2.0;
    vec3 railMirror = vec3(rep.x - 3.5, abs(rep.y) - disp, rep.z);
    distAndMat.x = max(distAndMat.x, -cyl(railMirror, crad));
    railMirror = vec3(abs(rep.x - 3.5) - disp, rep.y, rep.z);
    distAndMat.x = max(distAndMat.x, -cyl(railMirror, crad));
    //distAndMat.x = max(distAndMat.x, -cyl(rep - vec3(3.5, -disp, 0.0), crad));
    //distAndMat.x = max(distAndMat.x, -cyl(rep - vec3(3.5, disp, 0.0), crad));
    //distAndMat.x = max(distAndMat.x, -cyl(rep - vec3(3.5+disp, 0.0, 0.0), crad));
    //distAndMat.x = max(distAndMat.x, -cyl(rep - vec3(3.5-disp, 0.0, 0.0), crad));

    // Make the ball and material. Rotate it around.
    float ball = length(RotateY(p, localTime*4.0) - vec3(-2.57, 0.73, 0.0)) - 0.7;
    distAndMat = matmin(distAndMat, vec2(ball, 1.0));

    // Make the clover-gears
    vec3 gPos = orig;
    float side = sign(gPos.x);
    gPos.x = abs(gPos.x);
    gPos -= vec3(3.4 - wobble2.x/1.414*side, -3.3, 0.0);
    float gear = MakeGear(gPos, crad, side);
    distAndMat = matmin(distAndMat, vec2(gear, 4.0));

    // Make the torus and supports
    float torus = sdTorus(orig + vec3(0.0 + wobble2.x/1.414, 3.3, 0.0), vec2(3.4, 0.32));
    vec3 mirror = orig;
    mirror.z = abs(mirror.z);
    vec3 blobPos = (mirror + vec3(wobble2.x, 3.3, -3.4)).zxy;
    float blob = sdTorus(blobPos, vec2(0.4, 0.15));
    torus = min(torus, cylCap(blobPos + vec3(-0.4, 0.0, 8.0), 0.15, 8.0));
    torus = min(torus, blob);
    distAndMat = matmin(distAndMat, vec2(torus, 5.0));

    // Make the middle spiral and the turntable base
    vec3 warp = RotateY(orig, localTime*4.0);
    float p0 = p.y;
    float p1 = p.y;
    float w2 = warp.y+PI*0.34;
    float spiral = length(warp.xz + vec2(cos(w2), sin(w2))*((p0*p0)*0.07) ) - 0.2;
    float spiral2 = length(warp.xz + vec2(-cos(w2), -sin(w2))*(((p1)*(p1))*0.05) ) - 0.1;
    spiral = min(spiral, spiral2);
    spiral *= 0.35;
    spiral = max(spiral, abs(p.y)-6.5);
    float base = min(spiral, (length(orig.xz) + orig.y*2.0)*0.5+4.7);
    base = max(base, cylCap(orig.xzy + vec3(0.0, 0.0, 6.6+4.0), 5.22, 4.4));
    base = max(base, -sdTorus(orig + vec3(0.0, 6.25, 0.0), vec2(3.1, 0.0625)));
    vec3 mirrorOrig = vec3(orig.x, abs(orig.z) - 3.9, orig.y);
    base = max(base, -cyl(mirrorOrig, 0.7));
    spiral = min(base, spiral);
    distAndMat = matmin(distAndMat, vec2(spiral, 2.0));

    return distAndMat;
}

// Input is UV coordinate of pixel to render.
// Output is RGB color.
vec3 RayTrace(in vec2 fragCoord )
{
    marchCount = 0.0;
    fade = 1.0;

	vec3 camPos, camUp, camLookat;
	// ------------------- Set up the camera rays for ray marching --------------------
    // Map uv to [-1.0..1.0]
	vec2 uv = fragCoord.xy/iResolution.xy * 2.0 - 1.0;
    uv /= 2.0;  // zoom in

#ifdef MANUAL_CAMERA
    // Camera up vector.
	camUp=vec3(0,1,0);

	// Camera lookat.
	camLookat=vec3(0,-1.5,0);

    // debugging camera
    float mx=-iMouse.x/iResolution.x*PI*2.0;
	float my=iMouse.y/iResolution.y*3.14*0.95 + PI/2.0;
	camPos = vec3(cos(my)*cos(mx),sin(my),cos(my)*sin(mx))*12.0;
#else
    // Do the camera fly-by animation and different scenes.
    // Time variables for start and end of each scene
    const float t0 = 0.0;
    const float t1 = 12.0;
    const float t2 = 20.0;
    const float t3 = 38.0;
    // Repeat the animation after time t3
    localTime = fract(localTime / t3) * t3;
    if (localTime < t1)
    {
        float time = localTime - t0;
        float alpha = time / (t1 - t0);
        fade = saturate(time);
        fade *= saturate(t1 - localTime);
        camPos = vec3(0.0, -8.0, -8.0);
        camPos.x -= smoothstep(0.0, 1.0, alpha) * 5.0;
        camPos.y += smoothstep(0.0, 1.0, alpha) * 9.0;
        camPos.z -= smoothstep(0.0, 1.0, alpha) * 6.0;
        camUp=vec3(0,1,0);
        camLookat=vec3(0,-2.5,1.5);
    } else if (localTime < t2)
    {
        float time = localTime - t1;
        float alpha = time / (t2 - t1);
        fade = saturate(time);
        fade *= saturate(t2 - localTime);
        camPos = vec3(12.0, 8.3, -0.5);
        camPos.y -= alpha * 5.5;
        camPos.x = cos(alpha*1.0) * 5.2;
        camPos.z = sin(alpha*1.0) * 5.2;
        camUp=normalize(vec3(0,1,-0.5 + alpha * 0.5));
        camLookat=vec3(0,1.0,-0.5);
    } else if (localTime < t3)
    {
        float time = localTime - t2;
        float alpha = time / (t3 - t2);
        fade = saturate(time);
        fade *= saturate(t3 - localTime);
        camPos = vec3(-9.0, 1.3, -10.0);
        camPos.y -= alpha * 8.0;
        camPos.x += alpha * 7.0;
        camUp=normalize(vec3(0,1,0.0));
        camLookat=vec3(0.0,-2.0,0.0);
    }
#endif

	// Camera setup for ray tracing / marching
	vec3 camVec=normalize(camLookat - camPos);
	vec3 sideNorm=normalize(cross(camUp, camVec));
	vec3 upNorm=cross(camVec, sideNorm);
	vec3 worldFacing=(camPos + camVec);
	vec3 worldPix = worldFacing + uv.x * sideNorm * (iResolution.x/iResolution.y) + uv.y * upNorm;
	vec3 rayVec = normalize(worldPix - camPos);

	// ----------------------------- Ray march the scene ------------------------------
	vec2 distAndMat;  // Distance and material
	float t = 0.05;
	const float maxDepth = 22.0; // farthest distance rays will travel
	vec3 pos = vec3(0.0);
    const float smallVal = 0.00625;
	// ray marching time
    for (int i = 0; i <180; i++)	// This is the count of the max times the ray actually marches.
    {
        marchCount+=1.0;
        // Step along the ray.
        pos = (camPos + rayVec * t);
        // This is _the_ function that defines the "distance field".
        // It's really what makes the scene geometry. The idea is that the
        // distance field returns the distance to the closest object, and then
        // we know we are safe to "march" along the ray by that much distance
        // without hitting anything. We repeat this until we get really close
        // and then break because we have effectively hit the object.
        distAndMat = DistanceToObject(pos);

        // move down the ray a safe amount
        t += distAndMat.x;
        // If we are very close to the object, let's call it a hit and exit this loop.
        if ((t > maxDepth) || (abs(distAndMat.x) < smallVal)) break;
    }

	// --------------------------------------------------------------------------------
	// Now that we have done our ray marching, let's put some color on this geometry.
	vec3 finalColor = vec3(0.0);

	// If a ray actually hit the object, let's light it.
    if (t <= maxDepth)
	{
        float dist = distAndMat.x;
        // calculate the normal from the distance field. The distance field is a volume, so if you
        // sample the current point and neighboring points, you can use the difference to get
        // the normal.
        vec3 smallVec = vec3(smallVal, 0, 0);
        vec3 normalU = vec3(dist - DistanceToObject(pos - smallVec.xyy).x,
                           dist - DistanceToObject(pos - smallVec.yxy).x,
                           dist - DistanceToObject(pos - smallVec.yyx).x);
        vec3 normal = normalize(normalU);

        // calculate the reflection vector for highlights
        vec3 ref = reflect(rayVec, normal);

        // Trace a relection ray
        float refShadow = 1.0;
        float iter = 0.01;
        vec3 nudgePos = pos + normal*0.002;	// don't start tracing too close or inside the object
		for (int i = 0; i < 40; i++)
        {
            vec3 shadowPos = nudgePos + ref * iter;
            vec2 tempDistAndMat = DistanceToObject(shadowPos);
	        refShadow *= saturate(tempDistAndMat.x*150.0);	// Shadow hardness
            if (tempDistAndMat.x <= 0.0) break;

            iter += max(0.05, tempDistAndMat.x);
            if (iter > 7.5) break;
        }
        refShadow = saturate(refShadow);

        // ------ Calculate texture color  ------
        vec3 texColor = vec3(0.95, 1.0, 1.0);
        if (distAndMat.y == 2.0) texColor = vec3(0.5, 0.3, 0.3)*0.03;
        if (distAndMat.y == 0.0) texColor = vec3(0.3,0.25,0.25)*0.1;
        if (distAndMat.y == 1.0) texColor = vec3(0.2, 0.3, 0.71)*0.1;
        if (distAndMat.y == 4.0) texColor = vec3(0.01, 0.01, 0.01)*0.2;
        if (distAndMat.y == 5.0) texColor = vec3(1.0, 1.0, 1.0)*0.0015;
        texColor = saturate(texColor);

        // ------ Calculate lighting color ------
        vec3 lightColor = vec3(0.0);
        // Add sky color with ambient acclusion
        lightColor += (/*skyCol */ saturate(normal.y *0.5+0.5))*2.5;

        // finally, apply the light to the texture.
        finalColor = texColor * lightColor;
        if (distAndMat.y == 1.0) finalColor += vec3(0.5, 0.1, 0.3)*0.5*dot(normal, -rayVec);
        //vec3 refColor = GetEnvMapSkyline(ref, sunDir, pos.y-1.5)*max(0.2,sunShadow);
        vec3 refColor = GetEnvColor2(ref) * (refShadow + 0.5) * 0.5;
        if (distAndMat.y == 0.0) refColor *= vec3(1.0, 0.5, 0.2)*3.0*dot(normal, -rayVec);
        if (distAndMat.y == 5.0) refColor *= vec3(0.7, 0.75, 0.82)*1.0*dot(normal, -rayVec);
        float fresnel = saturate(1.0 - dot(-rayVec, normal));
        fresnel = mix(0.5, 1.0, fresnel);
        finalColor += refColor * fresnel * 0.8;

        // visualize length of gradient of distance field to check distance field correctness
        //finalColor = vec3(0.5) * (length(normalU) / smallVec.x);
        //finalColor = vec3(marchCount)/255.0;
        //finalColor = normal * 0.5 + 0.5;
	}
    else
    {
        // Our ray trace hit nothing, so draw background.
        finalColor = GetEnvColor2(rayVec);
    }
    finalColor += marchCount *vec3(1.0, 0.5, 0.7)*0.001;

    // vignette?
    finalColor *= vec3(1.0) * saturate(1.0 - length(uv/2.5));
    finalColor *= exposure;

	// output the final color without gamma correction - will do gamma later.
	return vec3(clamp(finalColor, 0.0, 1.0)*saturate(fade));
}

#ifdef NON_REALTIME_HQ_RENDER
// This function breaks the image down into blocks and scans
// through them, rendering 1 block at a time. It's for non-
// realtime things that take a long time to render.

// This is the frame rate to render at. Too fast and you will
// miss some blocks.
const float blockRate = 20.0;
void BlockRender(in vec2 fragCoord)
{
    // blockSize is how much it will try to render in 1 frame.
    // adjust this smaller for more complex scenes, bigger for
    // faster render times.
    const float blockSize = 64.0;
    // Make the block repeatedly scan across the image based on time.
    float frame = floor(iGlobalTime * blockRate);
    vec2 blockRes = floor(iResolution.xy / blockSize) + vec2(1.0);
    // ugly bug with mod.
    //float blockX = mod(frame, blockRes.x);
    float blockX = fract(frame / blockRes.x) * blockRes.x;
    //float blockY = mod(floor(frame / blockRes.x), blockRes.y);
    float blockY = fract(floor(frame / blockRes.x) / blockRes.y) * blockRes.y;
    // Don't draw anything outside the current block.
    if ((fragCoord.x - blockX * blockSize >= blockSize) ||
    	(fragCoord.x - (blockX - 1.0) * blockSize < blockSize) ||
    	(fragCoord.y - blockY * blockSize >= blockSize) ||
    	(fragCoord.y - (blockY - 1.0) * blockSize < blockSize))
    {
        discard;
    }
}
#endif

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
#ifdef NON_REALTIME_HQ_RENDER
    // Optionally render a non-realtime scene with high quality
    BlockRender(fragCoord);
#endif

    // Do a multi-pass render
    vec3 finalColor = vec3(0.0);
#ifdef NON_REALTIME_HQ_RENDER
    for (float i = 0.0; i < antialiasingSamples; i++)
    {
        const float motionBlurLengthInSeconds = 1.0 / 60.0;
        // Set this to the time in seconds of the frame to render.
	    localTime = frameToRenderHQ;
        // This line will motion-blur the renders
        localTime += Hash11(v21(fragCoord + seed)) * motionBlurLengthInSeconds;
        // Jitter the pixel position so we get antialiasing when we do multiple passes.
        vec2 jittered = fragCoord.xy + vec2(
            Hash21(fragCoord + seed),
            Hash21(fragCoord*7.234567 + seed)
            );
        // don't antialias if only 1 sample.
        if (antialiasingSamples == 1.0) jittered = fragCoord;
        // Accumulate one pass of raytracing into our pixel value
	    finalColor += RayTrace(jittered);
        // Change the random seed for each pass.
	    seed *= 1.01234567;
    }
    // Average all accumulated pixel intensities
    finalColor /= antialiasingSamples;
#else
    // Regular real-time rendering
    localTime = iGlobalTime;
    finalColor = RayTrace(fragCoord);
#endif

    fragColor = vec4(sqrt(clamp(finalColor, 0.0, 1.0)),1.0);
}



//_______________________________________________________________________________________________________





void main( void)
{
	mainImage(gl_FragColor, gl_FragCoord.xy);
}