import * as Events from './events';
import SpatialHash from './spatialHash';

export const Store: TState = {
  world: null,
  render: null,
  engine: null,
  isPaused: false,
  gravityRatio: 1,
  radius: 30,
  spatialHash: new SpatialHash,
  renderBoundsPadding: [0, 0, 0, 0],
  activeBoundsPadding: [0, 0, 0, 0],
};

function setPaddings(data: TFourNumbers, padding: number | TPadding) {
  if(typeof padding === 'number'){
    Object.assign(data, [padding, padding, padding, padding]);
  }else{
    Object.assign(data, [padding[0], padding[1], padding[2] || padding[0], padding[3] || padding[1]]);
  }
}

export function setWorld(world: Matter.World) {
  Store.world = world;
}
export function setPause(value = true) {
  Store.isPaused = value;
  Events.emit(value ? Events.types.PAUSED : Events.types.CONTINUE);
}
export function setRender(render: Matter.Render) {
  Store.render = render;
}
export function setRenderBoundsPadding(padding: number | TPadding) {
  setPaddings(Store.renderBoundsPadding, padding)
}
export function setActiveBoundsPadding(padding: number | TPadding) {
  setPaddings(Store.activeBoundsPadding, padding)
}
export function setEngine(engine: Matter.Engine) {
  Store.engine = engine;
}
export function setGravityRatio(ratio: number) {
  Store.gravityRatio = ratio;
}
export function getGravity(): TVector {
  return [Store.world.gravity.x * Store.gravityRatio, Store.world.gravity.y * Store.gravityRatio];
}
export function setInteractionRadius(value: number) {
  Store.radius = value;
}