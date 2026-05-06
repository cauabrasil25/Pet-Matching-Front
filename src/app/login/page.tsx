import { AppShell } from '@/components/layout/AppShell';
import { AuthCard } from '@/components/auth/AuthCard';

export default function LoginPage() {
  return (
    <AppShell
      eyebrow="Acesso"
      title="Entrar na plataforma"
      description="Tela base para login com JWT."
      showNavigation={false}
    >
      <AuthCard title="Login" subtitle="Conecte o front à rota /auth/login." />
    </AppShell>
  );
}
