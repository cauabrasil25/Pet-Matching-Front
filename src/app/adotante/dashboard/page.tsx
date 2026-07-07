import { AppShell } from '../../../components/layout/AppShell';

export default function AlunoDashboardPage() {
  return (
    <AppShell
      eyebrow="Aluno"
      title="Dashboard do aluno"
      description="Complete seu questionario, explore projetos compativeis e acompanhe candidaturas."
      primaryAction={{ label: 'Explorar projetos', href: '/animais' }}
      secondaryAction={{ label: 'Questionario', href: '/adotante/questionario' }}
    >
      <section className="grid gap-4 md:grid-cols-3">
        <Card title="Questionario" text="Atualize areas de interesse, habilidades e disponibilidade." href="/adotante/questionario" />
        <Card title="Projetos" text="Veja oportunidades abertas e recomendacoes por compatibilidade." href="/animais" />
        <Card title="Candidaturas" text="Acompanhe respostas de professores aos seus envios." href="/adotante/aplicacoes" />
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
