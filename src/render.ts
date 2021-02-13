import { liquids, ParticleProps, particles } from './liquid';
import { State } from './state';
import { checkPointInRect, getRectWithPaddingsFromBounds, startViewTransform } from './utils';

function getCoordsFromCellid(spatialHash: CSpatialHash, cellid: number): [number, number] {
  return [cellid % spatialHash._columns, Math.trunc(cellid / spatialHash._columns)];
}

function drawAtom(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
  const radius = 4;
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fill();
}


const colors: string[] = [];
for (let i = 0; i < 1000; i++) {
  colors.push('#'+Math.floor(Math.random()*16777215).toString(16));
}

function renderGrid(ctx: CanvasRenderingContext2D) {
  const cellSize = State.spatialHash.cellSize;

  // @ts-ignore
  const hashCells: Array<[number, TSpatialHashItem[]]> = Object.entries(State.spatialHash.hash)

  ctx.textAlign = 'center';
  for (let [cellid, cell] of hashCells) {
    const [cellX, cellY] = getCoordsFromCellid(State.spatialHash, cellid);
    const fX = cellX * cellSize;
    const fY = cellY * cellSize;
    const csh = cellSize / 2;

    if(cell.length !== 0){
      ctx.strokeStyle = 'green';
      ctx.fillStyle = 'white';
      ctx.fillText('' + cell.length, fX+csh, fY+csh);
    }else{
      ctx.strokeStyle = 'gray';
    }
    ctx.strokeRect(fX, fY, cellSize, cellSize);
  }
}

export const partColors: Map<number, string> = new Map();

export function update() {
  const ctx = State.render.context;
  startViewTransform(State.render);

  renderGrid(ctx);

  const renderRect = getRectWithPaddingsFromBounds(State.render.bounds, State.renderBoundsPadding);

  particles.forEach((part, id) => {
    const x = part[ParticleProps.x], y = part[ParticleProps.y];
    if(!checkPointInRect(x, y, ...renderRect))return;
    const color = partColors.get(id) || liquids[part[ParticleProps.liquidid]].color;
    drawAtom(ctx, x, y, color);
  })

  //   Draw active zone
  // ctx.strokeStyle = 'orange';
  // ctx.strokeRect(activeZone[0], activeZone[1], activeZone[4], activeZone[5]);
  //   Draw render zone
  ctx.strokeStyle = 'cyan';
  ctx.strokeRect(renderRect[0], renderRect[1], renderRect[2]-renderRect[0], renderRect[3]-renderRect[1]);
}