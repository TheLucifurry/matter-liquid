import Matter from 'matter-js';
import * as Algorithm from '../algorithm';
import * as Renderer from '../render';
import {
  GRAVITY_RATIO, INTERACTION_RADIUS, UPDATE_STEP, TIME_SCALE, IS_REGIONAL_COMPUTING, IS_WORLD_WRAPPED, PARTICLE_TEX_RADIUS_SCALE, BORDERS_BOUNCE_VALUE, PARTICLE_COLOR, CHEMICS_ITERATION_STEP,
} from '../constants';
import SpatialHash from '../helpers/spatialHash';
import createEventsObject from './events';
import VirtualCanvas from '../helpers/virtualCanvas';
import * as WebGL from '../gpu/webgl';
import { colorHexToVec4 } from '../helpers/utils';

function createFluidPrototype(fid: number, props: TFluidPrototype, particleRadius: number): TFluidPrototypeComputed {
  const color: string = props.color || PARTICLE_COLOR as string;
  return [
    fid,
    color,
    colorHexToVec4(color),
    props.texture || Renderer.generateParticleTexture(color, particleRadius),
    props.mass || 1,
  ];
}

export default function createLiquid(config: TLiquidConfig): TLiquid {
  // @ts-ignore
  const Liquid: TGlobalLiquid = Matter.Liquid;
  const radius = config.radius || INTERACTION_RADIUS;
  const isChemicsEnabled = !!config.enableChemics;

  const particleTextureSize = radius * (config.particleTextureScale || PARTICLE_TEX_RADIUS_SCALE);

  let isWrappedSides: [boolean, boolean] = [IS_WORLD_WRAPPED, IS_WORLD_WRAPPED];
  const configWrapping: boolean | [boolean, boolean] = config.worldWrapping;
  if (configWrapping != null) {
    isWrappedSides = typeof configWrapping === 'boolean' ? [configWrapping, configWrapping] : configWrapping;
  }

  const fnfid: { [key: string]: number } = {};
  const liquidPrototypes: TFluidPrototypeComputed[] = config.fluids.map((prototypeParams, fid) => {
    if (prototypeParams.name) {
      fnfid[prototypeParams.name] = fid;
    }
    return createFluidPrototype(fid, prototypeParams, particleTextureSize);
  });

  const mainCanvas = config.render.canvas;
  const virtualCanvas = VirtualCanvas(mainCanvas.clientWidth, mainCanvas.clientHeight);
  const renderingContext = virtualCanvas.getContext('webgl2', {
    // alpha: false,
    premultipliedAlpha: false, // Запрашиваем альфа без предварительного умножения
  });

  // Create updaters
  const renderUpdater = DEV && config.isDebug ? Renderer.updateDebug : Renderer.update;
  const computeUpdater = Algorithm.simple;
  const updateStep = config.updateStep || UPDATE_STEP;

  const bounds = config.bounds;
  const engineTiming = config.engine.timing;
  let tick = 0;

  const liquid: TLiquid = {
    fluidIdByParticleId: fnfid,
    h: radius,
    isWrappedX: isWrappedSides[0],
    isWrappedY: isWrappedSides[1],
    bounds: [bounds.min.x, bounds.min.y, bounds.max.x, bounds.max.y, bounds.max.x - bounds.min.x, bounds.max.y - bounds.min.y],
    engine: config.engine,
    render: config.render,
    world: config.engine.world,
    renderContext: renderingContext,
    isRegionalComputing: config.isRegionalComputing || IS_REGIONAL_COMPUTING,
    fluids: liquidPrototypes,
    chemicsStore: config.fluids.reduce((accumulator: TChemicsStore, liquidProto: TFluidPrototype, ix) => {
      accumulator.isReadyByFid[ix] = false;
      accumulator.iterStepByFid[ix] = liquidProto.chemicsUS || CHEMICS_ITERATION_STEP;
      accumulator.isReactableByFid[ix] = false;
      return accumulator;
    }, {
      isReadyByFid: [],
      iterStepByFid: [],
      isReactableByFid: [],
      data: [],
      callbackByFid: [],
    } as TChemicsStore),

    worldBordersBounce: config.bordersBounce || BORDERS_BOUNCE_VALUE,
    isPaused: false,
    gravityRatio: config.gravityRatio || GRAVITY_RATIO,
    spatialHash: SpatialHash(radius, bounds),
    renderBoundsPadding: 0,
    activeBoundsPadding: 0,
    particles: [],
    freeParticleIds: [],
    fluidByParticleId: {},
    timeDelta: config.timeScale || TIME_SCALE,

    events: createEventsObject(),
    statistics: {
      particlesCountByFluidId: liquidPrototypes.map(() => 0),
    },
    updateCompute: () => {
      if (tick++ % updateStep === 0) {
        // Chemics update flags
        if (isChemicsEnabled) {
          const readyList = liquid.chemicsStore.isReadyByFid;
          for (let i = 0; i < readyList.length; i++) {
            readyList[i] = (tick - i) % liquid.chemicsStore.iterStepByFid[i] === 0;
          }
        }

        // Call updater
        computeUpdater(liquid, engineTiming.timeScale * liquid.timeDelta);
      }
    },
  };

  WebGL.init(renderingContext, liquid);

  // Init updaters
  Matter.Events.on(config.render, 'afterRender', () => renderUpdater(liquid));
  Liquid.setPause(liquid, !!config.isPaused); // Enable compute updater

  if (DEV) {
    console.log('liquid:'); console.dir(liquid);
    // @ts-ignore
    window.liquid = liquid;
  }

  return Object.seal(liquid);
}
