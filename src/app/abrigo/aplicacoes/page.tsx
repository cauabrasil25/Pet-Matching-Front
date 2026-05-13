"use client";

import { useState } from 'react';
import { AppShell } from '../../../components/layout/AppShell';
import { animals, formatMatchStatus, matches } from '../../../lib/petFixtures';

export default function AplicacoesRecebidasPage() {
  const [items, setItems] = useState(matches);

  return (
    <AppShell
      eyebrow="Abrigo"
      title="Aplicacoes recebidas"
      description="Aprovar ou recusar candidaturas direto da rota do Next."
      secondaryAction={{ label: 'Painel do abrigo', href: '/abrigo/dashboard' }}
    >
      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Pendentes</p>
          <p className="mt-3 text-3xl font-semibold text-[var(--text)]">{items.filter((item) => item.status === 'pending').length}</p>
        </article>
        <article className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Aprovadas</p>
          <p className="mt-3 text-3xl font-semibold text-[var(--text)]">{items.filter((item) => item.status === 'approved').length}</p>
        </article>
        <article className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Recusadas</p>
          <p className="mt-3 text-3xl font-semibold text-[var(--text)]">{items.filter((item) => item.status === 'rejected').length}</p>
        </article>
      </section>

      <div className="mt-6 space-y-4 rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]">
        {items.map((item) => {
          const animal = animals.find((entry) => entry.id === item.petId);

          return (
            <article key={item.id} className="rounded-2xl border border-[var(--border)] bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-[var(--text)]">{item.adopterName} deseja adotar {animal?.name}</h2>
                  <p className="mt-1 text-sm text-[var(--muted)]">{animal?.breed} - {item.score}% de compatibilidade</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.status === 'approved' ? 'bg-[rgba(22,163,74,0.12)] text-green-700' : item.status === 'pending' ? 'bg-[rgba(217,119,6,0.12)] text-amber-700' : 'bg-[rgba(220,38,38,0.12)] text-red-700'}`}>
                  {formatMatchStatus(item.status)}
                </span>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setItems((current) => current.map((entry) => (entry.id === item.id ? { ...entry, status: 'approved' } : entry)))}
                  className="rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
                >
                  Aprovar
                </button>
                <button
                  type="button"
                  onClick={() => setItems((current) => current.map((entry) => (entry.id === item.id ? { ...entry, status: 'rejected' } : entry)))}
                  className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--surface-2)]"
                >
                  Recusar
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </AppShell>
  );
}
