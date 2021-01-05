
type TItem = number;

function trunc(number: number, divider: number): number {
  return Math.trunc(number / divider);
}
function getIndex(x: number, y: number, columnCount: number): number {
  return y * columnCount + x;
}

const aroundCellRelatives: number[][] = [
  [-1,-1], [ 0,-1], [ 1,-1],
  [-1, 0],          [ 1, 0],
  [-1, 1], [ 0, 1], [ 1, 1],
];

export default class SpatialHash{
  hash: { [key: number]: TItem[] }
  cellSize: number
  itemCount: number
  // cellCount: number = 0
  _columns: number

  getIterableHash(): Array<[number, TItem[]]> {
    // @ts-ignore
    return Object.entries(this.hash);
  };

  constructor(worldWidth: number, cellSize: number){
    this.cellSize = cellSize;
    this._columns = Math.ceil(worldWidth/cellSize);
    this.hash = {};
    this.itemCount = 0;
  }

  _find(cellid: number, item: TItem): number{
    return (this.hash[cellid] || []).indexOf(item)
  }

  _save(item: TItem, cellX: number, cellY: number){
    const cellid = getIndex(cellX, cellY, this._columns);
    const cell = this.hash[cellid];
    if(this._find(cellid, item) === -1) {
      if(cell !== undefined){
        cell.push(item);
      }else{
        this.hash[cellid] = [item];
      };
      this.itemCount++;
    }
  }

  _delete(item: TItem, cellX: number, cellY: number){
    const cellid = getIndex(cellX, cellY, this._columns);
    const itemIndex = this._find(cellid, item);
    // потестить вариант с .includes, должен быть быстрее
    if(itemIndex !== -1) {
      this.hash[cellid].splice(itemIndex, 1);
      this.itemCount--;
    }
  }

  insert(item: TItem, fullX: number, fullY: number) {
    const cellX = trunc(fullX, this.cellSize);
    const cellY = trunc(fullY, this.cellSize);
    this._save(item, cellX, cellY)
  }

  remove(item: TItem, fullX: number, fullY: number) {
    const cellX = trunc(fullX, this.cellSize);
    const cellY = trunc(fullY, this.cellSize);
    this._delete(item, cellX, cellY)
  }

  update(item: TItem, prevFullX: number, prevFullY: number, nextFullX: number, nextFullY: number){
    const prevCellX = trunc(prevFullX, this.cellSize);
    const prevCellY = trunc(prevFullY, this.cellSize);
    const nextCellX = trunc(nextFullX, this.cellSize);
    const nextCellY = trunc(nextFullY, this.cellSize);
    if(prevCellX !== nextCellX || prevCellY !== nextCellY) {
      this._delete(item, prevCellX, prevCellY);
      this._save(item, nextCellX, nextCellY);
      // console.log('update item:');
      // console.dir({ prevCellX, prevCellY, nextCellX, nextCellY});
    }
  }

  getAroundCellsItems(fullX: number, fullY: number){
    const centerCellX = trunc(fullX, this.cellSize);
    const centerCellY = trunc(fullY, this.cellSize);
    const selfItemId = getIndex(centerCellX, centerCellY, this._columns)
    const h = this.hash, c = this._columns;
    const res: TItem[] = [
      ...(h[getIndex(centerCellX, centerCellY, c)] || []).filter(v=>v!==selfItemId),
    ];
    for (const [dx, dy] of aroundCellRelatives) {
      res.push(...(h[getIndex(centerCellX + dx, centerCellY + dy, c)] || []))
    }
    return res;
  }

  // Dev
  getCoordsFromCellid(cellid: number): [number, number] {
    return [cellid % this._columns, Math.trunc(cellid / this._columns)];
  }
}