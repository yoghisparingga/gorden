/* =========================================================================
 * textures.js — Tekstur lantai prosedural (papan kayu/laminasi) + bump
 * untuk tampilan interior yang lebih realistis.
 * ========================================================================= */
import * as THREE from "three";
import { shade } from "./fabric.js";

const cache = new Map();

export function makeFloorTexture(base) {
  if (cache.has(base)) return cache.get(base);
  const S = 512;
  const mapC = document.createElement("canvas");
  const bumpC = document.createElement("canvas");
  mapC.width = mapC.height = bumpC.width = bumpC.height = S;
  const c = mapC.getContext("2d");
  const b = bumpC.getContext("2d");

  c.fillStyle = base;
  c.fillRect(0, 0, S, S);
  b.fillStyle = "#808080";
  b.fillRect(0, 0, S, S);

  const rows = 6;
  const ph = S / rows;
  for (let r = 0; r < rows; r++) {
    const y = r * ph;
    // Variasi warna tiap papan
    const v = -0.09 + (((r * 37) % 6) / 60);
    c.fillStyle = shade(base, v);
    c.fillRect(0, y, S, ph);

    // Serat kayu
    for (let g = 0; g < 16; g++) {
      const gy = y + Math.abs(Math.sin((r * 13 + g) * 1.7)) * ph;
      c.strokeStyle = `rgba(0,0,0,${0.025 + (g % 3) * 0.012})`;
      c.lineWidth = 1;
      c.beginPath();
      c.moveTo(0, gy);
      c.bezierCurveTo(S * 0.3, gy + (g % 2 ? 3 : -3), S * 0.6, gy - (g % 2 ? 3 : -3), S, gy);
      c.stroke();
      b.strokeStyle = "rgba(90,90,90,0.5)";
      b.lineWidth = 1;
      b.stroke();
    }

    // Nat antar papan (horizontal)
    c.fillStyle = "rgba(0,0,0,0.30)";
    c.fillRect(0, y, S, 2);
    b.fillStyle = "#343434";
    b.fillRect(0, y, S, 3);

    // Sambungan papan (vertikal, dibuat selang-seling)
    const seams = 3;
    for (let s = 1; s < seams; s++) {
      const sx = ((s / seams) * S + (r % 2) * 55) % S;
      c.fillStyle = "rgba(0,0,0,0.22)";
      c.fillRect(sx, y, 2, ph);
      b.fillStyle = "#444";
      b.fillRect(sx, y, 2, ph);
    }
  }

  const map = new THREE.CanvasTexture(mapC);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  map.anisotropy = 8;
  const bump = new THREE.CanvasTexture(bumpC);
  bump.wrapS = bump.wrapT = THREE.RepeatWrapping;

  const out = { map, bump };
  cache.set(base, out);
  return out;
}
