import { P } from '../constants';
import { checkPointInRect } from '../helpers/utils';

const Chemics = {
  trans(liquid: TLiquid, pids: number[], lid: number): void {
    const linkList = liquid.lpl;
    const liquidProto = liquid.l[lid];
    pids.forEach((pid) => linkList[pid] = liquidProto);
  },
  transByName(liquid: TLiquid, pids: number[], liquidKey: TLiquidKey): void {
    // @ts-ignore
    Chemics.trans(liquid, pids, Matter.Liquid.getLiquidId(liquid, liquidKey));
  },
  transRect(liquid: TLiquid, toLiquidKey: TLiquidKey, zoneX: number, zoneY: number, zoneWidth: number, zoneHeight: number): void {
    // @ts-ignore
    const lid = Matter.Liquid.getLiquidId(liquid, toLiquidKey);
    // TODO: Optimize particle finding by using SpatialHash
    const pids: number[] = [];
    liquid.p.forEach((part, pid) => {
      if (part !== null && checkPointInRect(part[P.X], part[P.Y], [zoneX, zoneY, zoneX + zoneWidth, zoneY + zoneHeight])) pids.push(pid);
    });
    Chemics.trans(liquid, pids, lid);
  },
  reacts(liquid: TLiquid, liquidKey: TLiquidKey, callback: TChemicalReactionCallback) {
    // @ts-ignore
    const lid = Matter.Liquid.getLiquidId(liquid, liquidKey);
    liquid.x.canReacts[lid] = true;
    liquid.x.cbs[lid] = callback;
  },
  // reactsBody
};
export default Chemics;
