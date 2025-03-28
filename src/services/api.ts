
import axios from 'axios';
import { toast } from 'sonner';

// Configuração do cliente axios
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Garantindo que estamos usando HTTP (não HTTPS)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token em requisições autenticadas
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento global de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    
    if (!error.response && error.code === 'ERR_NETWORK') {
      toast.error('Não foi possível conectar ao servidor. Verifique se a API está rodando na porta 5000.');
      return Promise.reject(error);
    }
    
    const message = error.response?.data?.message || 'Ocorreu um erro na requisição';
    
    // Erros de autenticação
    if (error.response?.status === 401) {
      // Redirecionamento para login se o token expirou
      if (window.location.pathname !== '/login' && 
          window.location.pathname !== '/admin/login' && 
          window.location.pathname !== '/primeiro-acesso' &&
          window.location.pathname !== '/recuperar-senha' &&
          window.location.pathname !== '/') {
        toast.error('Sua sessão expirou. Por favor, faça login novamente.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    } else if (error.response?.status === 403) {
      toast.error('Você não tem permissão para esta operação');
    } else if (error.response?.status === 500) {
      toast.error('Erro no servidor. Tente novamente mais tarde.');
    } else if (error.response) {
      toast.error(message);
    }
    
    return Promise.reject(error);
  }
);

export default api;
