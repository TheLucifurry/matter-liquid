import { WORKER_METHODS } from '../constants';
import { update } from './methods'

const methodsList = {
  [WORKER_METHODS.UPDATE]: update,
}

self.onmessage = function (event: MessageEvent) {
  const [methodid, ...args] = event.data;
  const method: TWorkerMethod = methodsList[methodid];
  if(!method){ // DEV
    console.error('Unknown worker method: #'+event.data[0]);
  }
  method(...args);
};
