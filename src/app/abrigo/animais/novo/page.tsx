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
    sexo: 'MACHO',
    status: 'DISPONIVEL',
    descricao: ''
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

    try {
      setSaving(true);

      const createdAnimal = await animalService.cadastrar({
        nome: form.nome.trim(),
        especie: normalizeApiValue(form.especie),
        porte: normalizeApiValue(form.porte),
        sexo: normalizeApiValue(form.sexo),
        descricao: form.descricao.trim() || undefined
      });

      if (form.status !== 'DISPONIVEL') {
        await animalService.atualizarStatus(createdAnimal.id, { status: form.status });
      }

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
            <span>Sexo</span>
            <select
              className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--primary)]"
              value={form.sexo}
              onChange={(event) => setForm((current) => ({ ...current, sexo: event.target.value }))}
            >
              <option value="MACHO">Macho</option>
              <option value="FEMEA">Femea</option>
            </select>
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
        </div>

        <label className="block space-y-2 text-sm font-medium text-[var(--text)]">
          <span>Descricao</span>
          <textarea
            className="min-h-32 w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--primary)]"
            value={form.descricao}
            onChange={(event) => setForm((current) => ({ ...current, descricao: event.target.value }))}
            placeholder="Conte mais sobre o pet..."
          />
        </label>

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
