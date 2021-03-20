import { setWorldSize, drawWorldBackground, drawWorldBorders, init, cameraLookAt, initMouse, setDripper, getWorldParams, loadBodies } from './lib/fragments.js';
import Colors from './lib/colors.js';

export default function () {
  const svgBodiesPaths = [
    'iconmonstr-paperclip-2-icon.svg',
    'iconmonstr-puzzle-icon.svg',
    'iconmonstr-direction-4-icon.svg',
  ].map(p => `./examples/svg/${p}`);

  const { World, Bodies, Liquid } = Matter;
  const { engine, world, render, runner } = init();

  const color = Colors.getPalette();
  const worldSize = 1024;
  const wallWidth = 50;
  const loadedBodiesScale = 0.4;
  const bodyWallStyle = { fillStyle: color.body, strokeStyle: color.particle, lineWidth: 1 };

  setWorldSize(world, worldSize);
  drawWorldBackground(render, color.background);
  drawWorldBorders(render, world, color.particle);
  cameraLookAt(render, world.bounds);
  const { mouseConstraint } = initMouse(render);

  World.add(world, [
    // walls
    Bodies.rectangle(0, world.bounds.min.y - wallWidth / 2, worldSize, wallWidth, { isStatic: true, render: bodyWallStyle }),
    Bodies.rectangle(world.bounds.max.x + wallWidth / 2, 0, wallWidth, worldSize, { isStatic: true, render: bodyWallStyle }),
    Bodies.rectangle(0, world.bounds.max.y + wallWidth / 2, worldSize, wallWidth, { isStatic: true, render: bodyWallStyle }),
    Bodies.rectangle(world.bounds.min.x - wallWidth / 2, 0, wallWidth, worldSize, { isStatic: true, render: bodyWallStyle }),
    Bodies.circle(0, 300, 70, { render: bodyWallStyle }),
    Bodies.rectangle(150, 300, 150, 150, { render: bodyWallStyle }),
    Bodies.trapezoid(300, 300, 200, 200, { render: bodyWallStyle }),
  ]);
  loadBodies(svgBodiesPaths, { render: bodyWallStyle }).then(bodies => {
    bodies.forEach((body, ix) => {
      const pos = { x: world.bounds.min.x + 200 + 200 * ix, y: world.bounds.min.y + 150 };
      Matter.Body.setPosition(body, pos);
      Matter.Body.scale(body, loadedBodiesScale, loadedBodiesScale);
    });
    World.add(world, bodies);
  });

  const liquid = Liquid.create({
    engine,
    render,
    liquids: [{ color: color.particle }], // Define one liquid
    updateEveryFrame: 1,  // Set max 60 FPS
  });
  const { centerX, centerY } = getWorldParams(world);
  const liquidCyanId = 0;
  const dripsize = 700;
  liquid.drip.rect(liquidCyanId, centerX - dripsize / 2, centerY - dripsize / 2, dripsize, dripsize);


  if (window.DEV_SET_MOUSE_CONTROLLER) window.DEV_SET_MOUSE_CONTROLLER(mouseConstraint, liquid.store)
  // For stats
  window.DEMO_LOADED(liquid);
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
