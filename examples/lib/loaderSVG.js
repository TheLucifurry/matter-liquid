export default function loadSvg(url) {
  return fetch(url)
    .then(res => res.text())
    .then(raw => (new window.DOMParser()).parseFromString(raw, 'image/svg+xml'))
};
