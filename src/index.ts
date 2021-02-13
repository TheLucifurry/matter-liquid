import Matter from 'matter-js';
import Package from '../package.json';
import * as Algorithm from './algorithm';
import * as Events from './events';
import * as Liquid from './liquid';
import * as Render from './render';
import * as StateManager from './state';

const { State } = StateManager;

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
      StateManager.setRender(this);
      StateManager.setRenderBoundsPadding(-100)
      StateManager.setActiveBoundsPadding(-200)
      starter.next();
    });
    matter.after('World.create', function(this: Matter.World) {
      StateManager.setWorld(this);
      StateManager.setGravity(this.gravity.y, this.gravity.x);
      starter.next();
    });
    matter.after('Engine.create', function(this: Matter.Engine) {
      StateManager.setEngine(this);
      starter.next();
    });

    function* start() {
      yield 0;
      yield 0;

      console.log('State:');
      console.dir(State);
      Liquid.init(worldWidth, 64);
      Matter.Events.on(State.engine, 'afterUpdate', function(){
        Algorithm.update(deltaTime);
      })
      Matter.Events.on(State.render, 'afterRender', function(){
        Render.update();
      })
      Events.emit(Events.types.STARTED);
    }
  },
};

//@ts-ignore
Matter.Plugin.register(MatterLiquid);

export default MatterLiquid;
