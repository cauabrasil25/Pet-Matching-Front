"use client";

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { AppShell } from '../../../components/layout/AppShell';
import { animalService } from '../../../services/animalService';
import { applicationService } from '../../../services/applicationService';
import { questionnaireService } from '../../../services/questionnaireService';
import type { AnimalResponse } from '../../../types/animal';
import type { AplicacaoAdocaoResponse, StatusAplicacao } from '../../../types/application';

type ViewTab = 'explorar' | 'favoritos' | 'aplicacoes' | 'perfil';

type ProfileState = {
  tipoMoradia: 'CASA' | 'APARTAMENTO' | 'SITIO' | null;
  nivelAtividade: 'SEDENTARIO' | 'MODERADO' | 'ATIVO' | null;
  toleranciaBarulho: 'ALTA' | 'BAIXA' | null;
  temCriancas: boolean | null;
  temOutrosPets: boolean | null;
};

const defaultProfile: ProfileState = {
  tipoMoradia: null,
  nivelAtividade: null,
  toleranciaBarulho: null,
  temCriancas: null,
  temOutrosPets: null
};

function formatLabel(value: string) {
  return value
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatApplicationStatus(status: StatusAplicacao) {
  if (status === 'APROVADA') return 'Aprovada';
  if (status === 'PENDENTE') return 'Pendente';
  return 'Recusada';
}

function statusClassName(status: StatusAplicacao) {
  if (status === 'APROVADA') return 'bg-[rgba(22,163,74,0.12)] text-green-700';
  if (status === 'PENDENTE') return 'bg-[rgba(217,119,6,0.12)] text-amber-700';
  return 'bg-[rgba(220,38,38,0.12)] text-red-700';
}

function formatProfileValue(key: keyof ProfileState, value: ProfileState[keyof ProfileState]) {
  if (value === null) return 'Nao informado';

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

  return {
    tipoMoradia: tipoMoradia === 'CASA' || tipoMoradia === 'APARTAMENTO' || tipoMoradia === 'SITIO' ? tipoMoradia : null,
    nivelAtividade: nivelAtividade === 'SEDENTARIO' || nivelAtividade === 'MODERADO' || nivelAtividade === 'ATIVO' ? nivelAtividade : null,
    toleranciaBarulho: toleranciaBarulho === 'ALTA' || toleranciaBarulho === 'BAIXA' ? toleranciaBarulho : null,
    temCriancas,
    temOutrosPets
  };
}

export default function AdotanteDashboardPage() {
  const [tab, setTab] = useState<ViewTab>('explorar');
  const [speciesFilter, setSpeciesFilter] = useState('all');
  const [sizeFilter, setSizeFilter] = useState('all');
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [animals, setAnimals] = useState<AnimalResponse[]>([]);
  const [applications, setApplications] = useState<AplicacaoAdocaoResponse[]>([]);
  const [profile, setProfile] = useState<ProfileState>(defaultProfile);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        setLoading(true);
        setError('');

        const [animalsData, applicationsData] = await Promise.all([
          animalService.listar(),
          applicationService.listarMinhas()
        ]);

        let profileData = defaultProfile;
        try {
          const questionnaire = await questionnaireService.buscar();
          profileData = toProfileState(questionnaire.respostas);
        } catch {
          profileData = defaultProfile;
        }

        if (active) {
          setAnimals(animalsData);
          setApplications(applicationsData);
          setProfile(profileData);
        }
      } catch (loadError) {
        if (active) {
          const message = loadError instanceof Error ? loadError.message : 'Nao foi possivel carregar o dashboard.';
          setError(message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, []);

  const speciesOptions = useMemo(() => {
    return [...new Set(animals.map((animal) => animal.especie))].sort((a, b) => a.localeCompare(b));
  }, [animals]);

  const sizeOptions = useMemo(() => {
    return [...new Set(animals.map((animal) => animal.porte))].sort((a, b) => a.localeCompare(b));
  }, [animals]);

  const availableAnimals = animals.filter((animal) => {
    const speciesMatches = speciesFilter === 'all' || animal.especie === speciesFilter;
    const sizeMatches = sizeFilter === 'all' || animal.porte === sizeFilter;
    return speciesMatches && sizeMatches && animal.status !== 'ADOTADO';
  });

  const favoriteAnimals = animals.filter((animal) => likedIds.includes(animal.id));
  const approvedApplications = applications.filter((application) => application.status === 'APROVADA');
  const profileReady = Object.values(profile).every((value) => value !== null);

  return (
    <AppShell
      eyebrow="Adotante"
      title="Painel do adotante"
      description="Interface de exploracao, favoritos, aplicacoes e resumo de perfil migrada para o Next."
      primaryAction={{ label: 'Questionario', href: '/adotante/questionario' }}
      secondaryAction={{ label: 'Ver catalogo', href: '/animais' }}
    >
      <section className="grid gap-4 md:grid-cols-4">
        <article className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Favoritos</p>
          <p className="mt-3 text-3xl font-semibold text-[var(--text)]">{likedIds.length}</p>
        </article>
        <article className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Aplicacoes</p>
          <p className="mt-3 text-3xl font-semibold text-[var(--text)]">{applications.length}</p>
        </article>
        <article className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Matches aprovados</p>
          <p className="mt-3 text-3xl font-semibold text-[var(--text)]">{approvedApplications.length}</p>
        </article>
        <article className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Perfil pronto</p>
          <p className="mt-3 text-3xl font-semibold text-[var(--text)]">{profileReady ? 'Sim' : 'Nao'}</p>
        </article>
      </section>

      {loading ? (
        <section className="mt-6 rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-8 text-center text-sm text-[var(--muted)] shadow-[var(--shadow)]">
          Carregando dados do painel...
        </section>
      ) : null}

      {error ? (
        <section className="mt-6 rounded-[28px] border border-red-200 bg-red-50 p-8 text-center text-sm text-red-700 shadow-[var(--shadow)]">
          {error}
        </section>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-2 rounded-full bg-[var(--surface)] p-2 text-sm font-medium shadow-[var(--shadow)]">
        {([
          ['explorar', 'Explorar'],
          ['favoritos', 'Favoritos'],
          ['aplicacoes', 'Aplicacoes'],
          ['perfil', 'Perfil']
        ] as const).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`rounded-full px-4 py-2 transition ${tab === key ? 'bg-[var(--primary)] text-white' : 'text-[var(--muted)] hover:bg-[var(--surface-2)]'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'explorar' ? (
        <section className="mt-6 space-y-6 rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]">
          <div className="grid gap-4 md:grid-cols-3">
            <label className="block space-y-2 text-sm font-medium text-[var(--text)]">
              <span>Especie</span>
              <select
                className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--primary)]"
                value={speciesFilter}
                onChange={(event) => setSpeciesFilter(event.target.value)}
              >
                <option value="all">Todas</option>
                {speciesOptions.map((option) => (
                  <option key={option} value={option}>{formatLabel(option)}</option>
                ))}
              </select>
            </label>

            <label className="block space-y-2 text-sm font-medium text-[var(--text)]">
              <span>Tamanho</span>
              <select
                className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--primary)]"
                value={sizeFilter}
                onChange={(event) => setSizeFilter(event.target.value)}
              >
                <option value="all">Todos</option>
                {sizeOptions.map((option) => (
                  <option key={option} value={option}>{formatLabel(option)}</option>
                ))}
              </select>
            </label>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-4 text-sm text-[var(--muted)]">
              <p className="font-semibold text-[var(--text)]">Filtro atual</p>
              <p className="mt-2">{speciesFilter === 'all' ? 'Todas as especies' : formatLabel(speciesFilter)} - {sizeFilter === 'all' ? 'Todos os tamanhos' : formatLabel(sizeFilter)}</p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {availableAnimals.map((animal) => {
              const liked = likedIds.includes(animal.id);

              return (
                <article key={animal.id} className="overflow-hidden rounded-[24px] border border-[var(--border)] bg-white">
                  <div className="flex aspect-[4/3] items-center justify-center bg-[linear-gradient(145deg,rgba(15,118,110,0.16),rgba(217,119,6,0.16))]">
                    <span className="text-6xl font-semibold uppercase tracking-[0.08em] text-[var(--primary-strong)]">
                      {animal.nome.slice(0, 1)}
                    </span>
                  </div>
                  <div className="space-y-4 p-5">
                    <div>
                      <h3 className="text-lg font-semibold text-[var(--text)]">{animal.nome}</h3>
                      <p className="mt-1 text-sm text-[var(--muted)]">{formatLabel(animal.especie)} - {formatLabel(animal.porte)}</p>
                    </div>
                    <p className="text-sm leading-6 text-[var(--muted)]">{animal.descricao ?? 'Sem descricao informada.'}</p>
                    <div className="flex flex-wrap gap-2 text-xs font-medium text-[var(--muted)]">
                      <span className="rounded-full border border-[var(--border)] px-3 py-1">{formatLabel(animal.status)}</span>
                      <span className="rounded-full border border-[var(--border)] px-3 py-1">{formatLabel(animal.sexo)}</span>
                    </div>
                    <div className="flex gap-3">
                      <Link href={`/animais/${animal.id}`} className="flex-1 rounded-full border border-[var(--border)] px-4 py-2.5 text-center text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--surface-2)]">
                        Detalhe
                      </Link>
                      <button
                        type="button"
                        onClick={() => setLikedIds((current) => (current.includes(animal.id) ? current.filter((id) => id !== animal.id) : [...current, animal.id]))}
                        className="rounded-full bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--primary-strong)]"
                      >
                        {liked ? 'Favoritado' : 'Favoritar'}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {availableAnimals.length === 0 ? <p className="text-sm text-[var(--muted)]">Nenhum animal encontrado com os filtros atuais.</p> : null}
        </section>
      ) : null}

      {tab === 'favoritos' ? (
        <section className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {favoriteAnimals.map((animal) => (
            <article key={animal.id} className="overflow-hidden rounded-[24px] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)]">
              <div className="flex aspect-[4/3] items-center justify-center bg-[linear-gradient(145deg,rgba(15,118,110,0.16),rgba(217,119,6,0.16))]">
                <span className="text-6xl font-semibold uppercase tracking-[0.08em] text-[var(--primary-strong)]">
                  {animal.nome.slice(0, 1)}
                </span>
              </div>
              <div className="space-y-3 p-5">
                <h3 className="text-lg font-semibold text-[var(--text)]">{animal.nome}</h3>
                <p className="text-sm text-[var(--muted)]">{formatLabel(animal.especie)} - {formatLabel(animal.porte)}</p>
                <Link href={`/animais/${animal.id}`} className="inline-flex rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--surface-2)]">
                  Ver detalhe
                </Link>
              </div>
            </article>
          ))}
          {favoriteAnimals.length === 0 ? <p className="text-sm text-[var(--muted)]">Nenhum favorito salvo ainda.</p> : null}
        </section>
      ) : null}

      {tab === 'aplicacoes' ? (
        <section className="mt-6 space-y-4 rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]">
          {applications.map((application) => {
            const animal = animals.find((item) => item.id === application.animalId);
            return (
              <article key={application.id} className="rounded-2xl border border-[var(--border)] bg-white p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--text)]">{animal?.nome ?? `Animal ${application.animalId}`}</h3>
                    <p className="mt-1 text-sm text-[var(--muted)]">Aplicacao #{application.id}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClassName(application.status)}`}>
                    {formatApplicationStatus(application.status)}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{application.mensagem ?? 'Sem mensagem enviada.'}</p>
                <div className="mt-4 flex items-center gap-3 text-sm text-[var(--muted)]">
                  <span>Status da aplicacao: {formatApplicationStatus(application.status)}</span>
                  <Link href={`/animais/${application.animalId}`} className="font-semibold text-[var(--primary-strong)]">
                    Ver animal
                  </Link>
                </div>
              </article>
            );
          })}

          {applications.length === 0 ? <p className="text-sm text-[var(--muted)]">Nenhuma aplicacao enviada ate o momento.</p> : null}
        </section>
      ) : null}

      {tab === 'perfil' ? (
        <section className="mt-6 rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
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
        </section>
      ) : null}
    </AppShell>
  );
}
