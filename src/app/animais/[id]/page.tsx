"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import {
  PawPrint,
  Heart,
  ShieldCheck,
  Activity,
  Volume2,
  Weight,
  Calendar,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

import { AppShell } from "../../../components/layout/AppShell";

import { getCurrentUser } from "../../../services/authService";
import { applicationService } from "../../../services/applicationService";
import { animalService } from "../../../services/animalService";

import type { AnimalResponse } from "../../../types/animal";

function formatLabel(value?: string | null) {
  if (!value) return "Não informado";

  return value
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );
}

function formatBoolean(value?: boolean) {
  return value ? "Sim" : "Não";
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
        {icon}
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          {label}
        </p>

        <p className="mt-1 text-sm font-semibold text-zinc-900">
          {value}
        </p>
      </div>
    </div>
  );
}

function Badge({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-700">
      {children}
    </span>
  );
}

export default function AnimalDetailPage() {
  const params = useParams<{ id: string }>();

  const animalId = Array.isArray(params.id)
    ? params.id[0]
    : params.id;

  const [animal, setAnimal] =
    useState<AnimalResponse | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [isAdopter, setIsAdopter] =
    useState(false);

  const [submitLoading, setSubmitLoading] =
    useState(false);

  const [submitError, setSubmitError] =
    useState("");

  const [submitSuccess, setSubmitSuccess] =
    useState("");

  useEffect(() => {
    const user = getCurrentUser();

    setIsAdopter(
      user?.role === "ADOTANTE"
    );
  }, []);

  useEffect(() => {
    let active = true;

    async function loadAnimal() {
      if (!animalId) {
        setError("Animal inválido.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data =
          await animalService.buscarPorId(
            animalId
          );

        if (active) {
          setAnimal(data);
        }
      } catch (loadError) {
        if (active) {
          const message =
            loadError instanceof Error
              ? loadError.message
              : "Não foi possível carregar o animal.";

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

  async function handleApply() {
    if (!animal) {
      setSubmitError(
        "Animal indisponível no momento."
      );

      return;
    }

    try {
      setSubmitLoading(true);
      setSubmitError("");
      setSubmitSuccess("");

      await applicationService.criar({
        animalId: animal.id,
      });

      setSubmitSuccess(
        "Aplicação enviada com sucesso!"
      );
    } catch (applyError) {
      const errorMessage =
        applyError instanceof Error
          ? applyError.message
          : "Não foi possível enviar sua aplicação.";

      setSubmitError(errorMessage);
    } finally {
      setSubmitLoading(false);
    }
  }

  if (loading) {
    return (
      <AppShell
        eyebrow="Detalhes"
        title="Carregando animal"
        description="Buscando informações..."
        secondaryAction={{
          label: "Voltar",
          href: "/animais",
        }}
      >
        <div className="rounded-[32px] border border-zinc-200 bg-white p-16 text-center shadow-lg">
          <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />

          <p className="mt-6 text-sm text-zinc-500">
            Carregando detalhes do animal...
          </p>
        </div>
      </AppShell>
    );
  }

  if (error || !animal) {
    return (
      <AppShell
        eyebrow="Erro"
        title="Animal não encontrado"
        description="Não foi possível carregar este animal."
        secondaryAction={{
          label: "Voltar",
          href: "/animais",
        }}
      >
        <div className="rounded-[32px] border border-red-200 bg-red-50 p-10 text-center shadow-lg">
          <p className="font-medium text-red-700">
            {error ||
              "Animal não encontrado."}
          </p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      eyebrow="Detalhes"
      title={animal.nome}
      description="Conheça mais sobre este pet."
      secondaryAction={{
        label: "Voltar",
        href: "/animais",
      }}
    >
      <div className="mb-6">
        <Link
          href="/animais"
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition hover:text-zinc-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao catálogo
        </Link>
      </div>

      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        {/* LEFT */}
        <article className="overflow-hidden rounded-[36px] border border-zinc-200 bg-white shadow-xl">
          {/* HERO */}
          <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-100 via-white to-amber-100">
            <div className="absolute -top-20 right-0 h-72 w-72 rounded-full bg-emerald-200/30 blur-3xl" />

            <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-amber-200/30 blur-3xl" />

            <span className="relative text-9xl font-black uppercase text-emerald-600/80">
              {animal.nome.slice(0, 1)}
            </span>

            <div className="absolute left-5 top-5 rounded-full bg-white/90 px-4 py-2 text-xs font-bold text-zinc-800 shadow-lg backdrop-blur">
              {formatLabel(animal.status)}
            </div>
          </div>

          {/* CONTENT */}
          <div className="p-8">
            <div className="flex flex-wrap gap-2">
              <Badge>
                {formatLabel(animal.especie)}
              </Badge>

              <Badge>
                {formatLabel(animal.porte)}
              </Badge>

              <Badge>
                {animal.idade} anos
              </Badge>

              {animal.temDeficienciaFisica && (
                <Badge>
                  Necessidades especiais
                </Badge>
              )}

              {animal.temDoencaCronica && (
                <Badge>
                  Acompanhamento médico
                </Badge>
              )}
            </div>

            <h1 className="mt-6 text-4xl font-black tracking-tight text-zinc-900">
              {animal.nome}
            </h1>

            <p className="mt-5 text-base leading-8 text-zinc-600">
              {animal.descricaoSaude ??
                "Este pet está saudável e pronto para encontrar um novo lar cheio de carinho."}
            </p>

            {/* INFO GRID */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <InfoItem
                icon={
                  <Activity className="h-5 w-5 text-emerald-600" />
                }
                label="Energia"
                value={formatLabel(
                  animal.nivelEnergia ??
                    "MEDIO"
                )}
              />

              <InfoItem
                icon={
                  <Volume2 className="h-5 w-5 text-emerald-600" />
                }
                label="Barulho"
                value={formatLabel(
                  animal.nivelBarulho ??
                    "BAIXO"
                )}
              />

              <InfoItem
                icon={
                  <Weight className="h-5 w-5 text-emerald-600" />
                }
                label="Peso"
                value={`${animal.peso.toFixed(
                  1
                )} kg`}
              />

              <InfoItem
                icon={
                  <Calendar className="h-5 w-5 text-emerald-600" />
                }
                label="Idade"
                value={`${animal.idade} anos`}
              />
            </div>

            {/* SOCIAL */}
            <div className="mt-8 rounded-3xl border border-zinc-200 bg-zinc-50 p-6">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-emerald-600" />

                <h2 className="font-bold text-zinc-900">
                  Temperamento
                </h2>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-white p-4 text-center">
                  <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Estranhos
                  </p>

                  <p className="mt-2 text-lg font-bold text-zinc-900">
                    {formatBoolean(
                      animal.sociavelEstranhos
                    )}
                  </p>
                </div>

                <div className="rounded-2xl bg-white p-4 text-center">
                  <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Crianças
                  </p>

                  <p className="mt-2 text-lg font-bold text-zinc-900">
                    {formatBoolean(
                      animal.sociavelCriancas
                    )}
                  </p>
                </div>

                <div className="rounded-2xl bg-white p-4 text-center">
                  <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Outros animais
                  </p>

                  <p className="mt-2 text-lg font-bold text-zinc-900">
                    {formatBoolean(
                      animal.sociavelAnimais
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* RIGHT */}
        <aside className="space-y-6">
          <div className="rounded-[36px] border border-zinc-200 bg-gradient-to-br from-emerald-50 to-white p-8 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-md">
                <PawPrint className="h-7 w-7 text-emerald-600" />
              </div>

              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
                  Adoção
                </p>

                <h2 className="text-2xl font-black text-zinc-900">
                  Próximo passo
                </h2>
              </div>
            </div>

            {isAdopter ? (
              <>
                <p className="mt-6 text-sm leading-7 text-zinc-600">
                  Gostou deste pet? Envie
                  agora sua aplicação para
                  adoção.
                </p>

                <button
                  type="button"
                  onClick={handleApply}
                  disabled={submitLoading}
                  className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-5 py-4 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-70"
                >
                  <Heart className="h-4 w-4" />

                  {submitLoading
                    ? "Enviando..."
                    : "Enviar aplicação"}
                </button>

                <Link
                  href="/adotante/aplicacoes"
                  className="mt-4 inline-flex w-full items-center justify-center rounded-2xl border border-zinc-200 bg-white px-5 py-4 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
                >
                  Minhas aplicações
                </Link>

                {submitError && (
                  <p className="mt-4 text-sm text-red-700">
                    {submitError}
                  </p>
                )}

                {submitSuccess && (
                  <div className="mt-4 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                    <CheckCircle2 className="h-5 w-5 shrink-0" />

                    {submitSuccess}
                  </div>
                )}
              </>
            ) : (
              <>
                <p className="mt-6 text-sm leading-7 text-zinc-600">
                  Faça login como adotante
                  para enviar aplicações e
                  acompanhar o processo.
                </p>

                <div className="mt-8 flex flex-col gap-4">
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-5 py-4 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:-translate-y-0.5 hover:shadow-xl"
                  >
                    Entrar
                  </Link>

                  <Link
                    href="/adotante/questionario"
                    className="inline-flex items-center justify-center rounded-2xl border border-zinc-200 bg-white px-5 py-4 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
                  >
                    Fazer questionário
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* EXTRA */}
          <div className="rounded-[36px] border border-zinc-200 bg-white p-8 shadow-lg">
            <h3 className="text-lg font-bold text-zinc-900">
              Sobre a adoção
            </h3>

            <p className="mt-4 text-sm leading-7 text-zinc-600">
              Todos os pets cadastrados
              passam por acompanhamento
              veterinário e análise do
              abrigo responsável.
            </p>

            <div className="mt-6 space-y-4">
              <div className="flex gap-3">
                <ShieldCheck className="mt-1 h-5 w-5 text-emerald-600" />

                <p className="text-sm text-zinc-600">
                  Processo seguro e
                  acompanhado.
                </p>
              </div>

              <div className="flex gap-3">
                <Heart className="mt-1 h-5 w-5 text-emerald-600" />

                <p className="text-sm text-zinc-600">
                  Acompanhamento pós-adoção.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </AppShell>
  );
}
