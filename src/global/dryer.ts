import { F, P } from '../constants';
import { arrayEach } from '../helpers/cycles';
import { checkPointInRect } from '../helpers/utils';

const Dryer = {
  dry(liquid: TLiquid, pid: number): void {
    const prototype = liquid._fluidByParticleId[pid];
    const particle = liquid._particles[pid];
    liquid._particles[pid] = null;
    liquid._spatialHash.remove(pid);
    liquid._events.particleRemove(particle, pid, prototype);
    if (liquid._freeParticleIds.indexOf(pid) === -1) {
      liquid._freeParticleIds.unshift(pid);
    }
    liquid._statistics._particlesCountByFluidId[prototype[F.ID] as number]--;
  },
  rect(liquid: TLiquid, zoneX: number, zoneY: number, zoneWidth: number, zoneHeight: number): void {
    const inboundsParticles = liquid._spatialHash.getFromRect([zoneX, zoneY, zoneX + zoneWidth, zoneY + zoneHeight]);
    arrayEach<TParticleId>(inboundsParticles, (pid) => {
      const part = liquid._particles[pid];
      if (part !== null && checkPointInRect(part[P.X], part[P.Y], [zoneX, zoneY, zoneX + zoneWidth, zoneY + zoneHeight])) {
        Dryer.dry(liquid, pid);
      }
    });
  },
  // TODO: methods circle, shape (using Matter geom) etc.
};
export default Dryer;
