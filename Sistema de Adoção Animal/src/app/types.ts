export interface Pet {
  id: string;
  name: string;
  species: 'dog' | 'cat';
  breed: string;
  age: number;
  size: 'small' | 'medium' | 'large';
  temperament: string[];
  description: string;
  imageUrl: string;
  shelter: string;
  status: 'DISPONIVEL' | 'PENDENTE' | 'ADOTADO';
  nivelEnergia: 'BAIXO' | 'MEDIO' | 'ALTO';
  nivelBarulho: 'BAIXO' | 'ALTO';
  temDeficienciaFisica: boolean;
  temDoencaCronica: boolean;
  sociavelEstranhos: boolean;
  sociavelCriancas: boolean;
  sociavelAnimais: boolean;
}

export interface Match {
  id: string;
  petId: string;
  adopterName: string;
  score: number;
  status: 'pending' | 'approved' | 'rejected';
  timestamp: Date;
}

export interface User {
  type: 'adopter' | 'shelter';
  name: string;
}

export interface AdopterProfile {
  tipoMoradia: 'CASA' | 'APARTAMENTO' | 'SITIO' | null;
  nivelAtividade: 'SEDENTARIO' | 'MODERADO' | 'ATIVO' | null;
  toleranciaBarulho: 'ALTA' | 'BAIXA' | null;
  temCriancas: boolean | null;
  temOutrosPets: boolean | null;
}
