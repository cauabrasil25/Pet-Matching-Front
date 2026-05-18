"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AppShell } from '../../../../../components/layout/AppShell';
import { animalService } from '../../../../../services/animalService';

function normalizeApiValue(value: string) {
  return value.trim().toUpperCase().replace(/\s+/g, '_');
}

function formatLabel(value?: string | null) {
  if (!value) return 'Nao informado';

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
    idade: '',
    peso: '',
    status: 'DISPONIVEL',
    nivelEnergia: 'MEDIO',
    nivelBarulho: 'BAIXO',
    temDeficienciaFisica: false,
    temDoencaCronica: false,
    sociavelEstranhos: true,
    sociavelCriancas: true,
    sociavelAnimais: true,
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
          idade: String(animal.idade),
          peso: String(animal.peso),
          status: animal.status,
          nivelEnergia: animal.nivelEnergia ?? 'MEDIO',
          nivelBarulho: animal.nivelBarulho ?? 'BAIXO',
          temDeficienciaFisica: animal.temDeficienciaFisica ?? false,
          temDoencaCronica: animal.temDoencaCronica ?? false,
          sociavelEstranhos: animal.sociavelEstranhos ?? true,
          sociavelCriancas: animal.sociavelCriancas ?? true,
          sociavelAnimais: animal.sociavelAnimais ?? true
        });
      } catch (loadError) {
        if (active) {
          const message =
            loadError instanceof Error
              ? loadError.message
              : 'Nao foi possivel carregar o animal.';

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

      await animalService.atualizar(animalId, {
        nome: form.nome.trim(),
        especie: normalizeApiValue(form.especie),
        porte: normalizeApiValue(form.porte),
        idade,
        peso,
        status: normalizeApiValue(form.status) as
          | 'DISPONIVEL'
          | 'PENDENTE'
          | 'ADOTADO',
        nivelEnergia: normalizeApiValue(form.nivelEnergia) as
          | 'BAIXO'
          | 'MEDIO'
          | 'ALTO',
        nivelBarulho: normalizeApiValue(form.nivelBarulho) as
          | 'BAIXO'
          | 'ALTO',
        temDeficienciaFisica: form.temDeficienciaFisica,
        temDoencaCronica: form.temDoencaCronica,
        sociavelEstranhos: form.sociavelEstranhos,
        sociavelCriancas: form.sociavelCriancas,
        sociavelAnimais: form.sociavelAnimais
      });

      await animalService.atualizarStatus(animalId, {
        status: form.status as 'DISPONIVEL' | 'PENDENTE' | 'ADOTADO'
      });

      setFeedback(`Animal ${form.nome.trim()} atualizado com sucesso.`);
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : 'Nao foi possivel atualizar o animal.';

      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const traits = [
    {
      label: 'Deficiencia fisica',
      value: form.temDeficienciaFisica
    },
    {
      label: 'Doenca cronica',
      value: form.temDoencaCronica
    },
    {
      label: 'Sociavel com estranhos',
      value: form.sociavelEstranhos
    },
    {
      label: 'Sociavel com criancas',
      value: form.sociavelCriancas
    },
    {
      label: 'Sociavel com animais',
      value: form.sociavelAnimais
    }
  ];

  return (
    <AppShell
      eyebrow="Abrigo"
      title={form.nome ? `Editar ${form.nome}` : 'Editar animal'}
      description="Atualize as informacoes do animal, comportamento e status de adocao."
      secondaryAction={{
        label: 'Meus animais',
        href: '/abrigo/animais'
      }}
    >
      <section className="relative overflow-hidden rounded-[36px] border border-[var(--border)] bg-[linear-gradient(145deg,rgba(15,118,110,0.10),rgba(217,119,6,0.08),white)] p-8 shadow-[var(--shadow)]">
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[rgba(15,118,110,0.10)] blur-3xl" />
        <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-[rgba(217,119,6,0.12)] blur-3xl" />

        <div className="relative flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex rounded-full bg-[rgba(15,118,110,0.12)] px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--primary-strong)]">
              Painel de edicao
            </span>

            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--text)]">
              {form.nome || 'Animal'}
            </h1>

            <p className="mt-3 text-base leading-7 text-[var(--muted)]">
              Atualize caracteristicas fisicas, comportamento e status de adocao
              em uma interface mais moderna e organizada.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <span className="rounded-full border border-[var(--border)] bg-white/80 px-4 py-2 text-sm font-medium text-[var(--text)] backdrop-blur">
                {formatLabel(form.especie)}
              </span>

              <span className="rounded-full border border-[var(--border)] bg-white/80 px-4 py-2 text-sm font-medium text-[var(--text)] backdrop-blur">
                {formatLabel(form.porte)}
              </span>

              <span className="rounded-full border border-[var(--border)] bg-white/80 px-4 py-2 text-sm font-medium text-[var(--text)] backdrop-blur">
                {formatLabel(form.status)}
              </span>
            </div>
          </div>

          <div className="flex h-56 w-56 items-center justify-center self-center overflow-hidden rounded-[32px] border border-white/60 bg-[linear-gradient(145deg,rgba(15,118,110,0.18),rgba(217,119,6,0.18))] shadow-2xl backdrop-blur">
            <span className="text-8xl font-black uppercase tracking-[0.08em] text-[var(--primary-strong)]">
              {(form.nome || 'A').slice(0, 1)}
            </span>
          </div>
        </div>
      </section>

      {loading ? (
        <section className="mt-6 rounded-[32px] border border-[var(--border)] bg-[var(--surface)] p-10 text-center text-sm text-[var(--muted)] shadow-[var(--shadow)]">
          Carregando dados do animal...
        </section>
      ) : null}

      {error ? (
        <section className="mt-6 rounded-[32px] border border-red-200 bg-red-50 p-6 text-sm text-red-700 shadow-[var(--shadow)]">
          {error}
        </section>
      ) : null}

      <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_380px]">
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-[32px] border border-[var(--border)] bg-[var(--surface)] p-7 shadow-[var(--shadow)]"
        >
          <div>
            <h2 className="text-xl font-semibold text-[var(--text)]">
              Informacoes principais
            </h2>

            <p className="mt-1 text-sm text-[var(--muted)]">
              Dados basicos utilizados no catalogo de adocao.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-[var(--text)]">
                Nome
              </span>

              <input
                value={form.nome}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    nome: event.target.value
                  }))
                }
                className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-[rgba(15,118,110,0.10)]"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-[var(--text)]">
                Especie
              </span>

              <select
                value={form.especie}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    especie: event.target.value
                  }))
                }
                className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-[rgba(15,118,110,0.10)]"
              >
                <option value="CACHORRO">Cachorro</option>
                <option value="GATO">Gato</option>
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-[var(--text)]">
                Porte
              </span>

              <select
                value={form.porte}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    porte: event.target.value
                  }))
                }
                className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-[rgba(15,118,110,0.10)]"
              >
                <option value="PEQUENO">Pequeno</option>
                <option value="MEDIO">Medio</option>
                <option value="GRANDE">Grande</option>
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-[var(--text)]">
                Status
              </span>

              <select
                value={form.status}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    status: event.target.value
                  }))
                }
                className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-[rgba(15,118,110,0.10)]"
              >
                <option value="DISPONIVEL">Disponivel</option>
                <option value="PENDENTE">Pendente</option>
                <option value="ADOTADO">Adotado</option>
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-[var(--text)]">
                Idade
              </span>

              <input
                type="number"
                min="0"
                value={form.idade}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    idade: event.target.value
                  }))
                }
                className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-[rgba(15,118,110,0.10)]"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-[var(--text)]">
                Peso (kg)
              </span>

              <input
                type="number"
                min="0"
                step="0.1"
                value={form.peso}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    peso: event.target.value
                  }))
                }
                className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-[rgba(15,118,110,0.10)]"
              />
            </label>
          </div>

          <div className="border-t border-[var(--border)] pt-6">
            <h2 className="text-xl font-semibold text-[var(--text)]">
              Perfil comportamental
            </h2>

            <p className="mt-1 text-sm text-[var(--muted)]">
              Informacoes utilizadas para melhorar o match de adocao.
            </p>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-[var(--text)]">
                  Nivel de energia
                </span>

                <select
                  value={form.nivelEnergia}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      nivelEnergia: event.target.value
                    }))
                  }
                  className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-[rgba(15,118,110,0.10)]"
                >
                  <option value="BAIXO">Baixo</option>
                  <option value="MEDIO">Medio</option>
                  <option value="ALTO">Alto</option>
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-[var(--text)]">
                  Nivel de barulho
                </span>

                <select
                  value={form.nivelBarulho}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      nivelBarulho: event.target.value
                    }))
                  }
                  className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-[rgba(15,118,110,0.10)]"
                >
                  <option value="BAIXO">Baixo</option>
                  <option value="ALTO">Alto</option>
                </select>
              </label>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {traits.map((trait) => (
                <label
                  key={trait.label}
                  className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-4"
                >
                  <div>
                    <p className="text-sm font-semibold text-[var(--text)]">
                      {trait.label}
                    </p>

                    <p className="mt-1 text-xs text-[var(--muted)]">
                      Configure o comportamento esperado.
                    </p>
                  </div>

                  <select
                    value={String(trait.value)}
                    onChange={(event) => {
                      const checked = event.target.value === 'true';

                      if (trait.label === 'Deficiencia fisica') {
                        setForm((current) => ({
                          ...current,
                          temDeficienciaFisica: checked
                        }));
                      }

                      if (trait.label === 'Doenca cronica') {
                        setForm((current) => ({
                          ...current,
                          temDoencaCronica: checked
                        }));
                      }

                      if (trait.label === 'Sociavel com estranhos') {
                        setForm((current) => ({
                          ...current,
                          sociavelEstranhos: checked
                        }));
                      }

                      if (trait.label === 'Sociavel com criancas') {
                        setForm((current) => ({
                          ...current,
                          sociavelCriancas: checked
                        }));
                      }

                      if (trait.label === 'Sociavel com animais') {
                        setForm((current) => ({
                          ...current,
                          sociavelAnimais: checked
                        }));
                      }
                    }}
                    className="rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm outline-none transition focus:border-[var(--primary)]"
                  >
                    <option value="true">Sim</option>
                    <option value="false">Nao</option>
                  </select>
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 border-t border-[var(--border)] pt-6">
            <button
              type="submit"
              disabled={loading || saving}
              className="rounded-full bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white transition hover:scale-[1.02] hover:bg-[var(--primary-strong)] disabled:opacity-70"
            >
              {saving ? 'Salvando...' : 'Salvar alteracoes'}
            </button>

            <button
              type="button"
              onClick={() => router.push('/abrigo/animais')}
              className="rounded-full border border-[var(--border)] bg-white px-6 py-3 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--surface-2)]"
            >
              Voltar
            </button>
          </div>

          {feedback ? (
            <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {feedback}
            </div>
          ) : null}
        </form>

        <aside className="space-y-6">
          <div className="rounded-[32px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                  Preview
                </p>

                <h2 className="mt-2 text-2xl font-semibold text-[var(--text)]">
                  {form.nome || 'Animal'}
                </h2>
              </div>

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[linear-gradient(145deg,rgba(15,118,110,0.16),rgba(217,119,6,0.16))]">
                <span className="text-2xl font-bold text-[var(--primary-strong)]">
                  {(form.nome || 'A').slice(0, 1)}
                </span>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl bg-[var(--surface-2)] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--accent)]">
                  Caracteristicas
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[var(--text)]">
                    {formatLabel(form.especie)}
                  </span>

                  <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[var(--text)]">
                    {formatLabel(form.porte)}
                  </span>

                  <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[var(--text)]">
                    {form.idade || '0'} anos
                  </span>
                </div>
              </div>

              <div className="rounded-2xl bg-[var(--surface-2)] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--accent)]">
                  Condicao atual
                </p>

                <div className="mt-3 space-y-2 text-sm text-[var(--muted)]">
                  <p>Status: {formatLabel(form.status)}</p>
                  <p>Energia: {formatLabel(form.nivelEnergia)}</p>
                  <p>Barulho: {formatLabel(form.nivelBarulho)}</p>
                  <p>Peso: {form.peso || '0'} kg</p>
                </div>
              </div>

              <div className="rounded-2xl bg-[var(--surface-2)] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--accent)]">
                  Sociabilidade
                </p>

                <div className="mt-3 space-y-2 text-sm text-[var(--muted)]">
                  <p>
                    Estranhos:{' '}
                    {form.sociavelEstranhos ? 'Sim' : 'Nao'}
                  </p>

                  <p>
                    Criancas:{' '}
                    {form.sociavelCriancas ? 'Sim' : 'Nao'}
                  </p>

                  <p>
                    Outros animais:{' '}
                    {form.sociavelAnimais ? 'Sim' : 'Nao'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </AppShell>
  );
}
