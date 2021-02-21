import Matter from 'matter-js';
import * as Algorithm from './algorithm';
import { DEFAULT_GRAVITY_RADIUS, DEFAULT_INTERACTION_RADIUS, DEFAULT_WORLD_WIDTH, PARTICLE_PROPS } from './constants';
import createEventsObject from './events';
import updateRender from './render';
import SpatialHash from './spatialHash';
import State from './state';
import { checkPointInRect, getWorldWidth } from './utils';

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
    gravityRatio: DEFAULT_GRAVITY_RADIUS,
    radius: DEFAULT_INTERACTION_RADIUS,
    spatialHash: new SpatialHash,
    renderBoundsPadding: [0, 0, 0, 0],
    activeBoundsPadding: [0, 0, 0, 0],
    liquids: [],
    particles: [],
    springs: {},
  }
  state: State
  events = createEventsObject()
  algorithm: any

  constructor(config: TLiquidConfig){
    this.state = new State(this, config.engine, config.render);
    this.state.setGravityRatio(config.gravityRatio);
    this.state.setInteractionRadius(config.radius);
    this.store.spatialHash.init(
      getWorldWidth(this.store.world, DEFAULT_WORLD_WIDTH),
      this.store.radius,
    );

    // Set compute updater
    this.setComputeUpdater(config);

    // Set render updater
    Matter.Events.on(config.render, 'afterRender', this.updateRender.bind(this))

    // DEV
    console.log('Liquid:'); console.dir(this);
    //@ts-ignore
    window.Liquid = this;
  }

  private setComputeUpdater(config: TLiquidConfig){
    this.algorithm = config.isFullMode ? Algorithm.fullUpdate : Algorithm.simpleUpdate;
    this.updateCompute = this.updateCompute.bind(this);
    this.state.setPause(!!config.isPaused); // Enable updating
  }
  updateCompute(){
    const deltaTime = 1;
    this.algorithm(this, deltaTime)
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
    const particle = Array(5).fill(0);
    particle[PARTICLE_PROPS.X] = x;
    particle[PARTICLE_PROPS.Y] = y;
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