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
float sdSphere( vec3 p, float s )
{
  return length(p)-s;
}

float udBox( vec3 p, vec3 b )
{
  return length(max(abs(p)-b,0.0));
}

float sdCone( vec3 p, vec2 c )
{
    // c must be normalized
    float q = length(p.xy);
    return dot(c,vec2(q,p.z));
}

float sdTorus( vec3 p, vec2 t )
{
  vec2 q = vec2(length(p.xz)-t.x,p.y);
  return length(q)-t.y;
}

float rpBox( vec3 p, vec3 c ) {
    vec3 q = mod(p,c)-0.5*c;
    return udBox( p, vec3(0.5, 0.5, 0.5) );
}

float sdPlane( vec3 p )
{
  // n must be normalized
  return p.y;
}

float omap( vec3 p ) {
    float d1 = sdPlane( p );
    float d2 = sdSphere( p - vec3(0.0, 0.5, 0.0), 1.0);
    float d3 = udBox( p - vec3(-1.0, 1.0, 0.0), vec3(1.7, 2.0, 2.0) );
    float d4 = sdSphere( p - vec3(1.0, 0.5, 0.0), 0.5);
    return min(max(-d2, max(d3, d4)), d1);
}

float map( vec3 p ) {
    float d1 = sdPlane(p);
    float d2 = udBox( p - vec3(0.0, 0.9, 0.0), vec3(0.1, 0.9, 0.4) );
    float d3 = sdSphere( p - vec3(1.0, 0.5, 0.0), 0.5);
    return min(min(d1, d3), d2);
}

vec3 cmap( vec3 p ) {
    float d1 = sdPlane(p); // White
    float d2 = udBox( p - vec3(0.0, 0.9, 0.0), vec3(0.1, 0.9, 0.4) ); // Dark Gray
    float d3 = sdSphere( p - vec3(1.0, 0.5, 0.0), 0.5); // Barely White
    float z = min(d1, d2);
    z = min(z, d3);
    if (z == d1) {
        return vec3(1.0, 0.5, 0.3);
    }
    if (z == d2) {
        return vec3(0.1, 0.3, 0.1);
    }
    if (z == d3) {
        return vec3(0.9, 0.9, 0.7);
    }
    return vec3(0.0, 0.0, 0.0);
}

bool rmap( vec3 p ) {
    float d1 = sdPlane(p); // Not Reflective
    float d2 = udBox( p - vec3(0.0, 0.9, 0.0), vec3(0.1, 0.9, 0.4) ); // Reflective
    float d3 = sdSphere( p - vec3(1.0, 0.5, 0.0), 0.5); // Not Reflective
    float z = min(d1, d2);
    z = min(z, d3);
    if (z == d3) {
        return true;
    }
    return false;
}
    
vec3 norm( vec3 p ) {
    vec3 up = vec3(0.0, 1.0, 0.0);
    vec3 fr = vec3(0.0, 0.0, 1.0);
    vec3 rt = vec3(1.0, 0.0, 0.0);
    
    float mp = map(p);
    float mu = map(p + mp * up)/mp;
    float md = map(p - mp * up)/mp;
    float mr = map(p + mp * rt)/mp;
    float ml = map(p - mp * rt)/mp;
    float mf = map(p + mp * fr)/mp;
    float mb = map(p - mp * fr)/mp;
    
    float k;
    
    k = 2.0 / (mu + md);
    
    mu *= k;
    md *= k;
    
    k = 2.0 / (mr + ml);
    
    mr *= k;
    ml *= k;
    
    k = 2.0 / (mf + mb);
    
    mf *= k;
    mb *= k;
    
    float ud = sqrt(1.0 - mu*md);
    float rl = sqrt(1.0 - mr*ml);
    float fb = sqrt(1.0 - mf*mb);
    
    vec3 fv = vec3(0.0, 0.0, 0.0);
    
    if (mu > md) {
        fv += ud * up;
    } else {
        fv -= ud * up;
    }
    
    if (mr > ml) {
        fv += rl * rt;
    } else {
        fv -= rl * rt;
    }
    
    if (mf > mb) {
        fv += fb * fr;
    } else {
        fv -= fb * fr;
    }
    
    return fv;
}

vec3 normc( vec3 p ) {
    float dt = 0.5*map(p);
    
    vec3 up = vec3(0.0, 1.0, 0.0);
    vec3 fr = vec3(0.0, 0.0, 1.0);
    vec3 rt = vec3(1.0, 0.0, 0.0);
    
    vec3 n1 = norm(p);
    vec3 n2 = norm(p+dt*up);
    vec3 n3 = norm(p-dt*up);
    vec3 n4 = norm(p+dt*fr);
    vec3 n5 = norm(p-dt*fr);
    vec3 n6 = norm(p+dt*rt);
    vec3 n7 = norm(p-dt*rt);
    
   	vec3 n = (n1 + n2 + n3 + n4 + n5 + n6 + n7) / 7.0;
    
    return n;
}

float shadow( vec3 p, vec4 l ) {
    vec3 dr = normalize(p - l.xyz);
    float dst = 0.0;
    float res = 1.0;
    for (int i = 0; i < 100; ++i) {
        float dt = map(l.xyz);
        l.xyz += dr * dt * 0.8;
        dst += dt * 0.8;
        if (dt < 0.0001) {
            if (distance(l.xyz, p) < 0.001) {
                return res;
            } else {
            	return 0.0;
            }
        }
        res = min(res, 4.0 * dt * dst / length(p - l.xyz));
    }
    return res * l.w;
}

float shadown( vec3 p, vec4 l ) {
    vec3 dr = normalize(p - l.xyz);
    vec3 orig = l.xyz;
    float dst = 0.0;
    for (int i = 0; i < 100; ++i) {
        float dt = map(l.xyz);
        l.xyz += dr * dt * 0.8;
        dst += dt * 0.8;
        if (dt < 0.0001) {
            if (distance(l.xyz, orig) < 0.0001) {
                return 0.0;
            } else {
                return 1.0;
            }
        }
    }
    return 0.0;
}

vec3 lights( vec3 p, vec4 l, vec4 ldir, vec3 lc ) {
    vec3 ld = normalize(l.xyz - p);
    vec3 ds = norm(p);
    float li = dot(ds, ld);
    vec3 c = cmap(p);
    c.x *= lc.x;
    c.y *= lc.y;
    c.z *= lc.z;
   	return c * li * l.w * pow(clamp(ldir.w/distance(ld, ldir.xyz), 0.0, 1.0), 1.0/ldir.w);
    /*if (distance(ld, ldir.xyz) < ldir.w) {
    	return cmap(p) * li * l.w;
    } else {
        return vec3(0.03, 0.03, 0.03);
    }*/
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
	vec3 id = vec3(1.0, 1.0, 1.0);
    
    float mindist = min(iResolution.x, iResolution.y);
    
    vec3 uv = vec3((gl_FragCoord.xy - iResolution.xy / 2.0) / mindist, 0.0);
    
    // vec3 eye = vec3((2.0 * (iMouse.xy - iResolution.xy / 2.0) / mindist) + vec2(0.0, 1.0), -2.5);
    
    vec3 eye = vec3(3.0 * sin(iMouse.x * 3.141592 / 360.0), (iResolution.y - iMouse.y) / 45.0 , 3.0 * cos(iMouse.x * 3.141592 / 360.0));
    
    float fl = 1.0;
    
    vec3 fo = normalize(-1.0 * eye);
    
    // vec3 up = normalize(vec3(0.0, 1.0, 0.0)); // 2 point perspective
    
    vec3 up;
    
    vec4 light = vec4(3.0 * sin(iGlobalTime * 3.141592 / 45.0), 3.0, 3.0  * cos(iGlobalTime * 3.141592 / 45.0), 10.0);
    
    vec4 lightdir = vec4(normalize(-1.0 * light.xyz), 0.7);
    
    vec3 lightcolor = vec3(0.9, 0.9, 1.0);
    
    up.xz = -1.0 * fo.xz;
    
    up.xz *= fo.y / length(fo.xz);
    
    up.y = length(fo.xz); // 3 point perspective
    
    vec3 si = cross(up, fo);
    
    uv = eye + fl * fo + uv.x * si + uv.y * up;
    
    vec3 dr = uv - eye;
    
    uv = eye;
    
    dr = dr / length(dr);
    
    float dt = 0.0;
    
    for (int i = 0; i < 1000; ++i) {
        dt = map( uv );
        if (dt < 0.0001) {
            dt = float(i);
            break;
        }
        uv = uv + dr * dt * 0.8;
    }
    
    // reflect
    
    vec4 rf = vec4(shadow( uv, light ) * lights( uv, light, lightdir, lightcolor ), 1.0);
    
    if (rmap(uv)) {
    	float dt = 0.01;
        
        vec3 ds = norm(uv);
    	
    	dr = -1.0 * dr;
        
        ds *= dot(ds, dr);
        
        vec3 q = ds - dr;
        
        dr += 2.0 * q;
        
        for (int i = 0; i < 100; ++i) {
    	    uv = uv + dr * dt * 0.8;
            dt = map( uv );
            if (dt < 0.0001) {
    	        dt = float(i);
    	        break;
    	    }
    	}
        rf.w = 0.9;
    }
    
    if (rmap(uv)) {
    	float dt = 0.01;
        
        vec3 ds = norm(uv);
    	
    	dr = -1.0 * dr;
        
        ds *= dot(ds, dr);
        
        vec3 q = ds - dr;
        
        dr += 2.0 * q;
        
        for (int i = 0; i < 100; ++i) {
    	    uv = uv + dr * dt * 0.8;
            dt = map( uv );
            if (dt < 0.0001) {
    	        dt = float(i);
    	        break;
    	    }
    	}
        rf.w = 0.9;
    }
    
    if (rmap(uv)) {
    	float dt = 0.01;
        
        vec3 ds = norm(uv);
    	
    	dr = -1.0 * dr;
        
        ds *= dot(ds, dr);
        
        vec3 q = ds - dr;
        
        dr += 2.0 * q;
        
        for (int i = 0; i < 100; ++i) {
    	    uv = uv + dr * dt * 0.8;
            dt = map( uv );
            if (dt < 0.0001) {
    	        dt = float(i);
    	        break;
    	    }
    	}
        rf.w = 0.9;
    }
    
    
    
    // vec3 dc = vec3(dt, dt, dt) / 50.0;
   	
    /* if (dt == 100.0) {
       	dc = vec3(0.0, 1.0, 0.5);
    } else {
        dc = vec3(dt, dt, dt) / 50.0;
    } */
    
    vec3 dc = shadow( uv, light ) * lights( uv, light, lightdir, lightcolor );
    
    dc = rf.w*dc + (1.0 - rf.w)*rf.xyz;
    
    fragColor = vec4(dc, 1.0);
}

//_______________________________________________________________________________________________________





void main( void)
{
	mainImage(gl_FragColor, gl_FragCoord.xy);
}