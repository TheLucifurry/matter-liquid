import { checkParticleIsStatic, checkRectContainsParticle, ParticleProps, particles } from './liquid';
import { partColors } from './render';
import { State } from './state';
import { arrayEach, checkBodyContainsPoint, getBodiesInRect, getParticlesInsideBodyIds, getRectWithPaddingsFromBounds, vectorDiv, vectorFromTwo, vectorLength, vectorLengthAdd, vectorMul, vectorMulVector, vectorNormal, vectorSubVector } from './utils';

const p0 = 10 // rest density
const k = 0.004 // stiffness
const kNear = 0.01 // stiffness near
const kSpring = 0.3 //
const sigma = 1; //
const beta = 1; // 0 - вязкая жидкость
const mu = .5; // friction, 0 - скольжение, 1 - цепкость

function foreachActive(activeRect: TRect, arr: TLiquidParticle[], callback: (particle: TLiquidParticle, particleid: number)=>void) {
  // @ts-ignore
  arrayEach(arr, (part, id)=>{
    if(checkParticleIsStatic(part) || !checkRectContainsParticle(activeRect, part)) return; // Ignore static or inactive particles
    callback(part, id);
  })
  // arr.forEach((part, id)=>{
  //   if(checkParticleIsStatic(part) || !checkRectContainsParticle(activeRect, part)) return; // Ignore static or inactive particles
  //   callback(part, id);
  // });
}
function foreachIds(pids: number[], callback: (particle: TLiquidParticle, particleid: number)=>void) {
  // @ts-ignore
  arrayEach(pids, (pid)=>{
    callback(particles[pid], pid);
  })
  // pids.forEach((pid)=>{
  //   callback(particles[pid], pid);
  // });
}
function getNeighbors(part: TLiquidParticle) {
  return State.spatialHash.getAroundCellsItems(part[ParticleProps.x], part[ParticleProps.y]);
}
function eachNeighbors(neighbors: number[], cb: (neighbParticle: TLiquidParticle)=>void ) {
  // @ts-ignore
  arrayEach(neighbors, (pid)=>{
    cb(particles[pid]);
  })
  // neighbors.forEach(pid=>{
  //   cb(particles[pid]);
  // });
}
function eachNeighborsOf(part: TLiquidParticle, cb: (neighbParticle: TLiquidParticle)=>void ) {
  eachNeighbors(getNeighbors(part), cb);
}
function _limitMoving(part: TLiquidParticle) {
  const limit = 4;
  part[ParticleProps.velX] = Math.min(Math.max(part[ParticleProps.velX], -limit), limit);
  part[ParticleProps.velY] = Math.min(Math.max(part[ParticleProps.velY], -limit), limit);
  // debugger
}
function limit(val: number) {
  const limi = .5;
  return Math.min(Math.max(val, -limi), limi);
}
function getR(a: TLiquidParticle, b: TLiquidParticle) {
  return vectorFromTwo([a[ParticleProps.x], a[ParticleProps.y]], [b[ParticleProps.x], b[ParticleProps.y]]);
}
function getVelDiff(a: TLiquidParticle, b: TLiquidParticle): [number, number] {
  return [a[ParticleProps.velX]-b[ParticleProps.velX], a[ParticleProps.velY]-b[ParticleProps.velY]];
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
function applyViscosity(cfg: TState, i: TLiquidParticle, dt: number) {
  eachNeighborsOf(i, j=>{
    // const copy = {iVel: [...i], jVel: [...j]};
    // let isAnomalInBegining = isAnomaly(i[ParticleProps.velX]) || isAnomaly(i[ParticleProps.velY]) || isAnomaly(j[ParticleProps.velX]) || isAnomaly(j[ParticleProps.velY]);
    // let isNaNInBegining = isNaN(i[ParticleProps.velX]) || isNaN(i[ParticleProps.velY]) || isNaN(j[ParticleProps.velX]) || isNaN(j[ParticleProps.velY]);
    const r = getR(i, j)
    const rNormal = vectorNormal(r);
    const q = vectorLength(vectorDiv(r, cfg.radius));
    if (q < 1) {
      const velDiff = getVelDiff(i, j);
      const u = vectorLength(vectorMulVector(rNormal, velDiff));
      if (u > 0) {
        // const halfI = vectorDiv(vectorMul(rNormal, dt * (1 - q) * (sigma * u + (beta * u)**2 )), 2);
        const halfI = vectorDiv(vectorMul(rNormal, dt * (1 - q) * (sigma * u + (beta * u) )), 2);
        // halfI[0] = limit(halfI[0]);
        // halfI[1] = limit(halfI[1]);
        addVel(i, [-halfI[0], -halfI[1]]); // vi -= I/2;
        addVel(j, halfI); // vj += I/2;
        // if(!isAnomalInBegining && isAnomaly(i[ParticleProps.velX]) || isAnomaly(i[ParticleProps.velX])){
        //   console.dir({isAnomalInBegining,copy,r,rNormal,q,velDiff,u,halfI});
        //   console.dir({
        //     copy,
        //     q, sigma, u, beta,
        //   });
        //   // debugger
        // }
        // if(!isAnomalInBegining && isAnomaly(i[ParticleProps.velX])){
        //   console.dir({isAnomalInBegining,copy,r,rNormal,q,velDiff,u,halfI});
        //   debugger
        // }
        // if(!isNaNInBegining && (isNaN(i[ParticleProps.velX]) || isNaN(i[ParticleProps.velY]) || isNaN(j[ParticleProps.velX]) || isNaN(j[ParticleProps.velY]))){
        //   console.dir({copy,r,rNormal,q,velDiff,u,halfI});
        //   debugger
        // }
      }
    }
  });
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
function applySpringDisplacements(cfg: TState, i: TLiquidParticle, dt: number) {
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
function doubleDensityRelaxation(cfg: TState, i: TLiquidParticle, dt: number) {
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
function computeI(part: TLiquidParticle, body: Matter.Body) {
  const bodyVelVector: TVector = [body.velocity.x, body.velocity.y];
  const v_ = vectorSubVector([part[ParticleProps.velX], part[ParticleProps.velY]], bodyVelVector);  // vi − vp
  const n_ = vectorNormal(bodyVelVector);
  const vNormal = vectorMulVector(vectorMulVector(v_, n_), n_); // = (v¯ * nˆ)nˆ
  const vTangent = vectorSubVector(v_, vNormal); // v¯ − v¯normal
  return vectorSubVector(vNormal, vectorMul(vTangent, mu)); // v¯normal - µ * v¯tangent
}

function resolveCollisions(particles: TLiquidParticle[], activeZone: TRect, updatablePids: number[]) {
  const bodies = getBodiesInRect(State.world.bodies, activeZone);
  const originalBodiesData: TOriginalBodyData[] = [];
  const bodiesContainsParticleIds: number[][] = [];
  bodies.forEach((body, ix)=>{
    // originalBodiesData[ix] = {...body.position, a: body.angle} // save original body position and orientation
    // advance body using V and ω
    // clear force and torque buffers
    const particlesInBodyIds = getParticlesInsideBodyIds(particles, body, State.spatialHash, updatablePids);
    bodiesContainsParticleIds[ix] = particlesInBodyIds;
    // foreachIds(particlesInBodyIds, function(part) { // foreach particle inside the body
    //   const I = computeI(part, body); // compute collision impulse I
    //   // add I contribution to force and torque buffers
    // })
  })
  // bodies.forEach(body=>{  // foreach body
  //   // modify V with force and ω with torque
  //   // advance from original position using V and ω
  // })
  // resolve collisions and contacts between bodies
  bodiesContainsParticleIds.forEach((particlesInBodyIds, bodyid)=>{
    const body = bodies[bodyid];
    foreachIds(particlesInBodyIds, function(part) { // foreach particle inside the body
      const I = computeI(part, body); // compute collision impulse I
      part[ParticleProps.x] -= I[0]; // apply I to the particle
      part[ParticleProps.y] -= I[1];
      if(checkBodyContainsPoint(body, part[ParticleProps.x], part[ParticleProps.y])){
        // extract the particle if still inside the body
        // part[ParticleProps.x] += -part[ParticleProps.velX]*1.5;
        // part[ParticleProps.y] += -part[ParticleProps.velY]*1.5;
      }
    })
  })
}

// DEBUG
function isAnomaly(vari: number) {
  return !isFinite(vari) || Math.abs(vari) >= 2.1e+100;
}
function checkAnomaly(part: TLiquidParticle, caption: string) {
  if(isAnomaly(part[ParticleProps.x]) || isAnomaly(part[ParticleProps.y])){
    console.log(`[ ${caption} ] position is anomal`);
  }
  if(isAnomaly(part[ParticleProps.velX]) || isAnomaly(part[ParticleProps.velY])){
    console.log(`[ ${caption} ] velocity is anomal`);
  }
}

// @ts-ignore
window.TEST_MOUSE_MOVE = function(mouseConstraint: Matter.MouseConstraint) {
  var mouse = mouseConstraint.mouse,
    constraint = mouseConstraint.constraint,
    body = mouseConstraint.body,
    point = mouse.position;
  if(!body)return ;
const partturjherIds = particles.map((v, ix)=>ix);
  body.render.fillStyle = '#0f5'
  // @ts-ignore
  const partIds = getParticlesInsideBodyIds(particles, body, spatialHash, partturjherIds);
  // debugger
  partIds.forEach(pid=>{
    partColors.set(pid, '#0af')
  })
};

function addParticlePositionByVel(part: TLiquidParticle, deltaTime: number) {
  part[ParticleProps.x] += deltaTime * part[ParticleProps.velX];
  part[ParticleProps.y] += deltaTime * part[ParticleProps.velY];
}

export function update(dt: number) {
  const activeRect = getRectWithPaddingsFromBounds(State.render.bounds, State.activeBoundsPadding);
  const updatablePids: number[] = [];

  foreachActive(activeRect, particles, function(part, pid) {
    updatablePids.push(pid)
    // vi ← vi + ∆tg
    part[ParticleProps.velX] += dt * State.gravity[0];
    part[ParticleProps.velY] += dt * State.gravity[1];
  });
  foreachIds(updatablePids, function(part) {
    applyViscosity(State, part, dt);
  });
  foreachIds(updatablePids, function(part) {
    _limitMoving(part); // Custom
    // xi^prev ← xi
    savePrevPosition(part);
    // xi ← xi + ∆tvi
    addParticlePositionByVel(part, dt)
  });
  // adjustSprings();
  // foreachIds(updatablePids, function(part) {
  //   applySpringDisplacements(Config, part, dt);
  // });
  // foreachIds(updatablePids, function(part) {
  //   doubleDensityRelaxation(part, dt);
  // });
  resolveCollisions(particles, activeRect, updatablePids);
  foreachIds(updatablePids, function(part) {
    // vi ← (xi − xi^prev )/∆t
    part[ParticleProps.velX] = (part[ParticleProps.x] - part[ParticleProps.prevX]) / dt;
    part[ParticleProps.velY] = (part[ParticleProps.y] - part[ParticleProps.prevY]) / dt;
  });
  // const [cellX, cellY] = updateParticlePool()
  foreachIds(updatablePids, function(part, pid) {
    // checkAnomaly(part, 'all')
    State.spatialHash.update(pid, part[ParticleProps.x], part[ParticleProps.y]);
  });
  // console.log(`Ignored particles count: ${particles.length - updatedParticleIds.length}`);
  // const p = particles[100];
  // console.log(`Particle: vx=${p[ParticleProps.velX]} vy=${p[ParticleProps.velY]}`);
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