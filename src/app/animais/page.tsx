"use client";

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { AppShell } from '../../components/layout/AppShell';
import { getCurrentUser } from '../../services/authService';
import { projetoService } from '../../services/animalService';
import type { ProjetoPesquisaMatchResponse, ProjetoPesquisaResponse } from '../../types/animal';

type ProjetoItem = {
  projeto: ProjetoPesquisaResponse;
  score?: number;
  indiceAtencao?: number;
  motivosCompatibilidade?: string[];
};

export default function ProjetosPage() {
  const [items, setItems] = useState<ProjetoItem[]>([]);
  const [search, setSearch] = useState('');
  const [area, setArea] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadProjetos() {
      try {
        setLoading(true);
        setError('');
        const user = getCurrentUser();

        if (user?.role === 'ALUNO') {
          const matches = await projetoService.listarComMatching();
          if (active) {
            setItems(matches.map((match: ProjetoPesquisaMatchResponse) => ({
              projeto: match.projeto,
              score: match.score,
              indiceAtencao: match.indiceAtencao,
              motivosCompatibilidade: match.motivosCompatibilidade
            })));
          }
        } else {
          const projetos = await projetoService.listar({ status: 'ABERTO' });
          if (active) {
            setItems(projetos.map((projeto) => ({ projeto })));
          }
        }
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : 'Nao foi possivel carregar os projetos.');
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProjetos();
    return () => {
      active = false;
    };
  }, []);

  const areas = useMemo(() => {
    return [...new Set(items.map((item) => item.projeto.areaTematica))].sort((a, b) => a.localeCompare(b));
  }, [items]);

  const visibleItems = items.filter(({ projeto }) => {
    const haystack = `${projeto.titulo} ${projeto.descricao} ${projeto.areaTematica} ${projeto.cursoPreferencial ?? ''}`.toLowerCase();
    return haystack.includes(search.toLowerCase()) && (area === 'all' || projeto.areaTematica === area);
  });

  return (
    <AppShell
      eyebrow="Projetos"
      title="Projetos de pesquisa"
      description="Explore oportunidades publicadas por professores e veja compatibilidade quando estiver logado como aluno."
      primaryAction={{ label: 'Meu questionario', href: '/adotante/questionario' }}
      secondaryAction={{ label: 'Entrar', href: '/login' }}
    >
      <section className="rounded-[28px] border border-[var(--border)] bg-white p-6 shadow-[var(--shadow)]">
        <div className="grid gap-4 md:grid-cols-[1fr_260px]">
          <input className="rounded-2xl border border-[var(--border)] px-4 py-3" placeholder="Buscar por titulo, descricao, area ou curso" value={search} onChange={(event) => setSearch(event.target.value)} />
          <select className="rounded-2xl border border-[var(--border)] px-4 py-3" value={area} onChange={(event) => setArea(event.target.value)}>
            <option value="all">Todas as areas</option>
            {areas.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </div>
      </section>

      {loading ? <p className="mt-6 text-sm text-[var(--muted)]">Carregando projetos...</p> : null}
      {error ? <p className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p> : null}

      <section className="mt-6 grid gap-4">
        {visibleItems.map(({ projeto, score, indiceAtencao, motivosCompatibilidade }) => (
          <article key={projeto.id} className="rounded-[28px] border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-soft)]">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm font-semibold text-[var(--accent)]">{projeto.areaTematica}</p>
                <h2 className="mt-1 text-2xl font-bold">{projeto.titulo}</h2>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{projeto.descricao}</p>
              </div>
              {typeof score === 'number' ? (
                <div className="rounded-2xl bg-[var(--surface-2)] px-4 py-3 text-center">
                  <p className="text-2xl font-black text-[var(--primary-strong)]">{score}%</p>
                  <p className="text-xs text-[var(--muted)]">match</p>
                </div>
              ) : null}
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-[var(--muted)]">
              <span className="rounded-full bg-[var(--surface-2)] px-3 py-1">{projeto.cargaHorariaSemanal}h/semana</span>
              <span className="rounded-full bg-[var(--surface-2)] px-3 py-1">{projeto.duracaoMeses} meses</span>
              <span className="rounded-full bg-[var(--surface-2)] px-3 py-1">{projeto.vagasPreenchidas}/{projeto.numeroVagas} vagas</span>
              <span className="rounded-full bg-[var(--surface-2)] px-3 py-1">{projeto.status}</span>
              {typeof indiceAtencao === 'number' ? <span className="rounded-full bg-[var(--surface-2)] px-3 py-1">atencao {indiceAtencao}%</span> : null}
            </div>
            {motivosCompatibilidade?.length ? <p className="mt-4 text-sm text-[var(--muted)]">{motivosCompatibilidade.join(' ')}</p> : null}
            <Link className="button mt-5" href={`/animais/${projeto.id}`}>Ver projeto</Link>
          </article>
        ))}
      </section>
    </AppShell>
  );
}
