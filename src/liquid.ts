import {
  checkPointInActiveZone, checkPointInRenderZone
} from './zones';
// function arrayEach(array, iteratee) { // From lodash
//   let index = -1
//   const length = array.length

//   while (++index < length) {
//     if (iteratee(array[index], index, array) === false) {
//       break
//     }
//   }
//   return array
// }

type TLiquidProps = {
  isStatic?: boolean
  color?: string
  // smoothRange: number
  // rigidity: number
};
type TLiquidParticle = [ x: number, y: number, px: number, py: number, vx: number, vy: number];

export const PropsKeys = { x: 0, y: 1, prevX: 2, prevY: 3, velX:4, velY: 5 };
export const liquids:  TLiquidProps[] = [];
export const particles: TLiquidParticle[][] = [];
export const disabledPartsSet: Set<number> = new Set();
// export const colors: string[] = [];

export function setStaticStatus(liquidid: number, isStatic = true) {
  liquids[liquidid].isStatic = !!isStatic;
}
export function setColor(liquidid: number, color = '#000') {
  liquids[liquidid].color = color;
}

export function createLiquid(props: TLiquidProps) {
  const lid = liquids.length;
  liquids[lid] = props;
  particles[lid] = [];
  setStaticStatus(lid, props.isStatic || false);
  setColor(lid, props.color);
  return lid;
}

export function spawnLiquid(liquidid: number, x: number, y: number) {
  const partPool = particles[liquidid];
  partPool[partPool.length] = [ x, y, x, y, 0, 0];
}

export function checkLiquidIsStatic(liquidid: number) {
  return liquids[liquidid].isStatic;
}

export function fillZoneByLiquid(zoneX: number, zoneY: number, zoneWidth: number, zoneHeight: number, liquidid: number) {
  const partSpace = 20;
  const columns = Math.max(1, Math.trunc((zoneX + zoneWidth) / partSpace));
  const rows = Math.max(1, Math.trunc((zoneY + zoneHeight) / partSpace));
  for (let c = 0; c < columns; c++) {
    for (let r = 0; r < rows; r++) {
      spawnLiquid(liquidid, zoneX+c*partSpace, zoneY+r*partSpace);
    }
  }
}

export function checkParticleInActiveZone(part: TLiquidParticle) {
  return checkPointInActiveZone(part[PropsKeys.x], part[PropsKeys.y]);
}
export function checkParticleInRenerZone(part: TLiquidParticle) {
  return checkPointInRenderZone(part[PropsKeys.x], part[PropsKeys.y]);
}


function savePrevPosition(part: TLiquidParticle) {
  part[PropsKeys.prevX] = part[PropsKeys.x];
  part[PropsKeys.prevY] = part[PropsKeys.y];
}


// export function updateParticle(part: TLiquidParticle) {
//   // Save prev position
//   saveCurrentPosition(part);
//   // Gravity
//   applyGravitation(part);

//   // Алгоритм №2 Релаксация двойной плотности
//   let p = 0;
//   let pAround = 0;
//     // вычисляем плотность и близкую к плотности

// }

function foreach(arr: TLiquidParticle[][], callback: (liquidid: number, particle: TLiquidParticle )=>void) {
  arr.forEach((parts, lid)=>{
    if(checkLiquidIsStatic(lid)) return; // Ignore static particles
    parts.forEach(part=>{
      if(!checkParticleInActiveZone(part)) return; // Ignore inactive particles
      callback(lid, part);
    });
  });
}
function applyViscosity() {
}
function adjustSprings() {
}
function applySpringDisplacements() {
}
function doubleDensityRelaxation() {
  // Алгоритм №2 Релаксация двойной плотности
  let p = 0;
  let pAround = 0;
    // вычисляем плотность и близкую к плотности
}
function resolveCollisions() {
}

const Gravity = [1, 0];

export function updateParticles() {
  foreach(particles, function(lid, part) {
    // vi ← vi + ∆tg
    part[PropsKeys.velX] += Gravity[0];
    part[PropsKeys.velX] += Gravity[1];
  });
  applyViscosity();
  foreach(particles, function(lid, part) {
    savePrevPosition(part); // xi^prev ← xi
    // xi ← xi + ∆tvi
  });
  adjustSprings();
  applySpringDisplacements();
  doubleDensityRelaxation();
  resolveCollisions();
  foreach(particles, function(lid, part) {
    // vi ← (xi − xi^prev )/∆t
  });
}

/*
  foreach particle i
    vi ← vi + ∆tg             // применяем гравитацию
  applyViscosity            // (Раздел 5.3 ) изменяем скорости парными импульсами вязкости
  foreach particle i
    xi^prev ← xi              // сохраняем предыдущую позицию
    xi ← xi +∆tvi             // переход к предсказанной позиции
  adjustSprings             // (Раздел 5.2 ) добавляем и удаляем пружины, изменяем длину упора
  applySpringDisplacements  // (Раздел 5.1 ) изменяем позиции согласно пружинам,
  doubleDensityRelaxation   // (Раздел 4 ) релаксация двойной плотности и столкновения
  resolveCollisions         // (Раздел 6 )
  foreach particle i
    vi ← (xi −xi^prev )/∆t    // использовать предыдущую позицию для вычисления следующей скорости
*/