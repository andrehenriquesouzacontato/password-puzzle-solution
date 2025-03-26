
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Header from '../../components/Header';
import { ArrowLeft, Award, Trash2, Edit2, ShoppingBag, Gift } from 'lucide-react';
import InputMask from '../../components/InputMask';
import { formatCurrency } from '../../utils/formatters';

const ClienteDetalhes: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cliente, setCliente] = useState({
    id: '',
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
    pontos: 0,
    dataCadastro: new Date().toISOString().split('T')[0]
  });
  const [compras, setCompras] = useState([]);
  const [valor, setValor] = useState('');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  
  useEffect(() => {
    // In a real app, this would be an API call to fetch client details
    console.log('Fetching details for client ID:', id);
    // API call will be implemented when ready
  }, [id]);
  
  const handleRegistrarCompra = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!valor) {
      toast.error('Informe o valor da compra');
      return;
    }
    
    // Convert to number and calculate points (1 real = 1 point)
    const valorNumerico = parseFloat(valor.replace(',', '.'));
    const pontosGanhos = Math.floor(valorNumerico);
    
    // In a real app, this would be an API call
    toast.success(`Compra de ${formatCurrency(valorNumerico)} registrada com sucesso!`);
    
    // Update client points
    setCliente(prev => ({
      ...prev,
      pontos: prev.pontos + pontosGanhos
    }));
    
    // Add new purchase to history
    const novaCompra = {
      id: Date.now().toString(),
      valor: valorNumerico,
      pontos: pontosGanhos,
      data: new Date().toISOString().split('T')[0]
    };
    
    setCompras(prev => [novaCompra, ...prev]);
    setValor('');
  };
  
  const handleResgatarPontos = () => {
    // In a real app, this would navigate to a redemption page
    toast.info('Funcionalidade de resgate em desenvolvimento');
  };
  
  const handleDeleteClient = () => {
    // In a real app, this would be an API call to delete the client
    toast.success('Cliente excluído com sucesso');
    navigate('/admin/dashboard');
  };
  
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
          <h2 className="text-2xl font-bold mb-1">{cliente.nome || 'Cliente não encontrado'}</h2>
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
        
        {/* Informações do Cliente */}
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
              <div className="font-medium">{cliente.cpf || 'Não informado'}</div>
            </div>
            
            <div>
              <div className="text-gray-500">E-mail</div>
              <div className="font-medium">{cliente.email || 'Não informado'}</div>
            </div>
            
            <div>
              <div className="text-gray-500">Telefone</div>
              <div className="font-medium">{cliente.telefone || 'Não informado'}</div>
            </div>
          </div>
        </div>
        
        {/* Registrar Nova Compra */}
        <div className="card-container">
          <h2 className="text-xl font-semibold mb-4">Registrar Nova Compra</h2>
          <p className="text-gray-600 text-sm mb-4">1 real = 1 ponto</p>
          
          <form onSubmit={handleRegistrarCompra} className="flex gap-2 items-start">
            <div className="flex-1">
              <div className="relative">
                <InputMask
                  type="currency"
                  value={valor}
                  onChange={setValor}
                  placeholder="0,00"
                  className="pl-8"
                />
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                  R$
                </span>
              </div>
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
        
        {/* Gerenciar Pontos */}
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
        
        {/* Histórico */}
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
              Nenhuma atividade registrada
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClienteDetalhes;
