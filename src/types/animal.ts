export type AnimalFiltroRequest = {
  especie?: string;
  porte?: string;
  status?: string;
};

export type AnimalStatus = 'DISPONIVEL' | 'PENDENTE' | 'ADOTADO';

export type NivelEnergia = 'BAIXO' | 'MEDIO' | 'ALTO';

export type NivelBarulho = 'BAIXO' | 'ALTO';

export type AnimalResponse = {
  id: string;
  abrigoId?: string;
  nome: string;
  especie: string;
  porte: string;
  idade: number;
  peso: number;
  status: AnimalStatus;
  nivelEnergia?: NivelEnergia;
  nivelBarulho?: NivelBarulho;
  temDeficienciaFisica?: boolean;
  temDoencaCronica?: boolean;
  sociavelEstranhos?: boolean;
  sociavelCriancas?: boolean;
  sociavelAnimais?: boolean;
  sexo?: string;
  dataCriacao?: string;
};

export type CriarAnimalRequest = {
  nome: string;
  especie: string;
  porte: string;
  idade: number;
  peso: number;
  status: AnimalStatus;
  nivelEnergia: NivelEnergia;
  nivelBarulho: NivelBarulho;
  temDeficienciaFisica: boolean;
  temDoencaCronica: boolean;
  sociavelEstranhos: boolean;
  sociavelCriancas: boolean;
  sociavelAnimais: boolean;
};

export type AtualizarAnimalRequest = CriarAnimalRequest;

export type AtualizarStatusAnimalRequest = {
  status: AnimalStatus;
};

export type AnimalMatchResponse = {
  animal: AnimalResponse;
  score: number;
  chanceRetorno: number;
  explicacoes: string[];
};

export type ChanceRetornoResponse = {
  animal: AnimalResponse;
  chanceRetorno: number;
  explicacoes: string[];
};
