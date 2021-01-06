export const Config = {
  g: [0.001, 0.001],
  h: 30,
};

export function setGravity(vertical: number, horizontal: number = 0) {
  Config.g = [horizontal, vertical];
}
export function setInteractionRadius(value: number) {
  Config.h = value;
}