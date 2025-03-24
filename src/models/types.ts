
export interface Cliente {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  pontos: number;
  dataCadastro: string;
}

export interface Compra {
  id: string;
  clienteId: string;
  valor: number;
  pontos: number;
  data: string;
}

export interface Admin {
  id: string;
  nome: string;
  usuario: string;
  email: string;
}
