import {
  GRAVITY_RATIO, INTERACTION_RADIUS, EVERY_FRAME, TIME_SCALE, IS_REGIONAL_COMPUTING, IS_WORLD_WRAPPED, PARTICLE_TEX_RADIUS_SCALE, BORDERS_BOUNCE_VALUE, PARTICLE_COLOR,
} from '../constants';
import SpatialHash from '../helpers/spatialHash';
import createEventsObject from './events';
import * as Renderer from '../render';

function createLiquid(props: TLiquidPrototype, particleRadius: number): TLiquidPrototypeComputed {
  const color: string = props.color || PARTICLE_COLOR as string;
  return [
    color,
    props.texture || Renderer.generateParticleTexture(color, particleRadius),
  ];
}

export default abstract class State {
  store: TStore;

  events = createEventsObject();

  constructor(config: TLiquidConfig) {
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

    this.store = Object.seal({
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
      g: GRAVITY_RATIO,
      sh: new SpatialHash(),
      rbp: 0,
      abp: 0,
      p: [],
      s: {},
      fpids: [],
      lpl: {},
      t: 0,
      ef: EVERY_FRAME,
      dt: TIME_SCALE,
    });
    this.store.sh.init(this.store.h);
    this.setGravityRatio(config.gravityRatio);
    this.setUpdateEveryFrame(config.updateEveryFrame);
    this.setTimeScale(config.timeScale);
  }

  setPause(isPause = true): void {
    this.store.ip = isPause;
    this.events.pauseChange(isPause);
  }

  setRenderBoundsPadding(padding: number): void {
    this.store.rbp = padding;
  }

  setActiveBoundsPadding(padding: number): void {
    this.store.abp = padding;
  }

  setGravityRatio(ratio: number = this.store.g): void {
    this.store.g = ratio;
  }

  setUpdateEveryFrame(value: number = this.store.ef): void {
    this.store.ef = value;
  }

  setTimeScale(value: number = this.store.dt): void {
    this.store.dt = value;
  }

  getGravity(): TVector {
    return [this.store.w.gravity.x * this.store.g, this.store.w.gravity.y * this.store.g];
  }

  getParticlesCount(): number {
    return this.store.p.length - this.store.fpids.length;
  }

  getLiquidId(liquidKey: TLiquidKey): number {
    if (DEV) {
      if (typeof liquidKey === 'string' && this.store.lnlid[liquidKey] == null) {
        throw new Error(`MatterLiquid: liquid prototype named "${liquidKey}" does not exist`);
      }
    }
    return typeof liquidKey === 'number' ? liquidKey : this.store.lnlid[liquidKey];
  }
}
