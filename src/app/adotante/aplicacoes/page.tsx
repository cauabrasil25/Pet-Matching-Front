"use client";

import { useEffect, useState } from 'react';
import { AppShell } from '../../../components/layout/AppShell';
import { candidaturaService } from '../../../services/applicationService';
import type { CandidaturaProjetoResponse } from '../../../types/application';

export default function MinhasCandidaturasPage() {
  const [items, setItems] = useState<CandidaturaProjetoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        setLoading(true);
        setError('');
        const data = await candidaturaService.listarMinhas();
        if (active) setItems(data);
      } catch (loadError) {
        if (active) setError(loadError instanceof Error ? loadError.message : 'Nao foi possivel carregar candidaturas.');
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  return (
    <AppShell eyebrow="Aluno" title="Minhas candidaturas" description="Acompanhe o status das candidaturas enviadas para projetos." primaryAction={{ label: 'Explorar projetos', href: '/animais' }}>
      {loading ? <p className="text-sm text-[var(--muted)]">Carregando...</p> : null}
      {error ? <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p> : null}
      <section className="grid gap-4">
        {items.map((item) => <CandidaturaCard key={item.id} candidatura={item} />)}
        {!loading && items.length === 0 ? <p className="rounded-2xl border border-[var(--border)] bg-white p-6 text-sm text-[var(--muted)]">Nenhuma candidatura enviada.</p> : null}
      </section>
    </AppShell>
  );
}

function CandidaturaCard({ candidatura }: { candidatura: CandidaturaProjetoResponse }) {
  return (
    <article className="rounded-[28px] border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-soft)]">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-semibold text-[var(--accent)]">{candidatura.status}</p>
          <h2 className="text-xl font-bold">{candidatura.projetoTitulo}</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">Professor: {candidatura.professorNome}</p>
        </div>
        {typeof candidatura.scoreCompatibilidade === 'number' ? <strong className="rounded-full bg-[var(--surface-2)] px-4 py-2">{Math.round(candidatura.scoreCompatibilidade)}% match</strong> : null}
      </div>
      {candidatura.motivosCompatibilidade?.length ? <p className="mt-4 text-sm text-[var(--muted)]">{candidatura.motivosCompatibilidade.join(' ')}</p> : null}
      {candidatura.pontosAtencao?.length ? <p className="mt-2 text-sm text-[var(--muted)]">Pontos de atencao: {candidatura.pontosAtencao.join(' ')}</p> : null}
    </article>
  );
}
