"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  Search,
  SlidersHorizontal,
  Heart,
  PawPrint,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from "lucide-react";

import { AppShell } from "../../components/layout/AppShell";
import { animalService } from "../../services/animalService";

import type {
  AnimalResponse,
} from "../../types/animal";

function getCurrentUser() {
  if (typeof window === "undefined") return null;

  const user =
    window.localStorage.getItem("pm_user");

  return user ? JSON.parse(user) : null;
}

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

type AnimalWithScore = {
  animal: AnimalResponse;
  score?: number;
  chanceRetorno?: number;
  explicacoes?: string[];
};

export default function AnimalsPage() {
  const [animalsWithScore, setAnimalsWithScore] =
    useState<AnimalWithScore[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [species, setSpecies] = useState("all");

  const [size, setSize] = useState("all");

  const currentUser = getCurrentUser();

  useEffect(() => {
    let active = true;

    async function loadAnimals() {
      try {
        setLoading(true);
        setError("");

        if (currentUser?.role === "ADOTANTE") {
          const matchData =
            await animalService.listarComMatching();

          if (active) {
            setAnimalsWithScore(
              matchData.map((m) => ({
                animal: m.animal,
                score: m.score,
                chanceRetorno:
                  m.chanceRetorno,
                explicacoes: m.explicacoes,
              }))
            );
          }
        } else {
          const data =
            await animalService.listar();

          if (active) {
            setAnimalsWithScore(
              data.map((animal) => ({
                animal,
              }))
            );
          }
        }
      } catch (loadError) {
        if (active) {
          const message =
            loadError instanceof Error
              ? loadError.message
              : "Não foi possível carregar o catálogo.";

          setError(message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadAnimals();

    return () => {
      active = false;
    };
  }, [currentUser?.role]);

  const speciesOptions = useMemo(() => {
    return [
      ...new Set(
        animalsWithScore.map(
          (a) => a.animal.especie
        )
      ),
    ].sort((a, b) => a.localeCompare(b));
  }, [animalsWithScore]);

  const sizeOptions = useMemo(() => {
    return [
      ...new Set(
        animalsWithScore.map(
          (a) => a.animal.porte
        )
      ),
    ].sort((a, b) => a.localeCompare(b));
  }, [animalsWithScore]);

  const visibleAnimals =
    animalsWithScore.filter((item) => {
      const animal = item.animal;

      const haystack =
        `${animal.nome}
        ${animal.especie}
        ${animal.porte}
        ${animal.nivelEnergia ?? ""}
        ${animal.nivelBarulho ?? ""}`.toLowerCase();

      const matchesSearch =
        haystack.includes(search.toLowerCase());

      const matchesSpecies =
        species === "all" ||
        animal.especie === species;

      const matchesSize =
        size === "all" ||
        animal.porte === size;

      return (
        matchesSearch &&
        matchesSpecies &&
        matchesSize
      );
    });

  return (
    <AppShell
      eyebrow="Adoção"
      title="Encontre seu novo melhor amigo"
      description="Sistema inteligente de matching entre pets e adotantes."
      primaryAction={{
        label: "Questionário",
        href: "/adotante/questionario",
      }}
      secondaryAction={{
        label: "Login",
        href: "/login",
      }}
    >
      {/* HERO */}
      <section className="relative overflow-hidden rounded-[36px] border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-amber-50 p-8 shadow-xl">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-emerald-200/30 blur-3xl" />

        <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-amber-200/30 blur-3xl" />

        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-sm font-medium text-emerald-700 backdrop-blur">
              <Sparkles className="h-4 w-4" />
              Matching inteligente
            </div>

            <h1 className="mt-6 text-5xl font-black leading-tight tracking-tight text-zinc-900">
              Pets esperando
              <span className="block text-emerald-600">
                por um novo lar
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-600">
              Descubra animais compatíveis
              com seu estilo de vida usando
              nosso sistema de recomendação.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <div className="rounded-2xl border border-zinc-200 bg-white/80 px-5 py-4 backdrop-blur">
                <p className="text-2xl font-bold text-zinc-900">
                  {
                    animalsWithScore.length
                  }
                </p>

                <p className="text-sm text-zinc-500">
                  Pets disponíveis
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-white/80 px-5 py-4 backdrop-blur">
                <p className="text-2xl font-bold text-zinc-900">
                  IA
                </p>

                <p className="text-sm text-zinc-500">
                  Compatibilidade automática
                </p>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex">
            <div className="flex h-52 w-52 items-center justify-center rounded-full bg-white shadow-2xl">
              <PawPrint className="h-24 w-24 text-emerald-500" />
            </div>
          </div>
        </div>
      </section>

      {/* FILTROS */}
      <section className="mt-8 rounded-[32px] border border-zinc-200 bg-white p-6 shadow-lg">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100">
            <SlidersHorizontal className="h-5 w-5 text-emerald-700" />
          </div>

          <div>
            <h2 className="font-semibold text-zinc-900">
              Filtrar animais
            </h2>

            <p className="text-sm text-zinc-500">
              Busque pets por espécie,
              porte e características
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-[1.5fr_1fr_1fr]">
          {/* Busca */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />

            <input
              className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-12 py-4 text-sm outline-none transition-all placeholder:text-zinc-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Buscar por nome, espécie ou características"
            />
          </div>

          {/* Espécie */}
          <select
            className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-4 text-sm outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
            value={species}
            onChange={(event) =>
              setSpecies(event.target.value)
            }
          >
            <option value="all">
              Todas as espécies
            </option>

            {speciesOptions.map((option) => (
              <option
                key={option}
                value={option}
              >
                {formatLabel(option)}
              </option>
            ))}
          </select>

          {/* Porte */}
          <select
            className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-4 text-sm outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
            value={size}
            onChange={(event) =>
              setSize(event.target.value)
            }
          >
            <option value="all">
              Todos os portes
            </option>

            {sizeOptions.map((option) => (
              <option
                key={option}
                value={option}
              >
                {formatLabel(option)}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* LOADING */}
      {loading && (
        <div className="mt-8 rounded-[32px] border border-zinc-200 bg-white p-12 text-center shadow-lg">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />

          <p className="mt-5 text-sm text-zinc-500">
            Carregando animais...
          </p>
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="mt-8 rounded-[32px] border border-red-200 bg-red-50 p-8 text-center text-red-700 shadow-lg">
          {error}
        </div>
      )}

      {/* GRID */}
      {!loading && !error && (
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {visibleAnimals.map((item) => {
            const animal = item.animal;

            return (
              <article
                key={animal.id}
                className="group flex h-full flex-col overflow-hidden rounded-[32px] border border-zinc-200 bg-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-2xl"
              >
                {/* IMAGE */}
                <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-100 via-white to-amber-100">
                  <span className="text-7xl font-black uppercase text-emerald-600/80 transition-transform duration-300 group-hover:scale-110">
                    {animal.nome.slice(0, 1)}
                  </span>

                  {/* STATUS */}
                  <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-zinc-800 shadow-sm backdrop-blur">
                    {formatLabel(animal.status)}
                  </div>

                  {/* MATCH */}
                  {item.score !== undefined && (
                    <div className="absolute right-4 top-4 rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
                      {item.score}% Match
                    </div>
                  )}
                </div>

                {/* CONTENT */}
                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-2xl font-bold text-zinc-900">
                          {animal.nome}
                        </h2>

                        <p className="mt-1 text-sm text-zinc-500">
                          {formatLabel(
                            animal.especie
                          )}{" "}
                          •{" "}
                          {formatLabel(
                            animal.porte
                          )}{" "}
                          • {animal.idade} anos
                        </p>
                      </div>

                    </div>

                    <p className="mt-4 text-sm leading-7 text-zinc-600">
                      Energia:{" "}
                      <strong>
                        {formatLabel(
                          animal.nivelEnergia ??
                            "MEDIO"
                        )}
                      </strong>{" "}
                      • Barulho:{" "}
                      <strong>
                        {formatLabel(
                          animal.nivelBarulho ??
                            "BAIXO"
                        )}
                      </strong>
                    </p>

                    {item.score !== undefined &&
                      item.chanceRetorno !==
                        undefined && (
                        <div className="mt-5 rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5">
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">
                                Compatibilidade
                              </p>

                              <p className="mt-1 text-sm text-emerald-600">
                                Chance de retorno:
                                <span className="ml-1 font-semibold">
                                  {item.chanceRetorno}%
                                </span>
                              </p>
                            </div>

                            <div className="text-right">
                              <p className="text-3xl font-black leading-none text-emerald-700">
                                {item.score}%
                              </p>

                              <p className="text-xs font-medium text-emerald-600">
                                Match
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                  </div>

                  {/* TAGS */}
                  <div className="mt-5 flex flex-wrap gap-2">
                    <Tag>
                      {formatLabel(
                        animal.especie
                      )}
                    </Tag>

                    <Tag>
                      {formatLabel(
                        animal.porte
                      )}
                    </Tag>

                    <Tag>
                      Sociável:{" "}
                      {formatBoolean(
                        animal.sociavelEstranhos
                      )}
                    </Tag>

                    {animal.temDeficienciaFisica && (
                      <Tag>
                        Necessidades especiais
                      </Tag>
                    )}

                    {animal.temDoencaCronica && (
                      <Tag>
                        Acompanhamento médico
                      </Tag>
                    )}
                  </div>

                  {/* EXPLICAÇÕES */}
                  {item.explicacoes &&
                    item.explicacoes.length >
                      0 && (
                      <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-zinc-500">
                          Por que deu match?
                        </p>

                        <ul className="space-y-2 text-sm text-zinc-600">
                          {item.explicacoes
                            .slice(0, 3)
                            .map(
                              (
                                explicacao,
                                index
                              ) => (
                                <li
                                  key={index}
                                  className="flex gap-2"
                                >
                                  <ShieldCheck className="mt-0.5 h-4 w-4 text-emerald-600" />

                                  <span>
                                    {
                                      explicacao
                                    }
                                  </span>
                                </li>
                              )
                            )}
                        </ul>
                      </div>
                    )}

                  {/* ACTIONS */}
                  <div className="mt-6 flex gap-3">
                    <Link
                      href={`/animais/${animal.id}`}
                      className="flex flex-1 items-center justify-center rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-center text-sm font-semibold text-zinc-700 transition-all hover:border-zinc-300 hover:bg-zinc-50"
                    >
                      Ver detalhes
                    </Link>

                    <Link
                      href={
                        currentUser
                          ? `/animais/${animal.id}`
                          : "/login"
                      }
                      className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:-translate-y-0.5 hover:shadow-xl"
                    >
                      <Heart className="h-4 w-4" />

                      Aplicar

                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* EMPTY */}
      {!loading &&
        !error &&
        visibleAnimals.length === 0 && (
          <div className="mt-8 rounded-[32px] border border-zinc-200 bg-white p-12 text-center shadow-lg">
            <PawPrint className="mx-auto h-14 w-14 text-zinc-300" />

            <h3 className="mt-5 text-xl font-bold text-zinc-900">
              Nenhum animal encontrado
            </h3>

            <p className="mt-2 text-zinc-500">
              Tente ajustar os filtros da
              busca.
            </p>
          </div>
        )}
    </AppShell>
  );
}

function Tag({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-600">
      {children}
    </span>
  );
}
