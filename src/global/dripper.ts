const Dripper = {
  drip(liquid: TLiquid, liquidid: number, x: number, y: number): void {
    const pid = liquid.fpids.length === 0 ? liquid.p.length : liquid.fpids.pop();
    const particle = new Float32Array([x, y, 0, 0]);
    liquid.lpl[pid] = liquid.l[liquidid];
    liquid.p[pid] = particle;
    liquid.sh.insert(pid, x, y);
  },
  rect(liquid: TLiquid, liquidKey: TLiquidKey, zoneX: number, zoneY: number, zoneWidth: number, zoneHeight: number, interval: number = liquid.h): void {
    const lid = liquid.getLiquidId(liquidKey);
    const halfInterval = interval / 2;
    const columns = Math.max(1, Math.trunc(zoneWidth / interval));
    const rows = Math.max(1, Math.trunc(zoneHeight / interval));
    for (let c = 0; c < columns; c++) {
      for (let r = 0; r < rows; r++) {
        const x = zoneX + halfInterval + c * interval;
        const y = zoneY + halfInterval + r * interval;
        Dripper.drip(liquid, lid, x, y);
        if (c !== columns - 1 && r !== rows - 1) {
          Dripper.drip(liquid, lid, x + halfInterval, y + halfInterval);
        }
      }
    }
  },
  // TODO: methods circle, shape (using Matter geom) etc.
};
export default Dripper;
