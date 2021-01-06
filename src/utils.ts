export function checkPointInRect(pointX: number, pointY: number, rectX1: number, rectY1: number, rectX2: number, rectY2: number) {
  return (pointX > rectX1 && pointX < rectX2) && (pointY > rectY1 && pointY < rectY2)
}

export function arrayEach(array: any[], iteratee: (element: any, index: number, array: any[])=>boolean) { // From lodash
  let index = -1
  const length = array.length
  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break
    }
  }
  return array
}

// For development

export function drawAtom(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
  const radius = 4;
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fill();
}


// Original
// function vectorLengthAdd(vec: [number, number], l: number){
//   const baseLength = Math.sqrt(vec[0]**2 + vec[1]**2);
//   const endLength = baseLength + l;
//   const sideXproport = vec[0] / (vec[0] + vec[1]);
//   const endSidesSum = Math.sqrt( endLength**2 / 2) * 2;
//   const x = endSidesSum * sideXproport;
//   return [x, endSidesSum - x];
// }
// Closure compiled
export function vectorLengthAdd(vector: [number, number], a: number): [number, number] {
  const b = 2 * Math.sqrt( (Math.sqrt(vector[0]**2 + vector[1]**2) + a) ** 2 / 2), c = vector[0] / (vector[0] + vector[1]) * b;
  return [c, b - c];
}