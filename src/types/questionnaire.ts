export type CriarQuestionarioPerfilRequest = {
  respostas: Record<string, string | number | boolean>;
};

export type QuestionarioPerfilResponse = {
  id: string;
  adotanteId: string;
  respostas: Record<string, string | number | boolean>;
};
