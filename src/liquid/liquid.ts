import Matter from 'matter-js';
import * as Algorithm from '../algorithm';
import * as Renderer from '../render';
import {
  GRAVITY_RATIO, INTERACTION_RADIUS, EVERY_FRAME, TIME_SCALE, IS_REGIONAL_COMPUTING, IS_WORLD_WRAPPED, PARTICLE_TEX_RADIUS_SCALE, BORDERS_BOUNCE_VALUE, PARTICLE_COLOR,
} from '../constants';
import SpatialHash from '../helpers/spatialHash';
import createEventsObject from './events';

function createLiquid(props: TLiquidPrototype, particleRadius: number): TLiquidPrototypeComputed {
  const color: string = props.color || PARTICLE_COLOR as string;
  return [
    color,
    props.texture || Renderer.generateParticleTexture(color, particleRadius),
  ];
}

export default function Liquid(config: TLiquidConfig): TLiquid {
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
    return createLiquid(prototypeParams, particleTextureSize);
  });

  const liquid: TLiquid = {
    h: radius,
    iwx: isWrappedSides[0],
    iwy: isWrappedSides[1],
    e: config.engine,
    r: config.render,
    w: config.engine.world,
    irc: config.isRegionalComputing || IS_REGIONAL_COMPUTING,
    l: liquidPrototypes,
    lnlid,

    bb: config.bordersBounce || BORDERS_BOUNCE_VALUE,
    ip: false,
    g: config.gravityRatio || GRAVITY_RATIO,
    sh: new SpatialHash(),
    rbp: 0,
    abp: 0,
    p: [] as TParticle[],
    s: {},
    fpids: [] as number[],
    lpl: {},
    t: 0,
    ef: config.updateEveryFrame || EVERY_FRAME,
    dt: config.timeScale || TIME_SCALE,

    events: createEventsObject(),
    setRenderBoundsPadding(padding: number): void {
      liquid.rbp = padding;
    },
    setActiveBoundsPadding(padding: number): void {
      liquid.abp = padding;
    },
    setGravityRatio(ratio: number = liquid.g): void {
      liquid.g = ratio;
    },
    setUpdateEveryFrame(value: number = liquid.ef): void {
      liquid.ef = value;
    },
    setTimeScale(value: number = liquid.dt): void {
      liquid.dt = value;
    },
    getGravity(): TVector {
      return [liquid.w.gravity.x * liquid.g, liquid.w.gravity.y * liquid.g];
    },
    getParticlesCount(): number {
      return liquid.p.length - liquid.fpids.length;
    },
    getLiquidId(liquidKey: TLiquidKey): number {
      if (DEV) {
        if (typeof liquidKey === 'string' && liquid.lnlid[liquidKey] == null) {
          throw new Error(`MatterLiquid: liquid prototype named "${liquidKey}" does not exist`);
        }
      }
      return typeof liquidKey === 'number' ? liquidKey : liquid.lnlid[liquidKey];
    },
    setPause: null,
  };
  liquid.sh.init(liquid.h);

  // Create updaters
  const renderUpdater = DEV && config.isDebug ? Renderer.updateDebug : Renderer.update;
  const computeUpdater = config.isAdvancedAlgorithm ? Algorithm.advanced : Algorithm.simple;
  const updateCompute = () => {
    if (liquid.t++ % liquid.ef === 0) {
      computeUpdater(liquid, liquid.e.timing.timeScale * liquid.dt);
    }
  };
  liquid.setPause = (isPause = true): void => {
    if (isPause) {
      Matter.Events.off(liquid.e, 'afterUpdate', updateCompute);
    } else {
      Matter.Events.on(liquid.e, 'afterUpdate', updateCompute);
    }
    liquid.ip = isPause;
    liquid.events.pauseChange(isPause);
  };

  // Init updaters
  Matter.Events.on(config.render, 'afterRender', () => renderUpdater(liquid));
  liquid.setPause(!!config.isPaused); // Enable compute updater

  if (DEV) {
    console.log('liquid:'); console.dir(liquid);
    // @ts-ignore
    window.liquid = liquid;
  }

  return Object.seal(liquid);
}
