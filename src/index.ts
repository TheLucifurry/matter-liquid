import Matter from 'matter-js';
import Package from '../package.json';
import Liquid from './liquid';
// import ASL from '@assemblyscript/loader';

// fetch('./build/wasmModule.wasm')
//   .then(ASL.instantiateStreaming)
//   .then(wasmModule=>{
//     // const wasmModule = ASL.instantiateStreaming(data);

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
    }
  },
};

//@ts-ignore
Matter.Plugin.register(MatterLiquid);
  // })
// export default MatterLiquid;
