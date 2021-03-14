import { setWorldSize, setWorldBackground, init, cameraLookAt, initMouse, setDripper, getWorldParams } from './lib/fragments.js';
import Colors from './lib/colors.js';

export default function () {
  const { Liquid } = Matter;
  const { engine, world, render, runner } = init();

  const color = Colors.getRandomPalette();
  const worldSize = 1024;

  setWorldSize(world, worldSize);
  setWorldBackground(world, color.background);
  cameraLookAt(render, world.bounds);
  const { mouseConstraint } = initMouse(render);

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
