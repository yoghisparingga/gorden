import '../utils/identifier.dart';

/// Data pegawai. Untuk tahap ini bersumber dari data contoh lokal
/// (lihat `data/sample_employees.dart`), namun struktur ini dirancang
/// agar mudah dipetakan dari respons API di kemudian hari.
class Employee {
  const Employee({
    required this.id,
    required this.name,
    required this.phone,
    required this.password,
    this.nip,
    this.nrp,
    this.nik,
    this.position = '-',
    this.department = '-',
    this.active = true,
  });

  /// Id internal unik (dipakai untuk sesi & data presensi).
  final String id;
  final String name;

  /// No. HP wajib ada — salah satu cara login.
  final String phone;

  /// CATATAN: hanya untuk data contoh. Di produksi JANGAN menyimpan
  /// kata sandi sebagai teks biasa — gunakan hash di sisi server.
  final String password;

  final String? nip; // Nomor Induk Pegawai (mis. PNS, 18 digit)
  final String? nrp; // Nomor Registrasi Pokok (mis. TNI/Polri)
  final String? nik; // Nomor Induk Kependudukan (16 digit)

  final String position; // Jabatan
  final String department; // Unit/Bagian
  final bool active;

  /// Cek apakah [identifier] yang diketik pengguna cocok dengan salah satu
  /// identitas pegawai ini. [normalizedPhone] adalah hasil `normalizePhone`.
  bool matchesIdentifier(String identifier, String normalizedPhone) {
    if (nip != null && nip == identifier) return true;
    if (nrp != null && nrp == identifier) return true;
    if (nik != null && nik == identifier) return true;
    if (normalizePhone(phone) == normalizedPhone) return true;
    return false;
  }

  /// Inisial untuk avatar, mis. "Budi Santoso" -> "BS".
  String get initials {
    final parts =
        name.trim().split(RegExp(r'\s+')).where((p) => p.isNotEmpty).toList();
    if (parts.isEmpty) return '?';
    if (parts.length == 1) return parts.first.substring(0, 1).toUpperCase();
    return (parts.first.substring(0, 1) + parts.last.substring(0, 1))
        .toUpperCase();
  }

  factory Employee.fromJson(Map<String, dynamic> json) => Employee(
        id: json['id'] as String,
        name: json['name'] as String,
        phone: json['phone'] as String,
        password: json['password'] as String? ?? '',
        nip: json['nip'] as String?,
        nrp: json['nrp'] as String?,
        nik: json['nik'] as String?,
        position: json['position'] as String? ?? '-',
        department: json['department'] as String? ?? '-',
        active: json['active'] as bool? ?? true,
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'phone': phone,
        'password': password,
        'nip': nip,
        'nrp': nrp,
        'nik': nik,
        'position': position,
        'department': department,
        'active': active,
      };
}
