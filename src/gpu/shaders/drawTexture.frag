precision mediump float;

// наша текстура
uniform sampler2D u_image;

// texCoords передаются из вершинного шейдера
varying vec2 v_texCoord;

void main() {
  gl_FragColor = texture2D(u_image, v_texCoord);
}