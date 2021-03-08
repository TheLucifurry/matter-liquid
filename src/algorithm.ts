import { PARTICLE_PROPS } from './constants';
import { vectorClampMaxLength, vectorDiv, vectorFromTwo, vectorLength, vectorMul, vectorMulVector, vectorNormal, vectorSubVector } from './helpers/vector';
import { checkBodyContainsPoint, getBodiesInRect, getParticlesInsideBodyIds, getRectWithPaddingsFromBounds, mathClamp, mathWrap } from './helpers/utils';
import { eachNeighborsOf, foreachIds, eachSpring, getNeighbors, eachNeighbors, foreachActive } from './helpers/cycles';

const p0 = 10 // rest density
const k = 0.004 // stiffness
// const kNear = 10 // stiffness near (вроде, влияет на текучесть)
const sigma = .1; //
const beta = .1; // 0 - вязкая жидкость
const mu = .5; // friction, 0 - скольжение, 1 - цепкость

const L = 10; // длина упора пружины; (хорошо ведут себя значения в пределах 20-100)
const kSpring = 0.001; // (в доке по дефолту 0.3)
const alpha = 0.03 // α - константа пластичности

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
  return vectorFromTwo(
    [b[PARTICLE_PROPS.VEL_X], b[PARTICLE_PROPS.VEL_Y]],
    [a[PARTICLE_PROPS.VEL_X], a[PARTICLE_PROPS.VEL_Y]],
  );
}
function addVel(part: TLiquidParticle, vec: [number, number]) {
  part[PARTICLE_PROPS.VEL_X] += vec[0];
  part[PARTICLE_PROPS.VEL_Y] += vec[1];
}
function subVel(part: TLiquidParticle, vec: [number, number]) {
  part[PARTICLE_PROPS.VEL_X] -= vec[0];
  part[PARTICLE_PROPS.VEL_Y] -= vec[1];
}
function partPosAdd(part: TLiquidParticle, vec: TVector) {
  part[PARTICLE_PROPS.X] += vec[0];
  part[PARTICLE_PROPS.Y] += vec[1];
}
function partPosSub(part: TLiquidParticle, vec: TVector) {
  part[PARTICLE_PROPS.X] -= vec[0];
  part[PARTICLE_PROPS.Y] -= vec[1];
}
function getSpringKey(currentParticleid: number, neighborPid: number) {
  return `${currentParticleid}.${neighborPid}`;
}
function getPidsFromSpringKey(springKey: string) {
  const [currentPid, neighborPid] = springKey.split('.');
  return [+currentPid, +neighborPid];
}



function applyViscosity(store: TStore, i: TLiquidParticle, dt: number) {
  eachNeighborsOf(store, i, j=>{
    const r = getR(i, j)
    const rNormal = vectorNormal(r);
    const q = vectorLength(vectorDiv(r, store.radius));
    if (q < 1) {
      const velDiff = getVelDiff(i, j);
      const u = vectorLength(vectorMulVector(rNormal, velDiff));
      if (u > 0) {
        const sigma = 0.01;
        const beta = 0.01;
        const I = vectorMul(rNormal, dt * (1 - q) * (sigma * u + (beta * u**2) ));
        const halfI = vectorDiv(I, 2);
        subVel(i, halfI); // vi -= I/2;
        addVel(j, halfI); // vj += I/2;
      }
    }
  });
}
function adjustSprings(store: TStore, updatedPids: number[], dt: number) {
  // const alpha = 0.01; // 0 до 0,2
  const y = 0.1; // 0 до 0,2
  foreachIds(store.particles, updatedPids, function(i, currentPid) {
    eachNeighborsOf(store, i, (j, neighborPid)=>{
      const r = getR(i, j);
      const q = vectorLength(vectorDiv(r, store.radius));
      if (q < 1) {
        const r = getR(i, j);
        const rLength = vectorLength(r);
        let Lij = L - rLength;
        // let Lij = store.radius;

        const springKey = getSpringKey(currentPid, neighborPid);
        // if(springs[springKey] === undefined){
        //   springs[springKey] = Lij;
        // }
        const d = y * Lij;
        if(rLength > L + d){ // stretch
          Lij += dt * alpha * (rLength - L - d);
        } else if(rLength < L - d){ // compress
          Lij -= dt * alpha * (L - d - rLength);
        }

        if(store.springs[springKey] === undefined){
          store.springs[springKey] = Lij;
        }

        // if(Lij > store.radius){
        //   store.springs[springKey] = undefined;
        // }
      }
    });
  });
  eachSpring(store.springs, (springKey, spring) => {
    if(Math.abs(spring) > store.radius){
      store.springs[springKey] = undefined;
    }
  })
  eachSpring(store.springs, (springKey, spring) => {
    const [iPid, jPid] = getPidsFromSpringKey(springKey);
    const i = store.particles[iPid], j = store.particles[jPid];

    const r = getR(i, j);
    const rNormal = vectorNormal(r);
    const rLength = vectorLength(r);
    //     const Lij = L - rLength;
    const Lij = spring;

    // dt**2 * kSpring * (1 − Lij / h) * (Lij − Rij) * R^ij
    //       4         5    2     1    6      3      7
    const D = vectorMul(rNormal, dt**2 * kSpring * (1 - Lij / store.radius) * (Lij - rLength));
    const DHalf = vectorDiv(D, 2);
    partPosSub(i, DHalf) // xi -= D/2;
    partPosAdd(j, DHalf) // xj += D/2;
  })
}
function doubleDensityRelaxation(store: TStore, i: TLiquidParticle, dt: number) {
  const kNear = store.radius / 3 // stiffness near (вроде, влияет на текучесть)

  let p = 0;
  let pNear = 0;
  const neighbors = getNeighbors(store, i);
  eachNeighbors(store.particles, neighbors, j=>{
    let q = vectorLength(vectorDiv(getR(i, j), store.radius)); // q ← rij/h
    if(q < 1){
      p += (1-q)**2;
      pNear += (1-q)**3;
    }
  });
  let P = k * (p - p0);
  let PNear = kNear * pNear;
  let dx: TVector = [0, 0];
  eachNeighbors(store.particles, neighbors, (j, jPid)=>{
    const r = getR(i, j);
    const rNormal = vectorNormal(r);
    let q = vectorLength(vectorDiv(r, store.radius)); // q ← rij/h
    // console.log(`q: ${q}`);
    if(q < 1){
      const halfD = vectorDiv(vectorMul(rNormal, dt**2 * (P*(1 - q) + PNear * (1 - q)**2)), 2);
      dx[0] -= halfD[0];
      dx[1] -= halfD[1];
      partPosAdd(j, halfD);
    }
  });
  partPosAdd(i, dx);
}
function applyI(part: TLiquidParticle, I: TVector) {
  part[PARTICLE_PROPS.X] -= I[0];
  part[PARTICLE_PROPS.Y] -= I[1];
}

function resolveCollisions(store: TStore, activeZone: TRect, updatablePids: number[]) {
  const { particles } = store;
  const bodies = activeZone ? getBodiesInRect(store.world.bodies, activeZone) : store.world.bodies;
  const originalBodiesData: TOriginalBodyData[] = [];
  // const bodiesContainsParticleIds: number[][] = [];
  const processedBodies: Matter.Body[] = [];
  const buffer: TVector[] = [];
  // bodies.forEach((body, ix)=>{
  //   // if(body.isStatic)return;
  //   originalBodiesData[ix] = {...body.position, a: body.angle} // save original body position and orientation
  //   // advance body using V and ω
  //   // clear force and torque buffers
  //   const particlesInBodyIds = getParticlesInsideBodyIds(particles, body, store.spatialHash, updatablePids);
  //   if(!particlesInBodyIds.length)return;

  //   processedBodies.push(body);
  //   // bodiesContainsParticleIds[ix] = particlesInBodyIds;
  //   const buf: TVector = [0, 0];
  //   foreachIds(particles, particlesInBodyIds, function(part) { // foreach particle inside the body
  //     const I = computeI(part, body); // compute collision impulse I
  //     // buf[0] += I[0];
  //     // buf[1] += I[1];
  //     // body.position.x += I[0];
  //     // body.position.y += I[1];
  //     // add I contribution to force and torque buffers
  //   })
  //   buffer.push(buf)
  // })
  // processedBodies.forEach((body, bodyid)=>{  // foreach body
  //   const buf = buffer[bodyid];
  //   // body.velocity.x
  //   body.position.x += buf[0];
  //   body.position.y += buf[1];
  //   // modify V with force and ω with torque
  //   // advance from original position using V and ω
  // })
  // resolve collisions and contacts between bodies
  // processedBodies.forEach(body=>{
    bodies.forEach(body=>{
    const particlesInBodyIds = getParticlesInsideBodyIds(particles, body, store.spatialHash, updatablePids);
    foreachIds(particles, particlesInBodyIds, function(part) { // foreach particle inside the body
      const I = computeI(part, body); // compute collision impulse I
      applyI(part, I); // apply I to the particle
      if(checkBodyContainsPoint(body, part[PARTICLE_PROPS.X], part[PARTICLE_PROPS.Y])){
        // extract the particle if still inside the body
        // const bodyCenterPos: TVector = [body.position.x, body.position.y];
        // const partPrevPos: TVector = [part[PARTICLE_PROPS.PREV_X], part[PARTICLE_PROPS.PREV_Y]];
        // const partPos: TVector = [part[PARTICLE_PROPS.X], part[PARTICLE_PROPS.Y]];
        // const cbTopLength = vectorLength(vectorFromTwo(bodyCenterPos, partPrevPos));
        // const movePosit = vectorLengthSet(vectorFromTwo(bodyCenterPos, partPos), cbTopLength);

        // part[PARTICLE_PROPS.X] += movePosit[0];
        // part[PARTICLE_PROPS.Y] += movePosit[1];
      }
    })
  })
}
function endComputing(store: TStore, updatedPids: number[], dt: number, particlesPrevPositions: TSavedParticlesPositions) {
  foreachIds(store.particles, updatedPids, function(part, pid) {
    const b = store.world.bounds;
    if(store.isWorldWrapped){
      part[PARTICLE_PROPS.X] = mathWrap(part[PARTICLE_PROPS.X], b.min.x, b.max.x);
      part[PARTICLE_PROPS.Y] = mathWrap(part[PARTICLE_PROPS.Y], b.min.y, b.max.y);
    }else{
      const delta = 1
      const oldX = part[PARTICLE_PROPS.X];
      const oldY = part[PARTICLE_PROPS.Y];
      part[PARTICLE_PROPS.X] = mathClamp(oldX, b.min.x, b.max.x);
      part[PARTICLE_PROPS.Y] = mathClamp(oldY, b.min.y, b.max.y);
      if(oldX !== part[PARTICLE_PROPS.X]){
        part[PARTICLE_PROPS.VEL_X] *= -delta;
      }
      if(oldY !== part[PARTICLE_PROPS.Y]){
        part[PARTICLE_PROPS.VEL_Y] *= -delta;
      }
    }
    computeNextVelocity(part, dt, particlesPrevPositions[pid]); // vi ← (xi − xi^prev )/∆t
    store.spatialHash.update(pid, part[PARTICLE_PROPS.X], part[PARTICLE_PROPS.Y]);
  });
}


function applyGravity(part: TLiquidParticle, dt: number, gravity: TVector) {
  part[PARTICLE_PROPS.VEL_X] += dt * gravity[0];
  part[PARTICLE_PROPS.VEL_Y] += dt * gravity[1];
}
function addParticlePositionByVelocity(part: TLiquidParticle, dt: number) {
  part[PARTICLE_PROPS.X] += dt * part[PARTICLE_PROPS.VEL_X];
  part[PARTICLE_PROPS.Y] += dt * part[PARTICLE_PROPS.VEL_Y];
}
function computeNextVelocity(part: TLiquidParticle, dt: number, prevPositions: TVector) {
  part[PARTICLE_PROPS.VEL_X] = (part[PARTICLE_PROPS.X] - prevPositions[0]) / dt;
  part[PARTICLE_PROPS.VEL_Y] = (part[PARTICLE_PROPS.Y] - prevPositions[1]) / dt;
}
function limitVelocity(part: TLiquidParticle, maxValue: number) {
  const limitedVal: TVector = vectorClampMaxLength([part[PARTICLE_PROPS.VEL_X], part[PARTICLE_PROPS.VEL_Y]], maxValue);
  part[PARTICLE_PROPS.VEL_X] = limitedVal[0];
  part[PARTICLE_PROPS.VEL_Y] = limitedVal[1];
}



export function simple(liquid: CLiquid, dt: number) {
  const Store = liquid.store;
  const updatedPids: number[] = [];
  const gravity = liquid.getGravity();
  const particlesPrevPositions: TSavedParticlesPositions = {};
  const activeRect: TRect = Store.isRegionalComputing ? getRectWithPaddingsFromBounds(Store.render.bounds, Store.activeBoundsPadding) : null;

  foreachActive(liquid, activeRect, Store.particles, function(part, pid) {
    updatedPids.push(pid);
    applyGravity(part, dt, gravity); // vi ← vi + ∆tg
    particlesPrevPositions[pid] = [part[PARTICLE_PROPS.X], part[PARTICLE_PROPS.Y]]; // Save previous position: xi^prev ← xi

    limitVelocity(part, Store.radius * 0.5);

    addParticlePositionByVelocity(part, dt); // Add Particle Position By Velocity: xi ← xi + ∆tvi
  })
  foreachIds(Store.particles, updatedPids, function(part) {
    doubleDensityRelaxation(Store, part, dt);
  });
  // resolveCollisions(Store, activeRect, updatedPids);
  endComputing(Store, updatedPids, dt, particlesPrevPositions);
}

export function advanced(liquid: CLiquid, dt: number) {
  const Store = liquid.store;
  const activeRect = getRectWithPaddingsFromBounds(Store.render.bounds, Store.activeBoundsPadding);
  const updatedPids: number[] = [];
  const gravity = liquid.getGravity();
  const particlesPrevPositions: TSavedParticlesPositions = {};

  foreachActive(liquid, activeRect, Store.particles, function(part, pid) {
    updatedPids.push(pid);
    applyGravity(part, dt, gravity); // vi ← vi + ∆tg
  });
  foreachIds(Store.particles, updatedPids, function(part) {
    applyViscosity(Store, part, dt);
  });
  foreachIds(Store.particles, updatedPids, function(part, pid) {
    // _limitMoving(part); // Custom
    particlesPrevPositions[pid] = [part[PARTICLE_PROPS.X], part[PARTICLE_PROPS.Y]]; // Save previous position: xi^prev ← xi
    addParticlePositionByVelocity(part, dt); // Add Particle Position By Velocity: xi ← xi + ∆tvi
  });
  adjustSprings(Store, updatedPids, dt);
  // applySpringDisplacements
  foreachIds(Store.particles, updatedPids, function(part) {
    doubleDensityRelaxation(Store, part, dt);
  });
  // resolveCollisions(Store, Store.particles, activeRect, updatedPids);
  endComputing(Store, updatedPids, dt, particlesPrevPositions);
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