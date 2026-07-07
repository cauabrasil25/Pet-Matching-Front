import { apiClient } from './apiClient';
import type {
  AtualizarProjetoPesquisaRequest,
  AtualizarStatusProjetoRequest,
  CriarProjetoPesquisaRequest,
  PontosAtencaoProjetoResponse,
  ProjetoPesquisaFiltroRequest,
  ProjetoPesquisaMatchResponse,
  ProjetoPesquisaResponse
} from '../types/animal';

export const projetoService = {
  listar: (filtro?: ProjetoPesquisaFiltroRequest) => {
    const params = new URLSearchParams();

    if (filtro?.titulo) params.set('titulo', filtro.titulo);
    if (filtro?.professorId) params.set('professorId', filtro.professorId);
    if (filtro?.areaTematica) params.set('areaTematica', filtro.areaTematica);
    if (filtro?.cursoPreferencial) params.set('cursoPreferencial', filtro.cursoPreferencial);
    if (filtro?.periodoMinimoMaximo) params.set('periodoMinimoMaximo', String(filtro.periodoMinimoMaximo));
    if (filtro?.cargaHorariaMaxima) params.set('cargaHorariaMaxima', String(filtro.cargaHorariaMaxima));
    if (typeof filtro?.requerExperienciaPrevia === 'boolean') {
      params.set('requerExperienciaPrevia', String(filtro.requerExperienciaPrevia));
    }
    if (filtro?.status) params.set('status', filtro.status);

    const suffix = params.toString() ? `?${params.toString()}` : '';
    return apiClient<ProjetoPesquisaResponse[]>(`/api/projetos-pesquisa${suffix}`);
  },
  listarMeus: () => apiClient<ProjetoPesquisaResponse[]>('/api/projetos-pesquisa/meus'),
  listarComMatching: () => apiClient<ProjetoPesquisaMatchResponse[]>('/api/matching/projetos'),
  calcularPontosAtencao: (id: string) => apiClient<PontosAtencaoProjetoResponse>(`/api/matching/projetos/${id}/pontos-atencao`),
  buscarPorId: (id: string) => apiClient<ProjetoPesquisaResponse>(`/api/projetos-pesquisa/${id}`),
  cadastrar: (payload: CriarProjetoPesquisaRequest) => apiClient<ProjetoPesquisaResponse>('/api/projetos-pesquisa', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  atualizar: (id: string, payload: AtualizarProjetoPesquisaRequest) => apiClient<ProjetoPesquisaResponse>(`/api/projetos-pesquisa/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  }),
  atualizarStatus: (id: string, payload: AtualizarStatusProjetoRequest) => apiClient<ProjetoPesquisaResponse>(`/api/projetos-pesquisa/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify(payload)
  })
};

export const animalService = {
  ...projetoService,
  calcularChanceRetorno: projetoService.calcularPontosAtencao
};
