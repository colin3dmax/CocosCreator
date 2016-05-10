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

//===============================================================================================
//
// Comparison of Voronoi cells on sphere created by "traditional" 3D Voronoi with spherical
// Voronoi. This is a mash-up of two shaders:
//
//   left:  "Voronoi - 3D" by iq: https://www.shadertoy.com/view/ldl3Dl
//   right: "Spherical voronoi" by mattz: https://www.shadertoy.com/view/MtBGRD
//
// Most of the code here comes from iq's original, with some extra bits pasted in to make the
// latter one work.
//
// The left half of the screen is the set of traditional 3D Voronoi boundaries projected onto
// the sphere. Since the cutting planes beween 3D Voronoi cells are not locally perpendicular
// to the sphere, they can form curves instead of straight lines on thes sphere's surface. 
// Also since the jittered 3D points are not uniformly distributed on the sphere, the Voronoi
// cells appear to have an uneven size distribution.
//
// The right half of the screen is the spherical Voronoi diagram, which is constructed to 
// combat both problems.
//
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
//
//===============================================================================================
//===============================================================================================
//===============================================================================================

vec3 hash( vec3 x )
{
  x = vec3( dot(x,vec3(127.1,311.7, 74.7)),
            dot(x,vec3(269.5,183.3,246.1)),
            dot(x,vec3(113.5,271.9,124.6)));

  return fract(sin(x)*43758.5453123);
}


// returns closest, second closest, and cell id
vec3 voronoi( in vec3 x, out vec3 p1, out vec3 p2 )
{

  vec3 p = floor( x );
  vec3 f = fract( x );

  float id = 0.0;
  vec2 res = vec2( 100.0 );
  
  p1 = vec3(1000.);
  p2 = p1;
  
  for( int k=-1; k<=1; k++ )
    for( int j=-1; j<=1; j++ )
      for( int i=-1; i<=1; i++ )
        {
          // b is cell with integer coordinates
          vec3 b = vec3( float(i), float(j), float(k) );
          vec3 r = vec3( b ) - f + hash( p + b );
          float d = dot( r, r );

          if( d < res.x )
            {
              id = dot( p+b, vec3(1.0,57.0,113.0 ) );
              res = vec2( d, res.x );
              p2 = p1;
              p1 = r;
            }
          else if( d < res.y )
            {
              res.y = d;
              p2 = r;
            }
        }

  return vec3( sqrt( res ), abs(id) );
}
//===============================================================================================
//===============================================================================================
//===============================================================================================
//===============================================================================================
//===============================================================================================

/* Magic angle that equalizes projected area of squares on sphere. */
#define MAGIC_ANGLE 0.883475248536 // radians

/* Try to restrict branching? Don't know if this has any effect... */
#define RESTRICT_BRANCHING

float warp_theta = MAGIC_ANGLE;
float tan_warp_theta;

const float N = 6.0;

/* Return a permutation matrix whose first two columns are u and v basis 
   vectors for a cube face, and whose third column indicates which axis 
   (x,y,z) is maximal. */
mat3 getPT(in vec3 p) {

    vec3 a = abs(p);
    float c = max(max(a.x, a.y), a.z);    
#ifdef RESTRICT_BRANCHING
    vec3 s = step(vec3(c), a);
    s.yz -= vec2(s.x*s.y, (s.x + s.y - s.x*s.y)*s.z);
#else
    vec3 s = c == a.x ? vec3(1.,0,0) : c == a.y ? vec3(0,1.,0) : vec3(0,0,1.);
#endif
    s *= sign(dot(p, s));
    vec3 q = s.yzx;
    return mat3(cross(q,s), q, s);

}

/* For any point in 3D, obtain the permutation matrix, as well as grid coordinates
   on a cube face. */
void posToGrid(in vec3 pos, out mat3 PT, out vec2 g) {
    
    // Get permutation matrix and cube face id
    PT = getPT(pos);
    
    // Project to cube face
    vec3 c = pos * PT;     
    vec2 p = c.xy / c.z;      
    
    // Unwarp through arctan function
    vec2 q = atan(p*tan_warp_theta)/warp_theta; 
    
    // Map [-1,1] interval to [0,N] interval
    g = (q*0.5 + 0.5)*N;
    
}


/* For any grid point on a cube face, along with projection matrix, 
   obtain the 3D point it represents. */
vec3 gridToPos(in mat3 PT, in vec2 g) {
    
    // Map [0,N] to [-1,1]
    vec2 q = g/N * 2.0 - 1.0;
    
    // Warp through tangent function
    vec2 p = tan(warp_theta*q)/tan_warp_theta;

    // Map back through permutation matrix to place in 3D.
    return PT * vec3(p, 1.0);
    
}


/* Return whether a neighbor can be identified for a particular grid cell.
   We do not allow moves that wrap more than one face. For example, the 
   bottom-left corner (0,0) on the +X face may get stepped by (-1,0) to 
   end up on the -Y face, or, stepped by (0,-1) to end up on the -Z face, 
   but we do not allow the motion (-1,-1) from that spot. If a neighbor is 
   found, the permutation/projection matrix and grid coordinates of the 
   neighbor are computed.
*/
bool gridNeighbor(in mat3 PT, in vec2 g, in vec2 delta, out mat3 PTn, out vec2 gn) {

    vec2 g_dst = g.xy + delta;
    vec2 g_dst_clamp = clamp(g_dst, 0.0, N);

    vec2 extra = abs(g_dst_clamp - g_dst);
    float esum = extra.x + extra.y;
 
#ifdef RESTRICT_BRANCHING    
        
    vec3 pos = PT * vec3(g_dst_clamp/N*2.0-1.0, 1.0 - 2.0*esum/N);
    PTn = getPT(pos);
    gn = ((pos*PTn).xy*0.5 + 0.5) * N;
    
    return min(extra.x, extra.y) == 0.0 && esum < N;
    
#else
    
    if (max(extra.x, extra.y) == 0.0) {
        PTn = PT;
        gn = g_dst;
        return true;
    } else if (min(extra.x, extra.y) == 0.0 && esum < N) {
        // Magic stuff happens here.
        vec3 pos = PT * vec3(g_dst_clamp/N*2.0-1.0, 1.0 - 2.0*esum/N);
        PTn = getPT(pos);
        gn = ((pos * PTn).xy*0.5 + 0.5) * N;
        return true;	        
    } else {
        return false;
    }
    
#endif

}

/* From https://www.shadertoy.com/view/Xd23Dh */
vec3 hash3( vec2 p )
{
    vec3 q = vec3( dot(p,vec2(127.1,311.7)), 
                  dot(p,vec2(269.5,183.3)), 
                  dot(p,vec2(419.2,371.9)) );
    return fract(sin(q)*43758.5453);
}

/* Return squared great circle distance of two points projected onto sphere. */
float sphereDist2(vec3 a, vec3 b) {
	// Fast-ish approximation for acos(dot(normalize(a), normalize(b)))^2
    return 2.0-2.0*dot(normalize(a),normalize(b));
}


/* Just used to visualize distance from spherical Voronoi cell edges. */
float bisectorDistance(vec3 p, vec3 a, vec3 b) {
    vec3 n1 = cross(a,b);
    vec3 n2 = normalize(cross(n1, 0.5*(normalize(a)+normalize(b))));
    return abs(dot(p, n2));             
}

/* Color the sphere/cube points. */
vec3 gcolor(vec3 pos) {

    mat3 PT;
    vec2 g;

    // Get grid coords
    posToGrid(pos, PT, g);
    
    // Snap to cube face - note only needed for visualization.
    pos /= dot(pos, PT[2]);

    const float farval = 1e5;
    
    // Distances/colors/points for Voronoi
    float d1 = farval;
    float d2 = farval;

    float m1 = -1.0;
    float m2 = -1.0;

    vec3 p1 = vec3(0);
    vec3 p2 = vec3(0);

	// For drawing grid lines below
    vec2 l = abs(fract(g+0.5)-0.5);

    // Move to center of grid cell for neighbor calculation below.
    g = floor(g) + 0.5;

    // For each potential neighbor
    for (float u=-1.0; u<=1.0; ++u) {
        for (float v=-1.0; v<=1.0; ++v) {
            
            vec2 gn;
            mat3 PTn;

            // If neighbor exists
            if (gridNeighbor(PT, g, vec2(u,v), PTn, gn)) {
                
                float face = dot(PTn[2], vec3(1.,2.,3.));
                
                // Perturb based on grid cell ID
                gn = floor(gn);
                vec3 rn = hash3(gn*0.123 + face);
                gn += 0.5 + (rn.xy * 2.0 - 1.0)*1.0*0.5;

                // Get the 3D position
                vec3 pos_n = gridToPos(PTn, gn);
                
                // Compute squared distance on sphere
                float dp = sphereDist2(pos, pos_n);
                
                // See if new closest point (or second closest)
                if (dp < d1) {
                    d2 = d1; p2 = p1;
                    d1 = dp; p1 = pos_n;
                } else if (dp < d2) {
                    d2 = dp; p2 = pos_n;
                }
                
            }
        }
    }

    vec3 c = vec3(1.0);

    // voronoi lines    
    c = mix(c, vec3(0.0),
            smoothstep(0.01, 0.005, bisectorDistance(pos, p2, p1)));

    // goodbye
    return c;

}



const mat3 m = mat3( 0.00,  0.80,  0.60,
                     -0.80,  0.36, -0.48,
                     -0.60, -0.48,  0.64 );

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
  vec2 p = (-iResolution.xy + 2.0*fragCoord.xy) / iResolution.y;

  // camera movement
  const float twopi = 6.283185307179586;
  float an = iGlobalTime*twopi/12.0;
  vec3 ro = vec3( 2.5*cos(an), 1.0, 2.5*sin(an) );
  vec3 ta = vec3( 0.0, 1.0, 0.0 );
  // camera matrix
  vec3 ww = normalize( ta - ro );
  vec3 uu = normalize( cross(ww,vec3(0.0,1.0,0.0) ) );
  vec3 vv = normalize( cross(uu,ww));
  // create view ray
  vec3 rd = normalize( p.x*uu + p.y*vv + 1.5*ww );

  // sphere center	
  vec3 sc = vec3(0.0,1.0,0.0);
    
  tan_warp_theta = tan(warp_theta);


  // raytrace
  float tmin = 10000.0;
  vec3  nor = vec3(0.0);
  float occ = 1.0;
  vec3  pos = vec3(0.0);
	
  // raytrace-plane
  float h = (0.0-ro.y)/rd.y;
  if( h>0.0 ) 
    { 
      tmin = h; 
      nor = vec3(0.0,1.0,0.0); 
      pos = ro + h*rd;
      vec3 di = sc - pos;
      float l = length(di);
      occ = 1.0 - dot(nor,di/l)*1.0*1.0/(l*l); 
    }

  // raytrace-sphere
  vec3  ce = ro - sc;
  float b = dot( rd, ce );
  float c = dot( ce, ce ) - 1.0;
  h = b*b - c;
  if( h>0.0 )
    {
      h = -b - sqrt(h);
      if( h<tmin ) 
        { 
          tmin=h; 
          nor = normalize(ro+h*rd-sc); 
          occ = 0.5 + 0.5*nor.y;
        }
    }

  // shading/lighting	
  vec3 col = vec3(0.9);
  if( tmin<100.0 ) 
    {
      pos = ro + tmin*rd;

      vec3 pv = 4.0*pos;
      float f = 1.0;
      if (h == tmin) {

        if (p.x >= 0.0) {
          f = gcolor(pos-sc).x;
        } else {
          vec3 p1, p2;
          vec3 v = voronoi( pv, p1, p2 );
          
          vec3 pm = 0.5*(p1+p2);
          vec3 n = normalize(p2-p1);
          vec3 np = normalize(pos-sc);
          float d = abs(dot(pm, n));
          float cos_theta = dot(n, np); 
          float sin_theta = sqrt(1.0 - cos_theta*cos_theta);
          f = smoothstep(0.005, 0.01, 0.28*d/sin_theta);
        }
        
      } else {

        f = 0.4;

      }

		
      f *= occ;
      col = vec3(f*1.2);
      col = mix( col, vec3(0.9), 1.0-exp( -0.003*tmin*tmin ) );
    }
	
  col = sqrt( col );
  col *= step(1.0/640.0, abs(fragCoord.x - 0.5*iResolution.x)/iResolution.x);
	
	
  fragColor = vec4( col, 1.0 );
}

//_______________________________________________________________________________________________________





void main( void)
{
	mainImage(gl_FragColor, gl_FragCoord.xy);
}