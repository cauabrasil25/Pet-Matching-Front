"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '../../../../components/layout/AppShell';
import { ProjetoForm, initialProjetoForm, toProjetoPayload } from '../../../../components/projects/ProjetoForm';
import { projetoService } from '../../../../services/animalService';

export default function NovoProjetoPage() {
  const router = useRouter();
  const [form, setForm] = useState(initialProjetoForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    try {
      setSaving(true);
      await projetoService.cadastrar(toProjetoPayload(form));
      router.push('/abrigo/animais');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Nao foi possivel cadastrar o projeto.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <AppShell eyebrow="Professor" title="Novo projeto" description="Cadastre uma oportunidade de pesquisa para alunos." secondaryAction={{ label: 'Meus projetos', href: '/abrigo/animais' }}>
      <ProjetoForm form={form} setForm={setForm} onSubmit={handleSubmit} saving={saving} error={error} submitLabel="Cadastrar projeto" />
    </AppShell>
  );
}
