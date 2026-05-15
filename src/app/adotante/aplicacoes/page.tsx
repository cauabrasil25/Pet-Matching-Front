"use client";

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
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

export default function MinhasAplicacoesPage() {
  const [applications, setApplications] = useState<AplicacaoAdocaoResponse[]>([]);
  const [animals, setAnimals] = useState<AnimalResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        setLoading(true);
        setError('');

        const [applicationsData, animalsData] = await Promise.all([
          applicationService.listarMinhas(),
          animalService.listar()
        ]);

        if (active) {
          setApplications(applicationsData);
          setAnimals(animalsData);
        }
      } catch (loadError) {
        if (active) {
          const message = loadError instanceof Error ? loadError.message : 'Nao foi possivel carregar as aplicacoes.';
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

  const approvedCount = applications.filter((application) => application.status === 'APROVADA').length;
  const pendingCount = applications.filter((application) => application.status === 'PENDENTE').length;

  return (
    <AppShell
      eyebrow="Adotante"
      title="Minhas aplicacoes"
      description="Historico de candidaturas migrado para uma pagina real no Next."
      secondaryAction={{ label: 'Questionario', href: '/adotante/questionario' }}
    >
      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Total</p>
          <p className="mt-3 text-3xl font-semibold text-[var(--text)]">{applications.length}</p>
        </article>
        <article className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Aprovadas</p>
          <p className="mt-3 text-3xl font-semibold text-[var(--text)]">{approvedCount}</p>
        </article>
        <article className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Pendentes</p>
          <p className="mt-3 text-3xl font-semibold text-[var(--text)]">{pendingCount}</p>
        </article>
      </section>

      {loading ? (
        <div className="mt-6 rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-8 text-center text-sm text-[var(--muted)] shadow-[var(--shadow)]">
          Carregando aplicacoes...
        </div>
      ) : null}

      {error ? (
        <div className="mt-6 rounded-[28px] border border-red-200 bg-red-50 p-8 text-center text-sm text-red-700 shadow-[var(--shadow)]">
          {error}
        </div>
      ) : null}

      {!loading && !error ? <div className="mt-6 space-y-4 rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]">
        {applications.map((application) => {
          const animal = animalById.get(application.animalId);

          return (
            <article key={application.id} className="rounded-2xl border border-[var(--border)] bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-[var(--text)]">{animal?.nome ?? `Animal ${application.animalId}`}</h2>
                  <p className="mt-1 text-sm text-[var(--muted)]">Aplicacao #{application.id}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClassName(application.status)}`}>
                  {formatApplicationStatus(application.status)}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{application.mensagem ?? 'Sem mensagem enviada nesta aplicacao.'}</p>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                <span className="text-[var(--muted)]">Status atual: {formatApplicationStatus(application.status)}</span>
                <Link href={`/animais/${application.animalId}`} className="font-semibold text-[var(--primary-strong)]">
                  Ver animal
                </Link>
              </div>
            </article>
          );
        })}

        {applications.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">Voce ainda nao enviou aplicacoes.</p>
        ) : null}
      </div> : null}
    </AppShell>
  );
}
