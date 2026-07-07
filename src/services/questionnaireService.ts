import { apiClient } from './apiClient';
import type { CriarQuestionarioAlunoRequest, QuestionarioAlunoResponse } from '../types/questionnaire';

export const questionnaireService = {
  buscar: () => apiClient<QuestionarioAlunoResponse>('/api/questionario-aluno'),
  cadastrar: (payload: CriarQuestionarioAlunoRequest) => apiClient<QuestionarioAlunoResponse>('/api/questionario-aluno', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  atualizar: (payload: CriarQuestionarioAlunoRequest) => apiClient<QuestionarioAlunoResponse>('/api/questionario-aluno', {
    method: 'PUT',
    body: JSON.stringify(payload)
  }),
  deletar: () => apiClient<void>('/api/questionario-aluno', {
    method: 'DELETE'
  })
};
