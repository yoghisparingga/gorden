import { useState } from "react";
import { PRODUCTS, MOTIFS, RUPIAH } from "../data.js";
import { useStore } from "../store.js";
import { fabricThumb } from "../lib/fabric.js";

const cats = ["Semua", ...new Set(PRODUCTS.map((p) => p.kategori))];

export default function Catalog() {
  const [cat, setCat] = useState("Semua");
  const list = cat === "Semua" ? PRODUCTS : PRODUCTS.filter((p) => p.kategori === cat);

  return (
    <section id="katalog" className="section">
      <div className="container">
        <div className="section-head">
          <h2>Katalog Gorden</h2>
          <p>Pilihan gorden &amp; vitrase terbaik untuk setiap ruangan.</p>
        </div>
        <div className="filters">
          {cats.map((c) => (
            <button key={c} className={"chip" + (cat === c ? " active" : "")} onClick={() => setCat(c)}>
              {c}
            </button>
          ))}
        </div>
        <div className="catalog-grid">
          {list.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({ p }) {
  const selectProduct = useStore((s) => s.selectProduct);
  const addToCart = useStore((s) => s.addToCart);
  const openCart = useStore((s) => s.openCart);
  const showToast = useStore((s) => s.showToast);
  const motifName = (MOTIFS.find((m) => m.id === p.motif) || {}).nama;

  const simulate = () => {
    selectProduct(p);
    document.getElementById("simulator")?.scrollIntoView({ behavior: "smooth" });
  };
  const quickAdd = () => {
    addToCart({
      id: p.id, nama: p.nama, warna: p.colors[0], motif: p.motif,
      style: p.style, lebar: 200, tinggi: 250, harga: p.pricePerMeter * 2, qty: 1,
    });
    showToast(`${p.nama} ditambahkan ke keranjang`);
    openCart();
  };

  return (
    <article className="card">
      <div className="card-thumb">
        <img className="fabric-img" src={fabricThumb(p.colors[0], p.motif)} alt={p.nama} />
        {p.badge && <span className="badge">{p.badge}</span>}
        {p.motif !== "polos" && <span className="motif-tag">{motifName}</span>}
      </div>
      <div className="card-body">
        <div className="card-cat">{p.kategori}</div>
        <h3 className="card-title">{p.nama}</h3>
        <div className="card-meta">
          <span className="stars">★ {p.rating}</span>
          <span className="sold">{p.terjual.toLocaleString("id-ID")} terjual</span>
        </div>
        <div className="card-price">{RUPIAH.format(p.pricePerMeter)} <span>/ m</span></div>
        <div className="swatches">
          {p.colors.slice(0, 6).map((c) => (
            <span key={c} className="sw" style={{ background: c }} />
          ))}
        </div>
        <div className="card-actions">
          <button className="btn btn-primary" onClick={simulate}>🪟 Simulasikan</button>
          <button className="btn btn-ghost" onClick={quickAdd}>+ Keranjang</button>
        </div>
      </div>
    </article>
  );
}
