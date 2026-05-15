import { apiClient } from './apiClient';
import type { LoginRequest, LoginResponse, RegistrarAbrigoRequest, RegistrarAdotanteRequest, UsuarioResponse } from '../types/auth';

const AUTH_TOKEN_KEY = 'pm_token';
const AUTH_USER_KEY = 'pm_user';

export function saveAuthSession(login: LoginResponse) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(AUTH_TOKEN_KEY, login.token);
  window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(login.user));
}

export function clearAuthSession() {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(AUTH_TOKEN_KEY);
  window.localStorage.removeItem(AUTH_USER_KEY);
}

export function getCurrentUser() {
  if (typeof window === 'undefined') {
    return null;
  }

  const rawUser = window.localStorage.getItem(AUTH_USER_KEY);

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser) as UsuarioResponse;
  } catch {
    return null;
  }
}

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
