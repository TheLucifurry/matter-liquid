import { PARTICLE_PROPS } from '../constants';
import { checkPointInRect } from './utils';

export function arrayEach(array: any[], iteratee: (element: any, index: number)=>void) { // From lodash
  let index = -1
  const length = array.length
  while (++index < length) iteratee(array[index], index);
}
export function foreachActive(liquid: CLiquid, activeRect: TRect, arr: TLiquidParticle[], callback: (particle: TLiquidParticle, particleid: number)=>void) {
  arrayEach(arr, (part, id)=>{
    if(part === null  || (activeRect && !checkPointInRect(part[PARTICLE_PROPS.X], part[PARTICLE_PROPS.Y], ...activeRect))) return; // Ignore static or inactive particles
    callback(part, id);
  })
}
export function foreachDynamic(liquid: CLiquid, arr: TLiquidParticle[], callback: (particle: TLiquidParticle, particleid: number)=>void) {
  arrayEach(arr, (part, id)=>{
    if(part === null) return; // Ignore static or inactive particles
    callback(part, id);
  })
}
export function foreachIds(particles: TLiquidParticle[], pids: number[], callback: (particle: TLiquidParticle, particleid: number)=>void) {
  arrayEach(pids, (pid)=>callback(particles[pid], pid));
}
export function getNeighbors(store: TStore, part: TLiquidParticle) {
  // const Math.sqrt((x1-x0)*(x1-x0) + (y1-y0)*(y1-y0)) < r
  // const x = part[PARTICLE_PROPS.X], y = part[PARTICLE_PROPS.Y];
  return store.spatialHash.getAroundCellsItems(part[PARTICLE_PROPS.X], part[PARTICLE_PROPS.Y], store.particles)
    // .filter(neighborPid=>{
    //   const nPart = store.particles[neighborPid];
    //   const nx = nPart[PARTICLE_PROPS.X], ny = nPart[PARTICLE_PROPS.Y];
    //   return pointInCircle(nx, ny, x, y, store.radius);
    // });
}
export function eachNeighbors(particles: TLiquidParticle[], neighbors: number[], cb: (neighborParticle: TLiquidParticle, neighborPid: number)=>void ) {
  arrayEach(neighbors, (pid)=>cb(particles[pid], pid));
}
export function eachNeighborsOf(store: TStore, part: TLiquidParticle, cb: (neighborParticle: TLiquidParticle, neighborPid: number)=>void ) {
  eachNeighbors(store.particles, getNeighbors(store, part), cb);
}
export function eachSpring(springs: TSpringList, cb: (springKey: string, spring: TSpring)=>void) {
  for (let [key, value] of Object.entries(springs)) {
    cb(key, springs[key])
  }
}