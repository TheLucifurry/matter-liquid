

// fit the render viewport to the scene
Render.lookAt(render, {
  min: { x: -100, y: -100 },
  max: { x: 800 + 100, y: 600 + 100 },
});

mouseControl(engine, render, mouse, mouseConstraint)

function mouseControl(engine, render, mouse, mouseConstraint) {
  const { Mouse, Bounds, Events, Vector } = Matter;


  const viewportCentre = {
    x: render.options.width * 0.5,
    y: render.options.height * 0.5
  };

  // make the world bounds a little bigger than the render bounds
  engine.world.bounds.min.x = -300;
  engine.world.bounds.min.y = -300;
  engine.world.bounds.max.x = 1000;
  engine.world.bounds.max.y = 1000;

  // keep track of current bounds scale (view zoom)
  let boundsScaleTarget = 1;
  let boundsScale = { x: 1, y: 1 };

  Events.on(engine, 'beforeTick', function () {
    var world = engine.world,
      mouse = mouseConstraint.mouse,
      translate;

    // mouse wheel controls zoom
    var scaleFactor = mouse.wheelDelta * -0.1;
    if (scaleFactor !== 0) {
      if ((scaleFactor < 0 && boundsScale.x >= 0.6) || (scaleFactor > 0 && boundsScale.x <= 1.4)) {
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
    var deltaCentre = Vector.sub(mouse.absolute, viewportCentre),
      centreDist = Vector.magnitude(deltaCentre);

    // translate the view if mouse has moved over 50px from the centre of viewport
    if (centreDist > 200) {
      // create a vector to translate the view, allowing the user to control view speed
      var direction = Vector.normalise(deltaCentre),
        speed = Math.min(10, Math.pow(centreDist - 50, 2) * 0.0002);

      translate = Vector.mult(direction, speed);

      // prevent the view moving outside the world bounds
      if (render.bounds.min.x + translate.x < world.bounds.min.x)
        translate.x = world.bounds.min.x - render.bounds.min.x;

      if (render.bounds.max.x + translate.x > world.bounds.max.x)
        translate.x = world.bounds.max.x - render.bounds.max.x;

      if (render.bounds.min.y + translate.y < world.bounds.min.y)
        translate.y = world.bounds.min.y - render.bounds.min.y;

      if (render.bounds.max.y + translate.y > world.bounds.max.y)
        translate.y = world.bounds.max.y - render.bounds.max.y;

      // move the view
      Bounds.translate(render.bounds, translate);

      // we must update the mouse too
      Mouse.setOffset(mouse, render.bounds.min);
    }
  });
}