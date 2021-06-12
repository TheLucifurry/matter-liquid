import { L, P } from '../constants';
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
    liquid.st.cl[prototype[L.ID] as number]--;
    // TODO: remove associated springs
  },
  rect(liquid: TLiquid, zoneX: number, zoneY: number, zoneWidth: number, zoneHeight: number): void {
    // TODO: Optimize particle finding by using SpatialHash
    liquid.p.forEach((part, pid) => {
      if (part !== null && checkPointInRect(part[P.X], part[P.Y], [zoneX, zoneY, zoneX + zoneWidth, zoneY + zoneHeight])) {
        Dryer.dry(liquid, pid);
      }
    });
  },
  // TODO: methods circle, shape (using Matter geom) etc.
};
export default Dryer;
