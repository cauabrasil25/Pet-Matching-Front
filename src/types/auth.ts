export type LoginRequest = {
  email: string;
  senha: string;
};

export type UserRole = 'ALUNO' | 'PROFESSOR' | 'ADMIN';

export type LoginResponse = {
  token: string;
  user: UsuarioResponse;
};

export type RegistrarAlunoRequest = {
  nome: string;
  email: string;
  senha: string;
  matricula: string;
  curso: string;
  periodoAtual: number;
};

export type RegistrarProfessorRequest = {
  nome: string;
  email: string;
  senha: string;
  registroInstitucional: string;
  areaAtuacao: string;
};

export type UsuarioResponse = {
  id: string;
  email: string;
  role: UserRole;
  dataCriacao: string;
};
