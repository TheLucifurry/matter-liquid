// import 'https://cdn.jsdelivr.net/gh/liabru/matter-js@0.15.0/build/matter.min.js';
// import 'https://cdn.jsdelivr.net/gh/liabru/matter-tools@0.11.1/build/matter-tools.demo.min.js';
// import '../build/matter-liquid.js';

import * as Utils from './lib/utils.js';

// install plugin
Matter.use(
  'matter-liquid', // PLUGIN_NAME
);

export default function () {
  const { Engine, Render, Runner, MouseConstraint, Mouse, World, Bodies } = Matter;

  // create engine
  const engine = Engine.create();
  const { world } = engine;

  // create renderer
  const render = Render.create({
    element: document.body,
    engine,
    options: {
      width: document.documentElement.clientWidth * 0.8,
      height: document.documentElement.clientHeight * 0.8,
      showVelocity: true,
    },
  });
  Render.run(render);

  // create runner
  const runner = Runner.create();
  Runner.run(runner, engine);

  // add bodies
  // World.add(world, [
  //   // walls
  //   Bodies.rectangle(400, 0, 800, 20, { isStatic: true }),
  //   Bodies.rectangle(400, 600, 800, 20, { isStatic: true }),
  //   Bodies.rectangle(800, 300, 20, 600, { isStatic: true }),
  //   Bodies.rectangle(0, 300, 20, 600, { isStatic: true }),
  //   // Platforms
  //   Bodies.rectangle(300, 180, 600, 20, { isStatic: true, angle: Math.PI * 0.06 }),
  //   Bodies.rectangle(300, 350, 600, 20, { isStatic: true, angle: Math.PI * 0.06 }),
  //   Bodies.rectangle(600, 500, 600, 20, { isStatic: true, angle: Math.PI * -0.03 }),
  //   // Blocks
  //   Bodies.rectangle(300, 70, 40, 40),
  //   Bodies.rectangle(300, 250, 40, 40),
  //   Bodies.rectangle(300, 430, 40, 40),
  //   Bodies.circle(100, 100, 10)
  // ]);

  // add mouse control
  const mouse = Mouse.create(render.canvas);
  const mouseConstraint = MouseConstraint.create(engine, {
    mouse,
    constraint: {
      stiffness: 0.2,
      render: {
        visible: false,
      },
    },
  });

  World.add(world, mouseConstraint);

  // keep the mouse in sync with rendering
  render.mouse = mouse;

  // fit the render viewport to the scene
  Render.lookAt(render, {
    min: { x: 0, y: 0 },
    max: { x: 800, y: 600 },
  });


  // onpressedPointer(render.canvas.nextElementSibling(), function (e) {
  //   Matter.liquid.spawnLiquid(1, e.offsetX, e.offsetY)
  // })

  pluginUsingExample();

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

async function pluginUsingExample() {
  await Utils.waitField(window, 'MIRROR_CANVAS');

  const Liquid = Matter.liquid

  const staticid = Liquid.createLiquid({
    isStatic: true,
    color: 'darkgray',
  });
  const dynamicid = Liquid.createLiquid({
    color: 'cyan',
  });
  // Liquid.fillZoneByLiquid(10, 10, 1000, 0, staticid)
  // Liquid.fillZoneByLiquid(10, 770, 1000, 0, staticid)
  // Liquid.fillZoneByLiquid(10, 10, 0, 750, staticid)
  // Liquid.fillZoneByLiquid(1000, 10, 10, 750, staticid)

  Liquid.fillZoneByLiquid(50, 50, 300, 300, dynamicid)
  // Liquid.fillZoneByLiquid(100, 100, 1, 1, dynamicid)

  const activeZoneParams = [10, 10, 400, 400];
  const renderZoneParams = [1, 1, 1000, 770];
  Liquid.setZone(Liquid.zoneType.ACTIVE, ...activeZoneParams);
  Liquid.setZone(Liquid.zoneType.RENDER, ...renderZoneParams);

  Utils.onclick(window.MIRROR_CANVAS, function () {
    activeZoneParams[2] += 15;
    activeZoneParams[3] += 10;
    Liquid.setZone(Liquid.zoneType.ACTIVE, ...activeZoneParams);
  })
  Utils.onmove(window.MIRROR_CANVAS, function () {

  })
}