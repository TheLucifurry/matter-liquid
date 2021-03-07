export function vectorLength(vec: TVector) {
  return Math.hypot(vec[0], vec[1]);
}
export function vectorNormal(vec: TVector): TVector {
  const length = Math.hypot(vec[0], vec[1]);
  return length !== 0 ? [ vec[0] / length, vec[1] / length] : [0, 0];
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
/** From three.js
 * @see https://github.com/mrdoob/three.js/blob/be6a7dbb1b5247e7355fe6c5cb229b4597693f7e/src/math/Vector2.js#L269 */
export function vectorClampMaxLength(vec: TVector, max: number): TVector {
  const length = Math.hypot(vec[0], vec[1]);
  const div = vectorDiv(vec, length || 1)
  return vectorMul(div,  Math.max( 0, Math.min( max, length ) ) );
}
export function vectorRotate(vec: TVector, angle: number): TVector {
  const cos = Math.cos(angle), sin = Math.sin(angle);
  const x = vec[0] * cos - vec[1] * sin;
  const y = vec[0] * sin + vec[1] * cos;
  return [x, y];
};

export function vectorFromTwo(vec1: TVector, vec2: TVector): TVector {
  return [vec2[0] - vec1[0], vec2[1] - vec1[1]];
}
export function vectorMulVector(vec1: TVector, vec2: TVector): TVector {
  return [vec1[0] * vec2[0], vec1[1] * vec2[1]];
}
export function vectorSubVector(vec1: TVector, vec2: TVector): TVector {
  return [vec1[0] - vec2[0], vec1[1] - vec2[1]];
}