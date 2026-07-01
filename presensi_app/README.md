# 📋 Presensi Pegawai (Flutter)

Aplikasi presensi (kehadiran) pegawai. **Tahap 1**: login menggunakan
**NIP / NRP / NIK / No. HP + kata sandi** sesuai data pegawai, lalu
**absen masuk & pulang** dengan pencatatan waktu.

> Sumber data pegawai saat ini adalah **data contoh lokal (offline)** —
> lihat `lib/data/sample_employees.dart`. Dirancang agar mudah diganti ke
> REST API atau Firebase nanti tanpa mengubah UI.

## ✨ Fitur

- **Login fleksibel** — satu kolom identitas menerima **NIP, NRP, NIK, atau
  No. HP**. No. HP dinormalkan otomatis (`+62`, `62`, `0` dianggap sama).
  Ada petunjuk jenis identitas yang terdeteksi.
- **Sesi tersimpan** — tetap login setelah aplikasi ditutup
  (`shared_preferences`).
- **Beranda presensi** — jam & tanggal langsung (real-time), sapaan sesuai
  waktu, kartu profil pegawai.
- **Absen Masuk / Absen Pulang** — dengan status hari ini, durasi kerja,
  dan validasi (tidak bisa absen ganda / pulang sebelum masuk).
- **Riwayat presensi** — daftar kehadiran per hari (masuk, pulang, durasi),
  disimpan lokal per pegawai.

## 🔑 Akun demo (data contoh)

| Login via | Nilai                | Kata sandi | Nama          |
| --------- | -------------------- | ---------- | ------------- |
| NIP       | `198501012010011001` | `budi123`  | Budi Santoso  |
| No. HP    | `081234567002`       | `siti123`  | Siti Aminah   |
| NRP       | `87050123`           | `andi123`  | Andi Wijaya   |
| NIK       | `3201040404920004`   | `rina123`  | Rina Marlina  |
| NIP       | `000000000000000001` | `admin123` | Admin Sistem  |

Daftar ini juga muncul di layar login (tombol **"Akun demo"**).

## 🚀 Menjalankan

Butuh **Flutter SDK** (lihat https://docs.flutter.dev/get-started/install).

```bash
cd presensi_app

# 1) Buat scaffolding platform mobile (android/ios) — hanya sekali.
#    Folder web/ SUDAH disertakan (judul, ikon, manifest PWA), jadi tidak
#    perlu dibuat ulang. flutter create tidak menimpa lib/ & web/ yang ada.
flutter create . --platforms=android,ios

# 2) Ambil dependency
flutter pub get

# 3a) Jalankan di web (Chrome)
flutter run -d chrome

# 3b) atau di perangkat/emulator mobile
flutter run
```

Menjalankan test:

```bash
flutter test
```

## 🗂️ Struktur

```
lib/
  main.dart                     Bootstrap: init locale, prefs, provider
  app.dart                      MaterialApp + RootGate (splash/login/home)
  theme.dart                    Tema Material 3
  models/
    employee.dart               Model pegawai (+ pencocokan identitas)
    attendance_record.dart      Model catatan presensi harian
  data/
    sample_employees.dart       Data pegawai contoh (ganti dgn data asli/API)
  services/
    auth_service.dart           Validasi login (NIP/NRP/NIK/No. HP + sandi)
    attendance_service.dart     Simpan/baca presensi (shared_preferences)
    session_store.dart          Sesi login persisten
  providers/
    auth_provider.dart          State login (auto-login, login, logout)
    attendance_provider.dart    State presensi pegawai aktif
  utils/
    identifier.dart             Normalisasi & deteksi jenis identitas
    formatters.dart             Format tanggal/jam/durasi (locale id_ID)
  screens/
    splash_screen.dart          Layar pemulihan sesi
    login_screen.dart           Form login
    home_screen.dart            Beranda + tombol absen masuk/pulang
    history_screen.dart         Riwayat presensi
  widgets/
    section_card.dart           Kartu putih reusable
    status_badge.dart           Lencana status
web/                            Konfigurasi web (siap PWA)
  index.html                    Judul, theme-color, splash loading
  manifest.json                 Nama app, warna, ikon PWA
  favicon.png, icons/           Ikon (192/512 + maskable + apple-touch)
test/
  auth_service_test.dart        Unit test autentikasi
  login_screen_test.dart        Widget test layar login
```

## 🔌 Mengganti ke backend (REST API) nanti

1. Buat implementasi baru yang memanggil API login Anda dan mengembalikan
   `AuthResult` (lihat `services/auth_service.dart`).
2. Ganti pembuatan `AuthService(sampleEmployees)` di `main.dart`.
3. UI, provider, dan alur presensi tidak perlu diubah.

## ☁️ Deploy ke Vercel (Flutter Web)

Bisa. Flutter Web menghasilkan situs statis yang cocok untuk Vercel. Karena
Vercel tidak menyertakan Flutter SDK, file `vercel.json` di folder ini sudah
mengatur agar Flutter diunduh & di-build otomatis.

**Langkah (dashboard Vercel):**

1. Buka https://vercel.com → **Add New… → Project** → import repo
   `yoghisparingga/gorden`.
2. Di setelan project, set **Root Directory = `presensi_app`**
   (penting — agar Vercel memakai `presensi_app/vercel.json`, bukan web React
   di root repo).
3. Biarkan Build/Output default (sudah diatur lewat `vercel.json`), klik
   **Deploy**. Build pertama beberapa menit karena mengunduh Flutter.

> Web React (toko gorden) dan app Flutter ini bisa jadi **dua project Vercel
> terpisah** dari repo yang sama, dibedakan lewat Root Directory.

**Alternatif (build lokal, lebih cepat):**

```bash
cd presensi_app
flutter build web --release
npx vercel deploy --prebuilt build/web   # atau hubungkan folder build/web
```

**Catatan penting untuk versi web:**

- `shared_preferences` di web memakai **localStorage browser**, jadi sesi login
  & data presensi tersimpan **per-browser/perangkat** (sesuai desain data lokal
  saat ini). Saat pindah ke API, data akan terpusat di server.
- Ini aplikasi statis sisi-klien (tanpa server). Saat memakai API nanti,
  perhatikan **CORS** di sisi backend.

## 🔒 Catatan keamanan

- Data contoh menyimpan kata sandi sebagai teks biasa **hanya untuk demo**.
  Di produksi, **jangan** simpan kata sandi di aplikasi — validasi di server
  dan gunakan token (mis. JWT) untuk sesi.
