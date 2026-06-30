/* =========================================================================
 * Controls.jsx — Panel kontrol simulator (ruangan, model, motif, warna,
 * ukuran, buka/tutup, vitrase) + estimasi harga & tambah ke keranjang.
 * ========================================================================= */
import { useStore, activeProduct } from "../store.js";
import { ROOMS, STYLES, MOTIFS, SIZES, RUPIAH } from "../data.js";
import { estimatePrice } from "../lib/price.js";
import { fabricCss, shade } from "../lib/fabric.js";

export default function Controls() {
  const sim = useStore((s) => s.sim);
  const setSim = useStore((s) => s.setSim);
  const addToCart = useStore((s) => s.addToCart);
  const openCart = useStore((s) => s.openCart);
  const showToast = useStore((s) => s.showToast);
  const product = activeProduct();
  const price = estimatePrice(product, sim);

  const styleName = (id) => (STYLES.find((x) => x.id === id) || {}).nama || id;

  const onAdd = () => {
    addToCart({
      id: product.id,
      nama: product.nama,
      warna: sim.color,
      motif: sim.motif,
      style: sim.style,
      lebar: sim.lebar,
      tinggi: sim.tinggi,
      harga: price,
      qty: 1,
    });
    showToast(`${product.nama} ditambahkan ke keranjang`);
    openCart();
  };

  return (
    <div className="sim-panel">
      {/* Ruangan */}
      <div className="ctrl">
        <label className="ctrl-label">Ruangan 3D</label>
        <div className="room-grid">
          {ROOMS.map((r) => (
            <button
              key={r.id}
              className={"room-btn" + (sim.room === r.id ? " active" : "")}
              onClick={() => setSim({ room: r.id })}
            >
              <span>{r.emoji}</span>
              {r.nama}
            </button>
          ))}
        </div>
      </div>

      {/* Model */}
      <div className="ctrl">
        <label className="ctrl-label">Model Gorden</label>
        <div className="seg-grid">
          {STYLES.map((s) => (
            <button
              key={s.id}
              className={"seg-btn" + (sim.style === s.id ? " active" : "")}
              onClick={() => setSim({ style: s.id })}
            >
              <strong>{s.nama}</strong>
              <small>{s.desc}</small>
            </button>
          ))}
        </div>
      </div>

      {/* Motif */}
      <div className="ctrl">
        <label className="ctrl-label">Motif Kain ({MOTIFS.length} pilihan)</label>
        <div className="motif-grid">
          {MOTIFS.map((m) => (
            <button
              key={m.id}
              className={"motif-btn" + (sim.motif === m.id ? " active" : "")}
              onClick={() => setSim({ motif: m.id })}
            >
              <span
                className="motif-pv"
                style={{ background: m.id === "polos" ? sim.color : motifPv(sim.color, m.id) }}
              />
              <small>{m.nama}</small>
            </button>
          ))}
        </div>
      </div>

      {/* Warna */}
      <div className="ctrl">
        <label className="ctrl-label">Warna</label>
        <div className="color-row">
          <div className="sw-row">
            {product.colors.map((c) => (
              <button
                key={c}
                className={"sw-btn" + (sim.color === c ? " active" : "")}
                style={{ background: c }}
                title={c}
                onClick={() => setSim({ color: c })}
              />
            ))}
          </div>
          <label className="custom-color" title="Warna kustom">
            🎨
            <input
              type="color"
              value={toHex(sim.color)}
              onChange={(e) => setSim({ color: e.target.value })}
            />
          </label>
        </div>
      </div>

      {/* Buka/tutup */}
      <div className="ctrl">
        <label className="ctrl-label">Buka / Tutup Gorden</label>
        <input
          className="slider"
          type="range"
          min="0"
          max="100"
          value={Math.round(sim.openness * 100)}
          onChange={(e) => setSim({ openness: +e.target.value / 100 })}
        />
        <div className="slider-ends">
          <span>Tertutup</span>
          <span>Terbuka</span>
        </div>
      </div>

      {/* Vitrase */}
      <div className="ctrl ctrl-inline">
        <label className="switch">
          <input
            type="checkbox"
            checked={sim.vitrase}
            onChange={(e) => setSim({ vitrase: e.target.checked })}
          />
          <span className="switch-track" />
        </label>
        <span>Pasang lapisan vitrase (di belakang)</span>
      </div>

      {/* Ukuran */}
      <div className="ctrl">
        <label className="ctrl-label">Ukuran Jendela</label>
        <div className="size-presets">
          {SIZES.map((s) => (
            <button
              key={s.id}
              className={"size-chip" + (sim.lebar === s.lebar && sim.tinggi === s.tinggi ? " active" : "")}
              onClick={() => setSim({ lebar: s.lebar, tinggi: s.tinggi })}
            >
              <strong>{s.nama}</strong>
              <small>{s.desc}</small>
            </button>
          ))}
        </div>
        <div className="size-row">
          <div className="size-field">
            <span>Lebar (cm)</span>
            <input type="number" min="50" max="600" value={sim.lebar}
              onChange={(e) => setSim({ lebar: +e.target.value || 0 })} />
          </div>
          <div className="size-field">
            <span>Tinggi (cm)</span>
            <input type="number" min="50" max="400" value={sim.tinggi}
              onChange={(e) => setSim({ tinggi: +e.target.value || 0 })} />
          </div>
        </div>
      </div>

      <div className="sim-foot">
        <div className="sim-est">
          <small>Estimasi harga</small>
          <strong>{RUPIAH.format(price)}</strong>
        </div>
        <button className="btn btn-primary" onClick={onAdd}>+ Keranjang</button>
      </div>
    </div>
  );
}

function motifPv(color, motif) {
  const d = shade(color, -0.22);
  const l = shade(color, 0.3);
  switch (motif) {
    case "garis":
      return `repeating-linear-gradient(90deg, ${d} 0 4px, ${color} 4px 8px)`;
    case "garis-h":
      return `repeating-linear-gradient(0deg, ${d} 0 4px, ${color} 4px 8px)`;
    case "kotak":
      return `repeating-linear-gradient(0deg, ${d} 0 3px, transparent 3px 10px), repeating-linear-gradient(90deg, ${d} 0 3px, ${color} 3px 10px)`;
    case "titik":
      return `radial-gradient(${l} 28%, ${color} 30%) 0 0/9px 9px`;
    case "chevron":
      return `repeating-linear-gradient(135deg, ${d} 0 3px, ${color} 3px 7px)`;
    case "geometris":
      return `repeating-linear-gradient(45deg, ${d} 0 5px, ${color} 5px 10px)`;
    default:
      return color;
  }
}

function toHex(c) {
  if (c.startsWith("#")) return c;
  const m = c.match(/\d+/g);
  if (!m) return "#000000";
  return "#" + m.slice(0, 3).map((n) => (+n).toString(16).padStart(2, "0")).join("");
}
