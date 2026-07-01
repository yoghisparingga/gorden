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

# 1) Buat scaffolding platform (android/ios/web/dll) — hanya sekali.
#    Aman: tidak menimpa lib/ dan pubspec.yaml yang sudah ada.
flutter create .

# 2) Ambil dependency
flutter pub get

# 3) Jalankan (pilih perangkat/emulator yang aktif)
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
test/
  auth_service_test.dart        Unit test autentikasi
  login_screen_test.dart        Widget test layar login
```

## 🔌 Mengganti ke backend (REST API) nanti

1. Buat implementasi baru yang memanggil API login Anda dan mengembalikan
   `AuthResult` (lihat `services/auth_service.dart`).
2. Ganti pembuatan `AuthService(sampleEmployees)` di `main.dart`.
3. UI, provider, dan alur presensi tidak perlu diubah.

## 🔒 Catatan keamanan

- Data contoh menyimpan kata sandi sebagai teks biasa **hanya untuk demo**.
  Di produksi, **jangan** simpan kata sandi di aplikasi — validasi di server
  dan gunakan token (mis. JWT) untuk sesi.
