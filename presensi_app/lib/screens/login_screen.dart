import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../providers/auth_provider.dart';
import '../utils/identifier.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _identifierCtrl = TextEditingController();
  final _passwordCtrl = TextEditingController();
  final _identifierFocus = FocusNode();
  final _passwordFocus = FocusNode();

  bool _obscure = true;
  bool _submitting = false;
  IdentifierKind _kind = IdentifierKind.unknown;

  @override
  void initState() {
    super.initState();
    _identifierCtrl.addListener(_onIdentifierChanged);
  }

  @override
  void dispose() {
    _identifierCtrl
      ..removeListener(_onIdentifierChanged)
      ..dispose();
    _passwordCtrl.dispose();
    _identifierFocus.dispose();
    _passwordFocus.dispose();
    super.dispose();
  }

  void _onIdentifierChanged() {
    final kind = guessIdentifierKind(_identifierCtrl.text);
    if (kind != _kind) setState(() => _kind = kind);
    context.read<AuthProvider>().clearError();
  }

  Future<void> _submit() async {
    FocusScope.of(context).unfocus();
    if (!_formKey.currentState!.validate()) return;

    setState(() => _submitting = true);
    final auth = context.read<AuthProvider>();
    final ok = await auth.login(
      _identifierCtrl.text,
      _passwordCtrl.text,
    );
    if (!mounted) return;
    setState(() => _submitting = false);
    // Bila sukses, RootGate otomatis berpindah ke Home.
    if (!ok && auth.errorMessage != null) {
      ScaffoldMessenger.of(context)
        ..hideCurrentSnackBar()
        ..showSnackBar(
          SnackBar(
            content: Text(auth.errorMessage!),
            backgroundColor: Theme.of(context).colorScheme.error,
          ),
        );
    }
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final errorMessage = context.watch<AuthProvider>().errorMessage;

    return Scaffold(
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.fromLTRB(24, 32, 24, 24),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 440),
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    _Header(scheme: scheme),
                    const SizedBox(height: 32),
                    _identifierField(scheme),
                    const SizedBox(height: 16),
                    _passwordField(),
                    if (errorMessage != null) ...[
                      const SizedBox(height: 14),
                      _errorBox(scheme, errorMessage),
                    ],
                    const SizedBox(height: 24),
                    FilledButton(
                      onPressed: _submitting ? null : _submit,
                      child: _submitting
                          ? const SizedBox(
                              width: 22,
                              height: 22,
                              child: CircularProgressIndicator(
                                strokeWidth: 2.4,
                                color: Colors.white,
                              ),
                            )
                          : const Text('Masuk'),
                    ),
                    const SizedBox(height: 20),
                    const _DemoAccounts(),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _identifierField(ColorScheme scheme) {
    final showHint = _kind != IdentifierKind.unknown &&
        _identifierCtrl.text.trim().isNotEmpty;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        TextFormField(
          controller: _identifierCtrl,
          focusNode: _identifierFocus,
          keyboardType: TextInputType.text,
          textInputAction: TextInputAction.next,
          autofillHints: const [AutofillHints.username],
          onFieldSubmitted: (_) => _passwordFocus.requestFocus(),
          decoration: const InputDecoration(
            labelText: 'NIP / NRP / NIK / No. HP',
            hintText: 'Masukkan salah satu identitas',
            prefixIcon: Icon(Icons.badge_outlined),
          ),
          validator: (v) => (v == null || v.trim().isEmpty)
              ? 'Identitas wajib diisi'
              : null,
        ),
        if (showHint)
          Padding(
            padding: const EdgeInsets.only(top: 6, left: 4),
            child: Text(
              'Terdeteksi sebagai ${identifierKindLabel(_kind)}',
              style: TextStyle(
                fontSize: 12,
                color: scheme.primary,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
      ],
    );
  }

  Widget _passwordField() {
    return TextFormField(
      controller: _passwordCtrl,
      focusNode: _passwordFocus,
      obscureText: _obscure,
      textInputAction: TextInputAction.done,
      autofillHints: const [AutofillHints.password],
      onFieldSubmitted: (_) => _submit(),
      decoration: InputDecoration(
        labelText: 'Kata sandi',
        prefixIcon: const Icon(Icons.lock_outline),
        suffixIcon: IconButton(
          icon: Icon(_obscure ? Icons.visibility_off : Icons.visibility),
          tooltip: _obscure ? 'Tampilkan' : 'Sembunyikan',
          onPressed: () => setState(() => _obscure = !_obscure),
        ),
      ),
      validator: (v) =>
          (v == null || v.isEmpty) ? 'Kata sandi wajib diisi' : null,
    );
  }

  Widget _errorBox(ColorScheme scheme, String message) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      decoration: BoxDecoration(
        color: scheme.error.withOpacity(0.08),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: scheme.error.withOpacity(0.4)),
      ),
      child: Row(
        children: [
          Icon(Icons.error_outline, color: scheme.error, size: 20),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              message,
              style: TextStyle(color: scheme.error, fontSize: 13),
            ),
          ),
        ],
      ),
    );
  }
}

class _Header extends StatelessWidget {
  const _Header({required this.scheme});

  final ColorScheme scheme;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Container(
          width: 76,
          height: 76,
          decoration: BoxDecoration(
            color: scheme.primary.withOpacity(0.12),
            shape: BoxShape.circle,
          ),
          child: Icon(Icons.how_to_reg_rounded,
              size: 40, color: scheme.primary),
        ),
        const SizedBox(height: 16),
        Text(
          'Presensi Pegawai',
          style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                fontWeight: FontWeight.w700,
              ),
        ),
        const SizedBox(height: 6),
        Text(
          'Masuk untuk mencatat kehadiran Anda',
          style: TextStyle(color: Colors.grey.shade600),
          textAlign: TextAlign.center,
        ),
      ],
    );
  }
}

/// Panel bantuan berisi akun demo (khusus data contoh).
class _DemoAccounts extends StatelessWidget {
  const _DemoAccounts();

  @override
  Widget build(BuildContext context) {
    const rows = [
      ('NIP', '198501012010011001', 'budi123'),
      ('NRP', '87050123', 'andi123'),
      ('NIK', '3201040404920004', 'rina123'),
      ('No. HP', '081234567002', 'siti123'),
    ];
    return Theme(
      data: Theme.of(context).copyWith(dividerColor: Colors.transparent),
      child: ExpansionTile(
        tilePadding: const EdgeInsets.symmetric(horizontal: 8),
        childrenPadding: const EdgeInsets.fromLTRB(12, 0, 12, 12),
        leading: const Icon(Icons.info_outline),
        title: const Text('Akun demo (data contoh)'),
        children: [
          for (final r in rows)
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 4),
              child: Row(
                children: [
                  SizedBox(
                    width: 56,
                    child: Text(r.$1,
                        style:
                            const TextStyle(fontWeight: FontWeight.w600)),
                  ),
                  Expanded(child: Text(r.$2)),
                  Text('pass: ${r.$3}',
                      style: TextStyle(color: Colors.grey.shade600)),
                ],
              ),
            ),
        ],
      ),
    );
  }
}
