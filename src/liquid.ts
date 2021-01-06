import { Config } from './config';
import SpatialHash from './spatialHash';
import { drawAtom } from './utils';
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
export const PropsKeys = { x: 0, y: 1, prevX: 2, prevY: 3, velX:4, velY: 5, liquidid: 6 };
export const liquids:  Required<TLiquidProps>[] = [];
export const particles: TLiquidParticle[] = [];
export const disabledPartsSet: Set<number> = new Set();

export function createLiquid(props: TLiquidProps) {
  const lid = liquids.length;
  liquids[lid] = { ...LiquidPropDefaults, ...props };
  return lid;
}

export function spawnLiquid(liquidid: number, x: number, y: number) {
  particles[particles.length] = [ x, y, Infinity, Infinity, 0, 0, liquidid];
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
  return liquids[particle[PropsKeys.liquidid]].isStatic;
}
export function checkParticleInActiveZone(part: TLiquidParticle) {
  return checkPointInActiveZone(part[PropsKeys.x], part[PropsKeys.y]);
}
export function checkParticleInRenerZone(part: TLiquidParticle) {
  return checkPointInRenderZone(part[PropsKeys.x], part[PropsKeys.y]);
}

export function init(worldWidth: number, cellSize: number) {
  spatialHash = new SpatialHash(worldWidth, Config.h || cellSize);
  //@ts-ignore
  window.spatialHash = spatialHash;
}

// Dev
const colors: string[] = [];
for (let i = 0; i < 100; i++) {
  colors.push('#'+Math.floor(Math.random()*16777215).toString(16));
}

export function renderGrid(ctx: CanvasRenderingContext2D) {
  const cellSize = spatialHash.cellSize;

  ctx.textAlign = 'center';
  let i = 0;
  for (let [cellid, cell] of spatialHash.getIterableHash()) {
    const [cellX, cellY] = spatialHash.getCoordsFromCellid(cellid);
    const fX = cellX * cellSize;
    const fY = cellY * cellSize;
    const csh = cellSize / 2;

    if(cell.length !== 0){
      ctx.strokeStyle = 'green';
      ctx.fillStyle = 'white';
      ctx.fillText('' + cell.length, fX+csh, fY+csh);
      cell.forEach(pid=>{
        const part = particles[pid];
        drawAtom(ctx, part[PropsKeys.x], part[PropsKeys.y], colors[i]);
      })
    }else{
      ctx.strokeStyle = 'gray';
    }
    ctx.strokeRect(fX, fY, cellSize, cellSize);
    i++;
  }
}