export type AnimalFiltroRequest = {
  especie?: string;
  porte?: string;
  sexo?: string;
  status?: string;
};

export type AnimalResponse = {
  id: string;
  nome: string;
  especie: string;
  porte: string;
  sexo: string;
  descricao?: string;
  status: string;
};

export type CriarAnimalRequest = {
  nome: string;
  especie: string;
  porte: string;
  sexo: string;
  descricao?: string;
};

export type AtualizarAnimalRequest = CriarAnimalRequest;

export type AtualizarStatusAnimalRequest = {
  status: string;
};
