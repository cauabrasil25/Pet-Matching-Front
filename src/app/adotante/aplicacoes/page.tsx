import { AppShell } from '../../../components/layout/AppShell';

export default function MinhasAplicacoesPage() {
  return (
    <AppShell
      eyebrow="Adotante"
      title="Minhas aplicações"
      description="Tela para listar candidaturas e seus status."
    >
      <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-8 shadow-[var(--shadow)]">
        <p className="text-sm text-[var(--muted)]">Conectar com GET /api/aplicacoes-adocao/minhas</p>
      </div>
    </AppShell>
  );
}
