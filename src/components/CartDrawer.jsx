import { useStore } from "../store.js";
import { TOKO, STYLES, MOTIFS, RUPIAH } from "../data.js";

const styleName = (id) => (STYLES.find((x) => x.id === id) || {}).nama || id;
const motifName = (id) => (MOTIFS.find((x) => x.id === id) || {}).nama || id;

export default function CartDrawer() {
  const cart = useStore((s) => s.cart);
  const open = useStore((s) => s.cartOpen);
  const close = useStore((s) => s.closeCart);
  const changeQty = useStore((s) => s.changeQty);
  const removeFromCart = useStore((s) => s.removeFromCart);

  const total = cart.reduce((s, i) => s + i.harga * i.qty, 0);

  const checkout = () => {
    if (!cart.length) return;
    let msg = `Halo ${TOKO.nama}, saya mau pesan gorden:\n\n`;
    cart.forEach((i, n) => {
      msg += `${n + 1}. ${i.nama} (${styleName(i.style)}, motif ${motifName(i.motif)})\n`;
      msg += `   Warna: ${i.warna} | Ukuran: ${i.lebar}x${i.tinggi} cm | Qty: ${i.qty}\n`;
      msg += `   Subtotal: ${RUPIAH.format(i.harga * i.qty)}\n`;
    });
    msg += `\nTotal estimasi: ${RUPIAH.format(total)}\n\nMohon info ketersediaan & ongkir. Terima kasih!`;
    window.open(`https://wa.me/${TOKO.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <>
      <div className={"overlay" + (open ? " show" : "")} onClick={close} />
      <aside className={"cart-drawer" + (open ? " open" : "")}>
        <div className="cart-header">
          <h3>🛒 Keranjang Belanja</h3>
          <button className="cart-close" onClick={close}>×</button>
        </div>
        <div className="cart-items">
          {cart.length === 0 ? (
            <p className="empty">Keranjang masih kosong. Yuk pilih gorden favorit Anda! 🪟</p>
          ) : (
            cart.map((item, idx) => (
              <div className="cart-row" key={idx}>
                <span className="cart-color" style={{ background: item.warna }} />
                <div className="cart-info">
                  <strong>{item.nama}</strong>
                  <small>{styleName(item.style)} · {motifName(item.motif)} · {item.lebar}×{item.tinggi} cm</small>
                </div>
                <div className="cart-qty">
                  <button onClick={() => changeQty(idx, -1)}>−</button>
                  <span>{item.qty}</span>
                  <button onClick={() => changeQty(idx, 1)}>+</button>
                </div>
                <div className="cart-line">{RUPIAH.format(item.harga * item.qty)}</div>
                <button className="cart-del" onClick={() => removeFromCart(idx)}>×</button>
              </div>
            ))
          )}
        </div>
        <div className="cart-footer">
          <div className="cart-total-row">
            <span>Total estimasi</span>
            <strong>{RUPIAH.format(total)}</strong>
          </div>
          <p className="cart-note">*Harga final dikonfirmasi setelah pengukuran.</p>
          <button className="btn btn-primary btn-block" disabled={!cart.length} onClick={checkout}>
            💬 Checkout via WhatsApp
          </button>
        </div>
      </aside>
    </>
  );
}
