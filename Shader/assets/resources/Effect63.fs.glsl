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

// todo: implement sweep amt
vec2 mouse;

////////////////////////////////////////////////////////////////
// BOILERPLATE UTILITIES...................
const float pi = 3.14159;
const float pi2 = pi * 2.;

float opU( float d1, float d2 ){ return min(d1,d2); }
float opS( float d2, float d1 ){ return max(-d1,d2); }
float opI( float d1, float d2) { return max(d1,d2); }


// from "Magic Fractal" by dgreensp
// https://www.shadertoy.com/view/4ljGDd
float magicBox(vec3 p) {
    const int MAGIC_BOX_ITERS = 13;
    const float MAGIC_BOX_MAGIC = 0.55;
    // The fractal lives in a 1x1x1 box with mirrors on all sides.
    // Take p anywhere in space and calculate the corresponding position
    // inside the box, 0<(x,y,z)<1
    p = 1.0 - abs(1.0 - mod(p, 2.0));
    
    float lastLength = length(p);
    float tot = 0.0;
    // This is the fractal.  More iterations gives a more detailed
    // fractal at the expense of more computation.
    for (int i=0; i < MAGIC_BOX_ITERS; i++) {
      // The number subtracted here is a "magic" paremeter that
      // produces rather different fractals for different values.
      p = abs(p)/(lastLength*lastLength) - MAGIC_BOX_MAGIC;
      float newLength = length(p);
      tot += abs(newLength-lastLength);
      lastLength = newLength;
    }

    return tot;
}


float magicBox(vec2 uv){
    // A random 3x3 unitary matrix, used to avoid artifacts from slicing the
    // volume along the same axes as the fractal's bounding box.
    const mat3 M = mat3(0.28862355854826727, 0.6997227302779844, 0.6535170557707412,
                        0.06997493955670424, 0.6653237235314099, -0.7432683571499161,
                        -0.9548821651308448, 0.26025457467376617, 0.14306504491456504);
    vec3 p = 0.5*M*vec3(uv, 0.0);
    return magicBox(p);
}




mat2 rot2D(float r)
{
    float c = cos(r), s = sin(r);
    return mat2(c, s, -s, c);
}
float nsin(float a){return .5+.5*sin(a);}
float ncos(float a){return .5+.5*cos(a);}
vec3 saturate(vec3 a){return clamp(a,0.,1.);}
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}
float rand(float n){
 	return fract(cos(n*89.42)*343.42);
}
float dtoa(float d, float amount)
{
    return clamp(1.0 / (clamp(d, 1.0/amount, 1.0)*amount), 0.,1.);
}
float sdAxisAlignedRect(vec2 uv, vec2 tl, vec2 br)
{
    vec2 d = max(tl-uv, uv-br);
    return length(max(vec2(0.0), d)) + min(0.0, max(d.x, d.y));
}
float sdCircle(vec2 uv, vec2 origin, float radius)
{
    return length(uv - origin) - radius;
}
// 0-1 1-0
float smoothstep4(float e1, float e2, float e3, float e4, float val)
{
    return min(smoothstep(e1,e2,val), 1.-smoothstep(e3,e4,val));
}
// hash & simplex noise from https://www.shadertoy.com/view/Msf3WH
vec2 hash( vec2 p )
{
	p = vec2( dot(p,vec2(127.1,311.7)),
			  dot(p,vec2(269.5,183.3)) );
	return -1.0 + 2.0*fract(sin(p)*43758.5453123);
}
// returns -.5 to 1.5. i think.
float noise( in vec2 p )
{
    const float K1 = 0.366025404; // (sqrt(3)-1)/2;
    const float K2 = 0.211324865; // (3-sqrt(3))/6;

	vec2 i = floor( p + (p.x+p.y)*K1 );
	
    vec2 a = p - i + (i.x+i.y)*K2;
    vec2 o = (a.x>a.y) ? vec2(1.0,0.0) : vec2(0.0,1.0); //vec2 of = 0.5 + 0.5*vec2(sign(a.x-a.y), sign(a.y-a.x));
    vec2 b = a - o + K2;
	vec2 c = a - 1.0 + 2.0*K2;

    vec3 h = max( 0.5-vec3(dot(a,a), dot(b,b), dot(c,c) ), 0.0 );

	vec3 n = h*h*h*h*vec3( dot(a,hash(i+0.0)), dot(b,hash(i+o)), dot(c,hash(i+1.0)));

    return dot( n, vec3(70.0) );	
}
float noise01(vec2 p)
{
    return clamp((noise(p)+.5)*.5, 0.,1.);
}
// debug function to convert distance to color, revealing sign.
vec3 dtocolor(vec3 inpColor, float dist)
{
    vec3 ret;
    if(dist > 0.)
        ret = mix(vec3(0,0,.5), vec3(.5,.5,1), sin(dist * pi2 * 50.));// red = negative / inside geometry.
    else
	    ret = mix(vec3(1.,.5,.5), vec3(.5,0,0), sin(dist * pi2 * 50.));// blue = positive, of of geometry.
    ret = mix(ret, vec3(0), clamp(abs(dist),0.,1.));// falloff
    return ret;
}

float smooth(float x)
{
    return x*x*x*(x*(x*6. - 15.) + 10.);
}

////////////////////////////////////////////////////////////////
// APP CODE ...................

// this function will produce a line with brush strokes. the inputs are such
// that you can apply it to pretty much any line; the geometry is separated from this function.
vec3 colorBrushStroke(vec2 uvLine, vec2 uvPaper, vec2 lineSize, float sdGeometry, vec3 inpColor, vec4 brushColor)
{
    float posInLineY = (uvLine.y / lineSize.y);// position along the line. in the line is 0-1.

    if(iMouse.z > 0.)
    {
//    return mix(inpColor, vec3(0), dtoa(sdGeometry, 1000.));// reveal geometry.
//    return mix(inpColor, dtocolor(inpColor, uvLine.y), dtoa(sdGeometry, 1000.));// reveal Y
//    return mix(inpColor, dtocolor(inpColor, posInLineY), dtoa(sdGeometry, 1000.));// reveal pos in line.
//    return mix(inpColor, dtocolor(inpColor, uvLine.x), dtoa(sdGeometry, 1000.));// reveal X
    	float okthen = 42.;// NOP
    }
    
    // warp the position-in-line, to control the curve of the brush falloff.
    if(posInLineY > 0.)
    {
        float mouseX = iMouse.x == 0. ? 0.2 : (iMouse.x / iResolution.x);
	    posInLineY = pow(posInLineY, (pow(mouseX,2.) * 15.) + 1.5);
    }

    // brush stroke fibers effect.
    float strokeBoundary = dtoa(sdGeometry, 300.);// keeps stroke texture inside the geometry.
    float strokeTexture = 0.
        + noise01(uvLine * vec2(min(iResolution.y,iResolution.x)*0.2, 1.))// high freq fibers
        + noise01(uvLine * vec2(79., 1.))// smooth brush texture. lots of room for variation here, also layering.
        + noise01(uvLine * vec2(14., 1.))// low freq noise, gives more variation
        ;
    strokeTexture *= 0.333 * strokeBoundary;// 0 to 1 (take average of above)
    strokeTexture = max(0.008, strokeTexture);// avoid 0; it will be ugly to modulate
  	// fade it from very dark to almost nonexistent by manipulating the curve along Y
	float strokeAlpha = pow(strokeTexture, max(0.,posInLineY)+0.09);// add allows bleeding
    // fade out the end of the stroke by shifting the noise curve below 0
    const float strokeAlphaBoost = 1.09;
    if(posInLineY > 0.)
        strokeAlpha = strokeAlphaBoost * max(0., strokeAlpha - pow(posInLineY,0.5));// fade out
    else
        strokeAlpha *= strokeAlphaBoost;

    strokeAlpha = smooth(strokeAlpha);
    
    // paper bleed effect.
    float paperBleedAmt = 60. + (rand(uvPaper.y) * 30.) + (rand(uvPaper.x) * 30.);
//    amt = 500.;// disable paper bleed    
    
    // blotches (per stroke)
    //float blotchAmt = smoothstep(17.,18.5,magicBox(vec3(uvPaper, uvLine.x)));
    //blotchAmt *= 0.4;
    //strokeAlpha += blotchAmt;

    float alpha = strokeAlpha * brushColor.a * dtoa(sdGeometry, paperBleedAmt);
    alpha = clamp(alpha, 0.,1.);
    return mix(inpColor, brushColor.rgb, alpha);
}

vec3 colorBrushStrokeLine(vec2 uv, vec3 inpColor, vec4 brushColor, vec2 p1_, vec2 p2_, float lineWidth)
{
    // flatten the line to be axis-aligned.
    float lineAngle = pi-atan(p1_.x - p2_.x, p1_.y - p2_.y);
    mat2 rotMat = rot2D(lineAngle);

    float lineLength = distance(p2_, p1_);
    // make an axis-aligned line from this line.
    vec2 tl = (p1_ * rotMat);// top left
    vec2 br = tl + vec2(0,lineLength);// bottom right
    vec2 uvLine = uv * rotMat;

    // make line slightly narrower at end.
    lineWidth *= mix(1., .9, smoothstep(tl.y,br.y,uvLine.y));
    
    // wobble it around, humanize
    float res = min(iResolution.y,iResolution.x);
    uvLine.x += (noise01(uvLine * 1.)-0.5) * 0.02;
    uvLine.x += cos(uvLine.y * 3.) * 0.009;// smooth lp wave
    uvLine.x += (noise01(uvLine * 5.)-0.5) * 0.005;// a sort of random waviness like individual strands are moving around
//    uvLine.x += (noise01(uvLine * res * 0.18)-0.5) * 0.0035;// HP random noise makes it look less scientific

    // calc distance to geometry. actually just do a straight line, then we will round it out to create the line width.
    float d = sdAxisAlignedRect(uvLine, tl, br) - lineWidth / 2.;
    uvLine = tl - uvLine;
    
    vec2 lineSize = vec2(lineWidth, lineLength);
    
    vec3 ret = colorBrushStroke(vec2(uvLine.x, -uvLine.y), uv, lineSize,
                                d, inpColor, brushColor);
    return ret;
}

// returns:
// xy = uvLine
// z = radius
vec3 humanizeBrushStrokeDonut(vec2 uvLine, float radius_, bool clockwise, float lineLength)
{
    vec2 humanizedUVLine = uvLine;
    
	// offsetting the circle along its path creates a twisting effect.
    float twistAmt = .24;
    float linePosY = humanizedUVLine.y / lineLength;// 0 to 1 scale
    humanizedUVLine.x += linePosY * twistAmt;
    
    // perturb radius / x
    float humanizedRadius = radius_;
    float res = min(iResolution.y,iResolution.x);
    humanizedRadius += (noise01(uvLine * 1.)-0.5) * 0.04;
    humanizedRadius += sin(uvLine.y * 3.) * 0.019;// smooth lp wave
    humanizedUVLine.x += sin(uvLine.x * 30.) * 0.02;// more messin
    humanizedUVLine.x += (noise01(uvLine * 5.)-0.5) * 0.005;// a sort of random waviness like individual strands are moving around
//    humanizedUVLine.x += (noise01(uvLine * res * 0.18)-0.5) * 0.0035;// HP random noise makes it look less scientific
    
    return vec3(humanizedUVLine, humanizedRadius);
}

// there's something about calling an Enso a "donut" that makes me giggle.
// TODO: sweepAmt is 0 to 1, the amount of the circle to cover by the brush stroke. 1=whole circle. 0=just a point.
vec3 colorBrushStrokeDonut(vec2 uv, vec3 inpColor, vec4 brushColor, vec2 o, float radius_, float angleStart, float sweepAmt, float lineWidth, bool clockwise)
{
	vec2 uvLine = uv - o;
    float angle = atan(uvLine.x, uvLine.y) + pi;// 0-2pi
    angle = mod(angle-angleStart+pi, pi2);
    if(!clockwise)
        angle = pi2 - angle;
    float lineLength = radius_ * pi2;// this is calculated before any humanizing/perturbance. so it's possible that it's slightly inaccurate, but in ways that will never matter
    uvLine = vec2(
        radius_ - length(uvLine),
        angle / pi2 * lineLength
    );
    
    // make line slightly narrower at end.
    float lineWidth1 = lineWidth * mix(1., .9, smoothstep(0.,lineLength,uvLine.y));
    
    vec3 hu = humanizeBrushStrokeDonut(uvLine, radius_, clockwise, lineLength);
    vec2 humanizedUVLine = hu.xy;
    float humanizedRadius = hu.z;

    float d = opS(sdCircle(uv, o, humanizedRadius),
                  sdCircle(uv, o, humanizedRadius));
    d -= lineWidth1 * 0.5;// round off things just like in the line routine.

    vec3 ret = colorBrushStroke(humanizedUVLine, uv, vec2(lineWidth1, lineLength), d, inpColor, brushColor);
    
    // do the same but for before the beginning of the line. distance field is just a single point
    vec3 ret2 = vec3(1);
    if(angle > pi)
    {
        uvLine.y -= lineLength;
        hu = humanizeBrushStrokeDonut(uvLine, radius_, clockwise, lineLength);
        humanizedUVLine = hu.xy;
        humanizedRadius = hu.z;
        vec2 strokeStartPos = o + vec2(sin(angleStart), cos(angleStart)) * humanizedRadius;
        d = distance(uv, strokeStartPos);
        d -= lineWidth * 0.5 * 1.;// round off things just like in the line routine.
        ret2 = colorBrushStroke(humanizedUVLine, uv, vec2(lineWidth, lineLength), d, inpColor, brushColor);
	}
    return min(ret, ret2);
}


vec2 getuv_centerX(vec2 fragCoord, vec2 newTL, vec2 newSize)
{
    vec2 ret = vec2(fragCoord.x / iResolution.x, (iResolution.y - fragCoord.y) / iResolution.y);// ret is now 0-1 in both dimensions
    ret *= newSize;// scale up to new dimensions
    float aspect = iResolution.x / iResolution.y;
    ret.x *= aspect;// orig aspect ratio
    float newWidth = newSize.x * aspect;
    return ret + vec2(newTL.x - (newWidth - newSize.x) / 2.0, newTL.y);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 uvSignature = (fragCoord / iResolution.y * 2.0) - 1.;
    mouse = getuv_centerX(iMouse.xy, vec2(-1,-1), vec2(2,2));// (iMouse.xy / iResolution.y * 2.0) - 1.;
	vec2 uv = getuv_centerX(fragCoord, vec2(-1,-1), vec2(2,2));// 0-1 centered
    
    vec3 col = vec3(1.,1.,0.875);// bg
    float dist;
    
	// geometry on display...
	float yo = sin(-uv.x*pi*0.5)*0.2;
    col = colorBrushStrokeLine(uv, col, vec4(vec3(.8,.1,0),.9),// red fixed line
                           vec2(-1.4, -.4+yo),
                           vec2(2.6, -.4+yo), 0.3);

    col = colorBrushStrokeLine(uv, col, vec4(vec3(.8,.1,0),0.4),// red fixed line
                           vec2(1.3, 0.+yo),
                           vec2(-2.9, 0.+yo), 0.03);

    col = colorBrushStrokeLine(uv, col, vec4(vec3(.8,.1,0),0.52),// red fixed line
                           vec2(1.3, .3+yo + (cos(uv.x * 12.) * 0.025)),
                           vec2(-2.9, .3+yo), 0.1);


    col = colorBrushStrokeDonut(uv, col, vec4(0,0,0,.9),
                                vec2(0,0),// origin
                                0.6,// radius
                                0.2,// angle of brush start
                                0.5,// sweep amt 0-1
                                0.3,// width
                                false);// clockwise
    
    // paint blotches
    float blotchAmt = smoothstep(20.,50.,magicBox((uv+12.)*2.));// smoothstep(40.,40.5, magicBox((uv+9.4)*2.));
    blotchAmt = pow(blotchAmt, 3.);// attenuate
    blotchAmt = .7*smoothstep(.2,.4,blotchAmt);// sharpen
    col *= 1.-blotchAmt;
    
	// signature
    dist = sdAxisAlignedRect(uvSignature, vec2(-0.68), vec2(-0.55));
    float amt = 90. + (rand(uvSignature.y) * 100.) + (rand(uvSignature.x / 4.) * 90.);
    float vary = sin(uvSignature.x*uvSignature.y*50.)*0.0047;
    dist = opS(dist-0.028+vary, dist-0.019-vary);// round edges, and hollow it out
    col = mix(col, vec3(0.8,.1, 0.0), dtoa(dist, amt) * 0.3);
    col = mix(col, vec3(0.8,.1, 0.0), dtoa(dist, amt*4.) * 0.95);

    // grain
    col.rgb += (rand(uv)-.5)*.08;
    col.rgb = saturate(col.rgb);

    // vignette
    vec2 uvScreen = (fragCoord / iResolution.xy * 2.)-1.;
	float vignetteAmt = 1.-dot(uvScreen*0.5,uvScreen* 0.62);
    col *= vignetteAmt;
    
    fragColor = vec4(col, 1.);
}


//_______________________________________________________________________________________________________





void main( void)
{
	mainImage(gl_FragColor, gl_FragCoord.xy);
}