"use client";

export const initialProjetoForm = {
  titulo: '',
  descricao: '',
  areaTematica: '',
  cursoPreferencial: '',
  periodoMinimo: '1',
  habilidadesRequeridas: '',
  cargaHorariaSemanal: '10',
  duracaoMeses: '6',
  numeroVagas: '1',
  requerExperienciaPrevia: false
};

export type ProjetoFormState = typeof initialProjetoForm;

export function ProjetoForm({
  form,
  setForm,
  onSubmit,
  saving,
  error,
  submitLabel
}: {
  form: ProjetoFormState;
  setForm: React.Dispatch<React.SetStateAction<ProjetoFormState>>;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  saving: boolean;
  error: string;
  submitLabel: string;
}) {
  const setField = (field: keyof ProjetoFormState, value: string | boolean) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  return (
    <form className="grid gap-4 rounded-[28px] border border-[var(--border)] bg-white p-6 shadow-[var(--shadow)]" onSubmit={onSubmit}>
      <FormField label="Titulo do projeto" help="Use um nome claro para a oportunidade que sera exibida aos alunos.">
        <input className="rounded-2xl border border-[var(--border)] px-4 py-3" placeholder="Ex: Analise de dados educacionais com IA" value={form.titulo} onChange={(event) => setField('titulo', event.target.value)} required />
      </FormField>

      <FormField label="Descricao" help="Explique o objetivo do projeto, as principais atividades do aluno e os resultados esperados.">
        <textarea className="min-h-32 rounded-2xl border border-[var(--border)] px-4 py-3" placeholder="Ex: O projeto investiga dados de desempenho academico para identificar fatores associados a evasao..." value={form.descricao} onChange={(event) => setField('descricao', event.target.value)} required />
      </FormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Area tematica" help="Informe a area principal do projeto para ajudar no matching.">
          <input className="rounded-2xl border border-[var(--border)] px-4 py-3" placeholder="Ex: Inteligencia Artificial" value={form.areaTematica} onChange={(event) => setField('areaTematica', event.target.value)} required />
        </FormField>

        <FormField label="Curso preferencial" help="Opcional. Indique um curso mais alinhado ao projeto, se houver.">
          <input className="rounded-2xl border border-[var(--border)] px-4 py-3" placeholder="Ex: Ciencia da Computacao" value={form.cursoPreferencial} onChange={(event) => setField('cursoPreferencial', event.target.value)} />
        </FormField>
      </div>

      <FormField label="Habilidades requeridas" help="Liste conhecimentos desejados separados por virgula. Essas habilidades entram no calculo de compatibilidade.">
        <input className="rounded-2xl border border-[var(--border)] px-4 py-3" placeholder="Ex: Python, estatistica, leitura de artigos" value={form.habilidadesRequeridas} onChange={(event) => setField('habilidadesRequeridas', event.target.value)} required />
      </FormField>

      <div className="grid gap-4 sm:grid-cols-4">
        <FormField label="Periodo minimo" help="Menor periodo do aluno aceito no projeto.">
          <input className="rounded-2xl border border-[var(--border)] px-4 py-3" type="number" min="1" placeholder="Ex: 3" value={form.periodoMinimo} onChange={(event) => setField('periodoMinimo', event.target.value)} required />
        </FormField>

        <FormField label="Horas por semana" help="Carga horaria semanal esperada do aluno.">
          <input className="rounded-2xl border border-[var(--border)] px-4 py-3" type="number" min="1" placeholder="Ex: 10" value={form.cargaHorariaSemanal} onChange={(event) => setField('cargaHorariaSemanal', event.target.value)} required />
        </FormField>

        <FormField label="Duracao em meses" help="Tempo previsto de participacao no projeto.">
          <input className="rounded-2xl border border-[var(--border)] px-4 py-3" type="number" min="1" placeholder="Ex: 6" value={form.duracaoMeses} onChange={(event) => setField('duracaoMeses', event.target.value)} required />
        </FormField>

        <FormField label="Numero de vagas" help="Quantidade total de alunos que podem ser aprovados.">
          <input className="rounded-2xl border border-[var(--border)] px-4 py-3" type="number" min="1" placeholder="Ex: 2" value={form.numeroVagas} onChange={(event) => setField('numeroVagas', event.target.value)} required />
        </FormField>
      </div>
      <label className="grid gap-2 rounded-2xl border border-[var(--border)] px-4 py-3">
        <span className="flex items-center gap-3">
          <input type="checkbox" checked={form.requerExperienciaPrevia} onChange={(event) => setField('requerExperienciaPrevia', event.target.checked)} />
          <span className="font-semibold">Requer experiencia previa</span>
        </span>
        <span className="text-xs leading-5 text-[var(--muted)]">Marque se o aluno precisa ja ter participado de pesquisa ou projeto semelhante.</span>
      </label>
      <button className="rounded-full bg-[var(--primary)] px-5 py-3 font-semibold text-white disabled:opacity-70" disabled={saving}>{saving ? 'Salvando...' : submitLabel}</button>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
    </form>
  );
}

function FormField({
  label,
  help,
  children
}: {
  label: string;
  help: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2 text-sm">
      <span className="font-semibold text-[var(--text)]">{label}</span>
      {children}
      <span className="text-xs leading-5 text-[var(--muted)]">{help}</span>
    </label>
  );
}

export function toProjetoPayload(form: ProjetoFormState) {
  return {
    titulo: form.titulo.trim(),
    descricao: form.descricao.trim(),
    areaTematica: form.areaTematica.trim(),
    cursoPreferencial: form.cursoPreferencial.trim() || undefined,
    periodoMinimo: Number(form.periodoMinimo),
    habilidadesRequeridas: form.habilidadesRequeridas.split(',').map((item) => item.trim()).filter(Boolean),
    cargaHorariaSemanal: Number(form.cargaHorariaSemanal),
    duracaoMeses: Number(form.duracaoMeses),
    numeroVagas: Number(form.numeroVagas),
    requerExperienciaPrevia: form.requerExperienciaPrevia
  };
}
