import { apiClient } from '@/services/apiClient';
import type { AplicacaoAdocaoResponse, CriarAplicacaoAdocaoRequest, StatusAplicacao } from '@/types/application';

export const applicationService = {
  criar: (payload: CriarAplicacaoAdocaoRequest) => apiClient<AplicacaoAdocaoResponse>('/api/aplicacoes-adocao', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  listarMinhas: (status?: StatusAplicacao) => {
    const suffix = status ? `?status=${status}` : '';
    return apiClient<AplicacaoAdocaoResponse[]>(`/api/aplicacoes-adocao/minhas${suffix}`);
  },
  listarRecebidas: (status?: StatusAplicacao) => {
    const suffix = status ? `?status=${status}` : '';
    return apiClient<AplicacaoAdocaoResponse[]>(`/api/aplicacoes-adocao/recebidas${suffix}`);
  },
  aprovar: (id: string) => apiClient<AplicacaoAdocaoResponse>(`/api/aplicacoes-adocao/${id}/aprovar`, {
    method: 'PATCH'
  }),
  recusar: (id: string) => apiClient<AplicacaoAdocaoResponse>(`/api/aplicacoes-adocao/${id}/recusar`, {
    method: 'PATCH'
  })
};
