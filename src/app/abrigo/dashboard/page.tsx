"use client";

import Link from 'next/link';
import { useState } from 'react';
import { AppShell } from '../../../components/layout/AppShell';
import { animals, defaultShelterName, formatMatchStatus, formatSize, formatSpecies, matches } from '../../../lib/petFixtures';

export default function AbrigoDashboardPage() {
  const [applicationItems, setApplicationItems] = useState(matches);

  const shelterAnimals = animals.filter((animal) => animal.shelter === defaultShelterName);
  const shelterApplications = applicationItems.filter((application) => {
    const animal = animals.find((item) => item.id === application.petId);
    return animal?.shelter === defaultShelterName;
  });

  return (
    <AppShell
      eyebrow="Abrigo"
      title="Painel do abrigo"
      description="Resumo operacional, animais cadastrados e aplicacoes recebidas dentro das rotas do Next."
      primaryAction={{ label: 'Cadastrar animal', href: '/abrigo/animais/novo' }}
      secondaryAction={{ label: 'Ver aplicacoes', href: '/abrigo/aplicacoes' }}
    >
      <section className="grid gap-4 md:grid-cols-4">
        <article className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Animais</p>
          <p className="mt-3 text-3xl font-semibold text-[var(--text)]">{shelterAnimals.length}</p>
        </article>
        <article className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Pendentes</p>
          <p className="mt-3 text-3xl font-semibold text-[var(--text)]">{shelterApplications.filter((item) => item.status === 'pending').length}</p>
        </article>
        <article className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Aprovadas</p>
          <p className="mt-3 text-3xl font-semibold text-[var(--text)]">{shelterApplications.filter((item) => item.status === 'approved').length}</p>
        </article>
        <article className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Abrigado</p>
          <p className="mt-3 text-lg font-semibold text-[var(--text)]">{defaultShelterName}</p>
        </article>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_0.95fr]">
        <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-[var(--text)]">Meus animais</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">Cards adaptados do app antigo para o fluxo do Next.</p>
            </div>
            <Link href="/abrigo/animais/novo" className="rounded-full bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--primary-strong)]">
              Novo animal
            </Link>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {shelterAnimals.map((animal) => (
              <article key={animal.id} className="overflow-hidden rounded-2xl border border-[var(--border)] bg-white">
                <div className="aspect-[4/3] bg-[var(--surface-2)]">
                  <img src={animal.imageUrl} alt={animal.name} className="h-full w-full object-cover" />
                </div>
                <div className="space-y-3 p-4">
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--text)]">{animal.name}</h3>
                    <p className="mt-1 text-sm text-[var(--muted)]">{formatSpecies(animal.species)} - {animal.breed}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs font-medium text-[var(--muted)]">
                    <span className="rounded-full border border-[var(--border)] px-3 py-1">{formatSize(animal.size)}</span>
                    <span className="rounded-full border border-[var(--border)] px-3 py-1">{animal.status}</span>
                  </div>
                  <Link href={`/abrigo/animais/${animal.id}/editar`} className="inline-flex rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--surface-2)]">
                    Editar
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]">
          <h2 className="text-xl font-semibold text-[var(--text)]">Aplicacoes recentes</h2>
          <div className="mt-5 space-y-4">
            {shelterApplications.map((application) => {
              const animal = animals.find((item) => item.id === application.petId);

              return (
                <article key={application.id} className="rounded-2xl border border-[var(--border)] bg-white p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-[var(--text)]">{application.adopterName} - {animal?.name}</h3>
                      <p className="mt-1 text-sm text-[var(--muted)]">{application.score}% de compatibilidade</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${application.status === 'approved' ? 'bg-[rgba(22,163,74,0.12)] text-green-700' : application.status === 'pending' ? 'bg-[rgba(217,119,6,0.12)] text-amber-700' : 'bg-[rgba(220,38,38,0.12)] text-red-700'}`}>
                      {formatMatchStatus(application.status)}
                    </span>
                  </div>

                  {application.status === 'pending' ? (
                    <div className="mt-4 flex gap-2">
                      <button
                        type="button"
                        onClick={() => setApplicationItems((current) => current.map((item) => (item.id === application.id ? { ...item, status: 'approved' } : item)))}
                        className="rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
                      >
                        Aprovar
                      </button>
                      <button
                        type="button"
                        onClick={() => setApplicationItems((current) => current.map((item) => (item.id === application.id ? { ...item, status: 'rejected' } : item)))}
                        className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--surface-2)]"
                      >
                        Recusar
                      </button>
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
