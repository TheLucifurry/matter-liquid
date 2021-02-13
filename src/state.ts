import SpatialHash from './spatialHash';

export const State: TState = {
  world: null,
  render: null,
  engine: null,
  gravity: [0, 0.01],
  radius: 30,
  spatialHash: new SpatialHash,
  renderBoundsPadding: [0, 0, 0, 0],
};

export function setWorld(world: Matter.World) {
  State.world = world;
}
export function setRender(render: Matter.Render) {
  State.render = render;
}
export function setRenderBoundsPadding(padding: number | TPadding) {
  if(typeof padding === 'number'){
    Object.assign(State.renderBoundsPadding, [padding, padding, padding, padding]);
  }else{
    Object.assign(State.renderBoundsPadding, [padding[0], padding[1], padding[2] || padding[0], padding[3] || padding[1]]);
  }
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