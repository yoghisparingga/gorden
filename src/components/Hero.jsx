import { TOKO } from "../data.js";

const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

export default function Hero() {
  return (
    <section id="home" className="hero">
      <div className="container hero-grid">
        <div className="hero-text">
          <span className="hero-eyebrow">✨ Coba gorden di ruangan 3D — putar & tour</span>
          <h1>{TOKO.tagline}</h1>
          <p>
            Pilih model, motif, dan warna — lalu lihat langsung tampilannya di ruangan 3D
            yang bisa Anda putar. Pesan mudah lewat WhatsApp, dipasang rapi oleh tim kami.
          </p>
          <div className="hero-btns">
            <button className="btn btn-primary btn-lg" onClick={() => scrollTo("simulator")}>
              🪟 Coba Simulator 3D
            </button>
            <button className="btn btn-outline btn-lg" onClick={() => scrollTo("katalog")}>
              Lihat Katalog
            </button>
          </div>
          <div className="hero-stats">
            <div><strong>7.000+</strong><span>Gorden terpasang</span></div>
            <div><strong>4.8★</strong><span>Rating pelanggan</span></div>
            <div><strong>12 Motif</strong><span>Pilihan kain</span></div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-window">
            <div className="hw-sky" />
            <div className="hw-curtain hw-left" />
            <div className="hw-curtain hw-right" />
            <div className="hw-rod" />
          </div>
        </div>
      </div>
    </section>
  );
}
