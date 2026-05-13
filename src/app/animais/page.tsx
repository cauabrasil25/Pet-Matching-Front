"use client";

import Link from 'next/link';
import { useState } from 'react';
import { AppShell } from '../../components/layout/AppShell';
import { animals, formatSize, formatSpecies, formatStatus } from '../../lib/petFixtures';

export default function AnimalsPage() {
  const [search, setSearch] = useState('');
  const [species, setSpecies] = useState<'all' | 'dog' | 'cat'>('all');
  const [size, setSize] = useState<'all' | 'small' | 'medium' | 'large'>('all');

  const visibleAnimals = animals.filter((animal) => {
    const matchesSearch = animal.name.toLowerCase().includes(search.toLowerCase()) || animal.breed.toLowerCase().includes(search.toLowerCase());
    const matchesSpecies = species === 'all' || animal.species === species;
    const matchesSize = size === 'all' || animal.size === size;

    return matchesSearch && matchesSpecies && matchesSize;
  });

  return (
    <AppShell
      eyebrow="Animais"
      title="Catalogo publico de adocao"
      description="Rotina de listagem adaptada para o App Router, com filtros e cards reutilizando os dados do projeto antigo."
      primaryAction={{ label: 'Entrar', href: '/login' }}
      secondaryAction={{ label: 'Questionario', href: '/adotante/questionario' }}
    >
      <section className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]">
        <div className="grid gap-4 md:grid-cols-[1.6fr_repeat(2,1fr)]">
          <label className="block space-y-2 text-sm font-medium text-[var(--text)] md:col-span-1">
            <span>Buscar</span>
            <input
              className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--primary)]"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Nome ou raca"
            />
          </label>

          <label className="block space-y-2 text-sm font-medium text-[var(--text)]">
            <span>Especie</span>
            <select
              className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--primary)]"
              value={species}
              onChange={(event) => setSpecies(event.target.value as typeof species)}
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
              value={size}
              onChange={(event) => setSize(event.target.value as typeof size)}
            >
              <option value="all">Todos</option>
              <option value="small">Pequeno</option>
              <option value="medium">Medio</option>
              <option value="large">Grande</option>
            </select>
          </label>
        </div>
      </section>

      <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {visibleAnimals.map((animal) => (
          <article key={animal.id} className="overflow-hidden rounded-[28px] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)]">
            <div className="relative aspect-[4/3] bg-[var(--surface-2)]">
              <img src={animal.imageUrl} alt={animal.name} className="h-full w-full object-cover" />
              <div className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-[var(--text)]">
                {formatStatus(animal.status)}
              </div>
            </div>

            <div className="space-y-4 p-6">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold text-[var(--text)]">{animal.name}</h2>
                    <p className="mt-1 text-sm text-[var(--muted)]">{formatSpecies(animal.species)} - {animal.breed}</p>
                  </div>
                  <span className="rounded-full bg-[rgba(15,118,110,0.1)] px-3 py-1 text-xs font-semibold text-[var(--primary-strong)]">
                    {animal.age} anos
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{animal.description}</p>
              </div>

              <div className="flex flex-wrap gap-2 text-xs font-medium text-[var(--muted)]">
                <span className="rounded-full border border-[var(--border)] px-3 py-1">{formatSize(animal.size)}</span>
                <span className="rounded-full border border-[var(--border)] px-3 py-1">{animal.shelter}</span>
                <span className="rounded-full border border-[var(--border)] px-3 py-1">Energia {animal.nivelEnergia}</span>
              </div>

              <div className="flex gap-3">
                <Link
                  href={`/animais/${animal.id}`}
                  className="flex-1 rounded-full border border-[var(--border)] bg-white px-4 py-2.5 text-center text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--surface-2)]"
                >
                  Ver detalhe
                </Link>
                <Link
                  href="/login"
                  className="rounded-full bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--primary-strong)]"
                >
                  Aplicar
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      {visibleAnimals.length === 0 ? (
        <div className="mt-6 rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-8 text-center text-sm text-[var(--muted)] shadow-[var(--shadow)]">
          Nenhum animal encontrado com esses filtros.
        </div>
      ) : null}
    </AppShell>
  );
}
