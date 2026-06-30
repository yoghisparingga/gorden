/* =========================================================================
 * fabric.js — Tekstur kain prosedural (warna + 12 motif) untuk simulator 3D
 * Menghasilkan THREE.CanvasTexture yang di-tile pada permukaan gorden.
 * ========================================================================= */
import * as THREE from "three";

export function hexToRgb(hex) {
  const h = hex.replace("#", "");
  const v = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(v, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

export function shade(hex, amt) {
  const { r, g, b } = hexToRgb(hex);
  const f = (c) =>
    Math.max(0, Math.min(255, Math.round(amt < 0 ? c * (1 + amt) : c + (255 - c) * amt)));
  return `rgb(${f(r)},${f(g)},${f(b)})`;
}

/* CSS gradient preview untuk thumbnail katalog & tombol motif */
export function fabricCss(color) {
  return `repeating-linear-gradient(90deg, ${shade(color, -0.26)} 0, ${shade(color, 0.16)} 9px, ${shade(color, -0.26)} 18px)`;
}

const TILE = 256;

function star(ctx, cx, cy, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
    const a2 = a + Math.PI / 5;
    ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
    ctx.lineTo(cx + Math.cos(a2) * r * 0.45, cy + Math.sin(a2) * r * 0.45);
  }
  ctx.closePath();
  ctx.fill();
}

function flower(ctx, cx, cy, r, petal, center) {
  ctx.fillStyle = petal;
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    ctx.beginPath();
    ctx.ellipse(cx + Math.cos(a) * r * 0.7, cy + Math.sin(a) * r * 0.7, r * 0.5, r * 0.28, a, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = center;
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.3, 0, Math.PI * 2);
  ctx.fill();
}

function leaf(ctx, cx, cy, s, rot, fill) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rot);
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.ellipse(0, 0, s, s * 0.42, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/* Menggambar satu tile motif (256×256) di atas warna dasar */
function drawMotif(ctx, motif, color) {
  const dark = shade(color, -0.24);
  const dark2 = shade(color, -0.14);
  const light = shade(color, 0.32);
  const accent = shade(color, 0.5);
  const S = TILE;

  if (motif === "garis") {
    const w = S / 8;
    for (let i = 0; i < 8; i += 2) {
      ctx.fillStyle = dark;
      ctx.fillRect(i * w, 0, w, S);
    }
  } else if (motif === "garis-h") {
    const h = S / 8;
    for (let i = 0; i < 8; i += 2) {
      ctx.fillStyle = dark;
      ctx.fillRect(0, i * h, S, h);
    }
  } else if (motif === "kotak") {
    const step = S / 4;
    ctx.fillStyle = "rgba(0,0,0,0.13)";
    for (let i = 0; i < 4; i++) {
      ctx.fillRect(0, i * step, S, step * 0.4);
      ctx.fillRect(i * step, 0, step * 0.4, S);
    }
    ctx.fillStyle = shade(color, 0.18);
    for (let i = 0; i < 4; i++) ctx.fillRect(i * step + step * 0.55, 0, step * 0.12, S);
  } else if (motif === "titik") {
    const n = 4, step = S / n;
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        const off = (r % 2) * (step / 2);
        ctx.fillStyle = light;
        ctx.beginPath();
        ctx.arc(c * step + step / 2 + off, r * step + step / 2, step * 0.16, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  } else if (motif === "bunga") {
    const n = 3, step = S / n;
    for (let r = 0; r < n; r++)
      for (let c = 0; c < n; c++)
        flower(ctx, c * step + step / 2 + (r % 2) * (step / 2), r * step + step / 2, step * 0.3, light, dark);
  } else if (motif === "daun") {
    const n = 3, step = S / n;
    for (let r = 0; r < n; r++)
      for (let c = 0; c < n; c++)
        leaf(ctx, c * step + step / 2 + (r % 2) * (step / 2), r * step + step / 2, step * 0.34, r % 2 ? 0.7 : -0.6, dark);
  } else if (motif === "chevron") {
    const band = S / 6;
    ctx.strokeStyle = dark;
    ctx.lineWidth = band * 0.42;
    for (let y = -band; y < S + band; y += band) {
      ctx.beginPath();
      ctx.moveTo(0, y + band);
      ctx.lineTo(S / 2, y);
      ctx.lineTo(S, y + band);
      ctx.stroke();
    }
  } else if (motif === "gelombang") {
    ctx.strokeStyle = dark;
    ctx.lineWidth = S * 0.02;
    for (let y = S / 8; y < S; y += S / 4) {
      ctx.beginPath();
      for (let x = 0; x <= S; x += 4) {
        const yy = y + Math.sin((x / S) * Math.PI * 4) * (S * 0.04);
        x === 0 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy);
      }
      ctx.stroke();
    }
  } else if (motif === "bintang") {
    const n = 3, step = S / n;
    for (let r = 0; r < n; r++)
      for (let c = 0; c < n; c++)
        star(ctx, c * step + step / 2 + (r % 2) * (step / 2), r * step + step / 2, step * 0.26, light);
  } else if (motif === "geometris") {
    const n = 4, step = S / n;
    for (let r = 0; r < n; r++)
      for (let c = 0; c < n; c++) {
        const cx = c * step + step / 2 + (r % 2) * (step / 2);
        const cy = r * step + step / 2;
        ctx.fillStyle = r % 2 ? light : dark2;
        ctx.beginPath();
        ctx.moveTo(cx, cy - step * 0.32);
        ctx.lineTo(cx + step * 0.32, cy);
        ctx.lineTo(cx, cy + step * 0.32);
        ctx.lineTo(cx - step * 0.32, cy);
        ctx.closePath();
        ctx.fill();
      }
  } else if (motif === "damask") {
    const n = 2, step = S / n;
    for (let r = 0; r < n; r++)
      for (let c = 0; c < n; c++) {
        const cx = c * step + step / 2 + (r % 2) * (step / 2);
        const cy = r * step + step / 2;
        ctx.fillStyle = light;
        ctx.beginPath();
        ctx.ellipse(cx, cy, step * 0.18, step * 0.34, 0, 0, Math.PI * 2);
        ctx.fill();
        flower(ctx, cx, cy, step * 0.16, accent, dark);
        ctx.fillStyle = light;
        for (const dx of [-1, 1]) {
          ctx.beginPath();
          ctx.ellipse(cx + dx * step * 0.28, cy, step * 0.1, step * 0.2, dx * 0.6, 0, Math.PI * 2);
          ctx.fill();
        }
      }
  }
}

const cache = new Map();

export function makeFabricTexture(color, motif) {
  const key = color + "|" + motif;
  if (cache.has(key)) return cache.get(key);

  const cv = document.createElement("canvas");
  cv.width = cv.height = TILE;
  const ctx = cv.getContext("2d");
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, TILE, TILE);
  // Serat kain halus
  ctx.globalAlpha = 0.06;
  for (let x = 0; x < TILE; x += 3) {
    ctx.fillStyle = x % 6 === 0 ? "#000" : "#fff";
    ctx.fillRect(x, 0, 1, TILE);
  }
  ctx.globalAlpha = 1;
  drawMotif(ctx, motif, color);

  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 4;
  cache.set(key, tex);
  return tex;
}

/* Tekstur datar (untuk thumbnail) → dataURL */
export function fabricThumb(color, motif) {
  const cv = document.createElement("canvas");
  cv.width = cv.height = TILE;
  const ctx = cv.getContext("2d");
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, TILE, TILE);
  drawMotif(ctx, motif, color);
  return cv.toDataURL();
}

/* Canvas tile motif (untuk createPattern di mode upload 2D) */
export function makeTileCanvas(color, motif) {
  const cv = document.createElement("canvas");
  cv.width = cv.height = TILE;
  const ctx = cv.getContext("2d");
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, TILE, TILE);
  drawMotif(ctx, motif, color);
  return cv;
}
