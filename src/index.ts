import Matter from 'matter-js';
import Package from '../package.json';
import * as Algorithm from './algorithm';
import * as Events from './events';
import * as Liquid from './liquid';
import * as Render from './render';
import * as State from './state';

const { Store } = State;

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

    const { createLiquid, spawnLiquid, fillZoneByLiquid } = Liquid;

    matter.liquid = {
      Store,
      State,
      Events,
      createLiquid,
      spawnLiquid,
      fillZoneByLiquid,
    };

    // TODO: change hardcode to spatialHash's adaptivity by
    const worldWidth = 5000;
    const deltaTime = 1;

    const starter = start();

    matter.after('Render.create', function(this: Matter.Render) {
      State.setRender(this);
      // State.setRenderBoundsPadding(-50)
      // State.setActiveBoundsPadding(-100)
      starter.next();
    });
    matter.after('World.create', function(this: Matter.World) {
      State.setWorld(this);
      State.setGravity(this.gravity.y, this.gravity.x);
      starter.next();
    });
    matter.after('Engine.create', function(this: Matter.Engine) {
      State.setEngine(this);
      starter.next();
    });

    function updateComputing(){
      Algorithm.update(deltaTime);
    }
    function updateRender(){
      Render.update();
    }

    function* start() {
      yield 0;
      yield 0;

      console.log('Store:');
      console.dir(Store);
      Liquid.init(worldWidth, 64);
      Events.on(Events.types.PAUSED, ()=>Matter.Events.off(Store.engine, 'afterUpdate', updateComputing));
      Events.on(Events.types.CONTINUE, ()=>Matter.Events.on(Store.engine, 'afterUpdate', updateComputing));
      State.setPause(false);
      Matter.Events.on(Store.render, 'afterRender', updateRender)
      Events.emit(Events.types.STARTED);
    }
  },
};

//@ts-ignore
Matter.Plugin.register(MatterLiquid);

export default MatterLiquid;
