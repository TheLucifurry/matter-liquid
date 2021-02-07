import * as Render from './render';

type TState = {
  world: Matter.World,
  render: Matter.Render,
  engine: Matter.Engine,
  gravity: [number, number],
  radius: number,             // Interaction radius
}

export const State: TState = {
  world: null,
  render: null,
  engine: null,
  gravity: [0, 0.01],
  radius: 30,
};

export function setWorld(world: Matter.World) {
  State.world = world;
}
export function setRender(render: Matter.Render) {
  State.render = render;
  Render.init(render);
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