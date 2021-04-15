import { L } from '../constants';
import shaderVertSrc from './shaders/convert.vert';
import shaderFragSrc from './shaders/draw.frag';
import { createShader, createProgram } from './utils';

let a_position: number;
let u_color: WebGLUniformLocation;
let u_renderBounds: WebGLUniformLocation;
let program: WebGLProgram;
let positionBuffer: WebGLBuffer;

export function init(gl: WebGL2RenderingContext, liquid: TLiquid) {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, shaderVertSrc);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, shaderFragSrc);
  program = createProgram(gl, vertexShader, fragmentShader);

  // Attrs
  a_position = gl.getAttribLocation(program, 'a_position');
  u_renderBounds = gl.getUniformLocation(program, 'bounds');
  u_color = gl.getUniformLocation(program, 'color');

  // Buffer
  positionBuffer = gl.createBuffer();
}

export function update(liquid: TLiquid) {
  const gl: WebGL2RenderingContext = liquid.c;
  const render = liquid.r;
  const liquidColor = liquid.l[0][L.COLOR_VEC4] as TFourNumbers;
  const mainContext: CanvasRenderingContext2D = render.context;
  const renderBounds = render.bounds;
  const renderBoundsMin = render.bounds.min;
  const boundsWidth = render.bounds.max.x - renderBoundsMin.x;
  const boundsHeight = render.bounds.max.y - renderBoundsMin.y;

  // Build buffer
  const positions = new Float32Array((liquid.p.length - liquid.fpids.length) * 2);
  let ix = 0;
  liquid.p.forEach((part) => {
    if (part !== null) {
      positions[ix] = part[0];
      positions[ix + 1] = part[1];
      ix += 2;
    }
  });

  // Установка размеров канваса
  // gl.viewport(0, 0, boundsWidth, boundsHeight);
  // gl.viewport(render.bounds.min.x, render.bounds.min.y, boundsWidth, boundsHeight);
  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

  // очищаем canvas
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // говорим использовать нашу программу (пару шейдеров)
  gl.useProgram(program);

  gl.enableVertexAttribArray(a_position);

  // Привязываем буфер положений
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

  // Указываем атрибуту, как получать данные от positionBuffer (ARRAY_BUFFER)
  const size = 2; // 2 компоненты на итерацию
  const type = gl.FLOAT; // наши данные - 32-битные числа с плавающей точкой
  const normalize = false; // не нормализовать данные
  const stride = 0; // 0 = перемещаться на size * sizeof(type) каждую итерацию для получения следующего положения
  const offset = 0; // начинать с начала буфера
  gl.vertexAttribPointer(
    a_position, size, type, normalize, stride, offset,
  );

  gl.uniform4f(u_renderBounds, renderBounds.min.x, renderBounds.min.y, renderBounds.max.x, renderBounds.max.y);
  gl.uniform4f(u_color, ...liquidColor);

  const primitiveType = gl.POINTS;
  const offset2 = 0;
  const count = positions.length / 2;
  gl.drawArrays(primitiveType, offset2, count);

  // mainContext.drawImage(gl.canvas, render.bounds.min.x, render.bounds.min.y);
  mainContext.drawImage(gl.canvas, renderBoundsMin.x, renderBoundsMin.y, boundsWidth, boundsHeight);
}
