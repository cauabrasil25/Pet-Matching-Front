import Link from 'next/link';
import { AppShell } from '../../../components/layout/AppShell';
import { animals, defaultShelterName, formatSize, formatStatus, formatSpecies } from '../../../lib/petFixtures';

export default function AbrigoAnimaisPage() {
  const shelterAnimals = animals.filter((animal) => animal.shelter === defaultShelterName);

  return (
    <AppShell
      eyebrow="Abrigo"
      title="Meus animais"
      description="Lista dos animais cadastrados pelo abrigo no padrao de rotas do Next."
      primaryAction={{ label: 'Novo animal', href: '/abrigo/animais/novo' }}
    >
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {shelterAnimals.map((animal) => (
          <article key={animal.id} className="overflow-hidden rounded-[28px] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)]">
            <div className="aspect-[4/3] bg-[var(--surface-2)]">
              <img src={animal.imageUrl} alt={animal.name} className="h-full w-full object-cover" />
            </div>
            <div className="space-y-4 p-6">
              <div>
                <h2 className="text-xl font-semibold text-[var(--text)]">{animal.name}</h2>
                <p className="mt-1 text-sm text-[var(--muted)]">{formatSpecies(animal.species)} - {animal.breed}</p>
              </div>
              <div className="flex flex-wrap gap-2 text-xs font-medium text-[var(--muted)]">
                <span className="rounded-full border border-[var(--border)] px-3 py-1">{formatSize(animal.size)}</span>
                <span className="rounded-full border border-[var(--border)] px-3 py-1">{formatStatus(animal.status)}</span>
              </div>
              <div className="flex gap-3">
                <Link href={`/abrigo/animais/${animal.id}/editar`} className="flex-1 rounded-full border border-[var(--border)] bg-white px-4 py-2.5 text-center text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--surface-2)]">
                  Editar
                </Link>
                <Link href={`/animais/${animal.id}`} className="rounded-full bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--primary-strong)]">
                  Ver
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </AppShell>
  );
}
