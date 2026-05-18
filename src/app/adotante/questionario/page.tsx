"use client";

import { useEffect, useState } from "react";
import {
  Home,
  Activity,
  Volume2,
  Baby,
  PawPrint,
  Clock3,
  CheckCircle2,
  Save,
} from "lucide-react";

import { AppShell } from "../../../components/layout/AppShell";
import { questionnaireService } from "../../../services/questionnaireService";

type ProfileState = {
  tipoMoradia: "CASA" | "APARTAMENTO" | "SITIO" | null;
  nivelAtividade: "SEDENTARIO" | "MODERADO" | "ATIVO" | null;
  toleranciaBarulho: "ALTA" | "BAIXA" | null;
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
  horasSozinhoAnimal: null,
};

function formatProfileValue(
  key: keyof ProfileState,
  value: ProfileState[keyof ProfileState]
) {
  if (value === null) return "Não informado";

  if (key === "horasSozinhoAnimal") {
    return `${value} hora${value === 1 ? "" : "s"}`;
  }

  if (key === "tipoMoradia") {
    if (value === "CASA") return "Casa";
    if (value === "APARTAMENTO") return "Apartamento";
    return "Sítio";
  }

  if (key === "nivelAtividade") {
    if (value === "SEDENTARIO") return "Sedentário";
    if (value === "MODERADO") return "Moderado";
    return "Ativo";
  }

  if (key === "toleranciaBarulho") {
    return value === "ALTA" ? "Alta" : "Baixa";
  }

  return value === true ? "Sim" : "Não";
}

function toProfileState(
  respostas: Record<string, string | number | boolean>
): ProfileState {
  const tipoMoradia =
    typeof respostas.tipoMoradia === "string"
      ? respostas.tipoMoradia
      : null;

  const nivelAtividade =
    typeof respostas.nivelAtividade === "string"
      ? respostas.nivelAtividade
      : null;

  const toleranciaBarulho =
    typeof respostas.toleranciaBarulho === "string"
      ? respostas.toleranciaBarulho
      : null;

  const temCriancas =
    typeof respostas.temCriancas === "boolean"
      ? respostas.temCriancas
      : null;

  const temOutrosPets =
    typeof respostas.temOutrosPets === "boolean"
      ? respostas.temOutrosPets
      : null;

  const horasSozinhoAnimal =
    typeof respostas.horasSozinhoAnimal === "number"
      ? respostas.horasSozinhoAnimal
      : null;

  return {
    tipoMoradia:
      tipoMoradia === "CASA" ||
      tipoMoradia === "APARTAMENTO" ||
      tipoMoradia === "SITIO"
        ? tipoMoradia
        : null,

    nivelAtividade:
      nivelAtividade === "SEDENTARIO" ||
      nivelAtividade === "MODERADO" ||
      nivelAtividade === "ATIVO"
        ? nivelAtividade
        : null,

    toleranciaBarulho:
      toleranciaBarulho === "ALTA" || toleranciaBarulho === "BAIXA"
        ? toleranciaBarulho
        : null,

    temCriancas,
    temOutrosPets,
    horasSozinhoAnimal,
  };
}

function toRequestPayload(profile: ProfileState) {
  return {
    tipoMoradia: profile.tipoMoradia ?? "CASA",
    nivelAtividade: profile.nivelAtividade ?? "MODERADO",
    toleranciaBarulho: profile.toleranciaBarulho ?? "BAIXA",
    temCriancas: profile.temCriancas ?? false,
    temOutrosPets: profile.temOutrosPets ?? false,
    horasSozinhoAnimal: profile.horasSozinhoAnimal ?? 0,
  };
}

const homeTypes = [
  { value: "CASA", label: "Casa", icon: "🏡" },
  { value: "APARTAMENTO", label: "Apartamento", icon: "🏢" },
  { value: "SITIO", label: "Sítio", icon: "🌿" },
] as const;

const activityLevels = [
  { value: "SEDENTARIO", label: "Sedentário", emoji: "🛋️" },
  { value: "MODERADO", label: "Moderado", emoji: "🚶" },
  { value: "ATIVO", label: "Ativo", emoji: "🏃" },
] as const;

export default function QuestionarioPage() {
  const [profile, setProfile] = useState<ProfileState>(defaultProfile);

  const [loading, setLoading] = useState(true);
  const [hasExistingQuestionnaire, setHasExistingQuestionnaire] =
    useState(false);

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState("");

  useEffect(() => {
    let active = true;

    async function loadQuestionnaire() {
      try {
        setLoading(true);
        setError("");

        const response = await questionnaireService.buscar();

        if (!active) return;

        setProfile(toProfileState(response));
        setHasExistingQuestionnaire(true);
      } catch (loadError) {
        if (!active) return;

        const message =
          loadError instanceof Error
            ? loadError.message
            : "Não foi possível carregar o questionário.";

        const looksLikeNotFound =
          /404|nao encontrado|not found/i.test(message);

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

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setSaved("");
    setError("");

    try {
      setSaving(true);

      if (hasExistingQuestionnaire) {
        await questionnaireService.atualizar(
          toRequestPayload(profile)
        );
      } else {
        await questionnaireService.cadastrar(
          toRequestPayload(profile)
        );

        setHasExistingQuestionnaire(true);
      }

      setSaved("Questionário salvo com sucesso.");
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : "Não foi possível salvar o questionário.";

      setError(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppShell
      eyebrow="Questionário"
      title="Perfil do adotante"
      description="Responda algumas perguntas para encontrarmos os pets mais compatíveis com você."
      secondaryAction={{
        label: "Minhas aplicações",
        href: "/adotante/aplicacoes",
      }}
    >
      {loading ? (
        <section className="rounded-[32px] border border-[var(--border)] bg-white p-12 text-center shadow-xl">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[var(--primary)] border-t-transparent" />
          <p className="mt-4 text-sm text-[var(--muted)]">
            Carregando questionário...
          </p>
        </section>
      ) : null}

      {error ? (
        <section className="mb-6 rounded-[28px] border border-red-200 bg-red-50 p-5 text-sm text-red-700 shadow-sm">
          {error}
        </section>
      ) : null}

      <form className="space-y-8" onSubmit={handleSubmit}>
        {/* MORADIA */}
        <section className="rounded-[32px] border border-[var(--border)] bg-white p-8 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
              <Home className="h-6 w-6" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[var(--text)]">
                Tipo de moradia
              </h2>

              <p className="text-sm text-[var(--muted)]">
                Isso ajuda a entender o espaço disponível.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {homeTypes.map((option) => (
              <label
                key={option.value}
                className={`group cursor-pointer rounded-3xl border p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${
                  profile.tipoMoradia === option.value
                    ? "border-emerald-500 bg-emerald-50 shadow-lg"
                    : "border-[var(--border)] bg-white"
                }`}
              >
                <input
                  type="radio"
                  className="sr-only"
                  checked={profile.tipoMoradia === option.value}
                  onChange={() =>
                    setProfile((current) => ({
                      ...current,
                      tipoMoradia: option.value,
                    }))
                  }
                />

                <div className="text-4xl">{option.icon}</div>

                <p className="mt-4 text-lg font-semibold text-[var(--text)]">
                  {option.label}
                </p>
              </label>
            ))}
          </div>
        </section>

        {/* ATIVIDADE */}
        <section className="rounded-[32px] border border-[var(--border)] bg-white p-8 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-orange-100 p-3 text-orange-700">
              <Activity className="h-6 w-6" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[var(--text)]">
                Nível de atividade
              </h2>

              <p className="text-sm text-[var(--muted)]">
                Qual seu estilo de vida?
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {activityLevels.map((option) => (
              <label
                key={option.value}
                className={`cursor-pointer rounded-3xl border p-6 transition-all hover:-translate-y-1 hover:shadow-lg ${
                  profile.nivelAtividade === option.value
                    ? "border-orange-500 bg-orange-50 shadow-lg"
                    : "border-[var(--border)] bg-white"
                }`}
              >
                <input
                  type="radio"
                  className="sr-only"
                  checked={profile.nivelAtividade === option.value}
                  onChange={() =>
                    setProfile((current) => ({
                      ...current,
                      nivelAtividade: option.value,
                    }))
                  }
                />

                <div className="text-4xl">{option.emoji}</div>

                <p className="mt-4 text-lg font-semibold text-[var(--text)]">
                  {option.label}
                </p>
              </label>
            ))}
          </div>
        </section>

        {/* BARULHO + CONVIVENCIA */}
        <section className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-[32px] border border-[var(--border)] bg-white p-8 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-violet-100 p-3 text-violet-700">
                <Volume2 className="h-6 w-6" />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[var(--text)]">
                  Tolerância a barulho
                </h2>

                <p className="text-sm text-[var(--muted)]">
                  Qual ambiente você prefere?
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                { value: "ALTA", label: "Alta", emoji: "🔊" },
                { value: "BAIXA", label: "Baixa", emoji: "🤫" },
              ].map((option) => (
                <label
                  key={option.value}
                  className={`cursor-pointer rounded-3xl border p-6 transition-all hover:-translate-y-1 hover:shadow-lg ${
                    profile.toleranciaBarulho === option.value
                      ? "border-violet-500 bg-violet-50 shadow-lg"
                      : "border-[var(--border)] bg-white"
                  }`}
                >
                  <input
                    type="radio"
                    className="sr-only"
                    checked={
                      profile.toleranciaBarulho === option.value
                    }
                    onChange={() =>
                      setProfile((current) => ({
                        ...current,
                        toleranciaBarulho: option.value as
                          | "ALTA"
                          | "BAIXA",
                      }))
                    }
                  />

                  <div className="text-4xl">{option.emoji}</div>

                  <p className="mt-4 text-lg font-semibold text-[var(--text)]">
                    {option.label}
                  </p>
                </label>
              ))}
            </div>
          </article>

          <article className="rounded-[32px] border border-[var(--border)] bg-white p-8 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-pink-100 p-3 text-pink-700">
                <Baby className="h-6 w-6" />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[var(--text)]">
                  Convivência
                </h2>

                <p className="text-sm text-[var(--muted)]">
                  Informações sobre sua casa.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-5">
              {[
                {
                  key: "temCriancas" as const,
                  label: "Tem crianças em casa?",
                  icon: <Baby className="h-5 w-5" />,
                },
                {
                  key: "temOutrosPets" as const,
                  label: "Tem outros pets?",
                  icon: <PawPrint className="h-5 w-5" />,
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5"
                >
                  <div className="flex items-center gap-2">
                    {item.icon}

                    <p className="font-medium text-[var(--text)]">
                      {item.label}
                    </p>
                  </div>

                  <div className="mt-4 flex gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setProfile((current) => ({
                          ...current,
                          [item.key]: true,
                        }))
                      }
                      className={`flex-1 rounded-2xl border px-4 py-3 font-medium transition ${
                        profile[item.key] === true
                          ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                          : "border-[var(--border)] bg-white"
                      }`}
                    >
                      Sim
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setProfile((current) => ({
                          ...current,
                          [item.key]: false,
                        }))
                      }
                      className={`flex-1 rounded-2xl border px-4 py-3 font-medium transition ${
                        profile[item.key] === false
                          ? "border-red-500 bg-red-50 text-red-700"
                          : "border-[var(--border)] bg-white"
                      }`}
                    >
                      Não
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>

        {/* HORAS SOZINHO */}
        <section className="rounded-[32px] border border-[var(--border)] bg-white p-8 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-sky-100 p-3 text-sky-700">
              <Clock3 className="h-6 w-6" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[var(--text)]">
                Tempo sozinho
              </h2>

              <p className="text-sm text-[var(--muted)]">
                Quantas horas o pet ficará sozinho por dia?
              </p>
            </div>
          </div>

          <div className="mt-6">
            <input
              type="number"
              min="0"
              max="24"
              value={profile.horasSozinhoAnimal ?? ""}
              onChange={(event) =>
                setProfile((current) => ({
                  ...current,
                  horasSozinhoAnimal:
                    event.target.value === ""
                      ? null
                      : Number(event.target.value),
                }))
              }
              className="w-full rounded-3xl border border-[var(--border)] bg-[var(--surface)] px-5 py-4 text-lg outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-emerald-100"
              placeholder="Digite um valor entre 0 e 24"
            />
          </div>
        </section>

        {/* RESUMO */}
        <section className="rounded-[32px] border border-[var(--border)] bg-gradient-to-br from-emerald-50 to-white p-8 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-emerald-600" />

                <h2 className="text-2xl font-bold text-[var(--text)]">
                  Resumo do perfil
                </h2>
              </div>

              <p className="mt-2 text-sm text-[var(--muted)]">
                Confira suas respostas antes de salvar.
              </p>
            </div>

            <button
              type="submit"
              disabled={saving || loading}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-6 py-3 font-semibold text-white transition hover:scale-[1.02] hover:bg-[var(--primary-strong)] disabled:opacity-70"
            >
              <Save className="h-4 w-4" />

              {saving ? "Salvando..." : "Salvar respostas"}
            </button>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {(
              [
                ["tipoMoradia", profile.tipoMoradia],
                ["nivelAtividade", profile.nivelAtividade],
                ["toleranciaBarulho", profile.toleranciaBarulho],
                ["temCriancas", profile.temCriancas],
                ["temOutrosPets", profile.temOutrosPets],
                ["horasSozinhoAnimal", profile.horasSozinhoAnimal],
              ] as const
            ).map(([key, value]) => (
              <div
                key={key}
                className="rounded-3xl border border-white/60 bg-white/80 p-5 backdrop-blur"
              >
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
                  {key}
                </p>

                <p className="mt-3 text-lg font-semibold text-[var(--text)]">
                  {formatProfileValue(key, value)}
                </p>
              </div>
            ))}
          </div>

          {saved ? (
            <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
              {saved}
            </div>
          ) : null}
        </section>
      </form>
    </AppShell>
  );
}
