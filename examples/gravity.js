import { setWorldSize, setWorldBackground, init, cameraLookAt, initMouse, setDripper, getWorldParams } from './lib/fragments.js';
import * as Util from './lib/utils.js';
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
  gravityControl(engine);

  const liquid = Liquid.create({
    engine,
    render,
    liquids: [{ color: color.particle }], // Define one liquid
    updateEveryFrame: 1,  // Set max 60 FPS
  });
  const { minX, maxX, minY, maxY, width } = getWorldParams(world);
  const liquidCyanId = 0;
  const seaHeight = 400;
  liquid.fillZoneByLiquid(minX, maxY - seaHeight, width, seaHeight, liquidCyanId);

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


function gravityControl(engine) {
  const { gravity } = engine.world;
  const defGravity = { x: 0, y: 0 };

  Util.onkey(Util.KEY_CODES.UP, () => gravity.y = -1);
  Util.onkey(Util.KEY_CODES.LEFT, () => gravity.x = -1);
  Util.onkey(Util.KEY_CODES.DOWN, () => gravity.y = 1);
  Util.onkey(Util.KEY_CODES.RIGHT, () => gravity.x = 1);
  Util.onkey(Util.KEY_CODES.SPACE, () => Object.assign(gravity, defGravity));
}