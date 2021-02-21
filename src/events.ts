import { arrayEach } from './utils';

export default function createEventsObject(): TEvents {
  const eventsNames: Array<keyof TEvents> = [
    'pauseChange',
  ];
  const res = {};
  arrayEach(eventsNames, name=>{
    //@ts-ignore
    res[name] = ()=>{};
  });
  //@ts-ignore
  return res;
}