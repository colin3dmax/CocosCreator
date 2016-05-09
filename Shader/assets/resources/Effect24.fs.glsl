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
//uniform vec4      iDate;                 // (year, month, day, time in seconds)
//uniform float     iSampleRate;           // sound sample rate (i.e., 44100)






//_______________________________________________________________________________________________________
// "Double Pendulum" by dr2 - 2016
// License: Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License

// /*
//   The simplest mechanical system that exhibits deterministic chaos.

//   The two sliders on the left control the relative masses of the two bobs
//   and the arm lengths. The right sliders control the initial angular
//   velocities of the two arms. Each change restarts the simulation.

//   The total energy is shown; if the numerical integration is sufficiently
//   accurate this should remain unchanged.

//   The dots show the most recent segment of the trajectory of the end bob.

//   Examine different parameter combinations to see the kinds of behavior that
//   can occur.
// */

#define txBuf iChannel0
#define txSize iChannelResolution[0].xy

float Fbm2 (vec2 p);
vec2 Rot2D (vec2 q, float a);
float ShowInt (vec2 q, vec2 cBox, float mxChar, float val);
vec3 ShowWg (vec2 uv, vec2 canvas, vec3 col, vec4 slVal);

float PrBoxDf (vec3 p, vec3 b)
{
  vec3 d;
  d = abs (p) - b;
  return min (max (d.x, max (d.y, d.z)), 0.) + length (max (d, 0.));
}

float PrSphDf (vec3 p, float s)
{
  return length (p) - s;
}

float PrCylDf (vec3 p, float r, float h)
{
  return max (length (p.xy) - r, abs (p.z) - h);
}

const float txRow = 32.;

vec4 Loadv4 (int idVar)
{
  float fi;
  fi = float (idVar);
  return texture2D (txBuf, (vec2 (mod (fi, txRow), floor (fi / txRow)) + 0.5) /
     txSize);
}

vec3 vnBall, ltDir;
float rLen[2], bRad[2], pAng[2], dstBall, dstFar;
int idObj;
const int ntPoint = 120;

float ObjDf (vec3 p)
{
  vec3 q;
  float dMin, d;
  dMin = dstFar;
  q = p;
  q.xy = Rot2D (q.xy, pAng[0]);
  q.y -= - rLen[0];
  d = PrCylDf (q.xzy, 0.03, rLen[0]);
  if (d < dMin) { dMin = d;  idObj = 1; }
  q.yz -= vec2 (- rLen[0], -0.03);
  d = PrSphDf (q, bRad[0]);
  if (d < dMin) { dMin = d;  idObj = 2; }
  q.xy = Rot2D (q.xy, pAng[1] - pAng[0]);
  q.yz -= vec2 (- rLen[1], -0.03);
  d = PrCylDf (q.xzy, 0.03, rLen[1]);
  if (d < dMin) { dMin = d;  idObj = 1; }
  q.yz -= vec2 (- rLen[1], -0.03);
  d = PrSphDf (q, bRad[1]);
  if (d < dMin) { dMin = d;  idObj = 2; }
  q = p;  q.yz -= vec2 (-1.1 * (rLen[0] + rLen[1]), 0.5);
  d = PrBoxDf (q, vec3 (0.2, 1.15 * (rLen[0] + rLen[1]), 0.1));
  if (d < dMin) { dMin = d;  idObj = 3; }
  q = p;  q.y -= - 2.15 * (rLen[0] + rLen[1]) - 0.1;
  d = PrBoxDf (q, vec3 (1., 0.1, 1.));
  if (d < dMin) { dMin = d;  idObj = 3; }
  q = p;  q.z -= 0.25;
  d = PrCylDf (q, 0.1, 0.25);
  if (d < dMin) { dMin = d;  idObj = 4; }
  return dMin;
}

float ObjRay (vec3 ro, vec3 rd)
{
  float dHit, d;
  dHit = 0.;
  for (int j = 0; j < 150; j ++) {
    d = ObjDf (ro + dHit * rd);
    dHit += d;
    if (d < 0.001 || dHit > dstFar) break;
  }
  return dHit;
}

vec3 ObjNf (vec3 p)
{
  const vec3 e = vec3 (0.001, -0.001, 0.);
  vec4 v = vec4 (ObjDf (p + e.xxx), ObjDf (p + e.xyy),
     ObjDf (p + e.yxy), ObjDf (p + e.yyx));
  return normalize (vec3 (v.x - v.y - v.z - v.w) + 2. * v.yzw);
}

float TBallHit (vec3 ro, vec3 rd)
{
  vec3 p;
  vec3 v;
  float b, d, w, dMin, sz;
  dMin = dstFar;
  sz = 0.05;
  p.z = 0.;
  for (int n = 0; n < ntPoint; n ++) {
    p.xy = Loadv4 (4 + n).xy;
    p.xy *= -4.;
    v = ro - p.xyz;
    b = dot (rd, v);
    w = b * b + sz * sz - dot (v, v);
    if (w >= 0.) {
      d = - b - sqrt (w);
      if (d > 0. && d < dMin) {
        dMin = d;
        vnBall = (v + d * rd) / sz;
      }
    }
  }
  return dMin;
}

vec3 WoodCol (vec3 p, vec3 n)
{
  p *= 4.;
  float f = dot (vec3 (Fbm2 (p.zy * vec2 (1., 0.1)),
     Fbm2 (p.zx * vec2 (1., 0.1)), Fbm2 (p.xy * vec2 (1., 0.1))), abs (n));
  return mix (vec3 (0.8, 0.4, 0.2), vec3 (0.45, 0.25, 0.1), f);
}

vec3 ShowScene (vec3 ro, vec3 rd)
{
  vec3 vn, col;
  float dstObj;
  int idObjT;
  dstBall = TBallHit (ro, rd);
  dstObj = ObjRay (ro, rd);
  if (dstBall < min (dstObj, dstFar)) {
    col = vec3 (0.7, 0.5, 0.3) * (0.4 + 0.6 * max (dot (vnBall, ltDir), 0.));
  } else if (dstObj < dstFar) {
    ro += rd * dstObj;
    idObjT = idObj;
    vn = ObjNf (ro);
    idObj = idObjT;
    col = vec3 (0.8, 0.8, 0.1);
    if (idObj == 1) col = vec3 (0.9, 0.9, 1.);
    else if (idObj == 2) col = vec3 (1., 1., 0.);
    else if (idObj == 3) col = WoodCol (ro, vn);
    else if (idObj == 4) col = vec3 (0.6, 0.6, 0.7);
    col = col * (0.2 + 0.8 * max (dot (vn, ltDir), 0.) +
       0.5 * pow (max (0., dot (ltDir, reflect (rd, vn))), 64.));
  } else col = (1. - 2. * dot (rd.xy, rd.xy)) * vec3 (0.2, 0.2, 0.4);
  col = clamp (col, 0., 1.);
  return col;
}

void mainImage (out vec4 fragColor, in vec2 fragCoord)
{
  mat3 vuMat;
  vec4 stDat, slVal;
  vec3 ro, rd, col;
  vec2 canvas, uv, ori, ca, sa;;
  float az, el, asp, parmL, parmM, mFrac, eTot;
  canvas = iResolution.xy;
  uv = 2. * fragCoord.xy / canvas - 1.;
  uv.x *= canvas.x / canvas.y;
  dstFar = 30.;
  asp = canvas.x / canvas.y;
  stDat = Loadv4 (0);
  eTot = stDat.y;
  el = stDat.z;
  az = stDat.w;
  stDat = Loadv4 (1);
  pAng[0] = stDat.x;
  pAng[1] = stDat.y;
  slVal = Loadv4 (2);
  parmL = (slVal.x - 0.5) * ((slVal.x >= 0.5) ? 1. : 1. / 5.) * 8. + 1.;
  parmM = (slVal.y - 0.5) * ((slVal.y >= 0.5) ? 1. : 1. / 5.) * 8. + 1.;
  rLen[0] = 2. / (1. + parmL);
  rLen[1] = 2. * parmL / (1. + parmL);
  mFrac = parmM / (1. + parmM);
  bRad[0] = 0.05 * (1. + 3. * sqrt (1. - mFrac));
  bRad[1] = 0.05 * (1. + 3. * sqrt (mFrac));
  ori = vec2 (el, az);
  ca = cos (ori);
  sa = sin (ori);
  vuMat = mat3 (ca.y, 0., - sa.y, 0., 1., 0., sa.y, 0., ca.y) *
     mat3 (1., 0., 0., 0., ca.x, - sa.x, 0., sa.x, ca.x);
  rd = vuMat * normalize (vec3 (uv, 3.));
  ro = vuMat * vec3 (0., 0., -15.);
  ltDir = vuMat * normalize (vec3 (1., 2., -1.));
  col = ShowScene (ro, rd);
  col = ShowWg (uv, canvas, col, slVal);
  col = mix (col, vec3 (1., 1., 0.), ShowInt (0.5 * uv - vec2 (0.47 * asp, - 0.45),
     vec2 (0.06 * asp, 0.03), 4., floor (100. * eTot)));
  fragColor = vec4 (col, 1.);
}

vec3 ShowWg (vec2 uv, vec2 canvas, vec3 col, vec4 slVal)
{
  vec4 wgBx[4];
  vec3 cc;
  vec2 ut, ust;
  float vW[4], asp;
  asp = canvas.x / canvas.y;
  wgBx[0] = vec4 (-0.45 * asp, 0., 0.012 * asp, 0.18);
  wgBx[1] = vec4 (-0.35 * asp, 0., 0.012 * asp, 0.18);
  wgBx[2] = vec4 ( 0.35 * asp, 0., 0.012 * asp, 0.18);
  wgBx[3] = vec4 ( 0.45 * asp, 0., 0.012 * asp, 0.18);
  vW[0] = slVal.x;
  vW[1] = slVal.y;
  vW[2] = slVal.z;
  vW[3] = slVal.w;
  for (int k = 0; k < 4; k ++) {
    cc = (k < 2) ? vec3 (0.2, 1., 0.2) : vec3 (1., 0.2, 0.2);
    ut = 0.5 * uv - wgBx[k].xy;
    ust = abs (ut) - wgBx[k].zw * vec2 (0.7, 1.);
    if (max (ust.x, ust.y) < 0.) {
      if  (min (abs (ust.x), abs (ust.y)) * canvas.y < 2.) col = vec3 (1., 1., 0.);
      else col = (mod (0.5 * ((0.5 * uv.y - wgBx[k].y) / wgBx[k].w - 0.99), 0.1) *
         canvas.y < 6.) ? vec3 (1., 1., 0.) : vec3 (0.6);
    }
    ut.y -= (vW[k] - 0.5) * 2. * wgBx[k].w;
    ut = abs (ut) * vec2 (1., 2.);
    if (length (ut) < 0.03 && max (ut.x, ut.y) > 0.01) col = cc;
  }
  return col;
}

float DigSeg (vec2 q)
{
  return (1. - smoothstep (0.13, 0.17, abs (q.x))) *
     (1. - smoothstep (0.5, 0.57, abs (q.y)));
}

float ShowDig (vec2 q, int iv)
{
  float d;
  int k, kk;
  const vec2 vp = vec2 (0.5, 0.5), vm = vec2 (-0.5, 0.5), vo = vec2 (1., 0.);
  if (iv < 5) {
    if (iv == -1) k = 8;
    else if (iv == 0) k = 119;
    else if (iv == 1) k = 36;
    else if (iv == 2) k = 93;
    else if (iv == 3) k = 109;
    else k = 46;
  } else {
    if (iv == 5) k = 107;
    else if (iv == 6) k = 122;
    else if (iv == 7) k = 37;
    else if (iv == 8) k = 127;
    else k = 47;
  }
  q = (q - 0.5) * vec2 (1.7, 2.3);
  d = 0.;  kk = k / 2;  if (kk * 2 != k) d += DigSeg (q.yx - vo);
  k = kk;  kk = k / 2;  if (kk * 2 != k) d += DigSeg (q.xy - vp);
  k = kk;  kk = k / 2;  if (kk * 2 != k) d += DigSeg (q.xy - vm);
  k = kk;  kk = k / 2;  if (kk * 2 != k) d += DigSeg (q.yx);
  k = kk;  kk = k / 2;  if (kk * 2 != k) d += DigSeg (q.xy + vm);
  k = kk;  kk = k / 2;  if (kk * 2 != k) d += DigSeg (q.xy + vp);
  k = kk;  kk = k / 2;  if (kk * 2 != k) d += DigSeg (q.yx + vo);
  return d;
}

float ShowInt (vec2 q, vec2 cBox, float mxChar, float val)
{
  float nDig, idChar, s, sgn, v;
  q = vec2 (- q.x, q.y) / cBox;
  s = 0.;
  if (min (q.x, q.y) >= 0. && max (q.x, q.y) < 1.) {
    q.x *= mxChar;
    sgn = sign (val);
    val = abs (val);
    nDig = (val > 0.) ? floor (max (log (val) / log (10.), 0.) + 0.001) + 1. : 1.;
    idChar = mxChar - 1. - floor (q.x);
    q.x = fract (q.x);
    v = val / pow (10., mxChar - idChar - 1.);
    if (sgn < 0.) {
      if (idChar == mxChar - nDig - 1.) s = ShowDig (q, -1);
      else ++ v;
    }
    if (idChar >= mxChar - nDig) s = ShowDig (q, int (mod (floor (v), 10.)));
  }
  return s;
}

const vec4 cHashA4 = vec4 (0., 1., 57., 58.);
const vec3 cHashA3 = vec3 (1., 57., 113.);
const float cHashM = 43758.54;

vec4 Hashv4f (float p)
{
  return fract (sin (p + cHashA4) * cHashM);
}

float Noisefv2 (vec2 p)
{
  vec4 t;
  vec2 ip, fp;
  ip = floor (p);
  fp = fract (p);
  fp = fp * fp * (3. - 2. * fp);
  t = Hashv4f (dot (ip, cHashA3.xy));
  return mix (mix (t.x, t.y, fp.x), mix (t.z, t.w, fp.x), fp.y);
}

float Fbm2 (vec2 p)
{
  float f, a;
  f = 0.;
  a = 1.;
  for (int i = 0; i < 5; i ++) {
    f += a * Noisefv2 (p);
    a *= 0.5;
    p *= 2.;
  }
  return f;
}

vec2 Rot2D (vec2 q, float a)
{
  return q * cos (a) + q.yx * sin (a) * vec2 (-1., 1.);
}




//_______________________________________________________________________________________________________



void main( void)
{
	mainImage(gl_FragColor, gl_FragCoord.xy);
}