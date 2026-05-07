import { AppShell } from '../../../components/layout/AppShell';

export default function AnimalDetailPage() {
  return (
    <AppShell
      eyebrow="Detalhe do animal"
      title="Página de detalhe"
      description="Área para apresentar fotos, dados do abrigo e botão de candidatura."
      showNavigation={true}
    >
      <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-8 shadow-[var(--shadow)]">
        <p className="text-sm text-[var(--muted)]">Implementar consumo de GET /api/animais/{'{id}'}</p>
      </div>
    </AppShell>
  );
}
