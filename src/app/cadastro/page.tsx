"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  PawPrint,
  HeartHandshake,
  Building2,
  Mail,
  Lock,
  User,
  FileText,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from "lucide-react";

import { AppShell } from "../../components/layout/AppShell";

import {
  authService,
  saveAuthSession,
} from "../../services/authService";

export default function CadastroPage() {
  const router = useRouter();

  const [accountType, setAccountType] =
    useState<"adotante" | "abrigo">(
      "adotante"
    );

  const [form, setForm] = useState({
    name: "",
    document: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [feedback, setFeedback] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const passwordRules = {
    minLength:
      form.password.length >= 8,
    hasNumber: /\d/.test(
      form.password
    ),
    hasSpecial:
      /[!@#$%^&*(),.?":{}|<>]/.test(
        form.password
      ),
  };

  const isValid =
    form.name.trim().length > 0 &&
    form.email.includes("@") &&
    passwordRules.minLength &&
    passwordRules.hasNumber &&
    passwordRules.hasSpecial &&
    form.password ===
      form.confirmPassword;

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setFeedback("");

    if (!isValid) return;

    try {
      setLoading(true);

      if (accountType === "adotante") {
        await authService.registrarAdotante(
          {
            nome: form.name.trim(),
            email:
              form.email.trim(),
            senha: form.password,
            cpf: form.document.trim(),
          }
        );
      } else {
        await authService.registrarAbrigo(
          {
            nome: form.name.trim(),
            email:
              form.email.trim(),
            senha: form.password,
            cnpj:
              form.document.trim(),
          }
        );
      }

      const login =
        await authService.login({
          email: form.email.trim(),
          senha: form.password,
        });

      saveAuthSession(login);

      setFeedback(
        "Conta criada com sucesso!"
      );

      router.push(
        login.user.role ===
          "ABRIGO"
          ? "/abrigo/dashboard"
          : "/adotante/dashboard"
      );
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : "Não foi possível concluir o cadastro.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell
      eyebrow="Cadastro"
      title="Criar conta"
      description="Encontre o pet ideal ou ajude animais a encontrarem um novo lar."
      showNavigation={false}
    >
      <section className="grid gap-8 lg:grid-cols-[1fr_1.05fr]">
        {/* LEFT SIDE */}
        <article className="relative overflow-hidden rounded-[36px] border border-zinc-200 bg-gradient-to-br from-emerald-50 via-white to-amber-50 p-10 shadow-xl">
          <div className="absolute -top-16 right-0 h-56 w-56 rounded-full bg-emerald-200/30 blur-3xl" />

          <div className="absolute bottom-0 left-0 h-56 w-56 rounded-full bg-amber-200/30 blur-3xl" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm">
              <Sparkles className="h-4 w-4 text-emerald-600" />

              <span className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                Pet Matching
              </span>
            </div>

            <h2 className="mt-8 text-4xl font-black leading-tight tracking-tight text-zinc-900">
              Crie sua conta e
              transforme vidas
            </h2>

            <p className="mt-5 max-w-lg text-base leading-8 text-zinc-600">
              Conectamos adotantes e
              abrigos através de um
              sistema inteligente de
              compatibilidade.
            </p>

            {/* CARDS */}
            <div className="mt-10 grid gap-4">
              <button
                type="button"
                onClick={() =>
                  setAccountType(
                    "adotante"
                  )
                }
                className={`group rounded-3xl border p-6 text-left transition-all duration-300 ${
                  accountType ===
                  "adotante"
                    ? "border-emerald-500 bg-white shadow-lg shadow-emerald-100"
                    : "border-zinc-200 bg-white/70 hover:bg-white"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                      accountType ===
                      "adotante"
                        ? "bg-emerald-100"
                        : "bg-zinc-100"
                    }`}
                  >
                    <HeartHandshake className="h-7 w-7 text-emerald-600" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-zinc-900">
                        Adotante
                      </h3>

                      {accountType ===
                        "adotante" && (
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      )}
                    </div>

                    <p className="mt-2 text-sm leading-6 text-zinc-600">
                      Procure pets,
                      receba matches e
                      acompanhe suas
                      aplicações.
                    </p>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() =>
                  setAccountType(
                    "abrigo"
                  )
                }
                className={`group rounded-3xl border p-6 text-left transition-all duration-300 ${
                  accountType ===
                  "abrigo"
                    ? "border-emerald-500 bg-white shadow-lg shadow-emerald-100"
                    : "border-zinc-200 bg-white/70 hover:bg-white"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                      accountType ===
                      "abrigo"
                        ? "bg-emerald-100"
                        : "bg-zinc-100"
                    }`}
                  >
                    <Building2 className="h-7 w-7 text-emerald-600" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-zinc-900">
                        Abrigo
                      </h3>

                      {accountType ===
                        "abrigo" && (
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      )}
                    </div>

                    <p className="mt-2 text-sm leading-6 text-zinc-600">
                      Cadastre animais,
                      gerencie adoções
                      e acompanhe
                      aplicações.
                    </p>
                  </div>
                </div>
              </button>
            </div>

            {/* FOOTER INFO */}
            <div className="mt-10 rounded-3xl border border-zinc-200 bg-white/80 p-6 backdrop-blur">
              <div className="flex gap-3">
                <ShieldCheck className="mt-1 h-5 w-5 text-emerald-600" />

                <div>
                  <p className="font-semibold text-zinc-900">
                    Plataforma segura
                  </p>

                  <p className="mt-1 text-sm leading-6 text-zinc-600">
                    Seus dados são
                    protegidos e o
                    processo de adoção
                    é acompanhado.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* FORM */}
        <section className="rounded-[36px] border border-zinc-200 bg-white p-8 shadow-xl">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100">
                <PawPrint className="h-7 w-7 text-emerald-600" />
              </div>

              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
                  Novo cadastro
                </p>

                <h2 className="text-2xl font-black text-zinc-900">
                  Vamos começar
                </h2>
              </div>
            </div>
          </div>

          <form
            className="mt-8 space-y-5"
            onSubmit={handleSubmit}
          >
            {/* NAME */}
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-zinc-700">
                {accountType ===
                "adotante"
                  ? "Nome completo"
                  : "Nome do abrigo"}
              </span>

              <div className="relative">
                <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />

                <input
                  className="h-14 w-full rounded-2xl border border-zinc-200 bg-zinc-50 pl-12 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:bg-white"
                  value={form.name}
                  onChange={(event) =>
                    setForm(
                      (current) => ({
                        ...current,
                        name: event.target.value,
                      })
                    )
                  }
                  placeholder={
                    accountType ===
                    "adotante"
                      ? "Digite seu nome"
                      : "Digite o nome do abrigo"
                  }
                />
              </div>
            </label>

            {/* DOCUMENT */}
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-zinc-700">
                {accountType ===
                "adotante"
                  ? "CPF"
                  : "CNPJ"}
              </span>

              <div className="relative">
                <FileText className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />

                <input
                  className="h-14 w-full rounded-2xl border border-zinc-200 bg-zinc-50 pl-12 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:bg-white"
                  value={form.document}
                  onChange={(event) =>
                    setForm(
                      (current) => ({
                        ...current,
                        document:
                          event.target
                            .value,
                      })
                    )
                  }
                  placeholder={
                    accountType ===
                    "adotante"
                      ? "000.000.000-00"
                      : "00.000.000/0001-00"
                  }
                />
              </div>
            </label>

            {/* EMAIL */}
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-zinc-700">
                Email
              </span>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />

                <input
                  type="email"
                  className="h-14 w-full rounded-2xl border border-zinc-200 bg-zinc-50 pl-12 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:bg-white"
                  value={form.email}
                  onChange={(event) =>
                    setForm(
                      (current) => ({
                        ...current,
                        email:
                          event.target
                            .value,
                      })
                    )
                  }
                  placeholder="seu@email.com"
                />
              </div>
            </label>

            {/* PASSWORD */}
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-zinc-700">
                Senha
              </span>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />

                <input
                  type="password"
                  className="h-14 w-full rounded-2xl border border-zinc-200 bg-zinc-50 pl-12 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:bg-white"
                  value={form.password}
                  onChange={(event) =>
                    setForm(
                      (current) => ({
                        ...current,
                        password:
                          event.target
                            .value,
                      })
                    )
                  }
                  placeholder="********"
                />
              </div>
            </label>

            {/* CONFIRM */}
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-zinc-700">
                Confirmar senha
              </span>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />

                <input
                  type="password"
                  className="h-14 w-full rounded-2xl border border-zinc-200 bg-zinc-50 pl-12 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:bg-white"
                  value={
                    form.confirmPassword
                  }
                  onChange={(event) =>
                    setForm(
                      (current) => ({
                        ...current,
                        confirmPassword:
                          event.target
                            .value,
                      })
                    )
                  }
                  placeholder="********"
                />
              </div>
            </label>

            {/* PASSWORD RULES */}
            <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-5">
              <p className="font-semibold text-zinc-900">
                Requisitos da senha
              </p>

              <div className="mt-4 space-y-2 text-sm">
                <p
                  className={
                    passwordRules.minLength
                      ? "text-emerald-600"
                      : "text-zinc-500"
                  }
                >
                  ✓ Mínimo de 8
                  caracteres
                </p>

                <p
                  className={
                    passwordRules.hasNumber
                      ? "text-emerald-600"
                      : "text-zinc-500"
                  }
                >
                  ✓ Pelo menos um
                  número
                </p>

                <p
                  className={
                    passwordRules.hasSpecial
                      ? "text-emerald-600"
                      : "text-zinc-500"
                  }
                >
                  ✓ Um caractere
                  especial
                </p>

                <p
                  className={
                    form.password ===
                      form.confirmPassword &&
                    form.confirmPassword
                      ? "text-emerald-600"
                      : "text-zinc-500"
                  }
                >
                  ✓ Senhas iguais
                </p>
              </div>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={
                loading || !isValid
              }
              className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                "Criando conta..."
              ) : (
                <>
                  Criar conta
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {feedback && (
            <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
              {feedback}
            </div>
          )}
        </section>
      </section>
    </AppShell>
  );
}
