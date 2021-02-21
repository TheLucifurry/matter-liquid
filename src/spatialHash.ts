import { PARTICLE_PROPS } from './constants';

function trunc(number: number, divider: number): number {
  return Math.trunc(number / divider);
}
function getIndex(x: number, y: number, columnCount: number): number {
  return y * columnCount + x;
}
function arrayDeleteItem(arr: any[] = [], item: any) {
  const ix = arr.indexOf(item);
  if(ix !== -1)
    arr.splice(ix, 1);
  return arr;
}

const aroundCellRelatives: number[] = [
  -1,-1,  0,-1,  1,-1,
  -1, 0,         1, 0,
  -1, 1,  0, 1,  1, 1,
];

export default class SpatialHash{
  hash: { [key: number]: TSpatialHashItem[] } = {}
  prevItemCell: { [key: number]: number }= {}
  cellSize: number
  // itemCount: number
  // cellCount: number = 0
  _columns: number

  init(worldWidth: number, cellSize: number){
    this.cellSize = cellSize;
    this._columns = Math.ceil(worldWidth/cellSize);
    // this.itemCount = 0;
  }

  _find(cellid: number, item: TSpatialHashItem): number{
    return (this.hash[cellid] || []).indexOf(item)
  }

  _save(item: TSpatialHashItem, cellid: number){
    const cell = this.hash[cellid];
    if(cell === undefined){ // Потестить вариант: typeof value === "undefined"
      this.hash[cellid] = [item];
      this.prevItemCell[item] = cellid;
      // this.itemCount++;
    }else if(this._find(cellid, item) === -1) { // потестить вариант с .includes, должен быть быстрее
      cell.push(item);
      this.prevItemCell[item] = cellid;
      // this.itemCount++;
    }
  }

  _delete(item: TSpatialHashItem, cellid: number){
    const itemIndex = this._find(cellid, item);
    this.hash[cellid].splice(itemIndex, 1);
    this.prevItemCell[item] = undefined;
    // this.itemCount--;
  }

  update(item: TSpatialHashItem, x: number, y: number){
    const cellX = trunc(x, this.cellSize);
    const cellY = trunc(y, this.cellSize);
    const prevCellid = this.prevItemCell[item];
    const nextCellid = getIndex(cellX, cellY, this._columns);
    if(prevCellid !== nextCellid) {
      if(prevCellid !== undefined){ // Потестить вариант: typeof value === "undefined"
        this._delete(item, prevCellid);
      }
      this._save(item, nextCellid);
    }
  }

  clear(){
    this.hash = {};
    this.prevItemCell = {};
  }

  insert(item: TSpatialHashItem, x: number, y: number) {
    const cellX = trunc(x, this.cellSize);
    const cellY = trunc(y, this.cellSize);
    const сellid = getIndex(cellX, cellY, this._columns);
    this._save(item, сellid);
  }

  remove(item: TSpatialHashItem) {
    const cellid = this.prevItemCell[item];
    this._delete(item, cellid);
  }

  getAroundCellsItems(x: number, y: number){
    const centerCellX = trunc(x, this.cellSize);
    const centerCellY = trunc(y, this.cellSize);
    const c = this._columns;
    const selfItemId = getIndex(centerCellX, centerCellY, c);
    const res: TSpatialHashItem[] = [
      ...arrayDeleteItem(this.hash[selfItemId], selfItemId),
    ];
    for (let i = 0; i < aroundCellRelatives.length; i+=2) {
      const x = centerCellX + aroundCellRelatives[i], y = centerCellY + aroundCellRelatives[i+1];
      res.push(...(this.hash[getIndex(x, y, c)] || []))
    }
    return res;
  }

  // Special
  fill(particles: TLiquidParticle[]){
    particles.forEach((part, pid)=>{
      const x = part[PARTICLE_PROPS.X], y = part[PARTICLE_PROPS.Y];
      this.insert(pid, x, y);
    })
  }
  // getItemsNearBody(body: Matter.Body){
  //   const ewf = body.bounds
  // }
  // getCoordsFromCellid(cellid: number): [number, number] {
  //   return [cellid % this._columns, Math.trunc(cellid / this._columns)];
  // }
}

declare global {
  class CSpatialHash extends SpatialHash {}
}
