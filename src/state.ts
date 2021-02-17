import * as Events from './events';
import SpatialHash from './spatialHash';

export const State: TState = {
  world: null,
  render: null,
  engine: null,
  isPaused: false,
  gravity: [0, 0.01],
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
  State.world = world;
}
export function setPause(value = true) {
  State.isPaused = value;
  Events.emit(value ? Events.types.PAUSED : Events.types.CONTINUE);
}
export function setRender(render: Matter.Render) {
  State.render = render;
}
export function setRenderBoundsPadding(padding: number | TPadding) {
  setPaddings(State.renderBoundsPadding, padding)
}
export function setActiveBoundsPadding(padding: number | TPadding) {
  setPaddings(State.activeBoundsPadding, padding)
}
export function setEngine(engine: Matter.Engine) {
  State.engine = engine;
}
export function setGravity(vertical: number, horizontal: number) {
  const divider = 10;
  State.gravity = [horizontal / divider, vertical / divider];
}
export function setInteractionRadius(value: number) {
  State.radius = value;
}