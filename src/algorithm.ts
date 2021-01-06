import { Config } from './config';
import { checkParticleInActiveZone, checkParticleIsStatic, ParticleProps, particles, spatialHash, TLiquidParticle } from './liquid';
import { vectorLengthAdd } from './utils';

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
function getR(a: TLiquidParticle, b: TLiquidParticle) {
  return Math.sqrt(((b[ParticleProps.x] - a[ParticleProps.x]) ** 2) + ((b[ParticleProps.y] - a[ParticleProps.y]) ** 2));
}
function getVel(a: TLiquidParticle) {
  return Math.sqrt((a[ParticleProps.velX] ** 2) + (a[ParticleProps.velY] ** 2));
}
function addVel(part: TLiquidParticle, num: number) {
  const vecAdded = vectorLengthAdd([part[ParticleProps.velX], part[ParticleProps.velY]], num)
  part[ParticleProps.velX] = vecAdded[0];
  part[ParticleProps.velY] = vecAdded[1];
}

function savePrevPosition(part: TLiquidParticle) {
  part[ParticleProps.prevX] = part[ParticleProps.x];
  part[ParticleProps.prevY] = part[ParticleProps.y];
}
function applyViscosity(cfg: typeof Config, i: TLiquidParticle, dt: number) {
  eachNeighborsOf(i, j=>{
    const r = getR(i, j)
    const q = r/cfg.h;
    if (q < 1) {
      const u = (getVel(i) - getVel(j)) ** r;
      if (u > 0) {
        const I = dt * (1 - q) * (sigma * u + (beta * u)**2 )**r;
        addVel(i, -I/2); // vi -= I/2;
        addVel(j, I/2); // vj += I/2;
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
  // const D = dt**2 * kSpring * (1-L/h) * (L - r) ** r;
  eachNeighborsOf(i, j=>{
    // ?
      const L = 23321423;
    // ?
    const r = getR(i, j);
    const D = dt**2 * kSpring * (1-L/cfg.h) * (L - r) ** r;
    // ?
      // xi -= D/2;
      // xj += D/2;
    // ?
  });
}
function doubleDensityRelaxation(cfg: typeof Config, i: TLiquidParticle, dt: number) {
  // Алгоритм №2 Релаксация двойной плотности
  let p = 0;
  let pNear = 0;
  const ngbrs = getNeighbors(i);
  eachNeighbors(ngbrs, j=>{
    let q = getR(i, j) / cfg.h;
    if(q < 1){
      p += (1-q)**2;
      pNear += (1-q)**3;
    }
  });
  let P = k * (p - p0);
  let PNear = kNear * pNear;
  let dx = 0;

  eachNeighbors(ngbrs, j=>{
    const r = getR(i, j);
    let q = r / cfg.h;
    if(q < 1){
      const D = dt**2 * (P*(1 - q) + PNear * (1 - q)**2) ** r
      // xj += D/2;
      // ?
        j[ParticleProps.x] += D/2;
        j[ParticleProps.y] += D/2;
      // ?
      dx -= D/2;
    }
  });
  // xi += dx;
  // ?
    i[ParticleProps.x] += dx;
    i[ParticleProps.y] += dx;
  // ?
}
function resolveCollisions() {
}


export function update(dt: number) {
  const updatedParticleIds: number[] = [];
  foreach(particles, function(part, pid) {
    updatedParticleIds.push(pid)
    // vi ← vi + ∆tg
    part[ParticleProps.velX] += dt * Config.g[0];
    part[ParticleProps.velY] += dt * Config.g[1];
  });
  foreach(particles, function(part) {
    applyViscosity(Config, part, dt);
  });
  foreach(particles, function(part) {
    // xi^prev ← xi
    savePrevPosition(part);
    // xi ← xi + ∆tvi
    part[ParticleProps.x] += dt * part[ParticleProps.velX];
    part[ParticleProps.y] += dt * part[ParticleProps.velY];
  });
  // adjustSprings();
  // foreach(particles, function(part) {
  //   applySpringDisplacements(Config, part, dt);
  // });
  // foreach(particles, function(part) {
  //   doubleDensityRelaxation(part, dt);
  // });
  // resolveCollisions();
  foreach(particles, function(part) {
    // vi ← (xi − xi^prev )/∆t
    part[ParticleProps.velX] = (part[ParticleProps.x] - part[ParticleProps.prevX]) / dt;
    part[ParticleProps.velY] = (part[ParticleProps.y] - part[ParticleProps.prevY]) / dt;
  });
  // const [cellX, cellY] = updateParticlePool()
  updatedParticleIds.forEach(function(pid) {
    const part = particles[pid];
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