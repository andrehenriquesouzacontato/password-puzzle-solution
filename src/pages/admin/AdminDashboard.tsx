
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import { Search, UserPlus, Award } from 'lucide-react';
import InputMask from '../../components/InputMask';
import { Cliente } from '../../models/types';
import { toast } from 'sonner';

const AdminDashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [filteredClientes, setFilteredClientes] = useState<Cliente[]>([]);
  
  // Load clients from localStorage on component mount
  useEffect(() => {
    const savedClientes = localStorage.getItem('clientes');
    if (savedClientes) {
      try {
        const parsedClientes = JSON.parse(savedClientes);
        setClientes(parsedClientes);
        setFilteredClientes(parsedClientes);
      } catch (error) {
        console.error('Error parsing clients from localStorage:', error);
        toast.error('Erro ao carregar clientes');
      }
    }
  }, []);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setFilteredClientes(clientes);
      return;
    }
    
    const searchQueryLower = searchQuery.toLowerCase().trim();
    const filteredResults = clientes.filter(cliente => 
      cliente.cpf.includes(searchQuery) || 
      cliente.nome.toLowerCase().includes(searchQueryLower)
    );
    
    setFilteredClientes(filteredResults);
    
    if (filteredResults.length === 0) {
      toast.info('Nenhum cliente encontrado');
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 animate-fade-in">
      <Header />
      
      <div className="container max-w-xl px-4 pb-8">
        <h1 className="page-title">Painel do Administrador</h1>
        
        {/* Buscar Cliente */}
        <div className="card-container">
          <h2 className="text-xl font-semibold mb-4">Buscar Cliente</h2>
          
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1">
              <InputMask
                type="text"
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Digite o CPF ou nome do cliente"
                className="w-full"
              />
            </div>
            <button 
              type="submit"
              className="bg-brand-green text-white px-6 py-2 rounded-md hover:bg-brand-green/90 transition-all font-medium flex items-center"
            >
              <Search className="h-5 w-5 mr-2" />
              Buscar
            </button>
          </form>
        </div>
        
        {/* Ações Rápidas */}
        <div className="card-container">
          <h2 className="text-xl font-semibold mb-4">Ações Rápidas</h2>
          
          <Link 
            to="/admin/novo-cliente"
            className="green-button flex items-center justify-center gap-2"
          >
            <UserPlus className="h-5 w-5" />
            Cadastrar Novo Cliente
          </Link>
        </div>
        
        {/* Clientes Recentes */}
        <div className="card-container">
          <h2 className="text-xl font-semibold mb-4">Clientes Cadastrados</h2>
          
          {filteredClientes.length > 0 ? (
            <div className="space-y-3">
              {filteredClientes.map(cliente => (
                <Link 
                  key={cliente.id}
                  to={`/admin/cliente/${cliente.id}`}
                  className="block border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{cliente.nome}</div>
                      <div className="text-gray-500 text-sm">CPF: {cliente.cpf}</div>
                    </div>
                    <div className="bg-green-100 px-4 py-2 rounded-full flex items-center gap-1">
                      <Award className="h-4 w-4 text-brand-green" />
                      <span className="font-medium text-brand-green">{cliente.pontos} pontos</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Nenhum cliente encontrado. Utilize o botão "Cadastrar Novo Cliente" para adicionar clientes.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
