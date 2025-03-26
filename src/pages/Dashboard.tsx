
import React, { useState } from 'react';
import { formatCurrency } from '../utils/formatters';
import Header from '../components/Header';
import { Calendar, Edit2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
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
  
  return (
    <div className="min-h-screen bg-gray-50 animate-fade-in">
      <Header />
      
      <div className="container max-w-xl px-4 pb-8">
        <h1 className="page-title">Olá, {cliente.nome ? cliente.nome.split(' ')[0] : 'Cliente'}</h1>
        
        {/* Pontos de Fidelidade */}
        <div className="card-container">
          <h2 className="text-xl font-semibold mb-4">Seus Pontos de Fidelidade</h2>
          
          <div className="flex flex-col items-center">
            <div className="text-brand-pink mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="7"></circle>
                <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
              </svg>
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
            <h2 className="text-xl font-semibold">Suas Informações</h2>
            <Link to="/editar-perfil" className="text-brand-green hover:underline flex items-center">
              <Edit2 className="h-4 w-4 mr-1" />
              Editar
            </Link>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="text-gray-500">Nome</div>
              <div className="font-medium">{cliente.nome || "Não informado"}</div>
            </div>
            
            <div>
              <div className="text-gray-500">CPF</div>
              <div className="font-medium">{cliente.cpf || "Não informado"}</div>
            </div>
            
            <div>
              <div className="text-gray-500">E-mail</div>
              <div className="font-medium">{cliente.email || "Não informado"}</div>
            </div>
            
            <div>
              <div className="text-gray-500">Telefone</div>
              <div className="font-medium">{cliente.telefone || "Não informado"}</div>
            </div>
          </div>
        </div>
        
        {/* Histórico de Atividades */}
        <div className="card-container">
          <h2 className="text-xl font-semibold mb-4">Histórico de Atividades</h2>
          
          <div className="text-center py-4 text-gray-500">
            Nenhuma atividade registrada
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
