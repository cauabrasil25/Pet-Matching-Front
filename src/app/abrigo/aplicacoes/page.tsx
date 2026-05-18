"use client";

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { AppShell } from '../../../components/layout/AppShell';
import { applicationService } from '../../../services/applicationService';
import type { AplicacaoAdocaoResponse, StatusAplicacao } from '../../../types/application';

function formatApplicationStatus(status: StatusAplicacao) {
  if (status === 'APROVADA') return 'Aprovada';
  if (status === 'PENDENTE') return 'Pendente';
  return 'Recusada';
}

function statusClassName(status: StatusAplicacao) {
  if (status === 'APROVADA') {
    return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
  }

  if (status === 'PENDENTE') {
    return 'bg-amber-100 text-amber-700 border border-amber-200';
  }

  return 'bg-rose-100 text-rose-700 border border-rose-200';
}

function progressColor(score: number) {
  if (score >= 80) return 'bg-emerald-500';
  if (score >= 60) return 'bg-amber-500';
  return 'bg-rose-500';
}

export default function AplicacoesRecebidasPage() {
  const [items, setItems] = useState<AplicacaoAdocaoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState('');

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        setLoading(true);
        setError('');

        const applicationsData = await applicationService.listarRecebidas();

        if (active) {
          setItems(applicationsData);
        }
      } catch (loadError) {
        if (active) {
          const message =
            loadError instanceof Error
              ? loadError.message
              : 'Nao foi possivel carregar as aplicacoes recebidas.';

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

      setItems((current) =>
        current.map((entry) =>
          entry.id === applicationId ? updated : entry
        )
      );
    } catch (decisionError) {
      const message =
        decisionError instanceof Error
          ? decisionError.message
          : 'Nao foi possivel atualizar o status da aplicacao.';

      setActionError(message);
    } finally {
      setActionLoadingId('');
    }
  }

  const pendingCount = items.filter(
    (item) => item.status === 'PENDENTE'
  ).length;

  const approvedCount = items.filter(
    (item) => item.status === 'APROVADA'
  ).length;

  const rejectedCount = items.filter(
    (item) => item.status === 'RECUSADA'
  ).length;

  const averageCompatibility = useMemo(() => {
    if (items.length === 0) return 0;

    const total = items.reduce(
      (accumulator, item) => accumulator + item.scoreMatch,
      0
    );

    return Math.round(total / items.length);
  }, [items]);

  return (
    <AppShell
      eyebrow="Abrigo"
      title="Aplicacoes recebidas"
      description="Gerencie candidaturas, acompanhe compatibilidade e tome decisoes rapidamente."
      secondaryAction={{
        label: 'Painel do abrigo',
        href: '/abrigo/dashboard'
      }}
    >
      <section className="relative overflow-hidden rounded-[32px] border border-[var(--border)] bg-[linear-gradient(135deg,#0f766e_0%,#115e59_45%,#1e293b_100%)] p-8 text-white shadow-2xl">
        <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-emerald-400/10 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-100">
              Central de aplicacoes
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight">
              Analise candidatos com mais contexto
            </h1>

            <p className="mt-4 text-sm leading-7 text-emerald-50/90">
              Visualize compatibilidade, chance de retorno e principais
              motivos antes de aprovar uma candidatura.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-100">
                Pendentes
              </p>
              <p className="mt-3 text-3xl font-bold">{pendingCount}</p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-100">
                Aprovadas
              </p>
              <p className="mt-3 text-3xl font-bold">{approvedCount}</p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-100">
                Recusadas
              </p>
              <p className="mt-3 text-3xl font-bold">{rejectedCount}</p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-100">
                Compatibilidade media
              </p>
              <p className="mt-3 text-3xl font-bold">
                {averageCompatibility}%
              </p>
            </div>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="mt-8 rounded-[32px] border border-[var(--border)] bg-[var(--surface)] p-16 text-center shadow-[var(--shadow)]">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[var(--border)] border-t-[var(--primary)]" />
          <p className="mt-5 text-sm text-[var(--muted)]">
            Carregando aplicacoes recebidas...
          </p>
        </div>
      ) : null}

      {error ? (
        <div className="mt-8 rounded-[32px] border border-rose-200 bg-rose-50 p-8 shadow-[var(--shadow)]">
          <p className="text-sm font-medium text-rose-700">{error}</p>
        </div>
      ) : null}

      {actionError ? (
        <div className="mt-6 rounded-[28px] border border-rose-200 bg-rose-50 p-6 shadow-[var(--shadow)]">
          <p className="text-sm font-medium text-rose-700">
            {actionError}
          </p>
        </div>
      ) : null}

      {!loading && !error ? (
        <section className="mt-8 space-y-6">
          {items.map((item) => {
            return (
              <article
                key={item.id}
                className="group overflow-hidden rounded-[32px] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)] transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="relative overflow-hidden border-b border-[var(--border)] bg-[linear-gradient(135deg,rgba(15,118,110,0.08),rgba(217,119,6,0.08))] p-6">
                  <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-[rgba(15,118,110,0.12)] blur-3xl" />

                  <div className="relative z-10 flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[var(--primary)] text-2xl font-bold text-white shadow-lg">
                        {item.animalNome.slice(0, 1)}
                      </div>

                      <div>
                        <h2 className="text-2xl font-bold text-[var(--text)]">
                          {item.animalNome}
                        </h2>

                        <p className="mt-1 text-sm text-[var(--muted)]">
                          Aplicacao #{item.id}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[var(--text)] shadow-sm">
                            {item.adotanteNome}
                          </span>

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClassName(
                              item.status
                            )}`}
                          >
                            {formatApplicationStatus(item.status)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-3xl border border-white/40 bg-white/60 p-4 backdrop-blur">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                        Compatibilidade
                      </p>

                      <p className="mt-2 text-3xl font-bold text-[var(--text)]">
                        {item.scoreMatch}%
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 p-6">
                  <div className="grid gap-4 lg:grid-cols-2">
                    <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-2)] p-5">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-[var(--text)]">
                          Nivel de compatibilidade
                        </p>

                        <span className="text-sm font-bold text-[var(--primary-strong)]">
                          {item.scoreMatch}%
                        </span>
                      </div>

                      <div className="mt-4 h-3 overflow-hidden rounded-full bg-white">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${progressColor(
                            item.scoreMatch
                          )}`}
                          style={{
                            width: `${item.scoreMatch}%`
                          }}
                        />
                      </div>
                    </div>

                    <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-2)] p-5">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-[var(--text)]">
                          Chance de retorno
                        </p>

                        <span className="text-sm font-bold text-rose-600">
                          {item.chanceRetorno}%
                        </span>
                      </div>

                      <div className="mt-4 h-3 overflow-hidden rounded-full bg-white">
                        <div
                          className="h-full rounded-full bg-rose-500 transition-all duration-500"
                          style={{
                            width: `${item.chanceRetorno}%`
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {item.motivosChanceRetorno.length > 0 ? (
                    <div className="rounded-3xl border border-[var(--border)] bg-white p-5">
                      <p className="text-sm font-semibold text-[var(--text)]">
                        Principais observacoes
                      </p>

                      <div className="mt-4 grid gap-3">
                        {item.motivosChanceRetorno
                          .slice(0, 3)
                          .map((motivo) => (
                            <div
                              key={motivo}
                              className="flex items-start gap-3 rounded-2xl bg-[var(--surface-2)] p-4"
                            >
                              <div className="mt-1 h-2.5 w-2.5 rounded-full bg-[var(--primary)]" />

                              <p className="text-sm leading-6 text-[var(--muted)]">
                                {motivo}
                              </p>
                            </div>
                          ))}
                      </div>
                    </div>
                  ) : null}

                  <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border)] pt-5">
                    <Link
                      href={`/animais/${item.animalId}`}
                      className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-5 py-3 text-sm font-semibold text-[var(--text)] transition hover:-translate-y-0.5 hover:bg-[var(--surface-2)]"
                    >
                      Ver perfil do animal
                    </Link>

                    {item.status === 'PENDENTE' ? (
                      <div className="flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            handleDecision(item.id, 'recusar')
                          }
                          disabled={actionLoadingId === item.id}
                          className="rounded-full border border-rose-200 bg-white px-5 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 disabled:opacity-70"
                        >
                          {actionLoadingId === item.id
                            ? 'Atualizando...'
                            : 'Recusar'}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDecision(item.id, 'aprovar')
                          }
                          disabled={actionLoadingId === item.id}
                          className="rounded-full bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.02] hover:bg-[var(--primary-strong)] disabled:opacity-70"
                        >
                          {actionLoadingId === item.id
                            ? 'Atualizando...'
                            : 'Aprovar candidatura'}
                        </button>
                      </div>
                    ) : (
                      <div
                        className={`rounded-full px-4 py-2 text-sm font-semibold ${statusClassName(
                          item.status
                        )}`}
                      >
                        Aplicacao {formatApplicationStatus(item.status)}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}

          {items.length === 0 ? (
            <div className="rounded-[32px] border border-dashed border-[var(--border)] bg-[var(--surface)] p-16 text-center shadow-[var(--shadow)]">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[var(--surface-2)] text-3xl">
                🐾
              </div>

              <h2 className="mt-6 text-2xl font-bold text-[var(--text)]">
                Nenhuma aplicacao recebida
              </h2>

              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                Quando adotantes enviarem candidaturas, elas aparecerao aqui
                para analise.
              </p>
            </div>
          ) : null}
        </section>
      ) : null}
    </AppShell>
  );
}
