import 'package:flutter/foundation.dart';

import '../models/employee.dart';
import '../services/auth_service.dart';
import '../services/session_store.dart';

enum AuthStatus { unknown, authenticated, unauthenticated }

/// Menyimpan status login aplikasi & pegawai yang sedang masuk.
class AuthProvider extends ChangeNotifier {
  AuthProvider(this._authService, this._session);

  final AuthService _authService;
  final SessionStore _session;

  AuthStatus _status = AuthStatus.unknown;
  Employee? _employee;
  String? _errorMessage;

  AuthStatus get status => _status;
  Employee? get employee => _employee;
  String? get errorMessage => _errorMessage;
  bool get isLoggedIn => _employee != null;

  /// Dipanggil saat aplikasi dibuka: memulihkan sesi bila ada.
  Future<void> tryAutoLogin() async {
    final id = _session.getEmployeeId();
    if (id != null) {
      final emp = _authService.findById(id);
      if (emp != null && emp.active) {
        _employee = emp;
        _status = AuthStatus.authenticated;
        notifyListeners();
        return;
      }
      // Sesi tidak valid lagi -> bersihkan.
      await _session.clear();
    }
    _status = AuthStatus.unauthenticated;
    notifyListeners();
  }

  /// Mencoba login. Mengembalikan true bila berhasil.
  Future<bool> login(String identifier, String password) async {
    _errorMessage = null;
    // Simulasikan sedikit jeda seperti panggilan jaringan.
    await Future<void>.delayed(const Duration(milliseconds: 350));

    final result = _authService.authenticate(identifier, password);
    if (result.isSuccess) {
      _employee = result.employee;
      await _session.saveEmployeeId(result.employee!.id);
      _status = AuthStatus.authenticated;
      notifyListeners();
      return true;
    }
    _errorMessage = result.error;
    notifyListeners();
    return false;
  }

  Future<void> logout() async {
    await _session.clear();
    _employee = null;
    _errorMessage = null;
    _status = AuthStatus.unauthenticated;
    notifyListeners();
  }

  void clearError() {
    if (_errorMessage != null) {
      _errorMessage = null;
      notifyListeners();
    }
  }
}
