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
     gl_Position = CC_PMatrix  * a_position * rotation;
     v_fragmentColor = a_color;
     v_texCoord = a_texCoord;
 }

`