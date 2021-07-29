import { F, P } from '../constants';
import { checkPointInRect } from '../helpers/utils';

const Chemics = {
  trans(liquid: TLiquid, pids: number[], fid: number): void {
    const linkList = liquid.fluidByParticleId;
    const nextFluidProto = liquid.fluids[fid];
    pids.forEach((pid) => {
      const oldFluidProto = liquid.fluidByParticleId[pid];
      linkList[pid] = nextFluidProto;
      liquid.statistics.particlesCountByFluidId[oldFluidProto[F.ID] as number]--;
      liquid.statistics.particlesCountByFluidId[nextFluidProto[F.ID] as number]++;
    });
  },
  transByName(liquid: TLiquid, pids: number[], fluidKey: TFluidKey): void {
    // @ts-ignore
    Chemics.trans(liquid, pids, Matter.Liquid.getFluidId(liquid, fluidKey));
  },
  transRect(liquid: TLiquid, tofluidKey: TFluidKey, zoneX: number, zoneY: number, zoneWidth: number, zoneHeight: number): void {
    // @ts-ignore
    const fid = Matter.Liquid.getFluidId(liquid, tofluidKey);
    // TODO: Optimize particle finding by using SpatialHash
    const pids: number[] = [];
    liquid.particles.forEach((part, pid) => {
      if (part !== null && checkPointInRect(part[P.X], part[P.Y], [zoneX, zoneY, zoneX + zoneWidth, zoneY + zoneHeight])) pids.push(pid);
    });
    Chemics.trans(liquid, pids, fid);
  },
  reacts(liquid: TLiquid, fluidKey: TFluidKey, callback: TChemicalReactionCallback) {
    // @ts-ignore
    const fid = Matter.Liquid.getFluidId(liquid, fluidKey);
    liquid.chemicsStore.isReactableByFid[fid] = true;
    liquid.chemicsStore.callbackByFid[fid] = callback;
  },
  // reactsBody
};
export default Chemics;
