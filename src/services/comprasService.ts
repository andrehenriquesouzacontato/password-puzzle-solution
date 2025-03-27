
import api from './api';

export interface Compra {
  id: string;
  clienteId: string;
  valor: number;
  pontos: number;
  data: string;
  nomeCliente?: string;
}

export interface CompraCreateData {
  clienteId: string;
  valor: number;
}

const comprasService = {
  // Obter todas as compras (admin)
  getAll: async () => {
    const response = await api.get('/Compras');
    return response.data;
  },
  
  // Obter compras de um cliente
  getByClienteId: async (clienteId: string) => {
    const response = await api.get(`/Compras/cliente/${clienteId}`);
    return response.data;
  },
  
  // Obter compra por ID
  getById: async (id: string) => {
    const response = await api.get(`/Compras/${id}`);
    return response.data;
  },
  
  // Registrar nova compra
  create: async (data: CompraCreateData) => {
    const response = await api.post('/Compras', data);
    return response.data;
  }
};

export default comprasService;
