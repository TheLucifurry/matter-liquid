import { setWorldSize, setWorldBackground, init, cameraLookAt, initMouse, setDripper, getWorldParams } from './lib/fragments.js';
import { randomArrayItem } from './lib/utils.js';

export default function () {
  const { Liquid } = Matter;
  const { engine, world, render, runner } = init();

  const worldSize = 1024;
  const color = randomArrayItem(['cyan', 'orange', 'lime', 'violet']);
  const bgColor = {
    'cyan': '#050820',
    'orange': '#140B02',
    'lime': '#051102',
    'violet': '#150320',
  }[color];

  setWorldSize(world, worldSize);
  setWorldBackground(world, bgColor);
  cameraLookAt(render, world.bounds);
  const { mouseConstraint } = initMouse(render);

  const liquid = Liquid.create({
    engine,
    render,
    liquids: [{ color }], // Define one liquid
    updateEveryFrame: 1,  // Set max 60 FPS
  });
  const { minX, maxX, minY, maxY, width } = getWorldParams(world);
  const liquidCyanId = 0;
  const seaHeight = 400;
  liquid.fillZoneByLiquid(minX, maxY - seaHeight, width, seaHeight, liquidCyanId);

  setDripper(render, liquid, mouseConstraint);

  // For stats
  window.ON_LIQUID_STARTED(liquid);

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
