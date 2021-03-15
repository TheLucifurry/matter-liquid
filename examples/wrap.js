import { setWorldSize, drawWorldBackground, drawWorldBorders, init, cameraLookAt, initMouse, setDripper, getWorldParams } from './lib/fragments.js';
import Colors from './lib/colors.js';

export default function () {
  const { Liquid } = Matter;
  const { engine, world, render, runner } = init();

  const color = Colors.getPalette();
  const worldSize = 1024;

  setWorldSize(world, worldSize);
  drawWorldBackground(render, color.background);
  drawWorldBorders(render, world, color.particle);
  cameraLookAt(render, world.bounds);
  const { mouseConstraint } = initMouse(render);

  const liquid = Liquid.create({
    engine,
    render,
    liquids: [{ color: color.particle }], // Define one liquid
    worldWrapping: true,
  });
  const { maxX, maxY } = getWorldParams(world);
  const liquidId = 0;
  liquid.drip.rect(liquidId, maxX - 300, maxY - 300, 200, 200);

  world.gravity.x = .2;
  world.gravity.y = .2;

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
