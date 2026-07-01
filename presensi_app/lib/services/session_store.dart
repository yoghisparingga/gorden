import 'package:shared_preferences/shared_preferences.dart';

/// Menyimpan sesi login (id pegawai yang sedang masuk) secara persisten,
/// sehingga pengguna tetap login setelah aplikasi ditutup.
class SessionStore {
  SessionStore(this._prefs);

  final SharedPreferences _prefs;
  static const String _kEmployeeId = 'session.employeeId';

  String? getEmployeeId() => _prefs.getString(_kEmployeeId);

  Future<void> saveEmployeeId(String id) =>
      _prefs.setString(_kEmployeeId, id);

  Future<void> clear() => _prefs.remove(_kEmployeeId);
}
