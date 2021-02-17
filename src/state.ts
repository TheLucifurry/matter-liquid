import SpatialHash from './spatialHash';

function setPaddings(data: TFourNumbers, padding: number | TPadding) {
  if(typeof padding === 'number'){
    Object.assign(data, [padding, padding, padding, padding]);
  }else{
    Object.assign(data, [padding[0], padding[1], padding[2] || padding[0], padding[3] || padding[1]]);
  }
}

export default class State {
  store: TStore = {
    world: null,
    render: null,
    engine: null,
    isPaused: false,
    gravityRatio: 1,
    radius: 30,
    spatialHash: new SpatialHash,
    renderBoundsPadding: [0, 0, 0, 0],
    activeBoundsPadding: [0, 0, 0, 0],
  }

  constructor(engine: Matter.Engine, render: Matter.Render){
    this.store.engine = engine;
    this.store.world = engine.world;
    this.store.render = render;
  }

  setPause(value = true) {
    this.store.isPaused = value;
    // Events.emit(value ? Events.types.PAUSED : Events.types.CONTINUE);
  }
  setRenderBoundsPadding(padding: number | TPadding) {
    setPaddings(this.store.renderBoundsPadding, padding)
  }
  setActiveBoundsPadding(padding: number | TPadding) {
    setPaddings(this.store.activeBoundsPadding, padding)
  }
  setGravityRatio(ratio: number) {
    this.store.gravityRatio = ratio;
  }
  getGravity(): TVector {
    return [this.store.world.gravity.x * this.store.gravityRatio, this.store.world.gravity.y * this.store.gravityRatio];
  }
  setInteractionRadius(value: number) {
    this.store.radius = value;
  }
}