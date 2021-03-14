import { setWorldSize, setWorldBackground, init, cameraLookAt, initMouse, setDripper, getWorldParams, setGravityControl } from './lib/fragments.js';
import Colors from './lib/colors.js';

export default function () {
  const { Liquid } = Matter;
  const { engine, world, render, runner } = init();

  const color = Colors.getPalette();
  const worldSize = 1024;

  setWorldSize(world, worldSize);
  setWorldBackground(world, color.background);
  cameraLookAt(render, world.bounds);
  const { mouseConstraint } = initMouse(render);
  setGravityControl(engine);

  const liquid = Liquid.create({
    engine,
    render,
    liquids: [{ color: color.particle }], // Define one liquid
    updateEveryFrame: 1,  // Set max 60 FPS
  });
  const { minX, maxX, minY, maxY, width } = getWorldParams(world);
  const liquidCyanId = 0;
  const seaHeight = 400;
  liquid.drip.rect(liquidCyanId, minX, maxY - seaHeight, width, seaHeight);

  setDripper(render, liquid, mouseConstraint);

  window.DEMO_LOADED(liquid, 'Arrow keys - direction | Space - disable')
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
