import Liquid from '../liquid/liquid';
import Dripper from './dripper';
import Dryer from './dryer';
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
};

export default GlobalLiquid;

declare global {
  type TGlobalLiquid = typeof GlobalLiquid;
}
