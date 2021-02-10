export type TItem = number;

function trunc(number: number, divider: number): number {
  return Math.trunc(number / divider);
}
function getIndex(x: number, y: number, columnCount: number): number {
  return y * columnCount + x;
}
function arrayDeleteItem(arr: any[], item: any) {
  const ix = arr.indexOf(item);
  if(ix !== -1)
    arr.splice(ix, 1);
  return arr;
}

const aroundCellRelatives: number[][] = [
  [-1,-1], [ 0,-1], [ 1,-1],
  [-1, 0],          [ 1, 0],
  [-1, 1], [ 0, 1], [ 1, 1],
];

export default class SpatialHash{
  hash: { [key: number]: TItem[] }
  prevItemCell: { [key: number]: number }
  cellSize: number
  // itemCount: number
  // cellCount: number = 0
  _columns: number

  constructor(worldWidth: number, cellSize: number){
    this.cellSize = cellSize;
    this._columns = Math.ceil(worldWidth/cellSize);
    this.hash = {};
    this.prevItemCell = {};
    // this.itemCount = 0;
  }

  _find(cellid: number, item: TItem): number{
    return (this.hash[cellid] || []).indexOf(item)
  }

  _save(item: TItem, cellid: number){
    const cell = this.hash[cellid];
    if(cell === undefined){ // Потестить вариант: typeof value === "undefined"
      this.hash[cellid] = [item];
      this.prevItemCell[item] = cellid;
    }else if(this._find(cellid, item) === -1) { // потестить вариант с .includes, должен быть быстрее
      cell.push(item);
      // this.itemCount++;
      this.prevItemCell[item] = cellid;
    }
  }

  _delete(item: TItem, cellid: number){
    const itemIndex = this._find(cellid, item);
    this.hash[cellid].splice(itemIndex, 1);
    // this.itemCount--;
  }

  update(item: TItem, fullX: number, fullY: number){
    const cellX = trunc(fullX, this.cellSize);
    const cellY = trunc(fullY, this.cellSize);
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
  }

  insert(item: TItem, x: number, y: number) {
    const сellid = getIndex(x, y, this._columns);
    this._save(item, сellid);
  }

  getAroundCellsItems(fullX: number, fullY: number){
    const centerCellX = trunc(fullX, this.cellSize);
    const centerCellY = trunc(fullY, this.cellSize);
    const h = this.hash, c = this._columns;
    const selfItemId = getIndex(centerCellX, centerCellY, c);
    const res: TItem[] = [
      ...arrayDeleteItem((h[selfItemId] || []), selfItemId),
    ];
    for (const [dx, dy] of aroundCellRelatives) {
      res.push(...(h[getIndex(centerCellX + dx, centerCellY + dy, c)] || []))
    }
    return res;
  }

  // getItemsNearBody(body: Matter.Body){
  //   const ewf = body.

  // }

  // insert(item: TItem, fullX: number, fullY: number) {
  //   const cellX = trunc(fullX, this.cellSize);
  //   const cellY = trunc(fullY, this.cellSize);
  //   this._save(item, cellX, cellY)
  // }

  // remove(item: TItem, fullX: number, fullY: number) {
  //   const cellX = trunc(fullX, this.cellSize);
  //   const cellY = trunc(fullY, this.cellSize);
  //   this._delete(item, cellX, cellY)
  // }

  // getIterableHash(): Array<[number, TItem[]]> {
  //   // @ts-ignore
  //   return Object.entries(this.hash);
  // };

  // getCoordsFromCellid(cellid: number): [number, number] {
  //   return [cellid % this._columns, Math.trunc(cellid / this._columns)];
  // }
}