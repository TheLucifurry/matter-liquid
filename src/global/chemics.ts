import { F, P } from '../constants'
import { checkPointInRect } from '../helpers/utils'

const Chemics = {
  trans(liquid: TLiquid, pids: number[], fid: number): void {
    const linkList = liquid._fluidByParticleId
    const nextFluidProto = liquid._fluids[fid]
    pids.forEach((pid) => {
      const oldFluidProto = liquid._fluidByParticleId[pid]
      linkList[pid] = nextFluidProto
      liquid._statistics._particlesCountByFluidId[oldFluidProto[F.ID] as number]--
      liquid._statistics._particlesCountByFluidId[nextFluidProto[F.ID] as number]++
    })
  },
  transByName(liquid: TLiquid, pids: number[], fluidKey: TFluidKey): void {
  // @ts-expect-error Hard type flow
    Chemics.trans(liquid, pids, Matter.Liquid.getFluidId(liquid, fluidKey))
  },
  transRect(liquid: TLiquid, tofluidKey: TFluidKey, zoneX: number, zoneY: number, zoneWidth: number, zoneHeight: number): void {
    // @ts-expect-error Hard type flow
    const fid = Matter.Liquid.getFluidId(liquid, tofluidKey)
    // TODO: Optimize particle finding by using SpatialHash
    const pids: number[] = []
    liquid._particles.forEach((part, pid) => {
      if (part !== null && checkPointInRect(part[P.X], part[P.Y], [zoneX, zoneY, zoneX + zoneWidth, zoneY + zoneHeight]))
        pids.push(pid)
    })
    Chemics.trans(liquid, pids, fid)
  },
  reacts(liquid: TLiquid, fluidKey: TFluidKey, callback: TChemicalReactionCallback) {
    // @ts-expect-error Hard type flow
    const fid = Matter.Liquid.getFluidId(liquid, fluidKey)
    liquid._chemicsStore._isReactableByFid[fid] = true
    liquid._chemicsStore._callbackByFid[fid] = callback
  },
  // reactsBody
}
export default Chemics
