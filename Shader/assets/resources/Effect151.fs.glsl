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

/*
	"Ferris Wheel 2" by wjbgrafx
	
	Based on
	Raymarched Reflections   Uploaded by Shane in 2015-Nov-17
	https://www.shadertoy.com/view/4dt3zn
	
	Additional sources:
	------------------	
	Gardner Cos Clouds  Uploaded by fab on 2014-Dec-24
	https://www.shadertoy.com/view/lll3z4

	HG_SDF GLSL Library for building signed distance bounds by MERCURY
	http://mercury.sexy/hg_sdf

	Camera rotation matrix function
	From	"Simple test/port of Mercury's SDF library to WebGL"
	https://www.shadertoy.com/view/Xs3GRB    Uploaded by tomkh in 2015-Dec-16
*/
//==============================================================================

#define PI                      3.1415926535897932384626433832795
#define PI_16					0.19634954084936207740391521145497

#define FAR                     80.0
#define MAX_RAY_STEPS           90
#define MAX_REF_STEPS           50
#define MAX_SHADOW_STEPS        20

#define CAM_DIST				40.0
#define CAM_POS                 vec3( 0.0, 5.0, -CAM_DIST )
#define CAM_FOV_FACTOR          4.0
#define LOOK_AT                 vec3( 0.0, 5.0, 0.0 )
#define LIGHT_POS               vec3( 0.0, 20.0, -10.0 )
#define LIGHT_ATTEN				0.003


//------------------------------------------------------------------------------
// Function declarations
//----------------------
mat4 createCamRotMatrix();
vec3 getRayDir( vec3 camPos, vec3 viewDir, vec2 pixelPos ) ;
vec2 trace( vec3 rayOrig, vec3 rayDir );
float traceRef( vec3 rayOrig, vec3 rayDir );
float softShadow( vec3 rayOrig, vec3 lightPos, float k );
vec3 getNormal( in vec3 p );
vec3 doColor( in vec3 sp, in vec3 rayDir, in vec3 surfNorm, in vec2 distID );
vec3 skyColor( vec2 pix );
vec3 rotateZ(vec3 p, float a);

// Plane with normal n (n is normalized) at some distance from the origin
float fPlane(vec3 p, vec3 n, float distanceFromOrigin);
// Torus in the XZ-plane
float fTorus(vec3 p, float smallRadius, float largeRadius);
// Capsule version 2: between two end points <a> and <b> with radius r 
float fCapsule(vec3 p, vec3 a, vec3 b, float r);
float fBox(vec3 p, vec3 b);
// Mirror at an axis-aligned plane which is at a specified distance <dist> 
// from the origin.
float pMirror (inout float p, float dist);


//------------------------------------------------------------------------------

// MAP
// ---

vec2 map(vec3 p)
{    
	
	float objID = 1.0;
	vec2 ground = vec2( fPlane( p, vec3( 0.0, 1.0, 0.0 ), 0.0 ), objID );    
	
	// Tower, ground beam, braces, and axle.
	//--------------------------------------
	vec3 p2 = p;	
	// Mirror across x-axis.
	pMirror( p2.z, 0.0 );
	
	objID = 2.0;	
	vec2 tower = vec2( 
	      fBox( p2 - vec3( 0.0, 3.6, 1.5 ), vec3( 0.15, 3.6, 0.15 ) ), objID ); 
	
	vec2 groundBeam = vec2(
		    fBox( p2 - vec3( 0.0, 0.2, 1.5 ), vec3( 5.0, 0.2, 0.3 ) ), objID );
		
	vec2 brace1 = vec2(
	fCapsule( p2, vec3( 4.5, 0.0, 1.5 ), vec3( 0.0, 6.0, 1.5 ), 0.1 ), objID );	
		
	vec2 brace2 = vec2(
	fCapsule( p2, vec3( -4.5, 0.0, 1.5 ), vec3( 0.0, 6.0, 1.5 ), 0.1 ), objID );	
		
	vec2 crossBeam = vec2(
		    fBox( p - vec3( 0.0, 0.2, 0.0 ), vec3( 0.3, 0.2, 2.0 ) ), objID );	
	
	vec2 axle = vec2(
	fCapsule( p, vec3( 0.0, 7.0, 1.5 ), vec3( 0.0, 7.0, -1.5 ), 0.2 ), objID );	    
	
	// Hoops and arms.
	//----------------
	vec3 p1 = p;
	
	// Rotate hoops. Translate hoop center to origin and back, so hoops rotate
	// around their own center.
	float hoopRotVal = iGlobalTime * -0.5;
	p1.y -= 7.0;
	p1 = rotateZ( p1, hoopRotVal );
	p1.y += 7.0;
	
	// Mirror across x-axis.
	pMirror( p1.z, 0.0 );	
	
	objID = 2.0;
	// Swizzle y and z planes to make tori stand upright in x-y plane.
	vec2 outerHoop = vec2( 
	               fTorus( p1.xzy - vec3( 0.0, 1.0, 7.0 ), 0.1, 5.0 ), objID );

	vec2 innerHoop = vec2( 
	              fTorus( p1.xzy - vec3( 0.0, 1.0, 7.0 ), 0.05, 4.0 ), objID );
	
	vec2 axleHoop = vec2( 
	             fTorus( p1.xzy - vec3( 0.0, 1.0, 7.0 ), 0.05, 0.25 ), objID );
	
	//---------------------------------------------------

	vec2 arm1 = vec2(
  		fCapsule( p1, vec3( -5.0, 7.0, 1.0 ), vec3( 5.0, 7.0, 1.0 ), 0.05 ), 
  			                                                           objID );
	vec2 arm2 = vec2(
  		fCapsule( p1, vec3( 0.0, 2.0, 1.0 ), vec3( 0.0, 12.0, 1.0 ), 0.05 ), 
  			                                                           objID );
	vec2 arm3 = vec2(
  		fCapsule( p1, vec3( -3.4, 3.5, 1.0 ), vec3( 3.4, 10.5, 1.0 ), 0.05 ), 
  			                                                           objID );
	vec2 arm4 = vec2(
  		fCapsule( p1, vec3( -3.4, 10.5, 1.0 ), vec3( 3.4, 3.5, 1.0 ), 0.05 ), 
  			                                                           objID );
	//---------------------------------------------------
	// Seat 1
	// ------
	vec3 p3 = p;
	// Rotate with the hoops.
	p3.y -= 7.0;
	p3 = rotateZ( p3, hoopRotVal );
	p3.y += 7.0;
	// Rotate around its own z-axis to keep it upright.
	p3 -= vec3( -5.0, 7.0, 0.0 );
	p3 = rotateZ( p3, -hoopRotVal );
	p3 += vec3( -5.0, 7.0, 0.0 );
		
	objID = 3.0;
	vec2 seat1 = vec2(
		fBox( p3 - vec3( -5.0, 7.0, 0.0 ), vec3( 0.5, 0.75, 0.75 ) ), objID );
	
	vec2 seat1CutA = vec2(
		fBox( p3 - vec3( -5.1, 7.6, 0.0 ), vec3( 0.5, 0.75, 0.8 ) ), objID );
		
	seat1 = max( seat1, -seat1CutA );
	
	vec2 seat1CutB = vec2(
		fBox( p3 - vec3( -5.7, 7.1, 0.0 ), vec3( 0.5, 0.75, 0.8 ) ), objID );
						
	seat1 = max( seat1, -seat1CutB );
	
	// Seat 2
	// ------
	vec3 p4 = p;
	// Rotate with the hoops.
	p4.y -= 7.0;
	p4 = rotateZ( p4, hoopRotVal );
	p4.y += 7.0;
	// Rotate around its own z-axis.
	p4 -= vec3( -3.4, 10.5, 0.0 );
	p4 = rotateZ( p4, -hoopRotVal );
	p4 += vec3( -3.4, 10.5, 0.0 );
		
	objID = 4.0;
	vec2 seat2 = vec2(
		fBox( p4 - vec3( -3.4, 10.5, 0.0 ), vec3( 0.5, 0.75, 0.75 ) ), objID );
	
	vec2 seat2CutA = vec2(
		fBox( p4 - vec3( -3.5, 11.1, 0.0 ), vec3( 0.5, 0.75, 0.8 ) ), objID );
		
	seat2 = max( seat2, -seat2CutA );
	
	vec2 seat2CutB = vec2(
		fBox( p4 - vec3( -4.1, 10.6, 0.0 ), vec3( 0.5, 0.75, 0.8 ) ), objID );
						
	seat2 = max( seat2, -seat2CutB );
	
	// Seat 3
	// ------
	vec3 p5 = p;
	// Rotate with the hoops.
	p5.y -= 7.0;
	p5 = rotateZ( p5, hoopRotVal );
	p5.y += 7.0;
	// Rotate around its own z-axis.
	p5 -= vec3( 0.0, 12.0, 0.0 );
	p5 = rotateZ( p5, -hoopRotVal );
	p5 += vec3( 0.0, 12.0, 0.0 );
		
	objID = 5.0;
	vec2 seat3 = vec2(
		fBox( p5 - vec3( 0.0, 12.0, 0.0 ), vec3( 0.5, 0.75, 0.75 ) ), objID );
	
	vec2 seat3CutA = vec2(
		fBox( p5 - vec3( -0.1, 12.6, 0.0 ), vec3( 0.5, 0.75, 0.8 ) ), objID );
		
	seat3 = max( seat3, -seat3CutA );
	
	vec2 seat3CutB = vec2(
		fBox( p5 - vec3( -0.7, 12.1, 0.0 ), vec3( 0.5, 0.75, 0.8 ) ), objID );
						
	seat3 = max( seat3, -seat3CutB );
	
	// Seat 4
	// ------
	vec3 p6 = p;
	// Rotate with the hoops.
	p6.y -= 7.0;
	p6 = rotateZ( p6, hoopRotVal );
	p6.y += 7.0;
	// Rotate around its own z-axis.
	p6 -= vec3( 3.4, 10.5, 0.0 );
	p6 = rotateZ( p6, -hoopRotVal );
	p6 += vec3( 3.4, 10.5, 0.0 );
		
	objID = 6.0;
	vec2 seat4 = vec2(
		fBox( p6 - vec3( 3.4, 10.5, 0.0 ), vec3( 0.5, 0.75, 0.75 ) ), objID );
	
	vec2 seat4CutA = vec2(
		fBox( p6 - vec3( 3.3, 11.1, 0.0 ), vec3( 0.5, 0.75, 0.8 ) ), objID );
		
	seat4 = max( seat4, -seat4CutA );
	
	vec2 seat4CutB = vec2(
		fBox( p6 - vec3( 2.7, 10.6, 0.0 ), vec3( 0.5, 0.75, 0.8 ) ), objID );
						
	seat4 = max( seat4, -seat4CutB );
	
	// Seat 5
	// ------
	vec3 p7 = p;
	// Rotate with the hoops.
	p7.y -= 7.0;
	p7 = rotateZ( p7, hoopRotVal );
	p7.y += 7.0;
	// Rotate around its own z-axis.
	p7 -= vec3( 5.0, 7.0, 0.0 );
	p7 = rotateZ( p7, -hoopRotVal );
	p7 += vec3( 5.0, 7.0, 0.0 );
		
	objID = 7.0;
	vec2 seat5 = vec2(
		fBox( p7 - vec3( 5.0, 7.0, 0.0 ), vec3( 0.5, 0.75, 0.75 ) ), objID );
	
	vec2 seat5CutA = vec2(
		fBox( p7 - vec3( 4.9, 7.6, 0.0 ), vec3( 0.5, 0.75, 0.8 ) ), objID );
		
	seat5 = max( seat5, -seat5CutA );
	
	vec2 seat5CutB = vec2(
		fBox( p7 - vec3( 4.3, 7.1, 0.0 ), vec3( 0.5, 0.75, 0.8 ) ), objID );
						
	seat5 = max( seat5, -seat5CutB );
	
	// Seat 6
	// ------
	vec3 p8 = p;
	// Rotate with the hoops.
	p8.y -= 7.0;
	p8 = rotateZ( p8, hoopRotVal );
	p8.y += 7.0;
	// Rotate around its own z-axis.
	p8 -= vec3( 3.4, 3.5, 0.0 );
	p8 = rotateZ( p8, -hoopRotVal );
	p8 += vec3( 3.4, 3.5, 0.0 );
		
	objID = 8.0;
	vec2 seat6 = vec2(
		fBox( p8 - vec3( 3.4, 3.5, 0.0 ), vec3( 0.5, 0.75, 0.75 ) ), objID );
	
	vec2 seat6CutA = vec2(
		fBox( p8 - vec3( 3.3, 4.1, 0.0 ), vec3( 0.5, 0.75, 0.8 ) ), objID );
		
	seat6 = max( seat6, -seat6CutA );
	
	vec2 seat6CutB = vec2(
		fBox( p8 - vec3( 2.7, 3.6, 0.0 ), vec3( 0.5, 0.75, 0.8 ) ), objID );
						
	seat6 = max( seat6, -seat6CutB );
	
	// Seat 7
	// ------
	vec3 p9 = p;
	// Rotate with the hoops.
	p9.y -= 7.0;
	p9 = rotateZ( p9, hoopRotVal );
	p9.y += 7.0;
	// Rotate around its own z-axis.
	p9 -= vec3( 0.0, 2.0, 0.0 );
	p9 = rotateZ( p9, -hoopRotVal );
	p9 += vec3( 0.0, 2.0, 0.0 );
		
	objID = 9.0;
	vec2 seat7 = vec2(
		fBox( p9 - vec3( 0.0, 2.0, 0.0 ), vec3( 0.5, 0.75, 0.75 ) ), objID );
	
	vec2 seat7CutA = vec2(
		fBox( p9 - vec3( -0.1, 2.6, 0.0 ), vec3( 0.5, 0.75, 0.8 ) ), objID );
		
	seat7 = max( seat7, -seat7CutA );
	
	vec2 seat7CutB = vec2(
		fBox( p9 - vec3( -0.7, 2.1, 0.0 ), vec3( 0.5, 0.75, 0.8 ) ), objID );
						
	seat7 = max( seat7, -seat7CutB );
	
	// Seat 8
	// ------
	vec3 p10 = p;
	// Rotate with the hoops.
	p10.y -= 7.0;
	p10 = rotateZ( p10, hoopRotVal );
	p10.y += 7.0;
	// Rotate around its own z-axis.
	p10 -= vec3( -3.4, 3.5, 0.0 );
	p10 = rotateZ( p10, -hoopRotVal );
	p10 += vec3( -3.4, 3.5, 0.0 );
		
	objID = 10.0;
	vec2 seat8 = vec2(
		fBox( p10 - vec3( -3.4, 3.5, 0.0 ), vec3( 0.5, 0.75, 0.75 ) ), objID );
	
	vec2 seat8CutA = vec2(
		fBox( p10 - vec3( -3.5, 4.1, 0.0 ), vec3( 0.5, 0.75, 0.8 ) ), objID );
		
	seat8 = max( seat8, -seat8CutA );
	
	vec2 seat8CutB = vec2(
		fBox( p10 - vec3( -4.1, 3.6, 0.0 ), vec3( 0.5, 0.75, 0.8 ) ), objID );
						
	seat8 = max( seat8, -seat8CutB );
	
	//---------------------------------------------------
	
	vec2 closest = ground.s < groundBeam.s ? ground : groundBeam;
	closest = closest.s < brace1.s ? closest : brace1;
	closest = closest.s < brace2.s ? closest : brace2;
	closest = closest.s < crossBeam.s ? closest : crossBeam;
	
	closest = closest.s < outerHoop.s ? closest : outerHoop;
	closest = closest.s < innerHoop.s ? closest : innerHoop;
	closest = closest.s < axleHoop.s ? closest : axleHoop;
	closest = closest.s < tower.s ? closest : tower;
	closest = closest.s < arm1.s ? closest : arm1;
	closest = closest.s < arm2.s ? closest : arm2;
	closest = closest.s < arm3.s ? closest : arm3;
	closest = closest.s < arm4.s ? closest : arm4;
	closest = closest.s < axle.s ? closest : axle;
	
	closest = closest.s < seat1.s ? closest : seat1;
	closest = closest.s < seat2.s ? closest : seat2;
	closest = closest.s < seat3.s ? closest : seat3;
	closest = closest.s < seat4.s ? closest : seat4;
	closest = closest.s < seat5.s ? closest : seat5;
	closest = closest.s < seat6.s ? closest : seat6;
	closest = closest.s < seat7.s ? closest : seat7;
	closest = closest.s < seat8.s ? closest : seat8;
	
	//---------------------------------------------------

	return closest;
}

// end map()

//------------------------------------------------------------------------------

// GET OBJECT COLOR
// ----------------

vec3 getObjectColor( vec3 p, vec2 distID )
{    
    vec3 col = vec3( 1.0 );
	float objNum = distID.t;
	
	if( objNum == 1.0 )
    {
		col = vec3( 0.0, 1.0, 0.0 );
	}
	else if ( objNum == 2.0 )
	{
		col = vec3( 0.95, 0.95, 1.0 );
	}
	else if ( objNum == 3.0 )	// seat 1
	{
		col = vec3( 1.0, 0.0, 0.0 );
	}
	else if ( objNum == 4.0 )
	{
		col = vec3( 1.0, 0.5, 0.0 );
	}
	else if ( objNum == 5.0 )	// seat 3
	{
		col = vec3( 1.0, 1.0, 0.0 );
	}
	else if ( objNum == 6.0 )
	{
		col = vec3( 0.5, 1.0, 0.0 );
	}
	else if ( objNum == 7.0 )	// seat 5
	{
		col = vec3( 0.0, 1.0, 1.0 );
	}
	else if ( objNum == 8.0 )
	{
		col = vec3( 0.0, 0.0, 1.0 );
	}
	else if ( objNum == 9.0 )	// seat 7
	{
		col = vec3( 0.5, 0.0, 1.0 );
	}
	else if ( objNum == 10.0 )
	{
		col = vec3( 1.0, 0.0, 0.5 );
	}
	    
    return col;
}

// end getObjectColor()

//------------------------------------------------------------------------------

// MAIN IMAGE
// ----------

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	// For Gardner Cos Clouds skyColor()
	vec2 st = fragCoord;
	st.x *= 0.5;
	st.x += sin( iGlobalTime * 0.1 ) * 0.5;
	st.y *= 0.75;

	// Adjust aspect ratio, normalize coords, center origin in x-axis.	
	// xRange = -1.7777778 to 1.775926, yRange = -1.0 to 0.9981482 at 1920x1080
	vec2 uv = ( -iResolution.xy + 2.0 * fragCoord ) / iResolution.y;

 	mat4 cam_mat = createCamRotMatrix();
	vec3 camPos = vec3( cam_mat * vec4( 0.0, 0.0, -CAM_DIST, 1.0 ) );	    
    vec3 rayDir = getRayDir( camPos, normalize( LOOK_AT - camPos ), uv );   
    vec3 rayOrig = camPos;   
    vec3 lightPos = LIGHT_POS;
	vec3 sceneColor = vec3( 0.0 );
	vec3 skyClr = skyColor( st );
	   
    // FIRST PASS.
    //------------
    vec2 distID = trace( rayOrig, rayDir );
    float totalDist = distID.s;
    
	if ( totalDist >= FAR )
	{
		sceneColor = skyClr;
	}
	else
	{
	    // Fog based off of distance from the camera. 
	    float fog = smoothstep( FAR * 0.8, 0.0, totalDist ); 
	    
	    // Advancing the ray origin to the new hit point.
	    rayOrig += rayDir * totalDist;
	    
	    // Retrieving the normal at the hit point.
	    vec3 surfNorm = getNormal( rayOrig );
	    
	    // Retrieving the color at the hit point.
	    sceneColor = doColor( rayOrig, rayDir, surfNorm, distID );
	    
	    float k = 24.0;
	    float shadow = softShadow( rayOrig, lightPos, k );
	   
	    // SECOND PASS - REFLECTED RAY
	    //----------------------------
	    rayDir = reflect( rayDir, surfNorm );
	    totalDist = traceRef( rayOrig +  rayDir * 0.01, rayDir );
	    rayOrig += rayDir * totalDist;
	    
	    // Retrieving the normal at the reflected hit point.
	    surfNorm = getNormal( rayOrig );
	    
	    // Coloring the reflected hit point, then adding a portion of it to the 
	    // final scene color. Factor is percent of reflected color to add.
	    sceneColor += doColor( rayOrig, rayDir, surfNorm, distID ) * 0.45;
	    
	    // APPLYING SHADOWS
	    //-----------------
	    sceneColor *= shadow;
	    sceneColor = mix( sceneColor, skyClr, 1.0 - fog );
	    
	} // end else totalDist < FAR
	
	fragColor = vec4( clamp( sceneColor, 0.0, 1.0 ), 1.0 );
    
}

//------------------------------------------------------------------------------

// CREATE CAMERA ROTATION MATRIX
// -----------------------------

// From	"Simple test/port of Mercury's SDF library to WebGL"
// 	https://www.shadertoy.com/view/Xs3GRB    Uploaded by tomkh in 2015-Dec-16

mat4 createCamRotMatrix()
{
	float ang = 0.0, 
	      sinAng = 0.0, 
	      cosAng = 0.0,
	      rotRange = -0.0029;
	
    if( iMouse.z < 1.0 ) 
    {
		ang = iGlobalTime * 0.2;
	}
	else
	{
		ang = ( iMouse.x - iResolution.x * 0.5 ) * rotRange;
	}
	sinAng = sin(ang); 
	cosAng = cos(ang);
	
	mat4 y_Rot_Cam_Mat = mat4( cosAng, 0.0, sinAng, 0.0,	  
	                              0.0, 1.0,    0.0, 0.0,
	                          -sinAng, 0.0, cosAng, 0.0,
	                              0.0, 0.0,    0.0, 1.0 );
	
    if( iMouse.z < 1.0 ) 
    {
		ang = 0.25 * ( sin( iGlobalTime * 0.1 ) + 1.0 ) + PI_16;
	}
	else
	{
		ang = ( 0.4825 * iMouse.y - iResolution.y * 0.5 ) * rotRange + PI_16; 
	}

	sinAng = sin(ang); 
	cosAng = cos(ang);
	
	mat4 x_Rot_Cam_Mat = mat4( 1.0,     0.0,    0.0, 0.0,	  
	                           0.0,  cosAng, sinAng, 0.0,
	                           0.0, -sinAng, cosAng, 0.0,
	                           0.0,     0.0,    0.0, 1.0 );
	
	return y_Rot_Cam_Mat * x_Rot_Cam_Mat;
	
}

// end createCamRotMatrix()

//------------------------------------------------------------------------------

// TRACE
// -----

vec2 trace( vec3 rayOrig, vec3 rayDir )
{   
    float totalDist = 0.0;
    vec2 distID = vec2( 0.0 );
    
    for ( int i = 0; i < MAX_RAY_STEPS; i++ )
    {
        distID = map( rayOrig + rayDir * totalDist );
        float dist = distID.s;
        
        if( abs( dist ) < 0.0025 || totalDist > FAR ) 
        {
        	break;
        }
        
        totalDist += dist * 0.75;  // Using more accuracy, in the first pass.
    }
    
    return vec2( totalDist, distID.t );
}

// end trace()

//------------------------------------------------------------------------------

// TRACE REFLECTIONS
// -----------------

float traceRef( vec3 rayOrig, vec3 rayDir )
{    
    float totalDist = 0.0;
    
    for ( int i = 0; i < MAX_REF_STEPS; i++ )
    {
        float dist = map( rayOrig + rayDir * totalDist ).s;
        
        if( abs( dist ) < 0.0025 || totalDist > FAR ) 
        {
        	break;
        }
        
        totalDist += dist;
    }
    
    return totalDist;
}

// end traceRef()

//------------------------------------------------------------------------------

// SOFT SHADOW
// -----------

// The value "k" is just a fade-off factor that enables you to control how soft  
// you want the shadows to be. Smaller values give a softer penumbra, and larger
// values give a more hard edged shadow.

float softShadow( vec3 rayOrig, vec3 lightPos, float k )
{
    vec3 rayDir = ( lightPos - rayOrig ); // Unnormalized direction ray.

    float shade = 1.0;
    float dist = 0.01;    
    float end = max( length( rayDir ), 0.001 );
    float stepDist = end / float( MAX_SHADOW_STEPS );
    
    rayDir /= end;

    for ( int i = 0; i < MAX_SHADOW_STEPS; i++ )
    {
        float h = map( rayOrig + rayDir * dist ).s;
        shade = min( shade, smoothstep( 0.0, 1.0, k * h / dist)); 
        dist += min( h, stepDist * 2.0 ); 
        
        if ( h < 0.001 || dist > end ) 
        {
        	break; 
        }
    }

    // Add 0.5 to the final shade value, which lightens the shadow a bit. 
    return min( max( shade, 0.0 ) + 0.5, 1.0 ); 
}

// end softShadow()

//------------------------------------------------------------------------------

// GET NORMAL
// ----------

// Tetrahedral normal, to save a couple of "map" calls. Courtesy of IQ.

vec3 getNormal( in vec3 p )
{
    vec2 e = vec2( 0.005, -0.005 ); 
    return normalize( e.xyy * map( p + e.xyy ).s + 
				      e.yyx * map( p + e.yyx ).s + 
				      e.yxy * map( p + e.yxy ).s + 
				      e.xxx * map( p + e.xxx ).s );

}

// end getNormal()

//------------------------------------------------------------------------------

// DO COLOR
// --------

vec3 doColor( in vec3 sp, in vec3 rayDir, in vec3 surfNorm, in vec2 distID )
                                                               
{    
    // Light direction vector.
    vec3 lDir = LIGHT_POS - sp; 

    // Light to surface distance.
    float lDist = max( length( lDir ), 0.001 ); 

    // Normalizing the light vector.
    lDir /= lDist; 
    
    // Attenuating the light, based on distance.
    //float atten = 1.0 / ( 1.0 + lDist * 0.25 + lDist * lDist * 0.05 );
    float atten = 1.0 / ( lDist * lDist * LIGHT_ATTEN );
    
    // Standard diffuse term.
    float diff = max( dot( surfNorm, lDir ), 0.0 );
    
    // Standard specular term.
    float spec = 
            pow( max( dot( reflect( -lDir, surfNorm ), -rayDir ), 0.0 ), 8.0 );
    
    vec3 objCol = getObjectColor( sp, distID );
    
    // Combining the above terms to produce the final scene color.
    vec3 sceneCol = ( objCol * ( diff + 0.15 ) + vec3( 1.0, 0.6, 0.2 ) *
                                                          spec * 2.0 ) * atten;
   
    return sceneCol;   
}

// end doColor()

//------------------------------------------------------------------------------

// GET RAY DIRECTION
// -----------------

vec3 getRayDir( vec3 camPos, vec3 viewDir, vec2 pixelPos ) 
{
    vec3 camRight = normalize( cross( viewDir, vec3( 0.0, 1.0, 0.0 ) ) );
    vec3 camUp = normalize( cross( camRight, viewDir ) );
    
    return normalize( pixelPos.x * camRight + pixelPos.y * camUp + 
                                                    CAM_FOV_FACTOR * viewDir );
}

// end getRayDir()

//------------------------------------------------------------------------------

// SKY COLOR
// ---------
// https://www.shadertoy.com/view/lll3z4
// Gardner Cos Clouds  Uploaded by fab on 2014-Dec-24
/*
 * Gardner Cos Clouds
 *
 * Translated/adapted from the RenderMan implementation in
 * Texturing & Modeling; a Procedural Approach (3rd ed, p. 50)
 */
 
vec3 skyColor( vec2 pix )
{
	const int nTerms = 10;
	
	float zoom = 1.0,
          cloudDensity = 0.0,
          amplitude = 0.45,
          xphase = 0.9 * iGlobalTime,
          yphase = 0.7,
          xfreq = 2.0 * PI * 0.023,
          yfreq = 2.0 * PI * 0.021,
    
          offset = 0.5,
          xoffset = 37.0,
          yoffzet = 523.0,
    
          x = pix.x,
          y = pix.y,
	      scale = 1.0 / iResolution.x * 60.0 * 1.0 / zoom;

    x = x * scale + offset + iGlobalTime * 1.5;
    y = y * scale + offset - iGlobalTime / 2.3;
    
    for ( int i = 0; i < nTerms; i++ )
    {
        float fx = amplitude * ( offset + cos( xfreq * ( x + xphase ) ) );
        float fy = amplitude * ( offset + cos( yfreq * ( y + yphase ) ) );
        cloudDensity += fx * fy;
        xphase = PI * 0.5 * 0.9 * cos( yfreq * y );
        yphase = PI * 0.5 * 1.1 * cos( xfreq * x );
        amplitude *= 0.602;
        xfreq *= 1.9 + float( i ) * .01;
        yfreq *= 2.2 - float( i ) * 0.08;
    }

    return mix( vec3(0.4, 0.6, 0.9 ), vec3( 1.0 ), cloudDensity );   
}

// end skyColor()

//------------------------------------------------------------------------------

// ROTATE Z
// --------

vec3 rotateZ(vec3 p, float a)
{
  float sa = sin(a);
  float ca = cos(a);
  return vec3(ca * p.x - sa * p.y, sa * p.x + ca * p.y, p.z);
}

//------------------------------------------------------------------------------
// The code below is excerpted from:

////////////////////////////////////////////////////////////////
//
//                           HG_SDF
//
//     GLSL LIBRARY FOR BUILDING SIGNED DISTANCE BOUNDS
//
//     version 2015-12-15 (initial release)
//
//     Check http://mercury.sexy/hg_sdf for updates
//     and usage examples. Send feedback to spheretracing@mercury.sexy.
//
//     Brought to you by MERCURY http://mercury.sexy
//
//
//
// Released as Creative Commons Attribution-NonCommercial (CC BY-NC)
//
////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////
//
//             HELPER FUNCTIONS/MACROS
//
////////////////////////////////////////////////////////////////

// Clamp to [0,1] - this operation is free under certain circumstances.
// For further information see
// http://www.humus.name/Articles/Persson_LowLevelThinking.pdf and
// http://www.humus.name/Articles/Persson_LowlevelShaderOptimization.pdf
#define saturate(x) clamp(x, 0., 1.)

float vmax(vec3 v) {
	return max(max(v.x, v.y), v.z);
}

////////////////////////////////////////////////////////////////
//
//             PRIMITIVE DISTANCE FUNCTIONS
//
////////////////////////////////////////////////////////////////

// Plane with normal n (n is normalized) at some distance from the origin
float fPlane(vec3 p, vec3 n, float distanceFromOrigin) {
	return dot(p, n) + distanceFromOrigin;
}

// Box: correct distance to corners
float fBox(vec3 p, vec3 b) {
	vec3 d = abs(p) - b;
	return length(max(d, vec3(0))) + vmax(min(d, vec3(0)));
}

// Distance to line segment between <a> and <b>, used for fCapsule() version 2below
float fLineSegment(vec3 p, vec3 a, vec3 b) {
	vec3 ab = b - a;
	float t = saturate(dot(p - a, ab) / dot(ab, ab));
	return length((ab*t + a) - p);
}

// Capsule version 2: between two end points <a> and <b> with radius r 
float fCapsule(vec3 p, vec3 a, vec3 b, float r) {
	return fLineSegment(p, a, b) - r;
}

// Torus in the XZ-plane
float fTorus(vec3 p, float smallRadius, float largeRadius) {
	return length(vec2(length(p.xz) - largeRadius, p.y)) - smallRadius;
}

////////////////////////////////////////////////////////////////
//
//                DOMAIN MANIPULATION OPERATORS
//
////////////////////////////////////////////////////////////////

// Mirror at an axis-aligned plane which is at a specified distance <dist> from the origin.
float pMirror (inout float p, float dist) {
	float s = sign(p);
	p = abs(p)-dist;
	return s;
}
//_______________________________________________________________________________________________________





void main( void)
{
	mainImage(gl_FragColor, gl_FragCoord.xy);
}