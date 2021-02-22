import Matter from 'matter-js';

function setPaddings(data: TFourNumbers, padding: number | TPadding) {
  if(typeof padding === 'number'){
    Object.assign(data, [padding, padding, padding, padding]);
  }else{
    Object.assign(data, [padding[0], padding[1], padding[2] || padding[0], padding[3] || padding[1]]);
  }
}

export default class State {
  store: TStore
  liquid: CLiquid

  constructor(liquid: CLiquid, engine: Matter.Engine, render: Matter.Render){
    this.liquid = liquid;
    this.store = liquid.store;
    this.store.engine = engine;
    this.store.world = engine.world;
    this.store.render = render;
  }

  setPause(isPause = true) {
    this.store.isPaused = isPause;
    if(isPause){
      Matter.Events.off(this.store.engine, 'afterUpdate', this.liquid.updateCompute);
    }else{
      Matter.Events.on(this.store.engine, 'afterUpdate', this.liquid.updateCompute);
    }
    this.liquid.events.pauseChange(isPause);
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