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
// Spout - @P_Malin

//#define LOW_QUALITY

#ifdef LOW_QUALITY
    #define kRaymarchMaxIter 16
#else
    #define kRaymarchMaxIter 32
    
    #define ENABLE_AMBIENT_OCCLUSION
    #define DOUBLE_SIDED_TRANSPARENCY
#endif

#define ENABLE_SPECULAR
#define ENABLE_REFLECTIONS
#define ENABLE_TRANSPARENCY
#define ENABLE_SHADOWS
#define ENABLE_FOG

#define ENABLE_DIRECTIONAL_LIGHT
#define ENABLE_DIRECTIONAL_LIGHT_FLARE

//#define ENABLE_POINT_LIGHT
//#define ENABLE_POINT_LIGHT_FLARE

const float kPipeRadius = 0.4;
const float kPipeThickness = 0.15;
const float kPipeHeight = 2.0;
//float kPipeHeight = 2.0 + sin(iGlobalTime);

const float kWaterNoiseScale = 0.025;

const float kWaterVelocity = 1.0;

const float kWaterAccel = -1.0;

const float kWaterAnimSpeed = 80.0;
const float kTrenchWaterAnimSpeed = 20.0;



float kRipplePos = sqrt(abs(2.0 * kPipeHeight / kWaterAccel)) * kWaterVelocity;

const float kPI = 3.141592654;
const float kTwoPI = kPI * 2.0;

const float kNoTransparency = -1.0;
const float kTransparency = 1.0;
const float kInverseTransparency = 0.0;

struct C_Ray
{
    vec3 vOrigin;
    vec3 vDir;
    float fStartDistance;
    float fLength;
};

struct C_HitInfo
{
    vec3 vPos;
    float fDistance;
    vec3 vObjectId;
};
    
struct C_Surface
{
    vec3 vNormal;
    vec3 cReflection;
    vec3 cTransmission;    
};

struct C_Material
{
    vec3 cAlbedo;
    float fR0;
    float fSmoothness;
    vec2 vParam;

    float fTransparency;
    float fRefractiveIndex;
};

struct C_Shading
{
    vec3 cDiffuse;
    vec3 cSpecular;
};

struct C_PointLight
{
    vec3 vPos;
    vec3 cColour;
};

struct C_DirectionalLight
{
    vec3 vDir;
    vec3 cColour;
};

vec3 RotateX( const in vec3 vPos, const in float fAngle )
{
    float s = sin(fAngle);
    float c = cos(fAngle);
    
    vec3 vResult = vec3( vPos.x, c * vPos.y + s * vPos.z, -s * vPos.y + c * vPos.z);
    
    return vResult;
}

vec3 RotateY( const in vec3 vPos, const in float fAngle )
{
    float s = sin(fAngle);
    float c = cos(fAngle);
    
    vec3 vResult = vec3( c * vPos.x + s * vPos.z, vPos.y, -s * vPos.x + c * vPos.z);
    
    return vResult;
}

vec3 RotateZ( const in vec3 vPos, const in float fAngle )
{
    float s = sin(fAngle);
    float c = cos(fAngle);
    
    vec3 vResult = vec3( c * vPos.x + s * vPos.y, -s * vPos.x + c * vPos.y, vPos.z);
    
    return vResult;
}

/////////////////////////////////////
// Distance Field CSG
// These carry with them the material parameters in yzw

vec4 DistCombineUnion( const in vec4 v1, const in vec4 v2 )
{
    //if(v1.x < v2.x) return v1; else return v2;
    return mix(v1, v2, step(v2.x, v1.x));
}

vec4 DistCombineUnionTransparent( const in vec4 v1, const in vec4 v2, const in float fTransparentScale )
{    
	//if( fCondition < 0.0 )
	//            return v1;
	
	// Negate the distance to the transparency object if transparent scale is 0.0     
	// This allows us to ratrace "out" of transparency
	
	vec4 vScaled = vec4(v2.x * (fTransparentScale * 2.0 - 1.0), v2.yzw);
                
	// The condition allows us to ignore transparency for secondary rays
    return mix(v1, vScaled, step(vScaled.x, v1.x) * step(0.0, fTransparentScale));
}

vec4 DistCombineIntersect( const in vec4 v1, const in vec4 v2 )
{
    return mix(v2, v1, step(v2.x,v1.x));
}

vec4 DistCombineSubtract( const in vec4 v1, const in vec4 v2 )
{
    return DistCombineIntersect(v1, vec4(-v2.x, v2.yzw));
}

/////////////////////////////////////
// Scene Description 

const float kMaterialIdWall = 1.0;
const float kMaterialIdPipe = 2.0;
const float kMaterialIdWater = 3.0;

float Noise(vec2 p)
{
    vec2 s = sin(p * 0.6345) + sin(p * 1.62423);
    return dot(s, vec2(0.125)) + 0.5;
}

// result is x=scene distance y=material or object id; zw are material specific parameters (maybe uv co-ordinates)
vec4 GetDistanceScene( const in vec3 vPos, const in float fTransparentScale )
{          
    vec4 vResult = vec4(10000.0, -1.0, 0.0, 0.0);
            
	float fDistFloor = vPos.y;
	float fDistBrick = fDistFloor;
	
	float fDistTrench = length(vPos.yz + vec2(-0.4, 0.0)) - 1.0;
	fDistBrick = max(fDistBrick, -(fDistTrench));
	
	float fDistWall = vPos.x + 1.0;
	fDistBrick = min(fDistBrick, fDistWall);
	
    vec4 vDistFloor = vec4(fDistBrick, kMaterialIdWall, vPos.xz + vec2(vPos.y, 0.0));
    vResult = DistCombineUnion(vResult, vDistFloor);    

    vec3 vWaterDomain = vPos - vec3(0.0, kPipeHeight, 0.0);

    float t= max(vWaterDomain.x / kWaterVelocity, 0.0);
	
	// Equations of motion
	float s = 0.5 * kWaterAccel * t * t;
	float v = -kWaterAccel * t;
	
	vWaterDomain.y -= s;    
                
    float fDistWater = (length(vWaterDomain.yz) - kPipeRadius);
                
    float fDistPipe = max(fDistWater - kPipeThickness, vWaterDomain.x);
    fDistPipe = max(fDistPipe, -fDistWater); // subtract the water from the pipe to make the hole
    vec4 vDistPipe = vec4(fDistPipe, kMaterialIdPipe, vPos.xy);        
        
    vResult = DistCombineUnion(vResult, vDistPipe);    
	
	// compensate for domain distortion of water, otherwise ray sometimes misses
	fDistWater /= (1.0 + v * 0.5);
	
    vec2 vNoiseDomain = vPos.xz;
                
	// modify noise for water in trench
	float fInTrench = step(vPos.y, (-0.1 + 0.05));        
	vec2 vRippleCentre1 = vPos.xz - vec2(kRipplePos, 0.0);
	vNoiseDomain.x = mix(vNoiseDomain.x, length(vRippleCentre1), fInTrench);
	float fNoiseScale = mix(t * t, 1.0 / (1.0 + vNoiseDomain.x), fInTrench) * kWaterNoiseScale;
	float fWaterSpeed = mix(kWaterAnimSpeed * kWaterVelocity, kTrenchWaterAnimSpeed, fInTrench);
	
	vNoiseDomain *= 30.0; 
	vNoiseDomain.x += -iGlobalTime * fWaterSpeed;
	
	float fTrenchWaterDist = vPos.y + 0.1;
	fDistWater = min(fDistWater, fTrenchWaterDist);
	
	fDistWater += Noise(vNoiseDomain) * fNoiseScale;
	
	vec4 vDistWater = vec4(fDistWater, kMaterialIdWater, vPos.xy);        
	vResult = DistCombineUnionTransparent(vResult, vDistWater, fTransparentScale);
              
    return vResult;
}

float GetRayFirstStep( const in C_Ray ray )
{
    return ray.fStartDistance;  
}

C_Material GetObjectMaterial( const in C_HitInfo hitInfo )
{
    C_Material mat;
              
    if(hitInfo.vObjectId.x == kMaterialIdWall)
    {
        // floor
        mat.fR0 = 0.02;
                                
		// Textureless version
		//vec2 vTile = step(vec2(0.15), fract(hitInfo.vObjectId.yz));
		//float fTile = vTile.x * vTile.y;
        //mat.cAlbedo = vec3(1.0) * (fTile * 0.8 + 0.2);
        //mat.fSmoothness = 1.0;
        
        vec3 cTexture = texture2D(iChannel0, hitInfo.vObjectId.yz * 0.25).rgb;
        mat.cAlbedo = cTexture * cTexture;
        mat.fSmoothness = mat.cAlbedo.r;
        mat.fTransparency = 0.0;
    }
    else
    if(hitInfo.vObjectId.x == kMaterialIdPipe)
    {
        // pipe
        mat.fR0 = 0.8;
        mat.fSmoothness = 1.0;
        mat.cAlbedo = vec3(0.5);
        mat.fTransparency = 0.0;
    }
    else
    {
        // water
        mat.fR0 = 0.01;
        mat.fSmoothness = 1.0;
        mat.fTransparency = 1.0;
        mat.fRefractiveIndex = 1.0 / 1.3330;
        const float fExtinctionScale = 2.0;
		const vec3 vExtinction = vec3(0.3, 0.7, 0.9);
        mat.cAlbedo = (vec3(1.0) - vExtinction) * fExtinctionScale; // becomes extinction for transparency
    }
    
    return mat;
}

vec3 GetSkyGradient( const in vec3 vDir )
{
    const vec3 cColourTop = vec3(0.7, 0.8, 1.0);
    const vec3 cColourHorizon = cColourTop * 0.5;

    float fBlend = clamp(vDir.y, 0.0, 1.0);
    return mix(cColourHorizon, cColourTop, fBlend);
}

C_PointLight GetPointLight()
{
    C_PointLight result;

    result.vPos = vec3(0.5, 1.0, -2.0);
    result.cColour = vec3(32.0, 6.0, 1.0) * 10.0;

    return result;
}

C_DirectionalLight GetDirectionalLight()
{
    C_DirectionalLight result;

    result.vDir = normalize(vec3(-0.2, -0.3, 0.5));
    result.cColour = vec3(8.0, 7.5, 7.0);

    return result;
}

vec3 GetAmbientLight(const in vec3 vNormal)
{
    return GetSkyGradient(vNormal);
}

/////////////////////////////////////
// Raymarching 

vec3 GetSceneNormal( const in vec3 vPos, const in float fTransparentScale )
{
    // tetrahedron normal
    const float fDelta = 0.025;

    vec3 vOffset1 = vec3( fDelta, -fDelta, -fDelta);
    vec3 vOffset2 = vec3(-fDelta, -fDelta,  fDelta);
    vec3 vOffset3 = vec3(-fDelta,  fDelta, -fDelta);
    vec3 vOffset4 = vec3( fDelta,  fDelta,  fDelta);

    float f1 = GetDistanceScene( vPos + vOffset1, fTransparentScale ).x;
    float f2 = GetDistanceScene( vPos + vOffset2, fTransparentScale ).x;
    float f3 = GetDistanceScene( vPos + vOffset3, fTransparentScale ).x;
    float f4 = GetDistanceScene( vPos + vOffset4, fTransparentScale ).x;

    vec3 vNormal = vOffset1 * f1 + vOffset2 * f2 + vOffset3 * f3 + vOffset4 * f4;

    return normalize( vNormal );
}

#define kRaymarchEpsilon 0.01
// This is an excellent resource on ray marching -> http://www.iquilezles.org/www/articles/distfunctions/distfunctions.htm
void Raymarch( const in C_Ray ray, out C_HitInfo result, const int maxIter, const float fTransparentScale )
{        
    result.fDistance = GetRayFirstStep( ray );
    result.vObjectId.x = 0.0;
        
    for(int i=0;i<=kRaymarchMaxIter;i++)              
    {
        result.vPos = ray.vOrigin + ray.vDir * result.fDistance;
        vec4 vSceneDist = GetDistanceScene( result.vPos, fTransparentScale );
        result.vObjectId = vSceneDist.yzw;
        
        // abs allows backward stepping - should only be necessary for non uniform distance functions
        if((abs(vSceneDist.x) <= kRaymarchEpsilon) || (result.fDistance >= ray.fLength) || (i > maxIter))
        {
            break;
        }                        

        result.fDistance = result.fDistance + vSceneDist.x; 
    }


    if(result.fDistance >= ray.fLength)
    {
        result.fDistance = 1000.0;
        result.vPos = ray.vOrigin + ray.vDir * result.fDistance;
        result.vObjectId.x = 0.0;
    }
}

float GetShadow( const in vec3 vPos, const in vec3 vNormal, const in vec3 vLightDir, const in float fLightDistance )
{
    #ifdef ENABLE_SHADOWS
		C_Ray shadowRay;
		shadowRay.vDir = vLightDir;
		shadowRay.vOrigin = vPos;
		const float fShadowBias = 0.05;
		shadowRay.fStartDistance = fShadowBias / abs(dot(vLightDir, vNormal));
		shadowRay.fLength = fLightDistance - shadowRay.fStartDistance;
	
		C_HitInfo shadowIntersect;
		Raymarch(shadowRay, shadowIntersect, 32, kNoTransparency);
		
		float fShadow = step(0.0, shadowIntersect.fDistance) * step(fLightDistance, shadowIntersect.fDistance );
		
		return fShadow;          
    #else
    	return 1.0;
    #endif
}

// use distance field to evaluate ambient occlusion
float GetAmbientOcclusion(const in C_HitInfo intersection, const in C_Surface surface)
{
    #ifdef ENABLE_AMBIENT_OCCLUSION    
		vec3 vPos = intersection.vPos;
		vec3 vNormal = surface.vNormal;
	
		float fAmbientOcclusion = 1.0;
	
		float fDist = 0.0;
		for(int i=0; i<=5; i++)
		{
			fDist += 0.1;
	
			vec4 vSceneDist = GetDistanceScene(vPos + vNormal * fDist, kNoTransparency);
	
			fAmbientOcclusion *= 1.0 - max(0.0, (fDist - vSceneDist.x) * 0.2 / fDist );                                  
		}
	
		return fAmbientOcclusion;
    #else
	    return 1.0;
    #endif    
}

/////////////////////////////////////
// Lighting and Shading

#define kFogDensity 0.05

void ApplyAtmosphere(inout vec3 col, const in C_Ray ray, const in C_HitInfo hitInfo)
{
    #ifdef ENABLE_FOG
    // fog
    float fFogAmount = exp(hitInfo.fDistance * -kFogDensity);
    vec3 cFog = GetSkyGradient(ray.vDir);

    #ifdef ENABLE_DIRECTIONAL_LIGHT_FLARE
    C_DirectionalLight directionalLight = GetDirectionalLight();
    float fDirDot = clamp(dot(-directionalLight.vDir, ray.vDir), 0.0, 1.0);
    cFog += directionalLight.cColour * pow(fDirDot, 10.0);
    #endif 

    col = mix(cFog, col, fFogAmount);
    #endif

    // glare from light (a bit hacky - use length of closest approach from ray to light)
    #ifdef ENABLE_POINT_LIGHT_FLARE
    C_PointLight pointLight = GetPointLight();

    vec3 vToLight = pointLight.vPos - ray.vOrigin;
    float fPointDot = dot(vToLight, ray.vDir);
    fPointDot = clamp(fPointDot, 0.0, hitInfo.fDistance);

    vec3 vClosestPoint = ray.vOrigin + ray.vDir * fPointDot;
    float fDist = length(vClosestPoint - pointLight.vPos);
    col += pointLight.cColour * 0.01/ (fDist * fDist);
    #endif    
}

// http://en.wikipedia.org/wiki/Schlick's_approximation
float Schlick( const in vec3 vHalf, const in vec3 vView, const in float fR0, const in float fSmoothFactor)
{
    float fDot = dot(vHalf, -vView);
    fDot = clamp((1.0 - fDot), 0.0, 1.0);
    float fDotPow = pow(fDot, 5.0);
    return fR0 + (1.0 - fR0) * fDotPow * fSmoothFactor;
}

vec3 ApplyFresnel(const in vec3 vDiffuse, const in vec3 vSpecular, const in vec3 vNormal, const in vec3 vView, const in C_Material material)
{
	vec3 vReflect = reflect(vView, vNormal);
	vec3 vHalf = normalize(vReflect + -vView);
    float fFresnel = Schlick(vHalf, vView, material.fR0, material.fSmoothness * 0.9 + 0.1);
    return mix(vDiffuse, vSpecular, fFresnel);    
}

float GetBlinnPhongIntensity(const in vec3 vIncidentDir, const in vec3 vLightDir, const in vec3 vNormal, const in float fSmoothness)
{          
    vec3 vHalf = normalize(vLightDir - vIncidentDir);
    float fNdotH = max(0.0, dot(vHalf, vNormal));

    float fSpecPower = exp2(4.0 + 6.0 * fSmoothness);
    float fSpecIntensity = (fSpecPower + 2.0) * 0.125;

    return pow(fNdotH, fSpecPower) * fSpecIntensity;
}

C_Shading ApplyPointLight( const in C_PointLight light, const in vec3 vSurfacePos, const in vec3 vIncidentDir, const in vec3 vNormal, const in C_Material material )
{
    C_Shading shading;
    
    vec3 vToLight = light.vPos - vSurfacePos;
    vec3 vLightDir = normalize(vToLight);
    float fLightDistance = length(vToLight);
    
    float fAttenuation = 1.0 / (fLightDistance * fLightDistance);
    
    float fShadowFactor = GetShadow( vSurfacePos, vNormal, vLightDir, fLightDistance );
    vec3 vIncidentLight = light.cColour * fShadowFactor * fAttenuation * max(0.0, dot(vLightDir, vNormal));
    
    shading.cDiffuse = vIncidentLight;                                  
    shading.cSpecular = GetBlinnPhongIntensity( vIncidentDir, vLightDir, vNormal, material.fSmoothness ) * vIncidentLight;
    
    return shading;
}  

C_Shading ApplyDirectionalLight( const in C_DirectionalLight light, const in vec3 vSurfacePos, const in vec3 vIncidentDir, const in vec3 vNormal, const in C_Material material )
{
    C_Shading shading;

    const float kShadowRayLength = 10.0;      
    vec3 vLightDir = -light.vDir;
    float fShadowFactor = GetShadow( vSurfacePos, vNormal, vLightDir, kShadowRayLength );
    vec3 vIncidentLight = light.cColour * fShadowFactor * max(0.0, dot(vLightDir, vNormal));
    
    shading.cDiffuse = vIncidentLight;                                  
    shading.cSpecular = GetBlinnPhongIntensity( vIncidentDir, vLightDir, vNormal, material.fSmoothness ) * vIncidentLight;
    
    return shading;
}  


vec3 ShadeSurface(const in C_Ray ray, const in C_HitInfo hitInfo, const in C_Surface surface, const in C_Material material)
{
    vec3 cScene;
    
    C_Shading shading;

    shading.cDiffuse = vec3(0.0);
    shading.cSpecular = vec3(0.0);
    
    float fAmbientOcclusion = GetAmbientOcclusion(hitInfo, surface);
    vec3 vAmbientLight = GetAmbientLight(surface.vNormal) * fAmbientOcclusion;
    
    shading.cDiffuse += vAmbientLight;
    shading.cSpecular += surface.cReflection;
              
    #ifdef ENABLE_POINT_LIGHT
    C_PointLight pointLight = GetPointLight(); 
    C_Shading pointLighting = ApplyPointLight(pointLight, hitInfo.vPos,ray.vDir, surface.vNormal, material);
    shading.cDiffuse += pointLighting.cDiffuse;
    shading.cSpecular += pointLighting.cSpecular;
    #endif

    #ifdef ENABLE_DIRECTIONAL_LIGHT
	C_DirectionalLight directionalLight = GetDirectionalLight();
    C_Shading directionLighting = ApplyDirectionalLight(directionalLight, hitInfo.vPos, ray.vDir, surface.vNormal, material);
    shading.cDiffuse += directionLighting.cDiffuse;
    shading.cSpecular += directionLighting.cSpecular;
    #endif

    vec3 vDiffuseReflection = shading.cDiffuse * material.cAlbedo;              

    // swap diffuse for transmission
    vDiffuseReflection = mix(vDiffuseReflection, surface.cTransmission, material.fTransparency);    

    #ifdef ENABLE_SPECULAR
    cScene = ApplyFresnel(vDiffuseReflection , shading.cSpecular, surface.vNormal, ray.vDir, material);
    #else
    cScene = vDiffuseReflection;
    #endif
    
    return cScene;
}

vec3 GetSceneColourSecondary( const in C_Ray ray );

vec3 GetReflection( const in C_Ray ray, const in C_HitInfo hitInfo, const in C_Surface surface )
{
    #ifdef ENABLE_REFLECTIONS    
    {
        // get colour from reflected ray
        const float fSeparation    = 0.1;

        C_Ray reflectRay;
        reflectRay.vDir = reflect(ray.vDir, surface.vNormal);
        reflectRay.vOrigin = hitInfo.vPos;
        reflectRay.fLength = 16.0;
        reflectRay.fStartDistance = fSeparation / abs(dot(reflectRay.vDir, surface.vNormal));
        
        return GetSceneColourSecondary(reflectRay);      
    }
    #else
        return GetSkyGradient(reflect(ray.vDir, surface.vNormal));                              
    #endif
}

vec3 GetTransmission( const in C_Ray ray, const in C_HitInfo hitInfo, const in C_Surface surface, const in C_Material material )
{
    #ifdef ENABLE_TRANSPARENCY  
    {
        const float fSeparation = 0.05;

        // Trace until outside transparent object
        C_Ray refractRay;
        // we dont handle total internal reflection (in that case refract returns a zero length vector)
        refractRay.vDir = refract(ray.vDir, surface.vNormal, material.fRefractiveIndex);
        refractRay.vOrigin = hitInfo.vPos;
        refractRay.fLength = 16.0;
        refractRay.fStartDistance = fSeparation / abs(dot(refractRay.vDir, surface.vNormal));

		#ifdef DOUBLE_SIDED_TRANSPARENCY
		
			C_HitInfo hitInfo2;
			Raymarch(refractRay, hitInfo2, 32, kInverseTransparency);
			vec3 vNormal = GetSceneNormal(hitInfo2.vPos, kInverseTransparency);
			
			// get colour from rest of scene
			C_Ray refractRay2;
			refractRay2.vDir = refract(refractRay.vDir, vNormal, 1.0 / material.fRefractiveIndex);
			refractRay2.vOrigin = hitInfo2.vPos;
			refractRay2.fLength = 16.0;
			refractRay2.fStartDistance = 0.0;//fSeparation / abs(dot(refractRay2.vDir, vNormal));
			
			float fExtinctionDist = hitInfo2.fDistance;
			vec3 vSceneColour = GetSceneColourSecondary(refractRay2);
		
		#else
		
			vec3 vSceneColour = GetSceneColourSecondary(refractRay);                                                                        
			float fExtinctionDist = 0.5;
		
		#endif
                                
        vec3 cMaterialExtinction = material.cAlbedo;
        // extinction should really be exp(-) but this is a nice hack to get RGB
        vec3 cExtinction = (1.0 / (1.0 + (cMaterialExtinction * fExtinctionDist)));		
		
		//vec3 cExtinction = exp2(-cMaterialExtinction * fExtinctionDist);
                                
        return vSceneColour * cExtinction;
    }
    #else
        return GetSkyGradient(reflect(ray.vDir, surface.vNormal));                              
    #endif
}

// no reflections, no transparency, used for secondary rays
vec3 GetSceneColourSecondary( const in C_Ray ray )
{
    C_HitInfo hitInfo;
    Raymarch(ray, hitInfo, 32, kNoTransparency);
                        
    vec3 cScene;

    if(hitInfo.vObjectId.x < 0.5)
    {
        cScene = GetSkyGradient(ray.vDir);
    }
    else
    {
        C_Surface surface;        
        surface.vNormal = GetSceneNormal(hitInfo.vPos, kNoTransparency);

        C_Material material = GetObjectMaterial(hitInfo);

        // use sky gradient instead of reflection
        surface.cReflection = GetSkyGradient(reflect(ray.vDir, surface.vNormal));
        
        material.fTransparency = 0.0;

        // apply lighting
        cScene = ShadeSurface(ray, hitInfo, surface, material);
    }

    ApplyAtmosphere(cScene, ray, hitInfo);

    return cScene;
}

vec3 GetSceneColourPrimary( const in C_Ray ray )
{                                                          
    C_HitInfo intersection;
    Raymarch(ray, intersection, 256, kTransparency);
                
    vec3 cScene;

    if(intersection.vObjectId.x < 0.5)
    {
        cScene = GetSkyGradient(ray.vDir);
    }
    else
    {
        C_Surface surface;
        
        surface.vNormal = GetSceneNormal(intersection.vPos, kTransparency);

        C_Material material = GetObjectMaterial(intersection);

        surface.cReflection = GetReflection(ray, intersection, surface);

        if(material.fTransparency > 0.0)
        {    
            surface.cTransmission = GetTransmission(ray, intersection, surface, material);
        }

        // apply lighting
        cScene = ShadeSurface(ray, intersection, surface, material);
    }

    ApplyAtmosphere(cScene, ray, intersection);

    return cScene;
}

float kFarClip = 30.0;

void GetCameraRay( const in vec3 vPos, const in vec3 vForwards, const in vec3 vWorldUp, const in vec2 fragCoord, out C_Ray ray)
{
    vec2 vUV = ( fragCoord.xy / iResolution.xy );
    vec2 vViewCoord = vUV * 2.0 - 1.0;

    float fRatio = iResolution.x / iResolution.y;
    vViewCoord.y /= fRatio;                          

    ray.vOrigin = vPos;

    vec3 vRight = normalize(cross(vForwards, vWorldUp));
    vec3 vUp = cross(vRight, vForwards);
        
    ray.vDir = normalize( vRight * vViewCoord.x + vUp * vViewCoord.y + vForwards); 
    ray.fStartDistance = 0.0;
    ray.fLength = kFarClip;      
}

void GetCameraRayLookat( const in vec3 vPos, const in vec3 vInterest, const in vec2 fragCoord, out C_Ray ray)
{
    vec3 vForwards = normalize(vInterest - vPos);
    vec3 vUp = vec3(0.0, 1.0, 0.0);

    GetCameraRay(vPos, vForwards, vUp, fragCoord, ray);
}

vec3 OrbitPoint( const in float fHeading, const in float fElevation )
{
    return vec3(sin(fHeading) * cos(fElevation), sin(fElevation), cos(fHeading) * cos(fElevation));
}

vec3 Tonemap( const in vec3 cCol )
{ 
    vec3 vResult = 1.0 -exp2(-cCol);

    return vResult;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    C_Ray ray;

    vec2 vMouseUV = iMouse.xy / iResolution.xy;    
    
    if(iMouse.z < 0.5)
    {
        vMouseUV = vec2(0.2, 0.8);
    }

    float fHeading = mix(-0.5, kPI + 0.5, vMouseUV.x);
    float fElevation = mix(1.5, -0.25, vMouseUV.y);
    float fCameraDist = mix(4.0, 2.5, vMouseUV.y);
    
    vec3 vCameraPos = OrbitPoint(fHeading, fElevation) * fCameraDist;
    vec3 vCameraIntrest = vec3(1.0, 0.9, 0.0);

    GetCameraRayLookat( vCameraIntrest + vCameraPos, vCameraIntrest, fragCoord, ray);

    vec3 cScene = GetSceneColourPrimary( ray );  

    const float fExposure = 1.5;    
    fragColor = vec4( Tonemap(cScene * fExposure), 1.0 );
}


//_______________________________________________________________________________________________________





void main( void)
{
	mainImage(gl_FragColor, gl_FragCoord.xy);
}