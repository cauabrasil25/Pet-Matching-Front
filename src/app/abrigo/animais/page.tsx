"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AppShell } from '../../../components/layout/AppShell';
import { animalService } from '../../../services/animalService';
import type { AnimalResponse } from '../../../types/animal';

function formatLabel(value: string) {
  return value
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function AbrigoAnimaisPage() {
  const [animals, setAnimals] = useState<AnimalResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadAnimals() {
      try {
        setLoading(true);
        setError('');
        const response = await animalService.listar();
        if (active) {
          setAnimals(response);
        }
      } catch (loadError) {
        if (active) {
          const message = loadError instanceof Error ? loadError.message : 'Nao foi possivel carregar os animais do abrigo.';
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

  return (
    <AppShell
      eyebrow="Abrigo"
      title="Meus animais"
      description="Lista dos animais cadastrados pelo abrigo no padrao de rotas do Next."
      primaryAction={{ label: 'Novo animal', href: '/abrigo/animais/novo' }}
    >
      {loading ? (
        <section className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-8 text-center text-sm text-[var(--muted)] shadow-[var(--shadow)]">
          Carregando animais...
        </section>
      ) : null}

      {error ? (
        <section className="rounded-[28px] border border-red-200 bg-red-50 p-8 text-center text-sm text-red-700 shadow-[var(--shadow)]">
          {error}
        </section>
      ) : null}

      {!loading && !error ? <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {animals.map((animal) => (
          <article key={animal.id} className="overflow-hidden rounded-[28px] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)]">
            <div className="flex aspect-[4/3] items-center justify-center bg-[linear-gradient(145deg,rgba(15,118,110,0.16),rgba(217,119,6,0.16))]">
              <span className="text-6xl font-semibold uppercase tracking-[0.08em] text-[var(--primary-strong)]">
                {animal.nome.slice(0, 1)}
              </span>
            </div>
            <div className="space-y-4 p-6">
              <div>
                <h2 className="text-xl font-semibold text-[var(--text)]">{animal.nome}</h2>
                <p className="mt-1 text-sm text-[var(--muted)]">{formatLabel(animal.especie)} - {formatLabel(animal.porte)}</p>
              </div>
              <div className="flex flex-wrap gap-2 text-xs font-medium text-[var(--muted)]">
                <span className="rounded-full border border-[var(--border)] px-3 py-1">{formatLabel(animal.sexo)}</span>
                <span className="rounded-full border border-[var(--border)] px-3 py-1">{formatLabel(animal.status)}</span>
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

        {animals.length === 0 ? <p className="text-sm text-[var(--muted)]">Nenhum animal cadastrado ainda.</p> : null}
      </div> : null}
    </AppShell>
  );
}
