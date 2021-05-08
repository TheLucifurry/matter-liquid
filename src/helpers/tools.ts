import Matter from 'matter-js';
import { P } from '../constants';
import { vectorNormal, vectorFromTwo } from './vector';

// Matter dependant
export function getBodiesInRect(bodies: Matter.Body[], zone: TRect): Matter.Body[] {
  return Matter.Query.region(bodies, {
    min: { x: zone[0], y: zone[1] },
    max: { x: zone[2], y: zone[3] },
  });
}
export function getBodiesByPoint(bodies: Matter.Body[], x: number, y: number): Matter.Body[] {
  return Matter.Query.point(bodies, { x, y });
}
export function checkBodyContainsPoint(body: Matter.Body, x: number, y: number): boolean {
  return Matter.Vertices.contains(body.vertices, { x, y });
}
export function getRectFromBoundsWithPadding(bounds: Matter.Bounds, padding = 0): TRect {
  return [
    bounds.min.x - padding,
    bounds.min.y - padding,
    bounds.max.x + padding,
    bounds.max.y + padding,
  ];
}
export function getParticlesInsideBodyIds(particles: TParticle[], body: Matter.Body, liquid: TLiquid, _test_particleIds?: number[]): number[] {
  const { bounds } = body;
  const res: number[] = [];
  const nearParticlesIds: number[] = liquid.asm.__getArray(liquid.sh.getFromBounds(bounds.min.x, bounds.min.y, bounds.max.x, bounds.max.y));
  // const nearParticlesIds: number[] = liquid.sh.getFromBounds(bounds);
  for (let i = 0; i < nearParticlesIds.length; i++) {
    const pid = nearParticlesIds[i];
    const part = particles[pid];
    const x = part[P.X];
    const y = part[P.Y];
    if (checkBodyContainsPoint(body, x, y)) {
      res.push(pid);
    }
  }
  return res;
}

export function getWorldWidth(world: Matter.World, defaultValue: number): number {
  const diff = world.bounds.max.x - world.bounds.min.x;
  return isFinite(diff) ? diff : defaultValue;
}

export function getLineIntersectionPoint(line1start: TVector, line1end: TVector, line2start: TVector, line2end: TVector): TVector {
  const d1 = (line1start[0] - line1end[0]) * (line2start[1] - line2end[1]); // (x1 - x2) * (y3 - y4)
  const d2 = (line1start[1] - line1end[1]) * (line2start[0] - line2end[0]); // (y1 - y2) * (x3 - x4)
  const d = d1 - d2;
  // if (d === 0) {
  //   return null;
  // }
  const u1 = line1start[0] * line1end[1] - line1start[1] * line1end[0]; // (x1 * y2 - y1 * x2)
  const u4 = line2start[0] * line2end[1] - line2start[1] * line2end[0]; // (x3 * y4 - y3 * x4)
  const u2x = line2start[0] - line2end[0]; // (x3 - x4)
  const u3x = line1start[0] - line1end[0]; // (x1 - x2)
  const u2y = line2start[1] - line2end[1]; // (y3 - y4)
  const u3y = line1start[1] - line1end[1]; // (y1 - y2)
  // intersection point formula
  const px = (u1 * u2x - u3x * u4) / d;
  const py = (u1 * u2y - u3y * u4) / d;
  return [px, py];
}
export function checkRayIntersectsLine(lineStart: TVector, lineEnd: TVector, reyStart: TVector, reyEnd: TVector): boolean {
  const det = (lineEnd[0] - lineStart[0]) * (reyEnd[1] - reyStart[1]) - (reyEnd[0] - reyStart[0]) * (lineEnd[1] - lineStart[1]);
  if (det === 0) {
    return false;
  }
  const lambda = ((reyEnd[1] - reyStart[1]) * (reyEnd[0] - lineStart[0]) + (reyStart[0] - reyEnd[0]) * (reyEnd[1] - lineStart[1])) / det;
  const gamma = ((lineStart[1] - lineEnd[1]) * (reyEnd[0] - lineStart[0]) + (lineEnd[0] - lineStart[0]) * (reyEnd[1] - lineStart[1])) / det;
  return lambda > 0 && lambda < 1 && gamma < 1;
}
export function getBodySurfaceIntersectsWithRay(body: Matter.Body, rayStart: TVector, rayEnd: TVector): [TVector, TVector] {
  const verts: Matter.Vector[] = body.vertices;
  for (let i = 0; i < verts.length; i++) {
    const startVert: Matter.Vector = verts[i];
    const endVert: Matter.Vector = verts[i !== verts.length - 1 ? i + 1 : 0];
    const startSide: TVector = [startVert.x, startVert.y];
    const endSide: TVector = [endVert.x, endVert.y];
    if (checkRayIntersectsLine(startSide, endSide, rayStart, rayEnd)) {
      return [startSide, endSide];
    }
  }
  return null;
}

export function checkLinesIntersects(line1start: TVector, line1end: TVector, line2start: TVector, line2end: TVector): boolean {
  const det = (line1end[0] - line1start[0]) * (line2end[1] - line2start[1]) - (line2end[0] - line2start[0]) * (line1end[1] - line1start[1]);
  if (det === 0) {
    return false;
  }
  const lambda = ((line2end[1] - line2start[1]) * (line2end[0] - line1start[0]) + (line2start[0] - line2end[0]) * (line2end[1] - line1start[1])) / det;
  const gamma = ((line1start[1] - line1end[1]) * (line2end[0] - line1start[0]) + (line1end[0] - line1start[0]) * (line2end[1] - line1start[1])) / det;
  return (lambda > 0 && lambda < 1) && (gamma > 0 && gamma < 1);
}
export function getBodySurfaceNormal(lineStart: TVector, lineEnd: TVector): TVector {
  const v = vectorNormal(vectorFromTwo([lineStart[0], lineStart[1]], [lineEnd[0], lineEnd[1]]));
  return [v[1], -v[0]];
}
