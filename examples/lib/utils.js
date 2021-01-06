export function onpressedPointer(element, callback) {
  let isPressed = false;
  let e;
  element.addEventListener('mousedown', () => isPressed = true);
  element.addEventListener('mouseup', () => isPressed = false);
  element.addEventListener('mousemove', (ev) => e = ev);
  function loop() {
    if (isPressed) {
      callback(e);
    }
    requestAnimationFrame(loop);
  }
  loop();
}

export function onmove(element, callback) {
  element.addEventListener('mousemove', callback);
}

export function onclick(element, callback) {
  element.addEventListener('click', callback);
}

export function waitField(object, key, interval = 100) {
  return new Promise(next => {
    const intervalid = setInterval(function () {
      if (object[key] === undefined) return;
      clearInterval(intervalid);
      next();
    }, interval)
  })
}