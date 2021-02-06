import * as Render from './render';

type TState = {
  w: Matter.World,
  r: Matter.Render,
  e: Matter.Engine,
  g: [number, number],
  h: number,
}

export const State: TState = {
  w: null,
  r: null,
  e: null,
  g: [0, 0.01],
  h: 30,
};

export function setWorld(world: Matter.World) {
  State.w = world;
}
export function setRender(render: Matter.Render) {
  State.r = render;
  Render.init(render);
}
export function setEngine(engine: Matter.Engine) {
  State.e = engine;
}
export function setGravity(vertical: number, horizontal: number) {
  const divider = 10;
  State.g = [horizontal / divider, vertical / divider];
}
export function setInteractionRadius(value: number) {
  State.h = value;
}