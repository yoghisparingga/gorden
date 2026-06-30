# 🪟 Gorden Asri — Website Penjualan & Simulasi Gorden

Website penjualan gorden lengkap dengan **simulator gorden interaktif**: pelanggan
bisa mencoba model, warna, dan bahan gorden langsung di ruangan virtual — atau
**mengunggah foto ruangan mereka sendiri** — sebelum memesan lewat WhatsApp.

Dibangun dengan **HTML, CSS, dan JavaScript murni** (tanpa framework, tanpa proses
build). Cukup buka di browser dan langsung jalan.

## ✨ Fitur

- **Simulator Gorden (Canvas)** — render gorden realtime di atas jendela:
  - 3 ruangan preset (ruang tamu, kamar tidur, kantor) + **unggah foto sendiri**
  - 4 model header: Lipat (pinch pleat), Gelombang (wave), Smokring (eyelet), Vitrase
  - Pilih warna dari swatch produk atau **warna kustom** (color picker)
  - Slider **buka/tutup** gorden
  - Lapisan **vitrase** opsional di belakang gorden utama
  - Atur ukuran jendela (lebar × tinggi) → **estimasi harga otomatis**
  - **Unduh gambar** hasil simulasi (PNG)
- **Katalog produk** dengan filter kategori, rating, dan swatch warna
- **Keranjang belanja** (tersimpan di browser via `localStorage`)
- **Checkout via WhatsApp** — pesanan otomatis terformat rapi
- **Responsif** — nyaman di HP maupun desktop

## 🚀 Menjalankan

Cara paling mudah — buka langsung:

```
Buka index.html di browser (klik dua kali).
```

Atau jalankan lewat server lokal (disarankan agar fitur unggah foto lancar):

```bash
# Python
python3 -m http.server 8000

# atau Node
npx serve .
```

Lalu buka `http://localhost:8000`.

## ⚙️ Konfigurasi Toko

Edit `assets/js/data.js`:

- `TOKO.nama`, `TOKO.tagline`, `TOKO.alamat`, `TOKO.email`
- `TOKO.whatsapp` — **nomor WhatsApp toko** (format internasional, mis. `6281234567890`)
- `PRODUCTS` — tambah/ubah produk, harga per meter, warna, model, dll.

## 📁 Struktur

```
index.html              Halaman utama (hero, simulator, katalog, dll)
assets/css/styles.css   Seluruh styling
assets/js/data.js       Data produk & konfigurasi toko
assets/js/simulator.js  Mesin simulasi gorden berbasis Canvas
assets/js/app.js        Logika UI: katalog, keranjang, kontrol, checkout
```

## 📝 Catatan

- Harga di keranjang adalah **estimasi**; harga final dikonfirmasi setelah pengukuran.
- Gambar produk dibuat otomatis (gradient), jadi tidak perlu file foto eksternal.
- Untuk publikasi gratis, situs ini bisa langsung di-deploy ke GitHub Pages,
  Netlify, atau Vercel sebagai situs statis.
