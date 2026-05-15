"use client";

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { AppShell } from '../../components/layout/AppShell';
import { animalService } from '../../services/animalService';
import type { AnimalResponse } from '../../types/animal';

function formatLabel(value: string) {
  return value
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function AnimalsPage() {
  const [animals, setAnimals] = useState<AnimalResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [species, setSpecies] = useState('all');
  const [size, setSize] = useState('all');

  useEffect(() => {
    let active = true;

    async function loadAnimals() {
      try {
        setLoading(true);
        setError('');
        const data = await animalService.listar();
        if (active) {
          setAnimals(data);
        }
      } catch (loadError) {
        if (active) {
          const message = loadError instanceof Error ? loadError.message : 'Nao foi possivel carregar o catalogo.';
          setError(message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadAnimals();

    return () => {
      active = false;
    };
  }, []);

  const speciesOptions = useMemo(() => {
    return [...new Set(animals.map((animal) => animal.especie))].sort((a, b) => a.localeCompare(b));
  }, [animals]);

  const sizeOptions = useMemo(() => {
    return [...new Set(animals.map((animal) => animal.porte))].sort((a, b) => a.localeCompare(b));
  }, [animals]);

  const visibleAnimals = animals.filter((animal) => {
    const haystack = `${animal.nome} ${animal.especie} ${animal.porte} ${animal.sexo} ${animal.descricao ?? ''}`.toLowerCase();
    const matchesSearch = haystack.includes(search.toLowerCase());
    const matchesSpecies = species === 'all' || animal.especie === species;
    const matchesSize = size === 'all' || animal.porte === size;

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
              onChange={(event) => setSpecies(event.target.value)}
            >
              <option value="all">Todas</option>
              {speciesOptions.map((option) => (
                <option key={option} value={option}>{formatLabel(option)}</option>
              ))}
            </select>
          </label>

          <label className="block space-y-2 text-sm font-medium text-[var(--text)]">
            <span>Tamanho</span>
            <select
              className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--primary)]"
              value={size}
              onChange={(event) => setSize(event.target.value)}
            >
              <option value="all">Todos</option>
              {sizeOptions.map((option) => (
                <option key={option} value={option}>{formatLabel(option)}</option>
              ))}
            </select>
          </label>
        </div>
      </section>

      {loading ? (
        <div className="mt-6 rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-8 text-center text-sm text-[var(--muted)] shadow-[var(--shadow)]">
          Carregando animais...
        </div>
      ) : null}

      {error ? (
        <div className="mt-6 rounded-[28px] border border-red-200 bg-red-50 p-8 text-center text-sm text-red-700 shadow-[var(--shadow)]">
          {error}
        </div>
      ) : null}

      {!loading && !error ? <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {visibleAnimals.map((animal) => (
          <article key={animal.id} className="overflow-hidden rounded-[28px] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)]">
            <div className="relative flex aspect-[4/3] items-center justify-center bg-[linear-gradient(145deg,rgba(15,118,110,0.16),rgba(217,119,6,0.16))]">
              <span className="text-6xl font-semibold uppercase tracking-[0.08em] text-[var(--primary-strong)]">
                {animal.nome.slice(0, 1)}
              </span>
              <div className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-[var(--text)]">
                {formatLabel(animal.status)}
              </div>
            </div>

            <div className="space-y-4 p-6">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold text-[var(--text)]">{animal.nome}</h2>
                    <p className="mt-1 text-sm text-[var(--muted)]">{formatLabel(animal.especie)} - {formatLabel(animal.porte)}</p>
                  </div>
                  <span className="rounded-full bg-[rgba(15,118,110,0.1)] px-3 py-1 text-xs font-semibold text-[var(--primary-strong)]">
                    {formatLabel(animal.sexo)}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{animal.descricao ?? 'Sem descricao informada.'}</p>
              </div>

              <div className="flex flex-wrap gap-2 text-xs font-medium text-[var(--muted)]">
                <span className="rounded-full border border-[var(--border)] px-3 py-1">{formatLabel(animal.especie)}</span>
                <span className="rounded-full border border-[var(--border)] px-3 py-1">{formatLabel(animal.porte)}</span>
                <span className="rounded-full border border-[var(--border)] px-3 py-1">{formatLabel(animal.status)}</span>
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
      </div> : null}

      {!loading && !error && visibleAnimals.length === 0 ? (
        <div className="mt-6 rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-8 text-center text-sm text-[var(--muted)] shadow-[var(--shadow)]">
          Nenhum animal encontrado com esses filtros.
        </div>
      ) : null}
    </AppShell>
  );
}
