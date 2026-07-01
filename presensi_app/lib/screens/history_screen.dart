import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../models/attendance_record.dart';
import '../providers/attendance_provider.dart';
import '../utils/formatters.dart';
import '../widgets/section_card.dart';

class HistoryScreen extends StatelessWidget {
  const HistoryScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final records = context.watch<AttendanceProvider>().records;

    return Scaffold(
      appBar: AppBar(title: const Text('Riwayat Presensi')),
      body: records.isEmpty
          ? Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(Icons.event_busy,
                      size: 56, color: Colors.grey.shade400),
                  const SizedBox(height: 12),
                  Text('Belum ada riwayat presensi.',
                      style: TextStyle(color: Colors.grey.shade600)),
                ],
              ),
            )
          : ListView.separated(
              padding: const EdgeInsets.all(16),
              itemCount: records.length,
              separatorBuilder: (_, __) => const SizedBox(height: 12),
              itemBuilder: (_, i) => _RecordCard(record: records[i]),
            ),
    );
  }
}

class _RecordCard extends StatelessWidget {
  const _RecordCard({required this.record});

  final AttendanceRecord record;

  @override
  Widget build(BuildContext context) {
    return SectionCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            formatTanggalPanjang(record.date),
            style: const TextStyle(fontWeight: FontWeight.w700),
          ),
          const SizedBox(height: 10),
          Row(
            children: [
              _cell(context, 'Masuk',
                  record.clockIn == null ? '--:--' : formatJam(record.clockIn!),
                  Colors.green.shade700),
              _cell(context, 'Pulang',
                  record.clockOut == null
                      ? '--:--'
                      : formatJam(record.clockOut!),
                  Colors.orange.shade800),
              _cell(
                context,
                'Durasi',
                record.durasiKerja == null
                    ? '-'
                    : formatDurasi(record.durasiKerja!),
                Colors.blue.shade700,
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _cell(BuildContext context, String label, String value, Color color) {
    return Expanded(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label,
              style: TextStyle(fontSize: 12, color: Colors.grey.shade600)),
          const SizedBox(height: 2),
          Text(value,
              style: TextStyle(fontWeight: FontWeight.w700, color: color)),
        ],
      ),
    );
  }
}
