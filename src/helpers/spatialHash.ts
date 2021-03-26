export default function SpatialHash(cellSize: number): TSpatialHash {
  function getIndex(x: number, y: number /* , columnCount: number */): TSHCellId {
    return `${x}.${y}`;
    // return y * columnCount + x;
  }
  function arrayDeleteItem(arr: any[], item: any) {
    const ix = arr.indexOf(item);
    if (ix !== -1) { arr.splice(ix, 1); }
    return arr;
  }
  function save(sh: TSpatialHash, item: TSHItem, cellid: TSHCellId) {
    const cell = sh.h[cellid];
    if (typeof cell === 'undefined') {
      sh.h[cellid] = [item];
      sh.p[item] = cellid;
    } else if (!cell.includes(item)) {
      cell.push(item);
      sh.p[item] = cellid;
    }
  }
  function getCell(sh: TSpatialHash, x: number, y: number): TSHItem[] {
    return sh.h[getIndex(x, y)] || [];
  }
  function deleteIn(sh: TSpatialHash, item: TSHItem, cellid: TSHCellId): void {
    const cell = sh.h[cellid];
    arrayDeleteItem(cell, item);
    delete sh.p[item];
    if (cell.length === 0) {
      delete sh.h[cellid];
    }
  }

  const sh: TSpatialHash = {
    h: {},
    p: {},
    cs: cellSize,
    // clear: (): void => {
    //   sh.h = {};
    //   sh.p = {};
    // },
    update: (item: TSHItem, x: number, y: number): void => {
      const cellX = Math.trunc(x / sh.cs);
      const cellY = Math.trunc(y / sh.cs);
      const prevCellid = sh.p[item];
      const nextCellid = getIndex(cellX, cellY);
      if (prevCellid !== nextCellid) {
        if (typeof prevCellid !== 'undefined') {
          deleteIn(sh, item, prevCellid);
        }
        save(sh, item, nextCellid);
      }
    },
    insert: (item: TSHItem, x: number, y: number): void => {
      const cellX = Math.trunc(x / sh.cs);
      const cellY = Math.trunc(y / sh.cs);
      const сellid = getIndex(cellX, cellY);
      save(sh, item, сellid);
    },
    remove: (item: TSHItem): void => {
      const cellid = sh.p[item];
      deleteIn(sh, item, cellid);
    },

    // Special
    // fill: (particles: TParticle[]): void => {
    //   particles.forEach((part, pid) => {
    //     const x = part[P.X];
    //     const y = part[P.Y];
    //     sh.insert(pid, x, y);
    //   });
    // },
    getNearItems: (x: number, y: number, particles: TParticle[]): number[] => {
      const ccx = Math.trunc(x / sh.cs);
      const ccy = Math.trunc(y / sh.cs);
      const selfItemId = getIndex(ccx, ccy);
      const res: TSHItem[] = [
        ...getCell(sh, ccx - 1, ccy - 1),
        ...getCell(sh, ccx, ccy - 1),
        ...getCell(sh, ccx + 1, ccy - 1),
        ...getCell(sh, ccx - 1, ccy),
        ...arrayDeleteItem(sh.h[selfItemId] || [], selfItemId),
        ...getCell(sh, ccx + 1, ccy),
        ...getCell(sh, ccx - 1, ccy + 1),
        ...getCell(sh, ccx, ccy + 1),
        ...getCell(sh, ccx + 1, ccy + 1),
      ];
      return res;
    },
    getItemsByBounds: (bounds: Matter.Bounds): TSHItem[] => {
      const x1 = Math.trunc(bounds.min.x / sh.cs);
      const y1 = Math.trunc(bounds.min.y / sh.cs);
      const x2 = Math.trunc(bounds.max.x / sh.cs);
      const y2 = Math.trunc(bounds.max.y / sh.cs);
      const res = [];
      for (let y = y1; y <= y2; y++) {
        for (let x = x1; x <= x2; x++) {
          const cellid = getIndex(x, y);
          res.push(...(sh.h[cellid] || []));
        }
      }
      return res;
    },
  };
  return Object.seal(sh);
}

declare global {
  interface TSpatialHash {
    h: { [key: string]: TSHItem[] }
    p: { [key: number]: TSHCellId } // prevItemCell
    cs: number // Cell size (interaction radius)
    // clear: () => void
    // fill: (particles: TParticle[]) => void
    update: (item: TSHItem, x: number, y: number) => void
    insert: (it: TSHItem, x: number, y: number) => void
    remove: (item: TSHItem) => void
    getNearItems: (x: number, y: number, particles: TParticle[]) => number[]
    getItemsByBounds: (bounds: Matter.Bounds) => TSHItem[]
  }
}
