"use client";

import Link from 'next/link';
import { useParams } from 'next/navigation';
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

export default function AnimalDetailPage() {
  const params = useParams<{ id: string }>();
  const animalId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [animal, setAnimal] = useState<AnimalResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadAnimal() {
      if (!animalId) {
        setError('Animal invalido.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');
        const data = await animalService.buscarPorId(animalId);
        if (active) {
          setAnimal(data);
        }
      } catch (loadError) {
        if (active) {
          const message = loadError instanceof Error ? loadError.message : 'Nao foi possivel carregar o animal.';
          setError(message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadAnimal();

    return () => {
      active = false;
    };
  }, [animalId]);

  if (loading) {
    return (
      <AppShell
        eyebrow="Detalhe do animal"
        title="Carregando..."
        description="Buscando informacoes do animal no backend."
        secondaryAction={{ label: 'Voltar ao catalogo', href: '/animais' }}
      >
        <section className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-8 text-center text-sm text-[var(--muted)] shadow-[var(--shadow)]">
          Carregando detalhes do animal...
        </section>
      </AppShell>
    );
  }

  if (error || !animal) {
    return (
      <AppShell
        eyebrow="Detalhe do animal"
        title="Animal nao encontrado"
        description="Nao foi possivel carregar os detalhes para este cadastro."
        secondaryAction={{ label: 'Voltar ao catalogo', href: '/animais' }}
      >
        <section className="rounded-[28px] border border-red-200 bg-red-50 p-8 text-center text-sm text-red-700 shadow-[var(--shadow)]">
          {error || 'Animal nao encontrado.'}
        </section>
      </AppShell>
    );
  }

  return (
    <AppShell
      eyebrow="Detalhe do animal"
      title={animal.nome}
      description="Pagina de detalhe adaptada para a rota dinamica do Next."
      secondaryAction={{ label: 'Voltar ao catalogo', href: '/animais' }}
    >
      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <article className="overflow-hidden rounded-[28px] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)]">
          <div className="flex aspect-[4/3] items-center justify-center bg-[linear-gradient(145deg,rgba(15,118,110,0.16),rgba(217,119,6,0.16))]">
            <span className="text-8xl font-semibold uppercase tracking-[0.08em] text-[var(--primary-strong)]">
              {animal.nome.slice(0, 1)}
            </span>
          </div>

          <div className="space-y-5 p-6">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
              <span>{formatLabel(animal.status)}</span>
              <span>•</span>
              <span>{formatLabel(animal.especie)}</span>
              <span>•</span>
              <span>{formatLabel(animal.porte)}</span>
            </div>

            <p className="text-sm leading-6 text-[var(--muted)]">{animal.descricao ?? 'Sem descricao informada para este animal.'}</p>
          </div>
        </article>

        <aside className="space-y-6">
          <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]">
            <h2 className="text-xl font-semibold text-[var(--text)]">Informacoes principais</h2>
            <dl className="mt-5 grid gap-4 text-sm">
              <div className="flex items-center justify-between gap-3 border-b border-dashed border-[var(--border)] pb-3">
                <dt className="text-[var(--muted)]">Especie</dt>
                <dd className="font-medium text-[var(--text)]">{formatLabel(animal.especie)}</dd>
              </div>
              <div className="flex items-center justify-between gap-3 border-b border-dashed border-[var(--border)] pb-3">
                <dt className="text-[var(--muted)]">Porte</dt>
                <dd className="font-medium text-[var(--text)]">{formatLabel(animal.porte)}</dd>
              </div>
              <div className="flex items-center justify-between gap-3 border-b border-dashed border-[var(--border)] pb-3">
                <dt className="text-[var(--muted)]">Sexo</dt>
                <dd className="font-medium text-[var(--text)]">{formatLabel(animal.sexo)}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-[var(--muted)]">Status</dt>
                <dd className="font-medium text-[var(--text)]">{formatLabel(animal.status)}</dd>
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
