import Matter from 'matter-js'
import * as Algorithm from '../algorithm'
import * as Renderer from '../render'
import {
  BORDERS_BOUNCE_VALUE,
  CHEMICS_ITERATION_STEP,
  GRAVITY_RATIO,
  INTERACTION_RADIUS,
  IS_REGIONAL_COMPUTING,
  IS_WORLD_WRAPPED,
  PARTICLE_COLOR,
  PARTICLE_TEX_RADIUS_SCALE,
  TIME_SCALE,
  UPDATE_STEP,
} from '../constants'
import SpatialHash from '../helpers/spatialHash'
import VirtualCanvas from '../helpers/virtualCanvas'
import * as WebGL from '../gpu/webgl'
import { colorHexToVec4 } from '../helpers/utils'
import createEventsObject from './events'

function createFluidPrototype(fid: number, props: TFluidPrototype, particleRadius: number): TFluidPrototypeComputed {
  const color: string = props.color || PARTICLE_COLOR as string
  return [
    fid,
    color,
    colorHexToVec4(color),
    props.texture || Renderer.generateParticleTexture(color, particleRadius),
    props.mass || 1,
  ]
}

export default function createLiquid(config: TLiquidConfig): TLiquid {
  // @ts-expect-error Hart type flow
  const Liquid: TGlobalLiquid = Matter.Liquid
  const radius = config.radius || INTERACTION_RADIUS
  const isChemicsEnabled = !!config.enableChemics

  const particleTextureSize = radius * (config.particleTextureScale || PARTICLE_TEX_RADIUS_SCALE)

  let isWrappedSides: [boolean, boolean] = [IS_WORLD_WRAPPED, IS_WORLD_WRAPPED]
  const configWrapping: boolean | [boolean, boolean] = config.worldWrapping
  if (configWrapping != null)
    isWrappedSides = typeof configWrapping === 'boolean' ? [configWrapping, configWrapping] : configWrapping

  const fnfid: { [key: string]: number } = {}
  const liquidPrototypes: TFluidPrototypeComputed[] = config.fluids.map((prototypeParams, fid) => {
    if (prototypeParams.name)
      fnfid[prototypeParams.name] = fid

    return createFluidPrototype(fid, prototypeParams, particleTextureSize)
  })

  const mainCanvas = config.render.canvas
  const virtualCanvas = VirtualCanvas(mainCanvas.clientWidth, mainCanvas.clientHeight)
  const renderingContext = virtualCanvas.getContext('webgl2', {
    // alpha: false,
    premultipliedAlpha: false, // Запрашиваем альфа без предварительного умножения
  })

  // Create updaters
  const renderUpdater = DEV && config.isDebug ? Renderer.updateDebug : Renderer.update
  const computeUpdater = Algorithm.simple
  const updateStep = config.updateStep || UPDATE_STEP

  const bounds = config.bounds
  const engineTiming = config.engine.timing
  let tick = 0

  const liquid: TLiquid = {
    _fluidIdByParticleId: fnfid,
    _h: radius,
    _isWrappedX: isWrappedSides[0],
    _isWrappedY: isWrappedSides[1],
    _bounds: [bounds.min.x, bounds.min.y, bounds.max.x, bounds.max.y, bounds.max.x - bounds.min.x, bounds.max.y - bounds.min.y],
    _engine: config.engine,
    _render: config.render,
    _world: config.engine.world,
    _renderContext: renderingContext,
    _isRegionalComputing: config.isRegionalComputing || IS_REGIONAL_COMPUTING,
    _fluids: liquidPrototypes,
    _chemicsStore: config.fluids.reduce((accumulator: TChemicsStore, liquidProto: TFluidPrototype, ix) => {
      accumulator._isReadyByFid[ix] = false
      accumulator._iterStepByFid[ix] = liquidProto.chemicsUS || CHEMICS_ITERATION_STEP
      accumulator._isReactableByFid[ix] = false
      return accumulator
    }, {
      _isReadyByFid: [],
      _iterStepByFid: [],
      _isReactableByFid: [],
      _data: [],
      _callbackByFid: [],
    } as TChemicsStore),

    _worldBordersBounce: config.bordersBounce || BORDERS_BOUNCE_VALUE,
    _isPaused: false,
    _gravityRatio: config.gravityRatio || GRAVITY_RATIO,
    _spatialHash: SpatialHash(radius, bounds),
    _renderBoundsPadding: 0,
    _activeBoundsPadding: 0,
    _particles: [],
    _freeParticleIds: [],
    _fluidByParticleId: {},
    _timeDelta: config.timeScale || TIME_SCALE,

    _events: createEventsObject(),
    _statistics: {
      _particlesCountByFluidId: liquidPrototypes.map(() => 0),
    },
    _updateCompute: () => {
      if (tick++ % updateStep === 0) {
        // Chemics update flags
        if (isChemicsEnabled) {
          const readyList = liquid._chemicsStore._isReadyByFid
          for (let i = 0; i < readyList.length; i++)
            readyList[i] = (tick - i) % liquid._chemicsStore._iterStepByFid[i] === 0
        }

        // Call updater
        computeUpdater(liquid, engineTiming.timeScale * liquid._timeDelta)
      }
    },
  }

  // @ts-expect-error Hard type flow
  WebGL.init(renderingContext, liquid)

  // Init updaters
  Matter.Events.on(config.render, 'afterRender', () => renderUpdater(liquid))
  Liquid.setPause(liquid, !!config.isPaused) // Enable compute updater

  if (DEV) {
    console.log('liquid:')
    console.dir(liquid)
    // @ts-expect-error Global injection
    window.liquid = liquid
  }

  return Object.seal(liquid)
}
