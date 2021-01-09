import { Config } from './config';
import { checkParticleInActiveZone, checkParticleIsStatic, ParticleProps, particles, spatialHash, TLiquidParticle } from './liquid';
import { vectorDiv, vectorFromTwo, vectorLength, vectorLengthAdd, vectorMul, vectorNormal } from './utils';

const p0 = 10 // rest density
const k = 0.004 // stiffness
const kNear = 0.01 // stiffness near
const kSpring = 0.3 //
const sigma = 1; //
const beta = 0.1; // 0 - вязкая жидкость

function foreach(arr: TLiquidParticle[], callback: (particle: TLiquidParticle, particleid: number)=>void) {
  arr.forEach((part, id)=>{
    if(checkParticleIsStatic(part) || !checkParticleInActiveZone(part)) return; // Ignore static or inactive particles
    callback(part, id);
  });
}
function foreachIds(pids: number[], callback: (particle: TLiquidParticle, particleid: number)=>void) {
  pids.forEach((pid)=>{
    callback(particles[pid], pid);
  });
}
function getNeighbors(part: TLiquidParticle) {
  return spatialHash.getAroundCellsItems(part[ParticleProps.x], part[ParticleProps.y]);
}
function eachNeighbors(neighbors: number[], cb: (neighbParticle: TLiquidParticle)=>void ) {
  neighbors.forEach(pid=>{
    cb(particles[pid]);
  });
}
function eachNeighborsOf(part: TLiquidParticle, cb: (neighbParticle: TLiquidParticle)=>void ) {
  eachNeighbors(getNeighbors(part), cb);
}
function limitMoving(part: TLiquidParticle) {
  const limit = 2;
  const dX = Math.abs(part[ParticleProps.velX]);
  const dY = Math.abs(part[ParticleProps.velY]);
  part[ParticleProps.velX] = Math.min(dX, limit) * Math.sign(part[ParticleProps.velX]);
  part[ParticleProps.velY] = Math.min(dY, limit) * Math.sign(part[ParticleProps.velY]);
  // debugger
}
function getR(a: TLiquidParticle, b: TLiquidParticle) {
  return vectorFromTwo([a[ParticleProps.x], a[ParticleProps.y]], [b[ParticleProps.x], b[ParticleProps.y]]);
}
function getVel(a: TLiquidParticle) {
  return Math.hypot(a[ParticleProps.velX], a[ParticleProps.velY]);
}
function addVel(part: TLiquidParticle, vec: [number, number]) {
  part[ParticleProps.velX] += vec[0];
  part[ParticleProps.velY] += vec[1];
}
function addPos(part: TLiquidParticle, num: number) {
  const vecAdded = vectorLengthAdd([part[ParticleProps.x], part[ParticleProps.y]], num)
  part[ParticleProps.x] = vecAdded[0];
  part[ParticleProps.y] = vecAdded[1];
}

function savePrevPosition(part: TLiquidParticle) {
  part[ParticleProps.prevX] = part[ParticleProps.x];
  part[ParticleProps.prevY] = part[ParticleProps.y];
}
function applyViscosity(cfg: typeof Config, i: TLiquidParticle, dt: number) {
  eachNeighborsOf(i, j=>{
    const r = getR(i, j)
    const rNormal = vectorNormal(r);
    const q = vectorLength(vectorDiv(r, cfg.h));
    if (q < 1) {
      const u = vectorLength(vectorMul(r, getVel(i) - getVel(j)));
      if (u > 0) {
        const I = vectorDiv(vectorMul(rNormal, dt * (1 - q) * (sigma * u + (beta * u)**2 )), 2);
        addVel(i, [-I[0], -I[1]]); // vi -= I/2;
        addVel(j, I); // vj += I/2;
        // if(isAnomaly(i[ParticleProps.velX])){
        //   debugger
        // }
      }
    }
  });
/*
  foreach neighbor pair i j, (i < j)
    q ← ri j/h
    if q < 1
      // inward radial velocity
      u ← (vi −vj)· rˆi j
      if u > 0
        // linear and quadratic impulses
        I ← ∆t(1−q)(σu+βu^2)rˆi j
        vi ← vi −I/2
        vj ← vj +I/2
*/
}
function adjustSprings() {

/*
  foreach neighbor pair i j, (i < j)
    q ← ri j/h
      if q < 1
        if there is no spring i j
          add spring i j with rest length h
        // tolerable deformation = yield ratio * rest length
        d ← γ Li j
        if ri j > L+d // stretch
          Li j ← Li j +∆t α(ri j −L−d)
        else if ri j < L−d // compress
          Li j ← Li j −∆t α(L−d −ri j)
  foreach spring i j
    if Li j > h
      remove spring i j
*/
}
function applySpringDisplacements(cfg: typeof Config, i: TLiquidParticle, dt: number) {
  // const L = 23321423;
  // const r = getR(i, j);
  // const D = dt**2 * kSpring * (1-L/h) * (L - r) * r;
  eachNeighborsOf(i, j=>{
    // ?
      const L = 1;
    // ?
    // const r = getR(i, j);
    // const D = dt**2 * kSpring * (1-L/cfg.h) * (L - r) * r;
    // // ?
    //   addPos(i, -D/2) // xi -= D/2;
    //   addPos(j, D/2) // xj += D/2;
    // ?
  });
}
function doubleDensityRelaxation(cfg: typeof Config, i: TLiquidParticle, dt: number) {
  // Алгоритм №2 Релаксация двойной плотности
  // let p = 0;
  // let pNear = 0;
  // const ngbrs = getNeighbors(i);
  // eachNeighbors(ngbrs, j=>{
  //   let q = getR(i, j) / cfg.h;
  //   if(q < 1){
  //     p += (1-q)**2;
  //     pNear += (1-q)**3;
  //   }
  // });
  // let P = k * (p - p0);
  // let PNear = kNear * pNear;
  // let dx = 0;

  // eachNeighbors(ngbrs, j=>{
  //   const r = getR(i, j);
  //   let q = r / cfg.h;
  //   if(q < 1){
  //     const D = dt**2 * (P*(1 - q) + PNear * (1 - q)**2) * r
  //     // xj += D/2;
  //     // ?
  //       j[ParticleProps.x] += D/2;
  //       j[ParticleProps.y] += D/2;
  //     // ?
  //     dx -= D/2;
  //   }
  // });
  // // xi += dx;
  // // ?
  //   i[ParticleProps.x] += dx;
  //   i[ParticleProps.y] += dx;
  // // ?
}
function resolveCollisions() {
}
export function insertPartToSpace(part: TLiquidParticle, pid: number) {
  spatialHash.update(pid, part[ParticleProps.x], part[ParticleProps.y]);
}

// DEBUG
function isAnomaly(vari: number) {
  return isNaN(vari) || vari === Number.POSITIVE_INFINITY || vari === Number.NEGATIVE_INFINITY;
}
function checkAnomaly(part: TLiquidParticle, caption: string) {
  if(isAnomaly(part[ParticleProps.x]) || isAnomaly(part[ParticleProps.y])){
    console.log(`[ ${caption} ] position is anomal`);
  }
  if(isAnomaly(part[ParticleProps.velX]) || isAnomaly(part[ParticleProps.velY])){
    console.log(`[ ${caption} ] velocity is anomal`);
  }
}

export function update(dt: number) {
  const updatablePids: number[] = [];
  foreach(particles, function(part, pid) {
    updatablePids.push(pid)
    // vi ← vi + ∆tg
    part[ParticleProps.velX] += dt * Config.g[0];
    part[ParticleProps.velY] += dt * Config.g[1];
    // console.log(`part: vX-${part[ParticleProps.velX]} vY-${part[ParticleProps.velY]}`);
  });
  foreachIds(updatablePids, function(part) {
    applyViscosity(Config, part, dt);
  });
  foreachIds(updatablePids, function(part) {
    limitMoving(part); // Custom
    // xi^prev ← xi
    savePrevPosition(part);
    // xi ← xi + ∆tvi
    part[ParticleProps.x] += dt * part[ParticleProps.velX];
    part[ParticleProps.y] += dt * part[ParticleProps.velY];
  });
  // adjustSprings();
  // foreachIds(updatablePids, function(part) {
  //   applySpringDisplacements(Config, part, dt);
  // });
  // foreachIds(updatablePids, function(part) {
  //   doubleDensityRelaxation(part, dt);
  // });
  // resolveCollisions();
  foreachIds(updatablePids, function(part) {
    // vi ← (xi − xi^prev )/∆t
    part[ParticleProps.velX] = (part[ParticleProps.x] - part[ParticleProps.prevX]) / dt;
    part[ParticleProps.velY] = (part[ParticleProps.y] - part[ParticleProps.prevY]) / dt;
  });
  // const [cellX, cellY] = updateParticlePool()
  foreachIds(updatablePids, function(part, pid) {
    // checkAnomaly(part, 'all')
    spatialHash.update(pid, part[ParticleProps.x], part[ParticleProps.y]);
  });
  // console.log(`Ignored particles count: ${particles.length - updatedParticleIds.length}`);
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