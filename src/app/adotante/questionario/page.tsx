import { AppShell } from '@/components/layout/AppShell';

export default function QuestionarioPage() {
  return (
    <AppShell
      eyebrow="Questionário"
      title="Questionário de perfil"
      description="Tela para integrar com GET/POST/PUT/DELETE /api/questionario-perfil."
    >
      <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-8 shadow-[var(--shadow)]">
        <p className="text-sm text-[var(--muted)]">Aqui entram preferências, rotina, ambiente e outras respostas do adotante.</p>
      </div>
    </AppShell>
  );
}
