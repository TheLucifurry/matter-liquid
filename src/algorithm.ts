import { L, P, VELOCITY_LIMIT_FACTOR } from './constants';
import {
  vectorAddVector, vectorClampMaxLength, vectorDiv, vectorEqualsVector, vectorFromTwo, vectorLength, vectorMul, vectorNormal, vectorSubVector,
} from './helpers/vector';
import { foreachIds, getNeighbors, foreachActive } from './helpers/cycles';
import {
  getBodySurfaceIntersectsWithRay, getBodySurfaceNormal, getLineIntersectionPoint, getBodiesInRect, getParticlesInsideBodyIds, checkBodyContainsPoint, getRectFromBoundsWithPadding,
} from './helpers/tools';
import {
  mathMax, mathClamp, mathWrap, checkPointInRect,
} from './helpers/utils';

const p0 = 10; // rest density
const k = 0.004; // stiffness
// const kNear = 10 // stiffness near (вроде, влияет на текучесть)
const sigma = 0.1; //
const beta = 0.1; // 0 - вязкая жидкость
const mu = 1; // friction, 0 - скольжение, 1 - цепкость

const Len = 10; // длина упора пружины; (хорошо ведут себя значения в пределах 20-100)
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
function partPosAdd(part: TParticle, vec: TVector, maxLength: number) {
  // const limited: TVector = vectorClampMaxLength(vec, maxLength);
  const limited: TVector = vec;
  part[P.X] += limited[0];
  part[P.Y] += limited[1];
}
function applyGravity(part: TParticle, dt: number, gravity: TVector, mass: number) {
  part[P.VEL_X] += dt * mass * gravity[0];
  part[P.VEL_Y] += dt * mass * gravity[1];
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

function doubleDensityRelaxation(liquid: TLiquid, i: TParticle, iPid: number, dt: number) {
  const mass = liquid.fpl[iPid][L.MASS] as number;
  const iFid = liquid.fpl[iPid][L.ID] as number;
  const p0 = liquid.h * 0.2; // rest density
  const k = 0.3; // stiffness range[0..1]
  const kNear = liquid.h * 0.3; // stiffness near (вроде, влияет на текучесть)
  const maxStep = liquid.h * 0.8;

  // Chemics
  const chemics = liquid.x;
  const currentLiquidProto = liquid.fpl[iPid];
  const isRecordCollisions = chemics.reacts[iFid] && chemics.ready[iFid];
  if (isRecordCollisions) chemics.data[iFid][iPid] = [];

  let p = 0;
  let pNear = 0;
  const neighbors = getNeighbors(liquid, iPid);
  const pairsDataList: [oneMinQ: number, jPid: number, r: TVector][] = Array(neighbors.length);
  for (let n = 0; n < neighbors.length; n++) {
    const jPid = neighbors[n];
    const j = liquid.p[jPid];
    const r = getR(i, j);
    const q = vectorLength(vectorDiv(r, liquid.h)); // q ← rij/h
    // if (q < 1) {...} - не нужен, т.к. в SH гарантирует этому условию true
    // const oneMinQ = 1 - q;
    const oneMinQ = mathMax(1 - q, 0.5); // { mathMax(..., 0.5) } Экспериментальный способ по стабилизации высокоплотных скоплений частиц
    p += oneMinQ ** 2;
    pNear += oneMinQ ** 3;
    pairsDataList[n] = [oneMinQ, jPid, r];

    // Chemics
    if (isRecordCollisions && liquid.fpl[jPid] !== currentLiquidProto) chemics.data[iFid][iPid].push(jPid);
  }
  // const P = k * (p - p0);
  const pBig = k * (p - p0) * mass; // { * mass } Экспериментальный способ учета массы при взаимодействии
  const PNear = kNear * pNear;
  const dx: TVector = [0, 0];
  for (let n = 0; n < pairsDataList.length; n++) {
    const [oneMinQ, jPid, r] = pairsDataList[n];
    const j = liquid.p[jPid];
    const rNormal = vectorNormal(r);
    const D = vectorMul(rNormal, dt ** 2 * (pBig * oneMinQ + PNear * oneMinQ ** 2));
    const halfD = vectorDiv(D, 2);
    dx[0] -= halfD[0];
    dx[1] -= halfD[1];
    partPosAdd(j, halfD, maxStep);
    liquid.sh.update(jPid, j[0], j[1]);
  }
  partPosAdd(i, dx, maxStep);
  liquid.sh.update(iPid, i[0], i[1]);
}
function applyI(part: TParticle, I: TVector) {
  part[P.VEL_X] -= I[0];
  part[P.VEL_Y] -= I[1];
}
function findOutsidePos(body: Matter.Body, prevParticlePos: TVector, currentParticlePos: TVector): TVector {
  const bodyPos: TVector = [body.position.x, body.position.y];
  if (body.circleRadius) { // is body a circle
    const surfNorm = vectorNormal(vectorFromTwo(bodyPos, currentParticlePos));
    return vectorAddVector(bodyPos, vectorMul(surfNorm, body.circleRadius));
  }
  const endParticlePos: TVector = !vectorEqualsVector(prevParticlePos, currentParticlePos) ? currentParticlePos : bodyPos;
  const surface: [TVector, TVector] = getBodySurfaceIntersectsWithRay(body, endParticlePos, prevParticlePos);
  const surfNorm = getBodySurfaceNormal(surface[0], surface[1]);
  return getLineIntersectionPoint(surface[0], surface[1], prevParticlePos, vectorAddVector(prevParticlePos, surfNorm));
}

function resolveCollisions(liquid: TLiquid, activeZone: TRect, worldBounds: TBounds, updatablePids: number[]) {
  const { p: particles } = liquid;
  const bodies = activeZone ? getBodiesInRect(liquid.w.bodies, activeZone) : liquid.w.bodies;
  const originalBodiesData: TOriginalBodyData[] = [];
  // const bodiesContainsParticleIds: number[][] = [];
  const processedBodies: Matter.Body[] = [];
  const buffer: TVector[] = [];
  // bodies.forEach((body, ix)=>{
  //   // if(body.isStatic)return;
  //   originalBodiesData[ix] = {...body.position, a: body.angle} // save original body position and orientation
  //   // advance body using V and ω
  //   // clear force and torque buffers
  //   const particlesInBodyIds = getParticlesInsideBodyIds(particles, body, liquid.spatialHash, updatablePids);
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
    const particlesInBodyIds = getParticlesInsideBodyIds(particles, body, liquid.sh, updatablePids);
    foreachIds(particles, particlesInBodyIds, (part) => { // foreach particle inside the body
      if (!checkPointInRect(part[P.X], part[P.Y], worldBounds)) return;
      const I = computeI(part, body); // compute collision impulse I
      // console.log(`I: [${I.join(', ')}]`);
      const prevPos: TVector = [part[P.X], part[P.Y]];
      applyI(part, I); // apply I to the particle
      if (checkBodyContainsPoint(body, part[P.X], part[P.Y])) {
        // extract the particle if still inside the body
        const outsidePos: TVector = findOutsidePos(body, prevPos, [part[P.X], part[P.Y]]);
        part[P.X] = outsidePos[0];
        part[P.Y] = outsidePos[1];
      }
    });
  });
}
function endComputing(liquid: TLiquid, updatedPids: number[], dt: number, particlesPrevPositions: TSavedParticlesPositions) {
  foreachIds(liquid.p, updatedPids, (part, pid) => {
    // console.log(`part[${part.join(', ')}]\n`);
    computeNextVelocity(part, dt, particlesPrevPositions[pid]); // vi ← (xi − xi^prev )/∆t

    const bounce = liquid.bb;
    const b = liquid.b;
    if (!liquid.iwx) {
      const oldX = part[P.X];
      part[P.X] = mathClamp(oldX, b[0], b[2]);
      if (oldX !== part[P.X]) {
        part[P.VEL_X] *= -bounce;
        part[P.VEL_Y] *= bounce;
      }
    } else {
      part[P.X] = mathWrap(part[P.X], b[0], b[2]);
    }
    if (!liquid.iwy) {
      const oldY = part[P.Y];
      part[P.Y] = mathClamp(oldY, b[1], b[3]);
      if (oldY !== part[P.Y]) {
        part[P.VEL_X] *= bounce;
        part[P.VEL_Y] *= -bounce;
      }
    } else {
      part[P.Y] = mathWrap(part[P.Y], b[1], b[3]);
    }

    liquid.sh.update(pid, part[P.X], part[P.Y]);
  });

  // Chemics
  const chemics = liquid.x;
  const protoLinks = liquid.fpl;
  for (let fid = 0; fid < chemics.data.length; fid++) {
    if (!chemics.reacts[fid] || !chemics.ready[fid]) continue;

    const liquidCollisions = chemics.data[fid];
    const owned: number[][] = [];
    const other: number[][] = [];
    liquid.l.forEach((_, ix) => { owned[ix] = []; other[ix] = []; });

    // @ts-ignore
    const iPids: number[] = Object.keys(liquidCollisions);
    for (let i = 0; i < iPids.length; i++) {
      const iPid = iPids[i];
      const jPids = liquidCollisions[iPid];
      for (let j = 0; j < jPids.length; j++) {
        const jPid = jPids[j];
        const jFid = protoLinks[jPid][L.ID] as number;
        owned[jFid].push(iPid);
        other[jFid].push(jPid);
      }
    }

    const collisionData: TChemicalReactionData = [owned, other];
    chemics.cbl[fid](collisionData);
  }
}

// eslint-disable-next-line import/prefer-default-export
export function simple(liquid: TLiquid, dt: number): void {
  const updatedPids: number[] = [];
  // @ts-ignore
  const gravity = Matter.Liquid.getGravity(liquid);
  const particlesPrevPositions: TSavedParticlesPositions = {};
  const activeRect: TRect = liquid.irc ? getRectFromBoundsWithPadding(liquid.r.bounds, liquid.abp) : null;
  const worldBounds: TBounds = liquid.b;
  const limit = liquid.h * VELOCITY_LIMIT_FACTOR;
  liquid.x.data = liquid.l.map(() => ([]));

  foreachActive(liquid, activeRect, liquid.p, (part, pid) => {
    updatedPids.push(pid);
    applyGravity(part, dt, gravity, liquid.fpl[pid][L.MASS] as number); // vi ← vi + ∆tg
    particlesPrevPositions[pid] = [part[P.X], part[P.Y]]; // Save previous position: xi^prev ← xi

    limitVelocity(part, limit);

    addParticlePositionByVelocity(part, dt); // Add Particle Position By Velocity: xi ← xi + ∆tvi
    liquid.sh.update(pid, part[P.X], part[P.Y]); // №2 Эксп. способ стабилизации
  });
  foreachIds(liquid.p, updatedPids, (part, pid) => {
    doubleDensityRelaxation(liquid, part, pid, dt);
  });
  resolveCollisions(liquid, activeRect, worldBounds, updatedPids);
  endComputing(liquid, updatedPids, dt, particlesPrevPositions);
}
