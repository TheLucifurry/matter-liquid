import Matter from 'matter-js'
import Liquid from '../liquid/liquid'
import VirtualCanvas from '../helpers/virtualCanvas'

// import * as Utils from '../helpers/utils'
// import * as Cycles from '../helpers/cycles'
// import * as Vector from '../helpers/vector'
import Chemics from './chemics'
import Dryer from './dryer'
import Dripper from './dripper'

const GlobalLiquid = {
  utils: {
    VirtualCanvas,
    // ...Utils,
    // ...Cycles,
    // ...Vector,
  },
  create: Liquid,
  drip: Dripper,
  dry: Dryer,
  chemics: Chemics,

  setPause(liquid: TLiquid, isPause = true): void {
    if (isPause)
      Matter.Events.off(liquid._engine, 'afterUpdate', liquid._updateCompute)

    else
      Matter.Events.on(liquid._engine, 'afterUpdate', liquid._updateCompute)

    liquid._isPaused = isPause
    liquid._events.pauseChange(isPause)
  },
  setRenderBoundsPadding(liquid: TLiquid, padding: number): void {
    liquid._renderBoundsPadding = padding
  },
  setActiveBoundsPadding(liquid: TLiquid, padding: number): void {
    liquid._activeBoundsPadding = padding
  },
  setGravityRatio(liquid: TLiquid, ratio: number = liquid._gravityRatio): void {
    liquid._gravityRatio = ratio
  },
  setTimeScale(liquid: TLiquid, value: number = liquid._timeDelta): void {
    liquid._timeDelta = value
  },

  getGravity(liquid: TLiquid): TVector {
    return [liquid._world.gravity.x * liquid._gravityRatio, liquid._world.gravity.y * liquid._gravityRatio]
  },
  getParticlesCount(liquid: TLiquid): number {
    return liquid._particles.length - liquid._freeParticleIds.length
  },
  getFluidId(liquid: TLiquid, fluidKey: TFluidKey): number {
    if (DEV) {
      if (typeof fluidKey === 'string' && liquid._fluidIdByParticleId[fluidKey] == null)
        throw new Error(`MatterLiquid: liquid prototype named "${fluidKey}" does not exist`)
    }
    return typeof fluidKey === 'number' ? fluidKey : liquid._fluidIdByParticleId[fluidKey]
  },
}

export default GlobalLiquid

declare global {
  type TGlobalLiquid = typeof GlobalLiquid
}
