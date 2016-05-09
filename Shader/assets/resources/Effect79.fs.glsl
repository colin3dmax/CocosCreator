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

// Made by omgs 2016
// Singing Mario Head

// Special thanks to IQ for sharing all the raymarching techniques with everyone


void doCamera( out vec3 camPos, out vec3 camTar, in float time, in float mouseX )
{
    float an =  10.0*mouseX;
	camPos = vec3(-4.5*sin(an),1.0+cos(2.0+iDate.w*0.5),-4.5*cos(an));
    camTar = vec3(0.0,0.0,0.0);
}

float sdPlane(in vec3 p) {
    return p.y;
}

float sdSphere(in vec3 p, in float r) {
    return length(p)-r;
}

float sdCylinder( vec3 p, vec2 h ) {
    vec2 d = abs(vec2(length(p.xz),p.y)) - h;
    return min(max(d.x,d.y),0.0) + length(max(d,0.0));
}

float sdEllipsoid( in vec3 p, in vec3 r ) {
    return (length( p/r ) - 1.0) * min(min(r.x,r.y),r.z);
}

float udRoundBox( vec3 p, vec3 b, float r ) {
    return length(max(abs(p)-b,0.0))-r;
}

float smin( float a, float b, float k ) {
    float h = clamp( 0.5 + 0.5*(b-a)/k, 0.0, 1.0 );
    return mix( b, a, h ) - k*h*(1.0-h);
}

float smax( float a, float b, float k )
{
	float h = clamp( 0.5 + 0.5*(b-a)/k, 0.0, 1.0 );
	return mix( a, b, h ) + k*h*(1.0-h);
}

vec3 rotx(vec3 p, float rx) {
    float sinx = sin(rx);
    float cosx = cos(rx);
    return mat3(1., 0., 0., 0., cosx, sinx, 0., -sinx, cosx) * p;
}

vec3 roty(vec3 p, float ry) {
    float sinx = sin(ry);
    float cosx = cos(ry);
    return mat3(cosx, 0., -sinx, 0., 1., 0., sinx, 0., cosx) * p;
}

vec3 rotz(vec3 p, float rz) {
    float sinx = sin(rz);
    float cosx = cos(rz);
    return mat3(cosx, sinx, 0., -sinx, cosx, 0., 0., 0., 1.) * p;
}

vec3 rot(vec3 p, vec3 r) {
    return rotx(roty(rotz(p, r.z), r.y), r.x);
}




vec2 doModel( vec3 p )
{
   
    
    const int arrsize=7;
    float scene[arrsize];
    float id=-1.;
    vec3 porg=p;
    //head
    p.x = abs(p.x);   // <------ Thanks for tip iapafoto :)
    
    float s = sdEllipsoid(p, vec3(0.4, 0.44, 0.4)*3.);
  //  s = smax(s,-sdEllipsoid(p+vec3(0.4,-0.5,1.15), vec3(0.3, 0.5, 0.2)*1.1 ) , .05); //rsocket
    s = smax(s,-sdEllipsoid(p+vec3(-0.4,-0.5,1.15), vec3(0.3, 0.5, 0.2)*1.1 ) , .05); //lsocket
    s = smin(s,sdEllipsoid(p+vec3(0.,0.1,1.45), vec3(0.4, 0.4, 0.4) ) , .05); //nose
    s = smin(s,sdEllipsoid(p+vec3(0.,0.85,.4), vec3(0.6, 0.5, 0.6)*1.2 ) , 0.3); //chin
    s = smin(s,sdEllipsoid(p+vec3(-0.8,0.35,.4), vec3(0.2, 0.4, 0.35)*1.3 ) , 0.3); //rcheek
  //  s = smin(s,sdEllipsoid(p+vec3(0.8,0.35,.4), vec3(0.2, 0.4, 0.35)*1.3 ) , 0.3); //lcheek
    //left ear
 
	s = smin(s,sdEllipsoid(roty(p+vec3(-1.15,-0.15,.25), 0.7 ), vec3(0.3, 0.35, 0.15)*1.2 ) , .05);
    s = smax(s,-sdEllipsoid(roty(p+vec3(-1.35,-0.15,.3), 0.5 ), vec3(0.3, 0.35, 0.15)*0.9 ) , .06);
        
    //right ear
   // s = smin(s,sdEllipsoid(roty(p+vec3(1.15,-0.15,.25), -0.7 ), vec3(0.3, 0.35, 0.15)*1.2 ) , .05);
   // s = smax(s,-sdEllipsoid(roty(p+vec3(1.35,-0.15,.3), -0.5 ), vec3(0.3, 0.35, 0.15)*0.9 ) , .06);
    
    p=porg; 
    p.y += cos(p.x*5.)*0.1; //smiley wave for mouth
     float musicBuf = texture2D(iChannel0,gl_FragCoord.xy/iResolution.xy).w;
     
    s = smax(s,-sdEllipsoid(p+vec3(0.,0.7+sin(0.01+iDate.w*(0.01+musicBuf*0.5) )*0.1 ,1.15), vec3(0.6-cos(0.01+iDate.w*(0.1+musicBuf*1.5) )*0.2, 0.1, 0.2)*1.1 ) , .05); //mouth
    p=porg; //reset smiley wavey
    
    scene[0] = s;
    //Lefteye
    float s1 = sdEllipsoid(rotx(p+vec3(0.3,-0.3,.96),-0.25  ), vec3(0.3, 0.4, 0.1)*1.1); 
    scene[1] = s1;
    //Righteye
    float s2 = sdEllipsoid(rotx(p+vec3(-0.3,-0.3,.96),-0.25  ), vec3(0.3, 0.4, 0.1)*1.1); 
    scene[2] = s2;
    //teeth
    p.y += cos(p.x*5.)*0.1; //smiley wave for teeth
    float s3 = udRoundBox( p+vec3(0,0.45,0.91), vec3(0.2,0.05,.001), 0.2 );
    scene[3] = s3;
     p=porg; //reset smiley teeth wave
    
    float s4 =   s = min(s,sdEllipsoid(p+vec3(0.,0.85,.76), vec3(0.4, 0.2, 0.3) )); //tounge
    scene[4] = s4;
    
    p.y +=cos(-0.7+p.z*4.)*0.1; //wavey for hat
    float s5 =   s = sdEllipsoid(rotx( p+vec3(0.,-.7,-.2),-0.8 ), vec3(1.1, 0.7, 1.4) )-0.02; //hat
    p=porg;
    s5 = smin(s5, s = sdEllipsoid(rotx( p+vec3(0.,-.75,.6),-0.5 ), vec3(.4, 0.05, .4) ),0.2 ); //cap
    scene[5] = s5-0.07;
    
    p.y +=cos(p.x*4.)*0.2; //wavey for mustach
    float s6 = udRoundBox( p+vec3(0,0.25,1.2), vec3(0.7,0.01,.001), 0.1 );
    p.y +=cos(p.x*15.)*0.03; //wavey for mustach
    s6 = smin(s6, udRoundBox( p+vec3(0,0.4,1.2), vec3(0.6,0.01,.001), 0.15 ) , 0.2);
   
      p.x = abs(p.x);
   //  s6 = min(s6, udRoundBox(rotz( p+vec3(.84,-0.28,.55) , 1.9), vec3(0.35,0.12,.1), 0.05 ) ); //sideburn
     s6 = min(s6, udRoundBox(rotz( p+vec3(-.84,-0.28,.55) , -1.9), vec3(0.35,0.12,.1), 0.05 ) );//sideburn
    p=porg;
    p.y +=cos(p.z*4.)*0.1; //wavey for hair
    p.y +=cos(p.x*8.)*0.1; //wavey for hair
     s6 = min(s6, sdCylinder( p+vec3(0,0.4,-0.17), vec2(1.15,.4) ) )-0.03;
    p=porg;
    
     p.x = abs(p.x);
     p.y +=cos(0.6+p.x*8.)*0.1; //wavey for 
     s6 = smin(s6, udRoundBox(rotz( p+vec3(-0.38,-0.68+sin(0.01+iDate.w*(0.1+musicBuf*0.2) )*0.005,.9),sin(0.01+iDate.w*(0.1+musicBuf*0.2) )*0.1 ), vec3(0.2,0.01,.001), 0.06 ) , 0.2);//eyebrow
   //  p.y +=cos(-0.8+p.x*8.)*0.1;//wavey for eyebrow
    // s6 = smin(s6, udRoundBox( p+vec3(0.38,-0.65,.9), vec3(0.2,0.01,.001), 0.06 ) , 0.2);//eyebrow
     scene[6] = s6;
    
      float test=9999.0;  //return nearest object for material id
    for(int i=0;i<arrsize;i++){
        float test2=scene[i];
        if(test2<test)
        {
            test=test2; 
         	id = float(i);
        }
    }
    
    
    return vec2(test,id);
}

vec3 doMaterial( in vec3 pos, in vec3 nor )
{
    vec2 obj = doModel(pos);
    vec3 col;
    
    if(obj.y==0.) col = vec3(135./255.,60./255.,30./255.)*0.9;
    
    if(obj.y==1.) //eyeColor
     {
        col = vec3(0.3);
        if(nor.x*nor.x*3.+nor.x*0.7 + nor.y*0.6 -.1 <0.12)col=vec3(0,0,0.1)+0.05;
         if(nor.x*nor.x*3.+nor.x*0.5 + nor.y*0.6 -.1 <0.07)col=vec3(0,0,0)+0.01;
 
    }
    if(obj.y==2.)//eyeColor
    {
        col = vec3(0.3);
          if(nor.x*nor.x*3.+nor.x*-0.7 + nor.y*0.6 -.1 <0.12)col=vec3(0,0,0.1)+0.05;
         if(nor.x*nor.x*3.+nor.x*-0.5 + nor.y*0.6 -.1 <0.07)col=vec3(0,0,0)+0.01;

    }
    
    if(obj.y==3.) col = vec3(0.3);
    if(obj.y==4.) col = vec3(0.2,0,0);
    if(obj.y==5.) col = vec3(0.2,0,0);
    if(obj.y==6.) col = vec3(135./255.,69./255.,19./255.)-0.5; //mustach
    return col;
}

float calcSoftshadow( in vec3 ro, in vec3 rd );

vec3 doLighting( in vec3 pos, in vec3 nor, in vec3 rd, in float dis, in vec3 mal )
{
    vec3 lin = vec3(0.0);
    vec3  lig = normalize(vec3(1.0,0.7,-0.9));
    float dif = max(dot(nor,lig),0.0);
    float sha = 0.0; if( dif>0.01 ) sha=calcSoftshadow( pos+0.01*nor, lig );
    lin += dif*vec3(4.00,4.00,4.00)*sha;

    lin += vec3(0.50,0.50,0.50);

    vec3 col = mal*lin;

	col *= exp(-0.01*dis*dis);

    return col;
}

float calcIntersection( in vec3 ro, in vec3 rd )
{
	const float maxd = 5.0;          
	const float precis = 0.001;       
    float h = precis*2.0;
    float t = 0.0;
	float res = -1.0;
    for( int i=0; i<75; i++ )        
    {
        if( h<precis||t>maxd ) break;
	    h = doModel( ro+rd*t ).x;
        t += h;
    }

    if( t<maxd ) res = t;
    return res;
}

vec3 calcNormal( in vec3 pos )
{
    const float eps = 0.002;            

    const vec3 v1 = vec3( 1.0,-1.0,-1.0);
    const vec3 v2 = vec3(-1.0,-1.0, 1.0);
    const vec3 v3 = vec3(-1.0, 1.0,-1.0);
    const vec3 v4 = vec3( 1.0, 1.0, 1.0);

	return normalize( v1*doModel( pos + v1*eps ).x + 
					  v2*doModel( pos + v2*eps ).x + 
					  v3*doModel( pos + v3*eps ).x + 
					  v4*doModel( pos + v4*eps ).x );
}

float calcSoftshadow( in vec3 ro, in vec3 rd )
{
    float res = 1.0;
    float t = 0.0005;                 
	float h = 1.0;
    for( int i=0; i<13; i++ )        
    {
        h = doModel(ro + rd*t).x;
        res = min( res, 64.0*h/t ); 
		t += clamp( h, 0.02, 2.0 );   
    }
    return clamp(res,0.0,1.0);
}

mat3 calcLookAtMatrix( in vec3 ro, in vec3 ta, in float roll )
{
    vec3 ww = normalize( ta - ro );
    vec3 uu = normalize( cross(ww,vec3(sin(roll),cos(roll),0.0) ) );
    vec3 vv = normalize( cross(uu,ww));
    return mat3( uu, vv, ww );
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 p = (-iResolution.xy + 2.0*fragCoord.xy)/iResolution.y;
    vec2 m = iMouse.xy/iResolution.xy;

    
    // camera movement
    vec3 ro, ta;
    doCamera( ro, ta, iGlobalTime, m.x );

    // camera matrix
    mat3 camMat = calcLookAtMatrix( ro, ta, 0.0 ); 
    
	// create view ray
	vec3 rd = normalize( camMat * vec3(p.xy,2.0) );
	vec3 col;
	// raymarch
    float t = calcIntersection( ro, rd );
    if( t>-0.5 )
    {
        // geometry
        vec3 pos = ro + t*rd;
        vec3 nor = calcNormal(pos);

        // materials
        vec3 mal = doMaterial( pos, nor );

        col = doLighting( pos, nor, rd, t, mal );
	}
    else 
    { col = texture2D(iChannel0,fragCoord.xy/iResolution.xy*2.5).xyz
        *texture2D(iChannel0,-.3+fragCoord.xy/iResolution.xy).xyz+vec3(1.,0.,1.);
    	if(col.y>0.) col*=vec3(0.1,0.1,1.);
    }

    // gamma
	col = pow( clamp(col,0.0,1.0), vec3(0.4545) );
	   
    fragColor = vec4( col, 1.0 );
}
//_______________________________________________________________________________________________________





void main( void)
{
	mainImage(gl_FragColor, gl_FragCoord.xy);
}