import { P } from './constants';
import {
  getReflectVector,
  vectorAddVector,
  vectorClampMaxLength, vectorDiv, vectorEqualsVector, vectorFromTwo, vectorLength, vectorMul, vectorMulVector, vectorNormal, vectorSigns, vectorSubVector,
} from './helpers/vector';
import {
  checkBodyContainsPoint, getBodiesInRect, getBodySurfaceIntersectsWithRay, getBodySurfaceNormal, getLineIntersectionPoint, getParticlesInsideBodyIds, getRectFromBoundsWithPadding, mathClamp, mathWrap,
} from './helpers/utils';
import {
  eachNeighborsOf, foreachIds, eachSpring, getNeighbors, eachNeighbors, foreachActive,
} from './helpers/cycles';

const p0 = 10; // rest density
const k = 0.004; // stiffness
// const kNear = 10 // stiffness near (вроде, влияет на текучесть)
const sigma = 0.1; //
const beta = 0.1; // 0 - вязкая жидкость
const mu = 1; // friction, 0 - скольжение, 1 - цепкость

const L = 10; // длина упора пружины; (хорошо ведут себя значения в пределах 20-100)
const kSpring = 0.001; // (в доке по дефолту 0.3)
const alpha = 0.03; // α - константа пластичности

function getR(a: TParticle, b: TParticle): TVector {
  return vectorFromTwo([a[P.X], a[P.Y]], [b[P.X], b[P.Y]]);
}
function computeI(part: TParticle, body: Matter.Body): TVector {
  const bodyVelVector: TVector = [body.velocity.x, body.velocity.y];
  const v_ = vectorSubVector([part[P.VEL_X], part[P.VEL_Y]], bodyVelVector); // vi − vp
  // const n_ = vectorNormal([body.position.x, body.position.y]);
  // const vNormal = vectorMulVector(vectorMulVector(v_, n_), n_); // = (v¯ * nˆ)nˆ
  const vNormal = vectorNormal(v_); // = (v¯ * nˆ)nˆ
  const vTangent = vectorSubVector(v_, vNormal); // v¯ − v¯normal
  return vectorSubVector(vNormal, vectorMul(vTangent, mu)); // v¯normal - µ * v¯tangent
}
function getVelDiff(a: TParticle, b: TParticle): TVector {
  return vectorFromTwo(
    [b[P.VEL_X], b[P.VEL_Y]],
    [a[P.VEL_X], a[P.VEL_Y]],
  );
}
function addVel(part: TParticle, vec: TVector) {
  part[P.VEL_X] += vec[0];
  part[P.VEL_Y] += vec[1];
}
function subVel(part: TParticle, vec: TVector) {
  part[P.VEL_X] -= vec[0];
  part[P.VEL_Y] -= vec[1];
}
function partPosAdd(part: TParticle, vec: TVector) {
  part[P.X] += vec[0];
  part[P.Y] += vec[1];
}
function partPosSub(part: TParticle, vec: TVector) {
  part[P.X] -= vec[0];
  part[P.Y] -= vec[1];
}
function getSpringKey(currentParticleid: number, neighborPid: number): TSHCellId {
  return `${currentParticleid}.${neighborPid}`;
}
function getPidsFromSpringKey(springKey: string): TVector {
  const [currentPid, neighborPid] = springKey.split('.');
  return [+currentPid, +neighborPid];
}
function applyGravity(part: TParticle, dt: number, gravity: TVector) {
  part[P.VEL_X] += dt * gravity[0];
  part[P.VEL_Y] += dt * gravity[1];
}
function addParticlePositionByVelocity(part: TParticle, dt: number) {
  part[P.X] += dt * part[P.VEL_X];
  part[P.Y] += dt * part[P.VEL_Y];
}
function computeNextVelocity(part: TParticle, dt: number, prevPositions: TVector) {
  part[P.VEL_X] = (part[P.X] - prevPositions[0]) / dt;
  part[P.VEL_Y] = (part[P.Y] - prevPositions[1]) / dt;
}
function limitVelocity(part: TParticle, maxValue: number) {
  const [limX, limY]: TVector = vectorClampMaxLength([part[P.VEL_X], part[P.VEL_Y]], maxValue);
  part[P.VEL_X] = limX;
  part[P.VEL_Y] = limY;
}

function applyViscosity(store: TStore, i: TParticle, dt: number) {
  eachNeighborsOf(store, i, (j) => {
    const r = getR(i, j);
    const rNormal = vectorNormal(r);
    const q = vectorLength(vectorDiv(r, store.h));
    if (q < 1) {
      const velDiff = getVelDiff(i, j);
      const u = vectorLength(vectorMulVector(rNormal, velDiff));
      if (u > 0) {
        const sigma = 0.01;
        const beta = 0.01;
        const I = vectorMul(rNormal, dt * (1 - q) * (sigma * u + (beta * u ** 2)));
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
  foreachIds(store.p, updatedPids, (i, currentPid) => {
    eachNeighborsOf(store, i, (j, neighborPid) => {
      const r = getR(i, j);
      const q = vectorLength(vectorDiv(r, store.h));
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
        if (rLength > L + d) { // stretch
          Lij += dt * alpha * (rLength - L - d);
        } else if (rLength < L - d) { // compress
          Lij -= dt * alpha * (L - d - rLength);
        }

        if (store.s[springKey] === undefined) {
          store.s[springKey] = Lij;
        }

        // if(Lij > store.radius){
        //   store.springs[springKey] = undefined;
        // }
      }
    });
  });
  eachSpring(store.s, (springKey, spring) => {
    if (Math.abs(spring) > store.h) {
      store.s[springKey] = undefined;
    }
  });
  eachSpring(store.s, (springKey, spring) => {
    const [iPid, jPid] = getPidsFromSpringKey(springKey);
    const i = store.p[iPid]; const
      j = store.p[jPid];

    const r = getR(i, j);
    const rNormal = vectorNormal(r);
    const rLength = vectorLength(r);
    //     const Lij = L - rLength;
    const Lij = spring;

    // dt**2 * kSpring * (1 − Lij / h) * (Lij − Rij) * R^ij
    //       4         5    2     1    6      3      7
    const D = vectorMul(rNormal, dt ** 2 * kSpring * (1 - Lij / store.h) * (Lij - rLength));
    const DHalf = vectorDiv(D, 2);
    partPosSub(i, DHalf); // xi -= D/2;
    partPosAdd(j, DHalf); // xj += D/2;
  });
}
function doubleDensityRelaxation(store: TStore, i: TParticle, dt: number) {
  const p0 = store.h * 0.2; // rest density
  const k = 0.3; // stiffness range[0..1]
  const kNear = store.h * 0.3; // stiffness near (вроде, влияет на текучесть)

  let p = 0;
  let pNear = 0;
  const neighbors = getNeighbors(store, i);
  const pairsDataList: [number, TVector, TParticle][] = [];
  for (let n = 0; n < neighbors.length; n++) {
    const j = store.p[neighbors[n]];
    const r = getR(i, j);
    const q = vectorLength(vectorDiv(r, store.h)); // q ← rij/h
    if (q < 1) {
      const oneMinQ = 1 - q;
      p += oneMinQ ** 2;
      pNear += oneMinQ ** 3;
      pairsDataList.push([oneMinQ, r, j]);
    }
  }
  const P = k * (p - p0);
  const PNear = kNear * pNear;
  const dx: TVector = [0, 0];
  for (let n = 0; n < pairsDataList.length; n++) {
    const [oneMinQ, r, j] = pairsDataList[n];
    const rNormal = vectorNormal(r);
    const D = vectorMul(rNormal, dt ** 2 * (P * oneMinQ + PNear * oneMinQ ** 2));
    const halfD = vectorDiv(D, 2);
    dx[0] -= halfD[0];
    dx[1] -= halfD[1];
    partPosAdd(j, halfD);
  }
  partPosAdd(i, dx);
}
function applyI(part: TParticle, I: TVector) {
  part[P.VEL_X] -= I[0];
  part[P.VEL_Y] -= I[1];
}
function findOutsidePos(body: Matter.Body, vecDirection: TVector, from: TVector): TVector {
  const xInc = 1 * vecDirection[0];
  const yInc = 1 * vecDirection[1];
  const pos: TVector = from;
  do {
    pos[0] += xInc;
    pos[1] += yInc;
    // console.log(`find step: [${pos.join(', ')}]`);
  } while (checkBodyContainsPoint(body, pos[0], pos[1]));
  return pos;
}
function findOutsidePos_BETA(body: Matter.Body, prevParticlePos: TVector, currentParticlePos: TVector): TVector {
  // const bodyPos: TVector = [body.position.x, body.position.y];
  // const endParticlePos: TVector = !vectorEqualsVector(prevParticlePos, currentParticlePos) ? currentParticlePos : bodyPos;
  // const surface: [TVector, TVector] = getBodySurfaceIntersectsWithRay(body, endParticlePos, prevParticlePos);
  // const newPosition = getLineIntersectionPoint(surface[0], surface[1], bodyPos, prevParticlePos);
  // // const surfNorm = getBodySurfaceNormal(surface[0], surface[1]);
  // // const refVec = getReflectVector(vectorFromTwo(prevParticlePos, endParticlePos), surfNorm);
  // return newPosition;

  const bodyPos: TVector = [body.position.x, body.position.y];
  const endParticlePos: TVector = !vectorEqualsVector(prevParticlePos, currentParticlePos) ? currentParticlePos : bodyPos;
  const surface: [TVector, TVector] = getBodySurfaceIntersectsWithRay(body, endParticlePos, prevParticlePos);
  const surfNorm = getBodySurfaceNormal(surface[0], surface[1]);
  const newPosition = getLineIntersectionPoint(surface[0], surface[1], prevParticlePos, vectorAddVector(prevParticlePos, surfNorm));
  // const refVec = getReflectVector(vectorFromTwo(prevParticlePos, endParticlePos), surfNorm);
  return newPosition;
}

function resolveCollisions(store: TStore, activeZone: TRect, updatablePids: number[]) {
  const { p: particles } = store;
  const bodies = activeZone ? getBodiesInRect(store.w.bodies, activeZone) : store.w.bodies;
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
  bodies.forEach((body) => {
    const particlesInBodyIds = getParticlesInsideBodyIds(particles, body, store.sh, updatablePids);
    foreachIds(particles, particlesInBodyIds, (part) => { // foreach particle inside the body
      const I = computeI(part, body); // compute collision impulse I
      // console.log(`I: [${I.join(', ')}]`);
      const prevPos: TVector = [part[P.X], part[P.Y]];
      // const moveDirection = vectorSigns(I);
      applyI(part, I); // apply I to the particle
      // Invert vector
      // part[P.VEL_X] *= moveDirection[0];
      // part[P.VEL_Y] *= -moveDirection[1];
      if (checkBodyContainsPoint(body, part[P.X], part[P.Y])) {
        // const outsidePos: TVector = findOutsidePos(body, vectorSigns([moveDirection[0], moveDirection[1]]), [part[P.X], part[P.Y]]);
        // const direction: TVector = vectorSigns([moveDirection[0], moveDirection[1]]);
        const direction: TVector = vectorSigns(vectorFromTwo([body.position.x, body.position.y], [part[P.X], part[P.Y]]));
        const outsidePos: TVector = findOutsidePos_BETA(body, prevPos, [part[P.X], part[P.Y]]);
        part[P.X] = outsidePos[0];
        part[P.Y] = outsidePos[1];
        // extract the particle if still inside the body
        // const bodyCenterPos: TVector = [body.position.x, body.position.y];
        // const partPrevPos: TVector = [part[PARTICLE_PROPS.PREV_X], part[PARTICLE_PROPS.PREV_Y]];
        // const partPos: TVector = [part[PARTICLE_PROPS.X], part[PARTICLE_PROPS.Y]];
        // const cbTopLength = vectorLength(vectorFromTwo(bodyCenterPos, partPrevPos));
        // const movePosit = vectorLengthSet(vectorFromTwo(bodyCenterPos, partPos), cbTopLength);

        // part[PARTICLE_PROPS.X] += movePosit[0];
        // part[PARTICLE_PROPS.Y] += movePosit[1];
      }
    });
  });
}
function endComputing(store: TStore, updatedPids: number[], dt: number, particlesPrevPositions: TSavedParticlesPositions) {
  foreachIds(store.p, updatedPids, (part, pid) => {
    // console.log(`part[${part.join(', ')}]\n`);
    computeNextVelocity(part, dt, particlesPrevPositions[pid]); // vi ← (xi − xi^prev )/∆t

    const bounce = store.bb;
    const b = store.w.bounds;
    if (!store.iwx) {
      const oldX = part[P.X];
      part[P.X] = mathClamp(oldX, b.min.x, b.max.x);
      if (oldX !== part[P.X]) {
        part[P.VEL_X] *= -bounce;
        part[P.VEL_Y] *= bounce;
      }
    } else {
      part[P.X] = mathWrap(part[P.X], b.min.x, b.max.x);
    }
    if (!store.iwy) {
      const oldY = part[P.Y];
      part[P.Y] = mathClamp(oldY, b.min.y, b.max.y);
      if (oldY !== part[P.Y]) {
        part[P.VEL_X] *= bounce;
        part[P.VEL_Y] *= -bounce;
      }
    } else {
      part[P.Y] = mathWrap(part[P.Y], b.min.y, b.max.y);
    }

    store.sh.update(pid, part[P.X], part[P.Y]);
  });
}

export function simple(liquid: CLiquid, dt: number): void {
  const Store = liquid.store;
  const updatedPids: number[] = [];
  const gravity = liquid.getGravity();
  const particlesPrevPositions: TSavedParticlesPositions = {};
  const activeRect: TRect = Store.irc ? getRectFromBoundsWithPadding(Store.r.bounds, Store.abp) : null;

  foreachActive(liquid, activeRect, Store.p, (part, pid) => {
    updatedPids.push(pid);
    applyGravity(part, dt, gravity); // vi ← vi + ∆tg
    particlesPrevPositions[pid] = [part[P.X], part[P.Y]]; // Save previous position: xi^prev ← xi

    limitVelocity(part, Store.h * 0.6);

    addParticlePositionByVelocity(part, dt); // Add Particle Position By Velocity: xi ← xi + ∆tvi
  });
  foreachIds(Store.p, updatedPids, (part) => {
    doubleDensityRelaxation(Store, part, dt);
  });
  resolveCollisions(Store, activeRect, updatedPids);
  endComputing(Store, updatedPids, dt, particlesPrevPositions);
}

export function advanced(liquid: CLiquid, dt: number): void {
  const Store = liquid.store;
  const activeRect = getRectFromBoundsWithPadding(Store.r.bounds, Store.abp);
  const updatedPids: number[] = [];
  const gravity = liquid.getGravity();
  const particlesPrevPositions: TSavedParticlesPositions = {};

  foreachActive(liquid, activeRect, Store.p, (part, pid) => {
    updatedPids.push(pid);
    applyGravity(part, dt, gravity); // vi ← vi + ∆tg
  });
  foreachIds(Store.p, updatedPids, (part) => {
    applyViscosity(Store, part, dt);
  });
  foreachIds(Store.p, updatedPids, (part, pid) => {
    // _limitMoving(part); // Custom
    particlesPrevPositions[pid] = [part[P.X], part[P.Y]]; // Save previous position: xi^prev ← xi
    addParticlePositionByVelocity(part, dt); // Add Particle Position By Velocity: xi ← xi + ∆tvi
  });
  adjustSprings(Store, updatedPids, dt);
  // applySpringDisplacements
  foreachIds(Store.p, updatedPids, (part) => {
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
