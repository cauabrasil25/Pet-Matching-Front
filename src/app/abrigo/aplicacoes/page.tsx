import { AppShell } from '@/components/layout/AppShell';

export default function AplicacoesRecebidasPage() {
  return (
    <AppShell
      eyebrow="Abrigo"
      title="Aplicações recebidas"
      description="Ações para aprovar ou recusar candidaturas."
    >
      <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-8 shadow-[var(--shadow)]">
        <p className="text-sm text-[var(--muted)]">Conectar com GET /api/aplicacoes-adocao/recebidas</p>
      </div>
    </AppShell>
  );
}
