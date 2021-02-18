import Matter from 'matter-js';
import { PARTICLE_PROPS } from './enums';
import { arrayEach, checkBodyContainsPoint, getBodiesInRect, getParticlesInsideBodyIds, getRectWithPaddingsFromBounds, vectorDiv, vectorFromTwo, vectorLength, vectorLengthAdd, vectorMul, vectorMulVector, vectorNormal, vectorSubVector } from './utils';

const p0 = 10 // rest density
const k = 0.004 // stiffness
const kNear = 0.01 // stiffness near
const kSpring = 0.3 //
const sigma = 1; //
const beta = 1; // 0 - вязкая жидкость
const mu = .5; // friction, 0 - скольжение, 1 - цепкость

function foreachActive(liquid: CLiquid, activeRect: TRect, arr: TLiquidParticle[], callback: (particle: TLiquidParticle, particleid: number)=>void) {
  arrayEach(arr, (part, id)=>{
    if(liquid.checkParticleIsStatic(part) || !liquid.checkRectContainsParticle(activeRect, part)) return; // Ignore static or inactive particles
    callback(part, id);
  })
}
function foreachIds(particles: TLiquidParticle[], pids: number[], callback: (particle: TLiquidParticle, particleid: number)=>void) {
  arrayEach(pids, (pid)=>{
    callback(particles[pid], pid);
  })
}
function getNeighbors(store: TStore, part: TLiquidParticle) {
  return store.spatialHash.getAroundCellsItems(part[PARTICLE_PROPS.X], part[PARTICLE_PROPS.Y]);
}
function eachNeighbors(particles: TLiquidParticle[], neighbors: number[], cb: (neighbParticle: TLiquidParticle)=>void ) {
  arrayEach(neighbors, (pid)=>{
    cb(particles[pid]);
  })
}
function eachNeighborsOf(store: TStore, part: TLiquidParticle, cb: (neighbParticle: TLiquidParticle)=>void ) {
  eachNeighbors(store.particles, getNeighbors(store, part), cb);
}
function getR(a: TLiquidParticle, b: TLiquidParticle) {
  return vectorFromTwo([a[PARTICLE_PROPS.X], a[PARTICLE_PROPS.Y]], [b[PARTICLE_PROPS.X], b[PARTICLE_PROPS.Y]]);
}
function computeI(part: TLiquidParticle, body: Matter.Body) {
  const bodyVelVector: TVector = [body.velocity.x, body.velocity.y];
  const v_ = vectorSubVector([part[PARTICLE_PROPS.VEL_X], part[PARTICLE_PROPS.VEL_Y]], bodyVelVector);  // vi − vp
  const n_ = vectorNormal(bodyVelVector);
  const vNormal = vectorMulVector(vectorMulVector(v_, n_), n_); // = (v¯ * nˆ)nˆ
  const vTangent = vectorSubVector(v_, vNormal); // v¯ − v¯normal
  return vectorSubVector(vNormal, vectorMul(vTangent, mu)); // v¯normal - µ * v¯tangent
}
function getVelDiff(a: TLiquidParticle, b: TLiquidParticle): [number, number] {
  return [a[PARTICLE_PROPS.VEL_X]-b[PARTICLE_PROPS.VEL_X], a[PARTICLE_PROPS.VEL_Y]-b[PARTICLE_PROPS.VEL_Y]];
}
function addVel(part: TLiquidParticle, vec: [number, number]) {
  part[PARTICLE_PROPS.VEL_X] += vec[0];
  part[PARTICLE_PROPS.VEL_Y] += vec[1];
}
function addPos(part: TLiquidParticle, num: number) {
  const vecAdded = vectorLengthAdd([part[PARTICLE_PROPS.X], part[PARTICLE_PROPS.Y]], num)
  part[PARTICLE_PROPS.X] = vecAdded[0];
  part[PARTICLE_PROPS.Y] = vecAdded[1];
}



function applyViscosity(store: TStore, i: TLiquidParticle, dt: number) {
  eachNeighborsOf(store, i, j=>{
    const r = getR(i, j)
    const rNormal = vectorNormal(r);
    const q = vectorLength(vectorDiv(r, store.radius));
    if (q < 1) {
      const velDiff = getVelDiff(i, j);
      // if(isAnomalyVel(i) || isAnomalyVel(j)){
      //   console.dir({ i, j });
      //   debugger
      // }
      const u = vectorLength(vectorMulVector(rNormal, velDiff));
      if (u > 0) {
        // const halfI = vectorDiv(vectorMul(rNormal, dt * (1 - q) * (sigma * u + (beta * u)**2 )), 2);
        const halfI = vectorDiv(vectorMul(rNormal, dt * (1 - q) * (sigma * u + (beta * u) )), 2);
        addVel(i, [-halfI[0], -halfI[1]]); // vi -= I/2;
        addVel(j, halfI); // vj += I/2;
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
function applySpringDisplacements(store: TStore, i: TLiquidParticle, dt: number) {
  // const L = 23321423;
  // const r = getR(i, j);
  // const D = dt**2 * kSpring * (1-L/h) * (L - r) * r;
  eachNeighborsOf(store, i, j=>{
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
function doubleDensityRelaxation(store: TStore, i: TLiquidParticle, dt: number) {
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
  //       j[PARTICLE_PROPS.X] += D/2;
  //       j[PARTICLE_PROPS.Y] += D/2;
  //     // ?
  //     dx -= D/2;
  //   }
  // });
  // // xi += dx;
  // // ?
  //   i[PARTICLE_PROPS.X] += dx;
  //   i[PARTICLE_PROPS.Y] += dx;
  // // ?
}
function applyI(part: TLiquidParticle, I: TVector) {
  part[PARTICLE_PROPS.X] -= I[0];
  part[PARTICLE_PROPS.Y] -= I[1];
  // if(I[0]>0){
  //   part[PARTICLE_PROPS.X] += I[0];
  // }else{
  //   part[PARTICLE_PROPS.X] -= I[0];
  // }
  // if(I[1]>0){
  //   part[PARTICLE_PROPS.Y] += I[1];
  // }else{
  //   part[PARTICLE_PROPS.Y] -= I[1];
  // }
}

function resolveCollisions(store: TStore, particles: TLiquidParticle[], activeZone: TRect, updatablePids: number[]) {
  const bodies = getBodiesInRect(store.world.bodies, activeZone);
  const originalBodiesData: TOriginalBodyData[] = [];
  // const bodiesContainsParticleIds: number[][] = [];
  const processedBodies: Matter.Body[] = [];
  const buffer: TVector[] = [];
  bodies.forEach((body, ix)=>{
    if(body.isStatic)return;
    originalBodiesData[ix] = {...body.position, a: body.angle} // save original body position and orientation
    // advance body using V and ω
    // clear force and torque buffers
    const particlesInBodyIds = getParticlesInsideBodyIds(particles, body, store.spatialHash, updatablePids);
    if(!particlesInBodyIds.length)return;

    processedBodies.push(body);
    // bodiesContainsParticleIds[ix] = particlesInBodyIds;
    const buf: TVector = [0, 0];
    foreachIds(particles, particlesInBodyIds, function(part) { // foreach particle inside the body
      const I = computeI(part, body); // compute collision impulse I
      // buf[0] += I[0];
      // buf[1] += I[1];
      // body.position.x += I[0];
      // body.position.y += I[1];
      // add I contribution to force and torque buffers
    })
    buffer.push(buf)
  })
  processedBodies.forEach((body, bodyid)=>{  // foreach body
    const buf = buffer[bodyid];
    // body.velocity.x
    body.position.x += buf[0];
    body.position.y += buf[1];
    // modify V with force and ω with torque
    // advance from original position using V and ω
  })
  // resolve collisions and contacts between bodies
  processedBodies.forEach(body=>{
    const particlesInBodyIds = getParticlesInsideBodyIds(particles, body, store.spatialHash, updatablePids);
    foreachIds(particles, particlesInBodyIds, function(part) { // foreach particle inside the body
      const I = computeI(part, body); // compute collision impulse I
      applyI(part, I); // apply I to the particle
      if(checkBodyContainsPoint(body, part[PARTICLE_PROPS.X], part[PARTICLE_PROPS.Y])){
        // extract the particle if still inside the body
        // const bodyCenterPos: TVector = [body.position.x, body.position.y];
        // const partPrevPos: TVector = [part[PARTICLE_PROPS.PREV_X], part[PARTICLE_PROPS.PREV_Y]];
        // const partPos: TVector = [part[PARTICLE_PROPS.X], part[PARTICLE_PROPS.Y]];
        // const cbToppLength = vectorLength(vectorFromTwo(bodyCenterPos, partPrevPos));
        // const movePosit = vectorLengthSet(vectorFromTwo(bodyCenterPos, partPos), cbToppLength);

        // part[PARTICLE_PROPS.X] += movePosit[0];
        // part[PARTICLE_PROPS.Y] += movePosit[1];
      }
    })
  })
}



// DEBUG
function isAnomaly(vari: number) {
  // return !isFinite(vari) || Math.abs(vari) >= 2.1e+100;
  return Math.abs(vari) >= 2.1e+100;
}
function isAnomalyVel(part: TLiquidParticle){
  return isAnomaly(part[PARTICLE_PROPS.VEL_X]) || isAnomaly(part[PARTICLE_PROPS.VEL_Y]);
}
function checkAnomaly(part: TLiquidParticle, caption: string) {
  if(isAnomaly(part[PARTICLE_PROPS.X]) || isAnomaly(part[PARTICLE_PROPS.Y])){
    console.log(`[ ${caption} ] position is anomal`);
  }
  if(isAnomaly(part[PARTICLE_PROPS.VEL_X]) || isAnomaly(part[PARTICLE_PROPS.VEL_Y])){
    console.log(`[ ${caption} ] velocity is anomal`);
  }
}
function _limitMoving(part: TLiquidParticle) {
  const limit = 5;
  part[PARTICLE_PROPS.VEL_X] = Math.min(Math.max(part[PARTICLE_PROPS.VEL_X], -limit), limit);
  part[PARTICLE_PROPS.VEL_Y] = Math.min(Math.max(part[PARTICLE_PROPS.VEL_Y], -limit), limit);
}
// @ts-ignore
// window.TEST_MOUSE_MOVE = function(mouseConstraint: Matter.MouseConstraint) {
//   var mouse = mouseConstraint.mouse,
//     constraint = mouseConstraint.constraint,
//     body = mouseConstraint.body,
//     point = mouse.position;
//   if(!body)return ;
// const partturjherIds = particles.map((v, ix)=>ix);
//   body.render.fillStyle = '#0f5'
//   // @ts-ignore
//   const partIds = getParticlesInsideBodyIds(particles, body, spatialHash, partturjherIds);
//   // debugger
//   partIds.forEach(pid=>{
//     partColors.set(pid, '#0af')
//   })
// };


export default function update(liquid: CLiquid, dt: number) {
  const Store = liquid.store;
  const { particles } = Store;
  const activeRect = getRectWithPaddingsFromBounds(Store.render.bounds, Store.activeBoundsPadding);
  const updatedPids: number[] = [];
  const gravity = liquid.state.getGravity();

  foreachActive(liquid, activeRect, particles, function(part, pid) {
    updatedPids.push(pid)
    // vi ← vi + ∆tg
    part[PARTICLE_PROPS.VEL_X] += dt * gravity[0];
    part[PARTICLE_PROPS.VEL_Y] += dt * gravity[1];
  });
  foreachIds(particles, updatedPids, function(part) {
    applyViscosity(Store, part, dt);
  });
  foreachIds(particles, updatedPids, function(part) {
    _limitMoving(part); // Custom
    // Save previous position: xi^prev ← xi
    part[PARTICLE_PROPS.PREV_X] = part[PARTICLE_PROPS.X];
    part[PARTICLE_PROPS.PREV_Y] = part[PARTICLE_PROPS.Y];
    // Add Particle Position By Velosity: xi ← xi + ∆tvi
    part[PARTICLE_PROPS.X] += dt * part[PARTICLE_PROPS.VEL_X];
    part[PARTICLE_PROPS.Y] += dt * part[PARTICLE_PROPS.VEL_Y];
  });
  // adjustSprings();
  // foreachIds(updatablePids, function(part) {
  //   applySpringDisplacements(Config, part, dt);
  // });
  // foreachIds(updatablePids, function(part) {
  //   doubleDensityRelaxation(part, dt);
  // });
  // resolveCollisions(Store, particles, activeRect, updatedPids);
  foreachIds(particles, updatedPids, function(part) {
    // vi ← (xi − xi^prev )/∆t
    part[PARTICLE_PROPS.VEL_X] = (part[PARTICLE_PROPS.X] - part[PARTICLE_PROPS.PREV_X]) / dt;
    part[PARTICLE_PROPS.VEL_Y] = (part[PARTICLE_PROPS.Y] - part[PARTICLE_PROPS.PREV_Y]) / dt;
  });
  foreachIds(particles, updatedPids, function(part, pid) {
    Store.spatialHash.update(pid, part[PARTICLE_PROPS.X], part[PARTICLE_PROPS.Y]);
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