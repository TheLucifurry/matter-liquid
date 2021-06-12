import Tools from './lib/fragments.js';
import Colors from './lib/colors.js';

export default function () {
  const { Liquid } = Matter;
  const { engine, world, render, runner } = Tools.init();

  const color = Colors.getPalette();
  const worldSize = 1024;
  const worldOffset = -worldSize / 2;
  const bounds = Tools.createBounds(worldOffset, worldOffset, worldSize, worldSize);

  Tools.drawWorldBackground(render, color.background);
  Tools.drawWorldBorders(render, bounds, color.particle);
  Tools.cameraLookAt(render, bounds);
  const { mouseConstraint } = Tools.initMouse(render);

  const liquid = Liquid.create({
    bounds,
    engine,
    render,
    fluids: [{ color: color.particle }], // Define one liquid
    worldWrapping: true,
  });
  const { maxX, maxY } = Tools.getBoundsParams(bounds);
  const fluidId = 0;
  Liquid.drip.rect(liquid, fluidId, maxX - 300, maxY - 300, 200, 200);

  world.gravity.x = 0.2;
  world.gravity.y = 0.2;

  Tools.setDripper(render, liquid, mouseConstraint);

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
