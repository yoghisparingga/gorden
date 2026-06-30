/* =========================================================================
 * simulator.js — Mesin simulasi gorden berbasis Canvas
 *
 * Menggambar ruangan (preset atau foto upload) lalu merender gorden di atas
 * jendela secara realtime: warna, model header, bahan (transparansi),
 * buka/tutup, lapisan vitrase, dan ukuran.
 * ========================================================================= */

const Simulator = (() => {
  let canvas, ctx;
  let bgImage = null; // foto upload pengguna (Image) atau null

  // State konfigurasi simulasi
  const state = {
    room: "ruang-tamu", // preset room id atau 'upload'
    color: "#2f3a4a",
    style: "lipat", // lipat | gelombang | smokring | vitrase
    opacity: 1.0, // 1 = solid, <1 = tembus cahaya
    openness: 0.15, // 0 = tertutup penuh, 1 = terbuka penuh ke samping
    vitrase: true, // tampilkan lapisan vitrase di belakang
    // Posisi & ukuran area jendela (rasio 0-1 terhadap kanvas) — bisa diatur saat mode upload
    win: { x: 0.18, y: 0.12, w: 0.64, h: 0.66 },
    lebar: 200, // cm — untuk estimasi harga
    tinggi: 250, // cm
  };

  function init(canvasEl) {
    canvas = canvasEl;
    ctx = canvas.getContext("2d");
    resize();
    window.addEventListener("resize", () => {
      resize();
      render();
    });
  }

  function resize() {
    // Render beresolusi tinggi agar tajam di layar retina
    const ratio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const w = rect.width || 720;
    const h = w * 0.72;
    canvas.width = w * ratio;
    canvas.height = h * ratio;
    canvas.style.height = h + "px";
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    canvas._w = w;
    canvas._h = h;
  }

  function set(partial) {
    Object.assign(state, partial);
    render();
  }

  function getState() {
    return { ...state };
  }

  function setBackgroundImage(img) {
    bgImage = img;
    render();
  }

  /* ----------------------- Util warna ----------------------- */
  function hexToRgb(hex) {
    const h = hex.replace("#", "");
    const v = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
    const n = parseInt(v, 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  }
  function shade(hex, amt) {
    // amt: -1..1 (negatif=gelap, positif=terang)
    const { r, g, b } = hexToRgb(hex);
    const f = (c) =>
      Math.max(0, Math.min(255, Math.round(amt < 0 ? c * (1 + amt) : c + (255 - c) * amt)));
    return `rgb(${f(r)},${f(g)},${f(b)})`;
  }
  function rgba(hex, a) {
    const { r, g, b } = hexToRgb(hex);
    return `rgba(${r},${g},${b},${a})`;
  }

  /* ----------------------- Gambar ruangan ----------------------- */
  function drawRoomPreset(W, H) {
    const room = state.room;
    // Lantai & dinding dasar bergantung tema ruangan
    let wallTop, wallBottom, floor;
    if (room === "kamar") {
      wallTop = "#e8dfe6"; wallBottom = "#d6c8d4"; floor = "#b89a78";
    } else if (room === "kantor") {
      wallTop = "#e9edf1"; wallBottom = "#d3dae1"; floor = "#9aa3ab";
    } else {
      wallTop = "#efe7da"; wallBottom = "#e0d4c1"; floor = "#c2a079";
    }

    // Dinding
    const wallH = H * 0.82;
    const g = ctx.createLinearGradient(0, 0, 0, wallH);
    g.addColorStop(0, wallTop);
    g.addColorStop(1, wallBottom);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, wallH);

    // Lantai dengan perspektif sederhana
    ctx.fillStyle = floor;
    ctx.beginPath();
    ctx.moveTo(0, wallH);
    ctx.lineTo(W, wallH);
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fill();
    // Garis papan lantai
    ctx.strokeStyle = "rgba(0,0,0,0.06)";
    ctx.lineWidth = 1;
    for (let i = 1; i < 8; i++) {
      const y = wallH + ((H - wallH) * i) / 8;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }

    // Bayangan plafon
    const tg = ctx.createLinearGradient(0, 0, 0, H * 0.12);
    tg.addColorStop(0, "rgba(0,0,0,0.10)");
    tg.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = tg;
    ctx.fillRect(0, 0, W, H * 0.12);
  }

  function drawWindow(W, H) {
    const win = state.win;
    const x = win.x * W;
    const y = win.y * H;
    const w = win.w * W;
    const h = win.h * H;

    // Pemandangan luar jendela (langit + cahaya)
    const sky = ctx.createLinearGradient(0, y, 0, y + h);
    sky.addColorStop(0, "#bfe3f5");
    sky.addColorStop(0.6, "#dff0f7");
    sky.addColorStop(1, "#eef7e9");
    ctx.fillStyle = sky;
    ctx.fillRect(x, y, w, h);

    // Siluet pemandangan
    ctx.fillStyle = "rgba(120,160,120,0.45)";
    ctx.beginPath();
    ctx.moveTo(x, y + h * 0.78);
    ctx.lineTo(x + w * 0.25, y + h * 0.58);
    ctx.lineTo(x + w * 0.45, y + h * 0.72);
    ctx.lineTo(x + w * 0.7, y + h * 0.5);
    ctx.lineTo(x + w, y + h * 0.68);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x, y + h);
    ctx.closePath();
    ctx.fill();

    // Matahari
    ctx.fillStyle = "rgba(255,243,200,0.9)";
    ctx.beginPath();
    ctx.arc(x + w * 0.75, y + h * 0.22, Math.min(w, h) * 0.07, 0, Math.PI * 2);
    ctx.fill();

    // Kusen jendela
    const frame = Math.max(8, w * 0.022);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = frame;
    ctx.strokeRect(x, y, w, h);
    // Pembagi kaca
    ctx.lineWidth = frame * 0.6;
    ctx.beginPath();
    ctx.moveTo(x + w / 2, y);
    ctx.lineTo(x + w / 2, y + h);
    ctx.moveTo(x, y + h / 2);
    ctx.lineTo(x + w, y + h / 2);
    ctx.stroke();

    // Bayangan dalam kusen
    ctx.strokeStyle = "rgba(0,0,0,0.08)";
    ctx.lineWidth = 2;
    ctx.strokeRect(x + frame / 2, y + frame / 2, w - frame, h - frame);
  }

  function drawRod(W, H) {
    const win = state.win;
    const x = win.x * W;
    const y = win.y * H;
    const w = win.w * W;
    const overhang = w * 0.06;
    const rodY = y - H * 0.04;
    const rodH = Math.max(6, H * 0.012);

    const grad = ctx.createLinearGradient(0, rodY, 0, rodY + rodH);
    grad.addColorStop(0, "#6b5640");
    grad.addColorStop(0.5, "#a98a63");
    grad.addColorStop(1, "#5a4631");
    ctx.fillStyle = grad;
    roundRect(x - overhang, rodY, w + overhang * 2, rodH, rodH / 2);
    ctx.fill();

    // Finial (ujung rel) kiri & kanan
    ctx.fillStyle = "#7a6043";
    ctx.beginPath();
    ctx.arc(x - overhang, rodY + rodH / 2, rodH * 0.95, 0, Math.PI * 2);
    ctx.arc(x + w + overhang, rodY + rodH / 2, rodH * 0.95, 0, Math.PI * 2);
    ctx.fill();
  }

  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  /* ----------------------- Gambar panel gorden ----------------------- */
  /* Menggambar satu panel gorden dengan lipatan (folds) realistis.
   * side: 'left' | 'right' — menentukan arah kumpulan saat terbuka. */
  function drawPanel(opts) {
    const { x, y, w, h, color, opacity, style, folds, side } = opts;

    ctx.save();
    ctx.globalAlpha = opacity;

    const foldW = w / folds;
    // Header offset (tinggi area header berbeda per style)
    const headerH = style === "smokring" ? h * 0.04 : h * 0.06;

    for (let i = 0; i < folds; i++) {
      const fx = x + i * foldW;
      // Gradient melintang tiap lipatan: sisi gelap -> terang -> gelap
      const g = ctx.createLinearGradient(fx, 0, fx + foldW, 0);
      g.addColorStop(0, shade(color, -0.32));
      g.addColorStop(0.32, shade(color, 0.14));
      g.addColorStop(0.5, shade(color, 0.22));
      g.addColorStop(0.68, shade(color, 0.06));
      g.addColorStop(1, shade(color, -0.34));
      ctx.fillStyle = g;

      // Tepi bawah sedikit melengkung (kain jatuh)
      const sag = h * 0.012 * Math.sin((i / folds) * Math.PI);
      ctx.beginPath();
      ctx.moveTo(fx, y + headerH);
      ctx.lineTo(fx + foldW, y + headerH);
      ctx.lineTo(fx + foldW, y + h + sag);
      // lengkung bawah
      ctx.quadraticCurveTo(fx + foldW / 2, y + h + sag + h * 0.02, fx, y + h + sag);
      ctx.closePath();
      ctx.fill();
    }

    // Header sesuai style
    drawHeader(x, y, w, h, color, style, folds);

    ctx.restore();
  }

  function drawHeader(x, y, w, h, color, style, folds) {
    const foldW = w / folds;
    if (style === "smokring") {
      // Ring eyelet di atas
      const ringR = Math.min(foldW * 0.28, h * 0.02);
      ctx.fillStyle = shade(color, -0.1);
      ctx.fillRect(x, y, w, h * 0.03);
      for (let i = 0; i <= folds; i++) {
        const cx = x + i * foldW;
        ctx.strokeStyle = "#8a8a8a";
        ctx.lineWidth = ringR * 0.5;
        ctx.beginPath();
        ctx.arc(cx, y + h * 0.018, ringR, 0, Math.PI * 2);
        ctx.stroke();
      }
    } else if (style === "lipat") {
      // Pinch pleat: jepitan di tiap pertemuan lipatan
      for (let i = 0; i <= folds; i += 1) {
        const cx = x + i * foldW;
        ctx.fillStyle = shade(color, -0.28);
        ctx.beginPath();
        ctx.moveTo(cx - foldW * 0.12, y);
        ctx.lineTo(cx + foldW * 0.12, y);
        ctx.lineTo(cx, y + h * 0.07);
        ctx.closePath();
        ctx.fill();
      }
    } else if (style === "gelombang") {
      // Wave: tepi atas bergelombang halus
      ctx.fillStyle = shade(color, -0.18);
      ctx.beginPath();
      ctx.moveTo(x, y + h * 0.05);
      for (let i = 0; i <= folds; i++) {
        const cx = x + i * foldW;
        ctx.quadraticCurveTo(cx - foldW / 2, y, cx, y + h * 0.05);
      }
      ctx.lineTo(x + w, y);
      ctx.lineTo(x, y);
      ctx.closePath();
      ctx.fill();
    } else {
      // vitrase / rod pocket: kerutan halus
      ctx.fillStyle = shade(color, -0.12);
      ctx.fillRect(x, y, w, h * 0.04);
    }
  }

  /* ----------------------- Lapisan vitrase ----------------------- */
  function drawSheerLayer(W, H) {
    const win = state.win;
    const x = win.x * W;
    const y = win.y * H - H * 0.02;
    const w = win.w * W;
    const h = win.h * H + H * 0.08;
    // Vitrase selalu menutup penuh di belakang (privasi)
    const folds = Math.max(10, Math.round(w / 22));
    const foldW = w / folds;
    ctx.save();
    for (let i = 0; i < folds; i++) {
      const fx = x + i * foldW;
      const g = ctx.createLinearGradient(fx, 0, fx + foldW, 0);
      g.addColorStop(0, "rgba(255,255,255,0.05)");
      g.addColorStop(0.5, "rgba(255,255,255,0.42)");
      g.addColorStop(1, "rgba(255,255,255,0.05)");
      ctx.fillStyle = g;
      ctx.fillRect(fx, y, foldW + 0.5, h);
    }
    ctx.restore();
  }

  /* ----------------------- Render utama ----------------------- */
  function render() {
    if (!ctx) return;
    const W = canvas._w;
    const H = canvas._h;
    ctx.clearRect(0, 0, W, H);

    // 1) Latar: foto upload atau ruangan preset
    if (state.room === "upload" && bgImage) {
      drawCover(bgImage, W, H);
    } else if (state.room === "upload" && !bgImage) {
      ctx.fillStyle = "#f0ece4";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#9b8f7d";
      ctx.font = `600 ${Math.round(W * 0.028)}px Poppins, sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText("📷 Unggah foto ruangan Anda", W / 2, H / 2 - 12);
      ctx.font = `400 ${Math.round(W * 0.02)}px Poppins, sans-serif`;
      ctx.fillText("lalu atur posisi jendela & gorden", W / 2, H / 2 + 16);
      ctx.textAlign = "start";
    } else {
      drawRoomPreset(W, H);
      drawWindow(W, H);
    }

    const win = state.win;
    const wx = win.x * W;
    const wy = win.y * H;
    const ww = win.w * W;
    const wh = win.h * H;

    // 2) Lapisan vitrase (di belakang gorden utama)
    if (state.vitrase && state.style !== "vitrase") {
      drawSheerLayer(W, H);
    }

    // 3) Rel/rod
    drawRod(W, H);

    // 4) Gorden utama — dua panel kiri & kanan
    const isSheer = state.style === "vitrase" || state.sheerProduct;
    const baseOpacity = state.style === "vitrase" ? 0.5 : state.opacity;

    const top = wy - H * 0.05;
    const bottom = wy + wh + H * 0.06;
    const panelH = bottom - top;

    // openness: 0 tertutup (tiap panel 50% lebar) → 1 terbuka (panel mengumpul ~12%)
    const closedW = ww * 0.52; // sedikit overlap di tengah saat tertutup
    const openW = ww * 0.14;
    const panelW = closedW - (closedW - openW) * state.openness;

    const folds = Math.max(6, Math.round(panelW / 18));

    // Panel kiri (menempel kiri)
    drawPanel({
      x: wx - ww * 0.04,
      y: top,
      w: panelW,
      h: panelH,
      color: state.color,
      opacity: baseOpacity,
      style: state.style,
      folds,
      side: "left",
    });
    // Panel kanan (menempel kanan)
    drawPanel({
      x: wx + ww + ww * 0.04 - panelW,
      y: top,
      w: panelW,
      h: panelH,
      color: state.color,
      opacity: baseOpacity,
      style: state.style,
      folds,
      side: "right",
    });

    // 5) Cahaya jatuh dari jendela ke lantai (hanya preset)
    if (state.room !== "upload") {
      const lightGrad = ctx.createLinearGradient(0, wy + wh, 0, H);
      lightGrad.addColorStop(0, rgba("#fff6cf", 0.18 * (0.4 + state.openness)));
      lightGrad.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = lightGrad;
      ctx.beginPath();
      ctx.moveTo(wx, wy + wh);
      ctx.lineTo(wx + ww, wy + wh);
      ctx.lineTo(wx + ww * 1.25, H);
      ctx.lineTo(wx - ww * 0.25, H);
      ctx.closePath();
      ctx.fill();
    }
  }

  function drawCover(img, W, H) {
    const ir = img.width / img.height;
    const cr = W / H;
    let dw, dh, dx, dy;
    if (ir > cr) {
      dh = H; dw = H * ir; dx = (W - dw) / 2; dy = 0;
    } else {
      dw = W; dh = W / ir; dx = 0; dy = (H - dh) / 2;
    }
    ctx.drawImage(img, dx, dy, dw, dh);
  }

  /* Ekspor gambar simulasi sebagai data URL (untuk diunduh/dibagikan) */
  function toDataURL() {
    return canvas.toDataURL("image/png");
  }

  return { init, set, getState, setBackgroundImage, render, toDataURL };
})();
