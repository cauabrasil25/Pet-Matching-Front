import { AppShell } from '../../../components/layout/AppShell';
import { DashboardCard } from '../../../components/dashboard/DashboardCard';

export default function AdotanteDashboardPage() {
  return (
    <AppShell
      eyebrow="Adotante"
      title="Painel do adotante"
      description="Questionário, candidaturas e acompanhamento de status."
      primaryAction={{ label: 'Preencher questionário', href: '/adotante/questionario' }}
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <DashboardCard title="Questionário" description="Base do matching entre perfil e animal." />
        <DashboardCard title="Minhas aplicações" description="Histórico e status das candidaturas." />
        <DashboardCard title="Sugestões" description="Lista de animais recomendados pela lógica de match." />
      </div>
    </AppShell>
  );
}
