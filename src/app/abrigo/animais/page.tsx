"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AppShell } from '../../../components/layout/AppShell';
import { projetoService } from '../../../services/animalService';
import type { ProjetoPesquisaResponse } from '../../../types/animal';

export default function MeusProjetosPage() {
  const [projetos, setProjetos] = useState<ProjetoPesquisaResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        setLoading(true);
        setError('');
        const data = await projetoService.listarMeus();
        if (active) setProjetos(data);
      } catch (loadError) {
        if (active) setError(loadError instanceof Error ? loadError.message : 'Nao foi possivel carregar projetos.');
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
    <AppShell eyebrow="Professor" title="Meus projetos" description="Projetos publicados pelo professor autenticado." primaryAction={{ label: 'Novo projeto', href: '/abrigo/animais/novo' }}>
      {loading ? <p className="text-sm text-[var(--muted)]">Carregando...</p> : null}
      {error ? <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p> : null}
      <section className="grid gap-4">
        {projetos.map((projeto) => (
          <article key={projeto.id} className="rounded-[28px] border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-soft)]">
            <p className="text-sm font-semibold text-[var(--accent)]">{projeto.status}</p>
            <h2 className="mt-1 text-2xl font-bold">{projeto.titulo}</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{projeto.descricao}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-[var(--muted)]">
              <span className="rounded-full bg-[var(--surface-2)] px-3 py-1">{projeto.areaTematica}</span>
              <span className="rounded-full bg-[var(--surface-2)] px-3 py-1">{projeto.vagasPreenchidas}/{projeto.numeroVagas} vagas</span>
              <span className="rounded-full bg-[var(--surface-2)] px-3 py-1">{projeto.cargaHorariaSemanal}h/semana</span>
            </div>
            <Link className="button mt-5" href={`/abrigo/animais/${projeto.id}/editar`}>Editar</Link>
          </article>
        ))}
        {!loading && projetos.length === 0 ? <p className="rounded-2xl border border-[var(--border)] bg-white p-6 text-sm text-[var(--muted)]">Nenhum projeto cadastrado.</p> : null}
      </section>
    </AppShell>
  );
}
