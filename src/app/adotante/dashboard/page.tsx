"use client";

import Link from 'next/link';
import { useState } from 'react';
import { AppShell } from '../../../components/layout/AppShell';
import {
  adopterApplications,
  adopterProfile,
  animals,
  formatMatchStatus,
  formatProfileValue,
  formatSize,
  formatSpecies,
  matches,
  sizeLabels,
  speciesLabels
} from '../../../lib/petFixtures';

type ViewTab = 'explorar' | 'favoritos' | 'aplicacoes' | 'perfil';

export default function AdotanteDashboardPage() {
  const [tab, setTab] = useState<ViewTab>('explorar');
  const [speciesFilter, setSpeciesFilter] = useState<'all' | 'dog' | 'cat'>('all');
  const [sizeFilter, setSizeFilter] = useState<'all' | 'small' | 'medium' | 'large'>('all');
  const [likedIds, setLikedIds] = useState<string[]>(['1', '5']);

  const availableAnimals = animals.filter((animal) => {
    const speciesMatches = speciesFilter === 'all' || animal.species === speciesFilter;
    const sizeMatches = sizeFilter === 'all' || animal.size === sizeFilter;
    return speciesMatches && sizeMatches && animal.status !== 'ADOTADO';
  });

  const favoriteAnimals = animals.filter((animal) => likedIds.includes(animal.id));
  const approvedMatches = matches.filter((match) => match.status === 'approved');

  return (
    <AppShell
      eyebrow="Adotante"
      title="Painel do adotante"
      description="Interface de exploracao, favoritos, aplicacoes e resumo de perfil migrada para o Next."
      primaryAction={{ label: 'Questionario', href: '/adotante/questionario' }}
      secondaryAction={{ label: 'Ver catalogo', href: '/animais' }}
    >
      <section className="grid gap-4 md:grid-cols-4">
        <article className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Favoritos</p>
          <p className="mt-3 text-3xl font-semibold text-[var(--text)]">{likedIds.length}</p>
        </article>
        <article className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Aplicacoes</p>
          <p className="mt-3 text-3xl font-semibold text-[var(--text)]">{adopterApplications.length}</p>
        </article>
        <article className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Matches aprovados</p>
          <p className="mt-3 text-3xl font-semibold text-[var(--text)]">{approvedMatches.length}</p>
        </article>
        <article className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Perfil pronto</p>
          <p className="mt-3 text-3xl font-semibold text-[var(--text)]">Sim</p>
        </article>
      </section>

      <div className="mt-6 flex flex-wrap gap-2 rounded-full bg-[var(--surface)] p-2 text-sm font-medium shadow-[var(--shadow)]">
        {([
          ['explorar', 'Explorar'],
          ['favoritos', 'Favoritos'],
          ['aplicacoes', 'Aplicacoes'],
          ['perfil', 'Perfil']
        ] as const).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`rounded-full px-4 py-2 transition ${tab === key ? 'bg-[var(--primary)] text-white' : 'text-[var(--muted)] hover:bg-[var(--surface-2)]'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'explorar' ? (
        <section className="mt-6 space-y-6 rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]">
          <div className="grid gap-4 md:grid-cols-3">
            <label className="block space-y-2 text-sm font-medium text-[var(--text)]">
              <span>Especie</span>
              <select
                className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--primary)]"
                value={speciesFilter}
                onChange={(event) => setSpeciesFilter(event.target.value as typeof speciesFilter)}
              >
                <option value="all">Todas</option>
                <option value="dog">Cachorro</option>
                <option value="cat">Gato</option>
              </select>
            </label>

            <label className="block space-y-2 text-sm font-medium text-[var(--text)]">
              <span>Tamanho</span>
              <select
                className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--primary)]"
                value={sizeFilter}
                onChange={(event) => setSizeFilter(event.target.value as typeof sizeFilter)}
              >
                <option value="all">Todos</option>
                <option value="small">Pequeno</option>
                <option value="medium">Medio</option>
                <option value="large">Grande</option>
              </select>
            </label>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-4 text-sm text-[var(--muted)]">
              <p className="font-semibold text-[var(--text)]">Filtro atual</p>
              <p className="mt-2">{speciesFilter === 'all' ? 'Todas as especies' : speciesLabels[speciesFilter]} - {sizeFilter === 'all' ? 'Todos os tamanhos' : sizeLabels[sizeFilter]}</p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {availableAnimals.map((animal) => {
              const liked = likedIds.includes(animal.id);

              return (
                <article key={animal.id} className="overflow-hidden rounded-[24px] border border-[var(--border)] bg-white">
                  <div className="aspect-[4/3] bg-[var(--surface-2)]">
                    <img src={animal.imageUrl} alt={animal.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="space-y-4 p-5">
                    <div>
                      <h3 className="text-lg font-semibold text-[var(--text)]">{animal.name}</h3>
                      <p className="mt-1 text-sm text-[var(--muted)]">{formatSpecies(animal.species)} - {animal.breed} - {formatSize(animal.size)}</p>
                    </div>
                    <p className="text-sm leading-6 text-[var(--muted)]">{animal.description}</p>
                    <div className="flex flex-wrap gap-2 text-xs font-medium text-[var(--muted)]">
                      {animal.temperament.slice(0, 3).map((item) => (
                        <span key={item} className="rounded-full border border-[var(--border)] px-3 py-1">{item}</span>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      <Link href={`/animais/${animal.id}`} className="flex-1 rounded-full border border-[var(--border)] px-4 py-2.5 text-center text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--surface-2)]">
                        Detalhe
                      </Link>
                      <button
                        type="button"
                        onClick={() => setLikedIds((current) => (current.includes(animal.id) ? current : [...current, animal.id]))}
                        className="rounded-full bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--primary-strong)]"
                      >
                        {liked ? 'Favoritado' : 'Favoritar'}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ) : null}

      {tab === 'favoritos' ? (
        <section className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {favoriteAnimals.map((animal) => (
            <article key={animal.id} className="overflow-hidden rounded-[24px] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)]">
              <div className="aspect-[4/3] bg-[var(--surface-2)]">
                <img src={animal.imageUrl} alt={animal.name} className="h-full w-full object-cover" />
              </div>
              <div className="space-y-3 p-5">
                <h3 className="text-lg font-semibold text-[var(--text)]">{animal.name}</h3>
                <p className="text-sm text-[var(--muted)]">{animal.breed}</p>
                <Link href={`/animais/${animal.id}`} className="inline-flex rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--surface-2)]">
                  Ver detalhe
                </Link>
              </div>
            </article>
          ))}
          {favoriteAnimals.length === 0 ? <p className="text-sm text-[var(--muted)]">Nenhum favorito salvo ainda.</p> : null}
        </section>
      ) : null}

      {tab === 'aplicacoes' ? (
        <section className="mt-6 space-y-4 rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]">
          {adopterApplications.map((application) => {
            const animal = animals.find((item) => item.id === application.animalId);
            return (
              <article key={application.id} className="rounded-2xl border border-[var(--border)] bg-white p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--text)]">{animal?.name}</h3>
                    <p className="mt-1 text-sm text-[var(--muted)]">{application.shelter} - {application.updatedAt}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${application.status === 'approved' ? 'bg-[rgba(22,163,74,0.12)] text-green-700' : application.status === 'pending' ? 'bg-[rgba(217,119,6,0.12)] text-amber-700' : 'bg-[rgba(220,38,38,0.12)] text-red-700'}`}>
                    {formatMatchStatus(application.status)}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{application.message}</p>
                <div className="mt-4 flex items-center gap-3 text-sm text-[var(--muted)]">
                  <span>Compatibilidade: {application.score}%</span>
                  <Link href={`/animais/${application.animalId}`} className="font-semibold text-[var(--primary-strong)]">
                    Ver animal
                  </Link>
                </div>
              </article>
            );
          })}
        </section>
      ) : null}

      {tab === 'perfil' ? (
        <section className="mt-6 rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {([
              ['tipoMoradia', adopterProfile.tipoMoradia],
              ['nivelAtividade', adopterProfile.nivelAtividade],
              ['toleranciaBarulho', adopterProfile.toleranciaBarulho],
              ['temCriancas', adopterProfile.temCriancas],
              ['temOutrosPets', adopterProfile.temOutrosPets]
            ] as const).map(([key, value]) => (
              <div key={key} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">{key}</p>
                <p className="mt-2 text-sm font-medium text-[var(--text)]">{formatProfileValue(key, value)}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </AppShell>
  );
}
