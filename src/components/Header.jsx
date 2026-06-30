import { useStore } from "../store.js";
import { TOKO } from "../data.js";

const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

export default function Header({ menuOpen, setMenuOpen }) {
  const cart = useStore((s) => s.cart);
  const openCart = useStore((s) => s.openCart);
  const count = cart.reduce((n, i) => n + i.qty, 0);

  const go = (id) => {
    scrollTo(id);
    setMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="container nav">
        <a className="brand" onClick={() => go("home")}>
          <span className="brand-mark">🪟</span>
          <span>{TOKO.nama}</span>
        </a>
        <nav className={"nav-menu" + (menuOpen ? " open" : "")}>
          <a onClick={() => go("katalog")}>Katalog</a>
          <a onClick={() => go("simulator")}>Simulasi 3D</a>
          <a onClick={() => go("cara")}>Cara Pesan</a>
          <a onClick={() => go("kontak")}>Kontak</a>
        </nav>
        <div className="nav-actions">
          <button className="cart-btn" onClick={openCart} aria-label="Keranjang">
            🛒 <span className="cart-count">{count}</span>
          </button>
          <button className="menu-toggle" onClick={() => setMenuOpen((v) => !v)} aria-label="Menu">
            ☰
          </button>
        </div>
      </div>
    </header>
  );
}
