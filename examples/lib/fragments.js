import * as Util from './utils.js';

export function init() {
  // create engine
  const engine = Matter.Engine.create();
  const { world } = engine;

  // create renderer
  const render = Matter.Render.create({
    element: document.body,
    engine,
    options: {
      width: document.documentElement.clientWidth * 0.9,
      height: document.documentElement.clientHeight * 0.9,
      wireframes: false,
    },
  });
  Matter.Render.run(render);

  // create runner
  const runner = Matter.Runner.create();
  Matter.Runner.run(runner, engine);

  return {
    engine,
    world,
    render,
    runner,
  }
}

export function setWorldSize(world, width, height = width) {
  world.bounds.min.x = -width / 2;
  world.bounds.min.y = -height / 2;
  world.bounds.max.x = width / 2;
  world.bounds.max.y = height / 2;
}

export function drawWorldBackground(render, color) {
  render.options.background = color;
}
export function drawWorldBorders(render, world, color) {
  Matter.Events.on(render, 'afterRender', () => {
    Matter.Render.startViewTransform(render);
    render.context.strokeStyle = color;
    render.context.strokeRect(world.bounds.min.x, world.bounds.min.y, world.bounds.max.x - world.bounds.min.x, world.bounds.max.y - world.bounds.min.y);
  });
}


export function cameraLookAt(render, bounds, padding = 50) {
  Matter.Render.lookAt(render, {
    min: { x: bounds.min.x - padding, y: bounds.min.y - padding },
    max: { x: bounds.max.x + padding, y: bounds.max.y + padding },
  });
}

export function initMouse(render) {
  const mouse = Matter.Mouse.create(render.canvas);
  const mouseConstraint = Matter.MouseConstraint.create(render.engine, {
    mouse,
    constraint: {
      render: { visible: false },
    },
  });
  Matter.World.add(render.engine.world, mouseConstraint);
  render.mouse = mouse; // keep the mouse in sync with rendering

  return {
    mouse,
    mouseConstraint,
  };
}

export function setDripper(render, liquid, mouseConstraint) {
  const liquidCyanId = 0;
  const radius = 100;
  Util.onpressedPointer(render.canvas, (event, isMainButton) => {
    let point = mouseConstraint.mouse.position;
    const x = point.x - radius, y = point.y - radius;
    if (isMainButton) {
      liquid.drip.rect(liquidCyanId, x, y, radius * 2, radius * 2);
    } else {
      liquid.dry.rect(x, y, radius * 2, radius * 2);
    }
  }, 50);
}

export function setGravityControl(engine) {
  const { gravity } = engine.world;
  const defGravity = { x: 0, y: 0 };

  Util.onkey(Util.KEY_CODES.UP, () => gravity.y = -1);
  Util.onkey(Util.KEY_CODES.LEFT, () => gravity.x = -1);
  Util.onkey(Util.KEY_CODES.DOWN, () => gravity.y = 1);
  Util.onkey(Util.KEY_CODES.RIGHT, () => gravity.x = 1);
  Util.onkey(Util.KEY_CODES.SPACE, () => Object.assign(gravity, defGravity));
}

export function getWorldParams(world) {
  const worldBounds = world.bounds;
  const minX = worldBounds.min.x;
  const maxX = worldBounds.max.x;
  const minY = worldBounds.min.y;
  const maxY = worldBounds.max.y;
  return {
    minX,
    maxX,
    minY,
    maxY,
    width: maxX - minX,
    height: maxY - minY,
  };
}