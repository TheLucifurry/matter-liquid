const eventsNames: Array<keyof TEvents> = [
  'pauseChange',
];

export default function createEventsObject(): TEvents {
  const res: Partial<TEvents> = {};
  eventsNames.forEach(name=>res[name] = ()=>0);
  return res as TEvents;
}