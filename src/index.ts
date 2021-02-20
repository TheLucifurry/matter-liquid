import Matter from 'matter-js';
import Package from '../package.json';
import { EVENT_TYPES } from './enums';
import Liquid from './liquid';

const MatterLiquid = {
  // Original
  name: Package.name,
  version: Package.version,
  for: `matter-js@0.16.1`,
  // uses: [],
  // options: {
  //   something: true,
  // },
  //@ts-ignore
  install(matter) {
    console.log('Matter.js Plugin installed:');
    console.dir({ MatterLiquid });

    matter.Liquid = {
      create(config: TLiquidConfig) {
        return new Liquid(config);
      },
      events: EVENT_TYPES,
    }
  },
};

//@ts-ignore
Matter.Plugin.register(MatterLiquid);

export default MatterLiquid;
