import { ParticleProps, particles, spatialHash, TLiquidParticle } from './liquid';
import SpatialHash, { TItem } from './spatialHash';
import { activeZone, renderZone } from './zones';

function getIterableHash(spatialHash: SpatialHash): Array<[number, TItem[]]> {
  // @ts-ignore
  return Object.entries(spatialHash.hash);
}
function getCoordsFromCellid(spatialHash: SpatialHash, cellid: number): [number, number] {
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

function renderGrid(ctx: CanvasRenderingContext2D, particles: TLiquidParticle[]) {
  const cellSize = spatialHash.cellSize;

  ctx.textAlign = 'center';
  let i = 0;
  for (let [cellid, cell] of getIterableHash(spatialHash)) {
    const [cellX, cellY] = getCoordsFromCellid(spatialHash, cellid);
    const fX = cellX * cellSize;
    const fY = cellY * cellSize;
    const csh = cellSize / 2;

    if(cell.length !== 0){
      ctx.strokeStyle = 'green';
      ctx.fillStyle = 'white';
      ctx.fillText('' + cell.length, fX+csh, fY+csh);
      cell.forEach(pid=>{
        const part = particles[pid];
        drawAtom(ctx, part[ParticleProps.x], part[ParticleProps.y], colors[i]);
      })
    }else{
      ctx.strokeStyle = 'gray';
    }
    ctx.strokeRect(fX, fY, cellSize, cellSize);
    i++;
  }
}

let canv: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;

export function init() {
  const originalCanv = document.querySelector('.matter-demo canvas') as HTMLCanvasElement;
  const mirrorCanv = document.createElement('canvas');
  mirrorCanv.width = originalCanv.width;
  mirrorCanv.height = originalCanv.height;
  mirrorCanv.style.cssText = 'position: fixed; z-index: 100000;';
  canv = mirrorCanv;
  ctx = mirrorCanv.getContext('2d');
  document.querySelector('.matter-demo').append(mirrorCanv);
  //@ts-ignore
  window.MIRROR_CANVAS = mirrorCanv;
}

export function update() {
  ctx.clearRect(0, 0, canv.width, canv.height);
  renderGrid(ctx, particles);
  //   Draw active zone
  ctx.strokeStyle = 'orange';
  ctx.strokeRect(activeZone[0], activeZone[1], activeZone[4], activeZone[5]);
  //   Draw render zone
  ctx.strokeStyle = 'blue';
  ctx.strokeRect(renderZone[0], renderZone[1], renderZone[4], renderZone[5]);
}