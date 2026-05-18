"use client";

import { useEffect, useState } from 'react';
import { AppShell } from '../../../components/layout/AppShell';
import { questionnaireService } from '../../../services/questionnaireService';

type ProfileState = {
  tipoMoradia: 'CASA' | 'APARTAMENTO' | 'SITIO' | null;
  nivelAtividade: 'SEDENTARIO' | 'MODERADO' | 'ATIVO' | null;
  toleranciaBarulho: 'ALTA' | 'BAIXA' | null;
  temCriancas: boolean | null;
  temOutrosPets: boolean | null;
  horasSozinhoAnimal: number | null;
};

const defaultProfile: ProfileState = {
  tipoMoradia: null,
  nivelAtividade: null,
  toleranciaBarulho: null,
  temCriancas: null,
  temOutrosPets: null,
  horasSozinhoAnimal: null
};

function formatProfileValue(key: keyof ProfileState, value: ProfileState[keyof ProfileState]) {
  if (value === null) return 'Nao informado';

  if (key === 'horasSozinhoAnimal') {
    return `${value} hora${value === 1 ? '' : 's'}`;
  }

  if (key === 'tipoMoradia') {
    if (value === 'CASA') return 'Casa';
    if (value === 'APARTAMENTO') return 'Apartamento';
    return 'Sitio';
  }

  if (key === 'nivelAtividade') {
    if (value === 'SEDENTARIO') return 'Sedentario';
    if (value === 'MODERADO') return 'Moderado';
    return 'Ativo';
  }

  if (key === 'toleranciaBarulho') {
    return value === 'ALTA' ? 'Alta' : 'Baixa';
  }

  return value === true ? 'Sim' : 'Nao';
}

function toProfileState(respostas: Record<string, string | number | boolean>): ProfileState {
  const tipoMoradia = typeof respostas.tipoMoradia === 'string' ? respostas.tipoMoradia : null;
  const nivelAtividade = typeof respostas.nivelAtividade === 'string' ? respostas.nivelAtividade : null;
  const toleranciaBarulho = typeof respostas.toleranciaBarulho === 'string' ? respostas.toleranciaBarulho : null;
  const temCriancas = typeof respostas.temCriancas === 'boolean' ? respostas.temCriancas : null;
  const temOutrosPets = typeof respostas.temOutrosPets === 'boolean' ? respostas.temOutrosPets : null;
  const horasSozinhoAnimal = typeof respostas.horasSozinhoAnimal === 'number' ? respostas.horasSozinhoAnimal : null;

  return {
    tipoMoradia: tipoMoradia === 'CASA' || tipoMoradia === 'APARTAMENTO' || tipoMoradia === 'SITIO' ? tipoMoradia : null,
    nivelAtividade: nivelAtividade === 'SEDENTARIO' || nivelAtividade === 'MODERADO' || nivelAtividade === 'ATIVO' ? nivelAtividade : null,
    toleranciaBarulho: toleranciaBarulho === 'ALTA' || toleranciaBarulho === 'BAIXA' ? toleranciaBarulho : null,
    temCriancas,
    temOutrosPets,
    horasSozinhoAnimal
  };
}

function toRequestPayload(profile: ProfileState) {
  return {
    tipoMoradia: profile.tipoMoradia ?? 'CASA',
    nivelAtividade: profile.nivelAtividade ?? 'MODERADO',
    toleranciaBarulho: profile.toleranciaBarulho ?? 'BAIXA',
    temCriancas: profile.temCriancas ?? false,
    temOutrosPets: profile.temOutrosPets ?? false,
    horasSozinhoAnimal: profile.horasSozinhoAnimal ?? 0
  };
}

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
  const [profile, setProfile] = useState<ProfileState>(defaultProfile);
  const [loading, setLoading] = useState(true);
  const [hasExistingQuestionnaire, setHasExistingQuestionnaire] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState('');

  useEffect(() => {
    let active = true;

    async function loadQuestionnaire() {
      try {
        setLoading(true);
        setError('');

        const response = await questionnaireService.buscar();
        if (!active) return;

        setProfile(toProfileState(response));
        setHasExistingQuestionnaire(true);
      } catch (loadError) {
        if (!active) return;

        const message = loadError instanceof Error ? loadError.message : 'Nao foi possivel carregar o questionario.';
        const looksLikeNotFound = /404|nao encontrado|not found/i.test(message);

        if (looksLikeNotFound) {
          setProfile(defaultProfile);
          setHasExistingQuestionnaire(false);
        } else {
          setError(message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadQuestionnaire();

    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaved('');
    setError('');

    try {
      setSaving(true);

      if (hasExistingQuestionnaire) {
        await questionnaireService.atualizar(toRequestPayload(profile));
      } else {
        await questionnaireService.cadastrar(toRequestPayload(profile));
        setHasExistingQuestionnaire(true);
      }

      setSaved('Questionario salvo com sucesso.');
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : 'Nao foi possivel salvar o questionario.';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppShell
      eyebrow="Questionario"
      title="Questionario de perfil"
      description="Tela de respostas do adotante reorganizada para o App Router."
      secondaryAction={{ label: 'Minhas aplicacoes', href: '/adotante/aplicacoes' }}
    >
      {loading ? (
        <section className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-8 text-center text-sm text-[var(--muted)] shadow-[var(--shadow)]">
          Carregando questionario...
        </section>
      ) : null}

      {error ? (
        <section className="mb-6 rounded-[28px] border border-red-200 bg-red-50 p-6 text-sm text-red-700 shadow-[var(--shadow)]">
          {error}
        </section>
      ) : null}

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
          <label className="block space-y-2 text-sm font-medium text-[var(--text)]">
            <span>Horas que o animal fica sozinho por dia</span>
            <input
              type="number"
              min="0"
              max="24"
              className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--primary)]"
              value={profile.horasSozinhoAnimal ?? ''}
              onChange={(event) => setProfile((current) => ({ ...current, horasSozinhoAnimal: event.target.value === '' ? null : Number(event.target.value) }))}
              placeholder="0"
            />
          </label>
        </section>

        <section className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-[var(--text)]">Resumo atual</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">As respostas abaixo refletem o questionario salvo no backend.</p>
            </div>
            <button type="submit" disabled={loading || saving} className="rounded-full bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--primary-strong)] disabled:opacity-70">
              {saving ? 'Salvando...' : 'Salvar respostas'}
            </button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {([
              ['tipoMoradia', profile.tipoMoradia],
              ['nivelAtividade', profile.nivelAtividade],
              ['toleranciaBarulho', profile.toleranciaBarulho],
              ['temCriancas', profile.temCriancas],
              ['temOutrosPets', profile.temOutrosPets],
              ['horasSozinhoAnimal', profile.horasSozinhoAnimal]
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
