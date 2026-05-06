import { AppShell } from '@/components/layout/AppShell';
import { DashboardCard } from '@/components/dashboard/DashboardCard';

export default function AbrigoDashboardPage() {
  return (
    <AppShell
      eyebrow="Abrigo"
      title="Painel do abrigo"
      description="Gestão de animais, status e aplicações recebidas."
      primaryAction={{ label: 'Cadastrar animal', href: '/abrigo/animais/novo' }}
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <DashboardCard title="Meus animais" description="Listagem e edição dos pets do abrigo autenticado." />
        <DashboardCard title="Aplicações recebidas" description="Aceitar ou recusar candidaturas." />
        <DashboardCard title="Status" description="Atualização rápida de disponibilidade e adoção." />
      </div>
    </AppShell>
  );
}
