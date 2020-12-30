import { checkPointInRect } from './utils';

type TRect = [ x: number, y: number, x2: number, y2: number, w: number, h: number];

export let activeZone: TRect = [ null, null, null, null, null, null ];
export let renderZone: TRect = [ null, null, null, null, null, null ];
const zones = [activeZone, renderZone];

export const zoneType = {
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