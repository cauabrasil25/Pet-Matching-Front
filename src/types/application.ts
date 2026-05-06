export type StatusAplicacao = 'PENDENTE' | 'APROVADA' | 'RECUSADA';

export type CriarAplicacaoAdocaoRequest = {
  animalId: string;
  mensagem?: string;
};

export type AplicacaoAdocaoResponse = {
  id: string;
  animalId: string;
  status: StatusAplicacao;
  mensagem?: string;
};
