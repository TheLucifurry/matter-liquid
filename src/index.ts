import Matter from 'matter-js';
import pkg from '../package.json';
import {
  createLiquid,
  fillZoneByLiquid,
  spawnLiquid
} from './liquid';
import {
  init,
  // setRenderer,
  update
} from './main';
import { setZone, zoneType } from './zones';

const MatterLiquid = {
  // Original
  name: pkg.name,
  version: pkg.version,
  for: `matter-js@0.15.0`,
  // uses: [],
  // options: {
  //   something: true,
  // },
  //@ts-ignore
  install(matter) {
    console.log('Matter.js Plugin installed:');
    console.dir({ MatterLiquid });

    matter.liquid = {
      zoneType,
      setZone,
      createLiquid,
      spawnLiquid,
      fillZoneByLiquid,
    };
    matter.after('Render.create', function(this: Matter.Render) {
      // setRenderer.call(this);

      setTimeout(() => {
        //@ts-ignore
        const stats = new Stats();
        stats.showPanel(0);
        document.body.append(stats.dom);

        matter.after('Engine.update', function(){
          stats.begin();
          update();
          stats.end();
        });

        init();
      }, 1000);
    });
    // matter.after('Engine.create', function(this: Matter.Engine) {
    // })
    // matter.after('Engine.update', update)

  },
};

//@ts-ignore
Matter.Plugin.register(MatterLiquid);

export default MatterLiquid;
