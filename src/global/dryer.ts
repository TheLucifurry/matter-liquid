import { F_ID, X, Y } from '../constants'
import { arrayEach } from '../helpers/cycles'
import { checkPointInRect } from '../helpers/utils'

const Dryer = {
  dry(liquid: TLiquid, pid: number): void {
    const prototype = liquid._fluidByParticleId[pid]
    const particle = liquid._particles[pid]
    liquid._particles[pid] = null
    liquid._spatialHash.remove(pid)
    liquid._events.particleRemove(particle, pid, prototype)
    if (!liquid._freeParticleIds.includes(pid))
      liquid._freeParticleIds.unshift(pid)

    liquid._statistics._particlesCountByFluidId[prototype[F_ID] as number]--
  },
  rect(liquid: TLiquid, zoneX: number, zoneY: number, zoneWidth: number, zoneHeight: number): void {
    const inboundsParticles = liquid._spatialHash.getFromRect([zoneX, zoneY, zoneX + zoneWidth, zoneY + zoneHeight])
    arrayEach<TParticleId>(inboundsParticles, (pid) => {
      const part = liquid._particles[pid]
      if (part !== null && checkPointInRect(part[X], part[Y], [zoneX, zoneY, zoneX + zoneWidth, zoneY + zoneHeight]))
        Dryer.dry(liquid, pid)
    })
  },
  // TODO: methods circle, shape (using Matter geom) etc.
}
export default Dryer
