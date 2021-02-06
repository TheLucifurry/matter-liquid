import Matter from 'matter-js';
import pkg from '../package.json';
import * as Algorithm from './algorithm';
import * as Events from './events';
import * as Liquid from './liquid';
import {
  createLiquid,
  fillZoneByLiquid,
  spawnLiquid
} from './liquid';
import * as Render from './render';
import * as State from './state';
import * as Zone from './zones';

const MatterLiquid = {
  // Original
  name: pkg.name,
  version: pkg.version,
  for: `matter-js@0.16.1`,
  // uses: [],
  // options: {
  //   something: true,
  // },
  //@ts-ignore
  install(matter) {
    console.log('Matter.js Plugin installed:');
    console.dir({ MatterLiquid });

    matter.liquid = {
      Zone,
      Config: State,
      Events,
      createLiquid,
      spawnLiquid,
      fillZoneByLiquid,
    };

    // TODO: change hardcode to spatialHash's adaptivity by
    const worldWidth = 5000;
    const deltaTime = 1;

    matter.after('Render.create', function(this: Matter.Render) {
      console.log('Render:');
      console.dir(this);
      Zone.setZonesParamsFromRenderer(this);
      Zone.setZone(Zone.types.ACTIVE, this.bounds.min.x, this.bounds.min.y, this.bounds.max.x, this.bounds.max.y);
      Zone.setZone(Zone.types.RENDER, this.bounds.min.x, this.bounds.min.y, this.bounds.max.x, this.bounds.max.y);

      Liquid.init(worldWidth, 64);
      Render.init(this);

      matter.after('Engine.update', function(){
        Events.emit(Events.types.BEFORE_UPDATE);
        Algorithm.update(deltaTime);
        Render.update();
        Events.emit(Events.types.AFTER_UPDATE);
      });
      // matter.after('Render.update', function () {
      //   rendererUpdate();
      // })
    });
    matter.after('World.create', function(this: Matter.World) {
      console.log('World:');
      console.dir(this);
      State.setWorld(this);
      State.setGravity(this.gravity.y, this.gravity.x);
    })
    // matter.after('Engine.update', update)
  },
};

//@ts-ignore
Matter.Plugin.register(MatterLiquid);

export default MatterLiquid;
