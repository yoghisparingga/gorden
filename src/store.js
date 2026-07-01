/* =========================================================================
 * store.js — State global (zustand): konfigurasi simulator + keranjang
 * ========================================================================= */
import { create } from "zustand";
import { PRODUCTS } from "./data.js";
import { decodeConfig } from "./lib/share.js";

const CART_KEY = "gorden_cart_v2";

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function saveCart(cart) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch {}
}

const first = PRODUCTS[0];

const DEFAULT_SIM = {
  productId: first.id,
  room: "ruang-tamu",
  style: first.style,
  color: first.colors[0],
  motif: first.motif || "polos",
  opacity: first.opacity,
  sheer: first.sheer,
  openness: 0.3, // 0 = tertutup, 1 = terbuka penuh
  vitrase: true,
  lebar: 150,
  tinggi: 200,
  mode: "orbit", // kamera: 'orbit' (putar) | 'tour' (keliling otomatis) | 'walk' (jelajah)
  waktu: "siang", // suasana pencahayaan: 'siang' | 'sore' | 'malam'
};

// Hidrasi dari URL (#...) bila ada link desain yang dibagikan
let urlSim = null;
try {
  if (typeof location !== "undefined") {
    urlSim = decodeConfig(location.hash.replace(/^#/, ""));
  }
} catch {
  urlSim = null;
}

export const useStore = create((set, get) => ({
  // ----- Konfigurasi simulator -----
  sim: { ...DEFAULT_SIM, ...(urlSim || {}) },
  setSim: (partial) => set((s) => ({ sim: { ...s.sim, ...partial } })),

  // Tombol arah navigasi mode "Jelajah" (dibaca per-frame, tidak memicu re-render)
  nav: { f: false, b: false, l: false, r: false },
  setNav: (partial) => set((s) => ({ nav: { ...s.nav, ...partial } })),

  selectProduct: (p) =>
    set((s) => ({
      sim: {
        ...s.sim,
        productId: p.id,
        style: p.style,
        color: p.colors[0],
        motif: p.motif || "polos",
        opacity: p.opacity,
        sheer: p.sheer,
      },
    })),

  // ----- Keranjang -----
  cart: loadCart(),
  cartOpen: false,
  openCart: () => set({ cartOpen: true }),
  closeCart: () => set({ cartOpen: false }),

  addToCart: (item) =>
    set((s) => {
      const cart = [...s.cart, item];
      saveCart(cart);
      return { cart };
    }),
  changeQty: (idx, delta) =>
    set((s) => {
      const cart = s.cart.map((it, i) =>
        i === idx ? { ...it, qty: Math.max(1, it.qty + delta) } : it
      );
      saveCart(cart);
      return { cart };
    }),
  removeFromCart: (idx) =>
    set((s) => {
      const cart = s.cart.filter((_, i) => i !== idx);
      saveCart(cart);
      return { cart };
    }),

  // ----- Toast -----
  toast: "",
  showToast: (msg) => {
    set({ toast: msg });
    clearTimeout(get()._toastTimer);
    const t = setTimeout(() => set({ toast: "" }), 2400);
    set({ _toastTimer: t });
  },
  _toastTimer: null,
}));

export const activeProduct = () => {
  const id = useStore.getState().sim.productId;
  return PRODUCTS.find((p) => p.id === id) || PRODUCTS[0];
};
