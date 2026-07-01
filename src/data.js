/* =========================================================================
 * data.js — Data produk, motif, ruangan, ukuran & konfigurasi toko
 * Semua harga dalam Rupiah (IDR).
 * ========================================================================= */

export const TOKO = {
  nama: "I'AM GORDEN LUBUK LINGGAU",
  tagline: "Gorden Terbaik Di Lubuk Linggau",
  // Nomor WhatsApp toko (format internasional)
  whatsapp: "6282281108889",
  email: "halo@iamgorden.id",
  alamat: "Jl. Yos Sudarso, Kel. Taba Koji, Kecamatan Lubuk Linggau Timur I",
};

export const PRODUCTS = [
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
      "Gorden blackout premium yang menahan hingga 99% cahaya. Cocok untuk kamar tidur dan home theater.",
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
      "Vitrase tipis yang menyaring cahaya jadi lembut, tetap menjaga privasi di siang hari.",
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
      "Tekstur linen alami dengan jatuh kain gelombang yang rapi dan modern.",
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
      "Gorden polos dengan ring smokring yang praktis dibuka-tutup. Tampilan bersih untuk segala interior.",
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
      "Motif dedaunan tropis yang menyegarkan ruangan dan membuat rumah terasa lebih hidup.",
    badge: "",
  },
  {
    id: "kids-pastel",
    nama: "Kids Pastel",
    kategori: "Anak",
    motif: "bintang",
    style: "smokring",
    sheer: false,
    opacity: 0.9,
    pricePerMeter: 135000,
    rating: 4.9,
    terjual: 980,
    bahan: "Microfiber lembut",
    colors: ["#f4b6c2", "#a8d8ea", "#c3e8b9", "#f7dba7", "#d6c3f0", "#ffd6a5"],
    deskripsi:
      "Warna pastel ceria yang ramah anak. Bahan lembut dan aman untuk kamar si kecil.",
    badge: "Rekomendasi",
  },
];

export const STYLES = [
  { id: "lipat", nama: "Lipat", desc: "Lipatan rapi klasik" },
  { id: "gelombang", nama: "Gelombang", desc: "Jatuh kain modern" },
  { id: "smokring", nama: "Smokring", desc: "Ring praktis" },
  { id: "vitrase", nama: "Vitrase", desc: "Tipis tembus cahaya" },
];

/* 12 motif kain — dirender jadi tekstur prosedural di simulator 3D */
export const MOTIFS = [
  { id: "polos", nama: "Polos" },
  { id: "garis", nama: "Garis" },
  { id: "garis-h", nama: "Garis H." },
  { id: "kotak", nama: "Kotak" },
  { id: "titik", nama: "Titik" },
  { id: "bunga", nama: "Bunga" },
  { id: "daun", nama: "Daun" },
  { id: "chevron", nama: "Chevron" },
  { id: "gelombang", nama: "Ombak" },
  { id: "bintang", nama: "Bintang" },
  { id: "geometris", nama: "Geometris" },
  { id: "damask", nama: "Damask" },
];

export const SIZES = [
  { id: "kecil", nama: "Kecil", lebar: 100, tinggi: 150, desc: "100 × 150" },
  { id: "sedang", nama: "Sedang", lebar: 150, tinggi: 200, desc: "150 × 200" },
  { id: "besar", nama: "Besar", lebar: 200, tinggi: 250, desc: "200 × 250" },
  { id: "pintu", nama: "Pintu", lebar: 300, tinggi: 270, desc: "300 × 270" },
];

/* Ruangan 3D preset — tema warna dinding/lantai & aksen dekorasi */
export const ROOMS = [
  { id: "ruang-tamu", nama: "Ruang Tamu", emoji: "🛋️", wall: "#efe7da", floor: "#c2a079", accent: "#7e9b6e" },
  { id: "kamar", nama: "Kamar Tidur", emoji: "🛏️", wall: "#e8dfe6", floor: "#b89a78", accent: "#b98aa0" },
  { id: "kamar-anak", nama: "Kamar Anak", emoji: "🧸", wall: "#e6f0f7", floor: "#cdb89a", accent: "#f4b6c2" },
  { id: "ruang-makan", nama: "Ruang Makan", emoji: "🍽️", wall: "#f3e7d6", floor: "#a9794f", accent: "#c98b3a" },
  { id: "dapur", nama: "Dapur", emoji: "🍳", wall: "#eef1ec", floor: "#b9b1a4", accent: "#8fae9b" },
  { id: "kantor", nama: "Kantor", emoji: "💼", wall: "#e9edf1", floor: "#9aa3ab", accent: "#5b7d9a" },
  { id: "ruang-keluarga", nama: "Ruang Keluarga", emoji: "📺", wall: "#ece2d4", floor: "#b98c5f", accent: "#4f8a86" },
  { id: "kamar-utama", nama: "Kamar Utama", emoji: "🛌", wall: "#e6e0e6", floor: "#a98a6a", accent: "#8a6d9c" },
  { id: "ruang-baca", nama: "Ruang Baca", emoji: "📚", wall: "#e8e1d2", floor: "#9c7550", accent: "#a15b43" },
  { id: "kafe", nama: "Kafe / Resto", emoji: "☕", wall: "#e7dccb", floor: "#7a5a44", accent: "#c07f3a" },
  { id: "upload", nama: "Foto Saya", emoji: "📷", wall: "#e9e9e9", floor: "#cccccc", accent: "#b07a4f" },
];

export const RUPIAH = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});
