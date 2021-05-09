import Tools from './lib/fragments.js';
import Colors from './lib/colors.js';

export default function () {
  const { Liquid } = Matter;
  const { engine, world, render, runner } = Tools.init();

  const color1 = Colors.getPalette();
  const color2 = Colors.getPalette();
  const color3 = Colors.getPalette();
  const worldSize = 1024;
  const worldOffset = -worldSize / 2;
  const bounds = Tools.createBounds(worldOffset, worldOffset, worldSize, worldSize);

  Tools.drawWorldBackground(render, color1.background);
  Tools.drawWorldBorders(render, bounds, color1.particle);
  Tools.cameraLookAt(render, bounds);
  const { mouseConstraint } = Tools.initMouse(render);

  const liquid = Liquid.create({
    bounds,
    engine,
    render,
    updateEveryFrame: 1, // Set max 60 FPS
    liquids: [{
      // Default liquid
      color: color1.particle,
    }, {
      // Hard liquid
      color: color2.particle,
      mass: 3,
    }, {
      // Steam liquid
      color: color3.particle,
      mass: -0.5,
    }],
  });
  const { minX, maxX, minY, height, centerX } = Tools.getBoundsParams(bounds);
  const firstLiquid = 0;
  const secondLiquid = 1;
  const thirdLiquid = 2;
  const poolWidth = 150;
  const padding = 50;
  Liquid.drip.rect(liquid, firstLiquid, minX + padding, minY + padding, poolWidth, height - padding * 2);
  Liquid.drip.rect(liquid, secondLiquid, maxX - poolWidth - padding, minY + padding, poolWidth, height - padding * 2);
  Liquid.drip.rect(liquid, thirdLiquid, centerX - poolWidth / 2, minY + padding, poolWidth, height - padding * 2);

  Tools.setDripper(render, liquid, mouseConstraint, true);

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
};
