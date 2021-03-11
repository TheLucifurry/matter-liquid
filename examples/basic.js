import * as Util from './lib/utils.js';

export default function () {
  const { Engine, Render, Runner, MouseConstraint, Mouse, World, Body, Bodies, Constraint, Vector, Liquid } = Matter;

  // create engine
  const engine = Engine.create();
  const { world } = engine;

  // create renderer
  const render = Render.create({
    element: document.body,
    engine,
    options: {
      width: document.documentElement.clientWidth * 0.9,
      height: document.documentElement.clientHeight * 0.9,
      wireframes: false,
    },
  });
  Render.run(render);

  // world bounds
  const worldSize = 1024;
  world.bounds.min.x = -worldSize / 2;
  world.bounds.min.y = -worldSize / 2;
  world.bounds.max.x = worldSize / 2;
  world.bounds.max.y = worldSize / 2;

  // Background
  const background = Bodies.rectangle(0, 0, world.bounds.max.x - world.bounds.min.x, world.bounds.max.y - world.bounds.min.y, {
    isStatic: true,
    render: {
      fillStyle: '#101840',
    }
  });
  World.add(world, background);

  const renderPadding = 50;
  Render.lookAt(render, {
    min: { x: world.bounds.min.x - renderPadding, y: world.bounds.min.y - renderPadding },
    max: { x: world.bounds.max.x + renderPadding, y: world.bounds.max.y + renderPadding },
  });

  // create runner
  const runner = Runner.create();
  Runner.run(runner, engine);

  const liquid = Liquid.create({
    engine,
    render,
    liquids: [{ color: 'cyan' }], // Define one liquid type with cyan color
    updateEveryFrame: 1,          // Set max 60 FPS
  });

  // add mouse control
  const mouse = Mouse.create(render.canvas);
  const mouseConstraint = MouseConstraint.create(engine, {
    mouse,
    constraint: {
      render: { visible: false },
    },
  });
  World.add(world, mouseConstraint);
  render.mouse = mouse; // keep the mouse in sync with rendering

  pluginUsing(liquid);
  setDripper(render, liquid, mouseConstraint);

  // For stats
  window.ON_LIQUID_STARTED(liquid);

  // context for MatterTools.Demo
  return {
    engine,
    runner,
    render,
    canvas: render.canvas,
    stop() {
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
    },
  };
};

function setDripper(render, liquid, mouseConstraint) {
  const liquidCyanId = 0;
  const radius = 100;
  Util.onpressedPointer(render.canvas, (event, isMainButton) => {
    let point = mouseConstraint.mouse.position;
    const x = point.x - radius, y = point.y - radius;
    if (isMainButton) {
      liquid.fillZoneByLiquid(x, y, radius * 2, radius * 2, liquidCyanId);
    } else {
      liquid.clearZoneByLiquid(x, y, radius * 2, radius * 2, liquidCyanId);
    }
  }, 50);
}

function pluginUsing(liquid) {
  const liquidCyanId = 0;
  const worldBounds = liquid.store.world.bounds;
  const worldXmin = worldBounds.min.x;
  const worldXmax = worldBounds.max.x;
  const worldYmin = worldBounds.min.y;
  const worldYmax = worldBounds.max.y;
  const worldWidth = worldXmax - worldXmin;

  const seaHeight = 400;

  liquid.fillZoneByLiquid(worldXmin, worldYmax - seaHeight, worldWidth, seaHeight, liquidCyanId);
}
