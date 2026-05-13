import Link from 'next/link';
import { AppShell } from '../../../components/layout/AppShell';
import { adopterApplications, animals, formatMatchStatus } from '../../../lib/petFixtures';

export default function MinhasAplicacoesPage() {
  return (
    <AppShell
      eyebrow="Adotante"
      title="Minhas aplicacoes"
      description="Historico de candidaturas migrado para uma pagina real no Next."
      secondaryAction={{ label: 'Questionario', href: '/adotante/questionario' }}
    >
      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Total</p>
          <p className="mt-3 text-3xl font-semibold text-[var(--text)]">{adopterApplications.length}</p>
        </article>
        <article className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Aprovadas</p>
          <p className="mt-3 text-3xl font-semibold text-[var(--text)]">{adopterApplications.filter((application) => application.status === 'approved').length}</p>
        </article>
        <article className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Pendentes</p>
          <p className="mt-3 text-3xl font-semibold text-[var(--text)]">{adopterApplications.filter((application) => application.status === 'pending').length}</p>
        </article>
      </section>

      <div className="mt-6 space-y-4 rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]">
        {adopterApplications.map((application) => {
          const animal = animals.find((item) => item.id === application.animalId);

          return (
            <article key={application.id} className="rounded-2xl border border-[var(--border)] bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-[var(--text)]">{animal?.name}</h2>
                  <p className="mt-1 text-sm text-[var(--muted)]">{application.shelter}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${application.status === 'approved' ? 'bg-[rgba(22,163,74,0.12)] text-green-700' : application.status === 'pending' ? 'bg-[rgba(217,119,6,0.12)] text-amber-700' : 'bg-[rgba(220,38,38,0.12)] text-red-700'}`}>
                  {formatMatchStatus(application.status)}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{application.message}</p>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                <span className="text-[var(--muted)]">Compatibilidade: {application.score}%</span>
                <Link href={`/animais/${application.animalId}`} className="font-semibold text-[var(--primary-strong)]">
                  Ver animal
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </AppShell>
  );
}
