export type StatusAplicacao = 'PENDENTE' | 'APROVADA' | 'RECUSADA' | 'DESISTENCIA';

export type CriarAplicacaoAdocaoRequest = {
  animalId: string;
};

export type AplicacaoAdocaoResponse = {
  id: string;
  adotanteId: string;
  adotanteNome: string;
  animalId: string;
  animalNome: string;
  statusAnimal: 'DISPONIVEL' | 'PENDENTE' | 'ADOTADO';
  abrigoId: string;
  abrigoNome: string;
  dataAplicacao: string;
  status: StatusAplicacao;
  scoreMatch: number | null;
  adotanteCompativel: boolean | null;
  chanceRetorno: number | null;
  motivosCompatibilidade: string[] | null;
  motivosChanceRetorno: string[] | null;
};
