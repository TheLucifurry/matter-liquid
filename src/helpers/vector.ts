export function vectorLength(vec: TVector): number {
  return Math.hypot(vec[0], vec[1]);
}
export function vectorNormal(vec: TVector): TVector {
  const length = Math.hypot(vec[0], vec[1]);
  return length !== 0 ? [vec[0] / length, vec[1] / length] : [0, 0];
}
export function vectorSigns(vec: TVector): TVector {
  return [Math.sign(vec[0]), Math.sign(vec[1])];
}
export function vectorAdd(vec1: TVector, num: number): TVector {
  return [vec1[0] + num, vec1[1] + num];
}
export function vectorSub(vec1: TVector, subtracter: number): TVector {
  return [vec1[0] - subtracter, vec1[1] - subtracter];
}
export function vectorMul(vec: TVector, multiplier: number): TVector {
  return [vec[0] * multiplier, vec[1] * multiplier];
}
export function vectorDiv(vec: TVector, divider: number): TVector {
  return [vec[0] / divider, vec[1] / divider];
}

export function vectorAddLength(vec1: TVector, length: number): TVector {
  const norm = vectorNormal(vec1);
  const newLength = vectorLength(vec1) + length;
  const x = norm[0] * newLength;
  return [x, newLength - x];
}

/** From three.js
 * @see https://github.com/mrdoob/three.js/blob/be6a7dbb1b5247e7355fe6c5cb229b4597693f7e/src/math/Vector2.js#L269 */
export function vectorClampMaxLength(vec: TVector, max: number): TVector {
  const length = Math.hypot(vec[0], vec[1]);
  const div = vectorDiv(vec, length || 1);
  return vectorMul(div, Math.max(0, Math.min(max, length)));
}

export function vectorRotate(vec: TVector, angle: number): TVector {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const x = vec[0] * cos - vec[1] * sin;
  const y = vec[0] * sin + vec[1] * cos;
  return [x, y];
}

export function vectorAddVector(vec1: TVector, vec2: TVector): TVector {
  return [vec2[0] + vec1[0], vec2[1] + vec1[1]];
}
export function vectorEqualsVector(vec1: TVector, vec2: TVector): boolean {
  return vec2[0] === vec1[0] && vec2[1] === vec1[1];
}
export function vectorFromTwo(vec1: TVector, vec2: TVector): TVector {
  return [vec2[0] - vec1[0], vec2[1] - vec1[1]];
}
export function vectorMulVector(vec1: TVector, vec2: TVector): TVector {
  return [vec1[0] * vec2[0], vec1[1] * vec2[1]];
}
export function vectorSubVector(vec1: TVector, vec2: TVector): TVector {
  return [vec1[0] - vec2[0], vec1[1] - vec2[1]];
}
export function vectorDotVector(vec1: TVector, vec2: TVector): number {
  return vec1[0] * vec2[0] + vec1[1] * vec2[1];
}
export function getReflectVector(incidenceVector: TVector, surfaceNormal: TVector): TVector {
  return vectorSubVector(incidenceVector, vectorMul(surfaceNormal, 2 * vectorDotVector(incidenceVector, surfaceNormal)));
}
