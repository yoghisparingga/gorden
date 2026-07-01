# 🪟 Gorden Asri — Website Penjualan & Simulasi Gorden 3D

Website penjualan gorden dengan **simulator gorden 3D interaktif**: pelanggan bisa
mencoba model, motif, warna, dan ukuran gorden langsung di **ruangan 3D yang bisa
diputar dan di-tour** sebelum memesan lewat WhatsApp.

Dibangun dengan **React + Vite + Three.js** (`@react-three/fiber`).

## ✨ Fitur

- **Simulator Gorden 3D** (Three.js / React Three Fiber):
  - **Render realistis**: pencahayaan berbasis environment (pantulan lembut),
    tone-mapping sinematik, bayangan lembut, material kain ber-sheen, tekstur
    lantai kayu, serta post-processing (ambient occlusion + bloom + vignette)
  - **Preset waktu/suasana**: ☀️ Siang, 🌇 Sore (golden hour), 🌙 Malam
    (langit gelap + lampu interior menyala) — lihat efek blackout & vitrase
    di berbagai kondisi cahaya
  - **Mode kualitas ✨ Tinggi / ⚡ Hemat** dengan deteksi otomatis (HP →
    Hemat): mode hemat menonaktifkan efek berat (AO/bloom/animasi angin),
    membekukan shadow map, & menurunkan resolusi agar lancar di perangkat ringan
  - 3 mode kamera: **🔄 Putar** (orbit), **🎥 Tour** (keliling otomatis),
    **🚶 Jelajah** (jalan keliling ruangan — WASD/tombol arah + seret untuk melihat)
  - **6 ruangan** preset (ruang tamu, kamar, kamar anak, ruang makan, dapur, kantor),
    masing-masing dengan **furnitur 3D** (sofa, ranjang, meja makan, meja kerja, dll),
    tema warna & dekorasi (tanaman, hiasan dinding, karpet)
  - **📷 Mode Foto Saya** — unggah foto ruangan sendiri, gorden di-overlay di
    atas jendela dengan posisi & ukuran yang bisa diatur
  - 4 model header: Lipat, Gelombang, Smokring, Vitrase
  - **12 motif kain**: Polos, Garis, Garis H., Kotak, Titik, Bunga, Daun, Chevron,
    Ombak, Bintang, Geometris, Damask
  - Warna swatch + **warna kustom**, slider **buka/tutup**, lapisan **vitrase**
  - Gorden **bergerak tertiup angin** + pencahayaan & bayangan realistis
  - **Ukuran jendela** (preset + custom) mengubah bentuk jendela 3D → **estimasi harga**
  - **Unduh gambar** hasil simulasi (PNG)
  - **Bagikan desain**: salin link atau kirim ke toko via WhatsApp — link
    membuka ulang tampilan 3D yang sama persis (konfigurasi tersimpan di URL)
- **Katalog produk** dengan filter, rating, dan thumbnail motif
- **Keranjang belanja** (tersimpan via `localStorage`)
- **Checkout via WhatsApp** — pesanan otomatis terformat rapi
- **Responsif** untuk HP & desktop

## 🚀 Menjalankan (development)

```bash
npm install
npm run dev      # buka http://localhost:5173
```

## 🏗️ Build produksi

```bash
npm run build    # output ke folder dist/
npm run preview  # cek hasil build secara lokal
```

## ☁️ Deploy ke Vercel (uji coba online)

### Cara 1 — Dashboard (paling mudah)

1. Buka **https://vercel.com** dan login (bisa pakai akun GitHub).
2. **Add New… → Project** → **Import** repo `yoghisparingga/gorden`.
3. Vercel otomatis mendeteksi **Vite** (Build: `vite build`, Output: `dist`).
   Biarkan default, klik **Deploy**.
4. Tunggu ±1–2 menit → dapat URL `https://gorden-xxxx.vercel.app`.

> Branch produksi mengikuti branch default repo
> (`claude/curtain-sales-room-simulator-tih2qw`). Atur di Settings → Git bila perlu.

### Cara 2 — Vercel CLI

```bash
npm i -g vercel
vercel          # preview
vercel --prod   # produksi
```

## ⚙️ Konfigurasi Toko

Edit `src/data.js`:

- `TOKO.nama`, `TOKO.tagline`, `TOKO.alamat`, `TOKO.email`
- `TOKO.whatsapp` — **nomor WhatsApp toko** (format mis. `6281234567890`)
- `PRODUCTS` — produk, harga/meter, warna, model, motif default

## 📁 Struktur

```
index.html                 Entry Vite
vite.config.js             Konfigurasi Vite
vercel.json                Konfigurasi deploy
src/
  main.jsx, App.jsx        Root React
  styles.css               Styling
  data.js                  Data produk, motif, ruangan, ukuran, toko
  store.js                 State global (zustand): simulator + keranjang
  lib/
    fabric.js              Tekstur kain prosedural (12 motif) + helper warna
    price.js               Estimasi harga
  sim/
    Simulator.jsx          Bagian simulator (Canvas 3D + toolbar)
    Scene.jsx              Ruangan 3D, lampu, jendela, kamera (orbit + tour)
    Curtain.jsx            Panel gorden 3D (lipatan + animasi angin)
    Controls.jsx           Panel kontrol simulator
  components/              Header, Hero, Catalog, CartDrawer, Sections, Toast
```

## 🧰 Stack

React 18 · Vite 5 · Three.js · @react-three/fiber · @react-three/postprocessing · zustand

## 📝 Catatan

- Harga di keranjang adalah **estimasi**; harga final dikonfirmasi setelah pengukuran.
- Thumbnail & motif dibuat otomatis (canvas), tanpa file gambar eksternal.
