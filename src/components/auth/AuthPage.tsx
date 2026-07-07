"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '../layout/AppShell';
import { authService, saveAuthSession } from '../../services/authService';

type AccountType = 'aluno' | 'professor';

function destinationFor(role?: string) {
  return role === 'PROFESSOR' ? '/abrigo/dashboard' : '/adotante/dashboard';
}

export function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [accountType, setAccountType] = useState<AccountType>('aluno');
  const [form, setForm] = useState({
    nome: '',
    email: '',
    senha: '',
    matricula: '',
    curso: '',
    periodoAtual: '1',
    registroInstitucional: '',
    areaAtuacao: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    try {
      setLoading(true);

      if (mode === 'signup') {
        if (accountType === 'aluno') {
          await authService.registrarAluno({
            nome: form.nome.trim(),
            email: form.email.trim(),
            senha: form.senha,
            matricula: form.matricula.trim(),
            curso: form.curso.trim(),
            periodoAtual: Number(form.periodoAtual)
          });
        } else {
          await authService.registrarProfessor({
            nome: form.nome.trim(),
            email: form.email.trim(),
            senha: form.senha,
            registroInstitucional: form.registroInstitucional.trim(),
            areaAtuacao: form.areaAtuacao.trim()
          });
        }
      }

      const login = await authService.login({ email: form.email.trim(), senha: form.senha });
      saveAuthSession(login);
      router.push(destinationFor(login.user.role));
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Nao foi possivel autenticar.');
    } finally {
      setLoading(false);
    }
  }

  const setField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  return (
    <AppShell
      eyebrow="Acesso"
      title="Pet Matching academico"
      description="Entre como aluno ou professor para conectar interesses de pesquisa a projetos disponiveis."
      showNavigation={false}
    >
      <section className="mx-auto max-w-3xl rounded-[28px] border border-[var(--border)] bg-white p-6 shadow-[var(--shadow)]">
        <div className="grid gap-2 rounded-full bg-[var(--surface-2)] p-1 sm:grid-cols-2">
          <button type="button" onClick={() => setMode('login')} className={`rounded-full px-4 py-3 text-sm font-semibold ${mode === 'login' ? 'bg-white shadow-sm' : 'text-[var(--muted)]'}`}>
            Entrar
          </button>
          <button type="button" onClick={() => setMode('signup')} className={`rounded-full px-4 py-3 text-sm font-semibold ${mode === 'signup' ? 'bg-white shadow-sm' : 'text-[var(--muted)]'}`}>
            Criar conta
          </button>
        </div>

        <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
          {mode === 'signup' ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <button type="button" onClick={() => setAccountType('aluno')} className={`rounded-2xl border p-4 text-left ${accountType === 'aluno' ? 'border-[var(--primary)] bg-[var(--surface-2)]' : 'border-[var(--border)]'}`}>
                <strong>Aluno</strong>
                <span className="mt-1 block text-sm text-[var(--muted)]">Busca projetos e envia candidaturas.</span>
              </button>
              <button type="button" onClick={() => setAccountType('professor')} className={`rounded-2xl border p-4 text-left ${accountType === 'professor' ? 'border-[var(--primary)] bg-[var(--surface-2)]' : 'border-[var(--border)]'}`}>
                <strong>Professor</strong>
                <span className="mt-1 block text-sm text-[var(--muted)]">Publica projetos e avalia candidaturas.</span>
              </button>
            </div>
          ) : null}

          {mode === 'signup' ? (
            <FormField label="Nome completo" help="Informe seu nome como deve aparecer na plataforma.">
              <input className="rounded-2xl border border-[var(--border)] px-4 py-3" placeholder="Ex: Ana Beatriz Lima" value={form.nome} onChange={(event) => setField('nome', event.target.value)} required />
            </FormField>
          ) : null}

          <FormField label="Email" help="Use um email valido para acessar sua conta.">
            <input className="rounded-2xl border border-[var(--border)] px-4 py-3" type="email" placeholder="Ex: ana@universidade.edu.br" value={form.email} onChange={(event) => setField('email', event.target.value)} required />
          </FormField>

          <FormField label="Senha" help="A senha precisa ter pelo menos 8 caracteres.">
            <input className="rounded-2xl border border-[var(--border)] px-4 py-3" type="password" placeholder="Digite sua senha" value={form.senha} onChange={(event) => setField('senha', event.target.value)} required minLength={8} />
          </FormField>

          {mode === 'signup' && accountType === 'aluno' ? (
            <div className="grid gap-4 sm:grid-cols-3">
              <FormField label="Matricula" help="Informe sua matricula institucional.">
                <input className="rounded-2xl border border-[var(--border)] px-4 py-3" placeholder="Ex: 2026001234" value={form.matricula} onChange={(event) => setField('matricula', event.target.value)} required />
              </FormField>
              <FormField label="Curso" help="Nome do curso em que voce esta matriculado.">
                <input className="rounded-2xl border border-[var(--border)] px-4 py-3" placeholder="Ex: Ciencia da Computacao" value={form.curso} onChange={(event) => setField('curso', event.target.value)} required />
              </FormField>
              <FormField label="Periodo atual" help="Periodo/semestre atual do aluno.">
                <input className="rounded-2xl border border-[var(--border)] px-4 py-3" type="number" min="1" placeholder="Ex: 4" value={form.periodoAtual} onChange={(event) => setField('periodoAtual', event.target.value)} required />
              </FormField>
            </div>
          ) : null}

          {mode === 'signup' && accountType === 'professor' ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Registro institucional" help="Informe o registro funcional ou identificador da instituicao.">
                <input className="rounded-2xl border border-[var(--border)] px-4 py-3" placeholder="Ex: SIAPE 1234567" value={form.registroInstitucional} onChange={(event) => setField('registroInstitucional', event.target.value)} required />
              </FormField>
              <FormField label="Area de atuacao" help="Area principal de pesquisa ou ensino do professor.">
                <input className="rounded-2xl border border-[var(--border)] px-4 py-3" placeholder="Ex: Inteligencia Artificial" value={form.areaAtuacao} onChange={(event) => setField('areaAtuacao', event.target.value)} required />
              </FormField>
            </div>
          ) : null}

          <button className="rounded-full bg-[var(--primary)] px-5 py-3 font-semibold text-white disabled:opacity-70" disabled={loading}>
            {loading ? 'Processando...' : mode === 'login' ? 'Entrar' : 'Criar conta'}
          </button>
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
        </form>
      </section>
    </AppShell>
  );
}

function FormField({
  label,
  help,
  children
}: {
  label: string;
  help: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2 text-sm">
      <span className="font-semibold text-[var(--text)]">{label}</span>
      {children}
      <span className="text-xs leading-5 text-[var(--muted)]">{help}</span>
    </label>
  );
}
