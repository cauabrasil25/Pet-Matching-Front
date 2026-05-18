"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  PawPrint,
  Heart,
  ShieldCheck,
  Building2,
  User,
  Mail,
  Lock,
  FileText,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

import { AppShell } from "../components/layout/AppShell";
import { authService, saveAuthSession } from "../services/authService";

export default function HomePage() {
  const router = useRouter();

  const [mode, setMode] = useState<"login" | "signup">("login");

  const [userType, setUserType] = useState<
    "adotante" | "abrigo"
  >("adotante");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [cpf, setCpf] = useState("");
  const [cnpj, setCnpj] = useState("");

  const [submitted, setSubmitted] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordRules = {
    minLength: password.length >= 8,
    hasNumber: /\d/.test(password),
    hasSpecialChar:
      /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const isSignupValid =
    name.trim().length > 0 &&
    (userType === "adotante"
      ? cpf.trim().length > 0
      : cnpj.trim().length > 0) &&
    passwordRules.minLength &&
    passwordRules.hasNumber &&
    passwordRules.hasSpecialChar &&
    confirmPassword === password &&
    confirmPassword.length > 0;

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSubmitted("");

    if (!email || !password) return;

    if (mode === "signup" && !isSignupValid)
      return;

    try {
      setLoading(true);

      if (mode === "login") {
        const response = await authService.login({
          email,
          senha: password,
        });

        saveAuthSession(response);

        setSubmitted(
          "Login realizado com sucesso."
        );

        const role =
          response?.user?.role ?? "ADOTANTE";

        router.push(
          role === "ABRIGO"
            ? "/abrigo/dashboard"
            : "/adotante/dashboard"
        );

        return;
      }

      if (userType === "adotante") {
        await authService.registrarAdotante({
          nome: name.trim(),
          email,
          senha: password,
          cpf: cpf.trim(),
        });
      } else {
        await authService.registrarAbrigo({
          nome: name.trim(),
          email,
          senha: password,
          cnpj: cnpj.trim(),
        });
      }

      const response = await authService.login({
        email,
        senha: password,
      });

      saveAuthSession(response);

      const role =
        response?.user?.role ?? "ADOTANTE";

      router.push(
        role === "ABRIGO"
          ? "/abrigo/dashboard"
          : "/adotante/dashboard"
      );
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : "Não foi possível autenticar.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell 
      eyebrow="Pet Matching"
      title="Encontre seu novo melhor amigo"
      description="Plataforma inteligente para conectar adotantes e abrigos."
      showNavigation={false}
    >
      <div className="relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.12),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.12),transparent_35%)]" />

        <section className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-4 py-10 lg:grid-cols-2">
          {/* Left Side */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
              <PawPrint className="h-4 w-4" />
              Plataforma de adoção inteligente
            </div>

            <div>
              <h1 className="max-w-xl text-5xl font-black leading-tight tracking-tight text-zinc-900">
                Encontre o pet ideal para sua família.
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-600">
                Conectamos adotantes e abrigos
                através de um sistema inteligente
                de compatibilidade comportamental.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-zinc-200 bg-white/80 p-5 shadow-sm backdrop-blur">
                <Heart className="h-8 w-8 text-rose-500" />

                <h3 className="mt-4 font-semibold text-zinc-900">
                  Matching inteligente
                </h3>

                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  Compatibilidade baseada no seu
                  estilo de vida.
                </p>
              </div>

              <div className="rounded-3xl border border-zinc-200 bg-white/80 p-5 shadow-sm backdrop-blur">
                <ShieldCheck className="h-8 w-8 text-emerald-600" />

                <h3 className="mt-4 font-semibold text-zinc-900">
                  Processo seguro
                </h3>

                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  Cadastro validado para adotantes
                  e abrigos.
                </p>
              </div>

              <div className="rounded-3xl border border-zinc-200 bg-white/80 p-5 shadow-sm backdrop-blur">
                <PawPrint className="h-8 w-8 text-amber-500" />

                <h3 className="mt-4 font-semibold text-zinc-900">
                  Mais adoções
                </h3>

                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  Aproximando pets de famílias
                  ideais.
                </p>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="relative">
            <div className="absolute -inset-1 rounded-[36px] bg-gradient-to-br from-emerald-500/30 via-transparent to-amber-500/30 blur-2xl" />

            <div className="relative rounded-[36px] border border-white/40 bg-white/80 p-8 shadow-2xl backdrop-blur-xl">
              {/* Tabs */}
              <div className="flex rounded-2xl bg-zinc-100 p-1">
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                    mode === "login"
                      ? "bg-white text-zinc-900 shadow-md"
                      : "text-zinc-500"
                  }`}
                >
                  Entrar
                </button>

                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                    mode === "signup"
                      ? "bg-white text-zinc-900 shadow-md"
                      : "text-zinc-500"
                  }`}
                >
                  Criar conta
                </button>
              </div>

              <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-5"
              >
                {/* Tipo de usuário */}
                {mode === "signup" && (
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() =>
                        setUserType("adotante")
                      }
                      className={`rounded-3xl border p-5 text-left transition-all ${
                        userType === "adotante"
                          ? "border-emerald-500 bg-emerald-50 shadow-md"
                          : "border-zinc-200 bg-white hover:border-zinc-300"
                      }`}
                    >
                      <User className="h-8 w-8 text-emerald-600" />

                      <h3 className="mt-4 font-semibold text-zinc-900">
                        Adotante
                      </h3>

                      <p className="mt-1 text-sm text-zinc-600">
                        Buscar e aplicar para pets
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setUserType("abrigo")
                      }
                      className={`rounded-3xl border p-5 text-left transition-all ${
                        userType === "abrigo"
                          ? "border-emerald-500 bg-emerald-50 shadow-md"
                          : "border-zinc-200 bg-white hover:border-zinc-300"
                      }`}
                    >
                      <Building2 className="h-8 w-8 text-amber-600" />

                      <h3 className="mt-4 font-semibold text-zinc-900">
                        Abrigo
                      </h3>

                      <p className="mt-1 text-sm text-zinc-600">
                        Gerenciar animais e adoções
                      </p>
                    </button>
                  </div>
                )}

                {/* Nome */}
                {mode === "signup" && (
                  <Input
                    icon={<User size={18} />}
                    placeholder={
                      userType === "adotante"
                        ? "Seu nome completo"
                        : "Nome do abrigo"
                    }
                    value={name}
                    onChange={setName}
                  />
                )}

                {/* CPF / CNPJ */}
                {mode === "signup" &&
                  userType === "adotante" && (
                    <Input
                      icon={<FileText size={18} />}
                      placeholder="CPF"
                      value={cpf}
                      onChange={setCpf}
                    />
                  )}

                {mode === "signup" &&
                  userType === "abrigo" && (
                    <Input
                      icon={<FileText size={18} />}
                      placeholder="CNPJ"
                      value={cnpj}
                      onChange={setCnpj}
                    />
                  )}

                {/* Email */}
                <Input
                  icon={<Mail size={18} />}
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={setEmail}
                />

                {/* Senha */}
                <Input
                  icon={<Lock size={18} />}
                  type="password"
                  placeholder="Senha"
                  value={password}
                  onChange={setPassword}
                />

                {/* Confirmar senha */}
                {mode === "signup" && (
                  <>
                    <Input
                      icon={<Lock size={18} />}
                      type="password"
                      placeholder="Confirmar senha"
                      value={confirmPassword}
                      onChange={setConfirmPassword}
                    />

                    <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-5">
                      <p className="font-semibold text-zinc-900">
                        Requisitos da senha
                      </p>

                      <div className="mt-4 space-y-2">
                        <PasswordRule
                          valid={
                            passwordRules.minLength
                          }
                          text="Mínimo de 8 caracteres"
                        />

                        <PasswordRule
                          valid={
                            passwordRules.hasNumber
                          }
                          text="Pelo menos um número"
                        />

                        <PasswordRule
                          valid={
                            passwordRules.hasSpecialChar
                          }
                          text="Um caractere especial"
                        />

                        <PasswordRule
                          valid={
                            confirmPassword ===
                              password &&
                            confirmPassword.length >
                              0
                          }
                          text="As senhas coincidem"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Error */}
                {error && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                {/* Success */}
                {submitted && (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    {submitted}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={
                    loading ||
                    (mode === "signup" &&
                      !isSignupValid)
                  }
                  className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-5 py-4 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading
                    ? "Processando..."
                    : mode === "login"
                    ? "Entrar"
                    : "Criar conta"}

                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

interface InputProps {
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}

function Input({
  icon,
  placeholder,
  value,
  onChange,
  type = "text",
}: InputProps) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
        {icon}
      </div>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="w-full rounded-2xl border border-zinc-200 bg-white px-12 py-4 text-sm outline-none transition-all placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
      />
    </div>
  );
}

function PasswordRule({
  valid,
  text,
}: {
  valid: boolean;
  text: string;
}) {
  return (
    <div
      className={`flex items-center gap-2 text-sm ${
        valid
          ? "text-emerald-700"
          : "text-zinc-500"
      }`}
    >
      <CheckCircle2
        className={`h-4 w-4 ${
          valid
            ? "text-emerald-600"
            : "text-zinc-400"
        }`}
      />

      <span>{text}</span>
    </div>
  );
}
