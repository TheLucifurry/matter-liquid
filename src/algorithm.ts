import { F_ID, F_MASS, VELOCITY_LIMIT_FACTOR, VEL_X, VEL_Y, X, Y } from './constants'
import {
  vectorAddVector,
  vectorClampMaxLength,
  vectorDiv,
  vectorEqualsVector,
  vectorFromTwo,
  vectorLength,
  vectorMul,
  vectorNormal,
  vectorSubVector,
} from './helpers/vector'
import { foreachActive, foreachIds, getNeighbors } from './helpers/cycles'
import {
  checkBodyContainsPoint,
  getBodiesInRect,
  getBodySurfaceIntersectsWithRay,
  getBodySurfaceNormal,
  getLineIntersectionPoint,
  getParticlesInsideBodyIds,
  getRectFromBoundsWithPadding,
} from './helpers/tools'
import {
  checkPointInRect,
  mathClamp,
  mathMax,
  mathWrap,
} from './helpers/utils'

const p0 = 10 // rest density
const k = 0.004 // stiffness
// const kNear = 10 // stiffness near (вроде, влияет на текучесть)
const sigma = 0.1 //
const beta = 0.1 // 0 - вязкая жидкость
const mu = 1 // friction, 0 - скольжение, 1 - цепкость

const Len = 10 // длина упора пружины; (хорошо ведут себя значения в пределах 20-100)
const kSpring = 0.001 // (в доке по дефолту 0.3)
const alpha = 0.03 // α - константа пластичности

function getR(a: TParticle, b: TParticle): TVector {
  return vectorFromTwo([a[X], a[Y]], [b[X], b[Y]])
}
function computeI(part: TParticle, body: Matter.Body): TVector {
  const bodyVelVector: TVector = [body.velocity.x, body.velocity.y]
  const v_ = vectorSubVector([part[VEL_X], part[VEL_Y]], bodyVelVector) // vi − vp
  // const n_ = vectorNormal([body.position.x, body.position.y]);
  // const vNormal = vectorMulVector(vectorMulVector(v_, n_), n_); // = (v¯ * nˆ)nˆ
  const vNormal = vectorNormal(v_) // = (v¯ * nˆ)nˆ
  const vTangent = vectorSubVector(v_, vNormal) // v¯ − v¯normal
  return vectorSubVector(vNormal, vectorMul(vTangent, mu)) // v¯normal - µ * v¯tangent
}
function partPosAdd(part: TParticle, vec: TVector, maxLength: number) {
  // const limited: TVector = vectorClampMaxLength(vec, maxLength);
  const limited: TVector = vec
  part[X] += limited[0]
  part[Y] += limited[1]
}
function applyGravity(part: TParticle, dt: number, gravity: TVector, mass: number) {
  part[VEL_X] += dt * mass * gravity[0]
  part[VEL_Y] += dt * mass * gravity[1]
}
function addParticlePositionByVelocity(part: TParticle, dt: number) {
  part[X] += dt * part[VEL_X]
  part[Y] += dt * part[VEL_Y]
}
function computeNextVelocity(part: TParticle, dt: number, prevPositions: TVector) {
  part[VEL_X] = (part[X] - prevPositions[0]) / dt
  part[VEL_Y] = (part[Y] - prevPositions[1]) / dt
}
function limitVelocity(part: TParticle, maxValue: number) {
  const [limX, limY]: TVector = vectorClampMaxLength([part[VEL_X], part[VEL_Y]], maxValue)
  part[VEL_X] = limX
  part[VEL_Y] = limY
}

function doubleDensityRelaxation(liquid: TLiquid, i: TParticle, iPid: number, dt: number) {
  const mass = liquid._fluidByParticleId[iPid][F_MASS] as number
  const iFid = liquid._fluidByParticleId[iPid][F_ID] as number
  const p0 = liquid._h * 0.2 // rest density
  const k = 0.3 // stiffness range[0..1]
  const kNear = liquid._h * 0.3 // stiffness near (вроде, влияет на текучесть)
  const maxStep = liquid._h * 0.8

  // Chemics
  const chemics = liquid._chemicsStore
  const currentLiquidProto = liquid._fluidByParticleId[iPid]
  const isRecordCollisions = chemics._isReactableByFid[iFid] && chemics._isReadyByFid[iFid]
  if (isRecordCollisions)
    chemics._data[iFid][iPid] = []

  let p = 0
  let pNear = 0
  const neighbors = getNeighbors(liquid, iPid)
  const pairsDataList: [oneMinQ: number, jPid: number, r: TVector][] = Array(neighbors.length)
  for (let n = 0; n < neighbors.length; n++) {
    const jPid = neighbors[n]
    const j = liquid._particles[jPid]
    const r = getR(i, j)
    const q = vectorLength(vectorDiv(r, liquid._h)) // q ← rij/h
    // if (q < 1) {...} - не нужен, т.к. в SH гарантирует этому условию true
    // const oneMinQ = 1 - q;
    const oneMinQ = mathMax(1 - q, 0.5) // { mathMax(..., 0.5) } Экспериментальный способ по стабилизации высокоплотных скоплений частиц
    p += oneMinQ ** 2
    pNear += oneMinQ ** 3
    pairsDataList[n] = [oneMinQ, jPid, r]

    // Chemics
    if (isRecordCollisions && liquid._fluidByParticleId[jPid] !== currentLiquidProto)
      chemics._data[iFid][iPid].push(jPid)
  }
  // const P = k * (p - p0);
  const pBig = k * (p - p0) * mass // { * mass } Экспериментальный способ учета массы при взаимодействии
  const PNear = kNear * pNear
  const dx: TVector = [0, 0]
  for (let n = 0; n < pairsDataList.length; n++) {
    const [oneMinQ, jPid, r] = pairsDataList[n]
    const j = liquid._particles[jPid]
    const rNormal = vectorNormal(r)
    const D = vectorMul(rNormal, dt ** 2 * (pBig * oneMinQ + PNear * oneMinQ ** 2))
    const halfD = vectorDiv(D, 2)
    dx[0] -= halfD[0]
    dx[1] -= halfD[1]
    partPosAdd(j, halfD, maxStep)
    liquid._spatialHash.update(jPid, j[0], j[1])
  }
  partPosAdd(i, dx, maxStep)
  liquid._spatialHash.update(iPid, i[0], i[1])
}
function applyI(part: TParticle, I: TVector) {
  part[VEL_X] -= I[0]
  part[VEL_Y] -= I[1]
}
function findOutsidePos(body: Matter.Body, prevParticlePos: TVector, currentParticlePos: TVector): TVector {
  const bodyPos: TVector = [body.position.x, body.position.y]
  if (body.circleRadius) { // is body a circle
    const surfNorm = vectorNormal(vectorFromTwo(bodyPos, currentParticlePos))
    return vectorAddVector(bodyPos, vectorMul(surfNorm, body.circleRadius))
  }
  const endParticlePos: TVector = !vectorEqualsVector(prevParticlePos, currentParticlePos) ? currentParticlePos : bodyPos
  const surface: [TVector, TVector] = getBodySurfaceIntersectsWithRay(body, endParticlePos, prevParticlePos)
  const surfNorm = getBodySurfaceNormal(surface[0], surface[1])
  return getLineIntersectionPoint(surface[0], surface[1], prevParticlePos, vectorAddVector(prevParticlePos, surfNorm))
}

function resolveCollisions(liquid: TLiquid, activeZone: TRect, worldBounds: TBounds, updatablePids: number[]) {
  const { _particles: particles } = liquid
  const bodies = activeZone ? getBodiesInRect(liquid._world.bodies, activeZone) : liquid._world.bodies
  const originalBodiesData: TOriginalBodyData[] = []
  // const bodiesContainsParticleIds: number[][] = [];
  const processedBodies: Matter.Body[] = []
  const buffer: TVector[] = []
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
    const particlesInBodyIds = getParticlesInsideBodyIds(particles, body, liquid._spatialHash, updatablePids)
    foreachIds(particles, particlesInBodyIds, (part) => { // foreach particle inside the body
      if (!checkPointInRect(part[X], part[Y], worldBounds))
        return
      const I = computeI(part, body) // compute collision impulse I
      // console.log(`I: [${I.join(', ')}]`);
      const prevPos: TVector = [part[X], part[Y]]
      applyI(part, I) // apply I to the particle
      if (checkBodyContainsPoint(body, part[X], part[Y])) {
        // extract the particle if still inside the body
        const outsidePos: TVector = findOutsidePos(body, prevPos, [part[X], part[Y]])
        part[X] = outsidePos[0]
        part[Y] = outsidePos[1]
      }
    })
  })
}
function endComputing(liquid: TLiquid, updatedPids: number[], dt: number, particlesPrevPositions: TSavedParticlesPositions) {
  foreachIds(liquid._particles, updatedPids, (part, pid) => {
    // console.log(`part[${part.join(', ')}]\n`);
    computeNextVelocity(part, dt, particlesPrevPositions[pid]) // vi ← (xi − xi^prev )/∆t

    const bounce = liquid._worldBordersBounce
    const b = liquid._bounds
    if (!liquid._isWrappedX) {
      const oldX = part[X]
      part[X] = mathClamp(oldX, b[0], b[2])
      if (oldX !== part[X]) {
        part[VEL_X] *= -bounce
        part[VEL_Y] *= bounce
      }
    }
    else {
      part[X] = mathWrap(part[X], b[0], b[2])
    }
    if (!liquid._isWrappedY) {
      const oldY = part[Y]
      part[Y] = mathClamp(oldY, b[1], b[3])
      if (oldY !== part[Y]) {
        part[VEL_X] *= bounce
        part[VEL_Y] *= -bounce
      }
    }
    else {
      part[Y] = mathWrap(part[Y], b[1], b[3])
    }

    liquid._spatialHash.update(pid, part[X], part[Y])
  })

  // Chemics
  const chemics = liquid._chemicsStore
  const protoLinks = liquid._fluidByParticleId
  for (let fid = 0; fid < chemics._data.length; fid++) {
    if (!chemics._isReactableByFid[fid] || !chemics._isReadyByFid[fid])
      continue

    const liquidCollisions = chemics._data[fid]
    const owned: number[][] = []
    const other: number[][] = []
    liquid._fluids.forEach((_, ix) => { owned[ix] = []; other[ix] = [] })

    const iPids = Object.keys(liquidCollisions)
    for (let i = 0; i < iPids.length; i++) {
      const iPid: number = +iPids[i]
      const jPids = liquidCollisions[iPid]
      for (let j = 0; j < jPids.length; j++) {
        const jPid = jPids[j]
        const jFid = protoLinks[jPid][F_ID] as number
        owned[jFid].push(iPid)
        other[jFid].push(jPid)
      }
    }

    const collisionData: TChemicalReactionData = [owned, other]
    chemics._callbackByFid[fid](collisionData)
  }
}

export function simple(liquid: TLiquid, dt: number): void {
  const updatedPids: number[] = []
  // @ts-expect-error Hard type flow
  const gravity = Matter.Liquid.getGravity(liquid)
  const particlesPrevPositions: TSavedParticlesPositions = {}
  const activeRect: TRect = liquid._isRegionalComputing ? getRectFromBoundsWithPadding(liquid._render.bounds, liquid._activeBoundsPadding) : null
  const worldBounds: TBounds = liquid._bounds
  const limit = liquid._h * VELOCITY_LIMIT_FACTOR
  liquid._chemicsStore._data = liquid._fluids.map(() => ([]))

  foreachActive(liquid, activeRect, liquid._particles, (part, pid) => {
    updatedPids.push(pid)
    applyGravity(part, dt, gravity, liquid._fluidByParticleId[pid][F_MASS] as number) // vi ← vi + ∆tg
    particlesPrevPositions[pid] = [part[X], part[Y]] // Save previous position: xi^prev ← xi

    limitVelocity(part, limit)

    addParticlePositionByVelocity(part, dt) // Add Particle Position By Velocity: xi ← xi + ∆tvi
    liquid._spatialHash.update(pid, part[X], part[Y]) // №2 Эксп. способ стабилизации
  })
  foreachIds(liquid._particles, updatedPids, (part, pid) => {
    doubleDensityRelaxation(liquid, part, pid, dt)
  })
  resolveCollisions(liquid, activeRect, worldBounds, updatedPids)
  endComputing(liquid, updatedPids, dt, particlesPrevPositions)
}
