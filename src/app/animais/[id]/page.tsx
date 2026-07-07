"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AppShell } from '../../../components/layout/AppShell';
import { getCurrentUser } from '../../../services/authService';
import { candidaturaService } from '../../../services/applicationService';
import { projetoService } from '../../../services/animalService';
import type { ProjetoPesquisaResponse } from '../../../types/animal';

export default function ProjetoDetailPage() {
  const params = useParams<{ id: string }>();
  const projetoId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [projeto, setProjeto] = useState<ProjetoPesquisaResponse | null>(null);
  const [isAluno, setIsAluno] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setIsAluno(getCurrentUser()?.role === 'ALUNO');
  }, []);

  useEffect(() => {
    let active = true;
    async function loadProjeto() {
      try {
        setLoading(true);
        setError('');
        const data = await projetoService.buscarPorId(projetoId);
        if (active) setProjeto(data);
      } catch (loadError) {
        if (active) setError(loadError instanceof Error ? loadError.message : 'Nao foi possivel carregar o projeto.');
      } finally {
        if (active) setLoading(false);
      }
    }
    if (projetoId) loadProjeto();
    return () => {
      active = false;
    };
  }, [projetoId]);

  async function candidatar() {
    try {
      setSaving(true);
      setError('');
      await candidaturaService.criar({ projetoId });
      setMessage('Candidatura enviada com sucesso.');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Nao foi possivel enviar a candidatura.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <AppShell eyebrow="Projeto" title={projeto?.titulo ?? 'Detalhes do projeto'} description="Informacoes completas da oportunidade de pesquisa.">
      {loading ? <p className="text-sm text-[var(--muted)]">Carregando...</p> : null}
      {error ? <p className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p> : null}
      {projeto ? (
        <article className="rounded-[28px] border border-[var(--border)] bg-white p-6 shadow-[var(--shadow)]">
          <p className="text-sm font-semibold text-[var(--accent)]">{projeto.areaTematica}</p>
          <h2 className="mt-2 text-3xl font-black">{projeto.titulo}</h2>
          <p className="mt-4 leading-7 text-[var(--muted)]">{projeto.descricao}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Info label="Professor" value={projeto.professorNome} />
            <Info label="Curso preferencial" value={projeto.cursoPreferencial ?? 'Nao informado'} />
            <Info label="Periodo minimo" value={`${projeto.periodoMinimo}`} />
            <Info label="Carga horaria" value={`${projeto.cargaHorariaSemanal}h/semana`} />
            <Info label="Duracao" value={`${projeto.duracaoMeses} meses`} />
            <Info label="Vagas" value={`${projeto.vagasPreenchidas}/${projeto.numeroVagas}`} />
            <Info label="Experiencia previa" value={projeto.requerExperienciaPrevia ? 'Sim' : 'Nao'} />
            <Info label="Status" value={projeto.status} />
          </div>
          <div className="mt-6">
            <h3 className="font-bold">Habilidades requeridas</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {projeto.habilidadesRequeridas.map((habilidade) => <span key={habilidade} className="rounded-full bg-[var(--surface-2)] px-3 py-1 text-sm">{habilidade}</span>)}
            </div>
          </div>
          {isAluno ? (
            <button className="mt-6 rounded-full bg-[var(--primary)] px-5 py-3 font-semibold text-white disabled:opacity-70" onClick={candidatar} disabled={saving || projeto.status !== 'ABERTO'}>
              {saving ? 'Enviando...' : 'Candidatar-se'}
            </button>
          ) : null}
          {message ? <p className="mt-4 text-sm text-[var(--primary-strong)]">{message}</p> : null}
        </article>
      ) : null}
    </AppShell>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-3)] p-4">
      <p className="text-xs font-semibold uppercase text-[var(--muted)]">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}
