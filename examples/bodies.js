import Tools from './lib/fragments.js';
import Colors from './lib/colors.js';

export default function () {
  const svgBodiesPaths = [
    'iconmonstr-paperclip-2-icon.svg',
    'iconmonstr-puzzle-icon.svg',
  ].map(p => `./examples/svg/${p}`);

  const { Composite, Bodies, Liquid } = Matter;
  const { engine, world, render, runner } = Tools.init();

  const color = Colors.getPalette();
  const worldSize = 1024;
  const worldOffset = -worldSize / 2;
  const bounds = Tools.createBounds(worldOffset, worldOffset, worldSize, worldSize)
  const wallWidth = 50;
  const loadedBodiesScale = 0.4;
  const bodyWallStyle = { fillStyle: color.body, strokeStyle: color.particle, lineWidth: 1 };

  // drawWorldBackground(render, color.background);
  // drawWorldBorders(render, world, color.particle);
  Tools.cameraLookAt(render, bounds);
  const { mouseConstraint } = Tools.initMouse(render);

  Composite.add(world, [
    // walls
    Bodies.rectangle(0, bounds.min.y - wallWidth / 2, worldSize, wallWidth, { isStatic: true, render: bodyWallStyle }),
    Bodies.rectangle(bounds.max.x + wallWidth / 2, 0, wallWidth, worldSize, { isStatic: true, render: bodyWallStyle }),
    Bodies.rectangle(0, bounds.max.y + wallWidth / 2, worldSize, wallWidth, { isStatic: true, render: bodyWallStyle }),
    Bodies.rectangle(bounds.min.x - wallWidth / 2, 0, wallWidth, worldSize, { isStatic: true, render: bodyWallStyle }),
  ]);
  Tools.loadBodies(svgBodiesPaths, { render: bodyWallStyle }).then(loadedBodies => {
    const bodies = [
      Bodies.circle(0, 0, 70, { render: bodyWallStyle }),
      Bodies.rectangle(0, 0, 150, 150, { render: bodyWallStyle }),
      ...loadedBodies.map((body) => {
        Matter.Body.scale(body, loadedBodiesScale, loadedBodiesScale);
        return body;
      })
    ];
    bodies.forEach((body, ix) => {
      const pos = { x: bounds.min.x + 100 + 200 * ix, y: bounds.min.y + 100 };
      Matter.Body.setPosition(body, pos);
    });
    Composite.add(world, bodies);
  });

  const liquid = Liquid.create({
    bounds,
    engine,
    render,
    fluids: [{ color: color.particle }], // Define one liquid
    updateStep: 1,  // Set max 60 FPS
  });
  const { centerX, centerY } = Tools.getBoundsParams(bounds);
  const liquidCyanId = 0;
  const dripsize = 700;
  Liquid.drip.rect(liquid, liquidCyanId, centerX - dripsize / 2, centerY - dripsize / 2, dripsize, dripsize);

  if (window.DEV_SET_MOUSE_CONTROLLER) window.DEV_SET_MOUSE_CONTROLLER(mouseConstraint, liquid)
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
