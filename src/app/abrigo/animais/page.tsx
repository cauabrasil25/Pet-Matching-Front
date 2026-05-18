"use client";

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { AppShell } from '../../../components/layout/AppShell';
import { animalService } from '../../../services/animalService';
import type { AnimalResponse } from '../../../types/animal';

function formatLabel(value?: string | null) {
  if (!value) return 'Nao informado';

  return value
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function statusStyles(status?: string | null) {
  switch (status) {
    case 'DISPONIVEL':
      return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'PENDENTE':
      return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'ADOTADO':
      return 'bg-sky-100 text-sky-700 border-sky-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
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
          const message =
            loadError instanceof Error
              ? loadError.message
              : 'Nao foi possivel carregar os animais do abrigo.';

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

  const availableCount = useMemo(
    () => animals.filter((animal) => animal.status === 'DISPONIVEL').length,
    [animals]
  );

  const adoptedCount = useMemo(
    () => animals.filter((animal) => animal.status === 'ADOTADO').length,
    [animals]
  );

  const pendingCount = useMemo(
    () => animals.filter((animal) => animal.status === 'PENDENTE').length,
    [animals]
  );

  return (
    <AppShell
      eyebrow="Abrigo"
      title="Meus animais"
      description="Gerencie os animais cadastrados, acompanhe status e mantenha o catalogo atualizado."
      primaryAction={{
        label: 'Novo animal',
        href: '/abrigo/animais/novo'
      }}
      secondaryAction={{
        label: 'Dashboard',
        href: '/abrigo/dashboard'
      }}
    >
      <section className="grid gap-4 md:grid-cols-4">
        <article className="relative overflow-hidden rounded-[30px] border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6 shadow-[var(--shadow)]">
          <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-emerald-100 blur-3xl" />
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
            Disponiveis
          </p>
          <p className="mt-3 text-4xl font-bold text-[var(--text)]">
            {availableCount}
          </p>
        </article>

        <article className="relative overflow-hidden rounded-[30px] border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-6 shadow-[var(--shadow)]">
          <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-amber-100 blur-3xl" />
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
            Pendentes
          </p>
          <p className="mt-3 text-4xl font-bold text-[var(--text)]">
            {pendingCount}
          </p>
        </article>

        <article className="relative overflow-hidden rounded-[30px] border border-sky-200 bg-gradient-to-br from-sky-50 to-white p-6 shadow-[var(--shadow)]">
          <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-sky-100 blur-3xl" />
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">
            Adotados
          </p>
          <p className="mt-3 text-4xl font-bold text-[var(--text)]">
            {adoptedCount}
          </p>
        </article>

        <article className="relative overflow-hidden rounded-[30px] border border-[var(--border)] bg-gradient-to-br from-[var(--surface)] to-white p-6 shadow-[var(--shadow)]">
          <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-[rgba(15,118,110,0.10)] blur-3xl" />
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
            Total
          </p>
          <p className="mt-3 text-4xl font-bold text-[var(--text)]">
            {animals.length}
          </p>
        </article>
      </section>

      {loading ? (
        <section className="mt-8 rounded-[30px] border border-[var(--border)] bg-[var(--surface)] p-12 text-center shadow-[var(--shadow)]">
          <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-[var(--surface-2)] border-t-[var(--primary)]" />
          <p className="mt-5 text-sm font-medium text-[var(--muted)]">
            Carregando animais...
          </p>
        </section>
      ) : null}

      {error ? (
        <section className="mt-8 rounded-[30px] border border-red-200 bg-red-50 p-8 shadow-[var(--shadow)]">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-700">
              !
            </div>

            <div>
              <h2 className="text-base font-semibold text-red-700">
                Erro ao carregar animais
              </h2>

              <p className="mt-1 text-sm text-red-600">
                {error}
              </p>
            </div>
          </div>
        </section>
      ) : null}

      {!loading && !error ? (
        <>
          <section className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-[30px] border border-[var(--border)] bg-[var(--surface)] px-6 py-5 shadow-[var(--shadow)]">
            <div>
              <h2 className="text-xl font-semibold text-[var(--text)]">
                Catalogo do abrigo
              </h2>

              <p className="mt-1 text-sm text-[var(--muted)]">
                Visualize, edite e acompanhe todos os animais cadastrados.
              </p>
            </div>

            <Link
              href="/abrigo/animais/novo"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white transition hover:scale-[1.02] hover:bg-[var(--primary-strong)]"
            >
              + Adicionar animal
            </Link>
          </section>

          {animals.length > 0 ? (
            <section className="mt-8 grid gap-6 md:grid-cols-2 2xl:grid-cols-3">
              {animals.map((animal) => (
                <article
                  key={animal.id}
                  className="group overflow-hidden rounded-[32px] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)] transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
                >
                  <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-gradient-to-br from-[rgba(15,118,110,0.20)] via-[rgba(217,119,6,0.10)] to-[rgba(59,130,246,0.16)]">
                    <div className="absolute inset-0 opacity-40">
                      <div className="absolute -left-10 top-10 h-32 w-32 rounded-full bg-white blur-3xl" />
                      <div className="absolute bottom-0 right-0 h-36 w-36 rounded-full bg-[rgba(15,118,110,0.16)] blur-3xl" />
                    </div>

                    <span className="relative text-7xl font-black uppercase tracking-[0.10em] text-[var(--primary-strong)] transition duration-300 group-hover:scale-110">
                      {animal.nome.slice(0, 1)}
                    </span>

                    <div className="absolute left-5 top-5">
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur-sm ${statusStyles(animal.status)}`}
                      >
                        {formatLabel(animal.status)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-5 p-6">
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h2 className="text-2xl font-bold text-[var(--text)]">
                            {animal.nome}
                          </h2>

                          <p className="mt-1 text-sm text-[var(--muted)]">
                            {formatLabel(animal.especie)} •{' '}
                            {formatLabel(animal.porte)}
                          </p>
                        </div>
                      </div>

                      <p className="mt-4 line-clamp-3 text-sm leading-7 text-[var(--muted)]">
                        Animal cadastrado para adoção com informações completas no cadastro.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-[var(--surface-2)] px-3 py-1 text-xs font-medium text-[var(--muted)]">
                        ID #{animal.id}
                      </span>

                      <span className="rounded-full bg-[rgba(15,118,110,0.10)] px-3 py-1 text-xs font-medium text-[var(--primary-strong)]">
                        {formatLabel(animal.especie)}
                      </span>

                      <span className="rounded-full bg-[rgba(217,119,6,0.10)] px-3 py-1 text-xs font-medium text-amber-700">
                        {formatLabel(animal.porte)}
                      </span>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Link
                        href={`/abrigo/animais/${animal.id}/editar`}
                        className="flex-1 rounded-full border border-[var(--border)] bg-white px-4 py-3 text-center text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--surface-2)]"
                      >
                        Editar
                      </Link>

                      <Link
                        href={`/animais/${animal.id}`}
                        className="flex-1 rounded-full bg-[var(--primary)] px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-[var(--primary-strong)]"
                      >
                        Ver perfil
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </section>
          ) : (
            <section className="mt-8 rounded-[32px] border border-dashed border-[var(--border)] bg-[var(--surface)] px-6 py-16 text-center shadow-[var(--shadow)]">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[rgba(15,118,110,0.10)] text-4xl">
                🐾
              </div>

              <h2 className="mt-6 text-2xl font-bold text-[var(--text)]">
                Nenhum animal cadastrado
              </h2>

              <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[var(--muted)]">
                Comece adicionando um novo animal ao catalogo do abrigo para
                receber aplicacoes de adotantes.
              </p>

              <Link
                href="/abrigo/animais/novo"
                className="mt-6 inline-flex rounded-full bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--primary-strong)]"
              >
                Cadastrar primeiro animal
              </Link>
            </section>
          )}
        </>
      ) : null}
    </AppShell>
  );
}
