import { insertPartToSpace } from './algorithm';
import { Config } from './config';
import SpatialHash from './spatialHash';
import {
  checkPointInActiveZone, checkPointInRenderZone
} from './zones';

type TLiquidProps = {
  isStatic?: boolean
  color?: string
  plasticity?: number // a
  // stiffness?: number // k
};
export type TLiquidParticle = [ x: number, y: number, px: number, py: number, vx: number, vy: number, lid: number ];

const LiquidPropDefaults: Required<TLiquidProps> = {
  isStatic: false,
  color: '#fff',
  plasticity: 0.3,
  // stiffness: 0.004,
}

export let spatialHash: SpatialHash;
export const ParticleProps = { x: 0, y: 1, prevX: 2, prevY: 3, velX:4, velY: 5, liquidid: 6 };
export const liquids:  Required<TLiquidProps>[] = [];
export const particles: TLiquidParticle[] = [];
export const disabledPartsSet: Set<number> = new Set();

export function createLiquid(props: TLiquidProps) {
  const lid = liquids.length;
  liquids[lid] = { ...LiquidPropDefaults, ...props };
  return lid;
}

export function spawnLiquid(liquidid: number, x: number, y: number) {
  const pid = particles.length;
  particles[pid] = [ x, y, Infinity, Infinity, 0, 0, liquidid];
  if(liquids[liquidid].isStatic){
    insertPartToSpace(particles[pid], pid);
  }
}

export function fillZoneByLiquid(zoneX: number, zoneY: number, zoneWidth: number, zoneHeight: number, liquidid: number) {
  const partSpace = 20;
  const columns = Math.max(1, Math.trunc(zoneWidth / partSpace));
  const rows = Math.max(1, Math.trunc(zoneHeight / partSpace));
  for (let c = 0; c < columns; c++) {
    for (let r = 0; r < rows; r++) {
      spawnLiquid(liquidid, zoneX+c*partSpace, zoneY+r*partSpace);
    }
  }
}

export function checkParticleIsStatic(particle: TLiquidParticle) {
  return liquids[particle[ParticleProps.liquidid]].isStatic;
}
export function checkParticleInActiveZone(part: TLiquidParticle) {
  return checkPointInActiveZone(part[ParticleProps.x], part[ParticleProps.y]);
}
export function checkParticleInRenerZone(part: TLiquidParticle) {
  return checkPointInRenderZone(part[ParticleProps.x], part[ParticleProps.y]);
}

export function init(worldWidth: number, cellSize: number) {
  spatialHash = new SpatialHash(worldWidth, Config.h || cellSize);
  //@ts-ignore
  window.spatialHash = spatialHash;
  //@ts-ignore
  window.particles = particles;
}
