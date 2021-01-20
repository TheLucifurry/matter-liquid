type TConfig = {
  w: Matter.World,
  g: [number, number],
  h: number,
}

export const Config: TConfig = {
  w: null,
  g: [0, 0.01],
  h: 30,
};

export function setWorld(world: Matter.World) {
  Config.w = world;
}
export function setGravity(vertical: number, horizontal: number) {
  const divider = 10;
  Config.g = [horizontal / divider, vertical / divider];
}
export function setInteractionRadius(value: number) {
  Config.h = value;
}