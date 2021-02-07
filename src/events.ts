import EventEmitter from 'eventemitter3';

const events = new EventEmitter();

export const types = {
  STARTED: '0',
}

export function on(eventType: string, fn: (...args: any[]) => void, context?: any) {
  events.on(eventType, fn, context);
}
export function off(eventType: string, fn?: (...args: any[]) => void, context?: any, once?: boolean) {
  events.off(eventType, fn, context, once);
}
export function emit(eventType: string, ...args: any[]) {
  events.emit(eventType, ...args);
}

