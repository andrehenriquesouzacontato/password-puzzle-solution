
import api from './api';

export interface ResgatePontos {
  id: string;
  clienteId: string;
  pontosResgatados: number;
  descricao: string;
  data: string;
  nomeCliente?: string;
}

export interface ResgatePontosCreateData {
  clienteId: string;
  pontosResgatados: number;
  descricao: string;
}

const resgatePontosService = {
  // Obter todos os resgates (admin)
  getAll: async () => {
    const response = await api.get('/ResgatePontos');
    return response.data;
  },
  
  // Obter resgates de pontos de um cliente
  getByClienteId: async (clienteId: string) => {
    const response = await api.get(`/ResgatePontos/cliente/${clienteId}`);
    return response.data;
  },
  
  // Obter resgate por ID
  getById: async (id: string) => {
    const response = await api.get(`/ResgatePontos/${id}`);
    return response.data;
  },
  
  // Criar novo resgate
  create: async (data: ResgatePontosCreateData) => {
    const response = await api.post('/ResgatePontos', data);
    return response.data;
  }
};

export default resgatePontosService;
