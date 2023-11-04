import * as Util from './utils.js'
import loadSvg from './loaderSVG.js'

function init() {
  // create engine
  const engine = Matter.Engine.create()
  const { world } = engine

  // create renderer
  const render = Matter.Render.create({
    element: document.body,
    engine,
    options: {
      width: document.documentElement.clientWidth * 0.9,
      height: document.documentElement.clientHeight * 0.9,
      wireframes: false,
    },
  })
  Matter.Render.run(render)

  // create runner
  const runner = Matter.Runner.create()
  Matter.Runner.run(runner, engine)

  return {
    engine,
    world,
    render,
    runner,
  }
}

function createBounds(x, y, width, height) {
  return {
    min: { x, y },
    max: { x: x + width, y: y + height },
  }
}

function drawWorldBackground(render, color) {
  render.options.background = color
}
function drawWorldBorders(render, bounds, color) {
  Matter.Events.on(render, 'afterRender', () => {
    Matter.Render.startViewTransform(render)
    render.context.strokeStyle = color
    render.context.strokeRect(bounds.min.x, bounds.min.y, bounds.max.x - bounds.min.x, bounds.max.y - bounds.min.y)
  })
}

function cameraLookAt(render, bounds, padding = 50) {
  Matter.Render.lookAt(render, {
    min: { x: bounds.min.x - padding, y: bounds.min.y - padding },
    max: { x: bounds.max.x + padding, y: bounds.max.y + padding },
  })
}

function initMouse(render) {
  const mouse = Matter.Mouse.create(render.canvas)
  const mouseConstraint = Matter.MouseConstraint.create(render.engine, {
    mouse,
    constraint: {
      render: { visible: false },
    },
  })
  Matter.Composite.add(render.engine.world, mouseConstraint)
  render.mouse = mouse // keep the mouse in sync with rendering

  return {
    mouse,
    mouseConstraint,
  }
}

function setDripper(render, liquid, mouseConstraint, isSwitchFluidsByShift = true) {
  const { Liquid } = Matter
  const radius = 100
  const store = {
    main: 0,
    secondary: 1,
  }
  Util.onpressedPointer(render.canvas, (event, isMainButton) => {
    const liquidLink = isSwitchFluidsByShift && event.shiftKey ? store.secondary : store.main
    const point = mouseConstraint.mouse.position
    const x = point.x - radius; const y = point.y - radius
    if (isMainButton)
      Liquid.drip.rect(liquid, liquidLink, x, y, radius * 2, radius * 2)

    else
      Liquid.dry.rect(liquid, x, y, radius * 2, radius * 2)
  }, 50)
  return store
}

function setGravityControl(engine) {
  const { gravity } = engine.world
  const defGravity = { x: 0, y: 0 }

  Util.onkey(Util.KEY_CODES.UP, () => gravity.y = -1)
  Util.onkey(Util.KEY_CODES.LEFT, () => gravity.x = -1)
  Util.onkey(Util.KEY_CODES.DOWN, () => gravity.y = 1)
  Util.onkey(Util.KEY_CODES.RIGHT, () => gravity.x = 1)
  Util.onkey(Util.KEY_CODES.SPACE, () => Object.assign(gravity, defGravity))
}

function getBoundsParams(bounds) {
  const minX = bounds.min.x
  const maxX = bounds.max.x
  const minY = bounds.min.y
  const maxY = bounds.max.y
  const width = maxX - minX
  const height = maxY - minY
  return {
    minX,
    maxX,
    minY,
    maxY,
    width,
    height,
    centerX: minX + width / 2,
    centerY: minY + height / 2,
  }
}

function loadBodies(paths, props) {
  return new Promise((next) => {
    const res = []
    paths.forEach((path, i) => {
      function select(root, selector) {
        return Array.prototype.slice.call(root.querySelectorAll(selector))
      };
      loadSvg(path)
        .then((root) => {
          return select(root, 'path')
            .map((path) => { return Matter.Svg.pathToVertices(path, 30) })
        })
        .then((vertexSets) => {
          const body = Matter.Bodies.fromVertices(0, 0, vertexSets, {
            render: {
              fillStyle: 'gray',
              strokeStyle: 'gray',
            },
            ...props,
          }, true)
          res.push(body)
          if (i === paths.length - 1)
            next(res)
        })
    })
  })
}

export default {
  init,
  createBounds,
  drawWorldBackground,
  drawWorldBorders,
  cameraLookAt,
  initMouse,
  setDripper,
  setGravityControl,
  getBoundsParams,
  loadBodies,
}
