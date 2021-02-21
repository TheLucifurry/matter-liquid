import EventEmitter from 'eventemitter3';
import Matter from 'matter-js';
import { fullUpdate, simpleUpdate } from './algorithm';
import { PARTICLE_PROPS } from './enums';
import updateRender from './render';
import SpatialHash from './spatialHash';
import State from './state';
import { checkPointInRect } from './utils';


const LiquidPropDefaults: Required<TLiquidProps> = {
  isStatic: false,
  color: '#fff',
  plasticity: 0.3,
  // stiffness: 0.004,
}

export default class Liquid {
  store: TStore = {
    world: null,
    render: null,
    engine: null,
    isPaused: false,
    gravityRatio: 0.1,
    radius: 30,
    spatialHash: new SpatialHash,
    renderBoundsPadding: [0, 0, 0, 0],
    activeBoundsPadding: [0, 0, 0, 0],
    liquids: [],
    particles: [],
    springs: {},
  }
  state: State
  events = new EventEmitter()
  updateCompute

  constructor(config: TLiquidConfig){
    // TODO: change hardcode to spatialHash's adaptivity by
    const _worldWidth = 5000;
    const _cellSize = 30;

    this.state = new State(this, config.engine, config.render);
    this.state.setGravityRatio(config.gravityRatio);
    this.state.setInteractionRadius(config.radius);
    this.store.spatialHash.init(_worldWidth, _cellSize);

    // Set compute updater
    this.updateCompute = (config.isFullMode ? this.updateFullCompute : this.updateSimpleCompute).bind(this);
    this.state.setPause(!!config.isPaused);

    // Set render updater
    Matter.Events.on(config.render, 'afterRender', this.updateRender.bind(this))

    // DEV
    console.log('Liquid:'); console.dir(this);
    //@ts-ignore
    window.Liquid = this;
  }

  on(eventType: string, fn: (...args: any[]) => void, context?: any) {
    this.events.on(eventType, fn, context);
  }
  off(eventType: string, fn?: (...args: any[]) => void, context?: any, once?: boolean) {
    this.events.off(eventType, fn, context, once);
  }
  emit(eventType: string, ...args: any[]) {
    this.events.emit(eventType, ...args);
  }

  setPauseState(isPause = true) {
    if(isPause){
      Matter.Events.off(this.store.engine, 'afterUpdate', this.updateCompute);
    }else{
      Matter.Events.on(this.store.engine, 'afterUpdate', this.updateCompute);
    }
  }

  updateSimpleCompute(){
    // TODO: change hardcode
    const deltaTime = 1;
    simpleUpdate(this, deltaTime);
  }
  updateFullCompute(){
    // TODO: change hardcode
    const deltaTime = 1;
    fullUpdate(this, deltaTime);
  }
  updateRender(){
    updateRender(this);
  }


  createLiquid(props: TLiquidProps) {
    const lid = this.store.liquids.length;
    this.store.liquids[lid] = { ...LiquidPropDefaults, ...props };
    return lid;
  }

  spawnLiquid(liquidid: number, x: number, y: number) {
    const pid = this.store.particles.length;
    const particle = Array(7).fill(0);
    particle[PARTICLE_PROPS.X] = x;
    particle[PARTICLE_PROPS.Y] = y;
    // particle[PARTICLE_PROPS.PREV_X] = x-1;
    // particle[PARTICLE_PROPS.PREV_Y] = y-1;
    particle[PARTICLE_PROPS.LIQUID_ID] = liquidid;
    //@ts-ignore
    this.store.particles[pid] = particle;
    this.store.spatialHash.insert(pid, x, y);
  }

  fillZoneByLiquid(zoneX: number, zoneY: number, zoneWidth: number, zoneHeight: number, liquidid: number, interval: number = this.store.radius) {
    const columns = Math.max(1, Math.trunc(zoneWidth / interval));
    const rows = Math.max(1, Math.trunc(zoneHeight / interval));
    for (let c = 0; c < columns; c++) {
      for (let r = 0; r < rows; r++) {
        this.spawnLiquid(liquidid, zoneX+c*interval, zoneY+r*interval);
      }
    }
  }

  checkParticleIsStatic(particle: TLiquidParticle) {
    return this.store.liquids[particle[PARTICLE_PROPS.LIQUID_ID]].isStatic;
  }

  checkRectContainsParticle(rect: TRect, particle: TLiquidParticle) {
    return checkPointInRect(particle[PARTICLE_PROPS.X], particle[PARTICLE_PROPS.Y], ...rect);
  }
}

declare global {
  class CLiquid extends Liquid {}
}