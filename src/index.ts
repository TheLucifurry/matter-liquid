import Package from '../package.json';
import GlobalLiquid from './global/global';

const MatterLiquid = {
  name: Package.name,
  version: Package.version,
  for: 'matter-js@0.16.1',
  // uses: [],
  // options: {
  //   something: true,
  // },
  install(matter: any) {
    matter.Liquid = GlobalLiquid;
  },
};

// @ts-ignore
Matter.Plugin.register(MatterLiquid);
