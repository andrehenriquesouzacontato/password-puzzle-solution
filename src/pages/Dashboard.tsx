
import React, { useState, useEffect } from 'react';
import { formatCurrency } from '../utils/formatters';
import Header from '../components/Header';
import { Calendar, Edit2 } from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock data
const mockCliente = {
  id: '1',
  nome: 'Andre Henrique de Souza Guedes',
  cpf: '309.628.608-67',
  email: 'andreguedessguita@gmail.com',
  telefone: '(11) 99342-3308',
  pontos: 96,
  dataCadastro: '2025-03-24'
};

const mockCompras = [
  { id: '1', valor: 29.90, pontos: 29, data: '2025-03-17' },
  { id: '2', valor: 67.87, pontos: 67, data: '2025-03-17' }
];

const Dashboard: React.FC = () => {
  const [cliente, setCliente] = useState(mockCliente);
  const [compras, setCompras] = useState(mockCompras);
  
  return (
    <div className="min-h-screen bg-gray-50 animate-fade-in">
      <Header />
      
      <div className="container max-w-xl px-4 pb-8">
        <h1 className="page-title">Olá, {cliente.nome.split(' ')[0]}</h1>
        
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
              <div className="font-medium">{cliente.nome}</div>
            </div>
            
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
        
        {/* Histórico de Atividades */}
        <div className="card-container">
          <h2 className="text-xl font-semibold mb-4">Histórico de Atividades</h2>
          
          {compras.length > 0 ? (
            <div className="space-y-4">
              {compras.map((compra) => (
                <div key={compra.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium">Compra</div>
                        <div className="flex items-center text-gray-500 text-sm">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(compra.data).toLocaleDateString('pt-BR')}
                        </div>
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

export default Dashboard;
