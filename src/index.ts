import asl from '@assemblyscript/loader';
import Package from '../package.json';
import ASModule from '../types/assembly';
import GlobalLiquid from './global/global';

asl.instantiate(fetch('build/assembly.wasm'))
  .then(({ exports }) => {
    const MatterLiquid = {
      name: Package.name,
      version: Package.version,
      for: 'matter-js@0.16.1',
      // uses: [],
      // options: {
      //   something: true,
      // },
      install(matter: any) {
        // @ts-ignore
        GlobalLiquid._.asm = exports;
        matter.Liquid = GlobalLiquid;
      },
    };

    // @ts-ignore
    Matter.Plugin.register(MatterLiquid);
  });

declare global {
  type TGlobalLiquid = typeof GlobalLiquid;
  type TASModule = asl.ASUtil & typeof ASModule;
  type CSpatialHash = ASModule.SpatialHash;
}
