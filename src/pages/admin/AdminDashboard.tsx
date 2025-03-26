
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import { Search, UserPlus } from 'lucide-react';
import InputMask from '../../components/InputMask';

const AdminDashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [clientes, setClientes] = useState([]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // No futuro, aqui será integrada a chamada para a API
    console.log('Searching for:', searchQuery);
    // A busca real será implementada quando a API estiver pronta
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
                placeholder="Digite o CPF do cliente"
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
          <h2 className="text-xl font-semibold mb-4">Clientes Recentes</h2>
          
          <div className="text-center py-4 text-gray-500">
            Nenhum cliente cadastrado
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
