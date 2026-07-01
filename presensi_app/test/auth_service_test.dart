import 'package:flutter_test/flutter_test.dart';
import 'package:presensi_app/data/sample_employees.dart';
import 'package:presensi_app/services/auth_service.dart';

void main() {
  final service = AuthService(sampleEmployees);

  group('AuthService.authenticate', () {
    test('berhasil login dengan NIP + kata sandi benar', () {
      final r = service.authenticate('198501012010011001', 'budi123');
      expect(r.isSuccess, isTrue);
      expect(r.employee?.name, 'Budi Santoso');
    });

    test('berhasil login dengan NRP', () {
      final r = service.authenticate('87050123', 'andi123');
      expect(r.isSuccess, isTrue);
      expect(r.employee?.name, 'Andi Wijaya');
    });

    test('berhasil login dengan NIK', () {
      final r = service.authenticate('3201040404920004', 'rina123');
      expect(r.isSuccess, isTrue);
      expect(r.employee?.name, 'Rina Marlina');
    });

    test('berhasil login dengan No. HP (format 0...)', () {
      final r = service.authenticate('081234567002', 'siti123');
      expect(r.isSuccess, isTrue);
      expect(r.employee?.name, 'Siti Aminah');
    });

    test('No. HP dengan format +62 tetap dikenali', () {
      final r = service.authenticate('+62 812-3456-7002', 'siti123');
      expect(r.isSuccess, isTrue);
      expect(r.employee?.name, 'Siti Aminah');
    });

    test('gagal bila identitas tidak ditemukan', () {
      final r = service.authenticate('0000', 'apa saja');
      expect(r.isSuccess, isFalse);
      expect(r.error, contains('tidak ditemukan'));
    });

    test('gagal bila kata sandi salah', () {
      final r = service.authenticate('198501012010011001', 'salah');
      expect(r.isSuccess, isFalse);
      expect(r.error, contains('sandi'));
    });

    test('gagal bila identitas kosong', () {
      final r = service.authenticate('   ', 'budi123');
      expect(r.isSuccess, isFalse);
    });
  });
}
