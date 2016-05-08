#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// ----------------------------------------------------------------------------------------------------

// variation of https://www.shadertoy.com/view/MscXWM
// in the taste of http://9gag.com/gag/am9peXo

#define A  26.*fract(time*0.0002)*a + time
#define d  O += 0.1*(1.+cos(A)) / length(vec2( fract(a*k*150./6.283)-.5, 16.*(length(U)-.1*k*sin(A)-1.5*k))); a += 6.283;
#define c d d d k+=0.65*k;

void mainImage( out vec4 O, vec2 U, vec2 iResolution )
{
    U = (U+U-(O.xy=iResolution.xy))/O.y;
    float a = atan(U.y,U.x), k=0.525;
    O -= O;  
    c c c c
    O *= O;
	O.y = length(O);
}

// ----------------------------------------------------------------------------------------------------

void main( void ) {
	
	mainImage( gl_FragColor, gl_FragCoord.xy, resolution );
}


