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
  gl.enableVertexAttribArray(a_position);
}

function renderLiquid(gl: WebGL2RenderingContext, points: Float32Array, liquidProto: TLiquidPrototypeComputed) {
  const color = liquidProto[L.COLOR_VEC4] as TFourNumbers;
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW);
  gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 0, 0);
  gl.uniform4f(u_color, ...color);
  gl.drawArrays(gl.POINTS, 0, points.length / 2);
}

export function update(liquid: TLiquid) {
  const gl: WebGL2RenderingContext = liquid.c;
  const render = liquid.r;
  const mainContext: CanvasRenderingContext2D = render.context;
  const bounds = render.bounds;
  const boundsWidth = bounds.max.x - bounds.min.x;
  const boundsHeight = bounds.max.y - bounds.min.y;

  // Prepare data
  const bufferList: Float32Array[] = liquid.st.cl.map((partCount) => new Float32Array(partCount * 2));
  const ixs: number[] = Array(bufferList.length).fill(0);
  for (let pid = 0; pid < liquid.p.length; pid++) {
    const part = liquid.p[pid];
    if (part === null) continue;
    const lid = liquid.lpl[pid][L.ID] as number;
    const buffer = bufferList[lid];
    buffer[ixs[lid]] = part[0];
    buffer[ixs[lid] + 1] = part[1];
    ixs[lid] += 2;
  }

  // Render
  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.useProgram(program);
  gl.uniform4f(u_renderBounds, bounds.min.x, bounds.min.y, bounds.max.x, bounds.max.y);
  bufferList.forEach((buffer, ix) => renderLiquid(gl, buffer, liquid.l[ix]));

  mainContext.drawImage(gl.canvas, bounds.min.x, bounds.min.y, boundsWidth, boundsHeight);
}
