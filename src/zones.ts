import { State } from './state';
import { checkPointInRect } from './utils';

export type TZone = [ x: number, y: number, x2: number, y2: number, w: number, h: number];

export let activeZone: TZone = [ null, null, null, null, null, null ];
export let renderZone: TZone = [ null, null, null, null, null, null ];
const zones = [activeZone, renderZone];

export const types = {
  ACTIVE: 0,
  RENDER: 1,
};

export function setZone(zonetype: number, x: number, y: number, w: number, h: number) {
  Object.assign(zones[zonetype], [x, y, x+w, y+h, w, h]);
}
export function setZonePosition(zonetype: number, x: number, y: number) {
  const z = zones[zonetype];
  setZone(zonetype, x, y, z[4], z[5]);
}
export function setZoneSize(zonetype: number, w: number, h: number) {
  const z = zones[zonetype];
  setZone(zonetype, z[0], z[1], w, h);
}

/* Prefer separate functions for better performance */
export function checkPointInActiveZone(x: number, y: number) {
  const [x1, y1, x2, y2] = activeZone;
  return checkPointInRect(x, y, x1, y1, x2, y2);
}
export function checkPointInRenderZone(x: number, y: number) {
  const [x1, y1, x2, y2] = renderZone;
  return checkPointInRect(x, y, x1, y1, x2, y2);
}

/* State dependent */
export function updateBounds() {
  const { bounds } = State.r;
  setZone(types.ACTIVE, bounds.min.x, bounds.min.y, bounds.max.x, bounds.max.y);
  setZone(types.RENDER, bounds.min.x, bounds.min.y, bounds.max.x, bounds.max.y);
}
