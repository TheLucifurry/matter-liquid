import { P } from '../constants';
import { checkPointInRect } from './utils';

export function arrayEach(array: any[], iteratee: (element: any, index: number)=>void): void { // From lodash
  let index = -1;
  const { length } = array;
  while (++index < length) iteratee(array[index], index);
}
export function foreachActive(liquid: TLiquid, activeRect: TRect, arr: TParticle[], callback: (particle: TParticle, particleid: number)=>void): void {
  arrayEach(arr, (part, id) => {
    if (part === null || (activeRect && !checkPointInRect(part[P.X], part[P.Y], activeRect))) return; // Ignore static or inactive particles
    callback(part, id);
  });
}
export function foreachDynamic(liquid: TLiquid, arr: TParticle[], callback: (particle: TParticle, particleid: number)=>void): void {
  arrayEach(arr, (part, id) => {
    if (part === null) return; // Ignore static or inactive particles
    callback(part, id);
  });
}
export function foreachIds(particles: TParticle[], pids: number[], callback: (particle: TParticle, particleid: number)=>void): void {
  arrayEach(pids, (pid) => callback(particles[pid], pid));
}
export function getNeighbors(liquid: TLiquid, pid: number): number[] {
  const part = liquid.p[pid];
  const near = [...liquid.asm.__getArray(liquid.sh.getNearby(part[P.X], part[P.Y]))];
  // return near;

  // TODO: Костыльный фильтр по радиусу, изучить возможность передачи liquid.p в ассембли, что бы портировать фильтр в ассембли-код
  const res: TSHItem[] = [];
  const cellSize = liquid.h;
  const csSqrt = cellSize ** 2;
  for (let i = 0; i < near.length; i++) { // Filter only parts in radius
    const pid = near[i];
    const nPart = liquid.p[pid];
    if ((nPart[0] - part[0]) ** 2 + (nPart[1] - part[1]) ** 2 <= csSqrt) {
      res.push(pid);
    }
  }
  return res;

  // return liquid.sh.getNearby(part[P.X], part[P.Y], liquid.p);
}
export function eachNeighbors(particles: TParticle[], neighbors: number[], cb: (neighborParticle: TParticle, neighborPid: number)=>void): void {
  arrayEach(neighbors, (pid) => cb(particles[pid], pid));
}
export function eachNeighborsOf(liquid: TLiquid, pid: number, cb: (neighborParticle: TParticle, neighborPid: number)=>void): void {
  eachNeighbors(liquid.p, getNeighbors(liquid, pid), cb);
}
export function eachSpring(springs: TSpringList, cb: (springKey: string, spring: TSpring)=>void): void {
  for (const [key, spring] of Object.entries(springs)) {
    cb(key, spring);
  }
}
