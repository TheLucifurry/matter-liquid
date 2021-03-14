export default class Dripper {
  liquid: CLiquid;

  store: TStore;

  events: TEvents;

  constructor(liquid: CLiquid) {
    this.liquid = liquid;
    this.store = liquid.store;
    this.events = liquid.events;
  }

  drip(liquidid: number, x: number, y: number): void {
    const pid = this.store.fpids.length === 0 ? this.store.p.length : this.store.fpids.pop();
    const particle = new Float32Array([x, y, 0, 0]);
    this.store.lpl[pid] = this.store.l[liquidid];
    this.store.p[pid] = particle;
    this.store.sh.insert(pid, x, y);
  }

  rect(liquidKey: TLiquidKey, zoneX: number, zoneY: number, zoneWidth: number, zoneHeight: number, interval: number = this.store.h): void {
    const lid = this.liquid.getLiquidId(liquidKey);
    const halfInterval = interval / 2;
    const columns = Math.max(1, Math.trunc(zoneWidth / interval));
    const rows = Math.max(1, Math.trunc(zoneHeight / interval));
    for (let c = 0; c < columns; c++) {
      for (let r = 0; r < rows; r++) {
        const x = zoneX + halfInterval + c * interval;
        const y = zoneY + halfInterval + r * interval;
        this.drip(lid, x, y);
        if (c !== columns - 1 && r !== rows - 1) {
          this.drip(lid, x + halfInterval, y + halfInterval);
        }
      }
    }
  }
  // TODO: methods circle, shape (using Matter geom) etc.
}
