import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Header from '../../components/Header';
import { ArrowLeft, Award, Trash2, Edit2, ShoppingBag, Gift } from 'lucide-react';
import InputMask from '../../components/InputMask';
import { formatCurrency } from '../../utils/formatters';
import { Cliente, Compra } from '../../models/types';

const ClienteDetalhes: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [compras, setCompras] = useState<Compra[]>([]);
  const [valor, setValor] = useState('');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  
  useEffect(() => {
    const loadClienteData = () => {
      console.log('Fetching details for client ID:', id);
      const savedClientes = localStorage.getItem('clientes');
      if (savedClientes) {
        try {
          const parsedClientes: Cliente[] = JSON.parse(savedClientes);
          const clienteEncontrado = parsedClientes.find(c => c.id === id);
          
          if (clienteEncontrado) {
            setCliente(clienteEncontrado);
          } else {
            toast.error('Cliente não encontrado');
            navigate('/admin/dashboard');
          }
        } catch (error) {
          console.error('Erro ao carregar dados do cliente:', error);
          toast.error('Erro ao carregar dados do cliente');
        }
      } else {
        toast.error('Nenhum cliente cadastrado');
        navigate('/admin/dashboard');
      }
    };

    const loadComprasData = () => {
      const savedCompras = localStorage.getItem('compras');
      if (savedCompras) {
        try {
          const parsedCompras: Compra[] = JSON.parse(savedCompras);
          const comprasDoCliente = parsedCompras.filter(compra => compra.clienteId === id);
          setCompras(comprasDoCliente);
        } catch (error) {
          console.error('Erro ao carregar compras:', error);
        }
      }
    };

    loadClienteData();
    loadComprasData();
  }, [id, navigate]);
  
  const handleRegistrarCompra = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!valor || !cliente) {
      toast.error('Informe o valor da compra');
      return;
    }
    
    const valorNumerico = parseFloat(valor.replace(/\./g, '').replace(',', '.'));
    
    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      toast.error('Informe um valor válido para a compra');
      return;
    }
    
    const pontosGanhos = Math.floor(valorNumerico);
    
    const novaCompra: Compra = {
      id: Date.now().toString(),
      clienteId: cliente.id,
      valor: valorNumerico,
      pontos: pontosGanhos,
      data: new Date().toISOString().split('T')[0]
    };
    
    const savedCompras = localStorage.getItem('compras');
    let comprasAtualizadas: Compra[] = [];
    
    if (savedCompras) {
      try {
        comprasAtualizadas = JSON.parse(savedCompras);
      } catch (error) {
        console.error('Erro ao carregar compras existentes:', error);
      }
    }
    
    comprasAtualizadas.push(novaCompra);
    localStorage.setItem('compras', JSON.stringify(comprasAtualizadas));
    
    const savedClientes = localStorage.getItem('clientes');
    if (savedClientes && cliente) {
      try {
        const parsedClientes: Cliente[] = JSON.parse(savedClientes);
        const clienteIndex = parsedClientes.findIndex(c => c.id === cliente.id);
        
        if (clienteIndex !== -1) {
          const clienteAtualizado = {
            ...parsedClientes[clienteIndex],
            pontos: parsedClientes[clienteIndex].pontos + pontosGanhos
          };
          
          parsedClientes[clienteIndex] = clienteAtualizado;
          localStorage.setItem('clientes', JSON.stringify(parsedClientes));
          
          setCliente(clienteAtualizado);
        }
      } catch (error) {
        console.error('Erro ao atualizar pontos do cliente:', error);
      }
    }
    
    setCompras(prev => [novaCompra, ...prev]);
    setValor('');
    
    toast.success(`Compra de ${formatCurrency(valorNumerico)} registrada com sucesso!`);
  };
  
  const handleResgatarPontos = () => {
    toast.info('Funcionalidade de resgate em desenvolvimento');
  };
  
  const handleDeleteClient = () => {
    if (!cliente) return;
    
    const savedClientes = localStorage.getItem('clientes');
    if (savedClientes) {
      try {
        const parsedClientes: Cliente[] = JSON.parse(savedClientes);
        const clientesAtualizados = parsedClientes.filter(c => c.id !== cliente.id);
        localStorage.setItem('clientes', JSON.stringify(clientesAtualizados));
        
        const savedCompras = localStorage.getItem('compras');
        if (savedCompras) {
          const parsedCompras: Compra[] = JSON.parse(savedCompras);
          const comprasAtualizadas = parsedCompras.filter(compra => compra.clienteId !== cliente.id);
          localStorage.setItem('compras', JSON.stringify(comprasAtualizadas));
        }
        
        toast.success('Cliente excluído com sucesso');
        navigate('/admin/dashboard');
      } catch (error) {
        console.error('Erro ao excluir cliente:', error);
        toast.error('Erro ao excluir cliente');
      }
    }
  };
  
  if (!cliente) {
    return (
      <div className="min-h-screen bg-gray-50 animate-fade-in">
        <Header />
        <div className="container max-w-xl px-4 pb-8 text-center py-10">
          <p>Carregando dados do cliente...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 animate-fade-in">
      <Header />
      
      <div className="container max-w-xl px-4 pb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <Link to="/admin/dashboard" className="inline-flex items-center text-gray-600 hover:text-gray-800">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Voltar
            </Link>
          </div>
          
          {!showConfirmDelete ? (
            <button 
              onClick={() => setShowConfirmDelete(true)}
              className="text-red-500 hover:text-red-700 flex items-center"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Excluir Cliente
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setShowConfirmDelete(false)}
                className="text-gray-500 text-sm"
              >
                Cancelar
              </button>
              <button 
                onClick={handleDeleteClient}
                className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600"
              >
                Confirmar Exclusão
              </button>
            </div>
          )}
        </div>
        
        <h1 className="page-title">Detalhes do Cliente</h1>
        
        <div className="card-container">
          <h2 className="text-2xl font-bold mb-1">{cliente.nome}</h2>
          <p className="text-gray-500 mb-4">Cliente desde {new Date(cliente.dataCadastro).toLocaleDateString('pt-BR')}</p>
          
          <div className="flex flex-col items-center my-6">
            <div className="text-brand-pink mb-2">
              <Award className="h-12 w-12" />
            </div>
            
            <div className="text-[80px] font-bold text-purple-800 leading-none">
              {cliente.pontos}
            </div>
            
            <div className="text-gray-500">pontos acumulados</div>
          </div>
        </div>
        
        <div className="card-container">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Informações do Cliente</h2>
            <Link to={`/admin/editar-cliente/${id}`} className="text-brand-green hover:underline flex items-center">
              <Edit2 className="h-4 w-4 mr-1" />
              Editar
            </Link>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="text-gray-500">CPF</div>
              <div className="font-medium">{cliente.cpf}</div>
            </div>
            
            <div>
              <div className="text-gray-500">E-mail</div>
              <div className="font-medium">{cliente.email}</div>
            </div>
            
            <div>
              <div className="text-gray-500">Telefone</div>
              <div className="font-medium">{cliente.telefone}</div>
            </div>
          </div>
        </div>
        
        <div className="card-container">
          <h2 className="text-xl font-semibold mb-4">Registrar Nova Compra</h2>
          <p className="text-gray-600 text-sm mb-4">1 real = 1 ponto</p>
          
          <form onSubmit={handleRegistrarCompra} className="flex gap-2 items-start">
            <div className="flex-1">
              <InputMask
                type="currency"
                value={valor}
                onChange={setValor}
                placeholder="0,00"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent"
              />
            </div>
            
            <button
              type="submit"
              className="bg-brand-green text-white h-12 px-4 rounded-md hover:bg-brand-green/90 transition-all font-medium flex items-center gap-1"
            >
              <ShoppingBag className="h-5 w-5" />
              Registrar
            </button>
          </form>
        </div>
        
        <div className="card-container">
          <h2 className="text-xl font-semibold mb-4">Gerenciar Pontos</h2>
          
          <button
            onClick={handleResgatarPontos}
            className="green-button flex items-center justify-center gap-2"
          >
            <Gift className="h-5 w-5" />
            Resgatar Pontos
          </button>
        </div>
        
        <div className="card-container">
          <h2 className="text-xl font-semibold mb-4">Histórico</h2>
          
          {compras.length > 0 ? (
            <div className="space-y-3">
              {compras.map(compra => (
                <div 
                  key={compra.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium flex items-center">
                        <ShoppingBag className="h-4 w-4 text-brand-green mr-2" />
                        Compra
                      </div>
                      <div className="text-gray-500 text-sm ml-6">
                        {new Date(compra.data).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-medium text-brand-green">
                        {formatCurrency(compra.valor)}
                      </div>
                      <div className="text-sm text-brand-green">
                        +{compra.pontos} pontos
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              Nenhuma compra registrada
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClienteDetalhes;
