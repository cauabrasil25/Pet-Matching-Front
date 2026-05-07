import { apiClient } from './apiClient';
import type { CriarQuestionarioPerfilRequest, QuestionarioPerfilResponse } from '../types/questionnaire';

export const questionnaireService = {
  buscar: () => apiClient<QuestionarioPerfilResponse>('/api/questionario-perfil'),
  cadastrar: (payload: CriarQuestionarioPerfilRequest) => apiClient<QuestionarioPerfilResponse>('/api/questionario-perfil', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  atualizar: (payload: CriarQuestionarioPerfilRequest) => apiClient<QuestionarioPerfilResponse>('/api/questionario-perfil', {
    method: 'PUT',
    body: JSON.stringify(payload)
  }),
  deletar: () => apiClient<void>('/api/questionario-perfil', {
    method: 'DELETE'
  })
};
