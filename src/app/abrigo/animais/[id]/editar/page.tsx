"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AppShell } from '../../../../../components/layout/AppShell';
import { animalService } from '../../../../../services/animalService';

function normalizeApiValue(value: string) {
  return value.trim().toUpperCase().replace(/\s+/g, '_');
}

function formatLabel(value: string) {
  return value
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function EditarAnimalPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const animalId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [form, setForm] = useState({
    nome: '',
    especie: 'CACHORRO',
    porte: 'MEDIO',
    sexo: 'MACHO',
    status: 'DISPONIVEL',
    descricao: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    let active = true;

    async function loadAnimal() {
      if (!animalId) {
        setError('Animal invalido.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');

        const animal = await animalService.buscarPorId(animalId);
        if (!active) return;

        setForm({
          nome: animal.nome,
          especie: animal.especie,
          porte: animal.porte,
          sexo: animal.sexo,
          status: animal.status,
          descricao: animal.descricao ?? ''
        });
      } catch (loadError) {
        if (active) {
          const message = loadError instanceof Error ? loadError.message : 'Nao foi possivel carregar o animal.';
          setError(message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadAnimal();

    return () => {
      active = false;
    };
  }, [animalId]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback('');
    setError('');

    if (!animalId) {
      setError('Animal invalido.');
      return;
    }

    try {
      setSaving(true);

      await animalService.atualizar(animalId, {
        nome: form.nome.trim(),
        especie: normalizeApiValue(form.especie),
        porte: normalizeApiValue(form.porte),
        sexo: normalizeApiValue(form.sexo),
        descricao: form.descricao.trim() || undefined
      });

      await animalService.atualizarStatus(animalId, { status: form.status });

      setFeedback(`Animal ${form.nome.trim()} atualizado com sucesso.`);
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : 'Nao foi possivel atualizar o animal.';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppShell
      eyebrow="Abrigo"
      title={form.nome ? `Editar ${form.nome}` : 'Editar animal'}
      description="Formulario de edicao ligado a rota dinamica do Next."
      secondaryAction={{ label: 'Meus animais', href: '/abrigo/animais' }}
    >
      <section className="grid gap-6 lg:grid-cols-[1fr_0.85fr]">
        {loading ? (
          <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-8 text-center text-sm text-[var(--muted)] shadow-[var(--shadow)] lg:col-span-2">
            Carregando dados do animal...
          </div>
        ) : null}

        {error ? (
          <div className="rounded-[28px] border border-red-200 bg-red-50 p-6 text-sm text-red-700 shadow-[var(--shadow)] lg:col-span-2">
            {error}
          </div>
        ) : null}

        <form className="space-y-4 rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block space-y-2 text-sm font-medium text-[var(--text)]">
              <span>Nome</span>
              <input
                className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--primary)]"
                value={form.nome}
                onChange={(event) => setForm((current) => ({ ...current, nome: event.target.value }))}
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
            />
          </label>

          <div className="flex gap-3">
            <button type="submit" disabled={loading || saving} className="rounded-full bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--primary-strong)] disabled:opacity-70">
              {saving ? 'Salvando...' : 'Salvar alteracoes'}
            </button>
            <button type="button" onClick={() => router.push('/abrigo/animais')} className="rounded-full border border-[var(--border)] bg-white px-5 py-3 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--surface-2)]">
              Voltar
            </button>
          </div>

          {feedback ? <p className="text-sm text-[var(--primary-strong)]">{feedback}</p> : null}
        </form>

        <aside className="space-y-6">
          <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]">
            <h2 className="text-xl font-semibold text-[var(--text)]">Resumo atual</h2>
            <div className="mt-4 space-y-3 text-sm text-[var(--muted)]">
              <p>{formatLabel(form.especie)} - {formatLabel(form.porte)}</p>
              <p>Sexo: {formatLabel(form.sexo)}</p>
              <p>Status: {formatLabel(form.status)}</p>
            </div>
          </div>

          <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[28px] border border-[var(--border)] bg-[linear-gradient(145deg,rgba(15,118,110,0.16),rgba(217,119,6,0.16))] shadow-[var(--shadow)]">
            <span className="text-8xl font-semibold uppercase tracking-[0.08em] text-[var(--primary-strong)]">
              {(form.nome || 'A').slice(0, 1)}
            </span>
          </div>
        </aside>
      </section>
    </AppShell>
  );
}
