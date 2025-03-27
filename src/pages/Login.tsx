import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import InputMask from '../components/InputMask';
import { AlertCircle } from 'lucide-react';
import api from '../services/api';

const Login: React.FC = () => {
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState<string>('Verificando conexão...');
  const navigate = useNavigate();

  useEffect(() => {
    const checkApiConnection = async () => {
      try {
        await api.get('/health');
        setApiStatus('Conectado à API');
        toast.success('API conectada com sucesso!');
      } catch (error) {
        console.error('Erro ao conectar com a API:', error);
        setApiStatus('Erro na conexão com a API');
        toast.error('Não foi possível conectar à API. Verifique se o servidor está rodando.');
      }
    };

    checkApiConnection();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      
      if (cpf.length > 10) {
        toast.success('Login realizado com sucesso!');
        navigate('/dashboard');
      } else {
        toast.error('CPF ou senha inválidos');
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-8 animate-fade-in">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="logo-text mb-2">
            <span>Sistema </span>
            <span>de Fidelidade</span>
          </h1>
          <p className="text-gray-600">Acesse sua conta para gerenciar pontos</p>
          
          <div className={`mt-2 text-sm ${apiStatus.includes('Erro') ? 'text-red-500' : 'text-green-600'}`}>
            {apiStatus}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">
          <h2 className="text-xl font-semibold flex items-center justify-center gap-2 mb-6">
            <span className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </span>
            Acesso do Cliente
          </h2>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="cpf" className="form-label">CPF</label>
              <InputMask
                type="cpf"
                value={cpf}
                onChange={setCpf}
                placeholder="000.000.000-00"
                required
              />
            </div>

            <div>
              <label htmlFor="senha" className="form-label">Senha</label>
              <InputMask
                type="password"
                value={senha}
                onChange={setSenha}
                placeholder="Digite sua senha"
                required
              />
            </div>

            <button 
              type="submit" 
              className="green-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processando...
                </span>
              ) : 'Continuar'}
            </button>
          </form>
        </div>

        <div className="bg-brand-softgreen rounded-xl border border-green-200 p-4 mb-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-brand-green mt-0.5" />
            <p className="text-sm text-gray-700">
              Primeiro acesso? Clique no botão abaixo para cadastrar sua senha.
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link to="/primeiro-acesso" className="text-brand-green hover:underline font-medium">
            Primeiro acesso? Crie sua senha
          </Link>
        </div>

        <div className="text-center mt-4">
          <Link to="/recuperar-senha" className="text-brand-green hover:underline font-medium">
            Esqueci minha senha
          </Link>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-6">
          <div className="text-center">
            <Link to="/admin/login" className="text-gray-500 hover:text-gray-700 text-sm">
              Área administrativa
            </Link>
          </div>
          <div className="text-center mt-2 text-xs text-gray-500">
            Sistema de Fidelidade por Pontos • Versão 1.0
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
