import { randomInt } from './utils.js';

function palette(particle, background, body) {
  return { particle, background, body };
}
const palettes = [
  palette('cyan', '#050820', '#353860'),
  palette('orange', '#140B02', '#342B22'),
  palette('lime', '#051102', '#253122'),
  palette('violet', '#150320', '#352340'),
  palette('white', '#111', '#212121'),
]
let currentPaletteId = randomInt(0, palettes.length - 1);

export default {
  getPalette() {
    currentPaletteId = currentPaletteId + 1 < palettes.length ? currentPaletteId + 1 : 0;
    return palettes[currentPaletteId];
  },
  palettes,
}