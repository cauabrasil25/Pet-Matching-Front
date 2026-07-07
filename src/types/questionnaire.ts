export type CriarQuestionarioAlunoRequest = {
  areasInteresse: string[];
  habilidades: string[];
  horasDisponiveisSemana: number;
  temExperienciaPesquisa: boolean;
  objetivosAprendizagem: string;
};

export type QuestionarioAlunoResponse = CriarQuestionarioAlunoRequest & {
  id: string;
  alunoId: string;
};

export type CriarQuestionarioPerfilRequest = CriarQuestionarioAlunoRequest;
export type QuestionarioPerfilResponse = QuestionarioAlunoResponse;
