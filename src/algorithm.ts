import Matter from 'matter-js';
import { PARTICLE_PROPS } from './constants';
import { arrayEach, checkBodyContainsPoint, getBodiesInRect, getParticlesInsideBodyIds, getRectWithPaddingsFromBounds, mathWrap, vectorDiv, vectorFromTwo, vectorLength, vectorLengthAdd, vectorMul, vectorMulVector, vectorNormal, vectorSubVector } from './utils';

const p0 = 10 // rest density
const k = 0.004 // stiffness
// const kNear = 10 // stiffness near (вроде, влияет на текучесть)
const sigma = .1; //
const beta = .1; // 0 - вязкая жидкость
const mu = .5; // friction, 0 - скольжение, 1 - цепкость

const L = 10; // длина упора пружины; (хорошо ведут себя значения в пределах 20-100)
const kSpring = 0.001; // (в доке по дефолту 0.3)
const alpha = 0.03 // α - константа пластичности

function foreachActive(liquid: CLiquid, activeRect: TRect, arr: TLiquidParticle[], callback: (particle: TLiquidParticle, particleid: number)=>void) {
  arrayEach(arr, (part, id)=>{
    if(part === null  || (activeRect && !liquid.checkRectContainsParticle(activeRect, part))) return; // Ignore static or inactive particles
    callback(part, id);
  })
}
function foreachDynamic(liquid: CLiquid, arr: TLiquidParticle[], callback: (particle: TLiquidParticle, particleid: number)=>void) {
  arrayEach(arr, (part, id)=>{
    if(part === null) return; // Ignore static or inactive particles
    callback(part, id);
  })
}
function foreachIds(particles: TLiquidParticle[], pids: number[], callback: (particle: TLiquidParticle, particleid: number)=>void) {
  arrayEach(pids, (pid)=>callback(particles[pid], pid));
}
function pointInCircle(x: number, y: number, cx: number, cy: number, radius: number) {
  return (x - cx) * (x - cx) + (y - cy) * (y - cy) <= radius * radius;
}
function getNeighbors(store: TStore, part: TLiquidParticle) {
  // const Math.sqrt((x1-x0)*(x1-x0) + (y1-y0)*(y1-y0)) < r
  // const x = part[PARTICLE_PROPS.X], y = part[PARTICLE_PROPS.Y];
  return store.spatialHash.getAroundCellsItems(part[PARTICLE_PROPS.X], part[PARTICLE_PROPS.Y])
    // .filter(neighborPid=>{
    //   const nPart = store.particles[neighborPid];
    //   const nx = nPart[PARTICLE_PROPS.X], ny = nPart[PARTICLE_PROPS.Y];
    //   return pointInCircle(nx, ny, x, y, store.radius);
    // });
}
function eachNeighbors(particles: TLiquidParticle[], neighbors: number[], cb: (neighborParticle: TLiquidParticle, neighborPid: number)=>void ) {
  arrayEach(neighbors, (pid)=>cb(particles[pid], pid));
}
function eachNeighborsOf(store: TStore, part: TLiquidParticle, cb: (neighborParticle: TLiquidParticle, neighborPid: number)=>void ) {
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
  return vectorFromTwo(
    [b[PARTICLE_PROPS.VEL_X], b[PARTICLE_PROPS.VEL_Y]],
    [a[PARTICLE_PROPS.VEL_X], a[PARTICLE_PROPS.VEL_Y]],
  );
  // return [a[PARTICLE_PROPS.VEL_X]-b[PARTICLE_PROPS.VEL_X], a[PARTICLE_PROPS.VEL_Y]-b[PARTICLE_PROPS.VEL_Y]];
}
function addVel(part: TLiquidParticle, vec: [number, number]) {
  part[PARTICLE_PROPS.VEL_X] += vec[0];
  part[PARTICLE_PROPS.VEL_Y] += vec[1];
}
function subVel(part: TLiquidParticle, vec: [number, number]) {
  part[PARTICLE_PROPS.VEL_X] -= vec[0];
  part[PARTICLE_PROPS.VEL_Y] -= vec[1];
}
function addPos(part: TLiquidParticle, num: number) {
  const vecAdded = vectorLengthAdd([part[PARTICLE_PROPS.X], part[PARTICLE_PROPS.Y]], num)
  part[PARTICLE_PROPS.X] = vecAdded[0];
  part[PARTICLE_PROPS.Y] = vecAdded[1];
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
function eachSpring(springs: TSpringList, cb: (springKey: string, spring: TSpring)=>void) {
  for (let [key, value] of Object.entries(springs)) {
    cb(key, springs[key])
  }
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
  const kNear = store.radius / 4 // stiffness near (вроде, влияет на текучесть)

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
  eachNeighbors(store.particles, neighbors, j=>{
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
        // const cbTopLength = vectorLength(vectorFromTwo(bodyCenterPos, partPrevPos));
        // const movePosit = vectorLengthSet(vectorFromTwo(bodyCenterPos, partPos), cbTopLength);

        // part[PARTICLE_PROPS.X] += movePosit[0];
        // part[PARTICLE_PROPS.Y] += movePosit[1];
      }
    })
  })
}



// DEBUG
function isAnomaly(value: number) {
  // return !isFinite(value) || Math.abs(value) >= 2.1e+100;
  return Math.abs(value) >= 2.1e+100;
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
// const pIds = particles.map((v, ix)=>ix);
//   body.render.fillStyle = '#0f5'
//   // @ts-ignore
//   const partIds = getParticlesInsideBodyIds(particles, body, spatialHash, pIds);
//   // debugger
//   partIds.forEach(pid=>{
//     partColors.set(pid, '#0af')
//   })
// };

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
    addParticlePositionByVelocity(part, dt); // Add Particle Position By Velocity: xi ← xi + ∆tvi
  })
  foreachIds(Store.particles, updatedPids, function(part) {
    doubleDensityRelaxation(Store, part, dt);
  });
  // resolveCollisions(Store, Store.particles, activeRect, updatedPids);
  foreachIds(Store.particles, updatedPids, function(part, pid) {
    computeNextVelocity(part, dt, particlesPrevPositions[pid]); // vi ← (xi − xi^prev )/∆t

    const b = Store.world.bounds;
    // part[PARTICLE_PROPS.X] = mathWrap(part[PARTICLE_PROPS.X], b.min.x, b.max.x);
    // part[PARTICLE_PROPS.Y] = mathWrap(part[PARTICLE_PROPS.Y], b.min.y, b.max.y);
    const delta = -0.5;
    if(part[PARTICLE_PROPS.X] < b.min.x && part[PARTICLE_PROPS.VEL_X] < 0) part[PARTICLE_PROPS.VEL_X] *= delta;
    if(part[PARTICLE_PROPS.X] > b.max.x && part[PARTICLE_PROPS.VEL_X] > 0) part[PARTICLE_PROPS.VEL_X] *= delta;
    if(part[PARTICLE_PROPS.Y] < b.min.y && part[PARTICLE_PROPS.VEL_Y] < 0) part[PARTICLE_PROPS.VEL_Y] *= delta;
    if(part[PARTICLE_PROPS.Y] > b.max.y && part[PARTICLE_PROPS.VEL_Y] > 0) part[PARTICLE_PROPS.VEL_Y] *= delta;

    Store.spatialHash.update(pid, part[PARTICLE_PROPS.X], part[PARTICLE_PROPS.Y]);
  });
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
  // foreachIds(particles, updatedPids, function(part) {
  //   applyViscosity(Store, part, dt);
  // });
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
  foreachIds(Store.particles, updatedPids, function(part, pid) {
    computeNextVelocity(part, dt, particlesPrevPositions[pid]); // vi ← (xi − xi^prev )/∆t
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