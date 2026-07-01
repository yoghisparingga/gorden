import 'package:flutter/material.dart';
import 'package:intl/date_symbol_data_local.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'app.dart';
import 'data/sample_employees.dart';
import 'providers/attendance_provider.dart';
import 'providers/auth_provider.dart';
import 'services/attendance_service.dart';
import 'services/auth_service.dart';
import 'services/session_store.dart';
import 'utils/formatters.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Data locale Indonesia untuk format tanggal (nama hari/bulan).
  await initializeDateFormatting(kLocaleId, null);

  final prefs = await SharedPreferences.getInstance();

  // Sumber data pegawai saat ini: data contoh lokal.
  // Untuk beralih ke API, ganti `AuthService(sampleEmployees)`.
  final authService = AuthService(sampleEmployees);
  final sessionStore = SessionStore(prefs);
  final attendanceService = AttendanceService(prefs);

  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(
          create: (_) => AuthProvider(authService, sessionStore),
        ),
        ChangeNotifierProvider(
          create: (_) => AttendanceProvider(attendanceService),
        ),
      ],
      child: const PresensiApp(),
    ),
  );
}
