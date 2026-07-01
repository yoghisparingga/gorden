import 'package:flutter/foundation.dart';

import '../models/attendance_record.dart';
import '../services/attendance_service.dart';
import '../utils/formatters.dart';

/// State presensi untuk pegawai yang sedang login.
class AttendanceProvider extends ChangeNotifier {
  AttendanceProvider(this._service);

  final AttendanceService _service;

  String? _employeeId;
  List<AttendanceRecord> _records = [];
  bool _busy = false;

  List<AttendanceRecord> get records => List.unmodifiable(_records);
  bool get busy => _busy;

  /// Catatan presensi hari ini (null bila belum ada).
  AttendanceRecord? get today {
    if (_employeeId == null) return null;
    final key = dateKey(DateTime.now());
    return _firstWhereOrNull(_records, (r) => r.key == key);
  }

  bool get sudahMasuk => today?.sudahMasuk ?? false;
  bool get sudahPulang => today?.sudahPulang ?? false;

  /// Kaitkan provider ke pegawai tertentu & muat datanya.
  void bind(String employeeId) {
    if (_employeeId == employeeId) return;
    _employeeId = employeeId;
    refresh();
  }

  void refresh() {
    if (_employeeId == null) return;
    _records = _service.getRecords(_employeeId!)
      ..sort((a, b) => b.date.compareTo(a.date));
    notifyListeners();
  }

  Future<void> absenMasuk() async {
    if (_employeeId == null || _busy) return;
    _busy = true;
    notifyListeners();
    await _service.clockIn(_employeeId!);
    _busy = false;
    refresh();
  }

  Future<void> absenPulang() async {
    if (_employeeId == null || _busy) return;
    _busy = true;
    notifyListeners();
    await _service.clockOut(_employeeId!);
    _busy = false;
    refresh();
  }

  void clear() {
    _employeeId = null;
    _records = [];
    notifyListeners();
  }

  static T? _firstWhereOrNull<T>(List<T> list, bool Function(T) test) {
    for (final item in list) {
      if (test(item)) return item;
    }
    return null;
  }
}
