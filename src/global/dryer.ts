import { F, P } from '../constants';
import { arrayEach } from '../helpers/cycles';
import { checkPointInRect } from '../helpers/utils';

const Dryer = {
  dry(liquid: TLiquid, pid: number): void {
    const prototype = liquid.fpl[pid];
    const particle = liquid.p[pid];
    liquid.p[pid] = null;
    liquid.sh.remove(pid);
    liquid.ev.particleRemove(particle, pid, prototype);
    if (liquid.fpids.indexOf(pid) === -1) {
      liquid.fpids.unshift(pid);
    }
    liquid.st.cl[prototype[F.ID] as number]--;
  },
  rect(liquid: TLiquid, zoneX: number, zoneY: number, zoneWidth: number, zoneHeight: number): void {
    const inboundsParticles = liquid.sh.getFromRect([zoneX, zoneY, zoneX + zoneWidth, zoneY + zoneHeight]);
    arrayEach<TParticleId>(inboundsParticles, (pid) => {
      const part = liquid.p[pid];
      if (part !== null && checkPointInRect(part[P.X], part[P.Y], [zoneX, zoneY, zoneX + zoneWidth, zoneY + zoneHeight])) {
        Dryer.dry(liquid, pid);
      }
    });
  },
  // TODO: methods circle, shape (using Matter geom) etc.
};
export default Dryer;
