import Tools from './lib/fragments.js'
import Colors from './lib/colors.js'

export default function () {
  const { Liquid } = Matter
  const { engine, world, render, runner } = Tools.init()

  const color = Colors.getPalette()
  const worldSize = 1024
  const worldOffset = -worldSize / 2
  const bounds = Tools.createBounds(worldOffset, worldOffset, worldSize, worldSize)

  Tools.drawWorldBackground(render, color.background)
  Tools.drawWorldBorders(render, bounds, color.particle)
  Tools.cameraLookAt(render, bounds)
  const { mouseConstraint } = Tools.initMouse(render)
  Tools.setGravityControl(engine)
  const liquid = Liquid.create({
    bounds,
    engine,
    render,
    fluids: [{ color: color.particle }], // Define one liquid
    updateStep: 1, // Set max 60 FPS
  })
  const { minX, maxX, minY, maxY, width } = Tools.getBoundsParams(bounds)
  const liquidCyanId = 0
  const seaHeight = 400
  Liquid.drip.rect(liquid, liquidCyanId, minX, maxY - seaHeight, width, seaHeight)

  Tools.setDripper(render, liquid, mouseConstraint)

  window.DEMO_LOADED(liquid, engine, 'Arrow keys - direction | Space - disable')
  return {
    engine,
    runner,
    render,
    canvas: render.canvas,
    stop() {
      Matter.Render.stop(render)
      Matter.Runner.stop(runner)
    },
  }
};
