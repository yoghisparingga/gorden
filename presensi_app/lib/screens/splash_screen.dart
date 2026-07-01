import 'package:flutter/material.dart';

/// Ditampilkan sesaat saat aplikasi memulihkan sesi login.
class SplashScreen extends StatelessWidget {
  const SplashScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Scaffold(
      backgroundColor: scheme.primary,
      body: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.how_to_reg_rounded,
                size: 72, color: scheme.onPrimary),
            const SizedBox(height: 16),
            Text(
              'Presensi Pegawai',
              style: TextStyle(
                color: scheme.onPrimary,
                fontSize: 22,
                fontWeight: FontWeight.w700,
              ),
            ),
            const SizedBox(height: 28),
            SizedBox(
              width: 26,
              height: 26,
              child: CircularProgressIndicator(
                strokeWidth: 2.6,
                valueColor: AlwaysStoppedAnimation(scheme.onPrimary),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
