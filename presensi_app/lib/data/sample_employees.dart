import '../models/employee.dart';

/// Data pegawai CONTOH (offline) untuk uji coba login.
///
/// Ganti daftar ini dengan data asli, atau alihkan `AuthService`
/// ke sumber lain (mis. REST API) saat backend sudah siap.
///
/// Ringkasan akun demo:
///   NIP  198501012010011001  / pass: budi123   (Budi)
///   NRP  87050123            / pass: andi123   (Andi - Polri)
///   NIK  3201040404920004    / pass: rina123   (Rina)
///   HP   081234567002        / pass: siti123   (Siti)
///   NIP  000000000000000001  / pass: admin123  (Admin)
const List<Employee> sampleEmployees = [
  Employee(
    id: 'emp-001',
    name: 'Budi Santoso',
    nip: '198501012010011001',
    nik: '3201010101850001',
    phone: '081234567001',
    password: 'budi123',
    position: 'Staf Administrasi',
    department: 'Tata Usaha',
  ),
  Employee(
    id: 'emp-002',
    name: 'Siti Aminah',
    nip: '199002022012012002',
    nik: '3201020202900002',
    phone: '081234567002',
    password: 'siti123',
    position: 'Bendahara',
    department: 'Keuangan',
  ),
  Employee(
    id: 'emp-003',
    name: 'Andi Wijaya',
    nrp: '87050123',
    nik: '3201030303870003',
    phone: '081234567003',
    password: 'andi123',
    position: 'Anggota',
    department: 'Pengamanan',
  ),
  Employee(
    id: 'emp-004',
    name: 'Rina Marlina',
    nik: '3201040404920004',
    phone: '081234567004',
    password: 'rina123',
    position: 'Tenaga Kontrak',
    department: 'Umum',
  ),
  Employee(
    id: 'emp-000',
    name: 'Admin Sistem',
    nip: '000000000000000001',
    phone: '081200000000',
    password: 'admin123',
    position: 'Administrator',
    department: 'IT',
  ),
];
