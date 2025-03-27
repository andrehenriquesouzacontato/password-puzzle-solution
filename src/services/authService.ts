
import api from './api';

export interface AdminLoginData {
  usuario: string;
  senha: string;
}

export interface ClienteLoginData {
  cpf: string;
  senha: string;
}

export interface PrimeiroAcessoData {
  cpf: string;
  senha: string;
}

export interface RecuperarSenhaData {
  cpf: string;
  email: string;
}

export interface ResetarSenhaData {
  token: string;
  newPassword: string;
}

const authService = {
  // Admin auth
  adminLogin: async (data: AdminLoginData) => {
    const response = await api.post('/AdminAuth/login', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userType', 'admin');
      localStorage.setItem('user', JSON.stringify({
        nome: response.data.nome,
        usuario: response.data.usuario,
        email: response.data.email
      }));
    }
    return response.data;
  },
  
  // Cliente auth
  clienteLogin: async (data: ClienteLoginData) => {
    const response = await api.post('/ClienteAuth/login', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userType', 'cliente');
      localStorage.setItem('user', JSON.stringify({
        id: response.data.id,
        nome: response.data.nome,
        cpf: response.data.cpf,
        email: response.data.email,
        telefone: response.data.telefone,
        pontos: response.data.pontos
      }));
    }
    return response.data;
  },
  
  primeiroAcesso: async (data: PrimeiroAcessoData) => {
    const response = await api.post('/ClienteAuth/primeiro-acesso', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userType', 'cliente');
      localStorage.setItem('user', JSON.stringify({
        id: response.data.id,
        nome: response.data.nome,
        cpf: response.data.cpf,
        email: response.data.email,
        telefone: response.data.telefone,
        pontos: response.data.pontos
      }));
    }
    return response.data;
  },
  
  // Password reset
  solicitarRecuperacao: (data: RecuperarSenhaData) => {
    return api.post('/PasswordReset/request', data);
  },
  
  validarToken: (token: string) => {
    return api.post('/PasswordReset/validate-token', { token });
  },
  
  resetarSenha: (data: ResetarSenhaData) => {
    return api.post('/PasswordReset/reset', data);
  },
  
  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('user');
  },
  
  // Auth check
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
  
  isAdmin: () => {
    return localStorage.getItem('userType') === 'admin';
  },
  
  isCliente: () => {
    return localStorage.getItem('userType') === 'cliente';
  },
  
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};

export default authService;
