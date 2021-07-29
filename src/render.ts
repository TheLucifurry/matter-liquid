import { F, P } from './constants';
import {
  getRectFromBoundsWithPadding, getBodySurfaceIntersectsWithRay, getBodySurfaceNormal, getLineIntersectionPoint,
} from './helpers/tools';
import {
  getReflectVector, vectorAddVector, vectorEqualsVector, vectorFromTwo, vectorMul, vectorNormal,
} from './helpers/vector';
import VirtualCanvas from './helpers/virtualCanvas';
import * as WebGL from './gpu/webgl';

function renderGrid(liquid: TLiquid) {
  const ctx = liquid._render.context;
  const cs = liquid._h;
  const csh = cs / 2;

  const hashCells: Array<[string | TSHCellId, TSHItem[]]> = Object.entries(liquid._spatialHash.h);

  ctx.textAlign = 'center';
  ctx.lineWidth = 1;
  ctx.fillStyle = 'white';
  ctx.strokeStyle = 'green';
  for (const [cellid, cell] of hashCells) {
    const [fX, fY] = liquid._spatialHash.getCoordsFromCellid(+cellid);
    ctx.fillText(`${cell.length}`, fX + csh, fY + csh);
    ctx.strokeRect(fX, fY, cs, cs);
  }
}

// export const partColors: Map<number, string> = new Map();

export function generateParticleTexture(color: string, radius: number): TVirtualCanvas {
  const canvas = VirtualCanvas(radius * 6, radius * 6);
  const ctx = canvas.getContext('2d');
  ctx.shadowColor = color;
  ctx.shadowBlur = radius * 2;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(radius * 3, radius * 3, radius, 0, 2 * Math.PI);
  ctx.fill();
  return canvas;
}

function drawParticles(liquid: TLiquid) {
  const ctx = liquid._render.context;
  const renderRect = getRectFromBoundsWithPadding(liquid._render.bounds, liquid._renderBoundsPadding);
  const pids = liquid._spatialHash.getFromRect(renderRect);
  for (let i = 0; i < pids.length; i++) {
    const pid = pids[i];
    const part = liquid._particles[pid];
    const x = Math.floor(part[P.X]);
    const y = Math.floor(part[P.Y]);
    const particleTexture = liquid._fluidByParticleId[pid][F.TEXTURE] as OffscreenCanvas;
    const texSizeHalf = particleTexture.height / 2;
    ctx.drawImage(particleTexture, x - texSizeHalf, y - texSizeHalf);
  }
}

let mouseController: Matter.MouseConstraint;
let point1: Matter.Vector = { x: 0, y: 0 };
let point2: Matter.Vector = { x: 50, y: 50 };
const line1: TVector = [200, 0];
const line2: TVector = [50, 200];
let body: Matter.Body;

function drawPoint(ctx: CanvasRenderingContext2D, position: Matter.Vector | TVector, color = '#fff', size = 10) {
  const pos = Array.isArray(position) ? { x: position[0], y: position[1] } : position;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(pos.x, pos.y, size / 2, 0, 2 * Math.PI);
  ctx.fill();
}
function drawLine(ctx: CanvasRenderingContext2D, from: Matter.Vector | TVector, to: Matter.Vector | TVector, color = '#fff', lineWidth = 2) {
  const f = Array.isArray(from) ? { x: from[0], y: from[1] } : from;
  const t = Array.isArray(to) ? { x: to[0], y: to[1] } : to;
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.moveTo(f.x, f.y);
  ctx.lineTo(t.x, t.y);
  ctx.stroke();
}
if (DEV) {
  // @ts-ignore
  window.DEV_SET_MOUSE_CONTROLLER = (mouseConstraint: Matter.MouseConstraint, liquid: TLiquid) => {
    const world = liquid._world;
    const { mouse } = mouseConstraint;
    mouseController = mouseConstraint;
    Matter.Events.on(mouseConstraint, 'mousedown', () => {
      if (mouse.button === 2) {
        point1 = mouse.mousedownPosition;
      }
    });
    Matter.Events.on(mouseConstraint, 'mousemove', () => {
      point2 = mouse.position;
      const itersectsBodies = Matter.Query.point(world.bodies, mouse.position);
      body = itersectsBodies.length !== 0 ? itersectsBodies[0] : null;
    });
  };
}
export function update(liquid: TLiquid): void {
  const { context } = liquid._render;
  // Matter.Render.startViewTransform(liquid.r);
  // drawParticles(liquid);
  // @ts-ignore
  Matter.Render.startViewTransform({ ...liquid._render, context });
  WebGL.update(liquid);

  if (DEV) {
    const ENABLED = false;
    const ctx = context;
    // const inters = checkRayIntersectsLine(line1, line2, [point1.x, point1.y], [point2.x, point2.y]);
    // drawPoint(ctx, point1, 'green');
    // drawPoint(ctx, point2, 'lime');
    // drawLine(ctx, point1, point2, 'yellow');
    // drawLine(ctx, line1, line2, inters ? 'white' : 'gray');

    // const nearbyParts = liquid.sh.getNearby(point2.x, point2.y, liquid.p);
    // nearbyParts.forEach((pid) => {
    //   const part = liquid.p[pid];
    //   drawPoint(ctx, [part[P.X], part[P.Y]], 'red', 18);
    // });

    if (ENABLED && body) {
      const bodyPos: TVector = [body.position.x, body.position.y];
      const currentParticlePos: TVector = [point2.x, point2.y];
      const prevParticlePos: TVector = [point2.x, point2.y];
      const endParticlePos: TVector = !vectorEqualsVector(prevParticlePos, currentParticlePos) ? currentParticlePos : bodyPos;
      let newPosition: TVector;
      let surfNorm: TVector;

      if (body.circleRadius) { // is body a circle
        const radiusVector = vectorFromTwo(bodyPos, currentParticlePos);
        surfNorm = vectorNormal(radiusVector);
        newPosition = vectorAddVector(bodyPos, vectorMul(surfNorm, body.circleRadius));
        drawLine(ctx, bodyPos, newPosition, 'violet');
      } else {
        const endParticlePos: TVector = !vectorEqualsVector(prevParticlePos, currentParticlePos) ? currentParticlePos : bodyPos;
        const surface: [TVector, TVector] = getBodySurfaceIntersectsWithRay(body, endParticlePos, prevParticlePos);
        surfNorm = getBodySurfaceNormal(surface[0], surface[1]);
        newPosition = getLineIntersectionPoint(surface[0], surface[1], prevParticlePos, vectorAddVector(prevParticlePos, surfNorm));

        drawLine(ctx, surface[0], surface[1], 'cyan');
      }
      const refVec = getReflectVector(vectorFromTwo(prevParticlePos, endParticlePos), surfNorm);

      const surfLine = {
        x: newPosition[0] + surfNorm[0] * 50,
        y: newPosition[1] + surfNorm[1] * 50,
      };
      const refLine = {
        x: newPosition[0] + refVec[0],
        y: newPosition[1] + refVec[1],
      };

      drawLine(ctx, newPosition, refLine, 'lime');
      drawLine(ctx, newPosition, surfLine, 'red');
      drawPoint(ctx, newPosition, 'red');
    }
  }
}

export function updateDebug(liquid: TLiquid): void {
  const ctx = liquid._render.context;

  // @ts-ignore
  Matter.Render.startViewTransform(liquid._render);

  const renderRect = getRectFromBoundsWithPadding(liquid._render.bounds, liquid._renderBoundsPadding);
  const worldRect = getRectFromBoundsWithPadding(liquid._world.bounds);
  const activeRect = getRectFromBoundsWithPadding(liquid._render.bounds, liquid._activeBoundsPadding);

  renderGrid(liquid);

  drawParticles(liquid);

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
}
