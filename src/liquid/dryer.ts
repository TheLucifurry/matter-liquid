import { P } from '../constants';
import { checkPointInRect } from '../helpers/utils';

export default class Dryer {
  liquid: CLiquid;

  store: TStore;

  events: TEvents;

  constructor(liquid: CLiquid) {
    this.liquid = liquid;
    this.store = liquid.store;
    this.events = liquid.events;
  }

  dry(particleId: number): void {
    const particle = this.store.p[particleId];
    this.store.p[particleId] = null;
    this.store.sh.remove(particleId);
    this.events.particleRemove(particle, particleId, this.store.lpl[particleId]);
    this.store.fpids.push(particleId);
    // TODO: remove associated springs
  }

  rect(zoneX: number, zoneY: number, zoneWidth: number, zoneHeight: number): void {
    this.store.p.forEach((part, pid) => {
      if (part !== null && checkPointInRect(part[P.X], part[P.Y], zoneX, zoneY, zoneX + zoneWidth, zoneY + zoneHeight)) {
        this.dry(pid);
      }
    });
  }
}
