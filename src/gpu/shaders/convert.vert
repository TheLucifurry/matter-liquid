attribute vec2 a_position;

uniform vec4 bounds;

vec2 offset = bounds.xy;
vec2 resolution = bounds.zw - offset;

void main() {
  // "Пикселизатор" позиций
  // float size = 8.0;
  // vec2 pos = floor((a_position - offset) / size);
  // vec2 position = pos * size / resolution;

  vec2 position = (a_position - offset) / resolution;
  vec2 clipFlipSpace = (position * 2.0 - 1.0) * vec2(1, -1);

  gl_Position = vec4(clipFlipSpace, 0, 1);
  gl_PointSize = 20.0;
}