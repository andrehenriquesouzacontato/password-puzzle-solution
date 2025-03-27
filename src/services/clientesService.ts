
import api from './api';

export interface Cliente {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  pontos: number;
  dataCadastro: string;
  ultimoAcesso?: string;
}

export interface ClienteCreateData {
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  senha?: string;
}

export interface ClienteUpdateData {
  nome: string;
  email: string;
  telefone: string;
}

const clientesService = {
  // Listar todos os clientes (admin)
  getAll: async () => {
    const response = await api.get('/Clientes');
    return response.data;
  },
  
  // Obter cliente por ID
  getById: async (id: string) => {
    const response = await api.get(`/Clientes/${id}`);
    return response.data;
  },
  
  // Criar novo cliente
  create: async (data: ClienteCreateData) => {
    const response = await api.post('/Clientes', data);
    return response.data;
  },
  
  // Atualizar cliente
  update: async (id: string, data: ClienteUpdateData) => {
    const response = await api.put(`/Clientes/${id}`, data);
    return response.data;
  },
  
  // Excluir cliente
  remove: async (id: string) => {
    const response = await api.delete(`/Clientes/${id}`);
    return response.data;
  }
};

export default clientesService;
