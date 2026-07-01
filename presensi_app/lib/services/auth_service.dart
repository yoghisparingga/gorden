import '../models/employee.dart';
import '../utils/identifier.dart';

/// Hasil autentikasi: berisi [employee] bila sukses, atau [error] bila gagal.
class AuthResult {
  const AuthResult._({this.employee, this.error});

  factory AuthResult.success(Employee employee) =>
      AuthResult._(employee: employee);
  factory AuthResult.failure(String error) => AuthResult._(error: error);

  final Employee? employee;
  final String? error;

  bool get isSuccess => employee != null;
}

/// Memvalidasi login terhadap sumber data pegawai.
///
/// Saat ini sumbernya adalah daftar in-memory (data contoh). Untuk beralih
/// ke API, buat implementasi lain yang mengembalikan `AuthResult` yang sama.
class AuthService {
  AuthService(this._employees);

  final List<Employee> _employees;

  Employee? findById(String id) {
    for (final e in _employees) {
      if (e.id == id) return e;
    }
    return null;
  }

  /// Mencocokkan [rawIdentifier] (NIP/NRP/NIK/No. HP) + [password].
  AuthResult authenticate(String rawIdentifier, String password) {
    final identifier = rawIdentifier.trim();
    if (identifier.isEmpty) {
      return AuthResult.failure('NIP/NRP/NIK/No. HP tidak boleh kosong.');
    }
    if (password.isEmpty) {
      return AuthResult.failure('Kata sandi tidak boleh kosong.');
    }

    final normalizedPhone = normalizePhone(identifier);
    Employee? match;
    for (final e in _employees) {
      if (e.matchesIdentifier(identifier, normalizedPhone)) {
        match = e;
        break;
      }
    }

    if (match == null) {
      return AuthResult.failure(
        'Data tidak ditemukan. Periksa kembali NIP/NRP/NIK/No. HP Anda.',
      );
    }
    if (match.password != password) {
      return AuthResult.failure('Kata sandi salah.');
    }
    if (!match.active) {
      return AuthResult.failure('Akun tidak aktif. Hubungi admin.');
    }
    return AuthResult.success(match);
  }
}
