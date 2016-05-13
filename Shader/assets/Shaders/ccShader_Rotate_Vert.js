module.exports =
`
#ifdef GL_ES
precision mediump float;
#endif
attribute vec4 a_position;
 attribute vec2 a_texCoord;
 attribute vec4 a_color;
 varying vec2 v_texCoord;
 varying vec4 v_fragmentColor;
uniform vec4 rotation;
 void main()
 {
     gl_Position = ( CC_PMatrix * CC_MVMatrix ) * a_position * vec4(0.5,1,1,1);
     //gl_Position = vec4(0.5,1,1,1);
     v_fragmentColor = a_color;
     v_texCoord = a_texCoord;
 }
`
