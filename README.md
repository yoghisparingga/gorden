# 🪟 Gorden Asri — Website Penjualan & Simulasi Gorden

Website penjualan gorden lengkap dengan **simulator gorden interaktif**: pelanggan
bisa mencoba model, warna, dan bahan gorden langsung di ruangan virtual — atau
**mengunggah foto ruangan mereka sendiri** — sebelum memesan lewat WhatsApp.

Dibangun dengan **HTML, CSS, dan JavaScript murni** (tanpa framework, tanpa proses
build). Cukup buka di browser dan langsung jalan.

## ✨ Fitur

- **Simulator Gorden (Canvas)** — render gorden realtime di atas jendela:
  - **6 ruangan preset** (ruang tamu, kamar tidur, kamar anak, ruang makan,
    dapur, kantor) + **unggah foto ruangan sendiri**
  - 4 model header: Lipat (pinch pleat), Gelombang (wave), Smokring (eyelet), Vitrase
  - **6 motif kain**: Polos, Garis, Kotak, Titik, Bunga, Daun
  - Pilih warna dari swatch produk atau **warna kustom** (color picker)
  - Slider **buka/tutup** gorden + lapisan **vitrase** opsional
  - Preset & input **ukuran jendela** (lebar × tinggi) yang mengubah bentuk
    jendela di simulasi → **estimasi harga otomatis**
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

## ☁️ Deploy ke Vercel (uji coba online)

Situs ini statis murni, jadi Vercel langsung melayaninya tanpa konfigurasi build.
File `vercel.json` sudah disertakan.

### Cara 1 — lewat Dashboard (paling mudah, tanpa CLI)

1. Buka **https://vercel.com** dan login (bisa pakai akun GitHub).
2. Klik **Add New… → Project**.
3. Pilih **Import** repo `yoghisparingga/gorden`.
4. Karena ini situs statis, biarkan semua pengaturan default
   (Framework Preset: **Other**, tanpa Build Command), lalu klik **Deploy**.
5. Tunggu ±1 menit → Vercel memberi URL seperti
   `https://gorden-xxxx.vercel.app` untuk diuji coba.

> Branch produksi otomatis mengikuti branch default repo, yaitu
> `claude/curtain-sales-room-simulator-tih2qw`. Jika nanti repo punya branch
> `main`, atur **Production Branch** di Settings → Git agar sesuai.

### Cara 2 — lewat Vercel CLI

```bash
npm i -g vercel     # sekali saja
cd gorden
vercel              # ikuti prompt login & konfirmasi (preview)
vercel --prod       # rilis ke domain produksi
```

Setelah terhubung ke GitHub, setiap `git push` ke branch ini otomatis
membuat **Preview Deployment** baru.

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
