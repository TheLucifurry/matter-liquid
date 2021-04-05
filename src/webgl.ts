const vertexShaderSource = `
attribute vec2 a_position;

// uniform vec2 u_position;
uniform vec2 u_resolution;

void main() {
  // преобразуем положение в пикселях к диапазону от 0.0 до 1.0
  vec2 zeroToOne = a_position / u_resolution;

  // преобразуем из 0->1 в 0->2
  vec2 zeroToTwo = zeroToOne * 2.0;

  // преобразуем из 0->2 в -1->+1 (пространство отсечения)
  vec2 clipSpace = zeroToTwo - 1.0;

  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
}`;
const fragmentShaderSource = `
precision mediump float;

uniform vec4 u_color;

void main() {
  gl_FragColor = u_color;
}`;

function createShader(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type); // создание шейдера
  gl.shaderSource(shader, source); // устанавливаем шейдеру его программный код
  gl.compileShader(shader); // компилируем шейдер
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) { // если компиляция прошла успешно - возвращаем шейдер
    return shader;
  }

  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
  return null;
}
function createProgram(gl: WebGL2RenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
  return null;
}

let positionAttributeLocation: number;
let resolutionUniformLocation: WebGLUniformLocation;
let positionUniformLocation: WebGLUniformLocation;
let colorUniformLocation: WebGLUniformLocation;
let program: WebGLProgram;
let positionBuffer: WebGLBuffer;

export function init(gl: WebGL2RenderingContext) {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
  program = createProgram(gl, vertexShader, fragmentShader);

  // Attrs
  positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
  resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution');
  // positionUniformLocation = gl.getUniformLocation(program, 'u_position');
  colorUniformLocation = gl.getUniformLocation(program, 'u_color');

  // Buffer
  positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  const positions = [
    10, 20,
    80, 20,
    10, 30,
    10, 30,
    80, 20,
    120, 30,
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
}

export function update(gl: WebGL2RenderingContext, render: Matter.Render, positions: Float32Array) {
  const mainContext:CanvasRenderingContext2D = render.context;

  // const boundsWidth = render.bounds.max.x - render.bounds.min.x;
  // const boundsHeight = render.bounds.max.y - render.bounds.min.y;
  // const boundsScaleX = boundsWidth / render.options.width;
  // const boundsScaleY = boundsHeight / render.options.height;
  // const ctx: CanvasRenderingContext2D;
  // ctx.setTransform(
  //   // @ts-ignore
  //   render.options.pixelRatio / boundsScaleX, 0, 0,
  //   // @ts-ignore
  //   render.options.pixelRatio / boundsScaleY, 0, 0,
  // );
  // ctx.translate(-render.bounds.min.x, -render.bounds.min.y);

  // Установка размеров канваса
  // gl.viewport(0, 0, boundsWidth, boundsHeight);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // очищаем canvas
  // gl.clearColor(0, 0, 0, 0);
  gl.clearColor(0.1, 0.1, 0.1, 0.1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // говорим использовать нашу программу (пару шейдеров)
  gl.useProgram(program);

  gl.enableVertexAttribArray(positionAttributeLocation);

  // Привязываем буфер положений
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Указываем атрибуту, как получать данные от positionBuffer (ARRAY_BUFFER)
  const size = 2; // 2 компоненты на итерацию
  const type = gl.FLOAT; // наши данные - 32-битные числа с плавающей точкой
  const normalize = false; // не нормализовать данные
  const stride = 0; // 0 = перемещаться на size * sizeof(type) каждую итерацию для получения следующего положения
  const offset = 0; // начинать с начала буфера
  gl.vertexAttribPointer(
    positionAttributeLocation, size, type, normalize, stride, offset,
  );

  // установка разрешения
  gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
  gl.uniform4f(colorUniformLocation, 0, 1, 1, 1);
  // gl.uniform2fv(positionUniformLocation, positions);

  const primitiveType = gl.TRIANGLES;
  const offset2 = 0;
  const count = 6;
  gl.drawArrays(primitiveType, offset2, count);

  // mainContext.drawImage(gl.canvas, render.bounds.min.x + 50, render.bounds.min.y + 50, render.canvas.width, render.canvas.height);
  mainContext.drawImage(gl.canvas, render.bounds.min.x, render.bounds.min.y);
}
