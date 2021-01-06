import { update as computeUpdate } from './algorithm';
import { init as initLiquid } from './liquid';
import { init as rendererInit, update as rendererUpdate } from './render';

export function init() {
  const worldWidth = 1000;
  initLiquid(worldWidth, 64);
  rendererInit();
}

let deltaTime = 1;
export function update() {
  computeUpdate(deltaTime);
  rendererUpdate();
}