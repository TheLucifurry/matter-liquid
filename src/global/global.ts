import Matter from 'matter-js';
import Liquid from '../liquid/liquid';
import Dripper from './dripper';
import Dryer from './dryer';
import Chemics from './chemics';
import VirtualCanvas from '../helpers/virtualCanvas';
import * as Utils from '../helpers/utils';
import * as Cycles from '../helpers/cycles';
import * as Vector from '../helpers/vector';

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
    if (isPause) {
      Matter.Events.off(liquid.engine, 'afterUpdate', liquid.updateCompute);
    } else {
      Matter.Events.on(liquid.engine, 'afterUpdate', liquid.updateCompute);
    }
    liquid.isPaused = isPause;
    liquid.events.pauseChange(isPause);
  },
  setRenderBoundsPadding(liquid: TLiquid, padding: number): void {
    liquid.renderBoundsPadding = padding;
  },
  setActiveBoundsPadding(liquid: TLiquid, padding: number): void {
    liquid.activeBoundsPadding = padding;
  },
  setGravityRatio(liquid: TLiquid, ratio: number = liquid.gravityRatio): void {
    liquid.gravityRatio = ratio;
  },
  setTimeScale(liquid: TLiquid, value: number = liquid.timeDelta): void {
    liquid.timeDelta = value;
  },

  getGravity(liquid: TLiquid): TVector {
    return [liquid.world.gravity.x * liquid.gravityRatio, liquid.world.gravity.y * liquid.gravityRatio];
  },
  getParticlesCount(liquid: TLiquid): number {
    return liquid.particles.length - liquid.freeParticleIds.length;
  },
  getFluidId(liquid: TLiquid, fluidKey: TFluidKey): number {
    if (DEV) {
      if (typeof fluidKey === 'string' && liquid.fluidIdByParticleId[fluidKey] == null) {
        throw new Error(`MatterLiquid: liquid prototype named "${fluidKey}" does not exist`);
      }
    }
    return typeof fluidKey === 'number' ? fluidKey : liquid.fluidIdByParticleId[fluidKey];
  },
};

export default GlobalLiquid;

declare global {
  type TGlobalLiquid = typeof GlobalLiquid;
}
