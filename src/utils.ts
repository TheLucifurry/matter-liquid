export function checkPointInRect(pointX: number, pointY: number, rectX1: number, rectY1: number, rectX2: number, rectY2: number) {
  return (pointX > rectX1 && pointX < rectX2) && (pointY > rectY1 && pointY < rectY2)
}

export function arrayEach(array: any[], iteratee: (element: any, index: number, array: any[])=>boolean) { // From lodash
  let index = -1
  const length = array.length
  while (++index < length) {
    if (iteratee(array[index], index, array) === false) break;
  }
  return array
}

// Original
export function vectorLengthAdd(vec: [number, number], l: number): [number, number]{
  const baseLength = Math.hypot(vec[0], vec[1]);
  const endLength = baseLength + l;
  const baseX = Math.abs(vec[0]);
  const baseY = Math.abs(vec[1]);
  const sideXproport = (baseX / (baseX + baseY)) || 0.5;
  const sideYproport = (baseY / (baseX + baseY)) || 0.5;
  const endSidesSum = Math.sqrt( endLength**2 / 2) * 2;
  const x = endSidesSum * sideXproport;
  const y = endSidesSum * sideYproport;
  return [x * Math.sign(vec[0] || 1), y * Math.sign(vec[1] || 1)];
}
// Closure compiled

export function vectorLength(vec: [number, number]) {
  return Math.hypot(vec[0], vec[1]);
}

export function vectorNormal(vec: [number, number]): [number, number] {
  var length = Math.hypot(vec[0], vec[1]);
  return [vec[0] / length || 0, vec[1] / length|| 0];
}

export function vectorFromTwo(vec1: [number, number], vec2: [number, number]): [number, number] {
  return [vec2[0] - vec1[0], vec2[1] - vec1[1]];
}
export function vectorMul(vec: [number, number], multiplier: number): [number, number] {
  return [vec[0] * multiplier, vec[1] * multiplier];
}
export function vectorDiv(vec: [number, number], divider: number): [number, number] {
  return [vec[0] / divider, vec[1] / divider];
}