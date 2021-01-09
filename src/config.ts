export const Config = {
  g: [0, 0.01],
  h: 30,
};

export function setGravity(vertical: number, horizontal: number) {
  const divider = 10;
  Config.g = [horizontal / divider, vertical / divider];
}
export function setInteractionRadius(value: number) {
  Config.h = value;
}