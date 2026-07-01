/// Helper untuk mengenali & menormalkan identitas login
/// (NIP / NRP / NIK / No. HP).
library;

enum IdentifierKind { nip, nrp, nik, phone, unknown }

/// Menyeragamkan format nomor HP agar mudah dibandingkan.
///
/// Contoh: `+62 812-3456-7001`, `62812...`, `0812...` -> `0812...`
String normalizePhone(String input) {
  var s = input.replaceAll(RegExp(r'[\s\-().]'), '');
  if (s.startsWith('+62')) {
    s = '0${s.substring(3)}';
  } else if (s.startsWith('62') && !s.startsWith('0')) {
    s = '0${s.substring(2)}';
  }
  return s;
}

bool _isDigitsOnly(String s) => RegExp(r'^\d+$').hasMatch(s);

/// Menebak jenis identitas dari teks yang diketik pengguna.
///
/// Bersifat heuristik dan hanya dipakai untuk membantu tampilan (hint),
/// bukan untuk validasi login. Login tetap dicocokkan ke semua field.
IdentifierKind guessIdentifierKind(String input) {
  final s = input.trim();
  if (s.isEmpty) return IdentifierKind.unknown;

  final phone = normalizePhone(s);
  final looksLikePhone = (s.startsWith('0') ||
          s.startsWith('+62') ||
          s.startsWith('62')) &&
      RegExp(r'^0\d{8,13}$').hasMatch(phone);
  if (looksLikePhone) return IdentifierKind.phone;

  if (_isDigitsOnly(s)) {
    if (s.length == 16) return IdentifierKind.nik; // NIK = 16 digit
    if (s.length == 18) return IdentifierKind.nip; // NIP = 18 digit
  }
  return IdentifierKind.unknown;
}

String identifierKindLabel(IdentifierKind kind) {
  switch (kind) {
    case IdentifierKind.nip:
      return 'NIP';
    case IdentifierKind.nrp:
      return 'NRP';
    case IdentifierKind.nik:
      return 'NIK';
    case IdentifierKind.phone:
      return 'No. HP';
    case IdentifierKind.unknown:
      return 'Identitas';
  }
}
