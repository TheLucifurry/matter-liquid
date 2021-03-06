import Matter from 'matter-js';
import { PARTICLE_PROPS } from '../constants';

export function checkPointInRect(pointX: number, pointY: number, rectX1: number, rectY1: number, rectX2: number, rectY2: number) {
  return (pointX > rectX1 && pointX < rectX2) && (pointY > rectY1 && pointY < rectY2)
}

export function arrayEach(array: any[], iteratee: (element: any, index: number)=>void) { // From lodash
  let index = -1
  const length = array.length
  while (++index < length) iteratee(array[index], index);
}
export function mathWrap(value: number, min: number, max: number): number{
  const range = max - min;
  return (min + ((((value - min) % range) + range) % range));
}

// Matter dependant
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
  // if (Matter.Bounds.contains(body.bounds, point)) {
    for (let j = body.parts.length === 1 ? 0 : 1; j < body.parts.length; j++) {
      const part = body.parts[j];
      if (Matter.Bounds.contains(part.bounds, point) && Matter.Vertices.contains(part.vertices, point)) {
        return true;
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

export function getWorldWidth(world: Matter.World, defaultValue: number): number {
  const diff = world.bounds.max.x - world.bounds.min.x;
  return isFinite(diff) ? diff : defaultValue;
}