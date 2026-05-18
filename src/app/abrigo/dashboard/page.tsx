"use client";

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { AppShell } from '../../../components/layout/AppShell';
import { getCurrentUser } from '../../../services/authService';
import { animalService } from '../../../services/animalService';
import { applicationService } from '../../../services/applicationService';
import type { AnimalResponse } from '../../../types/animal';
import type {
  AplicacaoAdocaoResponse,
  StatusAplicacao
} from '../../../types/application';

function formatLabel(value?: string | null) {
  if (!value) return 'Nao informado';

  return value
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatApplicationStatus(status: StatusAplicacao) {
  if (status === 'APROVADA') return 'Aprovada';
  if (status === 'PENDENTE') return 'Pendente';
  return 'Recusada';
}

function statusClassName(status: StatusAplicacao) {
  if (status === 'APROVADA') {
    return 'border-green-200 bg-green-50 text-green-700';
  }

  if (status === 'PENDENTE') {
    return 'border-amber-200 bg-amber-50 text-amber-700';
  }

  return 'border-red-200 bg-red-50 text-red-700';
}

export default function AbrigoDashboardPage() {
  const [animals, setAnimals] = useState<AnimalResponse[]>([]);
  const [applicationItems, setApplicationItems] = useState<
    AplicacaoAdocaoResponse[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState('');

  const currentUser = getCurrentUser();

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        setLoading(true);
        setError('');

        const [animalsData, applicationsData] = await Promise.all([
          animalService.listar(),
          applicationService.listarRecebidas()
        ]);

        if (active) {
          setAnimals(animalsData);
          setApplicationItems(applicationsData);
        }
      } catch (loadError) {
        if (active) {
          const message =
            loadError instanceof Error
              ? loadError.message
              : 'Nao foi possivel carregar o dashboard do abrigo.';

          setError(message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, []);

  async function handleDecision(
    applicationId: string,
    decision: 'aprovar' | 'recusar'
  ) {
    try {
      setActionError('');
      setActionLoadingId(applicationId);

      const updated =
        decision === 'aprovar'
          ? await applicationService.aprovar(applicationId)
          : await applicationService.recusar(applicationId);

      setApplicationItems((current) =>
        current.map((item) =>
          item.id === applicationId ? updated : item
        )
      );
    } catch (decisionError) {
      const message =
        decisionError instanceof Error
          ? decisionError.message
          : 'Nao foi possivel atualizar a aplicacao.';

      setActionError(message);
    } finally {
      setActionLoadingId('');
    }
  }

  const animalById = useMemo(() => {
    return new Map(
      animals.map((animal) => [animal.id, animal])
    );
  }, [animals]);

  const pendingCount = applicationItems.filter(
    (item) => item.status === 'PENDENTE'
  ).length;

  const approvedCount = applicationItems.filter(
    (item) => item.status === 'APROVADA'
  ).length;

  return (
    <AppShell
      eyebrow="Abrigo"
      title="Painel do abrigo"
      description="Gerencie animais cadastrados e acompanhe as aplicacoes recebidas."
      primaryAction={{
        label: 'Cadastrar animal',
        href: '/abrigo/animais/novo'
      }}
      secondaryAction={{
        label: 'Ver aplicacoes',
        href: '/abrigo/aplicacoes'
      }}
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
            Animais
          </p>

          <p className="mt-3 text-3xl font-bold text-[var(--text)]">
            {animals.length}
          </p>
        </article>

        <article className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
            Pendentes
          </p>

          <p className="mt-3 text-3xl font-bold text-amber-700">
            {pendingCount}
          </p>
        </article>

        <article className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
            Aprovadas
          </p>

          <p className="mt-3 text-3xl font-bold text-green-700">
            {approvedCount}
          </p>
        </article>

        <article className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
            Conta ativa
          </p>

          <p className="mt-3 text-lg font-bold text-[var(--text)] break-words">
            {currentUser?.email ?? 'Abrigo'}
          </p>
        </article>
      </section>

      {loading ? (
        <section className="mt-6 rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-10 text-center shadow-[var(--shadow)]">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[var(--border)] border-t-[var(--primary)]" />

          <p className="mt-4 text-sm text-[var(--muted)]">
            Carregando dados do abrigo...
          </p>
        </section>
      ) : null}

      {error ? (
        <section className="mt-6 rounded-[28px] border border-red-200 bg-red-50 p-8 text-center shadow-[var(--shadow)]">
          <p className="text-sm font-medium text-red-700">
            {error}
          </p>
        </section>
      ) : null}

      {actionError ? (
        <section className="mt-6 rounded-[28px] border border-red-200 bg-red-50 p-6 shadow-[var(--shadow)]">
          <p className="text-sm font-medium text-red-700">
            {actionError}
          </p>
        </section>
      ) : null}

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[var(--text)]">
                Meus animais
              </h2>

              <p className="mt-1 text-sm text-[var(--muted)]">
                Gerencie os animais cadastrados pelo abrigo.
              </p>
            </div>

            <Link
              href="/abrigo/animais/novo"
              className="inline-flex items-center justify-center rounded-full bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--primary-strong)]"
            >
              Novo animal
            </Link>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {animals.map((animal) => (
              <article
                key={animal.id}
                className="overflow-hidden rounded-[24px] border border-[var(--border)] bg-white transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex aspect-[4/3] items-center justify-center bg-[linear-gradient(145deg,rgba(15,118,110,0.16),rgba(217,119,6,0.16))]">
                  <span className="text-6xl font-bold uppercase tracking-[0.08em] text-[var(--primary-strong)]">
                    {animal.nome.slice(0, 1)}
                  </span>
                </div>

                <div className="space-y-4 p-5">
                  <div>
                    <h3 className="text-xl font-bold text-[var(--text)]">
                      {animal.nome}
                    </h3>

                    <p className="mt-1 text-sm text-[var(--muted)]">
                      {formatLabel(animal.especie)} •{' '}
                      {formatLabel(animal.porte)}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-1 text-xs font-semibold text-[var(--text)]">
                      {formatLabel(animal.status)}
                    </span>

                    <span className="rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-1 text-xs font-semibold text-[var(--text)]">
                      {animal.idade} anos
                    </span>
                  </div>

                  <Link
                    href={`/abrigo/animais/${animal.id}/editar`}
                    className="inline-flex items-center justify-center rounded-full border border-[var(--border)] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--surface-2)]"
                  >
                    Editar animal
                  </Link>
                </div>
              </article>
            ))}

            {animals.length === 0 ? (
              <section className="rounded-[24px] border border-dashed border-[var(--border)] bg-[var(--surface-2)] p-8 text-center md:col-span-2">
                <p className="text-lg font-semibold text-[var(--text)]">
                  Nenhum animal cadastrado
                </p>

                <p className="mt-2 text-sm text-[var(--muted)]">
                  Comece cadastrando o primeiro animal do abrigo.
                </p>
              </section>
            ) : null}
          </div>
        </div>

        <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold text-[var(--text)]">
                Aplicacoes recentes
              </h2>

              <p className="mt-1 text-sm text-[var(--muted)]">
                Analise rapidamente os pedidos recebidos.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-5">
            {applicationItems.map((application) => {
              const animal = animalById.get(application.animalId);

              return (
                <article
                  key={application.id}
                  className="rounded-[24px] border border-[var(--border)] bg-white p-5"
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-bold text-[var(--text)]">
                          {application.animalNome}
                        </h3>

                        <p className="mt-1 text-sm text-[var(--muted)]">
                          {application.adotanteNome}
                        </p>

                        <p className="mt-1 text-xs text-[var(--muted)]">
                          Aplicacao #{application.id}
                        </p>
                      </div>

                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusClassName(application.status)}`}
                      >
                        {formatApplicationStatus(application.status)}
                      </span>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-4 text-center">
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--accent)]">
                          Match
                        </p>

                        <p className="mt-2 text-2xl font-bold text-[var(--text)]">
                          {application.scoreMatch}%
                        </p>
                      </div>

                      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-4 text-center">
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--accent)]">
                          Retorno
                        </p>

                        <p className="mt-2 text-2xl font-bold text-[var(--text)]">
                          {application.chanceRetorno}%
                        </p>
                      </div>
                    </div>

                    {animal ? (
                      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-4 text-sm text-[var(--muted)]">
                        <p>
                          {formatLabel(animal.especie)} •{' '}
                          {formatLabel(animal.porte)}
                        </p>

                        <p className="mt-1">
                          Energia:{' '}
                          {formatLabel(animal.nivelEnergia ?? 'MEDIO')}
                        </p>
                      </div>
                    ) : null}

                    {application.status === 'PENDENTE' ? (
                      <div className="flex flex-wrap gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() =>
                            handleDecision(application.id, 'aprovar')
                          }
                          disabled={actionLoadingId === application.id}
                          className="flex-1 rounded-full bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          {actionLoadingId === application.id
                            ? 'Atualizando...'
                            : 'Aprovar'}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDecision(application.id, 'recusar')
                          }
                          disabled={actionLoadingId === application.id}
                          className="flex-1 rounded-full border border-[var(--border)] bg-white px-4 py-3 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--surface-2)] disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          {actionLoadingId === application.id
                            ? 'Atualizando...'
                            : 'Recusar'}
                        </button>
                      </div>
                    ) : null}
                  </div>
                </article>
              );
            })}

            {applicationItems.length === 0 ? (
              <section className="rounded-[24px] border border-dashed border-[var(--border)] bg-[var(--surface-2)] p-8 text-center">
                <p className="text-lg font-semibold text-[var(--text)]">
                  Nenhuma aplicacao recebida
                </p>

                <p className="mt-2 text-sm text-[var(--muted)]">
                  As novas candidaturas aparecerao aqui.
                </p>
              </section>
            ) : null}
          </div>
        </div>
      </section>
    </AppShell>
  );
}