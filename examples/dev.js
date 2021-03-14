import { setDripper, setGravityControl } from './lib/fragments.js';

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
      showVelocity: true,
      showAngleIndicator: true,
      wireframes: false
    },
  });
  Render.run(render);

  const worldSize = 1000;
  const wallWidth = 100;

  world.bounds.min.x = -worldSize / 2;
  world.bounds.min.y = -worldSize / 2;
  world.bounds.max.x = worldSize / 2;
  world.bounds.max.y = worldSize / 2;

  const renderPadding = 100;
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
    liquids: [{
      color: 'lime',
    }, {
      color: 'red',
    }, {
      color: 'blue',
    }],
    // particleTextureScale: 0.7,
    // isAdvancedAlgorithm: true,
    // isRegionalComputing: true,
    // gravityRatio: 0.5,
    // radius: 64,
    // isPaused: true,
    isDebug: true,
    updateEveryFrame: 1,
    // timeScale: 1.5,
    // worldWrapping: [true, false],
  });

  const bodyStyle = { fillStyle: '#fff' };
  // add bodies

  const catapult = Bodies.rectangle(0, 0, 520, 40);
  World.add(world, [
    // walls
    // Bodies.rectangle(0, world.bounds.min.y + wallWidth / 2, worldSize, wallWidth, { isStatic: true, render: bodyStyle }),
    // Bodies.rectangle(world.bounds.max.x - wallWidth / 2, 0, wallWidth, worldSize, { isStatic: true, render: bodyStyle }),
    // Bodies.rectangle(0, world.bounds.max.y - wallWidth / 2, worldSize, wallWidth, { isStatic: true, render: bodyStyle }),
    // Bodies.rectangle(world.bounds.min.x + wallWidth / 2, 0, wallWidth, worldSize, { isStatic: true, render: bodyStyle }),

    // Constraint.create({
    //   bodyA: catapult,
    //   pointB: Vector.clone(catapult.position),
    // }),
    // catapult,
    // Bodies.rectangle(400, 750, 1200, wallWidth, { isStatic: true, render: bodyStyle }),
    // Bodies.rectangle(25, 300, wallWidth, 850, { isStatic: true, render: bodyStyle }),

    // Bodies.rectangle(400, 0, 800, 20, { isStatic: true }),
    // Bodies.rectangle(400, 600, 800, 20, { isStatic: true }),
    // Bodies.rectangle(800, 300, 20, 600, { isStatic: true }),
    // Bodies.rectangle(0, 300, 20, 600, { isStatic: true }),
    // Platforms
    // Bodies.rectangle(300, 180, 600, 20, { isStatic: true, angle: Math.PI * 0.06, render: bodyStyle }),
    // Bodies.rectangle(300, 350, 600, 20, { isStatic: true, angle: Math.PI * 0.06 }),
    // Bodies.rectangle(600, 500, 600, 20, { isStatic: true, angle: Math.PI * -0.03, render: bodyStyle }),
    // Blocks
    // Bodies.rectangle(300, 70, 40, 40),
    // Bodies.rectangle(300, 250, 40, 40),
    // Bodies.rectangle(300, 430, 40, 40),
    // Bodies.circle(100, 100, 10)

    Bodies.circle(0, -100, 60),

    // Bodies.rectangle(400, 250, 50, 50),
    // Bodies.rectangle(600, 250, 20, 100),
    // Bodies.rectangle(300, 350, 80, 80, { isStatic: true, render: bodyStyle }),
  ]);

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
  // TEST
  Matter.Events.on(mouseConstraint, "mousemove", function () {
    if (window.TEST_MOUSE_MOVE) window.TEST_MOUSE_MOVE(mouseConstraint);
  });

  World.add(world, mouseConstraint);

  // keep the mouse in sync with rendering
  render.mouse = mouse;

  pluginUsingExample(liquid);
  setGravityControl(engine);
  setDripper(render, liquid, mouseConstraint);

  window.DEMO_LOADED(liquid);
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

function pluginUsingExample(liquid) {
  const dynamicid = 0;
  const orangeid = 1;
  const violedid = 2;

  liquid.drip.rect(dynamicid, -500, 300, 1000, 300);
  liquid.drip.rect(orangeid, -500, -500, 300, 500);
  liquid.drip.rect(violedid, 200, -500, 300, 500);

  const space = 12;


  // Utils.onclick(window.MIRROR_CANVAS, function () {})
}