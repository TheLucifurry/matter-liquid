import { P } from './constants';

const t = Math.trunc;

function getIndex(x: number, y: number /* , columnCount: number */): TSHCellId {
  return `${x}.${y}`;
  // return y * columnCount + x;
}
function arrayDeleteItem(arr: any[], item: any) {
  const ix = arr.indexOf(item);
  if (ix !== -1) { arr.splice(ix, 1); }
  return arr;
}

export default class SpatialHash {
  hash: { [key: string]: TSHItem[] } = {};

  private prevItemCell: { [key: number]: TSHCellId }= {};

  cellSize: number;

  init(cellSize: number): void {
    this.cellSize = cellSize;
  }

  private find(cellid: TSHCellId, item: TSHItem): number {
    return (this.hash[cellid] || []).indexOf(item);
  }

  private save(item: TSHItem, cellid: TSHCellId) {
    const cell = this.hash[cellid];
    if (typeof cell === 'undefined') {
      this.hash[cellid] = [item];
      this.prevItemCell[item] = cellid;
    } else if (!cell.includes(item)) {
      cell.push(item);
      this.prevItemCell[item] = cellid;
    }
  }

  private getCell(x: number, y: number): TSHItem[] {
    return this.hash[getIndex(x, y)] || [];
  }

  _delete(item: TSHItem, cellid: TSHCellId): void {
    const cell = this.hash[cellid];
    arrayDeleteItem(cell, item);
    // const itemIndex = this.find(cellid, item);
    // this.hash[cellid].splice(itemIndex, 1);
    delete this.prevItemCell[item];
    if (cell.length === 0) {
      delete this.hash[cellid];
    }
  }

  update(item: TSHItem, x: number, y: number): void {
    const cellX = t(x / this.cellSize);
    const cellY = t(y / this.cellSize);
    const prevCellid = this.prevItemCell[item];
    const nextCellid = getIndex(cellX, cellY);
    if (prevCellid !== nextCellid) {
      if (typeof prevCellid !== 'undefined') {
        this._delete(item, prevCellid);
      }
      this.save(item, nextCellid);
    }
  }

  clear(): void {
    this.hash = {};
    this.prevItemCell = {};
  }

  insert(item: TSHItem, x: number, y: number): void {
    const cellX = t(x / this.cellSize);
    const cellY = t(y / this.cellSize);
    const сellid = getIndex(cellX, cellY);
    this.save(item, сellid);
  }

  remove(item: TSHItem): void {
    const cellid = this.prevItemCell[item];
    this._delete(item, cellid);
  }

  // Special
  getAroundCellsItems(x: number, y: number, particles: TParticle[]): number[] {
    const ccx = t(x / this.cellSize);
    const ccy = t(y / this.cellSize);
    const selfItemId = getIndex(ccx, ccy);
    const res: TSHItem[] = [
      ...this.getCell(ccx - 1, ccy - 1),
      ...this.getCell(ccx, ccy - 1),
      ...this.getCell(ccx + 1, ccy - 1),
      ...this.getCell(ccx - 1, ccy),
      ...arrayDeleteItem(this.hash[selfItemId] || [], selfItemId),
      ...this.getCell(ccx + 1, ccy),
      ...this.getCell(ccx - 1, ccy + 1),
      ...this.getCell(ccx, ccy + 1),
      ...this.getCell(ccx + 1, ccy + 1),
    ];

    // Filter only parts in radius
    // const filteredRes: TSHItem[] = [];
    // for (let i = 0; i < res.length; i++) {
    //   const pid = res[i];
    //   const part = particles[pid];
    //   const partX: number = t(part[PARTICLE_PROPS.X], this.cellSize); const
    //     partY: number = t(part[PARTICLE_PROPS.Y], this.cellSize);
    //   if ((partX - centerCellX) ** 2 + (partY - centerCellY) ** 2 <= 1) {
    //     filteredRes.push(pid);
    //   }
    // }
    // return filteredRes;
    return res;
  }

  fill(particles: TParticle[]): void {
    particles.forEach((part, pid) => {
      const x = part[P.X];
      const y = part[P.Y];
      this.insert(pid, x, y);
    });
  }

  getItemsOfCellsInBounds(bounds: Matter.Bounds): TSHItem[] {
    const x1 = t(bounds.min.x / this.cellSize);
    const y1 = t(bounds.min.y / this.cellSize);
    const x2 = t(bounds.max.x / this.cellSize);
    const y2 = t(bounds.max.y / this.cellSize);
    const res = [];
    for (let y = y1; y <= y2; y++) {
      for (let x = x1; x <= x2; x++) {
        const cellid = getIndex(x, y);
        res.push(...(this.hash[cellid] || []));
      }
    }
    return res;
  }
}

declare global {
  class CSpatialHash extends SpatialHash {}
}
