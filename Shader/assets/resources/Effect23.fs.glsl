
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




/*
by Uğur Güney. March 8, 2014. 

Hi! I started learning GLSL a month ago. The speedup gained by using
GPU to draw real-time graphics amazed me. If you want to learn
how to write shaders, this tutorial written by a beginner can be
a starting place for you.

Please fix my coding errors and grammar errors. :-)
*/

// choose the tutorial by changing the number and compiling the shader again
#define TUTORIAL 0

/* TUTORIAL LIST
 1 VOID. BLANK SCREEN.
 2 SOLID COLOR
 3 GLSL VECTORS
 4 RGB COLOR MODEL AND COMPONENTS OF VECTORS
 5 THE COORDINATE SYSTEM
 6 RESOLUTION, THE FRAME SIZE
 7 COORDINATE TRANSFORMATION
 8 HORIZONTAL AND VERTICAL LINES
 9 VISUALISING THE COORDINATE SYSTEM
10 MOVING THE COORDINATE CENTER TO THE CENTER OF THE FRAME
11 MAKING THE ASPECT RATIO OF THE COORDINATE SYSTEM 1.0
12 DISK
13 FUNCTIONS
14 BUILT-IN FUNCTIONS: STEP
15 BUILT-IN FUNCTIONS: CLAMP
16 BUILT-IN FUNCTIONS: SMOOTHSTEP
17 BUILT-IN FUNCTIONS: MIX
18 ANTI-ALIASING WITH SMOOTHSTEP
19 FUNCTION PLOTTING
20 COLOR ADDITION AND SUBSTRACTION
21 COORDINATE TRANSFORMATIONS: ROTATION
22 COORDINATE TRANSFORMATIONS: SCALING
23 SUCCESSIVE COORDINATE TRANSFORMATIONS
24 TIME, MOTION AND ANIMATION
25 PLASMA EFFECT
26 TEXTURES
27 MOUSE INPUT
28 RANDOMNESS
*/

#define PI 3.14159265359
#define TWOPI 6.28318530718

#if TUTORIAL == 1
// VOID. BLANK SCREEN.
//
// "main" function is called several times per second to produce
// the shader effect.
// The system aims to produces a speed of 60 frames per second (FPS).
// But if the GLSL script is computationally hard, then the frame
// rate drops. (You can read the frame rate at the info bar below
// the screen.
//
// Because we are not doing anything in the function
// this shader will produce a black screen.
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
}

#elif TUTORIAL == 2
// SOLID COLOR
//
// "fragColor" is the output variable of the shader.
// Its value determines the image on the screen.
// This shaders sets its value to be the yellow color.
//
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	fragColor = vec4(1.0, 1.0, 0.0 ,1.0);
}


#elif TUTORIAL == 3
// GLSL VECTORS
//
// fragColor" should be assigned a vec4 object, which is made 
// of four numbers between 0 and 1.
// First three numbers determines the color, and fourth number
// determines the opacity.
// (For now changing the transparancy value will have no effect)
// A "vec4" data object can be constructed by giving 4 "float" arguments,
// or one "vec3" and one "float" argument.
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	// Here we are seperating the color and transparency parts
	// of the vec4 that represents the pixels.
	vec3 color = vec3(0.0, 1.0, 1.0);
	float alpha = 1.0;
	
	vec4 pixel = vec4(color, alpha);
	fragColor = pixel;
}

#elif TUTORIAL == 4
// RGB COLOR MODEL AND COMPONENTS OF VECTORS
//
// After initialized, the components of vectors can be reached using
// the dot "." notation.
//
// RGB: http://en.wikipedia.org/wiki/RGB_color_model
// A color is represented by three numbers (here in the range [0.0, 1.0])
// The model assumes the addition of pure red, green and blue lights
// of given intensities.
//
// If you lack design skills like me, and having hard time
// in choosing nice looking, coherent set of colors 
// you can use one of these websites to choose color palettes, where
// you can browse different sets of colors 
// https://kuler.adobe.com/create/color-wheel/
// http://www.colourlovers.com/palettes
// http://www.colourlovers.com/colors
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	// play with these numbers:
	float redAmount = 0.6; // amount of redness
	float greenAmount = 0.2; // amount of greenness
	float blueAmount = 0.9; // amount of blueness
	
	vec3 color = vec3(0.0); 
	// Here we only input a single argument. It is a third way of
	// contructing vectors.
	// "vec3(x)" is equivalent to vec3(x, x, x);
	// This vector is initialized as
	// color.x = 0.0, color.y = 0.0; color.z = 0.0;
	color.x = redAmount;
	color.y = greenAmount;
	color.z = blueAmount;
	
	float alpha = 1.0;
	vec4 pixel = vec4(color, alpha);	
	fragColor = pixel;
}


#elif TUTORIAL == 5
// THE COORDINATE SYSTEM
//
// "fragCoord", "fragment coordinate" is an input variable.
//
// It tells us at which pixel we are on the screen. The coordinate center
// is the left bottom corner, and coordinate values increases towards
// right and upwards.
//
// The main function is run for each and every pixel on the screen. At
// each call the "gl_FracCoord" has the coordinates of the corresponding
// pixel.
//
// GPUs have many cores, so, the function calls for different pixels
// can be calculated in parallel at the same time.
// This allows higher speeds than the calculation of pixel colors one
// by one in series on the CPU. But, it puts an important constraint too:
// The value of a pixel cannot depend on the value of another pixel. (the
// calculations are done in parallel and it is impossible to know which
// one will finish before the other one)
// The outcome of a pixel can only depend on the pixel coordinate (and
// some other input variables.)
// This is the most important difference of shader programming. We'll
// come to this point again and again
//
// Let's draw something that is not a solid color.
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	// choose two colors
	vec3 color1 = vec3(0.886, 0.576, 0.898);
	vec3 color2 = vec3(0.537, 0.741, 0.408);
	vec3 pixel;
	
	// if the x coordinate is greater than 100 then plot color1
	// else plot color2
	float widthOfStrip = 100.0;
	if( fragCoord.x > widthOfStrip ) {
		pixel = color2;
	} else {
		pixel = color1;
	}
	
	fragColor = vec4(pixel, 1.0);
}

#elif TUTORIAL == 6
// RESOLUTION, THE FRAME SIZE
//
// If you resize your browser, or go to fullscreen mode and come back
// you'll see that the ratio of the width of the first color to the
// second color changes with screen size.
// It is because we set the width of the strip in absolute number of
// pixels, rather than as a proportion of the screen width and height.
//
// Say we want to paint the left and right halves with different colors.
// Without knowing the number of pixels horizontally, we cannot prepare
// a shader that works on all frame sizes.
// 
// How can we learn the screen size (the width and height) in terms of 
// the number of pixel. It is given us in the variable "iResolution".
// "iResolution.x" is the width of the frame, and
// "iResolution.y" is the height of the frame
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec3 color1 = vec3(0.741, 0.635, 0.471);
	vec3 color2 = vec3(0.192, 0.329, 0.439);
	vec3 pixel;
	
	// sugar syntax for "if" conditional. It says
	// "if the x coordinate of a pixel is greater than the half of
	// the width of the screen, then use color1, otherwise use
	// color2."
	pixel = ( fragCoord.x > iResolution.x / 2.0 ) ? color1 : color2;
	
	fragColor = vec4(pixel, 1.0);
}

#elif TUTORIAL == 7
// COORDINATE TRANSFORMATION
// 
// Instead of working on screen coordinates, using our own coordinate
// system is more convenient most of the time.
//
// Here we will make and use a new coordinate system "r", instead of
// the absolute screen coordinates "fragCoord". In "r"
// the x and y coordinates will go from 0 to 1. For x, 0 is the left
// side and 1 is the right side. For y, 0 is the bottom side, and 1 is
// the upper side.
//
// Using "r" let's divide the screen into 3 parts.
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 r = vec2(fragCoord.x / iResolution.x,
				  fragCoord.y / iResolution.y);
	// r is a vec2. Its first component is pixel x-coordinate divided by
	// the frame width. And second component is the pixel y-coordinate
	// divided by the frame height.
	//
	// For example, on my laptop, the full screen frame size is
	// 1440 x 900. Therefore iResolution is (1440.0, 900.0).
	// The main function should be run 1440*900=1296000 times to
	// generate a frame.
	// fragCoord.x will have values between 0 and 1439, and
	// fragCoord.y will have values between 0 and 899, whereas
	// r.x and r.y will have values between [0,1].
	
	vec3 color1 = vec3(0.841, 0.582, 0.594);
	vec3 color2 = vec3(0.884, 0.850, 0.648);
	vec3 color3 = vec3(0.348, 0.555, 0.641);
	vec3 pixel;
	
	// sugar syntax for "if" conditional. It says
	// "if the x coordinate of a pixel is greater than the half of
	// the width of the screen, then use color1, otherwise use
	// color2."
	if( r.x < 1.0/3.0) {
		pixel = color1;
	} else if( r.x < 2.0/3.0 ) {
		pixel = color2;
	} else {
		pixel = color3;
	}
			
	// pixel = ( r.x < 1.0/3.0 ) ? color1 : (r.x<2.0/3.0) ? color2: color3;
	// same code, single line.
	
	fragColor = vec4(pixel, 1.0);
}

#elif TUTORIAL == 8
// HORIZONTAL AND VERTICAL LINES
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 r = vec2( fragCoord.xy / iResolution.xy );
	// shorter version of the same coordinate transformation.
	// For example "aVector.xy" is a new vec2 made of the first two 
	// components of "aVector".
	// And, when division operator is applied between vectors,
	// each component of the first vector is divided by the corresponding
	// component of the second vector.
	// So, first line of this tutorial is the same as the first line
	// of the previous tutorial.
	
	vec3 backgroundColor = vec3(1.0);
	vec3 color1 = vec3(0.216, 0.471, 0.698);
	vec3 color2 = vec3(1.00, 0.329, 0.298);
	vec3 color3 = vec3(0.867, 0.910, 0.247);
	

	// start by setting the background color. If pixel's value
	// is not overwritten later, this color will be displayed.
	vec3 pixel = backgroundColor;
	
	// if the current pixel's x coordinate is between these values,
	// then put color 1.
	// The difference between 0.55 and 0.54 determines
	// the with of the line.
	float leftCoord = 0.54;
	float rightCoord = 0.55;
	if( r.x < rightCoord && r.x > leftCoord ) pixel = color1;
	
	// a different way to express a line, in terms of its center and width.
	float lineCoordinate = 0.4;
	float lineWidth = 0.003;
	if(abs(r.x - lineCoordinate)<lineWidth) pixel = color2;
	
	// a horizontal line
	if(abs(r.y - 0.6)<0.01) pixel = color3;
	
	// see how the third line goes over the first two lines.
	// because it is the last one that sets the value of the "pixel".

	fragColor = vec4(pixel, 1.0);
}

#elif TUTORIAL == 9
// VISUALISING THE COORDINATE SYSTEM
//
// Let's use a for loop and horizontal and vertical lines to draw
// a grid of the coordinate center
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 r = vec2( fragCoord.xy / iResolution.xy );
	
	vec3 backgroundColor = vec3(1.0);
	vec3 axesColor = vec3(0.0, 0.0, 1.0);
	vec3 gridColor = vec3(0.5);

	// start by setting the background color. If pixel's value
	// is not overwritten later, this color will be displayed.
	vec3 pixel = backgroundColor;
	
	// Draw the grid lines
	// we used "const" because loop variables can only be manipulated
	// by constant expressions.
	const float tickWidth = 0.1;
	for(float i=0.0; i<1.0; i+=tickWidth) {
		// "i" is the line coordinate.
		if(abs(r.x - i)<0.002) pixel = gridColor;
		if(abs(r.y - i)<0.002) pixel = gridColor;
	}
	// Draw the axes
	if( abs(r.x)<0.005 ) pixel = axesColor;
	if( abs(r.y)<0.006 ) pixel = axesColor;
	
	fragColor = vec4(pixel, 1.0);
}

#elif TUTORIAL == 10
// MOVING THE COORDINATE CENTER TO THE CENTER OF THE FRAME
//
// Instead of mapping [0, iResolution.x]x[0, iResolution.y] region to
// [0,1]x[0,1], lets map it to [-1,1]x[-1,1]. This way the coordinate
// (0,0) will not be at the lower left corner of the screen, but in the
// middle of the screen.
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 r = vec2( fragCoord.xy - 0.5*iResolution.xy );
	// [0, iResolution.x] -> [-0.5*iResolution.x, 0.5*iResolution.x]
	// [0, iResolution.y] -> [-0.5*iResolution.y, 0.5*iResolution.y]
	r = 2.0 * r.xy / iResolution.xy;
	// [-0.5*iResolution.x, 0.5*iResolution.x] -> [-1.0, 1.0]
	
	vec3 backgroundColor = vec3(1.0);
	vec3 axesColor = vec3(0.0, 0.0, 1.0);
	vec3 gridColor = vec3(0.5);

	// start by setting the background color. If pixel's value
	// is not overwritten later, this color will be displayed.
	vec3 pixel = backgroundColor;
	
	// Draw the grid lines
	// This time instead of going over a loop for every pixel
    // we'll use mod operation to achieve the same result
    // with a single calculation (thanks to mikatalk)
	const float tickWidth = 0.1;
	if( mod(r.x, tickWidth) < 0.008 ) pixel = gridColor;
    if( mod(r.y, tickWidth) < 0.008 ) pixel = gridColor;
    // Draw the axes
	if( abs(r.x)<0.006 ) pixel = axesColor;
	if( abs(r.y)<0.007 ) pixel = axesColor;
	
	fragColor = vec4(pixel, 1.0);
}


#elif TUTORIAL == 11
// MAKING THE ASPECT RATIO OF THE COORDINATE SYSTEM 1.0
//
// As we have seen from the previous examples, we do get rectangles
// instead of squares when we plot the coordinate systems.
// It is because, we assigned same numerical interval, [0,1] to different
// physical distances. Actually the width of the frame is bigger 
// than of its height.
// So, to keep the aspect ratio, we should not map the actual distances
// [0, iResolution.x] and [0, iResolution.y] to the same interval.
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 r = vec2( fragCoord.xy - 0.5*iResolution.xy );
	r = 2.0 * r.xy / iResolution.y;
	// instead of dividing r.x to iResolution.x and r.y to iResolution.y
	// divide both of them to iResolution.y.
	// This way r.y will be in [-1.0, 1.0]
	// and r.x will depend on the frame size. I guess the non-full screen
	// mode rx will be in [-1.78, 1.78], and in full screen mode
	// for my laptop, it will be in [-1.6, 1.6] (1440./900.=1.6)
	
	vec3 backgroundColor = vec3(1.0);
	vec3 axesColor = vec3(0.0, 0.0, 1.0);
	vec3 gridColor = vec3(0.5);

	vec3 pixel = backgroundColor;
	
	// Draw grid lines
	const float tickWidth = 0.1;
	for(float i=-2.0; i<2.0; i+=tickWidth) {
		// "i" is the line coordinate.
		if(abs(r.x - i)<0.004) pixel = gridColor;
		if(abs(r.y - i)<0.004) pixel = gridColor;
	}
	// Draw the axes
	if( abs(r.x)<0.006 ) pixel = axesColor;
	if( abs(r.y)<0.007 ) pixel = axesColor;
	
	fragColor = vec4(pixel, 1.0);
}


#elif TUTORIAL == 12
// DISK
//
// Let's draw disks
//
// So, in GLSL we don't give a command of "draw this disk here with that
// color". Instead we use an indirect command such as "if the pixel 
// coordinate is inside this disk, put that color for the pixel"
// The indirect commands are a bit counter intuitive until you
// get used to that way of thinking.
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 r =  2.0*vec2(fragCoord.xy - 0.5*iResolution.xy)/iResolution.y;
	
	vec3 bgCol = vec3(0.3);
	vec3 col1 = vec3(0.216, 0.471, 0.698); // blue
	vec3 col2 = vec3(1.00, 0.329, 0.298); // yellow
	vec3 col3 = vec3(0.867, 0.910, 0.247); // red

	vec3 pixel = bgCol;
	
	// To draw a shape we should know the analytic geometrical
	// expression of that shape.
	// A circle is the set of points that has the same distance from
	// it its center. The distance is called radius.
	// The distance from the coordinate center is sqrt(x*x + y*y)
	// Fix the distance as the radius will give the formula for
	// a circle at the coordinate center
	// sqrt(x*x + y*y) = radius
	// The points inside the circle, the disk, is given as
	// sqrt(x*x + y*y) < radius
	// Squaring both sides will give
	// x*x + y*y < radius*radius
	float radius = 0.8;
	if( r.x*r.x + r.y*r.y < radius*radius ) {
		pixel = col1;
	}
	
	// There is a shorthand expression for sqrt(v.x*v.x + v.y*v.y)
	// of a given vector "v", which is "length(v)"
	if( length(r) < 0.3) {
		pixel = col3;
	}
	
	// draw a disk of which center is not at (0,0).
	// Say the center is at c: (c.x, c.y). 
	// The distance of any point r: (r.x, r.y) to c is 
	// sqrt((r.x-c.x)^2+(r.y-c.y)^2)
	// define a distance vector d: (r.x - c.x, r.y - c.y)
	// in GLSL d can be calculated "d = r - c".
	// Just as in division, substraction of two vectors is done
	// component by component.
	// Then, length(d) means sqrt(d.x^2+d.y^2)
	// which is the distance formula we are looking for.
	vec2 center = vec2(0.9, -0.4);
	vec2 d = r - center;
	if( length(d) < 0.6) {
		pixel = col2;
	}
	// This shifting of the center of the shape works for any
	// kind of shape. If you have a formula in terms of r
	// f(r) = 0, then f(r-c)=0 expresses the same geometric shape
	// but its coordinate is shifted by c.
	
	fragColor = vec4(pixel, 1.0);
}
// Note how the latest disk is shown and previous ones are left
// behind it. It is because the last if condition changes the pixel
// value at the end.
// If the coordinates of pixel fits multiple if conditions, the last
// manipulation will remain and fragColor is set to that one.


#elif TUTORIAL == 13
// FUNCTIONS
//
// Functions are great for code reuse. Let's put the code for disks
// into a function and use the function for drawing.
// There are so many different ways of writing a function to draw a shape.
//
// Here we have a void function that does not return anything. Instead,
// "pixel" is taken as an "inout" expression. "inout" is a unique
// keyword of GLSL.
// By default all arguments are "in" arguments. Which
// means, the value of the variable is given to the function scope
// from the scope the function is called. 
// An "out" variable gives the value of the variable from the function
// to the scope in which the function is called.
// An "inout" argument does both. First the value of the variable is
// sent to the function as its argument. Then, that variable is
// processed inside the function. When the function ends, the value
// of the variable is updated where the function is called.
//
// Here, the "pixel" variable that is initialized with the background
// color in the "main" function. Then, "pixel" is given to the "disk"
// function. When the if condition is satisfied the value of the "pixel"
// is changed with the "color" argument. If it is not satified, the
// "pixel" is left untouched and keeps it previous value (which was the
// "bgColor".
void disk(vec2 r, vec2 center, float radius, vec3 color, inout vec3 pixel) {
	if( length(r-center) < radius) {
		pixel = color;
	}
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 r =  2.0*vec2(fragCoord.xy - 0.5*iResolution.xy)/iResolution.y;
	
	vec3 bgCol = vec3(0.3);
	vec3 col1 = vec3(0.216, 0.471, 0.698); // blue
	vec3 col2 = vec3(1.00, 0.329, 0.298); // yellow
	vec3 col3 = vec3(0.867, 0.910, 0.247); // red

	vec3 pixel = bgCol;
	
	disk(r, vec2(0.1, 0.3), 0.5, col3, pixel);
	disk(r, vec2(-0.8, -0.6), 1.5, col1, pixel);
	disk(r, vec2(0.8, 0.0), .15, col2, pixel);
	
	fragColor = vec4(pixel, 1.0);
}
// As you see, the borders of the disks have "jagged" curves, where
// individual pixels can be seen. This is called "aliasing". It occurs
// because pixels have finite size and we want to draw a continuous
// shape on a discontinuous grid.
// There is a method to reduce the aliasing. It is done by mixing the
// inside color and outside colors at the border. To achieve this
// we have to learn some built-in functions.

// And, again, note the order of disk function calls and how they are
// drawn on top of each other. Each disk function manipulates
// the pixel variable. If a pixel is manipulated by multiple disk
// functions, the value of the last one is sent to fragColor.

// In this case, the previous values are completely overwritten.
// The final value only depends to the last function that manipulated
// the pixel. There are no mixtures between layers.


#elif TUTORIAL == 14
// BUILT-IN FUNCTIONS: STEP
//
// "step" function is the Heaviside step function :-)
// http://en.wikipedia.org/wiki/Heaviside_step_function
// 
// f(x0, x) = {1 x>x0, 
//            {0 x<x0
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 r =  2.0*vec2(fragCoord.xy - 0.5*iResolution.xy)/iResolution.y;
	float xMax = iResolution.x/iResolution.y;
	
	vec3 bgCol = vec3(0.0); // black
	vec3 col1 = vec3(0.216, 0.471, 0.698); // blue
	vec3 col2 = vec3(1.00, 0.329, 0.298); // yellow
	vec3 col3 = vec3(0.867, 0.910, 0.247); // red

	vec3 pixel = bgCol;
	
	float edge, variable, ret;
	
	// divide the screen into five parts horizontally
	// for different examples
	if(r.x < -0.6*xMax) { // Part I
		variable = r.y;
		edge = 0.2;
		if( variable > edge ) { // if the "variable" is greater than "edge"
			ret = 1.0;          // return 1.0
		} else {                // if the "variable" is less than "edge"
			ret = 0.0;          // return 0.0
		}
	} 
	else if(r.x < -0.2*xMax) { // Part II
		variable = r.y;
		edge = -0.2;
		ret = step(edge, variable); // step function is equivalent to the
		                            // if block of the Part I
	} 
	else if(r.x < 0.2*xMax) { // Part III
		// "step" returns either 0.0 or 1.0.
		// "1.0 - step" will inverse the output
		ret = 1.0 - step(0.5, r.y); // Mirror the step function around edge
	} 
	else if(r.x < 0.6*xMax) { // Part IV
		// if y-coordinate is smaller than -0.4 ret is 0.3
		// if y-coordinate is greater than -0.4 ret is 0.3+0.5=0.8
		ret = 0.3 + 0.5*step(-0.4, r.y);
	}
	else { // Part V
		// Combine two step functions to create a gap
		ret = step(-0.3, r.y) * (1.0 - step(0.2, r.y));
		// "1.0 - ret" will create a gap
	}
	
	pixel = vec3(ret); // make a color out of return value.
	fragColor = vec4(pixel, 1.0);
}

#elif TUTORIAL == 15
// BUILT-IN FUNCTIONS: CLAMP
//
// "clamp" function saturates the input below and above the thresholds
// f(x, min, max) = { max x>max
//                  { x   max>x>min
//                  { min min>x
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 r =  2.0*vec2(fragCoord.xy - 0.5*iResolution.xy)/iResolution.y;
	vec2 p = vec2(fragCoord.xy / iResolution.xy);
	// use [0,1] coordinate system for this example
	
	vec3 bgCol = vec3(0.0); // black
	vec3 col1 = vec3(0.216, 0.471, 0.698); // blue
	vec3 col2 = vec3(1.00, 0.329, 0.298); // yellow
	vec3 col3 = vec3(0.867, 0.910, 0.247); // red

	vec3 pixel = bgCol;
	
	float edge, variable, ret;
	
	// divide the screen into four parts horizontally for different
	// examples
	if(p.x < 0.25) { // Part I
		ret = p.y; // the brightness value is assigned the y coordinate
		           // it'll create a gradient
	} 
	else if(p.x < 0.5) { // Part II
		float minVal = 0.3; // implementation of clamp
		float maxVal = 0.6;
		float variable = p.y;
		if( variable<minVal ) {
			ret = minVal;
		}
		if( variable>minVal && variable<maxVal ) {
			ret = variable;
		}
		if( variable>maxVal ) {
			ret = maxVal;
		}
	} 
	else if(p.x < 0.75) { // Part III
		float minVal = 0.6;
		float maxVal = 0.8;
		float variable = p.y;
		ret = clamp(variable, minVal, maxVal);
	} 
	else  { // Part IV
		float y = cos(5.*TWOPI*p.y); // oscillate between +1 and -1
		                             // 5 times, vertically
		y = (y+1.0)*0.5; // map [-1,1] to [0,1]
		ret = clamp(y, 0.2, 0.8);
	}
	
	pixel = vec3(ret); // make a color out of return value.
	fragColor = vec4(pixel, 1.0);
}

#elif TUTORIAL == 16
// BUILT-IN FUNCTIONS: SMOOTHSTEP
//
// "smoothstep" function is like step function but instead of a
// sudden jump from 0 to 1 at the edge, it makes a smooth transition
// in a given interval
// http://en.wikipedia.org/wiki/Smoothstep
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 r =  2.0*vec2(fragCoord.xy - 0.5*iResolution.xy)/iResolution.y;
	vec2 p = vec2(fragCoord.xy / iResolution.xy);
	// use [0,1] coordinate system for this example
	
	vec3 bgCol = vec3(0.0); // black
	vec3 col1 = vec3(0.216, 0.471, 0.698); // blue
	vec3 col2 = vec3(1.00, 0.329, 0.298); // red
	vec3 col3 = vec3(0.867, 0.910, 0.247); // yellow

	vec3 pixel = bgCol;
	
	float edge, variable, ret;
	
	// divide the screen into four parts horizontally for different
	// examples
	if(p.x < 1./5.) { // Part I
		float edge = 0.5;
		ret = step(edge, p.y); // simple step function
	} 
	else if(p.x < 2./5.) { // Part II
		// linearstep (not a builtin function)
		float edge0 = 0.45;
		float edge1 = 0.55;
		float t = (p.y - edge0)/(edge1 - edge0);
		// when p.y == edge0 => t = 0.0
		// when p.y == edge1 => t = 1.0
		// RHS is a linear function of y
		// so, between edge0 and edge1, t has a linear transition
		// between 0.0 and 1.0
		float t1 = clamp(t, 0.0, 1.0);
		// t will have negative values when t<edge0 and
		// t will have greater than 1.0 values when t>edge1
		// but we want it be constraint between 0.0 and 1.0
		// so, clamp it!		
		ret = t1;
	} 
	else if(p.x < 3./5.) { // Part III
		// implementation of smoothstep
		float edge0 = 0.45;
		float edge1 = 0.55;
		float t = clamp((p.y - edge0)/(edge1 - edge0), 0.0, 1.0);
		float t1 = 3.0*t*t - 2.0*t*t*t;
		// previous interpolation was linear. Visually it does not
		// give an appealing, smooth transition.
		// To achieve smoothness, implement a cubic Hermite polynomial
		// 3*t^2 - 2*t^3
		ret = t1;
	}
	else if(p.x < 4./5.) { // Part IV
		ret = smoothstep(0.45, 0.55, p.y);
	}
	else if(p.x < 5./5.) { // Part V
		// smootherstep, a suggestion by Ken Perlin
		float edge0 = 0.45;
		float edge1 = 0.55;
		float t = clamp((p.y - edge0)/(edge1 - edge0), 0.0, 1.0);		
		// 6*t^5 - 15*t^4 + 10*t^3
		float t1 = t*t*t*(t*(t*6. - 15.) + 10.);
		ret = t1;
		// faster transition and still smoother
		// but computationally more involved.
	}	
		
	pixel = vec3(ret); // make a color out of return value.
	fragColor = vec4(pixel, 1.0);
}

#elif TUTORIAL == 17
// BUILT-IN FUNCTIONS: MIX
//
// A shader can be created by first constructing individual parts
// and composing them together.
// There are different ways of how to combine different parts.
// In the previous disk example, different disks were drawn on top
// of each other. There was no mixture of layers. When disks
// overlap, only the last one is visible.
//
// Let's learn mixing different data types (in this case vec3's
// representing colors
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 p = vec2(fragCoord.xy / iResolution.xy);
	
	vec3 bgCol = vec3(0.3);
	vec3 col1 = vec3(0.216, 0.471, 0.698); // blue
	vec3 col2 = vec3(1.00, 0.329, 0.298); // red
	vec3 col3 = vec3(0.867, 0.910, 0.247); // yellow 
	
	vec3 ret;
	
	// divide the screen into four parts horizontally for different
	// examples
	if(p.x < 1./5.) { // Part I
		// implementation of mix
		float x0 = 0.2; // first item to be mixed
		float x1 = 0.7;  // second item to be mixed
		float m = 0.1; // amount of mix (between 0.0 and 1.0)
		// play with this number
		// m = 0.0 means the output is fully x0
		// m = 1.0 means the output is fully x1
		// 0.0 < m < 1.0 is a linear mixture of x0 and x1
		float val = x0*(1.0-m) + x1*m;
		ret = vec3(val);
	} 
	else if(p.x < 2./5.) { // Part II
		// try all possible mix values 
		float x0 = 0.2;
		float x1 = 0.7;
		float m = p.y; 
		float val = x0*(1.0-m) + x1*m;
		ret = vec3(val);		
	} 
	else if(p.x < 3./5.) { // Part III
		// use the mix function
		float x0 = 0.2;
		float x1 = 0.7;
		float m = p.y; 
		float val = mix(x0, x1, m);
		ret = vec3(val);		
	}
	else if(p.x < 4./5.) { // Part IV
		// mix colors instead of numbers
		float m = p.y;
		ret = mix(col1, col2, m);
	}
	else if(p.x < 5./5.) { // Part V
		// combine smoothstep and mix for color transition
		float m = smoothstep(0.5, 0.6, p.y);
		ret = mix(col1, col2, m);
	}
	
	vec3 pixel = ret;
	fragColor = vec4(pixel, 1.0);
}

#elif TUTORIAL == 18
// ANTI-ALIASING WITH SMOOTHSTEP
//
float linearstep(float edge0, float edge1, float x) {
	float t = (x - edge0)/(edge1 - edge0);
	return clamp(t, 0.0, 1.0);
}
float smootherstep(float edge0, float edge1, float x) {
	float t = (x - edge0)/(edge1 - edge0);
	float t1 = t*t*t*(t*(t*6. - 15.) + 10.);
	return clamp(t1, 0.0, 1.0);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 r =  2.0*vec2(fragCoord.xy - 0.5*iResolution.xy)/iResolution.y;
	float xMax = iResolution.x/iResolution.y;
	
	vec3 bgCol = vec3(0.3);
	vec3 col1 = vec3(0.216, 0.471, 0.698); // blue
	vec3 col2 = vec3(1.00, 0.329, 0.298); // yellow
	vec3 col3 = vec3(0.867, 0.910, 0.247); // red

	vec3 pixel = bgCol;
	float m;
	
	float radius = 0.4; // increase this to see the effect better
	if( r.x < -0.5*xMax ) { // Part I
		// no interpolation, yes aliasing
		m = step( radius, length(r - vec2(-0.5*xMax-0.4,0.0)) );
		// if the distance from the center is smaller than radius,
		// then mix value is 0.0
		// otherwise the mix value is 1.0
		pixel = mix(col1, bgCol, m);
	}
	else if( r.x < -0.0*xMax ) { // Part II
		// linearstep (first order, linear interpolation)
		m = linearstep( radius-0.005, radius+0.005, length(r - vec2(-0.0*xMax-0.4,0.0)) );
		// mix value is linearly interpolated when the distance to the center
		// is 0.005 smaller and greater than the radius.
		pixel = mix(col1, bgCol, m);
	}	
	else if( r.x < 0.5*xMax ) { // Part III
		// smoothstep (cubical interpolation)
		m = smoothstep( radius-0.005, radius+0.005, length(r - vec2(0.5*xMax-0.4,0.0)) );
		pixel = mix(col1, bgCol, m);
	}
	else if( r.x < 1.0*xMax ) { // Part IV
		// smootherstep (sixth order interpolation)
		m = smootherstep( radius-0.005, radius+0.005, length(r - vec2(1.0*xMax-0.4,0.0)) );
		pixel = mix(col1, bgCol, m);
	}

	fragColor = vec4(pixel, 1.0);
}

#elif TUTORIAL == 19
// FUNCTION PLOTTING
//
// It is always useful to see the plots of functions on cartesian
// coordinate system, to understand what they are doing precisely
//
// Let's plot some 1D functions!
// 
// If y value is a function f of x value, the expression of their
// relation is: y = f(x)
// in other words, the plot of a function is all points
// that satisfy the expression: y-f(x)=0
// this set has 0 thickness, and can't be seen.
// Instead use the set of (x,y) that satisfy: -d < y-f(x) < d
// in other words abs(y-f(x)) < d
// where d is the thickness. (the thickness in in y direction)
// Because of the properties of absolute function, the condition
// abs(y-f(x)) < d is equivalent to the condition:
// abs(f(x) - y) < d
// We'll use this last one for function plotting. (in the previous one
// we have to negate the function that we want to plot)
float linearstep(float edge0, float edge1, float x) {
	float t = (x - edge0)/(edge1 - edge0);
	return clamp(t, 0.0, 1.0);
}
float smootherstep(float edge0, float edge1, float x) {
	float t = (x - edge0)/(edge1 - edge0);
	float t1 = t*t*t*(t*(t*6. - 15.) + 10.);
	return clamp(t1, 0.0, 1.0);
}

void plot(vec2 r, float y, float lineThickness, vec3 color, inout vec3 pixel) {
	if( abs(y - r.y) < lineThickness ) pixel = color;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 r = 2.0*vec2(fragCoord.xy - 0.5*iResolution.xy)/iResolution.y;
	
	vec3 bgCol = vec3(1.0);
	vec3 axesCol = vec3(0.0, 0.0, 1.0);
	vec3 gridCol = vec3(0.5);
	vec3 col1 = vec3(0.841, 0.582, 0.594);
	vec3 col2 = vec3(0.884, 0.850, 0.648);
	vec3 col3 = vec3(0.348, 0.555, 0.641);	

	vec3 pixel = bgCol;
	
	// Draw grid lines
	const float tickWidth = 0.1;
	for(float i=-2.0; i<2.0; i+=tickWidth) {
		// "i" is the line coordinate.
		if(abs(r.x - i)<0.004) pixel = gridCol;
		if(abs(r.y - i)<0.004) pixel = gridCol;
	}
	// Draw the axes
	if( abs(r.x)<0.006 ) pixel = axesCol;
	if( abs(r.y)<0.007 ) pixel = axesCol;
	
	// Draw functions
	float x = r.x;
	float y = r.y;
	// pink functions
	// y = 2*x + 5
	if( abs(2.*x + .5 - y) < 0.02 ) pixel = col1;
	// y = x^2 - .2
	if( abs(r.x*r.x-0.2 - y) < 0.01 ) pixel = col1;
	// y = sin(PI x)
	if( abs(sin(PI*r.x) - y) < 0.02 ) pixel = col1;
	
	// blue functions, the step function variations
	// (functions are scaled and translated vertically)
	if( abs(0.25*step(0.0, x)+0.6 - y) < 0.01 ) pixel = col3;
	if( abs(0.25*linearstep(-0.5, 0.5, x)+0.1 - y) < 0.01 ) pixel = col3;
	if( abs(0.25*smoothstep(-0.5, 0.5, x)-0.4 - y) < 0.01 ) pixel = col3;
	if( abs(0.25*smootherstep(-0.5, 0.5, x)-0.9 - y) < 0.01 ) pixel = col3;
	
	// yellow functions
	// have a function that plots functions :-)
	plot(r, 0.5*clamp(sin(TWOPI*x), 0.0, 1.0)-0.7, 0.015, col2, pixel);
	// bell curve around -0.5
	plot(r, 0.6*exp(-10.0*(x+0.8)*(x+0.8)) - 0.1, 0.015, col2, pixel);
	
	fragColor = vec4(pixel, 1.0);
}
// in the future we can use this framework to see the plot of functions
// and design and find functions for our liking
// Actually using Mathematica, Matlab, matplotlib etc. to plot functions
// is much more practical. But they need a translation of functions 
// from GLSL to their language. Here we can plot the native implementations
// of GLSL functions.


#elif TUTORIAL == 20
// COLOR ADDITION AND SUBSTRACTION
//
// How to draw a shape on top of another, and how will the layers
// below, affect the higher layers?
//
// In the previous shape drawing functions, we set the pixel
// value from the function. This time the shape function will
// just return a float value between 0.0 and 1.0 to indice the
// shape area. Later that value can be multiplied with some color
// and used in determining the final pixel color.

// A function that returns the 1.0 inside the disk area
// returns 0.0 outside the disk area
// and has a smooth transition at the radius
float disk(vec2 r, vec2 center, float radius) {
	float distanceFromCenter = length(r-center);
	float outsideOfDisk = smoothstep( radius-0.005, radius+0.005, distanceFromCenter);
	float insideOfDisk = 1.0 - outsideOfDisk;
	return insideOfDisk;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 p = vec2(fragCoord.xy / iResolution.xy);
	vec2 r =  2.0*vec2(fragCoord.xy - 0.5*iResolution.xy)/iResolution.y;
	float xMax = iResolution.x/iResolution.y;	
	
	vec3 black = vec3(0.0);
	vec3 white = vec3(1.0);
	vec3 gray = vec3(0.3);
	vec3 col1 = vec3(0.216, 0.471, 0.698); // blue
	vec3 col2 = vec3(1.00, 0.329, 0.298); // red
	vec3 col3 = vec3(0.867, 0.910, 0.247); // yellow
	
	vec3 ret;
	float d;
	
	if(p.x < 1./3.) { // Part I
		// opaque layers on top of each other
		ret = gray;
		// assign a gray value to the pixel first
		d = disk(r, vec2(-1.1,0.3), 0.4);
		ret = mix(ret, col1, d); // mix the previous color value with
		                         // the new color value according to
		                         // the shape area function.
		                         // at this line, previous color is gray.
		d = disk(r, vec2(-1.3,0.0), 0.4);
		ret = mix(ret, col2, d);
		d = disk(r, vec2(-1.05,-0.3), 0.4); 
		ret = mix(ret, col3, d); // here, previous color can be gray,
		                         // blue or pink.
	} 
	else if(p.x < 2./3.) { // Part II
		// Color addition
		// This is how lights of different colors add up
		// http://en.wikipedia.org/wiki/Additive_color
		ret = black; // start with black pixels
		ret += disk(r, vec2(0.1,0.3), 0.4)*col1; // add the new color
		                                         // to the previous color
		ret += disk(r, vec2(-.1,0.0), 0.4)*col2;
		ret += disk(r, vec2(.15,-0.3), 0.4)*col3;
		// when all components of "ret" becomes equal or higher than 1.0
		// it becomes white.
	} 
	else if(p.x < 3./3.) { // Part III
		// Color substraction
		// This is how dye of different colors add up
		// http://en.wikipedia.org/wiki/Subtractive_color
		ret = white; // start with white
		ret -= disk(r, vec2(1.1,0.3), 0.4)*col1;
		ret -= disk(r, vec2(1.05,0.0), 0.4)* col2;
		ret -= disk(r, vec2(1.35,-0.25), 0.4)* col3;			
		// when all components of "ret" becomes equals or smaller than 0.0
		// it becomes black.
	}
	
	vec3 pixel = ret;
	fragColor = vec4(pixel, 1.0);
}



#elif TUTORIAL == 21
// COORDINATE TRANSFORMATIONS: ROTATION
//
// Up to now, we translated to coordinate center to draw geometric
// shapes at different parts of the screen.
// Lets learn how to rotate the shapes.

// a function that draws an (anti-aliased) grid of coordinate system
float coordinateGrid(vec2 r) {
	vec3 axesCol = vec3(0.0, 0.0, 1.0);
	vec3 gridCol = vec3(0.5);
	float ret = 0.0;
	
	// Draw grid lines
	const float tickWidth = 0.1;
	for(float i=-2.0; i<2.0; i+=tickWidth) {
		// "i" is the line coordinate.
		ret += 1.-smoothstep(0.0, 0.008, abs(r.x-i));
		ret += 1.-smoothstep(0.0, 0.008, abs(r.y-i));
	}
	// Draw the axes
	ret += 1.-smoothstep(0.001, 0.015, abs(r.x));
	ret += 1.-smoothstep(0.001, 0.015, abs(r.y));
	return ret;
}
// returns 1.0 if inside circle
float disk(vec2 r, vec2 center, float radius) {
	return 1.0 - smoothstep( radius-0.005, radius+0.005, length(r-center));
}
// returns 1.0 if inside the disk
float rectangle(vec2 r, vec2 topLeft, vec2 bottomRight) {
	float ret;
	float d = 0.005;
	ret = smoothstep(topLeft.x-d, topLeft.x+d, r.x);
	ret *= smoothstep(topLeft.y-d, topLeft.y+d, r.y);
	ret *= 1.0 - smoothstep(bottomRight.y-d, bottomRight.y+d, r.y);
	ret *= 1.0 - smoothstep(bottomRight.x-d, bottomRight.x+d, r.x);
	return ret;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 p = vec2(fragCoord.xy / iResolution.xy);
	vec2 r =  2.0*vec2(fragCoord.xy - 0.5*iResolution.xy)/iResolution.y;
	float xMax = iResolution.x/iResolution.y;	
	
	vec3 bgCol = vec3(1.0);
	vec3 col1 = vec3(0.216, 0.471, 0.698); // blue
	vec3 col2 = vec3(1.00, 0.329, 0.298); // yellow
	vec3 col3 = vec3(0.867, 0.910, 0.247); // red
	
	vec3 ret;
	
	vec2 q;
	float angle;
	angle = 0.2*PI; // angle in radians (PI is 180 degrees)
	// q is the rotated coordinate system
	q.x =   cos(angle)*r.x + sin(angle)*r.y;
	q.y = - sin(angle)*r.x + cos(angle)*r.y;
	
	ret = bgCol;
	// draw the old and new coordinate systems
	ret = mix(ret, col1, coordinateGrid(r)*0.4 );
	ret = mix(ret, col2, coordinateGrid(q) );
	
	// draw shapes in old coordinate system, r, and new coordinate system, q
	ret = mix(ret, col1, disk(r, vec2(1.0, 0.0), 0.2));
	ret = mix(ret, col2, disk(q, vec2(1.0, 0.0), 0.2));
	ret = mix(ret, col1, rectangle(r, vec2(-0.8, 0.2), vec2(-0.5, 0.4)) );	
	ret = mix(ret, col2, rectangle(q, vec2(-0.8, 0.2), vec2(-0.5, 0.4)) );	
	// as you see both circle are drawn at the same coordinate, (1,0),
	// in their respective coordinate systems. But they appear
	// on different locations of the screen
		
	vec3 pixel = ret;
	fragColor = vec4(pixel, 1.0);
}


#elif TUTORIAL == 22
// COORDINATE TRANSFORMATIONS: SCALING
//
// Scaling the coordinate system.

// a function that draws an (anti-aliased) grid of coordinate system
float coordinateGrid(vec2 r) {
	vec3 axesCol = vec3(0.0, 0.0, 1.0);
	vec3 gridCol = vec3(0.5);
	float ret = 0.0;
	
	// Draw grid lines
	const float tickWidth = 0.1;
	for(float i=-2.0; i<2.0; i+=tickWidth) {
		// "i" is the line coordinate.
		ret += 1.-smoothstep(0.0, 0.008, abs(r.x-i));
		ret += 1.-smoothstep(0.0, 0.008, abs(r.y-i));
	}
	// Draw the axes
	ret += 1.-smoothstep(0.001, 0.015, abs(r.x));
	ret += 1.-smoothstep(0.001, 0.015, abs(r.y));
	return ret;
}
// returns 1.0 if inside circle
float disk(vec2 r, vec2 center, float radius) {
	return 1.0 - smoothstep( radius-0.005, radius+0.005, length(r-center));
}
// returns 1.0 if inside the disk
float rectangle(vec2 r, vec2 topLeft, vec2 bottomRight) {
	float ret;
	float d = 0.005;
	ret = smoothstep(topLeft.x-d, topLeft.x+d, r.x);
	ret *= smoothstep(topLeft.y-d, topLeft.y+d, r.y);
	ret *= 1.0 - smoothstep(bottomRight.y-d, bottomRight.y+d, r.y);
	ret *= 1.0 - smoothstep(bottomRight.x-d, bottomRight.x+d, r.x);
	return ret;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 p = vec2(fragCoord.xy / iResolution.xy);
	vec2 r =  2.0*vec2(fragCoord.xy - 0.5*iResolution.xy)/iResolution.y;
	float xMax = iResolution.x/iResolution.y;	
	
	vec3 bgCol = vec3(1.0);
	vec3 col1 = vec3(0.216, 0.471, 0.698); // blue
	vec3 col2 = vec3(1.00, 0.329, 0.298); // yellow
	vec3 col3 = vec3(0.867, 0.910, 0.247); // red
		
	vec3 ret = bgCol;
	
	// original
	float scaleFactor = 2.0; // zoom in this much
	ret = mix(ret, col1, coordinateGrid(r)/2.0);
	// scaled
	vec2 q = 0.3*r;
	ret = mix(ret, col2, coordinateGrid(q));

	ret = mix(ret, col2, disk(q, vec2(0.0, 0.0), 0.1));	
	ret = mix(ret, col1, disk(r, vec2(0.0, 0.0), 0.1));
	
	ret = mix(ret, col1, rectangle(r, vec2(-0.5, 0.0), vec2(-0.2, 0.2)) );
	ret = mix(ret, col2, rectangle(q, vec2(-0.5, 0.0), vec2(-0.2, 0.2)) );
	
	// not how the rectangle that are not centered at the coordinate origin
	// changed its location after scaling, but the disks at the center
	// remained where they are.
	// This is because scaling is done by multiplying all pixel
	// coordinates with a constant.
	
	vec3 pixel = ret;
	fragColor = vec4(pixel, 1.0);
}



#elif TUTORIAL == 23
// SUCCESSIVE COORDINATE TRANSFORMATIONS
//
// Drawing a shape on the desired location, with desired size, and
// desired orientation needs mastery of succesive application of
// transformations.
//
// In general, transformations do not commute. Which means that
// if you change their order, you get different results.
//
// Let's try application of transformations in different orders.

float coordinateGrid(vec2 r) {
	vec3 axesCol = vec3(0.0, 0.0, 1.0);
	vec3 gridCol = vec3(0.5);
	float ret = 0.0;
	
	// Draw grid lines
	const float tickWidth = 0.1;
	for(float i=-2.0; i<2.0; i+=tickWidth) {
		// "i" is the line coordinate.
		ret += 1.-smoothstep(0.0, 0.008, abs(r.x-i));
		ret += 1.-smoothstep(0.0, 0.008, abs(r.y-i));
	}
	// Draw the axes
	ret += 1.-smoothstep(0.001, 0.015, abs(r.x));
	ret += 1.-smoothstep(0.001, 0.015, abs(r.y));
	return ret;
}
// returns 1.0 if inside circle
float disk(vec2 r, vec2 center, float radius) {
	return 1.0 - smoothstep( radius-0.005, radius+0.005, length(r-center));
}
// returns 1.0 if inside the disk
float rectangle(vec2 r, vec2 topLeft, vec2 bottomRight) {
	float ret;
	float d = 0.005;
	ret = smoothstep(topLeft.x-d, topLeft.x+d, r.x);
	ret *= smoothstep(topLeft.y-d, topLeft.y+d, r.y);
	ret *= 1.0 - smoothstep(bottomRight.y-d, bottomRight.y+d, r.y);
	ret *= 1.0 - smoothstep(bottomRight.x-d, bottomRight.x+d, r.x);
	return ret;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 p = vec2(fragCoord.xy / iResolution.xy);
	vec2 r =  2.0*vec2(fragCoord.xy - 0.5*iResolution.xy)/iResolution.y;
	float xMax = iResolution.x/iResolution.y;	
	
	vec3 bgCol = vec3(1.0);
	vec3 col1 = vec3(0.216, 0.471, 0.698); // blue
	vec3 col2 = vec3(1.00, 0.329, 0.298); // yellow
	vec3 col3 = vec3(0.867, 0.910, 0.247); // red
		
	vec3 ret = bgCol;

	float angle = 0.6;
	mat2 rotationMatrix = mat2(cos(angle), -sin(angle),
                               sin(angle),  cos(angle));	

	if(p.x < 1./2.) { // Part I
		// put the origin at the center of Part I
		r = r - vec2(-xMax/2.0, 0.0); 

		vec2 rotated = rotationMatrix*r;
		vec2 rotatedTranslated = rotated - vec2(0.4, 0.5);
		ret = mix(ret, col1, coordinateGrid(r)*0.3);
		ret = mix(ret, col2, coordinateGrid(rotated)*0.3);
		ret = mix(ret, col3, coordinateGrid(rotatedTranslated)*0.3);

		ret = mix(ret, col1, rectangle(r, vec2(-.1, -.2), vec2(0.1, 0.2)) );
		ret = mix(ret, col2, rectangle(rotated, vec2(-.1, -.2), vec2(0.1, 0.2)) );
		ret = mix(ret, col3, rectangle(rotatedTranslated, vec2(-.1, -.2), vec2(0.1, 0.2)) );
	} 
	else if(p.x < 2./2.) { // Part II
		r = r - vec2(xMax*0.5, 0.0); 

		vec2 translated = r - vec2(0.4, 0.5);
		vec2 translatedRotated = rotationMatrix*translated;
		
		ret = mix(ret, col1, coordinateGrid(r)*0.3);
		ret = mix(ret, col2, coordinateGrid(translated)*0.3);
		ret = mix(ret, col3, coordinateGrid(translatedRotated)*0.3);

		ret = mix(ret, col1, rectangle(r, vec2(-.1, -.2), vec2(0.1, 0.2)) );
		ret = mix(ret, col2, rectangle(translated, vec2(-.1, -.2), vec2(0.1, 0.2)) );
		ret = mix(ret, col3, rectangle(translatedRotated, vec2(-.1, -.2), vec2(0.1, 0.2)) );		
	} 	
	
	vec3 pixel = ret;
	fragColor = vec4(pixel, 1.0);
}



#elif TUTORIAL == 24
// TIME, MOTION AND ANIMATION
//
// One of the inputs that a shader gets can be the time.
// In ShaderToy, "iGlobalTime" variable holds the value of the
// time in seconds since the shader is started.
//
// Let's change some variables in time!

float disk(vec2 r, vec2 center, float radius) {
	return 1.0 - smoothstep( radius-0.005, radius+0.005, length(r-center));
}

float rect(vec2 r, vec2 bottomLeft, vec2 topRight) {
	float ret;
	float d = 0.005;
	ret = smoothstep(bottomLeft.x-d, bottomLeft.x+d, r.x);
	ret *= smoothstep(bottomLeft.y-d, bottomLeft.y+d, r.y);
	ret *= 1.0 - smoothstep(topRight.y-d, topRight.y+d, r.y);
	ret *= 1.0 - smoothstep(topRight.x-d, topRight.x+d, r.x);
	return ret;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 p = vec2(fragCoord.xy / iResolution.xy);
	vec2 r =  2.0*vec2(fragCoord.xy - 0.5*iResolution.xy)/iResolution.y;
	float xMax = iResolution.x/iResolution.y;	
	
	vec3 col1 = vec3(0.216, 0.471, 0.698); // blue
	vec3 col2 = vec3(1.00, 0.329, 0.298); // yellow
	vec3 col3 = vec3(0.867, 0.910, 0.247); // red
	
	vec3 ret;
		
	if(p.x < 1./5.) { // Part I
		vec2 q = r + vec2(xMax*4./5.,0.);
		ret = vec3(0.2);
		// y coordinate depends on time
		float y = iGlobalTime;
		// mod constraints y to be between 0.0 and 2.0,
		// and y jumps from 2.0 to 0.0
		// substracting -1.0 makes why jump from 1.0 to -1.0
		y = mod(y, 2.0) - 1.0;
		ret = mix(ret, col1, disk(q, vec2(0.0, y), 0.1) );
	} 
	else if(p.x < 2./5.) { // Part II
		vec2 q = r + vec2(xMax*2./5.,0.);
		ret = vec3(0.3);
		// oscillation
		float amplitude = 0.8;
		// y coordinate oscillates with a period of 0.5 seconds
		float y = 0.8*sin(0.5*iGlobalTime*TWOPI);
		// radius oscillates too
		float radius = 0.15 + 0.05*sin(iGlobalTime*8.0);
		ret = mix(ret, col1, disk(q, vec2(0.0, y), radius) );		
	} 
	else if(p.x < 3./5.) { // Part III
		vec2 q = r + vec2(xMax*0./5.,0.);
		ret = vec3(0.4);
		// booth coordinates oscillates
		float x = 0.2*cos(iGlobalTime*5.0);
		// but they have a phase difference of PI/2
		float y = 0.3*cos(iGlobalTime*5.0 + PI/2.0);
		float radius = 0.2 + 0.1*sin(iGlobalTime*2.0);
		// make the color mixture time dependent
		vec3 color = mix(col1, col2, sin(iGlobalTime)*0.5+0.5);
		ret = mix(ret, color, rect(q, vec2(x-0.1, y-0.1), vec2(x+0.1, y+0.1)) );		
		// try different phases, different amplitudes and different frequencies
		// for x and y coordinates
	}
	else if(p.x < 4./5.) { // Part IV
		vec2 q = r + vec2(-xMax*2./5.,0.);
		ret = vec3(0.3);
		for(float i=-1.0; i<1.0; i+= 0.2) {
			float x = 0.2*cos(iGlobalTime*5.0 + i*PI);
			// y coordinate is the loop value
			float y = i;
			vec2 s = q - vec2(x, y);
			// each box has a different phase
			float angle = iGlobalTime*3. + i;
			mat2 rot = mat2(cos(angle), -sin(angle), sin(angle),  cos(angle));
			s = rot*s;
			ret = mix(ret, col1, rect(s, vec2(-0.06, -0.06), vec2(0.06, 0.06)) );			
		}
	}
	else if(p.x < 5./5.) { // Part V
		vec2 q = r + vec2(-xMax*4./5., 0.);
		ret = vec3(0.2);
		// let stop and move again periodically
		float speed = 2.0;
		float t = iGlobalTime*speed;
		float stopEveryAngle = PI/2.0;
		float stopRatio = 0.5;
		float t1 = (floor(t) + smoothstep(0.0, 1.0-stopRatio, fract(t)) )*stopEveryAngle;
		
		float x = -0.2*cos(t1);
		float y = 0.3*sin(t1);
		float dx = 0.1 + 0.03*sin(t*10.0);
		float dy = 0.1 + 0.03*sin(t*10.0+PI);
		ret = mix(ret, col1, rect(q, vec2(x-dx, y-dy), vec2(x+dx, y+dy)) );		
	}
	
	vec3 pixel = ret;
	fragColor = vec4(pixel, 1.0);
}


#elif TUTORIAL == 25
// PLASMA EFFECT
//
// We said that the a pixel's color only depends on its coordinates
// and other inputs (such as time)
// 
// There is an effect called Plasma, which is based on a mixture of
// complex function in the form of f(x,y).
//
// Let's write a plasma!
//
// http://en.wikipedia.org/wiki/Plasma_effect

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 p = vec2(fragCoord.xy / iResolution.xy);
	vec2 r =  2.0*vec2(fragCoord.xy - 0.5*iResolution.xy)/iResolution.y;
	float t = iGlobalTime;
    r = r * 8.0;
	
    float v1 = sin(r.x +t);
    float v2 = sin(r.y +t);
    float v3 = sin(r.x+r.y +t);
    float v4 = sin(sqrt(r.x*r.x+r.y*r.y) +1.7*t);
	float v = v1+v2+v3+v4;
	
	vec3 ret;
	
	if(p.x < 1./10.) { // Part I
		// vertical waves
		ret = vec3(v1);
	} 
	else if(p.x < 2./10.) { // Part II
		// horizontal waves
		ret = vec3(v2);
	} 
	else if(p.x < 3./10.) { // Part III
		// diagonal waves
		ret = vec3(v3);
	}
	else if(p.x < 4./10.) { // Part IV
		// circular waves
		ret = vec3(v4);
	}
	else if(p.x < 5./10.) { // Part V
		// the sum of all waves
		ret = vec3(v);
	}	
	else if(p.x < 6./10.) { // Part VI
		// Add periodicity to the gradients
		ret = vec3(sin(2.*v));
	}
	else if(p.x < 10./10.) { // Part VII
		// mix colors
		v *= 1.0;
		ret = vec3(sin(v), sin(v+0.5*PI), sin(v+1.0*PI));
	}	
	
	ret = 0.5 + 0.5*ret;
	
    vec3 pixel = ret;
    fragColor = vec4(pixel, 1.);
}



#elif TUTORIAL == 26
// TEXTURES
//
// ShaderToy can use upto four textures. 

float rect(vec2 r, vec2 bottomLeft, vec2 topRight) {
	float ret;
	float d = 0.005;
	ret = smoothstep(bottomLeft.x-d, bottomLeft.x+d, r.x);
	ret *= smoothstep(bottomLeft.y-d, bottomLeft.y+d, r.y);
	ret *= 1.0 - smoothstep(topRight.y-d, topRight.y+d, r.y);
	ret *= 1.0 - smoothstep(topRight.x-d, topRight.x+d, r.x);
	return ret;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 p = vec2(fragCoord.xy / iResolution.xy);
	vec2 r =  2.0*vec2(fragCoord.xy - 0.5*iResolution.xy)/iResolution.y;
	float xMax = iResolution.x/iResolution.y;	
	
	vec3 bgCol = vec3(0.3);
	vec3 col1 = vec3(0.216, 0.471, 0.698); // blue
	vec3 col2 = vec3(1.00, 0.329, 0.298); // yellow
	vec3 col3 = vec3(0.867, 0.910, 0.247); // red
	
	vec3 ret;
	
	if(p.x < 1./3.) { // Part I
		ret = texture2D(iChannel1, p).xyz;
	} 
	else if(p.x < 2./3.) { // Part II
		ret = texture2D(iChannel1, 4.*p+vec2(0.,iGlobalTime)).xyz;
	} 
	else if(p.x < 3./3.) { // Part III
		r = r - vec2(xMax*2./3., 0.);
		float angle = iGlobalTime;
		mat2 rotMat = mat2(cos(angle), -sin(angle),
        	               sin(angle),  cos(angle));
		vec2 q = rotMat*r;
		vec3 texA = texture2D(iChannel1, q).xyz;
		vec3 texB = texture2D(iChannel2, q).xyz;
		
		angle = -iGlobalTime;
		rotMat = mat2(cos(angle), -sin(angle),
        	               sin(angle),  cos(angle));
		q = rotMat*r;		
		ret = mix(texA, texB, rect(q, vec2(-0.3, -0.3), vec2(.3, .3)) );
		
	}
	
	vec3 pixel = ret;
	fragColor = vec4(pixel, 1.0);
}



#elif TUTORIAL == 27
// MOUSE INPUT
//
// ShaderToy gives the mouse cursor coordinates and button clicks
// as an input via the iMouse vec4.
//
// Let's write a shader with basic Mouse functionality.
// When clicked on the frame, the little disk will follow the
// cursor. The x coordinate of the cursor changes the background color.
// And if the cursor is inside the bigger disk, it'll color will change.


float disk(vec2 r, vec2 center, float radius) {
	return 1.0 - smoothstep( radius-0.5, radius+0.5, length(r-center));
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 p = vec2(fragCoord.xy / iResolution.xy);
	vec2 r =  2.0*vec2(fragCoord.xy - 0.5*iResolution.xy)/iResolution.y;
	float xMax = iResolution.x/iResolution.y;
	
	// background color depends on the x coordinate of the cursor
	vec3 bgCol = vec3(iMouse.x / iResolution.x);
	vec3 col1 = vec3(0.216, 0.471, 0.698); // blue
	vec3 col2 = vec3(1.00, 0.329, 0.298); // yellow
	vec3 col3 = vec3(0.867, 0.910, 0.247); // red
	
	vec3 ret = bgCol;
	
	vec2 center;
	// draw the big yellow disk
	center = vec2(100., iResolution.y/2.);
	float radius = 60.;
	// if the cursor coordinates is inside the disk
	if( length(iMouse.xy-center)>radius ) {
		// use color3
		ret = mix(ret, col3, disk(fragCoord.xy, center, radius));
	}
	else {
		// else use color2
		ret = mix(ret, col2, disk(fragCoord.xy, center, radius));
	}	
	
	// draw the small blue disk at the cursor
	center = iMouse.xy;
	ret = mix(ret, col1, disk(fragCoord.xy, center, 20.));
	
	vec3 pixel = ret;
	fragColor = vec4(pixel, 1.0);
}




#elif TUTORIAL == 28
// RANDOMNESS
//
// I don't know why, but GLSL does not have random number generators.
// This does not pose a problem if you are writing your code in
// a programming language that has random functions. That way
// you can generate the random values using the language and send
// those values to the shader via uniforms.
//
// But if you are using a system that only allows you to write
// the shader code, such as ShaderToy, then you need to write your own
// pseuo-random generators.
//
// Here is a pattern that I saw again and again in many different
// shaders at ShaderToy.
// Let's draw N different disks at random locations using this pattern.

float hash(float seed)
{
	// Return a "random" number based on the "seed"
    return fract(sin(seed) * 43758.5453);
}

vec2 hashPosition(float x)
{
	// Return a "random" position based on the "seed"
	return vec2(hash(x), hash(x * 1.1));
}

float disk(vec2 r, vec2 center, float radius) {
	return 1.0 - smoothstep( radius-0.005, radius+0.005, length(r-center));
}

float coordinateGrid(vec2 r) {
	vec3 axesCol = vec3(0.0, 0.0, 1.0);
	vec3 gridCol = vec3(0.5);
	float ret = 0.0;
	
	// Draw grid lines
	const float tickWidth = 0.1;
	for(float i=-2.0; i<2.0; i+=tickWidth) {
		// "i" is the line coordinate.
		ret += 1.-smoothstep(0.0, 0.005, abs(r.x-i));
		ret += 1.-smoothstep(0.0, 0.01, abs(r.y-i));
	}
	// Draw the axes
	ret += 1.-smoothstep(0.001, 0.005, abs(r.x));
	ret += 1.-smoothstep(0.001, 0.005, abs(r.y));
	return ret;
}

float plot(vec2 r, float y, float thickness) {
	return ( abs(y - r.y) < thickness ) ? 1.0 : 0.0;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 p = vec2(fragCoord.xy / iResolution.xy);
	vec2 r =  2.0*vec2(fragCoord.xy - 0.5*iResolution.xy)/iResolution.y;
	float xMax = iResolution.x/iResolution.y;	
	
	vec3 bgCol = vec3(0.3);
	vec3 col1 = vec3(0.216, 0.471, 0.698); // blue
	vec3 col2 = vec3(1.00, 0.329, 0.298); // yellow
	vec3 col3 = vec3(0.867, 0.910, 0.247); // red
	
	vec3 ret = bgCol;
	
	vec3 white = vec3(1.);
	vec3 gray = vec3(.3);
	if(r.y > 0.7) {
		
		// translated and rotated coordinate system
		vec2 q = (r-vec2(0.,0.9))*vec2(1.,20.);
		ret = mix(white, gray, coordinateGrid(q));
		
		// just the regular sin function
		float y = sin(5.*q.x) * 2.0 - 1.0;
		
		ret = mix(ret, col1, plot(q, y, 0.1));
	}
	else if(r.y > 0.4) {
		vec2 q = (r-vec2(0.,0.6))*vec2(1.,20.);
		ret = mix(white, col1, coordinateGrid(q));
		
		// take the decimal part of the sin function
		float y = fract(sin(5.*q.x)) * 2.0 - 1.0;
		
		ret = mix(ret, col2, plot(q, y, 0.1));
	}	
	else if(r.y > 0.1) {
		vec3 white = vec3(1.);
		vec2 q = (r-vec2(0.,0.25))*vec2(1.,20.);
		ret = mix(white, gray, coordinateGrid(q));
		
		// scale up the outcome of the sine function
		// increase the scale and see the transition from
		// periodic pattern to chaotic pattern
		float scale = 10.0;
		float y = fract(sin(5.*q.x) * scale) * 2.0 - 1.0;
		
		ret = mix(ret, col1, plot(q, y, 0.2));
	}	
	else if(r.y > -0.2) {
		vec3 white = vec3(1.);
		vec2 q = (r-vec2(0., -0.0))*vec2(1.,10.);
		ret = mix(white, col1, coordinateGrid(q));
		
		float seed = q.x;
		// Scale up with a big real number
		float y = fract(sin(seed) * 43758.5453) * 2.0 - 1.0;
		// this can be used as a pseudo-random value
		// These type of function, functions in which two inputs
		// that are close to each other (such as close q.x positions)
		// return highly different output values, are called "hash"
		// function.
		
		ret = mix(ret, col2, plot(q, y, 0.1));
	}
	else {
		vec2 q = (r-vec2(0., -0.6));
		
		// use the loop index as the seed
		// and vary different quantities of disks, such as
		// location and radius
		for(float i=0.0; i<6.0; i++) {
			// change the seed and get different distributions
			float seed = i + 0.0; 
			vec2 pos = (vec2(hash(seed), hash(seed + 0.5))-0.5)*3.;;
			float radius = hash(seed + 3.5);
			pos *= vec2(1.0,0.3);
			ret = mix(ret, col1, disk(q, pos, 0.2*radius));
		}		
	}
	
	vec3 pixel = ret;
	fragColor = vec4(pixel, 1.0);
}






/* End of tutorials */

#elif TUTORIAL == 0
// WELCOME SCREEN
float square(vec2 r, vec2 bottomLeft, float side) {
	vec2 p = r - bottomLeft;
	return ( p.x > 0.0 && p.x < side && p.y>0.0 && p.y < side ) ? 1.0 : 0.0;
}

float character(vec2 r, vec2 bottomLeft, float charCode, float squareSide) {
	vec2 p = r - bottomLeft;
	float ret = 0.0;
	float num, quotient, remainder, divider;
	float x, y;	
	num = charCode;
	for(int i=0; i<20; i++) {
		float boxNo = float(19-i);
		divider = pow(2., boxNo);
		quotient = floor(num / divider);
		remainder = num - quotient*divider;
		num = remainder;
		
		y = floor(boxNo/4.0); 
		x = boxNo - y*4.0;
		if(quotient == 1.) {
			ret += square( p, squareSide*vec2(x, y), squareSide );
		}
	}
	return ret;
}

mat2 rot(float th) { return mat2(cos(th), -sin(th), sin(th), cos(th)); }

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	float G = 990623.; // compressed characters :-)
	float L = 69919.;
	float S = 991119.;
	
	float t = iGlobalTime;

	vec2 r = (fragCoord.xy - 0.5*iResolution.xy) / iResolution.y;
	//vec2 rL = rot(t)*r+0.0001*t;
	//vec2 rL = r+vec2(cos(t*0.02),sin(t*0.02))*t*0.05;
	float c = 0.05;//+0.03*sin(2.5*t);
	vec2 pL = (mod(r+vec2(cos(0.3*t),sin(0.3*t)), 2.0*c)-c)/c;
	float circ = 1.0-smoothstep(0.75, 0.8, length(pL));
	vec2 rG = rot(2.*3.1415*smoothstep(0.,1.,mod(1.5*t,4.0)))*r;
	vec2 rStripes = rot(0.2)*r;
				
	float xMax = 0.5*iResolution.x/iResolution.y;
	float letterWidth = 2.0*xMax*0.9/4.0;
	float side = letterWidth/4.;
	float space = 2.0*xMax*0.1/5.0;
	
	r += 0.001; // to get rid off the y=0 horizontal blue line.
	float maskGS = character(r, vec2(-xMax+space, -2.5*side)+vec2(letterWidth+space, 0.0)*0.0, G, side);
	float maskG = character(rG, vec2(-xMax+space, -2.5*side)+vec2(letterWidth+space, 0.0)*0.0, G, side);
	float maskL1 = character(r, vec2(-xMax+space, -2.5*side)+vec2(letterWidth+space, 0.0)*1.0, L, side);
	float maskSS = character(r, vec2(-xMax+space, -2.5*side)+vec2(letterWidth+space, 0.0)*2.0, S, side);
	float maskS = character(r, vec2(-xMax+space, -2.5*side)+vec2(letterWidth+space, 0.0)*2.0 + vec2(0.01*sin(2.1*t),0.012*cos(t)), S, side);
	float maskL2 = character(r, vec2(-xMax+space, -2.5*side)+vec2(letterWidth+space, 0.0)*3.0, L, side);
	float maskStripes = step(0.25, mod(rStripes.x - 0.5*t, 0.5));
	
	float i255 = 0.00392156862;
	vec3 blue = vec3(43., 172., 181.)*i255;
	vec3 pink = vec3(232., 77., 91.)*i255;
	vec3 dark = vec3(59., 59., 59.)*i255;
	vec3 light = vec3(245., 236., 217.)*i255;
	vec3 green = vec3(180., 204., 18.)*i255;

	vec3 pixel = blue;
	pixel = mix(pixel, light, maskGS);
	pixel = mix(pixel, light, maskSS);
	pixel -= 0.1*maskStripes;	
	pixel = mix(pixel, green, maskG);
	pixel = mix(pixel, pink, maskL1*circ);
	pixel = mix(pixel, green, maskS);
	pixel = mix(pixel, pink, maskL2*(1.-circ));
	
	// float dirt = pow(texture2D(iChannel0, 4.0*r).x, 4.0);
	// pixel -= (0.2*dirt - 0.1)*(maskG+maskS); // dirt
	pixel -= smoothstep(0.45, 2.5, length(r));
	fragColor = vec4(pixel, 1.0);
}
#endif



//_______________________________________________________________________________________________________

//_______________________________________________________________________________________________________



void main( void)
{
	mainImage(gl_FragColor, gl_FragCoord.xy);
}