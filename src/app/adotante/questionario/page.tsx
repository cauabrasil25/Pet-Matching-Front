"use client";

import { useEffect, useState } from 'react';
import { AppShell } from '../../../components/layout/AppShell';
import { questionnaireService } from '../../../services/questionnaireService';

const emptyForm = {
  areasInteresse: '',
  habilidades: '',
  horasDisponiveisSemana: '10',
  temExperienciaPesquisa: false,
  objetivosAprendizagem: ''
};

export default function QuestionarioAlunoPage() {
  const [form, setForm] = useState(emptyForm);
  const [exists, setExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let active = true;
    async function loadQuestionario() {
      try {
        setLoading(true);
        const data = await questionnaireService.buscar();
        if (active) {
          setForm({
            areasInteresse: data.areasInteresse.join(', '),
            habilidades: data.habilidades.join(', '),
            horasDisponiveisSemana: String(data.horasDisponiveisSemana),
            temExperienciaPesquisa: data.temExperienciaPesquisa,
            objetivosAprendizagem: data.objetivosAprendizagem
          });
          setExists(true);
        }
      } catch {
        if (active) setExists(false);
      } finally {
        if (active) setLoading(false);
      }
    }
    loadQuestionario();
    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setMessage('');

    const payload = {
      areasInteresse: splitList(form.areasInteresse),
      habilidades: splitList(form.habilidades),
      horasDisponiveisSemana: Number(form.horasDisponiveisSemana),
      temExperienciaPesquisa: form.temExperienciaPesquisa,
      objetivosAprendizagem: form.objetivosAprendizagem.trim()
    };

    try {
      setSaving(true);
      if (exists) {
        await questionnaireService.atualizar(payload);
      } else {
        await questionnaireService.cadastrar(payload);
        setExists(true);
      }
      setMessage('Questionario salvo com sucesso.');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Nao foi possivel salvar o questionario.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <AppShell
      eyebrow="Aluno"
      title="Questionario de pesquisa"
      description="Informe interesses, habilidades e disponibilidade para melhorar o matching com projetos."
      secondaryAction={{ label: 'Projetos', href: '/animais' }}
    >
      {loading ? <p className="mb-4 text-sm text-[var(--muted)]">Carregando questionario...</p> : null}
      <form className="grid gap-4 rounded-[28px] border border-[var(--border)] bg-white p-6 shadow-[var(--shadow)]" onSubmit={handleSubmit}>
        <label className="grid gap-2">
          <span className="font-semibold">Areas de interesse</span>
          <input className="rounded-2xl border border-[var(--border)] px-4 py-3" value={form.areasInteresse} onChange={(event) => setForm((current) => ({ ...current, areasInteresse: event.target.value }))} placeholder="IA, educacao, saude" required />
          <span className="text-xs leading-5 text-[var(--muted)]">Liste as areas em que voce gostaria de pesquisar, separando cada uma por virgula.</span>
        </label>
        <label className="grid gap-2">
          <span className="font-semibold">Habilidades</span>
          <input className="rounded-2xl border border-[var(--border)] px-4 py-3" value={form.habilidades} onChange={(event) => setForm((current) => ({ ...current, habilidades: event.target.value }))} placeholder="Python, escrita academica, estatistica" required />
          <span className="text-xs leading-5 text-[var(--muted)]">Informe conhecimentos, ferramentas ou competencias que voce ja possui, tambem separados por virgula.</span>
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2">
            <span className="font-semibold">Horas disponiveis por semana</span>
            <input className="rounded-2xl border border-[var(--border)] px-4 py-3" type="number" min="1" placeholder="Ex: 10" value={form.horasDisponiveisSemana} onChange={(event) => setForm((current) => ({ ...current, horasDisponiveisSemana: event.target.value }))} required />
            <span className="text-xs leading-5 text-[var(--muted)]">Quantidade aproximada de horas que voce pode dedicar a projetos de pesquisa.</span>
          </label>
          <label className="grid gap-2 rounded-2xl border border-[var(--border)] px-4 py-3">
            <span className="flex items-center gap-3">
              <input type="checkbox" checked={form.temExperienciaPesquisa} onChange={(event) => setForm((current) => ({ ...current, temExperienciaPesquisa: event.target.checked }))} />
              <span className="font-semibold">Tenho experiencia em pesquisa</span>
            </span>
            <span className="text-xs leading-5 text-[var(--muted)]">Marque se voce ja participou de iniciacao cientifica, projeto academico ou atividade semelhante.</span>
          </label>
        </div>
        <label className="grid gap-2">
          <span className="font-semibold">Objetivos de aprendizagem</span>
          <textarea className="min-h-32 rounded-2xl border border-[var(--border)] px-4 py-3" value={form.objetivosAprendizagem} onChange={(event) => setForm((current) => ({ ...current, objetivosAprendizagem: event.target.value }))} placeholder="Ex: Quero aprender metodologia cientifica, praticar analise de dados e publicar meu primeiro artigo." required />
          <span className="text-xs leading-5 text-[var(--muted)]">Descreva o que voce espera aprender ou desenvolver participando de um projeto.</span>
        </label>
        <button className="rounded-full bg-[var(--primary)] px-5 py-3 font-semibold text-white disabled:opacity-70" disabled={saving}>{saving ? 'Salvando...' : 'Salvar questionario'}</button>
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        {message ? <p className="text-sm text-[var(--primary-strong)]">{message}</p> : null}
      </form>
    </AppShell>
  );
}

function splitList(value: string) {
  return value.split(',').map((item) => item.trim()).filter(Boolean);
}
