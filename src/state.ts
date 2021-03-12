import {
  GRAVITY_RATIO, INTERACTION_RADIUS, EVERY_FRAME, TIME_SCALE, IS_REGIONAL_COMPUTING, IS_WORLD_WRAPPED, PARTICLE_TEX_RADIUS_SCALE, BORDERS_BOUNCE_VALUE,
} from './constants';
import SpatialHash from './spatialHash';
import createEventsObject from './events';
import * as Renderer from './render';
import { calcPaddings } from './helpers/utils';

function createLiquid(props: TLiquidProps, particleRadius: number): Required<TLiquidProps> {
  const propsDefaults: Required<TLiquidProps> = {
    color: '#fff',
    plasticity: 0.3,
    texture: null,
    // stiffness: 0.004,
  };
  const prototype = { ...propsDefaults, ...props };
  prototype.texture = props.texture || Renderer.generateParticleTexture(prototype.color, particleRadius);
  return prototype;
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

    this.store = {
      radius,
      isWrappedX: isWrappedSides[0],
      isWrappedY: isWrappedSides[1],
      engine: config.engine,
      render: config.render,
      world: config.engine.world,
      isRegionalComputing: config.isRegionalComputing || IS_REGIONAL_COMPUTING,
      liquids: config.liquids.map((l) => createLiquid(l, particleTextureSize)),

      bordersBounce: config.bordersBounce || BORDERS_BOUNCE_VALUE,
      isPaused: false,
      gravityRatio: GRAVITY_RATIO,
      spatialHash: new SpatialHash(),
      renderBoundsPadding: [0, 0, 0, 0],
      activeBoundsPadding: [0, 0, 0, 0],
      particles: [],
      springs: {},
      freeParticleIds: [],
      liquidOfParticleId: {},
      tick: 0,
      everyFrame: EVERY_FRAME,
      timeScale: TIME_SCALE,
    };
  }

  setPause(isPause = true): void {
    this.store.isPaused = isPause;
    this.events.pauseChange(isPause);
  }

  setRenderBoundsPadding(padding: number | TPadding): void {
    this.store.renderBoundsPadding = calcPaddings(padding);
  }

  setActiveBoundsPadding(padding: number | TPadding): void {
    this.store.activeBoundsPadding = calcPaddings(padding);
  }

  setGravityRatio(ratio: number = this.store.gravityRatio): void {
    this.store.gravityRatio = ratio;
  }

  setUpdateEveryFrame(value: number = this.store.everyFrame): void {
    this.store.everyFrame = value;
  }

  setTimeScale(value: number = this.store.timeScale): void {
    this.store.timeScale = value;
  }

  getGravity(): TVector {
    return [this.store.world.gravity.x * this.store.gravityRatio, this.store.world.gravity.y * this.store.gravityRatio];
  }

  getParticlesCount(): number {
    return this.store.particles.length - this.store.freeParticleIds.length;
  }
}
