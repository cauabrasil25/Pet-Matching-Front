export type ProjetoPesquisaFiltroRequest = {
  titulo?: string;
  professorId?: string;
  areaTematica?: string;
  cursoPreferencial?: string;
  periodoMinimoMaximo?: number;
  cargaHorariaMaxima?: number;
  requerExperienciaPrevia?: boolean;
  status?: StatusProjeto;
};

export type StatusProjeto = 'ABERTO' | 'EM_SELECAO' | 'ENCERRADO';

export type ProjetoPesquisaResponse = {
  id: string;
  professorId: string;
  professorNome: string;
  titulo: string;
  descricao: string;
  areaTematica: string;
  cursoPreferencial?: string | null;
  periodoMinimo: number;
  habilidadesRequeridas: string[];
  cargaHorariaSemanal: number;
  duracaoMeses: number;
  numeroVagas: number;
  vagasPreenchidas: number;
  requerExperienciaPrevia: boolean;
  status: StatusProjeto;
  dataCriacao: string;
};

export type CriarProjetoPesquisaRequest = {
  titulo: string;
  descricao: string;
  areaTematica: string;
  cursoPreferencial?: string;
  periodoMinimo: number;
  habilidadesRequeridas: string[];
  cargaHorariaSemanal: number;
  duracaoMeses: number;
  numeroVagas: number;
  requerExperienciaPrevia: boolean;
};

export type AtualizarProjetoPesquisaRequest = CriarProjetoPesquisaRequest;

export type AtualizarStatusProjetoRequest = {
  status: StatusProjeto;
};

export type ProjetoPesquisaMatchResponse = {
  projeto: ProjetoPesquisaResponse;
  score: number;
  indiceAtencao: number;
  motivosCompatibilidade: string[];
};

export type PontosAtencaoProjetoResponse = {
  projeto: ProjetoPesquisaResponse;
  indiceAtencao: number;
  pontosAtencao: string[];
};

export type AnimalFiltroRequest = ProjetoPesquisaFiltroRequest;
export type AnimalResponse = ProjetoPesquisaResponse;
export type CriarAnimalRequest = CriarProjetoPesquisaRequest;
export type AtualizarAnimalRequest = AtualizarProjetoPesquisaRequest;
export type AtualizarStatusAnimalRequest = AtualizarStatusProjetoRequest;
export type AnimalMatchResponse = ProjetoPesquisaMatchResponse;
export type ChanceRetornoResponse = PontosAtencaoProjetoResponse;
