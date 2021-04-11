attribute vec2 a_position;

uniform vec4 u_worldBounds;
uniform vec4 u_renderBounds;

vec2 u_offset = u_renderBounds.xy;
vec2 u_resolution = u_renderBounds.zw - u_offset;

void main() {

  // преобразуем положение в пикселях к диапазону от 0.0 до 1.0
  vec2 zeroToOne = (a_position - u_offset) / u_resolution;

  // преобразуем в -1 - +1 (пространство отсечения)
  vec2 clipFlipSpace = (zeroToOne * 2.0 - 1.0) * vec2(1, -1);

  gl_Position = vec4(clipFlipSpace, 0, 1);
  gl_PointSize = 20.0;
}