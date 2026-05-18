"use client";

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { AppShell } from '../../../components/layout/AppShell';
import { animalService } from '../../../services/animalService';
import { applicationService } from '../../../services/applicationService';
import { questionnaireService } from '../../../services/questionnaireService';
import type { AnimalResponse } from '../../../types/animal';
import type {
  AplicacaoAdocaoResponse,
  StatusAplicacao
} from '../../../types/application';

type ViewTab = 'explorar' | 'favoritos' | 'aplicacoes' | 'perfil';

type ProfileState = {
  tipoMoradia: 'CASA' | 'APARTAMENTO' | 'SITIO' | null;
  nivelAtividade: 'SEDENTARIO' | 'MODERADO' | 'ATIVO' | null;
  toleranciaBarulho: 'ALTA' | 'BAIXA' | null;
  temCriancas: boolean | null;
  temOutrosPets: boolean | null;
  horasSozinhoAnimal: number | null;
};

type QuestionnaireResponse = {
  tipoMoradia: string;
  nivelAtividade: string;
  toleranciaBarulho: string;
  temCriancas: boolean;
  temOutrosPets: boolean;
  horasSozinhoAnimal: number;
};

const defaultProfile: ProfileState = {
  tipoMoradia: null,
  nivelAtividade: null,
  toleranciaBarulho: null,
  temCriancas: null,
  temOutrosPets: null,
  horasSozinhoAnimal: null
};

function formatLabel(value?: string | null) {
  if (!value) return 'Nao informado';

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
  if (status === 'APROVADA') {
    return 'bg-[rgba(22,163,74,0.12)] text-green-700';
  }

  if (status === 'PENDENTE') {
    return 'bg-[rgba(217,119,6,0.12)] text-amber-700';
  }

  return 'bg-[rgba(220,38,38,0.12)] text-red-700';
}

function formatProfileValue(
  key: keyof ProfileState,
  value: ProfileState[keyof ProfileState]
) {
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

function normalizeQuestionnaireValue(value: string) {
  return value.trim().toUpperCase().replace(/\s+/g, '_');
}

function toProfileState(
  questionnaire: QuestionnaireResponse
): ProfileState {
  const {
    tipoMoradia,
    nivelAtividade,
    toleranciaBarulho,
    temCriancas,
    temOutrosPets,
    horasSozinhoAnimal
  } = questionnaire;

  const normalizedTipoMoradia =
    normalizeQuestionnaireValue(tipoMoradia);

  const normalizedNivelAtividade =
    normalizeQuestionnaireValue(nivelAtividade);

  const normalizedToleranciaBarulho =
    normalizeQuestionnaireValue(toleranciaBarulho);

  return {
    tipoMoradia:
      normalizedTipoMoradia === 'CASA' ||
      normalizedTipoMoradia === 'APARTAMENTO' ||
      normalizedTipoMoradia === 'SITIO'
        ? normalizedTipoMoradia
        : null,

    nivelAtividade:
      normalizedNivelAtividade === 'SEDENTARIO' ||
      normalizedNivelAtividade === 'MODERADO' ||
      normalizedNivelAtividade === 'ATIVO'
        ? normalizedNivelAtividade
        : null,

    toleranciaBarulho:
      normalizedToleranciaBarulho === 'ALTA' ||
      normalizedToleranciaBarulho === 'BAIXA'
        ? normalizedToleranciaBarulho
        : null,

    temCriancas,
    temOutrosPets,
    horasSozinhoAnimal
  };
}

export default function AdotanteDashboardPage() {
  const [tab, setTab] = useState<ViewTab>('explorar');

  const [speciesFilter, setSpeciesFilter] = useState('all');
  const [sizeFilter, setSizeFilter] = useState('all');

  const [likedIds, setLikedIds] = useState<string[]>([]);

  const [animals, setAnimals] = useState<AnimalResponse[]>([]);
  const [applications, setApplications] = useState<
    AplicacaoAdocaoResponse[]
  >([]);

  const [profile, setProfile] =
    useState<ProfileState>(defaultProfile);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        setLoading(true);
        setError('');

        const [animalsData, applicationsData] =
          await Promise.all([
            animalService.listar(),
            applicationService.listarMinhas()
          ]);

        let profileData = defaultProfile;

        try {
          const questionnaire =
            (await questionnaireService.buscar()) as QuestionnaireResponse;

          profileData = toProfileState(questionnaire);
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
          const message =
            loadError instanceof Error
              ? loadError.message
              : 'Nao foi possivel carregar o dashboard.';

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
    return [
      ...new Set(animals.map((animal) => animal.especie))
    ].sort((a, b) => a.localeCompare(b));
  }, [animals]);

  const sizeOptions = useMemo(() => {
    return [
      ...new Set(animals.map((animal) => animal.porte))
    ].sort((a, b) => a.localeCompare(b));
  }, [animals]);

  const availableAnimals = animals.filter((animal) => {
    const speciesMatches =
      speciesFilter === 'all' ||
      animal.especie === speciesFilter;

    const sizeMatches =
      sizeFilter === 'all' ||
      animal.porte === sizeFilter;

    return (
      speciesMatches &&
      sizeMatches &&
      animal.status !== 'ADOTADO'
    );
  });

  const favoriteAnimals = animals.filter((animal) =>
    likedIds.includes(animal.id)
  );

  const approvedApplications = applications.filter(
    (application) => application.status === 'APROVADA'
  );

  const profileReady = Object.values(profile).every(
    (value) => value !== null
  );

  return (
    <AppShell
      eyebrow="Adotante"
      title="Painel do adotante"
      description="Interface de exploracao, favoritos, aplicacoes e perfil."
      primaryAction={{
        label: 'Questionario',
        href: '/adotante/questionario'
      }}
      secondaryAction={{
        label: 'Ver catalogo',
        href: '/animais'
      }}
    >
      <section className="grid gap-4 md:grid-cols-4">
        <article className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
            Favoritos
          </p>

          <p className="mt-3 text-3xl font-semibold text-[var(--text)]">
            {likedIds.length}
          </p>
        </article>

        <article className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
            Aplicacoes
          </p>

          <p className="mt-3 text-3xl font-semibold text-[var(--text)]">
            {applications.length}
          </p>
        </article>

        <article className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
            Matches aprovados
          </p>

          <p className="mt-3 text-3xl font-semibold text-[var(--text)]">
            {approvedApplications.length}
          </p>
        </article>

        <article className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
            Perfil pronto
          </p>

          <p className="mt-3 text-3xl font-semibold text-[var(--text)]">
            {profileReady ? 'Sim' : 'Nao'}
          </p>
        </article>
      </section>
    </AppShell>
  );
}
