import { P } from '../constants';
import { checkPointInRect } from './utils';

export function arrayEach(array: any[], iteratee: (element: any, index: number)=>void): void { // From lodash
  let index = -1;
  const { length } = array;
  while (++index < length) iteratee(array[index], index);
}
export function foreachActive(liquid: CLiquid, activeRect: TRect, arr: TLiquidParticle[], callback: (particle: TLiquidParticle, particleid: number)=>void): void {
  arrayEach(arr, (part, id) => {
    if (part === null || (activeRect && !checkPointInRect(part[P.X], part[P.Y], ...activeRect))) return; // Ignore static or inactive particles
    callback(part, id);
  });
}
export function foreachDynamic(liquid: CLiquid, arr: TLiquidParticle[], callback: (particle: TLiquidParticle, particleid: number)=>void): void {
  arrayEach(arr, (part, id) => {
    if (part === null) return; // Ignore static or inactive particles
    callback(part, id);
  });
}
export function foreachIds(particles: TLiquidParticle[], pids: number[], callback: (particle: TLiquidParticle, particleid: number)=>void): void {
  arrayEach(pids, (pid) => callback(particles[pid], pid));
}
export function getNeighbors(store: TStore, part: TLiquidParticle): number[] {
  return store.spatialHash.getAroundCellsItems(part[P.X], part[P.Y], store.particles);
}
export function eachNeighbors(particles: TLiquidParticle[], neighbors: number[], cb: (neighborParticle: TLiquidParticle, neighborPid: number)=>void): void {
  arrayEach(neighbors, (pid) => cb(particles[pid], pid));
}
export function eachNeighborsOf(store: TStore, part: TLiquidParticle, cb: (neighborParticle: TLiquidParticle, neighborPid: number)=>void): void {
  eachNeighbors(store.particles, getNeighbors(store, part), cb);
}
export function eachSpring(springs: TSpringList, cb: (springKey: string, spring: TSpring)=>void): void {
  for (const [key, spring] of Object.entries(springs)) {
    cb(key, spring);
  }
}
