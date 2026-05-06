import { AppShell } from '@/components/layout/AppShell';
import { SectionTitle } from '@/components/ui/SectionTitle';

const highlights = [
  'Busca pública de animais com filtros',
  'Fluxo autenticado para adotante e abrigo',
  'JWT + API REST separada do backend'
];

export default function HomePage() {
  return (
    <AppShell
      eyebrow="Pet Matching"
      title="Uma interface web para adoção, gestão de animais e aplicações"
      description="Front-end independente para consumir a API Spring Boot já existente."
      primaryAction={{ label: 'Explorar animais', href: '/animais' }}
      secondaryAction={{ label: 'Entrar', href: '/login' }}
    >
      <section className="grid gap-4 md:grid-cols-3">
        {highlights.map((item) => (
          <article key={item} className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow)]">
            <p className="text-sm font-medium text-[var(--muted)]">Estrutura</p>
            <p className="mt-2 text-base font-semibold text-[var(--text)]">{item}</p>
          </article>
        ))}
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <article className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-8 shadow-[var(--shadow)]">
          <SectionTitle title="Fluxo sugerido" subtitle="Separado por perfil e por domínio da API." />
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-[var(--surface-2)] p-5">
              <p className="text-sm font-semibold text-[var(--primary-strong)]">Público</p>
              <p className="mt-2 text-sm text-[var(--muted)]">Home, listagem de animais e detalhe do pet.</p>
            </div>
            <div className="rounded-2xl bg-[var(--surface-2)] p-5">
              <p className="text-sm font-semibold text-[var(--primary-strong)]">Adotante</p>
              <p className="mt-2 text-sm text-[var(--muted)]">Login, questionário e aplicações enviadas.</p>
            </div>
            <div className="rounded-2xl bg-[var(--surface-2)] p-5">
              <p className="text-sm font-semibold text-[var(--primary-strong)]">Abrigo</p>
              <p className="mt-2 text-sm text-[var(--muted)]">Cadastro de animais, edição e análise de aplicações.</p>
            </div>
            <div className="rounded-2xl bg-[var(--surface-2)] p-5">
              <p className="text-sm font-semibold text-[var(--primary-strong)]">Integração</p>
              <p className="mt-2 text-sm text-[var(--muted)]">Cliente tipado, token JWT e URL via env.</p>
            </div>
          </div>
        </article>

        <aside className="rounded-[28px] border border-[var(--border)] bg-[var(--primary)] p-8 text-white shadow-[var(--shadow)]">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/75">Backend</p>
          <p className="mt-4 text-2xl font-semibold">Spring Boot + JWT + OpenAPI</p>
          <p className="mt-4 text-sm leading-6 text-white/85">
            O front já nasce preparado para consumir os endpoints de autenticação, animais, aplicações e questionário.
          </p>
        </aside>
      </section>
    </AppShell>
  );
}
