
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import InputMask from '../../components/InputMask';
import { Shield } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      // Simple validation for demo
      if (usuario.length > 3 && senha.length > 3) {
        toast.success('Login administrativo realizado com sucesso');
        navigate('/admin/dashboard');
      } else {
        toast.error('Usuário ou senha inválidos');
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
          <p className="text-gray-600">Acesse o painel de controle</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <Shield className="h-8 w-8 text-brand-green" />
            </div>
            <h2 className="text-2xl font-semibold">Área Administrativa</h2>
            <p className="text-gray-600 text-sm mt-1">Acesse o painel de controle</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="usuario" className="form-label">Nome de Usuário</label>
              <InputMask
                type="text"
                value={usuario}
                onChange={setUsuario}
                placeholder="Digite seu nome de usuário"
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
              {isLoading ? 'Processando...' : 'Acessar Painel'}
            </button>
          </form>
        </div>

        <div className="text-center">
          <Link to="/" className="text-gray-600 hover:text-gray-800">
            Área de Clientes
          </Link>
        </div>

        <div className="mt-8 text-center text-xs text-gray-500">
          Sistema de Fidelidade por Pontos • Versão 1.0
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
