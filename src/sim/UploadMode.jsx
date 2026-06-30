/* =========================================================================
 * UploadMode.jsx — Contoh mode "Foto Saya": unggah foto ruangan, lalu
 * gorden (warna + motif terpilih) di-overlay 2D di atas jendela pada foto.
 * Posisi & ukuran area jendela bisa diatur dengan slider.
 * ========================================================================= */
import { useEffect, useRef, useState } from "react";
import { useStore } from "../store.js";
import { makeTileCanvas } from "../lib/fabric.js";

export default function UploadMode() {
  const sim = useStore((s) => s.sim);
  const wrapRef = useRef();
  const canvasRef = useRef();
  const [img, setImg] = useState(null);
  const [drag, setDrag] = useState(false);
  const [win, setWin] = useState({ x: 0.18, y: 0.12, w: 0.64, h: 0.66 });

  const loadFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const im = new Image();
      im.onload = () => setImg(im);
      im.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Gambar ulang saat ada perubahan
  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const dpr = window.devicePixelRatio || 1;
    const W = cv.clientWidth;
    const H = (W * 3) / 4;
    cv.width = W * dpr;
    cv.height = H * dpr;
    const ctx = cv.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw(ctx, W, H);
  });

  function draw(ctx, W, H) {
    ctx.clearRect(0, 0, W, H);
    if (!img) {
      ctx.fillStyle = "#efeae1";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#9b8f7d";
      ctx.textAlign = "center";
      ctx.font = `600 ${Math.round(W * 0.03)}px Poppins, sans-serif`;
      ctx.fillText("📷 Unggah foto ruangan Anda", W / 2, H / 2 - 8);
      ctx.font = `400 ${Math.round(W * 0.02)}px Poppins, sans-serif`;
      ctx.fillText("lalu atur posisi gorden agar pas dengan jendela", W / 2, H / 2 + 18);
      ctx.textAlign = "start";
      return;
    }
    // Foto (cover)
    const ir = img.width / img.height;
    const cr = W / H;
    let dw, dh, dx, dy;
    if (ir > cr) { dh = H; dw = H * ir; dx = (W - dw) / 2; dy = 0; }
    else { dw = W; dh = W / ir; dx = 0; dy = (H - dh) / 2; }
    ctx.drawImage(img, dx, dy, dw, dh);

    const wx = win.x * W, wy = win.y * H, ww = win.w * W, wh = win.h * H;
    const isVitrase = sim.style === "vitrase";

    // Vitrase di belakang
    if (sim.vitrase && !isVitrase) drawSheer(ctx, wx, wy, ww, wh, H);

    // Rel
    ctx.fillStyle = "#8a6e4b";
    roundRect(ctx, wx - ww * 0.06, wy - H * 0.045, ww * 1.12, Math.max(6, H * 0.014), 4);
    ctx.fill();

    // Panel kiri & kanan
    const top = wy - H * 0.04;
    const bottom = wy + wh + H * 0.06;
    const panelH = bottom - top;
    const closedW = ww * 0.52, openW = ww * 0.14;
    const panelW = closedW - (closedW - openW) * sim.openness;
    const alpha = isVitrase ? 0.5 : sim.opacity;
    drawPanel(ctx, wx - ww * 0.04, top, panelW, panelH, alpha);
    drawPanel(ctx, wx + ww + ww * 0.04 - panelW, top, panelW, panelH, alpha);
  }

  function drawPanel(ctx, x, y, w, h, alpha) {
    const folds = Math.max(6, Math.round(w / 18));
    const fw = w / folds;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.clip();

    // Dasar: motif kain
    const tile = makeTileCanvas(sim.color, sim.motif);
    const pat = ctx.createPattern(tile, "repeat");
    try { pat.setTransform(new DOMMatrix().scale(0.34)); } catch { /* fallback */ }
    ctx.fillStyle = pat || sim.color;
    ctx.fillRect(x, y, w, h);

    // Bayangan lipatan di atas motif
    for (let i = 0; i < folds; i++) {
      const fx = x + i * fw;
      const g = ctx.createLinearGradient(fx, 0, fx + fw, 0);
      g.addColorStop(0, "rgba(0,0,0,0.30)");
      g.addColorStop(0.5, "rgba(255,255,255,0.14)");
      g.addColorStop(1, "rgba(0,0,0,0.30)");
      ctx.fillStyle = g;
      ctx.fillRect(fx, y, fw + 0.6, h);
    }
    // Tepi bawah membulat (lengkung kain)
    ctx.globalCompositeOperation = "destination-in";
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + w, y);
    ctx.lineTo(x + w, y + h - 6);
    for (let i = folds; i >= 0; i--) {
      const fx = x + i * fw;
      ctx.quadraticCurveTo(fx - fw / 2, y + h + 4, fx - fw, y + h - 6);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function drawSheer(ctx, wx, wy, ww, wh, H) {
    const x = wx, y = wy - H * 0.02, w = ww, h = wh + H * 0.08;
    const folds = Math.max(10, Math.round(w / 22));
    const fw = w / folds;
    ctx.save();
    for (let i = 0; i < folds; i++) {
      const fx = x + i * fw;
      const g = ctx.createLinearGradient(fx, 0, fx + fw, 0);
      g.addColorStop(0, "rgba(255,255,255,0.06)");
      g.addColorStop(0.5, "rgba(255,255,255,0.5)");
      g.addColorStop(1, "rgba(255,255,255,0.06)");
      ctx.fillStyle = g;
      ctx.fillRect(fx, y, fw + 0.5, h);
    }
    ctx.restore();
  }

  return (
    <div className="upload-mode" ref={wrapRef}>
      <div className="sim-canvas-wrap">
        <canvas ref={canvasRef} />
        {!img && (
          <label
            className={"upload-drop" + (drag ? " drag" : "")}
            onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => { e.preventDefault(); setDrag(false); loadFile(e.dataTransfer.files[0]); }}
          >
            <input type="file" accept="image/*" hidden onChange={(e) => loadFile(e.target.files[0])} />
            <span className="up-ico">📷</span>
            <strong>Klik atau seret foto ruangan ke sini</strong>
            <small>JPG / PNG — foto jendela rumah Anda</small>
          </label>
        )}
      </div>

      {img && (
        <div className="win-adjust">
          <div className="win-adjust-head">
            <span>Atur posisi & ukuran gorden:</span>
            <label className="reupload">
              Ganti foto
              <input type="file" accept="image/*" hidden onChange={(e) => loadFile(e.target.files[0])} />
            </label>
          </div>
          <Sl label="Geser ↔" v={win.x} min={0} max={0.7} set={(x) => setWin((w) => ({ ...w, x }))} />
          <Sl label="Geser ↕" v={win.y} min={0} max={0.5} set={(y) => setWin((w) => ({ ...w, y }))} />
          <Sl label="Lebar" v={win.w} min={0.2} max={0.95} set={(ww) => setWin((w) => ({ ...w, w: ww }))} />
          <Sl label="Tinggi" v={win.h} min={0.2} max={0.85} set={(hh) => setWin((w) => ({ ...w, h: hh }))} />
        </div>
      )}
    </div>
  );
}

function Sl({ label, v, min, max, set }) {
  return (
    <div className="mini-slider">
      <span>{label}</span>
      <input type="range" min={min * 100} max={max * 100} value={Math.round(v * 100)}
        onChange={(e) => set(+e.target.value / 100)} />
    </div>
  );
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
