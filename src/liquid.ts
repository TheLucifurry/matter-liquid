import Matter from 'matter-js';
import * as Algorithm from './algorithm';
import updateRender from './render';
import { WORLD_WIDTH, PARTICLE_PROPS } from './constants';
import State from './state';
import { checkPointInRect, getWorldWidth } from './utils';

const LiquidPropDefaults: Required<TLiquidProps> = {
  color: '#fff',
  plasticity: 0.3,
  // stiffness: 0.004,
}

export default class Liquid extends State {
  algorithm: any

  constructor(config: TLiquidConfig){
    super();
    this.store.engine = config.engine;
    this.store.world = config.engine.world;
    this.store.render = config.render;
    this.setGravityRatio(config.gravityRatio);
    this.setInteractionRadius(config.radius);
    this.store.spatialHash.init(
      getWorldWidth(this.store.world, WORLD_WIDTH),
      this.store.radius,
    );
    this.setUpdateEveryFrame(config.updateEveryFrame);
    this.setTimeScale(config.timeScale);

    // Set compute updater
    this.setComputeUpdater(config);

    // Set render updater
    Matter.Events.on(config.render, 'afterRender', this.updateRender.bind(this))

    // DEV
    console.log('Liquid:'); console.dir(this);
    //@ts-ignore
    window.Liquid = this;
  }

  setPause(isPause = true) {
    if(isPause){
      Matter.Events.off(this.store.engine, 'afterUpdate', this.updateCompute);
    }else{
      Matter.Events.on(this.store.engine, 'afterUpdate', this.updateCompute);
    }
    super.setPause(isPause);
  }

  private setComputeUpdater(config: TLiquidConfig){
    if (config.isAdvancedAlgorithm) {
      this.algorithm = config.isRegionalComputing ? Algorithm.advanced_region : Algorithm.advanced_world;
    } else {
      this.algorithm = config.isRegionalComputing ? Algorithm.simple_region : Algorithm.simple_world;
    }
    this.updateCompute = this.updateCompute.bind(this);
    this.setPause(!!config.isPaused); // Enable updating
  }
  updateCompute(){
    if(this.store.tick++ % this.store.everyFrame === 0){
      this.algorithm(this, this.store.engine.timing.timeScale * this.store.timeScale);
    }
  }
  updateRender(){
    updateRender(this);
  }


  createLiquid(props: TLiquidProps) {
    const lid = this.store.liquids.length;
    this.store.liquids[lid] = { ...LiquidPropDefaults, ...props };
    return lid;
  }

  spawnParticle(liquidid: number, x: number, y: number) {
    const pid = this.store.freeParticleIds.length === 0 ? this.store.particles.length : this.store.freeParticleIds.pop();
    const particle = new Float32Array(5);
    particle[PARTICLE_PROPS.X] = x;
    particle[PARTICLE_PROPS.Y] = y;
    particle[PARTICLE_PROPS.VEL_X] = 0;
    particle[PARTICLE_PROPS.VEL_Y] = 0;
    particle[PARTICLE_PROPS.LIQUID_ID] = liquidid;
    //@ts-ignore
    this.store.particles[pid] = particle;
    this.store.spatialHash.insert(pid, x, y);
  }
  removeParticle(particleId: number){
    const particle = this.store.particles[particleId];
    this.store.particles[particleId] = null;
    this.store.spatialHash.remove(particleId);
    this.events.particleRemove(particle, particleId, this.store.liquids[particle[PARTICLE_PROPS.LIQUID_ID]]);
    this.store.freeParticleIds.push(particleId);
    // TODO: remove associated springs
  }

  fillZoneByLiquid(zoneX: number, zoneY: number, zoneWidth: number, zoneHeight: number, liquidid: number, interval: number = this.store.radius) {
    const columns = Math.max(1, Math.trunc(zoneWidth / interval));
    const rows = Math.max(1, Math.trunc(zoneHeight / interval));
    for (let c = 0; c < columns; c++) {
      for (let r = 0; r < rows; r++) {
        this.spawnParticle(liquidid, zoneX+c*interval, zoneY+r*interval);
      }
    }
  }
  clearZoneByLiquid(zoneX: number, zoneY: number, zoneWidth: number, zoneHeight: number, liquidid: number){
    this.store.particles.forEach((part, pid)=>{
      if(part !== null && checkPointInRect(part[PARTICLE_PROPS.X], part[PARTICLE_PROPS.Y], zoneX, zoneY, zoneX + zoneWidth, zoneY + zoneHeight)){
        this.removeParticle(pid)
      }
    })
  }

  checkRectContainsParticle(rect: TRect, particle: TLiquidParticle) {
    return checkPointInRect(particle[PARTICLE_PROPS.X], particle[PARTICLE_PROPS.Y], ...rect);
  }
}

declare global {
  class CLiquid extends Liquid {}
}