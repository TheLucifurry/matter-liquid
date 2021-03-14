import Package from '../package.json';
import VirtualCanvas from './helpers/virtualCanvas';
import Liquid from './liquid/index';

const MatterLiquid = {
  name: Package.name,
  version: Package.version,
  for: 'matter-js@0.16.1',
  // uses: [],
  // options: {
  //   something: true,
  // },
  install(matter: any) {
    matter.Liquid = {
      create(config: TLiquidConfig) {
        return new Liquid(config);
      },
      VirtualCanvas,
    };
  },
};

// @ts-ignore
Matter.Plugin.register(MatterLiquid);
