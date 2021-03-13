import { setWorldSize, setWorldBackground, init, cameraLookAt, initMouse, setDripper, getWorldParams } from './lib/fragments.js';
import Colors from './lib/colors.js';

export default function () {
  const { Liquid } = Matter;
  const { engine, world, render, runner } = init();

  const worldSize = 1024;
  const color = Colors.getRandom();
  const bgColor = Colors.getBackgroundFor(color);

  setWorldSize(world, worldSize);
  setWorldBackground(world, bgColor);
  cameraLookAt(render, world.bounds);
  const { mouseConstraint } = initMouse(render);

  const liquid = Liquid.create({
    engine,
    render,
    liquids: [{ color }], // Define one liquid
    worldWrapping: true,
  });
  const { minX, maxY } = getWorldParams(world);
  const liquidId = 0;
  liquid.fillZoneByLiquid(minX + 100, maxY + 100, 200, 200, liquidId);

  world.gravity.x = .1;
  world.gravity.y = .1;

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
