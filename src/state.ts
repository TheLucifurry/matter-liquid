import { GRAVITY_RATIO, INTERACTION_RADIUS, EVERY_FRAME, TIME_SCALE, IS_REGIONAL_COMPUTING, IS_WORLD_WRAPPED } from './constants';
import SpatialHash from './spatialHash';
import createEventsObject from './events';

function setPaddings(data: TFourNumbers, padding: number | TPadding) {
  if(typeof padding === 'number'){
    Object.assign(data, [padding, padding, padding, padding]);
  }else{
    Object.assign(data, [padding[0], padding[1], padding[2] || padding[0], padding[3] || padding[1]]);
  }
}

export default abstract class State {
  store: TStore
  events = createEventsObject()

  constructor(config: TLiquidConfig){
    this.store = {
      engine: config.engine,
      render: config.render,
      world: config.engine.world,
      radius: config.radius || INTERACTION_RADIUS,
      isRegionalComputing: config.isRegionalComputing || IS_REGIONAL_COMPUTING,
      isWorldWrapped: config.isWorldWrapped || IS_WORLD_WRAPPED,

      isPaused: false,
      gravityRatio: GRAVITY_RATIO,
      spatialHash: new SpatialHash,
      renderBoundsPadding: [0, 0, 0, 0],
      activeBoundsPadding: [0, 0, 0, 0],
      liquids: [],
      particles: [],
      springs: {},
      freeParticleIds: [],
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