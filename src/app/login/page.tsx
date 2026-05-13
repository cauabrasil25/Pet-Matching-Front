"use client";

import { useState } from 'react';
import { AppShell } from '../../components/layout/AppShell';

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [userType, setUserType] = useState<'adotante' | 'abrigo'>('adotante');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitted, setSubmitted] = useState('');

  const passwordRules = {
    minLength: password.length >= 8,
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };

  const isSignupValid =
    passwordRules.minLength &&
    passwordRules.hasNumber &&
    passwordRules.hasSpecialChar &&
    confirmPassword === password &&
    confirmPassword.length > 0;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email || !password) return;
    if (mode === 'signup' && !isSignupValid) return;

    const fallbackName = email.split('@')[0] || 'usuario';
    const displayName = name.trim() || fallbackName;
    const accountLabel = userType === 'adotante' ? 'adotante' : 'abrigo';

    setSubmitted(`${mode === 'login' ? 'Login' : 'Cadastro'} pronto para ${displayName} como ${accountLabel}.`);
  };

  return (
    <AppShell
      eyebrow="Acesso"
      title="Entrar na plataforma"
      description="Fluxo de login e cadastro reorganizado para o Next em src/app."
      showNavigation={false}
    >
      <section className="grid gap-6 lg:grid-cols-[1.05fr_1fr]">
        <article className="rounded-[28px] border border-[var(--border)] bg-[linear-gradient(160deg,rgba(15,118,110,0.12),rgba(217,119,6,0.12))] p-8 shadow-[var(--shadow)]">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">Pet Matching</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--text)]">Acesso para adotantes e abrigos</h2>
          <p className="mt-4 max-w-xl text-sm leading-6 text-[var(--muted)]">
            A tela de origem foi adaptada para a estrutura de rotas do Next, mantendo o mesmo fluxo de autenticacao,
            escolha de perfil e validacao de senha.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-[var(--border)] bg-white/80 p-5">
              <p className="text-sm font-semibold text-[var(--primary-strong)]">Adotante</p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Acompanhe questionario, favoritos e aplicacoes enviadas.</p>
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-white/80 p-5">
              <p className="text-sm font-semibold text-[var(--primary-strong)]">Abrigo</p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Gerencie animais, cadastros e aplicacoes recebidas.</p>
            </div>
          </div>
        </article>

        <section className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]">
          <div className="flex gap-2 rounded-full bg-[var(--surface-2)] p-1 text-sm font-medium">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 rounded-full px-4 py-2 transition ${mode === 'login' ? 'bg-white text-[var(--text)] shadow-sm' : 'text-[var(--muted)]'}`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`flex-1 rounded-full px-4 py-2 transition ${mode === 'signup' ? 'bg-white text-[var(--text)] shadow-sm' : 'text-[var(--muted)]'}`}
            >
              Cadastro
            </button>
          </div>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            {mode === 'signup' ? (
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setUserType('adotante')}
                  className={`rounded-2xl border p-4 text-left transition ${userType === 'adotante' ? 'border-[var(--primary)] bg-[rgba(15,118,110,0.08)]' : 'border-[var(--border)] bg-white'}`}
                >
                  <p className="font-semibold text-[var(--text)]">Adotante</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">Perfil para buscar e aplicar em animais.</p>
                </button>
                <button
                  type="button"
                  onClick={() => setUserType('abrigo')}
                  className={`rounded-2xl border p-4 text-left transition ${userType === 'abrigo' ? 'border-[var(--primary)] bg-[rgba(15,118,110,0.08)]' : 'border-[var(--border)] bg-white'}`}
                >
                  <p className="font-semibold text-[var(--text)]">Abrigo</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">Perfil para publicar animais e aprovar matches.</p>
                </button>
              </div>
            ) : null}

            {mode === 'signup' ? (
              <label className="block space-y-2 text-sm font-medium text-[var(--text)]">
                <span>{userType === 'adotante' ? 'Nome completo' : 'Nome do abrigo'}</span>
                <input
                  className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--primary)]"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder={userType === 'adotante' ? 'Digite seu nome' : 'Digite o nome do abrigo'}
                />
              </label>
            ) : null}

            <label className="block space-y-2 text-sm font-medium text-[var(--text)]">
              <span>Email</span>
              <input
                className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--primary)]"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="seu@email.com"
              />
            </label>

            <label className="block space-y-2 text-sm font-medium text-[var(--text)]">
              <span>Senha</span>
              <input
                className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--primary)]"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="********"
              />
            </label>

            {mode === 'signup' ? (
              <>
                <label className="block space-y-2 text-sm font-medium text-[var(--text)]">
                  <span>Confirmar senha</span>
                  <input
                    className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--primary)]"
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="********"
                  />
                </label>

                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-4 text-sm text-[var(--muted)]">
                  <p className="font-semibold text-[var(--text)]">Regras da senha</p>
                  <ul className="mt-3 space-y-1">
                    <li>{passwordRules.minLength ? 'OK' : 'Pendente'} - minimo de 8 caracteres</li>
                    <li>{passwordRules.hasNumber ? 'OK' : 'Pendente'} - pelo menos um numero</li>
                    <li>{passwordRules.hasSpecialChar ? 'OK' : 'Pendente'} - pelo menos um caractere especial</li>
                    <li>{confirmPassword && confirmPassword === password ? 'OK' : 'Pendente'} - as senhas coincidem</li>
                  </ul>
                </div>
              </>
            ) : null}

            <button
              type="submit"
              className="w-full rounded-full bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--primary-strong)] disabled:cursor-not-allowed disabled:opacity-70"
              disabled={mode === 'signup' && !isSignupValid}
            >
              {mode === 'login' ? 'Entrar' : 'Criar conta'}
            </button>
          </form>

          {submitted ? <p className="mt-4 text-sm text-[var(--primary-strong)]">{submitted}</p> : null}
        </section>
      </section>
    </AppShell>
  );
}
