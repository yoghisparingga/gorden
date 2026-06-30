import { TOKO } from "../data.js";

export function Steps() {
  const steps = [
    ["1", "Simulasikan 3D", "Coba model, motif & warna gorden di ruangan 3D yang bisa diputar."],
    ["2", "Masukkan Keranjang", "Tentukan ukuran jendela, lalu tambahkan ke keranjang."],
    ["3", "Checkout WhatsApp", "Kirim pesanan ke kami, konfirmasi harga & jadwal ukur."],
    ["4", "Pasang di Rumah", "Tim kami ukur akurat & memasang gorden dengan rapi."],
  ];
  return (
    <section id="cara" className="section section-alt">
      <div className="container">
        <div className="section-head">
          <h2>Cara Pesan</h2>
          <p>Hanya 4 langkah mudah sampai gorden terpasang rapi.</p>
        </div>
        <div className="steps">
          {steps.map(([n, t, d]) => (
            <div className="step" key={n}>
              <span className="step-num">{n}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CTA() {
  const wa = `https://wa.me/${TOKO.whatsapp}?text=${encodeURIComponent(
    "Halo " + TOKO.nama + ", saya mau konsultasi gorden."
  )}`;
  return (
    <section id="kontak" className="section">
      <div className="container cta-box">
        <div>
          <h2>Siap percantik ruangan Anda?</h2>
          <p>Konsultasi gratis via WhatsApp — kami bantu pilih gorden yang pas.</p>
        </div>
        <a className="btn btn-primary btn-lg" href={wa} target="_blank" rel="noopener">
          💬 Chat WhatsApp
        </a>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="brand"><span className="brand-mark">🪟</span><strong>{TOKO.nama}</strong></div>
          <p className="footer-desc">Gorden &amp; vitrase premium dengan layanan ukur dan pasang profesional.</p>
        </div>
        <div>
          <h4>Kontak</h4>
          <p>📍 {TOKO.alamat}</p>
          <p>✉️ {TOKO.email}</p>
        </div>
        <div>
          <h4>Menu</h4>
          <a onClick={() => document.getElementById("katalog")?.scrollIntoView({ behavior: "smooth" })}>Katalog</a>
          <a onClick={() => document.getElementById("simulator")?.scrollIntoView({ behavior: "smooth" })}>Simulasi 3D</a>
          <a onClick={() => document.getElementById("cara")?.scrollIntoView({ behavior: "smooth" })}>Cara Pesan</a>
        </div>
      </div>
      <div className="footer-bottom container">
        © {new Date().getFullYear()} {TOKO.nama}. Dibuat dengan ❤️ untuk rumah Anda.
      </div>
    </footer>
  );
}
