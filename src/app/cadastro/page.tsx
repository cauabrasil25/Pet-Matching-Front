import { AppShell } from '../../components/layout/AppShell';
import { AuthCard } from '../../components/auth/AuthCard';

export default function CadastroPage() {
  return (
    <AppShell
      eyebrow="Cadastro"
      title="Criar conta"
      description="Escolha entre adotante e abrigo conforme os formulários da API."
      showNavigation={false}
    >
      <AuthCard title="Cadastro" subtitle="Pode ser dividido em duas telas: adotante e abrigo." />
    </AppShell>
  );
}
