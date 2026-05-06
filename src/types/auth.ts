export type LoginRequest = {
  email: string;
  senha: string;
};

export type LoginResponse = {
  token: string;
  type: string;
  user: UsuarioResponse;
};

export type RegistrarAdotanteRequest = {
  nome: string;
  email: string;
  senha: string;
};

export type RegistrarAbrigoRequest = {
  nome: string;
  email: string;
  senha: string;
  cnpj?: string;
};

export type UsuarioResponse = {
  id: string;
  nome: string;
  email: string;
  role: 'ADOTANTE' | 'ABRIGO';
};
