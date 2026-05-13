"use client";

import { useState } from 'react';
import { AppShell } from '../../../../components/layout/AppShell';

export default function NovoAnimalPage() {
  const [form, setForm] = useState({
    name: '',
    species: 'dog',
    breed: '',
    age: '',
    size: 'medium',
    status: 'DISPONIVEL',
    imageUrl: '',
    description: '',
    nivelEnergia: 'MEDIO',
    nivelBarulho: 'BAIXO'
  });
  const [feedback, setFeedback] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(`Animal ${form.name || 'sem nome'} preparado para cadastro.`);
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
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              placeholder="Ex: Rex"
            />
          </label>

          <label className="block space-y-2 text-sm font-medium text-[var(--text)]">
            <span>Especie</span>
            <select
              className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--primary)]"
              value={form.species}
              onChange={(event) => setForm((current) => ({ ...current, species: event.target.value }))}
            >
              <option value="dog">Cachorro</option>
              <option value="cat">Gato</option>
            </select>
          </label>

          <label className="block space-y-2 text-sm font-medium text-[var(--text)]">
            <span>Raca</span>
            <input
              className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--primary)]"
              value={form.breed}
              onChange={(event) => setForm((current) => ({ ...current, breed: event.target.value }))}
              placeholder="Ex: Vira-lata"
            />
          </label>

          <label className="block space-y-2 text-sm font-medium text-[var(--text)]">
            <span>Idade</span>
            <input
              className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--primary)]"
              type="number"
              value={form.age}
              onChange={(event) => setForm((current) => ({ ...current, age: event.target.value }))}
              placeholder="Ex: 3"
            />
          </label>

          <label className="block space-y-2 text-sm font-medium text-[var(--text)]">
            <span>Tamanho</span>
            <select
              className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--primary)]"
              value={form.size}
              onChange={(event) => setForm((current) => ({ ...current, size: event.target.value }))}
            >
              <option value="small">Pequeno</option>
              <option value="medium">Medio</option>
              <option value="large">Grande</option>
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

          <label className="block space-y-2 text-sm font-medium text-[var(--text)]">
            <span>Imagem</span>
            <input
              className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--primary)]"
              value={form.imageUrl}
              onChange={(event) => setForm((current) => ({ ...current, imageUrl: event.target.value }))}
              placeholder="https://..."
            />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
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
        </div>

        <label className="block space-y-2 text-sm font-medium text-[var(--text)]">
          <span>Descricao</span>
          <textarea
            className="min-h-32 w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--primary)]"
            value={form.description}
            onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
            placeholder="Conte mais sobre o pet..."
          />
        </label>

        <div className="flex gap-3">
          <button type="submit" className="rounded-full bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--primary-strong)]">
            Salvar animal
          </button>
          <button type="button" className="rounded-full border border-[var(--border)] bg-white px-5 py-3 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--surface-2)]">
            Cancelar
          </button>
        </div>

        {feedback ? <p className="text-sm text-[var(--primary-strong)]">{feedback}</p> : null}
      </form>
    </AppShell>
  );
}
