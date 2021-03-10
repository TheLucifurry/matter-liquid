const eventsNames: Array<keyof TEvents> = [
  'pauseChange',
  'particleRemove',
];

export default function createEventsObject(): TEvents {
  const res: Partial<TEvents> = {};
  // eslint-disable-next-line no-return-assign
  eventsNames.forEach((name) => res[name] = () => 0);
  return res as TEvents;
}
