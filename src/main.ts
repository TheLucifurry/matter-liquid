import {
  checkParticleInRenerZone,
  liquids,
  particles,
  PropsKeys,
  updateParticles
} from './liquid';
import { drawAtom } from './utils';
import {
  activeZone,

  renderZone
} from './zones';


// export function setRenderer() {
//   const render: Matter.Render = this;
//   ctx = render.context;
//   console.log('setRenderer render:');
//   console.dir(render);
//   render.canvas.onclick = function(e: MouseEvent) {
//     spawnLiquid(1, e.offsetX, e.offsetY)
//   }
//   setActiveZone(...rect)
// }

// export function update() {
//   particles.forEach((part, particleid)=>{
//     // Ignore static and inactive particles
//     if(staticSet.has(part[PropsKeys.liquidid]) || disabledParts.has(particleid)) return;

//     // Gravity
//     part[PropsKeys.y] += getParticleGravityDelta(particleid);

//     updatePartState(particleid)

//     // Render
//     particles.forEach(a=>{
//       drawAtom(ctx, a[0], a[1], a[2]);
//     })
//     ctx.strokeStyle = 'orange';
//     ctx.strokeRect(...rect)
//   });
// }

// DEVELOPMENT
let canv: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;

export function init() {
  const originalCanv = document.querySelector('.matter-demo canvas') as HTMLCanvasElement;
  const mirrorCanv = document.createElement('canvas');
  mirrorCanv.width = originalCanv.width;
  mirrorCanv.height = originalCanv.height;
  mirrorCanv.style.cssText = 'position: fixed; z-index: 100000;';
  console.log('mirrorCanv:');
  console.dir(mirrorCanv);
  canv = mirrorCanv;
  ctx = mirrorCanv.getContext('2d');
  document.querySelector('.matter-demo').append(mirrorCanv)
}

export function update() {
  // Compute
  updateParticles();


  // Render
  ctx.clearRect(0, 0, canv.width, canv.height);

  //   Draw particles
  particles.forEach((parts, lid)=>{
    const color = liquids[lid].color;
    parts.forEach((part, pid)=>{
      // Ignore nactive particles
      if(!checkParticleInRenerZone(part)) return;
      drawAtom(ctx, part[PropsKeys.x], part[PropsKeys.y], color);
    });
  });

  //   Draw active zone
  ctx.strokeStyle = 'orange';
  ctx.strokeRect(activeZone[0], activeZone[1], activeZone[4], activeZone[5]);

  //   Draw render zone
  ctx.strokeStyle = 'green';
  ctx.strokeRect(renderZone[0], renderZone[1], renderZone[4], renderZone[5]);
}