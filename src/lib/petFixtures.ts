export type AnimalStatus = 'DISPONIVEL' | 'PENDENTE' | 'ADOTADO';
export type AnimalSpecies = 'dog' | 'cat';
export type AnimalSize = 'small' | 'medium' | 'large';
export type MatchStatus = 'pending' | 'approved' | 'rejected';

export type Animal = {
  id: string;
  name: string;
  species: AnimalSpecies;
  breed: string;
  age: number;
  size: AnimalSize;
  temperament: string[];
  description: string;
  imageUrl: string;
  shelter: string;
  status: AnimalStatus;
  nivelEnergia: 'BAIXO' | 'MEDIO' | 'ALTO';
  nivelBarulho: 'BAIXO' | 'ALTO';
  temDeficienciaFisica: boolean;
  temDoencaCronica: boolean;
  sociavelEstranhos: boolean;
  sociavelCriancas: boolean;
  sociavelAnimais: boolean;
};

export type Match = {
  id: string;
  petId: string;
  adopterName: string;
  score: number;
  status: MatchStatus;
  timestamp: string;
};

export type AdopterProfile = {
  tipoMoradia: 'CASA' | 'APARTAMENTO' | 'SITIO' | null;
  nivelAtividade: 'SEDENTARIO' | 'MODERADO' | 'ATIVO' | null;
  toleranciaBarulho: 'ALTA' | 'BAIXA' | null;
  temCriancas: boolean | null;
  temOutrosPets: boolean | null;
};

export type AdoptionApplication = {
  id: string;
  animalId: string;
  adopterName: string;
  shelter: string;
  score: number;
  status: MatchStatus;
  updatedAt: string;
  message: string;
};

export const defaultShelterName = 'Abrigo Amigos de Patas';

export const animals: Animal[] = [
  {
    id: '1',
    name: 'Thor',
    species: 'dog',
    breed: 'Labrador',
    age: 3,
    size: 'large',
    temperament: ['Brincalhao', 'Sociavel', 'Carinhoso'],
    description: 'Thor e um labrador super carinhoso e cheio de energia. Adora brincar e e otimo com criancas.',
    imageUrl: 'https://images.unsplash.com/photo-1543466835-00537b3e30af?w=900&h=900&fit=crop',
    shelter: defaultShelterName,
    status: 'DISPONIVEL',
    nivelEnergia: 'ALTO',
    nivelBarulho: 'BAIXO',
    temDeficienciaFisica: false,
    temDoencaCronica: false,
    sociavelEstranhos: true,
    sociavelCriancas: true,
    sociavelAnimais: true
  },
  {
    id: '2',
    name: 'Luna',
    species: 'cat',
    breed: 'Siamês',
    age: 2,
    size: 'small',
    temperament: ['Calma', 'Independente', 'Carinhosa'],
    description: 'Luna e uma gatinha tranquila que adora carinho e brincadeiras com laser. Perfeita para apartamento.',
    imageUrl: 'https://images.unsplash.com/photo-1514888286882-66fc3b66fc3b?w=900&h=900&fit=crop',
    shelter: defaultShelterName,
    status: 'DISPONIVEL',
    nivelEnergia: 'BAIXO',
    nivelBarulho: 'BAIXO',
    temDeficienciaFisica: false,
    temDoencaCronica: false,
    sociavelEstranhos: false,
    sociavelCriancas: true,
    sociavelAnimais: true
  },
  {
    id: '3',
    name: 'Max',
    species: 'dog',
    breed: 'Vira-lata',
    age: 5,
    size: 'medium',
    temperament: ['Calmo', 'Protetor', 'Sociavel'],
    description: 'Max e um caozinho tranquilo e protetor. Adora uma caminhada e e muito leal ao tutor.',
    imageUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=900&h=900&fit=crop',
    shelter: 'Refugio Animal Vida Nova',
    status: 'DISPONIVEL',
    nivelEnergia: 'MEDIO',
    nivelBarulho: 'BAIXO',
    temDeficienciaFisica: false,
    temDoencaCronica: false,
    sociavelEstranhos: true,
    sociavelCriancas: true,
    sociavelAnimais: true
  },
  {
    id: '4',
    name: 'Mia',
    species: 'cat',
    breed: 'Persa',
    age: 1,
    size: 'small',
    temperament: ['Calma', 'Carinhosa', 'Independente'],
    description: 'Mia e uma gatinha persa muito doce e calma. Ideal para quem busca companhia tranquila.',
    imageUrl: 'https://images.unsplash.com/photo-1573865526739-10c1de0ac0c0?w=900&h=900&fit=crop',
    shelter: 'Refugio Animal Vida Nova',
    status: 'DISPONIVEL',
    nivelEnergia: 'BAIXO',
    nivelBarulho: 'BAIXO',
    temDeficienciaFisica: false,
    temDoencaCronica: false,
    sociavelEstranhos: true,
    sociavelCriancas: true,
    sociavelAnimais: false
  },
  {
    id: '5',
    name: 'Buddy',
    species: 'dog',
    breed: 'Golden Retriever',
    age: 4,
    size: 'large',
    temperament: ['Brincalhao', 'Sociavel', 'Carinhoso'],
    description: 'Buddy e pura alegria. Adora nadar, brincar de buscar e fazer novos amigos.',
    imageUrl: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=900&h=900&fit=crop',
    shelter: defaultShelterName,
    status: 'DISPONIVEL',
    nivelEnergia: 'ALTO',
    nivelBarulho: 'BAIXO',
    temDeficienciaFisica: false,
    temDoencaCronica: false,
    sociavelEstranhos: true,
    sociavelCriancas: true,
    sociavelAnimais: true
  },
  {
    id: '6',
    name: 'Nina',
    species: 'cat',
    breed: 'Vira-lata',
    age: 3,
    size: 'small',
    temperament: ['Brincalhona', 'Sociavel', 'Carinhosa'],
    description: 'Nina e uma gatinha super brincalhona e social. Adora atencao e brinquedos.',
    imageUrl: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=900&h=900&fit=crop',
    shelter: 'Refugio Animal Vida Nova',
    status: 'PENDENTE',
    nivelEnergia: 'MEDIO',
    nivelBarulho: 'BAIXO',
    temDeficienciaFisica: false,
    temDoencaCronica: false,
    sociavelEstranhos: true,
    sociavelCriancas: true,
    sociavelAnimais: true
  },
  {
    id: '7',
    name: 'Rex',
    species: 'dog',
    breed: 'Pastor Alemao',
    age: 6,
    size: 'large',
    temperament: ['Protetor', 'Sociavel', 'Calmo'],
    description: 'Rex e um pastor alemao experiente e protetor. Otimo para familias que buscam seguranca.',
    imageUrl: 'https://images.unsplash.com/photo-1568572933382-74d440642117?w=900&h=900&fit=crop',
    shelter: defaultShelterName,
    status: 'ADOTADO',
    nivelEnergia: 'MEDIO',
    nivelBarulho: 'ALTO',
    temDeficienciaFisica: false,
    temDoencaCronica: false,
    sociavelEstranhos: false,
    sociavelCriancas: true,
    sociavelAnimais: true
  },
  {
    id: '8',
    name: 'Mel',
    species: 'cat',
    breed: 'Bengal',
    age: 2,
    size: 'medium',
    temperament: ['Brincalhona', 'Independente', 'Sociavel'],
    description: 'Mel e super ativa e curiosa. Precisa de estimulos e espaco para explorar.',
    imageUrl: 'https://images.unsplash.com/photo-1606214174585-fe31582dc6ee?w=900&h=900&fit=crop',
    shelter: 'Refugio Animal Vida Nova',
    status: 'DISPONIVEL',
    nivelEnergia: 'ALTO',
    nivelBarulho: 'ALTO',
    temDeficienciaFisica: false,
    temDoencaCronica: false,
    sociavelEstranhos: true,
    sociavelCriancas: false,
    sociavelAnimais: true
  }
];

export const matches: Match[] = [
  {
    id: 'm1',
    petId: '1',
    adopterName: 'Maria Silva',
    score: 92,
    status: 'pending',
    timestamp: '2026-05-06T10:30:00'
  },
  {
    id: 'm2',
    petId: '2',
    adopterName: 'Joao Santos',
    score: 88,
    status: 'pending',
    timestamp: '2026-05-06T14:20:00'
  },
  {
    id: 'm3',
    petId: '5',
    adopterName: 'Ana Costa',
    score: 95,
    status: 'approved',
    timestamp: '2026-05-05T09:15:00'
  },
  {
    id: 'm4',
    petId: '3',
    adopterName: 'Carlos Oliveira',
    score: 85,
    status: 'pending',
    timestamp: '2026-05-06T16:45:00'
  }
];

export const adopterApplications: AdoptionApplication[] = [
  {
    id: 'app-1',
    animalId: '1',
    adopterName: 'Voce',
    shelter: defaultShelterName,
    score: 92,
    status: 'pending',
    updatedAt: 'Hoje, 10:30',
    message: 'Perfil com rotina ativa e casa com quintal, boa combinacao para Thor.'
  },
  {
    id: 'app-2',
    animalId: '5',
    adopterName: 'Voce',
    shelter: defaultShelterName,
    score: 95,
    status: 'approved',
    updatedAt: 'Ontem, 18:10',
    message: 'Match confirmado para Buddy. Aguardando contato do abrigo.'
  },
  {
    id: 'app-3',
    animalId: '7',
    adopterName: 'Voce',
    shelter: defaultShelterName,
    score: 67,
    status: 'rejected',
    updatedAt: '03/05, 09:40',
    message: 'Rex precisava de um perfil com mais experiencia e espaco externo.'
  }
];

export const adopterProfile: AdopterProfile = {
  tipoMoradia: 'CASA',
  nivelAtividade: 'MODERADO',
  toleranciaBarulho: 'ALTA',
  temCriancas: true,
  temOutrosPets: false
};

export const sizeLabels: Record<AnimalSize, string> = {
  small: 'Pequeno',
  medium: 'Medio',
  large: 'Grande'
};

export const speciesLabels: Record<AnimalSpecies, string> = {
  dog: 'Cachorro',
  cat: 'Gato'
};

export const statusLabels: Record<AnimalStatus, string> = {
  DISPONIVEL: 'Disponivel',
  PENDENTE: 'Pendente',
  ADOTADO: 'Adotado'
};

export function getAnimalById(id: string) {
  return animals.find((animal) => animal.id === id);
}

export function formatSize(size: AnimalSize) {
  return sizeLabels[size];
}

export function formatSpecies(species: AnimalSpecies) {
  return speciesLabels[species];
}

export function formatStatus(status: AnimalStatus) {
  return statusLabels[status];
}

export function formatMatchStatus(status: MatchStatus) {
  if (status === 'pending') return 'Pendente';
  if (status === 'approved') return 'Aprovado';
  return 'Recusado';
}

export function formatProfileValue(key: keyof AdopterProfile, value: AdopterProfile[keyof AdopterProfile]) {
  if (value === null) return 'Nao informado';

  if (key === 'tipoMoradia') {
    if (value === 'CASA') return 'Casa';
    if (value === 'APARTAMENTO') return 'Apartamento';
    return 'Sitio';
  }

  if (key === 'nivelAtividade') {
    if (value === 'SEDENTARIO') return 'Sedentario';
    if (value === 'MODERADO') return 'Moderado';
    return 'Ativo';
  }

  if (key === 'toleranciaBarulho') {
    return value === 'ALTA' ? 'Alta' : 'Baixa';
  }

  return value ? 'Sim' : 'Nao';
}