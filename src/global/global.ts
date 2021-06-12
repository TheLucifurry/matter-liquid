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
      Matter.Events.off(liquid.e, 'afterUpdate', liquid.u);
    } else {
      Matter.Events.on(liquid.e, 'afterUpdate', liquid.u);
    }
    liquid.ip = isPause;
    liquid.ev.pauseChange(isPause);
  },
  setRenderBoundsPadding(liquid: TLiquid, padding: number): void {
    liquid.rbp = padding;
  },
  setActiveBoundsPadding(liquid: TLiquid, padding: number): void {
    liquid.abp = padding;
  },
  setGravityRatio(liquid: TLiquid, ratio: number = liquid.g): void {
    liquid.g = ratio;
  },
  setTimeScale(liquid: TLiquid, value: number = liquid.dt): void {
    liquid.dt = value;
  },

  getGravity(liquid: TLiquid): TVector {
    return [liquid.w.gravity.x * liquid.g, liquid.w.gravity.y * liquid.g];
  },
  getParticlesCount(liquid: TLiquid): number {
    return liquid.p.length - liquid.fpids.length;
  },
  getFluidId(liquid: TLiquid, fluidKey: TFluidKey): number {
    if (DEV) {
      if (typeof fluidKey === 'string' && liquid.fnfid[fluidKey] == null) {
        throw new Error(`MatterLiquid: liquid prototype named "${fluidKey}" does not exist`);
      }
    }
    return typeof fluidKey === 'number' ? fluidKey : liquid.fnfid[fluidKey];
  },
};

export default GlobalLiquid;

declare global {
  type TGlobalLiquid = typeof GlobalLiquid;
}
