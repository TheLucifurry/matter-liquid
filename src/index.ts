import Package from '../package.json';
import Liquid from './liquid';

const MatterLiquid = {
  name: Package.name,
  version: Package.version,
  for: `matter-js@0.16.1`,
  // uses: [],
  // options: {
  //   something: true,
  // },
  install(matter: any) {
    if (DEV) {
      console.log('Matter.js Plugin installed:');
      console.dir({ MatterLiquid });
    }

    matter.Liquid = {
      create(config: TLiquidConfig) {
        return new Liquid(config);
      },
    }
  },
};

//@ts-ignore
Matter.Plugin.register(MatterLiquid);
