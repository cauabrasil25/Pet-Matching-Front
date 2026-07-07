"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AppShell } from '../../../../../components/layout/AppShell';
import { ProjetoForm, initialProjetoForm, toProjetoPayload } from '../../../../../components/projects/ProjetoForm';
import { projetoService } from '../../../../../services/animalService';
import type { StatusProjeto } from '../../../../../types/animal';

export default function EditarProjetoPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const projetoId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [form, setForm] = useState(initialProjetoForm);
  const [status, setStatus] = useState<StatusProjeto>('ABERTO');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        setLoading(true);
        const projeto = await projetoService.buscarPorId(projetoId);
        if (active) {
          setForm({
            titulo: projeto.titulo,
            descricao: projeto.descricao,
            areaTematica: projeto.areaTematica,
            cursoPreferencial: projeto.cursoPreferencial ?? '',
            periodoMinimo: String(projeto.periodoMinimo),
            habilidadesRequeridas: projeto.habilidadesRequeridas.join(', '),
            cargaHorariaSemanal: String(projeto.cargaHorariaSemanal),
            duracaoMeses: String(projeto.duracaoMeses),
            numeroVagas: String(projeto.numeroVagas),
            requerExperienciaPrevia: projeto.requerExperienciaPrevia
          });
          setStatus(projeto.status);
        }
      } catch (loadError) {
        if (active) setError(loadError instanceof Error ? loadError.message : 'Nao foi possivel carregar o projeto.');
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [projetoId]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    try {
      setSaving(true);
      await projetoService.atualizar(projetoId, toProjetoPayload(form));
      await projetoService.atualizarStatus(projetoId, { status });
      router.push('/abrigo/animais');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Nao foi possivel atualizar o projeto.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <AppShell eyebrow="Professor" title="Editar projeto" description="Atualize dados e status do projeto." secondaryAction={{ label: 'Meus projetos', href: '/abrigo/animais' }}>
      {loading ? <p className="mb-4 text-sm text-[var(--muted)]">Carregando...</p> : null}
      <div className="mb-4 rounded-[28px] border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-soft)]">
        <label className="grid gap-2">
          <span className="font-semibold">Status</span>
          <select className="rounded-2xl border border-[var(--border)] px-4 py-3" value={status} onChange={(event) => setStatus(event.target.value as StatusProjeto)}>
            <option value="ABERTO">Aberto</option>
            <option value="EM_SELECAO">Em selecao</option>
            <option value="ENCERRADO">Encerrado</option>
          </select>
        </label>
      </div>
      <ProjetoForm form={form} setForm={setForm} onSubmit={handleSubmit} saving={saving} error={error} submitLabel="Salvar alteracoes" />
    </AppShell>
  );
}
