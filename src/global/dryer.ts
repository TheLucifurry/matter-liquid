import { L, P } from '../constants';
import { checkPointInRect } from '../helpers/utils';

const Dryer = {
  dry(liquid: TLiquid, particleId: number): void {
    liquid.dpl.push(particleId);
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
