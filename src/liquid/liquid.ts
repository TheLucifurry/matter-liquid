import Matter from 'matter-js';
import * as Algorithm from '../algorithm';
import * as Renderer from '../render';
import {
  GRAVITY_RATIO, INTERACTION_RADIUS, EVERY_FRAME, TIME_SCALE, IS_REGIONAL_COMPUTING, IS_WORLD_WRAPPED, PARTICLE_TEX_RADIUS_SCALE, BORDERS_BOUNCE_VALUE, PARTICLE_COLOR,
} from '../constants';
import SpatialHash from '../helpers/spatialHash';
import createEventsObject from './events';
import VirtualCanvas from '../helpers/virtualCanvas';
import * as WebGL from '../gpu/webgl';
import { colorHexToVec4 } from '../helpers/utils';

function createLiquidPrototype(liquidid: number, props: TLiquidPrototype, particleRadius: number): TLiquidPrototypeComputed {
  const color: string = props.color || PARTICLE_COLOR as string;
  return [
    liquidid,
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

  const particleTextureSize = radius * (config.particleTextureScale || PARTICLE_TEX_RADIUS_SCALE);

  let isWrappedSides: [boolean, boolean] = [IS_WORLD_WRAPPED, IS_WORLD_WRAPPED];
  const configWrapping: boolean | [boolean, boolean] = config.worldWrapping;
  if (configWrapping != null) {
    isWrappedSides = typeof configWrapping === 'boolean' ? [configWrapping, configWrapping] : configWrapping;
  }

  const lnlid: { [key: string]: number } = {};
  const liquidPrototypes: TLiquidPrototypeComputed[] = config.liquids.map((prototypeParams, lid) => {
    if (prototypeParams.name) {
      lnlid[prototypeParams.name] = lid;
    }
    return createLiquidPrototype(lid, prototypeParams, particleTextureSize);
  });

  const mainCanvas = config.render.canvas;
  const virtualCanvas = VirtualCanvas(mainCanvas.clientWidth, mainCanvas.clientHeight);
  const renderingContext = virtualCanvas.getContext('webgl2');

  // Create updaters
  const renderUpdater = DEV && config.isDebug ? Renderer.updateDebug : Renderer.update;
  const computeUpdater = config.isAdvancedAlgorithm ? Algorithm.advanced : Algorithm.simple;
  const updateEveryFrame = config.updateEveryFrame || EVERY_FRAME;
  let tick = 0;

  const liquid: TLiquid = {
    h: radius,
    iwx: isWrappedSides[0],
    iwy: isWrappedSides[1],
    b: config.bounds,
    e: config.engine,
    r: config.render,
    w: config.engine.world,
    c: renderingContext,
    irc: config.isRegionalComputing || IS_REGIONAL_COMPUTING,
    l: liquidPrototypes,
    lnlid,

    bb: config.bordersBounce || BORDERS_BOUNCE_VALUE,
    ip: false,
    g: config.gravityRatio || GRAVITY_RATIO,
    sh: SpatialHash(radius, config.bounds),
    rbp: 0,
    abp: 0,
    p: [],
    s: {},
    fpids: [],
    lpl: {},
    dt: config.timeScale || TIME_SCALE,

    ev: createEventsObject(),
    st: {
      cl: liquidPrototypes.map(() => 0),
    },
    u: () => {
      if (tick++ % updateEveryFrame === 0) {
        computeUpdater(liquid, liquid.e.timing.timeScale * liquid.dt);
      }
    },
  };

  // Create updaters
  // const renderUpdater = DEV && config.isDebug ? Renderer.updateDebug : Renderer.update;
  // const computeUpdater = config.isAdvancedAlgorithm ? Algorithm.advanced : Algorithm.simple;
  // liquid.u = () => {
  //   if (liquid.t++ % liquid.ef === 0) {
  //     computeUpdater(liquid, liquid.e.timing.timeScale * liquid.dt);
  //   }
  // };

  // WebGL.init(renderingContext, liquid);

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
