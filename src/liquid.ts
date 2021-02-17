import { Store } from './state';
import { checkPointInRect } from './utils';

const LiquidPropDefaults: Required<TLiquidProps> = {
  isStatic: false,
  color: '#fff',
  plasticity: 0.3,
  // stiffness: 0.004,
}

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
  particles[pid] = [ x, y, x-1, y-1, 0, 0, liquidid];
  Store.spatialHash.insert(pid, x, y);
}

export function fillZoneByLiquid(zoneX: number, zoneY: number, zoneWidth: number, zoneHeight: number, liquidid: number, interval: number = Store.radius) {
  const columns = Math.max(1, Math.trunc(zoneWidth / interval));
  const rows = Math.max(1, Math.trunc(zoneHeight / interval));
  for (let c = 0; c < columns; c++) {
    for (let r = 0; r < rows; r++) {
      spawnLiquid(liquidid, zoneX+c*interval, zoneY+r*interval);
    }
  }
}

export function checkParticleIsStatic(particle: TLiquidParticle) {
  return liquids[particle[ParticleProps.liquidid]].isStatic;
}
export function checkRectContainsParticle(rect: TRect, particle: TLiquidParticle) {
  return checkPointInRect(particle[ParticleProps.x], particle[ParticleProps.y], ...rect);
}

export function init(worldWidth: number, cellSize: number) {
  Store.spatialHash.init(worldWidth, Store.radius || cellSize);
  //@ts-ignore
  window.spatialHash = Store.spatialHash;
  //@ts-ignore
  window.particles = particles;
}
