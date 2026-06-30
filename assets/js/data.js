/* =========================================================================
 * data.js — Data produk gorden & konfigurasi toko
 * Semua harga dalam Rupiah (IDR). Ubah sesuai kebutuhan toko Anda.
 * ========================================================================= */

const TOKO = {
  nama: "Gorden Asri",
  tagline: "Gorden & Vitrase Premium untuk Rumah Impian Anda",
  // Ganti dengan nomor WhatsApp toko Anda (format internasional tanpa + atau 0 di depan).
  // Contoh: 6281234567890 untuk nomor 081234567890
  whatsapp: "6281234567890",
  email: "halo@gordenasri.id",
  alamat: "Jl. Mawar No. 12, Jakarta",
  // Fullness factor: kebutuhan kain dibanding lebar jendela (1.8–2.5 standar industri)
  fullnessDefault: 2.0,
};

/* Setiap produk:
 * - colors: daftar warna yang tersedia (hex)
 * - pricePerMeter: harga per meter lebar jendela (sudah termasuk fullness standar)
 * - style: model header gorden -> 'lipat' | 'gelombang' | 'smokring' | 'vitrase'
 * - sheer: true jika kain tembus pandang (vitrase)
 */
const PRODUCTS = [
  {
    id: "blackout-luxe",
    nama: "Blackout Luxe",
    kategori: "Blackout",
    motif: "polos",
    style: "lipat",
    sheer: false,
    opacity: 1.0,
    pricePerMeter: 195000,
    rating: 4.9,
    terjual: 1240,
    bahan: "Polyester Blackout 3 lapis",
    colors: ["#2f3a4a", "#5b6470", "#8a5a3c", "#2d3e2f", "#7a2e3a", "#1f2933"],
    deskripsi:
      "Gorden blackout premium yang menahan hingga 99% cahaya. Cocok untuk kamar tidur, home theater, dan ruangan yang butuh privasi maksimal.",
    fitur: ["Kedap cahaya", "Meredam panas", "Anti UV", "Mudah dicuci"],
    badge: "Terlaris",
  },
  {
    id: "vitrase-sheer",
    nama: "Vitrase Sheer Elegant",
    kategori: "Vitrase",
    motif: "polos",
    style: "vitrase",
    sheer: true,
    opacity: 0.4,
    pricePerMeter: 95000,
    rating: 4.8,
    terjual: 2030,
    bahan: "Sifon import lembut",
    colors: ["#f5f1e8", "#ffffff", "#efe6d8", "#e8e4dc", "#f0d9c4", "#dfe7e3"],
    deskripsi:
      "Vitrase tipis yang menyaring cahaya menjadi lembut dan hangat, tetap menjaga privasi di siang hari. Sempurna dipadukan dengan gorden utama.",
    fitur: ["Menyaring cahaya", "Ringan & jatuh indah", "Tetap privat", "Tampilan mewah"],
    badge: "Favorit",
  },
  {
    id: "semi-blackout-linen",
    nama: "Semi Blackout Linen",
    kategori: "Semi Blackout",
    motif: "garis",
    style: "gelombang",
    sheer: false,
    opacity: 0.85,
    pricePerMeter: 155000,
    rating: 4.7,
    terjual: 870,
    bahan: "Linen look premium",
    colors: ["#d8cdbb", "#b7a98f", "#9aa39b", "#c9b8a8", "#8d9aa6", "#6f7d6a"],
    deskripsi:
      "Tekstur linen alami dengan jatuh kain gelombang (wave) yang rapi dan modern. Menahan sebagian cahaya, ruangan tetap terang namun tidak menyilaukan.",
    fitur: ["Model wave", "Tekstur natural", "Tahan kusut", "Warna kalem"],
    badge: "Baru",
  },
  {
    id: "minimalis-polos",
    nama: "Minimalis Polos",
    kategori: "Minimalis",
    motif: "polos",
    style: "smokring",
    sheer: false,
    opacity: 0.95,
    pricePerMeter: 125000,
    rating: 4.6,
    terjual: 1510,
    bahan: "Dimout halus",
    colors: ["#3a4750", "#7d8a96", "#a7b0b8", "#5d6f6a", "#b0856b", "#4a4a4a"],
    deskripsi:
      "Gorden polos dengan ring smokring (eyelet) yang praktis dibuka-tutup. Tampilan bersih dan cocok untuk segala gaya interior.",
    fitur: ["Ring smokring", "Praktis", "Harga ekonomis", "Banyak warna"],
    badge: "",
  },
  {
    id: "motif-tropis",
    nama: "Motif Tropis",
    kategori: "Motif",
    motif: "daun",
    style: "lipat",
    sheer: false,
    opacity: 0.9,
    pricePerMeter: 165000,
    rating: 4.7,
    terjual: 640,
    bahan: "Katun campuran",
    colors: ["#3d5a4c", "#6b8e6e", "#c4a35a", "#a3623f", "#41606b", "#7a6a52"],
    deskripsi:
      "Motif dedaunan tropis yang menyegarkan ruangan. Membuat suasana rumah terasa lebih hidup dan ceria.",
    fitur: ["Motif eksklusif", "Warna tahan lama", "Cocok ruang keluarga", "Estetik"],
    badge: "",
  },
  {
    id: "kids-pastel",
    nama: "Kids Pastel",
    kategori: "Anak",
    motif: "titik",
    style: "smokring",
    sheer: false,
    opacity: 0.9,
    pricePerMeter: 135000,
    rating: 4.9,
    terjual: 980,
    bahan: "Microfiber lembut",
    colors: ["#f4b6c2", "#a8d8ea", "#c3e8b9", "#f7dba7", "#d6c3f0", "#ffd6a5"],
    deskripsi:
      "Warna-warna pastel ceria yang ramah anak. Bahan lembut dan aman, membuat kamar si kecil makin nyaman.",
    fitur: ["Warna ceria", "Bahan aman", "Lembut", "Mudah perawatan"],
    badge: "Rekomendasi",
  },
];

/* Pilihan model header gorden untuk simulator */
const STYLES = [
  { id: "lipat", nama: "Lipat (Pinch Pleat)", desc: "Lipatan rapi klasik" },
  { id: "gelombang", nama: "Gelombang (Wave)", desc: "Jatuh kain modern" },
  { id: "smokring", nama: "Smokring (Eyelet)", desc: "Ring praktis" },
  { id: "vitrase", nama: "Vitrase (Sheer)", desc: "Tipis tembus cahaya" },
];

/* Pilihan motif kain gorden untuk simulator */
const MOTIFS = [
  { id: "polos", nama: "Polos", icon: "" },
  { id: "garis", nama: "Garis", icon: "" },
  { id: "kotak", nama: "Kotak", icon: "" },
  { id: "titik", nama: "Titik", icon: "" },
  { id: "bunga", nama: "Bunga", icon: "🌸" },
  { id: "daun", nama: "Daun", icon: "🌿" },
];

/* Preset ukuran jendela (cm). Mengubah bentuk jendela & gorden di simulator. */
const SIZES = [
  { id: "kecil", nama: "Kecil", lebar: 100, tinggi: 150, desc: "100 × 150" },
  { id: "sedang", nama: "Sedang", lebar: 150, tinggi: 200, desc: "150 × 200" },
  { id: "besar", nama: "Besar", lebar: 200, tinggi: 250, desc: "200 × 250" },
  { id: "pintu", nama: "Pintu/Sliding", lebar: 300, tinggi: 270, desc: "300 × 270" },
];

/* Preset ruangan untuk simulator */
const ROOMS = [
  { id: "ruang-tamu", nama: "Ruang Tamu", emoji: "🛋️" },
  { id: "kamar", nama: "Kamar Tidur", emoji: "🛏️" },
  { id: "kamar-anak", nama: "Kamar Anak", emoji: "🧸" },
  { id: "ruang-makan", nama: "Ruang Makan", emoji: "🍽️" },
  { id: "dapur", nama: "Dapur", emoji: "🍳" },
  { id: "kantor", nama: "Kantor", emoji: "💼" },
  { id: "upload", nama: "Foto Saya", emoji: "📷" },
];

const RUPIAH = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});
