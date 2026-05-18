"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
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
    return 'border-green-200 bg-green-50 text-green-700';
  }

  if (status === 'PENDENTE') {
    return 'border-amber-200 bg-amber-50 text-amber-700';
  }

  return 'border-red-200 bg-red-50 text-red-700';
}

export default function MinhasAplicacoesPage() {
  const [applications, setApplications] = useState<AplicacaoAdocaoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        setLoading(true);
        setError('');

        const applicationsData = await applicationService.listarMinhas();

        if (active) {
          setApplications(applicationsData);
        }
      } catch (loadError) {
        if (active) {
          const message =
            loadError instanceof Error
              ? loadError.message
              : 'Nao foi possivel carregar as aplicacoes.';

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

  const approvedCount = applications.filter(
    (application) => application.status === 'APROVADA'
  ).length;

  const pendingCount = applications.filter(
    (application) => application.status === 'PENDENTE'
  ).length;

  return (
    <AppShell
      eyebrow="Adotante"
      title="Minhas aplicacoes"
      description="Acompanhe o andamento das candidaturas enviadas."
      secondaryAction={{
        label: 'Questionario',
        href: '/adotante/questionario'
      }}
    >
      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
            Total
          </p>

          <p className="mt-3 text-3xl font-bold text-[var(--text)]">
            {applications.length}
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
            Pendentes
          </p>

          <p className="mt-3 text-3xl font-bold text-amber-700">
            {pendingCount}
          </p>
        </article>
      </section>

      {loading ? (
        <section className="mt-6 rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-10 text-center shadow-[var(--shadow)]">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[var(--border)] border-t-[var(--primary)]" />

          <p className="mt-4 text-sm text-[var(--muted)]">
            Carregando aplicacoes...
          </p>
        </section>
      ) : null}

      {error ? (
        <section className="mt-6 rounded-[28px] border border-red-200 bg-red-50 p-8 text-center shadow-[var(--shadow)]">
          <p className="text-sm font-medium text-red-700">{error}</p>
        </section>
      ) : null}

      {!loading && !error ? (
        <section className="mt-6 space-y-5">
          {applications.map((application) => (
            <article
              key={application.id}
              className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)] transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-2xl font-bold text-[var(--text)]">
                      {application.animalNome}
                    </h2>

                    <span
                      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${statusClassName(application.status)}`}
                    >
                      {formatApplicationStatus(application.status)}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-[var(--muted)]">
                    {application.abrigoNome}
                  </p>

                  <p className="mt-1 text-xs text-[var(--muted)]">
                    Aplicacao #{application.id}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-center">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--accent)]">
                      Match
                    </p>

                    <p className="mt-1 text-2xl font-bold text-[var(--text)]">
                      {application.scoreMatch}%
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-center">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--accent)]">
                      Retorno
                    </p>

                    <p className="mt-1 text-2xl font-bold text-[var(--text)]">
                      {application.chanceRetorno}%
                    </p>
                  </div>
                </div>
              </div>

              {application.motivosCompatibilidade.length > 0 ? (
                <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-5">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
                    Motivos da compatibilidade
                  </h3>

                  <ul className="mt-4 space-y-3">
                    {application.motivosCompatibilidade
                      .slice(0, 3)
                      .map((motivo) => (
                        <li
                          key={motivo}
                          className="flex items-start gap-3 text-sm leading-6 text-[var(--text)]"
                        >
                          <span className="mt-2 h-2 w-2 rounded-full bg-[var(--primary)]" />

                          <span>{motivo}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              ) : null}

              <div className="mt-6 flex flex-col gap-3 border-t border-[var(--border)] pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-[var(--muted)]">
                  Status atual:{' '}
                  <span className="font-semibold text-[var(--text)]">
                    {formatApplicationStatus(application.status)}
                  </span>
                </p>

                <Link
                  href={`/animais/${application.animalId}`}
                  className="inline-flex items-center justify-center rounded-full bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--primary-strong)]"
                >
                  Ver animal
                </Link>
              </div>
            </article>
          ))}

          {applications.length === 0 ? (
            <section className="rounded-[28px] border border-dashed border-[var(--border)] bg-[var(--surface)] p-12 text-center shadow-[var(--shadow)]">
              <p className="text-lg font-semibold text-[var(--text)]">
                Nenhuma aplicacao enviada
              </p>

              <p className="mt-2 text-sm text-[var(--muted)]">
                Explore o catalogo e encontre um novo companheiro.
              </p>

              <Link
                href="/animais"
                className="mt-6 inline-flex rounded-full bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--primary-strong)]"
              >
                Explorar animais
              </Link>
            </section>
          ) : null}
        </section>
      ) : null}
    </AppShell>
  );
}
