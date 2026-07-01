import '../utils/formatters.dart';

/// Satu catatan presensi untuk satu hari (satu pegawai).
class AttendanceRecord {
  AttendanceRecord({
    required this.employeeId,
    required this.date,
    this.clockIn,
    this.clockOut,
  });

  final String employeeId;

  /// Tanggal presensi (komponen jam diabaikan; disimpan sebagai tengah malam).
  final DateTime date;

  /// Waktu absen masuk & pulang (null bila belum dilakukan).
  DateTime? clockIn;
  DateTime? clockOut;

  String get key => dateKey(date);

  bool get sudahMasuk => clockIn != null;
  bool get sudahPulang => clockOut != null;

  /// Lama bekerja bila sudah absen masuk & pulang.
  Duration? get durasiKerja {
    if (clockIn == null || clockOut == null) return null;
    return clockOut!.difference(clockIn!);
  }

  factory AttendanceRecord.fromJson(Map<String, dynamic> json) =>
      AttendanceRecord(
        employeeId: json['employeeId'] as String,
        date: DateTime.parse(json['date'] as String),
        clockIn: json['clockIn'] == null
            ? null
            : DateTime.parse(json['clockIn'] as String),
        clockOut: json['clockOut'] == null
            ? null
            : DateTime.parse(json['clockOut'] as String),
      );

  Map<String, dynamic> toJson() => {
        'employeeId': employeeId,
        'date': date.toIso8601String(),
        'clockIn': clockIn?.toIso8601String(),
        'clockOut': clockOut?.toIso8601String(),
      };
}
