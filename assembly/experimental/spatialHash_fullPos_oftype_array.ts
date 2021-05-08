type TItem = u32;
type TCellid = u32;
type TCell = TItem[];
type THash = TCell[];
type TPrevItemCell = Map<TItem, TCellid>;
type TFullPositions = i32[];

const nearSteps: i8[] = [
  - 1, - 1,
    0, - 1,
    1, - 1,
  - 1,   0,
    0,   0,
    1,   0,
  - 1,   1,
    0,   1,
    1,   1,
];

function arrayPushElements(array: TItem[], elements: TItem[]): void {
  const endLength = array.length + elements.length;
  let ix = array.length;
  let eix = 0;
  while (ix < endLength) {
    array[ix++] = elements[eix++];
  }
}

function mathClamp(num: i32, min: i32, max: i32): i32 {
  // return num < min ? min : (num > max ? max : num);
  return num;
}

export class SpatialHash {
  private cs: i32 // cellSize
  private ox: i32 // Offset X
  private oy: i32 // Offset Y
  private cols: i32 // Column count
  private rows: i32 // Row count
  private h: THash
  // h: THash
  private p: TPrevItemCell = new Map()
  private f: TFullPositions = [] // Full positions

  constructor(cellSize: i32, boundsMinX: i32, boundsMinY: i32, boundsMaxX: i32, boundsMaxY: i32){
    this.cs = cellSize;
    this.ox = boundsMinX;
    this.oy = boundsMinY;
    this.cols = (boundsMaxX - boundsMinX) / cellSize;
    this.rows = (boundsMaxY - boundsMinY) / cellSize;

    const cellsCount: i32 = (this.cols + 1) * (this.rows + 1);

    this.h = new Array<TItem[]>(cellsCount);
    for (let i = 0; i < this.h.length; i++) {
      this.h[i] = []
    }
  }

  private getIndex(x: i32, y: i32): TCellid {
    return y * this.cols + x;
  }
  private getCell(x: i32, y: i32): TCell {
    const x2 = mathClamp(x, 0, this.cols);
    const y2 = mathClamp(y, 0, this.rows);
    const cellid = this.getIndex(x2, y2);
    return this.h[cellid];
  }
  private tryGetItems(x: i32, y: i32): TItem[] {
    if(x<0 || x>this.cols) return [];
    if(y<0 || y>this.rows) return [];
    const cellid = this.getIndex(x, y);
    return this.h[cellid];
  }
  private save(item: TItem, cellid: TCellid): void {
    const cell = this.h[cellid];
    if (cell.indexOf(item) == -1) {
      cell.push(item);
      this.p.set(item, cellid);
    }
  }
  private cacheFullPosition(item: TItem, x: i32, y: i32): void {
    this.f[item] = x;
    this.f[item + 1] = y;
  }
  private deleteIn(item: TItem, cellid: TCellid): void {
    const cell: TCell = this.h[cellid];
    const id = cell.indexOf(item);
    if(id != -1){
      cell.splice(id, 1)
    }
    this.p.delete(item);
  }

  update(item: TItem, x: i32, y: i32): void {
    const cellX: i32 = (x - this.ox) / this.cs;
    const cellY: i32 = (y - this.oy) / this.cs;
    const prevCellid: i32 = this.p.has(item) ? this.p.get(item) : -1;
    const nextCellid: i32 = this.getIndex(cellX, cellY);
    if (prevCellid !== nextCellid) {
      if (prevCellid !== -1) {
        this.deleteIn(item, prevCellid);
      }
      this.save(item, nextCellid);
    }
    this.cacheFullPosition(item, x, y);
  }
  insert(item: TItem, x: i32, y: i32): void {
    const cellX: i32 = (x - this.ox) / this.cs;
    const cellY: i32 = (y - this.oy) / this.cs;
    const сellid: i32 = this.getIndex(cellX, cellY);
    this.save(item, сellid);
    this.cacheFullPosition(item, x, y);
  }
  remove (item: TItem): void {
    if (this.p.has(item)) {
      const cellid: TCellid = this.p.get(item);
      this.deleteIn(item, cellid);
      // this.f.delete(item);
    }
  }

  // Special
  getNearby(x: i32, y: i32): TItem[] {
    const ccx: i32 = (x - this.ox) / this.cs;
    const ccy: i32 = (y - this.oy) / this.cs;
    const res: TItem[] = [];
    for (let i = 0; i < nearSteps.length; i+=2) {
      const sx = nearSteps[i];
      const sy = nearSteps[i + 1];
      const pids: TItem[] = this.tryGetItems(ccx + sx, ccy + sy);
      arrayPushElements(res, pids);
    }

    // Filter by radius
    const fres: TItem[] = [];
    const cs2 = this.cs ** 2;
    let fix = 0;
    for (let i = 0; i < res.length; i++) {
      const pid = res[i];
      const nx = this.f[pid] || i32.MAX_VALUE, ny = this.f[pid + 1] || i32.MAX_VALUE;
      if ((nx - x) ** 2 + (ny - y) ** 2 <= cs2) {
        fres[fix++] = pid;
      }
    }

    return fres;
  }
  getFromBounds(boundsMinX: i32, boundsMinY: i32, boundsMaxX: i32, boundsMaxY: i32): TItem[] {
    const x1: i32 = (boundsMinX - this.ox) / this.cs;
    const y1: i32 = (boundsMinY - this.oy) / this.cs;
    const x2: i32 = (boundsMaxX - this.ox) / this.cs;
    const y2: i32 = (boundsMaxY - this.oy) / this.cs;
    const res: TItem[] = [];
    for (let y = y1; y <= y2; y++) {
      for (let x = x1; x <= x2; x++) {
        const pids = this.getCell(x, y);
        arrayPushElements(res, pids);
      }
    }
    return res;
  }
  // fill: (particles: TParticle[]): void => {
  //   particles.forEach((part, pid) => {
  //     const x = part[P.X];
  //     const y = part[P.Y];
  //     sh.insert(pid, x, y);
  //   });
  // },

  // DEV only methods
  // getCoordsFromCellid(cellid: TSHCellId): TVector {
  //   return [(cellid % rowLength) * cellSize + leftPadding, Math.trunc(cellid / rowLength) * cellSize + topPadding]
  // },

}

// export class SpatialHash {
//   h: i32[][] = []
//   p: TPrevItemCell = []
//   // p: {}
//   private cellSize: i32
//   private leftPadding: i32
//   private topPadding: i32
//   private rowLength: i32
//   // const rowCount = Math.round((bounds.max.y - bounds.min.y) / cellSize);

//   constructor(cellSize: i32, bounds: TBounds){
//     this.cellSize = cellSize;
//     this.leftPadding = bounds.min.x;
//     this.topPadding = bounds.min.y;
//     this.rowLength = Math.round((bounds.max.x - bounds.min.x) / cellSize);
//   }

//   private getIndex(x: i32, y: i32): TCellid {
//     return y * this.rowLength + x;
//   }
//   private getCell( x: i32, y: i32): TItem[] {
//     // const x2 = mathClamp(x, 0, rowLength);
//     // const y2 = mathClamp(y, 0, rowCount);
//     return this.h[this.getIndex(x, y)] || [];
//   }
//   private save(item: TItem, cellid: TCellid): void {
//     const cell = this.h[cellid];
//     if (typeof cell === 'undefined') {
//       this.h[cellid] = [item];
//       this.p[item] = cellid;
//     } else if (!cell.includes(item)) {
//       cell.push(item);
//       this.p[item] = cellid;
//     }
//   }
//   private deleteIn(item: TItem, cellid: TCellid): void {
//     const cell: i32[] = this.h[cellid];
//     // arrayDeleteItem
//     const ix = cell.indexOf(item);
//     if (ix !== -1) {
//       cell.splice(ix, 1);
//     }
//     delete this.p[item];
//   }

//   update(item: TItem, x: i32, y: i32): void {
//     const cellX: i32 = Math.trunc((x - this.leftPadding) / this.cellSize);
//     const cellY: i32 = Math.trunc((y - this.topPadding) / this.cellSize);
//     const prevCellid: i32 = this.p[item];
//     const nextCellid: i32 = this.getIndex(cellX, cellY);
//     if (prevCellid !== nextCellid) {
//       if (typeof prevCellid !== 'undefined') {
//         this.deleteIn(item, prevCellid);
//       }
//       this.save(item, nextCellid);
//     }
//   }
//   insert(item: TItem, x: i32, y: i32): void {
//     const cellX: i32 = Math.trunc((x - this.leftPadding) / this.cellSize);
//     const cellY: i32 = Math.trunc((y - this.topPadding) / this.cellSize);
//     const сellid: i32 = this.getIndex(cellX, cellY);
//     this.save(item, сellid);
//   }
//   remove (item: TItem): void {
//     const cellid = this.p[item];
//     this.deleteIn(item, cellid);
//   }
//   // clear: (): void => {
//   //   sh.h = {};
//   //   sh.p = {};
//   // },

//   // Special
//   getNearby(x: i32, y: i32, particles: TParticle[]): i32[] {
//     const ccx: i32 = Math.trunc((x - this.leftPadding) / this.cellSize);
//     const ccy: i32 = Math.trunc((y - this.topPadding) / this.cellSize);
//     const near: TItem[] = [
//       ...this.getCell( ccx - 1, ccy - 1),
//       ...this.getCell( ccx, ccy - 1),
//       ...this.getCell( ccx + 1, ccy - 1),
//       ...this.getCell( ccx - 1, ccy),
//       ...this.getCell( ccx + 1, ccy),
//       ...this.getCell( ccx - 1, ccy + 1),
//       ...this.getCell( ccx, ccy + 1),
//       ...this.getCell( ccx + 1, ccy + 1),
//     ];
//     const res: TItem[] = this.getCell( ccx, ccy).slice(0);
//     for (let i = 0; i < near.length; i++) { // Filter only parts in radius
//       const pid = near[i];
//       const part = particles[pid];
//       if ((part[0] - x) ** 2 + (part[1] - y) ** 2 <= this.cellSize ** 2) {
//         res.push(pid);
//       }
//     }
//     return res;
//   }
//   getFromBounds(bounds: TBounds): TItem[] {
//     const x1: i32 = Math.trunc((bounds.min.x - this.leftPadding) / this.cellSize);
//     const y1: i32 = Math.trunc((bounds.min.y - this.topPadding) / this.cellSize);
//     const x2: i32 = Math.trunc((bounds.max.x - this.leftPadding) / this.cellSize);
//     const y2: i32 = Math.trunc((bounds.max.y - this.topPadding) / this.cellSize);
//     const res = [];
//     for (let y = y1; y <= y2; y++) {
//       for (let x = x1; x <= x2; x++) {
//         // res.push(...getCell(sh, x, y));
//         const pids = this.getCell(x, y);
//         for (let i = 0; i < pids.length; i++) {
//           res.push(pids[i]);
//         }
//       }
//     }
//     return res;
//   }
//   // fill: (particles: TParticle[]): void => {
//   //   particles.forEach((part, pid) => {
//   //     const x = part[P.X];
//   //     const y = part[P.Y];
//   //     sh.insert(pid, x, y);
//   //   });
//   // },

//   // ...(!DEV ? {} : { // DEV only methods
//   //   getCoordsFromCellid: (cellid: TSHCellId): TVector => [(cellid % rowLength) * cellSize + leftPadding, Math.trunc(cellid / rowLength) * cellSize + topPadding],
//   // }),
// }
