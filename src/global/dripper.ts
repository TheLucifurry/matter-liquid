import { mathMax } from '../helpers/utils';

const Dripper = {
  drip(liquid: TLiquid, fid: number, x: number, y: number): void {
    const pid = liquid.freeParticleIds.length === 0 ? liquid.particles.length : liquid.freeParticleIds.pop();
    const particle = new Float32Array([x, y, 0, 0]);
    liquid.fluidByParticleId[pid] = liquid.fluids[fid];
    liquid.particles[pid] = particle;
    liquid.spatialHash.insert(pid, x, y);
    liquid.statistics.particlesCountByFluidId[fid]++;
  },
  rect(liquid: TLiquid, fluidKey: TFluidKey, zoneX: number, zoneY: number, zoneWidth: number, zoneHeight: number, interval: number = liquid.h): void {
    // @ts-ignore
    const fid = Matter.Liquid.getFluidId(liquid, fluidKey);
    const halfInterval = interval / 2;
    const columns = mathMax(Math.trunc(zoneWidth / interval), 1);
    const rows = mathMax(Math.trunc(zoneHeight / interval), 1);
    for (let c = 0; c < columns; c++) {
      for (let r = 0; r < rows; r++) {
        const x = zoneX + halfInterval + c * interval;
        const y = zoneY + halfInterval + r * interval;
        Dripper.drip(liquid, fid, x, y);
        if (c !== columns - 1 && r !== rows - 1) {
          Dripper.drip(liquid, fid, x + halfInterval, y + halfInterval);
        }
      }
    }
  },
  // TODO: methods circle, shape (using Matter geom) etc.
};
export default Dripper;
