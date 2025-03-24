
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Header from '../../components/Header';
import InputMask from '../../components/InputMask';
import { ArrowLeft, FileText } from 'lucide-react';
import { isValidCPF, isValidEmail } from '../../utils/formatters';

const NovoCliente: React.FC = () => {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!isValidCPF(cpf)) {
      toast.error('CPF inválido');
      return;
    }
    
    if (!isValidEmail(email)) {
      toast.error('E-mail inválido');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call to create a new client
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Cliente cadastrado com sucesso!');
      navigate('/admin/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 animate-fade-in">
      <Header />
      
      <div className="container max-w-xl px-4 pb-8">
        <h1 className="page-title">Cadastrar Novo Cliente</h1>
        
        <div className="mb-4">
          <Link to="/admin/dashboard" className="inline-flex items-center text-gray-600 hover:text-gray-800">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Voltar
          </Link>
        </div>
        
        <div className="card-container">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FileText className="mr-2 h-5 w-5 text-brand-green" />
            Formulário de Cadastro
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="nome" className="form-label">
                Nome Completo <span className="text-red-500">*</span>
              </label>
              <InputMask
                type="text"
                value={nome}
                onChange={setNome}
                placeholder="Nome do cliente"
                required
              />
            </div>
            
            <div>
              <label htmlFor="cpf" className="form-label">
                CPF <span className="text-red-500">*</span>
              </label>
              <InputMask
                type="cpf"
                value={cpf}
                onChange={setCpf}
                placeholder="000.000.000-00"
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="form-label">
                E-mail
              </label>
              <InputMask
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="email@exemplo.com"
              />
            </div>
            
            <div>
              <label htmlFor="telefone" className="form-label">
                Telefone <span className="text-red-500">*</span>
              </label>
              <InputMask
                type="phone"
                value={telefone}
                onChange={setTelefone}
                placeholder="(00) 00000-0000"
                required
              />
            </div>
            
            <div className="pt-2">
              <p className="text-gray-600 text-sm mb-6">
                O cliente criará sua própria senha no primeiro acesso ao sistema.
              </p>
              
              <button 
                type="submit" 
                disabled={isLoading}
                className="green-button flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processando...
                  </span>
                ) : (
                  <>
                    <FileText className="h-5 w-5" />
                    Cadastrar Cliente
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NovoCliente;
