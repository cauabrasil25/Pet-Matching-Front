export type StatusAplicacao = 'PENDENTE' | 'APROVADA' | 'RECUSADA' | 'DESISTENCIA';

export type CriarCandidaturaProjetoRequest = {
  projetoId: string;
};

export type CandidaturaProjetoResponse = {
  id: string;
  alunoId: string;
  alunoNome: string;
  projetoId: string;
  projetoTitulo: string;
  professorId: string;
  professorNome: string;
  status: StatusAplicacao;
  dataCandidatura: string;
  scoreCompatibilidade: number | null;
  alunoQualificado: boolean | null;
  indiceAtencao: number | null;
  motivosCompatibilidade: string[] | null;
  pontosAtencao: string[] | null;
};

export type CriarAplicacaoAdocaoRequest = CriarCandidaturaProjetoRequest;
export type AplicacaoAdocaoResponse = CandidaturaProjetoResponse;
