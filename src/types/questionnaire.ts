export type CriarQuestionarioPerfilRequest = {
  tipoMoradia: 'CASA' | 'APARTAMENTO' | 'SITIO';
  temCriancas: boolean;
  temOutrosPets: boolean;
  horasSozinhoAnimal: number;
  nivelAtividade: 'SEDENTARIO' | 'MODERADO' | 'ATIVO';
  toleranciaBarulho: 'ALTA' | 'BAIXA';
};

export type QuestionarioPerfilResponse = {
  id: string;
  adotanteId: string;
  tipoMoradia: 'CASA' | 'APARTAMENTO' | 'SITIO';
  temCriancas: boolean;
  temOutrosPets: boolean;
  horasSozinhoAnimal: number;
  nivelAtividade: 'SEDENTARIO' | 'MODERADO' | 'ATIVO';
  toleranciaBarulho: 'ALTA' | 'BAIXA';
};
