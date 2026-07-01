import 'package:intl/intl.dart';

/// Locale Indonesia; diinisialisasi di `main()` lewat
/// `initializeDateFormatting('id_ID')`.
const String kLocaleId = 'id_ID';

/// Contoh: "Selasa, 1 Juli 2026"
String formatTanggalPanjang(DateTime date) =>
    DateFormat('EEEE, d MMMM yyyy', kLocaleId).format(date);

/// Contoh: "1 Jul 2026"
String formatTanggalPendek(DateTime date) =>
    DateFormat('d MMM yyyy', kLocaleId).format(date);

/// Contoh: "07:15"
String formatJam(DateTime time) => DateFormat('HH:mm', kLocaleId).format(time);

/// Contoh: "07:15:03"
String formatJamDetik(DateTime time) =>
    DateFormat('HH:mm:ss', kLocaleId).format(time);

/// Kunci tanggal (tanpa jam) untuk pengelompokan, mis. "2026-07-01".
String dateKey(DateTime date) => DateFormat('yyyy-MM-dd').format(date);

/// Contoh: "8 jam 12 menit"
String formatDurasi(Duration d) {
  final jam = d.inHours;
  final menit = d.inMinutes.remainder(60);
  if (jam <= 0) return '$menit menit';
  return '$jam jam $menit menit';
}

/// Sapaan berdasarkan jam saat ini.
String sapaanWaktu(DateTime now) {
  final h = now.hour;
  if (h < 11) return 'Selamat pagi';
  if (h < 15) return 'Selamat siang';
  if (h < 19) return 'Selamat sore';
  return 'Selamat malam';
}
