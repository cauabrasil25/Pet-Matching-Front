"use client";

import { useState } from 'react';
import { AppShell } from '../../../../../components/layout/AppShell';
import { animals, formatSize, formatSpecies } from '../../../../../lib/petFixtures';

type EditAnimalPageProps = {
  params: {
    id: string;
  };
};

export default function EditarAnimalPage({ params }: EditAnimalPageProps) {
  const animal = animals.find((entry) => entry.id === params.id) ?? animals[0];
  const [form, setForm] = useState({
    name: animal.name,
    species: animal.species,
    breed: animal.breed,
    age: String(animal.age),
    size: animal.size,
    status: animal.status,
    imageUrl: animal.imageUrl,
    description: animal.description
  });
  const [feedback, setFeedback] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(`Animal ${form.name} atualizado com sucesso.`);
  };

  return (
    <AppShell
      eyebrow="Abrigo"
      title={`Editar ${animal.name}`}
      description="Formulario de edicao ligado a rota dinamica do Next."
      secondaryAction={{ label: 'Meus animais', href: '/abrigo/animais' }}
    >
      <section className="grid gap-6 lg:grid-cols-[1fr_0.85fr]">
        <form className="space-y-4 rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block space-y-2 text-sm font-medium text-[var(--text)]">
              <span>Nome</span>
              <input
                className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--primary)]"
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              />
            </label>

            <label className="block space-y-2 text-sm font-medium text-[var(--text)]">
              <span>Especie</span>
              <select
                className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--primary)]"
                value={form.species}
                onChange={(event) => setForm((current) => ({ ...current, species: event.target.value as typeof form.species }))}
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
              />
            </label>

            <label className="block space-y-2 text-sm font-medium text-[var(--text)]">
              <span>Idade</span>
              <input
                className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--primary)]"
                type="number"
                value={form.age}
                onChange={(event) => setForm((current) => ({ ...current, age: event.target.value }))}
              />
            </label>

            <label className="block space-y-2 text-sm font-medium text-[var(--text)]">
              <span>Tamanho</span>
              <select
                className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--primary)]"
                value={form.size}
                onChange={(event) => setForm((current) => ({ ...current, size: event.target.value as typeof form.size }))}
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
                onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as typeof form.status }))}
              >
                <option value="DISPONIVEL">Disponivel</option>
                <option value="PENDENTE">Pendente</option>
                <option value="ADOTADO">Adotado</option>
              </select>
            </label>
          </div>

          <label className="block space-y-2 text-sm font-medium text-[var(--text)]">
            <span>Imagem</span>
            <input
              className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--primary)]"
              value={form.imageUrl}
              onChange={(event) => setForm((current) => ({ ...current, imageUrl: event.target.value }))}
            />
          </label>

          <label className="block space-y-2 text-sm font-medium text-[var(--text)]">
            <span>Descricao</span>
            <textarea
              className="min-h-32 w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--primary)]"
              value={form.description}
              onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
            />
          </label>

          <div className="flex gap-3">
            <button type="submit" className="rounded-full bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--primary-strong)]">
              Salvar alteracoes
            </button>
            <button type="button" className="rounded-full border border-[var(--border)] bg-white px-5 py-3 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--surface-2)]">
              Publicar status
            </button>
          </div>

          {feedback ? <p className="text-sm text-[var(--primary-strong)]">{feedback}</p> : null}
        </form>

        <aside className="space-y-6">
          <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]">
            <h2 className="text-xl font-semibold text-[var(--text)]">Resumo atual</h2>
            <div className="mt-4 space-y-3 text-sm text-[var(--muted)]">
              <p>{formatSpecies(animal.species)} - {formatSize(animal.size)}</p>
              <p>{animal.shelter}</p>
              <p>{animal.status}</p>
            </div>
          </div>

          <div className="overflow-hidden rounded-[28px] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)]">
            <img src={animal.imageUrl} alt={animal.name} className="aspect-[4/3] w-full object-cover" />
          </div>
        </aside>
      </section>
    </AppShell>
  );
}
