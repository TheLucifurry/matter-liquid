/* eslint-disable no-bitwise */
/* eslint-disable @typescript-eslint/dot-notation */
import * as twgl from 'twgl.js';
import { F } from '../constants';
import vertexShader from './shaders/convert.vert';
import fragmentShader from './shaders/draw.frag';
// import fragment2Shader from './shaders/texturate.frag';
// import fragmentShader from './shaders/draw_old.frag';
// import { createShader, createProgram } from './utils';

const UNIFORMS = {
  camera: vertexShader.uniforms['u_camera'].variableName,
  color: fragmentShader.uniforms['u_color'].variableName,
};
const ATTRIBUTES = {
  position: 'a_position',
};

if (DEV) {
  console.log('shaders:');
  console.dir({ vertexShader, fragmentShader });
}

let programInfo: twgl.ProgramInfo;
let buffer: twgl.BufferInfo;

export function init(gl: WebGL2RenderingContext, liquid: TLiquid) {
  programInfo = twgl.createProgramInfo(gl, [vertexShader.sourceCode, fragmentShader.sourceCode], [ATTRIBUTES.position]);
  buffer = twgl.createBufferInfoFromArrays(gl, {
    [ATTRIBUTES.position]: { numComponents: 2, data: [] },
  });
}

function renderFluid(gl: WebGL2RenderingContext, points: Float32Array, fluidProto: TFluidPrototypeComputed) {
  const color = fluidProto[F.COLOR_VEC4] as TFourNumbers;
  gl.useProgram(programInfo.program);
  twgl.setUniforms(programInfo, { [UNIFORMS.color]: color });
  twgl.setAttribInfoBufferFromArray(gl, buffer.attribs[ATTRIBUTES.position], points);
  twgl.setBuffersAndAttributes(gl, programInfo, buffer);
  twgl.drawBufferInfo(gl, buffer, gl.POINTS, points.length / 2);
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
    const fid = liquid.fpl[pid][F.ID] as number;
    const buffer = bufferList[fid];
    buffer[ixs[fid]] = part[0];
    buffer[ixs[fid] + 1] = part[1];
    ixs[fid] += 2;
  }

  // Render
  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
  // twgl.resizeCanvasToDisplaySize(render.canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.useProgram(programInfo.program);

  gl.enable(gl.BLEND);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  twgl.setUniforms(programInfo, {
    [UNIFORMS.camera]: [bounds.min.x, bounds.min.y, bounds.max.x, bounds.max.y],
  });
  bufferList.forEach((buffer, ix) => renderFluid(gl, buffer, liquid.l[ix]));

  mainContext.drawImage(gl.canvas, bounds.min.x, bounds.min.y, boundsWidth, boundsHeight);
}
