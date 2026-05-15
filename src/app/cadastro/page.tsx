"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '../../components/layout/AppShell';
import { authService, saveAuthSession } from '../../services/authService';

export default function CadastroPage() {
  const router = useRouter();
  const [accountType, setAccountType] = useState<'adotante' | 'abrigo'>('adotante');
  const [form, setForm] = useState({
    name: '',
    document: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isValid =
    form.name.trim().length > 0 &&
    form.email.includes('@') &&
    form.password.length >= 8 &&
    form.password === form.confirmPassword;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setFeedback('');
    if (!isValid) return;

    try {
      setLoading(true);

      if (accountType === 'adotante') {
        await authService.registrarAdotante({
          nome: form.name.trim(),
          email: form.email.trim(),
          senha: form.password
        });
      } else {
        await authService.registrarAbrigo({
          nome: form.name.trim(),
          email: form.email.trim(),
          senha: form.password,
          cnpj: form.document.trim() || undefined
        });
      }

      const login = await authService.login({
        email: form.email.trim(),
        senha: form.password
      });
      saveAuthSession(login);

      setFeedback('Conta criada com sucesso. Redirecionando...');
      router.push(login.user.role === 'ABRIGO' ? '/abrigo/dashboard' : '/adotante/dashboard');
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : 'Nao foi possivel concluir o cadastro.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell
      eyebrow="Cadastro"
      title="Criar conta"
      description="Rotina de registro separada por perfil, pronta para receber a API do backend."
      showNavigation={false}
    >
      <section className="grid gap-6 lg:grid-cols-[1fr_1.05fr]">
        <article className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-8 shadow-[var(--shadow)]">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">Fluxo de registro</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--text)]">Escolha o tipo de conta antes de seguir</h2>
          <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
            Esta pagina deixa o registro mais claro para o usuario final e encaixa o antigo formulario em um layout de
            rota do Next.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setAccountType('adotante')}
              className={`rounded-2xl border p-4 text-left transition ${accountType === 'adotante' ? 'border-[var(--primary)] bg-[rgba(15,118,110,0.08)]' : 'border-[var(--border)] bg-white'}`}
            >
              <p className="font-semibold text-[var(--text)]">Adotante</p>
              <p className="mt-1 text-sm text-[var(--muted)]">Perfil para buscar animais e preencher questionario.</p>
            </button>
            <button
              type="button"
              onClick={() => setAccountType('abrigo')}
              className={`rounded-2xl border p-4 text-left transition ${accountType === 'abrigo' ? 'border-[var(--primary)] bg-[rgba(15,118,110,0.08)]' : 'border-[var(--border)] bg-white'}`}
            >
              <p className="font-semibold text-[var(--text)]">Abrigo</p>
              <p className="mt-1 text-sm text-[var(--muted)]">Perfil para cadastrar animais e responder aplicacoes.</p>
            </button>
          </div>
        </article>

        <section className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block space-y-2 text-sm font-medium text-[var(--text)] sm:col-span-2">
                <span>{accountType === 'adotante' ? 'Nome completo' : 'Nome do abrigo'}</span>
                <input
                  className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--primary)]"
                  value={form.name}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  placeholder={accountType === 'adotante' ? 'Digite seu nome' : 'Digite o nome do abrigo'}
                />
              </label>

              <label className="block space-y-2 text-sm font-medium text-[var(--text)]">
                <span>{accountType === 'adotante' ? 'CPF' : 'CNPJ'}</span>
                <input
                  className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--primary)]"
                  value={form.document}
                  onChange={(event) => setForm((current) => ({ ...current, document: event.target.value }))}
                  placeholder={accountType === 'adotante' ? '000.000.000-00' : '00.000.000/0001-00'}
                />
              </label>

              <label className="block space-y-2 text-sm font-medium text-[var(--text)]">
                <span>Email</span>
                <input
                  className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--primary)]"
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                  placeholder="seu@email.com"
                />
              </label>

              <label className="block space-y-2 text-sm font-medium text-[var(--text)]">
                <span>Senha</span>
                <input
                  className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--primary)]"
                  type="password"
                  value={form.password}
                  onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                  placeholder="********"
                />
              </label>

              <label className="block space-y-2 text-sm font-medium text-[var(--text)]">
                <span>Confirmar senha</span>
                <input
                  className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--primary)]"
                  type="password"
                  value={form.confirmPassword}
                  onChange={(event) => setForm((current) => ({ ...current, confirmPassword: event.target.value }))}
                  placeholder="********"
                />
              </label>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-4 text-sm text-[var(--muted)]">
              <p className="font-semibold text-[var(--text)]">O que acontece depois</p>
              <p className="mt-2 leading-6">
                O backend pode direcionar o usuario para /adotante/questionario ou /abrigo/dashboard conforme o tipo de
                conta criada.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !isValid}
              className="w-full rounded-full bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--primary-strong)] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Criando conta...' : 'Criar conta'}
            </button>
          </form>

          {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}
          {feedback ? <p className="mt-4 text-sm text-[var(--primary-strong)]">{feedback}</p> : null}
        </section>
      </section>
    </AppShell>
  );
}
