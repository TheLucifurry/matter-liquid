import { F, P } from '../constants';
import { arrayEach } from '../helpers/cycles';
import { checkPointInRect } from '../helpers/utils';

const Dryer = {
  dry(liquid: TLiquid, pid: number): void {
    const prototype = liquid.fluidByParticleId[pid];
    const particle = liquid.particles[pid];
    liquid.particles[pid] = null;
    liquid.spatialHash.remove(pid);
    liquid.events.particleRemove(particle, pid, prototype);
    if (liquid.freeParticleIds.indexOf(pid) === -1) {
      liquid.freeParticleIds.unshift(pid);
    }
    liquid.statistics.particlesCountByFluidId[prototype[F.ID] as number]--;
  },
  rect(liquid: TLiquid, zoneX: number, zoneY: number, zoneWidth: number, zoneHeight: number): void {
    const inboundsParticles = liquid.spatialHash.getFromRect([zoneX, zoneY, zoneX + zoneWidth, zoneY + zoneHeight]);
    arrayEach<TParticleId>(inboundsParticles, (pid) => {
      const part = liquid.particles[pid];
      if (part !== null && checkPointInRect(part[P.X], part[P.Y], [zoneX, zoneY, zoneX + zoneWidth, zoneY + zoneHeight])) {
        Dryer.dry(liquid, pid);
      }
    });
  },
  // TODO: methods circle, shape (using Matter geom) etc.
};
export default Dryer;
