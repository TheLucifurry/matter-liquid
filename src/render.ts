import { PARTICLE_PROPS } from './constants';
import { arrayEach } from './helpers/cycles';
import { checkPointInRect, getParticlesInsideBodyIds, getRectWithPaddingsFromBounds } from './helpers/utils';

function getCoordsFromCellid(cellid: TSHCellId, cellSize: number): TVector {
  const p: any[] = cellid.split('.');
  return [p[0] * cellSize, p[1] * cellSize];
}

function renderGrid(store: TStore) {
  const ctx = store.render.context;
  const { cellSize } = store.spatialHash;
  const csh = cellSize / 2;

  // @ts-ignore
  const hashCells: Array<[TSHCellId, TSHItem[]]> = Object.entries(store.spatialHash.hash);

  ctx.textAlign = 'center';
  ctx.lineWidth = 1;
  ctx.fillStyle = 'white';
  ctx.strokeStyle = 'green';
  for (const [cellid, cell] of hashCells) {
    const [fX, fY] = getCoordsFromCellid(cellid, cellSize);
    ctx.fillText(`${cell.length}`, fX + csh, fY + csh);
    ctx.strokeRect(fX, fY, cellSize, cellSize);
  }
}

// export const partColors: Map<number, string> = new Map();

export function generateParticleTexture(color: string, radius: number): OffscreenCanvas {
  const particleTexture = new OffscreenCanvas(radius * 2, radius * 2);
  const partTexCtx = particleTexture.getContext('2d');
  partTexCtx.beginPath();
  partTexCtx.fillStyle = color;
  partTexCtx.arc(radius, radius, radius, 0, 2 * Math.PI);
  partTexCtx.fill();
  return particleTexture;
}

function drawParticles(store: TStore) {
  const { particles, liquidOfParticleId } = store; const
    ctx = store.render.context;
  const renderRect = getRectWithPaddingsFromBounds(store.render.bounds, store.renderBoundsPadding);
  arrayEach(particles, (part, pid) => {
    if (part === null || !checkPointInRect(part[PARTICLE_PROPS.X], part[PARTICLE_PROPS.Y], ...renderRect)) return;
    const x = Math.floor(part[PARTICLE_PROPS.X]);
    const y = Math.floor(part[PARTICLE_PROPS.Y]);
    const particleTexture = liquidOfParticleId[pid].texture;
    const texSizeHalf = particleTexture.height / 2;
    ctx.drawImage(particleTexture, x - texSizeHalf, y - texSizeHalf);
  });
}

let mouse: Matter.Mouse; let constraint: Matter.Constraint; let body: Matter.Body; let
  point: Matter.Vector;

if (DEV) {
  // @ts-ignore
  window.TEST_MOUSE_MOVE = (mouseConstraint: Matter.MouseConstraint) => {
    mouse = mouseConstraint.mouse;
    constraint = mouseConstraint.constraint;
    body = mouseConstraint.body;
    point = mouse.position;
  };
}

export function update(liquid: CLiquid): void {
  // @ts-ignore
  Matter.Render.startViewTransform(liquid.store.render);
  drawParticles(liquid.store);
}

export function updateDebug(liquid: CLiquid): void {
  const { store } = liquid; const
    ctx = store.render.context;

  // @ts-ignore
  Matter.Render.startViewTransform(store.render);

  const renderRect = getRectWithPaddingsFromBounds(store.render.bounds, store.renderBoundsPadding);
  const worldRect = getRectWithPaddingsFromBounds(store.world.bounds, [0, 0, 0, 0]);
  const activeRect = getRectWithPaddingsFromBounds(store.render.bounds, store.activeBoundsPadding);

  renderGrid(store);

  drawParticles(store);

  //   Draw world zone
  ctx.strokeStyle = 'violet';
  ctx.strokeRect(worldRect[0], worldRect[1], worldRect[2] - worldRect[0], worldRect[3] - worldRect[1]);
  //   Draw active zone
  ctx.strokeStyle = 'orange';
  ctx.strokeRect(activeRect[0], activeRect[1], activeRect[2] - activeRect[0], activeRect[3] - activeRect[1]);
  //   Draw render zone
  ctx.strokeStyle = 'cyan';
  ctx.strokeRect(renderRect[0], renderRect[1], renderRect[2] - renderRect[0], renderRect[3] - renderRect[1]);

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

  if (DEV) {
    if (mouse && body) {
      const insideBoundsPartids = getParticlesInsideBodyIds(liquid.store.particles, body, liquid.store.spatialHash);
      const ctx = liquid.store.render.context;
      ctx.strokeStyle = 'cyan';
      ctx.strokeRect(body.bounds.min.x, body.bounds.min.y, body.bounds.max.x - body.bounds.min.x, body.bounds.max.y - body.bounds.min.y);
      insideBoundsPartids.forEach((pid) => {
        const part = liquid.store.particles[pid];
        const x = part[PARTICLE_PROPS.X]; const
          y = part[PARTICLE_PROPS.Y];
        ctx.fillStyle = 'yellow';
        ctx.fillRect(x - 2, y - 2, 4, 4);
      });
      // const ctx = liquid.store.render.context;
      // const cX = 0, cY = 0, radius = 100;
      // ctx.beginPath();
      // ctx.fillStyle = pointInCircle(point.x, point.y, cX, cY, radius) ? 'green' : 'orange';
      // ctx.arc(cX, cY, radius, 0, 2 * Math.PI);
      // ctx.fill();
    }
  }
}
