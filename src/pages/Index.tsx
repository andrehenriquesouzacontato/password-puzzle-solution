
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import api from '../services/api';

const Index = () => {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    console.log('Verificando conexão com a API...');
    
    const checkApiConnection = async () => {
      try {
        await api.get('/health');
        console.log('API conectada com sucesso!');
        toast.success('API conectada com sucesso!');
      } catch (error) {
        console.error('Erro ao conectar com a API:', error);
        toast.error('Não foi possível conectar à API. Verifique se o servidor está rodando na porta 7070.');
      } finally {
        setChecking(false);
        console.log('Redirecionando para página de login...');
        navigate('/login');
      }
    };

    checkApiConnection();
  }, [navigate]);

  if (checking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="text-center mb-8">
          <h1 className="logo-text mb-2">
            <span>Sistema </span>
            <span>de Fidelidade</span>
          </h1>
          <p className="text-gray-600">Verificando conexão com a API...</p>
          <div className="mt-4">
            <div className="animate-spin h-8 w-8 border-4 border-brand-green border-t-transparent rounded-full mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Index;
