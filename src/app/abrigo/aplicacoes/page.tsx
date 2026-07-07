"use client";

import { useEffect, useState } from 'react';
import { AppShell } from '../../../components/layout/AppShell';
import { candidaturaService } from '../../../services/applicationService';
import type { CandidaturaProjetoResponse } from '../../../types/application';

export default function CandidaturasRecebidasPage() {
  const [items, setItems] = useState<CandidaturaProjetoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    try {
      setLoading(true);
      setError('');
      setItems(await candidaturaService.listarRecebidas());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Nao foi possivel carregar candidaturas.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function decide(id: string, action: 'aprovar' | 'recusar') {
    try {
      setError('');
      if (action === 'aprovar') {
        await candidaturaService.aprovar(id);
      } else {
        await candidaturaService.recusar(id);
      }
      await load();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Nao foi possivel atualizar a candidatura.');
    }
  }

  return (
    <AppShell eyebrow="Professor" title="Candidaturas recebidas" description="Avalie alunos candidatos aos seus projetos." secondaryAction={{ label: 'Meus projetos', href: '/abrigo/animais' }}>
      {loading ? <p className="text-sm text-[var(--muted)]">Carregando...</p> : null}
      {error ? <p className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p> : null}
      <section className="grid gap-4">
        {items.map((item) => (
          <article key={item.id} className="rounded-[28px] border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-soft)]">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm font-semibold text-[var(--accent)]">{item.status}</p>
                <h2 className="text-xl font-bold">{item.alunoNome}</h2>
                <p className="mt-2 text-sm text-[var(--muted)]">Projeto: {item.projetoTitulo}</p>
              </div>
              {typeof item.scoreCompatibilidade === 'number' ? <strong className="rounded-full bg-[var(--surface-2)] px-4 py-2">{Math.round(item.scoreCompatibilidade)}% match</strong> : null}
            </div>
            {item.motivosCompatibilidade?.length ? <p className="mt-4 text-sm text-[var(--muted)]">{item.motivosCompatibilidade.join(' ')}</p> : null}
            {item.status === 'PENDENTE' ? (
              <div className="mt-5 flex gap-3">
                <button className="rounded-full bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white" onClick={() => decide(item.id, 'aprovar')}>Aprovar</button>
                <button className="rounded-full border border-[var(--border)] bg-white px-5 py-3 text-sm font-semibold" onClick={() => decide(item.id, 'recusar')}>Recusar</button>
              </div>
            ) : null}
          </article>
        ))}
        {!loading && items.length === 0 ? <p className="rounded-2xl border border-[var(--border)] bg-white p-6 text-sm text-[var(--muted)]">Nenhuma candidatura recebida.</p> : null}
      </section>
    </AppShell>
  );
}
