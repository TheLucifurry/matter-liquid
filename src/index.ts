import Matter from 'matter-js';
import pkg from '../package.json';
import { setGravity } from './config';
import {
  createLiquid,
  fillZoneByLiquid,
  spawnLiquid
} from './liquid';
import {
  init,
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
      console.log('Render:');
      console.dir(this);
      setZone(zoneType.ACTIVE, this.bounds.min.x, this.bounds.min.y, this.bounds.max.x, this.bounds.max.y);
      setZone(zoneType.RENDER, this.bounds.min.x, this.bounds.min.y, this.bounds.max.x, this.bounds.max.y);
      setTimeout(() => {
        //@ts-ignore
        const stats = new Stats();
        stats.showPanel(0);
        document.body.append(stats.dom);

        const worldWidth = 1500;

        init(worldWidth);

        matter.after('Engine.update', function(){
          stats.begin();
          update();
          stats.end();
        });

      }, 1000);
    });
    matter.after('World.create', function(this: Matter.World) {
      console.log('World:');
      console.dir(this);
      setGravity(this.gravity.y, this.gravity.x)
    })
    // matter.after('Engine.update', update)

  },
};

//@ts-ignore
Matter.Plugin.register(MatterLiquid);

export default MatterLiquid;
