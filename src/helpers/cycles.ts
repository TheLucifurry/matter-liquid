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
  return liquid.sh.getNearby(part[P.X], part[P.Y], liquid.p);
}
export function eachNeighbors(particles: TParticle[], neighbors: number[], cb: (neighborParticle: TParticle, neighborPid: number)=>void): void {
  arrayEach(neighbors, (pid) => cb(particles[pid], pid));
}
export function eachNeighborsOf(liquid: TLiquid, pid: number, cb: (neighborParticle: TParticle, neighborPid: number)=>void): void {
  eachNeighbors(liquid.p, getNeighbors(liquid, pid), cb);
}
