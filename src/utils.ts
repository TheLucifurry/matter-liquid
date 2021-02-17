import Matter from 'matter-js';
import { PARTICLE_PROPS } from './enums';

export function checkPointInRect(pointX: number, pointY: number, rectX1: number, rectY1: number, rectX2: number, rectY2: number) {
  return (pointX > rectX1 && pointX < rectX2) && (pointY > rectY1 && pointY < rectY2)
}

export function arrayEach(array: any[], iteratee: (element: any, index: number)=>void) { // From lodash
  let index = -1
  const length = array.length
  while (++index < length) iteratee(array[index], index);
}

// Original
export function vectorLengthAdd(vec: TVector, l: number): TVector{
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

export function vectorLength(vec: TVector) {
  return Math.hypot(vec[0], vec[1]);
}

export function vectorNormal(vec: TVector): TVector {
  const length = Math.hypot(vec[0], vec[1]);
  return [vec[0] / length || 0, vec[1] / length || 0];
}

export function vectorFromTwo(vec1: TVector, vec2: TVector): TVector {
  return [vec2[0] - vec1[0], vec2[1] - vec1[1]];
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
export function vectorMulVector(vec1: TVector, vec2: TVector): TVector {
  return [vec1[0] * vec2[0], vec1[1] * vec2[1]];
}
export function vectorSubVector(vec1: TVector, vec2: TVector): TVector {
  return [vec1[0] - vec2[0], vec1[1] - vec2[1]];
}

// export function vectorFromTwo(vec1: TVector, vec2: TVector): TVector {
//   const res: TVector = [vec2[0] - vec1[0], vec2[1] - vec1[1]];
//   if(hasAnomal(res)){
//     console.dir({res, vec1, vec2});
//     // debugger
//   }
//   return res;
// }
// export function vectorMul(vec: TVector, multiplier: number): TVector {
//   const res: TVector = [vec[0] * multiplier, vec[1] * multiplier];
//   if(hasAnomal(res)){
//     console.dir({res, vec, multiplier});
//     // debugger
//   }
//   return res;
// }
// export function vectorMulVector(vec1: TVector, vec2: TVector): TVector {
//   const res: TVector = [vec1[0] * vec2[0], vec1[1] * vec2[1]];
//   if(hasAnomal(res)){
//     console.dir({res, vec1, vec2});
//     // debugger
//   }
//   return res;
// }
// export function vectorDiv(vec: TVector, divider: number): TVector {
//   const res: TVector = [vec[0] / divider, vec[1] / divider];
//   if(hasAnomal(res)){
//     console.dir({res, vec, divider});
//     // debugger
//   }
//   return res;
// }

function hasAnomal(vec: TVector) {
  return !isFinite(vec[0]) || !isFinite(vec[1]);
}

export function getBodiesInRect(bodies: Matter.Body[], zone: TRect): Matter.Body[] {
  return Matter.Query.region(bodies, {
    min: {x: zone[0], y: zone[1]},
    max: {x: zone[2], y: zone[3]},
  })
}
export function getBodiesByPoint(bodies: Matter.Body[], x: number, y: number): Matter.Body[] {
  return Matter.Query.point(bodies, { x, y });
}
export function checkBodyContainsPoint(body: Matter.Body, x: number, y: number): boolean {
  const point = { x, y };
  // for (let i = 0; i < bodies.length; i++) {
    // body = bodies[i];
    if (Matter.Bounds.contains(body.bounds, point)) {
      for (let j = body.parts.length === 1 ? 0 : 1; j < body.parts.length; j++) {
        const part = body.parts[j];
        if (Matter.Bounds.contains(part.bounds, point) && Matter.Vertices.contains(part.vertices, point)) {
          return true;
        }
      }
    }
  // }
  return false;
}
export function getRectWithPaddingsFromBounds(bounds: Matter.Bounds, paddings: TPadding): TRect {
  const [top, right, bottom, left] = paddings;
  return [
    bounds.min.x - left,
    bounds.min.y - top,
    bounds.max.x + right,
    bounds.max.y + bottom,
  ]
}
export function getParticlesInsideBodyIds(particles: TLiquidParticle[], body: Matter.Body, spatialHash: CSpatialHash, _test_particleIds: number[]): number[] {
  const res: number[] = [];
  // const nearParticlesIds: number[] = State.spatialHash.getItemsNearBody(body);
  const nearParticlesIds: number[] = _test_particleIds;
  for (let i = 0; i < nearParticlesIds.length; i++) {
    const pid = nearParticlesIds[i];
    const part = particles[pid];
    const x = part[PARTICLE_PROPS.X], y = part[PARTICLE_PROPS.Y];
    if(checkBodyContainsPoint(body, x, y)){
      res.push(pid)
    }
  }
  return res;
}

/** @see https://github.com/liabru/matter-js/blob/3f579274c7e213eb4c49bd2636634542b01dd0e9/src/render/Render.js#L263 */
export function startViewTransform(render: Matter.Render) {
  let boundsWidth = render.bounds.max.x - render.bounds.min.x,
      boundsHeight = render.bounds.max.y - render.bounds.min.y,
      boundsScaleX = boundsWidth / render.options.width,
      boundsScaleY = boundsHeight / render.options.height;

  render.context.setTransform(
    //@ts-ignore
    render.options.pixelRatio / boundsScaleX, 0, 0,
    //@ts-ignore
    render.options.pixelRatio / boundsScaleY, 0, 0
  );

  render.context.translate(-render.bounds.min.x, -render.bounds.min.y);
}
