import 'dart:convert';

import 'package:shared_preferences/shared_preferences.dart';

import '../models/attendance_record.dart';
import '../utils/formatters.dart';

/// Menyimpan & membaca catatan presensi per pegawai di penyimpanan lokal
/// (shared_preferences). Data disimpan sebagai daftar JSON dengan kunci
/// `attendance.<employeeId>`.
class AttendanceService {
  AttendanceService(this._prefs);

  final SharedPreferences _prefs;

  String _keyFor(String employeeId) => 'attendance.$employeeId';

  List<AttendanceRecord> getRecords(String employeeId) {
    final raw = _prefs.getString(_keyFor(employeeId));
    if (raw == null || raw.isEmpty) return [];
    final list = jsonDecode(raw) as List<dynamic>;
    return list
        .map((e) => AttendanceRecord.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<void> _saveAll(String employeeId, List<AttendanceRecord> records) {
    final raw = jsonEncode(records.map((e) => e.toJson()).toList());
    return _prefs.setString(_keyFor(employeeId), raw);
  }

  AttendanceRecord? getForDate(String employeeId, DateTime date) {
    final target = dateKey(date);
    for (final r in getRecords(employeeId)) {
      if (r.key == target) return r;
    }
    return null;
  }

  AttendanceRecord? getToday(String employeeId) =>
      getForDate(employeeId, DateTime.now());

  /// Catat absen masuk untuk hari ini. Bila sudah absen masuk, dikembalikan
  /// catatan yang ada tanpa perubahan.
  Future<AttendanceRecord> clockIn(String employeeId) async {
    final now = DateTime.now();
    final records = getRecords(employeeId);
    final today = dateKey(now);
    var record = _firstWhereOrNull(records, (r) => r.key == today);

    if (record == null) {
      record = AttendanceRecord(
        employeeId: employeeId,
        date: DateTime(now.year, now.month, now.day),
        clockIn: now,
      );
      records.add(record);
    } else {
      record.clockIn ??= now;
    }
    await _saveAll(employeeId, records);
    return record;
  }

  /// Catat absen pulang untuk hari ini. Bila belum absen masuk, absen masuk
  /// akan diisi otomatis dengan waktu yang sama agar data tetap konsisten.
  Future<AttendanceRecord> clockOut(String employeeId) async {
    final now = DateTime.now();
    final records = getRecords(employeeId);
    final today = dateKey(now);
    var record = _firstWhereOrNull(records, (r) => r.key == today);

    if (record == null) {
      record = AttendanceRecord(
        employeeId: employeeId,
        date: DateTime(now.year, now.month, now.day),
        clockIn: now,
        clockOut: now,
      );
      records.add(record);
    } else {
      record.clockIn ??= now;
      record.clockOut = now;
    }
    await _saveAll(employeeId, records);
    return record;
  }

  static T? _firstWhereOrNull<T>(List<T> list, bool Function(T) test) {
    for (final item in list) {
      if (test(item)) return item;
    }
    return null;
  }
}
