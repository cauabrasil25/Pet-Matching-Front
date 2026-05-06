import { AppShell } from '@/components/layout/AppShell';

export default function NovoAnimalPage() {
  return (
    <AppShell
      eyebrow="Abrigo"
      title="Cadastrar animal"
      description="Formulário para a rota POST /api/animais."
    >
      <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-8 shadow-[var(--shadow)]">
        <p className="text-sm text-[var(--muted)]">Aqui entra o formulário de criação do animal.</p>
      </div>
    </AppShell>
  );
}
