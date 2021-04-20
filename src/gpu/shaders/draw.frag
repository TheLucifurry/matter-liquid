precision mediump float;

uniform vec4 color;

void main() {
  // gl_FragColor = vec4(gl_PointCoord, 0, 1);
  gl_FragColor = color;
}