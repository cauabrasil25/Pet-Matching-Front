import { apiClient } from './apiClient';
import type { AnimalFiltroRequest, AnimalResponse, CriarAnimalRequest, AtualizarAnimalRequest, AtualizarStatusAnimalRequest, AnimalMatchResponse } from '../types/animal';

export const animalService = {
  listar: (filtro?: AnimalFiltroRequest) => {
    const params = new URLSearchParams();

    if (filtro?.especie) params.set('especie', filtro.especie);
    if (filtro?.porte) params.set('porte', filtro.porte);
    if (filtro?.status) params.set('status', filtro.status);

    const suffix = params.toString() ? `?${params.toString()}` : '';
    return apiClient<AnimalResponse[]>(`/api/animais${suffix}`);
  },
  listarComMatching: () => apiClient<AnimalMatchResponse[]>('/api/matching/animais'),
  buscarPorId: (id: string) => apiClient<AnimalResponse>(`/api/animais/${id}`),
  cadastrar: (payload: CriarAnimalRequest) => apiClient<AnimalResponse>('/api/animais', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  atualizar: (id: string, payload: AtualizarAnimalRequest) => apiClient<AnimalResponse>(`/api/animais/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  }),
  atualizarStatus: (id: string, payload: AtualizarStatusAnimalRequest) => apiClient<AnimalResponse>(`/api/animais/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify(payload)
  })
};
