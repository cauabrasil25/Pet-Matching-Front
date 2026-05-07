import { apiClient } from './apiClient';
import type { LoginRequest, LoginResponse, RegistrarAbrigoRequest, RegistrarAdotanteRequest, UsuarioResponse } from '../types/auth';

export const authService = {
  login: (payload: LoginRequest) => apiClient<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  registrarAdotante: (payload: RegistrarAdotanteRequest) => apiClient<UsuarioResponse>('/auth/registrar/adotante', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  registrarAbrigo: (payload: RegistrarAbrigoRequest) => apiClient<UsuarioResponse>('/auth/registrar/abrigo', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
};
