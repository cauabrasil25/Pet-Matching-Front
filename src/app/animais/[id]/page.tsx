import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AppShell } from '../../../components/layout/AppShell';
import { getAnimalById, formatSize, formatSpecies, formatStatus } from '../../../lib/petFixtures';

type AnimalDetailPageProps = {
  params: {
    id: string;
  };
};

export default function AnimalDetailPage({ params }: AnimalDetailPageProps) {
  const animal = getAnimalById(params.id);

  if (!animal) {
    notFound();
  }

  return (
    <AppShell
      eyebrow="Detalhe do animal"
      title={animal.name}
      description="Pagina de detalhe adaptada para a rota dinamica do Next."
      secondaryAction={{ label: 'Voltar ao catalogo', href: '/animais' }}
    >
      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <article className="overflow-hidden rounded-[28px] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)]">
          <div className="aspect-[4/3] bg-[var(--surface-2)]">
            <img src={animal.imageUrl} alt={animal.name} className="h-full w-full object-cover" />
          </div>

          <div className="space-y-5 p-6">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
              <span>{formatStatus(animal.status)}</span>
              <span>•</span>
              <span>{formatSpecies(animal.species)}</span>
              <span>•</span>
              <span>{formatSize(animal.size)}</span>
            </div>

            <p className="text-sm leading-6 text-[var(--muted)]">{animal.description}</p>

            <div className="flex flex-wrap gap-2">
              {animal.temperament.map((item) => (
                <span key={item} className="rounded-full border border-[var(--border)] bg-white px-3 py-1 text-xs font-medium text-[var(--muted)]">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </article>

        <aside className="space-y-6">
          <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]">
            <h2 className="text-xl font-semibold text-[var(--text)]">Informacoes principais</h2>
            <dl className="mt-5 grid gap-4 text-sm">
              <div className="flex items-center justify-between gap-3 border-b border-dashed border-[var(--border)] pb-3">
                <dt className="text-[var(--muted)]">Raca</dt>
                <dd className="font-medium text-[var(--text)]">{animal.breed}</dd>
              </div>
              <div className="flex items-center justify-between gap-3 border-b border-dashed border-[var(--border)] pb-3">
                <dt className="text-[var(--muted)]">Idade</dt>
                <dd className="font-medium text-[var(--text)]">{animal.age} anos</dd>
              </div>
              <div className="flex items-center justify-between gap-3 border-b border-dashed border-[var(--border)] pb-3">
                <dt className="text-[var(--muted)]">Abrigo</dt>
                <dd className="font-medium text-[var(--text)]">{animal.shelter}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-[var(--muted)]">Energia</dt>
                <dd className="font-medium text-[var(--text)]">{animal.nivelEnergia}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-[28px] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(15,118,110,0.1),rgba(255,255,255,0.92))] p-6 shadow-[var(--shadow)]">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">Proximo passo</p>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              Entre na plataforma para enviar uma aplicacao e acompanhar a compatibilidade deste animal.
            </p>
            <div className="mt-5 flex gap-3">
              <Link href="/login" className="rounded-full bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--primary-strong)]">
                Entrar
              </Link>
              <Link href="/adotante/questionario" className="rounded-full border border-[var(--border)] bg-white px-5 py-3 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--surface-2)]">
                Questionario
              </Link>
            </div>
          </div>
        </aside>
      </section>
    </AppShell>
  );
}
