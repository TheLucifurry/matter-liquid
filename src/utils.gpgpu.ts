import { GPU } from 'gpu.js';
const gpu = new GPU();

// export function vectorNormal(vec: TVector): TVector {
//   const length = Math.hypot(vec[0], vec[1]);
//   return length !== 0 ? [ vec[0] / length, vec[1] / length] : [0, 0];
// }

function SFgetVectorLength(vec: TVector) {
  return Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1]);
}
function SFvectorMul(vec: TVector, multiplier: number): TVector {
  return [vec[0] * multiplier, vec[1] * multiplier];
}
function SFvectorDiv(vec: TVector, divider: number): TVector {
  return [vec[0] / divider, vec[1] / divider];
}

gpu.addFunction(SFgetVectorLength, { argumentTypes: { vec: 'Array(2)' }, returnType: 'Number' });
gpu.addFunction(SFvectorMul, { argumentTypes: { vec: 'Array(2)', multiplier: 'Number' }, returnType: 'Array(2)' });
gpu.addFunction(SFvectorDiv, { argumentTypes: { vec: 'Array(2)', divider: 'Number' }, returnType: 'Array(2)' });

//@ts-ignore
export const getVectorLength = gpu.createKernel(SFgetVectorLength, {
  argumentTypes: { vec: 'Array(2)' },
  output: [1],
});

const getVectorNormal = gpu.createKernel(function(vec: TVector) {
  //@ts-ignore
  const length: number = SFgetVectorLength(vec);
  return [ vec[0] / length, vec[1] / length];
}, {
  argumentTypes: { vec: 'Array(2)' },
  output: [1, 1],
});
const getVectorClampMaxLength = gpu.createKernel(function(vec: TVector, max: number): TVector {
  const length = SFgetVectorLength(vec);
  const div = SFvectorDiv(vec, length || 1)
  return SFvectorMul(div,  Math.max( 0, Math.min( max, length ) ) );
}, {
  argumentTypes: { vec: 'Array(2)', max: 'Number' },
  output: [1, 1],
});




export function vectorLength(v: TVector): number {
  //@ts-ignore
  return getVectorLength(v)[0];
}
export function vectorNormal(v: TVector): TVector {
  //@ts-ignore
  return getVectorNormal(v)[0];
}
export function vectorClampMaxLength(vec: TVector, max: number): TVector {
  //@ts-ignore
  return getVectorClampMaxLength(vec, max)[0];
}



function vectorFromTwo(vec1: TVector, vec2: TVector): TVector {
  return [vec2[0] - vec1[0], vec2[1] - vec1[1]];
}
function vectorSub(vec1: TVector, subtracter: number): TVector {
  return [vec1[0] - subtracter, vec1[1] - subtracter];
}
// function vectorMul(vec: TVector, multiplier: number): TVector {
//   return [vec[0] * multiplier, vec[1] * multiplier];
// }
// function vectorDiv(vec: TVector, divider: number): TVector {
//   return [vec[0] / divider, vec[1] / divider];
// }
function vectorMulVector(vec1: TVector, vec2: TVector): TVector {
  return [vec1[0] * vec2[0], vec1[1] * vec2[1]];
}
function vectorSubVector(vec1: TVector, vec2: TVector): TVector {
  return [vec1[0] - vec2[0], vec1[1] - vec2[1]];
}
/** From three.js
 * @see https://github.com/mrdoob/three.js/blob/be6a7dbb1b5247e7355fe6c5cb229b4597693f7e/src/math/Vector2.js#L269 */
// function vectorClampMaxLength(vec: TVector, max: number): TVector {
//   const length = Math.hypot(vec[0], vec[1]);
//   const div = vectorDiv(vec, length || 1)
//   return vectorMul(div,  Math.max( 0, Math.min( max, length ) ) );
// }