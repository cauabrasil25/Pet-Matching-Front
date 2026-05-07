import { AppShell } from '../../../components/layout/AppShell';

export default function AbrigoAnimaisPage() {
  return (
    <AppShell
      eyebrow="Abrigo"
      title="Meus animais"
      description="Tela para listar os animais cadastrados pelo abrigo."
    >
      <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-8 shadow-[var(--shadow)]">
        <p className="text-sm text-[var(--muted)]">Conectar com GET /api/animais/meus</p>
      </div>
    </AppShell>
  );
}
