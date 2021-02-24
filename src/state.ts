import { DEFAULT_GRAVITY_RADIUS, DEFAULT_INTERACTION_RADIUS, DEF_EVERY_FRAME } from './constants';
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
  store: TStore = {
    world: null,
    render: null,
    engine: null,
    isPaused: false,
    gravityRatio: DEFAULT_GRAVITY_RADIUS,
    radius: DEFAULT_INTERACTION_RADIUS,
    spatialHash: new SpatialHash,
    renderBoundsPadding: [0, 0, 0, 0],
    activeBoundsPadding: [0, 0, 0, 0],
    liquids: [],
    particles: [],
    springs: {},
    freeParticleIds: [],
    tick: 0,
    everyFrame: DEF_EVERY_FRAME,
  }
  events = createEventsObject()

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
  setInteractionRadius(value: number = this.store.radius) {
    this.store.radius = value;
  }

  getGravity(): TVector {
    return [this.store.world.gravity.x * this.store.gravityRatio, this.store.world.gravity.y * this.store.gravityRatio];
  }
  getParticlesCount(){
    return this.store.particles.length - this.store.freeParticleIds.length;
  }
}