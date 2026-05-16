"use client";

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AppShell } from '../../../components/layout/AppShell';
import { getCurrentUser } from '../../../services/authService';
import { applicationService } from '../../../services/applicationService';
import { animalService } from '../../../services/animalService';
import type { AnimalResponse } from '../../../types/animal';

function formatLabel(value: string) {
  return value
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function AnimalDetailPage() {
  const params = useParams<{ id: string }>();
  const animalId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [animal, setAnimal] = useState<AnimalResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAdopter, setIsAdopter] = useState(false);
  const [message, setMessage] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  useEffect(() => {
    const user = getCurrentUser();
    setIsAdopter(user?.role === 'ADOTANTE');
  }, []);

  useEffect(() => {
    let active = true;

    async function loadAnimal() {
      if (!animalId) {
        setError('Animal invalido.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');
        const data = await animalService.buscarPorId(animalId);
        if (active) {
          setAnimal(data);
        }
      } catch (loadError) {
        if (active) {
          const message = loadError instanceof Error ? loadError.message : 'Nao foi possivel carregar o animal.';
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

  if (loading) {
    return (
      <AppShell
        eyebrow="Detalhe do animal"
        title="Carregando..."
        description="Buscando informacoes do animal no backend."
        secondaryAction={{ label: 'Voltar ao catalogo', href: '/animais' }}
      >
        <section className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-8 text-center text-sm text-[var(--muted)] shadow-[var(--shadow)]">
          Carregando detalhes do animal...
        </section>
      </AppShell>
    );
  }

  if (error || !animal) {
    return (
      <AppShell
        eyebrow="Detalhe do animal"
        title="Animal nao encontrado"
        description="Nao foi possivel carregar os detalhes para este cadastro."
        secondaryAction={{ label: 'Voltar ao catalogo', href: '/animais' }}
      >
        <section className="rounded-[28px] border border-red-200 bg-red-50 p-8 text-center text-sm text-red-700 shadow-[var(--shadow)]">
          {error || 'Animal nao encontrado.'}
        </section>
      </AppShell>
    );
  }

  async function handleApply() {
    if (!animal) {
      setSubmitError('Animal indisponivel para aplicacao neste momento.');
      return;
    }

    try {
      setSubmitLoading(true);
      setSubmitError('');
      setSubmitSuccess('');

      await applicationService.criar({
        animalId: animal.id,
        mensagem: message.trim() || undefined
      });

      setSubmitSuccess('Aplicacao enviada com sucesso. Acompanhe em Minhas aplicacoes.');
      setMessage('');
    } catch (applyError) {
      const errorMessage = applyError instanceof Error ? applyError.message : 'Nao foi possivel enviar sua aplicacao.';
      setSubmitError(errorMessage);
    } finally {
      setSubmitLoading(false);
    }
  }

  return (
    <AppShell
      eyebrow="Detalhe do animal"
      title={animal.nome}
      description="Pagina de detalhe adaptada para a rota dinamica do Next."
      secondaryAction={{ label: 'Voltar ao catalogo', href: '/animais' }}
    >
      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <article className="overflow-hidden rounded-[28px] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)]">
          <div className="flex aspect-[4/3] items-center justify-center bg-[linear-gradient(145deg,rgba(15,118,110,0.16),rgba(217,119,6,0.16))]">
            <span className="text-8xl font-semibold uppercase tracking-[0.08em] text-[var(--primary-strong)]">
              {animal.nome.slice(0, 1)}
            </span>
          </div>

          <div className="space-y-5 p-6">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
              <span>{formatLabel(animal.status)}</span>
              <span>•</span>
              <span>{formatLabel(animal.especie)}</span>
              <span>•</span>
              <span>{formatLabel(animal.porte)}</span>
            </div>

            <p className="text-sm leading-6 text-[var(--muted)]">{animal.descricao ?? 'Sem descricao informada para este animal.'}</p>
          </div>
        </article>

        <aside className="space-y-6">
          <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]">
            <h2 className="text-xl font-semibold text-[var(--text)]">Informacoes principais</h2>
            <dl className="mt-5 grid gap-4 text-sm">
              <div className="flex items-center justify-between gap-3 border-b border-dashed border-[var(--border)] pb-3">
                <dt className="text-[var(--muted)]">Especie</dt>
                <dd className="font-medium text-[var(--text)]">{formatLabel(animal.especie)}</dd>
              </div>
              <div className="flex items-center justify-between gap-3 border-b border-dashed border-[var(--border)] pb-3">
                <dt className="text-[var(--muted)]">Porte</dt>
                <dd className="font-medium text-[var(--text)]">{formatLabel(animal.porte)}</dd>
              </div>
              <div className="flex items-center justify-between gap-3 border-b border-dashed border-[var(--border)] pb-3">
                <dt className="text-[var(--muted)]">Sexo</dt>
                <dd className="font-medium text-[var(--text)]">{formatLabel(animal.sexo)}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-[var(--muted)]">Status</dt>
                <dd className="font-medium text-[var(--text)]">{formatLabel(animal.status)}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-[28px] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(15,118,110,0.1),rgba(255,255,255,0.92))] p-6 shadow-[var(--shadow)]">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">Proximo passo</p>
            {isAdopter ? (
              <>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                  Envie sua aplicacao para este animal diretamente por aqui.
                </p>

                <label className="mt-4 block space-y-2 text-sm font-medium text-[var(--text)]">
                  <span>Mensagem para o abrigo (opcional)</span>
                  <textarea
                    className="min-h-28 w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--primary)]"
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder="Conte por que voce seria um bom tutor para este animal..."
                  />
                </label>

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleApply}
                    disabled={submitLoading}
                    className="rounded-full bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--primary-strong)] disabled:opacity-70"
                  >
                    {submitLoading ? 'Enviando...' : 'Enviar aplicacao'}
                  </button>
                  <Link href="/adotante/aplicacoes" className="rounded-full border border-[var(--border)] bg-white px-5 py-3 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--surface-2)]">
                    Minhas aplicacoes
                  </Link>
                </div>

                {submitError ? <p className="mt-3 text-sm text-red-700">{submitError}</p> : null}
                {submitSuccess ? <p className="mt-3 text-sm text-green-700">{submitSuccess}</p> : null}
              </>
            ) : (
              <>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                  Entre como adotante para enviar uma aplicacao e acompanhar o andamento.
                </p>
                <div className="mt-5 flex gap-3">
                  <Link href="/login" className="rounded-full bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--primary-strong)]">
                    Entrar
                  </Link>
                  <Link href="/adotante/questionario" className="rounded-full border border-[var(--border)] bg-white px-5 py-3 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--surface-2)]">
                    Questionario
                  </Link>
                </div>
              </>
            )}
          </div>
        </aside>
      </section>
    </AppShell>
  );
}
