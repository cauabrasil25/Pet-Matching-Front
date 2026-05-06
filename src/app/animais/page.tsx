import { AppShell } from '@/components/layout/AppShell';
import { PetCard } from '@/components/pets/PetCard';

const animals = [
  { name: 'Luna', description: 'Filhote carinhosa, pronta para adoção.' },
  { name: 'Toby', description: 'Adulto dócil, ótimo para família.' },
  { name: 'Mia', description: 'Pequena, vacinada e sociável.' }
];

export default function AnimalsPage() {
  return (
    <AppShell
      eyebrow="Animais"
      title="Catálogo público de adoção"
      description="Listagem com filtros que conversa com GET /api/animais."
      primaryAction={{ label: 'Fazer login', href: '/login' }}
      secondaryAction={{ label: 'Área do abrigo', href: '/abrigo/dashboard' }}
    >
      <div className="grid gap-4 md:grid-cols-3">
        {animals.map((animal) => (
          <PetCard key={animal.name} name={animal.name} description={animal.description} />
        ))}
      </div>
    </AppShell>
  );
}
