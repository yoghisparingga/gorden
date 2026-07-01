import 'dart:async';

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../models/attendance_record.dart';
import '../models/employee.dart';
import '../providers/attendance_provider.dart';
import '../providers/auth_provider.dart';
import '../utils/formatters.dart';
import '../widgets/section_card.dart';
import '../widgets/status_badge.dart';
import 'history_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  Timer? _clock;
  DateTime _now = DateTime.now();

  @override
  void initState() {
    super.initState();
    _clock = Timer.periodic(const Duration(seconds: 1), (_) {
      if (mounted) setState(() => _now = DateTime.now());
    });
    // Kaitkan data presensi ke pegawai yang login (setelah frame pertama).
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final emp = context.read<AuthProvider>().employee;
      if (emp != null) context.read<AttendanceProvider>().bind(emp.id);
    });
  }

  @override
  void dispose() {
    _clock?.cancel();
    super.dispose();
  }

  Future<void> _confirmLogout() async {
    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Keluar'),
        content: const Text('Yakin ingin keluar dari akun ini?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: const Text('Batal'),
          ),
          FilledButton(
            onPressed: () => Navigator.pop(ctx, true),
            child: const Text('Keluar'),
          ),
        ],
      ),
    );
    if (ok == true && mounted) {
      context.read<AttendanceProvider>().clear();
      await context.read<AuthProvider>().logout();
    }
  }

  @override
  Widget build(BuildContext context) {
    final emp = context.watch<AuthProvider>().employee;
    if (emp == null) return const SizedBox.shrink();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Presensi'),
        actions: [
          IconButton(
            icon: const Icon(Icons.history),
            tooltip: 'Riwayat',
            onPressed: () => Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const HistoryScreen()),
            ),
          ),
          IconButton(
            icon: const Icon(Icons.logout),
            tooltip: 'Keluar',
            onPressed: _confirmLogout,
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () async =>
            context.read<AttendanceProvider>().refresh(),
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            _ProfileCard(employee: emp, now: _now),
            const SizedBox(height: 16),
            _ClockCard(now: _now),
            const SizedBox(height: 16),
            const _AttendanceActions(),
            const SizedBox(height: 16),
            const _TodaySummary(),
            const SizedBox(height: 16),
            const _RecentHistory(),
          ],
        ),
      ),
    );
  }
}

class _ProfileCard extends StatelessWidget {
  const _ProfileCard({required this.employee, required this.now});

  final Employee employee;
  final DateTime now;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return SectionCard(
      child: Row(
        children: [
          CircleAvatar(
            radius: 28,
            backgroundColor: scheme.primary.withOpacity(0.12),
            child: Text(
              employee.initials,
              style: TextStyle(
                color: scheme.primary,
                fontWeight: FontWeight.w700,
                fontSize: 18,
              ),
            ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(sapaanWaktu(now),
                    style: TextStyle(color: Colors.grey.shade600)),
                const SizedBox(height: 2),
                Text(
                  employee.name,
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  '${employee.position} • ${employee.department}',
                  style: TextStyle(color: Colors.grey.shade700, fontSize: 13),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _ClockCard extends StatelessWidget {
  const _ClockCard({required this.now});

  final DateTime now;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return SectionCard(
      padding: const EdgeInsets.symmetric(vertical: 22, horizontal: 16),
      child: Column(
        children: [
          Text(
            formatJamDetik(now),
            style: TextStyle(
              fontSize: 44,
              fontWeight: FontWeight.w800,
              letterSpacing: 1.5,
              color: scheme.primary,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            formatTanggalPanjang(now),
            style: TextStyle(color: Colors.grey.shade700),
          ),
        ],
      ),
    );
  }
}

class _AttendanceActions extends StatelessWidget {
  const _AttendanceActions();

  Future<void> _handle(
    BuildContext context, {
    required bool masuk,
  }) async {
    final provider = context.read<AttendanceProvider>();
    if (masuk) {
      await provider.absenMasuk();
    } else {
      await provider.absenPulang();
    }
    if (!context.mounted) return;
    final t = masuk ? provider.today?.clockIn : provider.today?.clockOut;
    ScaffoldMessenger.of(context)
      ..hideCurrentSnackBar()
      ..showSnackBar(
        SnackBar(
          content: Text(
            masuk
                ? 'Absen masuk tercatat pukul ${t == null ? '-' : formatJam(t)}'
                : 'Absen pulang tercatat pukul ${t == null ? '-' : formatJam(t)}',
          ),
          backgroundColor: Colors.green.shade700,
        ),
      );
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<AttendanceProvider>();
    final sudahMasuk = provider.sudahMasuk;
    final sudahPulang = provider.sudahPulang;
    final busy = provider.busy;

    return Row(
      children: [
        Expanded(
          child: FilledButton.icon(
            onPressed: (sudahMasuk || busy)
                ? null
                : () => _handle(context, masuk: true),
            icon: const Icon(Icons.login),
            label: const Text('Absen Masuk'),
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: FilledButton.icon(
            style: FilledButton.styleFrom(
              backgroundColor: Colors.orange.shade800,
            ),
            onPressed: (!sudahMasuk || sudahPulang || busy)
                ? null
                : () => _handle(context, masuk: false),
            icon: const Icon(Icons.logout),
            label: const Text('Absen Pulang'),
          ),
        ),
      ],
    );
  }
}

class _TodaySummary extends StatelessWidget {
  const _TodaySummary();

  @override
  Widget build(BuildContext context) {
    final today = context.watch<AttendanceProvider>().today;

    late final Widget badge;
    if (today == null || !today.sudahMasuk) {
      badge = const StatusBadge(
        label: 'Belum Absen',
        color: Colors.grey,
        icon: Icons.schedule,
      );
    } else if (!today.sudahPulang) {
      badge = StatusBadge(
        label: 'Sudah Masuk',
        color: Colors.green.shade700,
        icon: Icons.check_circle_outline,
      );
    } else {
      badge = StatusBadge(
        label: 'Selesai',
        color: Colors.blue.shade700,
        icon: Icons.task_alt,
      );
    }

    return SectionCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text('Status Hari Ini',
                  style: TextStyle(fontWeight: FontWeight.w700, fontSize: 15)),
              badge,
            ],
          ),
          const SizedBox(height: 14),
          Row(
            children: [
              _TimePill(
                label: 'Masuk',
                time: today?.clockIn,
                color: Colors.green.shade700,
                icon: Icons.login,
              ),
              const SizedBox(width: 12),
              _TimePill(
                label: 'Pulang',
                time: today?.clockOut,
                color: Colors.orange.shade800,
                icon: Icons.logout,
              ),
            ],
          ),
          if (today?.durasiKerja != null) ...[
            const SizedBox(height: 12),
            Row(
              children: [
                Icon(Icons.timelapse,
                    size: 18, color: Colors.grey.shade700),
                const SizedBox(width: 6),
                Text('Durasi kerja: ${formatDurasi(today!.durasiKerja!)}',
                    style: TextStyle(color: Colors.grey.shade800)),
              ],
            ),
          ],
        ],
      ),
    );
  }
}

class _TimePill extends StatelessWidget {
  const _TimePill({
    required this.label,
    required this.time,
    required this.color,
    required this.icon,
  });

  final String label;
  final DateTime? time;
  final Color color;
  final IconData icon;

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 12),
        decoration: BoxDecoration(
          color: color.withOpacity(0.08),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(icon, size: 16, color: color),
                const SizedBox(width: 6),
                Text(label,
                    style: TextStyle(color: color, fontSize: 13)),
              ],
            ),
            const SizedBox(height: 6),
            Text(
              time == null ? '--:--' : formatJam(time!),
              style: const TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.w700,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _RecentHistory extends StatelessWidget {
  const _RecentHistory();

  @override
  Widget build(BuildContext context) {
    final records = context.watch<AttendanceProvider>().records;
    final recent = records.take(3).toList();

    return SectionCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text('Riwayat Terakhir',
                  style: TextStyle(fontWeight: FontWeight.w700, fontSize: 15)),
              TextButton(
                onPressed: () => Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const HistoryScreen()),
                ),
                child: const Text('Lihat semua'),
              ),
            ],
          ),
          if (recent.isEmpty)
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 8),
              child: Text('Belum ada riwayat presensi.',
                  style: TextStyle(color: Colors.grey.shade600)),
            )
          else
            for (final r in recent) _HistoryRow(record: r),
        ],
      ),
    );
  }
}

class _HistoryRow extends StatelessWidget {
  const _HistoryRow({required this.record});

  final AttendanceRecord record;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        children: [
          const Icon(Icons.calendar_today_outlined, size: 18),
          const SizedBox(width: 10),
          Expanded(child: Text(formatTanggalPendek(record.date))),
          Text(
            '${record.clockIn == null ? '--:--' : formatJam(record.clockIn!)}'
            '  →  '
            '${record.clockOut == null ? '--:--' : formatJam(record.clockOut!)}',
            style: const TextStyle(fontWeight: FontWeight.w600),
          ),
        ],
      ),
    );
  }
}
