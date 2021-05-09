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
  Tools.cameraLookAt(render, bounds, -200);
  const { mouseConstraint } = Tools.initMouse(render);
  viewControl(engine, render, bounds, mouseConstraint);

  const liquid = Liquid.create({
    bounds,
    engine,
    render,
    liquids: [{ color: color.particle }], // Define one liquid
    updateEveryFrame: 1, // Set max 60 FPS
  });
  const { minX, maxX, minY, maxY, width, height } = Tools.getBoundsParams(bounds);
  const liquidCyanId = 0;
  const seaHeight = 400;
  Liquid.drip.rect(liquid, liquidCyanId, minX, maxY - seaHeight, width, seaHeight);

  Tools.setDripper(render, liquid, mouseConstraint);

  window.DEMO_LOADED(liquid, 'Mouse move - camera pos. | Wheel - camera scale');
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

function viewControl(engine, render, bounds, mouseConstraint) {
  const { Mouse, Bounds, Events, Vector } = Matter;

  const viewportCentre = {
    x: render.options.width * 0.5,
    y: render.options.height * 0.5
  };

  // keep track of current bounds scale (view zoom)
  let boundsScaleTarget = 1;
  let boundsScale = { x: 1, y: 1 };

  Events.on(engine, 'beforeTick', function () {
    let world = engine.world,
      mouse = mouseConstraint.mouse,
      translate;

    // mouse wheel controls zoom
    let scaleFactor = mouse.wheelDelta * -0.1;
    if (scaleFactor !== 0) {
      if ((scaleFactor < 0 && boundsScale.x >= 0.6) || (scaleFactor > 0 && boundsScale.x <= 0.6)) {
        boundsScaleTarget += scaleFactor;
      }
    }

    // if scale has changed
    if (Math.abs(boundsScale.x - boundsScaleTarget) > 0.01) {
      // smoothly tween scale factor
      scaleFactor = (boundsScaleTarget - boundsScale.x) * 0.2;
      boundsScale.x += scaleFactor;
      boundsScale.y += scaleFactor;

      // scale the render bounds
      render.bounds.max.x = render.bounds.min.x + render.options.width * boundsScale.x;
      render.bounds.max.y = render.bounds.min.y + render.options.height * boundsScale.y;

      // translate so zoom is from centre of view
      translate = {
        x: render.options.width * scaleFactor * -0.5,
        y: render.options.height * scaleFactor * -0.5
      };

      Bounds.translate(render.bounds, translate);

      // update mouse
      Mouse.setScale(mouse, boundsScale);
      Mouse.setOffset(mouse, render.bounds.min);
    }

    // get vector from mouse relative to centre of viewport
    let deltaCentre = Vector.sub(mouse.absolute, viewportCentre),
      centreDist = Vector.magnitude(deltaCentre);

    // translate the view if mouse has moved over 50px from the centre of viewport
    if (centreDist > 50) {
      // create a vector to translate the view, allowing the user to control view speed
      let direction = Vector.normalise(deltaCentre),
        speed = Math.min(10, Math.pow(centreDist - 50, 2) * 0.0002);

      translate = Vector.mult(direction, speed);

      // prevent the view moving outside the world bounds
      if (render.bounds.min.x + translate.x < bounds.min.x)
        translate.x = bounds.min.x - render.bounds.min.x;

      if (render.bounds.max.x + translate.x > bounds.max.x)
        translate.x = bounds.max.x - render.bounds.max.x;

      if (render.bounds.min.y + translate.y < bounds.min.y)
        translate.y = bounds.min.y - render.bounds.min.y;

      if (render.bounds.max.y + translate.y > bounds.max.y)
        translate.y = bounds.max.y - render.bounds.max.y;

      // move the view
      Bounds.translate(render.bounds, translate);

      // we must update the mouse too
      Mouse.setOffset(mouse, render.bounds.min);
    }
  });
}