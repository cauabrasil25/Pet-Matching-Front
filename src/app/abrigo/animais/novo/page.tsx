"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '../../../../components/layout/AppShell';
import { animalService } from '../../../../services/animalService';

function normalizeApiValue(value: string) {
  return value.trim().toUpperCase().replace(/\s+/g, '_');
}

export default function NovoAnimalPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    nome: '',
    especie: 'CACHORRO',
    porte: 'MEDIO',
    idade: '',
    peso: '',
    status: 'DISPONIVEL',
    nivelEnergia: 'MEDIO',
    nivelBarulho: 'BAIXO',
    temDeficienciaFisica: false,
    temDoencaCronica: false,
    descricaoSaude: '',
    sociavelEstranhos: true,
    sociavelCriancas: true,
    sociavelAnimais: true,
  });
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback('');
    setError('');

    if (!form.nome.trim()) {
      setError('Informe o nome do animal.');
      return;
    }

    const idade = Number(form.idade);
    const peso = Number(form.peso);

    if (!Number.isInteger(idade) || idade < 0) {
      setError('Informe uma idade valida maior ou igual a zero.');
      return;
    }

    if (!Number.isFinite(peso) || peso <= 0) {
      setError('Informe um peso valido maior que zero.');
      return;
    }

    try {
      setSaving(true);

      const createdAnimal = await animalService.cadastrar({
        nome: form.nome.trim(),
        especie: normalizeApiValue(form.especie),
        porte: normalizeApiValue(form.porte),
        idade,
        peso,
        status: normalizeApiValue(form.status) as 'DISPONIVEL' | 'PENDENTE' | 'ADOTADO',
        nivelEnergia: normalizeApiValue(form.nivelEnergia) as 'BAIXO' | 'MEDIO' | 'ALTO',
        nivelBarulho: normalizeApiValue(form.nivelBarulho) as 'BAIXO' | 'ALTO',
        temDeficienciaFisica: form.temDeficienciaFisica,
        temDoencaCronica: form.temDoencaCronica,
        descricaoSaude: form.descricaoSaude.trim() || undefined,
        sociavelEstranhos: form.sociavelEstranhos,
        sociavelCriancas: form.sociavelCriancas,
        sociavelAnimais: form.sociavelAnimais,
      });

      setFeedback(`Animal ${form.nome.trim()} cadastrado com sucesso.`);
      router.push('/abrigo/animais');
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : 'Nao foi possivel cadastrar o animal.';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppShell
      eyebrow="Abrigo"
      title="Cadastrar animal"
      description="Formulario do novo animal adaptado para o padrao Next."
      secondaryAction={{ label: 'Meus animais', href: '/abrigo/animais' }}
    >
      <form className="space-y-6 rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block space-y-2 text-sm font-medium text-[var(--text)]">
            <span>Nome</span>
            <input
              className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--primary)]"
              value={form.nome}
              onChange={(event) => setForm((current) => ({ ...current, nome: event.target.value }))}
              placeholder="Ex: Rex"
            />
          </label>

          <label className="block space-y-2 text-sm font-medium text-[var(--text)]">
            <span>Especie</span>
            <select
              className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--primary)]"
              value={form.especie}
              onChange={(event) => setForm((current) => ({ ...current, especie: event.target.value }))}
            >
              <option value="CACHORRO">Cachorro</option>
              <option value="GATO">Gato</option>
            </select>
          </label>

          <label className="block space-y-2 text-sm font-medium text-[var(--text)]">
            <span>Porte</span>
            <select
              className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--primary)]"
              value={form.porte}
              onChange={(event) => setForm((current) => ({ ...current, porte: event.target.value }))}
            >
              <option value="PEQUENO">Pequeno</option>
              <option value="MEDIO">Medio</option>
              <option value="GRANDE">Grande</option>
            </select>
          </label>

          <label className="block space-y-2 text-sm font-medium text-[var(--text)]">
            <span>Idade</span>
            <input
              type="number"
              min="0"
              className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--primary)]"
              value={form.idade}
              onChange={(event) => setForm((current) => ({ ...current, idade: event.target.value }))}
              placeholder="0"
            />
          </label>

          <label className="block space-y-2 text-sm font-medium text-[var(--text)]">
            <span>Peso (kg)</span>
            <input
              type="number"
              min="0"
              step="0.1"
              className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--primary)]"
              value={form.peso}
              onChange={(event) => setForm((current) => ({ ...current, peso: event.target.value }))}
              placeholder="0.0"
            />
          </label>

          <label className="block space-y-2 text-sm font-medium text-[var(--text)]">
            <span>Status</span>
            <select
              className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--primary)]"
              value={form.status}
              onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))}
            >
              <option value="DISPONIVEL">Disponivel</option>
              <option value="PENDENTE">Pendente</option>
              <option value="ADOTADO">Adotado</option>
            </select>
          </label>

          <label className="block space-y-2 text-sm font-medium text-[var(--text)]">
            <span>Nivel de energia</span>
            <select
              className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--primary)]"
              value={form.nivelEnergia}
              onChange={(event) => setForm((current) => ({ ...current, nivelEnergia: event.target.value }))}
            >
              <option value="BAIXO">Baixo</option>
              <option value="MEDIO">Medio</option>
              <option value="ALTO">Alto</option>
            </select>
          </label>

          <label className="block space-y-2 text-sm font-medium text-[var(--text)]">
            <span>Nivel de barulho</span>
            <select
              className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--primary)]"
              value={form.nivelBarulho}
              onChange={(event) => setForm((current) => ({ ...current, nivelBarulho: event.target.value }))}
            >
              <option value="BAIXO">Baixo</option>
              <option value="ALTO">Alto</option>
            </select>
          </label>

          <label className="block space-y-2 text-sm font-medium text-[var(--text)]">
            <span>Tem deficiência física?</span>
            <select
              className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--primary)]"
              value={String(form.temDeficienciaFisica)}
              onChange={(event) => setForm((current) => ({ ...current, temDeficienciaFisica: event.target.value === 'true' }))}
            >
              <option value="false">Nao</option>
              <option value="true">Sim</option>
            </select>
          </label>

          <label className="block space-y-2 text-sm font-medium text-[var(--text)]">
            <span>Tem doença crônica?</span>
            <select
              className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--primary)]"
              value={String(form.temDoencaCronica)}
              onChange={(event) => setForm((current) => ({ ...current, temDoencaCronica: event.target.value === 'true' }))}
            >
              <option value="false">Nao</option>
              <option value="true">Sim</option>
            </select>
          </label>

          <label className="md:col-span-2 block space-y-2 text-sm font-medium text-[var(--text)]">
            <span>Descrição de saúde</span>
            <textarea
              className="min-h-28 w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--primary)]"
              value={form.descricaoSaude}
              onChange={(event) => setForm((current) => ({ ...current, descricaoSaude: event.target.value }))}
              placeholder="Ex: vacinado, castrado, sem restrições especiais..."
            />
          </label>

          <label className="block space-y-2 text-sm font-medium text-[var(--text)]">
            <span>Sociavel com estranhos?</span>
            <select
              className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--primary)]"
              value={String(form.sociavelEstranhos)}
              onChange={(event) => setForm((current) => ({ ...current, sociavelEstranhos: event.target.value === 'true' }))}
            >
              <option value="false">Nao</option>
              <option value="true">Sim</option>
            </select>
          </label>

          <label className="block space-y-2 text-sm font-medium text-[var(--text)]">
            <span>Sociavel com criancas?</span>
            <select
              className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--primary)]"
              value={String(form.sociavelCriancas)}
              onChange={(event) => setForm((current) => ({ ...current, sociavelCriancas: event.target.value === 'true' }))}
            >
              <option value="false">Nao</option>
              <option value="true">Sim</option>
            </select>
          </label>

          <label className="block space-y-2 text-sm font-medium text-[var(--text)]">
            <span>Sociavel com outros animais?</span>
            <select
              className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--primary)]"
              value={String(form.sociavelAnimais)}
              onChange={(event) => setForm((current) => ({ ...current, sociavelAnimais: event.target.value === 'true' }))}
            >
              <option value="false">Nao</option>
              <option value="true">Sim</option>
            </select>
          </label>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="rounded-full bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--primary-strong)] disabled:opacity-70">
            {saving ? 'Salvando...' : 'Salvar animal'}
          </button>
          <button type="button" onClick={() => router.push('/abrigo/animais')} className="rounded-full border border-[var(--border)] bg-white px-5 py-3 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--surface-2)]">
            Cancelar
          </button>
        </div>

        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        {feedback ? <p className="text-sm text-[var(--primary-strong)]">{feedback}</p> : null}
      </form>
    </AppShell>
  );
}
