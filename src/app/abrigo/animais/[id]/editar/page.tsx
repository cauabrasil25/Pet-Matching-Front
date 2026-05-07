import { AppShell } from '../../../../../components/layout/AppShell';

export default function EditarAnimalPage() {
  return (
    <AppShell
      eyebrow="Abrigo"
      title="Editar animal"
      description="Formulário para PUT /api/animais/{id} e PATCH /api/animais/{id}/status."
    >
      <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-8 shadow-[var(--shadow)]">
        <p className="text-sm text-[var(--muted)]">Página de edição do animal selecionado.</p>
      </div>
    </AppShell>
  );
}
