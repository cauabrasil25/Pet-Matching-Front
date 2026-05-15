"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useEffect, useMemo } from 'react';
import { AppShell } from '../../../components/layout/AppShell';
import { applicationService } from '../../../services/applicationService';
import { animalService } from '../../../services/animalService';
import type { AplicacaoAdocaoResponse, StatusAplicacao } from '../../../types/application';
import type { AnimalResponse } from '../../../types/animal';

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

export default function AplicacoesRecebidasPage() {
  const [items, setItems] = useState<AplicacaoAdocaoResponse[]>([]);
  const [animals, setAnimals] = useState<AnimalResponse[]>([]);
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

        const [applicationsData, animalsData] = await Promise.all([
          applicationService.listarRecebidas(),
          animalService.listar()
        ]);

        if (active) {
          setItems(applicationsData);
          setAnimals(animalsData);
        }
      } catch (loadError) {
        if (active) {
          const message = loadError instanceof Error ? loadError.message : 'Nao foi possivel carregar as aplicacoes recebidas.';
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

  const animalById = useMemo(() => {
    return new Map(animals.map((animal) => [animal.id, animal]));
  }, [animals]);

  async function handleDecision(applicationId: string, decision: 'aprovar' | 'recusar') {
    try {
      setActionError('');
      setActionLoadingId(applicationId);

      const updated = decision === 'aprovar'
        ? await applicationService.aprovar(applicationId)
        : await applicationService.recusar(applicationId);

      setItems((current) => current.map((entry) => (entry.id === applicationId ? updated : entry)));
    } catch (decisionError) {
      const message = decisionError instanceof Error ? decisionError.message : 'Nao foi possivel atualizar o status da aplicacao.';
      setActionError(message);
    } finally {
      setActionLoadingId('');
    }
  }

  const pendingCount = items.filter((item) => item.status === 'PENDENTE').length;
  const approvedCount = items.filter((item) => item.status === 'APROVADA').length;
  const rejectedCount = items.filter((item) => item.status === 'RECUSADA').length;

  return (
    <AppShell
      eyebrow="Abrigo"
      title="Aplicacoes recebidas"
      description="Aprovar ou recusar candidaturas direto da rota do Next."
      secondaryAction={{ label: 'Painel do abrigo', href: '/abrigo/dashboard' }}
    >
      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Pendentes</p>
          <p className="mt-3 text-3xl font-semibold text-[var(--text)]">{pendingCount}</p>
        </article>
        <article className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Aprovadas</p>
          <p className="mt-3 text-3xl font-semibold text-[var(--text)]">{approvedCount}</p>
        </article>
        <article className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Recusadas</p>
          <p className="mt-3 text-3xl font-semibold text-[var(--text)]">{rejectedCount}</p>
        </article>
      </section>

      {loading ? (
        <div className="mt-6 rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-8 text-center text-sm text-[var(--muted)] shadow-[var(--shadow)]">
          Carregando aplicacoes recebidas...
        </div>
      ) : null}

      {error ? (
        <div className="mt-6 rounded-[28px] border border-red-200 bg-red-50 p-8 text-center text-sm text-red-700 shadow-[var(--shadow)]">
          {error}
        </div>
      ) : null}

      {actionError ? (
        <div className="mt-6 rounded-[28px] border border-red-200 bg-red-50 p-6 text-sm text-red-700 shadow-[var(--shadow)]">
          {actionError}
        </div>
      ) : null}

      {!loading && !error ? <div className="mt-6 space-y-4 rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]">
        {items.map((item) => {
          const animal = animalById.get(item.animalId);

          return (
            <article key={item.id} className="rounded-2xl border border-[var(--border)] bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-[var(--text)]">Aplicacao #{item.id}</h2>
                  <p className="mt-1 text-sm text-[var(--muted)]">{animal?.nome ?? `Animal ${item.animalId}`}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClassName(item.status)}`}>
                  {formatApplicationStatus(item.status)}
                </span>
              </div>

              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{item.mensagem ?? 'Sem mensagem enviada.'}</p>

              <div className="mt-3">
                <Link href={`/animais/${item.animalId}`} className="text-sm font-semibold text-[var(--primary-strong)]">
                  Ver animal
                </Link>
              </div>

              {item.status === 'PENDENTE' ? (
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleDecision(item.id, 'aprovar')}
                    disabled={actionLoadingId === item.id}
                    className="rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-70"
                  >
                    {actionLoadingId === item.id ? 'Atualizando...' : 'Aprovar'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDecision(item.id, 'recusar')}
                    disabled={actionLoadingId === item.id}
                    className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--surface-2)] disabled:opacity-70"
                  >
                    {actionLoadingId === item.id ? 'Atualizando...' : 'Recusar'}
                  </button>
                </div>
              ) : null}
            </article>
          );
        })}

        {items.length === 0 ? <p className="text-sm text-[var(--muted)]">Nenhuma aplicacao recebida ate o momento.</p> : null}
      </div> : null}
    </AppShell>
  );
}
