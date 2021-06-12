import Tools from './lib/fragments.js';
import Colors from './lib/colors.js';
import * as Utils from './lib/utils.js';

export default function () {
  const { Composite, Bodies, Liquid } = Matter;
  const { engine, world, render, runner } = Tools.init();

  const color = Colors.palettes[Colors.names.BLACK];
  const colorWater = Colors.palettes[Colors.names.BLUE];
  const colorLava = Colors.palettes[Colors.names.ORANGE];
  const colorSteam = Colors.palettes[Colors.names.WHITE];
  const worldSize = 1024;
  const worldOffset = -worldSize / 2;
  const bounds = Tools.createBounds(worldOffset, worldOffset, worldSize, worldSize);

  Tools.drawWorldBackground(render, color.background);
  Tools.drawWorldBorders(render, bounds, color.particle);
  Tools.cameraLookAt(render, bounds);
  const { mouseConstraint } = Tools.initMouse(render);

  const wallWidth = 50, halfWallWidth = wallWidth / 2;
  const bodyWallStyle = { fillStyle: color.body, strokeStyle: color.particle, lineWidth: 1 };
  const bodyOpts = { isStatic: true, render: bodyWallStyle };
  Composite.add(world, [
    // walls
    // Bodies.rectangle(0, bounds.min.y - halfWallWidth, worldSize, wallWidth, bodyOpts),
    // Bodies.rectangle(bounds.max.x + halfWallWidth, 0, wallWidth, worldSize, bodyOpts),
    // Bodies.rectangle(0, bounds.max.y + halfWallWidth, worldSize, wallWidth, bodyOpts),
    // Bodies.rectangle(bounds.min.x - halfWallWidth, 0, wallWidth, worldSize, bodyOpts),
    // platforms
    // Bodies.rectangle(0, bounds.min.y + worldSize * 0.05, worldSize * 2, wallWidth, { ...bodyOpts, angle: 0.4 }),
    // Bodies.rectangle(1, 1, worldSize * 0.6, wallWidth, { ...bodyOpts, angle: -0.2 }),
    // Bodies.rectangle(0, bounds.max.y + worldSize * -0.05, worldSize * 2, wallWidth, { ...bodyOpts, angle: 0.4 }),
  ]);


  const liquid = Liquid.create({
    bounds,
    engine,
    render,
    updateStep: 1, // Set max 60 FPS
    enableChemics: true,
    fluids: [{
      name: 'water',
      color: colorWater.particle,
    }, {
      name: 'lava',
      color: colorLava.particle,
      mass: 5,
    }, {
      name: 'steam',
      color: colorSteam.particle,
      mass: -2,
    }],
  });
  const { minX, maxX, minY, maxY, height, centerX } = Tools.getBoundsParams(bounds);
  const poolWidth = worldSize * 0.2;
  const padding = 50;
  Liquid.drip.rect(liquid, 'water', -poolWidth / 2, -poolWidth / 2, poolWidth, poolWidth);
  Liquid.drip.rect(liquid, 'lava', -worldSize / 2, maxY - poolWidth, worldSize, poolWidth);
  Liquid.drip.rect(liquid, 'steam', -worldSize / 2, -worldSize / 2, worldSize, poolWidth / 2);

  const lavaId = Liquid.getFluidId(liquid, 'lava');
  Liquid.chemics.reacts(liquid, 'water', ([owned, other]) => {
    const reactedWithLava = owned[lavaId];
    Liquid.chemics.transByName(liquid, reactedWithLava, 'steam');
  });

  setSyntesator(render, liquid, mouseConstraint, 'water');

  // For stats
  window.DEMO_LOADED(liquid, 'Right mouse btn - change fluid to "water"');
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



function setSyntesator(render, liquid, mouseConstraint, fluidKey) {
  const { Liquid } = Matter;
  const radius = 100;
  Utils.onpressedPointer(render.canvas, (event, isMainButton) => {
    let point = mouseConstraint.mouse.position;
    const x = point.x - radius, y = point.y - radius;
    Liquid.chemics.transRect(liquid, fluidKey, x, y, radius * 2, radius * 2);
  }, 50);
}