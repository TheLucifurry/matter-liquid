#version 300 es
precision lowp float;

in vec2 a_position;
uniform vec4 u_camera;

void main() {
  vec2 offset = u_camera.xy;
  vec2 resolution = u_camera.zw - offset;

  vec2 position = (a_position - offset) / resolution;
  vec2 clipFlipSpace = (position * 2.0 - 1.0) * vec2(1, -1);

  gl_PointSize = 32.0;
  gl_Position = vec4(clipFlipSpace, 1, 1);
}