import { randomInt } from './utils.js';

function palette(particle, background, body) {
  return { particle, background, body };
}
const palettes = [
  palette('#0ff', '#050820', '#353860'), // cyan
  palette('#fa0', '#140B02', '#342B22'), // orange
  palette('#e7e', '#150320', '#352340'), // violet
  palette('#0f0', '#051102', '#253122'), // lime
  palette('#fff', '#111', '#212121'),    // white
  palette('#555', '#000', '#777'),    // balck
]
let currentPaletteId = randomInt(0, palettes.length - 1);

export default {
  getPalette() {
    currentPaletteId = currentPaletteId + 1 < palettes.length ? currentPaletteId + 1 : 0;
    return palettes[currentPaletteId];
  },
  palettes,
  names: {
    BLUE: 0,
    ORANGE: 1,
    VIOLET: 2,
    GREEN: 3,
    WHITE: 4,
    BALCK: 5,
  }
}