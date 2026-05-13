"use client";

import { useState } from 'react';
import { AppShell } from '../../../components/layout/AppShell';
import { adopterProfile, formatProfileValue } from '../../../lib/petFixtures';

const homeTypes = [
  { value: 'CASA', label: 'Casa' },
  { value: 'APARTAMENTO', label: 'Apartamento' },
  { value: 'SITIO', label: 'Sitio' }
] as const;

const activityLevels = [
  { value: 'SEDENTARIO', label: 'Sedentario' },
  { value: 'MODERADO', label: 'Moderado' },
  { value: 'ATIVO', label: 'Ativo' }
] as const;

export default function QuestionarioPage() {
  const [profile, setProfile] = useState(adopterProfile);
  const [saved, setSaved] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaved('Questionario salvo para o perfil do adotante.');
  };

  return (
    <AppShell
      eyebrow="Questionario"
      title="Questionario de perfil"
      description="Tela de respostas do adotante reorganizada para o App Router."
      secondaryAction={{ label: 'Minhas aplicacoes', href: '/adotante/aplicacoes' }}
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        <section className="grid gap-4 lg:grid-cols-2">
          <article className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]">
            <h2 className="text-xl font-semibold text-[var(--text)]">Tipo de moradia</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {homeTypes.map((option) => (
                <label
                  key={option.value}
                  className={`cursor-pointer rounded-2xl border p-4 text-sm transition ${profile.tipoMoradia === option.value ? 'border-[var(--primary)] bg-[rgba(15,118,110,0.08)]' : 'border-[var(--border)] bg-white'}`}
                >
                  <input
                    className="sr-only"
                    type="radio"
                    name="tipoMoradia"
                    value={option.value}
                    checked={profile.tipoMoradia === option.value}
                    onChange={() => setProfile((current) => ({ ...current, tipoMoradia: option.value }))}
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </article>

          <article className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]">
            <h2 className="text-xl font-semibold text-[var(--text)]">Nivel de atividade</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {activityLevels.map((option) => (
                <label
                  key={option.value}
                  className={`cursor-pointer rounded-2xl border p-4 text-sm transition ${profile.nivelAtividade === option.value ? 'border-[var(--primary)] bg-[rgba(15,118,110,0.08)]' : 'border-[var(--border)] bg-white'}`}
                >
                  <input
                    className="sr-only"
                    type="radio"
                    name="nivelAtividade"
                    value={option.value}
                    checked={profile.nivelAtividade === option.value}
                    onChange={() => setProfile((current) => ({ ...current, nivelAtividade: option.value }))}
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </article>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <article className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]">
            <h2 className="text-xl font-semibold text-[var(--text)]">Tolerancia a barulho</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                { value: 'ALTA', label: 'Alta' },
                { value: 'BAIXA', label: 'Baixa' }
              ].map((option) => (
                <label
                  key={option.value}
                  className={`cursor-pointer rounded-2xl border p-4 text-sm transition ${profile.toleranciaBarulho === option.value ? 'border-[var(--primary)] bg-[rgba(15,118,110,0.08)]' : 'border-[var(--border)] bg-white'}`}
                >
                  <input
                    className="sr-only"
                    type="radio"
                    name="toleranciaBarulho"
                    value={option.value}
                    checked={profile.toleranciaBarulho === option.value}
                    onChange={() => setProfile((current) => ({ ...current, toleranciaBarulho: option.value as 'ALTA' | 'BAIXA' }))}
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </article>

          <article className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]">
            <h2 className="text-xl font-semibold text-[var(--text)]">Convivencia</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                { key: 'temCriancas' as const, label: 'Tem criancas em casa?' },
                { key: 'temOutrosPets' as const, label: 'Tem outros pets em casa?' }
              ].map((item) => (
                <div key={item.key} className="rounded-2xl border border-[var(--border)] bg-white p-4">
                  <p className="text-sm font-medium text-[var(--text)]">{item.label}</p>
                  <div className="mt-3 flex gap-2 text-sm">
                    <button
                      type="button"
                      onClick={() => setProfile((current) => ({ ...current, [item.key]: true }))}
                      className={`rounded-full border px-4 py-2 transition ${profile[item.key] === true ? 'border-[var(--primary)] bg-[rgba(15,118,110,0.08)]' : 'border-[var(--border)] bg-white'}`}
                    >
                      Sim
                    </button>
                    <button
                      type="button"
                      onClick={() => setProfile((current) => ({ ...current, [item.key]: false }))}
                      className={`rounded-full border px-4 py-2 transition ${profile[item.key] === false ? 'border-[var(--primary)] bg-[rgba(15,118,110,0.08)]' : 'border-[var(--border)] bg-white'}`}
                    >
                      Nao
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-[var(--text)]">Resumo atual</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">As respostas abaixo refletem o questionario editado no Next.</p>
            </div>
            <button type="submit" className="rounded-full bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--primary-strong)]">
              Salvar respostas
            </button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {([
              ['tipoMoradia', profile.tipoMoradia],
              ['nivelAtividade', profile.nivelAtividade],
              ['toleranciaBarulho', profile.toleranciaBarulho],
              ['temCriancas', profile.temCriancas],
              ['temOutrosPets', profile.temOutrosPets]
            ] as const).map(([key, value]) => (
              <div key={key} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">{key}</p>
                <p className="mt-2 text-sm font-medium text-[var(--text)]">{formatProfileValue(key, value)}</p>
              </div>
            ))}
          </div>

          {saved ? <p className="mt-4 text-sm text-[var(--primary-strong)]">{saved}</p> : null}
        </section>
      </form>
    </AppShell>
  );
}
