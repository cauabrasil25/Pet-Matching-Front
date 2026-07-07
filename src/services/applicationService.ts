import { apiClient } from './apiClient';
import type { CandidaturaProjetoResponse, CriarCandidaturaProjetoRequest, StatusAplicacao } from '../types/application';

export const candidaturaService = {
  criar: (payload: CriarCandidaturaProjetoRequest) => apiClient<CandidaturaProjetoResponse>('/api/candidaturas-projeto', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  listarMinhas: (status?: StatusAplicacao) => {
    const suffix = status ? `?status=${status}` : '';
    return apiClient<CandidaturaProjetoResponse[]>(`/api/candidaturas-projeto/minhas${suffix}`);
  },
  listarRecebidas: (status?: StatusAplicacao) => {
    const suffix = status ? `?status=${status}` : '';
    return apiClient<CandidaturaProjetoResponse[]>(`/api/candidaturas-projeto/recebidas${suffix}`);
  },
  aprovar: (id: string) => apiClient<CandidaturaProjetoResponse>(`/api/candidaturas-projeto/${id}/aprovar`, {
    method: 'PATCH'
  }),
  recusar: (id: string) => apiClient<CandidaturaProjetoResponse>(`/api/candidaturas-projeto/${id}/recusar`, {
    method: 'PATCH'
  })
};

export const applicationService = candidaturaService;
