"use client";

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { AppShell } from '../../../components/layout/AppShell';
import { getCurrentUser } from '../../../services/authService';
import { animalService } from '../../../services/animalService';
import { applicationService } from '../../../services/applicationService';
import type { AnimalResponse } from '../../../types/animal';
import type { AplicacaoAdocaoResponse, StatusAplicacao } from '../../../types/application';

function formatLabel(value: string) {
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
  if (status === 'APROVADA') return 'bg-[rgba(22,163,74,0.12)] text-green-700';
  if (status === 'PENDENTE') return 'bg-[rgba(217,119,6,0.12)] text-amber-700';
  return 'bg-[rgba(220,38,38,0.12)] text-red-700';
}

export default function AbrigoDashboardPage() {
  const [animals, setAnimals] = useState<AnimalResponse[]>([]);
  const [applicationItems, setApplicationItems] = useState<AplicacaoAdocaoResponse[]>([]);
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
          const message = loadError instanceof Error ? loadError.message : 'Nao foi possivel carregar o dashboard do abrigo.';
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

  async function handleDecision(applicationId: string, decision: 'aprovar' | 'recusar') {
    try {
      setActionError('');
      setActionLoadingId(applicationId);

      const updated = decision === 'aprovar'
        ? await applicationService.aprovar(applicationId)
        : await applicationService.recusar(applicationId);

      setApplicationItems((current) => current.map((item) => (item.id === applicationId ? updated : item)));
    } catch (decisionError) {
      const message = decisionError instanceof Error ? decisionError.message : 'Nao foi possivel atualizar a aplicacao.';
      setActionError(message);
    } finally {
      setActionLoadingId('');
    }
  }

  const animalById = useMemo(() => {
    return new Map(animals.map((animal) => [animal.id, animal]));
  }, [animals]);

  const pendingCount = applicationItems.filter((item) => item.status === 'PENDENTE').length;
  const approvedCount = applicationItems.filter((item) => item.status === 'APROVADA').length;

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
          <p className="mt-3 text-3xl font-semibold text-[var(--text)]">{animals.length}</p>
        </article>
        <article className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Pendentes</p>
          <p className="mt-3 text-3xl font-semibold text-[var(--text)]">{pendingCount}</p>
        </article>
        <article className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Aprovadas</p>
          <p className="mt-3 text-3xl font-semibold text-[var(--text)]">{approvedCount}</p>
        </article>
        <article className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Conta ativa</p>
          <p className="mt-3 text-lg font-semibold text-[var(--text)]">{currentUser?.nome ?? 'Abrigo'}</p>
        </article>
      </section>

      {loading ? (
        <section className="mt-6 rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-8 text-center text-sm text-[var(--muted)] shadow-[var(--shadow)]">
          Carregando dados do abrigo...
        </section>
      ) : null}

      {error ? (
        <section className="mt-6 rounded-[28px] border border-red-200 bg-red-50 p-8 text-center text-sm text-red-700 shadow-[var(--shadow)]">
          {error}
        </section>
      ) : null}

      {actionError ? (
        <section className="mt-6 rounded-[28px] border border-red-200 bg-red-50 p-6 text-sm text-red-700 shadow-[var(--shadow)]">
          {actionError}
        </section>
      ) : null}

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
            {animals.map((animal) => (
              <article key={animal.id} className="overflow-hidden rounded-2xl border border-[var(--border)] bg-white">
                <div className="flex aspect-[4/3] items-center justify-center bg-[linear-gradient(145deg,rgba(15,118,110,0.16),rgba(217,119,6,0.16))]">
                  <span className="text-6xl font-semibold uppercase tracking-[0.08em] text-[var(--primary-strong)]">
                    {animal.nome.slice(0, 1)}
                  </span>
                </div>
                <div className="space-y-3 p-4">
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--text)]">{animal.nome}</h3>
                    <p className="mt-1 text-sm text-[var(--muted)]">{formatLabel(animal.especie)} - {formatLabel(animal.porte)}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs font-medium text-[var(--muted)]">
                    <span className="rounded-full border border-[var(--border)] px-3 py-1">{formatLabel(animal.sexo)}</span>
                    <span className="rounded-full border border-[var(--border)] px-3 py-1">{formatLabel(animal.status)}</span>
                  </div>
                  <Link href={`/abrigo/animais/${animal.id}/editar`} className="inline-flex rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--surface-2)]">
                    Editar
                  </Link>
                </div>
              </article>
            ))}

            {animals.length === 0 ? <p className="text-sm text-[var(--muted)]">Nenhum animal cadastrado ainda.</p> : null}
          </div>
        </div>

        <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]">
          <h2 className="text-xl font-semibold text-[var(--text)]">Aplicacoes recentes</h2>
          <div className="mt-5 space-y-4">
            {applicationItems.map((application) => {
              const animal = animalById.get(application.animalId);

              return (
                <article key={application.id} className="rounded-2xl border border-[var(--border)] bg-white p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-[var(--text)]">Aplicacao #{application.id} - {animal?.nome ?? `Animal ${application.animalId}`}</h3>
                      <p className="mt-1 text-sm text-[var(--muted)]">{application.mensagem ?? 'Sem mensagem enviada.'}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClassName(application.status)}`}>
                      {formatApplicationStatus(application.status)}
                    </span>
                  </div>

                  {application.status === 'PENDENTE' ? (
                    <div className="mt-4 flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleDecision(application.id, 'aprovar')}
                        disabled={actionLoadingId === application.id}
                        className="rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-70"
                      >
                        {actionLoadingId === application.id ? 'Atualizando...' : 'Aprovar'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDecision(application.id, 'recusar')}
                        disabled={actionLoadingId === application.id}
                        className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--surface-2)] disabled:opacity-70"
                      >
                        {actionLoadingId === application.id ? 'Atualizando...' : 'Recusar'}
                      </button>
                    </div>
                  ) : null}
                </article>
              );
            })}

            {applicationItems.length === 0 ? <p className="text-sm text-[var(--muted)]">Nenhuma aplicacao recente.</p> : null}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
