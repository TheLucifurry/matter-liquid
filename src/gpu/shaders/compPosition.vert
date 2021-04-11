attribute vec2 a_position;
// attribute vec2 a_texCoord;

uniform vec4 u_worldBounds;
uniform vec4 u_renderBounds;

vec2 u_offset = u_renderBounds.xy;
vec2 u_resolution = u_renderBounds.zw - u_offset;

varying vec2 v_texCoord;

void main() {
  // преобразуем положение в пикселях к диапазону от 0.0 до 1.0
  vec2 zeroToOne = (a_position - u_offset) / u_resolution;

  // преобразуем в -1 - +1 (пространство отсечения)
  vec2 clipFlipSpace = (zeroToOne * 2.0 - 1.0) * vec2(1, -1);

  gl_Position = vec4(clipFlipSpace, 0, 1);

  // pass the texCoord to the fragment shader
  // The GPU will interpolate this value between points.
  v_texCoord = a_position;
  // v_texCoord = clipFlipSpace;
  gl_PointSize = 4.0;
}