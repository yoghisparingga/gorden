import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:presensi_app/data/sample_employees.dart';
import 'package:presensi_app/providers/auth_provider.dart';
import 'package:presensi_app/screens/login_screen.dart';
import 'package:presensi_app/services/auth_service.dart';
import 'package:presensi_app/services/session_store.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  testWidgets('Layar login menampilkan field & tombol Masuk', (tester) async {
    SharedPreferences.setMockInitialValues({});
    final prefs = await SharedPreferences.getInstance();
    final auth = AuthProvider(AuthService(sampleEmployees), SessionStore(prefs));

    await tester.pumpWidget(
      ChangeNotifierProvider.value(
        value: auth,
        child: const MaterialApp(home: LoginScreen()),
      ),
    );

    expect(find.text('NIP / NRP / NIK / No. HP'), findsOneWidget);
    expect(find.text('Kata sandi'), findsOneWidget);
    expect(find.byType(FilledButton), findsWidgets);
    expect(find.text('Masuk'), findsOneWidget);
  });

  testWidgets('Validasi menolak form kosong', (tester) async {
    SharedPreferences.setMockInitialValues({});
    final prefs = await SharedPreferences.getInstance();
    final auth = AuthProvider(AuthService(sampleEmployees), SessionStore(prefs));

    await tester.pumpWidget(
      ChangeNotifierProvider.value(
        value: auth,
        child: const MaterialApp(home: LoginScreen()),
      ),
    );

    await tester.tap(find.text('Masuk'));
    await tester.pump();

    expect(find.text('Identitas wajib diisi'), findsOneWidget);
    expect(find.text('Kata sandi wajib diisi'), findsOneWidget);
  });
}
