import { arrayDeleteItem } from './utils';

export default function SpatialHash(cellSize: number, bounds: Matter.Bounds): TSpatialHash {
  const leftPadding = bounds.min.x;
  const topPadding = bounds.min.y;
  const rowLength = Math.round((bounds.max.x - bounds.min.x) / cellSize);
  // const rowCount = Math.round((bounds.max.y - bounds.min.y) / cellSize);

  function getIndex(x: number, y: number): TSHCellId {
    return y * rowLength + x;
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
    // const x2 = mathClamp(x, 0, rowLength);
    // const y2 = mathClamp(y, 0, rowCount);
    return sh.h[getIndex(x, y)] || [];
  }
  function deleteIn(sh: TSpatialHash, item: TSHItem, cellid: TSHCellId): void {
    const cell = sh.h[cellid];
    arrayDeleteItem(cell, item);
    delete sh.p[item];
  }

  const sh: TSpatialHash = {
    h: [],
    p: {},
    // clear: (): void => {
    //   sh.h = {};
    //   sh.p = {};
    // },
    update: (item: TSHItem, x: number, y: number): void => {
      const cellX = Math.trunc((x - leftPadding) / cellSize);
      const cellY = Math.trunc((y - topPadding) / cellSize);
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
      const cellX = Math.trunc((x - leftPadding) / cellSize);
      const cellY = Math.trunc((y - topPadding) / cellSize);
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
    getNearby: (x: number, y: number, particles: TParticle[]): number[] => {
      const ccx = Math.trunc((x - leftPadding) / cellSize);
      const ccy = Math.trunc((y - topPadding) / cellSize);
      const near: TSHItem[] = [
        ...getCell(sh, ccx - 1, ccy - 1),
        ...getCell(sh, ccx, ccy - 1),
        ...getCell(sh, ccx + 1, ccy - 1),
        ...getCell(sh, ccx - 1, ccy),
        ...getCell(sh, ccx + 1, ccy),
        ...getCell(sh, ccx - 1, ccy + 1),
        ...getCell(sh, ccx, ccy + 1),
        ...getCell(sh, ccx + 1, ccy + 1),
      ];
      const res: TSHItem[] = getCell(sh, ccx, ccy).slice();
      for (let i = 0; i < near.length; i++) { // Filter only parts in radius
        const pid = near[i];
        const part = particles[pid];
        if ((part[0] - x) ** 2 + (part[1] - y) ** 2 <= cellSize ** 2) {
          res.push(pid);
        }
      }
      return res;
    },
    getFromBounds: (bounds: Matter.Bounds): TSHItem[] => {
      const x1 = Math.trunc((bounds.min.x - leftPadding) / cellSize);
      const y1 = Math.trunc((bounds.min.y - topPadding) / cellSize);
      const x2 = Math.trunc((bounds.max.x - leftPadding) / cellSize);
      const y2 = Math.trunc((bounds.max.y - topPadding) / cellSize);
      const res = [];
      for (let y = y1; y <= y2; y++) {
        for (let x = x1; x <= x2; x++) {
          res.push(...getCell(sh, x, y));
        }
      }
      return res;
    },

    ...(!DEV ? {} : { // DEV only methods
      getCoordsFromCellid: (cellid: TSHCellId): TVector => [(cellid % rowLength) * cellSize + leftPadding, Math.trunc(cellid / rowLength) * cellSize + topPadding],
    }),
  };
  return Object.seal(sh);
}

declare global {
  interface TSpatialHash {
    h: number[][]
    p: { [key: number]: TSHCellId } // prevItemCell
    // cs: number // Cell size (interaction radius)
    // clear: () => void
    // fill: (particles: TParticle[]) => void
    update: (item: TSHItem, x: number, y: number) => void
    insert: (it: TSHItem, x: number, y: number) => void
    remove: (item: TSHItem) => void
    getNearby: (x: number, y: number, particles: TParticle[]) => number[]
    getFromBounds: (bounds: Matter.Bounds) => TSHItem[]

    // DEV only methods
    getCoordsFromCellid?: (cellid: TSHCellId) => TVector
  }
}
