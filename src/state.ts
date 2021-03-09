import { GRAVITY_RATIO, INTERACTION_RADIUS, EVERY_FRAME, TIME_SCALE, IS_REGIONAL_COMPUTING, IS_WORLD_WRAPPED, PARTICLE_TEX_RADIUS_SCALE } from './constants';
import SpatialHash from './spatialHash';
import createEventsObject from './events';
import * as Renderer from './render';

function setPaddings(data: TFourNumbers, padding: number | TPadding) {
  if(typeof padding === 'number'){
    Object.assign(data, [padding, padding, padding, padding]);
  }else{
    Object.assign(data, [padding[0], padding[1], padding[2] || padding[0], padding[3] || padding[1]]);
  }
}
function createLiquid(props: TLiquidProps, particleRadius: number): Required<TLiquidProps> {
  const propsDefaults: Required<TLiquidProps> = {
    color: '#fff',
    plasticity: 0.3,
    texture: null,
    // stiffness: 0.004,
  }
  const prototype = { ...propsDefaults, ...props };
  prototype.texture = props.texture || Renderer.generateParticleTexture(prototype.color, particleRadius)
  return prototype;
}

export default abstract class State {
  store: TStore
  events = createEventsObject()

  constructor(config: TLiquidConfig){
    const radius = config.radius || INTERACTION_RADIUS;

    const particleTextureSize = radius * (config.particleTextureScale || PARTICLE_TEX_RADIUS_SCALE);

    let isWrappedSides: [boolean, boolean] = [IS_WORLD_WRAPPED, IS_WORLD_WRAPPED];
    let configWrapping: boolean | [boolean, boolean] = config.worldWrapping;
    if(configWrapping != null){
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
      liquids: config.liquids.map((l)=>createLiquid(l, particleTextureSize)),

      isPaused: false,
      gravityRatio: GRAVITY_RATIO,
      spatialHash: new SpatialHash,
      renderBoundsPadding: [0, 0, 0, 0],
      activeBoundsPadding: [0, 0, 0, 0],
      particles: [],
      springs: {},
      freeParticleIds: [],
      liquidOfParticleId: {},
      tick: 0,
      everyFrame: EVERY_FRAME,
      timeScale: TIME_SCALE,
    }
  }

  setPause(isPause = true) {
    this.store.isPaused = isPause;
    this.events.pauseChange(isPause);
  }
  setRenderBoundsPadding(padding: number | TPadding) {
    setPaddings(this.store.renderBoundsPadding, padding)
  }
  setActiveBoundsPadding(padding: number | TPadding) {
    setPaddings(this.store.activeBoundsPadding, padding)
  }
  setGravityRatio(ratio: number = this.store.gravityRatio) {
    this.store.gravityRatio = ratio;
  }
  setUpdateEveryFrame(value: number = this.store.everyFrame){
    this.store.everyFrame = value;
  }
  setTimeScale(value: number = this.store.timeScale){
    this.store.timeScale = value;
  }

  getGravity(): TVector {
    return [this.store.world.gravity.x * this.store.gravityRatio, this.store.world.gravity.y * this.store.gravityRatio];
  }
  getParticlesCount(){
    return this.store.particles.length - this.store.freeParticleIds.length;
  }
}