import { AppShell } from '../../../components/layout/AppShell';

export default function ProfessorDashboardPage() {
  return (
    <AppShell
      eyebrow="Professor"
      title="Dashboard do professor"
      description="Gerencie projetos de pesquisa e analise candidaturas recebidas."
      primaryAction={{ label: 'Novo projeto', href: '/abrigo/animais/novo' }}
      secondaryAction={{ label: 'Candidaturas', href: '/abrigo/aplicacoes' }}
    >
      <section className="grid gap-4 md:grid-cols-3">
        <Card title="Meus projetos" text="Consulte e atualize oportunidades publicadas." href="/abrigo/animais" />
        <Card title="Novo projeto" text="Cadastre area, habilidades, carga horaria e vagas." href="/abrigo/animais/novo" />
        <Card title="Candidaturas" text="Aprove ou recuse alunos candidatos aos seus projetos." href="/abrigo/aplicacoes" />
      </section>
    </AppShell>
  );
}

function Card({ title, text, href }: { title: string; text: string; href: string }) {
  return (
    <a className="rounded-[28px] border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-soft)] transition hover:-translate-y-1" href={href}>
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{text}</p>
    </a>
  );
}
