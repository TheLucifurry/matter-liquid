import Tools from './lib/fragments.js';
import Colors from './lib/colors.js';

export default function () {
  const { Liquid } = Matter;
  const {
    engine, world, render, runner,
  } = Tools.init();

  const color = Colors.getPalette();
  const worldSize = 1024 * 2;
  const worldOffset = -worldSize / 2;
  const bounds = Tools.createBounds(worldOffset, worldOffset, worldSize, worldSize);

  window.ENGINE = engine;
  window.WORLD = world;

  Tools.drawWorldBackground(render, color.background);
  Tools.drawWorldBorders(render, bounds, color.particle);
  Tools.cameraLookAt(render, bounds);
  const { mouseConstraint } = Tools.initMouse(render);

  const liquid = Liquid.create({
    bounds,
    engine,
    render,
    liquids: [{ color: color.particle }], // Define one liquid
    updateEveryFrame: 1, // Set max 60 FPS
    // isPaused: true,
  });
  const {
    minX, maxX, minY, maxY, width, height,
  } = Tools.getBoundsParams(bounds);
  const liquidCyanId = 0;
  const seaHeight = height / 2;
  Liquid.drip.rect(liquid, liquidCyanId, minX, maxY - seaHeight, width, seaHeight);

  Tools.setDripper(render, liquid, mouseConstraint);

  if (window.DEV_SET_MOUSE_CONTROLLER) window.DEV_SET_MOUSE_CONTROLLER(mouseConstraint, liquid);
  // For stats
  window.DEMO_LOADED(liquid, 'Right mouse btn - drip | Left mouse btn - dry');
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
}
