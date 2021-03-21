import Matter from 'matter-js';
import * as Algorithm from '../algorithm';
import * as Renderer from '../render';
import State from './state';
import Dripper from './dripper';
import Dryer from './dryer';

export default class Liquid extends State {
  private computeUpdater: any;

  private renderUpdater: any;

  drip: Dripper = new Dripper(this);

  dry: Dryer = new Dryer(this);

  constructor(config: TLiquidConfig) {
    super(config);

    // Set updaters
    this.renderUpdater = DEV && config.isDebug ? Renderer.updateDebug : Renderer.update;
    this.computeUpdater = config.isAdvancedAlgorithm ? Algorithm.advanced : Algorithm.simple;
    this.updateCompute = this.updateCompute.bind(this);

    // Init updaters
    Matter.Events.on(config.render, 'afterRender', this.updateRender.bind(this));
    this.setPause(!!config.isPaused); // Enable compute updater

    if (DEV) {
      console.log('Liquid:'); console.dir(this);
      // @ts-ignore
      window.Liquid = this;
    }
  }

  private updateCompute() {
    if (this.store.t++ % this.store.ef === 0) {
      this.computeUpdater(this, this.store.e.timing.timeScale * this.store.dt);
    }
  }

  private updateRender() {
    this.renderUpdater(this);
  }

  setPause(isPause = true): void {
    if (isPause) {
      Matter.Events.off(this.store.e, 'afterUpdate', this.updateCompute);
    } else {
      Matter.Events.on(this.store.e, 'afterUpdate', this.updateCompute);
    }
    super.setPause(isPause);
  }
}

declare global {
  class CLiquid extends Liquid {}
}
