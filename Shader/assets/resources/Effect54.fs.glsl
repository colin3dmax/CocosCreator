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

#define pi 3.14159265358979
#define sqrt3_divide_6 0.289
#define sqrt6_divide_12 0.204

const float seg = 4.0;
const float segwidth = 1./(2.*seg-1.);

float _CircleRadius = 0.10;
float _OutlineWidth = 0.02;
float _LineWidth = 0.08;
vec4 _OutlineColor = vec4(0.,0.,0.,0.);
vec4 _FrontColor = vec4(186.0/256.0,42.0/256.0,42.0/256.0,1.);
vec4 _BackColor = vec4(120.0/256.0,30.0/256.0,30.0/256.0,1.);
vec4 _BackgroundColor = vec4(227./256.,206./256.,178./256.,1.);

//======================
// Line functions
//======================
float line(vec2 pos, vec2 point1, vec2 point2, float width) {
    vec2 dir0 = point2 - point1;
    vec2 dir1 = pos - point1;
    float h = clamp(dot(dir0, dir1)/dot(dir0, dir0), 0.0, 1.0);
    float d = (length(dir1 - dir0 * h) - width * 0.5);
    return d;
}

vec4 line_with_color(vec2 pos, vec2 point1, vec2 point2, float width) {   		
    float d = line(pos, point1, point2, width);
    // float w = fwidth(0.5*d) * 2.0;
    float w = 1.0 * 0.005;
    vec4 layer0 = vec4(_OutlineColor.rgb, 1.-smoothstep(-w, w, d - _OutlineWidth));
    vec4 layer1 = vec4(_FrontColor.rgb, 1.-smoothstep(-w, w, d));
    
    return mix(layer0, layer1, layer1.a);
}

//======================
// Dashed line functions
//======================
float dashedline(vec2 pos, vec2 point1, vec2 point2, float width) {
    vec2 prePoint = point1;
    vec2 curPoint = point1*(1.-segwidth)+segwidth*point2;
    float d = 1.;
    for (float t=segwidth; t<1.01; t+=2.*segwidth) {
        curPoint = point1*(1.-t)+t*point2;
        d = min(d, line(pos, prePoint, curPoint, width));
        prePoint = point1*(1.-(t+segwidth))+(t+segwidth)*point2;
    }
    return d;
}

vec4 dashedline_with_color(vec2 pos, vec2 point1, vec2 point2, float width) {   	
    float d = dashedline(pos, point1, point2, width);
    // float w = fwidth(0.5*d) * 2.0;
    float w = 0.005;
    vec4 layer0 = vec4(_OutlineColor.rgb, 1.-smoothstep(-w, w, d - _OutlineWidth));
    vec4 layer1 = vec4(_BackColor.rgb, 1.-smoothstep(0., w, d));
    
    return mix(layer0, layer1, layer1.a);
}

//======================
// Circle functions
//======================
float circle(vec2 pos, vec2 center, float radius) {
    float d = length(pos - center) - radius;
    return d;
}

vec4 circle_with_color(vec2 pos, vec2 center, float radius, vec4 color) {
    float d = circle(pos, center, radius);
    // float w = fwidth(0.5*d) * 2.0;
    float w = 0.005;
    vec4 layer0 = vec4(_OutlineColor.rgb, 1.-smoothstep(-w, w, d - _OutlineWidth));
    vec4 layer1 = vec4(color.rgb, 1.-smoothstep(0., w, d));
    
    return mix(layer0, layer1, layer1.a);
}

//======================
// Helper functions
//======================
void setlayer(inout vec4 layers[6], int index, vec4 val) {
    if (index == 0) {
        layers[0] = val;
    } else if (index == 1) {
        layers[1] = val;
    } else if (index == 2) {
        layers[2] = val;
    } else if (index == 3) {
        layers[3] = val;
    } else if (index == 4) {
        layers[4] = val;
    } else if (index == 5) {
        layers[5] = val;
    }
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    vec2 originalPos = (2.0 * fragCoord - iResolution.xy)/iResolution.yy;
    vec2 pos = originalPos;

    // Apply X Y Z rotations
    // Find more info from http://en.wikipedia.org/wiki/Rotation_matrix
    float xSpeed = 0.3*iGlobalTime+iMouse.x*0.01;
    float ySpeed = 0.5*iGlobalTime+iMouse.y*0.01;
    float zSpeed = 0.7*iGlobalTime;
    mat3 matrix = mat3(1., 0., 0.,
                      0., cos(xSpeed), sin(xSpeed),
                      0., -sin(xSpeed), cos(xSpeed));
    matrix = mat3(cos(ySpeed), 0., -sin(ySpeed),
                      0., 1., 0.,
                      sin(ySpeed), 0., cos(ySpeed))*matrix;
    matrix = mat3(cos(zSpeed), sin(zSpeed), 0.,
                 	  -sin(zSpeed), cos(zSpeed), 0.,
                 	  0., 0., 0.)*matrix;
    
    float l = 1.5;
    vec3 p[4];
    p[0] = vec3(0., 0., sqrt6_divide_12 * 3.) * l;
    p[1] = vec3(-0.5, -sqrt3_divide_6, -sqrt6_divide_12) * l;
    p[2] = vec3(0.5, -sqrt3_divide_6, -sqrt6_divide_12) * l;
    p[3] = vec3(0, sqrt3_divide_6 * 2., -sqrt6_divide_12) * l;

    for (int i = 0; i < 4; i++) {
        p[i] = matrix * p[i];
    }
    
    // Compure normals
    vec3 normalOf012 = cross(p[1]-p[0], p[2]-p[0]);
    vec3 normalOf013 = cross(p[3]-p[0], p[1]-p[0]);
    vec3 normalOf023 = cross(p[2]-p[0], p[3]-p[0]);
    vec3 normalOf123 = cross(p[3]-p[1], p[2]-p[1]);

    vec4 layers[6];
    int upperLayer = 0;
    int underlayer = 5;
    float circleColors[4];
    for (int i = 0; i < 4; i++) {
        circleColors[i] = -1.;
    }
    
    if (normalOf012.z < 0. && normalOf013.z < 0.) {
        setlayer(layers, underlayer, dashedline_with_color(pos, p[0].xy, p[1].xy, _LineWidth));
        underlayer -= 1;
    } else {
        setlayer(layers, upperLayer, line_with_color(pos, p[0].xy, p[1].xy, _LineWidth));
        upperLayer += 1;
        circleColors[0] = 1.;
        circleColors[1] = 1.;
    }
    if (normalOf012.z < 0. && normalOf123.z < 0.) {
        setlayer(layers, underlayer, dashedline_with_color(pos, p[1].xy, p[2].xy, _LineWidth));
        underlayer -= 1;
    } else {
        setlayer(layers, upperLayer, line_with_color(pos, p[1].xy, p[2].xy, _LineWidth));
        upperLayer += 1;
        circleColors[1] = 1.;
        circleColors[2] = 1.;
    }
    if (normalOf023.z < 0. && normalOf123.z < 0.) {
        setlayer(layers, underlayer, dashedline_with_color(pos, p[2].xy, p[3].xy, _LineWidth));
        underlayer -= 1;
    } else {
        setlayer(layers, upperLayer, line_with_color(pos, p[2].xy, p[3].xy, _LineWidth));
        upperLayer += 1;
        circleColors[2] = 1.;
        circleColors[3] = 1.;
    }
    if (normalOf023.z < 0. && normalOf012.z < 0.) {
        setlayer(layers, underlayer, dashedline_with_color(pos, p[0].xy, p[2].xy, _LineWidth));
        underlayer -= 1;
    } else {
        setlayer(layers, upperLayer, line_with_color(pos, p[0].xy, p[2].xy, _LineWidth));
        upperLayer += 1;
        circleColors[0] = 1.;
        circleColors[2] = 1.;
    }
    if (normalOf023.z < 0. && normalOf013.z < 0.) {
        setlayer(layers, underlayer, dashedline_with_color(pos, p[0].xy, p[3].xy, _LineWidth));
        underlayer -= 1;
    } else {
        setlayer(layers, upperLayer, line_with_color(pos, p[0].xy, p[3].xy, _LineWidth));
        upperLayer += 1;
        circleColors[0] = 1.;
        circleColors[3] = 1.;
    }
    if (normalOf123.z < 0. && normalOf013.z < 0.) {
        setlayer(layers, underlayer, dashedline_with_color(pos, p[1].xy, p[3].xy, _LineWidth));
        underlayer -= 1;
    } else {
        setlayer(layers, upperLayer, line_with_color(pos, p[1].xy, p[3].xy, _LineWidth));
        upperLayer += 1;
        circleColors[1] = 1.;
        circleColors[3] = 1.;
    }
    
    // Background
	fragColor = vec4(_BackgroundColor.rgb * (1.0-0.2*length(originalPos)), 1.);
    for (int i = 5; i >= 0; i--) {
        fragColor = mix(fragColor, layers[i], layers[i].a);
    }
    
    for (int i = 0; i < 4; i++) {
        if (circleColors[i] > 0.) {
            vec4 c = circle_with_color(pos, p[i].xy, _CircleRadius, _FrontColor);
            fragColor = mix(fragColor, c, c.a);
        }
    }
}
//_______________________________________________________________________________________________________



void main( void)
{
	mainImage(gl_FragColor, gl_FragCoord.xy);
}