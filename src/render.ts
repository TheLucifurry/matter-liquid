import Matter from 'matter-js';
import { PARTICLE_PROPS } from './constants';
import { arrayEach, getRectWithPaddingsFromBounds } from './utils';

// function getCoordsFromCellid(spatialHash: CSpatialHash, cellid: TSHCellId) {
//   return [cellid % spatialHash._columns, Math.trunc(cellid / spatialHash._columns)];
// }
function getCoordsFromCellid(cellid: TSHCellId, cellSize: number): TVector {
  const p = cellid.split('.');
  // @ts-ignore
  return [p[0] * cellSize, p[1] * cellSize];
}

function drawAtom(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
  const radius = 10;
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fill();
}

// const colors: string[] = [];
// for (let i = 0; i < 1000; i++) {
//   colors.push('#'+Math.floor(Math.random()*16777215).toString(16));
// }

function renderGrid(store: TStore) {
  const ctx = store.render.context
  const cellSize = store.spatialHash.cellSize;
  const csh = cellSize / 2;

  // @ts-ignore
  const hashCells: Array<[TSHCellId, TSHItem[]]> = Object.entries(store.spatialHash.hash)

  ctx.textAlign = 'center';
  ctx.lineWidth = 1;
  ctx.fillStyle = 'white';
  for (let [cellid, cell] of hashCells) {
    const [fX, fY] = getCoordsFromCellid(cellid, cellSize);

    if(cell.length !== 0){
      ctx.strokeStyle = 'green';
      ctx.fillText('' + cell.length, fX + csh, fY + csh);
    }else{
      ctx.strokeStyle = 'gray';
    }
    ctx.strokeRect(fX, fY, cellSize, cellSize);
  }
}

export const partColors: Map<number, string> = new Map();

export default function update(liquid: CLiquid) {
  const Store = liquid.store;
  const { particles, liquids } = Store;

  const ctx = Store.render.context;
  //@ts-ignore
  Matter.Render.startViewTransform(Store.render);

  renderGrid(Store);

  const worldRect = getRectWithPaddingsFromBounds(Store.world.bounds, [0, 0, 0, 0]);
  const activeRect = getRectWithPaddingsFromBounds(Store.render.bounds, Store.activeBoundsPadding);
  const renderRect = getRectWithPaddingsFromBounds(Store.render.bounds, Store.renderBoundsPadding);

  arrayEach(particles, (part, id) => {
    if(part === null || !liquid.checkRectContainsParticle(renderRect, part))return;
    const x = part[PARTICLE_PROPS.X], y = part[PARTICLE_PROPS.Y];
    const color = partColors.get(id) || liquids[part[PARTICLE_PROPS.LIQUID_ID]].color;
    drawAtom(ctx, x, y, color);
  })

  //   Draw world zone
  ctx.strokeStyle = 'violet';
  ctx.strokeRect(worldRect[0], worldRect[1], worldRect[2]-worldRect[0], worldRect[3]-worldRect[1]);
  //   Draw active zone
  ctx.strokeStyle = 'orange';
  ctx.strokeRect(activeRect[0], activeRect[1], activeRect[2]-activeRect[0], activeRect[3]-activeRect[1]);
  //   Draw render zone
  ctx.strokeStyle = 'cyan';
  ctx.strokeRect(renderRect[0], renderRect[1], renderRect[2]-renderRect[0], renderRect[3]-renderRect[1]);

  // Draw world center
  const radius = 1000;
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'yellow';
  ctx.beginPath();
  ctx.moveTo(-radius, 0);
  ctx.lineTo(radius, 0);
  ctx.moveTo(0, -radius);
  ctx.lineTo(0, radius);
  ctx.stroke();
}