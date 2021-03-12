import Matter from 'matter-js';
import * as Algorithm from './algorithm';
import * as Renderer from './render';
import { P } from './constants';
import State from './state';
import { checkPointInRect } from './helpers/utils';

export default class Liquid extends State {
  private computeUpdater: any;

  private renderUpdater: any;

  constructor(config: TLiquidConfig) {
    super(config);
    this.setGravityRatio(config.gravityRatio);
    this.store.spatialHash.init(this.store.radius);
    this.setUpdateEveryFrame(config.updateEveryFrame);
    this.setTimeScale(config.timeScale);

    // Set compute updater
    this.setUpdaters(config);

    // Set render updater
    Matter.Events.on(config.render, 'afterRender', this.updateRender.bind(this));

    if (DEV) {
      console.log('Liquid:'); console.dir(this);
      // @ts-ignore
      window.Liquid = this;
    }
  }

  private setUpdaters(config: TLiquidConfig) {
    this.renderUpdater = config.isDebug ? Renderer.updateDebug : Renderer.update;
    this.computeUpdater = config.isAdvancedAlgorithm ? Algorithm.advanced : Algorithm.simple;
    this.updateCompute = this.updateCompute.bind(this);
    this.setPause(!!config.isPaused); // Enable updating
  }

  private updateCompute() {
    if (this.store.tick++ % this.store.everyFrame === 0) {
      this.computeUpdater(this, this.store.engine.timing.timeScale * this.store.timeScale);
    }
  }

  private updateRender() {
    this.renderUpdater(this);
  }

  setPause(isPause = true): void {
    if (isPause) {
      Matter.Events.off(this.store.engine, 'afterUpdate', this.updateCompute);
    } else {
      Matter.Events.on(this.store.engine, 'afterUpdate', this.updateCompute);
    }
    super.setPause(isPause);
  }

  spawnParticle(liquidid: number, x: number, y: number): void {
    const pid = this.store.freeParticleIds.length === 0 ? this.store.particles.length : this.store.freeParticleIds.pop();
    const particle = new Float32Array(4);
    particle[P.X] = x;
    particle[P.Y] = y;
    particle[P.VEL_X] = 0;
    particle[P.VEL_Y] = 0;
    this.store.liquidOfParticleId[pid] = this.store.liquids[liquidid];
    this.store.particles[pid] = particle;
    this.store.spatialHash.insert(pid, x, y);
  }

  removeParticle(particleId: number): void {
    const particle = this.store.particles[particleId];
    this.store.particles[particleId] = null;
    this.store.spatialHash.remove(particleId);
    this.events.particleRemove(particle, particleId, this.store.liquidOfParticleId[particleId]);
    this.store.freeParticleIds.push(particleId);
    // TODO: remove associated springs
  }

  fillZoneByLiquid(zoneX: number, zoneY: number, zoneWidth: number, zoneHeight: number, liquidid: number, interval: number = this.store.radius): void {
    const halfInterval = interval / 2;
    const columns = Math.max(1, Math.trunc(zoneWidth / interval));
    const rows = Math.max(1, Math.trunc(zoneHeight / interval));
    for (let c = 0; c < columns; c++) {
      for (let r = 0; r < rows; r++) {
        const x = zoneX + halfInterval + c * interval;
        const y = zoneY + halfInterval + r * interval;
        this.spawnParticle(liquidid, x, y);
        if (c !== columns - 1 && r !== rows - 1) {
          this.spawnParticle(liquidid, x + halfInterval, y + halfInterval);
        }
      }
    }
  }

  clearZoneByLiquid(zoneX: number, zoneY: number, zoneWidth: number, zoneHeight: number, liquidid: number): void {
    this.store.particles.forEach((part, pid) => {
      if (part !== null && checkPointInRect(part[P.X], part[P.Y], zoneX, zoneY, zoneX + zoneWidth, zoneY + zoneHeight)) {
        this.removeParticle(pid);
      }
    });
  }

  checkRectContainsParticle(rect: TRect, particle: TLiquidParticle): boolean {
    return checkPointInRect(particle[P.X], particle[P.Y], ...rect);
  }
}

declare global {
  class CLiquid extends Liquid {}
}
