import Matter from 'matter-js';
import Liquid from '../liquid/liquid';
import Dripper from './dripper';
import Dryer from './dryer';
import VirtualCanvas from '../helpers/virtualCanvas';
import * as Utils from '../helpers/utils';
import * as Cycles from '../helpers/cycles';
import * as Vector from '../helpers/vector';

const GlobalLiquid = {
  _: {},
  utils: {
    VirtualCanvas,
    // ...Utils,
    // ...Cycles,
    // ...Vector,
  },
  create: (config: TLiquidConfig) => Liquid(config, GlobalLiquid),
  drip: Dripper,
  dry: Dryer,

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
  getLiquidId(liquid: TLiquid, liquidKey: TLiquidKey): number {
    if (DEV) {
      if (typeof liquidKey === 'string' && liquid.lnlid[liquidKey] == null) {
        throw new Error(`MatterLiquid: liquid prototype named "${liquidKey}" does not exist`);
      }
    }
    return typeof liquidKey === 'number' ? liquidKey : liquid.lnlid[liquidKey];
  },
};

export default GlobalLiquid;
